import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../constant";
import Modal from "../../components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function Member() {
    const [members, setMembers] = useState([]);
    const [error, setError] = useState([]);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formModal, setFormModal] = useState({no_ktp: '', nama: '', alamat: '', tgl_lahir: ''});
    const [alert, setAlert] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState({});
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, []);

    function fetchData() {
        axios.get(API_URL + "member", {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
        })
        .then(res => {
            setMembers(res.data);
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
        axios.post(API_URL + "member", formModal, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
        })
            .then(() => {
                setIsModalOpen(false);
                setAlert("Berhasil mendaftarkan member");
                setFormModal({no_ktp: '', nama: '', alamat: '', tgl_lahir: ''});
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
        axios.put(API_URL+"member/"+selectedMember.id, formModal, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(() => {
                setIsEditModalOpen(false);
                setSelectedMember(null);
                setAlert("Sukses update data Member");
                setFormModal({no_ktp: '', nama: '', alamat: '', tgl_lahir: ''});
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
        axios.delete(API_URL +'member/'+ selectedMember.id, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(() => {
            setIsDeleteModalOpen(false);
            setSelectedMember(null);
            setAlert("Berhasil menghapus data Member");
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

    function detailMember(Member) {
        setSelectedDetail(Member);
        setIsDetailModalOpen(true);
    }

    const startIndex = (page - 1) * itemsPerPage;
    const pageMembers = members.slice(startIndex, startIndex + itemsPerPage);

    const totalPages = Math.ceil(members.length / itemsPerPage);

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
                <h1 className="mt-4 fw-bold">Daftar Member <i class="bi bi-people-fill"></i></h1>
                <button className="btn btn-success my-4 mt-5" onClick={() => {
                    setIsModalOpen(true);
                    setFormModal({no_ktp: '', nama: '', alamat: '', tgl_lahir: ''});
                    setError([]);
                }}> + Tambah Member </button>
            </div>
            <div className="rounded overflow-hidden mt-3">
                <table className="table table-borderless align-middle">
                    <thead className="border-bottom text-center">
                        <tr className="fw-bold">
                            <td>#</td>
                            <td className="text-start">No KTP</td>
                            <td>ID Member</td>
                            <td>Nama</td>
                            <td>Alamat</td>
                            <td>Tanggal Lahir</td>
                            <td> Aksi
                                <i className="bi bi-pencil-square mx-2"></i>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {pageMembers.map((value, index) => {
                            return (
                                <tr key={value.id} className="text-center">
                                    <td>{index + 1}</td>
                                    <td className="text-start">{value.no_ktp}</td>
                                    <td>{value.id}</td>
                                    <td>{value.nama}</td>
                                    <td className="text-end">{value.alamat}</td>
                                    <td>{value.tgl_lahir}</td>
                                    <td className="w-25">
                                        <button className="btn bg-transparent text-warning fs-5" onClick={() => {
                                            setSelectedMember(value);
                                            setFormModal({ no_ktp: value.no_ktp, nama: value.nama, alamat: value.alamat, tgl_lahir: value.tgl_lahir});
                                            setIsEditModalOpen(true);
                                            setError([]);
                                        }}><FontAwesomeIcon icon={faPenToSquare} /></button>
                                        <button className="btn bg-transparent text-danger mx-1 fs-5" onClick={() => {
                                            setSelectedMember(value);
                                            setIsDeleteModalOpen(true);
                                            setError([]);
                                        }}><i className="bi bi-trash3-fill"></i></button>
                                        <button className="btn bg-transparent text-info fs-5" onClick={() => detailMember(value)}><i className="bi bi-eye"></i></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="d-flex justify-content-center gap-2 m-4">
                    <button className="btn px-4" style={{ backgroundColor: "#9ACBD0", color: "white"}} disabled={page <= 1} onClick={() => setPage(page - 1)}> Prev </button>
                    <span className="align-self-center"> Page {page} of {totalPages} </span>
                    <button className="btn px-4" style={{ backgroundColor: "#17a2b8", color: "white"}} disabled={page >= totalPages} onClick={() => setPage(page + 1)}> Next </button>
                </div>
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Member Baru"> 
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
                        <label className="form-label"><i class="bi bi-person-vcard me-2 text-info"></i>No KTP <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formModal.no_ktp} onChange={(e) => setFormModal({ ...formModal, no_ktp: e.target.value })} required/>
                    </div>
                    <div className="form-group my-2">
                        <label className="form-label"><i class="bi bi-person-square me-2 text-success"></i>Nama <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formModal.nama} onChange={(e) => setFormModal({ ...formModal, nama: e.target.value })} required/>
                    </div>
                    <div className="form-group">
                        <label className="form-label"><i class="bi bi-map-fill me-2" style={{color: '#6f42c1'}}></i>Alamat <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formModal.alamat} onChange={(e) => setFormModal({ ...formModal, alamat: e.target.value })} required/>
                    </div>
                    <div className="form-group mt-2">
                        <label className="form-label"><i className="bi bi-calendar3 me-2" style={{color: '#467dc4'}}></i>Tanggal Lahir <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formModal.tgl_lahir} onChange={(e) => setFormModal({ ...formModal, tgl_lahir: e.target.value })} required/>
                    </div>
                </div>
                <div className="modal-footer mt-4 rounded-bottom" style={{backgroundColor: 'rgba(23, 162, 184, 0.05)'}}>
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-outline-primary btn-sm px-4">+ Tambah</button>
                    </div>
                </div>
            </form>
        </Modal>

        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Data Member">
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
                <div className="m-3">
                    <div className="form-group">
                        <label className="form-label"><i class="bi bi-person-vcard me-2 text-info"></i>No KTP <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formModal.no_ktp} onChange={(e) => setFormModal({ ...formModal, no_ktp: e.target.value })} required/>
                    </div>
                    <div className="form-group my-2">
                        <label className="form-label"><i class="bi bi-person-square me-2 text-success"></i>Nama <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formModal.nama} onChange={(e) => setFormModal({ ...formModal, nama: e.target.value })} required/>
                    </div>
                    <div className="form-group">
                        <label className="form-label"><i class="bi bi-map-fill me-2" style={{color: '#6f42c1'}}></i>Alamat <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formModal.alamat} onChange={(e) => setFormModal({ ...formModal, alamat: e.target.value })} required/>
                    </div>
                    <div className="form-group mt-2">
                        <label className="form-label"><i className="bi bi-calendar3 me-2" style={{color: '#467dc4'}}></i>Tanggal Lahir <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formModal.tgl_lahir} onChange={(e) => setFormModal({ ...formModal, tgl_lahir: e.target.value })} required/>
                    </div>
                </div>
                <div className="modal-footer mt-4 rounded-bottom" style={{backgroundColor: 'rgba(23, 162, 184, 0.05)'}}>
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-outline-success btn-sm px-4">Update</button>
                    </div>
                </div>
            </form>
        </Modal>

        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Hapus Data Member">
            <p>Data <strong>{selectedMember?.nama}</strong> akan dihapus</p>
            <div className="d-flex justify-content-end">
                <button className="btn btn-secondary mx-2" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
        </Modal>

        <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Detail Data Member">
            <div className="d-flex justify-content-center">
                <div className="card w-75 border-0 shadow-sm">
                    <div className="card-header bg-white border-0 pb-2">
                        <h6 className="text-info mb-0 fw-bold">
                            <i className="bi bi-info-circle me-2"></i>
                            Informasi Utama
                        </h6>
                    </div>
                    <div className="card-body pt-0">
                        <div className="mb-3">
                            <label className="form-label text-muted small fw-semibold mb-1">NO KTP</label>
                            <div className="p-2 rounded" style={{backgroundColor: 'rgba(23, 162, 184, 0.1)', border: '1px solid rgba(23, 162, 184, 0.2)'}}>
                                <span className="text-info fw-bold">
                                    <i class="bi bi-person-vcard me-2"></i>
                                    {selectedDetail.no_ktp}
                                </span>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted small fw-semibold mb-1">NAMA</label>
                            <div className="p-2 rounded" style={{backgroundColor: 'rgba(32, 201, 151, 0.1)', border: '1px solid rgba(32, 201, 151, 0.2)'}}>
                                <span className="text-success fw-bold">
                                    <i class="bi bi-person-square me-2"></i>
                                    {selectedDetail.nama}
                                </span>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-muted small fw-semibold mb-1">ALAMAT</label>
                            <div className="p-2 rounded" style={{backgroundColor: 'rgba(111, 66, 193, 0.1)', border: '1px solid rgba(111, 66, 193, 0.2)'}}>
                                <span className="fw-bold" style={{color: '#6f42c1'}}>
                                    <i class="bi bi-map-fill me-2"></i>
                                    {selectedDetail.alamat}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="form-label text-muted small fw-semibold mb-1">TANGGAL LAHIR</label>
                            <div className="p-2 rounded" style={{backgroundColor: 'rgba(61, 116, 189, 0.1)', border: '1px solid rgba(70, 125, 196, 0.19))'}}>
                                <span className="fw-bold" style={{color: '#467dc4'}}>
                                    <i className="bi bi-calendar3 me-2"></i>
                                    {selectedDetail.tgl_lahir}
                                </span>
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