let mix = require('laravel-mix');
let tailwindcss = require('tailwindcss');

mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'css')
    .options({
        postCss: [ tailwindcss('./tailwind.config.js') ],
    })
    .version()
    .setPublicPath('public');