import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Logout = React.lazy(() => import('./views/pages/logout/Logout'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
    const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
    const storedTheme = useSelector((state) => state.theme)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.href.split('?')[1])
        const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
        if (theme) {
            setColorMode(theme)
        }

        if (isColorModeSet()) {
            return
        }

        setColorMode(storedTheme)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <BrowserRouter basename="/web-joki">
            <Suspense
                fallback={
                    <div className="pt-3 text-center">
                        <CSpinner color="primary" variant="grow" />
                    </div>
                }
            >
                <Routes>
                    <Route exact path="/" name="Login Page" element={<Login />} />
                    <Route exact path="/login" name="Login Page" element={<Login />} />
                    <Route exact path="/500" name="Page 500" element={<Page500 />} />
                    <Route exact path="/logout" name="Logout" element={<Logout />} />
                    <Route exact path="*" name="Home" element={<DefaultLayout />} />
                </Routes>
            </Suspense>
            <ToastContainer />
        </BrowserRouter>
    )
}

export default App
