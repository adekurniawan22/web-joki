import React from 'react'
import { useLocation } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
    const currentLocation = useLocation().pathname

    // Helper function to match route name, ignoring dynamic segments
    const getRouteName = (pathname, routes) => {
        const normalizedPath = pathname.split('/').filter(Boolean).slice(0, -1).join('/')
        const currentRoute = routes.find((route) => {
            const routePath = route.path.split('/').filter(Boolean)
            const pathSegments = pathname.split('/').filter(Boolean)

            // Check if route matches pathname considering dynamic segments
            if (routePath.length !== pathSegments.length) {
                return false
            }

            return routePath.every((segment, index) => {
                return segment.startsWith(':') || segment === pathSegments[index]
            })
        })
        return currentRoute ? currentRoute.name : false
    }

    const getBreadcrumbs = (location) => {
        const breadcrumbs = []
        location.split('/').reduce((prev, curr, index, array) => {
            const currentPathname = `${prev}/${curr}`.replace(/\/+$/, '') // Trim trailing slashes
            const routeName = getRouteName(currentPathname, routes)
            if (routeName) {
                breadcrumbs.push({
                    pathname: currentPathname,
                    name: routeName,
                    active: index + 1 === array.length,
                })
            }
            return currentPathname
        })
        return breadcrumbs
    }

    const breadcrumbs = getBreadcrumbs(currentLocation)

    return (
        <CBreadcrumb className="my-0">
            <CBreadcrumbItem href="/dashboard">Home</CBreadcrumbItem>
            {breadcrumbs.map((breadcrumb, index) => (
                <CBreadcrumbItem
                    {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
                    key={index}
                >
                    {breadcrumb.name}
                </CBreadcrumbItem>
            ))}
        </CBreadcrumb>
    )
}

export default React.memo(AppBreadcrumb)
