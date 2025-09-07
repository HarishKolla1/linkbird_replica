"use server";

import { auth } from "@/lib/auth";
import { success } from "zod";

export const signIn =async (email: string, password: string) => {
    try{
        await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        })
        return{
            success: true,
            message: "Signed in successfully"
        }
    } catch (error) {
        const e = error as Error;
        return{
            success: false,
            message:  e.message || "Something went wrong"
        }
    }
}

export const signUp =async (email:string, password:string, username:string) =>{
    try{
        const trimmedEmail=email.trim()
        await auth.api.signUpEmail({
            body: {
                email: trimmedEmail,
                password,
                name: username
            }
        })
    

        return {
            success: true,
            message: "Signed up successfull."
        }
    }
    catch (error){
        console.error("signup error:",error)
        const e= error as Error

        return {
            success: false,
            message: e.message || "An unknown error occurred."
        }
    }
    
}