import { useNavigate } from "react-router-dom";
import LockImg from "../assets/LockImg.svg";
import { useEffect, useState } from "react";
import AuthService from "../Shared/Auth/AuthService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPasswordPage.css";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("ForgetPasswordPage");
    return () => document.body.classList.remove("ForgetPasswordPage");
  }, []);

  async function handleSendCode() {
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }

    setLoading(true);
    try {
      await AuthService.forgotPassword({ email });
      toast.success("Check your email / junk folder!");
    } catch (err: any) {
      toast.error("Failed to send verification code. Please try again.");
    }
    setLoading(false);
  }

  async function handleRecovery() {
    if (!verificationCode) {
      toast.error("Please enter the verification code!");
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.verifyToken({ email, token: verificationCode });

      if (response.status) {
        toast.success("Verification successful!");
        setTimeout(() => {
          navigate("/RecoveryPassword", { state: { email, token: verificationCode } });
        }, 2000);
      } else {
        toast.error(response.message);
      }
    } catch (err: any) {
      toast.error("Invalid verification code! Please try again!");
    }
    setLoading(false);
  }

  return (
    <div className="TheTemplate">
      <img id="LockImg" src={LockImg} alt="LockImg" />

      <div className="Box">
        <div className="Forgot_Box">
          <h2 className="ForgotTxt">Forgot Password?</h2>
        </div>

        <div className="Email_Box">
          <input
            className="Email"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

          <div id="SendCodeBox">
            <button id="SendCode" onClick={handleSendCode} disabled={loading}>
              {loading ? "Sending..." : "Send Code"}
            </button>
          </div>

            <div className="Code_Box">
              <input
                className="Code"
                type="text"
                placeholder="Enter Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <button id="ResetPasswordBtn" onClick={handleRecovery} disabled={loading}>
                <span className="button_top">{loading ? "Verifying..." : "Reset Password"}</span>
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

export default ForgotPasswordPage;