import React from 'react'
import {
    CCol,
    CForm,
    CFormInput,
    CFormTextarea,
    CRow,
    CFormSelect,
    CButton,
    CCard,
    CCardHeader,
    CCardBody,
} from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Formik, Field, ErrorMessage, Form } from 'formik'
import * as Yup from 'yup'
import axiosInstance from '../../axiosConfig'
import config from '../../config'

const FormTambahUser = () => {
    const navigate = useNavigate()

    // Schema untuk validasi menggunakan Yup
    const validationSchema = Yup.object({
        nama: Yup.string().required('Nama tidak boleh kosong'),
        role: Yup.string().required('Pilih role yang sesuai'),
        email: Yup.string().email('Email tidak valid').required('Email tidak boleh kosong'),
        password: Yup.string()
            .min(8, 'Password harus minimal 8 karakter')
            .required('Password tidak boleh kosong'),
        no_hp: Yup.string()
            .matches(/^\d+$/, 'No. HP harus berupa angka')
            .required('No. HP tidak boleh kosong'),
        alamat: Yup.string().required('Alamat tidak boleh kosong'),
    })

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            console.log(values)
            await axiosInstance.post(`${config.apiUrl}/users`, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            toast.success('Data berhasil ditambahkan!')
            navigate('/users')
        } catch (error) {
            toast.error('Terjadi kesalahan saat menambahkan data.')
        }
        setSubmitting(false)
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Form User</strong>
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
                                            placeholder="Masukkan Password"
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
                            )}
                        </Formik>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default FormTambahUser
