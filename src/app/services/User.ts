import axios from "axios";
import {PrismaClient} from '@prisma/client'
import JwtService from "./JsonTokenService";
import prismaClient from "../../db";
const prisma = new PrismaClient();

interface Data {
    iss?: string;
    nbf?: string;
    aud?: string;
    sub?: string;
    email: string;
    email_verified: string;
    azp?: string;
    name?: string;
    picture?: string;
    given_name: string;
    family_name?: string;
    iat?:string;
    exp?: string;
    jti?:string;
    alg?:string;
    kid?:string;
    typ?:string;
 }
class UserService {
    public static async verifyGoogleAuthToken(token:string){
        const googleToken = token;
       const authUrl = new URL("https://oauth2.googleapis.com/tokeninfo")
       authUrl.searchParams.set("id_token",googleToken);

       const {data} = await axios.get<Data>(authUrl.toString(),{responseType:"json"});
       const user = await prisma.user.findUnique({where:{email: data.email}});
       if(!user){
        await prisma.user.create({
            data:{
                email:data.email,
                firstName: data.given_name,
                lastName: data.family_name,
                avatarUrl: data.picture
            }
        })
       }
       const userInDb = await prisma.user.findUnique({where:{email: data.email}});
       if(!userInDb){
        throw new Error("User with this email not found");
       }
       const jwtToken = JwtService.generateTokenForUser(userInDb!);
       return jwtToken;
    }
    public static  getUserById(id:string){
        return prismaClient.user.findUnique({where:{id}})
    }
}

export default UserService;