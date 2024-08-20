import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    CCol,
    CFormInput,
    CFormTextarea,
    CRow,
    CFormSelect,
    CButton,
    CCard,
    CCardHeader,
    CCardBody,
} from '@coreui/react'
import * as Yup from 'yup'
import { Formik, Field, ErrorMessage, Form } from 'formik'
import { toast } from 'react-toastify'
import axiosInstance from '../../../axiosConfig'
import config from '../../../config'

const FormEditUser = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const validationSchema = Yup.object({
        nama: Yup.string().required('Nama tidak boleh kosong'),
        role: Yup.string().required('Pilih role yang sesuai'),
        email: Yup.string().email('Email tidak valid').required('Email tidak boleh kosong'),
        no_hp: Yup.string()
            .matches(/^\d+$/, 'No. HP harus berupa angka')
            .required('No. HP tidak boleh kosong'),
        alamat: Yup.string().required('Alamat tidak boleh kosong'),
        password: Yup.string().min(8, 'Password harus minimal 8 karakter').nullable(),
    })

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await axiosInstance.put(`${config.apiUrl}/users/${id}`, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            toast.success('Data berhasil diperbarui!')
            navigate('/users')
        } catch (error) {
            toast.error('Terjadi kesalahan saat memperbarui data.')
        }
        setSubmitting(false)
    }

    const fetchUserData = async (setFieldValue) => {
        try {
            const response = await axiosInstance.get(`${config.apiUrl}/users/${id}`)
            const { nama, role, email, no_hp, alamat } = response.data
            setFieldValue('nama', nama)
            setFieldValue('role', role)
            setFieldValue('email', email)
            setFieldValue('no_hp', no_hp)
            setFieldValue('alamat', alamat)
        } catch (error) {
            toast.error('Gagal mengambil data user.')
            navigate('/users')
        }
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Edit User</strong>
                    </CCardHeader>
                    <CCardBody>
                        <Formik
                            initialValues={{
                                nama: '',
                                role: '',
                                email: '',
                                password: '',
                                no_hp: '',
                                alamat: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                            validateOnChange
                            validateOnBlur
                        >
                            {({ isSubmitting, setFieldValue, touched, errors }) => {
                                React.useEffect(() => {
                                    fetchUserData(setFieldValue)
                                }, [setFieldValue])

                                return (
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
                                                name="role"
                                                as={CFormSelect}
                                                aria-label="Default select example"
                                                label="Role"
                                                className={
                                                    touched.role && errors.role
                                                        ? 'is-invalid'
                                                        : touched.role && !errors.role
                                                          ? 'is-valid'
                                                          : ''
                                                }
                                            >
                                                <option value="">Pilih Role</option>
                                                <option value="owner">Owner</option>
                                                <option value="admin">Admin</option>
                                                <option value="penjoki">Penjoki</option>
                                            </Field>
                                            <ErrorMessage
                                                name="role"
                                                component="div"
                                                className="invalid-feedback"
                                            />
                                            {!errors.role && touched.role && (
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
                                                label="Password (Opsional)"
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
                                            <Link to="/users" className="btn btn-secondary">
                                                Kembali
                                            </Link>
                                            <CButton
                                                color="primary ms-2"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                Simpan
                                            </CButton>
                                        </div>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default FormEditUser
