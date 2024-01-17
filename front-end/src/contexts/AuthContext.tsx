"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { RouterOutput, trpc } from "@/utils/trpc";

type CurrentUser = RouterOutput["auth"]["currentUser"];

type AuthState = {
  user: CurrentUser | null;
  accessToken: string | null;
};

type AuthContext = {
  auth: AuthState;
  setAuth: (auth: AuthState) => any;
} | null;

type AuthContextProps = {
  children: React.ReactNode;
  currentUser: CurrentUser | null;
};

const AuthContext = createContext<AuthContext>(null);

export const AuthContextProvider = ({
  children,
  currentUser,
}: AuthContextProps) => {
  const [auth, setAuth] = useState<AuthState>({
    user: currentUser,
    accessToken: null,
  });

  useEffect(() => {
    if (!auth.user) return;

    const abortController = new AbortController();
    let timeoutRef: NodeJS.Timeout | null = null;

    const setToken = async () => {
      try {
        const { accessToken, expiresAt } = await trpc.auth.token.query(
          undefined,
          {
            signal: abortController.signal,
          },
        );
        setAuth({ ...auth, accessToken });
        const timeout = expiresAt.getTime() - Date.now() - 60000;
        if (timeoutRef) clearTimeout(timeoutRef);
        timeoutRef = setTimeout(() => {
          setToken();
        }, timeout);
      } catch (error) {
        console.error(error);
      }
    };

    setToken();

    return () => {
      abortController.abort();
      if (timeoutRef) clearTimeout(timeoutRef);
    };
  }, [auth.user]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  if (!authContext)
    throw new Error("useAuthContext must be used within AuthContextProvider");

  return authContext;
};

export const useAuthUser = () => {
  const authContext = useContext(AuthContext);

  if (!authContext?.auth.user)
    throw new Error("useUser must be used within authenticated pages only");

  return authContext.auth.user;
};
