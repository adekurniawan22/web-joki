import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const checkToken = () => {
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
                    // Token has expired, clear items and redirect to login page
                    localStorage.removeItem('token')
                    localStorage.removeItem('role')
                    localStorage.removeItem('expires_at')
                    navigate('/login')
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
