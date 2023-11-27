"use client";

import useMemory from "@/hooks/useMemory";
import { readCountries } from "@/server/actions";

export default function Countries({ initialCountries = ["NL"] }) {
  const [countries, { fetch }] = useMemory({
    name: "readCountries",
    action: readCountries,
    initialData: initialCountries,
  });

  return (
    <div>
      {countries.map((country) => (
        <p key={country}>{country}</p>
      ))}
    </div>
  );
}
