<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- PWA Manifest -->
    <link rel="manifest" href="{{ asset('manifest.json') }}">
    <!-- Fonts -->
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['inertia/app.tsx'])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/service-worker.js') // Make sure this path points to the public directory
                    .then((registration) => {
                        console.log('Service Worker registered with scope: ', registration.scope);
                    })
                    .catch((error) => {
                        console.log('Service Worker registration failed: ', error);
                    });
            });
        }
    </script>
</body>

</html>
