/* eslint-disable @typescript-eslint/no-unsafe-return */
import { clerkClient } from "@clerk/nextjs/server";
/* import { TRPCError } from "@trpc/server"; */
import { z } from "zod";

import {
  createTRPCRouter,
/*   privateProcedure, */
  publicProcedure,
} from "~/server/api/trpc";

/* import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis"; */
/* import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import type { Post } from "@prisma/client";
import type { User } from "~/server/helpers/filterUserForClient"; */


/* const addUserDataToPosts = async (posts: Post[]) => {
  const userId = posts.map((post) => post.authorId);
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 110,
    })
  ).map(filterUserForClient);

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.authorId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", post);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
      });
    }
    if (!author.username) {
      // user the ExternalUsername
      if (!author.externalUsername) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Author has no GitHub Account: ${author.id}`,
        });
      }
      author.username = author.externalUsername;
    }
    return {
      post,
      author: {
        ...author,
        username: author.username ?? "(username not found)",
      },
    };
  });
};
 */


export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,  
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1), content: z.string() })) // Explicitly type the input parameter
    .mutation(async ({ ctx, input }) => {
      
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          authorId: "author-id", // Add the required authorId property
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

    const users = await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId) as string[],
      limit: 100,
    }); 

    console.log(users);

    return posts/* .map((post) => ({
      post,
      author: users.find((user) => user.id === post.authorId),
    
  })), */
  }),
});
