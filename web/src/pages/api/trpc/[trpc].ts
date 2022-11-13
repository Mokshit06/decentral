import { createNextApiHandler } from '@trpc/server/adapters/next';

import { env } from '../../../env/server.mjs';
import { createContext } from '../../../server/trpc/context';
import { appRouter } from '../../../server/trpc/router/_app';
import { withCors } from '../../../utils/cors';

// export API handler
export default withCors(
  createNextApiHandler({
    router: appRouter,
    createContext,
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.log(error);
            console.error(`❌ tRPC failed on ${path}: ${error}`);
          }
        : undefined,
  })
);
