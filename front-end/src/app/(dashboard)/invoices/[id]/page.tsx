import { InvoiceDetail } from "@/components/entities/invoice/InvoiceDetail";
import { getTrpcClientOnServer } from "@/utils/trpcForServer";

type PageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageParams) {
  const trpc = getTrpcClientOnServer();

  const invoice = await trpc.invoice.get.query(parseInt(params.id));

  return <InvoiceDetail invoice={invoice} />;
}
