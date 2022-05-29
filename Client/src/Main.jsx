import React, { useContext, useEffect, useState } from 'react'

import { Context } from './index.js'
import { observer } from 'mobx-react-lite'

import './Styles/Components.scss'
import './Styles/Main.scss'
import Navigation from './Components/Main/Navigation.jsx'
import FileBlock from './Components/Main/FileBlock.jsx'
import { useParams } from 'react-router-dom'

let Main = () => {
    let { Service } = useContext(Context)
    
    let { folder } = useParams()
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(null)
    
    useEffect(() => {
        setLoading(true)
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
    }, [Service, folder, Service.fetchParams.sort])
    
    return (
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
                    <row className='Content__section-error' align='center' justify='center'>
                        <h3> Folder is empty </h3>
                    </row>
                }              
            </section>
        </Navigation>
    )
}

export default observer(Main)
