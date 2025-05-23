import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../constant";
import Modal from "../../components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

export default function Denda() {
    const [denda, setDenda] = useState([]);
    const [error, setError] = useState([]);
    const navigate = useNavigate();
    const [riwayatDenda, setRiwayatDenda] = useState([]);
    const [isDetailDenda, setIsDetailDenda] = useState(false);

    const [isModalDenda, setIsModalDenda] = useState(false);
    const [formDenda, setFormDenda] = useState({
        id_member: "",
        id_buku: "",
        jumlah_denda: "",
        jenis_denda: "",
        deskripsi: ""
    });
    const [alert, setAlert] = useState("");

    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, []);

    function fetchData() {
        axios.get(API_URL + "denda", {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
        })
        .then(res => {
            setDenda(res.data.data);
        })
        .catch(err => {
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
            setError(err.response.data);
        });
    }

    function handleSubmitModal(e) {
        e.preventDefault();
        axios.post(API_URL + "denda", formDenda, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
        })
            .then(() => {
                setIsModalDenda(false);
                setAlert("Berhasil menambahkan data Denda");
                setFormDenda({id_member: "", id_buku: "", jumlah_denda: "", jenis_denda: "", deskripsi: ""});
                setError([]);
                fetchData(); 
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    localStorage.clear();
                    navigate("/login");
                }
                setError(err.response.data);
                
            });
    }

    function detailDenda(id) {
        axios.get(API_URL + "denda/" + id, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
        })
        .then(res => {
            setRiwayatDenda(res.data.data);
            setIsDetailDenda(true);
        })
        .catch(err => {
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
            setError(err.response.data);
        });
    }

    // paginate
    const startIndex = (page - 1) * itemsPerPage;
    const pagedDenda = denda.slice(startIndex, startIndex + itemsPerPage);

    const totalPages = Math.ceil(denda.length / itemsPerPage);

    return (
        <>
        <div className="container my-5 bg-white p-4 rounded shadow-sm">
            {alert !== "" ? (
                <div className="container pt-3">
                    <div className="alert alert-success text-center">{alert}</div>
                </div>
                ) : ""
            }
            <div className="d-flex justify-content-between mt-3">
                <h1 className="mt-4">Data Denda <i class="bi bi-wallet-fill"></i></h1>
                <button className="btn btn-success my-4 mt-5" onClick={() => {
                    setIsModalDenda(true);
                    setForm({id_member: "", id_buku: "", jumlah_denda: "", jenis_denda: "", deskripsi: ""});
                    setError([]);
                }}> + Denda </button>
            </div>
            <table className="table table-borderless mt-3">
                <thead className="border-bottom">
                    <tr className="fw-bold">
                        <th>No</th>
                        <th>ID Member</th>
                        <th>ID Buku</th>
                        <th>Jumlah Denda</th>
                        <th>Jenis Denda</th>
                        <th>Deskripsi</th>
                        <th >Riwayat Denda</th>
                    </tr>
                </thead>
                <tbody>
                    {pagedDenda.map((item, index) => {
                        return (
                            // startIndex adalah index awal sesuai halaman
                            <tr key={startIndex + index}>
                                <td>{startIndex + index + 1}</td>
                                <td>{item.id_member}</td>
                                <td>{item.id_buku}</td>
                                <td>{item.jumlah_denda}</td>
                                <td>{item.jenis_denda}</td>
                                <td>{item.deskripsi}</td>
                                <td><button className="btn btn-outline-info btn-sm" onClick={() => detailDenda(item.id_member)}>Lihat Riwayat</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="d-flex justify-content-center gap-2">
                <button className="btn px-4" style={{ backgroundColor: "#9ACBD0", color: "white"}} disabled={page <= 1} onClick={() => setPage(page - 1)}> Prev </button>
                <span className="align-self-center"> Page {page} of {totalPages} </span>
                <button className="btn px-4" style={{ backgroundColor: "#17a2b8", color: "white"}} disabled={page >= totalPages} onClick={() => setPage(page + 1)}> Next </button>
            </div>
        </div>

        <Modal isOpen={isModalDenda} onClose={() => setIsModalDenda(false)} title="Tambah Data Denda"> 
            <form onSubmit={handleSubmitModal}>
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
                <div className="m-3">
                    <div className="form-group">
                        <label className="form-label">ID Member <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formDenda.id_member} onChange={(e) => setFormDenda({ ...formDenda, id_member: e.target.value })} required/>
                    </div>
                    <div className="form-group">
                        <label className="form-label">ID Buku <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formDenda.id_buku} onChange={(e) => setFormDenda({ ...formDenda, id_buku: e.target.value })} required/>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Jumlah Denda <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formDenda.jumlah_denda} onChange={(e) => setFormDenda({ ...formDenda, jumlah_denda: e.target.value })} required/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Jenis Denda</label>
                        <select className="form-control" name="jenis_denda" value={formDenda.jenis_denda} onChange={(e) => setFormDenda({ ...formDenda, jenis_denda: e.target.value }) } required>
                            <option value="">Pilih Jenis Denda</option>
                            <option value="terlambat">Terlambat</option>
                            <option value="kerusakan">Kerusakan</option>
                            <option value="lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Deskripsi <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formDenda.deskripsi} onChange={(e) => setFormDenda({ ...formDenda, deskripsi: e.target.value })} required/>
                    </div>
                </div>
                <div className="modal-footer mt-4 rounded-bottom" style={{backgroundColor: 'rgba(23, 162, 184, 0.05)'}}>
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-outline-primary btn-sm px-4">+ Tambah</button>
                    </div>
                </div>
            </form>
        </Modal>

        <Modal isOpen={isDetailDenda} onClose={() => setIsDetailDenda(false)} title="Riwayat Denda">
            <div className="row mb-5 d-flex justify-content-center">
                {riwayatDenda.length > 0 && (
                    <div className="text-start">
                        <h5 className="fw-bold">ID Member: {riwayatDenda[0].id_member}</h5> {/*ambil element pertama dari array*/}
                        <small>Total Riwayat: {riwayatDenda.length} peminjaman</small>
                    </div>
                )}
                <hr className="my-4" />
                <div className="row mb-3 d-flex justify-content-center">
                    <div className="table-responsive" style={{maxHeight: '400px', overflowY: 'auto'}}>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">No</th>
                                    <th scope="col">ID Peminjaman</th>
                                    <th scope="col">ID Buku</th>
                                    <th scope="col">Jumlah Denda</th>
                                    <th scope="col">Jenis Denda</th>
                                    <th scope="col">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                { riwayatDenda.map((item, index) => { 
                                    return (
                                        <tr>
                                            <th scope="row">{index + 1}</th>
                                            <td>{item.id}</td>
                                            <td>{item.id_buku}</td>
                                            <td>{item.jumlah_denda}</td>
                                            <td>{item.jenis_denda}</td>
                                            <td>{new Date(item.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium'})}</td>
                                        </tr>
                                    )}
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="modal-footer mt-4 rounded-bottom" style={{backgroundColor: 'rgba(23, 162, 184, 0.05)'}}>
                <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-secondary btn-sm px-4" onClick={() => setIsDetailDenda(false)}>
                        <i className="bi bi-x-lg me-2"></i>
                        Tutup
                    </button>
                </div>
            </div>
        </Modal>
        </>
    );
}