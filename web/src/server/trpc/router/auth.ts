import { router, publicProcedure } from '../trpc';
import { prisma } from '../../db/client';
import { z } from 'zod';

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      // return prisma.user.findUnique({
      //   where: {
      //     username: input.username,
      //   },
      // });
      console.log('chal gya');
    }),
  createUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
        name: z.string(),
      })
    )
    .mutation(({ input }) => {
      return prisma.user.create({
        data: { name: input.name, username: input.username },
      });
    }),
});
