import React from 'react'

import Button from '@mui/material/Button'

import cloud from '../Assets/img/icloud.svg'

import { Link } from 'react-router-dom'

function Header({ isAuth, user }) {
    return (
        <div className="header">
          <Link to="/">
            <div className="header_left">
                <img className="logo" src={cloud} alt="logo" />
                <h3 className="text_logo">SimpleCloud</h3>
            </div>
          </Link>
            <div class="header_right">
                {
                    isAuth ?
                    <div className="user">
                        <h4 className="user__name">{user?.name || 'Undefined'}</h4>

                        <div className="user__image">
                            <h5>{user?.name[0]}</h5>
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

export default Header;
