import { User} from '@prisma/client'
import { graphQlContext } from '../../interfaces';
import prismaClient from '../../db';
import UserService from '../services/User';



const resolverQuery = {
    verifyGoogleToken: async (parent:any, {token}:{token:string})=>{
       const finalToken = await UserService.verifyGoogleAuthToken(token); 
       return finalToken;
    },
    getCurrentUser: async (parent:any,args:any,ctx:graphQlContext)=>{
      const userId = ctx.user?.id;
      if(!userId)return null;   
      const user = await UserService.getUserById(userId);
      if(!user) throw Error("unable to find the user");
      return user;  
    }, 
    getUserById: async(parent:any,{id}:{id:string},ctx:graphQlContext)=>{
         const user = await UserService.getUserById(id);
         if(!user) throw Error("Unable to fetch User details")
         return user;    
    }
}
const extraResolver = {
     User: {
        tweets:(parent: User)=> prismaClient.tweet.findMany({where:{author:{id:parent.id}}})
     }
}

export const resolvers = { resolverQuery,extraResolver}