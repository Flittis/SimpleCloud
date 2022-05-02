import github from '../Assets/img/github_logo.svg'
import mail from '../Assets/img/mail_logo.svg'
import telegram from '../Assets/img/telegram_logo.svg'

import React from 'react'

import { Link } from 'react-router-dom'

function Footer() {
    return (
      <div className="footer">
        <div className="footer_container">
          <div className="footer_left">
            <h5>© SimpleCloud 2022</h5>
          </div>
          <div className="footer_right">
            <a href="mailto:mega.aang@gmail.com" target="_blank">
              <img src={mail} alt="mail"/>
            </a>
            <a href="https://t.me/SimpleCloudPWSZ" target="_blank">
              <img src={telegram} alt="telegram"/>
            </a>
            <a href="https://github.com/Flittis/Projekt_Zespolowy" target="_blank">
              <img src={github} alt="github"/>
            </a>
          </div>
        </div>
      </div>
    )
}

export default Footer;
