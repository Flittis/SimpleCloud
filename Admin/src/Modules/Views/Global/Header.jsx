import React from 'react'
import { Link } from 'react-router-dom'

import { cloud } from '../../Icons'

function Header({ user }) {
    return (
        <div className='header'>
            <Link to='/'>
                <div className='header_left'>
                    <img className='logo' src={cloud} alt='logo' />
                    <h3 className='text_logo'>SimpleCloud</h3>
                </div>
            </Link>

            <div className='header_right'>
                <div className='user'>
                    <h4 className='user__name'>{user?.name || 'Undefined'}</h4>

                    <div className='user__image'>
                        <h5>{user?.name[0]}</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
