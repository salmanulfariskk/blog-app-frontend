"use client";

import { useCallback, useContext, useReducer } from "react";
import { createContext } from "react";

type User = {
  _id: string;
  name: string;
};

type State = {
  isAuthenticated: boolean;
  user: User | null;
};

type Action =
  | { type: "SET_SESSION"; payload: { isAuthenticated: boolean; user: User } }
  | { type: "LOGOUT" };

const SessionContext = createContext<
  { session: State; setSession(user: User): void } | undefined
>(undefined);

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "SET_SESSION":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {
    isAuthenticated: localStorage.getItem("user") ? true : false,
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") || "")
      : null,
  });

  const setSession = useCallback(
    (user: User) => {
      dispatch({
        type: "SET_SESSION",
        payload: { isAuthenticated: true, user },
      });
    },
    [dispatch]
  );

  return (
    <SessionContext.Provider value={{ session: state, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}
