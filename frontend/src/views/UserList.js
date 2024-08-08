import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CCol, CRow, CCard, CCardHeader, CCardBody, CButton } from '@coreui/react'
import { Link } from 'react-router-dom'
import config from '../../src/config'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DataTable from 'react-data-table-component'

const UserList = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${config.apiUrl}/users`)
                setUsers(response.data)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching users:', error)
                setError('Failed to fetch users.')
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    const columns = [
        {
            name: 'Nama',
            selector: (row) => row.nama,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: 'Role',
            selector: (row) => row.role,
            sortable: true,
        },
        {
            name: 'No. HP',
            selector: (row) => row.no_hp,
            sortable: true,
        },
        {
            name: 'Alamat',
            selector: (row) => row.alamat,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <Link to={`/users/edit/${row.id}`} className="btn btn-primary btn-sm">
                    Edit
                </Link>
            ),
        },
    ]

    const filteredUsers = users.filter(
        (user) =>
            user.nama.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Daftar Pengguna</strong>
                        <Link to="/users/create" className="btn btn-primary float-end">
                            Tambah Pengguna
                        </Link>
                    </CCardHeader>
                    <CCardBody>
                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="Cari pengguna..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={filteredUsers}
                                pagination
                                highlightOnHover
                            />
                        )}
                    </CCardBody>
                </CCard>
                <ToastContainer />
            </CCol>
        </CRow>
    )
}

export default UserList
