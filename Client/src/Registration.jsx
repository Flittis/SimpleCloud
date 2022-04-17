import './Styles/Registration.scss'
import TextField from '@mui/material/TextField'
import cloud from './Assets/img/icloud.svg'
import github from './Assets/img/github_logo.svg'
import mail from './Assets/img/mail_logo.svg'
import telegram from './Assets/img/telegram_logo.svg'
import MyInput from './Components/MyInput.jsx'
import Button from '@mui/material/Button'

function Registration() {
    return (
        <div className="Registration">
            <div className="header">
              <div className="header_left">
                <img className="logo" src={cloud} alt="logo"/>
                <h3 className="text_logo">SimpleCloud</h3>
              </div>
            </div>
            <div className="main-div">
              <h1>Registration</h1>
              <form>
                <MyInput type="text" placeholder="Login">
                </MyInput>
                <MyInput type="password" placeholder="Password">
                </MyInput>
                <MyInput type="password" placeholder="Repeat password">
                </MyInput>
                <Button variant="outlined">REGISTER</Button>
              </form>
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

export default Registration;
