import React from "react";
import AuthenticatedLayout from '@/Layouts/authenticated-layout';
import {Head} from '@inertiajs/react';
import { PageProps } from '@/types';
import DashboardArticleForm from "@/Components/dashboard/dashboard-article-form";
import DashboardTagForm from "@/Components/dashboard/dashboard-tag-form";
import DashboardArticlePreview from "@/Components/dashboard/dashboard-article-preview";

export default function Dashboard({ auth }: PageProps) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="my-16 mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-2 gap-8">
                <DashboardArticleForm />
                <DashboardArticlePreview />
                <DashboardTagForm />
            </div>

        </AuthenticatedLayout>
    );
}
