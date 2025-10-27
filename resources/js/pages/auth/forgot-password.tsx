import { email } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

// --- IMPORTS DA UI ---
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthCardLayout from '@/layouts/auth/auth-card-layout'; 
// --------------------------------------------------------

export default function ForgotPassword({ status }: { status?: string }) {

    return (
        <AuthCardLayout
            title="Esqueceu sua senha?" 
            description="Sem problemas. Informe seu endereço de e-mail e enviaremos um link para redefinir sua senha, permitindo que você escolha uma nova." 
        >
            <Head title="Esqueceu a Senha" /> 

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <Form action={email()} method="post" disableWhileProcessing className="space-y-6">
                {({ processing, errors }) => (
                    <>
                        <div>
                            <Label htmlFor="email">E-mail</Label> {/* Traduzido */}
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                placeholder="seu@email.com" // Exemplo traduzido
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <Button type="submit" className="w-full" data-test="send-password-reset-link-button">
                            {processing && <Spinner />}
                            Enviar Link de Redefinição
                        </Button> {/* Traduzido */}
                    </>
                )}
            </Form>
        </AuthCardLayout>
    );
}