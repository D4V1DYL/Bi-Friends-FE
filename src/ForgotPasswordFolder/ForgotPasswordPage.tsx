import LockImg from "../assets/LockImg.svg";
import "./ForgotPasswordPage.css"

function ForgetPassword(){
    return(
        <div className="TheTemplate">
            
            <img id="LockImg" src={LockImg} alt="LockImg" />
            
            <div className="TheBox">
                <div>
                    <h2 className="ForgortTxt">Forgot Password?</h2>
                </div>

                <div className="Email_Box">
                    <p className="EailTxt">Email</p>
                    <input className="Email" type="email"></input>
                </div>

                <div>
                    <a id="SendCode" href=""></a>
                </div>

                <div className="Code_Box">
                    <p className="CodeTxt">Code</p>
                    <input className="Code" type="text"></input>
                </div>

                <div>
                    <button id="ResetPassword">Reset Password</button>
                </div>

            </div>
        </div>
    );
}

export default ForgetPassword