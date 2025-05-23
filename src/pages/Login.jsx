import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";
import axios from "axios";

export default function Login() {
    const location = useLocation();
    const [login, setLogin] = useState({
        email:  location.state?.email || "",
        password: Location.state?.password || "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function loginProcess(e) {
        e.preventDefault();
        axios.post(API_URL + "login", login)
        .then(res => {
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        })
        .catch(err => {
            setError(err.response.data);
        })
    }

    return (
        <>
        <div className="vh-100 d-flex justify-content-center align-items-center" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#f0f2f5" }}>
            <form className="card w-100 p-4 p-md-5 shadow-sm" style={{ maxWidth: "400px", borderRadius: "15px", backgroundColor: "white" }}  onSubmit={(e) => loginProcess(e)}>
                <h2 className="text-center fw-bold" style={{ color: "#17a2b8" }}>Login</h2>
                <hr className=" mb-4"/>
                {
                    Object.keys(error).length > 0 && (
                        <ol className="alert alert-danger m-2 p-2">
                            {error.data && Object.entries(error.data).length > 0 ? (
                                Object.entries(error.data).map(([key, value]) => (
                                    <li key={key}>{value}</li>
                                ))
                            ) : (
                                <li>{error.message}</li>
                            )}
                        </ol>
                    )
                }
                <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input type="email" id="email" className="form-control rounded-3 border border-secondary" placeholder="Masukan Email Anda" value={login.email} onChange={(e) => setLogin({...login, email: e.target.value})}  required style={{ transition: "border-color 0.3s ease" }} />
                </div>
                <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <input type="password" id="password" className="form-control rounded-3 border border-secondary" placeholder="Masukan Password Anda" value={login.password} onChange={(e) => setLogin({...login, password: e.target.value})} required style={{ transition: "border-color 0.3s ease" }}/>
                </div>
                <button className="btn w-100 text-white fw-bold" type="submit" style={{ borderRadius: "10px", padding: "10px", backgroundColor: "#17a2b8"}}> Login </button>
            </form>
        </div>

        </>
    );
}