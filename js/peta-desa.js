// --- Animation on Scroll Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the element is visible on the screen, add the 'is-visible' class
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Animation is triggered when 10% of the element is visible
    });

    // Get all elements that have the 'animate-on-scroll' class
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    // Observe each element
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
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
});

closeModalButton.addEventListener('click', () => {
    complaintModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
});

complaintModal.addEventListener('click', (event) => {
    if (event.target === complaintModal) {
        complaintModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
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
        document.body.style.overflow = 'auto';
    }, 4000);
});

// --- Map Selection Logic ---
const locationSelect = document.getElementById('location-select');
const mapIframe = document.getElementById('map-iframe');

locationSelect.addEventListener('change', (event) => {
    const newSrc = event.target.value;
    if (newSrc) {
        mapIframe.src = newSrc;
    }
});