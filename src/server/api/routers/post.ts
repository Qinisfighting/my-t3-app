/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit"; 
import { Redis } from "@upstash/redis";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,  
      };
    }),

  create: privateProcedure
    .input(z.object({ content: z.string().min(1).max(280) })) // Explicitly type the input parameter
    .mutation(async ({ ctx, input }) => {

      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      
      // simulate a slow db call
/*       await new Promise((resolve) => setTimeout(resolve, 1000));
 */
      return ctx.db.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });
    }),


   getPostsByUserId: publicProcedure.input(z.object({
        userId: z.string(),
   
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post
        .findMany({
          where: {
            authorId: input.userId,
          
          },
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        })
        const userId = posts.map((post) => post.authorId);
        const users = (
          await clerkClient.users.getUserList({
            userId: userId,
            limit: 10,
          })
        ).data.map((user) => {
          return {
            id: user.id,
            username: user.username,
            profileImageUrl: "",
            externalUsername: null,
          };
        });
        return posts.map((post) => {
          const author = users.find((user) => user.id === post.authorId);
          return {
            post,
            author: {
              ...author,
              username: author?.username ?? "(random visitor)",
            },
          };
        });
      } 
    ),


  getLatest: publicProcedure.query(({ ctx }) => {
   
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    
    const posts = await ctx.db.post.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
    });
    const userId = posts.map((post) => post.authorId);

    const users = (
      await clerkClient.users.getUserList({
        userId: userId,
        limit: 10,
      })
    ).data.map((user) => {
      return {
        id: user.id,
        username: user.username,
        profileImageUrl: "",
        externalUsername: null,
      };
    });

    console.log(users);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);
      return {
        post,
        author: {
          ...author,
          username: author?.username ?? "(random visitor)",
        },
      };
    });
  }),
});
