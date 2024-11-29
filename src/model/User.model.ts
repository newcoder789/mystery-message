import mongoose, {Schema, Document } from "mongoose";
// we need Document to maintain typessafety or we can say typeScript

export interface Message extends Document{
    content:string,
    createdAt:Date
}
// we use document here as in the end interface make a document for the mongoose


const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})
// Note:- Remember we use String(mongoose) and string(typescript)

export interface User extends Document {
    username: string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean,
    isAcceptingMessage:boolean,
    messages:Message[]
}

const UserSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true, "Username is required"],
        trim:true,
        unique:true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please use a valid email address"]},
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    verifyCode:{
        type:String,
        required:[true,"verifyCode is required"]
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"verifyCodeExpiry is required"]
    },
    isVerified:{
        type:Boolean,
        required:[true,"isVerified is required"],
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        required:[true,"isAcceptingMessage is required"],
        default:true
    },
    messages:[MessageSchema] 
})


// in node when we are running a mongoose project node our project stops, but our server keep running in the background, but in case of nextjs it do not know whether it is first time running or not 
const UserModel = (mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("User",UserSchema)
// first one will bring out any User model if available and second one will create a model

export default UserModel;