document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');
    const API_URL = 'https://website-sangubayu-be.vercel.app/api/gallery';

    async function loadGallery() {
        if (!galleryContainer) return;

        galleryContainer.innerHTML = '<p class="text-center text-gray-500 col-span-full">Memuat galeri...</p>';

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Gagal memuat data galeri.');
            }
            const images = await response.json();
            galleryContainer.innerHTML = '';

            if (images.length === 0) {
                galleryContainer.innerHTML = '<p class="text-center text-gray-500 col-span-full">Belum ada gambar di galeri.</p>';
                return;
            }

            images.forEach(image => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item rounded-lg shadow-lg cursor-pointer animate-on-scroll zoom-in-pop';

                const img = document.createElement('img');
                img.src = image.url_gambar;
                img.alt = image.deskripsi_gambar || 'Gambar Galeri Desa Sangubanyu';
                img.className = 'w-full h-64 object-cover rounded-lg';
                img.onerror = function () { this.src = 'https://placehold.co/600x400/E2E8F0/4A5568?text=Gagal+Muat'; };

                const overlay = document.createElement('div');
                overlay.className = 'overlay';

                const description = document.createElement('p');
                description.className = 'text-sm mb-1';
                description.textContent = image.deskripsi_gambar || 'Tidak ada deskripsi.';

                const date = document.createElement('p');
                date.className = 'text-xs text-gray-300';
                const uploadDate = new Date(image.tanggal_upload);
                date.textContent = `Diupload: ${uploadDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;

                overlay.appendChild(description);
                overlay.appendChild(date);
                galleryItem.appendChild(img);
                galleryItem.appendChild(overlay);
                galleryContainer.appendChild(galleryItem);
            });

            // Re-initialize animation observer for new items
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));


        } catch (error) {
            console.error(error);
            galleryContainer.innerHTML = `<p class="text-center text-red-500 col-span-full">${error.message}</p>`;
        }
    }

    // --- Utility Functions ---
    function setupMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        }
    }

    function setFooterYear() {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    // --- Initial Load ---
    loadGallery();
    setupMobileMenu();
    setFooterYear();
});