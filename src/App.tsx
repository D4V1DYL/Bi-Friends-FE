import LoginPage from './LoginFolder/LoginPage'
import RegisterPage from './RegisterFolder/RegisterPage'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}


export default App

// awikwok