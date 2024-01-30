"use client";

import { NewPasswordSchema } from "@/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CardWrapper } from "./card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { FormMessage as CustomFormMessage } from "../form-message";
import { Button } from "../ui/button";
import { setNewPassword } from "@/actions/new-password";
import { useSearchParams } from "next/navigation";

export function NewPasswordForm() {

    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: ""
        }
    });

    function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
        setError("");
        setSuccess("");
        startTransition(() => {
            if (!token) {
                return;
            }
            setNewPassword(values, token).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        })
    }

    return (
        <CardWrapper
            headerLabel="Reset your password."
            backButtonLabel="Login"
            backButtonHref="/auth/login"
        >
            <Form  {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            New Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-10"
                                                {...field}
                                                placeholder="*******"
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
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
                            className="w-full"
                            disabled={isPending}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </CardWrapper>
    )
}