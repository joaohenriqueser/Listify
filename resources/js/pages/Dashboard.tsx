import React, { useState, useEffect, FormEventHandler, ChangeEventHandler, useCallback } from 'react';
import AuthenticatedLayout from '../layouts/auth-layout'; 
import { Head, useForm, router } from '@inertiajs/react';
import axios from 'axios';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import InputError from '../components/input-error'; 


const safeRoute = (name: string, params?: unknown): string => {
    if (typeof window.route === 'function') {
        //@ts-expect-error - Ignora o problema de tipagem complexa do Ziggy
        return window.route(name, params).toString();
    }
    return `/${name}`;
};


// --- TIPAGEM (TypeScript) ---
interface Task {
    id: number;
    title: string;
    description?: string | null;
    deadline: string; // YYYY-MM-DD
    status: 'pending' | 'in_progress' | 'completed';
    user_id: number;
    created_at: string;
    updated_at: string;
}

// Tipagem das props recebidas pelo Inertia
interface PageProps {
    tasks: Task[];
    filters: {
        status?: string;
        deadline?: string;
    };
}

// Tipagem para os dados do clima
interface WeatherData {
    name: string;
    main?: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    weather?: Array<{
        description: string;
        icon: string;
    }>;
}

// Tipagem para os dados do formulário de tarefas
interface TaskFormData {
    title: string;
    description: string;
    deadline: string;
    status: 'pending' | 'in_progress' | 'completed';
}

const today = new Date().toISOString().split('T')[0];

// --- COMPONENTE DO FORMULÁRIO DE EDIÇÃO ---
const EditTaskForm = ({ task, onClose }: { task: Task | null, onClose: () => void }) => {
    const { data, setData, put, processing, errors, reset } = useForm<TaskFormData>({
        title: task?.title ?? '',
        description: task?.description ?? '',
        deadline: task?.deadline ?? '',
        status: task?.status ?? 'pending',
    });

    useEffect(() => {
        if (task && typeof task === 'object') {
            // @ts-expect-error - Inertia's reset function overload typing issue
            reset({
                title: task?.title ?? '',
                description: task?.description ?? '',
                deadline: task?.deadline ?? '',
                status: task?.status ?? 'pending',
            });
        }
    }, [task, reset]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!task) return;
        put(`https://${window.location.host}/tasks/${task.id}`, {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4 pt-4">
            <div>
                <Label htmlFor="edit_title">Título</Label>
                <Input id="edit_title" type="text" className="mt-1 block w-full" value={data.title} onChange={(e) => setData('title', e.target.value)} required autoFocus />
                <InputError message={errors.title} className="mt-2" />
            </div>
            <div>
                <Label htmlFor="edit_description">Descrição</Label>
                <Textarea id="edit_description" className="mt-1 block w-full" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} />
                <InputError message={errors.description} className="mt-2" />
            </div>
            <div>
                <Label htmlFor="edit_deadline">Prazo</Label>
                <Input id="edit_deadline" type="date" className="mt-1 block w-full" value={data.deadline} onChange={(e) => setData('deadline', e.target.value)} required min={today} />
                <InputError message={errors.deadline} className="mt-2" />
            </div>
            <div>
                <Label htmlFor="edit_status">Status</Label>
                <Select
                    value={data.status}
                    // Type assertion corrigida
                    onValueChange={(value) => setData('status', value as 'pending' | 'in_progress' | 'completed')}
                    required
                >
                    <SelectTrigger className="mt-1 block w-full">
                        <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="in_progress">Em Andamento</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.status} className="mt-2" />
            </div>
            <DialogFooter className="mt-6 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </DialogFooter>
        </form>
    );
};

