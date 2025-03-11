import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./RegisterPage.css"

function RegisterPage() {
    
    const navigate = useNavigate();
  
    useEffect(() => {
        document.body.classList.add("RegisterPage");
        return () => document.body.classList.remove("RegisterPage"); 
    }, []);

    function handleRegister() {
      navigate("/");
    }

    return (
        <div id="TheTemplate">

                <div id="TheImage_Register">
                    <img src="./src/assets/Register.png" alt="RegisterImg" /> 
                </div>

               <div className="TheBox">
                    <h2 className="RegisterTxt">Create an account</h2>
                    
                    <div className="Txt_Input_Box">
                        <p className="InputTxt">Name</p>
                        <input className="Name" type="Username"></input>
                    </div>

                    <br></br>

                    <div className="Txt_Input_Box">
                        <p className="InputTxt">NIM</p>
                        <input className="NIM" type="text"></input>
                    </div>

                    <br></br>

                    <div className="Txt_pw_box">
                        <div className="Txt_Input_Box_pw1">
                            <p className="InputTxt">Password</p>
                            <input className="Password_Register" type="Password"></input>
                        </div>

                        <div className="Txt_Input_Box_pw2">
                            <p className="InputTxt">Confirmation Password</p>
                            <input className="Password_Confirm" type="Password"></input>
                        </div>
                    </div>

                    <div className="RegisterBox">
                        <button className="RegisterBtn" onClick={handleRegister}>Register</button>
                    </div>
                </div>
            </div>
    );
}

export default RegisterPage