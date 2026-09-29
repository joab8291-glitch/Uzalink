import { createContext,useContext,useEffect,useMemo,useState } from "react";
import { api } from "./api";

type User={id:string;name:string;email?:string;phone?:string;role:"BUYER"|"SELLER"|"ADMIN";seller?:any;subscriptions?:any[];premium?:boolean};
type AuthValue={user:User|null;loading:boolean;refresh:()=>Promise<User|null>;logout:()=>Promise<void>};
const C=createContext<AuthValue>({user:null,loading:true,refresh:async()=>null,logout:async()=>{}});

export function AuthProvider({children}:{children:React.ReactNode}){
  const [user,setUser]=useState<User|null>(null);
  const [loading,setLoading]=useState(true);

  const refresh=async():Promise<User|null>=>{
    try{
      const r=await api.me();

      const authenticatedUser:User = {
        ...r.user,
        premium:Boolean(r.premium),
      };

      setUser(authenticatedUser);
      return authenticatedUser;
    }catch{
      setUser(null);
      return null;
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{void refresh()},[]);

  const logout=async()=>{
    await api.logout();
    setUser(null);
  };

  const value=useMemo(
    ()=>({user,loading,refresh,logout}),
    [user,loading]
  );

  return <C.Provider value={value}>{children}</C.Provider>;
}

export const useAuth=()=>useContext(C);
