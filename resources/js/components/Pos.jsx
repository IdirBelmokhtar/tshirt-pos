import React, { useEffect, useState, useCallback, useRef } from "react";
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
    // NEW: State to track barcode input focus
    const [isBarcodeFocused, setIsBarcodeFocused] = useState(true);
    // NEW: State to track if any dialog is open
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // NEW: Ref to track dialog open state for event listeners
    const isDialogOpenRef = useRef(false);
    const fullDomainWithPort = `${protocol}//${hostname}${port ? `:${port}` : ""
        }`;

    // NEW: Update ref when state changes
    useEffect(() => {
        isDialogOpenRef.current = isDialogOpen;
    }, [isDialogOpen]);

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
                    document.querySelector('input[placeholder="Saisir la remise"]').click();
                }
                if (barcode === "+") { // + → Ajouter autre article
                    // openAddProductDialog();
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
            setOrderDiscount(data?.discount);
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

    // NEW: Function to focus on barcode input
    const focusBarcodeInput = () => {
        // Don't focus if dialog is open
        if (isDialogOpenRef.current) return;

        const barcodeEl = document.getElementById("barcodeInput");
        if (barcodeEl) {
            barcodeEl.focus();
            setIsBarcodeFocused(true);
        }
    };

    // NEW: Function to handle barcode focus
    const handleBarcodeFocus = () => {
        setIsBarcodeFocused(true);
    };

    // NEW: Function to handle barcode blur
    const handleBarcodeBlur = () => {
        setIsBarcodeFocused(false);
    };

    // NEW: Function to open dialog with proper focus handling
    const openDialog = (dialogType) => {
        setIsDialogOpen(true);
        setIsBarcodeFocused(false);

        if (dialogType === 'discount') {
            Swal.fire({
                title: 'Saisir la remise',
                input: 'number',
                inputAttributes: {
                    'aria-label': 'Saisir la remise',
                    'autofocus': 'true'
                },
                inputPlaceholder: 'Saisir la remise',
                showCancelButton: true,
                confirmButtonText: 'Appliquer',
                cancelButtonText: 'Annuler',
                allowEnterKey: true,
                preConfirm: () => {
                    // This will be called when confirm button is clicked
                },
                inputValidator: (value) => {
                    if (!value) {
                        return 'Vous devez écrire quelque chose !';
                    }
                    const parsedValue = parseFloat(value);
                    if (parsedValue < 0 || parsedValue > total) {
                        return 'Valeur de remise invalide !';
                    }
                    setOrderDiscount(parsedValue);
                }
            }).then((result) => {
                setIsDialogOpen(false);
                if (result.isConfirmed || result.isDismissed) {
                    // Use longer timeout to ensure Swal is completely gone
                    setTimeout(focusBarcodeInput, 500);
                }
            });

            // NEW: Manually focus the input after a delay to ensure Swal is rendered
            setTimeout(() => {
                const swalInput = document.querySelector('.swal2-input');
                if (swalInput) {
                    swalInput.focus();
                }
            }, 300);

        } else if (dialogType === 'productSearch') {
            Swal.fire({
                title: 'Saisir le nom du produit',
                input: 'text',
                inputAttributes: {
                    'aria-label': 'Saisir le nom du produit',
                    'autofocus': 'true'
                },
                confirmButtonText: 'Rechercher',
                showCancelButton: true,
                cancelButtonText: 'Annuler',
                allowEnterKey: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Vous devez écrire quelque chose !';
                    }
                    setSearchQuery(value);
                }
            }).then((result) => {
                setIsDialogOpen(false);
                if (result.isConfirmed || result.isDismissed) {
                    setTimeout(focusBarcodeInput, 500);
                }
            });

            // NEW: Manually focus the input after a delay to ensure Swal is rendered
            setTimeout(() => {
                const swalInput = document.querySelector('.swal2-input');
                if (swalInput) {
                    swalInput.focus();
                }
            }, 300);
        }
    };
    // NEW: Function to open Pay with Credit dialog
    const openPayWithCreditDialog = () => {
        setIsDialogOpen(true);
        setIsBarcodeFocused(false);

        Swal.fire({
            title: 'Payer avec crédit',
            html: `
                <div style="text-align:left">
                    <div class="form-group">
                        <label for="swal-customer-name" style="font-weight:600;margin-bottom:6px;">Nom du client*</label>
                        <input type="text" id="swal-customer-name" class="form-control" placeholder="Nom complet" style="font-size:14px;height:40px;">
                    </div>
                    <div class="form-group">
                        <label for="swal-customer-phone" style="font-weight:600;margin-bottom:6px;">Téléphone*</label>
                        <input type="text" id="swal-customer-phone" class="form-control" placeholder="Numéro de téléphone" style="font-size:14px;height:40px;">
                    </div>
                    <div class="form-group">
                        <label for="swal-customer-credit" style="font-weight:600;margin-bottom:6px;">Crédit initial*</label>
                        <input type="number" id="swal-customer-credit" class="form-control" placeholder="${updateTotal} DA" value="${updateTotal}" min="0" step="0.01" style="font-size:14px;height:40px;">
                    </div>
                </div>
            `,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Créer et payer avec crédit',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            allowOutsideClick: false,
            preConfirm: () => {
                const nameEl = document.getElementById('swal-customer-name');
                const phoneEl = document.getElementById('swal-customer-phone');
                const creditEl = document.getElementById('swal-customer-credit');

                if (!nameEl || !phoneEl || !creditEl) {
                    Swal.showValidationMessage('Erreur de chargement du formulaire');
                    return false;
                }

                const name = (nameEl.value || "").trim();
                const phone = (phoneEl.value || "").trim();
                const creditRaw = creditEl.value;
                const credit = parseFloat(creditRaw);

                if (!name) {
                    Swal.showValidationMessage('Le nom du client est requis');
                    return false;
                }
                if (!phone) {
                    Swal.showValidationMessage('Le numéro de téléphone est requis');
                    return false;
                }
                if (creditRaw === "" || isNaN(credit) || credit < 0) {
                    Swal.showValidationMessage('Veuillez saisir un montant de crédit valide');
                    return false;
                }
                if (credit < updateTotal) {
                    Swal.showValidationMessage(`Le crédit (${credit} DA) est inférieur au total (${updateTotal} DA)`);
                    return false;
                }

                return { name, phone, credit };
            }
        }).then((result) => {
            setIsDialogOpen(false);

            if (result.isConfirmed && result.value) {
                createCustomerAndPayWithCredit(result.value);
            }

            // Refocus barcode input after dialog closes
            setTimeout(focusBarcodeInput, 500);
        });

        // Manually focus the first input after a delay to ensure Swal is rendered
        setTimeout(() => {
            const nameInput = document.getElementById('swal-customer-name');
            if (nameInput) {
                nameInput.focus();
            }
        }, 300);
    };

    // NEW: Function to create customer and pay with credit
    const createCustomerAndPayWithCredit = async (customerData) => {
        try {
            // First create the customer
            const doubledCredit = Math.round((parseFloat(customerData.credit || 0) * 2) * 100) / 100;
            const customerResponse = await axios.post('/admin/create/customers', {
                name: customerData.name,
                phone: customerData.phone,
                credit: doubledCredit,
            });

            const newCustomer = customerResponse.data.customer;
            playSound(SuccessSound);
            // toast.success('Client créé avec succès !');

            // Use the newly created customer's id directly
            const newCustomerId = newCustomer.id;
            setCustomerId(newCustomerId);

            // if (total <= 0) {
            //     return;
            // }

            // toast.success("Création de la commande en cours...");

            // axios
            //     .put("/admin/order/create", {
            //         customer_id: newCustomerId,
            //         order_discount: parseFloat(orderDiscount) || 0,
            //         paid: parseFloat(paid) || 0,
            //     })
            //     .then((res) => {
            //         axios
            //             .put("/admin/cart/empty")
            //             .then((res) => {
            //                 setCartUpdated(!cartUpdated);
            //                 setOrderDiscount(0);
            //                 setProductUpdated(!productUpdated);
            //                 setSearchQuery("");
            //                 playSound(SuccessSound);
            //                 // toast.success(res?.data?.message);
            //                 // NEW: Focus back to barcode after successful order
            //                 setTimeout(focusBarcodeInput, 100);
            //             })
            //             .catch((err) => {
            //                 playSound(WarningSound);
            //                 // toast.error(err.response.data.message);
            //                 // NEW: Focus back to barcode even on error
            //                 setTimeout(focusBarcodeInput, 100);
            //             });
            //     })
            //     .catch((err) => {
            //         // toast.error(err.response.data.message);
            //         // NEW: Focus back to barcode even on error
            //         setTimeout(focusBarcodeInput, 100);
            //     });

        } catch (error) {
            playSound(WarningSound);
            console.error('Error creating customer:', error);
            // toast.error(error.response?.data?.message || 'Erreur lors de la création du client');
            // Focus back to barcode even on error
            setTimeout(focusBarcodeInput, 100);
        }
    };

    // NEW: Function to open Add Product dialog
    const openAddProductDialog = () => {
        setIsDialogOpen(true);
        setIsBarcodeFocused(false);

        Swal.fire({
            title: 'Ajouter un nouveau produit',
            html: `
              <div style="text-align:left">
                
                <div class="form-row" style="display:flex;gap:10px;">
                <div class="form-group">
                  <label for="swal-product-name" style="font-weight:600;margin-bottom:6px;">Nom du produit</label>
                  <input type="text" id="swal-product-name" class="form-control" placeholder="Nom du produit" style="font-size:14px;height:40px;">
                </div>
                  <div style="flex:1">
                    <label for="swal-product-price" style="font-weight:600;margin-bottom:6px;">Prix*</label>
                    <input type="number" id="swal-product-price" class="form-control" placeholder="0.00 DA" min="0" step="0.01" style="font-size:14px;height:40px;">
                  </div>
                </div>
                <div style="flex:1">
                    <label for="swal-product-purchase-price" style="font-weight:600;margin-bottom:6px;">Prix d'achat</label>
                    <input type="number" id="swal-product-purchase-price" class="form-control" placeholder="0.00 DA" min="0" step="0.01" style="font-size:14px;height:40px;">
                  </div>
              </div>
            `,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Ajouter le produit',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            allowOutsideClick: false,
            preConfirm: () => {
                const nameEl = document.getElementById('swal-product-name');
                const priceEl = document.getElementById('swal-product-price');
                const purchasePriceEl = document.getElementById('swal-product-purchase-price');

                if (!nameEl) {
                    Swal.showValidationMessage('Le nom du produit est requis');
                    return false;
                }

                const name = (nameEl.value || "").trim();
                const priceRaw = priceEl ? priceEl.value : '';
                const purchasePriceRaw = purchasePriceEl ? purchasePriceEl.value : '';

                const price = parseFloat(priceRaw);
                const purchase_price = purchasePriceRaw === "" ? 0 : parseFloat(purchasePriceRaw);

                if (priceRaw === "" || isNaN(price) || price < 0) {
                    Swal.showValidationMessage('Veuillez saisir un prix valide');
                    return false;
                }

                return { name, price, purchase_price };
            }
        }).then((result) => {
            setIsDialogOpen(false);

            if (result.isConfirmed && result.value) {
                createNewProduct(result.value);
            }

            // Refocus barcode input after dialog closes
            setTimeout(focusBarcodeInput, 500);
        });

        // Manually focus the first input after a delay to ensure Swal is rendered
        setTimeout(() => {
            const nameInput = document.getElementById('swal-product-name');
            if (nameInput) {
                nameInput.focus();
            }
        }, 300);
    };

    const createNewProduct = async (productData) => {
        try {
            const formData = new FormData();
            formData.append('name', productData.name);
            formData.append('price', productData.price);
            formData.append('purchase_price', productData.purchase_price);

            axios
                .post('/admin/product/other_article', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                .then((response) => {
                    playSound(SuccessSound);
                    setProductUpdated(!productUpdated);
                    addProductToCart(response.data.product.id);
                    toast.success('Produit créé avec succès !');
                })
                .catch((error) => {
                    playSound(WarningSound);
                    console.error('Error creating product:', error);
                    toast.error(error.response?.data?.message || 'Erreur lors de la création du produit');
                });
        } catch (error) {
            playSound(WarningSound);
            console.error('Unexpected error preparing product data:', error);
            toast.error('Erreur inattendue lors de la création du produit');
        }
    };

    function addProductToCart(id) {
        axios
            .post("/admin/cart", { id })
            .then((res) => {
                setCartUpdated(!cartUpdated);
                setSearchQuery("");
                playSound(SuccessSound);
                toast.success(res?.data?.message);
                setSearchBarcode("");
                // NEW: Focus back to barcode after adding product
                setTimeout(focusBarcodeInput, 100);
            })
            .catch((err) => {
                playSound(WarningSound);
                toast.error(err.response.data.message);
                // NEW: Focus back to barcode even on error
                setTimeout(focusBarcodeInput, 100);
            });
    }
    function cartEmpty() {
        axios
            .put("/admin/cart/empty")
            .then((res) => {
                setCartUpdated(!cartUpdated);
                setOrderDiscount(0);
                setProductUpdated(!productUpdated);
                setSearchQuery("");
                playSound(SuccessSound);
                toast.success(res?.data?.message);
                // NEW: Focus back to barcode after clearing cart
                setTimeout(focusBarcodeInput, 100);
            })
            .catch((err) => {
                playSound(WarningSound);
                toast.error(err.response.data.message);
                // NEW: Focus back to barcode even on error
                setTimeout(focusBarcodeInput, 100);
            });
    }
    function orderCreate() {
        if (total <= 0) {
            return;
        }
        if (!customerId) {
            toast.error("Veuillez sélectionner un client");
            // NEW: Focus back to barcode when customer not selected
            setTimeout(focusBarcodeInput, 100);
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
                        // NEW: Focus back to barcode after successful order
                        setTimeout(focusBarcodeInput, 100);
                    })
                    .catch((err) => {
                        playSound(WarningSound);
                        toast.error(err.response.data.message);
                        // NEW: Focus back to barcode even on error
                        setTimeout(focusBarcodeInput, 100);
                    });
            })
            .catch((err) => {
                toast.error(err.response.data.message);
                // NEW: Focus back to barcode even on error
                setTimeout(focusBarcodeInput, 100);
            });
    }
    return (
        <>
            <div className="card">
                <div class="mt-n5 mb-3 d-flex justify-content-end">
                    <a
                        href="/admin/products"
                        className="btn bg-gradient-primary mr-2"
                    >
                        Liste des produits
                    </a>

                    <a
                        href="/admin/orders"
                        className="btn bg-gradient-primary"
                    >
                        Liste des ventes
                    </a>
                    {/* NEW: Barcode focus status indicator */}
                    <div className="ml-2 d-flex align-items-center">
                        <i
                            className={`fas fa-barcode ${isBarcodeFocused ? 'text-success' : 'text-danger'}`}
                            style={{ fontSize: '20px' }}
                            title={isBarcodeFocused ? "Scanner de codes-barres actif" : "Scanner de codes-barres non focalisé"}
                        ></i>
                    </div>
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
                            </div>
                            <Cart
                                carts={carts}
                                setCartUpdated={setCartUpdated}
                                cartUpdated={cartUpdated}
                            />
                            <div className="card">
                                <div className="card-body">
                                    <div className="row text-bold mb-1">
                                        <div className="col">Sous-total :</div>
                                        <div className="col text-right mr-2">
                                            {total}
                                        </div>
                                    </div>
                                    <div className="row text-bold mb-1">
                                        <div className="col">Remise totale :</div>
                                        <div className="col text-right mr-2">
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                placeholder="Saisir la remise"
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
                                                    // NEW: Use the new dialog function
                                                    openDialog('discount');
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row text-bold mb-1">
                                        <div className="col">Total :</div>
                                        <div className="col text-right mr-2">
                                            {updateTotal}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <button
                                        onClick={() => cartEmpty()}
                                        type="button"
                                        className="btn bg-gradient-danger btn-block text-white text-bold"
                                    >
                                        Vider le panier
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button
                                        id="checkoutBtn"
                                        onClick={() => {
                                            orderCreate();
                                        }}
                                        type="button"
                                        className="btn bg-gradient-success btn-block text-white text-bold"
                                    >
                                        Encaisser
                                    </button>
                                </div>
                            </div>
                            {/* NEW: Pay with Credit Button */}
                            <div className="row mt-3">
                                <div className="col-12">
                                    <button
                                        onClick={openPayWithCreditDialog}
                                        type="button"
                                        className="btn bg-gradient-warning btn-block text-white text-bold"
                                        disabled={total <= 0}
                                    >
                                        <i className="fas fa-credit-card mr-2"></i>
                                        Payer avec crédit (Nouveau client)
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-7">
                            {(() => {
                                if (!window.__barcodeAlwaysFocusAdded) {
                                    window.__barcodeAlwaysFocusAdded = true;
                                    window.__barcodeFocusHandler = function (e) {
                                        try {
                                            // NEW: Don't refocus if dialog is open (using ref for latest value)
                                            if (isDialogOpenRef.current) return;

                                            const el = document.getElementById("barcodeInput");
                                            if (!el) return;
                                            const target = e.target;
                                            // If user clicked/focused the barcode input itself, do nothing
                                            if (target && (target.id === "barcodeInput" || target.closest && target.closest('#barcodeInput'))) {
                                                return;
                                            }
                                            // Don't refocus if user is interacting with form elements
                                            if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) {
                                                return;
                                            }
                                            // Always refocus the barcode input (use timeout so original event completes)
                                            setTimeout(() => {
                                                // Double check dialog is still closed using ref
                                                if (!isDialogOpenRef.current) {
                                                    el.focus();
                                                    setIsBarcodeFocused(true);
                                                    if (el.setSelectionRange) {
                                                        const len = el.value.length;
                                                        el.setSelectionRange(len, len);
                                                    }
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
                                        placeholder="Saisir le code-barres"
                                        value={searchBarcode}
                                        autoFocus
                                        onChange={(e) =>
                                            setSearchBarcode(e.target.value)
                                        }
                                        // NEW: Add focus and blur handlers
                                        onFocus={handleBarcodeFocus}
                                        onBlur={handleBarcodeBlur}
                                    />
                                </div>
                                <div className="mb-2 col-md-6">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Saisir le nom du produit"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        onClick={() => {
                                            // NEW: Use the new dialog function
                                            openDialog('productSearch');
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
                                                        Prix :{" "}
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
                                    Chargement...
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