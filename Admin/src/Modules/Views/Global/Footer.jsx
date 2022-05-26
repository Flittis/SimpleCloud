import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className='footer'>
            <row className='footer__wrapper' align='center' justify='start'>
                <row className='footer__breadcrumb'>
                    <Link to='/'>
                        <h5 className='footer__breadcrumb-page'>Admin</h5>
                    </Link>
                    <h5 className='footer__breadcrumb-separator'>></h5>
                    <h5 className='footer__breadcrumb-page'>Dashboard</h5>
                </row>
            </row>
        </footer>
    )
}

export default Footer
