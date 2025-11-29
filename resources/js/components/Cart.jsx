import axios from "axios";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import SuccessSound from "../sounds/beep-07a.mp3";
import WarningSound from "../sounds/beep-02.mp3";
import playSound from "../utils/playSound";

export default function Cart({ carts, setCartUpdated, cartUpdated }) {
    // NEW: State to track if discount dialog is open
    const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);

    function increment(id) {
        axios
            .put("/admin/cart/increment", {
                id: id,
            })
            .then((res) => {
                setCartUpdated(!cartUpdated);
                playSound(SuccessSound);
                toast.success(res?.data?.message);
            })
            .catch((err) => {
                playSound(WarningSound);
                toast.error(err.response.data.message);
            });
    }
    
    function decrement(id) {
        axios
            .put("/admin/cart/decrement", {
                id: id,
            })
            .then((res) => {
                setCartUpdated(!cartUpdated);
                playSound(SuccessSound);
                toast.success(res?.data?.message);
            })
            .catch((err) => {
                playSound(WarningSound);
                toast.error(err.response.data.message);
            });
    }
    
    function destroy(id) {
        axios
            .put("/admin/cart/delete", {
                id: id,
            })
            .then((res) => {
                console.log(res);
                setCartUpdated(!cartUpdated);
                playSound(SuccessSound);
                toast.success(res?.data?.message);
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            });
    }

    // NEW: Updated discount function with dialog
    function openDiscountDialog(item) {
        setIsDiscountDialogOpen(true);
        
        Swal.fire({
            title: `Enter Discount for ${item.product.name}`,
            input: 'number',
            inputAttributes: {
                'aria-label': `Enter discount for ${item.product.name}`,
                'autofocus': 'true',
                'min': '0',
                'max': (item.product.discounted_price * item.quantity).toFixed(2),
                'step': '0.01'
            },
            inputPlaceholder: `Enter discount (max: ${(item.product.discounted_price * item.quantity).toFixed(2)})`,
            inputValue: item.discount || 0,
            showCancelButton: true,
            confirmButtonText: 'Apply Discount',
            cancelButtonText: 'Cancel',
            allowEnterKey: true,
            inputValidator: (value) => {
                if (value === '') {
                    return 'You need to enter a discount value!';
                }
                const discountValue = parseFloat(value);
                const maxDiscount = item.product.discounted_price * item.quantity;
                
                if (discountValue < 0) {
                    return 'Discount cannot be negative!';
                }
                if (discountValue > maxDiscount) {
                    return `Discount cannot exceed ${maxDiscount.toFixed(2)}!`;
                }
            }
        }).then((result) => {
            setIsDiscountDialogOpen(false);
            
            if (result.isConfirmed) {
                const discountValue = parseFloat(result.value);
                applyDiscount(item.id, discountValue);
            }
            
            // NEW: Refocus barcode input after discount dialog closes
            setTimeout(() => {
                const barcodeInput = document.getElementById("barcodeInput");
                if (barcodeInput) {
                    barcodeInput.focus();
                }
            }, 300);
        });

        // NEW: Manually focus the input after a delay to ensure Swal is rendered
        setTimeout(() => {
            const swalInput = document.querySelector('.swal2-input');
            if (swalInput) {
                swalInput.focus();
                swalInput.select();
            }
        }, 300);
    }

    // NEW: Separate function to apply the discount
    function applyDiscount(id, discountValue) {
        axios
            .put("/admin/cart/discount", {
                id: id,
                discount: discountValue,
            })
            .then((res) => {
                setCartUpdated(!cartUpdated);
                playSound(SuccessSound);
                toast.success(res?.data?.message);
            })
            .catch((err) => {
                playSound(WarningSound);
                toast.error(err.response.data.message);
            });
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
                                        <th>Name</th>
                                        <th>Quantity</th>
                                        <th></th>
                                        <th>Price</th>
                                        <th>Discount</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {carts.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.product.name}</td>
                                            <td className="d-flex align-items-center">
                                                <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() =>
                                                        decrement(item.id)
                                                    }
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
                                                >
                                                    <i className="fas fa-plus "></i>
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm mr-3"
                                                    onClick={() =>
                                                        destroy(item.id)
                                                    }
                                                >
                                                    <i className="fas fa-trash "></i>
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
                                                {/* NEW: Updated discount input with click handler */}
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm qty ml-1 mr-1"
                                                    value={item.discount || 0}
                                                    readOnly
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => openDiscountDialog(item)}
                                                    title="Click to edit discount"
                                                />
                                            </td>
                                            <td className="text-right">
                                                { (item?.row_total || 0) - (item?.discount || 0) }
                                            </td>
                                        </tr>
                                    ))}
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