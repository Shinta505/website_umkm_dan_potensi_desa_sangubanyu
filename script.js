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

complaintButton.addEventListener('click', () => {
    complaintModal.classList.remove('hidden');
});

closeModalButton.addEventListener('click', () => {
    complaintModal.classList.add('hidden');
});

complaintModal.addEventListener('click', (event) => {
    if (event.target === complaintModal) {
        complaintModal.classList.add('hidden');
    }
});

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// --- Fetch Data Struktur Organisasi from API ---
async function loadStrukturOrganisasi() {
    const container = document.getElementById('struktur-organisasi-container');
    const apiUrl = 'https://website-sangubayu-be.vercel.app/api/struktur-organisasi';

    container.innerHTML = '<p class="text-center text-gray-500 col-span-full">Memuat data...</p>';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        container.innerHTML = '';
        const dataToShow = data.slice(0, 4);

        if (dataToShow.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 col-span-full">Data tidak ditemukan.</p>';
            return;
        }

        dataToShow.forEach(pejabat => {
            const fotoUrl = pejabat.foto_pejabat || 'https://placehold.co/150x150/E2E8F0/4A5568?text=Foto';
            const card = `
                        <div class="bg-white p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
                            <img src="${fotoUrl}" alt="Foto ${pejabat.nama_pejabat}" class="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-gray-200 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/150x150/E2E8F0/4A5568?text=Foto';">
                            <h3 class="text-xl font-semibold text-gray-800">${pejabat.nama_pejabat}</h3>
                            <p class="text-gray-500">${pejabat.nama_jabatan}</p>
                        </div>
                    `;
            container.innerHTML += card;
        });

    } catch (error) {
        console.error('Gagal mengambil data struktur organisasi:', error);
        container.innerHTML = '<p class="text-center text-red-500 col-span-full">Gagal memuat data. Silakan coba lagi nanti.</p>';
    }
}

// --- Handle Complaint Form Submission ---
const complaintForm = document.getElementById('complaint-form');
const formMessage = document.getElementById('form-message');

complaintForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Mencegah form dari submit biasa

    // Ambil data dari form
    const nama = document.getElementById('nama').value;
    const telepon = document.getElementById('telepon').value;
    const kategori = document.getElementById('kategori').value;
    const pengaduan = document.getElementById('pengaduan').value;

    // Buat subject dan body email
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

    // Buat link mailto
    const mailtoLink = `mailto:Pemdessangubanyu21@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Beri tahu pengguna dan coba buka aplikasi email
    formMessage.innerHTML = '<p class="text-green-600 font-medium">Terima kasih! Silakan lanjutkan pengiriman melalui aplikasi email Anda yang akan segera terbuka.</p>';
    formMessage.classList.remove('hidden');

    // Buka aplikasi email
    window.location.href = mailtoLink;

    // Reset dan tutup form setelah beberapa saat
    setTimeout(() => {
        complaintForm.reset();
        formMessage.classList.add('hidden');
        complaintModal.classList.add('hidden');
    }, 4000); // Tutup modal setelah 4 detik
});


// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadStrukturOrganisasi();
});