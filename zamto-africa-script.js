// ===== Zamto Africa Clone JavaScript =====

// ===== DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== Advanced Vehicle Filtering =====
function initializeAdvancedFiltering() {
    const filterForm = document.querySelector('.search-form');
    const categorySelect = filterForm.querySelector('select');
    const typeSelect = filterForm.querySelectorAll('select')[1];
    const searchInput = filterForm.querySelector('input[type="text"]');
    
    // Add filter event listeners
    [categorySelect, typeSelect, searchInput].forEach(element => {
        element.addEventListener('change', applyFilters);
        element.addEventListener('input', applyFilters);
    });
    
    // Add price range slider
    addPriceRangeFilter();
    
    // Add year range filter
    addYearRangeFilter();
}

function applyFilters() {
    const searchQuery = document.querySelector('.search-form input[type="text"]').value.toLowerCase();
    const category = document.querySelector('.search-form select').value;
    const type = document.querySelector('.search-form select:nth-child(2)').value;
    
    let filteredVehicles = vehicleData.filter(vehicle => {
        const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery);
        const matchesCategory = !category || category === 'All Categories' || vehicle.category === category;
        const matchesType = !type || type === 'All Types' || vehicle.type === type;
        
        return matchesSearch && matchesCategory && matchesType;
    });
    
    displayFilteredVehicles(filteredVehicles);
    updateVehicleCount(filteredVehicles.length);
}

function displayFilteredVehicles(vehicles) {
    const vehiclesGrid = document.querySelector('.vehicles-grid');
    vehiclesGrid.innerHTML = '';
    
    vehicles.forEach((vehicle, index) => {
        const vehicleCard = createVehicleCard(vehicle);
        vehicleCard.style.animationDelay = `${index * 0.1}s`;
        vehicleCard.classList.add('animate-fadeInUp');
        vehiclesGrid.appendChild(vehicleCard);
    });
    
    if (vehicles.length === 0) {
        vehiclesGrid.innerHTML = '<div class="no-results"><p>No vehicles found matching your criteria.</p></div>';
    }
}

function updateVehicleCount(count) {
    const countElement = document.querySelector('.count-content h2');
    if (countElement) {
        countElement.textContent = `${count} Vehicles Found`;
    }
}

function addPriceRangeFilter() {
    const searchForm = document.querySelector('.search-form');
    const priceRangeDiv = document.createElement('div');
    priceRangeDiv.className = 'form-group';
    priceRangeDiv.innerHTML = `
        <label>Price Range</label>
        <div class="price-range-container">
            <input type="range" id="minPrice" min="0" max="1000000" value="0" class="price-range">
            <input type="range" id="maxPrice" min="0" max="1000000" value="1000000" class="price-range">
            <div class="price-range-display">
                <span>ZMW <span id="minPriceDisplay">0</span></span>
                <span>ZMW <span id="maxPriceDisplay">1,000,000</span></span>
            </div>
        </div>
    `;
    
    searchForm.querySelector('.form-row').appendChild(priceRangeDiv);
    
    // Add price range event listeners
    const minPriceSlider = document.getElementById('minPrice');
    const maxPriceSlider = document.getElementById('maxPrice');
    const minPriceDisplay = document.getElementById('minPriceDisplay');
    const maxPriceDisplay = document.getElementById('maxPriceDisplay');
    
    minPriceSlider.addEventListener('input', function() {
        minPriceDisplay.textContent = parseInt(this.value).toLocaleString();
        if (parseInt(this.value) > parseInt(maxPriceSlider.value)) {
            maxPriceSlider.value = this.value;
            maxPriceDisplay.textContent = parseInt(this.value).toLocaleString();
        }
        applyFilters();
    });
    
    maxPriceSlider.addEventListener('input', function() {
        maxPriceDisplay.textContent = parseInt(this.value).toLocaleString();
        if (parseInt(this.value) < parseInt(minPriceSlider.value)) {
            minPriceSlider.value = this.value;
            minPriceDisplay.textContent = parseInt(this.value).toLocaleString();
        }
        applyFilters();
    });
}

