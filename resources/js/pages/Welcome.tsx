import React, { useEffect } from 'react'; // <-- 1. IMPORTE useEffect
import { Head, Link, usePage, router } from '@inertiajs/react'; // <-- 2. IMPORTE router
// import { route } from 'ziggy-js'; // Não precisamos mais importar route diretamente

// --- Função de Rota Segura (A CHAVE) ---
const safeRoute = (name: string, params?: unknown): string => {
    if (typeof window.route === 'function') {
        // @ts-expect-error - Ignora o problema de tipagem complexa do Ziggy
        return window.route(name, params).toString();
    }
    // Fallback para prevenir o crash
    return `/${name}`;
};
// ----------------------------------------

// --- Tipagem de Props ---
interface WelcomeProps {
    canLogin: boolean;
    canRegister: boolean;
}

interface PageSharedProps {
    auth: {
        user: { name: string; } | null;
    };
    [key: string]: unknown;
}


export default function Welcome({ canLogin, canRegister }: WelcomeProps) {
    const { props: { auth } } = usePage<PageSharedProps>();
    const isLoggedIn = !!auth.user;

    // --- 3. LÓGICA DE REDIRECIONAMENTO NO useEffect ---
    useEffect(() => {
        // Se o usuário estiver logado, redireciona para o dashboard
        if (isLoggedIn) {
            // Usamos router.visit() com a rota segura
            router.visit(safeRoute('dashboard'), { replace: true }); 
        }
    }, [isLoggedIn]); // Roda o efeito sempre que o estado de login mudar
    // ----------------------------------------------------

    // Se estiver logado, renderiza "Redirecionando..." enquanto o useEffect faz o trabalho
    if (isLoggedIn) {
        return <Head title="Redirecionando..." />;
    }

    // Se NÃO estiver logado, renderiza a tela de boas-vindas
    return (
        <>
            <Head title="Bem-Vindo" />

            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="w-full max-w-sm bg-white shadow-xl rounded-lg p-8 space-y-6 text-center">

                    {/* Sua Logo e Marca */}
                    <div className="flex flex-col items-center space-y-3">
                        <svg className="h-10 w-10 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            <path d="M9 12l2 2l4-4"></path>
                        </svg>
                        <h1 className="text-2xl font-bold text-gray-800">TO-DO List</h1>
                        <p className="text-sm text-gray-500">Gestão de tarefas simples e moderna.</p>
                    </div>

                    {/* Botões de Ação */}
                    <div className="space-y-3 pt-4">
                        {canLogin && (
                            <Link
                                // Usa a função segura para garantir que 'login' existe
                                href={safeRoute('login')} 
                                className="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white uppercase tracking-widest hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Entrar
                            </Link>
                        )}

                        {canRegister && (
                            <Link
                                // Usa a função segura para garantir que 'register' existe
                                href={safeRoute('register')} 
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md font-semibold text-gray-700 uppercase tracking-widest hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Registrar
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}