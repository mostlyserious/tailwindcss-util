export default els => {
    const active = {};

    let top, middle;

    addEventListener('scroll', () => requestAnimationFrame(() => {
        Object.values(active).forEach(el => {
            top = el.getBoundingClientRect().top + pageYOffset;
            middle = top + (el.offsetHeight / 2);

            el.style.setProperty('--parallax-control',
                parseFloat((pageYOffset + (innerHeight / 2) - middle) / (el.offsetHeight + innerHeight)).toFixed(4)
            );
        });
    }));

    Array.from(els).forEach(el => {
        el.dataset.id = random(7);

        isVisible(el, entry => (active[el.dataset.id] = el), {
            threshold: 0
        });

        isVisible(el, entry => (delete active[el.dataset.id]), {
            rootMargin: `${el.offsetHeight + 100}px 0px -100% 0px`,
            threshold: 1
        });

        isVisible(el, entry => (delete active[el.dataset.id]), {
            rootMargin: `-100% 0px ${el.offsetHeight + 100}px 0px`,
            threshold: 1
        });
    });
};

function isVisible(el, handler, args = {}) {
    if (window.IntersectionObserver) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    handler(entry);
                }
            });
        }, args);

        observer.observe(el);
    } else {
        handler(null);
    }
}

function random(length) {
    let result = '',
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}
