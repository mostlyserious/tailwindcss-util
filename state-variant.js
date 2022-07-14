const plugin = require('tailwindcss/plugin');

module.exports = (name, selector = null) => {
    if (!selector) {
        selector = `.is-${name}`;
    }

    return plugin(({ addVariant, e }) => {
        addVariant(`is-${name}`, [ `${selector} &`, `&${selector}` ]);
    });
};
