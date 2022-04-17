import React, { createContext } from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import _Store from './Store/UserStore.js'

export let Service = new _Store();
export let Context = createContext({ Service });

ReactDOM.render(
	<Context.Provider value={{ Service }}>
		<App />
	</Context.Provider>, 
	document.getElementById('app')
);
