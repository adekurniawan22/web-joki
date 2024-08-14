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
import { Link } from 'react-router-dom'
import config from '../../config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DataTable from 'react-data-table-component'

const TransaksiList = () => {
    const [transaksi, setTransaksi] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [detailModalVisible, setDetailModalVisible] = useState(false)
    const [selectedTransaksi, setSelectedTransaksi] = useState(null)
    const [detailTransaksi, setDetailTransaksi] = useState(null) // New state for detail data

    useEffect(() => {
        const fetchTransaksi = async () => {
            try {
                const response = await axiosInstance.get(`${config.apiUrl}/transaksi`)
                setTransaksi(response.data)
                setLoading(false)
            } catch (error) {
                setError('Gagal mengambil data')
                setLoading(false)
            }
        }

        fetchTransaksi()
    }, [])

    const handleDelete = async (transaksiId) => {
        try {
            await axiosInstance.delete(`${config.apiUrl}/transaksi/${transaksiId}`)
            setTransaksi(transaksi.filter((transaksi) => transaksi.id !== transaksiId))
            toast.success('Transaksi berhasil dihapus!')
        } catch (error) {
            toast.error('Gagal menghapus transaksi')
        } finally {
            setModalVisible(false)
        }
    }

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
            width: '10%',
            center: true,
            sortable: true,
            style: {
                cursor: 'pointer',
            },
        },
        {
            name: 'Judul',
            selector: (row) => row.judul,
            width: '35%',
            wrap: true,
            sortable: true,
            style: {
                cursor: 'pointer',
            },
        },
        {
            name: 'Tanggal',
            selector: (row) =>
                row.tgl_selesai
                    ? `${formatTanggal(row.tgl_terima)} - ${formatTanggal(row.tgl_selesai)}`
                    : formatTanggal(row.tgl_terima) + ' - proses',
            sortable: true,
            maxWidth: '20%',
            center: true,
            style: {
                cursor: 'pointer',
            },
        },
        {
            name: 'Harga',
            selector: (row) => formatRupiah(row.harga),
            sortable: true,
            center: true,
            maxWidth: '10%',
            style: {
                cursor: 'pointer',
            },
        },
        {
            name: 'Status',
            selector: (row) => capitalizeFirstLetter(row.status),
            sortable: true,
            maxWidth: '5%',
            center: true,
            style: {
                cursor: 'pointer',
            },
        },

        {
            name: 'Action',
            center: true,
            maxWidth: '15%',
            style: {
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
            },
            cell: (row) => (
                <div>
                    <Link to={`/transaksi/edit/${row.id}`} className="btn btn-primary btn-sm me-2">
                        Edit
                    </Link>
                    <CButton
                        color="danger"
                        className="text-light"
                        size="sm"
                        onClick={() => {
                            setSelectedTransaksi(row.id)
                            setModalVisible(true)
                        }}
                    >
                        Hapus
                    </CButton>
                </div>
            ),
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
                    <Link to="/transaksi/create" className="btn btn-primary">
                        Tambah Transaksi
                    </Link>
                </div>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Daftar Transaksi</strong>
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

                <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                    <CModalHeader>
                        <CModalTitle>Konfirmasi Hapus</CModalTitle>
                    </CModalHeader>
                    <CModalBody>Apakah Anda yakin ingin menghapus transaksi ini?</CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setModalVisible(false)}>
                            Batal
                        </CButton>
                        <CButton
                            color="danger"
                            className="text-light"
                            onClick={() => handleDelete(selectedTransaksi)}
                        >
                            Hapus
                        </CButton>
                    </CModalFooter>
                </CModal>

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
                                                        href={`${config.apiUrl}/files/${file.file}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {file.file}
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

export default TransaksiList
