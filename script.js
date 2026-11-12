// Uklanjanje preloadera čim se stranica učita
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
    }
});

// Mobilni meni toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.querySelector('i').classList.toggle('fa-bars');
    hamburger.querySelector('i').classList.toggle('fa-xmark');
});

// Zatvaranje menija klikom na link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.querySelector('i').classList.add('fa-bars');
        hamburger.querySelector('i').classList.remove('fa-xmark');
    });
});

// Aktivni link u navigaciji pri skrolovanju
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a:not(.btn-nav)');

window.addEventListener('scroll', () => {
    let current = 'pocetna';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Scroll Reveal & Animirani brojač (Counter do 150+)
const revealElements = document.querySelectorAll('.reveal');

const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const duration = 1600;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        counter.innerText = Math.floor(easeOut * target);

        if (progress < 1) {
            requestAnimationFrame(updateCount);
        } else {
            counter.innerText = target;
        }
    };

    requestAnimationFrame(updateCount);
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.getAttribute('data-delay') || 0;

            setTimeout(() => {
                el.classList.add('is-visible');

                const counter = el.querySelector('.counter');
                if (counter && !counter.dataset.animated) {
                    counter.dataset.animated = 'true';
                    animateCounter(counter);
                }
            }, delay);

            observer.unobserve(el);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// Forma za zakazivanje (Generisanje WhatsApp poruke)
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const serviceType = document.getElementById('serviceType').value;
        const message = document.getElementById('message').value;

        const phoneNumber = "381606201009";

        const text = `Pozdrav, želim da zakažem termin!\n\n*Ime:* ${name}\n*Telefon:* ${phone}\n*Usluga:* ${serviceType}\n*Napomena:* ${message}`;
        const encodedText = encodeURIComponent(text);

        window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
    });
}