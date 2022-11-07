export default els => {
    const active = {};
    const scopes = {};

    let interval,
        done = false;

    Array.from(els).forEach(el => {
        el.dataset.pxid = random(7);

        if (el.dataset.parallax.length) {
            scopes[el.dataset.parallax] = document.querySelector(el.dataset.parallax);
        }

        isVisible(el, entry => (active[el.dataset.pxid] = el), {
            threshold: 0
        });

        isVisible(el, entry => (delete active[el.dataset.pxid]), {
            rootMargin: `${el.offsetHeight + 100}px 0px -100% 0px`,
            threshold: 1
        });

        isVisible(el, entry => (delete active[el.dataset.pxid]), {
            rootMargin: `-100% 0px ${el.offsetHeight + 100}px 0px`,
            threshold: 1
        });
    });

    listen(null, active);
    Object.keys(scopes).forEach(key => listen(scopes[key], active));

    interval = setInterval(() => {
        if (!done) {
            return Object.values(active).forEach(el => {
                if (!el.style.getPropertyValue('--parallax-control')) {
                    updateParallaxControl(el, scopes[el.dataset.parallax]
                        ? scopes[el.dataset.parallax]
                        : window.pageYOffset);

                    return;
                }

                done = true;
            });
        }

        clearInterval(interval);
    }, 50);
};

function listen(scope, active) {
    (scope || window).addEventListener('scroll', () => requestAnimationFrame(() => {
        Object.values(active).forEach(el => {
            if (scope && el.dataset.parallax.length) {
                updateParallaxControl(el, scope.scrollTop);
            } else if (!scope && !el.dataset.parallax.length) {
                updateParallaxControl(el, window.pageYOffset);
            }
        });
    }));
}

function updateParallaxControl(el, scroll) {
    el.style.setProperty('--parallax-control',
        parseFloat((scroll + (innerHeight / 2) - (el.getBoundingClientRect().top + scroll + (el.offsetHeight / 2))) / (el.offsetHeight + innerHeight)).toFixed(4)
    );
}

function isVisible(el, handler, args = {}) {
    if (window.IntersectionObserver) {
        new IntersectionObserver(entries => {
            entries.forEach(entry => entry.isIntersecting && handler(entry));
        }, args).observe(el);
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
