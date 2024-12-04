"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod";
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'

import Link from "next/link";

import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { signUpSchema } from "@/schemas/signUpSchema";

import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
// import {  } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Form} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const page = () => {
  const [username, setUsername]= useState('')
  const [usernameMessage, setUsernameMessage]=useState('')
  // it is to check loading state 
  const [isCheckingUsername, setIsCheckingUsername]=useState(false)
  // to have a loader while user is submitting data 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 300)
  const {toast} = useToast()
  const router = useRouter()      

  // zod implementation 
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
        username: '',
        password: '',
        email: ''
    }
  })

  useEffect(()=>{
    const checkUsernameUniqueness = async ()=>{
        if(username){
            setIsCheckingUsername(true)
            setUsernameMessage("")
            try {
                const response = await axios.get(`/api/check-username-unique?username=${username}`);
                console.log(response);
                setUsernameMessage(response.data.message)
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setUsernameMessage(
                    axiosError.response?.data.message?? "Error Checking Username"
                )
            }finally{
                setIsCheckingUsername(false);
            }
        }
    }
    checkUsernameUniqueness()
  },[username])

  const onSubmit = async(data:z.infer<typeof signUpSchema>)=>{
    setIsSubmitting(true);
    console.log(data)// for educational purposes

    try {
        const response = await axios.post<ApiResponse>(`/api/sign-up`,data)
        if(response.data.success){
            toast({
                title:"Success",
                description:response.data.message
            })
            // we changed the router cause our strategy is to send user to the verify page where we will again get username and code to verify
            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        }else{
            console.error("Error getting response from singup while submiting")
        }        
    } catch (error) {
        console.error("Error in signup of user",error)
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage = axiosError.response?.data.message
        toast({
            title:"Signup failed",
            description:errorMessage,
            variant:"destructive"
        })
        setIsSubmitting(false)
    }
  }
  return ( 
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign Up to continue your secret conversations</p>
        </div>
        <Form {...form}>
            <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6">
                <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} 
                onChange={
                  (e)=>{
                    field.onChange(e);
                    debounced(e.target.value)
                  }
                } />
              </FormControl>
              <p className={`text-sm ${usernameMessage==="Username is unique"? "text-green-500":"text-red-500"}`}>test {usernameMessage}</p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} 
                 />
              </FormControl>
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
              {isCheckingUsername && <Loader2 className="animate-spin"/>}
              
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting?(<>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            </>):
            ("Signup")
          }
        </Button>
            </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href={"/sign-in"} className="text-blue-600 hover:text-blue-800">
            Sign In </Link>
          </p>
        </div>
        </div>
    </div>
    
  )
}

export default page