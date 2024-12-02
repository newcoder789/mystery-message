import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { resourceLimits } from "worker_threads";

export async function POST(request:Request){
    await dbConnect();
    try {
        const {username, code} = await request.json()
        // it only work while useing url it is her just to note 
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodedUsername})
        const result = verifySchema.safeParse({code:code})
        if(!result.success){
			return Response.json({
				success:true,
				message:"Invalid Code"
			},{status:400})
		}
        if(!user){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:500})
        }
            
        const isCodeValid = user.verifyCode === code
        const isCodeExpired = new Date(user.verifyCodeExpiry)>new Date()
        if(isCodeExpired && isCodeValid){
            user.isVerified = true,
            await user.save()
            return Response.json({
                success:true,
                message:"Account Verified Successfully"
            },{status:200})
        }else if(!isCodeExpired){
            return Response.json({
                success:false,
                message:"Verification Code has expired, please signup again to get a new code"
            },{status:400})
        }else{
            return Response.json({
                success:false,
                message:"Incorrect Verification code"
            },{status:400})
        }
    } catch (error) {
        console.error("Error while verifing the code:",error);
        return Response.json({
            success:false,
            message:"Error while verifing the code"
},{status:500})
    }
}