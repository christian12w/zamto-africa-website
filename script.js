// ===== DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== Initialize Application =====
function initializeApp() {
    initializeNavigation();
    initializeTabs();
    initializeForms();
    initializeFilters();
    initializeAnimations();
    initializeCarData();
    renderCars();
    initializeScrollEffects();
    initializeMobileMenu();
}

// ===== Navigation =====
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offset = 80; // Header height
                    const targetPosition = targetSection.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== Mobile Menu =====
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
}

// ===== Tabs =====
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// ===== Forms =====
function initializeForms() {
    // Rental form
    const rentalForm = document.querySelector('.rental-form');
    if (rentalForm) {
        rentalForm.addEventListener('submit', handleRentalFormSubmit);
    }
    
    // Sales form
    const salesForm = document.querySelector('.sales-form');
    if (salesForm) {
        salesForm.addEventListener('submit', handleSalesFormSubmit);
    }
    
    // Contact form
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
    
    // Set minimum date for date inputs
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.min = today;
        if (!input.value) {
            input.value = today;
        }
    });
}

function handleRentalFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = {
        location: formData.get('location') || e.target.querySelector('select').value,
        pickupDate: formData.get('pickup-date') || e.target.querySelectorAll('input[type="date"]')[0].value,
        returnDate: formData.get('return-date') || e.target.querySelectorAll('input[type="date"]')[1].value,
        carType: formData.get('car-type') || e.target.querySelectorAll('select')[1].value
    };
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Searching for available cars...', 'success');
        
        // Scroll to car rental section
        scrollToSection('rental');
        
        // Filter cars based on selection
        filterCarsByType(bookingData.carType);
    }, 1500);
}

function handleSalesFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const searchData = {
        make: formData.get('make') || e.target.querySelectorAll('select')[0].value,
        priceRange: formData.get('price-range') || e.target.querySelectorAll('select')[1].value,
        year: formData.get('year') || e.target.querySelectorAll('select')[2].value,
        condition: formData.get('condition') || e.target.querySelectorAll('select')[3].value
    };
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Finding cars that match your criteria...', 'success');
        
        // Scroll to car sales section
        scrollToSection('sales');
        
        // Filter cars based on selection
        filterSalesCars(searchData);
    }, 1500);
}

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('name') || e.target.querySelectorAll('input')[0].value,
        email: formData.get('email') || e.target.querySelectorAll('input')[1].value,
        phone: formData.get('phone') || e.target.querySelectorAll('input')[2].value,
        service: formData.get('service') || e.target.querySelector('select').value,
        message: formData.get('message') || e.target.querySelector('textarea').value
    };
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Reset form
        e.target.reset();
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    }, 1500);
}

// ===== Filters =====
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            const parentSection = this.closest('.car-rental, .car-sales');
            
            // Remove active class from all buttons in this section
            parentSection.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter cars
            if (parentSection.classList.contains('car-rental')) {
                filterRentalCars(filter);
            } else if (parentSection.classList.contains('car-sales')) {
                filterSalesCars({ type: filter });
            }
        });
    });
}

