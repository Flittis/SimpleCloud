import './Styles/Landing.scss'
import Button from '@mui/material/Button'
import github from './Assets/img/github_logo.svg'
import mail from './Assets/img/mail_logo.svg'
import mockup from './Assets/img/Mockup_1.png'
import telegram from './Assets/img/telegram_logo.svg'
import Header from './Components/Header'

function Landing() {
    return (
        <div className="Landing">
            <Header isAuth={false}/>

            <div className="main-div">
              <h1>Keep your data and files with us. <br/>Use our free storage to store your data.</h1>
              <Button variant="contained">Join us</Button>
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
