import db from "../db/client.js";
import { rooms } from "../db/schema.js";
import type { Endpoint } from "../types.js";
import { RoomCreateSchema } from "@hexa-center/shared/schemas/roomCreate.js";

export const POST: Endpoint = async ({ res, validate }) => {
  const { name, price } = validate(RoomCreateSchema);

  (async () => {
    const result = await db
      .insert(rooms)
      .values({ name, price })
      .returning({ id: rooms.id });
    res.json(result[0]);
  })();
};
