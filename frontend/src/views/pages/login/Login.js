import React, { useEffect } from 'react'
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
import { ToastContainer, toast } from 'react-toastify'
import { cilLockLocked, cilUser } from '@coreui/icons'
import config from '../../../config'
import banner from './../../../../src/assets/images/banner.png'
import { Formik } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email tidak valid').required('Email wajib diisi'),
    password: Yup.string().required('Password wajib diisi'),
})

const Login = () => {
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('role')) {
            navigate('/dashboard')
        }
    }, [navigate])

    const handleLogin = async (values, { setSubmitting, setFieldError }) => {
        try {
            const response = await axios.post(
                `${config.apiUrl}/login`,
                {
                    email: values.email,
                    password: values.password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )

            const data = response.data
            localStorage.setItem('user_id', data.user_id)
            localStorage.setItem('token', data.token)
            localStorage.setItem('role', data.role)
            localStorage.setItem('expires_at', data.expires_at)

            navigate('/dashboard')
        } catch (err) {
            if (err.response) {
                setFieldError('general', err.response.data.message || 'Login gagal')
            } else {
                setFieldError('general', 'Terjadi kesalahan. Silakan coba lagi.')
                toast.error('Gagal Login!')
            }
        } finally {
            setSubmitting(false)
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
                                    <Formik
                                        initialValues={{ email: '', password: '' }}
                                        validationSchema={validationSchema}
                                        onSubmit={handleLogin}
                                    >
                                        {({
                                            values,
                                            errors,
                                            touched,
                                            handleChange,
                                            handleBlur,
                                            handleSubmit,
                                            isSubmitting,
                                        }) => (
                                            <CForm onSubmit={handleSubmit}>
                                                <h1>Login</h1>
                                                <p className="text-body-secondary">
                                                    Masuk ke akun anda
                                                </p>
                                                {errors.general && (
                                                    <p className="text-danger">{errors.general}</p>
                                                )}
                                                <CInputGroup className="mb-3">
                                                    <CInputGroupText>
                                                        <CIcon icon={cilUser} />
                                                    </CInputGroupText>
                                                    <CFormInput
                                                        type="email"
                                                        name="email"
                                                        placeholder="Email"
                                                        autoComplete="username"
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className={
                                                            touched.email && errors.email
                                                                ? 'is-invalid'
                                                                : null
                                                        }
                                                    />
                                                    {touched.email && errors.email ? (
                                                        <div className="invalid-feedback">
                                                            {errors.email}
                                                        </div>
                                                    ) : null}
                                                </CInputGroup>
                                                <CInputGroup className="mb-4">
                                                    <CInputGroupText>
                                                        <CIcon icon={cilLockLocked} />
                                                    </CInputGroupText>
                                                    <CFormInput
                                                        type="password"
                                                        name="password"
                                                        placeholder="Password"
                                                        autoComplete="current-password"
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className={
                                                            touched.password && errors.password
                                                                ? 'is-invalid'
                                                                : null
                                                        }
                                                    />
                                                    {touched.password && errors.password ? (
                                                        <div className="invalid-feedback">
                                                            {errors.password}
                                                        </div>
                                                    ) : null}
                                                </CInputGroup>
                                                <CRow>
                                                    <CCol xs={12}>
                                                        <CButton
                                                            color="primary"
                                                            className="px-4 w-100"
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                        >
                                                            Login
                                                        </CButton>
                                                    </CCol>
                                                </CRow>
                                            </CForm>
                                        )}
                                    </Formik>
                                </CCardBody>
                            </CCard>
                            <CCard
                                className="text-white py-5"
                                style={{
                                    width: '44%',
                                    backgroundImage: `url(${banner})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    color: 'white',
                                }}
                            >
                                <CCardBody className="text-center d-flex justify-content-center align-items-center">
                                    <div></div>
                                </CCardBody>
                            </CCard>
                        </CCardGroup>
                    </CCol>
                </CRow>
                <ToastContainer />
            </CContainer>
        </div>
    )
}

export default Login
