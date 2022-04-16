import './Styles/Landing.scss'
import Button from '@mui/material/Button'
import cloud from './Assets/img/icloud.svg'
import github from './Assets/img/github_logo.svg'
import mail from './Assets/img/mail_logo.svg'
import mockup from './Assets/img/Mockup_1.png'
import telegram from './Assets/img/telegram_logo.svg'

function Landing() {
    return (
        <div className="Landing">
            <div className="header">
              <div className="header_left">
                <img className="logo" src={cloud} alt="logo"/>
                <h3 className="text_logo">SimpleCloud</h3>
              </div>
              <div class="header_right">
                <div className="btn" id="auth">
                  <Button variant="contained">AUTHORIZATION</Button>
                </div>
                <div class="btn" id="reg">
                  <Button variant="contained">REGISTRATION</Button>
                </div>
              </div>
            </div>
            <div className="main-div">
              <h1>Keep your data and files with us. <br/>Use our free storage to store your data.</h1>
              <img className="laptop-img" src={mockup} alt="laptop"/>
            </div>
            <div className="footer">
              <div className="footer_container">
                <div className="footer_left">
                  <h5>© SimpleCloud 2022</h5>
                </div>
                <div className="footer_right">
                  <img src={mail} alt="mail"/>
                  <img src={telegram} alt="telegram"/>
                  <img src={github} alt="github"/>
                </div>
              </div>
            </div>
        </div>
    );
}

export default Landing;
