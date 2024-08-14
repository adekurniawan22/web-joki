import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axiosConfig'
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

const FormTransaksiEdit = () => {
    const { id } = useParams() // Get the ID from URL params
    const [validated, setValidated] = useState(false)
    const [formData, setFormData] = useState({
        nama: '',
        role: '',
        email: '',
        password: '',
        no_hp: '',
        alamat: '',
        harga: '',
        tgl_terima: '',
        tgl_selesai: '',
    })
    const [errors, setErrors] = useState({ harga: '' })

    const navigate = useNavigate()

    useEffect(() => {
        // Fetch existing data
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`${config.apiUrl}/transaksi/${id}`)
                const data = response.data
                setFormData({
                    ...data,
                    tgl_terima: formatApiDateToInputDate(data.tgl_terima),
                    tgl_selesai: formatApiDateToInputDate(data.tgl_selesai),
                })
            } catch (error) {
                toast.error('Terjadi kesalahan saat mengambil data.')
            }
        }

        fetchData()
    }, [id])

    const formatApiDateToInputDate = (date) => {
        if (!date) return ''
        const [datePart] = date.split('T') // Extract date part before 'T'
        return datePart
    }

    const formatCurrency = (value) => {
        if (value === undefined || value === null || value === '') return 'Rp. 0'

        const valueStr = String(value).replace(/[^0-9]/g, '') // Convert to string and clean non-numeric characters
        const number = parseFloat(valueStr)

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

        // Convert harga to integer before sending

        try {
            await axiosInstance.put(
                `${config.apiUrl}/transaksi/${id}`,
                {
                    ...formData,
                    harga: priceAsInteger, // Send harga as integer
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            toast.success('Data berhasil diperbarui!')
            navigate('/transaksi')
        } catch (error) {
            toast.error('Terjadi kesalahan saat memperbarui data.')
        }
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Edit Transaksi</strong>
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
                                        label="Harga"
                                        required
                                        value={formatCurrency(formData.harga)}
                                        onChange={handleChange}
                                        feedbackInvalid={
                                            errors.no_hp || 'Harga harus diisi dan tidak boleh 0'
                                        }
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

export default FormTransaksiEdit
