import Config from './Config.js'
import ErrorPage from './Modules/Views/Global/Error'

import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { observer } from 'mobx-react-lite'
import { Context } from './index.js'

import Header from './Modules/Views/Global/Header.jsx'
import Dashboard from './Modules/Views/Admin/Dashboard.jsx'
import Sidebar from './Modules/Views/Global/Sidebar.jsx'
import Footer from './Modules/Views/Global/Footer.jsx'

let App = () => {
    let { Service } = useContext(Context)
    
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState({ status: false, message: '', icon: '' });

    useEffect(() => {
        async function fetchUser() {
            await Service.checkAuth().catch((err) => {
                if (!err.status) Service.setError( `Can't connect to the server`, 'icon_connection_error' )
            })
        }

        fetchUser()
    }, [Service, Service.isOnline])

    if (Service.isLoading || Service.isAuth === undefined) document.querySelector('#app').classList.add('loading')
    else document.querySelector('#app').classList.remove('loading')

    if (Service.error?.status === true) return <ErrorPage err={Service.error?.message} icon={Service.error?.icon} button={Service.error?.button} fullscreen={true} />

    if (Service.isAuth === false) return (window.location.href = Config.MAIN_DOMAIN)
    if (Service.user?.role !== 'Admin') return <ErrorPage err="You don't have access to this service" icon='icon_locked' />

    return (
        <BrowserRouter>
            <Header user={Service?.user} />

            <span className='app__wrapper'>
                <Sidebar />

                <div className={`app__content${loading ? ' loading' : ''}`}>
                    <Routes>
                        <Route index element={ err?.status === true ? <ErrorPage err={err?.message} icon={err?.icon} /> : <Dashboard {...{setLoading, setErr}} />} />

                        <Route path='*' element={<Navigate to='/' replace />} />
                    </Routes>
                </div>

                <Footer />
            </span>
        </BrowserRouter>
    )
}

export default observer(App)
