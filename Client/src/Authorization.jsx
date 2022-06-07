import React, { useContext, useEffect, useState } from 'react'

import { Context } from './index.js'
import { observer } from 'mobx-react-lite'

import './Styles/Authorization.scss'
import Textfield from './Components/Textfield.jsx'
import Button from '@mui/material/Button'
import Footer from './Components/Footer'

function Authorization() {
    let { Service } = useContext(Context)

    let [name, setName] = useState('')
    let [password, setPassword] = useState('')
    let [error, setError] = useState({ status: false, message: '' })

    useEffect(() => setError({ status: false, message: '' }), [name, password])

    function login() {
        if (!name) return setError({ status: true, message: 'name empty' })
        if (!password) return setError({ status: true, message: 'password empty' })
        if (name.length < 5 || password.length < 5) return setError({ status: true, message: 'Length must be more than 5 symbols' })

        Service.login(name, password)
            .then(() => {
                Service.snackbar('Logged in successfully')
                window.location.href = '/'
            })
            .catch(err => setError({ status: true, message: err.error_message || err.error_description }))
    }
    
    let handleKeyDown = (event) => event.keyCode === 13 && login()

    return (
        <div className="Authorization">
            <div className="main-div">
                <h1>Authorization</h1>

                <form>
                    <Textfield type="text" placeholder="Login" value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKeyDown} />
                    <Textfield type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} />

                    {error.status && <p style={{ color: '#EB645D' }}>{error.message}</p>}

                    <Button variant="outlined" onClick={login}>LOG IN</Button>
                </form>
            </div>

            <Footer />
        </div>
    )
}

export default observer(Authorization)
