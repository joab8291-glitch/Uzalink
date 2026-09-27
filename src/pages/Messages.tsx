import { useEffect, useState } from "react";
import { Container, btnClass } from "@/components/ui";
import { Link } from "@/lib/router";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export function Messages() {
 const {user,loading}=useAuth(); const [messages,setMessages]=useState<any[]>([]); const [error,setError]=useState("");
 const load=()=>api.messages().then(r=>setMessages(r.messages||[])).catch(e=>setError(e.message));
 useEffect(()=>{if(user)load()},[user]);
 if(loading)return <div className="pt-32 text-center">Loading…</div>;
 if(!user)return <section className="pt-32"><Container><div className="mx-auto max-w-xl rounded-3xl border p-8 text-center"><h1 className="text-3xl font-extrabold">Sign in to view messages</h1><Link to="/seller-login" className={btnClass("deep","md","mt-5")}>Sign in</Link></div></Container></section>;
 return <section className="min-h-screen bg-mint/30 pb-20 pt-28"><Container className="max-w-5xl"><div><p className="text-xs font-bold uppercase tracking-widest text-brand">UzaLink inbox</p><h1 className="mt-2 text-4xl font-extrabold text-deep">Messages</h1></div>{error&&<p className="mt-4 text-red-600">{error}</p>}<div className="mt-7 space-y-3">{messages.length?messages.map(m=><article key={m.id} className={`rounded-2xl border bg-white p-5 ${m.readAt?"":"ring-2 ring-brand/20"}`}><div className="flex justify-between gap-4"><div><p className="font-extrabold text-deep">{m.subject||"UzaLink message"}</p><p className="text-sm text-forest/60">From {m.sender?.name||"UzaLink user"}</p></div>{!m.readAt&&<button onClick={async()=>{await api.readMessage(m.id);load()}} className={btnClass("outline","sm")}>Mark read</button>}</div><p className="mt-3 whitespace-pre-wrap text-sm text-forest/75">{m.body}</p></article>):<div className="rounded-3xl border bg-white p-10 text-center text-forest/60">No messages yet.</div>}</div></Container></section>;
}
