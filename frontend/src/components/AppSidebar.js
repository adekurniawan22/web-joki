// src/components/AppSidebar.js

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
    CCloseButton,
    CSidebar,
    CSidebarBrand,
    CSidebarFooter,
    CSidebarHeader,
    CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import _nav from '../_nav'

// Mendefinisikan menu default yang umum untuk semua role
const defaultMenu = ['Akun', 'Profil', 'Logout']

// Mendefinisikan menu khusus per role
const roleBasedMenu = {
    owner: ['Dashboard', 'User', 'Transaksi'],
    admin: ['Dashboard', 'Transaksi'],
    penjoki: ['Dashboard', 'Transaksi', 'Riwayat Transaksi', 'Leaderboard'],
}

const AppSidebar = () => {
    const dispatch = useDispatch()
    const unfoldable = useSelector((state) => state.sidebarUnfoldable)
    const sidebarShow = useSelector((state) => state.sidebarShow)
    const [role, setRole] = useState('')

    useEffect(() => {
        // Ambil role dari localStorage
        const userRole = localStorage.getItem('role')
        setRole(userRole)
    }, [])

    // Filter navigasi berdasarkan role
    const navigation = _nav.filter((item) => {
        if (roleBasedMenu[role]) {
            return roleBasedMenu[role].includes(item.name) || defaultMenu.includes(item.name)
        }
        return defaultMenu.includes(item.name) // Menampilkan menu default jika role tidak dikenali
    })

    return (
        <CSidebar
            className="border-end"
            colorScheme="dark"
            position="fixed"
            unfoldable={unfoldable}
            visible={sidebarShow}
            onVisibleChange={(visible) => {
                dispatch({ type: 'set', sidebarShow: visible })
            }}
        >
            <CSidebarHeader className="border-bottom">
                <CSidebarBrand to="/">
                    <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
                    <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
                </CSidebarBrand>
                <CCloseButton
                    className="d-lg-none"
                    dark
                    onClick={() => dispatch({ type: 'set', sidebarShow: false })}
                />
            </CSidebarHeader>
            <AppSidebarNav items={navigation} />
            <CSidebarFooter className="border-top d-none d-lg-flex">
                <CSidebarToggler
                    onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
                />
            </CSidebarFooter>
        </CSidebar>
    )
}

export default React.memo(AppSidebar)
