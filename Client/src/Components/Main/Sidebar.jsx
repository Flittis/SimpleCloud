import React, { useContext, useState } from 'react'
import Tippy from '@tippyjs/react/headless'

import { Context } from '../../index.js'
import { observer } from 'mobx-react-lite'

import { Icon_FolderCreate, Icon_FolderCreate_White, Icon_Search, Icon_Upload } from '../../Assets/img/Main'
import Textfield from '../Textfield.jsx'
import Button from '../Button.jsx'

let SortNames = { name: 'Name', created_at: 'Date', size: 'Size' }

let Sidebar = () => {
    let { Service } = useContext(Context)

    let [search, setSearch] = useState('')
    let [sortModalVisible, setSortVisible] = useState(false)
    let [createFolderVisible, setCreateFolderVisible] = useState(false)

    let handleChange = (e) => {
        setSearch(e.target.value)
        Service.setSearch(e.target.value)
    }

    return (
        <aside className='Main__sidebar'>
            <div className='Main__sidebar-content'>
                <block className='sidebar__block sidebar__block-search'>
                    <Textfield value={search} onChange={handleChange} className='sidebar__search' trailing={<img className='f-textfield__trailing' src={Icon_Search} alt=''/>} placeholder='Search...' />
                </block>

                <block className='sidebar__block sidebar__block-create'>
                    <label className='block__row' htmlFor='fileSelect'>
                        <img className='block__row-icon' src={Icon_Upload} alt='upload'/>
                        <h5 className='block__row-title'>Upload</h5>

                        <input id='fileSelect' type='file' name='file' onChange={e => Service.upload(e.target.files[0])} />
                    </label>
                    <Tippy placement='bottom' interactive={true} visible={createFolderVisible} onClickOutside={e => setCreateFolderVisible(false)} render={attr => <CreateFolderModal {...{setCreateFolderVisible}} />}>
                        <row className='block__row' onClick={e => setCreateFolderVisible(!createFolderVisible)}>
                            <img className='block__row-icon' src={Icon_FolderCreate} alt='createfolder'/>
                            <h5 className='block__row-title'>Create Folder</h5>
                        </row>
                    </Tippy>
                </block>

                <block className='sidebar__block sidebar__block-sort'>
                    <h5 className='sort__title'>Sort by </h5>
                    <Tippy placement='bottom-start' interactive={true} visible={sortModalVisible} onClickOutside={e => setSortVisible(false)} render={attr => <SortModal {...{setSortVisible}} />}>
                        <h5 className='sort__query' onClick={e => setSortVisible(!sortModalVisible)}>{SortNames[Service.fetchParams.sort]}</h5>
                    </Tippy>
                </block>

                <block className='sidebar__block sidebar__block-progress'>
                    <div className='space__progress'>
                        <div className='space__progress-track' style={{ width: `${((Service.user?.space_used / Service.user?.space_limit) * 100).toFixed(2)}%` }} />
                    </div>
                    
                    <div className='space__size'>
                        <h5 className='space__size-used'>{(Service.user?.space_used / (1024 * 1024 * 1024)).toFixed(2)}GB</h5>
                        <p className='space__size-between'>used of</p>
                        <h5 className='space__size-total'>{(Service.user?.space_limit / (1024 * 1024 * 1024)).toFixed(2)}GB</h5>
                    </div>
                </block>
            </div>
        </aside>
    )
}

let SortModal = ({ setSortVisible }) => {
    let { Service } = useContext(Context)

    return (
        <block className='sidebar__sort-modal'>
            { 
                Object.keys(SortNames)
                    .filter(n => n !== Service.fetchParams.sort)
                    .map(el => <h5 key={el} className='sidebar__sort-option' onClick={e => { Service.setFetchParams({ sort: el }); setSortVisible(false) }}>{SortNames[el]}</h5>)
            }
        </block>
    )
}

let CreateFolderModal = ({ setCreateFolderVisible }) => {
    let { Service } = useContext(Context)

    let [folderName, setFolderName] = useState('')
    
    let handleClick = (e) => {
        Service.createFolder({ name: folderName })
        setCreateFolderVisible(false)
        setFolderName('')
    }

    let handleKeyDown = (event) => event.keyCode === 13 && handleClick()

    return (
        <block className='sidebar__folder-modal'>
            <Textfield value={folderName} onChange={e => setFolderName(e.target.value)} onKeyDown={handleKeyDown} placeholder='Name' />
            <Button icon={Icon_FolderCreate_White} onClick={handleClick} label='Create' />
        </block>
    )
}

export default observer(Sidebar)
