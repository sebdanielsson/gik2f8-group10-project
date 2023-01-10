/** @type {import('tailwindcss').Config} */
const { join } = require("path");
module.exports = {
    darkMode: "class", // 'media' or 'class'
    content: [join(__dirname, "src/**/*.{html,js,ts}")],
    theme: {
        extend: {
            screens: {
                1680: "1680px",
                1920: "1920px",
            },
        },
    },
    plugins: [],
};
