import { createContext,useContext,useEffect,useMemo,useState } from "react";
import { api } from "./api";

type User={id:string;name:string;email?:string;phone?:string;role:"BUYER"|"SELLER"|"ADMIN";seller?:any;subscriptions?:any[]};
type AuthValue={user:User|null;loading:boolean;refresh:()=>Promise<void>;logout:()=>Promise<void>};
const C=createContext<AuthValue>({user:null,loading:true,refresh:async()=>{},logout:async()=>{}});
export function AuthProvider({children}:{children:React.ReactNode}){const [user,setUser]=useState<User|null>(null);const [loading,setLoading]=useState(true);const refresh=async()=>{try{const r=await api.me();setUser(r.user)}catch{setUser(null)}finally{setLoading(false)}};useEffect(()=>{void refresh()},[]);const logout=async()=>{await api.logout();setUser(null)};const value=useMemo(()=>({user,loading,refresh,logout}),[user,loading]);return <C.Provider value={value}>{children}</C.Provider>}
export const useAuth=()=>useContext(C);
