import React, { useContext, useEffect, useState } from 'react'

import { Context } from './index.js'
import { observer } from 'mobx-react-lite'
import { Routes, Route, Navigate } from 'react-router-dom'

import Landing from './Landing.jsx'
import Header from './Components/Header.jsx'
import Main from './Main.jsx'
import Authorization from './Authorization.jsx'
import Registration from './Registration.jsx'

function App() {
    let [error, setError] = useState({ status: false, message: '' })

    let { Service } = useContext(Context);

    useEffect(() => {
        async function fetchUser() {
            await Service.checkAuth()
                .catch(err => {
                    if (!err.error) setError({ status: true, message: `Can't connect to the server` })
                })
        }

        fetchUser()
    }, [Service])

    if (Service.isLoading || Service.isAuth === undefined) document.querySelector('#app').classList.add('loading')
    else document.querySelector('#app').classList.remove('loading')

    if (error?.status === true) return <h1>{error.message}</h1>

    return (
        <>
            <Header isAuth={Service.isAuth} user={Service.user} />
            <Routes>
                {
                    Service.isAuth ?
                    <>
                        <Route path='/login' element={<Navigate to='/' replace />} />
                        <Route path='/register' element={<Navigate to='/' replace />} />
                        <Route path='/o/:folder' element={<Main />} /> 
                        <Route path='*' element={<Main/>} /> 
                    </> :
                    <>
                        <Route path='/' element={<Landing />} /> 
                        <Route path='/login' element={<Authorization />} />
                        <Route path='/register' element={<Registration />} />
                    </>
                }
            </Routes>
        </>
    )
}

export default observer(App)
