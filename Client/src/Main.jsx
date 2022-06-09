import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Context } from './index.js'
import { observer } from 'mobx-react-lite'

import { Icon_CloudError } from './Assets/img/Main/index.js'

import './Styles/Components.scss'
import './Styles/Main.scss'

import Navigation from './Components/Main/Navigation.jsx'
import FileBlock from './Components/Main/FileBlock.jsx'
import ErrorPage from './Components/Error.jsx'
import FileOverlay from './Components/Main/FileOverlay.jsx'
import EditModal from './Components/Main/EditModal.jsx'

let Main = () => {
    let { Service } = useContext(Context)
    
    let { folder, file } = useParams()
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(null)
    
    useEffect(() => {
        if (!file) setLoading(true)
        Service.setFetchParams({ parent: folder || 'undefined' })

        async function fetchData() {
            if (folder) {
                Service.getData({ _id: folder, parent: null, type: 'folder' }, false)
                    .then(r => {
                        Service.setFolder(r[0])

                        Service.getData()
                            .then(r => setErr(null))
                            .catch(e => setErr(e?.error?.error_message || e?.error?.error_description || 'Unknown error')) 
                            .finally(_ => setLoading(false))
                    })
                    .catch(e => setErr(e?.error?.error_message || e?.error?.error_description || 'Folder not found'))
            } else {
                Service.setFolder(null)

                Service.getData()
                    .then(r => setErr(null))
                    .catch(e => setErr(e?.error?.error_message || e?.error?.error_description || 'Unknown error')) 
                    .finally(_ => setLoading(false))
            } 
        }

        fetchData()
    }, [Service, folder, file, Service.fetchParams.sort])

    if (Service.isAuth === false) return window.location.href = '/'
    
    return (
        <>
            { Service.file?._id && Service.file?.type === 'file' && <FileOverlay /> }
            { Service.isEditing && <EditModal show={true} /> }

            <Navigation {...{loading, err}}>
                <section className='Content__section'>
                    {
                        Service.data?.length ?
                        <div className='Content__section-content'>
                            { 
                                Service.data
                                    .filter(el => el.name.toLowerCase().replace(/%s/g, '').indexOf(Service.search.toLowerCase().replace(/%s/g, '')) > -1)
                                    .map(el => <FileBlock key={el._id} File={el} search={Service.search} />)
                            }
                        </div> :
                        <ErrorPage err='Folder is empty' icon={Icon_CloudError} fullscreen={false} />
                    }              
                </section>
            </Navigation>
        </>
    )
}

export default observer(Main)
