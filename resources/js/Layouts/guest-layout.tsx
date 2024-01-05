import { PropsWithChildren } from 'react';
import AppLayout from "@/Layouts/app-layout";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <AppLayout className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
            <main>
                {children}
            </main>
        </AppLayout>
    );
}
