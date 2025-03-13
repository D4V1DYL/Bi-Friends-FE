import "../LoginFolder/LoginPage.css"
import LogPhone from "../assets/LogPhone.svg";
import icon from  "../assets/IconSignIn.svg";
import SecondLayer from "../assets/SecondLayer.svg";
import BlueBg from "../assets/blueBg.svg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthService from "../Shared/Auth/AuthService";

function LoginPage(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
      document.body.classList.add("LoginPage");
      return () => document.body.classList.remove("LoginPage"); 
    }, []);


    function handleRegister() {
      navigate("/RegisterPage");
    }

    function handleLogin() {
        const usernameInput = document.querySelector('.Username') as HTMLInputElement;
        const passwordInput = document.querySelector('.password') as HTMLInputElement;
        const rememberMe = document.querySelector('#RememberMe') as HTMLInputElement;
    
        if (!usernameInput?.value || !passwordInput?.value) {
            alert('Please enter both username and password');
            return;
        }
    
        const loginData = {
            nim: usernameInput.value,
            password: passwordInput.value
        };
    
        AuthService.login(loginData)
            .then(response => {
                const token = response.access_token;
                
                if (rememberMe.checked) {
                    localStorage.setItem('token', token);
                } else {
                    sessionStorage.setItem('token', token);
                }
                
                navigate('/404');
            })
            .catch(error => {
                alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
            });
    }

    return(
            <div id="TheTemplate_Login">

                <div className="AllImg">
                    <img id="BlueBg" src={BlueBg} alt="BlueBg" />
                    <img id="TheImage" src={LogPhone} alt="loginImg" />
                    <img id="SL" src={SecondLayer} alt="SecondLayer"></img>
                </div>

                <div className="container1">
                
                    <div className="TheBox_Log">
                        <h2 className="LoginTxt">Sign In</h2>
                        <img id="icon" src={icon} alt="icon"></img>

                        <div className="Txt_Input_Box_Log">
                            <input 
                                className="Username" 
                                type="text" 
                                placeholder="NIM"
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>


                        <div className="Txt_Input_Box_Log" id="LastSection_Log">
                            <input className="password"
                                type="password" 
                                placeholder="Password"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>




                        <div className="RememberBox_ForgetPassword_Box">
                            <div className="RememberBox">
                                <input id="RememberMe" type="checkbox"></input>
                                <p id="RememberMeTxt" >Remember me</p>
                            </div>

                            <div className="ForgetPasswordBox">
                                <Link id="ForgetPassword" to="./ForgotPassword">Forget Password?</Link>
                            </div>
                        </div>


                        <div className="DirectToRegister_Box">
                            <div className="DirectToRegister">
                                <p className="DTRTxt">Don't Have an Account yet? <a className="Register" href="#" onClick={handleRegister}>Sign Up</a></p> 
                            </div>
                        </div>



                        <div className="Button_Box">
                            <div className="ButtonBox">
                                <button className="LoginBtn" onClick={handleLogin}>Login</button>
                            </div>
                        </div>

                    </div>
                </div>






            </div>
    );
}
export default LoginPage