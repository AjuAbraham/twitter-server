import { Tweet } from "@prisma/client";
import prismaClient from "../../db";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { graphQlContext } from "../../interfaces";
import UserService from "../services/User";
import TweetService, { CreateTweetPayload } from "../services/Tweet";


const client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION
});
const queries = {
  getAllTweets: async () => {
    const data = await TweetService.getAllTweet();
    if (!data) throw new Error("Unable to fetch tweets");
    return data;
  },
  getSignedUrlForTweet: async (
    parent: any,
    {
      imageType,
      imageName,
      size,
    }: { imageType: string; imageName: string; size: number },
    ctx: graphQlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");
    const allowedFileTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
    ];
    const allowedSize = 1024 * 1024 * 30;
    if (!allowedFileTypes.includes(imageType))
      throw new Error("Unsupported File type");
    if (size > allowedSize)
      throw new Error("File size is too large keep it less then 30Mb");
    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: `tweets/${ctx.user.id}/${imageName}-${Date.now().toString()}.${
        imageType.split("/")[0]
      }`,
    });
    const signedUrl = await getSignedUrl(client, putCommand, {
      expiresIn: 3000,
    });
    return signedUrl;
  },
};
const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload },
    ctx: graphQlContext
  ) => {
    if (!ctx.user) throw new Error("You are not authenticated");
    const tweet = await TweetService.createTweet({...payload,userId:ctx.user.id});
    if (!tweet) throw Error("Unable to post your tweet");
    return tweet;
  },
};
const extraResolver = {
  Tweet: {
    author: (parent: Tweet) =>
     UserService.getUserById(parent.authorId),
  },
};

export const resolvers = { mutations, extraResolver, queries };
