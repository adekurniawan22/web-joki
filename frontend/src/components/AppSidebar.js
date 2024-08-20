import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    CCloseButton,
    CSidebar,
    CSidebarFooter,
    CSidebarHeader,
    CSidebarToggler,
} from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import logo from '../../src/assets/images/logo.png'
import _nav from '../_nav'

const defaultMenu = ['Akun', 'Profil', 'Logout']
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
        const userRole = localStorage.getItem('role')
        setRole(userRole)
    }, [])

    const navigation = _nav.filter((item) => {
        if (roleBasedMenu[role]) {
            return roleBasedMenu[role].includes(item.name) || defaultMenu.includes(item.name)
        }
        return defaultMenu.includes(item.name)
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
                <div className="d-flex justify-content-center align-items-center">
                    <img src={logo} alt="" height={40} />
                    <span className="ms-2 d-inline-block" style={{ fontSize: '1.5em' }}>
                        JOKI PRO
                    </span>
                </div>
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
