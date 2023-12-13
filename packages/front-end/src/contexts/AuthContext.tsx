"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type CurrentUser = {
  id: number;
  firstName: string;
  lastName: string;
  account?: {
    theme: string;
  };
};

type AuthState = {
  user: CurrentUser;
  accessToken: string | null;
};

type AuthContext = {
  auth: AuthState;
  setAuth: (auth: AuthState) => any;
} | null;

const AuthContext = createContext<AuthContext>(null);

export const AuthContextProvider = ({
  children,
  currentUser,
}: {
  children: ReactNode;
  currentUser: CurrentUser;
}) => {
  const [auth, setAuth] = useState<AuthState>({
    user: currentUser,
    accessToken: null,
  });

  useEffect(() => {
    if (!auth.user) return;

    const abortController = new AbortController();
    let timeoutRef: NodeJS.Timeout | null = null;

    const setToken = async () => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/request-token",
        {
          method: "POST",
          credentials: "include",
          signal: abortController.signal,
        },
      );

      const { accessToken, expiresAt } = await res.json();

      setAuth({ ...auth, accessToken });

      const timeout = new Date(expiresAt).getTime() - Date.now() - 60000;
      if (timeoutRef) clearTimeout(timeoutRef);
      timeoutRef = setTimeout(() => {
        setToken();
      }, timeout);
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
