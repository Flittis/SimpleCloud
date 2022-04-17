import React, { useContext, useEffect, useState } from 'react'

import { Context } from './index.js'
import { observer } from 'mobx-react-lite'

import Landing from './Landing.jsx'
import Header from './Components/Header.jsx'
import Main from './Main.jsx'

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

        fetchUser();
    }, [Service])

    if (Service.isLoading || Service.isAuth === undefined) document.querySelector('#app').classList.add('loading');
    else document.querySelector('#app').classList.remove('loading');

    if (error?.status === true) return <h1>{error.message}</h1>

    return (
        <>
            <Header isAuth={Service.isAuth} user={Service.user}/>
            {
                Service.isAuth ?
                <Main /> :
                <Landing />
            }
        </>
    );
}

export default observer(App);
