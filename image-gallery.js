// Enhanced Image Gallery with Zoom and Lightbox functionality
// Optimized for performance with lazy loading and efficient rendering

class ImageGallery {
    constructor() {
        this.init();
    }

    init() {
        this.setupLightbox();
        this.setupImageZoom();
        this.setupThumbnailClicks();
        this.setupKeyboardNavigation();
    }

    setupLightbox() {
        // Create lightbox HTML with performance optimizations
        const lightboxHTML = `
            <div id="image-lightbox" class="fixed inset-0 bg-black bg-opacity-90 z-50 hidden flex items-center justify-center" style="will-change: transform;">
                <div class="relative max-w-6xl max-h-screen p-4">
                    <button id="close-lightbox" class="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition z-50" aria-label="Close lightbox">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <button id="prev-image" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition" aria-label="Previous image">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <button id="next-image" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition" aria-label="Next image">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                    <img id="lightbox-image" src="" alt="" class="max-w-full max-h-full object-contain" loading="lazy" decoding="async">
                    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                        <span id="image-counter">1 / 5</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        
        // Lightbox controls
        const lightbox = document.getElementById('image-lightbox');
        const closeBtn = document.getElementById('close-lightbox');
        const prevBtn = document.getElementById('prev-image');
        const nextBtn = document.getElementById('next-image');
        const lightboxImg = document.getElementById('lightbox-image');
        const counter = document.getElementById('image-counter');
        
        let currentImages = [];
        let currentIndex = 0;
        
        // Open lightbox
        window.openLightbox = function(images, index = 0) {
            currentImages = images;
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        };
        
        function updateLightboxImage() {
            if (currentImages.length > 0) {
                lightboxImg.src = currentImages[currentIndex];
                counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
            }
        }
        
        closeBtn.addEventListener('click', () => {
            lightbox.classList.add('hidden');
            document.body.style.overflow = '';
        });
        
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateLightboxImage();
        });
        
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateLightboxImage();
        });
        
        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    }

    setupImageZoom() {
        // Add zoom functionality to main images
        const mainImages = document.querySelectorAll('.main-vehicle-image');
        
        mainImages.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function() {
                const galleryImages = this.dataset.gallery ? 
                    this.dataset.gallery.split(',') : 
                    [this.src];
                window.openLightbox(galleryImages, 0);
            });
        });
    }

    setupThumbnailClicks() {
        // Thumbnail gallery functionality
        const thumbnails = document.querySelectorAll('.thumbnail-image');
        const mainImage = document.querySelector('.main-vehicle-image');
        
        if (thumbnails.length > 0 && mainImage) {
            thumbnails.forEach((thumb, index) => {
                thumb.style.cursor = 'pointer';
                thumb.addEventListener('click', function() {
                    // Update main image
                    mainImage.src = this.src.replace('thumb', 'main');
                    
                    // Update active thumbnail styling
                    thumbnails.forEach(t => t.classList.remove('ring-2', 'ring-blue-500'));
                    this.classList.add('ring-2', 'ring-blue-500');
                    
                    // Get all gallery images for lightbox
                    const galleryImages = Array.from(thumbnails).map(t => t.src.replace('thumb', 'main'));
                    mainImage.dataset.gallery = galleryImages.join(',');
                });
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const lightbox = document.getElementById('image-lightbox');
            if (!lightbox.classList.contains('hidden')) {
                if (e.key === 'Escape') {
                    lightbox.classList.add('hidden');
                    document.body.style.overflow = '';
                } else if (e.key === 'ArrowLeft') {
                    document.getElementById('prev-image').click();
                } else if (e.key === 'ArrowRight') {
                    document.getElementById('next-image').click();
                }
            }
        });
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageGallery();
});

// Touch gestures for mobile
class TouchGestures {
    constructor(element) {
        this.element = element;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        
        this.addTouchListeners();
    }
    
    addTouchListeners() {
        this.element.addEventListener('touchstart', (e) => {
            this.startX = e.changedTouches[0].screenX;
            this.startY = e.changedTouches[0].screenY;
        }, false);
        
        this.element.addEventListener('touchend', (e) => {
            this.endX = e.changedTouches[0].screenX;
            this.endY = e.changedTouches[0].screenY;
            this.handleGesture();
        }, false);
    }
    
    handleGesture() {
        const diffX = this.startX - this.endX;
        const diffY = this.startY - this.endY;
        
        // Horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 50) {
                // Swipe left - next image
                document.getElementById('next-image')?.click();
            } else if (diffX < -50) {
                // Swipe right - previous image
                document.getElementById('prev-image')?.click();
            }
        }
    }
}

// Initialize touch gestures for lightbox
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
        new TouchGestures(lightbox);
    }
});