function addYearRangeFilter() {
    const searchForm = document.querySelector('.search-form');
    const yearRangeDiv = document.createElement('div');
    yearRangeDiv.className = 'form-group';
    yearRangeDiv.innerHTML = `
        <label>Year Range</label>
        <div class="year-range-container">
            <select id="minYear" class="form-control">
                <option value="">From Year</option>
            </select>
            <select id="maxYear" class="form-control">
                <option value="">To Year</option>
            </select>
        </div>
    `;
    
    searchForm.querySelector('.form-row').appendChild(yearRangeDiv);
    
    // Populate year options
    const currentYear = new Date().getFullYear();
    const minYearSelect = document.getElementById('minYear');
    const maxYearSelect = document.getElementById('maxYear');
    
    for (let year = currentYear; year >= 2000; year--) {
        minYearSelect.innerHTML += `<option value="${year}">${year}</option>`;
        maxYearSelect.innerHTML += `<option value="${year}">${year}</option>`;
    }
    
    // Add year range event listeners
    [minYearSelect, maxYearSelect].forEach(select => {
        select.addEventListener('change', applyFilters);
    });
}

// ===== Vehicle Comparison Feature =====
let comparisonList = [];

function initializeComparison() {
    // Add compare buttons to vehicle cards
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    vehicleCards.forEach(card => {
        const vehicleName = card.querySelector('.vehicle-title').textContent;
        const compareBtn = document.createElement('button');
        compareBtn.className = 'btn btn-compare';
        compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i> Compare';
        compareBtn.onclick = () => toggleComparison(vehicleName);
        
        const actionsDiv = card.querySelector('.vehicle-actions');
        actionsDiv.appendChild(compareBtn);
    });
    
    // Create comparison bar
    createComparisonBar();
}

function toggleComparison(vehicleName) {
    const index = comparisonList.indexOf(vehicleName);
    if (index > -1) {
        comparisonList.splice(index, 1);
    } else {
        if (comparisonList.length >= 3) {
            showNotification('You can compare up to 3 vehicles at a time', 'warning');
            return;
        }
        comparisonList.push(vehicleName);
    }
    
    updateComparisonBar();
    updateCompareButtons();
}

function createComparisonBar() {
    const comparisonBar = document.createElement('div');
    comparisonBar.id = 'comparisonBar';
    comparisonBar.className = 'comparison-bar';
    comparisonBar.innerHTML = `
        <div class="comparison-content">
            <div class="comparison-vehicles"></div>
            <div class="comparison-actions">
                <button class="btn btn-primary" onclick="showComparisonModal()">Compare (<span id="compareCount">0</span>)</button>
                <button class="btn btn-outline" onclick="clearComparison()">Clear All</button>
            </div>
        </div>
    `;
    document.body.appendChild(comparisonBar);
}

function updateComparisonBar() {
    const bar = document.getElementById('comparisonBar');
    const vehiclesDiv = bar.querySelector('.comparison-vehicles');
    const countSpan = document.getElementById('compareCount');
    
    vehiclesDiv.innerHTML = comparisonList.map(vehicle => 
        `<div class="comparison-item">
            <span>${vehicle}</span>
            <button onclick="removeFromComparison('${vehicle}')" class="remove-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>`
    ).join('');
    
    countSpan.textContent = comparisonList.length;
    bar.style.display = comparisonList.length > 0 ? 'block' : 'none';
}

function removeFromComparison(vehicleName) {
    toggleComparison(vehicleName);
}

function clearComparison() {
    comparisonList = [];
    updateComparisonBar();
    updateCompareButtons();
}

function updateCompareButtons() {
    const compareBtns = document.querySelectorAll('.btn-compare');
    compareBtns.forEach(btn => {
        const vehicleName = btn.closest('.vehicle-card').querySelector('.vehicle-title').textContent;
        const isInComparison = comparisonList.includes(vehicleName);
        btn.classList.toggle('active', isInComparison);
        btn.innerHTML = isInComparison ? 
            '<i class="fas fa-check"></i> Selected' : 
            '<i class="fas fa-balance-scale"></i> Compare';
    });
}

