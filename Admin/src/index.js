/* Modules */

import React, { createContext } from 'react'
import ReactDOM from 'react-dom'

import _Store from './Modules/Store/UserStore.js'

import App from './App'
import Icons from './Modules/Views/Global/Icons'

import 'izitoast/dist/css/iziToast.min.css'
import './SCSS/components.scss'
import './SCSS/main.scss'

/* Views */

export let Service = new _Store()
export let Context = createContext({ Service })

function Index() {
    return (
        <Context.Provider value={{ Service }}>
            <Icons />

            <App />
        </Context.Provider>
    )
}

/* Render */

ReactDOM.render(<Index />, document.getElementById('app'))
