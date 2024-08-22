import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
import { toast } from 'react-toastify'
import DataTable from 'react-data-table-component'
import config from '../../../config'
import axiosInstance from '../../../axiosConfig'

const TransaksiList = () => {
    const [transaksi, setTransaksi] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [detailModalVisible, setDetailModalVisible] = useState(false)
    const [selectedTransaksi, setSelectedTransaksi] = useState(null)
    const [detailTransaksi, setDetailTransaksi] = useState(null)
    const [ambilModalVisible, setAmbilModalVisible] = useState(false)

    useEffect(() => {
        const fetchTransaksi = async () => {
            try {
                const response = await axiosInstance.get(`${config.apiUrl}/transaksi`)
                const fetchedTransaksi = response.data

                if (localStorage.getItem('role') === 'penjoki') {
                    const filteredTransaksi = fetchedTransaksi.filter(
                        (transaksi) => transaksi.status === 'pending',
                    )
                    setTransaksi(filteredTransaksi)
                } else {
                    setTransaksi(fetchedTransaksi)
                }

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

    const handleAmbilClick = (transaksi) => {
        setSelectedTransaksi(transaksi)
        setAmbilModalVisible(true)
    }

    const handleSetuju = async () => {
        try {
            const ambilValues = {
                status: 'dikerjakan',
                take_by: localStorage.getItem('user_id'),
            }

            await axiosInstance.put(
                `${config.apiUrl}/transaksi/ambil/` + selectedTransaksi.id,
                ambilValues,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            setAmbilModalVisible(false)
            toast.success('Transaksi berhasil diambil, silahkan cek riwayat transaksi!', {
                onClose: () => {
                    window.location.reload()
                },
            })
        } catch (error) {
            toast.error('Terjadi kesalahan saat mengambil transaksi ini.')
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
            width: '15%',
            sortable: true,
            style: {
                cursor: 'pointer',
            },
        },
        {
            name: 'Judul',
            selector: (row) => row.judul,
            wrap: true,
            width: '35%',
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

        ...(localStorage.getItem('role') === 'penjoki'
            ? [
                  {
                      name: 'Keuntungan',
                      selector: (row) => formatRupiah(row.harga * 0.5),
                      sortable: true,
                      center: `true`,
                      style: {
                          cursor: 'pointer',
                      },
                  },
              ]
            : []),

        {
            name: 'Status',
            selector: (row) => capitalizeFirstLetter(row.status),
            sortable: true,
            center: `true`,
            style: {
                cursor: 'pointer',
            },
        },

        ...(localStorage.getItem('role') !== 'owner'
            ? [
                  {
                      name: 'Action',
                      center: `true`,
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
                              {localStorage.getItem('role') === 'penjoki' && (
                                  <CButton
                                      color="success"
                                      className="text-light"
                                      size="sm"
                                      onClick={() => handleAmbilClick(row)}
                                  >
                                      Ambil
                                  </CButton>
                              )}
                              {localStorage.getItem('role') === 'admin' && (
                                  <Link
                                      to={`/transaksi/edit/${row.id}`}
                                      className="btn btn-primary btn-sm me-2"
                                  >
                                      Edit
                                  </Link>
                              )}
                              {localStorage.getItem('role') === 'admin' && (
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
                              )}
                          </div>
                      ),
                  },
              ]
            : []),
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
                    {localStorage.getItem('role') === 'admin' && (
                        <Link to="/transaksi/create" className="btn btn-primary">
                            Tambah Transaksi
                        </Link>
                    )}
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

                {/* Modal Delete */}
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

                {/* Modal Detail */}
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
                                    <strong>Dibuat Oleh:</strong> {detailTransaksi.creator.nama}
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
                                        <strong>Diambil Oleh:</strong> {detailTransaksi.taker.nama}
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
                                        <strong>File Transaksi:</strong>
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
                                            <strong>File Final:</strong>
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

                {/* Modal Konfrimasi Ambil */}
                <CModal visible={ambilModalVisible} onClose={() => setAmbilModalVisible(false)}>
                    <CModalHeader>
                        <CModalTitle>Konfirmasi Ambil</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <p className="mb-0">Harap periksa detail joki sebelum melanjutkan.</p>
                        <p>Jika Anda setuju untuk mengambilnya, silakan klik "Setuju".</p>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setAmbilModalVisible(false)}>
                            Batal
                        </CButton>
                        <CButton color="success" className="text-light" onClick={handleSetuju}>
                            Setuju
                        </CButton>
                    </CModalFooter>
                </CModal>
            </CCol>
        </CRow>
    )
}

export default TransaksiList
