import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PhonePic from "../assets/PhonePic.svg"
import Bg from "../assets/Bg.svg";
import balls from "../assets/balls.svg";
import glad from "../assets/gladtxt.svg";
import oneball from "../assets/oneball.svg";
import logotxt from "../assets/Logo_Text2.svg";
import icon from  "../assets/IconSignIn.svg";
import { Link } from "react-router-dom";
import "../RegisterFolder/RegisterPage.css";

function RegisterPage() {
    
    const navigate = useNavigate();
  
    useEffect(() => {
        document.body.classList.add("RegisterPage");
        return () => document.body.classList.remove("RegisterPage"); 
    }, []);

    function handleRegister() {
      navigate("/");
    }

    return (
        <div id="TheTemplate">

                <img id="background" src={Bg} alt="Bg" />
                <img id="logotxt" src={logotxt} alt="logotxt" />
                <img id="oneball" src={oneball} alt="oneball" />
                <img id="glad" src={glad} alt="Glad" />
                <img id="balls" src={balls} alt="balls"></img>
                <div id="TheImage_Register">
                    <img src={PhonePic} alt="RegisterImg" /> 
                </div>

                <div className="boxwrap">
                    <div className="TheBox">
                        <h2 className="RegisterTxt">Sign Up</h2>
                        <img id="icon" src={icon} alt="icon"></img>

                        <div className="Txt_Input_Box">
                            <input className="Name" type="Username" placeholder="Username"></input>
                        </div>

                        <div className="Txt_Input_Box">
                            <input className="email" type="email" placeholder="Email"></input>
                        </div>

                        <div className="Txt_Input_Box">
                            <input className="NIM" type="text" placeholder="NIM"></input>
                        </div>

                        <div className="Txt_Input_Box">
                            <input className="Password_Register" type="Password" placeholder="Password"></input>
                        </div>

                        <div className="Txt_Input_Box" id="LastSection">
                            <input className="Password_Confirm" type="Password" placeholder="Confirm Password"></input>
                        </div>

                        <div className="DirectToLogin">
                            <p>Already have an account? <b><Link id="GoToLogin" to="/">Login</Link></b> </p> 
                        </div>

                        <div className="RegisterBox">
                            <button className="RegisterBtn" onClick={handleRegister}>Register</button>
                        </div>



                    </div>
                </div>
            </div>
    );
}

export default RegisterPage