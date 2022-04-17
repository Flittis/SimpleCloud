import React from 'react'

import Button from '@mui/material/Button'

import cloud from '../Assets/img/icloud.svg'

function Header({ isAuth, user }) {
    return (
        <div className="header">
            <div className="header_left">
                <img className="logo" src={cloud} alt="logo" />
                <h3 className="text_logo">SimpleCloud</h3>
            </div>
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
                            <Button variant="contained">AUTHORIZATION</Button>
                        </div>
                        <div className="btn" id="reg">
                            <Button variant="contained">REGISTRATION</Button>
                        </div>
                    </>
                }
                
            </div>
        </div>
    )
}

export default Header;