import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="w-full max-w-md">
                <Card className="rounded-xl">
                    <CardHeader className="px-10 pt-8 pb-0 text-center">
                        <Link
                            href={home()}
                            className="flex justify-center font-medium"
                        >
                            <div className="flex items-center space-x-2">
                                <img
                                    src="/logo-listify.svg"
                                    alt="Listify Logo"
                                    className="size-30 rounded-md object-cover mb-4"
                                />
                            </div>
                        </Link>

                        <CardTitle className="text-xl">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-10 py-8">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
