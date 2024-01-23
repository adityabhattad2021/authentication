"use server";

import { LoginSchema } from "@/schema";
import * as z from "zod";

export function login(values:z.infer<typeof LoginSchema>){

}