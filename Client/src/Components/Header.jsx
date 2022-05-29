import React from 'react'
import { Link } from 'react-router-dom'

import Button from '@mui/material/Button'
import cloud from '../Assets/img/icloud.svg'

function Header({ isAuth, user }) {
    return (
        <div className="header">
            <div className="header_left">
                <Link to="/">
                    <div className='header_left-logo'>
                        <img className="logo" src={cloud} alt="logo" />
                        <h4 className="text_logo">SimpleCloud</h4>
                    </div>
                </Link>
                {
                    isAuth &&
                    <div className='header_left-search'>
                        
                    </div>
                }
            </div>
                

            <div class="header_right">
                {
                    isAuth ?
                        <div className="user">
                            <h5 className="user__name">{user?.name || 'Undefined'}</h5>

                            <div className="user__image">
                                <p>{user?.name[0]}</p>
                            </div>
                        </div> :
                        <>
                            <div className="btn" id="auth">
                                <Link to="/login">
                                    <Button variant="contained">AUTHORIZATION</Button>
                                </Link>
                            </div>
                            <div className="btn" id="reg">
                                <Link to="/register">
                                    <Button variant="contained">REGISTRATION</Button>
                                </Link>
                            </div>
                        </>
                }

            </div>
        </div>
    )
}

export default Header
