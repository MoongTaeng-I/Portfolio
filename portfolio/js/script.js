document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 새로운 HUD 인트로 로더 기능 ---
    const introLoader = document.getElementById('intro-loader');
    const mainContent = document.getElementById('main-content');
    const progressBar = document.getElementById('progress-bar');

    if (introLoader && mainContent && progressBar) {
        // 2초 후 로딩 바 애니메이션 시작
        setTimeout(() => {
            progressBar.style.width = '100%';

            // 로딩 바가 완료되고 2.5초 후 메인 콘텐츠 표시
            setTimeout(() => {
                introLoader.style.opacity = '0';
                introLoader.style.visibility = 'hidden';

                mainContent.style.visibility = 'visible';
                mainContent.style.opacity = '1';

                // 메인 콘텐츠가 나타난 후, 스크롤 위치에 따른 메뉴 활성화 함수를 한번 더 호출하여 정확한 상태 반영
                if (typeof updateActiveNav === 'function') {
                    updateActiveNav();
                }

            }, 2500); // 인트로 마지막 텍스트가 표시된 후 사라지기까지의 시간
        }, 2000); // 로딩 바가 채워지는 시간
    }

    // --- 2. 기존 script.js 기능 통합 (사용자님의 코드를 기반으로 수정) ---

    // Navigation Bar Scroll Effect
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (!navbar) return;
        if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
            navbar.style.top = `-${navbar.offsetHeight}px`;
        } else {
            navbar.style.top = '0';
        }
        navbar.classList.toggle('scrolled', scrollTop > 50);
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });

    // Particles.js Initialization
    if (document.getElementById('particles-js')) {
        const particleColor = getComputedStyle(document.documentElement).getPropertyValue('--hero-particle-color').trim() || '#00A9FF';
        particlesJS('particles-js', {
            "particles": { "number": { "value": 70, "density": { "enable": true, "value_area": 800 } }, "color": { "value": particleColor }, "shape": { "type": "circle" }, "opacity": { "value": 0.5, "random": true }, "size": { "value": 3, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": particleColor, "opacity": 0.4, "width": 2 }, "move": { "enable": true, "speed": 2, "direction": "none", "random": true, "straight": false, "out_mode": "out" } },
            "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": false } }, "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } } } },
            "retina_detect": true
        });
    }

    // Section Scroll Reveal
    const sections = document.querySelectorAll('section.section-padding');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(section => sectionObserver.observe(section));

    // Active Navigation Link on Scroll
    const navLinks = document.querySelectorAll('#navbar ul li a');
    const updateActiveNav = () => {
        const navHeight = navbar ? navbar.offsetHeight : 70;
        let currentSectionId = 'hero';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - navHeight - 50) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').substring(1) === currentSectionId);
        });
    };
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // Skills & Tools Carousel (사용자님의 JS 동적 생성 방식 유지)
    const toolCarouselTrack = document.querySelector('.tool-logos-track');
    if (toolCarouselTrack && toolCarouselTrack.children.length > 0) {
        const logos = Array.from(toolCarouselTrack.children);
        logos.forEach(logo => toolCarouselTrack.appendChild(logo.cloneNode(true)));

        const logoWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--logo-width')) || 70;
        const logoSpacing = logoWidth * 1.5; 
        const totalWidth = Array.from(toolCarouselTrack.children).reduce((acc, logo) => acc + logo.offsetWidth + logoSpacing, 0) / 2;
        const animationDuration = logos.length * 5;
        
        const styleSheet = document.createElement('style');
        styleSheet.innerText = `
            .tool-logos-track { display: flex; width: ${totalWidth * 2}px; animation: scrollLogos ${animationDuration}s linear infinite; }
            @keyframes scrollLogos { 0% { transform: translateX(0); } 100% { transform: translateX(-${totalWidth}px); } }
        `;
        document.head.appendChild(styleSheet);
        
        const carousel = document.querySelector('.tool-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => toolCarouselTrack.style.animationPlayState = 'paused');
            carousel.addEventListener('mouseleave', () => toolCarouselTrack.style.animationPlayState = 'running');
        }
    }

    // Work Experience Tabs
    const tabContainer = document.querySelector('.work-tabs');
    const workItems = document.querySelectorAll('.work-item');
    if (tabContainer && workItems.length > 0) {
        const filterWorkItems = (category) => {
            workItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                const shouldShow = itemCategory === category;
                item.style.display = shouldShow ? 'flex' : 'none'; // 'flex'로 변경
            });
        };

        tabContainer.addEventListener('click', (e) => {
            if (e.target.matches('.work-tab-button')) {
                tabContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                const category = e.target.getAttribute('data-category');
                filterWorkItems(category);
            }
        });
        
        const initialActiveTab = tabContainer.querySelector('.work-tab-button.active');
        if (initialActiveTab) {
            filterWorkItems(initialActiveTab.getAttribute('data-category'));
        }
    }

    // Modal Functionality
    const modalTriggerButtons = document.querySelectorAll('.work-item-details-button');
    const allModals = document.querySelectorAll('.modal');
    modalTriggerButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = button.getAttribute('data-modal-target');
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    allModals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target.matches('.modal') || e.target.matches('.close-button')) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Footer Current Year
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    // Cursor Glow Effect
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        });
        document.body.addEventListener('mouseleave', () => cursorGlow.style.opacity = '0');
        document.body.addEventListener('mouseenter', () => cursorGlow.style.opacity = '1');
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none';
    }
});