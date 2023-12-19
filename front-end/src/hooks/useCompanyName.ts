export const useCompanyName = () => {
  if (typeof window === "undefined") return undefined;

  const hostnameParts = window.location.hostname.split(".");
  if (hostnameParts.length <= 1) return undefined;

  return hostnameParts[0]!
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
