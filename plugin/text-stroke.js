const plugin = require('tailwindcss/plugin');
const { default: withAlphaVariable } = require('tailwindcss/lib/util/withAlphaVariable');
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');

module.exports = plugin(({ matchUtilities, addBase, addComponents, addUtilities, theme }) => {
    addBase({
        '*, ::before, ::after': {
            '-webkit-text-stroke-color': 'currentcolor'
        }
    });

    matchUtilities({
        'text-stroke': value => ({
            '-webkit-text-stroke-width': value
        })
    }, {
        type: 'length',
        values: theme('borderWidth')
    });

    matchUtilities({
        'text-stroke': value => {
            return withAlphaVariable({
                color: value,
                property: '-webkit-text-stroke-color',
                variable: '--tw-text-stroke-opacity'
            });
        }
    }, {
        type: 'color',
        values: (({ DEFAULT: _, ...colors }) => colors)(flattenColorPalette(theme('borderColor')))
    });
});
