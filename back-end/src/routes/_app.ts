import { router } from "../trpc";

import { authRouter } from "./auth";
import { roomRouter } from "./room";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  room: roomRouter,
});
