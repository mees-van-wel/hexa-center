import { UsersOverview } from "@/components/entities/user/UsersOverview";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

export default async function Page() {
  const trpc = getTrpcClientOnServer();

  const users = await trpc.user.list.query();

  return <UsersOverview users={users} />;
}
