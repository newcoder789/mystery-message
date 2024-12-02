import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user as User
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"You must be logged in to perform this action"
        },{status:401})
    }

    const userId = user._id
    const {acceptMessage} =await request.json()

    try {
        const updatedUser = UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage:acceptMessage},
            {new:true}
        )
        if(!updatedUser){
            return Response.json({
                success:false,
                message:"Failed to update user"
            }, {status:500})
        }
        return Response.json({
            success:true,
            message:"User updated successfully",
            updatedUser
            },{status:200})

    } catch (error) {
        console.error("Failed to update user status to accept messages")
        return Response.json({
            session:false,
            message:"Failed to update user status to accept messages"
        },{status:500})
    }
}


export async function GET(request:Request){
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user = session?.user as User
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"You must be logged in to perform this action"
        },{status:401})
    }

    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId);
        
        if(!foundUser){
            return Response.json({
                success:false,
                message:"Failed to found user"
            }, {status:404})
        }
        return Response.json({
            success:true,
            isAcceptingMessages: foundUser.isAcceptingMessage
            },{status:200})
    
    } catch (error) {
        console.error("Error in getting user status")
        return Response.json({
            session:false,
            message:"Error in getting user status"
        },{status:500})
    }
}