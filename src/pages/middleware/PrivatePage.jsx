import React from "react";
import { Navigate, Outlet} from "react-router-dom";

export default function PrivatePage() {
    const authentication = localStorage.getItem("token");
    return authentication ? <Outlet/> : <Navigate to="/login" replace />
}