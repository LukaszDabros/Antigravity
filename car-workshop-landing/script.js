document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        }
    });

    // Close mobile menu when clicking on a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // 2. Set Current Year in Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Navbar Background on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg');
            navbar.classList.add('bg-dark-900/95');
            navbar.classList.remove('bg-dark-900/80');
        } else {
            navbar.classList.remove('shadow-lg');
            navbar.classList.add('bg-dark-900/80');
            navbar.classList.remove('bg-dark-900/95');
        }
    });

    // 3. Calendar Logic
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const dateError = document.getElementById('date-error');
    const timeError = document.getElementById('time-error');
    
    // Set minimum date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;
    dateInput.setAttribute('min', minDate);

    // Validate Date (Block Sundays)
    dateInput.addEventListener('change', (e) => {
        const selectedDate = new Date(e.target.value);
        const day = selectedDate.getDay();
        
        // 0 is Sunday
        if (day === 0) {
            dateError.classList.remove('hidden');
            e.target.setCustomValidity('W niedziele jesteśmy zamknięci.');
        } else {
            dateError.classList.add('hidden');
            e.target.setCustomValidity('');
        }
    });

    // Validate Time (Block outside 08:00 - 18:00)
    timeInput.addEventListener('change', (e) => {
        const time = e.target.value;
        const [hours, minutes] = time.split(':').map(Number);
        
        if (hours < 8 || hours >= 18) {
            timeError.classList.remove('hidden');
            e.target.setCustomValidity('Godziny otwarcia to 08:00 - 18:00.');
        } else {
            timeError.classList.add('hidden');
            e.target.setCustomValidity('');
        }
    });

    // 4. Form Submission Mock
    const bookingForm = document.getElementById('booking-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalContent = document.getElementById('modal-content');

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Check native HTML validation
        if (!bookingForm.checkValidity()) {
            return;
        }

        // Show Modal
        successModal.classList.remove('hidden');
        // Small delay to allow display flex to apply before opacity transition
        setTimeout(() => {
            successModal.classList.remove('opacity-0');
            successModal.classList.add('opacity-100');
            modalContent.classList.remove('scale-95');
            modalContent.classList.add('scale-100');
        }, 10);
        
        // Reset form
        bookingForm.reset();
    });

    function closeModal() {
        successModal.classList.remove('opacity-100');
        successModal.classList.add('opacity-0');
        modalContent.classList.remove('scale-100');
        modalContent.classList.add('scale-95');
        
        setTimeout(() => {
            successModal.classList.add('hidden');
        }, 300);
    }

    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal on outside click
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeModal();
        }
    });
});
