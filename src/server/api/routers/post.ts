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
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
/* import { type User } from  "~/server/helpers/filterUserForClient";  */
console.log(filterUserForClient);

/* export type User = {
  id: string;
  username: string;
  profileImageUrl: string;
  externalAccounts: ExternalAccount[];
  externalUsername: string | null;
};

type ExternalAccount = {
  provider: string;
  username: string;
}; */

/* import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis"; */
/* import { TRPCError } from "@trpc/server";
import type { Post } from "@prisma/client"; */
/* import { type User } from  "~/server/helpers/filterUserForClient";
 */

/* const addUserDataToPosts = async (posts: Post[]) => {
  const userId = posts.map((post) => post.authorId);
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 110,
    })
  ).data

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.authorId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", post);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
      });
    }
   /*  if (!author.username) {
      // user the ExternalUsername
      if (!author.externalUsername) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Author has no GitHub Account: ${author.id}`,
        });
      }
      author.username = author.externalUsername;
    } */
/*     return {
      ...post,
      author: {
        ...author,
        username: author.username ?? "(username not found)",
      },
    };
  });
};
 */ 
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
          username: author?.username ?? "(username not found)",
        },
      };
    });
  }),
});
