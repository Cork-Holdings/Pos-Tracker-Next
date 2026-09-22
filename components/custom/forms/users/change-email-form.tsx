"use client"
import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { api_endpoints } from '@/utils/api_constants'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

const ChangeEmailSchema = z.object({
    old_email: z.string().email({ message: "A valid email is required" }),
    new_email: z.string().email({ message: "A valid email is required" }),
    old_password: z.string().min(1, { message: "Your current password is required" }),
}).refine((values) => values.old_email !== values.new_email, {
    message: "The new email matches your current one",
    path: ["new_email"],
})

interface ChangeEmailFormProps {
    currentEmail?: string;
    onSuccess?: () => void;
}

const ChangeEmailForm: React.FC<ChangeEmailFormProps> = ({ currentEmail, onSuccess }) => {
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()

    const form = useForm<z.infer<typeof ChangeEmailSchema>>({
        resolver: zodResolver(ChangeEmailSchema),
        defaultValues: {
            old_email: currentEmail ?? "",
            new_email: "",
            old_password: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof ChangeEmailSchema>) => {
        try {
            setLoading(true)

            const response = await fetch(api_endpoints.changeEmail, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(values),
            })

            const result = await response.json().catch(() => null)

            if (response.ok && result?.status === 'success') {
                toast.success(result.message ?? "Email updated successfully")
                form.reset()
                onSuccess?.()
            } else {
                toast.error(result?.error ?? "Failed to update your email")
            }
        } catch {
            toast.error("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="old_email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current email</FormLabel>
                            <FormControl>
                                <Input type="email" autoComplete="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="new_email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New email</FormLabel>
                            <FormControl>
                                <Input type="email" autoComplete="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="old_password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current password</FormLabel>
                            <FormControl>
                                <Input type="password" autoComplete="current-password" {...field} />
                            </FormControl>
                            <FormDescription>
                                Confirm your password to change the email on your account
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating email...</>
                    ) : (
                        "Update email"
                    )}
                </Button>
            </form>
        </Form>
    )
}

export default ChangeEmailForm
