import React from 'react'
import { Link } from 'react-router-dom'

import './Styles/Landing.scss'
import Button from '@mui/material/Button'
import mockup from './Assets/img/Mockup_1.png'
import Footer from './Components/Footer'

function Landing() {
    return (
        <div className="Landing">
            <div className="main-div">
                <h1>Keep your data and files with us. <br />Use our free storage to store your data.</h1>
                
                <Link to="/register">
                    <Button variant="contained">Join us</Button>
                </Link>

                <img className="laptop-img" src={mockup} alt="laptop" />
            </div>

            <Footer />
        </div>
    )
}

export default Landing
