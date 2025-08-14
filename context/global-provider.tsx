import {createContext, ReactNode, useContext, useEffect, useState} from "react";

import {getAccount, getCurrentUser} from "@/lib/appwrite";

interface GlobalContextProps {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  isAdmin: boolean;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const useGlobalContext = (): GlobalContextProps => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider = ({children}: GlobalProviderProps) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });

    getAccount()
      .then((res) => {
        setIsAdmin(res.labels.includes("admin"));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        isAdmin,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
