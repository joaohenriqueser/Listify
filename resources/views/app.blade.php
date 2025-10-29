<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"> 
    <head>
    <title inertia>Listify</title>

    <link rel="icon" href="{{ asset('logo-listify.svg') }}" type="image/svg+xml">

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
    <body class="font-sans antialiased bg-gray-100 text-gray-900"> 
        @inertia 
    </body>
</html>
