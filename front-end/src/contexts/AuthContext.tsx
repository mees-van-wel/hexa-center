"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { RouterOutput, trpc } from "@/utils/trpc";

type CurrentRelation = RouterOutput["auth"]["currentRelation"];

type AuthState = {
  relation: CurrentRelation | null;
  accessToken: string | null;
};

type AuthContext = {
  auth: AuthState;
  setAuth: (auth: AuthState) => any;
} | null;

type AuthContextProps = {
  children: React.ReactNode;
  currentRelation: CurrentRelation | null;
};

const AuthContext = createContext<AuthContext>(null);

export const AuthContextProvider = ({
  children,
  currentRelation,
}: AuthContextProps) => {
  const [auth, setAuth] = useState<AuthState>({
    relation: currentRelation,
    accessToken: null,
  });

  useEffect(() => {
    if (!auth.relation) return;

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
  }, [auth.relation]);

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

export const useAuthRelation = () => {
  const authContext = useContext(AuthContext);

  if (!authContext?.auth.relation)
    throw new Error("useRelation must be used within authenticated pages only");

  return authContext.auth.relation;
};
