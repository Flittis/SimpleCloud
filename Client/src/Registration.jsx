import React, { useContext, useEffect, useState } from 'react'

import './Styles/Registration.scss'
import Textfield from './Components/Textfield.jsx'
import Button from '@mui/material/Button'
import Footer from './Components/Footer'
import { Context } from './index.js'
import { observer } from 'mobx-react-lite'

function Registration() {
    let { Service } = useContext(Context)

    let [name, setName] = useState('')
    let [password, setPassword] = useState('')
    let [repeatPassword, setRepeatPassword] = useState('')
    let [error, setError] = useState({ status: false, message: '' })

    useEffect(() => setError({ status: false, message: '' }), [name, password, repeatPassword])

    let register = _ => {
        if (!name) return setError({ status: true, message: 'name empty' })
        if (!password) return setError({ status: true, message: 'password empty' })
        if (password !== repeatPassword) return setError({ status: true, message: 'password dont match' })
        if (name.length < 5 || password.length < 5) return setError({ status: true, message: 'Length must be more than 5 symbols' })

        Service.register(name, password)
            .then(_ => {
                Service.snackbar('Registered successfully')
                
                Service.login(name, password)
                    .then(r => window.location.href = '/')
                    .catch(e => setError({ status: true, message: e.error_message || e.error_description || 'Unknown error' }))
            })
            .catch(err => setError({ status: true, message: err.error_message || err.error_description || 'Unknown error' }))
    }

    let handleKeyDown = (event) => event.keyCode === 13 && register()

    return (
        <div className="Registration">
            <div className="main-div">
                <h1>Registration</h1>

                <form>
                    <Textfield type="text" placeholder="Login" value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKeyDown} />
                    <Textfield type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
                    <Textfield type="password" placeholder="Repeat password" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} onKeyDown={handleKeyDown} />

                    {error.status && <p style={{ color: '#EB645D' }}>{error.message}</p>}

                    <Button variant="outlined" onClick={register}>REGISTER</Button>
                </form>
            </div>

            <Footer />
        </div>
    )
}

export default observer(Registration)
