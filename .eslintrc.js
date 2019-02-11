module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "eqeqeq": "error",
        "new-cap": [
            "error", { "newIsCapExceptions": ["mongoose.model"] }
        ],
        "no-console": 0,
        "no-underscore-dangle": 0,
        "no-param-reassign": [
            "error", { "ignorePropertyModificationsFor": ["*Modified"] }
        ],
        "no-unused-vars": [
            "error", { "argsIgnorePattern": "^_$" }
        ],
        "semi": 0
    }
};
