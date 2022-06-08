/* eslint-disable eqeqeq */
import React, { useContext, useState, useEffect } from 'react'

import { Context } from '../../index.js'
import { observer } from 'mobx-react-lite'

import Tippy from '@tippyjs/react'
import { Textfield, Button, Select, Icon } from 'flitui'
import { Icon_Question } from '../../Assets/img/Main/index.js'


let EditModal = ({ show }) => {
    const { Service } = useContext(Context)

    const [name, setName] = useState('')
    const [privacy, setPrivacy] = useState('public')
    const [password, setPassword] = useState('')

    const [isEdited, setIsEdited] = useState(false)
    const [isPasswordBlurred, setIsPasswordBlurred] = useState(true)
    const [isCancelPrompt, setIsCancelPrompt] = useState(false)

    useEffect(() => {
        setName(Service.file?.name)
        setPrivacy(Service.file?.access?.access_type || 'public')
        setPassword(Service.file?.access?.password || '')
    }, [Service.file, show])

    useEffect(() => {
        if (name !== '' && name != Service.file.name) return setIsEdited(true)
        if (privacy != Service.file?.access?.access_type) return setIsEdited(true)
        if (password != Service.file?.access?.password) return setIsEdited(true)

        setIsEdited(false)
    }, [name, privacy, password, Service.file])

    let handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            if (isEdited) saveChanges()
            else tryClose()
        }

        if (e.keyCode === 27) tryClose()
    }

    let tryClose = () => {
        if (isEdited) setIsCancelPrompt(true)
        else Service.setIsEditing(false)
    }

    let saveChanges = _ => Service.editFile({ name, privacy, password })

    return (
        <>
            <span className={`modal${isCancelPrompt ? ' show' : ''}`} style={{ zIndex: 9999 }} >
                <span className='modal__background'></span>

                <block className='modal__block'>
                    <column align='end'>
                        <h5>Are you sure, you want to cancel?</h5>

                        <row style={{ marginTop: '1rem' }}>
                            <Button label='No' color='primary'  onClick={() => setIsCancelPrompt(false)} />
                            <Button label='Yes' color='red' style={{ marginLeft: '.3rem' }} 
                                onClick={() => {
                                    Service.setIsEditing(false)
                                    setIsCancelPrompt(false)
                                }}
                            />
                        </row>
                    </column>
                </block>
            </span>

            <span className={`modal${show ? ' show' : ''}`} id='roomEditModal'>
                <span className='modal__background' onClick={tryClose}></span>

                <block className='modal__block'>
                    <h3>Room Settings</h3>
                    <separator />
                    <div className='modal__block-content' onKeyDown={handleKeyDown}>
                        <row className='content__row' align='center'>
                            <p className='content__row-title'>
                                Name

                                <Tippy content='File name'>
                                    <icon> <img src={Icon_Question} alt='description' /> </icon>
                                </Tippy>
                            </p>

                            <Textfield
                                autocomplete='off'
                                className='content__row-input'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder='Room Title'
                            />
                        </row>
                        <row className='content__row' align='center'>
                            <p className='content__row-title'>
                                Privacy
                                
                                <Tippy content='Sets the privacy of file'>
                                    <icon> <img src={Icon_Question} alt='description' /> </icon>
                                </Tippy>
                            </p>

                            <Select className='content__row-input' value={privacy} onChange={(e) => setPrivacy(e.target.value)}
                                options={[
                                    { value: 'public', text: 'Public' },
                                    { value: 'private', text: 'Private' },
                                ]}
                            />
                        </row>
                        <row className='content__row' align='center'>
                            <p className='content__row-title'>
                                Password

                                <Tippy content='This password will be prompted on download'>
                                    <icon> <img src={Icon_Question} alt='description' /> </icon>
                                </Tippy>
                            </p>

                            <Textfield
                                blurred={password && isPasswordBlurred}
                                autocomplete='off'
                                className='content__row-input'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Room Password'
                            >
                                <Icon
                                    className='f-textfield__icon'
                                    path={
                                        isPasswordBlurred
                                            ? 'M14 21.2041C21.1367 21.2041 25.9531 15.4473 25.9531 13.6631C25.9531 11.8877 21.1279 6.13086 14 6.13086C6.96875 6.13086 2.04688 11.8877 2.04688 13.6631C2.04688 15.4473 6.95996 21.2041 14 21.2041ZM14.0088 18.4619C11.3281 18.4619 9.19238 16.2734 9.18359 13.6719C9.1748 10.9824 11.3281 8.87305 14.0088 8.87305C16.6719 8.87305 18.8252 10.9912 18.8252 13.6719C18.8252 16.2734 16.6719 18.4619 14.0088 18.4619ZM14.0088 15.4561C14.9932 15.4561 15.8105 14.6475 15.8105 13.6719C15.8105 12.6875 14.9932 11.8701 14.0088 11.8701C13.0068 11.8701 12.1982 12.6875 12.1982 13.6719C12.1982 14.6475 13.0068 15.4561 14.0088 15.4561Z'
                                            : 'M20.9346 21.4414C21.207 21.7139 21.6465 21.7315 21.9277 21.4414C22.2178 21.1426 22.2002 20.7207 21.9277 20.4483L7.0127 5.55079C6.74023 5.27833 6.29199 5.26954 6.01953 5.55079C5.75586 5.81447 5.75586 6.2715 6.01953 6.53517L20.9346 21.4414ZM21.7607 18.752C24.3271 17.0293 25.9531 14.7002 25.9531 13.6631C25.9531 11.8877 21.1279 6.13087 14 6.13087C12.5059 6.13087 11.1084 6.38576 9.84277 6.80763L12.251 9.21583C12.7959 8.99611 13.3848 8.87306 14.0088 8.87306C16.6719 8.87306 18.8252 10.9912 18.8252 13.6719C18.8252 14.2871 18.6934 14.8848 18.4561 15.4209L21.7607 18.752ZM14 21.2041C15.6084 21.2041 17.1025 20.9141 18.4209 20.4307L15.9951 18.0049C15.3975 18.3037 14.7207 18.4619 14.0088 18.4619C11.3281 18.4619 9.19238 16.2735 9.18359 13.6719C9.18359 12.9424 9.3418 12.2568 9.63184 11.6504L6.45898 8.45997C3.72559 10.2178 2.04688 12.626 2.04688 13.6631C2.04688 15.4473 6.95996 21.2041 14 21.2041ZM16.8125 13.4873C16.8125 11.9492 15.582 10.71 14.0352 10.71C13.9385 10.71 13.8418 10.7188 13.7539 10.7276L16.7949 13.7598C16.8037 13.6807 16.8125 13.584 16.8125 13.4873ZM11.1787 13.5225C11.1787 15.0606 12.4443 16.2998 13.9736 16.2998C14.0791 16.2998 14.1758 16.291 14.2725 16.2822L11.1963 13.2061C11.1875 13.3115 11.1787 13.417 11.1787 13.5225Z'
                                    }
                                    viewBox='0 0 28 28'
                                    onClick={() =>
                                        setIsPasswordBlurred(!isPasswordBlurred)
                                    }
                                />
                            </Textfield>
                        </row>

                        <row
                            className='content__row'
                            align='center'
                            justify='end'
                            style={{ marginTop: '1.5rem' }}
                        >
                            <Button
                                label='Cancel'
                                color='secondary'
                                onClick={tryClose}
                            />

                            {isEdited ? (
                                <Button
                                    label='Save'
                                    color='primary'
                                    style={{ marginLeft: '.5rem' }}
                                    onClick={saveChanges}
                                />
                            ) : (
                                <Tippy content="Seems like you haven't changed anything">
                                    <span>
                                        <Button
                                            label='Save'
                                            color='primary'
                                            style={{ marginLeft: '.5rem' }}
                                            disabled={true}
                                        />
                                    </span>
                                </Tippy>
                            )}
                        </row>
                    </div>
                </block>
            </span>
        </>
    )
}

export default observer(EditModal)