function showComparisonModal() {
    if (comparisonList.length < 2) {
        showNotification('Please select at least 2 vehicles to compare', 'warning');
        return;
    }
    
    // Create comparison modal
    const modal = document.createElement('div');
    modal.className = 'comparison-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Vehicle Comparison</h3>
                <button onclick="closeComparisonModal()" class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${createComparisonTable()}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function createComparisonTable() {
    const vehicles = comparisonList.map(name => 
        vehicleData.find(v => v.name === name)
    ).filter(Boolean);
    
    const specs = ['Year', 'Fuel', 'Transmission', 'Seats', 'Doors', 'Price'];
    
    let table = '<table class="comparison-table">';
    table += '<thead><tr><th>Feature</th>';
    vehicles.forEach(vehicle => {
        table += `<th>${vehicle.name}</th>`;
    });
    table += '</tr></thead><tbody>';
    
    specs.forEach(spec => {
        table += `<tr><td>${spec}</td>`;
        vehicles.forEach(vehicle => {
            const value = spec === 'Price' ? vehicle.price : vehicle[spec.toLowerCase()];
            table += `<td>${value || 'N/A'}</td>`;
        });
        table += '</tr>';
    });
    
    table += '</tbody></table>';
    return table;
}

function closeComparisonModal() {
    const modal = document.querySelector('.comparison-modal');
    if (modal) {
        modal.remove();
    }
}

// ===== Wishlist Feature =====
let wishlist = JSON.parse(localStorage.getItem('zamtoWishlist')) || [];

function initializeWishlist() {
    // Add wishlist buttons to vehicle cards
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    vehicleCards.forEach(card => {
        const vehicleName = card.querySelector('.vehicle-title').textContent;
        const wishlistBtn = document.createElement('button');
        wishlistBtn.className = 'btn btn-wishlist';
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        wishlistBtn.onclick = () => toggleWishlist(vehicleName);
        
        const actionsDiv = card.querySelector('.vehicle-actions');
        actionsDiv.insertBefore(wishlistBtn, actionsDiv.firstChild);
        
        // Update button state
        updateWishlistButton(wishlistBtn, vehicleName);
    });
}

function toggleWishlist(vehicleName) {
    const index = wishlist.indexOf(vehicleName);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification(`${vehicleName} removed from wishlist`, 'info');
    } else {
        wishlist.push(vehicleName);
        showNotification(`${vehicleName} added to wishlist`, 'success');
    }
    
    localStorage.setItem('zamtoWishlist', JSON.stringify(wishlist));
    updateAllWishlistButtons();
}

function updateWishlistButton(button, vehicleName) {
    const isInWishlist = wishlist.includes(vehicleName);
    button.classList.toggle('active', isInWishlist);
    button.innerHTML = isInWishlist ? 
        '<i class="fas fa-heart"></i>' : 
        '<i class="far fa-heart"></i>';
}

function updateAllWishlistButtons() {
    const wishlistBtns = document.querySelectorAll('.btn-wishlist');
    wishlistBtns.forEach(btn => {
        const vehicleName = btn.closest('.vehicle-card').querySelector('.vehicle-title').textContent;
        updateWishlistButton(btn, vehicleName);
    });
}

