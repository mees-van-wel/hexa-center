import { createContext, useContext, useState, ReactNode } from "react";

export const LOGIN_STEPS = [
  "EMAIL_INPUT",
  "EMAIL_OTP",
  "PHONE_INPUT",
  "PHONE_OTP",
  "REMEMBER_ME",
  "SUCCESS",
] as const;

type LoginStep = (typeof LOGIN_STEPS)[number];

type LoginState = {
  step: LoginStep;
  email: string;
  emailToken: string;
  emailOtp: string;
  phoneNumber: string;
  phoneToken: string;
  phoneOtp: string;
};

type AuthContextType = {
  loginState: LoginState;
  setLoginState: (state: Partial<LoginState>) => any;
};

const initialState: LoginState = {
  step: "EMAIL_INPUT",
  email: "",
  emailToken: "",
  emailOtp: "",
  phoneNumber: "",
  phoneToken: "",
  phoneOtp: "",
};

const LoginContext = createContext<AuthContextType | undefined>(undefined);

export const useLoginContext = () => {
  const context = useContext(LoginContext);

  if (!context)
    throw new Error(
      "useLoginContext must be used within a LoginContextProvider"
    );

  return context;
};

export const LoginContextProvider = ({ children }: { children: ReactNode }) => {
  const [loginState, setLoginState] = useState<LoginState>(initialState);

  return (
    <LoginContext.Provider
      value={{
        loginState,
        setLoginState: (partialLoginState) =>
          setLoginState({ ...loginState, ...partialLoginState }),
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
