// --- Animation on Scroll Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi IntersectionObserver untuk memantau elemen
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Jika elemen terlihat di layar, tambahkan kelas 'is-visible'
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Animasi terpicu saat 10% elemen terlihat
    });

    // Ambil semua elemen yang memiliki kelas 'animate-on-scroll'
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    // Amati setiap elemen
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
});

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

// --- Handle Complaint Form Submission ---
const complaintForm = document.getElementById('complaint-form');
const formMessage = document.getElementById('form-message');

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

    window.location.href = mailtoLink;

    setTimeout(() => {
        complaintForm.reset();
        formMessage.classList.add('hidden');
        complaintModal.classList.add('hidden');
    }, 4000);
});