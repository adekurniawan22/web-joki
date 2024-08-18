import React from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const AddUser = React.lazy(() => import('./views/user/Add'))
const EditUser = React.lazy(() => import('./views/user/Edit'))
const UserList = React.lazy(() => import('./views/user/List'))
const AddTransaksi = React.lazy(() => import('./views/transaksi/Add'))
const EditTransaksi = React.lazy(() => import('./views/transaksi/Edit'))
const TransaksiList = React.lazy(() => import('./views/transaksi/List'))

const getRoutes = () => {
    const role = localStorage.getItem('role')
    let routes = []

    switch (role) {
        case 'owner':
            routes = [
                { path: '/dashboard', name: '', element: Dashboard },
                { path: '/users', name: 'User', element: UserList },
                { path: '/users/create', name: 'Tambah User', element: AddUser },
                { path: '/users/edit/:id', name: 'Edit User', element: EditUser },
                { path: '/transaksi', name: 'Transaksi', element: TransaksiList },
                { path: '/transaksi/create', name: 'Tambah Transaksi', element: AddTransaksi },
                { path: '/transaksi/edit/:id', name: 'Edit Transaksi', element: EditTransaksi },
            ]
            break
        case 'admin':
            routes = [
                { path: '/dashboard', name: '', element: Dashboard },
                { path: '/transaksi', name: 'Transaksi', element: TransaksiList },
                { path: '/transaksi/create', name: 'Tambah Transaksi', element: AddTransaksi },
                { path: '/transaksi/edit/:id', name: 'Edit Transaksi', element: EditTransaksi },
            ]
            break
        case 'penjoki':
            routes = [
                { path: '/dashboard', name: '', element: Dashboard },
                { path: '/transaksi', name: 'Transaksi', element: TransaksiList },
                { path: '/transaksi/create', name: 'Tambah Transaksi', element: AddTransaksi },
                { path: '/transaksi/edit/:id', name: 'Edit Transaksi', element: EditTransaksi },
            ]
            break
        default:
            // Jika role tidak sesuai, arahkan ke halaman 505
            return null
    }

    return routes
}

const routes = getRoutes()

export default routes
