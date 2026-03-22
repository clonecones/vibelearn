import { useState, useEffect, useCallback } from "react";

if (!document.getElementById("vl-fonts")) {
  const l = document.createElement("link"); l.id="vl-fonts"; l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
}
if (!document.getElementById("vl-css")) {
  const s = document.createElement("style"); s.id="vl-css";
  s.textContent=`
    *{box-sizing:border-box;margin:0;padding:0;}
    .vl-hover{transition:transform 0.17s ease,box-shadow 0.17s ease;cursor:pointer;}
    .vl-hover:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(0,0,0,0.11)!important;}
    .vl-btn{transition:all 0.14s ease;cursor:pointer;}
    .vl-btn:hover:not(:disabled){transform:translateY(-1px);filter:brightness(1.06);}
    .vl-btn:active:not(:disabled){transform:translateY(0);}
    .vl-back:hover{color:#6366f1!important;}
    textarea:focus{outline:none!important;border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.13)!important;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes popIn{0%{transform:scale(0.8);opacity:0}65%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
    @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
    .vl-fade{animation:fadeUp 0.36s ease both;}
    .vl-fi{animation:fadeIn 0.26s ease both;}
    .vl-pop{animation:popIn 0.32s ease both;}
    .vl-pulse{animation:pulse 1.6s ease infinite;}
    .vl-float{animation:float 3s ease infinite;}
    .vl-slide{animation:slideDown 0.22s ease both;}
    .vl-xp{transition:width 1s cubic-bezier(.4,0,.2,1);}
    .vl-opt{transition:all 0.15s ease;cursor:pointer;}
    .vl-opt:not(:disabled):hover{transform:translateX(4px);}
    @keyframes cardIn{from{opacity:0;transform:translateY(12px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
    .vl-card-in{animation:cardIn 0.3s cubic-bezier(.34,1.56,.64,1) both;}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-thumb{background:#d4d0c8;border-radius:3px;}
    @media(min-width:900px){
      .vl-card-body{font-size:18px!important;line-height:1.9!important;}
    }
  `;
  document.head.appendChild(s);
}

const ADVANCED_XP_GATE = 200;

// ── SVG DIAGRAMS ──────────────────────────────────────────────────────────────
import Diagrams from "./diagrams.jsx";

