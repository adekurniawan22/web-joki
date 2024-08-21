import React, { useEffect, useState } from 'react'
import {
    CCol,
    CRow,
    CCard,
    CCardHeader,
    CCardBody,
    CButton,
    CSpinner,
    CAlert,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react'
import * as Yup from 'yup'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import DataTable from 'react-data-table-component'
import config from '../../../config'
import axiosInstance from '../../../axiosConfig'

const RiwayatList = () => {
    const [transaksi, setTransaksi] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [detailModalVisible, setDetailModalVisible] = useState(false)
    const [konfirmasiModalVisible, setKonfirmasiModalVisible] = useState(false)
    const [detailTransaksi, setDetailTransaksi] = useState(null)
    const [selectedTransaksi, setSelectedTransaksi] = useState(null)

    const validationSchema = Yup.object().shape({
        keterangan: Yup.array()
            .of(
                Yup.object().shape({
                    text: Yup.string().required('Keterangan diperlukan'),
                    file: Yup.mixed().required('File diperlukan'),
                }),
            )
            .required('Setidaknya satu keterangan diperlukan'),
    })

    const fetchTransaksi = async () => {
        try {
            const response = await axiosInstance.get(
                `${config.apiUrl}/transaksi/riwayat/${localStorage.getItem('user_id')}`,
            )
            setTransaksi(response.data)
        } catch (error) {
            setError('Gagal mengambil data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransaksi()
    }, [])

    const handleRowClick = async (row) => {
        try {
            const response = await axiosInstance.get(`${config.apiUrl}/transaksi/${row.id}`)
            setDetailTransaksi(response.data)
            setDetailModalVisible(true)
        } catch (error) {
            toast.error('Gagal mengambil detail transaksi')
        }
    }

    const handleKonfirmasiSelesai = (transaksi) => {
        setSelectedTransaksi(transaksi)
        setKonfirmasiModalVisible(true)
    }

    const handleSubmit = async (values) => {
        if (selectedTransaksi) {
            const formDataArray = []
            for (const item of values.keterangan) {
                if (item.text && item.file) {
                    const formData = new FormData()
                    formData.append('id_transaksi', selectedTransaksi.id)
                    formData.append('keterangan', item.text)
                    formData.append('file', item.file)
                    formDataArray.push(formData)
                } else {
                    toast.error('Keterangan dan file harus diisi untuk setiap entri!')
                    return
                }
            }

            try {
                for (const formData of formDataArray) {
                    await axiosInstance.post(`${config.apiUrl}/file-transaksi-selesai`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                }

                const ambilValues = {
                    status: 'selesai',
                    take_by: localStorage.getItem('user_id'),
                    tgl_selesai: new Date().toLocaleString('en-CA', {
                        timeZone: 'Asia/Jakarta',
                    }),
                }

                await axiosInstance.put(
                    `${config.apiUrl}/transaksi/ambil/${selectedTransaksi.id}`,
                    ambilValues,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )

                setKonfirmasiModalVisible(false)
                fetchTransaksi()
                toast.success('Transaksi berhasil dikonfirmasi')
            } catch (error) {
                toast.error('Gagal mengonfirmasi transaksi')
            }
        }
    }

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    }

    const formatTanggal = (tanggal) => {
        if (!tanggal) return '-'
        const date = new Date(tanggal)
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
    }

    const formatRupiah = (angka) => {
        if (!angka) return 'Rp 0'
        const numberString = angka.toString()
        const sisa = numberString.length % 3
        let rupiah = numberString.substr(0, sisa)
        const ribuan = numberString.substr(sisa).match(/\d{3}/g)

        if (ribuan) {
            const separator = sisa ? '.' : ''
            rupiah += separator + ribuan.join('.')
        }

        return 'Rp. ' + rupiah
    }

    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            omit: true,
        },
        {
            name: 'Tipe',
            selector: (row) => row.tipe,
            center: `true`,
            width: `15%`,
            sortable: true,
            style: {
                cursor: 'pointer',
            },
        },
        {
            name: 'Judul',
            selector: (row) => row.judul,
            wrap: true,
            width: `40%`,
            sortable: true,
            style: {
                cursor: 'pointer',
            },
        },
        {
            name: 'Harga',
            selector: (row) => formatRupiah(row.harga),
            sortable: true,
            center: `true`,
            style: {
                cursor: 'pointer',
            },
        },
        {
            name: 'Keuntungan',
            selector: (row) => formatRupiah(row.harga * 0.5),
            sortable: true,
            center: `true`,
            style: {
                cursor: 'pointer',
            },
        },
        {
            name: 'Status',
            selector: (row) => {
                if (row.status === 'dikerjakan') {
                    return (
                        <CButton
                            color="success"
                            className="text-light"
                            onClick={() => handleKonfirmasiSelesai(row)}
                        >
                            Konfirmasi
                        </CButton>
                    )
                }
                return capitalizeFirstLetter(row.status)
            },
            sortable: true,
            center: `true`,
            style: {
                cursor: 'pointer',
            },
        },
    ]

    const filteredTransaksi = transaksi.filter(
        (transaksi) =>
            transaksi.tipe.toLowerCase().includes(search.toLowerCase()) ||
            transaksi.judul.toLowerCase().includes(search.toLowerCase()) ||
            transaksi.status.toLowerCase().includes(search.toLowerCase()),
    )

    const sortedTransaksi = [...filteredTransaksi].sort((a, b) => b.id - a.id)

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#f8f9fa',
                color: '#333',
                fontWeight: 'bold',
            },
        },
    }

    const conditionalRowStyles = [
        {
            when: (row) => row.status === 'dikerjakan',
            style: {
                backgroundColor: '#f9b115',
                color: 'black',
            },
        },
    ]

    return (
        <CRow>
            <CCol xs={12}>
                <div className="d-flex justify-content-between mb-3">
                    <input
                        type="text"
                        placeholder="Cari transaksi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-control"
                        style={{ width: '30%' }}
                    />
                </div>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Riwayat Transaksi</strong>
                    </CCardHeader>
                    <CCardBody>
                        {loading ? (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                <CButton color="primary" disabled>
                                    <CSpinner
                                        as="span"
                                        size="sm"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Loading...
                                </CButton>
                            </div>
                        ) : error ? (
                            <CAlert color="danger" className="text-center">
                                {error}
                            </CAlert>
                        ) : (
                            <DataTable
                                className="hover"
                                columns={columns}
                                data={sortedTransaksi}
                                pagination
                                highlightOnHover
                                customStyles={customStyles}
                                conditionalRowStyles={conditionalRowStyles}
                                onRowClicked={handleRowClick}
                            />
                        )}
                    </CCardBody>
                </CCard>

                <CModal visible={detailModalVisible} onClose={() => setDetailModalVisible(false)}>
                    <CModalHeader>
                        <CModalTitle>Detail Transaksi</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        {detailTransaksi ? (
                            <div>
                                <p>
                                    <strong>No. Transaksi:</strong> JOKI-{detailTransaksi.id}
                                </p>
                                <p>
                                    <strong>Created By:</strong> {detailTransaksi.creator.nama}
                                </p>
                                <p>
                                    <strong>Tipe:</strong> {detailTransaksi.tipe}
                                </p>
                                <p>
                                    <strong>Judul:</strong> {detailTransaksi.judul}
                                </p>
                                <p>
                                    <strong>Deskripsi:</strong> {detailTransaksi.deskripsi}
                                </p>
                                <p>
                                    <strong>Tanggal Terima:</strong>{' '}
                                    {formatTanggal(detailTransaksi.tgl_terima)}
                                </p>
                                <p>
                                    <strong>Tanggal Selesai:</strong>{' '}
                                    {formatTanggal(detailTransaksi.tgl_selesai)}
                                </p>
                                <p>
                                    <strong>Status:</strong>{' '}
                                    {capitalizeFirstLetter(detailTransaksi.status)}
                                </p>
                                {detailTransaksi.take_by ? (
                                    <p>
                                        <strong>Take By:</strong> {detailTransaksi.taker.nama}
                                    </p>
                                ) : (
                                    ''
                                )}
                                <p>
                                    <strong>Harga:</strong> {formatRupiah(detailTransaksi.harga)}
                                </p>
                                <p>
                                    <strong>Keuntungan:</strong>{' '}
                                    {formatRupiah(detailTransaksi.harga * 0.5)}
                                </p>
                                {detailTransaksi.files && detailTransaksi.files.length > 0 && (
                                    <div>
                                        <strong>Files:</strong>
                                        <ul>
                                            {detailTransaksi.files.map((file) => (
                                                <li key={file.id}>
                                                    <a
                                                        href={`${config.apiBiasa}/storage/${file.file}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            display: 'inline',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '100%',
                                                            overflowWrap: 'break-word',
                                                        }}
                                                    >
                                                        {'file-no-' + file.id}
                                                    </a>
                                                    {' (' + file.keterangan + ')'}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {detailTransaksi.files_selesai &&
                                    detailTransaksi.files_selesai.length > 0 && (
                                        <div>
                                            <strong>Files Selesai:</strong>
                                            <ul>
                                                {detailTransaksi.files_selesai.map((file) => (
                                                    <li key={file.id}>
                                                        <a
                                                            href={`${config.apiBiasa}/storage/${file.file}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                display: 'inline',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                maxWidth: '100%',
                                                                overflowWrap: 'break-word',
                                                            }}
                                                        >
                                                            {'file-selesai-no-' + file.id}
                                                        </a>
                                                        {' (' + file.keterangan + ')'}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                            </div>
                        ) : (
                            <p>Data tidak ditemukan</p>
                        )}
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setDetailModalVisible(false)}>
                            Tutup
                        </CButton>
                    </CModalFooter>
                </CModal>

                <CModal
                    visible={konfirmasiModalVisible}
                    onClose={() => setKonfirmasiModalVisible(false)}
                >
                    <CModalHeader>
                        <CModalTitle>Konfirmasi Selesai</CModalTitle>
                    </CModalHeader>
                    <Formik
                        initialValues={{
                            keterangan: [{ text: '', file: null }],
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, values, setFieldValue }) => (
                            <Form>
                                <CModalBody>
                                    <FieldArray name="keterangan">
                                        {({ push, remove }) => (
                                            <div>
                                                {values.keterangan.map((_, index) => (
                                                    <div
                                                        key={`keterangan-${index}`}
                                                        className="mb-3 card bg-light p-3"
                                                    >
                                                        <CRow>
                                                            <CCol
                                                                xs={
                                                                    values.keterangan.length > 1
                                                                        ? 9
                                                                        : 12
                                                                }
                                                            >
                                                                <Field
                                                                    name={`keterangan[${index}].text`}
                                                                    placeholder="Keterangan"
                                                                    className={`form-control ${errors.keterangan?.[index]?.text && touched.keterangan?.[index]?.text ? 'is-invalid' : ''}`}
                                                                />
                                                                <ErrorMessage
                                                                    name={`keterangan[${index}].text`}
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                />
                                                                <input
                                                                    type="file"
                                                                    onChange={(event) => {
                                                                        setFieldValue(
                                                                            `keterangan[${index}].file`,
                                                                            event.currentTarget
                                                                                .files[0],
                                                                        )
                                                                    }}
                                                                    className={`form-control mt-2 ${errors.keterangan?.[index]?.file && touched.keterangan?.[index]?.file ? 'is-invalid' : ''}`}
                                                                />
                                                                <ErrorMessage
                                                                    name={`keterangan[${index}].file`}
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                />
                                                            </CCol>
                                                            {values.keterangan.length > 1 && (
                                                                <CCol
                                                                    xs={3}
                                                                    className="d-flex align-items-center"
                                                                >
                                                                    <CButton
                                                                        color="danger"
                                                                        onClick={() =>
                                                                            remove(index)
                                                                        }
                                                                        className="w-100 h-100"
                                                                    >
                                                                        Hapus
                                                                    </CButton>
                                                                </CCol>
                                                            )}
                                                        </CRow>
                                                    </div>
                                                ))}
                                                <CButton
                                                    color="primary"
                                                    onClick={() => push({ text: '', file: null })}
                                                >
                                                    Tambah
                                                </CButton>
                                            </div>
                                        )}
                                    </FieldArray>
                                </CModalBody>
                                <CModalFooter>
                                    <CButton
                                        color="secondary"
                                        onClick={() => setKonfirmasiModalVisible(false)}
                                    >
                                        Tutup
                                    </CButton>
                                    <CButton color="success" className="text-light" type="submit">
                                        Konfirmasi
                                    </CButton>
                                </CModalFooter>
                            </Form>
                        )}
                    </Formik>
                </CModal>
            </CCol>
        </CRow>
    )
}

export default RiwayatList
