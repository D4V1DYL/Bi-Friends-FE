import MaintainanceScreen from './Components/MaintainanceComponent/MaintananceScreen';
import LoginPage from './LoginFolder/LoginPage'
import RegisterPage from './RegisterFolder/RegisterPage'
import ForgotPassword from './ForgotPasswordFolder/ForgotPasswordPage'
import RecoveryPassword from './RecoveryPasswordFolder/RcoveryPasswordPage'
import HomePage from './HomeFolder/HomePage';
import ProfilePage from './ProfileFolder/ProfilePage';
import ChatPage from './ChatFolder/ChatPage';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path='/RecoveryPassword' element={<RecoveryPassword />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/ChatPage" element={<ChatPage />} />
        <Route path="/404" element={<MaintainanceScreen />} />
      </Routes>
    </Router>
  );
}


export default App