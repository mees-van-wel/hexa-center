import { Rooms } from "@/components/pages/rooms/Rooms";
import { setTRPCRefreshToken, trpc } from "@/utils/trpc";
import { cookies } from "next/headers";

export default async function Page() {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) setTRPCRefreshToken(refreshToken);

  const rooms = await trpc.room.list.query();

  return <Rooms rooms={rooms} />;
}
