import { faRightToBracket, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    return (
         <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="text-center p-5 bg-white rounded shadow" style={{ maxWidth: "500px", width: "100%" }}>
                <h1 className="mb-4 fw-bold" style={{ color: "#17a2b8"}}>Welcome to Our Library App</h1>
                <p className="mb-4 text-muted fw-semibold">Manage your library easily and efficiently.</p>
                <div className="d-flex justify-content-center gap-3">
                    <button className="btn px-4 text-white fw-semibold" style={{ backgroundColor: "#17a2b8"}} onClick={handleLogin}>
                        <FontAwesomeIcon icon={faRightToBracket} className="me-2" />
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}