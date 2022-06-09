import Config from '../../Config'

import React, { useState, useContext } from 'react'
import Tippy from '@tippyjs/react/headless'
import Tip from '@tippyjs/react'
import { Link } from 'react-router-dom'

import { Context } from '../../index.js'
import { observer } from 'mobx-react-lite'

import { Icon_Folder, Icon_Document, Icon_Video, Icon_Image, Icon_Audio, Icon_Archive, Icon_Book, Icon_Delete_Red, Icon_Share, Icon_Download, Icon_Edit, Icon_Lock, Icon_Access } from '../../Assets/img/Main'

let FileBlock = ({ File }) => {
    let { Service } = useContext(Context)

    let { _id, name, type, mimetype, user, size, childs, access } = File

    let [contextShow, setContextShow] = useState(false)
    let handleCopy = _ => {
        navigator.clipboard.writeText(`${Config.MAIN_DOMAIN}/api/cloud/download/${user}/${_id}`)
            .then(r => Service.snackbar('Link copied to clipboard', 'info', 'content_copy'))
            .catch(e => Service.snackbar('Unable to copy link to clipboard', 'error'))
    }
    let handleDelete = _ => {
        setContextShow(false); 
        Service.delete(File)
    }
    let handleFileOpen = _ => {
        Service.getData({ _id: _id }, false)
            .then(r => Service.setFile(r[0]))
            .catch(e => Service.snackbar(e?.error?.error_message || e?.error?.error_description || 'File open error', 'error'))
    }
    let handleFileEdit = _ => {
        Service.getData({ _id: _id }, false)
            .then(r => { 
                Service.setFile(r[0])
                Service.setIsEditing(true)
            })
            .catch(e => Service.snackbar(e?.error?.error_message || e?.error?.error_description || 'File open error', 'error'))
    }

    let Icon = Icon_Document

    if (type === 'folder') Icon = Icon_Folder
    else if (mimetype.startsWith('image/')) Icon = Icon_Image
    else if (mimetype.startsWith('audio/')) Icon = Icon_Audio
    else if (mimetype.startsWith('video/')) Icon = Icon_Video
    else if (['application/zip', 'application/x-7z-compressed', 'application/vnd.rar'].includes(mimetype)) Icon = Icon_Archive
    else if (['application/pdf', 'application/epub+zip'].includes(mimetype)) Icon = Icon_Book

    return (
        <Tippy 
            placement='bottom' 
            interactive={true} 
            visible={contextShow} 
            onClickOutside={_ => setContextShow(false)} 
            render={_ => <FileModal {...{_id, type, user, access, handleCopy, handleDelete, handleFileEdit}} /> }
        >
            <Link to={type === 'folder' ? `/o/${_id}` : `#`} onClick={e => (type === 'file' && handleFileOpen())} onContextMenu={e => { e.preventDefault(); setContextShow(!contextShow) } }>
                <block className='content__block'>
                    {
                        ['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(mimetype) ?
                            <img className='content__block-preview' src={`${Config.SERVER_URL}/api/cloud/download/${user}/${_id}?preview=true${access.password ? '&password=' + access.password : ''}`} alt={name} loading='lazy' /> :
                            <img className='content__block-icon' src={Icon} alt={type} loading='lazy' />
                    }

                    <div className='content__block-meta'>
                        <h5 className='meta__title' title={name}>{name}</h5>
                        <p className='meta__size'>{ type === 'folder' ? `${childs.length} files` : formatBytes(size)}</p>
                    </div>

                    <row className='content__block-icons'>
                        {
                            access.access_type === 'private' &&
                            <Tip content='File is private'>
                                <img className='meta__lock' src={Icon_Lock} alt='private' />
                            </Tip>
                        }
                        {
                            access.password &&
                            <Tip content='File is protected by password'>
                                <img className='meta__lock' src={Icon_Access} alt='password' />
                            </Tip>
                        }
                    </row>
                </block>
            </Link>
        </Tippy>
    )
}

let FileModal = ({ type, user, _id, access, handleDelete, handleCopy, handleFileEdit }) => {
    return (
        <block className='File__context'>
            <row className='context__row' onClick={handleFileEdit}>
                <img className='context__row-icon' src={Icon_Edit} alt='edit'/>
                <p className='context__row-title'>Edit</p>
            </row>
            {
                type === 'file' &&
                <>
                    <row className='context__row' onClick={handleCopy}>
                        <img className='context__row-icon' src={Icon_Share} alt='share'/>
                        <p className='context__row-title'>Share</p>
                    </row>
                    <a href={`${Config.MAIN_DOMAIN}/api/cloud/download/${user}/${_id}${access.password ? '?password=' + access.password : ''}`} download className='context__row'>
                        <img className='context__row-icon' src={Icon_Download} alt='download'/>
                        <p className='context__row-title'>Download</p>
                    </a>
                </>
            }
            <row className='context__row delete' onClick={handleDelete}>
                <img className='context__row-icon' src={Icon_Delete_Red} alt='delete'/>
                <p className='context__row-title'>Delete</p>
            </row>
        </block>
    )
}

let formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    let k = 1024, dm = decimals < 0 ? 0 : decimals,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

    let i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export default observer(FileBlock)
