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
    body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
    .vl-hover{transition:transform 0.17s ease,box-shadow 0.17s ease;cursor:pointer;}
    .vl-hover:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(0,0,0,0.11)!important;}
    .vl-btn{transition:all 0.14s ease;cursor:pointer;}
    .vl-btn:hover:not(:disabled){transform:translateY(-1px);filter:brightness(1.06);}
    .vl-btn:active:not(:disabled){transform:translateY(0);}
    .vl-back:hover{color:#6366f1!important;}
    textarea{font-size:16px!important;}
    textarea:focus{outline:none!important;border-color:#6366f1!important;box-shadow:0 0 0 3px rgba(99,102,241,0.13)!important;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes popIn{0%{transform:scale(0.8);opacity:0}65%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
    @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes cardIn{from{opacity:0;transform:translateY(12px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes scoreCount{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
    .vl-fade{animation:fadeUp 0.36s ease both;}
    .vl-fi{animation:fadeIn 0.26s ease both;}
    .vl-pop{animation:popIn 0.32s ease both;}
    .vl-pulse{animation:pulse 1.6s ease infinite;}
    .vl-slide{animation:slideDown 0.22s ease both;}
    .vl-card-in{animation:cardIn 0.3s cubic-bezier(.34,1.56,.64,1) both;}
    .vl-score{animation:scoreCount 0.6s cubic-bezier(.34,1.56,.64,1) both;}
    .vl-xp{transition:width 1s cubic-bezier(.4,0,.2,1);}
    .vl-opt{transition:all 0.15s ease;cursor:pointer;}
    .vl-opt:not(:disabled):hover{transform:translateX(4px);}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-thumb{background:#d4d0c8;border-radius:3px;}
    .vl-card-body{font-size:16px;line-height:1.85;}
    @media(min-width:700px){.vl-card-body{font-size:18px!important;line-height:1.95!important;}}
    @media(max-width:480px){
      .vl-topic-card{padding:14px 14px!important;}
      .vl-topic-title{font-size:16px!important;}
    }
  `;
  document.head.appendChild(s);
}

const ADVANCED_XP_GATE = 200;

import Diagrams from "./diagrams.jsx";

// ── ANALOGY CARDS ─────────────────────────────────────────────────────────────
function AnalogyCard({step,cm}){
  const Label=({color,light})=>(
    <div style={{display:"inline-flex",alignItems:"center",gap:6,background:light||"rgba(255,255,255,0.2)",borderRadius:999,padding:"4px 12px",marginBottom:20}}>
      <span style={{fontSize:13}}>💡</span>
      <span style={{fontSize:13,color,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"Inter,sans-serif"}}>Analogy</span>
    </div>
  );

  if(step.analogyStyle==="contractor") return(
    <div style={{background:"linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%)",borderRadius:20,padding:"28px 24px",border:"none",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:-30,right:-30,fontSize:140,opacity:0.06,lineHeight:1,pointerEvents:"none"}}>🏗️</div>
      <Label color="#92400e" light="#fde68a55"/>
      <div style={{display:"flex",gap:12,marginBottom:22,flexWrap:"wrap",position:"relative",zIndex:1}}>
        <div style={{flex:1,background:"#fff",borderRadius:14,padding:"16px",boxShadow:"0 2px 12px rgba(217,119,6,0.15)",minWidth:130}}>
          <div style={{fontSize:13,color:"#b45309",fontWeight:800,marginBottom:8,fontFamily:"Inter,sans-serif",letterSpacing:1}}>❌ VAGUE</div>
          <div style={{fontSize:16,color:"#374151",fontFamily:"'Playfair Display',serif",fontWeight:700,lineHeight:1.4,marginBottom:6}}>"Fix my house"</div>
          <div style={{fontSize:13,color:"#ef4444",fontWeight:600,fontFamily:"Inter,sans-serif"}}>→ Frustrating results</div>
        </div>
        <div style={{flex:1,background:"#fff",borderRadius:14,padding:"16px",boxShadow:"0 2px 12px rgba(217,119,6,0.25)",minWidth:130}}>
          <div style={{fontSize:13,color:"#16a34a",fontWeight:800,marginBottom:8,fontFamily:"Inter,sans-serif",letterSpacing:1}}>✓ SPECIFIC</div>
          <div style={{fontSize:15,color:"#374151",fontFamily:"'Playfair Display',serif",fontWeight:700,lineHeight:1.4,marginBottom:6}}>"Replace 12×12 white subway tile, kitchen, by Friday"</div>
          <div style={{fontSize:13,color:"#16a34a",fontWeight:600,fontFamily:"Inter,sans-serif"}}>→ Exactly right</div>
        </div>
      </div>
      <p style={{fontSize:17,color:"#78350f",lineHeight:1.8,fontStyle:"italic",fontFamily:"'Playfair Display',serif",position:"relative",zIndex:1,borderTop:"1px solid #fde68a",paddingTop:16,marginTop:4}}>{step.body}</p>
    </div>
  );

  if(step.analogyStyle==="whiteboard") return(
    <div style={{background:"linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%)",borderRadius:20,padding:"28px 24px",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:-20,right:-20,fontSize:130,opacity:0.07,lineHeight:1,pointerEvents:"none"}}>🖊️</div>
      <Label color="#1d4ed8" light="#bfdbfe55"/>
      <div style={{background:"#fff",borderRadius:14,padding:"18px",marginBottom:20,boxShadow:"0 2px 12px rgba(37,99,235,0.12)",position:"relative",zIndex:1}}>
        <div style={{fontSize:13,color:"#6b7280",fontFamily:"Inter,sans-serif",marginBottom:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Context Window: filling up</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
          {["System prompt","Your msg","Doc 1","Doc 2","History"].map((t,i)=>(
            <span key={i} style={{background:"#eef2ff",color:"#6366f1",borderRadius:8,padding:"5px 10px",fontSize:13,fontFamily:"Inter,sans-serif",fontWeight:700}}>{t}</span>
          ))}
          <span style={{background:"#fef2f2",color:"#dc2626",borderRadius:8,padding:"5px 10px",fontSize:13,fontFamily:"Inter,sans-serif",fontWeight:800,border:"1.5px solid #fca5a5"}}>⚠️ FULL</span>
        </div>
        <div style={{background:"#f3f4f6",borderRadius:999,height:8,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(90deg,#6366f1,#f59e0b,#ef4444)",height:"100%",width:"92%",borderRadius:999}}/>
        </div>
        <div style={{fontSize:13,color:"#ef4444",fontWeight:700,fontFamily:"Inter,sans-serif",marginTop:6}}>92% full: oldest content will be dropped next</div>
      </div>
      <p style={{fontSize:17,color:"#1e3a5f",lineHeight:1.8,fontStyle:"italic",fontFamily:"'Playfair Display',serif",position:"relative",zIndex:1}}>{step.body}</p>
    </div>
  );

  if(step.analogyStyle==="usb") return(
    <div style={{background:"linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)",borderRadius:20,padding:"28px 24px",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:-20,right:-20,fontSize:130,opacity:0.07,lineHeight:1,pointerEvents:"none"}}>🔌</div>
      <Label color="#6d28d9" light="#ddd6fe55"/>
      <div style={{display:"flex",gap:12,marginBottom:20,alignItems:"stretch",flexWrap:"wrap",position:"relative",zIndex:1}}>
        <div style={{flex:1,background:"#fef2f2",borderRadius:14,padding:"16px",border:"1.5px solid #fecaca",minWidth:120}}>
          <div style={{fontSize:22,marginBottom:8}}>😤</div>
          <div style={{fontSize:13,color:"#b91c1c",fontWeight:800,letterSpacing:1,fontFamily:"Inter,sans-serif",marginBottom:6}}>BEFORE MCP</div>
          <div style={{fontSize:13,color:"#374151",fontFamily:"Inter,sans-serif",lineHeight:1.7}}>Custom cable for every device. Engineers rewrite integrations for each tool.</div>
        </div>
        <div style={{display:"flex",alignItems:"center",fontSize:24,color:"#6b7280",fontWeight:700,flexShrink:0}}>→</div>
        <div style={{flex:1,background:"#f0fdf4",borderRadius:14,padding:"16px",border:"1.5px solid #bbf7d0",minWidth:120}}>
          <div style={{fontSize:22,marginBottom:8}}>⚡</div>
          <div style={{fontSize:13,color:"#15803d",fontWeight:800,letterSpacing:1,fontFamily:"Inter,sans-serif",marginBottom:6}}>AFTER MCP</div>
          <div style={{fontSize:13,color:"#374151",fontFamily:"Inter,sans-serif",lineHeight:1.7}}>One standard plug. Any MCP-compatible tool connects instantly.</div>
        </div>
      </div>
      <p style={{fontSize:17,color:"#4c1d95",lineHeight:1.8,fontStyle:"italic",fontFamily:"'Playfair Display',serif",position:"relative",zIndex:1,borderTop:"1px solid #ddd6fe",paddingTop:16}}>{step.body}</p>
    </div>
  );

  return(
    <div style={{background:`linear-gradient(135deg,${cm.color}ee 0%,${cm.color}bb 100%)`,borderRadius:20,padding:"32px 28px",overflow:"hidden",position:"relative",minHeight:160}}>
      <div style={{position:"absolute",top:-10,left:16,fontSize:140,color:"rgba(255,255,255,0.12)",fontFamily:"'Playfair Display',serif",lineHeight:1,pointerEvents:"none",userSelect:"none"}}>"</div>
      <div style={{position:"absolute",bottom:-20,right:16,fontSize:140,color:"rgba(255,255,255,0.08)",fontFamily:"'Playfair Display',serif",lineHeight:1,pointerEvents:"none",userSelect:"none",transform:"rotate(180deg)"}}>"</div>
      <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.2)",borderRadius:999,padding:"4px 12px",marginBottom:20}}>
        <span style={{fontSize:13}}>💡</span>
        <span style={{fontSize:13,color:"rgba(255,255,255,0.9)",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"Inter,sans-serif"}}>Analogy</span>
      </div>
      <p style={{fontSize:21,color:"#fff",lineHeight:1.9,fontStyle:"italic",fontWeight:700,fontFamily:"'Playfair Display',serif",position:"relative",zIndex:1,textShadow:"0 1px 4px rgba(0,0,0,0.15)"}}>{step.body}</p>
    </div>
  );
}

// ── STEP TYPE CONFIG ──────────────────────────────────────────────────────────
const STEP_CONFIG={
  explain:{label:"Explanation",color:null},
  detail:{label:"Deep Dive",color:null},
  realworld:{label:"In the Real World",color:"#059669"},
  misconception:{label:"Common Misconception",color:"#dc2626"},
  scenario:{label:"You'd Use This When…",color:"#d97706"},
  connect:{label:"Connect the Dots",color:"#7c3aed"},
  analogy:{label:"Analogy",color:null},
  diagram:{label:"Visual",color:null},
};

// ── DATA ──────────────────────────────────────────────────────────────────────
import TOPICS from "./topics.js";

const CAT={
  Foundations:{color:"#6366f1",bg:"#eef2ff",light:"#e0e7ff"},
  Skills:{color:"#0891b2",bg:"#ecfeff",light:"#cffafe"},
  Infrastructure:{color:"#059669",bg:"#ecfdf5",light:"#bbf7d0"},
  Agents:{color:"#d97706",bg:"#fffbeb",light:"#fde68a"},
  Governance:{color:"#db2777",bg:"#fdf2f8",light:"#fbcfe8"},
};
const F={fontFamily:"Inter,sans-serif"};

// ── SKILL TRACKS ──────────────────────────────────────────────────────────────
const TRACKS=[
  {
    id:"ai-curious",
    label:"AI Curious",
    emoji:"🌱",
    tagline:"Understand what everyone's talking about",
    desc:"The essential concepts behind modern AI — explained without jargon.",
    color:"#6366f1",bg:"#eef2ff",border:"#c7d2fe",
    slugs:["llm","hallucination","token","context-window","multimodal","api","foundation-models","ai-sycophancy"],
  },
  {
    id:"ai-at-work",
    label:"AI at Work",
    emoji:"💼",
    tagline:"Get better at using AI every day",
    desc:"Practical skills for professionals using AI tools in their daily work.",
    color:"#0891b2",bg:"#ecfeff",border:"#a5f3fc",
    slugs:["prompt","prompt-engineering","ai-agent","agentic-ai","system-prompt","markdown","vibe-coding","ai-coding-tools"],
  },
  {
    id:"vibe-coder",
    label:"Vibe Coder",
    emoji:"⚡",
    tagline:"Build things with AI, no CS degree required",
    desc:"The technical building blocks behind AI products and applications.",
    color:"#059669",bg:"#ecfdf5",border:"#6ee7b7",
    slugs:["rag","fine-tuning","mcp","vector-database","embedding","inference-training","context-window","foundation-models"],
  },
  {
    id:"ai-governance-pro",
    label:"AI Governance Pro",
    emoji:"🛡️",
    tagline:"Lead responsible AI at your organization",
    desc:"Risk, safety, and governance frameworks for AI decision-makers.",
    color:"#db2777",bg:"#fdf2f8",border:"#f9a8d4",
    slugs:["ai-safety","ai-governance","ai-observability","prompt-injection","rsp","hallucination","ai-sycophancy","agentic-ai"],
  },
];

// ── DIAGNOSTIC QUESTIONS ──────────────────────────────────────────────────────
const DIAGNOSTIC=[
  {
    q:"When you hear 'the AI hallucinated,' what does that mean?",
    opts:["The AI had a dream","The AI generated false information confidently","The AI was slow to respond","The AI refused to answer"],
    answer:1,topic:"hallucination",
  },
  {
    q:"You want better results from ChatGPT. What's the most effective thing to do?",
    opts:["Refresh the page","Use shorter messages","Give more context and specific instructions","Switch to a different AI tool"],
    answer:2,topic:"prompt-engineering",
  },
  {
    q:"What does it mean when an AI tool has a 'context window'?",
    opts:["The size of the chat window on screen","How much text the AI can process at once","The number of topics the AI knows about","How fast the AI responds"],
    answer:1,topic:"context-window",
  },
  {
    q:"A company builds a customer service chatbot using Claude. What is Claude in this setup?",
    opts:["The chatbot itself","A plugin for the chatbot","The foundation model the chatbot is built on","The company's database"],
    answer:2,topic:"foundation-models",
  },
  {
    q:"What is a 'system prompt'?",
    opts:["The first message you type to an AI","Hidden instructions that shape how an AI behaves","A technical error message","The AI's training data"],
    answer:1,topic:"system-prompt",
  },
  {
    q:"You ask AI to fact-check a recent news story. How reliable is this?",
    opts:["Completely reliable — AI knows everything","Reliable for events before its training cutoff, unreliable for recent events","Unreliable for all events","Only reliable if you ask nicely"],
    answer:1,topic:"hallucination",
  },
  {
    q:"What does RAG stand for and why does it matter?",
    opts:["Random Answer Generation — AI picks random answers","Retrieval-Augmented Generation — AI looks up your docs before answering","Rapid AI Generation — makes AI faster","Real-time Answer Generation — AI searches the web"],
    answer:1,topic:"rag",
  },
  {
    q:"What is the difference between AI training and AI inference?",
    opts:["Training is expensive and done rarely; inference is cheap and happens constantly","They are the same thing","Training happens when you use AI; inference happens in the lab","Training is free; inference costs money"],
    answer:0,topic:"inference-training",
  },
  {
    q:"What is 'prompt injection'?",
    opts:["Giving an AI a very long prompt","A technique to make AI respond faster","An attack where hidden instructions override the AI's original purpose","Injecting medicine using AI guidance"],
    answer:2,topic:"prompt-injection",
  },
  {
    q:"An AI agent is different from a chatbot because it…",
    opts:["Uses better language","Can take actions in the world, not just answer questions","Costs more money","Requires more internet bandwidth"],
    answer:1,topic:"ai-agent",
  },
];

// ── SCORING ───────────────────────────────────────────────────────────────────
const SCORE_WEIGHTS={Beginner:4,Intermediate:6,Advanced:8};
function calcLiteracyScore(completed){
  const maxPossible=TOPICS.reduce((sum,t)=>sum+(SCORE_WEIGHTS[t.difficulty]||4),0);
  const earned=TOPICS.filter(t=>completed.includes(t.slug)).reduce((sum,t)=>sum+(SCORE_WEIGHTS[t.difficulty]||4),0);
  return Math.round((earned/maxPossible)*100);
}
function getScoreLabel(score){
  if(score===0)return{label:"Not Started",color:"#9ca3af"};
  if(score<25)return{label:"AI Curious",color:"#6366f1"};
  if(score<50)return{label:"AI Aware",color:"#0891b2"};
  if(score<75)return{label:"AI Capable",color:"#059669"};
  if(score<100)return{label:"AI Proficient",color:"#d97706"};
  return{label:"AI Literate",color:"#dc2626"};
}

// ── STATE ─────────────────────────────────────────────────────────────────────
const SK="vibelearn-v7";
async function loadState(){try{const v=localStorage.getItem(SK);if(v)return JSON.parse(v);}catch{}return null;}
async function saveState(s){try{localStorage.setItem(SK,JSON.stringify(s));}catch{}}
function defaultState(){return{xp:0,completed:[],badges:[],streak:0,longestStreak:0,lastCompletedDate:null,exerciseRunsToday:{},seenIntro:false,diagnosticDone:false,diagnosticTrack:null};}

function checkBadges(s){
  const e=[...s.badges];const add=id=>{if(!e.includes(id))e.push(id);};
  if(s.completed.length>=1)add("first-step");
  TRACKS.forEach(track=>{
    if(track.slugs.every(slug=>s.completed.includes(slug)))add(`track-${track.id}`);
  });
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

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function Chip({label,color,bg,small}){
  return <span style={{background:bg,color,borderRadius:999,padding:small?"2px 9px":"3px 12px",fontSize:small?11:12,fontWeight:600,...F,display:"inline-block"}}>{label}</span>;
}

function Toast({msg,k}){
  const[vis,setVis]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>setVis(false),2200);return()=>clearTimeout(t);},[k]);
  if(!vis)return null;
  return <div className="vl-pop" style={{position:"fixed",top:76,right:20,background:"#111827",color:"#fff",borderRadius:12,padding:"10px 20px",fontSize:14,fontWeight:700,...F,boxShadow:"0 8px 24px rgba(0,0,0,0.25)",zIndex:888}}>{msg}</div>;
}

function BadgeModal({badge,onClose}){
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,backdropFilter:"blur(8px)"}}>
      <div className="vl-pop" onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:28,padding:"44px 40px",textAlign:"center",maxWidth:320,width:"90%",boxShadow:"0 30px 80px rgba(0,0,0,0.22)"}}>
        <div style={{fontSize:60,marginBottom:16}}>{badge.icon}</div>
        <div style={{fontSize:13,color:"#6366f1",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8,...F}}>
          {badge.isTrack?"Track Complete!":"Badge Unlocked"}
        </div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#111827",marginBottom:8}}>{badge.label}</div>
        <div style={{fontSize:14,color:"#6b7280",marginBottom:28,lineHeight:1.7,...F}}>{badge.desc}</div>
        <button onClick={onClose} className="vl-btn" style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:14,padding:"13px 34px",fontSize:15,fontWeight:700,...F}}>Keep going →</button>
      </div>
    </div>
  );
}

// ── DIAGNOSTIC QUIZ ───────────────────────────────────────────────────────────
function DiagnosticQuiz({onComplete}){
  const[idx,setIdx]=useState(0);
  const[answers,setAnswers]=useState([]);
  const[selected,setSelected]=useState(null);
  const[answered,setAnswered]=useState(false);

  const q=DIAGNOSTIC[idx];
  const isLast=idx===DIAGNOSTIC.length-1;

  function pick(i){
    if(answered)return;
    setSelected(i);
    setAnswered(true);
  }

  function next(){
    const newAnswers=[...answers,{topic:q.topic,correct:selected===q.answer}];
    if(isLast){
      // Score and recommend track
      const wrongTopics=newAnswers.filter(a=>!a.correct).map(a=>a.topic);
      const score=newAnswers.filter(a=>a.correct).length;
      // Find best track match based on gaps
      let recommended=TRACKS[0];
      if(wrongTopics.some(t=>["rag","fine-tuning","mcp","vector-database","inference-training"].includes(t)))recommended=TRACKS[2];
      else if(wrongTopics.some(t=>["ai-safety","ai-governance","prompt-injection","rsp"].includes(t)))recommended=TRACKS[3];
      else if(wrongTopics.some(t=>["prompt-engineering","system-prompt","ai-agent","vibe-coding"].includes(t)))recommended=TRACKS[1];
      onComplete({score,total:DIAGNOSTIC.length,wrongTopics,recommendedTrack:recommended});
    } else {
      setAnswers(newAnswers);
      setIdx(i=>i+1);
      setSelected(null);
      setAnswered(false);
    }
  }

  return(
    <div style={{background:"#f5f4f0",minHeight:"100vh",...F}}>
      {/* Header */}
      <div style={{background:"#fff",borderBottom:"1px solid #ebe8e0",padding:"14px 20px"}}>
        <div style={{maxWidth:600,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#111827"}}>Vibe<span style={{color:"#6366f1"}}>Learn</span></div>
          <div style={{fontSize:13,color:"#6b7280",...F}}>Question {idx+1} of {DIAGNOSTIC.length}</div>
        </div>
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"32px 16px"}}>
        {/* Progress */}
        <div style={{background:"#f3f4f6",borderRadius:999,height:6,marginBottom:32,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(90deg,#6366f1,#818cf8)",height:"100%",width:`${(idx/DIAGNOSTIC.length)*100}%`,borderRadius:999,transition:"width 0.4s ease"}}/>
        </div>

        <div className="vl-fi" key={idx}>
          <div style={{fontSize:13,color:"#6366f1",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12,...F}}>AI Literacy Check · {idx+1}/{DIAGNOSTIC.length}</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:800,color:"#111827",lineHeight:1.3,marginBottom:28}}>{q.q}</div>

          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
            {q.opts.map((opt,i)=>{
              let bg="#fff",border="1.5px solid #e5e2da",color="#374151";
              if(answered&&i===q.answer){bg="#f0fdf4";border="2px solid #22c55e";color="#15803d";}
              else if(answered&&selected===i&&i!==q.answer){bg="#fef2f2";border="2px solid #ef4444";color="#dc2626";}
              return(
                <button key={i} onClick={()=>pick(i)} disabled={answered} className="vl-opt vl-btn"
                  style={{background:bg,border,color,borderRadius:14,padding:"16px 20px",fontSize:16,fontWeight:500,textAlign:"left",...F,display:"flex",alignItems:"center",gap:12,transition:"all 0.18s"}}>
                  <span style={{width:28,height:28,borderRadius:999,background:answered&&(i===q.answer||selected===i)?border.includes("22c55e")?"#22c55e":"#ef4444":"#f3f4f6",color:answered&&(i===q.answer||selected===i)?"#fff":"#9ca3af",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,flexShrink:0}}>
                    {answered&&i===q.answer?"✓":answered&&selected===i?"✗":String.fromCharCode(65+i)}
                  </span>
                  <span style={{flex:1}}>{opt}</span>
                </button>
              );
            })}
          </div>

          {answered&&(
            <button onClick={next} className="vl-btn" style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:14,padding:"16px 28px",fontSize:16,fontWeight:700,...F,width:"100%",boxShadow:"0 4px 16px rgba(99,102,241,0.3)"}}>
              {isLast?"See My Results →":"Next Question →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── DIAGNOSTIC RESULTS ────────────────────────────────────────────────────────
function DiagnosticResults({result,onStart,onExplore}){
  const{score,total,recommendedTrack}=result;
  const pct=Math.round((score/total)*100);

  return(
    <div style={{background:"#f5f4f0",minHeight:"100vh",...F}}>
      <div style={{background:"#fff",borderBottom:"1px solid #ebe8e0",padding:"14px 20px"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#111827"}}>Vibe<span style={{color:"#6366f1"}}>Learn</span></div>
        </div>
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"32px 16px"}}>
        <div className="vl-fade" style={{background:"#fff",borderRadius:20,padding:"32px 28px",boxShadow:"0 4px 24px rgba(0,0,0,0.06)",border:"1px solid #ebe8e0",marginBottom:20,textAlign:"center"}}>
          <div style={{fontSize:13,color:"#6366f1",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>Your Diagnostic Results</div>
          <div className="vl-score" style={{fontFamily:"'Playfair Display',serif",fontSize:72,fontWeight:800,color:"#111827",lineHeight:1,marginBottom:8}}>{score}<span style={{fontSize:32,color:"#9ca3af"}}>/{total}</span></div>
          <div style={{fontSize:16,color:"#6b7280",marginBottom:24}}>
            {pct===100?"Perfect score! You already know a lot.":pct>=70?"Strong foundation. A few gaps to close.":pct>=40?"Some familiarity. Good starting point.":"Just starting out. That's exactly what we're here for."}
          </div>

          <div style={{background:"#f9f8f5",borderRadius:14,padding:"20px",textAlign:"left",marginBottom:24}}>
            <div style={{fontSize:13,color:"#6b7280",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Recommended Track</div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{fontSize:36,flexShrink:0}}>{recommendedTrack.emoji}</div>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,color:"#111827",marginBottom:4}}>{recommendedTrack.label}</div>
                <div style={{fontSize:14,color:"#6b7280",lineHeight:1.5}}>{recommendedTrack.desc}</div>
              </div>
            </div>
          </div>

          <button onClick={()=>onStart(recommendedTrack)} className="vl-btn" style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:14,padding:"16px 28px",fontSize:16,fontWeight:700,...F,width:"100%",boxShadow:"0 4px 16px rgba(99,102,241,0.3)",marginBottom:10}}>
            Start {recommendedTrack.label} Track →
          </button>
          <button onClick={onExplore} className="vl-btn" style={{background:"transparent",color:"#6b7280",border:"1.5px solid #e5e2da",borderRadius:14,padding:"14px 28px",fontSize:15,fontWeight:600,...F,width:"100%"}}>
            Browse all topics instead
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SCORE CARD ────────────────────────────────────────────────────────────────
function ScoreCard({score,completed,onClose}){
  const{label,color}=getScoreLabel(score);
  const shareText=`My AI Literacy Score: ${score}/100 — "${label}" on VibeLearn. ${completed.length}/${TOPICS.length} topics complete. vibelearn-pi.vercel.app`;

  function share(){
    if(navigator.share){navigator.share({text:shareText});}
    else{navigator.clipboard?.writeText(shareText).then(()=>alert("Copied to clipboard!"));}
  }

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,backdropFilter:"blur(8px)",padding:16}}>
      <div className="vl-pop" onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:24,padding:"36px 32px",maxWidth:360,width:"100%",boxShadow:"0 30px 80px rgba(0,0,0,0.25)",textAlign:"center"}}>
        <div style={{fontSize:13,color:"#6366f1",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:16,...F}}>AI Literacy Score</div>
        <div className="vl-score" style={{fontFamily:"'Playfair Display',serif",fontSize:88,fontWeight:800,color,lineHeight:1,marginBottom:4}}>{score}</div>
        <div style={{fontSize:14,color:"#9ca3af",marginBottom:8,...F}}>out of 100</div>
        <div style={{display:"inline-block",background:color+"22",color,borderRadius:999,padding:"6px 18px",fontSize:15,fontWeight:700,marginBottom:20,...F}}>{label}</div>
        <div style={{background:"#f9f8f5",borderRadius:12,padding:"14px 16px",marginBottom:24}}>
          <div style={{fontSize:14,color:"#374151",lineHeight:1.6,...F}}>{completed.length} of {TOPICS.length} topics complete</div>
          {score<100&&<div style={{fontSize:13,color:"#6b7280",marginTop:4,...F}}>Complete more topics to raise your score</div>}
        </div>
        <button onClick={share} className="vl-btn" style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:12,padding:"14px 24px",fontSize:15,fontWeight:700,...F,width:"100%",marginBottom:10}}>Share My Score</button>
        <button onClick={onClose} className="vl-btn" style={{background:"transparent",color:"#6b7280",border:"none",fontSize:14,...F,width:"100%",cursor:"pointer"}}>Close</button>
      </div>
    </div>
  );
}

// ── TRACKS VIEW ───────────────────────────────────────────────────────────────
function TracksView({completed,onOpenTopic,onBack,activeTrack}){
  const[selected,setSelected]=useState(activeTrack||null);

  return(
    <div style={{background:"#f5f4f0",minHeight:"100vh",...F,paddingBottom:80}}>
      <div style={{background:"#fff",borderBottom:"1px solid #ebe8e0",padding:"14px 20px"}}>
        <div style={{maxWidth:880,margin:"0 auto",display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} className="vl-back vl-btn" style={{background:"none",border:"none",color:"#6b7280",fontSize:15,cursor:"pointer",...F,display:"flex",alignItems:"center",gap:4}}>← Back</button>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,color:"#111827"}}>Skill Tracks</div>
        </div>
      </div>

      <div style={{maxWidth:880,margin:"0 auto",padding:"24px 16px"}}>
        {!selected?(
          <>
            <div style={{fontSize:17,color:"#374151",lineHeight:1.7,marginBottom:24,...F}}>Choose a track to follow a curated learning path. Complete all topics in a track to earn a credential.</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {TRACKS.map(track=>{
                const done=track.slugs.filter(s=>completed.includes(s)).length;
                const total=track.slugs.length;
                const pct=Math.round((done/total)*100);
                const complete=done===total;
                return(
                  <div key={track.id} className="vl-hover" onClick={()=>setSelected(track)}
                    style={{background:"#fff",borderRadius:18,padding:"20px 22px",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",border:`1.5px solid ${complete?track.color:track.border}`,cursor:"pointer",position:"relative",overflow:"hidden"}}>
                    {complete&&<div style={{position:"absolute",top:0,right:0,background:track.color,color:"#fff",fontSize:13,fontWeight:700,padding:"4px 12px",borderRadius:"0 18px 0 12px",...F}}>✓ Complete</div>}
                    <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                      <div style={{fontSize:36,flexShrink:0}}>{track.emoji}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,color:"#111827",marginBottom:4}}>{track.label}</div>
                        <div style={{fontSize:14,color:"#6b7280",marginBottom:12,lineHeight:1.5,...F}}>{track.desc}</div>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{flex:1,background:"#f3f4f6",borderRadius:999,height:6,overflow:"hidden"}}>
                            <div style={{background:`linear-gradient(90deg,${track.color},${track.color}aa)`,height:"100%",width:`${pct}%`,borderRadius:999,transition:"width 0.8s ease"}}/>
                          </div>
                          <span style={{fontSize:13,color:track.color,fontWeight:700,flexShrink:0,...F}}>{done}/{total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ):(
          <TrackDetail track={selected} completed={completed} onOpenTopic={onOpenTopic} onBack={()=>setSelected(null)}/>
        )}
      </div>
    </div>
  );
}

function TrackDetail({track,completed,onOpenTopic,onBack}){
  const trackTopics=track.slugs.map(slug=>TOPICS.find(t=>t.slug===slug)).filter(Boolean);
  const done=trackTopics.filter(t=>completed.includes(t.slug)).length;
  const complete=done===trackTopics.length;
  const pct=Math.round((done/trackTopics.length)*100);

  function shareCredential(){
    const text=`I completed the "${track.label}" track on VibeLearn — AI literacy that actually sticks. 🎓 vibelearn-pi.vercel.app`;
    if(navigator.share){navigator.share({text});}
    else{navigator.clipboard?.writeText(text).then(()=>alert("Copied to clipboard!"));}
  }

  return(
    <div className="vl-fade">
      <button onClick={onBack} className="vl-back vl-btn" style={{background:"none",border:"none",color:"#6b7280",fontSize:14,cursor:"pointer",...F,display:"flex",alignItems:"center",gap:4,marginBottom:20}}>← All Tracks</button>

      {/* Track header */}
      <div style={{background:complete?`linear-gradient(135deg,${track.color} 0%,${track.color}cc 100%)`:"#fff",border:`2px solid ${track.border}`,borderRadius:20,padding:"24px",marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
          <div style={{fontSize:40}}>{track.emoji}</div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:800,color:complete?"#fff":"#111827"}}>{track.label}</div>
            <div style={{fontSize:14,color:complete?"rgba(255,255,255,0.8)":"#6b7280",lineHeight:1.4,...F}}>{track.tagline}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:complete?16:0}}>
          <div style={{flex:1,background:complete?"rgba(255,255,255,0.3)":"#f3f4f6",borderRadius:999,height:8,overflow:"hidden"}}>
            <div style={{background:complete?"#fff":`linear-gradient(90deg,${track.color},${track.color}aa)`,height:"100%",width:`${pct}%`,borderRadius:999,transition:"width 0.8s ease"}}/>
          </div>
          <span style={{fontSize:14,color:complete?"#fff":track.color,fontWeight:700,...F}}>{done}/{trackTopics.length} complete</span>
        </div>
        {complete&&(
          <button onClick={shareCredential} className="vl-btn" style={{background:"rgba(255,255,255,0.2)",color:"#fff",border:"1.5px solid rgba(255,255,255,0.4)",borderRadius:12,padding:"12px 20px",fontSize:14,fontWeight:700,...F,width:"100%"}}>
            🎓 Share My Credential
          </button>
        )}
      </div>

      {/* Topics */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {trackTopics.map((t,i)=>{
          const isDone=completed.includes(t.slug);
          const cm=CAT[t.category]||{color:"#6366f1",bg:"#eef2ff"};
          return(
            <div key={t.slug} className="vl-hover" onClick={()=>onOpenTopic(t)}
              style={{background:"#fff",borderRadius:14,padding:"16px 18px",border:isDone?"1.5px solid #bbf7d0":"1.5px solid #ebe8e0",display:"flex",alignItems:"center",gap:14,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
              <div style={{width:32,height:32,borderRadius:999,background:isDone?"#f0fdf4":"#f3f4f6",border:isDone?"2px solid #22c55e":"2px solid #e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:isDone?"#22c55e":"#9ca3af",flexShrink:0}}>
                {isDone?"✓":i+1}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,marginBottom:2}}><Chip label={t.category} color={cm.color} bg={cm.bg} small/></div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:isDone?"#6b7280":"#111827",textDecoration:isDone?"line-through":"none"}}>{t.title}</div>
              </div>
              {!isDone&&<div style={{color:"#9ca3af",fontSize:18,flexShrink:0}}>›</div>}
            </div>
          );
        })}
      </div>
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
  const[toastMsg,setToastMsg]=useState(null);
  const[toastKey,setToastKey]=useState(0);
  const[whyText,setWhyText]=useState("");
  const[whyLoad,setWhyLoad]=useState(false);

  const cm=CAT[topic.category]||{color:"#6366f1",bg:"#eef2ff",light:"#e0e7ff"};
  const step=topic.steps[stepIdx];
  const q=topic.quiz[quizIdx];
  const done=appState.completed.includes(topic.slug);
  const fs=Math.min(score,topic.quiz.length);

  function stepLabel(type){return STEP_CONFIG[type]?.label||type;}

  const dc={
    Beginner:{color:"#16a34a",bg:"#f0fdf4"},
    Intermediate:{color:"#d97706",bg:"#fffbeb"},
    Advanced:{color:"#dc2626",bg:"#fef2f2"},
  }[topic.difficulty]||{color:"#6366f1",bg:"#eef2ff"};

  function showToast(msg){setToastMsg(msg);setToastKey(k=>k+1);}

  function nextStep(){
    if(stepIdx<topic.steps.length-1){setStepIdx(i=>i+1);}
    else{setPhase("quiz");setQuizIdx(0);setScore(0);setSelected(null);setQResult(null);setWhyText("");}
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function pickAnswer(i){
    if(qResult)return;
    setSelected(i);
    const correct=i===q.answer;
    setQResult(correct?"correct":"wrong");
    if(correct)setScore(s=>s+1);
    if(!correct){
      setWhyLoad(true);
      callClaude(`In 2 sentences, explain why "${q.opts[i]}" is wrong and "${q.opts[q.answer]}" is the correct answer to: "${q.q}". Be direct and educational.`)
        .then(t=>{setWhyText(t);setWhyLoad(false);})
        .catch(()=>{setWhyLoad(false);});
    }
  }

  function nextQuiz(){
    if(quizIdx<topic.quiz.length-1){
      setQuizIdx(i=>i+1);setSelected(null);setQResult(null);setWhyText("");
    } else {
      const finalScore=Math.min(score+(qResult==="correct"?0:0),topic.quiz.length);
      const passed=fs>=Math.ceil(topic.quiz.length*0.67);
      if(passed){setPhase("try");}
      else{setPhase("retry");}
    }
  }

  function completeTopic(){
    if(done)return;
    let s={...appState,completed:[...appState.completed,topic.slug]};
    s=updateStreak(s);
    s.xp=(s.xp||0)+50;
    s.badges=checkBadges(s);
    const newBadge=s.badges.find(b=>!appState.badges.includes(b));
    persist(s);
    showToast("Topic complete ✓");
    if(newBadge){
      const trackBadge=TRACKS.find(t=>`track-${t.id}`===newBadge);
      if(trackBadge){
        setTimeout(()=>setBdg({icon:trackBadge.emoji,label:trackBadge.label+" Track Complete",desc:trackBadge.desc||"",isTrack:true}),400);
      }
    }
  }

  function runPrompt(){
    if(aiLoad)return;
    const today=new Date().toDateString();
    const runs={...appState.exerciseRunsToday};
    if((runs[today]||0)>=3){setAiErr("Daily limit reached. Come back tomorrow.");return;}
    setAiLoad(true);setAiOut("");setAiErr("");
    callClaude(editPrompt)
      .then(t=>{
        setAiOut(t);setAiLoad(false);
        const s={...appState,exerciseRunsToday:{...runs,[today]:(runs[today]||0)+1},xp:(appState.xp||0)+10};
        persist(s);showToast("Prompt saved ✓");
      })
      .catch(e=>{setAiErr(e.message==="429"?"Rate limit hit. Please wait a moment.":"Something went wrong. Try again.");setAiLoad(false);});
  }

  return(
    <div style={{background:"#f5f4f0",minHeight:"100vh",...F,paddingBottom:80}}>
      {toastMsg&&<Toast msg={toastMsg} k={toastKey}/>}
      {bdg&&<BadgeModal badge={bdg} onClose={()=>setBdg(null)}/>}

      {/* Back bar */}
      <div style={{background:"#fff",borderBottom:"1px solid #ebe8e0",padding:"12px 20px",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:880,margin:"0 auto",display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onBack} className="vl-back vl-btn" style={{background:"none",border:"none",color:"#6b7280",fontSize:15,cursor:"pointer",...F,display:"flex",alignItems:"center",gap:4}}>← Back</button>
          <span style={{color:"#e5e2da"}}>·</span>
          <Chip label={topic.category} color={cm.color} bg={cm.bg}/>
          {done&&<Chip label="✓ Done" color="#16a34a" bg="#f0fdf4"/>}
        </div>
      </div>

      <div style={{maxWidth:880,margin:"0 auto",padding:"24px 16px"}}>
        {/* Topic header */}
        <div style={{textAlign:"center",marginBottom:24}} className="vl-fade">
          <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:12}}><Chip label={topic.difficulty} color={dc.color} bg={dc.bg}/></div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:800,color:"#111827",lineHeight:1.2,marginBottom:10}}>{topic.title}</h1>
          <p style={{fontSize:17,color:"#6b7280",lineHeight:1.7,...F}}>{topic.short}</p>
        </div>

        {/* STEPS */}
        {phase==="steps"&&(
          <div className="vl-fi" key={stepIdx}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{fontSize:14,color:"#6b7280",fontWeight:600,...F}}>Step {stepIdx+1} of {topic.steps.length}</span>
              <div style={{display:"flex",gap:5}}>
                {topic.steps.map((_,i)=>(<div key={i} style={{width:i===stepIdx?20:7,height:7,borderRadius:999,background:i<stepIdx?"#6366f1":i===stepIdx?"#6366f1":"#e5e2da",opacity:i<stepIdx?0.45:1,transition:"all 0.3s"}}/>))}
              </div>
            </div>
            <div className="vl-card-in" style={{marginBottom:16}}>
              {step.type==="diagram"?(
                <div style={{background:"#fff",borderRadius:20,padding:"28px 20px",boxShadow:"0 2px 18px rgba(0,0,0,0.07)",border:"1px solid #ebe8e0"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
                    <div style={{width:3,height:16,borderRadius:2,background:cm.color,flexShrink:0}}/>
                    <span style={{fontSize:13,color:cm.color,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",...F}}>{step.heading}</span>
                  </div>
                  <div style={{background:"#f9f8f5",borderRadius:12,padding:"16px",border:"1px solid #ebe8e0"}}>
                    {Diagrams[step.diagramKey]?.()}
                  </div>
                </div>
              ):step.type==="analogy"?(
                <AnalogyCard step={step} cm={cm}/>
              ):step.type==="misconception"?(
                <div style={{background:"linear-gradient(135deg,#fff1f2 0%,#ffe4e6 100%)",borderRadius:20,padding:"32px 28px",border:"1.5px solid #fecdd3",overflow:"hidden",position:"relative"}}>
                  <div style={{position:"absolute",top:-15,right:-15,fontSize:90,opacity:0.06,lineHeight:1,pointerEvents:"none"}}>⚠️</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#dc2626",borderRadius:999,padding:"5px 14px",marginBottom:18}}>
                    <span style={{fontSize:14}}>⚠️</span>
                    <span style={{fontSize:13,color:"#fff",fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",...F}}>Common Misconception</span>
                  </div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#9f1239",lineHeight:1.3,marginBottom:16}}>{step.heading}</p>
                  <p className="vl-card-body" style={{color:"#374151",...F}}>{step.body}</p>
                </div>
              ):step.type==="realworld"?(
                <div style={{background:"linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)",borderRadius:20,padding:"32px 28px",border:"1.5px solid #bbf7d0",overflow:"hidden",position:"relative"}}>
                  <div style={{position:"absolute",top:-15,right:-15,fontSize:90,opacity:0.07,lineHeight:1,pointerEvents:"none"}}>🌍</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#16a34a",borderRadius:999,padding:"5px 14px",marginBottom:18}}>
                    <span style={{fontSize:14}}>🌍</span>
                    <span style={{fontSize:13,color:"#fff",fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",...F}}>In the Real World</span>
                  </div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#14532d",lineHeight:1.3,marginBottom:16}}>{step.heading}</p>
                  <p className="vl-card-body" style={{color:"#374151",...F}}>{step.body}</p>
                </div>
              ):step.type==="scenario"?(
                <div style={{background:"linear-gradient(135deg,#fffbeb 0%,#fef9c3 100%)",borderRadius:20,padding:"32px 28px",border:"1.5px solid #fde68a",overflow:"hidden",position:"relative"}}>
                  <div style={{position:"absolute",top:-15,right:-15,fontSize:90,opacity:0.07,lineHeight:1,pointerEvents:"none"}}>💼</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#d97706",borderRadius:999,padding:"5px 14px",marginBottom:18}}>
                    <span style={{fontSize:14}}>💼</span>
                    <span style={{fontSize:13,color:"#fff",fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",...F}}>You'd Use This When…</span>
                  </div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#78350f",lineHeight:1.3,marginBottom:16}}>{step.heading}</p>
                  <p className="vl-card-body" style={{color:"#374151",...F}}>{step.body}</p>
                </div>
              ):step.type==="connect"?(
                <div style={{background:"linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)",borderRadius:20,padding:"32px 28px",border:"1.5px solid #ddd6fe",overflow:"hidden",position:"relative"}}>
                  <div style={{position:"absolute",top:-15,right:-15,fontSize:90,opacity:0.07,lineHeight:1,pointerEvents:"none"}}>🔗</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#7c3aed",borderRadius:999,padding:"5px 14px",marginBottom:18}}>
                    <span style={{fontSize:14}}>🔗</span>
                    <span style={{fontSize:13,color:"#fff",fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",...F}}>Connect the Dots</span>
                  </div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#4c1d95",lineHeight:1.3,marginBottom:16}}>{step.heading}</p>
                  <p className="vl-card-body" style={{color:"#374151",...F}}>{step.body}</p>
                </div>
              ):(
                <div style={{background:"#fff",borderRadius:20,padding:"32px 28px",boxShadow:"0 2px 18px rgba(0,0,0,0.07)",border:"1px solid #ebe8e0"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                    <div style={{width:3,height:16,borderRadius:2,background:cm.color,flexShrink:0}}/>
                    <span style={{fontSize:13,color:cm.color,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",...F}}>{stepLabel(step.type)}</span>
                  </div>
                  <p style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#111827",lineHeight:1.3,marginBottom:16}}>{step.heading}</p>
                  <p className="vl-card-body" style={{color:"#374151",...F}}>{step.body}</p>
                </div>
              )}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              {stepIdx>0
                ?<button onClick={()=>{setStepIdx(i=>i-1);window.scrollTo({top:0,behavior:"smooth"});}} className="vl-btn" style={{background:"#fff",border:"1.5px solid #e5e2da",color:"#374151",borderRadius:12,padding:"12px 20px",fontSize:15,fontWeight:600,...F}}>← Back</button>
                :<div/>}
              <button onClick={nextStep} className="vl-btn" style={{background:cm.color,color:"#fff",border:"none",borderRadius:12,padding:"14px 28px",fontSize:16,fontWeight:700,...F,boxShadow:`0 4px 16px ${cm.color}44`}}>
                {stepIdx<topic.steps.length-1?"Continue →":"Take the Quiz →"}
              </button>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase==="quiz"&&(
          <div className="vl-fi" key={`q${quizIdx}`}>
            <div style={{textAlign:"center",marginBottom:18}}>
              <div style={{fontSize:13,color:"#6366f1",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8,...F}}>Knowledge Check</div>
              <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                {topic.quiz.map((_,i)=>(
                  <div key={i} style={{width:28,height:28,borderRadius:999,background:i<quizIdx?"#6366f1":i===quizIdx?"#eef2ff":"#f3f4f6",border:i===quizIdx?"2px solid #6366f1":"2px solid transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:i<quizIdx?"#fff":i===quizIdx?"#6366f1":"#9ca3af",...F,transition:"all 0.2s"}}>
                    {i<quizIdx?"✓":i+1}
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:20,padding:"28px 24px",boxShadow:"0 2px 18px rgba(0,0,0,0.07)",border:"1px solid #ebe8e0",marginBottom:14}}>
              <p style={{fontSize:22,fontWeight:800,color:"#111827",lineHeight:1.35,marginBottom:24,fontFamily:"'Playfair Display',serif"}}>{q.q}</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {q.opts.map((opt,i)=>{
                  let bg="#f9f8f5",border="1.5px solid #e5e2da",color="#374151",icon=String.fromCharCode(65+i),shadow="none";
                  if(qResult&&selected===i&&qResult==="correct"){bg="#f0fdf4";border="2px solid #22c55e";color="#15803d";icon="✓";shadow="0 0 0 4px rgba(34,197,94,0.15)";}
                  else if(qResult&&selected===i&&qResult==="wrong"){bg="#fef2f2";border="2px solid #ef4444";color="#dc2626";icon="✗";shadow="0 0 0 4px rgba(239,68,68,0.15)";}
                  else if(qResult&&i===q.answer){bg="#f0fdf4";border="2px solid #22c55e";color="#15803d";icon="✓";}
                  return(
                    <button key={i} onClick={()=>pickAnswer(i)} disabled={!!qResult} className="vl-opt vl-btn"
                      style={{background:bg,border,color,borderRadius:14,padding:"16px 20px",fontSize:17,fontWeight:600,textAlign:"left",...F,display:"flex",alignItems:"center",gap:12,boxShadow:shadow,transition:"all 0.18s"}}>
                      <span style={{width:30,height:30,borderRadius:999,background:qResult&&selected===i&&qResult==="correct"?"#22c55e":qResult&&selected===i&&qResult==="wrong"?"#ef4444":qResult&&i===q.answer?"#22c55e":"#e5e2da",color:qResult&&(selected===i||i===q.answer)?"#fff":"#9ca3af",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,flexShrink:0,transition:"all 0.2s"}}>{icon}</span>
                      <span style={{flex:1}}>{opt}</span>
                    </button>
                  );
                })}
              </div>
              {qResult&&(
                <div className="vl-fi" style={{marginTop:16}}>
                  {qResult==="correct"?(
                    <div style={{padding:"14px 18px",borderRadius:12,background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",border:"1.5px solid #86efac",display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:36,height:36,borderRadius:999,background:"#22c55e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,color:"#fff"}}>✓</div>
                      <div>
                        <div style={{fontSize:17,fontWeight:800,color:"#15803d",...F}}>Correct!</div>
                        <div style={{fontSize:15,color:"#16a34a",...F}}>Well done — keep going.</div>
                      </div>
                    </div>
                  ):(
                    <div style={{borderRadius:14,overflow:"hidden",boxShadow:"0 2px 12px rgba(239,68,68,0.12)"}}>
                      <div style={{padding:"14px 18px",background:"linear-gradient(135deg,#fef2f2,#ffe4e6)",border:"1.5px solid #fca5a5",display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:36,height:36,borderRadius:999,background:"#ef4444",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,color:"#fff"}}>✗</div>
                        <div>
                          <div style={{fontSize:17,fontWeight:800,color:"#dc2626",...F}}>Not quite</div>
                          <div style={{fontSize:15,color:"#ef4444",...F}}>Correct answer highlighted above.</div>
                        </div>
                      </div>
                      {(whyLoad||whyText)&&(
                        <div style={{padding:"16px 18px",background:"#fff",borderLeft:"1.5px solid #fca5a5",borderRight:"1.5px solid #fca5a5",borderBottom:"1.5px solid #fca5a5",borderRadius:"0 0 14px 14px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                            <div style={{width:3,height:14,borderRadius:2,background:"#6366f1",flexShrink:0}}/>
                            <span style={{fontSize:14,color:"#6366f1",fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",...F}}>Why was I wrong?</span>
                          </div>
                          {whyLoad
                            ?<div style={{fontSize:14,color:"#6b7280",...F,display:"flex",alignItems:"center",gap:8}}><span className="vl-pulse" style={{display:"inline-block"}}>●</span> Explaining…</div>
                            :<p style={{fontSize:17,color:"#374151",lineHeight:1.85,...F}}>{whyText}</p>
                          }
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            {qResult&&<div style={{textAlign:"right"}} className="vl-fi">
              <button onClick={nextQuiz} className="vl-btn" style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:12,padding:"13px 26px",fontSize:15,fontWeight:700,...F}}>
                {quizIdx<topic.quiz.length-1?"Next →":"See Results →"}
              </button>
            </div>}
          </div>
        )}

        {/* RETRY */}
        {phase==="retry"&&(
          <div className="vl-fi" style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#111827",marginBottom:8}}>Almost there!</div>
            <p style={{fontSize:15,color:"#4b5563",marginBottom:28,lineHeight:1.7,...F}}>You got {fs}/{topic.quiz.length}. Review the lesson and try the quiz again.</p>
            <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={()=>{setPhase("steps");setStepIdx(0);}} className="vl-btn" style={{background:"#fff",border:"1.5px solid #e5e2da",color:"#374151",borderRadius:12,padding:"12px 22px",fontSize:15,fontWeight:600,...F}}>← Review</button>
              <button onClick={()=>{setPhase("quiz");setQuizIdx(0);setScore(0);setSelected(null);setQResult(null);setWhyText("");}} className="vl-btn" style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:12,padding:"12px 22px",fontSize:15,fontWeight:700,...F}}>Retry →</button>
            </div>
          </div>
        )}

        {/* TRY IT + COMPLETE */}
        {phase==="try"&&(
          <div className="vl-fi">
            <div style={{background:"#6366f1",borderRadius:20,padding:"28px 24px",marginBottom:18,textAlign:"center",boxShadow:"0 8px 32px rgba(99,102,241,0.28)"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:800,color:"#fff",marginBottom:6}}>{done?"Already mastered this one":"Topic complete."}</div>
              <p style={{fontSize:15,color:"#e0e7ff",lineHeight:1.7,...F,marginBottom:20}}>{fs}/{topic.quiz.length} correct · {done?"No new progress recorded":"Added to your profile"}</p>
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                <button onClick={()=>{completeTopic();}} className="vl-btn" style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.25)",borderRadius:10,padding:"11px 20px",fontSize:14,fontWeight:600,...F}}>Save progress</button>
                <button onClick={onBack} className="vl-btn" style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.25)",borderRadius:10,padding:"11px 20px",fontSize:14,fontWeight:600,...F}}>Back to topics</button>
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:20,padding:"24px 22px",boxShadow:"0 2px 18px rgba(0,0,0,0.07)",border:"1px solid #ebe8e0",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{width:3,height:16,borderRadius:2,background:"#6366f1",flexShrink:0}}/>
                <span style={{fontSize:13,color:"#6366f1",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",...F}}>Try It Live</span>
                <span style={{fontSize:13,color:"#6b7280",marginLeft:"auto",...F}}>max 3/day</span>
              </div>
              <p style={{fontSize:15,color:"#6b7280",marginBottom:14,lineHeight:1.7,...F}}>Edit this prompt and hit Run for a real AI response.</p>
              <textarea value={editPrompt} onChange={e=>setEditPrompt(e.target.value)} rows={4}
                style={{width:"100%",borderRadius:12,border:"1.5px solid #e5e2da",padding:"14px 16px",fontSize:16,color:"#374151",lineHeight:1.7,resize:"vertical",background:"#f9f8f5",...F}}/>
              <button onClick={runPrompt} disabled={aiLoad} className="vl-btn" style={{marginTop:12,background:aiLoad?"#9ca3af":"#6366f1",color:"#fff",border:"none",borderRadius:12,padding:"13px 24px",fontSize:15,fontWeight:700,...F,display:"flex",alignItems:"center",gap:8}}>
                {aiLoad?<><span className="vl-pulse" style={{display:"inline-block"}}>●</span> Running…</>:<>▶ Run</>}
              </button>
              {aiErr&&<p style={{fontSize:14,color:"#ef4444",marginTop:10,...F}}>{aiErr}</p>}
              {aiOut&&(
                <div style={{marginTop:16,padding:"16px",background:"#f9f8f5",borderRadius:12,border:"1px solid #e5e2da"}}>
                  <div style={{fontSize:13,color:"#6b7280",fontWeight:700,marginBottom:8,...F}}>AI Response:</div>
                  <div style={{fontSize:15,color:"#374151",lineHeight:1.85,whiteSpace:"pre-wrap",wordBreak:"break-word",...F}}>{aiOut}</div>
                </div>
              )}
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
          {locked
            ?<div style={{fontSize:14,color:"#6b7280",...F}}>Complete {Math.ceil(xpNeeded/50)} topics to unlock</div>
            :<div style={{fontSize:14,color:"#6b7280",...F}}>{doneCount}/{topics.length} complete</div>}
        </div>
        {!locked&&<div style={{display:"flex",alignItems:"center",gap:10}}>
          {doneCount>0&&<div style={{background:"#f0fdf4",color:"#16a34a",borderRadius:999,padding:"3px 10px",fontSize:13,fontWeight:700,...F}}>{doneCount}/{topics.length}</div>}
          <span style={{color:"#6b7280",fontSize:16,transition:"transform 0.2s",transform:open?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
        </div>}
      </button>
      {open&&!locked&&(
        <div className="vl-slide" style={{marginTop:6,display:"flex",flexDirection:"column",gap:8,paddingLeft:4,paddingRight:4}}>
          {topics.map((t,i)=>{
            const done=completed.includes(t.slug);
            const cm=CAT[t.category]||{color:"#6366f1",bg:"#eef2ff"};
            return(
              <div key={t.slug} className="vl-hover vl-fade vl-topic-card" onClick={()=>onOpen(t)}
                style={{animationDelay:`${i*0.04}s`,background:"#fff",borderRadius:16,padding:"16px 18px",boxShadow:"0 2px 10px rgba(0,0,0,0.05)",border:done?"1.5px solid #bbf7d0":"1.5px solid #ebe8e0",display:"flex",alignItems:"center",gap:14}}>
                <div style={{fontSize:28,flexShrink:0,width:40,textAlign:"center",lineHeight:1}}>{t.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",gap:6,marginBottom:5,flexWrap:"wrap",alignItems:"center"}}>
                    <Chip label={t.category} color={cm.color} bg={cm.bg} small/>
                    {done&&<Chip label="✓ Done" color="#16a34a" bg="#f0fdf4" small/>}
                  </div>
                  <div className="vl-topic-title" style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"#111827",marginBottom:3,lineHeight:1.3}}>{t.title}</div>
                  <div style={{fontSize:15,color:"#4b5563",lineHeight:1.7,...F}}>{t.short}</div>
                </div>
                <div style={{color:"#9ca3af",fontSize:18,flexShrink:0}}>›</div>
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
  const[showScore,setShowScore]=useState(false);
  const[diagResult,setDiagResult]=useState(null);
  const[activeTrack,setActiveTrack]=useState(null);

  useEffect(()=>{loadState().then(s=>{setSt(s||defaultState());setReady(true);});},[]);
  const persist=useCallback((s)=>{setSt(s);saveState(s);},[]);

  const openTopic=t=>{setTopic(t);setView("topic");setTimeout(()=>window.scrollTo({top:0,behavior:"smooth"}),40);};

  if(!ready||!st)return(
    <div style={{background:"#f5f4f0",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",...F}}>
      <div style={{textAlign:"center"}}>
        <div className="vl-pulse" style={{fontSize:44,marginBottom:16}}>✦</div>
        <div style={{color:"#6b7280",fontSize:15,fontWeight:500}}>Loading…</div>
      </div>
    </div>
  );

  // Diagnostic flow
  if(view==="diagnostic"){
    if(diagResult){
      return <DiagnosticResults
        result={diagResult}
        onStart={(track)=>{
          const s={...st,diagnosticDone:true,diagnosticTrack:track.id,seenIntro:true};
          persist(s);
          setActiveTrack(track);
          setView("tracks");
          setDiagResult(null);
        }}
        onExplore={()=>{
          const s={...st,diagnosticDone:true,seenIntro:true};
          persist(s);
          setView("home");
          setDiagResult(null);
        }}
      />;
    }
    return <DiagnosticQuiz onComplete={(result)=>setDiagResult(result)}/>;
  }

  if(view==="topic"&&topic){
    return <LessonView topic={topic} appState={st} persist={persist} onBack={()=>{setView("home");setTimeout(()=>window.scrollTo({top:0}),40);}}/>;
  }

  if(view==="tracks"){
    return <TracksView
      completed={st.completed}
      onOpenTopic={(t)=>{setTopic(t);setView("topic");setTimeout(()=>window.scrollTo({top:0}),40);}}
      onBack={()=>setView("home")}
      activeTrack={activeTrack}
    />;
  }

  const score=calcLiteracyScore(st.completed);
  const{label:scoreLabel,color:scoreColor}=getScoreLabel(score);
  const beginnerTopics=TOPICS.filter(t=>t.difficulty==="Beginner");
  const intermediateTopics=TOPICS.filter(t=>t.difficulty==="Intermediate");
  const advancedTopics=TOPICS.filter(t=>t.difficulty==="Advanced");
  const advancedLocked=st.xp<ADVANCED_XP_GATE;
  const allOrdered=[...beginnerTopics,...intermediateTopics,...(advancedLocked?[]:[...advancedTopics])];
  const recommended=allOrdered.find(t=>!st.completed.includes(t.slug));

  // First time: show diagnostic instead of intro
  if(!st.seenIntro&&!st.diagnosticDone){
    return(
      <div style={{background:"#f5f4f0",minHeight:"100vh",...F}}>
        <div style={{background:"#fff",borderBottom:"1px solid #ebe8e0",padding:"14px 20px"}}>
          <div style={{maxWidth:600,margin:"0 auto"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:800,color:"#111827"}}>Vibe<span style={{color:"#6366f1"}}>Learn</span></div>
          </div>
        </div>
        <div style={{maxWidth:600,margin:"0 auto",padding:"40px 16px"}}>
          <div className="vl-fade" style={{background:"#fff",borderRadius:20,padding:"36px 28px",boxShadow:"0 4px 24px rgba(0,0,0,0.06)",border:"2px solid #e0e7ff",textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:16}}>🧠</div>
            <div style={{fontSize:13,color:"#6366f1",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:12,...F}}>Welcome to VibeLearn</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:800,color:"#111827",marginBottom:12,lineHeight:1.2}}>AI literacy in 5 minutes a topic.</div>
            <div style={{fontSize:16,color:"#6b7280",marginBottom:32,lineHeight:1.7,...F}}>No jargon. No fluff. Answer 10 quick questions and we'll build your personalized learning path.</div>
            <button onClick={()=>setView("diagnostic")} className="vl-btn" style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:14,padding:"17px 28px",fontSize:17,fontWeight:700,...F,width:"100%",boxShadow:"0 4px 16px rgba(99,102,241,0.3)",marginBottom:12}}>
              Take the 2-minute diagnostic →
            </button>
            <button onClick={()=>{const s={...st,seenIntro:true,diagnosticDone:true};persist(s);}} className="vl-btn" style={{background:"transparent",color:"#9ca3af",border:"none",fontSize:14,...F,cursor:"pointer"}}>
              Skip — browse all topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div style={{background:"#f5f4f0",minHeight:"100vh",...F,paddingBottom:80}}>
      {showScore&&<ScoreCard score={score} completed={st.completed} onClose={()=>setShowScore(false)}/>}

      {/* Header */}
      <div style={{background:"#fff",borderBottom:"1px solid #ebe8e0",padding:"14px 20px",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:880,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:800,color:"#111827",letterSpacing:-0.5,lineHeight:1}}>Vibe<span style={{color:"#6366f1"}}>Learn</span></div>
            <div style={{fontSize:13,color:"#6b7280",marginTop:3,fontWeight:500}}>AI literacy for everyone</div>
          </div>
          {/* Score pill — tappable */}
          <button onClick={()=>setShowScore(true)} className="vl-btn" style={{background:`${scoreColor}15`,border:`1.5px solid ${scoreColor}44`,borderRadius:12,padding:"8px 14px",cursor:"pointer",textAlign:"right"}}>
            <div style={{fontSize:18,fontWeight:800,color:scoreColor,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{score}<span style={{fontSize:13,color:scoreColor,opacity:0.7}}>/100</span></div>
            <div style={{fontSize:13,color:scoreColor,fontWeight:600,...F,opacity:0.8}}>{scoreLabel}</div>
          </button>
        </div>
      </div>

      <div style={{maxWidth:880,margin:"0 auto",padding:"20px 16px"}}>

        {/* Stats strip */}
        <div style={{display:"flex",gap:10,marginBottom:20}} className="vl-fade">
          <div style={{flex:1,background:"#fff",borderRadius:14,padding:"14px 12px",border:"1px solid #ebe8e0",textAlign:"center",boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
            <div style={{fontSize:20,fontWeight:800,color:"#111827",fontFamily:"'Playfair Display',serif"}}>{st.completed.length}/{TOPICS.length}</div>
            <div style={{fontSize:13,color:"#6b7280",fontWeight:600,marginTop:2,...F}}>Topics Done</div>
          </div>
          <div onClick={()=>setView("tracks")} className="vl-hover" style={{flex:1,background:"#fff",borderRadius:14,padding:"14px 12px",border:"1px solid #ebe8e0",textAlign:"center",boxShadow:"0 1px 6px rgba(0,0,0,0.04)",cursor:"pointer"}}>
            <div style={{fontSize:20,fontWeight:800,color:"#6366f1",fontFamily:"'Playfair Display',serif"}}>
              {TRACKS.filter(t=>t.slugs.every(s=>st.completed.includes(s))).length}/{TRACKS.length}
            </div>
            <div style={{fontSize:13,color:"#6b7280",fontWeight:600,marginTop:2,...F}}>Tracks</div>
          </div>
          <div onClick={()=>setView("diagnostic")} className="vl-hover" style={{flex:1,background:"#fff",borderRadius:14,padding:"14px 12px",border:"1px solid #ebe8e0",textAlign:"center",boxShadow:"0 1px 6px rgba(0,0,0,0.04)",cursor:"pointer"}}>
            <div style={{fontSize:20,...F,color:"#6366f1"}}>🎯</div>
            <div style={{fontSize:13,color:"#6b7280",fontWeight:600,marginTop:2,...F}}>Diagnostic</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{background:"#f3f4f6",borderRadius:999,height:6,marginBottom:20,overflow:"hidden"}}>
          <div className="vl-xp" style={{background:"linear-gradient(90deg,#6366f1,#818cf8)",height:"100%",width:`${Math.round(st.completed.length/TOPICS.length*100)}%`,borderRadius:999}}/>
        </div>

        {/* Recommended next */}
        {recommended&&(
          <div style={{marginBottom:20}} className="vl-fade">
            <div style={{fontSize:13,color:"#6b7280",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10,...F}}>⭐ Recommended Next</div>
            {(()=>{const t=recommended;const cm=CAT[t.category]||{color:"#6366f1",bg:"#eef2ff"};return(
              <div className="vl-hover" onClick={()=>openTopic(t)} style={{background:"linear-gradient(135deg,#6366f1 0%,#818cf8 100%)",borderRadius:18,padding:"20px 22px",boxShadow:"0 6px 24px rgba(99,102,241,0.28)",cursor:"pointer",display:"flex",alignItems:"center",gap:16}}>
                <div style={{fontSize:36,flexShrink:0}}>{t.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:800,color:"#fff",lineHeight:1.2,marginBottom:4}}>{t.title}</div>
                  <div style={{fontSize:14,color:"#e0e7ff",lineHeight:1.6}}>{t.short}</div>
                </div>
                <div style={{color:"rgba(255,255,255,0.6)",fontSize:20,flexShrink:0}}>›</div>
              </div>
            );})()}
          </div>
        )}

        {/* Track shortcuts */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:13,color:"#6b7280",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10,...F}}>Skill Tracks</div>
          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
            {TRACKS.map(track=>{
              const done=track.slugs.filter(s=>st.completed.includes(s)).length;
              const total=track.slugs.length;
              const complete=done===total;
              return(
                <div key={track.id} onClick={()=>{setActiveTrack(track);setView("tracks");}} className="vl-hover"
                  style={{background:"#fff",border:`1.5px solid ${complete?track.color:track.border}`,borderRadius:14,padding:"12px 14px",flexShrink:0,width:140,cursor:"pointer",position:"relative"}}>
                  {complete&&<div style={{position:"absolute",top:6,right:8,fontSize:13}}>✓</div>}
                  <div style={{fontSize:22,marginBottom:6}}>{track.emoji}</div>
                  <div style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:4,...F,lineHeight:1.3}}>{track.label}</div>
                  <div style={{background:"#f3f4f6",borderRadius:999,height:4,overflow:"hidden"}}>
                    <div style={{background:track.color,height:"100%",width:`${Math.round(done/total*100)}%`,borderRadius:999}}/>
                  </div>
                  <div style={{fontSize:13,color:track.color,marginTop:3,fontWeight:600,...F}}>{done}/{total}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All topics */}
        <div style={{fontSize:13,color:"#6b7280",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12,...F}}>All Topics</div>
        <TopicGroup label="Beginner" emoji="🟢" topics={beginnerTopics} completed={st.completed} onOpen={openTopic} locked={false} defaultOpen={true}/>
        <TopicGroup label="Intermediate" emoji="🟡" topics={intermediateTopics} completed={st.completed} onOpen={openTopic} locked={false} defaultOpen={st.completed.length>0}/>
        <TopicGroup label="Advanced" emoji="🔴" topics={advancedTopics} completed={st.completed} onOpen={openTopic} locked={advancedLocked} xpNeeded={ADVANCED_XP_GATE} userXP={st.xp} defaultOpen={false}/>
      </div>
    </div>
  );
}
