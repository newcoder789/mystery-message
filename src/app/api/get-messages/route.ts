import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user as User
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"You must be logged in to perform this action"
        },{status:401})
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            {$match:{id:userId}},
            // we have user messages in an array 
        // like one document containing one array with lot of message but we will convert it into(unwind=>breakintomany ) 
        // many document containing one message each other data like id will be same for them
        {
            $unwind:'$messages'
        },
        {$sort:{'messages.createdAt':-1}},

        // hence we will push it sorted
        {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])
        
        if(!user || user.length===0){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
        return Response.json({
            success:true,
            message:user[0].messages
        },{status:401}
    )
    } catch (error) {
        console.error("Unexpected Error while getting messages",error)
        return Response.json({
            success:false,
            message:"Unexpected Error while getting messages"
        },{status:401}
    )   
    }

}