import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const { user } = useContext(UserContext)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ projectName, setProjectName ] = useState('')
    const [ project, setProject ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState('')

    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        setError('')

        if (!projectName.trim()) {
            setError('Project name cannot be empty')
            return
        }

        axios.post('/projects/create', {
            name: projectName,
        })
            .then((res) => {
                setIsModalOpen(false)
                setProject(prev => [ ...prev, res.data ])
                setProjectName('')
            })
            .catch((error) => {
                setError(error.response?.data || 'Failed to create project')
            })
    }

    function handleLogout() {
        axios.get('/users/logout')
            .then(() => {
                localStorage.removeItem('token')
                navigate('/login')
            })
            .catch((err) => {
                console.error(err)
            })
    }

    useEffect(() => {
        axios.get('/projects/all')
            .then((res) => {
                setProject(res.data.projects)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
            {/* Header */}
            <header className='bg-slate-800 border-b border-slate-700 shadow-lg'>
                <div className='container mx-auto px-6 py-5 flex justify-between items-center'>
                    <div>
                        <h1 className='text-2xl font-bold text-white flex items-center gap-3'>
                            <i className="ri-code-box-line text-3xl text-blue-500"></i>
                            AI Code Platform
                        </h1>
                        <p className='text-slate-400 text-sm mt-1'>Welcome, {user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className='px-5 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center gap-2 font-medium hover:shadow-lg hover:shadow-red-500/30'
                    >
                        <i className="ri-logout-box-line text-lg"></i>
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className='container mx-auto px-6 py-8'>
                <div className='mb-8'>
                    <h2 className='text-3xl font-bold text-white mb-2'>Your Projects</h2>
                    <p className='text-slate-400'>Create and manage your AI-powered development projects</p>
                </div>

                {loading ? (
                    <div className='flex items-center justify-center py-20'>
                        <div className='text-center'>
                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'></div>
                            <p className='text-slate-400 mt-4'>Loading projects...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {/* New Project Card */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group relative p-8 bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl hover:border-blue-500 hover:bg-slate-750 transition-all duration-200 flex flex-col items-center justify-center min-h-50">
                            <div className='w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition'>
                                <i className="ri-add-line text-4xl text-blue-500"></i>
                            </div>
                            <h3 className='text-xl font-semibold text-white mb-2'>New Project</h3>
                            <p className='text-slate-400 text-sm'>Create a new project</p>
                        </button>

                        {/* Project Cards */}
                        {project.map((proj) => (
                            <div
                                key={proj._id}
                                onClick={() => {
                                    navigate(`/project`, {
                                        state: { project: proj }
                                    })
                                }}
                                className="group cursor-pointer p-8 bg-slate-800 border border-slate-700 rounded-xl hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200 flex flex-col min-h-50">
                                <div className='flex items-start justify-between mb-5'>
                                    <div className='w-14 h-14 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition'>
                                        <i className="ri-folder-line text-3xl text-blue-500"></i>
                                    </div>
                                    <i className="ri-arrow-right-line text-2xl text-slate-600 group-hover:text-blue-500 transition"></i>
                                </div>
                                
                                <h3 className='text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition'>
                                    {proj.name}
                                </h3>
                                
                                <div className='mt-auto flex items-center gap-2 text-slate-400'>
                                    <i className="ri-team-line text-lg"></i>
                                    <span className='text-sm'>
                                        {proj.users?.length || 0} {proj.users?.length === 1 ? 'collaborator' : 'collaborators'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && project.length === 0 && (
                    <div className='text-center py-20'>
                        <div className='w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-5'>
                            <i className="ri-folder-open-line text-5xl text-slate-600"></i>
                        </div>
                        <h3 className='text-2xl font-semibold text-white mb-3'>No projects yet</h3>
                        <p className='text-slate-400 mb-8 text-base'>Create your first project to get started</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium hover:shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 mx-auto'>
                            <i className="ri-add-line text-xl"></i>
                            Create Project
                        </button>
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
                        <div className='flex justify-between items-center mb-6'>
                            <h2 className="text-2xl font-bold text-white">Create New Project</h2>
                            <button 
                                onClick={() => {
                                    setIsModalOpen(false)
                                    setError('')
                                    setProjectName('')
                                }}
                                className='w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition'>
                                <i className="ri-close-line text-2xl text-white"></i>
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm flex items-center gap-2">
                                <i className="ri-error-warning-line text-lg"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={createProject}>
                            <div className="mb-6">
                                <label className="block text-slate-300 mb-2 font-medium text-base">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName}
                                    type="text"
                                    className="w-full p-3 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Enter project name"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    className="flex-1 px-5 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition font-medium text-base"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setError('')
                                        setProjectName('')
                                    }}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-base hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2">
                                    <i className="ri-add-line text-xl"></i>
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home