// ── ANALOGY CARDS ─────────────────────────────────────────────────────────────
function AnalogyCard({step,cm}){
  const Label=({color,light})=>(
    <div style={{display:"inline-flex",alignItems:"center",gap:6,background:light,borderRadius:999,padding:"4px 12px",marginBottom:20}}>
      <span style={{fontSize:13}}>💡</span>
      <span style={{fontSize:11,color,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"Inter,sans-serif"}}>Analogy</span>
    </div>
  );

  if(step.analogyStyle==="contractor") return(
    <div style={{background:"linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%)",borderRadius:20,padding:"28px 24px",border:"none",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:-30,right:-30,fontSize:120,opacity:0.06,lineHeight:1,pointerEvents:"none"}}>🏗️</div>
      <Label color="#92400e" light="#fde68a55"/>
      <div style={{display:"flex",gap:12,marginBottom:22,flexWrap:"wrap",position:"relative",zIndex:1}}>
        <div style={{flex:1,background:"#fff",borderRadius:14,padding:"16px",border:"none",boxShadow:"0 2px 12px rgba(217,119,6,0.15)",minWidth:130}}>
          <div style={{fontSize:10,color:"#b45309",fontWeight:800,marginBottom:8,fontFamily:"Inter,sans-serif",letterSpacing:1}}>❌ VAGUE</div>
          <div style={{fontSize:16,color:"#374151",fontFamily:"'Playfair Display',serif",fontWeight:700,lineHeight:1.4,marginBottom:6}}>"Fix my house"</div>
          <div style={{fontSize:13,color:"#ef4444",fontWeight:600,fontFamily:"Inter,sans-serif"}}>→ Frustrating results</div>
        </div>
        <div style={{flex:1,background:"#fff",borderRadius:14,padding:"16px",border:"none",boxShadow:"0 2px 12px rgba(217,119,6,0.25)",minWidth:130}}>
          <div style={{fontSize:10,color:"#16a34a",fontWeight:800,marginBottom:8,fontFamily:"Inter,sans-serif",letterSpacing:1}}>✓ SPECIFIC</div>
          <div style={{fontSize:15,color:"#374151",fontFamily:"'Playfair Display',serif",fontWeight:700,lineHeight:1.4,marginBottom:6}}>"Replace 12×12 white subway tile, kitchen, by Friday"</div>
          <div style={{fontSize:13,color:"#16a34a",fontWeight:600,fontFamily:"Inter,sans-serif"}}>→ Exactly right</div>
        </div>
      </div>
      <p style={{fontSize:17,color:"#78350f",lineHeight:1.8,fontStyle:"italic",fontFamily:"'Playfair Display',serif",position:"relative",zIndex:1,borderTop:"1px solid #fde68a",paddingTop:16,marginTop:4}}>{step.body}</p>
    </div>
  );

  if(step.analogyStyle==="whiteboard") return(
    <div style={{background:"linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%)",borderRadius:20,padding:"28px 24px",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:-20,right:-20,fontSize:100,opacity:0.07,lineHeight:1,pointerEvents:"none"}}>🖊️</div>
      <Label color="#1d4ed8" light="#bfdbfe55"/>
      <div style={{background:"#fff",borderRadius:14,padding:"18px",marginBottom:20,boxShadow:"0 2px 12px rgba(37,99,235,0.12)",position:"relative",zIndex:1}}>
        <div style={{fontSize:10,color:"#6b7280",fontFamily:"Inter,sans-serif",marginBottom:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Context Window: filling up</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
          {["System prompt","Your msg","Doc 1","Doc 2","History"].map((t,i)=>(
            <span key={i} style={{background:"#eef2ff",color:"#6366f1",borderRadius:8,padding:"5px 10px",fontSize:11,fontFamily:"Inter,sans-serif",fontWeight:700}}>{t}</span>
          ))}
          <span style={{background:"#fef2f2",color:"#dc2626",borderRadius:8,padding:"5px 10px",fontSize:11,fontFamily:"Inter,sans-serif",fontWeight:800,border:"1.5px solid #fca5a5"}}>⚠️ FULL</span>
        </div>
        <div style={{background:"#f3f4f6",borderRadius:999,height:8,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(90deg,#6366f1,#f59e0b,#ef4444)",height:"100%",width:"92%",borderRadius:999}}/>
        </div>
        <div style={{fontSize:11,color:"#ef4444",fontWeight:700,fontFamily:"Inter,sans-serif",marginTop:6}}>92% full: oldest content will be dropped next</div>
      </div>
      <p style={{fontSize:17,color:"#1e3a5f",lineHeight:1.8,fontStyle:"italic",fontFamily:"'Playfair Display',serif",position:"relative",zIndex:1}}>{step.body}</p>
    </div>
  );

  if(step.analogyStyle==="usb") return(
    <div style={{background:"linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)",borderRadius:20,padding:"28px 24px",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:-20,right:-20,fontSize:100,opacity:0.07,lineHeight:1,pointerEvents:"none"}}>🔌</div>
      <Label color="#6d28d9" light="#ddd6fe55"/>
      <div style={{display:"flex",gap:12,marginBottom:20,alignItems:"stretch",flexWrap:"wrap",position:"relative",zIndex:1}}>
        <div style={{flex:1,background:"#fef2f2",borderRadius:14,padding:"16px",border:"1.5px solid #fecaca",minWidth:120}}>
          <div style={{fontSize:22,marginBottom:8}}>😤</div>
          <div style={{fontSize:11,color:"#b91c1c",fontWeight:800,letterSpacing:1,fontFamily:"Inter,sans-serif",marginBottom:6}}>BEFORE MCP</div>
          <div style={{fontSize:13,color:"#374151",fontFamily:"Inter,sans-serif",lineHeight:1.5}}>Custom cable for every device. Engineers rewrite integrations for each tool.</div>
        </div>
        <div style={{display:"flex",alignItems:"center",fontSize:24,color:"#9ca3af",fontWeight:700,flexShrink:0}}>→</div>
        <div style={{flex:1,background:"#f0fdf4",borderRadius:14,padding:"16px",border:"1.5px solid #bbf7d0",minWidth:120}}>
          <div style={{fontSize:22,marginBottom:8}}>⚡</div>
          <div style={{fontSize:11,color:"#15803d",fontWeight:800,letterSpacing:1,fontFamily:"Inter,sans-serif",marginBottom:6}}>AFTER MCP</div>
          <div style={{fontSize:13,color:"#374151",fontFamily:"Inter,sans-serif",lineHeight:1.5}}>One standard plug. Any MCP-compatible tool connects instantly.</div>
        </div>
      </div>
      <p style={{fontSize:17,color:"#4c1d95",lineHeight:1.8,fontStyle:"italic",fontFamily:"'Playfair Display',serif",position:"relative",zIndex:1,borderTop:"1px solid #ddd6fe",paddingTop:16}}>{step.body}</p>
    </div>
  );

  // Default: full-bleed magazine pull quote
  return(
    <div style={{background:`linear-gradient(135deg,${cm.color}ee 0%,${cm.color}bb 100%)`,borderRadius:20,padding:"32px 28px",overflow:"hidden",position:"relative",minHeight:160}}>
      {/* Large decorative quote mark */}
      <div style={{position:"absolute",top:-10,left:16,fontSize:120,color:"rgba(255,255,255,0.12)",fontFamily:"'Playfair Display',serif",lineHeight:1,pointerEvents:"none",userSelect:"none"}}>"</div>
      <div style={{position:"absolute",bottom:-20,right:16,fontSize:120,color:"rgba(255,255,255,0.08)",fontFamily:"'Playfair Display',serif",lineHeight:1,pointerEvents:"none",userSelect:"none",transform:"rotate(180deg)"}}>"</div>
      <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.2)",borderRadius:999,padding:"4px 12px",marginBottom:20}}>
        <span style={{fontSize:13}}>💡</span>
        <span style={{fontSize:11,color:"rgba(255,255,255,0.9)",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"Inter,sans-serif"}}>Analogy</span>
      </div>
      <p style={{fontSize:21,color:"#fff",lineHeight:1.9,fontStyle:"italic",fontWeight:700,fontFamily:"'Playfair Display',serif",position:"relative",zIndex:1,textShadow:"0 1px 4px rgba(0,0,0,0.15)"}}>{step.body}</p>
    </div>
  );
}

// ── STEP TYPE CONFIG ──────────────────────────────────────────────────────────
const STEP_CONFIG = {
  explain:     {label:"Explanation",    color:null},
  detail:      {label:"Deep Dive",      color:null},
  realworld:   {label:"In the Real World", color:"#059669"},
  misconception:{label:"Common Misconception", color:"#dc2626"},
  scenario:    {label:"You'd Use This When…", color:"#d97706"},
  connect:     {label:"Connect the Dots", color:"#7c3aed"},
  analogy:     {label:"Analogy",        color:null},
  diagram:     {label:"Visual",         color:null},
};

// ── TOPICS ────────────────────────────────────────────────────────────────────
import TOPICS from "./topics.js";
const BADGES=[{id:"first-step",label:"First Step",icon:"🚀",desc:"Complete your first topic"},{id:"prompt-padawan",label:"Prompt Padawan",icon:"✍️",desc:"Complete the prompting topic"},{id:"on-a-roll",label:"On a Roll",icon:"🔥",desc:"3-day streak"},{id:"week-warrior",label:"Week Warrior",icon:"⚔️",desc:"7-day streak"},{id:"agent-aware",label:"Agent Aware",icon:"🤖",desc:"Complete all agent topics"},{id:"vibe-coder",label:"Vibe Coder",icon:"💻",desc:"Reach Vibe Coder level"},{id:"deep-diver",label:"Deep Diver",icon:"🌊",desc:"Complete all Advanced topics"},{id:"explorer",label:"Explorer",icon:"🧭",desc:"One topic in every category"}];
const LEVELS=[{label:"Curious",min:0,max:199},{label:"Learner",min:200,max:499},{label:"Builder",min:500,max:999},{label:"Practitioner",min:1000,max:1999},{label:"Vibe Coder",min:2000,max:Infinity}];
const CAT={Foundations:{color:"#6366f1",bg:"#eef2ff",light:"#e0e7ff"},Skills:{color:"#0891b2",bg:"#ecfeff",light:"#cffafe"},Infrastructure:{color:"#059669",bg:"#ecfdf5",light:"#bbf7d0"},Agents:{color:"#d97706",bg:"#fffbeb",light:"#fde68a"},Governance:{color:"#db2777",bg:"#fdf2f8",light:"#fbcfe8"}};
const F={fontFamily:"Inter,sans-serif"};

function getLevel(xp){return LEVELS.find(l=>xp>=l.min&&xp<=l.max)||LEVELS[0];}
function getLvlPct(xp){const l=getLevel(xp);if(l.max===Infinity)return 100;return Math.round(((xp-l.min)/(l.max-l.min+1))*100);}
const SK="vibelearn-v6";
async function loadState(){try{const v=localStorage.getItem(SK);if(v)return JSON.parse(v);}catch{}return null;}
async function saveState(s){try{localStorage.setItem(SK,JSON.stringify(s));}catch{}}
function defaultState(){return{xp:0,completed:[],badges:[],streak:0,longestStreak:0,lastCompletedDate:null,exerciseRunsToday:{},seenIntro:false};}
function checkBadges(s){
  const e=[...s.badges];const add=id=>{if(!e.includes(id))e.push(id);};
  if(s.completed.length>=1)add("first-step");
  if(s.completed.includes("prompt")||s.completed.includes("prompt-engineering"))add("prompt-padawan");
  if(s.streak>=3)add("on-a-roll");if(s.streak>=7)add("week-warrior");if(s.xp>=2000)add("vibe-coder");
  if(TOPICS.filter(t=>t.category==="Agents").every(t=>s.completed.includes(t.slug)))add("agent-aware");
  if(TOPICS.filter(t=>t.difficulty==="Advanced").every(t=>s.completed.includes(t.slug)))add("deep-diver");
  const cats=[...new Set(TOPICS.map(t=>t.category))];
  if(cats.every(c=>TOPICS.filter(t=>t.category===c).some(t=>s.completed.includes(t.slug))))add("explorer");
  return e;
}
function updateStreak(s){
  const today=new Date().toDateString();if(s.lastCompletedDate===today)return s;
  const yest=new Date();yest.setDate(yest.getDate()-1);
  const ns=s.lastCompletedDate===yest.toDateString()?s.streak+1:1;
  return{...s,streak:ns,longestStreak:Math.max(ns,s.longestStreak),lastCompletedDate:today};
}
async function callClaude(p){
  const r=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:p})});
  if(!r.ok)throw new Error(r.status);
  const d=await r.json();return d.content?.[0]?.text||"";
}

