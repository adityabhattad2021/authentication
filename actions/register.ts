"use server";

import { RegisterSchema } from "@/schema";
import * as z from "zod";


export async function register(values:z.infer<typeof RegisterSchema>){
    const validateFields = RegisterSchema.safeParse(values);
    
    if(!validateFields.success){
        return {error:"Invalid fields!"}
    }

    return {success:"Check your email for OTP!"}
}