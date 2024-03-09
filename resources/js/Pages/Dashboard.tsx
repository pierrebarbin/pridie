import { Head } from "@inertiajs/react"
import React from "react"

import DashboardArticleForm from "@/Components/dashboard/dashboard-article-form"
import DashboardArticlePreview from "@/Components/dashboard/dashboard-article-preview"
import DashboardTagForm from "@/Components/dashboard/dashboard-tag-form"
import AuthenticatedLayout from "@/Layouts/authenticated-layout"
import { PageProps } from "@/types"

export default function Dashboard({ auth }: PageProps) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="mx-auto my-16 grid max-w-7xl grid-cols-2 gap-8 sm:px-6 lg:px-8">
                <DashboardArticleForm />
                <DashboardArticlePreview />
                <DashboardTagForm />
            </div>
        </AuthenticatedLayout>
    )
}
