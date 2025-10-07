import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./pages/security/ProtectedRoutes";
import AuthProvider from "./context/auth";
import Home from "./pages/Home";
import ChatProvider from "./context/chat";
import UserProvider from "./context/user";


function App() 
{
  return (
    <>
      <ChatProvider>
        <AuthProvider>
          <UserProvider>
            <Routes>
              <Route path="/" element={ <Login /> } />
              <Route path="/login" element={ <Login /> } />
              <Route path="/signup" element={ <Signup /> } />

              {/* Protected Route */}
              <Route element={ <ProtectedRoute /> }>
                <Route path="/home" element={ <Home /> } />
              </Route>
            </Routes>
            <ToastContainer />
          </UserProvider>
        </AuthProvider>
      </ChatProvider>
    </>
  );
}

export default App;