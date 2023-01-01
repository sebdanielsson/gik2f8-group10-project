/** @type {import('tailwindcss').Config} */
const { join } = require("path");
module.exports = {
    darkMode: "class", // 'media' or 'class'
    content: [join(__dirname, "src/**/*.{html,js,ts}")],
    theme: {
        extend: {},
    },
    plugins: [],
};
