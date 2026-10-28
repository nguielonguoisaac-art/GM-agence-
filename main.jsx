import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Menu, X, ShieldCheck, Users, Trophy, ArrowUpRight, Mail, Phone, MapPin, LogOut, Plus, Trash2, Pencil, Save, LockKeyhole, LoaderCircle } from 'lucide-react';
import './style.css';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = url && anon && !url.includes('VOTRE-PROJET') ? createClient(url, anon) : null;

function App() {
  const [menu,setMenu] = useState(false);
  const [players,setPlayers] = useState([]);
  const [loading,setLoading] = useState(true);
  const [adminOpen,setAdminOpen] = useState(false);
  const [session,setSession] = useState(null);
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [authMessage,setAuthMessage] = useState('');
  const [busy,setBusy] = useState(false);
  const [editing,setEditing] = useState(null);
  const [form,setForm] = useState({name:'',position:'',club:'',country:'',age:'',bio:'',photo_url:'',video_url:''});
  const [requests,setRequests] = useState([]);
  const [contact,setContact] = useState({name:'',email:'',phone:'',message:''});
  const [contactMsg,setContactMsg] = useState('');
  const configured = Boolean(supabase);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    loadPlayers();
    supabase.auth.getSession().then(({data})=>setSession(data.session));
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event,s)=>setSession(s));
    return ()=>subscription.unsubscribe();
  }, []);
  useEffect(()=>{ if(session) loadRequests(); },[session]);

  async function loadPlayers() {
    if (!supabase) return;
    setLoading(true);
    const {data,error}=await supabase.from('players').select('*').order('created_at',{ascending:false});
    if (!error) setPlayers(data||[]);
    setLoading(false);
  }
  async function loadRequests() {
    const {data}=await supabase.from('contact_requests').select('*').order('created_at',{ascending:false});
    setRequests(data||[]);
  }
  async function login(e) {
    e.preventDefault(); setBusy(true); setAuthMessage('');
    if(!supabase){setAuthMessage('Configure Supabase avec le fichier .env avant de te connecter.');setBusy(false);return;}
    const {error}=await supabase.auth.signInWithPassword({email,password});
    setAuthMessage(error ? 'Connexion impossible : vérifie ton e-mail et ton mot de passe.' : '');
    setBusy(false);
  }
  async function logout(){await supabase?.auth.signOut();setSession(null);}
  function startEdit(p=null) {
    setEditing(p?.id||'new');
    setForm(p?{name:p.name||'',position:p.position||'',club:p.club||'',country:p.country||'',age:p.age||'',bio:p.bio||'',photo_url:p.photo_url||'',video_url:p.video_url||''}:{name:'',position:'',club:'',country:'',age:'',bio:'',photo_url:'',video_url:''});
  }
  async function savePlayer(e){
    e.preventDefault(); if(!supabase)return; setBusy(true);
    const payload={...form,age:form.age?Number(form.age):null};
    const result=editing==='new' ? await supabase.from('players').insert(payload) : await supabase.from('players').update(payload).eq('id',editing);
    if(result.error) alert('Enregistrement impossible. Vérifie la configuration Supabase et les règles SQL.');
    else {setEditing(null);await loadPlayers();}
    setBusy(false);
  }
  async function deletePlayer(id){
    if(!confirm('Supprimer ce profil joueur ?'))return;
    const {error}=await supabase.from('players').delete().eq('id',id);
    if(error) alert('Suppression impossible. Vérifie les permissions Supabase.'); else loadPlayers();
  }
  async function sendContact(e){
    e.preventDefault();setContactMsg('');
    if(!supabase){setContactMsg('Le formulaire sera actif après la configuration de la base de données.');return;}
    const {error}=await supabase.from('contact_requests').insert(contact);
    if(error) setContactMsg('Envoi impossible pour le moment. Réessaie ou contacte-nous par e-mail.');
    else {setContactMsg('Merci ! Ta demande a bien été envoyée.');setContact({name:'',email:'',phone:'',message:''});}
  }
  const field=(key,label,placeholder='',type='text')=><label>{label}<input required={['name','position'].includes(key)} type={type} value={form[key]||''} placeholder={placeholder} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>;

  return <div>
    <header className="topbar"><a className="brand" href="#accueil"><span className="crest">GM</span><span>GM <b>AGENCE</b><small>FOOTBALL MANAGEMENT</small></span></a>
      <button className="mobile-menu" onClick={()=>setMenu(!menu)} aria-label="Ouvrir le menu">{menu?<X/>:<Menu/>}</button>
      <nav className={menu?'nav open':'nav'}>{[['Accueil','#accueil'],['L’agence','#agence'],['Joueurs','#joueurs'],['Services','#services'],['Contact','#contact']].map(([t,h])=><a key={h} href={h} onClick={()=>setMenu(false)}>{t}</a>)}<button className="admin-link" onClick={()=>{setAdminOpen(true);setMenu(false)}}><LockKeyhole size={16}/> Administration</button></nav>
    </header>
    <main>
      <section className="hero" id="accueil"><div className="hero-shade"></div><div className="hero-content"><div className="eyebrow"><span></span> MANAGEMENT • RECRUTEMENT • CARRIÈRE</div><h1>Le talent mérite<br/><em>les meilleures</em><br/>opportunités.</h1><p>Nous accompagnons les footballeurs dans leur développement et construisons des passerelles entre les talents et les clubs.</p><div className="hero-actions"><a className="btn gold" href="#joueurs">Découvrir les joueurs <ArrowUpRight size={18}/></a><a className="btn outline" href="#contact">Contacter l’agence</a></div><div className="hero-foot"><span><ShieldCheck/> Accompagnement professionnel</span><span><Trophy/> Vision à long terme</span></div></div><div className="hero-tag">IDENTIFIER. ACCOMPAGNER. RÉUSSIR.</div></section>
      <section className="intro section" id="agence"><div><div className="eyebrow dark">QUI SOMMES-NOUS</div><h2>Une vision claire.<br/><em>Un avenir ambitieux.</em></h2></div><div className="intro-copy"><p>GM AGENCE est dédiée à l’accompagnement des talents du football. Notre approche place le joueur, son potentiel et son avenir au centre de chaque décision.</p><p>Nous travaillons pour favoriser des opportunités sérieuses, une progression durable et des relations professionnelles transparentes.</p></div></section>
      <section className="services section" id="services"><div className="section-head"><div><div className="eyebrow">CE QUE NOUS FAISONS</div><h2>Un accompagnement <em>complet.</em></h2></div><p>Chaque carrière est unique. Notre rôle est de vous aider à franchir la prochaine étape.</p></div><div className="service-grid"><article><span className="number">01</span><Users/><h3>Gestion de carrière</h3><p>Suivi du parcours, définition des objectifs et accompagnement des joueurs.</p></article><article><span className="number">02</span><Trophy/><h3>Mise en relation</h3><p>Valorisation des profils et échanges avec les clubs et recruteurs.</p></article><article><span className="number">03</span><ShieldCheck/><h3>Conseil & orientation</h3><p>Conseils adaptés au parcours sportif et aux ambitions du joueur.</p></article></div></section>
      <section className="players section" id="joueurs"><div className="section-head"><div><div className="eyebrow dark">NOS TALENTS</div><h2>Les joueurs <em>à suivre.</em></h2></div><p>Découvrez les profils accompagnés par GM AGENCE.</p></div>{!configured&&<div className="notice">La base de données doit être configurée pour publier et gérer les profils. Consulte le guide inclus dans le projet.</div>}{loading?<div className="loading"><LoaderCircle className="spin"/> Chargement des profils…</div>:players.length===0?<div className="empty"><Users size={34}/><h3>Les profils arrivent bientôt</h3><p>Les joueurs validés par l’agence apparaîtront ici.</p></div>:<div className="player-grid">{players.map(p=><article className="player-card" key={p.id}><div className="player-photo">{p.photo_url?<img src={p.photo_url} alt={p.name}/>:<div className="photo-placeholder"><Users size={44}/></div>}<span>{p.position}</span></div><div className="player-info"><h3>{p.name}</h3><p>{[p.club,p.country,p.age?`${p.age} ans`:null].filter(Boolean).join(' • ')}</p>{p.bio&&<p className="bio">{p.bio}</p>}{p.video_url&&<a className="text-link" href={p.video_url} target="_blank" rel="noreferrer">Voir la vidéo <ArrowUpRight size={15}/></a>}</div></article>)}</div>}</section>
      <section className="cta"><div><div className="eyebrow">VOTRE PROCHAINE ÉTAPE</div><h2>Votre ambition mérite<br/><em>un vrai partenaire.</em></h2></div><a href="#contact" className="btn gold">Parlons de votre projet <ArrowUpRight size={18}/></a></section>
      <section className="contact section" id="contact"><div><div className="eyebrow dark">PRENONS CONTACT</div><h2>Le prochain chapitre<br/><em>commence ici.</em></h2><p>Joueur, parent, club ou recruteur : présentez-nous votre demande. Notre équipe pourra vous recontacter.</p><div className="contact-detail"><Mail/> <span>Contact professionnel<br/><small>Ajoutez votre adresse e-mail dans la configuration du projet.</small></span></div><div className="contact-detail"><MapPin/><span>Afrique & international<br/><small>Accompagnement selon les opportunités.</small></span></div></div><form className="contact-form" onSubmit={sendContact}><h3>Envoyer une demande</h3><label>Nom complet<input required value={contact.name} onChange={e=>setContact({...contact,name:e.target.value})} placeholder="Votre nom"/></label><label>E-mail<input required type="email" value={contact.email} onChange={e=>setContact({...contact,email:e.target.value})} placeholder="vous@exemple.com"/></label><label>Téléphone / WhatsApp<input value={contact.phone} onChange={e=>setContact({...contact,phone:e.target.value})} placeholder="+242…"/></label><label>Votre demande<textarea required rows="4" value={contact.message} onChange={e=>setContact({...contact,message:e.target.value})} placeholder="Présentez votre projet…"/></label><button className="btn gold submit" type="submit">Envoyer le message <ArrowUpRight size={17}/></button>{contactMsg&&<p className="form-message">{contactMsg}</p>}</form></section>
    </main>
    <footer><a className="brand" href="#accueil"><span className="crest">GM</span><span>GM <b>AGENCE</b><small>FOOTBALL MANAGEMENT</small></span></a><p>© {new Date().getFullYear()} GM AGENCE. Tous droits réservés.</p><button className="footer-admin" onClick={()=>setAdminOpen(true)}><LockKeyhole size={14}/> Administration</button></footer>

    {adminOpen&&<div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)setAdminOpen(false)}}><section className="admin-panel"><div className="admin-head"><div><div className="eyebrow dark">ESPACE PRIVÉ</div><h2>Administration</h2></div><button className="icon-btn" onClick={()=>setAdminOpen(false)} aria-label="Fermer"><X/></button></div>
      {!session?<form className="login-form" onSubmit={login}><div className="lock-circle"><LockKeyhole/></div><h3>Connexion administrateur</h3><p>Connecte-toi avec le compte autorisé dans Supabase.</p><label>Adresse e-mail<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@votreagence.com"/></label><label>Mot de passe<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe"/></label><button className="btn gold submit" disabled={busy}>{busy?'Connexion…':'Se connecter'} <ArrowUpRight size={16}/></button>{authMessage&&<p className="form-message">{authMessage}</p>}{!configured&&<p className="notice">Configuration requise : voir README.md. Aucun mot de passe n’est préinstallé.</p>}</form>
      :<div className="dashboard"><div className="dash-title"><div><h3>Tableau de bord</h3><p>Connecté en tant que {session.user.email}</p></div><button className="btn outline dark-outline" onClick={logout}><LogOut size={16}/> Déconnexion</button></div><div className="dash-stats"><div><Users/><b>{players.length}</b><span>Joueurs</span></div><div><Mail/><b>{requests.length}</b><span>Demandes</span></div></div>
      {editing?<form className="edit-form" onSubmit={savePlayer}><h3>{editing==='new'?'Ajouter un joueur':'Modifier le joueur'}</h3>{field('name','Nom du joueur','Nom complet')}{field('position','Poste','Ex. Attaquant')}{field('club','Club','Club actuel')}{field('country','Pays','Nationalité')}{field('age','Âge','Âge','number')}{field('photo_url','Lien photo','https://…','url')}{field('video_url','Lien vidéo','https://…','url')}<label>Biographie<textarea rows="3" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/></label><div className="form-actions"><button type="button" className="btn outline dark-outline" onClick={()=>setEditing(null)}>Annuler</button><button className="btn gold" disabled={busy}><Save size={16}/> Enregistrer</button></div></form>:<><div className="dash-section-title"><h3>Gestion des joueurs</h3><button className="btn gold small" onClick={()=>startEdit()}><Plus size={16}/> Ajouter</button></div>{players.map(p=><div className="manage-row" key={p.id}><div className="mini-avatar">{p.photo_url?<img src={p.photo_url} alt=""/>:<Users/>}</div><div className="manage-name"><b>{p.name}</b><small>{p.position} {p.club&&'• '+p.club}</small></div><button className="icon-btn" onClick={()=>startEdit(p)} aria-label="Modifier"><Pencil size={17}/></button><button className="icon-btn danger" onClick={()=>deletePlayer(p.id)} aria-label="Supprimer"><Trash2 size={17}/></button></div>)}<div className="dash-section-title requests-title"><h3>Demandes reçues</h3></div>{requests.length===0?<p className="muted">Aucune demande reçue pour le moment.</p>:requests.map(r=><article className="request-card" key={r.id}><b>{r.name}</b><small>{r.email} {r.phone&&' • '+r.phone}</small><p>{r.message}</p></article>)}</>}
      </div>}
    </section></div>}
  </div>
}
createRoot(document.getElementById('root')).render(<App/>);