import React, { useState, useEffect } from 'react'
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
import { Link, useNavigate, useParams } from 'react-router-dom'
import config from '../../config'
import { toast } from 'react-toastify'
import axiosInstance from '../../axiosConfig'

const FormEditUser = () => {
    const { id } = useParams()
    const [validated, setValidated] = useState(false)
    const [formData, setFormData] = useState({
        nama: '',
        role: '',
        email: '',
        password: '',
        no_hp: '',
        alamat: '',
    })
    const [errors, setErrors] = useState({
        password: '',
        email: '',
        no_hp: '',
    })

    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`${config.apiUrl}/users/${id}`)
                setFormData(response.data)
            } catch (error) {
                toast.error('Terjadi kesalahan saat mengambil data pengguna.')
                navigate('/users')
            }
        }
        fetchData()
    }, [id, navigate])

    const validateField = (name, value) => {
        let error = ''
        switch (name) {
            case 'password':
                if (value && value.length < 8) {
                    error = 'Password harus minimal 8 karakter'
                }
                break
            case 'email':
                if (value === '') {
                    error = 'Email tidak boleh kosong'
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Email tidak valid'
                }
                break
            case 'no_hp':
                if (value === '') {
                    error = 'No. HP tidak boleh kosong'
                } else if (!/^\d+$/.test(value)) {
                    error = 'No. HP harus berupa angka'
                }
                break
            default:
                break
        }
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }))
        return !error
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
        validateField(name, value)
    }

    const handleSubmit = async (event) => {
        const form = event.currentTarget
        event.preventDefault()
        event.stopPropagation()

        const isPasswordValid =
            formData.password === '' || validateField('password', formData.password)
        const isEmailValid = validateField('email', formData.email)
        const isNoHpValid = validateField('no_hp', formData.no_hp)

        if (form.checkValidity() === false || !isPasswordValid || !isEmailValid || !isNoHpValid) {
            setValidated(true)
            return
        }

        try {
            await axiosInstance.put(`${config.apiUrl}/users/${id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            toast.success('Data berhasil diperbarui!')
            navigate('/users')
        } catch (error) {
            toast.error('Terjadi kesalahan saat memperbarui data.')
        }
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Form User</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm
                            className="row g-3 needs-validation"
                            noValidate
                            validated={validated}
                            onSubmit={handleSubmit}
                        >
                            <div className="mb-3">
                                <CFormInput
                                    type="text"
                                    name="nama"
                                    id="nama"
                                    placeholder="Masukkan Nama"
                                    feedbackInvalid="Nama tidak boleh kosong"
                                    label="Nama"
                                    required
                                    onChange={handleChange}
                                    value={formData.nama}
                                />
                            </div>

                            <div className="mb-3">
                                <CFormSelect
                                    name="role"
                                    id="role"
                                    aria-label="Default select example"
                                    feedbackInvalid="Pilih role yang sesuai"
                                    label="Role"
                                    required
                                    onChange={handleChange}
                                    value={formData.role}
                                >
                                    <option value="">Pilih Role</option>
                                    <option value="owner">Owner</option>
                                    <option value="admin">Admin</option>
                                    <option value="penjoki">Penjoki</option>
                                </CFormSelect>
                            </div>

                            <div className="mb-3">
                                <CFormInput
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Masukkan Email"
                                    feedbackInvalid={errors.email || 'Email tidak valid'}
                                    label="Email"
                                    required
                                    onChange={handleChange}
                                    value={formData.email}
                                    onInvalid={(e) => e.target.setCustomValidity(errors.email)}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                />
                            </div>

                            <div className="mb-3">
                                <CFormInput
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Masukkan Password (kosongkan jika tidak diubah)"
                                    feedbackInvalid={
                                        errors.password || 'Password harus minimal 8 karakter'
                                    }
                                    label="Password"
                                    minLength={8} // Menambahkan minLength
                                    onChange={handleChange}
                                    value={formData.password}
                                    onInvalid={(e) => e.target.setCustomValidity(errors.password)}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                />
                            </div>
                            <div className="mb-3">
                                <CFormInput
                                    type="text"
                                    name="no_hp"
                                    id="no_hp"
                                    placeholder="Masukkan No. HP"
                                    feedbackInvalid={errors.no_hp || 'No. HP harus berupa angka'}
                                    label="No. HP"
                                    required
                                    pattern="^\d+$" // Menambahkan pattern
                                    onChange={handleChange}
                                    value={formData.no_hp}
                                    onInvalid={(e) => e.target.setCustomValidity(errors.no_hp)}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                />
                            </div>

                            <div className="mb-3">
                                <CFormTextarea
                                    name="alamat"
                                    id="alamat"
                                    rows={3}
                                    placeholder="Masukkan Alamat"
                                    feedbackInvalid="Alamat tidak boleh kosong"
                                    label="Alamat"
                                    required
                                    onChange={handleChange}
                                    value={formData.alamat}
                                />
                            </div>

                            <div className="mb-4 mt-4 text-end">
                                <Link to="/users" className="btn btn-secondary">
                                    Kembali
                                </Link>
                                <CButton color="primary ms-2" type="submit">
                                    Simpan
                                </CButton>
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default FormEditUser
