import { router, procedure } from "../trpc.js";
import db from "../db/client.js";
import { rooms } from "../db/schema.js";
import { number } from "valibot";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { wrap } from "@decs/typeschema";
import {
  RoomCreateSchema,
  RoomUpdateSchema,
} from "@hexa-center/shared/schemas/room.js";

export const roomRouter = router({
  create: procedure
    .input(wrap(RoomCreateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await db
        .insert(rooms)
        .values({
          ...input,
          createdById: ctx.user.id,
          updatedById: ctx.user.id,
          propertyId: 1,
        })
        .returning({
          $kind: rooms.$kind,
          id: rooms.id,
          createdAt: rooms.createdAt,
          createdById: rooms.createdById,
          updatedAt: rooms.updatedAt,
          updatedById: rooms.updatedById,
          name: rooms.name,
          price: rooms.price,
        });

      const room = result[0];
      if (!room) throw new TRPCError({ code: "NOT_FOUND" });

      return room;
    }),
  list: procedure.query(() =>
    db
      .select({
        id: rooms.id,
        name: rooms.name,
        price: rooms.price,
      })
      .from(rooms),
  ),
  get: procedure.input(wrap(number())).query(async ({ input }) => {
    const result = await db
      .select({
        id: rooms.id,
        name: rooms.name,
        price: rooms.price,
      })
      .from(rooms)
      .where(eq(rooms.id, input));

    const room = result[0];
    if (!room) throw new TRPCError({ code: "NOT_FOUND" });

    return room;
  }),
  update: procedure
    .input(wrap(RoomUpdateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await db
        .update(rooms)
        .set({
          ...input,
          updatedById: ctx.user.id,
        })
        .where(eq(rooms.id, input.id))
        .returning({
          $kind: rooms.$kind,
          id: rooms.id,
          createdAt: rooms.createdAt,
          createdById: rooms.createdById,
          updatedAt: rooms.updatedAt,
          updatedById: rooms.updatedById,
          name: rooms.name,
          price: rooms.price,
        });

      const room = result[0];
      if (!room) throw new TRPCError({ code: "NOT_FOUND" });

      return room;
    }),
  delete: procedure
    .input(wrap(number()))
    .mutation(({ input }) => db.delete(rooms).where(eq(rooms.id, input))),
});
