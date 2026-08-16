import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js'
import { getWebContainer } from '../config/webContainer'

function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}

const Project = () => {
    const location = useLocation()
    const [ isSidePanelOpen, setIsSidePanelOpen ] = useState(false)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ selectedUserId, setSelectedUserId ] = useState(new Set())
    const [ project, setProject ] = useState(location.state.project)
    const [ message, setMessage ] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = useRef(null)

    const [ users, setUsers ] = useState([])
    const [ messages, setMessages ] = useState([])
    const [ fileTree, setFileTree ] = useState({})

    const [ currentFile, setCurrentFile ] = useState(null)
    const [ openFiles, setOpenFiles ] = useState([])

    const [ webContainer, setWebContainer ] = useState(null)
    const [ iframeUrl, setIframeUrl ] = useState(null)
    const [ runProcess, setRunProcess ] = useState(null)
    const [ isRunning, setIsRunning ] = useState(false)
    
    // WebContainer logs
    const [ terminalOutput, setTerminalOutput ] = useState([])
    const terminalRef = useRef(null)

    const navigate = useNavigate()

    const addTerminalLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString()
        setTerminalOutput(prev => [...prev, { timestamp, message, type }])
        console.log(`[${type.toUpperCase()}] ${message}`)
    }

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
    }, [terminalOutput])

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId)
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id)
            } else {
                newSelectedUserId.add(id)
            }
            return newSelectedUserId
        })
    }

    function addCollaborators() {
        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            setIsModalOpen(false)
            setSelectedUserId(new Set())
            // Refresh project data
            axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {
                setProject(res.data.project)
            })
        }).catch(err => {
            console.error(err)
            addTerminalLog('Failed to add collaborators', 'error')
        })
    }

    const send = () => {
        if (!message.trim()) return

        sendMessage('project-message', {
            message,
            sender: user
        })
        setMessages(prevMessages => [ ...prevMessages, { sender: user, message } ])
        setMessage("")
        
        setTimeout(scrollToBottom, 100)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            send()
        }
    }

    function WriteAiMessage(message) {
        try {
            const messageObject = JSON.parse(message)
            return (
                <div className='overflow-auto bg-slate-950 text-white rounded-lg p-3'>
                    <Markdown
                        children={messageObject.text}
                        options={{
                            overrides: {
                                code: SyntaxHighlightedCode,
                            },
                        }}
                    />
                </div>
            )
        } catch (e) {
            return <p className='text-sm'>{message}</p>
        }
    }

    useEffect(() => {
        // Initialize Socket.IO for collaboration (connects to backend on port 8080)
        addTerminalLog('[Socket.IO] Connecting to collaboration server...', 'info')
        initializeSocket(project._id)

        // Initialize WebContainer for running user projects
        if (!webContainer) {
            addTerminalLog('[WebContainer] Booting...', 'info')
            getWebContainer().then(container => {
                setWebContainer(container)
                addTerminalLog('[WebContainer] Booted successfully', 'success')
                
                // Set up server-ready listener
                container.on('server-ready', (port, url) => {
                    addTerminalLog(`[WebContainer] Server ready on port ${port}`, 'success')
                    addTerminalLog(`[WebContainer] Preview URL: ${url}`, 'info')
                    setIframeUrl(url)
                })
            }).catch(err => {
                addTerminalLog(`[WebContainer] Failed to boot: ${err.message}`, 'error')
            })
        }

        receiveMessage('project-message', data => {
            addTerminalLog(`[Message] Received from ${data.sender.email || data.sender._id}`, 'info')
            
            if (data.sender._id == 'ai') {
                try {
                    const aiMessage = JSON.parse(data.message)
                    addTerminalLog('[AI] Processing AI response...', 'info')
                    
                    if (aiMessage.fileTree && Object.keys(aiMessage.fileTree).length > 0) {
                        addTerminalLog(`[AI] Received ${Object.keys(aiMessage.fileTree).length} files from AI`, 'success')
                        
                        if (webContainer) {
                            addTerminalLog('[AI] Mounting files to WebContainer...', 'info')
                            
                            // Mount files to WebContainer
                            webContainer.mount(aiMessage.fileTree).then(() => {
                                addTerminalLog(`[AI] ✓ Mounted ${Object.keys(aiMessage.fileTree).length} files to WebContainer`, 'success')
                                
                                // Update file tree state
                                setFileTree(aiMessage.fileTree)
                                
                                // Log each file created
                                Object.keys(aiMessage.fileTree).forEach(filename => {
                                    addTerminalLog(`[AI] ✓ Created: ${filename}`, 'success')
                                })
                                
                                // Auto-open the first meaningful file (not package.json)
                                const fileNames = Object.keys(aiMessage.fileTree)
                                const mainFile = fileNames.find(f => f.includes('server') || f.includes('app') || f.includes('index')) || fileNames[0]
                                
                                if (mainFile && !openFiles.includes(mainFile)) {
                                    setCurrentFile(mainFile)
                                    setOpenFiles([mainFile])
                                    addTerminalLog(`[IDE] Opened ${mainFile}`, 'info')
                                }
                                
                                // Save to database
                                saveFileTree(aiMessage.fileTree)
                            }).catch(err => {
                                addTerminalLog(`[AI] ✗ Failed to mount files: ${err.message}`, 'error')
                            })
                        } else {
                            addTerminalLog('[AI] ✗ WebContainer not ready yet', 'warning')
                            // Still update the UI
                            setFileTree(aiMessage.fileTree)
                        }
                    }
                } catch (e) {
                    addTerminalLog(`[AI] ✗ Error parsing AI response: ${e.message}`, 'error')
                }
                setMessages(prevMessages => [ ...prevMessages, data ])
            } else {
                setMessages(prevMessages => [ ...prevMessages, data ])
            }
            setTimeout(scrollToBottom, 100)
        })

        // Load existing project data
        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {
            setProject(res.data.project)
            const savedFileTree = res.data.project.fileTree || {}
            
            if (Object.keys(savedFileTree).length > 0) {
                addTerminalLog(`[IDE] Loaded ${Object.keys(savedFileTree).length} files from project`, 'info')
                setFileTree(savedFileTree)
                
                // If WebContainer is ready, mount the saved files
                if (webContainer) {
                    webContainer.mount(savedFileTree).then(() => {
                        addTerminalLog('[IDE] Restored files to WebContainer', 'success')
                    })
                }
            }
        })

        axios.get('/users/all').then(res => {
            setUsers(res.data.users)
        }).catch(err => {
            console.error(err)
        })
    }, [])

    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).then(res => {
            addTerminalLog('[IDE] File tree saved to database', 'success')
        }).catch(err => {
            addTerminalLog('[IDE] Failed to save file tree', 'error')
        })
    }

    function scrollToBottom() {
        if (messageBox.current) {
            messageBox.current.scrollTop = messageBox.current.scrollHeight
        }
    }

    function closeFile(file) {
        setOpenFiles(prev => prev.filter(f => f !== file))
        if (currentFile === file) {
            const remainingFiles = openFiles.filter(f => f !== file)
            setCurrentFile(remainingFiles[remainingFiles.length - 1] || null)
        }
    }

    async function runProject() {
        if (!webContainer || Object.keys(fileTree).length === 0) {
            addTerminalLog('[Run] No files to run', 'error')
            return
        }
        
        setIsRunning(true)
        addTerminalLog('[Run] Starting project execution...', 'info')
        
        try {
            // Mount the file tree
            addTerminalLog('[Run] Mounting file tree to WebContainer...', 'info')
            await webContainer.mount(fileTree)
            addTerminalLog('[Run] File tree mounted', 'success')

            // Check if package.json exists
            if (fileTree['package.json']) {
                addTerminalLog('[Run] Found package.json, installing dependencies...', 'info')
                
                const installProcess = await webContainer.spawn('npm', ['install'])
                
                // Stream install output
                installProcess.output.pipeTo(new WritableStream({
                    write(chunk) {
                        addTerminalLog(chunk, 'info')
                    }
                }))

                const installExitCode = await installProcess.exit
                
                if (installExitCode !== 0) {
                    addTerminalLog(`[Run] npm install failed with exit code ${installExitCode}`, 'error')
                    setIsRunning(false)
                    return
                }
                
                addTerminalLog('[Run] Dependencies installed successfully', 'success')
            }

            // Kill previous process if exists
            if (runProcess) {
                addTerminalLog('[Run] Stopping previous process...', 'info')
                runProcess.kill()
            }

            // Determine start command
            let startCommand = ['npm', 'start']
            
            if (fileTree['package.json']) {
                try {
                    const pkgJson = JSON.parse(fileTree['package.json'].file.contents)
                    if (pkgJson.scripts && pkgJson.scripts.start) {
                        addTerminalLog(`[Run] Using start script: ${pkgJson.scripts.start}`, 'info')
                    }
                } catch (e) {
                    addTerminalLog('[Run] Could not parse package.json', 'warning')
                }
            }

            addTerminalLog('[Run] Starting server process...', 'info')
            const tempRunProcess = await webContainer.spawn(startCommand[0], startCommand.slice(1))

            // Stream server output
            tempRunProcess.output.pipeTo(new WritableStream({
                write(chunk) {
                    addTerminalLog(chunk, 'info')
                }
            }))

            setRunProcess(tempRunProcess)
            addTerminalLog('[Run] Server process started', 'success')
            addTerminalLog('[Run] Waiting for server to be ready...', 'info')

        } catch (error) {
            addTerminalLog(`[Run] Error: ${error.message}`, 'error')
        } finally {
            setIsRunning(false)
        }
    }

    return (
        <main className='h-screen w-screen flex bg-slate-900 overflow-hidden'>
            {/* Left Panel - Chat */}
            <section className="left relative flex flex-col h-screen w-96 bg-slate-800 border-r border-slate-700">
                <header className='flex justify-between items-center p-4 px-5 bg-slate-900 border-b border-slate-700'>
                    <div className='flex items-center gap-3'>
                        <button 
                            onClick={() => navigate('/')}
                            className='w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition'>
                            <i className="ri-arrow-left-line text-xl text-white"></i>
                        </button>
                        <div>
                            <h2 className='font-semibold text-white text-lg'>{project.name}</h2>
                            <p className='text-xs text-slate-400'>AI Coding IDE</p>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className='w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center transition-all duration-200'
                            title='Add collaborator'>
                            <i className="ri-user-add-line text-xl text-white"></i>
                        </button>
                        <button 
                            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} 
                            className='w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center transition-all duration-200'
                            title='View collaborators'>
                            <i className="ri-group-line text-xl text-white"></i>
                        </button>
                    </div>
                </header>

                <div className="conversation-area flex-grow flex flex-col relative overflow-hidden">
                    <div
                        ref={messageBox}
                        className="message-box p-3 flex-grow flex flex-col gap-3 overflow-y-auto">
                        {messages.length === 0 && (
                            <div className='flex items-center justify-center h-full text-center px-4'>
                                <div>
                                    <div className='w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3'>
                                        <i className="ri-chat-3-line text-2xl text-slate-400"></i>
                                    </div>
                                    <p className='text-slate-400 text-sm'>Ask AI to create a project</p>
                                    <p className='text-slate-500 text-xs mt-2'>Example: "@ai create a basic express server"</p>
                                </div>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`flex ${msg.sender._id == user._id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`${msg.sender._id === 'ai' ? 'max-w-[95%]' : 'max-w-[80%]'} message flex flex-col p-3 rounded-xl ${
                                    msg.sender._id == user._id 
                                        ? 'bg-blue-600 text-white' 
                                        : msg.sender._id === 'ai'
                                        ? 'bg-slate-700 text-white'
                                        : 'bg-slate-700 text-white'
                                }`}>
                                    {msg.sender._id !== user._id && (
                                        <small className='opacity-75 text-xs mb-1 font-medium'>
                                            {msg.sender._id === 'ai' ? '🤖 AI Assistant' : msg.sender.email}
                                        </small>
                                    )}
                                    <div className='text-sm'>
                                        {msg.sender._id === 'ai' ?
                                            WriteAiMessage(msg.message)
                                            : <p className='whitespace-pre-wrap break-words'>{msg.message}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="inputField border-t border-slate-700 p-4 bg-slate-900">
                        <div className='flex gap-3'>
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className='flex-grow p-3 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500'
                                type="text"
                                placeholder='Type @ai to ask AI...'
                            />
                            <button
                                onClick={send}
                                disabled={!message.trim()}
                                className='px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/30'>
                                <i className="ri-send-plane-fill text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Collaborators Side Panel */}
                <div className={`sidePanel w-full h-full flex flex-col bg-slate-800 absolute transition-all duration-300 ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0 z-10 border-r border-slate-700`}>
                    <header className='flex justify-between items-center px-5 p-4 bg-slate-900 border-b border-slate-700'>
                        <h1 className='font-semibold text-lg text-white'>Collaborators</h1>
                        <button 
                            onClick={() => setIsSidePanelOpen(false)} 
                            className='w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition'>
                            <i className="ri-close-line text-xl text-white"></i>
                        </button>
                    </header>
                    <div className="users flex flex-col gap-3 p-4 overflow-y-auto">
                        {project.users && project.users.map((user, idx) => (
                            <div key={idx} className="user cursor-pointer hover:bg-slate-700 p-4 flex gap-3 items-center rounded-lg transition">
                                <div className='w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold'>
                                    <span>{user.email?.[0]?.toUpperCase()}</span>
                                </div>
                                <h1 className='font-medium text-white text-base'>{user.email}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Right Panel - IDE */}
            <section className="right flex-grow h-full flex flex-col bg-slate-900">
                <div className="flex flex-grow overflow-hidden">
                    {/* File Explorer */}
                    <div className="explorer h-full w-64 bg-slate-800 border-r border-slate-700 overflow-y-auto">
                        <div className='p-4 border-b border-slate-700'>
                            <h3 className='font-semibold text-white flex items-center gap-2 text-base'>
                                <i className="ri-folder-line text-xl"></i>
                                Files
                            </h3>
                        </div>
                        <div className="file-tree">
                            {Object.keys(fileTree).length === 0 ? (
                                <div className='p-6 text-center'>
                                    <div className='w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3'>
                                        <i className="ri-file-code-line text-3xl text-slate-400"></i>
                                    </div>
                                    <p className='text-slate-400 text-sm leading-relaxed'>No files yet</p>
                                    <p className='text-slate-500 text-xs mt-2'>Ask @ai to create a project</p>
                                </div>
                            ) : (
                                Object.keys(fileTree).map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setCurrentFile(file)
                                            setOpenFiles([ ...new Set([ ...openFiles, file ]) ])
                                            addTerminalLog(`[IDE] Opened ${file}`, 'info')
                                        }}
                                        className={`tree-element cursor-pointer p-4 px-4 flex items-center gap-3 w-full hover:bg-slate-700 transition ${
                                            currentFile === file ? 'bg-slate-700 text-blue-400' : 'text-slate-300'
                                        }`}>
                                        <i className="ri-file-code-line text-lg"></i>
                                        <p className='text-sm truncate'>{file}</p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Code Editor Area */}
                    <div className="code-editor flex flex-col flex-grow h-full">
                        {/* Tabs and Actions */}
                        <div className="top flex justify-between items-center bg-slate-800 border-b border-slate-700">
                            <div className="files flex overflow-x-auto">
                                {openFiles.length === 0 ? (
                                    <div className='p-4 text-slate-400 text-sm'>No files open</div>
                                ) : (
                                    openFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className={`open-file flex items-center gap-3 p-3 px-5 border-r border-slate-700 ${
                                                currentFile === file ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-700'
                                            }`}>
                                            <button
                                                onClick={() => setCurrentFile(file)}
                                                className='text-sm truncate max-w-[150px] flex items-center gap-2'>
                                                <i className="ri-file-code-line text-base"></i>
                                                {file}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    closeFile(file)
                                                }}
                                                className='hover:text-red-400 transition w-5 h-5 flex items-center justify-center rounded hover:bg-slate-600'>
                                                <i className="ri-close-line text-base"></i>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="actions flex gap-3 p-3">
                                <button
                                    onClick={runProject}
                                    disabled={isRunning || Object.keys(fileTree).length === 0}
                                    className='px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium hover:shadow-lg hover:shadow-green-500/30'
                                    title='Run project'>
                                    <i className={`ri-play-fill text-lg ${isRunning ? 'animate-pulse' : ''}`}></i>
                                    {isRunning ? 'Running...' : 'Run'}
                                </button>
                            </div>
                        </div>

                        {/* Editor Content */}
                        <div className="bottom flex flex-grow overflow-hidden">
                            <div className="flex flex-col flex-grow">
                                {/* Code Editor */}
                                <div className="flex-grow overflow-hidden">
                                    {currentFile && fileTree[ currentFile ] ? (
                                        <div className="code-editor-area h-full overflow-auto bg-slate-900">
                                            <pre className="hljs h-full">
                                                <code
                                                    className="hljs h-full outline-none p-4 block"
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => {
                                                        const updatedContent = e.target.innerText
                                                        const ft = {
                                                            ...fileTree,
                                                            [ currentFile ]: {
                                                                file: {
                                                                    contents: updatedContent
                                                                }
                                                            }
                                                        }
                                                        setFileTree(ft)
                                                        saveFileTree(ft)
                                                        addTerminalLog(`[IDE] Saved ${currentFile}`, 'success')
                                                    }}
                                                    dangerouslySetInnerHTML={{ 
                                                        __html: hljs.highlight(
                                                            fileTree[ currentFile ].file.contents,
                                                            { language: 'javascript' }
                                                        ).value 
                                                    }}
                                                    style={{
                                                        whiteSpace: 'pre-wrap',
                                                        paddingBottom: '25rem',
                                                    }}
                                                />
                                            </pre>
                                        </div>
                                    ) : (
                                        <div className='flex items-center justify-center flex-grow text-center p-8 h-full'>
                                            <div>
                                                <div className='w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4'>
                                                    <i className="ri-code-line text-3xl text-slate-400"></i>
                                                </div>
                                                <p className='text-slate-400 text-base'>Select a file to start editing</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Terminal Output */}
                                <div className="terminal h-48 bg-black border-t border-slate-700 overflow-hidden flex flex-col">
                                    <div className="terminal-header p-2 px-4 bg-slate-900 border-b border-slate-700 flex items-center gap-2">
                                        <i className="ri-terminal-line text-green-400"></i>
                                        <span className="text-white text-sm font-medium">Terminal</span>
                                    </div>
                                    <div 
                                        ref={terminalRef}
                                        className="terminal-output flex-grow overflow-y-auto p-3 font-mono text-xs">
                                        {terminalOutput.length === 0 ? (
                                            <div className="text-slate-500">Waiting for activity...</div>
                                        ) : (
                                            terminalOutput.map((log, idx) => (
                                                <div key={idx} className={`mb-1 ${
                                                    log.type === 'error' ? 'text-red-400' :
                                                    log.type === 'success' ? 'text-green-400' :
                                                    log.type === 'warning' ? 'text-yellow-400' :
                                                    'text-slate-300'
                                                }`}>
                                                    <span className="text-slate-500">[{log.timestamp}]</span> {log.message}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Preview Panel */}
                            {iframeUrl && webContainer && (
                                <div className="flex flex-col w-1/2 h-full border-l border-slate-700">
                                    <div className="address-bar bg-slate-800 border-b border-slate-700 p-3 flex items-center gap-2">
                                        <i className="ri-global-line text-slate-400 text-lg"></i>
                                        <input
                                            type="text"
                                            value={iframeUrl}
                                            readOnly
                                            className="w-full p-2.5 bg-slate-700 text-white rounded-lg text-sm focus:outline-none"
                                        />
                                    </div>
                                    <iframe src={iframeUrl} className="w-full h-full bg-white"></iframe>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Add Collaborator Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-md border border-slate-700 max-h-[80vh] flex flex-col">
                        <header className='flex justify-between items-center mb-5'>
                            <h2 className='text-xl font-semibold text-white'>Add Collaborators</h2>
                            <button 
                                onClick={() => {
                                    setIsModalOpen(false)
                                    setSelectedUserId(new Set())
                                }} 
                                className='w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition'>
                                <i className="ri-close-line text-xl text-white"></i>
                            </button>
                        </header>
                        
                        <div className="users-list flex flex-col gap-2 mb-5 overflow-y-auto flex-grow">
                            {users.filter(u => !project.users.some(pu => pu._id === u._id)).length === 0 ? (
                                <div className='text-center py-12'>
                                    <div className='w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3'>
                                        <i className="ri-user-line text-2xl text-slate-400"></i>
                                    </div>
                                    <p className='text-slate-400'>No users available to add</p>
                                </div>
                            ) : (
                                users.filter(u => !project.users.some(pu => pu._id === u._id)).map(user => (
                                    <div 
                                        key={user._id} 
                                        className={`user cursor-pointer hover:bg-slate-700 p-4 flex gap-3 items-center rounded-lg transition ${
                                            Array.from(selectedUserId).includes(user._id) ? 'bg-slate-700 ring-2 ring-blue-500' : ''
                                        }`} 
                                        onClick={() => handleUserClick(user._id)}>
                                        <div className='w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold'>
                                            <span>{user.email?.[0]?.toUpperCase()}</span>
                                        </div>
                                        <h1 className='font-medium text-white flex-grow text-base'>{user.email}</h1>
                                        {Array.from(selectedUserId).includes(user._id) && (
                                            <i className="ri-checkbox-circle-fill text-blue-400 text-xl"></i>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <button
                            onClick={addCollaborators}
                            disabled={selectedUserId.size === 0}
                            className='w-full px-5 py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed text-base hover:shadow-lg hover:shadow-blue-500/30'>
                            Add {selectedUserId.size > 0 ? `(${selectedUserId.size})` : ''} Collaborator{selectedUserId.size !== 1 ? 's' : ''}
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Project