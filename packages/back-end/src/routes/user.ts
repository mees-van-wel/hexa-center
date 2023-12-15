import { wrap } from "@decs/typeschema";
import { procedure, router } from "../trpc.js";
import { number } from "valibot";

export const userRouter = router({
  create: procedure.input(wrap()).mutation(() => {}),
  list: procedure.query(() => {}),
  get: procedure.input(wrap(number())).query(() => {}),
  update: procedure.input(wrap()).mutation(() => {}),
  delete: procedure.input(wrap(number())).mutation(() => {}),
});
