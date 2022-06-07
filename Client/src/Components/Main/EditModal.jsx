/* eslint-disable eqeqeq */
import React, { useContext, useState, useEffect } from 'react'

import { Context, Store } from '../../../../index.js'
import { observer } from 'mobx-react-lite'

import Tippy from '@tippyjs/react'
import { Select, Textfield, Button, Icon } from 'flitui'
import axios from 'axios'

let EditModal = ({ show }) => {
    const { Store: Service } = useContext(Context);

    const [title, setTitle] = useState('');
    const [privacy, setPrivacy] = useState(0);
    const [password, setPassword] = useState('');
    const [source, setSource] = useState('');

    const [isEdited, setIsEdited] = useState(false);
    const [isPasswordBlurred, setIsPasswordBlurred] = useState(true);
    const [isCancelPrompt, setIsCancelPrompt] = useState(false);

    useEffect(() => {
        setTitle(Service.room?.title);
        setPrivacy(Service.room?.privacy);
        setPassword(Service.room?.password);
        setSource(Service.room?.source?.active?.source);
    }, [Service.room, show])

    useEffect(() => {
        if (title !== '' && title != Service.room.title) return setIsEdited(true);
        if (privacy != Service.room.privacy) return setIsEdited(true);
        if (password != Service.room.password) return setIsEdited(true);
        if (source !== '' && source != Service.room?.source?.active?.source) return setIsEdited(true);

        setIsEdited(false);
    }, [title, privacy, password, source, Service.room])

    let handleKeyDown = (e) => {
        if(e.keyCode === 13) {
            if (isEdited) saveChanges();
            else tryClose();
        }

        if(e.keyCode === 27) tryClose();
    }

    let tryClose = () => {
        if (isEdited) setIsCancelPrompt(true);
        else Service.setIsEditing(false);
    }

    let saveChanges = async () => {
        if(source != Service.room?.source?.active?.source) {
            try {
                if (!(/(http|https)(:\/\/|)(www\.|)(youtube\.com|youtu\.be)\/(watch\?v=|)(.+)/gi).exec(source)) 
                    await axios.get(source)

                Service.editRoom({ title, privacy, password, source })
            } catch(e) {
                console.error(e)
                Store.snackbar('Invalid source link', 'error')
            }
        } else Service.editRoom({ title, privacy, password });
    }

    return (
        <>
            <span className={`modal${isCancelPrompt ? ' show' : ''}`} style={{ zIndex: 9999 }}>
                <span className="modal__background"></span>

                <block className="modal__block">
                    <column align="end">
                        <h5>Are you sure, you want to cancel?</h5>

                        <row style={{ marginTop: '1rem' }}>
                            <Button label="No" color="primary" onClick={() => setIsCancelPrompt(false)} />
                            <Button label="Yes" color="red" onClick={() => { Service.setIsEditing(false); setIsCancelPrompt(false) }} style={{ marginLeft: '.3rem' }} />
                        </row>
                    </column>
                </block>
            </span>

            <span className={`modal${show ? ' show' : ''}`} id="roomEditModal">
                <span className="modal__background" onClick={ tryClose }></span>

                <block className="modal__block">
                    <h3>Room Settings</h3>
                    <separator/>
                    <div className="modal__block-content" onKeyDown={ handleKeyDown }>
                        <row className="content__row" align="center">
                            <p className="content__row-title"> 
                                Title
                                <Tippy content="The title will be shown in the list, and in the top of the room">
                                    <icon>
                                        <svg viewBox="0 0 28 28"> <use href="#icon_question" fill="currentColor" /> </svg>
                                    </icon>
                                </Tippy>
                            </p>
                            <Textfield 
                                autocomplete="off"
                                className="content__row-input" 
                                value={ title } 
                                onChange={ e => setTitle(e.target.value) } 
                                placeholder="Room Title" />
                        </row>
                        <row className="content__row" align="center">
                            <p className="content__row-title">
                                Visibility
                                <Tippy content="Sets the visibility of the room in the list">
                                    <icon>
                                        <svg viewBox="0 0 28 28"> <use href="#icon_question" fill="currentColor" /> </svg>
                                    </icon>
                                </Tippy>
                            </p>
                            <Select 
                                className="content__row-input" 
                                value={ privacy } 
                                onChange={ e => setPrivacy(e.target.value) } 
                                options={[ { value: 1, text: 'Public' }, { value: 2, text: 'Hidden' } ]} />
                        </row>
                        <row className="content__row" align="center">
                            <p className="content__row-title">
                                Password
                                <Tippy content="Users will have to enter a password to join room">
                                    <icon>
                                        <svg viewBox="0 0 28 28"> <use href="#icon_question" fill="currentColor" /> </svg>
                                    </icon>
                                </Tippy>
                            </p>
                            <Textfield 
                                blurred={ password && isPasswordBlurred }
                                autocomplete="off"
                                className="content__row-input" 
                                value={ password } 
                                onChange={ e => setPassword(e.target.value) } 
                                placeholder="Room Password">
                                    <Icon 
                                        className="f-textfield__icon"
                                        use={isPasswordBlurred ? '#icon_eye' : '#icon_eye_slash'} 
                                        viewBox="0 0 28 28" 
                                        onClick={ () => setIsPasswordBlurred(!isPasswordBlurred) }/>
                            </Textfield>
                        </row>
                        <row className="content__row" align="center">
                            <p className="content__row-title">
                                Source
                                <Tippy content="We support .mp4, .m3u8 files, and YouTube">
                                    <icon>
                                        <svg viewBox="0 0 28 28"> <use href="#icon_question" fill="currentColor" /> </svg>
                                    </icon>
                                </Tippy>
                            </p>
                            <Textfield 
                                autocomplete="off"
                                className="content__row-input" 
                                value={ source } 
                                onChange={ e => setSource(e.target.value) } 
                                placeholder="Video Source"/>
                        </row>

                        <row className="content__row" align="center" justify="end" style={{ marginTop: '1.5rem' }}>
                            <Button label="Cancel" color="secondary" onClick={ tryClose } />

                            {
                                isEdited ? 
                                <Button label="Save" color="primary" style={{ marginLeft: '.5rem' }} onClick={ saveChanges } /> :
                                <Tippy content="Seems like you haven't changed anything">
                                    <span>
                                        <Button label="Save" color="primary" style={{ marginLeft: '.5rem' }} disabled={true} />
                                    </span>
                                </Tippy>
                            }
                        </row>
                    </div>
                </block>
            </span>
        </>
    )
}

export default observer(EditModal);