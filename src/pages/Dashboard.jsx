import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";

export default function Dashboard() {
    const [chartData, setChartData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(API_URL + "peminjaman", {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((res) => {
            const data = res.data.data;

            const countPerYear = {};

            // .forEach() digunakan untuk menjalankan perintah pada setiap item, tapi tidak mengembalikan nilai baru.
            data.forEach((item) => {
                const year = new Date(item.tgl_pinjam).getFullYear();
                countPerYear[year] = (countPerYear[year] || 0) + 1;
            });

            const formatted = Object.entries(countPerYear)
                .map(([year, count]) => ({
                    year,
                    peminjaman: count,
                }))
                .sort((a, b) => a.year - b.year); 

            setChartData(formatted);
        })
         .catch((err) => {
            if (err.response?.status === 401) {
                localStorage.removeItem("access_token");
                navigate("/login");
            }
        });
    }, []);

    return (
        <>
            <div className="m-5 p-5">
                <div className="my-5 p-3">
                    <h1 className="text-center mt-5 mb-3" style={{ color: "#17a2b8", fontWeight: "700"  }}>
                        Dashboard Admin Perpustakaan
                    </h1>
                    <p className="text-center text-muted mb-5">
                        Kelola data buku, member, <br/>dan peminjaman dengan mudah melalui panel admin ini.
                    </p>
                    <div className="text-center">
                        <a href="#data" className="btn btn-info px-4 py-2 text-muted">
                        Lihat Data
                        </a>
                    </div>
                </div>
            </div>

            <hr className="my-5" />

            <div className="card mx-auto m-5" id="data" style={{ width: "75%", height: 500 }}>
                <h3 className="text-center m-4">Jumlah Peminjaman per Tahun</h3>
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="peminjaman" name="Jumlah Peminjaman" fill="#17a2b8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <hr />
        </>
    );
}