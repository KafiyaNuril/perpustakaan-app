import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../constant";
import Modal from "../../components/Modal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Data() {
    const [peminjaman, setPeminjaman] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState([]);
    const [alert, setAlert] = useState("");
    const [isPengembalianModal, setIsPengembalianModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState({}); //id_peminjaman
    const [isReturnDateModal, setIsReturnDateModal] = useState(false);
    const [member, setMember] = useState([]);
    const [isDetailMember, setIsDetailMember] = useState(false);

    const [denda, setDenda] = useState([]);
    const [isModalDenda, setIsModalDenda] = useState(false);
    const [formDenda, setFormDenda] = useState({
        id_member: "",
        id_buku: "",
        jumlah_denda: "",
        jenis_denda: "terlambat",
        deskripsi: ""
    });

    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
        fetchDenda();
    }, []);

    function fetchData() {
        axios.get(API_URL + "peminjaman", {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
        })
        .then(res => {
            setPeminjaman(res.data.data);
        })
        .catch(err => {
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
            setError(err.response.data);
        });
    }

    function fetchDenda() {
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

    function handleSubmit(e) {
        e.preventDefault();
        axios.put(API_URL + "peminjaman/pengembalian/" + selectedItem.id, {}, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => {
            setAlert("Buku berhasil dikembalikan.");
            setIsPengembalianModal(false);
            fetchData();
        })
        .catch(err => {
            if (err.response?.status == 401) {
                localStorage.removeItem("token");
                localStorage.clear();
                navigate("/login");
            }
            setError(err.response.data);
        });
    };
    
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
            fetchDenda(); 
        })
        .catch(err => {
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
            setError(err.response.data);
            
        });
    }

    function handleBtn(item) {
        setSelectedItem(item);
        setIsPengembalianModal(true);
    }

    function handleReturnDateBtn(id) {
        setSelectedItem(id);
        setIsReturnDateModal(true);
    }

    function detailMember(id) {
        axios.get(API_URL + "peminjaman/" + id, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
        })
        .then(res => {
            setMember(res.data.data);
            setIsDetailMember(true);
        })
        .catch(err => {
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
            setError(err.response.data);
        });
    }
    
    function exportExcel() {
        const formattedData = peminjaman.map((item, index) =>  ({
            No: index + 1,
            ID_Member: item.id_member,
            ID_Buku: item.id_buku,
            Tanggal_Peminjaman: new Date(item.tgl_pinjam).toLocaleDateString('id-ID', { dateStyle: 'long'}),
            Tanggal_Pengembalian: new Date(item.tgl_pengembalian).toLocaleDateString('id-ID', { dateStyle: 'long'}),
            Status_Pengembalian: item.status_pengembalian ? 'Pengembalian selesai' : 'Dalam masa peminjaman',
            Pengembalian_Buku: item.status_pengembalian ? new Date(item.updated_at).toLocaleDateString('id-ID', { dateStyle: 'long'}) : 'Belum dikembalikan'
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });
        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        saveAs(file, "data_peminjaman.xlsx");
    }

    function exportPdfByMember() {
        const doc = new jsPDF();

        doc.text(`Riwayat Peminjaman - ID Member: ${member[0]?.id_member}`, 14, 15);

        const tableData = member.map((item, index) => [
            index + 1,
            item.id,
            item.id_buku,
            new Date(item.tgl_pinjam).toLocaleDateString('id-ID', { dateStyle: 'long'}),
            new Date(item.tgl_pengembalian).toLocaleDateString('id-ID', { dateStyle: 'long'}),
            item.status_pengembalian === 1 ? "Sudah" : "Belum",
        ]);

        autoTable(doc, {
            head: [["No", "ID Peminjaman", "ID Buku", "Tgl Pinjam", "Tgl Pengembalian", "Status"]],
            body: tableData,
            startY: 20
        });

        doc.save(`Riwayat_Peminjaman_member_${member[0]?.id_member}.pdf`);
    }

    const startIndex = (page - 1) * itemsPerPage;
    const pagePeminjaman = peminjaman.slice(startIndex, startIndex + itemsPerPage);

    const totalPages = Math.ceil(peminjaman.length / itemsPerPage);

    return (
        <>
        <div className="container my-5 bg-white p-4 rounded shadow-sm">
            {alert !== "" ? (
                <div className="container pt-3">
                    <div className="alert alert-success text-center">{alert}</div>
                </div>
                ) : ""
            }
            <div className="d-flex justify-content-between">
                <h1 className="mt-5" >Data Pengembalian</h1>
                <div className="mt-5">
                    <button className="btn btn-success mt-5" onClick={exportExcel}>Export (.xlsx)</button>
                </div>
            </div>
            <div className="rounded overflow-hidden mt-3">
                <table className="table mt-5">
                    <thead className="border-bottom">
                        <tr className="fw-bold">
                            <th>No</th>
                            <th>ID Buku</th>
                            <th>ID Member</th>
                            <th>Tanggal Pinjam</th>
                            <th>Tanggal Pengembalian</th>
                            <th>Status Pengembalian</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pagePeminjaman.map((item, index) => (
                                <tr key={startIndex +index}>
                                    <td>{startIndex + index + 1}</td>
                                    <td>{item.id_buku}</td>
                                    <td>{item.id_member}</td>
                                    <td>{new Date(item.tgl_pinjam).toLocaleDateString('id-ID', { dateStyle: 'long'})}</td>
                                    <td>{new Date(item.tgl_pengembalian).toLocaleDateString('id-ID', { dateStyle: 'long'})}</td>
                                    <td className= {item.status_pengembalian ? 'text-success fw-bold' : 'text-danger fw-bold'} style={item.status_pengembalian ? { cursor: 'pointer' } : {}}
                                    onClick={() => item.status_pengembalian ? handleReturnDateBtn(item) : ''}>{item.status_pengembalian ? 'Pengembalian selesai' : 'Dalam masa peminjaman'}</td>
                                    <td className="d-flex gap-2">
                                        <button className="btn btn-secondary" onClick={() => detailMember(item.id_member)}> Riwayat </button>
                                        {item.status_pengembalian === 1 ? (() => {
                                            const updatedAt = new Date(item.updated_at);
                                            const tglPengembalian = new Date(item.tgl_pengembalian);

                                            const terlambat = Math.ceil((updatedAt - tglPengembalian) / (1000 * 60 * 60 * 24));
                                            const isTerlambat = terlambat > 1;

                                            // Cek apakah denda sudah ditambahkan dari data dendaList
                                            const sudahDidenda = denda.some(d =>
                                                d.id_member === item.id_member && d.id_buku === item.id_buku
                                            );

                                            if (isTerlambat && !sudahDidenda) {
                                                return (
                                                    <button
                                                        className="btn btn-warning"
                                                        onClick={() => {
                                                            const jumlahDenda = terlambat * 1000;
                                                            setFormDenda({
                                                                ...formDenda,
                                                                id_member: item.id_member,
                                                                id_buku: item.id_buku,
                                                                jumlah_denda: jumlahDenda.toString(),
                                                            });
                                                            setIsModalDenda(true);
                                                        }}
                                                    >
                                                        Tambah Denda
                                                    </button>
                                                );
                                            } else {
                                                return <button className="btn btn-outline-success" disabled>Selesai</button>;
                                            }
                                        })() : (
                                            <button className="btn btn-success" onClick={() => handleBtn(item)}>
                                                Pengembalian
                                            </button>
                                        )}

                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className="d-flex justify-content-center gap-2 mb-3">
                    <button className="btn px-4" style={{ backgroundColor: "#9ACBD0", color: "white"}} disabled={page <= 1} onClick={() => setPage(page - 1)}> Prev </button>
                    <span className="align-self-center"> Page {page} of {totalPages} </span>
                    <button className="btn px-4" style={{ backgroundColor: "#17a2b8", color: "white"}} disabled={page >= totalPages} onClick={() => setPage(page + 1)}> Next </button>
                </div>
            </div>
        </div>

        <Modal isOpen={isReturnDateModal} onClose={() => setIsReturnDateModal(false)} title="Tanggal Pengembalian">
            <p className="text-center">Sudah Dikembalikan Pada <span className="fw-bold">{new Date(selectedItem.updated_at).toLocaleDateString('id-ID', { dateStyle: 'long'})}</span></p>
        </Modal>

        <Modal isOpen={isPengembalianModal} onClose={() => setIsPengembalianModal(false)} title="Konfirmasi Pengembalian">
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
            <form onSubmit={handleSubmit}>
                <p>Apakah Anda yakin ingin mengembalikan buku ini?</p>
                {/* <button type="submit" className="btn btn-primary">Ya, Kembalikan</button> */}
                <div className="modal-footer mt-4 rounded-bottom" style={{backgroundColor: 'rgba(23, 162, 184, 0.05)'}}>
                <div className="d-flex gap-2">
                    <button type="Submit" className="btn btn-outline-info btn-sm px-4">
                        Ya, Kembalikan
                    </button>
                </div>
            </div>
            </form>
        </Modal>

        <Modal isOpen={isDetailMember} onClose={() => setIsDetailMember(false)} title="Riwayat Peminjaman">
            <div className="text-center mb-3">
                {
                    member.length > 0 ? (
                        <>
                            <div className="d-flex justify-content-around">
                                <div className="text-start">
                                    <h5 className="fw-bold">ID Member: {member[0].id_member}</h5> {/*ambil element pertama dari array*/}
                                    <small>Total Riwayat: {member.length} peminjaman</small>
                                </div>
                                <button className="btn btn-danger mt-2" onClick={exportPdfByMember}>
                                    Export PDF
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-danger">Data riwayat tidak ditemukan</p>
                    )
                }
            </div>
            <hr className="my-4" />
            <div className="row mb-3 d-flex justify-content-center">
                <div className="table-responsive" style={{maxHeight: '400px', overflowY: 'auto'}}>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">ID Peminjaman</th>
                                <th scope="col">ID Buku</th>
                                <th scope="col">Tanggal Pinjam</th>
                                <th scope="col">Tanggal Pengembalian</th>
                                <th scope="col">Status Pengembalian</th>
                            </tr>
                        </thead>
                        <tbody>
                            { member.map((item, index) => { 
                                return (
                                    <tr>
                                        <th scope="row">{index + 1}</th>
                                        <td>{item.id}</td>
                                        <td>{item.id_buku}</td>
                                        <td>{item.tgl_pinjam}</td>
                                        <td>{item.tgl_pengembalian}</td>
                                        <td className={item.status_pengembalian === 1 ? 'text-success' : 'text-danger'}>{item.status_pengembalian === 1 ? 'Sudah' : 'Belum'}</td>
                                    </tr>
                                )}
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="modal-footer mt-4 rounded-bottom" style={{backgroundColor: 'rgba(23, 162, 184, 0.05)'}}>
                <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-info btn-sm px-4" onClick={() => setIsDetailMember(false)}>
                        <i className="bi bi-x-lg me-2"></i>
                        Tutup
                    </button>
                </div>
            </div>
        </Modal>

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
                        <input type="text" className="form-control" value={formDenda.id_member} onChange={(e) => setFormDenda({ ...formDenda, id_member: e.target.value })}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label">ID Buku <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formDenda.id_buku} onChange={(e) => setFormDenda({ ...formDenda, id_buku: e.target.value })}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Jumlah Denda <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formDenda.jumlah_denda} onChange={(e) => setFormDenda({ ...formDenda, jumlah_denda: e.target.value })}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Jenis Denda</label>
                        <select className="form-control" name="jenis_denda" value={formDenda.jenis_denda} onChange={(e) => setFormDenda({ ...formDenda, jenis_denda: e.target.value })}>
                            <option value="">Pilih Jenis Denda</option>
                            <option value="terlambat">Terlambat</option>
                            <option value="kerusakan">Kerusakan</option>
                            <option value="lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Deskripsi <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value={formDenda.deskripsi} onChange={(e) => setFormDenda({ ...formDenda, deskripsi: e.target.value })}/>
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