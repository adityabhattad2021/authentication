"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { ResetPasswordSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { reset } from "@/actions/reset-password";
import { CardWrapper } from "./card-wrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { FormMessage as CustomFormMessage } from "../form-message";
import { Button } from "../ui/button";

export function ResetForm() {

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: "",
        }
    })

    function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
        setError("");
        setSuccess("");
        startTransition(() => {
            reset(values).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        })
    }



    return (
        <CardWrapper
            headerLabel="Forget your password?"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-10"
                                                {...field}
                                                placeholder="johndoe@gmail.com"
                                                type="email"
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
                            Send reset email
                        </Button>
                    </div>
                </form>
            </Form>
        </CardWrapper>
    )
}