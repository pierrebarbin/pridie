import { Button } from "@/Components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, usePage } from "@inertiajs/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: "Votre nom est requis",
        })
        .max(255, "Navré mais votre nom est trop long"),
    email: z
        .string()
        .email(),
})

export default function ProfilePersonalInfoForm() {
    const [loading, setLoading] = useState(false)

    const { auth: {user} } = usePage<{ auth: {user: User} }>().props

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name,
            email: user.email
        },
    })

    const update = (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        router.patch(route("profile.update"), values, {
            preserveState: true,
            onSuccess: () => {
                toast.success("Vos informations ont été correctement modifié")
                form.reset(values)
            },
            onError: () => {
                toast.error("Une erreur est survenue, veuillez contacter un administrateur")
            },
            onFinish: () => {
                setLoading(false)
            }
        })
    }

    const cannotSubmit = loading || !form.formState.isDirty

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(update)}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Nom..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Adresse mail</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Adresse mail..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className={clsx(cannotSubmit && "cursor-not-allowed")}
                    disabled={cannotSubmit}
                >
                    {loading ? (
                        <>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            Modifier mes informations
                        </>
                    ) : (
                        "Modifier mes informations"
                    )}
                </Button>
            </form>
        </Form>
    )
}