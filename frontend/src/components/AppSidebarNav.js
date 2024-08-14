import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import {
    CBadge,
    CNavLink,
    CSidebarNav,
    CModal,
    CModalBody,
    CModalFooter,
    CButton,
} from '@coreui/react'

export const AppSidebarNav = ({ items }) => {
    const [showModal, setShowModal] = useState(false)
    const [redirectTo, setRedirectTo] = useState('')
    const navigate = useNavigate()

    const handleLogoutClick = (e, to) => {
        e.preventDefault() // Mencegah navigasi default
        setRedirectTo(to)
        setShowModal(true)
    }

    const handleConfirmLogout = () => {
        setShowModal(false)
        navigate(redirectTo)
    }

    const handleCancelLogout = () => {
        setShowModal(false)
    }

    const navLink = (name, icon, badge, indent = false) => {
        return (
            <>
                {icon
                    ? icon
                    : indent && (
                          <span className="nav-icon">
                              <span className="nav-icon-bullet"></span>
                          </span>
                      )}
                {name && name}
                {badge && (
                    <CBadge color={badge.color} className="ms-auto">
                        {badge.text}
                    </CBadge>
                )}
            </>
        )
    }

    const navItem = (item, index, indent = false) => {
        const { component, name, badge, icon, ...rest } = item
        const Component = component

        return (
            <Component as="div" key={index}>
                {rest.to || rest.href ? (
                    <CNavLink
                        {...(rest.to && { as: NavLink })}
                        {...rest}
                        onClick={(e) => (name === 'Logout' ? handleLogoutClick(e, rest.to) : null)}
                    >
                        {navLink(name, icon, badge, indent)}
                    </CNavLink>
                ) : (
                    navLink(name, icon, badge, indent)
                )}
            </Component>
        )
    }

    const navGroup = (item, index) => {
        const { component, name, icon, items, to, ...rest } = item
        const Component = component
        return (
            <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
                {item.items?.map((item, index) =>
                    item.items ? navGroup(item, index) : navItem(item, index, true),
                )}
            </Component>
        )
    }

    return (
        <>
            <CSidebarNav as={SimpleBar}>
                {items &&
                    items.map((item, index) =>
                        item.items ? navGroup(item, index) : navItem(item, index),
                    )}
            </CSidebarNav>

            <CModal visible={showModal} onClose={() => setShowModal(false)}>
                <CModalBody>Apakah Anda yakin ingin logout?</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCancelLogout}>
                        Batal
                    </CButton>
                    <CButton color="primary" onClick={handleConfirmLogout}>
                        Konfirmasi
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

AppSidebarNav.propTypes = {
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
