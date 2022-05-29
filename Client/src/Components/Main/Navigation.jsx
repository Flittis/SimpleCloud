import React from 'react'

import Footer from './Footer'
import Sidebar from './Sidebar'
import Uploader from './Uploader'

let Navigation = ({ children, loading, err }) => {
    return (
        <div className='Main'>
            <Sidebar />

            <div className='Main__wrapper'>
                <div className={`Main__content${loading ? ' loading' : ''}`}>
                    {
                        err !== null ?
                        <row justify='center' align='center' style={{ height: '100%' }}><h3>{err}</h3></row> :
                        children
                    }
                </div>
            </div>

            <Footer />
            
            <Uploader />
        </div>
    )
}

export default Navigation