// --- COMPONENTE DO WIDGET DE CLIMA ---
const WeatherWidget = () => {
    const [cityInput, setCityInput] = useState('Birigui');
    const [cityToFetch, setCityToFetch] = useState('Birigui');
    const [weather, setWeather] = useState<WeatherData | null>(null); // Tipado
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const diaDaSemana = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
    const diaFormatado = diaDaSemana.charAt(0).toUpperCase() + diaDaSemana.slice(1);

    const fetchWeather = useCallback(async (cityName: string) => {
        if (!cityName) { setError('Por favor, digite uma cidade.'); setLoading(false); return; }
        setLoading(true); setError(''); setWeather(null);
        try {
            const response = await axios.post(`https://${window.location.host}/weather`, { city: cityName });
            setWeather(response.data as WeatherData);
        } catch (err: unknown) { 
            let errorMessage = 'Erro ao buscar clima.';
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err instanceof Error) { errorMessage = err.message; }
            setError(errorMessage); console.error(err);
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchWeather(cityToFetch); }, [cityToFetch, fetchWeather]);

    const handleSearch: FormEventHandler = (e) => { e.preventDefault(); setCityToFetch(cityInput); };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Previsão do Tempo</h3>
                <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
                    <Input type="text" value={cityInput} onChange={(e) => setCityInput(e.target.value)} placeholder="Digite a cidade" className="flex-grow" aria-label="Cidade para previsão do tempo"/>
                    <Button type="submit" disabled={loading || !cityInput}>{loading && cityInput === cityToFetch ? 'Buscando...' : 'Buscar'}</Button>
                </form>
                {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                {loading && !weather && <p className="text-sm text-gray-500 animate-pulse">Carregando previsão...</p>}
                {weather && (
                    <div className="space-y-1">
                        <p className="text-lg font-semibold text-gray-800">{diaFormatado}</p>
                        <p className="font-semibold text-gray-800">{weather.name}: {Math.round(weather.main?.temp ?? 0)}°C</p>
                        <p className="text-sm text-gray-600 capitalize">{weather.weather?.[0]?.description ?? 'N/A'}</p>
                        <p className="text-xs text-gray-500">Sensação: {Math.round(weather.main?.feels_like ?? 0)}°C | Umidade: {weather.main?.humidity ?? 0}%</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL DO DASHBOARD ---
export default function Dashboard({ tasks = [], filters = {} }: PageProps) {

    const createForm = useForm<TaskFormData>({ title: '', description: '', deadline: '', status: 'pending' });
    const submitCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post(`https://${window.location.host}/tasks`, { preserveScroll: true, onSuccess: () => createForm.reset() });
    };

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const openEditDialog = (task: Task) => { setTaskToEdit(task); setIsEditDialogOpen(true); };
    const closeEditDialog = () => { setIsEditDialogOpen(false); setTimeout(() => setTaskToEdit(null), 150); };

    const handleDelete = (task: Task) => {
        if (confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
            router.delete(`https://${window.location.host}/tasks/${task.id}`, { preserveScroll: true });
        }
    };

    const handleMarkAsCompleted = (task: Task) => {
        router.patch(`https://${window.location.host}/tasks/${task.id}`, {
            status: 'completed',
        }, {
            preserveScroll: true, // Mantém a posição da tela
        });
    };
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [filterDeadline, setFilterDeadline] = useState(filters.deadline || '');
    const [deadlineFilterActive, setDeadlineFilterActive] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            const currentFilters: { status: string, deadline?: string } = {
                status: filterStatus
            };
            // Só adiciona o 'deadline' ao filtro se o botão estiver ativo E houver uma data
            if (deadlineFilterActive && filterDeadline) {
                currentFilters.deadline = filterDeadline;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const activeFilters = Object.fromEntries(Object.entries(currentFilters).filter(([_, v]) => v != null && v !== '' && v !== 'all'));
            router.get(safeRoute('dashboard'), activeFilters, { preserveState: true, replace: true, preserveScroll: true });
        }, 300);
        return () => clearTimeout(handler);
    }, [filterStatus, filterDeadline, deadlineFilterActive]);

    const handleStatusFilterChange = (value: string) => { setFilterStatus(value === 'all' ? '' : value); };
    const handleDeadlineFilterChange: ChangeEventHandler<HTMLInputElement> = (e) => { setFilterDeadline(e.target.value); };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <h2 className="font-semibold text-2xl text-gray-800 leading-tight mb-6 px-1 sm:px-0">
                        Minhas Tarefas
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Coluna Esquerda */}
                        <div className="lg:col-span-1 space-y-6">
                            <WeatherWidget />

                            {/* Card de Criação */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Criar Nova Tarefa</h3>
                                    <form onSubmit={submitCreate} className="space-y-4">
                                        <div>
                                            <Label htmlFor="title">Título</Label>
                                            <Input id="title" type="text" value={createForm.data.title} onChange={e => createForm.setData('title', e.target.value)} required className="mt-1 block w-full"/>
                                            <InputError message={createForm.errors.title} className="mt-2" />
                                        </div>
                                        <div>
                                            <Label htmlFor="description">Descrição</Label>
                                            <Textarea id="description" value={createForm.data.description} onChange={e => createForm.setData('description', e.target.value)} rows={3} className="mt-1 block w-full"/>
                                            <InputError message={createForm.errors.description} className="mt-2" />
                                        </div>
                                        <div>
                                            <Label htmlFor="deadline">Prazo</Label>
                                            <Input id="deadline" type="date" value={createForm.data.deadline} onChange={e => createForm.setData('deadline', e.target.value)} required className="mt-1 block w-full" min={today}/>
                                            <InputError message={createForm.errors.deadline} className="mt-2" />
                                        </div>
                                        <div>
                                            <Label htmlFor="status">Status</Label>
                                            <Select
                                                value={createForm.data.status}
                                                // Type assertion corrigida
                                                onValueChange={(value) => createForm.setData('status', value as 'pending' | 'in_progress' | 'completed')}
                                                required
                                            >
                                                <SelectTrigger className="mt-1 block w-full"><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pendente</SelectItem>
                                                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={createForm.errors.status} className="mt-2" />
                                        </div>
                                        <div className="flex items-center pt-2">
                                            <Button type="submit" disabled={createForm.processing}>
                                                {createForm.processing ? 'Salvando...' : 'Salvar Tarefa'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Coluna Direita */}
                        <div className="lg:col-span-2 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Sua Lista</h3>
                    
                            {/* Filtros */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b">
                                <div>
                                    <Label htmlFor="filter_status">Filtrar por Status</Label>
                                    <Select value={filterStatus} onValueChange={handleStatusFilterChange}>
                                        <SelectTrigger id="filter_status" className="mt-1 block w-full">
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            <SelectItem value="pending">Pendente</SelectItem>
                                            <SelectItem value="in_progress">Em Andamento</SelectItem>
                                            <SelectItem value="completed">Concluída</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                    
                                <div>
                                    {/* --- Botão de Ativar/Desativar --- */}
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="filter_deadline">Filtrar por Prazo</Label>
                                        <Button 
                                            variant={deadlineFilterActive ? "secondary" : "ghost"} 
                                            size="sm"
                                            type="button"
                                            onClick={() => setDeadlineFilterActive(!deadlineFilterActive)}
                                            className="h-7 text-xs"
                                        >
                                            {deadlineFilterActive ? "Desativar" : "Ativar"}
                                        </Button>
                                    </div>
                    
                                    <Input 
                                        id="filter_deadline" 
                                        name="deadline" 
                                        type="date" 
                                        value={filterDeadline} 
                                        onChange={handleDeadlineFilterChange} 
                                        className="mt-1 block w-full"
                                        disabled={!deadlineFilterActive}
                                    />
                                </div>
                            </div>
                    
                            {/* Lista */}
                            <div className="space-y-4">
                                {tasks.length === 0 ? (
                                    <p className="text-gray-500 py-4 text-center">
                                        Nenhuma tarefa encontrada {filterStatus || filterDeadline ? 'para os filtros selecionados' : ''}.
                                    </p>
                                ) : (
                                    tasks.map((task: Task) => (
                                        <div 
                                            key={task.id} 
                                            className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-start hover:shadow-md transition-shadow duration-150"
                                        >
                                            <div className="flex-grow mb-3 sm:mb-0 sm:mr-4">
                                                <h4 className="font-semibold text-lg text-gray-800">{task.title}</h4>
                                                {task.description && (
                                                    <p className="text-sm text-gray-600 break-words mt-1">{task.description}</p>
                                                )}
                    
                                                {/* --- Lógica condicional para o prazo --- */}
                                                {task.status === 'completed' ? (
                                                    <span className="text-xs text-green-600 font-medium block mt-1">
                                                        Concluído em: {new Date(task.updated_at).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-500 block mt-1">
                                                        Prazo: {new Date(task.deadline).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                                    </span>
                                                )}
                                            </div>
                    
                                            <div className="flex items-center space-x-2 flex-shrink-0 mt-2 sm:mt-0 self-start sm:self-center">
                                                <span
                                                    className={`inline-block px-2 py-1 leading-none rounded-full text-white text-xs font-semibold ${
                                                        task.status === 'pending'
                                                            ? 'bg-yellow-500'
                                                            : task.status === 'in_progress'
                                                            ? 'bg-blue-500'
                                                            : 'bg-green-500'
                                                    }`}
                                                >
                                                    {task.status === 'pending'
                                                        ? 'Pendente'
                                                        : task.status === 'in_progress'
                                                        ? 'Em Andamento'
                                                        : 'Concluída'}
                                                </span>
                    
                                                {task.status !== 'completed' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                        onClick={() => handleMarkAsCompleted(task)}
                                                    >
                                                        Concluir
                                                    </Button>
                                                )}
                    
                                                <Dialog open={isEditDialogOpen && taskToEdit?.id === task.id} onOpenChange={setIsEditDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" onClick={() => openEditDialog(task)}>
                                                            Editar
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[625px]">
                                                        <DialogHeader>
                                                            <DialogTitle>Editar Tarefa</DialogTitle>
                                                            <DialogDescription>
                                                                Ajuste os detalhes da sua tarefa. Clique em "Salvar Alterações" quando terminar.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        {taskToEdit?.id === task.id && (
                                                            <EditTaskForm task={taskToEdit} onClose={closeEditDialog} />
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                    
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm" 
                                                    onClick={() => handleDelete(task)}
                                                >
                                                    Excluir
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    
                   {/* DIALOG DE EDIÇÃO GLOBAL */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                                <DialogTitle>Editar Tarefa</DialogTitle>
                            </DialogHeader>
                            {taskToEdit && <EditTaskForm task={taskToEdit} onClose={closeEditDialog} />}
                        </DialogContent>
                    </Dialog>
                </div> 
            </div> 
        </div>
        </AuthenticatedLayout> 
    );
}
