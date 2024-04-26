/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
/* import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import { TRPCError } from "@trpc/server"; */

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
    const { data: [] } = await clerkClient.users.getUserList({
        username: [input.username],
        
        
    });

   /* if (!user) {
        // if we hit here we need a unsantized username so hit api once more and find the user.
        const users = (
            await clerkClient.users.getUserList({
                limit: 200,
            })
        ).data;

        const user = users.find((user: { externalAccounts: unknown[]; }) => user.externalAccounts.find((account: unknown) => account.username === input.username));
        if (!user) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "User not found",
            });
        }
        return filterUserForClient(user)
      } */

    const { username, id, externalUsername } = input as { username: string; id: string; externalUsername: string };
    return {
        username,
        id,
        externalUsername
    };

    }),
});