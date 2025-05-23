import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function NotLogin() {
    const authentication = localStorage.getItem("token");
    return authentication ? <Navigate to="/dashboard" replace /> : <Outlet />;
}