function Chip({label,color,bg,small}){return <span style={{background:bg,color,borderRadius:999,padding:small?"2px 9px":"3px 12px",fontSize:small?11:12,fontWeight:600,...F,display:"inline-block"}}>{label}</span>;}

function XPToast({xp,k}){
  const[vis,setVis]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>setVis(false),2200);return()=>clearTimeout(t);},[k]);
  if(!vis)return null;
  return <div className="vl-pop" style={{position:"fixed",top:76,right:20,background:"#6366f1",color:"#fff",borderRadius:12,padding:"10px 20px",fontSize:14,fontWeight:700,...F,boxShadow:"0 8px 24px rgba(99,102,241,0.4)",zIndex:888}}>+{xp} XP ✨</div>;
}

function BadgeModal({badge,onClose}){
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,backdropFilter:"blur(8px)"}}>
      <div className="vl-pop" onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:28,padding:"44px 40px",textAlign:"center",maxWidth:320,width:"90%",boxShadow:"0 30px 80px rgba(0,0,0,0.22)"}}>
        <div className="vl-float" style={{fontSize:60,marginBottom:16}}>{badge.icon}</div>
        <div style={{fontSize:11,color:"#6366f1",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8,...F}}>Badge Unlocked</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#111827",marginBottom:8}}>{badge.label}</div>
        <div style={{fontSize:14,color:"#6b7280",marginBottom:28,lineHeight:1.6,...F}}>{badge.desc}</div>
        <button onClick={onClose} className="vl-btn" style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:14,padding:"13px 34px",fontSize:15,fontWeight:700,...F}}>Keep going →</button>
      </div>
    </div>
  );
}

function IntroCard({onDismiss}){
  const steps=["Read a short lesson: broken into focused cards","Answer 3 questions to prove you got it and earn XP","Try the concept live with real AI","Level up, earn badges, build a daily streak"];
  return(
    <div className="vl-slide" style={{background:"#6366f1",borderRadius:20,padding:"28px 24px 24px",marginBottom:20}}>
      <div style={{fontSize:11,color:"#a5b4fc",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12,...F}}>Welcome to VibeLearn</div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:800,color:"#fff",marginBottom:24,lineHeight:1.2}}>AI literacy in 5 minutes a topic.</div>
      <div style={{display:"flex",flexDirection:"column",gap:0,marginBottom:24,border:"1px solid rgba(255,255,255,0.15)",borderRadius:14,overflow:"hidden"}}>
        {steps.map((text,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:i%2===0?"rgba(255,255,255,0.06)":"transparent",borderBottom:i<steps.length-1?"1px solid rgba(255,255,255,0.1)":"none"}}>
            <div style={{width:24,height:24,borderRadius:999,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff",flexShrink:0,...F}}>{i+1}</div>
            <span style={{fontSize:15,color:"#e0e7ff",lineHeight:1.6,...F}}>{text}</span>
          </div>
        ))}
      </div>
      <button onClick={onDismiss} className="vl-btn" style={{background:"#fff",color:"#6366f1",border:"none",borderRadius:12,padding:"13px 28px",fontSize:15,fontWeight:700,...F,width:"100%"}}>Start Learning →</button>
    </div>
  );
}

