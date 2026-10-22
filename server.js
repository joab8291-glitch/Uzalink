// Bunifu Digital Agency: site + admin panel + blog. Zero dependencies: `node server.js`
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const ROOT=__dirname,DATA=path.join(ROOT,'data'),UP=path.join(DATA,'uploads'),BK=path.join(DATA,'backups');
[UP,BK].forEach(d=>fs.mkdirSync(d,{recursive:true}));
const PAGES=['index','about','services','how-we-work','work','contact'];
const rd=(f,d)=>{try{return JSON.parse(fs.readFileSync(path.join(DATA,f),'utf8'))}catch(e){return d}};
const wr=(f,o)=>{const p=path.join(DATA,f);if(f==='content.json'&&fs.existsSync(p)){fs.copyFileSync(p,path.join(BK,Date.now()+'.json'));fs.readdirSync(BK).sort().slice(0,-20).forEach(x=>fs.unlinkSync(path.join(BK,x)))}fs.writeFileSync(p,JSON.stringify(o,null,1))};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dec=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
const slugify=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const today=()=>new Date().toISOString().slice(0,10);
const content=()=>{const c=rd('content.json',{});c.ov=c.ov||{};c.blog=c.blog||{title:'Insights & ideas',intro:'Practical marketing notes from the Bunifu team.'};return c};

/* ---- every editable thing on a page: text, image src/alt, link href ---- */
const SK=/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>)/gi;
function fields(frag){const f=new Set(),c=frag.replace(SK,'');
 for(const m of c.matchAll(/>([^<>]+)(?=<)/g)){const t=m[1].trim();if(t)f.add('text|'+t)}
 for(const m of c.matchAll(/<img\s[^>]*?src="([^"]+)"/g))f.add('src|'+m[1]);
 for(const m of c.matchAll(/<img\s[^>]*?alt="([^"]+)"/g))f.add('alt|'+m[1]);
 for(const m of c.matchAll(/<a\s[^>]*?href="([^"]*)"/g))f.add('href|'+m[1]);
 return [...f]}
function apply(frag,ov){const g=k=>ov[k]===undefined?null:esc(ov[k]);
 const at=(re,kind)=>s=>s.replace(re,(m,a,v,b)=>{const x=g(kind+'|'+v);return x===null?m:a+x+b});
 return frag.split(SK).map((p,i)=>i%2?p:at(/(<a\s[^>]*?href=")([^"]*)(")/g,'href')(at(/(<img\s[^>]*?alt=")([^"]+)(")/g,'alt')(at(/(<img\s[^>]*?src=")([^"]+)(")/g,'src')(
  p.replace(/>([^<>]+)(?=<)/g,(m,t)=>{const x=g('text|'+t.trim());return x===null?m:'>'+t.replace(t.trim(),()=>x)}))))).join('')}
function split(html){const seg={};['header','footer'].forEach(t=>{html=html.replace(new RegExp('<'+t+'>[\\s\\S]*?</'+t+'>'),m=>{seg[t]=m;return '<!--'+t+'-->'})});return{rest:html,seg}}
function inject(html){return html.replace(/(<li>)(<a href="about\.html">About<\/a><\/li>)/,'$1<a href="blog">Blog</a></li>$1$2').replace(/(<nav class="links"[^>]*>[\s\S]*?)(<a href="about\.html">)/,'$1<a href="blog">Blog</a>$2')}
const readPage=n=>inject(fs.readFileSync(path.join(ROOT,n+'.html'),'utf8'));
function render(name){const c=content(),{rest,seg}=split(readPage(name)),all=c.ov['*']||{},ov=c.ov[name]||{};
 let out=apply(rest,ov);for(const t in seg)out=out.replace('<!--'+t+'-->',()=>apply(seg[t],all));
 const d=ov['meta|description'];if(d)out=out.replace('</head>',`<meta name="description" content="${esc(d)}"></head>`);return out}

