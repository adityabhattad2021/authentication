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
import { LoginSchema } from "@/schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormMessage as CustomFormMessage } from "../form-message";
import { useTransition } from "react";

export function LoginForm() {

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    function onSubmit(values:z.infer<typeof LoginSchema>){
        alert(JSON.stringify(values));
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
                                        <FormMessage/>
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field})=>{
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
                                        <FormMessage/>
                                    </FormItem>
                                )
                            }}
                        />
                    </div>
                    <CustomFormMessage
                        type="error"
                    />
                    <CustomFormMessage
                        type="success"
                    />
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        Submit
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}