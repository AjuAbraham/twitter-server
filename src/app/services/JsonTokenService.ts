import { User } from '@prisma/client';
import  jwt from 'jsonwebtoken';
import { JwtUser } from '../../interfaces';


const jwtSecret = process.env.JWT_SECRET!
class JwtService {
    public static  generateTokenForUser(user:User){
        const payload:JwtUser = {
            id: user?.id,
            email: user?.email  
        }
        const token =  jwt.sign(payload,jwtSecret);
        return token
    }
    public static decodeToken(token:string){
       try {
         return jwt.verify(token,jwtSecret) as JwtUser;
       } catch (error) {
        return null
       }
    }
}


export default JwtService;