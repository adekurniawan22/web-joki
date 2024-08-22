import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import config from '../../../config'
import { toast } from 'react-toastify'

const Logout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const logout = async () => {
            try {
                const token = localStorage.getItem('token')
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

                localStorage.removeItem('user_id')
                localStorage.removeItem('token')
                localStorage.removeItem('role')
                localStorage.removeItem('expires_at')
                localStorage.removeItem(
                    'dashboardToastShown                                                        ',
                )

                toast.success('Berhasil Logout!')
                navigate('/login')
            } catch (error) {
                console.error('Error during logout:', error)
                navigate('/login')
            }
        }

        logout()
    }, [navigate])

    return null
}

export default Logout
