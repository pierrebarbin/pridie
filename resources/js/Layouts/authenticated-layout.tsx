import { router } from "@inertiajs/react";
import React, { PropsWithChildren, ReactNode } from "react";

import DarkModePicker from "@/Components/common/dark-mode-picker/dark-mode-picker";
import DarkModePickerPopover from "@/Components/common/dark-mode-picker/dark-mode-picker-popover/dark-mode-picker-popover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/Components/ui/navigation-menu";
import { Toaster } from "@/Components/ui/sonner";
import AppLayout from "@/Layouts/app-layout";
import { User } from "@/types";

export default function Authenticated({
    children,
}: PropsWithChildren<{ user: User; header?: ReactNode }>) {
    return (
        <AppLayout className="min-h-screen">
            <nav>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="border-b border-gray-700">
                        <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-8 w-8"
                                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                        alt="Your Company"
                                    />
                                </div>
                                <div className="hidden md:block">
                                    <NavigationMenu>
                                        <NavigationMenuItem>
                                            <NavigationMenuLink
                                                active={route().current(
                                                    "dashboard",
                                                )}
                                                className={navigationMenuTriggerStyle()}
                                            >
                                                Dashboard
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    </NavigationMenu>
                                </div>
                            </div>
                            <div className="ml-4 flex items-center md:ml-6">
                                <DarkModePickerPopover />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            className="relative ml-4 flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                            id="user-menu-button"
                                            aria-expanded="false"
                                            aria-haspopup="true"
                                        >
                                            <span className="absolute -inset-1.5"></span>
                                            <span className="sr-only">
                                                Open user menu
                                            </span>
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt=""
                                            />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem asChild>
                                            <a href={route("profile.edit")}>
                                                Profile
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    router.post(
                                                        route("logout"),
                                                    );
                                                }}
                                                method="post"
                                            >
                                                <input
                                                    type="submit"
                                                    value="Déconnexion"
                                                />
                                            </form>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>
            <Toaster />
        </AppLayout>
    );
}
