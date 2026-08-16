import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'

const UserAuth = ({ children }) => {

    const { user, setUser } = useContext(UserContext)
    const [ loading, setLoading ] = useState(true)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }

        if (user) {
            setLoading(false)
            return
        }

        // Token exists but user context lost (e.g. page refresh) — re-validate
        axios.get('/users/profile')
            .then((res) => {
                setUser(res.data.user)
                setLoading(false)
            })
            .catch(() => {
                localStorage.removeItem('token')
                navigate('/login')
            })

    }, [])

    if (loading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'></div>
                    <p className='text-slate-400 mt-4'>Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default UserAuth