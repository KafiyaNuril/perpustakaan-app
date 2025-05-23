import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../constant";
import Modal from "../../components/Modal";

export default function Peminjaman() {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState([]);
    const [alert, setAlert] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal, setFormModal] = useState({id_buku: "", id_member: "", tgl_pinjam: "", tgl_pengembalian: ""});

    useEffect(() => {
        fetchData();
    }, []);

    function fetchData() {
        axios.get(API_URL + "buku", {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
        })
        .then(res => {
            setBooks(res.data);
        })
        .catch(err => {
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
            setError(err.response.data);
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        axios.post(API_URL + "peminjaman", formModal, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res) => {
            setIsModalOpen(false);
            setFormModal({id_buku: "", id_member: "", tgl_pinjam: "", tgl_pengembalian: ""});
            setAlert("Sukses melakukan peminjaman!");

            setBooks(prevBooks =>
                prevBooks.map(book =>
                    book.id === formModal.id_buku
                        ? { ...book, stok: book.stok - 1 }
                        : book
                )
            );
            // fetchData();
        })
        .catch((err) => {
            if (err.response?.status == 401) {
                localStorage.removeItem("token");
                localStorage.clear();
                navigate("/login");
            }
            setError(err.response.data);
        })
    }

    function handleBtn(bookId) {
        setFormModal({...formModal, id_buku: bookId});
        setIsModalOpen(true);
    }

    return (
        <>
        <div className="container my-5 bg-white p-4 rounded shadow-sm">
            <h1 className="text-center my-5 fw-bold" style={{ color: "#17a2b8"}}>Peminjaman</h1>
            <hr />
            <div className="contaier mt-3">
                {alert !== "" ? (
                    <div className="alert alert-success" role="alert">{alert}</div>
                    ) : ""
                }
            </div>
            <div className="row pb-5 my-5 d-flex justify-content-center">
                {
                    books.map((item, index) => (
                        <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3 m-2">
                            <div className="card h-100 shadow border-1 text-center">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <h5 className="card-title fw-bold text-primary">{item.judul}</h5>
                                    <p className={`card-text ${item.stok > 0 ? 'text-success' : 'text-danger'}`}>Stok Buku : {item.stok}</p>
                                    <button className="btn btn-outline-primary" disabled={!(item.stok > 0)} onClick={() => handleBtn(item.id)}>
                                        {item.stok > 0 ? 'Pilih' : 'Stok Buku Kosong'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={"Tambah Peminjaman"}>
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
            <form onSubmit={handleFormSubmit}>
                <div className="m-3">
                    <div className="form-group">
                        <label className="form-label"><i className="bi bi-book me-2" style={{color: '#17a2b8'}}></i>ID Buku <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formModal.id_buku} onChange={(e) => setFormModal({ ...formModal, id_buku: e.target.value })} required/>
                    </div>
                    <div className="form-group my-2">
                        <label className="form-label"><i class="bi bi-person-square me-2 text-success"></i>ID Member <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" onChange={(e) => setFormModal({ ...formModal, id_member: e.target.value })} required/>
                    </div>
                    <div className="form-group">
                        <label className="form-label"><i className="bi bi-calendar3 me-2" style={{color: '#467dc4'}}></i>Tanggal Peminjaman <span className="text-danger">*</span></label>
                        <input type="datetime-local" className="form-control" onChange={(e) => setFormModal({ ...formModal, tgl_pinjam: e.target.value })} required/>
                    </div>
                    <div className="form-group mt-2">
                        <label className="form-label"><i className="bi bi-calendar3 me-2" style={{color: '#467dc4'}}></i>Tanggal Pengembalian <span className="text-danger">*</span></label>
                        <input type="datetime-local" className="form-control" onChange={(e) => setFormModal({ ...formModal, tgl_pengembalian: e.target.value })} required/>
                    </div>
                </div>
                <div className="modal-footer mt-4 rounded-bottom" style={{backgroundColor: 'rgba(23, 162, 184, 0.05)'}}>
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-outline-primary btn-sm px-4">+ Tambah</button>
                    </div>
                </div>
            </form>
        </Modal>
        </>
    );
}