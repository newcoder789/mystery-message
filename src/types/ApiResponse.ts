import { Message } from "@/model/User.model";


export interface ApiResponse{
    message:string;
    success:boolean;
    // sometime it might happen that we want to send further messages or user is accpecting other response 
    isAcceptingMessages?:boolean;
    // sometime we might want to show user the complete list of messages he has like a dashboard , hence
    messages?:Array<Message>
} 