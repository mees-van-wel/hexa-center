import { Table } from "@/components/common/Table";
import { trpc } from "@/utils/trpc";

export default async function Users() {
  const users = await trpc.auth.currentUser.query();

  return <Table elements={users} />;
}
