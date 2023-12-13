"use server";

import axios from "axios";

export async function readCountries() {
  const { data } = await axios.get<string[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/countries`,
  );

  return data;
}
