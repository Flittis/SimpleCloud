import Config from '../../Config'

import React, { useContext } from 'react'

import Tip from '@tippyjs/react'

import { Context } from '../../index.js'
import { observer } from 'mobx-react-lite'

import { Icon_Lock, Icon_Delete_Red, Icon_Edit, Icon_Document, Icon_Video, Icon_Image, Icon_Audio, Icon_Archive, Icon_Book, Icon_Download, Icon_Share, Icon_Access } from '../../Assets/img/Main/index.js'

let FileOverlay = () => {
    let { Service } = useContext(Context)

    let { _id, name, type, mimetype, user, access } = Service.file

    let handleCopy = _ => {
        navigator.clipboard.writeText(`${Config.MAIN_DOMAIN}/api/cloud/download/${user}/${_id}`)
            .then(r => Service.snackbar('Link copied to clipboard', 'info', 'content_copy'))
            .catch(e => Service.snackbar('Unable to copy link to clipboard', 'error'))
    }
    let handleDelete = _ => Service.delete(Service.file).then(r => Service.setFile(null))
    let handleFileEdit = _ => Service.setIsEditing(true)

    let Icon = Icon_Document

    if (mimetype.startsWith('image/')) Icon = Icon_Image
    else if (mimetype.startsWith('audio/')) Icon = Icon_Audio
    else if (mimetype.startsWith('video/')) Icon = Icon_Video
    else if (['application/zip', 'application/x-7z-compressed', 'application/vnd.rar'].includes(mimetype)) Icon = Icon_Archive
    else if (['application/pdf', 'application/epub+zip'].includes(mimetype)) Icon = Icon_Book

    let Preview = (
        <column align='center'>
            <img className='content__preview-icon' src={Icon} alt={type} loading='lazy' />
            <h5>This file type in unsupported for preview</h5>
        </column>
    )

    if (['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(mimetype)) 
        Preview = <img className='content__preview-preview' src={`${Config.SERVER_URL}/api/cloud/download/${user}/${_id}?preview=true${access.password ? '&password=' + access.password : ''}`} alt={name} loading='lazy' />
    else if (['video/mp4', 'video/webm'].includes(mimetype))
        Preview = <video className='content__preview-preview' src={`${Config.SERVER_URL}/api/cloud/download/${user}/${_id}?preview=true${access.password ? '&password=' + access.password : ''}`} controls />
    else if (['application/pdf'].includes(mimetype))
        Preview = <iframe className='content__preview-preview' src={`${Config.SERVER_URL}/api/cloud/download/${user}/${_id}?preview=true${access.password ? '&password=' + access.password : ''}`} title='PDF' />
    else if (['audio/mpeg', 'audio/ogg'].includes(mimetype))
        Preview = <audio className='content__preview-preview' src={`${Config.SERVER_URL}/api/cloud/download/${user}/${_id}?preview=true${access.password ? '&password=' + access.password : ''}`} type={mimetype} controls />
    else if (['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(mimetype))
        Preview = <iframe className='content__preview-preview' src={'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(`${Config.SERVER_URL}/api/cloud/download/${user}/${_id}?preview=true${access.password ? '&password=' + access.password : ''}`)} title='Viewer' />

    return (
        <div className='File__overlay'>
            <div className='File__overlay-backdrop' onClick={_ => Service.setFile(null)} />

            <div className='File__overlay-content'>
                <row className='content__top' justify='between'>
                    <column>
                        <row>
                            {
                                access.access_type === 'private' &&
                                <Tip content='File is private'>
                                    <img className='content__top-lock' src={Icon_Lock} alt='private' />
                                </Tip>
                            }
                            {
                                access.password &&
                                <Tip content='File is protected by password'>
                                    <img className='content__top-lock' src={Icon_Access} alt='password' />
                                </Tip>
                            }
                            <h4 className='content__top-title'>{name}</h4>
                        </row>
                        {/* <h5 className='content__top-size'>{formatBytes(size)}</h5> */}
                    </column>

                    <row className='content__top-actions'>
                        <Tip content='Edit' placement='bottom'>
                            <div className='content__action' onClick={handleFileEdit}>
                                <img src={Icon_Edit} className='content__action-image' alt='edit' />
                            </div>
                        </Tip>
                        <Tip content='Share' placement='bottom'>
                            <div className='content__action' onClick={handleCopy}>
                                <img src={Icon_Share} className='content__action-image' alt='share' />
                            </div>
                        </Tip>
                        <Tip content='Download' placement='bottom'>
                            <a className='content__action' href={`${Config.MAIN_DOMAIN}/api/cloud/download/${user}/${_id}${access.password ? '?password=' + access.password : ''}`} download>
                                <img src={Icon_Download} className='content__action-image' alt='download' />
                            </a>
                        </Tip>
                        <Tip content='Delete' placement='bottom'>
                            <div className='content__action' onClick={handleDelete}>
                                <img src={Icon_Delete_Red} className='content__action-image' alt='delete' />
                            </div>
                        </Tip>
                    </row>
                </row>

                <div className='content__preview'>
                    { Preview }
                </div>
            </div>
        </div>
    )
}

export default observer(FileOverlay)