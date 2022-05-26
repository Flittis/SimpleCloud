import React from 'react'
import { Button } from 'flitui'

let ErrorPage = ({ err, icon, fullscreen, button }) => {
    return (
        <error className={ fullscreen ? 'fullscreen' : '' }>
            <icon> 
                <svg viewBox="0 0 28 28"> <use href={ icon ? '#' + icon : '#icon_cloud_error' } fill="currentColor"/> </svg>
            </icon>
            <h3> { err || 'Unknown error' } </h3>
            {button?.show && <a style={{ marginTop: '1.5em' }} href={ button.link || '/' }><Button color='secondary' label={ button.label || 'Home' }/></a>}
        </error>
    )
}

export default ErrorPage;