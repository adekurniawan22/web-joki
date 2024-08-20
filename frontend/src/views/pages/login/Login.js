import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import config from '../../../config'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    // Cek role di localStorage dan arahkan ke dashboard jika ada
    useEffect(() => {
        if (localStorage.getItem('role')) {
            navigate('/dashboard')
        }
    }, [navigate])

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(
                `${config.apiUrl}/login`,
                {
                    email,
                    password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )

            const data = response.data

            // Simpan token dan role di localStorage
            localStorage.setItem('user_id', data.user_id)
            localStorage.setItem('token', data.token)
            localStorage.setItem('role', data.role)
            localStorage.setItem('expires_at', data.expires_at)

            // Redirect ke halaman dashboard
            navigate('/dashboard')
        } catch (err) {
            if (err.response) {
                // Jika server memberi respons dengan status kode yang tidak berada dalam rentang 2xx
                setError(err.response.data.message || 'Login failed')
            } else {
                // Terjadi kesalahan saat mengatur permintaan
                setError('An error occurred. Please try again.')
            }
        }
    }

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8}>
                        <CCardGroup>
                            <CCard className="p-4">
                                <CCardBody>
                                    <CForm onSubmit={handleLogin}>
                                        <h1>Login</h1>
                                        <p className="text-body-secondary">
                                            Sign In to your account
                                        </p>
                                        {error && <p className="text-danger">{error}</p>}
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilUser} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type="email"
                                                placeholder="Email"
                                                autoComplete="username"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-4">
                                            <CInputGroupText>
                                                <CIcon icon={cilLockLocked} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type="password"
                                                placeholder="Password"
                                                autoComplete="current-password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </CInputGroup>
                                        <CRow>
                                            <CCol xs={12}>
                                                <CButton
                                                    color="primary"
                                                    className="px-4 w-100"
                                                    type="submit"
                                                >
                                                    Login
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                            <CCard className="text-white bg-primary py-5 " style={{ width: '44%' }}>
                                <CCardBody className="text-center d-flex justify-content-center align-items-center">
                                    <div>
                                        <h2>Sign up</h2>
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipisicing
                                            elit, sed do eiusmod tempor incididunt ut labore et
                                            dolore magna aliqua.
                                        </p>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CCardGroup>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default Login
