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
    // CHANGED: Now using local state for cart instead of fetching from API
    const [cartItems, setCartItems] = useState([]);
    const [orderDiscount, setOrderDiscount] = useState(0);
    const [paid, setPaid] = useState(0);
    const [due, setDue] = useState(0);
    const [total, setTotal] = useState(0);
    const [updateTotal, setUpdateTotal] = useState(0);
    const [customerId, setCustomerId] = useState();
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

    // CHANGED: Calculate totals from local cartItems
    useEffect(() => {
        const subtotal = cartItems.reduce(
            (sum, item) => sum + (item.product?.discounted_price || 0) * item.quantity,
            0
        );

        const totalDiscountItems = cartItems.reduce(
            (sum, item) => sum + (item.discount || 0),
            0
        );

        const calculatedTotal = subtotal - totalDiscountItems - orderDiscount;
        const dueAmount = calculatedTotal - paid;

        setTotal(subtotal);
        setUpdateTotal(calculatedTotal?.toFixed(2));
        setDue(dueAmount?.toFixed(2));
    }, [cartItems, orderDiscount, paid]);

    // CHANGED: Handle barcode search locally
    useEffect(() => {
        if (searchBarcode) {
            // Search through already loaded products
            const productFound = products.find(product =>
                product.sku && product.sku.toString() === searchBarcode.trim()
            );

            if (productFound) {
                // Add to local cart
                addProductToCartLocal(productFound);
                setSearchBarcode(""); // Clear barcode input after adding
            } else {
                // If not found in loaded products, try to fetch from API
                if (searchBarcode.length > 0) {

                    setTimeout(() => {
                        setSearchBarcode(""); // Clear barcode input after adding

                    }, 300);

                    // getProducts("", 1, searchBarcode);
                }
            }
        }
    }, [searchBarcode, products]);

    // CHANGED: Handle barcode special commands
    useEffect(() => {
        if (!searchBarcode) return;

        if (searchBarcode === " ") { // SPACE → Checkout
            document.getElementById("checkoutBtn").click();
            setSearchBarcode("");
        } else if (searchBarcode === "0") { // 0 → Clear
            cartEmptyLocal();
            setSearchBarcode("");
        } else if (searchBarcode === "-") { // - → Open Discount
            openDialog('discount');
            setSearchBarcode("");
        } else if (searchBarcode === "+") { // + → Ajouter autre article
            // openAddProductDialog();
            setSearchBarcode("");
        }
    }, [searchBarcode]);

    const getProducts = useCallback(
        async (search = "", page = 1, barcode = "") => {
            setLoading(true);
            try {
                const res = await axios.get('/admin/get/products', {
                    params: { search, page, barcode },
                });
                const productsData = res.data;

                if (page === 1) {
                    setProducts(productsData.data); // Replace for first page
                } else {
                    setProducts((prev) => [...prev, ...productsData.data]); // Append for subsequent pages
                }

                // If searching by barcode and found exactly one product
                if (barcode && productsData.data.length === 1) {
                    // Add to local cart
                    addProductToCartLocal(productsData.data[0]);
                    setSearchBarcode(""); // Clear barcode input
                }

                setTotalPages(productsData.meta.last_page); // Get total pages

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
        // Load initial products
        getProducts("", 1, "");
    }, [productUpdated]);

    // CHANGED: Local cart functions (no API calls)
    const addProductToCartLocal = (product) => {
        const existing = cartItems.find(item => item.product.id === product.id);

        if (existing) {
            setCartItems(cartItems.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            const newCartItem = {
                id: Date.now(), // Local ID
                product_id: product.id,
                product: product,
                quantity: 1,
                discount: 0,
            };
            setCartItems([...cartItems, newCartItem]);
        }

        playSound(SuccessSound);
        toast.success(`${product.name} ajouté au panier`);
        setSearchQuery("");
        setSearchBarcode("");
        setTimeout(focusBarcodeInput, 100);
    };

    // CHANGED: Local increment
    const incrementLocal = (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        ));
        playSound(SuccessSound);
        toast.success("Quantité augmentée");
    };

    // CHANGED: Local decrement
    const decrementLocal = (id) => {
        const item = cartItems.find(item => item.id === id);
        if (!item) return;

        if (item.quantity <= 1) {
            destroyLocal(id);
            return;
        }

        setCartItems(cartItems.map(item =>
            item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        ));
        playSound(SuccessSound);
        toast.success("Quantité diminuée");
    };

    // CHANGED: Local destroy
    const destroyLocal = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
        playSound(SuccessSound);
        toast.success("Article supprimé");
    };

    // CHANGED: Local discount update
    const updateDiscountLocal = (id, discount) => {
        setCartItems(cartItems.map(item => {
            if (item.id !== id) return item;
            const maxDiscount = item.product.discounted_price * item.quantity;
            const newDiscount = Math.min(Math.max(Number(discount) || 0, 0), maxDiscount);
            return { ...item, discount: newDiscount };
        }));
    };

    // CHANGED: Local cart empty
    const cartEmptyLocal = () => {
        setCartItems([]);
        setOrderDiscount(0);
        playSound(SuccessSound);
        toast.success("Panier vidé");
        setTimeout(focusBarcodeInput, 100);
    };

    useEffect(() => {
        if (searchQuery) {
            // Reset to first page and search
            setProducts([]);
            getProducts(searchQuery, 1, "");
        }
    }, [searchQuery]);

    // Infinite scroll logic
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight
            ) {
                // Load next page if not on the last page
                if (currentPage < totalPages) {
                    const nextPage = currentPage + 1;
                    setCurrentPage(nextPage);
                    getProducts(searchQuery, nextPage, "");
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [currentPage, totalPages, searchQuery]);

    // Load more products when page changes
    useEffect(() => {
        if (currentPage > 1 && !searchQuery) {
            getProducts("", currentPage, "");
        }
    }, [currentPage]);

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
                    if (!value && value !== 0) {
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
                orderCreateWithCredit(result.value);
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
                    // CHANGED: Add to local cart
                    addProductToCartLocal(response.data.product);
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

    // CHANGED: Function to add product to cart - now uses local function
    function addProductToCart(id) {
        const product = products.find(p => p.id === id);
        if (product) {
            addProductToCartLocal(product);
        }
    }

    // CHANGED: Function to empty cart - now uses local function
    function cartEmpty() {
        cartEmptyLocal();
    }

    // CHANGED: Function to create customer and pay with credit
    async function orderCreateWithCredit(customerData) {
        try {
            // Create new customer credit
            const doubledCredit = Math.round(parseFloat(customerData.credit || 0));

            const customerResponse = await axios.post('/admin/create/customers', {
                name: customerData.name,
                phone: customerData.phone,
                credit: doubledCredit,
            });

            console.log('Customer response:', customerResponse.data);

            let newCustomerId;

            if (customerResponse.data.customer && customerResponse.data.customer.id) {
                newCustomerId = customerResponse.data.customer.id;
            } else if (customerResponse.data.id) {
                newCustomerId = customerResponse.data.id;
            } else if (customerResponse.data.data && customerResponse.data.data.id) {
                newCustomerId = customerResponse.data.data.id;
            } else {
                console.error('Unexpected response structure:', customerResponse.data);
                throw new Error('Structure de réponse inattendue du serveur');
            }

            console.log('New customer ID:', newCustomerId);

            setCustomerId(newCustomerId);

            if (total <= 0) {
                toast.error("Le panier est vide");
                return;
            }

            // CHANGED: Prepare cart data for order
            const orderItems = cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.product.discounted_price,
                discount: item.discount || 0,
            }));

            let orderData;

            // First try: with paid = 0 (credit payment)
            orderData = {
                customer_id: newCustomerId,
                order_discount: parseFloat(orderDiscount) || 0,
                paid: 0,
                items: orderItems, // Send cart items
            };

            console.log('Creating order with data:', orderData);

            try {
                const orderResponse = await axios.put("/admin/order/create", orderData);
                console.log('Order created successfully:', orderResponse.data);

                // CHANGED: Clear local cart
                cartEmptyLocal();
                setPaid(0);

                playSound(SuccessSound);
                toast.success('Commande créée avec succès! Client payé avec crédit.');

            } catch (orderError) {
                console.log('First order attempt failed, trying alternative...', orderError.response?.data);

                // If failed, try with paid = updateTotal
                orderData = {
                    customer_id: newCustomerId,
                    order_discount: parseFloat(orderDiscount) || 0,
                    paid: parseFloat(updateTotal),
                    items: orderItems,
                };

                console.log('Trying alternative order data:', orderData);

                const orderResponse = await axios.put("/admin/order/create", orderData);
                console.log('Order created with alternative data:', orderResponse.data);

                // CHANGED: Clear local cart
                cartEmptyLocal();
                setPaid(0);

                playSound(SuccessSound);
                toast.success('Commande créée avec succès!');
            }

            setTimeout(focusBarcodeInput, 100);

        } catch (error) {
            playSound(WarningSound);
            console.error('Error in orderCreateWithCredit:', error);
            console.error('Error response:', error.response?.data);

            let errorMsg = 'Erreur lors de la création de la commande';

            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.message) {
                errorMsg = error.message;
            }

            toast.error(errorMsg);

            setTimeout(focusBarcodeInput, 100);
        }
    }

    function orderCreate() {
        if (total <= 0) {
            return;
        }
        if (!customerId) {
            toast.error("Veuillez sélectionner un client");
            setTimeout(focusBarcodeInput, 100);
            return;
        }

        // CHANGED: Prepare cart data for order
        const orderItems = cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.product.discounted_price,
            discount: item.discount || 0,
        }));

        axios
            .put("/admin/order/create", {
                customer_id: customerId,
                order_discount: parseFloat(orderDiscount) || 0,
                paid: parseFloat(paid) || 0,
                items: orderItems, // Send cart items
            })
            .then((res) => {
                // CHANGED: Clear local cart instead of API call
                cartEmptyLocal();
                setPaid(0);
                playSound(SuccessSound);
                toast.success('Commande créée avec succès!');
                setTimeout(focusBarcodeInput, 100);
            })
            .catch((err) => {
                toast.error(err.response.data.message);
                setTimeout(focusBarcodeInput, 100);
            });
    }

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="card">
                <div class="mt-n5 mb-3 d-flex justify-content-end">
                    <a
                        href="/admin/products"
                        className="btn bg-gradient-primary mr-2"
                    >
                        Liste Produits
                    </a>

                    <a
                        href="/admin/orders"
                        className="btn bg-gradient-success mr-2"
                    >
                        Liste Ventes
                    </a>

                    <a
                        href="/admin/customers"
                        className="btn bg-gradient-info mr-2"
                    >
                        Liste Clients
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
                            {/* CHANGED: Pass cartItems and local functions to Cart component */}
                            <Cart
                                cartItems={cartItems}
                                increment={incrementLocal}
                                decrement={decrementLocal}
                                updateDiscount={updateDiscountLocal}
                                removeItem={destroyLocal}
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
                                {filteredProducts.length > 0 &&
                                    filteredProducts.map((product, index) => (
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