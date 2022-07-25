import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface ProfileResponse {
  ok: boolean;
  profile: User;
}

export default function useUser() {
  const [win, setWin] = useState<Window & typeof globalThis>();
  const { data, error } = useSWR<ProfileResponse>(
    !win ? null : "/api/users/me"
  );
  useEffect(() => {
    setWin(window);
  }, []);
  const router = useRouter();

  useEffect(() => {
    if (data && !data.ok) router.replace("/enter");
  }, [data, router]);

  return {
    user: data?.profile,
    isLoading: !data && !error,
  };
}
