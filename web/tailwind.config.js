module.exports = {
    content: ["./src/views/**/*.ejs"],
    theme: {
        extend: {
            animation: {
                'spin-slow': 'spin 3s linear infinite',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}