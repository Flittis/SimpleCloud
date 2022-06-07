import React, { useContext, useEffect, useState } from 'react'

import { Context } from './index.js'
import { observer } from 'mobx-react-lite'
import { Routes, Route, Navigate } from 'react-router-dom'

import Landing from './Landing.jsx'
import Header from './Components/Header.jsx'
import Main from './Main.jsx'
import Authorization from './Authorization.jsx'
import Registration from './Registration.jsx'
import ErrorPage from './Components/Error.jsx'

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

    if (Service.isAuth === undefined) return <></>
    if (error?.status === true) return <ErrorPage err={error.message} fullscreen={true} />

    return (
        <>
            <Header />
            <Routes>
                {
                    Service.isAuth === true ?
                    <>
                        <Route index element={<Main />} /> 
                        <Route path='/login' element={<Navigate to='/' replace />} />
                        <Route path='/register' element={<Navigate to='/' replace />} />
                        <Route path='/o/:folder' element={<Main />} /> 
                        <Route path='*' element={<Navigate to='/' replace />} /> 
                    </> :
                    <>
                        <Route index element={<Landing />} /> 
                        <Route path='/login' element={<Authorization />} />
                        <Route path='/register' element={<Registration />} />
                        <Route path='*' element={<Navigate to='/' replace />} /> 
                    </>
                }
            </Routes>
        </>
    )
}

export default observer(App)
