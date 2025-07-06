// JavaScript for Mobile Menu
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// JavaScript for Complaint Modal
const complaintButton = document.getElementById('complaint-button');
const complaintModal = document.getElementById('complaint-modal');
const closeModalButton = document.getElementById('close-modal-button');

if (complaintButton) {
    complaintButton.addEventListener('click', () => {
        complaintModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
}

if (closeModalButton) {
    closeModalButton.addEventListener('click', () => {
        complaintModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });
}

if (complaintModal) {
    complaintModal.addEventListener('click', (event) => {
        if (event.target === complaintModal) {
            complaintModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
}


// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// --- Fetch and Display Aparat Desa Data ---
async function loadAparatDesa() {
    const container = document.getElementById('aparat-desa-container');
    const apiUrl = 'https://website-sangubayu-be.vercel.app/api/struktur-organisasi';

    // Show a loading state
    container.innerHTML = '<p class="text-center text-gray-500 col-span-full">Memuat data aparat desa...</p>';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Gagal mengambil data: ${response.statusText}`);
        }
        const data = await response.json();

        // Clear loading state
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 col-span-full">Data aparat desa tidak tersedia saat ini.</p>';
            return;
        }

        // Create a card for each official
        data.forEach(pejabat => {
            const fotoUrl = pejabat.foto_pejabat || 'https://placehold.co/300x300/E2E8F0/4A5568?text=Foto';
            const card = `
                <div class="bg-white rounded-lg shadow-md overflow-hidden text-center transform hover:-translate-y-2 transition-transform duration-300">
                    <div class="h-64 bg-gray-200">
                         <img src="${fotoUrl}" alt="Foto ${pejabat.nama_pejabat}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='https://placehold.co/300x300/E2E8F0/4A5568?text=Foto';">
                    </div>
                    <div class="p-5">
                        <h3 class="text-lg font-bold text-gray-900">${pejabat.nama_pejabat}</h3>
                        <p class="text-blue-600 font-semibold">${pejabat.nama_jabatan}</p>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });

    } catch (error) {
        console.error('Error loading aparat desa data:', error);
        container.innerHTML = '<p class="text-center text-red-500 col-span-full">Terjadi kesalahan saat memuat data. Mohon coba lagi nanti.</p>';
    }
}

// --- Handle Complaint Form Submission ---
const complaintForm = document.getElementById('complaint-form');
const formMessage = document.getElementById('form-message');

if (complaintForm) {
    complaintForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const nama = document.getElementById('nama').value;
        const telepon = document.getElementById('telepon').value;
        const kategori = document.getElementById('kategori').value;
        const pengaduan = document.getElementById('pengaduan').value;

        const subject = `Pengaduan Baru: ${kategori} - Dari ${nama}`;
        const body = `
            Halo Pemerintah Desa Sangubanyu,

            Saya ingin menyampaikan pengaduan dengan rincian sebagai berikut:

            Nama: ${nama}
            Nomor Telepon/WA: ${telepon}
            Kategori: ${kategori}

            Isi Pengaduan:
            ${pengaduan}

            ---------------------------------
            Email ini dibuat secara otomatis dari website Desa Sangubanyu.
        `;

        const mailtoLink = `mailto:Pemdessangubanyu21@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        formMessage.innerHTML = '<p class="text-green-600 font-medium">Terima kasih! Silakan lanjutkan pengiriman melalui aplikasi email Anda yang akan segera terbuka.</p>';
        formMessage.classList.remove('hidden');

        // Attempt to open the mail client
        window.location.href = mailtoLink;

        // Reset and close the form after a delay
        setTimeout(() => {
            complaintForm.reset();
            formMessage.classList.add('hidden');
            complaintModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 4000);
    });
}


// Load data when the page is ready
document.addEventListener('DOMContentLoaded', () => {
    loadAparatDesa();
});