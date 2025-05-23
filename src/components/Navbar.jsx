import { faBookOpenReader, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar(){
    let isLogin = localStorage.getItem("token");
    // mengembalikan objek lokasi
    const location = useLocation();
    const navigate = useNavigate();

    function logoutHandler() {
        // hapus localstorage ketika logout
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar bg-light" style={{ height: "65px" }}>
            <div className="container-fluid ms-5">
                <div className="d-flex justify-content-around align-items-center">
                    <FontAwesomeIcon icon={faBookOpenReader} style={{ color: "#17a2b8"}}/>
                    <Link className="navbar-brand ms-2 fw-bold" style={{ color: "#17a2b8"}} to="#">Library</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {isLogin ? (    
                            <>                      
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`} aria-current="page" to="/dashboard">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/buku" ? "active" : ""}`} to="/buku">📚 Data Buku</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/member" ? "active" : ""}`} to="/member">🧑‍🧑‍🧒‍🧒 Member</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className={`nav-link dropdown-toggle ${location.pathname === "/peminjaman" ? "active" : ""}`} href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FontAwesomeIcon icon={faFolder} /> Data
                                </a>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="/peminjaman">Peminjaman</Link></li>
                                    <li><Link className="dropdown-item" to="/data">Pengembalian</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/denda" ? "active" : ""}`} to="/denda">Denda</Link>
                            </li>
                            <li className="nav-item">
                                <a href="" className="nav-link" aria-current="page" onClick={logoutHandler}>Logout</a>
                            </li>
                            </>  
                        ) : (
                            <>
                            <li className="nav-item">
                                <Link to="/login" className={`nav-link ${location.pathname === "/login" ? "active" : ""}`} aria-current="page">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/register" className={`nav-link ${location.pathname === "/register" ? "active" : ""}`} aria-current="page">Register</Link>
                            </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}