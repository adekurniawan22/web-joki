import React, { useState } from 'react'
import axios from 'axios'
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
    CFormFeedback,
} from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import config from '../../config'
import { toast } from 'react-toastify'

const FormTambahTransaksi = () => {
    const [validated, setValidated] = useState(false)
    const [formData, setFormData] = useState({
        nama: '',
        role: '',
        email: '',
        password: '',
        no_hp: '',
        alamat: '',
        harga: '',
        created_by: '',
    })
    const [errors, setErrors] = useState({ harga: '' })

    const navigate = useNavigate()

    const formatCurrency = (value) => {
        if (!value) return 'Rp. 0'
        const number = parseFloat(value.replace(/[^0-9]/g, ''))
        if (isNaN(number)) return 'Rp. 0'
        return `Rp. ${number.toLocaleString('id-ID')}`
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({
            ...formData,
            [name]: name === 'harga' ? value.replace(/[^\d]/g, '') : value,
        })
    }

    const handleBlur = (event) => {
        const { name, value } = event.target
        if (name === 'harga') {
            setFormData({
                ...formData,
                [name]: formatCurrency(value),
            })
        }
    }

    const handleSubmit = async (event) => {
        const form = event.currentTarget
        event.preventDefault()
        event.stopPropagation()

        const priceAsInteger = parseInt(formData.harga.replace(/[^0-9]/g, ''), 10)

        // Reset error state
        setErrors({ harga: '' })

        if (priceAsInteger === 0) {
            setErrors({ harga: 'Harga harus diisi dan tidak boleh 0' })
            setValidated(true)
            return
        }

        if (form.checkValidity() === false) {
            setValidated(true)
            return
        }

        try {
            await axios.post(
                `${config.apiUrl}/transaksi`,
                {
                    ...formData,
                    created_by: 1,
                    harga: priceAsInteger, // Send harga as integer
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            toast.success('Data berhasil ditambahkan!')
            navigate('/transaksi')
        } catch (error) {
            toast.error('Terjadi kesalahan saat menambahkan data.')
        }
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Form Transaksi</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm
                            className="row g-3 needs-validation"
                            noValidate
                            validated={validated}
                            onSubmit={handleSubmit}
                        >
                            <div id="validationForm">
                                <div className="mb-3">
                                    <CFormSelect
                                        name="tipe"
                                        id="tipe"
                                        aria-label="Default select example"
                                        feedbackInvalid="Pilih tipe tugas yang sesuai"
                                        label="Tipe"
                                        required
                                        value={formData.tipe}
                                        onChange={handleChange}
                                    >
                                        <option value="">Pilih Tipe Tugas</option>
                                        <option value="Joki Tugas">Joki Tugas</option>
                                        <option value="Joki Game">Joki Game</option>
                                    </CFormSelect>
                                </div>

                                <div className="mb-3">
                                    <CFormInput
                                        type="text"
                                        name="judul"
                                        id="judul"
                                        placeholder="Masukkan Judul"
                                        feedbackInvalid="Judul tidak boleh kosong"
                                        label="Judul"
                                        required
                                        value={formData.judul}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <CFormTextarea
                                        name="deskripsi"
                                        id="deskripsi"
                                        rows={3}
                                        placeholder="Masukkan Deskripsi"
                                        feedbackInvalid="Deskripsi tidak boleh kosong"
                                        label="Deskripsi"
                                        required
                                        value={formData.deskripsi}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <CFormInput
                                        type="date"
                                        name="tgl_terima"
                                        id="tgl_terima"
                                        placeholder="Masukkan Tanggal Terima"
                                        feedbackInvalid="Tanggal Terima tidak boleh kosong"
                                        label="Tanggal Terima"
                                        required
                                        value={formData.tgl_terima}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <CFormInput
                                        type="date"
                                        name="tgl_selesai"
                                        id="tgl_selesai"
                                        placeholder="Masukkan Tanggal Selesai"
                                        feedbackInvalid="Tanggal Selesai tidak boleh kosong"
                                        label="Tanggal Selesai"
                                        required
                                        value={formData.tgl_selesai}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <CFormSelect
                                        name="status"
                                        id="status"
                                        aria-label="Default select example"
                                        feedbackInvalid="Pilih status yang sesuai"
                                        label="Status"
                                        required
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="">Pilih Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="dikerjakan">Dikerjakan</option>
                                        <option value="selesai">Selesai</option>
                                    </CFormSelect>
                                </div>

                                <div className="mb-3">
                                    <CFormInput
                                        type="text"
                                        name="harga"
                                        id="harga"
                                        placeholder="Masukkan Harga"
                                        feedbackInvalid={
                                            errors.no_hp || 'Harga harus diisi dan tidak boleh 0'
                                        }
                                        label="Harga"
                                        required
                                        value={formatCurrency(formData.harga)}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        pattern="^(?!Rp\. 0$)[Rp\. \d,]+$"
                                    />
                                </div>
                            </div>

                            <div className="mb-4 mt-4 text-end">
                                <Link to="/transaksi" className="btn btn-secondary">
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

export default FormTambahTransaksi
