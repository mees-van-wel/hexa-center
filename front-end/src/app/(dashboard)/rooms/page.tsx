import { RoomsOverview } from "@/components/entities/room/RoomsOverview";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

export default async function Page() {
  const trpc = getTrpcClientOnServer();

  const rooms = await trpc.room.list.query();

  return <RoomsOverview rooms={rooms} />;
}
