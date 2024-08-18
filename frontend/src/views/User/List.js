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
import { Link } from 'react-router-dom'
import config from '../../config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DataTable from 'react-data-table-component'
import axiosInstance from '../../axiosConfig'

const UserList = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get(`${config.apiUrl}/users`)
                setUsers(response.data)
                setLoading(false)
            } catch (error) {
                setError('Gagal mengambil data')
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    const handleDelete = async (userId) => {
        try {
            await axiosInstance.delete(`${config.apiUrl}/users/${userId}`)
            setUsers(users.filter((user) => user.id !== userId))
            toast.success('User berhasil dihapus!')
        } catch (error) {
            toast.error('Gagal menghapus user')
        } finally {
            setModalVisible(false)
        }
    }

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    }

    const columns = [
        {
            name: 'Nama',
            selector: (row) => row.nama,
            sortable: true,
        },
        {
            name: 'Role',
            selector: (row) => capitalizeFirstLetter(row.role),
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => (
                <div
                    style={{
                        textOverflow: 'ellipsis',
                    }}
                    title={row.email}
                >
                    {row.email}
                </div>
            ),
            sortable: true,
        },
        {
            name: 'No. HP',
            selector: (row) => row.no_hp,
            sortable: true,
        },
        {
            name: 'Alamat',
            selector: (row) => (
                <div
                    style={{
                        textOverflow: 'ellipsis',
                    }}
                    title={row.alamat}
                >
                    {row.alamat}
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Action',
            center: `true`,
            style: {
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            },
            cell: (row) => (
                <div>
                    <Link to={`/users/edit/${row.id}`} className="btn btn-primary btn-sm me-2">
                        Edit
                    </Link>
                    <CButton
                        color="danger"
                        className="text-light"
                        size="sm"
                        onClick={() => {
                            setSelectedUser(row.id)
                            setModalVisible(true)
                        }}
                    >
                        Hapus
                    </CButton>
                </div>
            ),
        },
    ]

    const filteredUsers = users.filter(
        (user) =>
            user.nama.toLowerCase().includes(search.toLowerCase()) ||
            user.role.toLowerCase().includes(search.toLowerCase()) ||
            user.no_hp.toLowerCase().includes(search.toLowerCase()) ||
            user.alamat.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()),
    )

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
                        placeholder="Cari user..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-control"
                        style={{ width: '30%' }}
                    />
                    <Link to="/users/create" className="btn btn-primary">
                        Tambah User
                    </Link>
                </div>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Daftar User</strong>
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
                                data={filteredUsers}
                                pagination
                                highlightOnHover
                                customStyles={customStyles} // Apply custom styles
                            />
                        )}
                    </CCardBody>
                </CCard>
                <ToastContainer />

                <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                    <CModalHeader>
                        <CModalTitle>Konfirmasi Hapus</CModalTitle>
                    </CModalHeader>
                    <CModalBody>Apakah Anda yakin ingin menghapus user ini?</CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setModalVisible(false)}>
                            Batal
                        </CButton>
                        <CButton
                            color="danger"
                            className="text-light"
                            onClick={() => handleDelete(selectedUser)}
                        >
                            Hapus
                        </CButton>
                    </CModalFooter>
                </CModal>
            </CCol>
        </CRow>
    )
}

export default UserList
