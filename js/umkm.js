document.addEventListener('DOMContentLoaded', () => {
    // --- KONFIGURASI ---
    const BASE_URL = 'https://website-sangubayu-be.vercel.app/api';

    // --- ELEMEN DOM ---
    const mainContent = document.getElementById('main-content');
    const customerDataModal = document.getElementById('customer-data-modal');
    const customerForm = document.getElementById('customer-form');
    const umkmListView = document.getElementById('umkm-list-view');
    const umkmDetailView = document.getElementById('umkm-detail-view');
    const umkmListContainer = document.getElementById('umkm-list-container');
    const searchInput = document.getElementById('search-umkm');

    // Keranjang Belanja
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeCartButton = document.getElementById('close-cart-button');
    const cartItemCount = document.getElementById('cart-item-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummaryContainer = document.getElementById('cart-summary');
    const orderWhatsappButton = document.getElementById('order-whatsapp-button');

    // --- STATE APLIKASI ---
    let allUmkmData = [];
    let allProdukData = [];
    let cart = [];
    let currentUmkmContact = '';

    // --- FUNGSI UTAMA ---

    /**
     * Inisialisasi halaman: cek data pelanggan, muat data UMKM.
     */
    function initializePage() {
        setupMobileMenu();
        setupComplaintModal();
        checkCustomerData();
        loadAllUmkm();
        loadAllProduk();
        addEventListeners();
        updateCartView(); // Perbarui tampilan keranjang dari localStorage jika ada
    }

    /**
     * Mengecek apakah data pelanggan sudah ada di localStorage.
     * Jika tidak, tampilkan modal form. Jika ada, tampilkan konten utama.
     */
    function checkCustomerData() {
        const customer = JSON.parse(localStorage.getItem('customerData'));
        if (!customer || !customer.nama || !customer.alamat || !customer.nomorHp) {
            customerDataModal.style.display = 'flex';
        } else {
            customerDataModal.style.display = 'none';
            mainContent.classList.remove('hidden');
            cartButton.classList.remove('hidden');
        }
    }

    /**
     * Memuat semua data UMKM dari API.
     */
    async function loadAllUmkm() {
        try {
            const response = await fetch(`${BASE_URL}/umkm`);
            if (!response.ok) throw new Error('Gagal memuat data UMKM');
            allUmkmData = await response.json();
            displayUmkm(allUmkmData);
        } catch (error) {
            console.error(error);
            umkmListContainer.innerHTML = `<p class="text-red-500 col-span-full text-center">${error.message}</p>`;
        }
    }

    /**
     * Memuat semua data produk dari API.
     */
    async function loadAllProduk() {
        try {
            const response = await fetch(`${BASE_URL}/produk`);
            if (!response.ok) throw new Error('Gagal memuat data produk');
            allProdukData = await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Menampilkan daftar UMKM dalam bentuk kartu.
     * @param {Array} umkmArray - Array data UMKM yang akan ditampilkan.
     */
    function displayUmkm(umkmArray) {
        umkmListContainer.innerHTML = '';
        if (umkmArray.length === 0) {
            umkmListContainer.innerHTML = '<p class="text-gray-500 col-span-full text-center">UMKM tidak ditemukan.</p>';
            return;
        }
        umkmArray.forEach(umkm => {
            const umkmCard = `
                <div class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:-translate-y-1" data-umkm-id="${umkm.id_umkm}">
                    <div class="p-6">
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">${umkm.nama_umkm}</h3>
                        <p class="text-gray-600 mb-4">${umkm.deskripsi_umkm || 'Deskripsi tidak tersedia.'}</p>
                        <p class="text-sm text-gray-500"><i class="fas fa-user mr-2"></i>${umkm.pemilik_umkm}</p>
                    </div>
                </div>
            `;
            umkmListContainer.innerHTML += umkmCard;
        });
    }

    /**
 * Menampilkan halaman detail untuk satu UMKM.
 * @param {string} umkmId - ID dari UMKM yang akan ditampilkan.
 */
    function showUmkmDetail(umkmId) {
        const umkm = allUmkmData.find(u => u.id_umkm.toString() === umkmId);
        const productsOfUmkm = allProdukData.filter(p => p.id_umkm.toString() === umkmId);
        currentUmkmContact = umkm.kontak_umkm;

        let productsHtml = '<p class="text-gray-500">Belum ada produk untuk UMKM ini.</p>';
        if (productsOfUmkm.length > 0) {
            productsHtml = productsOfUmkm.map(product => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 product-card">
                <img src="${product.gambar_produk || 'https://placehold.co/600x400/E2E8F0/4A5568?text=Produk'}" alt="${product.nama_produk}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h4 class="text-lg font-bold text-gray-800">${product.nama_produk}</h4>
                    <p class="text-gray-600 text-sm mb-2">${product.deskripsi_produk}</p>
                    <p class="text-blue-600 font-semibold mb-3">Rp ${new Intl.NumberFormat('id-ID').format(product.harga_produk)}</p>
                    <button class="add-to-cart-button w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition" data-product-id="${product.id_produk}">
                        <i class="fas fa-cart-plus mr-2"></i>Tambah ke Keranjang
                    </button>
                </div>
            </div>
        `).join('');
        }

        // --- BAGIAN YANG DIPERBAIKI ---
        // Menambahkan logika untuk menampilkan peta
        const mapHtml = umkm.peta_umkm
            ? `<div class="w-full rounded-lg shadow-xl overflow-hidden mt-6">${umkm.peta_umkm}</div>`
            : '<p class="text-gray-500 mt-4">Peta lokasi tidak tersedia.</p>';

        umkmDetailView.innerHTML = `
        <button id="back-to-list-button" class="mb-8 text-blue-600 font-semibold hover:underline"><i class="fas fa-arrow-left mr-2"></i>Kembali ke Daftar UMKM</button>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
                <div class="bg-white p-8 rounded-lg shadow-lg">
                    <h2 class="text-4xl font-bold text-gray-800 mb-2">${umkm.nama_umkm}</h2>
                    <p class="text-gray-600 mb-4">Oleh: ${umkm.pemilik_umkm}</p>
                    <p class="mb-4">${umkm.deskripsi_umkm}</p>
                    <div class="space-y-2">
                        <p><i class="fas fa-map-marker-alt mr-2 text-gray-500"></i>${umkm.alamat_umkm}</p>
                        <a href="https://wa.me/${umkm.kontak_umkm}" target="_blank" class="text-green-500 hover:underline flex items-center">
                            <i class="fab fa-whatsapp mr-2"></i>
                            <span>${umkm.kontak_umkm}</span>
                        </a>
                    </div>
                </div>
            </div>
            <div>
                <h3 class="text-2xl font-bold text-gray-800 mb-4">Lokasi UMKM</h3>
                ${mapHtml}
            </div>
        </div>

        <div class="mt-16">
            <h3 class="text-3xl font-bold text-gray-800 mb-8">Produk Kami</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${productsHtml}
            </div>
        </div>
    `;

        umkmListView.classList.add('hidden');
        umkmDetailView.classList.remove('hidden');
    }

    // --- LOGIKA KERANJANG BELANJA (CART) ---

    /**
     * Menambahkan produk ke keranjang belanja.
     * @param {string} productId - ID produk yang akan ditambahkan.
     */
    function addToCart(productId) {
        const productToAdd = allProdukData.find(p => p.id_produk.toString() === productId);
        if (!productToAdd) return;

        const existingItem = cart.find(item => item.id_produk === productToAdd.id_produk);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }

        saveCartToLocalStorage();
        updateCartView();
        showNotification(`${productToAdd.nama_produk} ditambahkan ke keranjang!`);
    }

    /**
     * Mengurangi kuantitas produk di keranjang.
     * @param {number} productId - ID produk.
     */
    function decreaseQuantity(productId) {
        const item = cart.find(item => item.id_produk === productId);
        if (item && item.quantity > 1) {
            item.quantity--;
        } else {
            cart = cart.filter(item => item.id_produk !== productId);
        }
        saveCartToLocalStorage();
        updateCartView();
    }

    /**
     * Menambah kuantitas produk di keranjang.
     * @param {number} productId - ID produk.
     */
    function increaseQuantity(productId) {
        const item = cart.find(item => item.id_produk === productId);
        if (item) {
            item.quantity++;
        }
        saveCartToLocalStorage();
        updateCartView();
    }

    /**
     * Memperbarui tampilan keranjang belanja (modal dan ikon).
     */
    function updateCartView() {
        // Update item count badge
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartItemCount.textContent = totalItems;
        cartItemCount.classList.toggle('hidden', totalItems === 0);

        // Update cart modal
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center">Keranjang Anda kosong.</p>';
            cartSummaryContainer.innerHTML = '';
            orderWhatsappButton.classList.add('opacity-50', 'cursor-not-allowed');
            orderWhatsappButton.disabled = true;
            return;
        }

        orderWhatsappButton.classList.remove('opacity-50', 'cursor-not-allowed');
        orderWhatsappButton.disabled = false;

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center justify-between py-4 border-b">
                <div class="flex items-center space-x-4">
                    <img src="${item.gambar_produk || 'https://placehold.co/100x100/E2E8F0/4A5568?text=Img'}" alt="${item.nama_produk}" class="w-16 h-16 object-cover rounded">
                    <div>
                        <p class="font-bold">${item.nama_produk}</p>
                        <p class="text-sm text-gray-500">Rp ${new Intl.NumberFormat('id-ID').format(item.harga_produk)}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <button class="decrease-quantity-button bg-gray-200 w-6 h-6 rounded-full" data-product-id="${item.id_produk}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity-button bg-gray-200 w-6 h-6 rounded-full" data-product-id="${item.id_produk}">+</button>
                </div>
            </div>
        `).join('');

        const subtotal = cart.reduce((sum, item) => sum + (item.harga_produk * item.quantity), 0);
        const uniqueCode = Math.floor(100 + Math.random() * 900); // 3 digit kode unik
        const total = subtotal + uniqueCode;

        cartSummaryContainer.innerHTML = `
            <div class="space-y-2">
                <div class="flex justify-between"><span>Subtotal:</span><span>Rp ${new Intl.NumberFormat('id-ID').format(subtotal)}</span></div>
                <div class="flex justify-between"><span>Kode Unik:</span><span>${uniqueCode}</span></div>
                <div class="flex justify-between font-bold text-lg"><span>Total:</span><span>Rp ${new Intl.NumberFormat('id-ID').format(total)}</span></div>
            </div>
        `;
        cartSummaryContainer.dataset.total = total;
        cartSummaryContainer.dataset.uniqueCode = uniqueCode;
    }

    /**
     * Menyimpan data keranjang ke localStorage.
     */
    function saveCartToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    /**
     * Memuat data keranjang dari localStorage.
     */
    function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    }

    /**
     * Membuat dan membuka link WhatsApp untuk pemesanan.
     */
    function createWhatsAppOrder() {
        if (cart.length === 0) return;

        const customer = JSON.parse(localStorage.getItem('customerData'));
        if (!customer) {
            alert("Data pelanggan tidak ditemukan. Mohon isi form terlebih dahulu.");
            checkCustomerData();
            return;
        }

        const total = cartSummaryContainer.dataset.total;
        const uniqueCode = cartSummaryContainer.dataset.uniqueCode;

        let orderDetails = "Halo, saya ingin memesan produk berikut:\n\n";
        cart.forEach(item => {
            orderDetails += `*${item.nama_produk}*\n`;
            orderDetails += `  - Jumlah: ${item.quantity}\n`;
            orderDetails += `  - Harga: Rp ${new Intl.NumberFormat('id-ID').format(item.harga_produk * item.quantity)}\n\n`;
        });

        orderDetails += "-----------------------\n";
        orderDetails += `*Total Belanja: Rp ${new Intl.NumberFormat('id-ID').format(total)}* (sudah termasuk kode unik ${uniqueCode})\n\n`;
        orderDetails += "*Data Pemesan:*\n";
        orderDetails += `Nama: ${customer.nama}\n`;
        orderDetails += `Alamat: ${customer.alamat}\n`;
        orderDetails += `No. HP: ${customer.nomorHp}\n\n`;
        orderDetails += "Mohon konfirmasi ketersediaan dan total pembayarannya. Terima kasih.";

        const whatsappUrl = `https://wa.me/${currentUmkmContact}?text=${encodeURIComponent(orderDetails)}`;

        window.open(whatsappUrl, '_blank');

        // Kosongkan keranjang setelah memesan
        cart = [];
        saveCartToLocalStorage();
        updateCartView();
        cartModal.classList.add('hidden');
    }

    /**
     * Menampilkan notifikasi sementara.
     * @param {string} message - Pesan notifikasi.
     */
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-[100]';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // --- PENANGANAN EVENT (EVENT LISTENERS) ---
    function addEventListeners() {
        // Form data pelanggan
        customerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const customerData = {
                nama: document.getElementById('nama_lengkap').value,
                alamat: document.getElementById('alamat').value,
                nomorHp: document.getElementById('nomor_hp').value
            };
            localStorage.setItem('customerData', JSON.stringify(customerData));
            customerDataModal.classList.add('modal-leave-active');
            setTimeout(() => {
                customerDataModal.style.display = 'none';
                mainContent.classList.remove('hidden');
                cartButton.classList.remove('hidden');
            }, 300);
        });

        // Klik pada kartu UMKM
        umkmListContainer.addEventListener('click', (e) => {
            const card = e.target.closest('[data-umkm-id]');
            if (card) {
                const umkmId = card.dataset.umkmId;
                showUmkmDetail(umkmId);
            }
        });

        // Klik tombol kembali & tambah ke keranjang di halaman detail
        umkmDetailView.addEventListener('click', (e) => {
            if (e.target.id === 'back-to-list-button') {
                umkmDetailView.classList.add('hidden');
                umkmListView.classList.remove('hidden');
                umkmDetailView.innerHTML = ''; // Kosongkan view
                currentUmkmContact = '';
            }
            if (e.target.classList.contains('add-to-cart-button')) {
                const productId = e.target.dataset.productId;
                addToCart(productId);
            }
        });

        // Pencarian UMKM
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredUmkm = allUmkmData.filter(umkm =>
                umkm.nama_umkm.toLowerCase().includes(searchTerm) ||
                umkm.pemilik_umkm.toLowerCase().includes(searchTerm)
            );
            displayUmkm(filteredUmkm);
        });

        // Buka/Tutup Modal Keranjang
        cartButton.addEventListener('click', () => cartModal.classList.remove('hidden'));
        closeCartButton.addEventListener('click', () => cartModal.classList.add('hidden'));
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) cartModal.classList.add('hidden');
        });

        // Event untuk tombol di dalam keranjang (quantity)
        cartItemsContainer.addEventListener('click', (e) => {
            const target = e.target;
            const productId = parseInt(target.dataset.productId, 10);
            if (target.classList.contains('increase-quantity-button')) {
                increaseQuantity(productId);
            }
            if (target.classList.contains('decrease-quantity-button')) {
                decreaseQuantity(productId);
            }
        });

        // Tombol pesan via WhatsApp
        orderWhatsappButton.addEventListener('click', createWhatsAppOrder);
    }

    // --- FUNGSI BANTUAN (SETUP AWAL) ---
    function setupMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    function setupComplaintModal() {
        // Implementasi ini disesuaikan dengan script yang sudah ada di halaman lain
        // Untuk singkatnya, kita asumsikan sudah ada fungsi global atau kita tambahkan di sini
        const complaintButton = document.getElementById('complaint-button');
        const complaintModal = document.getElementById('complaint-modal');
        // Pastikan ada complaint modal di HTML
        if (complaintButton && complaintModal) {
            const closeModalButton = complaintModal.querySelector('#close-modal-button');
            complaintButton.addEventListener('click', () => complaintModal.classList.remove('hidden'));
            if (closeModalButton) {
                closeModalButton.addEventListener('click', () => complaintModal.classList.add('hidden'));
            }
            complaintModal.addEventListener('click', (e) => {
                if (e.target === complaintModal) complaintModal.classList.add('hidden');
            });
        }
    }


    // --- TITIK MASUK APLIKASI ---
    loadCartFromLocalStorage();
    initializePage();
});