// ===== Enhanced Contact Form =====
function initializeEnhancedContactForm() {
    const contactForm = document.querySelector('.contact-form .form');
    if (contactForm) {
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
        
        // Enhanced form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm(this)) {
                submitContactForm(this);
            }
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.previousElementSibling.textContent;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${fieldName} is required`;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Show error or success
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        showFieldSuccess(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function showFieldSuccess(field) {
    clearFieldError(field);
    field.classList.add('success');
}

function clearFieldError(field) {
    field.classList.remove('error', 'success');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function validateContactForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function submitContactForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Your message has been sent successfully! We will contact you within 24 hours.', 'success');
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Clear validation states
        form.querySelectorAll('.error, .success').forEach(field => {
            clearFieldError(field);
        });
    }, 2000);
}

// ===== Initialize Enhanced Features =====
function initializeEnhancedFeatures() {
    initializeAdvancedFiltering();
    initializeComparison();
    initializeWishlist();
    initializeEnhancedContactForm();
    
    // Add CSS for new features
    addEnhancedStyles();
}

function addEnhancedStyles() {
    const styles = `
        /* Enhanced Features Styles */
        .comparison-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--gray-900);
            color: var(--white);
            padding: var(--spacing-md);
            transform: translateY(100%);
            transition: transform var(--transition-normal);
            z-index: 1000;
            display: none;
        }
        
        .comparison-bar.show {
            transform: translateY(0);
        }
        
        .comparison-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: var(--spacing-lg);
        }
        
        .comparison-vehicles {
            display: flex;
            gap: var(--spacing-md);
            flex-wrap: wrap;
        }
        
        .comparison-item {
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
            background: rgba(255, 255, 255, 0.1);
            padding: 0.25rem 0.5rem;
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
        }
        
        .remove-btn {
            background: transparent;
            border: none;
            color: var(--white);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 50%;
            transition: background var(--transition-normal);
        }
        
        .remove-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .btn-compare {
            background: var(--gray-200);
            color: var(--gray-700);
            border: 1px solid var(--gray-300);
        }
        
        .btn-compare:hover {
            background: var(--primary-color);
            color: var(--white);
            border-color: var(--primary-color);
        }
        
        .btn-compare.active {
            background: var(--accent-color);
            color: var(--white);
            border-color: var(--accent-color);
        }
        
        .btn-wishlist {
            background: transparent;
            color: var(--gray-400);
            border: 1px solid var(--gray-300);
            padding: 0.5rem;
            aspect-ratio: 1;
        }
        
        .btn-wishlist:hover {
            color: var(--secondary-color);
            border-color: var(--secondary-color);
            background: rgba(220, 38, 38, 0.1);
        }
        
        .btn-wishlist.active {
            color: var(--secondary-color);
            border-color: var(--secondary-color);
            background: rgba(220, 38, 38, 0.1);
        }
        
        .comparison-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        }
        
        .modal-content {
            background: var(--white);
            border-radius: var(--radius-lg);
            max-width: 90%;
            max-height: 90vh;
            overflow: auto;
            position: relative;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-lg);
            border-bottom: 1px solid var(--gray-200);
        }
        
        .close-btn {
            background: transparent;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--gray-500);
            padding: var(--spacing-xs);
        }
        
        .close-btn:hover {
            color: var(--gray-700);
        }
        
        .modal-body {
            padding: var(--spacing-lg);
        }
        
        .comparison-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .comparison-table th,
        .comparison-table td {
            padding: var(--spacing-md);
            text-align: left;
            border-bottom: 1px solid var(--gray-200);
        }
        
        .comparison-table th {
            background: var(--gray-50);
            font-weight: 600;
            color: var(--gray-900);
        }
        
        .price-range-container {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
        }
        
        .price-range {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: var(--gray-200);
            outline: none;
            -webkit-appearance: none;
        }
        
        .price-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--primary-color);
            cursor: pointer;
        }
        
        .price-range-display {
            display: flex;
            justify-content: space-between;
            font-size: 0.875rem;
            color: var(--gray-600);
        }
        
        .year-range-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-sm);
        }
        
        .field-error {
            color: var(--secondary-color);
            font-size: 0.875rem;
            margin-top: var(--spacing-xs);
        }
        
        .form-control.error {
            border-color: var(--secondary-color);
        }
        
        .form-control.success {
            border-color: var(--accent-color);
        }
        
        .no-results {
            text-align: center;
            padding: var(--spacing-3xl);
            color: var(--gray-500);
        }
        
        .no-results p {
            font-size: 1.125rem;
            margin: 0;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// ===== Update Initialize App =====
function initializeApp() {
    initializeNavigation();
    initializeForms();
    initializeScrollEffects();
    initializeAnimations();
    initializeEnhancedFeatures();
}

// ===== Navigation =====
function initializeNavigation() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        mobileMenuToggle.classList.remove('active');
                    }
                }
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// ===== Update Active Navigation Link =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== Forms =====
function initializeForms() {
    // Contact form submission
    const contactForm = document.querySelector('.contact-form .form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Show success message
            showNotification('Thank you for your message! We will contact you soon.', 'success');
            
            // Reset form
            this.reset();
        });
    }
    
    // Search form
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="text"]');
            const categorySelect = this.querySelector('select');
            const typeSelect = this.querySelectorAll('select')[1];
            
            // Show search results notification
            showNotification('Searching for vehicles...', 'info');
            
            // Simulate search
            setTimeout(() => {
                showNotification('Search completed! Showing results below.', 'success');
                scrollToSection('inventory');
            }, 1000);
        });
    }
}

// ===== Scroll Effects =====
function initializeScrollEffects() {
    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--white)';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Scroll to top button
    createScrollToTopButton();
}

// ===== Scroll to Top Button =====
function createScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: var(--shadow-lg);
        transition: all var(--transition-normal);
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide scroll button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.background = 'var(--primary-dark)';
    });
    
    scrollButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.background = 'var(--primary-color)';
    });
}

// ===== Animations =====
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add staggered animation for grids
                if (entry.target.classList.contains('vehicles-grid') || 
                    entry.target.classList.contains('features-grid') ||
                    entry.target.classList.contains('services-grid')) {
                    const cards = entry.target.children;
                    Array.from(cards).forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.vehicle-card, .feature-card, .service-card, .section-header');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Observe grids
    const grids = document.querySelectorAll('.vehicles-grid, .features-grid, .services-grid');
    grids.forEach(grid => {
        const cards = grid.children;
        Array.from(cards).forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        observer.observe(grid);
    });
}

