import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import '../style/Login.css';
import API from '../services/api';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {

    const location = useLocation();
    const { error: authError } = useAuth();
    const [loginError, setLoginError] = useState("");


    const errorCode = new URLSearchParams(location.search).get("error");

    const message = errorCode === "google_auth_failed"
        ? "Google sign-in failed. Please try again."
        : loginError || authError;


    const handleGoogleLogin = () => {

        const apiBaseUrl = API.defaults.baseURL;
        
        if (!apiBaseUrl) {
            setLoginError("VITE_API_URL is not configured for the frontend.");
            return;
        }

        window.location.assign(`${apiBaseUrl.replace(/\/$/, "")}/auth/google`);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <p className="login-subtitle">Welcome back! Please sign in to continue.</p>
                {message && <p className="login-error" role="alert">{message}</p>}

                <button
                    className="google-btn"
                    onClick={handleGoogleLogin}
                >
                    <FcGoogle className="google-icon" />
                    <span>Login with Google</span>
                </button>
            </div>
        </div>
    );
};

export default Login;