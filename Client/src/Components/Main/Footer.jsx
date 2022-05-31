import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import { Context } from '../../index.js'
import { observer } from 'mobx-react-lite'

let Footer = () => {
    let { Service } = useContext(Context)

    return (
        <footer className='Main__footer'>
            <row className='footer__wrapper' align='center' justify='start'>
                <row className='footer__breadcrumb'>
                    <Link to='/'>
                        <h5 className='footer__breadcrumb-page'>Main</h5>
                    </Link>
                    {
                        Service.folder?._id &&
                        <>
                            {
                                (
                                    Service.folder.parent &&
                                    <>
                                        { Service.folder.parent?.parent && <a><h5 className='footer__breadcrumb-page'>...</h5></a> }
                                        <Link to={`/o/${Service.folder.parent._id}`}>
                                            <h5 className='footer__breadcrumb-page'>{Service.folder.parent.name}</h5>
                                        </Link>
                                    </>
                                )
                            }
                            <Link to={`/o/${Service.folder._id}`}>
                                <h5 className='footer__breadcrumb-page'>{Service.folder.name}</h5>
                            </Link>
                        </>
                    }
                </row>
            </row>
        </footer>
    )
}

export default observer(Footer)