// ===== Utility Functions =====
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--accent-color)' : type === 'error' ? 'var(--secondary-color)' : 'var(--primary-color)'};
        color: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all var(--transition-normal);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== Vehicle Data (for future enhancement) =====
const vehicleData = [
    {
        id: 1,
        name: 'BMW 320i',
        category: 'SMALL CARS',
        type: 'hire',
        year: 2011,
        fuel: 'Petrol',
        transmission: 'Automatic',
        seats: 5,
        doors: 4,
        price: 'ZMW 2,500',
        note: 'Includes driver & insurance'
    },
    {
        id: 2,
        name: 'BMW X1',
        category: 'SMALL CARS',
        type: 'sale',
        year: 2011,
        fuel: 'Petrol',
        transmission: 'Automatic',
        seats: 5,
        doors: 5,
        price: 'ZMW 200,000',
        note: 'Inclusive of documentation'
    },
    {
        id: 3,
        name: 'HONDA FIT',
        category: 'SMALL CARS',
        type: 'sale',
        year: 2013,
        mileage: '131,410 km',
        fuel: 'Petrol',
        transmission: 'Automatic',
        seats: 5,
        doors: 4,
        price: 'C&F USD 3,358 UPTO DAR PORT',
        note: 'Inclusive of documentation'
    },
    {
        id: 4,
        name: 'Isuzu mux',
        category: 'SUV',
        type: 'hire',
        year: 2018,
        fuel: 'Petrol',
        transmission: 'Automatic',
        seats: 5,
        doors: 4,
        price: 'ZMW 2,500',
        note: 'Includes driver & insurance'
    },
    {
        id: 5,
        name: 'Isuzu Van',
        category: 'PICKUP TRUCKS',
        type: 'sale',
        year: 2018,
        mileage: '321866 km',
        fuel: 'Diesel',
        transmission: 'Manual',
        seats: 5,
        doors: 4,
        price: 'USD 15800 - ZMW 350000',
        note: 'Inclusive of documentation'
    },
    {
        id: 6,
        name: 'Lexus RX 300t F-Sport (AGL20W)',
        category: 'SUV',
        type: 'sale',
        year: 2020,
        mileage: '41,000 km',
        fuel: 'Petrol',
        transmission: 'Automatic',
        seats: 5,
        doors: 4,
        price: 'ZMW 895,000',
        note: 'Inclusive of documentation'
    }
];

// ===== Search Functionality =====
function searchVehicles(query, category, type) {
    let filteredVehicles = vehicleData;
    
    if (query) {
        filteredVehicles = filteredVehicles.filter(vehicle => 
            vehicle.name.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    if (category && category !== 'All Categories') {
        filteredVehicles = filteredVehicles.filter(vehicle => 
            vehicle.category === category
        );
    }
    
    if (type && type !== 'All Types') {
        filteredVehicles = filteredVehicles.filter(vehicle => 
            vehicle.type === type
        );
    }
    
    return filteredVehicles;
}

// ===== WhatsApp Integration =====
function openWhatsApp(message) {
    const phoneNumber = '260572213038';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Add WhatsApp functionality to all WhatsApp buttons
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButtons = document.querySelectorAll('.btn-whatsapp');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const vehicleName = this.closest('.vehicle-card').querySelector('.vehicle-title').textContent;
            const message = `Hi Zamto Africa, I'm interested in the ${vehicleName}.`;
            openWhatsApp(message);
        });
    });
});

// ===== Print Functionality =====
function printVehicleDetails(vehicleId) {
    const vehicle = vehicleData.find(v => v.id === vehicleId);
    if (vehicle) {
        window.print();
    }
}

// ===== Share Functionality =====
function shareVehicle(vehicleId) {
    const vehicle = vehicleData.find(v => v.id === vehicleId);
    if (vehicle) {
        const shareData = {
            title: vehicle.name,
            text: `Check out this ${vehicle.name} at Zamto Africa!`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // Fallback: copy to clipboard
            const text = `${shareData.text} ${shareData.url}`;
            navigator.clipboard.writeText(text);
            showNotification('Link copied to clipboard!', 'success');
        }
    }
}

// ===== Lazy Loading for Images =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== Initialize everything when DOM is ready =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeLazyLoading();
});
