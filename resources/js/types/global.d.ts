// Em: resources/js/types/global.d.ts

// Importa os tipos do Ziggy para que possamos referenciá-los
import { route as ziggyRoute, Config, Router } from 'ziggy-js';

// Declara a função global 'route' no objeto 'window'
declare global {
    interface Window {
        // Define o tipo da função route() com base nos tipos do Ziggy
        route: typeof ziggyRoute; 
    }
}

// Declara o tipo da função 'route' para uso em outros arquivos
declare function route(): Router;
declare function route(name: string, params?: Config.ParameterValue | Config.ParameterValue[]): string;
declare function route(name: string, params?: Config.ParameterValue | Config.ParameterValue[], absolute?: boolean): string;

// Adiciona o tipo de configuração do Inertia (se necessário)
declare module '@inertiajs/core' {
    interface PageProps {
        ziggy?: Config & { location: Location };
        errors?: Record<string, string | string[]>;
    }
}