// ── LESSON VIEW ───────────────────────────────────────────────────────────────
function LessonView({topic,appState,persist,onBack}){
  const[phase,setPhase]=useState("steps");
  const[stepIdx,setStepIdx]=useState(0);
  const[quizIdx,setQuizIdx]=useState(0);
  const[selected,setSelected]=useState(null);
  const[qResult,setQResult]=useState(null);
  const[score,setScore]=useState(0);
  const[editPrompt,setEditPrompt]=useState(topic.try_it_prompt);
  const[aiOut,setAiOut]=useState("");
  const[aiLoad,setAiLoad]=useState(false);
  const[aiErr,setAiErr]=useState("");
  const[bdg,setBdg]=useState(null);
  const[xpAmt,setXpAmt]=useState(null);
  const[xpKey,setXpKey]=useState(0);
  const[whyLoad,setWhyLoad]=useState(false);
  const[whyText,setWhyText]=useState("");

  const cm=CAT[topic.category]||{color:"#6366f1",bg:"#eef2ff",light:"#e0e7ff"};
  const done=appState.completed.includes(topic.slug);
  const step=topic.steps[stepIdx];
  const q=topic.quiz[quizIdx];
  const showXP=amt=>{setXpAmt(amt);setXpKey(k=>k+1);};

  const nextStep=()=>{
    if(stepIdx<topic.steps.length-1)setStepIdx(s=>s+1);
    else{setPhase("quiz");setQuizIdx(0);setScore(0);setSelected(null);setQResult(null);setWhyText("");}
  };

  const pickAnswer=async i=>{
    if(qResult)return;
    setSelected(i);
    const ok=i===q.answer;
    setQResult(ok?"correct":"wrong");
    if(ok)setScore(s=>s+1);
    else{
      setWhyLoad(true);
      try{
        const expl=await callClaude(`A student learning about "${topic.title}" answered this question wrong.\n\nQuestion: "${q.q}"\nThey chose: "${q.opts[i]}"\nCorrect answer: "${q.opts[q.answer]}"\n\nIn 2-3 sentences, explain clearly why their answer was wrong and why the correct answer is right. Be direct, educational, and specific to this topic.`);
        setWhyText(expl);
      }catch{setWhyText("");}
      setWhyLoad(false);
    }
  };

  const nextQuiz=()=>{
    const fs=score+(qResult==="correct"?1:0);
    if(quizIdx<topic.quiz.length-1){setQuizIdx(qi=>qi+1);setSelected(null);setQResult(null);setWhyText("");}
    else{
      if(fs>=2){
        if(!done){
          let s={...appState,completed:[...appState.completed,topic.slug],xp:appState.xp+50};
          s=updateStreak(s);s.badges=checkBadges(s);
          const nw=s.badges.filter(b=>!appState.badges.includes(b));
          if(nw.length)setBdg(BADGES.find(b=>b.id===nw[0]));
          persist(s);showXP(50);
        }
        setPhase("try");
      } else setPhase("retry");
    }
  };

  const runEx=async()=>{
    if(aiLoad)return;
    const today=new Date().toDateString();
    const runs=appState.exerciseRunsToday?.[topic.slug]?.date===today?appState.exerciseRunsToday[topic.slug].count:0;
    if(runs>=3){setAiErr("Daily limit reached (3/day). Come back tomorrow!");return;}
    setAiLoad(true);setAiErr("");setAiOut("");
    try{
      const text=await callClaude(editPrompt);setAiOut(text);
      let s={...appState,xp:appState.xp+10,exerciseRunsToday:{...appState.exerciseRunsToday,[topic.slug]:{date:today,count:runs+1}}};
      s.badges=checkBadges(s);persist(s);showXP(10);
    }catch{setAiErr("Try It Live works on desktop in the Claude.ai chat window.");}
    setAiLoad(false);
  };

  const fs=Math.min(score+(qResult==="correct"?1:0), topic.quiz.length);
  const dc={Beginner:{color:"#16a34a",bg:"#f0fdf4"},Intermediate:{color:"#d97706",bg:"#fffbeb"},Advanced:{color:"#dc2626",bg:"#fef2f2"}}[topic.difficulty];

  const stepLabel=(type)=>{
    const cfg=STEP_CONFIG[type];
    return cfg?.label||type;
  };
  const stepColor=(type)=>{
    const cfg=STEP_CONFIG[type];
    return cfg?.color||cm.color;
  };

  return(
    <div style={{background:"#f5f4f0",minHeight:"100vh",...F,paddingBottom:60}}>
      {bdg&&<BadgeModal badge={bdg} onClose={()=>setBdg(null)}/>}
      {xpAmt&&<XPToast xp={xpAmt} k={xpKey}/>}
      <div style={{background:"rgba(255,255,255,0.94)",backdropFilter:"blur(12px)",borderBottom:"1px solid #ebe8e0",padding:"13px 20px",position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",gap:12}}>
        <button className="vl-back" onClick={onBack} style={{background:"none",border:"none",color:"#9ca3af",fontSize:14,fontWeight:600,cursor:"pointer",...F,transition:"color 0.15s",padding:0}}>← Back</button>
        <span style={{color:"#e5e7eb"}}>·</span>
        <Chip label={topic.category} color={cm.color} bg={cm.bg}/>
        {done&&<Chip label="✓ Done" color="#16a34a" bg="#f0fdf4"/>}
      </div>

      <div style={{maxWidth:880,margin:"0 auto",padding:"32px 24px"}}>
        <div style={{textAlign:"center",marginBottom:24}} className="vl-fade">
          <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:12}}><Chip label={topic.difficulty} color={dc.color} bg={dc.bg}/></div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:800,color:"#111827",lineHeight:1.2,marginBottom:10}}>{topic.title}</h1>
          <p style={{fontSize:17,color:"#9ca3af",lineHeight:1.6,...F}}>{topic.short}</p>
        </div>

        {/* STEPS */}
        {phase==="steps"&&(
          <div className="vl-fi" key={stepIdx}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{fontSize:14,color:"#9ca3af",fontWeight:600,...F}}>Step {stepIdx+1} of {topic.steps.length}</span>
              <div style={{display:"flex",gap:5}}>
                {topic.steps.map((_,i)=>(<div key={i} style={{width:i===stepIdx?20:7,height:7,borderRadius:999,background:i<stepIdx?"#6366f1":i===stepIdx?"#6366f1":"#e5e2da",opacity:i<stepIdx?0.45:1,transition:"all 0.3s"}}/>))}
              </div>
            </div>
            <div className="vl-card-in" style={{marginBottom:16}}>
              {step.type==="diagram"?(
                <div style={{background:"#fff",borderRadius:20,padding:"32px 28px",boxShadow:"0 2px 18px rgba(0,0,0,0.07)",border:"1px solid #ebe8e0"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
                    <div style={{width:3,height:16,borderRadius:2,background:cm.color,flexShrink:0}}/>
                    <span style={{fontSize:11,color:cm.color,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",...F}}>{step.heading}</span>
                  </div>
                  <div style={{background:"#f9f8f5",borderRadius:12,padding:"18px 10px",border:"1px solid #ebe8e0"}}>{Diagrams[step.diagramKey]?.()}</div>
                </div>
              ):step.type==="analogy"?(
                <AnalogyCard step={step} cm={cm}/>
              ):step.type==="misconception"?(
                /* RED WARNING CARD */
                <div style={{background:"linear-gradient(135deg,#fff1f2 0%,#ffe4e6 100%)",borderRadius:20,padding:"32px 28px",border:"1.5px solid #fecdd3",overflow:"hidden",position:"relative"}}>
                  <div style={{position:"absolute",top:-15,right:-15,fontSize:90,opacity:0.06,lineHeight:1,pointerEvents:"none"}}>⚠️</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#dc2626",borderRadius:999,padding:"5px 14px",marginBottom:18}}>
                    <span style={{fontSize:12}}>⚠️</span>
                    <span style={{fontSize:11,color:"#fff",fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",...F}}>Common Misconception</span>
                  </div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#9f1239",lineHeight:1.3,marginBottom:16}}>{step.heading}</p>
                  <p style={{fontSize:20,color:"#374151",lineHeight:2.0,...F}}>{step.body}</p>
                </div>
              ):step.type==="realworld"?(
                /* GREEN SPOTLIGHT CARD */
                <div style={{background:"linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)",borderRadius:20,padding:"32px 28px",border:"1.5px solid #bbf7d0",overflow:"hidden",position:"relative"}}>
                  <div style={{position:"absolute",top:-15,right:-15,fontSize:90,opacity:0.07,lineHeight:1,pointerEvents:"none"}}>🌍</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#16a34a",borderRadius:999,padding:"5px 14px",marginBottom:18}}>
                    <span style={{fontSize:12}}>🌍</span>
                    <span style={{fontSize:11,color:"#fff",fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",...F}}>In the Real World</span>
                  </div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#14532d",lineHeight:1.3,marginBottom:16}}>{step.heading}</p>
                  <p style={{fontSize:20,color:"#374151",lineHeight:2.0,...F}}>{step.body}</p>
                </div>
              ):step.type==="scenario"?(
                /* AMBER SCENARIO CARD */
                <div style={{background:"linear-gradient(135deg,#fffbeb 0%,#fef9c3 100%)",borderRadius:20,padding:"32px 28px",border:"1.5px solid #fde68a",overflow:"hidden",position:"relative"}}>
                  <div style={{position:"absolute",top:-15,right:-15,fontSize:90,opacity:0.07,lineHeight:1,pointerEvents:"none"}}>💼</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#d97706",borderRadius:999,padding:"5px 14px",marginBottom:18}}>
                    <span style={{fontSize:12}}>💼</span>
                    <span style={{fontSize:11,color:"#fff",fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",...F}}>You'd Use This When…</span>
                  </div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#78350f",lineHeight:1.3,marginBottom:16}}>{step.heading}</p>
                  <p style={{fontSize:20,color:"#374151",lineHeight:2.0,...F}}>{step.body}</p>
                </div>
              ):step.type==="connect"?(
                /* PURPLE CONNECT CARD */
                <div style={{background:"linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)",borderRadius:20,padding:"32px 28px",border:"1.5px solid #ddd6fe",overflow:"hidden",position:"relative"}}>
                  <div style={{position:"absolute",top:-15,right:-15,fontSize:90,opacity:0.07,lineHeight:1,pointerEvents:"none"}}>🔗</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#7c3aed",borderRadius:999,padding:"5px 14px",marginBottom:18}}>
                    <span style={{fontSize:12}}>🔗</span>
                    <span style={{fontSize:11,color:"#fff",fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",...F}}>Connect the Dots</span>
                  </div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#4c1d95",lineHeight:1.3,marginBottom:16}}>{step.heading}</p>
                  <p style={{fontSize:20,color:"#374151",lineHeight:2.0,...F}}>{step.body}</p>
                </div>
              ):(
                /* DEFAULT: explain / detail */
                <div style={{background:"#fff",borderRadius:20,padding:"32px 28px",boxShadow:"0 2px 18px rgba(0,0,0,0.07)",border:"1px solid #ebe8e0"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                    <div style={{width:3,height:16,borderRadius:2,background:cm.color,flexShrink:0}}/>
                    <span style={{fontSize:11,color:cm.color,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",...F}}>{stepLabel(step.type)}</span>
                  </div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#111827",lineHeight:1.3,marginBottom:16}}>{step.heading}</p>
                  <p style={{fontSize:20,color:"#374151",lineHeight:2.0,...F}}>{step.body}</p>
                </div>
              )}
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"space-between",alignItems:"center"}}>
              <button onClick={()=>setStepIdx(s=>s-1)} disabled={stepIdx===0} className="vl-btn" style={{background:"#fff",border:"1.5px solid #e5e2da",color:"#9ca3af",borderRadius:12,padding:"11px 20px",fontSize:14,fontWeight:600,...F,opacity:stepIdx===0?0.3:1}}>←</button>
              <button onClick={nextStep} className="vl-btn" style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:12,padding:"11px 28px",fontSize:14,fontWeight:700,...F,flex:1,maxWidth:220}}>
                {stepIdx<topic.steps.length-1?"Continue →":"Take the Quiz →"}
              </button>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase==="quiz"&&(
          <div className="vl-fi" key={`q${quizIdx}`}>
            <div style={{textAlign:"center",marginBottom:18}}>
              <div style={{fontSize:11,color:"#6366f1",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8,...F}}>Knowledge Check</div>
              <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                {topic.quiz.map((_,i)=>(
                  <div key={i} style={{width:28,height:28,borderRadius:999,background:i<quizIdx?"#6366f1":i===quizIdx?"#eef2ff":"#f3f4f6",border:i===quizIdx?"2px solid #6366f1":"2px solid transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:i<quizIdx?"#fff":i===quizIdx?"#6366f1":"#9ca3af",...F,transition:"all 0.2s"}}>
                    {i<quizIdx?"✓":i+1}
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:20,padding:"28px 24px",boxShadow:"0 2px 18px rgba(0,0,0,0.07)",border:"1px solid #ebe8e0",marginBottom:14}}>
              <p style={{fontSize:24,fontWeight:800,color:"#111827",lineHeight:1.35,marginBottom:24,fontFamily:"'Playfair Display',serif"}}>{q.q}</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {q.opts.map((opt,i)=>{
                  let bg="#f9f8f5",border="1.5px solid #e5e2da",color="#374151",icon=String.fromCharCode(65+i),shadow="none";
                  if(qResult&&selected===i&&qResult==="correct"){bg="#f0fdf4";border="2px solid #22c55e";color="#15803d";icon="✓";shadow="0 0 0 4px rgba(34,197,94,0.15)";}
                  else if(qResult&&selected===i&&qResult==="wrong"){bg="#fef2f2";border="2px solid #ef4444";color="#dc2626";icon="✗";shadow="0 0 0 4px rgba(239,68,68,0.15)";}
                  else if(qResult&&i===q.answer){bg="#f0fdf4";border="2px solid #22c55e";color="#15803d";icon="✓";}
                  return(
                    <button key={i} onClick={()=>pickAnswer(i)} disabled={!!qResult} className="vl-opt vl-btn"
                      style={{background:bg,border,color,borderRadius:14,padding:"16px 20px",fontSize:18,fontWeight:600,textAlign:"left",...F,display:"flex",alignItems:"center",gap:12,boxShadow:shadow,transition:"all 0.18s"}}>
                      <span style={{width:30,height:30,borderRadius:999,
                        background:qResult&&selected===i&&qResult==="correct"?"#22c55e":qResult&&selected===i&&qResult==="wrong"?"#ef4444":qResult&&i===q.answer?"#22c55e":"#e5e2da",
                        color:qResult&&(selected===i||i===q.answer)?"#fff":"#9ca3af",
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0,transition:"all 0.2s"}}>{icon}</span>
                      <span style={{flex:1}}>{opt}</span>
                    </button>
                  );
                })}
              </div>
              {qResult&&(
                <div className="vl-fi" style={{marginTop:16}}>
                  {qResult==="correct"?(
                    <div style={{padding:"14px 18px",borderRadius:12,background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",border:"1.5px solid #86efac",display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:36,height:36,borderRadius:999,background:"#22c55e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>✓</div>
                      <div>
                        <div style={{fontSize:17,fontWeight:800,color:"#15803d",...F}}>Correct!</div>
                        <div style={{fontSize:13,color:"#16a34a",...F}}>Well done: keep going.</div>
                      </div>
                    </div>
                  ):(
                    <div style={{borderRadius:14,overflow:"hidden",boxShadow:"0 2px 12px rgba(239,68,68,0.12)"}}>
                      <div style={{padding:"14px 18px",background:"linear-gradient(135deg,#fef2f2,#ffe4e6)",border:"1.5px solid #fca5a5",display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:36,height:36,borderRadius:999,background:"#ef4444",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,color:"#fff"}}>✗</div>
                        <div>
                          <div style={{fontSize:17,fontWeight:800,color:"#dc2626",...F}}>Not quite</div>
                          <div style={{fontSize:13,color:"#ef4444",...F}}>Correct answer highlighted above.</div>
                        </div>
                      </div>
                      {(whyLoad||whyText)&&(
                        <div style={{padding:"16px 18px",background:"#fff",borderLeft:"1.5px solid #fca5a5",borderRight:"1.5px solid #fca5a5",borderBottom:"1.5px solid #fca5a5",borderRadius:"0 0 14px 14px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                            <div style={{width:3,height:14,borderRadius:2,background:"#6366f1",flexShrink:0}}/>
                            <span style={{fontSize:11,color:"#6366f1",fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",...F}}>Why was I wrong?</span>
                          </div>
                          {whyLoad
                            ?<div style={{fontSize:13,color:"#9ca3af",...F,display:"flex",alignItems:"center",gap:8}}><span className="vl-pulse" style={{display:"inline-block"}}>●</span> Explaining…</div>
                            :<p style={{fontSize:19,color:"#374151",lineHeight:1.85,...F}}>{whyText}</p>
                          }
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            {qResult&&<div style={{textAlign:"right"}} className="vl-fi">
              <button onClick={nextQuiz} className="vl-btn" style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:12,padding:"11px 26px",fontSize:14,fontWeight:700,...F}}>
                {quizIdx<topic.quiz.length-1?"Next →":"See Results →"}
              </button>
            </div>}
          </div>
        )}

        {/* RETRY */}
        {phase==="retry"&&(
          <div className="vl-fi" style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#111827",marginBottom:8}}>Almost there!</div>
            <p style={{fontSize:14,color:"#6b7280",marginBottom:28,lineHeight:1.6,...F}}>You got {fs}/{topic.quiz.length}. Review the lesson and try again.</p>
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={()=>{setPhase("steps");setStepIdx(0);}} className="vl-btn" style={{background:"#fff",border:"1.5px solid #e5e2da",color:"#374151",borderRadius:12,padding:"11px 22px",fontSize:14,fontWeight:600,...F}}>← Review</button>
              <button onClick={()=>{setPhase("quiz");setQuizIdx(0);setScore(0);setSelected(null);setQResult(null);setWhyText("");}} className="vl-btn" style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:12,padding:"11px 22px",fontSize:14,fontWeight:700,...F}}>Retry →</button>
            </div>
          </div>
        )}

        {/* TRY IT + COMPLETE */}
        {phase==="try"&&(
          <div className="vl-fi">
            <div style={{background:"#6366f1",borderRadius:20,padding:"28px 24px",marginBottom:18,textAlign:"center",boxShadow:"0 8px 32px rgba(99,102,241,0.28)"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:800,color:"#fff",marginBottom:6}}>{done?"Already mastered this one":"Lesson complete."}</div>
              <p style={{fontSize:14,color:"#c7d2fe",lineHeight:1.5,...F,marginBottom:20}}>{fs}/{topic.quiz.length} correct{!done?" · +50 XP earned":""}</p>
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                <button onClick={()=>{const text=`Just completed "${topic.title}" on VibeLearn: AI literacy that actually sticks. 🧠`;navigator.share?navigator.share({text}):navigator.clipboard?.writeText(text);}} className="vl-btn" style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.25)",borderRadius:10,padding:"10px 18px",fontSize:13,fontWeight:600,...F}}>Share this lesson</button>
                <button onClick={onBack} className="vl-btn" style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.25)",borderRadius:10,padding:"10px 18px",fontSize:13,fontWeight:600,...F}}>Back to topics</button>
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:20,padding:"24px 22px",boxShadow:"0 2px 18px rgba(0,0,0,0.07)",border:"1px solid #ebe8e0",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{width:3,height:16,borderRadius:2,background:"#6366f1",flexShrink:0}}/>
                <span style={{fontSize:11,color:"#6366f1",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",...F}}>Try It Live</span>
                <span style={{fontSize:11,color:"#d1d5db",marginLeft:"auto",...F}}>+10 XP · max 3/day</span>
              </div>
              <p style={{fontSize:15,color:"#9ca3af",marginBottom:14,lineHeight:1.5,...F}}>Edit this prompt and hit Run for a real AI response.</p>
              <textarea value={editPrompt} onChange={e=>setEditPrompt(e.target.value)} style={{...F,width:"100%",background:"#f9f8f5",border:"1.5px solid #e5e2da",borderRadius:12,padding:"13px 14px",fontSize:14,color:"#374151",lineHeight:1.75,resize:"vertical",minHeight:90,transition:"all 0.15s"}}/>
              <button onClick={runEx} disabled={aiLoad} className="vl-btn" style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:12,padding:"11px 26px",fontSize:14,fontWeight:700,...F,marginTop:10,opacity:aiLoad?0.7:1}}>
                {aiLoad?"Running…":"▶  Run"}
              </button>
              {aiErr&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"11px",marginTop:10,fontSize:13,color:"#dc2626",...F}}>{aiErr}</div>}
              {aiOut&&<div style={{background:"#f9f8f5",border:"1px solid #e5e2da",borderRadius:12,padding:"16px",marginTop:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{width:3,height:14,borderRadius:2,background:"#059669",flexShrink:0}}/>
                  <span style={{fontSize:11,color:"#059669",fontWeight:700,letterSpacing:1,textTransform:"uppercase",...F}}>AI Response</span>
                </div>
                <div style={{fontSize:14,color:"#374151",lineHeight:1.85,whiteSpace:"pre-wrap",wordBreak:"break-word",...F}}>{aiOut}</div>
              </div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── TOPIC GROUP ───────────────────────────────────────────────────────────────
function TopicGroup({label,emoji,topics,completed,onOpen,locked,xpNeeded,userXP,defaultOpen}){
  const[open,setOpen]=useState(defaultOpen);
  const doneCount=topics.filter(t=>completed.includes(t.slug)).length;
  return(
    <div style={{marginBottom:14}}>
      <button onClick={()=>!locked&&setOpen(o=>!o)} style={{width:"100%",background:locked?"#f5f4f0":"#fff",border:locked?"1.5px dashed #d1d5db":"1.5px solid #ebe8e0",borderRadius:16,padding:"16px 20px",display:"flex",alignItems:"center",gap:14,cursor:locked?"default":"pointer",textAlign:"left",boxShadow:locked?"none":"0 2px 10px rgba(0,0,0,0.04)"}}>
        <span style={{fontSize:22,flexShrink:0}}>{locked?"🔒":emoji}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:15,fontWeight:700,color:locked?"#9ca3af":"#111827",...F,marginBottom:2}}>{label}</div>
          {locked?<div style={{fontSize:12,color:"#9ca3af",...F}}>Unlock at {xpNeeded} XP · you have {userXP} XP</div>:<div style={{fontSize:12,color:"#9ca3af",...F}}>{doneCount}/{topics.length} complete</div>}
        </div>
        {!locked&&<div style={{display:"flex",alignItems:"center",gap:10}}>
          {doneCount>0&&<div style={{background:"#f0fdf4",color:"#16a34a",borderRadius:999,padding:"3px 10px",fontSize:11,fontWeight:700,...F}}>{doneCount}/{topics.length}</div>}
          <span style={{color:"#d1d5db",fontSize:16,transition:"transform 0.2s",transform:open?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
        </div>}
      </button>
      {open&&!locked&&(
        <div className="vl-slide" style={{marginTop:6,display:"flex",flexDirection:"column",gap:8,paddingLeft:4,paddingRight:4}}>
          {topics.map((t,i)=>{
            const done=completed.includes(t.slug);
            const cm=CAT[t.category]||{color:"#6366f1",bg:"#eef2ff"};
            const hasDiagram=t.steps.some(s=>s.type==="diagram");
            return(
              <div key={t.slug} className="vl-hover vl-fade" onClick={()=>onOpen(t)}
                style={{animationDelay:`${i*0.04}s`,background:"#fff",borderRadius:16,padding:"16px 18px",boxShadow:"0 2px 10px rgba(0,0,0,0.05)",border:done?"1.5px solid #bbf7d0":"1.5px solid #ebe8e0",display:"flex",alignItems:"center",gap:16}}>
                <div style={{fontSize:30,flexShrink:0,width:42,textAlign:"center",lineHeight:1}}>{t.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap",alignItems:"center"}}>
                    <Chip label={t.category} color={cm.color} bg={cm.bg} small/>
                    {done&&<Chip label="✓ Done" color="#16a34a" bg="#f0fdf4" small/>}
                    {hasDiagram&&!done&&<Chip label="📊 Visual" color="#7c3aed" bg="#f5f3ff" small/>}
                  </div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:"#111827",marginBottom:4,lineHeight:1.3}}>{t.title}</div>
                  <div style={{fontSize:16,color:"#6b7280",lineHeight:1.6,...F,marginBottom:4}}>{t.short}</div>
                  <div style={{fontSize:11,color:"#b0a898",fontWeight:600,...F}}>~{t.steps.length+1} min</div>
                </div>
                <div style={{color:"#d1d5db",fontSize:18,flexShrink:0}}>→</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BadgesPanel({earned}){
  const[open,setOpen]=useState(false);
  return(
    <div style={{marginBottom:20}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",background:"#fff",border:"1.5px solid #ebe8e0",borderRadius:14,padding:"13px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:16}}>🏆</span>
          <span style={{fontSize:14,fontWeight:700,color:"#374151",...F}}>Achievements</span>
          <span style={{background:"#eef2ff",color:"#6366f1",borderRadius:999,padding:"2px 10px",fontSize:12,fontWeight:700,...F}}>{earned.length}/{BADGES.length}</span>
        </div>
        <span style={{color:"#d1d5db",fontSize:16,transition:"transform 0.2s",transform:open?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
      </button>
      {open&&(
        <div className="vl-slide" style={{background:"#fff",border:"1.5px solid #ebe8e0",borderTop:"none",borderRadius:"0 0 14px 14px",padding:"14px 16px",display:"flex",gap:8,flexWrap:"wrap"}}>
          {BADGES.map(b=>{
            const e=earned.includes(b.id);
            return(
              <div key={b.id} title={b.desc} style={{background:e?"#eef2ff":"#f5f4f0",border:`1.5px solid ${e?"#c7d2fe":"#e5e2da"}`,borderRadius:12,padding:"8px 12px",display:"flex",alignItems:"center",gap:8,opacity:e?1:0.5,filter:e?"none":"grayscale(0.6)",transition:"all 0.2s"}}>
                <span style={{fontSize:18}}>{e?b.icon:"🔒"}</span>
                <div><div style={{fontSize:11,fontWeight:700,color:e?"#374151":"#9ca3af",...F}}>{b.label}</div><div style={{fontSize:10,color:"#9ca3af",...F}}>{b.desc}</div></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
export default function VibeLearn(){
  const[st,setSt]=useState(null);
  const[view,setView]=useState("home");
  const[topic,setTopic]=useState(null);
  const[ready,setReady]=useState(false);

  useEffect(()=>{loadState().then(s=>{setSt(s||defaultState());setReady(true);});},[]);
  const persist=useCallback((s)=>{setSt(s);saveState(s);},[]);
  const openTopic=t=>{setTopic(t);setView("topic");setTimeout(()=>window.scrollTo({top:0,behavior:"smooth"}),40);};
  const dismissIntro=()=>{const s={...st,seenIntro:true};persist(s);};

  if(!ready||!st)return(
    <div style={{background:"#f5f4f0",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",...F}}>
      <div style={{textAlign:"center"}}><div className="vl-pulse" style={{fontSize:44,marginBottom:16}}>✦</div><div style={{color:"#9ca3af",fontSize:15,fontWeight:500}}>Loading…</div></div>
    </div>
  );

  if(view==="topic"&&topic){
    return <LessonView topic={topic} appState={st} persist={persist} onBack={()=>{setView("home");setTimeout(()=>window.scrollTo({top:0}),40);}}/>;
  }

  const level=getLevel(st.xp);
  const lvlPct=getLvlPct(st.xp);
  const nextLvl=LEVELS.find(l=>l.min>level.min);
  const beginnerTopics=TOPICS.filter(t=>t.difficulty==="Beginner");
  const intermediateTopics=TOPICS.filter(t=>t.difficulty==="Intermediate");
  const advancedTopics=TOPICS.filter(t=>t.difficulty==="Advanced");
  const advancedLocked=st.xp<ADVANCED_XP_GATE;
  const allOrdered=[...beginnerTopics,...intermediateTopics,...(advancedLocked?[]:[...advancedTopics])];
  const recommended=allOrdered.find(t=>!st.completed.includes(t.slug));

  return(
    <div style={{background:"#f5f4f0",minHeight:"100vh",...F,paddingBottom:80}}>
      <div style={{background:"#fff",borderBottom:"1px solid #ebe8e0",padding:"14px 20px"}}>
        <div style={{maxWidth:880,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#111827",letterSpacing:-0.5,lineHeight:1}}>Vibe<span style={{color:"#6366f1"}}>Learn</span></div>
            <div style={{fontSize:11,color:"#9ca3af",marginTop:2,fontWeight:500}}>AI literacy for everyone</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{background:"#eef2ff",color:"#6366f1",borderRadius:999,padding:"4px 12px",fontSize:12,fontWeight:700}}>{level.label}</span>
                <span style={{background:"#fff7ed",color:"#d97706",borderRadius:999,padding:"4px 12px",fontSize:12,fontWeight:700,border:"1px solid #fed7aa"}}>🔥 {st.streak}d</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{background:"#f3f4f6",borderRadius:999,height:5,width:100,overflow:"hidden"}}>
                  <div className="vl-xp" style={{background:"linear-gradient(90deg,#6366f1,#818cf8)",height:"100%",width:`${lvlPct}%`,borderRadius:999}}/>
                </div>
                <span style={{fontSize:11,color:"#9ca3af",fontWeight:600}}>{st.xp}{nextLvl?`/${nextLvl.min}`:""} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:880,margin:"0 auto",padding:"24px 24px"}}>
        {!st.seenIntro&&<IntroCard onDismiss={dismissIntro}/>}

        {recommended&&st.seenIntro&&(
          <div style={{marginBottom:18}} className="vl-fade">
            <div style={{fontSize:11,color:"#9ca3af",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>⭐ Start Here</div>
            {(()=>{const t=recommended;const cm=CAT[t.category]||{color:"#6366f1",bg:"#eef2ff"};return(
              <div className="vl-hover" onClick={()=>openTopic(t)} style={{background:"linear-gradient(135deg,#6366f1 0%,#818cf8 100%)",borderRadius:18,padding:"20px 22px",boxShadow:"0 6px 24px rgba(99,102,241,0.28)",cursor:"pointer",display:"flex",alignItems:"center",gap:16}}>
                <div style={{fontSize:36,flexShrink:0}}>{t.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,color:"#c7d2fe",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Recommended Next</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:800,color:"#fff",lineHeight:1.2,marginBottom:4}}>{t.title}</div>
                  <div style={{fontSize:13,color:"#c7d2fe",lineHeight:1.4}}>{t.short}</div>
                </div>
                <div style={{color:"rgba(255,255,255,0.5)",fontSize:20,flexShrink:0}}>→</div>
              </div>
            );})()}
          </div>
        )}

        {st.seenIntro&&(
          <div style={{display:"flex",gap:10,marginBottom:20}} className="vl-fade">
            {[{label:"Done",value:`${st.completed.length}/${TOPICS.length}`},{label:"Badges",value:`${st.badges.length}/${BADGES.length}`},{label:"Best Streak",value:`${st.longestStreak}d`}].map((s,i)=>(
              <div key={i} style={{flex:1,background:"#fff",borderRadius:12,padding:"12px 14px",border:"1px solid #ebe8e0",textAlign:"center",boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
                <div style={{fontSize:16,fontWeight:800,color:"#111827",fontFamily:"'Playfair Display',serif"}}>{s.value}</div>
                <div style={{fontSize:11,color:"#9ca3af",fontWeight:600,marginTop:2}}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {st.seenIntro&&st.completed.length>0&&<BadgesPanel earned={st.badges}/>}

        <div style={{fontSize:11,color:"#9ca3af",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>All Topics</div>
        <TopicGroup label="Beginner" emoji="🟢" topics={beginnerTopics} completed={st.completed} onOpen={openTopic} locked={false} defaultOpen={true}/>
        <TopicGroup label="Intermediate" emoji="🟡" topics={intermediateTopics} completed={st.completed} onOpen={openTopic} locked={false} defaultOpen={st.completed.length>0}/>
        <TopicGroup label="Advanced" emoji="🔴" topics={advancedTopics} completed={st.completed} onOpen={openTopic} locked={advancedLocked} xpNeeded={ADVANCED_XP_GATE} userXP={st.xp} defaultOpen={false}/>
      </div>
    </div>
  );
}