/* ---- blog ---- */
function md(src){const lines=esc(src).split('\n');let out='',list=null,para=[];
 const inl=t=>t.replace(/!\[([^\]]*)\]\(((?:https?:\/\/|\/)[^)\s]+)\)/g,'<img src="$2" alt="$1" loading="lazy">').replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/|#|mailto:)[^)\s]+)\)/g,'<a href="$2">$1</a>').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/\*([^*]+)\*/g,'<i>$1</i>');
 const fp=()=>{if(para.length)out+='<p>'+inl(para.join(' '))+'</p>';para=[]},fl=()=>{if(list){out+='</'+list+'>';list=null}};
 for(const l of lines){let m;
  if(!l.trim()){fp();fl()}
  else if(m=l.match(/^(#{1,3})\s+(.*)/)){fp();fl();const n=m[1].length+1;out+=`<h${n}>${inl(m[2])}</h${n}>`}
  else if(m=l.match(/^\s*([-*]|\d+\.)\s+(.*)/)){fp();const t=/\d/.test(m[1])?'ol':'ul';if(list!==t){fl();out+='<'+t+'>';list=t}out+='<li>'+inl(m[2])+'</li>'}
  else if(m=l.match(/^&gt;\s?(.*)/)){fp();fl();out+='<blockquote>'+inl(m[1])+'</blockquote>'}
  else{fl();para.push(l)}}
 fp();fl();return out}
const visible=()=>rd('posts.json',[]).filter(p=>p.status==='published'&&p.date<=today()).sort((a,b)=>b.date.localeCompare(a.date));
function layout(title,desc,inner){const h=render('index'),i=h.indexOf('<main'),j=h.indexOf('</main>');
 const head=h.slice(0,i).replace(/<title>[^<]*<\/title>/,'<title>'+esc(title)+'</title>').replace('<head>','<head><base href="/">').replace('</head>',`<meta name="description" content="${esc(desc)}"></head>`);
 return head+'<main id="top">'+inner+h.slice(j)}
const date=d=>new Date(d+'T00:00:00').toLocaleDateString('en-KE',{day:'numeric',month:'long',year:'numeric'});
function blogList(cat){const c=content().blog,all=visible(),cats=[...new Set(all.map(p=>p.category))],ps=cat?all.filter(p=>p.category===cat):all;
 const chip=(l,v)=>`<a class="fchip" style="text-decoration:none" href="blog${v?'?cat='+encodeURIComponent(v):''}" aria-pressed="${(cat||'')===(v||'')}">${esc(l)}</a>`;
 return layout(c.title+' | Bunifu Digital Agency',c.intro,`<section class="banner b2"><div class="wrap"><p class="eyebrow">Blog</p><h1>${esc(c.title)}</h1><p class="lede">${esc(c.intro)}</p></div></section><section class="band"><div class="wrap">`+
 (cats.length>1?`<div class="fchips">${chip('All','')}${cats.map(x=>chip(x,x)).join('')}</div>`:'')+
 (ps.length?`<div class="services">${ps.map(p=>`<a class="svc" href="blog/${p.slug}">${p.cover?`<img src="${esc(p.cover)}" alt="" loading="lazy" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:6px;margin-bottom:14px">`:''}<span class="tag">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p><span class="go">${date(p.date)} · Read →</span></a>`).join('')}</div>`:'<p class="lede">No posts yet. Check back soon.</p>')+'</div></section>')}
function blogPost(slug){const p=visible().find(x=>x.slug===slug);if(!p)return null;
 return layout(p.title+' | Bunifu Digital Agency',p.excerpt,`<style>.post{max-width:720px}.post h2,.post h3,.post h4{margin:1.6em 0 .5em}.post p,.post li{font-size:18px;margin:0 0 1em}.post img{border-radius:6px;margin:1em 0}.post blockquote{margin:1em 0;padding-left:16px;border-left:3px solid var(--accent);color:var(--muted)}</style><section class="banner b2"><div class="wrap"><p class="eyebrow">${esc(p.category)} · ${date(p.date)}</p><h1>${esc(p.title)}</h1><p class="lede">${esc(p.excerpt)}</p></div></section><section class="band"><div class="wrap post">${p.cover?`<img src="${esc(p.cover)}" alt="" style="width:100%">`:''}${md(p.body)}<p><a href="blog">← All posts</a></p></div></section>`)}

/* ---- http helpers, auth ---- */
const sessions=new Map(),tries=new Map();
const send=(res,code,body,type='text/html; charset=utf-8',h={})=>{res.writeHead(code,{'Content-Type':type,...h});res.end(body)};
const json=(res,o,code=200)=>send(res,code,JSON.stringify(o),'application/json');
const readBody=(req,max=12e6)=>new Promise((ok,no)=>{const b=[];let n=0;req.on('data',c=>{n+=c.length;if(n>max){no(new Error('Too large'));req.destroy()}else b.push(c)});req.on('end',()=>{try{ok(b.length?JSON.parse(Buffer.concat(b)):{})}catch(e){no(e)}})});
const hash=(pw,salt)=>crypto.scryptSync(pw,salt,64).toString('hex');
const pwOk=(pw,u)=>crypto.timingSafeEqual(Buffer.from(hash(pw,u.salt)),Buffer.from(u.hash));
const sess=req=>{const m=(req.headers.cookie||'').match(/sid=([a-f0-9]+)/);const s=m&&sessions.get(m[1]);return s&&s>Date.now()?m[1]:null};
const start=(req,res)=>{const t=crypto.randomBytes(24).toString('hex');sessions.set(t,Date.now()+6048e5);send(res,200,'{"ok":true}','application/json',{'Set-Cookie':`sid=${t}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${req.headers['x-forwarded-proto']==='https'?'; Secure':''}`})};
const MIME={'.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.gif':'image/gif','.ico':'image/x-icon'};
const file=(res,f,cache='public,max-age=3600')=>{const t=MIME[path.extname(f).toLowerCase()];if(!t||!fs.existsSync(f))return send(res,404,'Not found','text/plain');send(res,200,fs.readFileSync(f),t,{'Cache-Control':cache})};

async function api(req,res,u){const m=req.method,p=u.pathname,users=rd('users.json',null);
 if(m!=='GET'&&req.headers['x-requested-with']!=='admin')return json(res,{error:'Bad request'},403);
 if(p==='/api/me')return json(res,{auth:!!sess(req),setup:!users});
 if(p==='/api/setup'&&m==='POST'){const b=await readBody(req);if(users)return json(res,{error:'Already set up'},403);
  if(process.env.SETUP_KEY&&b.key!==process.env.SETUP_KEY)return json(res,{error:'Wrong setup key'},403);
  if(!b.user||!b.password||b.password.length<8)return json(res,{error:'Username and a password of 8+ characters are required'},400);
  const salt=crypto.randomBytes(16).toString('hex');wr('users.json',{user:b.user,salt,hash:hash(b.password,salt)});return start(req,res)}
 if(p==='/api/login'&&m==='POST'){const ip=req.socket.remoteAddress,t=tries.get(ip)||{n:0,t:Date.now()};if(Date.now()-t.t>9e5){t.n=0;t.t=Date.now()}
  if(t.n>=10)return json(res,{error:'Too many attempts. Try again in 15 minutes.'},429);const b=await readBody(req);
  if(users&&b.user===users.user&&pwOk(String(b.password||''),users)){tries.delete(ip);return start(req,res)}
  t.n++;tries.set(ip,t);return json(res,{error:'Wrong username or password'},401)}
 if(p==='/api/logout'){sessions.delete(sess(req));return send(res,200,'{}','application/json',{'Set-Cookie':'sid=; Max-Age=0; Path=/'})}
 if(!sess(req))return json(res,{error:'Please sign in'},401);

 if(p==='/api/fields'&&m==='GET'){const pg=u.searchParams.get('page'),c=content();let keys,ov;
  if(pg==='site'){const s=split(readPage('index')).seg;keys=fields(s.header+s.footer);ov=c.ov['*']||{}}
  else if(PAGES.includes(pg)){keys=fields(split(readPage(pg)).rest);keys.push('meta|description');ov=c.ov[pg]||{}}
  else return json(res,{error:'Unknown page'},404);
  return json(res,{fields:keys.map(k=>{const i=k.indexOf('|'),o=k.slice(i+1);return{k,kind:k.slice(0,i),orig:dec(o),val:ov[k]!==undefined?ov[k]:dec(o)}})})}
 if(p==='/api/fields'&&m==='PUT'){const b=await readBody(req),c=content();if(b.page!=='site'&&!PAGES.includes(b.page))return json(res,{error:'Unknown page'},400);
  const ov={};for(const k in b.ov||{})if(typeof b.ov[k]==='string')ov[k]=b.ov[k];c.ov[b.page==='site'?'*':b.page]=ov;wr('content.json',c);return json(res,{ok:true})}
 if(p==='/api/blog'){const c=content();if(m==='PUT'){const b=await readBody(req);c.blog={title:String(b.title||'Blog'),intro:String(b.intro||'')};wr('content.json',c)}return json(res,c.blog)}
 if(p==='/api/posts'){let posts=rd('posts.json',[]);
  if(m==='GET')return json(res,posts.sort((a,b)=>b.date.localeCompare(a.date)));
  if(m==='DELETE'){wr('posts.json',posts.filter(x=>x.id!==u.searchParams.get('id')));return json(res,{ok:true})}
  const b=await readBody(req),slug=slugify(b.slug||b.title||'');if(!b.title||!slug)return json(res,{error:'A title is required'},400);
  const id=b.id||crypto.randomBytes(6).toString('hex');if(posts.some(x=>x.slug===slug&&x.id!==id))return json(res,{error:'That slug is already used'},400);
  const rec={id,title:String(b.title),slug,excerpt:String(b.excerpt||''),body:String(b.body||''),cover:String(b.cover||''),category:String(b.category||'General'),date:/^\d{4}-\d{2}-\d{2}$/.test(b.date)?b.date:today(),status:b.status==='published'?'published':'draft'};
  const i=posts.findIndex(x=>x.id===id);i<0?posts.push(rec):posts[i]=rec;wr('posts.json',posts);return json(res,rec)}
 if(p==='/api/upload'&&m==='POST'){const b=await readBody(req),x=String(b.data||'').match(/^data:image\/(png|jpeg|webp|gif);base64,(.+)$/);if(!x)return json(res,{error:'Upload a PNG, JPG, WebP or GIF image'},400);
  const name=Date.now()+'-'+(slugify(path.parse(String(b.name||'image')).name)||'image')+'.'+(x[1]==='jpeg'?'jpg':x[1]);fs.writeFileSync(path.join(UP,name),Buffer.from(x[2],'base64'));return json(res,{url:'/uploads/'+name})}
 if(p==='/api/media'){if(m==='DELETE'){const f=path.join(UP,path.basename(u.searchParams.get('f')||''));if(fs.existsSync(f))fs.unlinkSync(f);return json(res,{ok:true})}
  return json(res,fs.readdirSync(UP).sort().reverse().map(f=>'/uploads/'+f))}
 if(p==='/api/password'&&m==='POST'){const b=await readBody(req);if(!pwOk(String(b.old||''),users))return json(res,{error:'Current password is wrong'},400);if(!b.new||b.new.length<8)return json(res,{error:'Use 8+ characters'},400);
  const salt=crypto.randomBytes(16).toString('hex');wr('users.json',{user:users.user,salt,hash:hash(b.new,salt)});return json(res,{ok:true})}
 return json(res,{error:'Not found'},404)}

http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://x'),p=decodeURIComponent(u.pathname),base=process.env.SITE_URL||'http://'+req.headers.host;
 if(p.startsWith('/api/'))return await api(req,res,u);
 if(p==='/admin'||p==='/admin/')return send(res,200,fs.readFileSync(path.join(ROOT,'admin.html')),'text/html; charset=utf-8',{'Cache-Control':'no-store','X-Frame-Options':'DENY'});
 if(p.startsWith('/uploads/'))return file(res,path.join(UP,path.basename(p)),'public,max-age=86400');
 if(p==='/blog'||p==='/blog/')return send(res,200,blogList(u.searchParams.get('cat')));
 if(p.startsWith('/blog/')){const h=blogPost(p.slice(6));return h?send(res,200,h):send(res,404,layout('Not found','','<section class="band"><div class="wrap"><h1 class="h2">Post not found</h1><p><a href="blog">Back to the blog</a></p></div></section>'))}
 if(p==='/feed.xml'){const x=s=>esc(s);return send(res,200,`<?xml version="1.0"?><rss version="2.0"><channel><title>${x(content().blog.title)}</title><link>${base}/blog</link><description>${x(content().blog.intro)}</description>${visible().slice(0,20).map(q=>`<item><title>${x(q.title)}</title><link>${base}/blog/${q.slug}</link><pubDate>${new Date(q.date).toUTCString()}</pubDate><description>${x(q.excerpt)}</description></item>`).join('')}</channel></rss>`,'application/rss+xml')}
 if(p==='/sitemap.xml')return send(res,200,`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...PAGES.map(n=>n==='index'?'':n+'.html'),'blog',...visible().map(q=>'blog/'+q.slug)].map(l=>`<url><loc>${base}/${l}</loc></url>`).join('')}</urlset>`,'application/xml');
 if(p==='/robots.txt')return send(res,200,`User-agent: *\nDisallow: /admin\nSitemap: ${base}/sitemap.xml\n`,'text/plain');
 const name=p==='/'?'index':p.slice(1).replace(/\.html$/,'');if(PAGES.includes(name))return send(res,200,render(name));
 const fb=path.basename(p);if(path.extname(fb)==='.js'&&fb!=='app.js')return send(res,404,'Not found','text/plain');return file(res,path.join(ROOT,fb))}catch(e){console.error(e);send(res,500,'Server error','text/plain')}}).listen(process.env.PORT||3000,()=>console.log('Bunifu running: http://localhost:'+(process.env.PORT||3000)+'  Admin: /admin'));
