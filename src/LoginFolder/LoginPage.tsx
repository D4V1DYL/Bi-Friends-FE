import "../LoginFolder/LoginPage.css"
import LogPhone from "../assets/LogPhone.webp";
import icon from  "../assets/IconSignIn.svg";
import SecondLayer from "../assets/SecondLayer.svg";
import BlueBg from "../assets/blueBg.svg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthService from "../Shared/Auth/AuthService";
import LoadingScreen from "../Components/LoadingComponent/LoadingScreen";
import { ToastContainer,toast } from "react-toastify";
import Checkbox from "../Components/Textbox/textbox";

function LoginPage(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);


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
        // const rememberMe = document.querySelector('#RememberMe') as HTMLInputElement;
    
        if (!usernameInput?.value || !passwordInput?.value) {
            toast.error('Please enter both username and password');
            return;
        }
        setIsLoading(true);
    
        const loginData = {
            nim: usernameInput.value,
            password: passwordInput.value,
            remember_me: rememberMe
        };
    
        setTimeout(() => {
            AuthService.login(loginData)
                .then(response => {
                    const token = response.access_token;
                    
                    if (rememberMe) {
                        localStorage.setItem('token', token);
                    } else {
                        sessionStorage.setItem('token', token);
                    }
                    
                    navigate('/HomePage');
                })
                .catch(error => {
                    setIsLoading(false);
                    setTimeout(() => {
                        toast.error('Login failed: ' + (error.response?.data?.detail || 'Unknown error'));
                    }, 100);                 
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, 3000); // 3 seconds delay
    }

    if(isLoading) {
        return <LoadingScreen/>
    }

    return(
            <div id="TheTemplate_Login">

                <div className="AllImg">
                    <img id="BlueBg" src={BlueBg} alt="BlueBg" loading="lazy"/>
                    <img id="TheImage" src={LogPhone} alt="loginImg" loading="lazy"/>
                    <img id="SL" src={SecondLayer} alt="SecondLayer" loading="lazy"></img>
                </div>

                <div className="container1">
                
                    <div className="TheBox_Log">
                        <h2 className="LoginTxt">Sign In</h2>
                        <img id="icon" src={icon} alt="icon" loading="lazy"></img>

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
                            <div className="RememberBox" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                 <Checkbox checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                            <p id="RememberMeTxt" style={{ fontWeight: '600', color: 'black' }}>Remember me</p>
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
                                <button className="fancy-button" onClick={handleLogin}>
                                <span className="button_top">Login</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />

            </div>
    );
}
export default LoginPage