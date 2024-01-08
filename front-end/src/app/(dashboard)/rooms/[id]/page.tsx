import { cookies } from "next/headers";

import { Room } from "@/components/pages/rooms/Room";
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

  return <Room room={room} />;
}
