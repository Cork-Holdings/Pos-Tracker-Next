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
import { Separator } from '@/components/ui/separator'
import { api_endpoints } from '@/utils/api_constants'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { User } from '@/utils/types/User'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const EditUserSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "A valid email is required" }),
    role: z.string().min(1, { message: "Role is required" }),
    // The API stores status as a string; sending a boolean is rejected on bind.
    status: z.enum(["active", "inactive"]),
})


interface EditUserFormProps {
    user: User | null;
    onSuccess?: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onSuccess }) => {

    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()

    const form = useForm<z.infer<typeof EditUserSchema>>({
        resolver: zodResolver(EditUserSchema),
        defaultValues: {
            name: user?.fullname ?? "",
            email: user?.email ?? "",
            role: user?.role ?? "",
            status: user?.status === "inactive" ? "inactive" : "active",
        }
    })

    const onSubmit = async (values: z.infer<typeof EditUserSchema>) => {
        try {
            setLoading(true)
            const body = {
                id: user?.id,
                fullname: values.name,
                email: values.email,
                role: values.role,
                status: values.status,
            }

            const response = await fetch(api_endpoints.editUser, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(body),
            })

            const result = await response.json().catch(() => null)

            if (response.ok && result?.status === 'success') {
                toast.success(result.message ?? "User updated successfully")
                onSuccess?.()
            } else {
                toast.error(result?.error ?? result?.message ?? "Failed to update user information")
            }
        } catch (error) {
            toast.error(`An error occurred. Please try again.\n${error}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="">
            <div className="mb-10">
                <p className="text-2xl font-bold">Edit user information</p>
                <Separator />
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2  gap-5"
                >

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel> Name</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} />
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>

                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>

                                        <SelectItem value="admin">
                                            admin
                                        </SelectItem>

                                    </SelectContent>
                                </Select>

                                <FormDescription>
                                    Select the role of the user
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />



                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Status</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="active" id="active" />
                                            <Label htmlFor="active">Active</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="inactive" id="inactive" />
                                            <Label htmlFor="inactive">Inactive</Label>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormDescription>
                                    Inactive users cannot sign in
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating user...
                            </>
                        ) : (
                            "Update user"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )

}

export default EditUserForm
