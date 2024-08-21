import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../axiosConfig'
import { CCol, CRow, CCard, CCardHeader, CCardBody, CButton, CSpinner, CAlert } from '@coreui/react'
import config from '../../../config'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DataTable from 'react-data-table-component'

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const userId = localStorage.getItem('user_id')

    useEffect(() => {
        let isMounted = true

        const fetchLeaderboard = async () => {
            try {
                const response = await axiosInstance.get(`${config.apiUrl}/top-penjoki`)
                if (isMounted) {
                    setLeaderboard(response.data.top_penjoki)
                    setLoading(false)
                }
            } catch (error) {
                if (isMounted) {
                    setError('Gagal mengambil data')
                    setLoading(false)
                }
            }
        }

        fetchLeaderboard()

        return () => {
            isMounted = false
        }
    }, [])

    const columns = [
        {
            name: 'Peringkat',
            selector: (row, index) => index + 1,
            center: `true`,
            width: '20%',
        },
        {
            name: 'Nama',
            selector: (row) => row.nama,
            width: '40%',
        },
        {
            name: 'Total Transaksi',
            selector: (row) => row.transaksi_count,
            center: `true`,
            width: '40%',
        },
    ]

    const filteredLeaderboard = leaderboard.filter((item) =>
        item.nama.toLowerCase().includes(search.toLowerCase()),
    )

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#f8f9fa',
                color: '#333',
                fontWeight: 'bold',
            },
        },
    }

    // Mengatur warna baris berdasarkan kondisi
    const conditionalRowStyles = [
        {
            when: (row) => row.id.toString() === userId,
            style: {
                backgroundColor: 'lightgreen',
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
                        placeholder="Cari nama..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-control"
                        style={{ width: '30%' }}
                    />
                </div>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Leaderboard</strong>
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
                                data={filteredLeaderboard}
                                customStyles={customStyles}
                                pagination
                                highlightOnHover
                                conditionalRowStyles={conditionalRowStyles} // Menambahkan gaya baris kondisi
                            />
                        )}
                    </CCardBody>
                </CCard>
                <ToastContainer />
            </CCol>
        </CRow>
    )
}

export default Leaderboard
