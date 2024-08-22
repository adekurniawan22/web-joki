import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import config from '../../src/config'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const checkToken = async () => {
            // Get token from localStorage
            const token = localStorage.getItem('token')
            const expiresAt = localStorage.getItem('expires_at')
            const currentTime = new Date().getTime() // Current time in milliseconds

            if (!token) {
                // Token does not exist, redirect to login page
                navigate('/login')
            } else if (expiresAt) {
                // Convert expiresAt to milliseconds
                const expirationTime = new Date(expiresAt).getTime()
                // Check if the current time is greater than or equal to the expiration time
                if (currentTime >= expirationTime) {
                    try {
                        // Make an API call to delete the token
                        await axios.delete(`${config.apiUrl}/logout`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        })
                    } catch (error) {
                        console.error('Error during token deletion:', error)
                    } finally {
                        // Clear localStorage items
                        localStorage.removeItem('user_id')
                        localStorage.removeItem('token')
                        localStorage.removeItem('role')
                        localStorage.removeItem('expires_at')
                        // Redirect to login page
                        toast.success('Berhasil Logout!')
                        navigate('/login')
                    }
                }
            }
        }

        checkToken()
    }, [navigate])

    return (
        <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <AppContent />
                </div>
                <AppFooter />
            </div>
        </div>
    )
}

export default DefaultLayout
