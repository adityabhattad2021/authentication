"use server";

import { RegisterSchema } from "@/schema";
import * as z from "zod";
import * as bcrypt from "bcrypt";
import { db } from "@/lib/db";


export async function register(values:z.infer<typeof RegisterSchema>){
    const validateFields = RegisterSchema.safeParse(values);
    
    if(!validateFields.success){
        return {error:"Invalid fields!"}
    }

    const { email, password, name} = validateFields.data;
    const hashedPassword = await bcrypt.hash(password,10);

    const existingUser = await db.user.findUnique({
        where:{
            email,
        }
    })

    if(existingUser){
        return {error:"This email is already taken"};
    }

    // TODO: Verify the user email first.

    await db.user.create({
        data:{
            name,
            email,
            password:hashedPassword
        }
    });

    return {success:"User created successfully!"}
}