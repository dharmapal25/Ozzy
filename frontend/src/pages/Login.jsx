import React from 'react';
import { FcGoogle } from "react-icons/fc";
import '../style/Login.css';

const Login = () => {
    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <p className="login-subtitle">Welcome back! Please sign in to continue.</p>

                <button className="google-btn">
                    <FcGoogle className="google-icon" />
                    <span>Login with Google</span>
                </button>
            </div>
        </div>
    );
};

export default Login;