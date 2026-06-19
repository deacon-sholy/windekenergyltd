/* ==========================================================================
   WINDEK ENERGY LANDING PAGE LOGIC
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // --- Header Scroll Effect ---
    const header = document.querySelector('.header');
    const darkSections = document.querySelectorAll('.bg-dark, .investment, .challenges');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Add dark-section class when scrolled over dark background sections
        let isOverDark = false;
        const scrollPos = window.scrollY + 100;
        darkSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = window.scrollY + rect.top;
            const sectionBottom = sectionTop + rect.height;
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                isOverDark = true;
            }
        });
        
        if (isOverDark && window.scrollY > 50) {
            header.classList.add('dark-section');
        } else {
            header.classList.remove('dark-section');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initially in case page is refreshed partway down.
    // --- Mobile Navigation Menu ---
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileMenu = document.querySelector('.mobile-nav');
    
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Morph hamburger menu into an X
        const spans = mobileToggle.querySelectorAll('span');
        if (mobileToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    // Close mobile nav when clicking a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    // --- Stats Counter Animation ---
    const metricCards = document.querySelectorAll('.metric-card');
    
    const animateCounter = (card) => {
        const valueElement = card.querySelector('.metric-value');
        const targetVal = parseFloat(card.getAttribute('data-target'));
        const prefix = card.getAttribute('data-prefix') || '';
        const suffix = card.getAttribute('data-suffix') || '';
        
        let currentVal = 0;
        const duration = 2000; // 2 seconds
        const stepTime = 30; // ms between updates
        const steps = duration / stepTime;
        const increment = targetVal / steps;
        
        const timer = setInterval(() => {
            currentVal += increment;
            if (currentVal >= targetVal) {
                clearInterval(timer);
                valueElement.innerText = prefix + targetVal + suffix;
            } else {
                // If it is integer, format as whole number, else format to 1 decimal place
                if (targetVal % 1 === 0) {
                    valueElement.innerText = prefix + Math.floor(currentVal) + suffix;
                } else {
                    valueElement.innerText = prefix + currentVal.toFixed(1) + suffix;
                }
            }
        }, stepTime);
    };
    // Use IntersectionObserver to animate counters when in view
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };
    let animated = false;
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                metricCards.forEach(card => animateCounter(card));
                animated = true;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    const metricsSection = document.querySelector('.metrics-dashboard');
    if (metricsSection) {
        observer.observe(metricsSection);
    }
    // --- Solutions Matrix Tabs ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active classes
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active classes to targets
            btn.classList.add('active');
            const activePanel = document.getElementById(targetTab);
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });
    // --- Interactive Timeline ---
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length > 0) {
        timelineItems.forEach(item => {
            item.addEventListener('click', () => {
                timelineItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
        // Auto-advance timeline on interval unless clicked (optional refinement)
        let timelineInterval;
        let currentTimelineIdx = 0;
        
        const startTimelineAutoPlay = () => {
            timelineInterval = setInterval(() => {
                currentTimelineIdx = (currentTimelineIdx + 1) % timelineItems.length;
                timelineItems.forEach(i => i.classList.remove('active'));
                timelineItems[currentTimelineIdx].classList.add('active');
            }, 5000); // cycle every 5 seconds
        };
        const stopTimelineAutoPlay = () => {
            clearInterval(timelineInterval);
        };
        // Start auto-play
        startTimelineAutoPlay();
        // Pause auto-play when user manually clicks an item
        timelineItems.forEach(item => {
            item.addEventListener('mousedown', () => {
                stopTimelineAutoPlay();
                currentTimelineIdx = parseInt(item.getAttribute('data-index'));
            });
        });
    }
    // --- Interactive Returns Calculator ---
    const rangeInput = document.getElementById('invest-range');
    const valDisplay = document.getElementById('invest-val');
    
    const equityOutput = document.getElementById('calc-equity');
    const irrOutput = document.getElementById('calc-irr');
    const paybackOutput = document.getElementById('calc-payback');
    const ebitdaOutput = document.getElementById('calc-ebitda');
    const updateCalculator = () => {
        const val = parseFloat(rangeInput.value);
        valDisplay.innerText = `$${val.toFixed(1)}M`;
        
        // Calculate equity share based on valuation of $300M
        // Equity % = (Investment / Valuation) * 100
        const equityPct = (val / 300) * 100;
        
        // Format decimal places based on size
        if (equityPct >= 10) {
            equityOutput.innerText = `${equityPct.toFixed(1)}%`;
        } else {
            equityOutput.innerText = `${equityPct.toFixed(2)}%`;
        }
        
        // Update projected EBITDA or yield estimation indicator if needed
        // Here we can simulate yield returns
        // Est. Annual Cash Yield = Investment * 32% (IRR)
        // EBITDA output is fixed at 27% (average)
        // Payback is fixed at 8 years
        // But we can dynamically calculate estimated annual EBITDA returns:
        // Annual Sales projection is $150M regional sales + domestic.
        // Assuming steady EBITDA returns, let's keep the main KPIs aligned with slide data.
    };
    if (rangeInput) {
        rangeInput.addEventListener('input', updateCalculator);
        updateCalculator(); // Run once to initialize
    }
    // --- Contact Form Submission ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple mockup of successful form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            submitBtn.innerText = 'Submitting...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerText = 'Inquiry Received Successfully!';
                submitBtn.style.backgroundColor = '#2EC4B6'; // teal success color
                submitBtn.style.borderColor = '#2EC4B6';
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.style.backgroundColor = ''; // restore style
                    submitBtn.style.borderColor = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1200);
        });
    }
});

