import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LogPhone from "../assets/LogPhone.svg";
import { Link } from "react-router-dom";
import AuthService from "../Shared/Auth/AuthService";
import icon from  "../assets/IconSignIn.svg";
import "../LoginFolder/LoginPage.css"
import bluebg from "../assets/blueBg.svg";
import SecondLayer from "../assets/SecondLayer.svg";

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
        const passwordInput = document.querySelector('.Password') as HTMLInputElement;
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
                
                <img id="BlueBg" src={bluebg} alt="BlueBg"></img>
                <img id="SL" src={SecondLayer} alt="SecondLayer"></img>

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



                        <div className="DirectToRegister">
                            <p>Don't Have an Account yet? <a className="Register" href="#" onClick={handleRegister}>Sign Up</a></p> 
                        </div>





                        <div className="ButtonBox">
                            <button className="LoginBtn" onClick={handleLogin}>Login</button>
                        </div>


                    </div>
                </div>




                {/* <div className="container2"> */}
                    <div id="TheImage">
                        <img src={LogPhone} alt="loginImg" />
                    </div>
                {/* </div> */}


            </div>
    );
}
export default LoginPage