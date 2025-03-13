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
    const [error, setError] = useState<string | null>(null);

    function handleRegistering(){

        const usernameInput = document.querySelector('.Name') as HTMLInputElement;
        const EmailInput = document.querySelector('.email') as HTMLInputElement;
        const NIMInput = document.querySelector('.NIM') as HTMLInputElement;
        const GenderInput = document.querySelector('.gender') as HTMLInputElement;
        const PasswordInput = document.querySelector('.Password_Register') as HTMLInputElement;
        const PasswordConfirmInput = document.querySelector('.Password_Confirm') as HTMLInputElement;
        // const ProfilePictureInput = "aaa";
        


        if (usernameInput.value == null || EmailInput.value == null || NIMInput.value == null || GenderInput.value == null || PasswordInput.value == null || PasswordConfirmInput.value == null) {
            setError("All fields are required!");
            return;
        }
    
        if (password != confirmPassword) {
            setError("Password and Confirmation Password is not the same!");
            return;
        }

        const registerData = {
            username: usernameInput.value,
            email: EmailInput.value,
            nim: NIMInput.value,
            password: PasswordInput.value,
            gender: GenderInput.value,
            ProfilePicture: "Human"
        };

        AuthService.register(registerData)
            .then(() => {
                alert("Registration Success!");
                navigate("/"); 
            })
            .catch((error) => {
                alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
                setError("Registration Failed! Try Again")
            })


    }


    return (
        <div id="TheTemplate">
            <div className="AllImg">
                <img id="background" src={Bg} alt="Bg" />
                <img id="logotxt" src={logotxt} alt="logotxt" />
                <img id="oneball" src={oneball} alt="oneball" />
                <img id="glad" src={glad} alt="Glad" />
                <img id="balls" src={balls} alt="balls"></img>
                <img id="TheImage_Register" src={PhonePic} alt="RegisterImg"></img>
            </div>
            
                <div className="boxwrap">
                    <div className="TheBox">
                        <h2 className="RegisterTxt">Sign Up</h2>
                        <img id="icon" src={icon} alt="icon"></img>

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

                        {error && <p style={{ color: "red" }}>{error}</p>}
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
            </div>
    );
}

export default RegisterPage