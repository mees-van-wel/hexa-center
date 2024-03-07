import { cookies } from "next/headers";

import { RoomUpdate } from "@/components/entities/room/RoomUpdate";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";

type RoomPageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: RoomPageParams) {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const room = await trpc.room.get.query(parseInt(params.id));

  return <RoomUpdate room={room} />;
}
