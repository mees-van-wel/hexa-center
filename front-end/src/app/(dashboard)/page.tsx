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
  let data: NewsItem[] = [];

  try {
    const response = await axios<NewsItem[]>(
      "https://www.hexa.center/api/v1/news",
    );

    data = response.data;
  } catch (error) {
    console.warn("Error while retrieving news items", error);
  }

  return <HomePage newsItems={data} />;
}
