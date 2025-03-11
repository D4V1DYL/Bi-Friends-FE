import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./LoginPage.css"

function LoginPage(){

    const navigate = useNavigate();

    useEffect(() => {
      document.body.classList.add("LoginPage");
      return () => document.body.classList.remove("LoginPage"); 
    }, []);


    function handleLogin() {
      navigate("/RegisterPage");
    }

    return(
            <div id="TheTemplate">
                <div className="TheBox">
                    <h2 className="LoginTxt">Login to your account</h2>
                    
                    <div className="Txt_Input_Box">
                        <p className="InputTxt">Username</p>
                        <input className="Username" type="Username"></input>
                    </div>

                    <br></br>

                    <div className="Txt_Input_Box">
                        <p className="InputTxt">Password</p>
                        <input className="Password" type="Password"></input>
                    </div>


                    <div className="RememberBox_ForgetPassword_Box">
                        <div className="RememberBox">
                            <input id="RememberMe" type="checkbox"></input>
                            <p id="RememberMeTxt" >Remember me</p>
                        </div>

                        <div className="ForgetPasswordBox">
                            <a id="ForgetPassword" href="#">Forget Password?</a>
                        </div>
                    </div>




                    <div className="ButtonBox">
                        <button className="LoginBtn">Login</button>
                    </div>


                    <div className="RegisterBox">
                        <a className="Register" href="#" onClick={handleLogin}>Create your account</a>
                    </div>

                </div>
                <div id="TheImage">
                    <img src="./src/assets/login.png" alt="loginImg" />
                </div>
            </div>
    );
}
export default LoginPage