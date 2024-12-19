export default {
    extends: [
        'stylelint-config-standard-scss',
        '@stylistic/stylelint-config',
    ],
    rules: {
        '@stylistic/indentation': 4,
        '@stylistic/max-line-length': null,
        '@stylistic/string-quotes': 'single',
        'shorthand-property-no-redundant-values': null,
    },
};
