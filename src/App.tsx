import MaintainanceScreen from './Components/MaintainanceComponent/MaintananceScreen';
import LoginPage from './LoginFolder/LoginPage'
import RegisterPage from './RegisterFolder/RegisterPage'
import ForgotPassword from './ForgotPasswordFolder/ForgotPasswordPage'
import RecoveryPassword from './RecoveryPasswordFolder/RcoveryPasswordPage'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path='/RecoveryPassword' element={<RecoveryPassword />} />
        <Route path="/404" element={<MaintainanceScreen />} />
      </Routes>
    </Router>
  );
}


export default App

// awikwok