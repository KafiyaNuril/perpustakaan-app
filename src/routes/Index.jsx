import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Template from "../layouts/Template";
import Login from "../pages/Login";
import BookIndex from "../pages/books/Index";
import NotLogin from "../pages/middleware/NotLogin";
import Member from "../pages/members/Index";
import Peminjaman from "../pages/peminjaman/Index";
import Data from "../pages/peminjaman/Data";
import PrivatePage from "../pages/middleware/PrivatePage";
import Landing from "../pages/Landing";
import Denda from "../pages/denda";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Template />,
        children: [
            { path: "/", element: <Landing />,},
            {
                path: "/login",
                element: <NotLogin />,
                children: [
                    {path: "", element: <Login />}
                ]
            },
            {element: <PrivatePage />,
                children: [
                    {path: "/dashboard", element: <Dashboard />},
                    {path: "/buku", element: <BookIndex/>},
                    {path: "/member", element: <Member/>},
                    {path: "/peminjaman", element: <Peminjaman/>},
                    {path: "/data", element: <Data/>},
                    {path: "/denda", element: <Denda/>}
                ]
            },
        ]
    }
])