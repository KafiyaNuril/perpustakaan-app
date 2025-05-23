import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <>
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" style={{maxWidth: "600px"}} role="document">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header">
                        <div className="d-flex align-items-center w-100 position-relative">
                            <div className="flex-grow-1">
                                <h4 className="modal-title mb-1 fw-bold fs-3">{title}</h4>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="rounded btn"
                            onClick={onClose}
                            
                        >
                             <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div className="modal-body" style={{background: "#fff"}}>{children}</div>
                </div>
            </div>
        </div>
        </>
    );
}