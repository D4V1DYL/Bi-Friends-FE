import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PhonePic from "../assets/PhonePic.svg"
import Bg from "../assets/Bg.svg";
import balls from "../assets/balls.svg";
import glad from "../assets/gladtxt.svg";
import oneball from "../assets/oneball.svg";
import logotxt from "../assets/Logo_Text2.svg";
import icon from  "../assets/IconSignIn.svg";
import { Link } from "react-router-dom";
import "../RegisterFolder/RegisterPage.css";
import AuthService from "../Shared/Auth/AuthService";
import LoadingScreen from "../Components/LoadingComponent/LoadingScreen";
import { ToastContainer,toast } from "react-toastify";


function RegisterPage() {
    
    
    const navigate = useNavigate();
    
    useEffect(() => {
        document.body.classList.add("RegisterPage");
        return () => document.body.classList.remove("RegisterPage"); 
    }, []);
     
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [NIM, setNIM] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('');
    // const [ProfilePicture, setProfilePicture] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState<string | null>(null);

    function handleRegistering(){
        const usernameInput = document.querySelector('.Name') as HTMLInputElement;
        const EmailInput = document.querySelector('.email') as HTMLInputElement;
        const NIMInput = document.querySelector('.NIM') as HTMLInputElement;
        const GenderInput = document.querySelector('.gender') as HTMLInputElement;
        const PasswordInput = document.querySelector('.Password_Register') as HTMLInputElement;
        const PasswordConfirmInput = document.querySelector('.Password_Confirm') as HTMLInputElement;

        if (!usernameInput?.value.trim() || 
        !EmailInput?.value.trim() || 
        !NIMInput?.value.trim() || 
        !GenderInput?.value.trim() || 
        !PasswordInput?.value.trim() || 
        !PasswordConfirmInput?.value.trim())         
        {
            toast.error("All fields are required!");
            return;
        }
    
        if (password !== confirmPassword) {
            toast.error("Password and Confirmation Password do not match!");
            return;
        }

        setIsLoading(true);

        const registerData = {
            username: usernameInput.value,
            email: EmailInput.value,
            nim: NIMInput.value,
            password: PasswordInput.value,
            gender: GenderInput.value,
            ProfilePicture: "Human"
        };

        setTimeout(() => {
            AuthService.register(registerData)
                .then(() => {
                    toast.success("Registration successful!");
                    setTimeout(() => {
                        navigate("/");
                    }, 2000);
                })
                .catch((error) => {
                    setIsLoading(false);
                    setTimeout(() => {
                        toast.error('Registration failed: ' + (error.response?.data?.detail || 'Unknown error'));
                    }, 100);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, 3000);
    }

    if(isLoading){
        return <LoadingScreen/>
    }


    return (
        <div id="TheTemplate">
            <div className="AllImg">
                <img id="background" src={Bg} alt="Bg" loading="eager"/>
                <img id="logotxt" src={logotxt} alt="logotxt" loading="eager"/>
                <img id="oneball" src={oneball} alt="oneball" loading="eager"/>
                <img id="glad" src={glad} alt="Glad" loading="eager"/>
                <img id="balls" src={balls} alt="balls" loading="eager"></img>
                <img id="TheImage_Register" src={PhonePic} alt="RegisterImg" loading="eager"></img>
            </div>
            
                <div className="boxwrap">
                    <div className="TheBox">
                        <h2 className="RegisterTxt">Sign Up</h2>
                        <img id="icon" src={icon} alt="icon" loading="eager"></img>

                        <div className="Txt_Input_Box">
                            <input className="Name" 
                                type="Username" 
                                placeholder="Username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="Txt_Input_Box">
                            <input className="email" 
                                type="email" 
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="Txt_Input_Box">
                            <input className="NIM" 
                                type="text" 
                                placeholder="NIM"
                                value={NIM}
                                onChange={(e) => setNIM(e.target.value)}
                            />
                        </div>

                        
                        <div className="Txt_Input_Box">
                            <input className="gender" 
                                type="text" 
                                placeholder="Gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            />
                        </div>

                        <div className="Txt_Input_Box">
                            <input className="Password_Register" 
                                type="Password" 
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="Txt_Input_Box" id="LastSection">
                            <input className="Password_Confirm" 
                                type="Password" 
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <div className="DTL_Box">
                            <div className="DirectToLogin">
                                <p>Already have an account? <b><Link id="GoToLogin" to="/">Login</Link></b> </p> 
                            </div>
                        </div>
                        <div className="RegisterBox">
                            <button className="RegisterBtn" onClick={handleRegistering}>Register</button>
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

export default RegisterPage