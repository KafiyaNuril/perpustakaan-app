import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../constant";
import Modal from "../../components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function BookIndex() {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal, setFormModal] = useState({
        no_rak: '',
        judul: '',
        pengarang: '',
        tahun_terbit: '',
        penerbit: '',
        stok: '',
        detail: ''
    });
    const [alert, setAlert] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState({});

    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

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

    function handleSubmitModal(e) {
        e.preventDefault();
        axios.post(API_URL + "buku", formModal, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
        })
            .then(() => {
                setIsModalOpen(false);
                setAlert("Berhasil menambahkan data buku");
                setFormModal({no_rak: '', judul: '', pengarang: '', tahun_terbit: '', penerbit: '', stok: '', detail: ''});
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

    function handleEditSubmit(e) {
        e.preventDefault();
        axios.put(API_URL+"buku/"+selectedBook.id, formModal, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(() => {
                setIsEditModalOpen(false);
                setSelectedBook(null);
                setAlert("Sukses update Buku");
                setFormModal({no_rak: '', judul: '', pengarang: '', tahun_terbit: '', penerbit: '', stok: '', detail: ''});
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

    function handleDelete() {
        axios.delete(API_URL +'buku/'+ selectedBook.id, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(() => {
            setIsDeleteModalOpen(false);
            setSelectedBook(null);
            setAlert("Berhasil menghapus data Buku");
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

    function detailBook(book) {
        setSelectedDetail(book);
        setIsDetailModalOpen(true);
    }

    const startIndex = (page - 1) * itemsPerPage;
    const pageBooks = books.slice(startIndex, startIndex + itemsPerPage);

    const totalPages = Math.ceil(books.length / itemsPerPage);

    return (
        <>
        <div className="container my-5 bg-white p-4 rounded shadow-sm">
            {alert !== "" ? (
                <div className="container pt-3">
                    <div className="alert alert-success text-center">{alert}</div>
                </div>
                ) : ""
            }
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="fw-bold mt-4">Daftar Buku <i class="bi bi-book-half"></i></h1>
                <div className="mt-4">
                    <button className="btn btn-success" onClick={() => {
                        setIsModalOpen(true);
                        setFormModal({no_rak: '', judul: '', pengarang: '', tahun_terbit: '', penerbit: '', stok: '', detail: ''});
                        setError([]);
                    }}> + Tambah Buku </button>
                </div>
            </div>
            <div className="mt-3">
                <div className="table-responsive rounded-3 overflow-hidden">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr className="fw-bold">
                                <td>#</td>
                                <td>Judul Buku</td>
                                <td>Pengarang</td>
                                <td>Penerbit</td>
                                <td>Tahun Terbit</td>
                                <td>Stok</td>
                                <td className="text-center"> Aksi
                                    <i className="bi bi-pencil-square mx-2"></i>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {pageBooks.map((value, index) => {
                                return (
                                    <tr key={value.id}>
                                        <td>{startIndex + index + 1}</td>
                                        <td>{value.judul}</td>
                                        <td>{value.pengarang}</td>
                                        <td>{value.penerbit}</td>
                                        <td>{value.tahun_terbit}</td>
                                        <td>{value.stok}</td>
                                        <td className="w-25 text-center">
                                            <button className="btn bg-transparent text-warning fs-5" onClick={() => { setSelectedBook(value); setFormModal({ no_rak: value.no_rak, judul: value.judul, pengarang: value.pengarang, tahun_terbit: value.tahun_terbit, penerbit: value.penerbit, stok: value.stok, detail: value.detail}); setIsEditModalOpen(true); setError([]);}}><FontAwesomeIcon icon={faPenToSquare} /></button>
                                            <button className="btn bg-transparent text-danger mx-1 fs-5" onClick={() => {setSelectedBook(value); setIsDeleteModalOpen(true); setError([]);}}><i className="bi bi-trash3-fill"></i></button>
                                            <button className="btn bg-transparent text-info fs-5" onClick={() => detailBook(value)}><i className="bi bi-eye"></i></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-center gap-2 m-4">
                    <button className="btn px-4" style={{ backgroundColor: "#9ACBD0", color: "white"}} disabled={page <= 1} onClick={() => setPage(page - 1)}> Prev </button>
                    <span className="align-self-center"> Page {page} of {totalPages} </span>
                    <button className="btn px-4" style={{ backgroundColor: "#17a2b8", color: "white"}} disabled={page >= totalPages} onClick={() => setPage(page + 1)}> Next </button>
                </div>
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Buku Baru"> 
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
                <div className="form-group d-flex justify-content-center">
                    <div className="m-3">
                        <div className="form-group">
                            <label className="form-label "><i className="bi bi-bookmark text-primary me-2"></i> No Rak <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={formModal.no_rak} onChange={(e) => setFormModal({ ...formModal, no_rak: e.target.value })} required/>
                        </div>
                        <div className="form-group my-2">
                            <label className="form-label"><i className="bi bi-book text-primary me-2"></i> Judul <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={formModal.judul} onChange={(e) => setFormModal({ ...formModal, judul: e.target.value })} required/>
                        </div>
                        <div className="form-group">
                            <label className="form-label"><i className="bi bi-person text-primary me-2"></i> Pengarang <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={formModal.pengarang} onChange={(e) => setFormModal({ ...formModal, pengarang: e.target.value })} required/>
                        </div>
                        <div className="form-group my-2">
                            <label className="form-label"><i className="bi bi-calendar3 text-primary me-2"></i> Tahun Terbit <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={formModal.tahun_terbit} onChange={(e) => setFormModal({ ...formModal, tahun_terbit: e.target.value })} required/>
                        </div>
                    </div>
                    <div className="m-3">
                        <div className="form-group">
                            <label className="form-label"><i className="bi bi-building text-success me-2"></i> Penerbit <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={formModal.penerbit} onChange={(e) => setFormModal({ ...formModal, penerbit: e.target.value })} required/>
                        </div>
                        <div className="form-group my-2">
                            <label className="form-label"><i className="bi bi-box text-success me-2"></i> Stok <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={formModal.stok} onChange={(e) => setFormModal({ ...formModal, stok: e.target.value })} required/>
                        </div>
                        <div className="form-group">
                            <label className="form-label"><i className="bi bi-file-text text-success me-2"></i> Detail <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={formModal.detail} onChange={(e) => setFormModal({ ...formModal, detail: e.target.value })} required/>
                        </div>
                    </div>
                </div>
                <div className="modal-footer mt-4 rounded-bottom" style={{backgroundColor: 'rgba(23, 162, 184, 0.05)'}}>
                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-outline-success btn-sm px-4">Tambah</button>
                </div>
            </div>
            </form>
        </Modal>

        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Data Buku">
            <form onSubmit={handleEditSubmit}>
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
                <div className="form-group d-flex justify-content-center">
                    <div className="m-3">
                        <div className="form-group">
                            <label className="form-label"><i className="bi bi-bookmark text-primary me-2"></i>No Rak <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={formModal.no_rak} onChange={(e) => setFormModal({ ...formModal, no_rak: e.target.value })}/>
                        </div>
                        <div className="form-group my-2">
                            <label className="form-label"><i className="bi bi-book text-primary me-2"></i>Judul <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={formModal.judul} onChange={(e) => setFormModal({ ...formModal, judul: e.target.value })}/>
                        </div>
                        <div className="form-group">
                            <label className="form-label"><i className="bi bi-person text-primary me-2"></i>Pengarang <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={formModal.pengarang} onChange={(e) => setFormModal({ ...formModal, pengarang: e.target.value })}/>
                        </div>
                        <div className="form-group mt-2">
                            <label className="form-label"><i className="bi bi-calendar3 text-primary me-2"></i>Tahun Terbit <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={formModal.tahun_terbit} onChange={(e) => setFormModal({ ...formModal, tahun_terbit: e.target.value })}/>
                        </div>
                    </div>
                    <div className="m-3">
                        <div className="form-group">
                            <label className="form-label"><i className="bi bi-building text-success me-2"></i> Penerbit <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={formModal.penerbit} onChange={(e) => setFormModal({ ...formModal, penerbit: e.target.value })}/>
                        </div>
                        <div className="form-group my-2">
                            <label className="form-label"><i className="bi bi-box text-success me-2"></i>Stok <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={formModal.stok} onChange={(e) => setFormModal({ ...formModal, stok: e.target.value })}/>
                        </div>
                        <div className="form-group">
                            <label className="form-label"><i className="bi bi-file-text text-success me-2"></i> Detail <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" value={formModal.detail} onChange={(e) => setFormModal({ ...formModal, detail: e.target.value })}/>
                        </div>
                    </div>
                </div>
                <div className="modal-footer mt-4 rounded-bottom" style={{backgroundColor: 'rgba(23, 162, 184, 0.05)'}}>
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-outline-success btn-sm px-4">Update</button>
                    </div>
                </div>
            </form>
        </Modal>

        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Hapus Data Buku">
            <p>Buku <strong>{selectedBook?.judul}</strong> akan dihapus</p>
            <div className="d-flex justify-content-end">
                <button className="btn btn-secondary mx-2" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
        </Modal>

        <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Detail Buku">
            <div className="container-fluid p-0">
                <div className="card p-4 mb-4">
                    <div className="row align-items-center">
                        <div className="col-2 text-center">
                            <div 
                                className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow"
                                style={{width: '60px', height: '60px'}}
                            >
                                <i className="bi bi-book" style={{fontSize: '24px', color: '#17a2b8'}}></i>
                            </div>
                        </div>
                        <div className="col-10">
                            <h4 className="mb-1 fw-bold">{selectedDetail.judul || 'Judul Buku'}</h4>
                            <p className="mb-0 opacity-75">
                                <i className="bi bi-person me-1"></i>
                                {selectedDetail.pengarang}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-header bg-white border-0 pb-2">
                                <h6 className="text-info mb-0 fw-bold">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Informasi Utama
                                </h6>
                            </div>
                            <div className="card-body pt-0">
                                <div className="mb-3">
                                    <label className="form-label text-muted small fw-semibold mb-1">NO RAK</label>
                                    <div className="p-2 rounded" style={{backgroundColor: 'rgba(23, 162, 184, 0.1)', border: '1px solid rgba(23, 162, 184, 0.2)'}}>
                                        <span className="text-info fw-bold">
                                            <i className="bi bi-bookmark me-2"></i>
                                            {selectedDetail.no_rak}
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted small fw-semibold mb-1">TAHUN TERBIT</label>
                                    <div className="p-2 rounded" style={{backgroundColor: 'rgba(32, 201, 151, 0.1)', border: '1px solid rgba(32, 201, 151, 0.2)'}}>
                                        <span className="text-success fw-bold">
                                            <i className="bi bi-calendar3 me-2"></i>
                                            {selectedDetail.tahun_terbit}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label text-muted small fw-semibold mb-1">STOK TERSEDIA</label>
                                    <div className="p-2 rounded d-flex align-items-center justify-content-between" style={{backgroundColor: 'rgba(111, 66, 193, 0.1)', border: '1px solid rgba(111, 66, 193, 0.2)'}}>
                                        <span className="fw-bold" style={{color: '#6f42c1'}}>
                                            <i className="bi bi-box me-2"></i>
                                            {selectedDetail.stok} Buku
                                        </span>
                                        <span className="badge rounded px-3" style={{backgroundColor: selectedDetail.stok > 0 ? '#20c997' : '#dc3545', color: 'white'}}>
                                            {selectedDetail.stok > 0 ? 'Tersedia' : 'Habis'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card h-100 border-0 shadow-sm" style={{borderLeft: '4px solid #20c997'}}>
                            <div className="card-header bg-white border-0 pb-2">
                                <h6 className="text-success mb-0 fw-bold">
                                    <i className="bi bi-building me-2"></i>
                                    Informasi Penerbit
                                </h6>
                            </div>
                            <div className="card-body pt-0">
                                <div className="mb-3">
                                    <label className="form-label text-muted small fw-semibold mb-1">PENERBIT</label>
                                    <div className="p-3 rounded text-center"z style={{backgroundColor: 'rgba(32, 201, 151, 0.1)', border: '1px solid rgba(32, 201, 151, 0.2)'}}>
                                        <i className="bi bi-building text-success mb-2" style={{fontSize: '24px'}}></i>
                                        <div className="text-success fw-bold"> {selectedDetail.penerbit}</div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted small fw-semibold mb-1">DESKRIPSI BUKU</label>
                                    <div 
                                        className="p-3 d-flex rounded text-center" style={{backgroundColor: 'rgba(111, 66, 193, 0.05)', border: '1px solid rgba(111, 66, 193, 0.1)'}} >
                                        <i className="bi bi-file-text me-2" style={{color: '#6f42c1'}}></i>
                                        <p className=" text-muted lh-lg"> {selectedDetail.detail} </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal-footer mt-4 rounded-bottom" style={{backgroundColor: 'rgba(23, 162, 184, 0.05)'}}>
                <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-info btn-sm px-4" onClick={() => setIsDetailModalOpen(false)}>
                        <i className="bi bi-x-lg me-2"></i>
                        Tutup
                    </button>
                </div>
            </div>
        </Modal>
        </>
    )
}