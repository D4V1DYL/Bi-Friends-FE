import { useNavigate } from "react-router-dom";
import LockImg from "../assets/LockImg.svg";
import { useEffect } from "react";
import "./ForgotPasswordPage.css"


function ForgetPasswordPage(){
    
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add("ForgetPasswordPage");
        return () => document.body.classList.remove("ForgetPasswordPage"); 
    }, []);
    
    function handleRecovery() {
        navigate("/RecoveryPassword");
      }

    return(
        <div className="TheTemplate">
            
            <img id="LockImg" src={LockImg} alt="LockImg" />
            
            <div className="Box">
                <div className="Forgot_Box">
                    <h2 className="ForgotTxt">Forgot Password?</h2>
                </div>

                <div className="Email_Box">
                    <input className="Email" type="email" placeholder="E-mail"></input>
                </div>

                <div id="SendCodeBox">
                    <a id="SendCode" href="#">Send Code</a>
                </div>

                <div className="Code_Box">
                    <input className="Code" type="text" placeholder="Enter Code"></input>
                </div>

                <div>
                    <button id="ResetPasswordBtn" onClick={handleRecovery}><b>Reset Password</b></button>
                </div>

            </div>
        </div>
    );
}

export default ForgetPasswordPage