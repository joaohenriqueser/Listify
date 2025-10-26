// Em: resources/js/layouts/auth-layout.tsx

import React, { useState, PropsWithChildren, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

// Imports dos seus componentes UI (verifique/ajuste os caminhos/nomes se necessário)
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
// Importe outros componentes de link se o seu layout os usar

// --- DEFINIÇÃO DOS TIPOS (COM ASSINATURA DE ÍNDICE) ---
interface PageSharedProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    ziggy: object;
    errors: object;
    // --- ADICIONE ESTA LINHA ---
    // Permite que o objeto props tenha quaisquer outras propriedades
    [key: string]: unknown; 
    // -------------------------
}

// Descreve as props que este componente de layout aceita
interface AuthenticatedLayoutProps extends PropsWithChildren {
    header?: ReactNode;
    title?: string;
    description?: string;
}
// ----------------------------

export default function AuthenticatedLayout({ header, children}: AuthenticatedLayoutProps) {
    // --- USA usePage COM TIPAGEM CORRETA ---
    const { props } = usePage<PageSharedProps>();
    const auth = props.auth; // Acessa 'auth' de forma segura
    // -------------------------------------

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900"> {/* Fundo claro por padrão */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                {/* Container Principal da Navbar */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="shrink-0 flex items-center">
                                <Link href={route('dashboard')}>
                                    <span className="sr-only">Dashboard</span>
                                </Link>
                            </div>
                            {/* Links de Navegação Principais (Desktop) */}
                            {/* <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex"> ... </div> */}
                        </div>

                        {/* Menu Dropdown do Usuário (Desktop) */}
                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                            {auth.user.name}
                                            <svg className="ms-2 -me-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-48" align="end">
                                        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                             <Link href={route('profile.edit')}>Perfil</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href={route('logout')} method="post" as="button" className="w-full text-left">
                                                Sair
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Botão Hambúrguer (Mobile) */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <Button
                                variant="ghost" size="icon"
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                                <span className="sr-only">Abrir menu principal</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Menu Navegação Responsivo (Mobile) */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden border-t border-gray-200 dark:border-gray-600`}>
                    <div className="pt-2 pb-3 space-y-1">
                        {/* Adicione links mobile aqui */}
                    </div>
                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800 dark:text-gray-200">{auth.user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{auth.user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                             <Link href={route('profile.edit')} className="block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-800 dark:focus:text-gray-200 focus:bg-gray-50 dark:focus:bg-gray-700 focus:border-gray-300 dark:focus:border-gray-600 transition duration-150 ease-in-out">
                                Perfil
                            </Link>
                            <Link href={route('logout')} method="post" as="button" className="block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-800 dark:focus:text-gray-200 focus:bg-gray-50 dark:focus:bg-gray-700 focus:border-gray-300 dark:focus:border-gray-600 transition duration-150 ease-in-out">
                                Sair
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Cabeçalho da Página */}
            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* Conteúdo Principal */}
            <main>{children}</main>
        </div>
    );
}