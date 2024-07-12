import prismaClient from "../../db";

export interface CreateTweetPayload {
    content: string;
    contentImage?: string;
    userId: string
  }

class TweetService{
   public static createTweet(data:CreateTweetPayload){
    return prismaClient.tweet.create({data:{
        content:data.content,
        contentImage: data.contentImage,
        author: {connect:{id:data.userId}}
    }})
   }
   public static getAllTweet(){
    return prismaClient.tweet.findMany({orderBy:{createdAt:"desc"}})
   }
}

export default TweetService;