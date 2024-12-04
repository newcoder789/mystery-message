"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { useDebounceValue } from 'usehooks-ts'

import Link from "next/link";

import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { signInSchema } from "@/schemas/signInSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Result } from "postcss";

const page = () => {
  // const [isSubmitting, setIsSubmitting] = useState(false)

  const {toast} = useToast()
  const router = useRouter()      

  // zod implementation 
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:'',
      password: '',
    }
  })
  const onSubmit = async (data: z.infer<typeof signInSchema>)=>{
    const response = await signIn('credentials',{
      redirect:false,
      identifier:data.identifier,
      password:data.password  
    } )
    console.log(response)// for educational purposes
    if(response?.error){
      if(response.error === "CredentialsSignin"){
        toast({
          title:"Login Failed",
          description:"Incorrect username or password",
          variant:"destructive"
        })
      }else{
        toast({
          title:"Login Failed",
          description:response.error,
          variant:"destructive"
        })
      }
    }
    if(response?.url){
      router.replace("/dashboard")
    }
  }
  return ( 
  <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Welcome Back to True Feedback
        </h1>
        <p className="mb-4">Sign in to continue your secret conversations</p>
      </div>
      <Form {...form}>
          <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6">
              <FormField
        control={form.control}
        name="identifier"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email/Username</FormLabel>
            <FormControl>
              <Input placeholder="Email/Username" {...field} 
              />
            </FormControl>
            {/* <p className={`text-sm ${usernameMessage==="Username is unique"? "text-green-500":"text-red-500"}`}>test {usernameMessage}</p> */}
            <FormMessage />
          </FormItem>
        )}
      />
      
              <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input placeholder="Password" {...field} 
               />
            </FormControl>
            {/* {isSubmitting && <Loader2 className="animate-spin"/>} */}
            
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit">
        {/* {
          isSubmitting?(<>
          <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
          </>):
          ("Signup")
        } */}
        Sing In
      </Button>
          </form>
      </Form>
      
      </div>
  </div>
  
)
}

export default page