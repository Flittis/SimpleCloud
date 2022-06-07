import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import Tippy from '@tippyjs/react/headless'
import Button from '@mui/material/Button'
import cloud from '../Assets/img/icloud.svg'

import { Context } from '../index.js'
import { observer } from 'mobx-react-lite'
import { Icon_Logout } from '../Assets/img/Main'

function Header() {
    let { Service } = useContext(Context)

    let [modalShow, setModalShow] = useState(false)

    return (
        <div className='header'>
            <div className='header_left'>
                <Link to='/'>
                    <div className='header_left-logo'>
                        <img className='logo' src={cloud} alt='logo' />
                        <h4 className='text_logo'>SimpleCloud</h4>
                    </div>
                </Link>
            </div>

            <div className='header_right'>
                {Service.isAuth === true && Service.user?.name ? (
                    <Tippy 
                        placement='bottom-end' 
                        interactive={true} 
                        visible={modalShow} 
                        onClickOutside={_ => setModalShow(false)} 
                        render={_ => <UserModal {...{setModalShow}} /> }
                        
                    >
                        <div className='user' onClick={e => setModalShow(!modalShow)}>
                            <h5 className='user__name'> {Service.user?.name || 'Undefined'} </h5>

                            <div className='user__image'> <p>{Service.user?.name[0]}</p> </div>
                        </div>
                    </Tippy>
                ) : (
                    <>
                        <div className='btn' id='auth'>
                            <Link to='/login'>
                                <Button variant='contained'> AUTHORIZATION </Button>
                            </Link>
                        </div>
                        <div className='btn' id='reg'>
                            <Link to='/register'>
                                <Button variant='contained'> REGISTRATION </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

let UserModal = ({ setModalShow }) => {
    let { Service } = useContext(Context)

    let handleLogout = _ => {
        setModalShow(false); 
        Service.logout()
            .then(r => window.location.href = '/')
            .catch(e => Service.snackbar('Logout error'))
    }

    return (
        <block className='User__modal'>
            <row className='modal__row logout' onClick={ handleLogout }>
                <p className='modal__row-title'>Logout</p>
                <img className='modal__row-icon' src={Icon_Logout} alt='delete'/>
            </row>
        </block>
    )
}


export default observer(Header)
