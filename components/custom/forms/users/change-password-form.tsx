"use client"
import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
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

const ChangePasswordSchema = z.object({
    old_password: z.string().min(1, { message: "Your current password is required" }),
    new_password: z.string().min(8, { message: "A minimum of 8 characters is required" }),
    confirm_password: z.string().min(1, { message: "Please confirm your new password" }),
}).refine((values) => values.new_password === values.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
})

interface ChangePasswordFormProps {
    onSuccess?: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()

    const form = useForm<z.infer<typeof ChangePasswordSchema>>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            old_password: "",
            new_password: "",
            confirm_password: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof ChangePasswordSchema>) => {
        try {
            setLoading(true)

            const response = await fetch(api_endpoints.changePassword, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(values),
            })

            const result = await response.json().catch(() => null)

            if (response.ok && result?.status === 'success') {
                toast.success(result.message ?? "Password updated successfully")
                form.reset()
                onSuccess?.()
            } else {
                toast.error(result?.error ?? "Failed to update your password")
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
                    name="old_password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current password</FormLabel>
                            <FormControl>
                                <Input type="password" autoComplete="current-password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New password</FormLabel>
                            <FormControl>
                                <Input type="password" autoComplete="new-password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm new password</FormLabel>
                            <FormControl>
                                <Input type="password" autoComplete="new-password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating password...</>
                    ) : (
                        "Update password"
                    )}
                </Button>
            </form>
        </Form>
    )
}

export default ChangePasswordForm
