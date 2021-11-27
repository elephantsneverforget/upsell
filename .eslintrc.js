module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 13,
        "sourceType": "module"
    },
    "rules": {
        'semi': ['error', 'always'],
        'indent': ['error', 4],
        'max-len': ['error', 80]
    }
};
