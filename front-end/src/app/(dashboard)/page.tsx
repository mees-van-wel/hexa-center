import axios from "axios";

import HomePage from "@/components/pages/home/HomePage";

export interface NewsItem {
  slug: string;
  html: string;
  data: {
    title: string;
    date: string;
    image?: string;
  };
}

export default async function Page() {
  const { data } = await axios<NewsItem[]>(
    "https://www.hexa.center/api/v1/news",
  );

  return <HomePage newsItems={data} />;
}
