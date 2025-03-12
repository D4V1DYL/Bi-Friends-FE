import { useNavigate } from "react-router-dom";
import LockImg from "../assets/LockImg.svg";
import "./RecoveryPasswordPage.css"
import { useEffect } from "react";






function ForgetPasswordPage(){
    
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add("RecoveryPasswordPage");
        return () => document.body.classList.remove("RecoveryPasswordPage"); 
    }, []);
    
    function handleLogin() {
        navigate("/");
    }

    return(
        <div className="TheTemplate">
            
            <img id="LockImg" src={LockImg} alt="LockImg" />
            
            <div className="Box">
                <div className="Recovery_Box">
                    <h2 className="RecoveryTxt">Recovery Password</h2>
                </div>

                <div className="Confirm_Box">
                    <input className="NewPassword" type="password" placeholder="Enter New Password"></input>
                </div>

                <div className="Confirm_Box" id="CB2">
                    <input className="Confirm" type="password" placeholder="Confirm New Password"></input>
                </div>

                <div>
                    <button id="ChangePasswordBtn" onClick={handleLogin}><b>Change Password</b></button>
                </div>

            </div>
        </div>
    );
}

export default ForgetPasswordPage