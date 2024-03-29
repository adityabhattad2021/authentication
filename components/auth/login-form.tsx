"use client";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import * as z from "zod";
import { LoginSchema } from "@/form-schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormMessage as CustomFormMessage } from "../form-message";
import { useState, useTransition } from "react";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export function LoginForm() {

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email Already in use with different provider" : ""
    const [isPending, startTransition] = useTransition();
    const [showTwofactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: "",
        }
    });

    function onSubmit(values: z.infer<typeof LoginSchema>) {
        setError("");
        setSuccess("");
        startTransition(() => {
            login(values, callbackUrl).then((data) => {
                if (data.error) {
                    form.reset();
                    setError(data?.error || urlError);
                }
                else if (data.twoFactorTokenSent) {
                    setShowTwoFactor(true);
                }
                else if (data.success) {
                    form.reset();
                    setSuccess(data?.success)
                }
            }).catch((error) => {
                setError("Something went wrong!");
                console.log('[LOGIN_FORM]: ', error);
            });
        })
    }

    return (
        <CardWrapper
            headerLabel="Welcome Back!"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        {
                            !showTwofactor ? (
                                <>
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
                                                    <Button
                                                        size={"sm"}
                                                        variant={"link"}
                                                        asChild
                                                        className="px-1 font-normal"
                                                    >
                                                        <Link
                                                            href="/auth/reset-password"
                                                        >
                                                            Forgot Password?
                                                        </Link>
                                                    </Button>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                </>
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Enter the OTP</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="h-12"
                                                        {...field}
                                                        placeholder="123456"
                                                        type="text"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )
                                    }}
                                />
                            )
                        }
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
                        {showTwofactor ? 'Confirm' : 'Login'}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}