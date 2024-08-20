import React from 'react'

const Login = React.lazy(() => import('./views/pages/login/Login'))
const Profil = React.lazy(() => import('./views/pages/profil/Profil'))
const Dashboard = React.lazy(() => import('./views/pages/dashboard/Dashboard'))
const AddUser = React.lazy(() => import('./views/pages/user/Add'))
const EditUser = React.lazy(() => import('./views/pages/user/Edit'))
const UserList = React.lazy(() => import('./views/pages/user/List'))
const TransaksiList = React.lazy(() => import('./views/pages/transaksi/List'))
const AddTransaksi = React.lazy(() => import('./views/pages/transaksi/Add'))
const EditTransaksi = React.lazy(() => import('./views/pages/transaksi/Edit'))
const RiwayatList = React.lazy(() => import('./views/pages/transaksi/RiwayatList'))
const Leaderboard = React.lazy(() => import('./views/pages/leaderboard/Leaderboard'))

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
                {
                    path: '/transaksi/create',
                    name: 'Tambah Transaksi',
                    element: AddTransaksi,
                },
                {
                    path: '/transaksi/edit/:id',
                    name: 'Edit Transaksi',
                    element: EditTransaksi,
                },
                { path: '/profil', name: 'Profil', element: Profil },
                { path: '/login', name: 'Login', element: Login },
            ]
            break
        case 'admin':
            routes = [
                { path: '/dashboard', name: '', element: Dashboard },
                { path: '/transaksi', name: 'Transaksi', element: TransaksiList },
                {
                    path: '/transaksi/create',
                    name: 'Tambah Transaksi',
                    element: AddTransaksi,
                },
                {
                    path: '/transaksi/edit/:id',
                    name: 'Edit Transaksi',
                    element: EditTransaksi,
                },
                { path: '/profil', name: 'Profil', element: Profil },
                { path: '/login', name: 'Login', element: Login },
            ]
            break
        case 'penjoki':
            routes = [
                { path: '/dashboard', name: '', element: Dashboard },
                { path: '/transaksi', name: 'Transaksi', element: TransaksiList },
                {
                    path: '/transaksi/create',
                    name: 'Tambah Transaksi',
                    element: AddTransaksi,
                },
                {
                    path: '/transaksi/edit/:id',
                    name: 'Edit Transaksi',
                    element: EditTransaksi,
                },
                {
                    path: '/riwayat-transaksi',
                    name: 'Riwayat Transaksi',
                    element: RiwayatList,
                },
                {
                    path: '/leaderboard',
                    name: 'Leaderboard',
                    element: Leaderboard,
                },
                { path: '/profil', name: 'Profil', element: Profil },
                { path: '/login', name: 'Login', element: Login },
            ]
            break
        default:
            routes = [
                { path: '/dashboard', name: '', element: Dashboard },
                { path: '/users', name: 'User', element: UserList },
                { path: '/users/create', name: 'Tambah User', element: AddUser },
                { path: '/users/edit/:id', name: 'Edit User', element: EditUser },
                { path: '/transaksi', name: 'Transaksi', element: TransaksiList },
                {
                    path: '/transaksi/create',
                    name: 'Tambah Transaksi',
                    element: AddTransaksi,
                },
                {
                    path: '/transaksi/edit/:id',
                    name: 'Edit Transaksi',
                    element: EditTransaksi,
                },
                { path: '/login', name: 'Login', element: Login },
            ]
    }

    return routes
}

const routes = getRoutes()

export default routes
