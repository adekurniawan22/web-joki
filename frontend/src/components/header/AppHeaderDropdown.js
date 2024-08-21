import React from 'react'
import { CAvatar, CDropdown, CDropdownToggle } from '@coreui/react'
import user from '../../assets/images/user.jpg'

const AppHeaderDropdown = () => {
    return (
        <CDropdown variant="nav-item">
            <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
                <CAvatar src={user} size="md" style={{ border: '1px solid black' }} />
            </CDropdownToggle>
        </CDropdown>
    )
}

export default AppHeaderDropdown
