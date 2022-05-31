import React from 'react'
import Button from './Button'

let ErrorPage = ({ err, icon, fullscreen, button }) => {
    return (
        <error className={ fullscreen ? 'fullscreen' : '' }>
            <img src={icon} alt='error'/>
            <h3> { err || 'Unknown error' } </h3>
            {button?.show && <a style={{ marginTop: '1.5em' }} href={ button.link || '/' }><Button color='secondary' label={ button.label || 'Home' }/></a>}
        </error>
    )
}

export default ErrorPage;