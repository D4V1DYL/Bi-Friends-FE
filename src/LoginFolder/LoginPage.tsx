import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginLogo from "../assets/login.png";
import { Link } from "react-router-dom";
import AuthService from "../Shared/Auth/AuthService";
import "./LoginPage.css"

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
                
                // navigate('/home');
            })
            .catch(error => {
                alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
            });
    }

    return(
            <div id="TheTemplate">
                <div className="TheBox">
                    <h2 className="LoginTxt">Login to your account</h2>
                    
                    <div className="Txt_Input_Box">
                        <p className="InputTxt">NIM</p>
                        <input 
                            className="Username" 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <br></br>

                    <div className="Txt_Input_Box">
                        <p className="InputTxt">Password</p>
                        <input 
                            className="Password" 
                            type="password" 
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




                    <div className="ButtonBox">
                        <button className="LoginBtn" onClick={handleLogin}>Login</button>
                    </div>


                    <div className="RegisterBox">
                        <a className="Register" href="#" onClick={handleRegister}>Create your account</a>
                    </div>

                </div>
                <div id="TheImage">
                    <img src={LoginLogo} alt="loginImg" />
                </div>
            </div>
    );
}
export default LoginPage