import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
 export default function Template() {
     return(
        <>
            <div className="bg-light pb-3">
                <Navbar/>
                <div className="container bg-light rounded">
                    <Outlet/>
                </div>
        </div>
        </>
     )
 }