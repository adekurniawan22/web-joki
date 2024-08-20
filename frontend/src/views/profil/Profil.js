import React, { useState, useEffect } from 'react'
import {
    CCol,
    CFormInput,
    CFormTextarea,
    CRow,
    CButton,
    CCard,
    CCardHeader,
    CCardBody,
    CAvatar,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { Formik, Field, ErrorMessage, Form } from 'formik'
import * as Yup from 'yup'
import axiosInstance from '../../axiosConfig'
import config from '../../config'
import { useNavigate } from 'react-router-dom'

const Profil = () => {
    const navigate = useNavigate()
    const id = localStorage.getItem('user_id')
    const [initialValues, setInitialValues] = useState({
        nama: '',
        email: '',
        password: '',
        no_hp: '',
        alamat: '',
        role: '',
    })

    // Schema validasi menggunakan Yup
    const validationSchema = Yup.object({
        nama: Yup.string().required('Nama tidak boleh kosong'),
        email: Yup.string().email('Email tidak valid').required('Email tidak boleh kosong'),
        no_hp: Yup.string()
            .matches(/^\d+$/, 'No. HP harus berupa angka')
            .required('No. HP tidak boleh kosong'),
        alamat: Yup.string().required('Alamat tidak boleh kosong'),
        password: Yup.string().min(8, 'Password harus minimal 8 karakter').nullable(),
    })

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Tambahkan nilai role ke dalam values
            const updatedValues = {
                ...values,
                role: localStorage.getItem('role'), // Pastikan initialValues.role terdefinisi
            }

            await axiosInstance.put(`${config.apiUrl}/users/${id}`, updatedValues, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            toast.success('Data berhasil diperbarui!')
            window.location.reload()
        } catch (error) {
            toast.error('Terjadi kesalahan saat memperbarui data.')
        }
        setSubmitting(false)
    }

    const fetchUserData = async () => {
        try {
            const response = await axiosInstance.get(`${config.apiUrl}/users/${id}`)
            const { nama, role, email, no_hp, alamat } = response.data
            setInitialValues({ nama, email, password: '', no_hp, alamat, role })
        } catch (error) {
            toast.error('Gagal mengambil data user.')
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    return (
        <CRow>
            <CCol xs={3}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Profil</strong>
                    </CCardHeader>
                    <CCardBody>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <CAvatar
                                color="secondary"
                                size="xl"
                                style={{ height: '100px', width: '100px' }}
                            >
                                User
                            </CAvatar>
                            <h6 className="mt-3">
                                {initialValues.nama} |{' '}
                                {initialValues.role
                                    ? initialValues.role.charAt(0).toUpperCase() +
                                      initialValues.role.slice(1)
                                    : ''}
                            </h6>
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>

            <CCol xs={9}>
                <CCard className="mb-4">
                    <CCardBody>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({ isSubmitting, touched, errors }) => (
                                <Form>
                                    <div className="mb-3">
                                        <Field
                                            name="nama"
                                            as={CFormInput}
                                            type="text"
                                            placeholder="Masukkan Nama"
                                            label="Nama"
                                            className={
                                                touched.nama && errors.nama
                                                    ? 'is-invalid'
                                                    : touched.nama && !errors.nama
                                                      ? 'is-valid'
                                                      : ''
                                            }
                                        />
                                        <ErrorMessage
                                            name="nama"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                        {!errors.nama && touched.nama && (
                                            <div className="valid-feedback">Looks good!</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <Field
                                            name="email"
                                            as={CFormInput}
                                            type="email"
                                            placeholder="Masukkan Email"
                                            label="Email"
                                            className={
                                                touched.email && errors.email
                                                    ? 'is-invalid'
                                                    : touched.email && !errors.email
                                                      ? 'is-valid'
                                                      : ''
                                            }
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                        {!errors.email && touched.email && (
                                            <div className="valid-feedback">Looks good!</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <Field
                                            name="password"
                                            as={CFormInput}
                                            type="password"
                                            placeholder="Masukkan Password (Opsional)"
                                            label="Password"
                                            className={
                                                touched.password && errors.password
                                                    ? 'is-invalid'
                                                    : touched.password && !errors.password
                                                      ? 'is-valid'
                                                      : ''
                                            }
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                        {!errors.password && touched.password && (
                                            <div className="valid-feedback">Looks good!</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <Field
                                            name="no_hp"
                                            as={CFormInput}
                                            type="text"
                                            placeholder="Masukkan No. HP"
                                            label="No. HP"
                                            className={
                                                touched.no_hp && errors.no_hp
                                                    ? 'is-invalid'
                                                    : touched.no_hp && !errors.no_hp
                                                      ? 'is-valid'
                                                      : ''
                                            }
                                        />
                                        <ErrorMessage
                                            name="no_hp"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                        {!errors.no_hp && touched.no_hp && (
                                            <div className="valid-feedback">Looks good!</div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <Field
                                            name="alamat"
                                            as={CFormTextarea}
                                            rows={3}
                                            placeholder="Masukkan Alamat"
                                            label="Alamat"
                                            className={
                                                touched.alamat && errors.alamat
                                                    ? 'is-invalid'
                                                    : touched.alamat && !errors.alamat
                                                      ? 'is-valid'
                                                      : ''
                                            }
                                        />
                                        <ErrorMessage
                                            name="alamat"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                        {!errors.alamat && touched.alamat && (
                                            <div className="valid-feedback">Looks good!</div>
                                        )}
                                    </div>

                                    <div className="mb-4 mt-4 text-end">
                                        <CButton
                                            color="primary ms-2"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            Simpan
                                        </CButton>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default Profil
