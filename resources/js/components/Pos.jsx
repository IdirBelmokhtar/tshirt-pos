import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cart from "./Cart";
import toast, { Toaster } from "react-hot-toast";
import CustomerSelect from "./CutomerSelect";

import SuccessSound from "../sounds/beep-07a.mp3";
import WarningSound from "../sounds/beep-02.mp3";
import playSound from "../utils/playSound";

export default function Pos() {
    const [products, setProducts] = useState([]);
    const [carts, setCarts] = useState([]);
    const [orderDiscount, setOrderDiscount] = useState(0);
    const [paid, setPaid] = useState(0);
    const [due, setDue] = useState(0);
    const [total, setTotal] = useState(0);
    const [updateTotal, setUpdateTotal] = useState(0);
    const [customerId, setCustomerId] = useState();
    const [cartUpdated, setCartUpdated] = useState(false);
    const [productUpdated, setProductUpdated] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchBarcode, setSearchBarcode] = useState("");
    const { protocol, hostname, port } = window.location;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const fullDomainWithPort = `${protocol}//${hostname}${port ? `:${port}` : ""
        }`;
    const getProducts = useCallback(
        async (search = "", page = 1, barcode = "") => {
            setLoading(true);
            try {
                const res = await axios.get('/admin/get/products', {
                    params: { search, page, barcode },
                });
                const productsData = res.data;
                setProducts((prev) => [...prev, ...productsData.data]); // Append new products
                if (productsData.data.length === 1 && barcode != "") {
                    addProductToCart(productsData.data[0].id);
                    getCarts();
                }
                setTotalPages(productsData.meta.last_page); // Get total pages

                // Here i verifie every caracter of searchBarcode is written
                setSearchBarcode("");
                if (barcode === " ") { // SPACE → Checkout
                    document.getElementById("checkoutBtn").click();
                }
                if (barcode === "0") { // 0 → Clear
                    document.querySelector(".btn.bg-gradient-danger").click();
                }
                if (barcode === "-") { // - → Open Discount
                    if (updateTotal <= 0) {

                        getProducts("", currentPage, "");
                    }
                    document.querySelector('input[placeholder="Enter discount"]').click();
                }

            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false); // Set loading to false
            }
        },
        []
    );
    const getUpdatedProducts = useCallback(async () => {
        try {
            const res = await axios.get('/admin/get/products');
            const productsData = res.data;
            setProducts(productsData.data);
            setTotalPages(productsData.meta.last_page); // Get total pages
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, []);
    useEffect(() => {
        getUpdatedProducts();
    }, [productUpdated]);

    const getCarts = async () => {
        try {
            const res = await axios.get('/admin/cart');
            const data = res.data;
            setTotal(data?.total);
            setUpdateTotal(data?.total - orderDiscount);
            setCarts(data?.carts);
        } catch (error) {
            console.error("Error fetching carts:", error);
        }
    };

    useEffect(() => {
        getCarts();
    }, []);

    useEffect(() => {
        getCarts();
    }, [cartUpdated]);

    useEffect(() => {
        let paid1 = paid;
        let disc = orderDiscount;
        if (paid == "") {
            paid1 = 0;
        }
        if (orderDiscount == "") {
            disc = 0;
        }
        const updatedTotalAmount = parseFloat(total) - parseFloat(disc);
        const dueAmount = updatedTotalAmount - parseFloat(paid1);
        setUpdateTotal(updatedTotalAmount?.toFixed(2));
        setDue(dueAmount?.toFixed(2));
    }, [orderDiscount, paid, total]);
    useEffect(() => {
        if (searchQuery) {
            setProducts([]);
            getProducts(searchQuery, currentPage, "");
        }
        setSearchBarcode("");
    }, [currentPage, searchQuery]);

    useEffect(() => {
        if (searchBarcode) {
            setProducts([]);
            getProducts("", currentPage, searchBarcode);
        }
    }, [searchBarcode]);

    // Infinite scroll logic
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight
            ) {
                // Load next page if not on the last page
                if (currentPage < totalPages) {
                    setCurrentPage((prev) => prev + 1);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [currentPage, totalPages]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleShortcuts = (e) => {
            const active = document.activeElement;
            const tag = active && active.tagName ? active.tagName.toLowerCase() : null;
            const isEditable =
                tag === "input" ||
                tag === "textarea" ||
                tag === "select" ||
                (active && active.isContentEditable);

            // SPACE → Checkout
            if (e.code === "Space" && !isEditable) {
                e.preventDefault();
                const checkoutBtn = document.getElementById("checkoutBtn");
                if (checkoutBtn) checkoutBtn.click();
            }

            // DELETE / BACKSPACE → Clear
            if ((e.code === "Delete" || e.code === "Backspace") && !isEditable) {
                const clearBtn = document.querySelector(".btn.bg-gradient-danger");
                if (clearBtn) clearBtn.click();
            }

            // CTRL → Focus barcode input
            if (e.ctrlKey && !isEditable) {
                const barcodeEl = document.getElementById("barcodeInput");
                if (barcodeEl) barcodeEl.focus();
            }

            // % key (Shift + 5) → Open Discount
            if (e.shiftKey && e.code === "Digit5" && !isEditable) {
                e.preventDefault();
                const discountInput = document.querySelector('input[placeholder="Enter discount"]');
                if (discountInput) discountInput.click();
            }
        };

        window.addEventListener("keydown", handleShortcuts);
        return () => window.removeEventListener("keydown", handleShortcuts);
    }, [total, orderDiscount]);

    function addProductToCart(id) {
        axios
            .post("/admin/cart", { id })
            .then((res) => {
                setCartUpdated(!cartUpdated);
                setSearchQuery("");
                playSound(SuccessSound);
                toast.success(res?.data?.message);
                setSearchBarcode("");
                const barcodeEl = document.getElementById("barcodeInput");
                if (barcodeEl) {
                    barcodeEl.focus();
                }
            })
            .catch((err) => {
                playSound(WarningSound);
                toast.error(err.response.data.message);
            });
    }
    function cartEmpty() {
        // if (total <= 0) {
        //     return;
        // }

        axios
            .put("/admin/cart/empty")
            .then((res) => {
                setCartUpdated(!cartUpdated);
                setOrderDiscount(0);
                setProductUpdated(!productUpdated);
                setSearchQuery("");
                playSound(SuccessSound);
                toast.success(res?.data?.message);
            })
            .catch((err) => {
                playSound(WarningSound);
                toast.error(err.response.data.message);
            });

        // Swal.fire({
        //     title: "Are you sure you want to delete Cart?",
        //     showDenyButton: true,
        //     confirmButtonText: "Yes",
        //     denyButtonText: "No",
        //     customClass: {
        //         actions: "my-actions",
        //         cancelButton: "order-1 right-gap",
        //         confirmButton: "order-2",
        //         denyButton: "order-3",
        //     },
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         axios
        //             .put("/admin/cart/empty")
        //             .then((res) => {
        //                 setCartUpdated(!cartUpdated);
        //                 setOrderDiscount(0);
        //                 setProductUpdated(!productUpdated);
        //                 setSearchQuery("");
        //                 playSound(SuccessSound);
        //                 toast.success(res?.data?.message);
        //             })
        //             .catch((err) => {
        //                 playSound(WarningSound);
        //                 toast.error(err.response.data.message);
        //             });
        //     } else if (result.isDenied) {
        //         return;
        //     }
        // });
    }
    function orderCreate() {
        if (total <= 0) {
            return;
        }
        if (!customerId) {
            toast.error("Please select customer");
            return;
        }

        axios
            .put("/admin/order/create", {
                customer_id: customerId,
                order_discount: parseFloat(orderDiscount) || 0,
                paid: parseFloat(paid) || 0,
            })
            .then((res) => {
                axios
                    .put("/admin/cart/empty")
                    .then((res) => {
                        setCartUpdated(!cartUpdated);
                        setOrderDiscount(0);
                        setProductUpdated(!productUpdated);
                        setSearchQuery("");
                        playSound(SuccessSound);
                        toast.success(res?.data?.message);
                    })
                    .catch((err) => {
                        playSound(WarningSound);
                        toast.error(err.response.data.message);
                    });
                // setCartUpdated(!cartUpdated);
                // setProductUpdated(!productUpdated);
                // toast.success(res?.data?.message);
                // // window.location.href = `orders/invoice/${res?.data?.order?.id}`;
                // window.location.href = `orders/pos-invoice/${res?.data?.order?.id}`;
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            });

        // Swal.fire({
        //     title: `Are you sure you want to complete this order? <br>Due: ${due}`,
        //     showDenyButton: true,
        //     confirmButtonText: "Yes",
        //     denyButtonText: "No",
        //     customClass: {
        //         actions: "my-actions",
        //         cancelButton: "order-1 right-gap",
        //         confirmButton: "order-2",
        //         denyButton: "order-3",
        //     },
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         axios
        //             .put("/admin/order/create", {
        //                 customer_id: customerId,
        //                 order_discount: parseFloat(orderDiscount) || 0,
        //                 paid: parseFloat(paid) || 0,
        //             })
        //             .then((res) => {
        //                 axios
        //                     .put("/admin/cart/empty")
        //                     .then((res) => {
        //                         setCartUpdated(!cartUpdated);
        //                         playSound(SuccessSound);
        //                         toast.success(res?.data?.message);
        //                     })
        //                     .catch((err) => {
        //                         playSound(WarningSound);
        //                         toast.error(err.response.data.message);
        //                     });
        //                 // setCartUpdated(!cartUpdated);
        //                 // setProductUpdated(!productUpdated);
        //                 // toast.success(res?.data?.message);
        //                 // // window.location.href = `orders/invoice/${res?.data?.order?.id}`;
        //                 // window.location.href = `orders/pos-invoice/${res?.data?.order?.id}`;
        //             })
        //             .catch((err) => {
        //                 toast.error(err.response.data.message);
        //             });
        //     } else if (result.isDenied) {
        //         return;
        //     }
        // });
    }
    return (
        <>
            <div className="card">
                <div class="mt-n5 mb-3 d-flex justify-content-end">
                    {/* <a
                        href="/admin"
                        className="btn bg-gradient-primary mr-2"
                    >
                        Dashboard
                    </a> */}
                    <a
                        href="/admin/orders"
                        className="btn bg-gradient-primary"
                    >
                        Sale List
                    </a>
                </div>



                <div className="mb-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body d-flex justify-content-between align-items-center py-4">
                            <div className="text-center w-100">
                                <div style={{ fontSize: "6rem", fontWeight: 700 }}>
                                    {updateTotal || "0"} DA
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-body p-2 p-md-4 pt-0">
                    <div className="row">
                        <div className="col-md-6 col-lg-5 mb-2">
                            <div className="row mb-2">
                                <div className="col-12">
                                    <CustomerSelect
                                        setCustomerId={setCustomerId}
                                    />
                                </div>
                                {/* <div className="col-6">
                                <form className="form">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter barcode"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                </form>
                            </div> */}
                            </div>
                            <Cart
                                carts={carts}
                                setCartUpdated={setCartUpdated}
                                cartUpdated={cartUpdated}
                            />
                            <div className="card">
                                <div className="card-body">
                                    <div className="row text-bold mb-1">
                                        <div className="col">Sub Total:</div>
                                        <div className="col text-right mr-2">
                                            {total}
                                        </div>
                                    </div>
                                    <div className="row text-bold mb-1">
                                        <div className="col">Discount:</div>
                                        <div className="col text-right mr-2">
                                            <input
                                                // hidden
                                                type="number"
                                                className="form-control form-control-sm"
                                                placeholder="Enter discount"
                                                min={0}
                                                disabled={total <= 0}
                                                value={orderDiscount}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    if (
                                                        parseFloat(value) >
                                                        total ||
                                                        parseFloat(value) < 0
                                                    ) {
                                                        return;
                                                    }
                                                    setOrderDiscount(value);
                                                }}
                                                onClick={() => {
                                                    Swal.fire({
                                                        title: 'Enter Discount',
                                                        input: 'number',
                                                        inputAttributes: {
                                                            'aria-label': 'Enter your discount'
                                                        },
                                                        inputPlaceholder: 'Enter discount',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Yes',
                                                        cancelButtonText: 'No',
                                                        inputValidator: (value) => {
                                                            if (!value) {
                                                                return 'You need to write something!';
                                                            }
                                                            const parsedValue = parseFloat(value);
                                                            if (parsedValue < 0 || parsedValue > total) {
                                                                return 'Invalid discount value!';
                                                            }
                                                            setOrderDiscount(parsedValue);
                                                        }
                                                    });
                                                }}
                                            />
                                        </div>


                                        {/* <div className="col-6">
                                            <form className="form" onClick={() => {
                                                Swal.fire({
                                                    title: 'Enter Discount',
                                                    input: 'number',
                                                    inputAttributes: {
                                                        'aria-label': 'Enter your discount'
                                                    },
                                                    inputPlaceholder: 'Enter discount',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Yes',
                                                    cancelButtonText: 'No',
                                                    inputValidator: (value) => {
                                                        if (!value) {
                                                            return 'You need to write something!';
                                                        }
                                                        const parsedValue = parseFloat(value);
                                                        if (parsedValue < 0 || parsedValue > total) {
                                                            return 'Invalid discount value!';
                                                        }
                                                        setOrderDiscount(parsedValue);
                                                    }
                                                });
                                            }}>
                                                <input
                                                    type="text"
                                                    placeholder="Click to enter discount"
                                                    value={orderDiscount}
                                                    readOnly
                                                />
                                            </form>
                                        </div> */}
                                    </div>
                                    {/* <div className="row text-bold mb-1">
                                        <div className="col">
                                            Apply Fractional Discount:
                                        </div>
                                        <div className="col text-right mr-2">
                                            <input
                                                type="checkbox"
                                                className="form-control-sm"
                                                disabled={total <= 0}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        const fractionalPart =
                                                            total % 1;
                                                        setOrderDiscount(
                                                            fractionalPart?.toFixed(
                                                                2
                                                            )
                                                        );
                                                    } else {
                                                        setOrderDiscount(0);
                                                        setProductUpdated(!productUpdated);
                                                        setSearchQuery("");
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div> */}
                                    <div className="row text-bold mb-1">
                                        <div className="col">Total:</div>
                                        <div className="col text-right mr-2">
                                            {updateTotal}
                                        </div>
                                    </div>
                                    {/* <div className="row text-bold mb-1">
                                        <div className="col">Paid:</div>
                                        <div className="col text-right mr-2">
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                placeholder="Enter paid"
                                                min={0}
                                                disabled={total <= 0}
                                                value={paid}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    if (
                                                        parseFloat(value) < 0 ||
                                                        parseFloat(value) >
                                                        updateTotal
                                                    ) {
                                                        return;
                                                    }
                                                    setPaid(value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row text-bold">
                                        <div className="col">Due:</div>
                                        <div className="col text-right mr-2">
                                            {due}
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <button
                                        onClick={() => cartEmpty()}
                                        type="button"
                                        className="btn bg-gradient-danger btn-block text-white text-bold"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                                <div className="col">
                                    <button
                                        id="checkoutBtn"
                                        onClick={() => {
                                            orderCreate();
                                        }}
                                        type="button"
                                        className="btn bg-gradient-success btn-block text-white text-bold"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-7">
                            {/* Ensure a global CapsLock listener is added once; when CapsLock is active focus the barcode input */}
                            {(() => {
                                if (!window.__barcodeAlwaysFocusAdded) {
                                    window.__barcodeAlwaysFocusAdded = true;
                                    window.__barcodeFocusHandler = function (e) {
                                        try {
                                            const el = document.getElementById("barcodeInput");
                                            if (!el) return;
                                            const target = e.target;
                                            // If user clicked/focused the barcode input itself, do nothing
                                            if (target && (target.id === "barcodeInput" || target.closest && target.closest('#barcodeInput'))) {
                                                return;
                                            }
                                            // Always refocus the barcode input (use timeout so original event completes)
                                            setTimeout(() => {
                                                el.focus();
                                                if (el.setSelectionRange) {
                                                    const len = el.value.length;
                                                    el.setSelectionRange(len, len);
                                                }
                                            }, 10);
                                        } catch (err) {
                                            // ignore
                                        }
                                    };
                                    document.addEventListener("focusin", window.__barcodeFocusHandler, true);
                                    document.addEventListener("mousedown", window.__barcodeFocusHandler, true);
                                    document.addEventListener("touchstart", window.__barcodeFocusHandler, true);
                                }
                                return null;
                            })()}
                            <div className="row">
                                <div className="input-group mb-2 col-md-6">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            <i className="fas fa-barcode"></i>
                                        </span>
                                    </div>
                                    <input
                                        id="barcodeInput"
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Product Barcode"
                                        value={searchBarcode}
                                        autoFocus
                                        onChange={(e) =>
                                            setSearchBarcode(e.target.value)
                                        } />
                                </div>
                                <div className="mb-2 col-md-6">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Product Name"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        onClick={() => {
                                            Swal.fire({
                                                title: 'Enter Product Name',
                                                input: 'text',
                                                inputAttributes: {
                                                    'aria-label': 'Enter your Product Name'
                                                },
                                                confirmButtonText: 'Search',
                                                inputValidator: (value) => {
                                                    if (!value) {
                                                        return 'You need to write something!';
                                                    }
                                                    setSearchQuery(value);
                                                }
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row products-card-container">
                                {products.length > 0 &&
                                    products.map((product, index) => (
                                        <div
                                            onClick={() =>
                                                addProductToCart(product.id)
                                            }
                                            className="col-6 col-md-4 col-lg-3 mb-3"
                                            key={index}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="text-center">
                                                <img
                                                    src={`${fullDomainWithPort}/storage/${product.image}`}
                                                    alt={product.name}
                                                    className="mr-2 img-thumb"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = `${fullDomainWithPort}/assets/images/no-image.png`;
                                                    }}
                                                    width={120}
                                                    height={100}
                                                />
                                                <div className="product-details">
                                                    <p className="mb-0 text-bold product-name">
                                                        {product.name}
                                                        ({product.quantity})
                                                    </p>
                                                    <p>
                                                        Price:{" "}
                                                        {
                                                            product?.discounted_price
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            {loading && (
                                <div className="loading-more">
                                    Loading more...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}