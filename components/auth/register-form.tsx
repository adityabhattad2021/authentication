"use client";
import { useState, useTransition } from "react";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RegisterSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "@/actions/register";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { FormMessage as CustomFormMessage } from "../form-message";
import { Button } from "../ui/button";

export function RegisterForm() {

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
        }
    })

    function onSubmit(values: z.infer<typeof RegisterSchema>) {
        setError("");
        setSuccess("");
        startTransition(() => {
            register(values).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        })
    }


    return (
        <CardWrapper
            headerLabel="Create an account."
            backButtonLabel="Already have an account?"
            backButtonHref="/auth/login"
            showSocial
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-10"
                                                {...field}
                                                placeholder="John Doe"
                                                type="name"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
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
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="h-10"
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormMessage />
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
                        className="w-full"
                        disabled={isPending}
                    >
                        Submit
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )

}