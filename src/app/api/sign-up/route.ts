import dbConnect from "@/lib/dbConnect";
import bcrypt from 'bcryptjs'
import UserModel from "@/model/User.model";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { verify } from "crypto";

export async function POST(request:Request){
    await dbConnect;
    try {
        // If existing-User-By-Email   EXISTS   and user name is verified
        const {username, password,email} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingUserVerifiedByUsername){
            return Response.json(
                {
                    success:false,
                    message:"User already exists"
                },{status:400}
            )
        }

        // If existing-User-By-Email   EXISTS   and email is verified
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000+Math.random()*900000).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exists with this email"
                }, {status:400})
            }else{
                //so our logic is user is not verified means he could be changing his passwords and all
                const hashedPassword = await bcrypt.hash(password,10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() +3600000)
                await existingUserByEmail.save
            }
        }else{
            // if user does not exist at all 
            const hashedPassword = await  bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setDate(expiryDate.getDate() + 1)
            // thats how to create a new user 
            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            })
            await newUser.save
        }
        // if user exist krta hai or nhi krta tha ab hmne bna diya hai to uski verification ke liye
        // sending verification email
        const emailResponse = await sendVerificationEmail(email,username,verifyCode)
        if(!email.Response.success){
            return Response.json({success:false, message:emailResponse.message},{status:500})
        }
        return Response.json({
            success:true,
            message:"User Registered successfully . Please verify your email"
        },{status:201})
    } catch (error) {
        console.error("Error Registering Email:", error)
        return Response.json(
            {
                success:false,
                message:"Error Registering User "
            },
            {
                status:500
            }
        )
    }
}