// src/_nav.js

import React from 'react'
import CIcon from '@coreui/icons-react'
import {
    cilSpeedometer,
    cilPeople,
    cilSwapHorizontal,
    cilUser,
    cilAccountLogout,
    cilHistory,
    cilStar,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
    {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'User',
        to: 'users',
        icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Transaksi',
        to: '/transaksi',
        icon: <CIcon icon={cilSwapHorizontal} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Riwayat Transaksi',
        to: '/riwayat-transaksi',
        icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Leaderboard',
        to: '/leaderboard',
        icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    },
    {
        component: CNavTitle,
        name: 'Akun',
    },
    {
        component: CNavItem,
        name: 'Profil',
        to: '/profil',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
    {
        component: CNavItem,
        name: 'Logout',
        to: '/logout',
        icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
    },
]

export default _nav