function filterRentalCars(filter) {
    const carCards = document.querySelectorAll('#rentalCars .car-card');
    
    carCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

function filterSalesCars(criteria) {
    const carCards = document.querySelectorAll('#salesCars .car-card');
    
    carCards.forEach(card => {
        let show = true;
        
        if (criteria.type && criteria.type !== 'all' && card.dataset.category !== criteria.type) {
            show = false;
        }
        
        if (criteria.make && criteria.make !== 'All Makes' && card.dataset.make !== criteria.make) {
            show = false;
        }
        
        if (show) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

function filterCarsByType(carType) {
    const filterButtons = document.querySelectorAll('.car-rental .filter-btn');
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === carType.toLowerCase()) {
            btn.click();
        }
    });
}

// ===== Car Data =====
function initializeCarData() {
    // Rental cars data - Enhanced with Zamto Africa style
    window.rentalCars = [
        {
            id: 1,
            name: 'Toyota Corolla',
            category: 'small-cars',
            price: 2500,
            period: 'per day',
            specs: {
                year: 2019,
                fuel: 'Petrol',
                transmission: 'Automatic',
                seats: 5,
                doors: 4
            },
            badge: 'Hire Fleet',
            note: 'Includes driver & insurance'
        },
        {
            id: 2,
            name: 'Honda CR-V',
            category: 'suv',
            price: 3500,
            period: 'per day',
            specs: {
                year: 2020,
                fuel: 'Petrol',
                transmission: 'Automatic',
                seats: 7,
                doors: 5
            },
            badge: 'Hire Fleet',
            note: 'Includes driver & insurance'
        },
        {
            id: 3,
            name: 'Toyota Hilux',
            category: 'pickup-trucks',
            price: 3000,
            period: 'per day',
            specs: {
                year: 2018,
                fuel: 'Diesel',
                transmission: 'Manual',
                seats: 5,
                doors: 4
            },
            badge: 'Hire Fleet',
            note: 'Includes driver & insurance'
        },
        {
            id: 4,
            name: 'Toyota Alphard',
            category: 'van',
            price: 4500,
            period: 'per day',
            specs: {
                year: 2021,
                fuel: 'Petrol',
                transmission: 'Automatic',
                seats: 8,
                doors: 5
            },
            badge: 'Premium',
            note: 'Includes driver & insurance'
        },
        {
            id: 5,
            name: 'Nissan Juke',
            category: 'small-cars',
            price: 2000,
            period: 'per day',
            specs: {
                year: 2017,
                fuel: 'Petrol',
                transmission: 'Automatic',
                seats: 5,
                doors: 4
            },
            badge: 'Hire Fleet',
            note: 'Includes driver & insurance'
        },
        {
            id: 6,
            name: 'Isuzu MU-X',
            category: 'suv',
            price: 3200,
            period: 'per day',
            specs: {
                year: 2019,
                fuel: 'Petrol',
                transmission: 'Automatic',
                seats: 5,
                doors: 4
            },
            badge: 'Hire Fleet',
            note: 'Includes driver & insurance'
        }
    ];
    
    // Sales cars data - Enhanced with Zamto Africa style
    window.salesCars = [
        {
            id: 1,
            name: 'Toyota Mark X',
            category: 'small-cars',
            make: 'Toyota',
            price: 285000,
            period: '',
            specs: {
                year: 2019,
                fuel: 'Petrol',
                transmission: 'Automatic',
                seats: 5,
                doors: 4,
                mileage: '45,000 km'
            },
            badge: 'For Sale',
            note: 'Inclusive of documentation'
        },
        {
            id: 2,
            name: 'Honda Fit',
            category: 'small-cars',
            make: 'Honda',
            price: 185000,
            period: '',
            specs: {
                year: 2020,
                fuel: 'Petrol',
                transmission: 'Automatic',
                seats: 5,
                doors: 4,
                mileage: '32,000 km'
            },
            badge: 'For Sale',
            note: 'Inclusive of documentation'
        },
        {
            id: 3,
            name: 'Toyota Land Cruiser Prado',
            category: 'suv',
            make: 'Toyota',
            price: 895000,
            period: '',
            specs: {
                year: 2020,
                fuel: 'Petrol',
                transmission: 'Automatic',
                seats: 7,
                doors: 5,
                mileage: '41,000 km'
            },
            badge: 'For Sale',
            note: 'Inclusive of documentation'
        },
        {
            id: 4,
            name: 'Isuzu MU-X',
            category: 'suv',
            make: 'Isuzu',
            price: 420000,
            period: '',
            specs: {
                year: 2021,
                fuel: 'Diesel',
                transmission: 'Automatic',
                seats: 5,
                doors: 4,
                mileage: '25,000 km'
            },
            badge: 'For Sale',
            note: 'Inclusive of documentation'
        },
        {
            id: 5,
            name: 'Toyota Allion',
            category: 'small-cars',
            make: 'Toyota',
            price: 165000,
            period: '',
            specs: {
                year: 2015,
                fuel: 'Petrol',
                transmission: 'Automatic',
                seats: 5,
                doors: 4,
                mileage: '78,333 km'
            },
            badge: 'For Sale',
            note: 'Inclusive of documentation'
        },
        {
            id: 6,
            name: 'Lexus RX 300t F-Sport',
            category: 'suv',
            make: 'Lexus',
            price: 950000,
            period: '',
            specs: {
                year: 2020,
                fuel: 'Petrol',
                transmission: 'Automatic',
                seats: 5,
                doors: 4,
                mileage: '41,000 km'
            },
            badge: 'Premium',
            note: 'Inclusive of documentation'
        }
    ];
}

// ===== Render Cars =====
function renderCars() {
    renderRentalCars();
    renderSalesCars();
}

function renderRentalCars() {
    const container = document.getElementById('rentalCars');
    if (!container) return;
    
    container.innerHTML = window.rentalCars.map(car => `
        <div class="car-card" data-category="${car.category}">
            <div class="car-image">
                <i class="fas fa-car"></i>
                <span class="car-badge">${car.badge}</span>
            </div>
            <div class="car-details">
                <h3 class="car-title">${car.name}</h3>
                <div class="car-specs">
                    <span class="car-spec">
                        <i class="fas fa-calendar"></i>
                        ${car.specs.year}
                    </span>
                    <span class="car-spec">
                        <i class="fas fa-gas-pump"></i>
                        ${car.specs.fuel}
                    </span>
                    <span class="car-spec">
                        <i class="fas fa-cog"></i>
                        ${car.specs.transmission}
                    </span>
                    <span class="car-spec">
                        <i class="fas fa-users"></i>
                        ${car.specs.seats} Seats
                    </span>
                    <span class="car-spec">
                        <i class="fas fa-door-open"></i>
                        ${car.specs.doors} Doors
                    </span>
                </div>
                <div class="car-price">
                    <div class="price-info">
                        <div class="price">
                            ZMW ${car.price.toLocaleString()}
                            <span class="price-period">${car.period}</span>
                        </div>
                        <div class="price-note">${car.note}</div>
                    </div>
                    <div class="car-actions">
                        <button class="btn btn-primary" onclick="bookCar(${car.id})">
                            Book Now
                        </button>
                        <button class="btn btn-whatsapp" onclick="whatsappCar(${car.id}, 'rental')">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderSalesCars() {
    const container = document.getElementById('salesCars');
    if (!container) return;
    
    container.innerHTML = window.salesCars.map(car => `
        <div class="car-card" data-category="${car.category}" data-make="${car.make}">
            <div class="car-image">
                <i class="fas fa-car"></i>
                <span class="car-badge">${car.badge}</span>
            </div>
            <div class="car-details">
                <h3 class="car-title">${car.name}</h3>
                <div class="car-specs">
                    <span class="car-spec">
                        <i class="fas fa-calendar"></i>
                        ${car.specs.year}
                    </span>
                    <span class="car-spec">
                        <i class="fas fa-gas-pump"></i>
                        ${car.specs.fuel}
                    </span>
                    <span class="car-spec">
                        <i class="fas fa-cog"></i>
                        ${car.specs.transmission}
                    </span>
                    <span class="car-spec">
                        <i class="fas fa-users"></i>
                        ${car.specs.seats} Seats
                    </span>
                    <span class="car-spec">
                        <i class="fas fa-door-open"></i>
                        ${car.specs.doors} Doors
                    </span>
                    <span class="car-spec">
                        <i class="fas fa-tachometer-alt"></i>
                        ${car.specs.mileage}
                    </span>
                </div>
                <div class="car-price">
                    <div class="price-info">
                        <div class="price">
                            ZMW ${car.price.toLocaleString()}
                        </div>
                        <div class="price-note">${car.note}</div>
                    </div>
                    <div class="car-actions">
                        <button class="btn btn-secondary" onclick="inquireCar(${car.id})">
                            Inquire
                        </button>
                        <button class="btn btn-whatsapp" onclick="whatsappCar(${car.id}, 'sale')">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Car Actions =====
function bookCar(carId) {
    const car = window.rentalCars.find(c => c.id === carId);
    if (car) {
        showNotification(`Booking ${car.name}. Please fill in your details to complete the reservation.`, 'info');
        scrollToSection('contact');
        
        // Pre-fill contact form with rental inquiry
        const serviceSelect = document.querySelector('.contact-form select');
        if (serviceSelect) {
            serviceSelect.value = 'Car Rental';
        }
    }
}

function inquireCar(carId) {
    const car = window.salesCars.find(c => c.id === carId);
    if (car) {
        showNotification(`Inquiring about ${car.name}. Please fill in your details and we'll contact you soon.`, 'info');
        scrollToSection('contact');
        
        // Pre-fill contact form with purchase inquiry
        const serviceSelect = document.querySelector('.contact-form select');
        if (serviceSelect) {
            serviceSelect.value = 'Car Purchase';
        }
    }
}

function whatsappCar(carId, type) {
    const phoneNumber = '+260977123456'; // Zamto Africa style WhatsApp number
    let car, message;
    
    if (type === 'rental') {
        car = window.rentalCars.find(c => c.id === carId);
        message = `Hi CarChief Zambia, I'm interested in the ${car.name} for rental.`;
    } else {
        car = window.salesCars.find(c => c.id === carId);
        message = `Hi CarChief Zambia, I'm interested in the ${car.name} for purchase.`;
    }
    
    if (car) {
        const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        showNotification('Opening WhatsApp...', 'success');
    }
}

// ===== Scroll Effects =====
function initializeScrollEffects() {
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll('.feature-card, .car-card, .stat');
    animateElements.forEach(el => observer.observe(el));
}

// ===== Utility Functions =====
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offset = 80; // Header height
        const targetPosition = section.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add notification content styles
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        padding: 0;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    return colors[type] || '#3b82f6';
}

// ===== Initialize Animations =====
function initializeAnimations() {
    // Add entrance animations to hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroTitle) {
        setTimeout(() => {
            heroTitle.classList.add('slide-in-left');
        }, 300);
    }
    
    if (heroSubtitle) {
        setTimeout(() => {
            heroSubtitle.classList.add('slide-in-left');
        }, 600);
    }
    
    if (heroButtons) {
        setTimeout(() => {
            heroButtons.classList.add('slide-in-left');
        }, 900);
    }
    
    const heroImage = document.querySelector('.hero-car-showcase');
    if (heroImage) {
        setTimeout(() => {
            heroImage.classList.add('slide-in-right');
        }, 400);
    }
}

// ===== Window Resize Handler =====
window.addEventListener('resize', function() {
    // Handle responsive adjustments
    if (window.innerWidth > 768) {
        const navMenu = document.getElementById('navMenu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (navMenu && mobileMenuToggle) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    }
});

// ===== Performance Optimization =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounce scroll event
window.addEventListener('scroll', debounce(function() {
    // Scroll-based animations and updates
}, 100));
