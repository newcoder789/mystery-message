import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export const authOptions:NextAuthOptions = {
    // Configure one or more authentication providers
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any):Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            // email: creadentials.identifier.email was used to be used but now we can use it without email at end
                            {email:credentials.identifier},
                            {username:credentials.identifier},
                        ]
                    })
                    if(!user){
                        throw new Error("No user found with this email")
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your account first before login")
                    }
                    const isPasswordCorrect = bcrypt.compare(credentials.password,user.password)
                    if(!isPasswordCorrect){
                        return user
                    }else{
                        throw new Error("Incorrect Password")
                    }
                } catch (err:any) {
                    // it is important to throw an error or return null here cause if we do not return user it will raise error each time 
                    throw new Error(err);
                }
            }

        })
    ],
    callbacks:{
        // with modefing token in both cases we have addeduser informaation in both and can derive it any way we want
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString(),
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username ;
            } 
            return token
          
        }, 
        async session({ session, token }) { 
            if(token){
                session.user._id = token.user._id,
                session.user.isVerified = token.user.isVerified,
                session.user.isAcceptingMessages = token.user.isAcceptingMessages,
                session.user.username = token.user.username
            }
            return session
        },
    },
    pages:{
        // we are not only defining routes , but we will not even have to design these pages
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}