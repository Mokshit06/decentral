import { publicProcedure, router } from '../trpc';
import { authRouter } from './auth';
import { exampleRouter } from './example';
import { z } from 'zod';
import { prisma } from '../../db/client';
import { IntegrationType } from '@prisma/client';

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  // createIntegration: publicProcedure
  //   .input(
  //     z.object({
  //       name: z.string(),
  //       userId: z.string(),
  //     })
  //   )
  //   .mutation(async ({ input }) => {
  //     return prisma.integration.create({
  //       data: {
  //         name: input.name === 'twitter' ? 'Twitter' : 'Whatsapp',
  //         userId: input.userId,
  //         username: '',
  //       },
  //     });
  //   }),
  createConversation: publicProcedure
    .input(
      z.object({
        name: z.string(),
        img: z.string().optional(),
        integration: z.string(),
        cid: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.conversation.create({
        data: {
          name: input.name,
          img: input.img ?? '',
          info: '',
          type:
            input.integration === 'whatsapp'
              ? IntegrationType.Whatsapp
              : IntegrationType.Twitter,
          cidIpfs: input.cid,
        },
      });
    }),
  setIpfsConversation: publicProcedure
    .input(z.object({ cid: z.string(), id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.conversation.update({
        where: { id: input.id },
        data: { cidIpfs: input.cid },
      });
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
