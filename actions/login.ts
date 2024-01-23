"use server";

import { LoginSchema } from "@/schema";
import * as z from "zod";

export async function login(values:z.infer<typeof LoginSchema>){

    const validateFields = LoginSchema.safeParse(values);

    if(!validateFields.success){
        return {error:"Invalid fields!"}
    }

    return {success:"Check your email for OTP!"}
}