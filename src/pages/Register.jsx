import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";

export default function Register() {
    const [register, setRegister] = useState({
        name: "",
        email: "",
        password: "",
        c_password: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function RegisProcess(e) {
        e.preventDefault();
        if (register.password.length < 8) {
            setError({ password: ["Password harus minimal 8 karakter."] });
            return;
        } else if (register.password !== register.c_password) {
            setError({ c_password: ["Konfirmasi password tidak cocok."] });
            return;
        }
        setError(null);

        axios.post(API_URL + "register", register)
        .then(res => {
            console.log(res.data);
            navigate("/login", { state: { email: register.email, password: register.password} });
        })
        .catch(err => {
            // setError(err.response.data);
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError({ general: ["Terjadi kesalahan."] });
            }
        })
    }

    return (
        <>
        <div className="vh-100 d-flex justify-content-center align-items-center py-5" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#f0f2f5" }}>
            <form className="card p-4 w-50 shadow-sm" style={{borderRadius: "15px", backgroundColor: "white"}} onSubmit={(e) => RegisProcess(e)}>
                <h2 className="text-center fw-bold mb-4" style={{ color: "#17a2b8" }}>Register</h2>
                <hr />
                {/* {
                    error && (
                        <div className="alert alert-danger small p-3" style={{ borderRadius: "10px" }}>
                            {
                                error.data && Object.entries(error.data).length > 0 ?
                                <ul className="mb-0 ps-3">
                                    {Object.entries(error.data).map(([key, value]) => (
                                        <li key={key}>{value}</li>
                                    ))}
                                </ul> : error.message
                            }
                        </div>
                    )
                } */}
                {error && (
                    <div className="alert alert-danger small p-3" style={{ borderRadius: "10px" }}>
                        <ul className="mb-0 ps-3">
                        {Object.entries(error).map(([key, value]) => (
                            <li key={key}>{Array.isArray(value) ? value.join(", ") : value}</li>
                        ))}
                        </ul>
                    </div>
                )}
                <div className="mb-3 w-75 align-self-center">
                    <label className="form-label fw-semibold">Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        className="form-control rounded-3 border border-secondary"
                        placeholder="Masukan name Anda" 
                        onChange={(e) => setRegister({...register, name: e.target.value})} 
                        required
                    />
                </div>
                <div className="mb-3 w-75 align-self-center">
                    <label className="form-label fw-semibold">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        className="form-control rounded-3 border border-secondary"
                        placeholder="Masukan Email Anda" 
                        onChange={(e) => setRegister({...register, email: e.target.value})} 
                        required
                    />
                </div>
                <div className="mb-3 w-75 align-self-center">
                    <label className="form-label fw-semibold">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        className="form-control rounded-3 border border-secondary"
                        placeholder="Password minimal 8 karakter" 
                        onChange={(e) => setRegister({...register, password: e.target.value})} 
                        required
                    />
                </div>
                <div className="mb-4 w-75 align-self-center">
                    <label className="form-label fw-semibold">Konfirmasi Password</label>
                    <input 
                        type="password" 
                        id="c_password" 
                        className="form-control rounded-3 border border-secondary"
                        placeholder="Konfirmasi Password Anda" 
                        onChange={(e) => setRegister({...register, c_password: e.target.value})} 
                        required
                    />
                </div>
                <button 
                    className="btn btn-primary w-75 fw-semibold align-self-center" 
                    type="submit" 
                    style={{ borderRadius: "10px", padding: "10px", backgroundColor: "#17a2b8" }}>
                    Register
                </button>
            </form>
        </div>
        </>
    );
}