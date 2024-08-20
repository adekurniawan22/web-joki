import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axiosConfig'
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
import config from '../../config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DataTable from 'react-data-table-component'

const RiwayatList = () => {
    const [transaksi, setTransaksi] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [detailModalVisible, setDetailModalVisible] = useState(false)
    const [detailTransaksi, setDetailTransaksi] = useState(null) // New state for detail data

    useEffect(() => {
        const fetchTransaksi = async () => {
            try {
                const response = await axiosInstance.get(
                    `${config.apiUrl}/transaksi/riwayat/` + localStorage.getItem('user_id'),
                )
                setTransaksi(response.data)
                setLoading(false)
            } catch (error) {
                setError('Gagal mengambil data')
                setLoading(false)
            }
        }

        fetchTransaksi()
    }, [])

    const handleRowClick = async (row) => {
        try {
            const response = await axiosInstance.get(`${config.apiUrl}/transaksi/${row.id}`)
            setDetailTransaksi(response.data) // Set detail data
            setDetailModalVisible(true)
        } catch (error) {
            toast.error('Gagal mengambil detail transaksi')
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
            selector: (row) => capitalizeFirstLetter(row.status),
            sortable: true,
            center: `true`,
            style: {
                cursor: 'pointer',
            },
        },
    ]

    // Filter dan urutkan data
    const filteredTransaksi = transaksi.filter(
        (transaksi) =>
            transaksi.tipe.toLowerCase().includes(search.toLowerCase()) ||
            transaksi.judul.toLowerCase().includes(search.toLowerCase()) ||
            transaksi.status.toLowerCase().includes(search.toLowerCase()),
    )

    // Urutkan data berdasarkan ID secara menurun
    const sortedTransaksi = [...filteredTransaksi].sort((a, b) => b.id - a.id)

    // Define custom styles for DataTable
    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#f8f9fa',
                color: '#333',
                fontWeight: 'bold',
            },
        },
    }

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
                                onRowClicked={handleRowClick}
                            />
                        )}
                    </CCardBody>
                </CCard>
                <ToastContainer />

                <CModal visible={detailModalVisible} onClose={() => setDetailModalVisible(false)}>
                    <CModalHeader>
                        <CModalTitle>Detail Transaksi</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        {detailTransaksi ? (
                            <div>
                                <p>
                                    <strong>ID:</strong> {detailTransaksi.id}
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
            </CCol>
        </CRow>
    )
}

export default RiwayatList
