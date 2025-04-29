import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LockImg from "../assets/LockImg.svg";
import "./RecoveryPasswordPage.css";
import AuthService from "../Shared/Auth/AuthService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RecoveryPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, token } = location.state || { email: "", token: "" };

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error("All fields are required!");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await AuthService.resetPassword({
                email,
                token,
                new_password: newPassword,
                confirm_password: confirmPassword
            });

            if (response.status) {
                toast.success("Password changed successfully!");
                setTimeout(() => navigate("/"), 2000);
            } else {
                toast.error(response.message);
            }
        } catch (err) {
            toast.error("Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="TheTemplate">
            <img id="LockImg" src={LockImg} alt="LockImg" loading="lazy" />

            <div className="Box">
                <div className="Recovery_Box">
                    <h2 className="RecoveryTxt">Recovery Password</h2>
                </div>

                <div className="Confirm_Box">
                    <input 
                        className="NewPassword"
                        type="password"
                        placeholder="Enter New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="Confirm_Box" id="CB2">
                    <input 
                        className="Confirm"
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div>
                    <button id="ChangePasswordBtn" onClick={handleChangePassword}>
                        <b>Change Password</b>
                    </button>
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

export default RecoveryPasswordPage;

