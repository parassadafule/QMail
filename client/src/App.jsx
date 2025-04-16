import './App.css'
import LandingPage from './components/LandingPage/LandingPage'
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage, SignupPage } from './components/AuthForms/AuthForms.tsx';              
// import EmailViewer from './components/EmailViewer/EmailViewer.jsx';              
import EmailClient from './components/EmailClient/EmailClient.jsx';  
     
function App() {
  return (
 
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginWithNavigation />} />
          <Route path="/signup" element={<SignupWithNavigation />} />

          <Route >
            <Route path="/client" element={<EmailClient />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>

  );
}

function LoginWithNavigation() {
  const navigate = useNavigate();
  return <LoginPage onNavigateToSignup={() => navigate('/signup')} />;
}

function SignupWithNavigation() {
  const navigate = useNavigate();
  return <SignupPage onNavigateToLogin={() => navigate('/login')} />;
}


export default App
