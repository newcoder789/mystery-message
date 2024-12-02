import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        const email_response =  await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystery Message | Verification Email',
            react: VerificationEmail({username, otp:verifyCode}),
          });
        console.log(email_response)
        return {success:true, message:"Verification email send successfully"}
    } catch (error) {
        console.error("Error sending verification Emails:",error)
        return {
            success:false,
            message:"Failed to send Verification email"
        }
    }
}