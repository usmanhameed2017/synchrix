import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Context
import AuthProvider from "./context/auth";
import ChatProvider from "./context/chat";
import UserProvider from "./context/user";
import Loader from "./components/Loader";

// Pages
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const ProtectedRoute = lazy(() => import("./pages/security/ProtectedRoutes"));
const Home = lazy(() => import("./pages/Home"));

function App() 
{
  return (
    <>
      <ChatProvider>
        <AuthProvider>
          <UserProvider>
            {/* Lazy Load */}
            <Suspense fallback={ <Loader text="Loading" size="medium" /> }>
              <Routes>
                <Route path="/" element={ <Login /> } />
                <Route path="/login" element={ <Login /> } />
                <Route path="/signup" element={ <Signup /> } />

                {/* Protected Route */}
                <Route element={ <ProtectedRoute /> }>
                  <Route path="/home" element={ <Home /> } />
                </Route>
              </Routes>
            </Suspense>
            <ToastContainer />
          </UserProvider>
        </AuthProvider>
      </ChatProvider>
    </>
  );
}

export default App;