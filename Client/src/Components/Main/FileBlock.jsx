import Config from '../../Config'

import React, { useState, useContext } from 'react'
import Tippy from '@tippyjs/react/headless'
import { Link } from 'react-router-dom'

import { Context } from '../../index.js'
import { observer } from 'mobx-react-lite'

import { Icon_Folder, Icon_Document, Icon_Video, Icon_Image, Icon_Audio, Icon_Archive, Icon_Book, Icon_Delete_Red, Icon_Access, Icon_Share, Icon_Download } from '../../Assets/img/Main'

let FileBlock = ({ File }) => {
    let { Service } = useContext(Context)

    let { _id, name, type, mimetype, user, size, childs } = File

    let [contextShow, setContextShow] = useState(false)
    let handleCopy = (e) => {
        navigator.clipboard.writeText(`${Config.MAIN_DOMAIN}/api/cloud/download/${user}/${_id}`)
            .then(r => Service.snackbar('Link copied to clipboard', 'info', 'content_copy'))
            .err(e => Service.snackbar('Unable to copy link to clipboard', 'error'))
    }

    let Icon = Icon_Document
    let FileModal = () => {
        return (
            <block className='File__context'>
                {
                    type === 'file' &&
                    <>
                        <a href={`${Config.MAIN_DOMAIN}/api/cloud/download/${user}/${_id}`} download className='context__row'>
                            <img className='context__row-icon' src={Icon_Download} alt='download'/>
                            <p className='context__row-title'>Download</p>
                        </a>
                        <row className='context__row' onClick={handleCopy}>
                            <img className='context__row-icon' src={Icon_Share} alt='share'/>
                            <p className='context__row-title'>Copy link</p>
                        </row>
                        <row className='context__row'>
                            <img className='context__row-icon' src={Icon_Access} alt='access'/>
                            <p className='context__row-title'>Access</p>
                        </row>
                    </>
                }
                <row className='context__row delete' onClick={e => { setContextShow(false); Service.delete(File) }}>
                    <img className='context__row-icon' src={Icon_Delete_Red} alt='delete'/>
                    <p className='context__row-title'>Delete</p>
                </row>
            </block>
        )
    }

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
            render={_ => <FileModal /> }
        >
            <Link to={type === 'folder' ? `/o/${_id}` : `/f/${_id}`} onContextMenu={e => { e.preventDefault(); setContextShow(!contextShow) } }>
                <block className='content__block'>
                    {
                        ['image/png', 'image/jpeg', 'image/webp'].includes(mimetype) ?
                            <img className='content__block-preview' src={`${Config.SERVER_URL}/api/cloud/download/${user}/${_id}`} alt={name} loading='lazy' /> :
                            <img className='content__block-icon' src={Icon} alt={type} loading='lazy' />
                    }

                    <div className='content__block-meta'>
                        <h5 className='meta__title' title={name}>{name}</h5>
                        <p className='meta__size'>{ type === 'folder' ? `${childs.length} files` : formatBytes(size)}</p>
                    </div>
                </block>
            </Link>
        </Tippy>
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
