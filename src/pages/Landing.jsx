import { faRightToBracket, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    const handleRegister = () => {
        navigate("/register");
    };
    return (
         <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="text-center p-5 bg-white rounded shadow" style={{ maxWidth: "500px", width: "100%" }}>
                <h1 className="mb-4 display-5 text-dark">📚 Welcome to Our Library App</h1>
                <p className="mb-4 text-muted">Manage your library easily and efficiently.</p>
                <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-primary px-4" onClick={handleLogin}>
                        <FontAwesomeIcon icon={faRightToBracket} className="me-2" />
                        Login
                    </button>
                    <button className="btn btn-outline-primary px-4" onClick={handleRegister}>
                        <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}