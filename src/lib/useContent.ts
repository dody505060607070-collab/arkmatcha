import { useQuery } from "@tanstack/react-query";
import { settingsQuery, type ContentMap } from "./queries";

export function useContent(): ContentMap {
  const { data } = useQuery(settingsQuery);
  return (data?.content ?? {}) as ContentMap;
}
