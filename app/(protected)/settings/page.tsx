"use client";
import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SettingsSchema } from "@/form-schema";
import { useCurrentUser } from "@/hooks/use-current-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession, signOut } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FormMessage as CustomFormMessage } from "@/components/form-message";
import * as z from "zod";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { Router } from "next/router";
import { useRouter } from "next/navigation";


export default function SettingsPage() {
    const user = useCurrentUser();
    const { update } = useSession();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || false
        }
    })

    function onSubmit(values: z.infer<typeof SettingsSchema>) {
        startTransition(() => {
            settings(values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    }
                    if (data.success) {
                        setSuccess(data.success);
                        update();
                    }
                })
                .catch((error) => {
                    setError("Something went wrong.");
                });
        })
    }

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Settings
                </p>
            </CardHeader>
            <CardContent>
                <Form
                    {...form}
                >
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="rounded-lg border h-14 text-md"
                                                {...field}
                                                placeholder="John Doe"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isTwoFactorEnabled"
                                render={({ field }) => {
                                    return (
                                        <FormItem
                                            className="flex flex-row items-center justify-between rounded-lg border p-4"
                                        >
                                            <FormLabel
                                                className="text-base"
                                            >
                                                Enable Two Factor Auth
                                            </FormLabel>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )
                                }}
                            />
                        </div>
                        <CustomFormMessage
                            type="error"
                            message={error}
                        />
                        <CustomFormMessage
                            type="success"
                            message={success}
                        />
                        <Button
                            type="submit"
                            disabled={isPending}
                        >
                            Save
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}