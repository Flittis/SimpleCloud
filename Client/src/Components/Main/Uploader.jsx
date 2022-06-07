import React, { useContext } from 'react'

import { Context } from '../../index.js'
import { observer } from 'mobx-react-lite'
import { Icon_Uploading, Icon_UploadingError, Icon_UploadingSuccess, Icon_Cross } from '../../Assets/img/Main/index.js'

let Uploader = () => {
    let { Service } = useContext(Context)

    let cancelUpload = id => Service.cancelUpload(id)

    return (
        <span className={`Uploader${Object.keys(Service.uploading).length ? ' show' : ''}`}>
            {
                Object.keys(Service.uploading)
                    .map(key => Service.uploading[key])
                    .map(el => <UploadingBlock key={el.name} {...el} cancelUpload={cancelUpload} />)
            }
        </span>   
    )
}

let UploadingBlock = ({ id, status, name, size, progress, hide, cancelUpload }) => {
    let Icon;

    switch(status) {
        case 'uploading': Icon = Icon_Uploading; break;
        case 'error': Icon = Icon_UploadingError; break;
        case 'success': Icon = Icon_UploadingSuccess; break;
        case 'canceled': Icon = Icon_UploadingError; break;

        default: Icon = Icon_Uploading; break;
    }

    let handleCancel = _ => cancelUpload(id)

    return (
        <block className={`Uploader__block ${status}${hide ? ' hidden' : ''}`} align='center'>
            <div className='Uploader__block-content'>
                <column className='Uploader__block-left'>
                    <p className='Uploader__block-title'>{name}</p>
                    <p className='Uploader__block-size'>{formatBytes(size)}</p>
                </column>
                <column className='Uploader__block-right' align='end'>
                    <img className='Uploader__block-icon' src={Icon} alt='icon' />
                    <p className='Uploader__block-progresstext'>{Math.floor(progress)}%</p>
                </column>
                <div className='Uploader__block-progress' style={{ width: `${progress.toFixed(2)}%` }} />
            </div>

            <div className='Uploader__block-cancel' onClick={handleCancel}>
                <img className='Uploader__block-icon' src={Icon_Cross} alt='delete' />
            </div>
        </block>
    )
}

let formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    let k = 1024, dm = decimals < 0 ? 0 : decimals, 
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    let i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default observer(Uploader)
