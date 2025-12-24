import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import SuccessSound from "../sounds/beep-07a.mp3";
import WarningSound from "../sounds/beep-02.mp3";
import playSound from "../utils/playSound";

export default function Cart({ 
    cartItems, 
    increment, 
    decrement, 
    updateDiscount, 
    removeItem 
}) {
    // NEW: State to track if discount dialog is open
    const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);

    // CHANGED: Function to open discount dialog
    function openDiscountDialog(item) {
        setIsDiscountDialogOpen(true);

        Swal.fire({
            title: `Saisir la remise pour ${item.product.name}`,
            input: 'number',
            inputAttributes: {
                'aria-label': `Saisir la remise pour ${item.product.name}`,
                'autofocus': 'true',
                'min': '0',
                'max': (item.product.discounted_price * item.quantity).toFixed(2),
                'step': '0.01'
            },
            inputPlaceholder: `Saisir la remise (max : ${(item.product.discounted_price * item.quantity).toFixed(2)})`,
            inputValue: item.discount || 0,
            showCancelButton: true,
            confirmButtonText: 'Appliquer la remise',
            cancelButtonText: 'Annuler',
            allowEnterKey: true,
            inputValidator: (value) => {
                if (value === '') {
                    return 'Vous devez entrer une valeur de remise !';
                }
                const discountValue = parseFloat(value);
                const maxDiscount = item.product.discounted_price * item.quantity;

                if (discountValue < 0) {
                    return 'La remise ne peut pas être négative !';
                }
                if (discountValue > maxDiscount) {
                    return `La remise ne peut pas dépasser ${maxDiscount.toFixed(2)} !`;
                }
            }
        }).then((result) => {
            setIsDiscountDialogOpen(false);

            if (result.isConfirmed) {
                const discountValue = parseFloat(result.value);
                updateDiscount(item.id, discountValue);
                playSound(SuccessSound);
                toast.success('Remise appliquée avec succès');
            }

            // Refocus barcode input after discount dialog closes
            setTimeout(() => {
                const barcodeInput = document.getElementById("barcodeInput");
                if (barcodeInput) {
                    barcodeInput.focus();
                }
            }, 300);
        });

        // Manually focus the input after a delay to ensure Swal is rendered
        setTimeout(() => {
            const swalInput = document.querySelector('.swal2-input');
            if (swalInput) {
                swalInput.focus();
                swalInput.select();
            }
        }, 300);
    }

    return (
        <>
            <div className="user-cart">
                <div className="card">
                    <div className="card-body">
                        <div className="responsive-table">
                            <table className="table table-striped">
                                <thead>
                                    <tr className="text-center">
                                        <th>Nom</th>
                                        <th>Quantité</th>
                                        <th>Prix</th>
                                        <th>Remise</th>
                                        <th>Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => {
                                        const lineTotal = (item.product.discounted_price * item.quantity) - (item.discount || 0);
                                        return (
                                            <tr key={item.id}>
                                                <td>{item.product.name}</td>
                                                <td className="d-flex align-items-center">
                                                    <button
                                                        className="btn btn-warning btn-sm"
                                                        onClick={() =>
                                                            decrement(item.id)
                                                        }
                                                        title="Diminuer la quantité"
                                                    >
                                                        <i className="fas fa-minus"></i>
                                                    </button>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm qty ml-1 mr-1"
                                                        value={item.quantity}
                                                        disabled
                                                    />
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() =>
                                                            increment(item.id)
                                                        }
                                                        title="Augmenter la quantité"
                                                    >
                                                        <i className="fas fa-plus "></i>
                                                    </button>
                                                </td>
                                                <td className="text-right">
                                                    {item?.product?.discounted_price}
                                                    {item?.product?.price >
                                                        item?.product
                                                            ?.discounted_price ? (
                                                        <>
                                                            <br />
                                                            <del>
                                                                {item?.product?.price}
                                                            </del>
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}
                                                </td>
                                                <td>
                                                    {/* Discount input with French tooltip */}
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm qty ml-1 mr-1"
                                                        value={item.discount || 0}
                                                        readOnly
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => openDiscountDialog(item)}
                                                        title="Cliquez pour modifier la remise"
                                                    />
                                                </td>
                                                <td className="text-right">
                                                    {lineTotal.toFixed(2)}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-danger btn-sm mr-3"
                                                        onClick={() =>
                                                            removeItem(item.id)
                                                        }
                                                        title="Supprimer"
                                                    >
                                                        <i className="fas fa-trash "></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {cartItems.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center">
                                                Panier vide
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}