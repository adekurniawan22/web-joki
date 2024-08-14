import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import config from '../../../config'

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
                localStorage.removeItem('token')
                localStorage.removeItem('role')
                localStorage.removeItem('expires_at')

                // Redirect to login page
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
