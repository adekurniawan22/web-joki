import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import config from '../../../config'
import { ToastContainer, toast } from 'react-toastify'

const Logout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const logout = async () => {
            try {
                // Get token from localStorage
                const token = localStorage.getItem('token')

                // Make the API call to logout
                await axios.post(
                    `${config.apiUrl}/logout`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    },
                )

                // Clear localStorage items
                localStorage.removeItem('user_id')
                localStorage.removeItem('token')
                localStorage.removeItem('role')
                localStorage.removeItem('expires_at')
                localStorage.removeItem('dashboardToastShown')

                // Redirect to login page
                toast.success('Berhasil Logout!')
                navigate('/login')
            } catch (error) {
                console.error('Error during logout:', error)
                navigate('/login') // Redirect even if logout fails
            }
        }

        logout()
    }, [navigate])

    return null // No UI needed, just redirect
}

export default Logout
