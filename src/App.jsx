import { useState, useEffect, useCallback } from "react";
import { Analytics } from '@vercel/analytics/react';

if (!document.getElementById("vl-fonts")) {
  const l = document.createElement("link"); l.id="vl-fonts"; l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap";
  document.head.appendChild(l);
}
if (!document.getElementById("vl-css")) {
  const s = document.createElement("style"); s.id="vl-css";
  s.textContent=`
    *{box-sizing:border-box;margin:0;padding:0;}
    html,body{height:100%;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
    body{background:#f7f7f5;}
    button{font-family:inherit;}
    textarea{font-size:16px!important;font-family:inherit;}
    textarea:focus{outline:none!important;}
    ::-webkit-scrollbar{width:0px;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes popIn{0%{transform:scale(0.92);opacity:0}100%{transform:scale(1);opacity:1}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
    @keyframes scoreReveal{from{opacity:0;transform:scale(0.7) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes slideInRight{from{opacity:0;transform:translateX(44px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideInLeft{from{opacity:0;transform:translateX(-44px)}to{opacity:1;transform:translateX(0)}}
    @keyframes completePop{0%{transform:scale(0.82);opacity:0}55%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
    @keyframes filterFade{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
    .fu{animation:fadeUp 0.42s cubic-bezier(.4,0,.2,1) both;}
    .fi{animation:fadeIn 0.2s ease both;}
    .pi{animation:popIn 0.22s cubic-bezier(.4,0,.2,1) both;}
    .pulse{animation:pulse 1.8s ease infinite;}
    .sr{animation:scoreReveal 0.5s cubic-bezier(.34,1.4,.64,1) both;}
    .slide-in{animation:slideInRight 0.3s cubic-bezier(.25,.46,.45,.94) both;}
    .slide-back{animation:slideInLeft 0.3s cubic-bezier(.25,.46,.45,.94) both;}
    .complete-pop{animation:completePop 0.38s cubic-bezier(.34,1.3,.64,1) both;}
    .filter-fade{animation:filterFade 0.17s cubic-bezier(.4,0,.2,1) both;}
    @keyframes stepInRight{from{opacity:0;transform:translateX(48px)}to{opacity:1;transform:translateX(0)}}
    @keyframes stepInLeft{from{opacity:0;transform:translateX(-48px)}to{opacity:1;transform:translateX(0)}}
    .step-fwd{animation:stepInRight 0.32s cubic-bezier(.25,.46,.45,.94) both;}
    .step-back{animation:stepInLeft 0.32s cubic-bezier(.25,.46,.45,.94) both;}
    .tap:active{opacity:0.65;transform:scale(0.97);}
    .opt{transition:all 0.13s ease;cursor:pointer;}
    .opt:active{transform:scale(0.98);}
  `;
  document.head.appendChild(s);
}

import Diagrams from "./diagrams.jsx";
import TOPICS from "./topics.js";

const F = {fontFamily:"Inter,sans-serif"};

const CAT={
  Foundations:   {color:"#6366f1",bg:"#eef2ff"},
  Skills:        {color:"#0891b2",bg:"#ecfeff"},
  Infrastructure:{color:"#059669",bg:"#ecfdf5"},
  Agents:        {color:"#d97706",bg:"#fffbeb"},
  Governance:    {color:"#db2777",bg:"#fdf2f8"},
};

const DIFF={
  Beginner:    {color:"#16a34a",bg:"#f0fdf4",dot:"#22c55e"},
  Intermediate:{color:"#d97706",bg:"#fffbeb",dot:"#f59e0b"},
  Advanced:    {color:"#dc2626",bg:"#fef2f2",dot:"#ef4444"},
};

const STEP_CONFIG={
  explain:"Explanation",detail:"Deep Dive",realworld:"Real World",
  misconception:"Misconception",scenario:"Scenario",connect:"Connect",
  analogy:"Analogy",diagram:"Visual",
};

const DIAGNOSTIC=[
  {q:"When an AI hallucinated, what happened?",opts:["It was slow","It had a dream","It stated false info confidently","It refused to answer"],answer:2,topic:"hallucination"},
  {q:"Best way to get better results from ChatGPT?",opts:["Switch tools","Give more context and detail","Refresh the page","Use shorter messages"],answer:1,topic:"prompt-engineering"},
  {q:"What is an AI context window?",opts:["Topics it knows","Response speed","The chat window size","How much text it processes at once"],answer:3,topic:"context-window"},
  {q:"A chatbot is built on Claude. What is Claude?",opts:["A plugin","The chatbot itself","The foundation model underneath","The company database"],answer:2,topic:"foundation-models"},
  {q:"What is a system prompt?",opts:["An error message","Hidden instructions shaping AI behavior","Your first message","The AI training data"],answer:1,topic:"system-prompt"},
  {q:"You ask AI to fact-check today's news. How reliable?",opts:["Completely reliable","Unreliable for everything","Only if asked nicely","Reliable pre-cutoff, unreliable for recent events"],answer:3,topic:"hallucination"},
  {q:"RAG stands for…",opts:["Rapid AI Generation","Real-time Answer Generation","Random Answer Generation","Retrieval-Augmented Generation"],answer:3,topic:"rag"},
  {q:"AI training vs inference — key difference?",opts:["Training is rare and costly; inference is constant","Training is free; inference costs","Training happens when you use it","They are the same"],answer:0,topic:"inference-training"},
  {q:"What is prompt injection?",opts:["Makes AI faster","Medical guidance","An attack hijacking AI instructions","A very long prompt"],answer:2,topic:"prompt-injection"},
  {q:"AI agent vs chatbot — key difference?",opts:["Better language","Costs more","Can take real-world actions","Needs more bandwidth"],answer:2,topic:"ai-agent"},
];

const SCORE_WEIGHTS={Beginner:4,Intermediate:6,Advanced:8};
function calcScore(completed){
  const max=TOPICS.reduce((s,t)=>s+(SCORE_WEIGHTS[t.difficulty]||4),0);
  const earned=TOPICS.filter(t=>completed.includes(t.slug)).reduce((s,t)=>s+(SCORE_WEIGHTS[t.difficulty]||4),0);
  return Math.round((earned/max)*100);
}
function getScoreLabel(score){
  if(score===0)  return{label:"Just starting",  color:"#9ca3af"};
  if(score<25)   return{label:"Foundations",     color:"#6366f1"};
  if(score<50)   return{label:"Developing",      color:"#0891b2"};
  if(score<75)   return{label:"Capable",         color:"#059669"};
  if(score<100)  return{label:"Proficient",      color:"#d97706"};
  return           {label:"AI Literate",         color:"#6366f1"};
}

function getInterpretation(score,label,nextTopic){
  if(score===0){
    return{
      heading:"You're just getting started.",
      sub:"Answer 10 questions to get a personalized path — or dive in below.",
    };
  }
  const topicHint=nextTopic?`Your next lesson is ${nextTopic.title}.`:"You've covered the essentials.";
  if(score<25) return{heading:`You're at the ${label} level.`,sub:`Start with the core ideas behind modern AI. ${topicHint}`};
  if(score<50) return{heading:`You're ${label}.`,sub:`You have the basics. Time to go deeper. ${topicHint}`};
  if(score<75) return{heading:`You're ${label}.`,sub:`Solid foundation. A few gaps left to close. ${topicHint}`};
  if(score<100)return{heading:`You're ${label}.`,sub:`Nearly there. Keep pushing. ${topicHint}`};
  return{heading:"You're AI Literate.",sub:"You've completed every topic. Share your score."};
}

// Derive rough read time from steps + quiz count
function getReadTime(topic){
  const mins=Math.ceil((topic.steps?.length||4)*0.5+(topic.quiz?.length||3)*0.25);
  return`~${Math.max(2,mins)} min`;
}

const SK="vibelearn-v8";
async function loadState(){try{const v=localStorage.getItem(SK);if(v)return JSON.parse(v);}catch{}return null;}
async function saveState(s){try{localStorage.setItem(SK,JSON.stringify(s));}catch{}}
function defaultState(){return{completed:[],started:[],xp:0,seenIntro:false,diagnosticDone:false,diagnosticSlug:null,lastCompletedDate:null,streak:0,exerciseRunsToday:{}};}

function updateStreak(s){
  const today=new Date().toDateString();
  if(s.lastCompletedDate===today)return s;
  const yest=new Date();yest.setDate(yest.getDate()-1);
  const streak=s.lastCompletedDate===yest.toDateString()?s.streak+1:1;
  return{...s,streak,lastCompletedDate:today};
}

async function callClaude(p){
  const r=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:p})});
  if(!r.ok)throw new Error(r.status);
  const d=await r.json();return d.content?.[0]?.text||"";
}

function Toast({msg,k}){
  const[vis,setVis]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>setVis(false),2000);return()=>clearTimeout(t);},[k]);
  if(!vis)return null;
  return(
    <div className="pi" style={{position:"fixed",bottom:36,left:"50%",transform:"translateX(-50%)",background:"#111",color:"#fff",borderRadius:20,padding:"10px 20px",fontSize:14,fontWeight:600,...F,zIndex:999,whiteSpace:"nowrap",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
      {msg}
    </div>
  );
}

function AnalogyCard({step,cm}){
  if(step.analogyStyle==="contractor") return(
    <div style={{background:"#fffbeb",borderRadius:20,padding:"26px 22px",border:"1px solid #fde68a"}}>
      <div style={{fontSize:11,color:"#92400e",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14,...F}}>Analogy</div>
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
        <div style={{flex:1,background:"#fff",borderRadius:12,padding:"12px",border:"1px solid #fde68a",minWidth:110}}>
          <div style={{fontSize:11,color:"#b45309",fontWeight:700,marginBottom:5,...F,letterSpacing:1}}>VAGUE</div>
          <div style={{fontSize:14,color:"#374151",fontWeight:600,lineHeight:1.4,marginBottom:3,...F}}>"Fix my house"</div>
          <div style={{fontSize:12,color:"#ef4444",fontWeight:600,...F}}>Frustrating results</div>
        </div>
        <div style={{flex:1,background:"#fff",borderRadius:12,padding:"12px",border:"1px solid #86efac",minWidth:110}}>
          <div style={{fontSize:11,color:"#16a34a",fontWeight:700,marginBottom:5,...F,letterSpacing:1}}>SPECIFIC</div>
          <div style={{fontSize:13,color:"#374151",fontWeight:600,lineHeight:1.4,marginBottom:3,...F}}>"12x12 white tile, kitchen, by Friday"</div>
          <div style={{fontSize:12,color:"#16a34a",fontWeight:600,...F}}>Exactly right</div>
        </div>
      </div>
      <p style={{fontSize:15,color:"#78350f",lineHeight:1.8,fontStyle:"italic",...F}}>{step.body}</p>
    </div>
  );
  if(step.analogyStyle==="whiteboard") return(
    <div style={{background:"#eff6ff",borderRadius:20,padding:"26px 22px",border:"1px solid #bfdbfe"}}>
      <div style={{fontSize:11,color:"#1d4ed8",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14,...F}}>Analogy</div>
      <div style={{background:"#fff",borderRadius:12,padding:"14px",marginBottom:16,border:"1px solid #dbeafe"}}>
        <div style={{fontSize:11,color:"#9ca3af",...F,marginBottom:8,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Context window filling up</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
          {["System prompt","Your msg","Doc 1","Doc 2","History"].map((t,i)=>(
            <span key={i} style={{background:"#eef2ff",color:"#6366f1",borderRadius:6,padding:"3px 7px",fontSize:12,...F,fontWeight:600}}>{t}</span>
          ))}
          <span style={{background:"#fef2f2",color:"#dc2626",borderRadius:6,padding:"3px 7px",fontSize:12,...F,fontWeight:700}}>FULL</span>
        </div>
        <div style={{background:"#f3f4f6",borderRadius:999,height:5,overflow:"hidden"}}>
          <div style={{background:"linear-gradient(90deg,#6366f1,#f59e0b,#ef4444)",height:"100%",width:"92%",borderRadius:999}}/>
        </div>
      </div>
      <p style={{fontSize:15,color:"#1e3a5f",lineHeight:1.8,fontStyle:"italic",...F}}>{step.body}</p>
    </div>
  );
  if(step.analogyStyle==="usb") return(
    <div style={{background:"#f5f3ff",borderRadius:20,padding:"26px 22px",border:"1px solid #ddd6fe"}}>
      <div style={{fontSize:11,color:"#6d28d9",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14,...F}}>Analogy</div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        <div style={{flex:1,background:"#fef2f2",borderRadius:12,padding:"12px",border:"1px solid #fecaca",minWidth:100}}>
          <div style={{fontSize:18,marginBottom:5}}>😤</div>
          <div style={{fontSize:11,color:"#b91c1c",fontWeight:700,...F,marginBottom:4}}>BEFORE MCP</div>
          <div style={{fontSize:13,color:"#374151",...F,lineHeight:1.6}}>Custom cable for every device.</div>
        </div>
        <div style={{display:"flex",alignItems:"center",color:"#d1d5db",fontSize:16}}>→</div>
        <div style={{flex:1,background:"#f0fdf4",borderRadius:12,padding:"12px",border:"1px solid #bbf7d0",minWidth:100}}>
          <div style={{fontSize:18,marginBottom:5}}>⚡</div>
          <div style={{fontSize:11,color:"#15803d",fontWeight:700,...F,marginBottom:4}}>AFTER MCP</div>
          <div style={{fontSize:13,color:"#374151",...F,lineHeight:1.6}}>One plug. Any tool connects.</div>
        </div>
      </div>
      <p style={{fontSize:15,color:"#4c1d95",lineHeight:1.8,fontStyle:"italic",...F}}>{step.body}</p>
    </div>
  );
  return(
    <div style={{background:cm.color,borderRadius:20,padding:"28px 24px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-6,left:12,fontSize:110,color:"rgba(255,255,255,0.09)",lineHeight:1,pointerEvents:"none",fontStyle:"italic",fontWeight:900,userSelect:"none"}}>"</div>
      <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14,...F}}>Analogy</div>
      <p style={{fontSize:19,color:"#fff",lineHeight:1.85,fontStyle:"italic",fontWeight:600,...F,position:"relative",zIndex:1}}>{step.body}</p>
    </div>
  );
}

function DiagnosticQuiz({onComplete,onExit}){
  const[idx,setIdx]=useState(0);
  const[answers,setAnswers]=useState([]);
  const[selected,setSelected]=useState(null);
  const[answered,setAnswered]=useState(false);
  const q=DIAGNOSTIC[idx];
  const isLast=idx===DIAGNOSTIC.length-1;

  function pick(i){if(answered)return;setSelected(i);setAnswered(true);}
  function next(){
    const newAnswers=[...answers,{topic:q.topic,correct:selected===q.answer}];
    if(isLast){
      const wrongTopics=newAnswers.filter(a=>!a.correct).map(a=>a.topic);
      const score=newAnswers.filter(a=>a.correct).length;
      const firstGap=wrongTopics.find(t=>TOPICS.find(tp=>tp.slug===t));
      let recommendedSlug;
      if(!firstGap||score===DIAGNOSTIC.length){
        recommendedSlug=TOPICS.find(t=>t.difficulty==="Advanced")?.slug||TOPICS[0].slug;
      } else {
        recommendedSlug=firstGap;
      }
      onComplete({score,total:DIAGNOSTIC.length,recommendedSlug});
    } else {
      setAnswers(newAnswers);setIdx(i=>i+1);setSelected(null);setAnswered(false);
    }
  }

  return(
    <div style={{background:"#f7f7f5",minHeight:"100vh",...F}}>
      <div style={{background:"#fff",borderBottom:"1px solid #ebebeb",padding:"14px 20px",position:"sticky",top:0,zIndex:10}}>
        <div style={{maxWidth:560,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:17,fontWeight:700,color:"#111",letterSpacing:-0.3}}>Vibe<span style={{color:"#6366f1"}}>Learn</span></span>
          <button onClick={onExit} style={{background:"none",border:"none",color:"#9ca3af",fontSize:14,cursor:"pointer",...F}}>Done</button>
        </div>
      </div>
      <div style={{maxWidth:560,margin:"0 auto",padding:"28px 20px"}}>
        <div style={{background:"#ebebeb",borderRadius:999,height:3,marginBottom:32,overflow:"hidden"}}>
          <div style={{background:"#6366f1",height:"100%",width:`${((idx+(answered?1:0))/DIAGNOSTIC.length)*100}%`,borderRadius:999,transition:"width 0.35s ease"}}/>
        </div>
        <div className="fi" key={idx}>
          <div style={{fontSize:12,color:"#9ca3af",fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:12,...F}}>{idx+1} of {DIAGNOSTIC.length}</div>
          <div style={{fontSize:21,fontWeight:700,color:"#111",lineHeight:1.35,marginBottom:26,letterSpacing:-0.3}}>{q.q}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
            {q.opts.map((opt,i)=>{
              let bg="#fff",border="1px solid #e5e5e5",color="#374151",fw=500;
              if(answered&&i===q.answer){bg="#f0fdf4";border="1.5px solid #22c55e";color="#15803d";fw=600;}
              else if(answered&&selected===i&&i!==q.answer){bg="#fef2f2";border="1.5px solid #ef4444";color="#dc2626";fw=600;}
              return(
                <button key={i} onClick={()=>pick(i)} disabled={answered} className="opt"
                  style={{background:bg,border,color,borderRadius:14,padding:"14px 16px",fontSize:16,fontWeight:fw,textAlign:"left",...F,display:"flex",alignItems:"center",gap:10}}>
                  <span style={{width:24,height:24,borderRadius:999,background:answered&&i===q.answer?"#22c55e":answered&&selected===i?"#ef4444":"#f3f4f6",color:answered&&(i===q.answer||selected===i)?"#fff":"#9ca3af",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>
                    {answered&&i===q.answer?"✓":answered&&selected===i?"✗":String.fromCharCode(65+i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          {answered&&(
            <button onClick={next} className="tap" style={{background:"#111",color:"#fff",border:"none",borderRadius:14,padding:"15px 28px",fontSize:16,fontWeight:600,...F,width:"100%"}}>
              {isLast?"See my results":"Next →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DiagnosticResults({result,onStart,onBrowse}){
  const{score,total,recommendedSlug}=result;
  const pct=Math.round((score/total)*100);
  const recommended=TOPICS.find(t=>t.slug===recommendedSlug)||TOPICS[0];
  const cm=CAT[recommended.category]||{color:"#6366f1"};
  const dd=DIFF[recommended.difficulty]||DIFF.Beginner;
  return(
    <div style={{background:"#f7f7f5",minHeight:"100vh",...F}}>
      <div style={{background:"#fff",borderBottom:"1px solid #ebebeb",padding:"14px 20px"}}>
        <div style={{maxWidth:560,margin:"0 auto"}}>
          <span style={{fontSize:17,fontWeight:700,color:"#111",letterSpacing:-0.3}}>Vibe<span style={{color:"#6366f1"}}>Learn</span></span>
        </div>
      </div>
      <div style={{maxWidth:560,margin:"0 auto",padding:"40px 20px"}}>
        <div className="fu" style={{textAlign:"center",marginBottom:44}}>
          <div className="sr" style={{fontSize:80,fontWeight:800,color:"#111",lineHeight:1,letterSpacing:-4,marginBottom:8}}>
            {score}<span style={{fontSize:28,color:"#9ca3af",fontWeight:400,letterSpacing:0}}>/{total}</span>
          </div>
          <div style={{fontSize:16,color:"#6b7280",fontWeight:500,...F}}>
            {pct===100?"Perfect. You know your stuff.":pct>=70?"Solid foundation. A few gaps.":pct>=40?"Good start.":"Let's build from here."}
          </div>
        </div>
        <div className="fu" style={{marginBottom:14}}>
          <div style={{fontSize:12,color:"#9ca3af",fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:10,...F}}>Start here</div>
          <div onClick={()=>onStart(recommended)} className="tap"
            style={{background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 2px 20px rgba(0,0,0,0.06)",border:"1px solid #ebebeb"}}>
            <div style={{background:cm.color,padding:"22px 20px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:34,flexShrink:0}}>{recommended.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",fontWeight:600,marginBottom:3,...F}}>Based on your results</div>
                <div style={{fontSize:18,fontWeight:700,color:"#fff",lineHeight:1.2,letterSpacing:-0.3}}>{recommended.title}</div>
              </div>
            </div>
            <div style={{padding:"13px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{width:7,height:7,borderRadius:999,background:dd.dot}}/>
                <span style={{fontSize:13,color:"#6b7280",...F}}>{recommended.difficulty}</span>
              </div>
              <span style={{fontSize:14,fontWeight:600,color:"#111",...F}}>Start →</span>
            </div>
          </div>
        </div>
        <div style={{textAlign:"center",paddingTop:6}}>
          <button onClick={onBrowse} style={{background:"none",border:"none",color:"#9ca3af",fontSize:14,cursor:"pointer",...F}}>Browse all topics</button>
        </div>
      </div>
    </div>
  );
}

function ScoreModal({score,completed,onClose}){
  const{label,color}=getScoreLabel(score);
  const[copied,setCopied]=useState(false);
  const shareText=`My AI Literacy Score: ${score}/100 — ${label} on VibeLearn. ${completed.length}/${TOPICS.length} topics done. vibelearn-pi.vercel.app`;
  function share(){
    if(navigator.share)navigator.share({text:shareText}).catch(()=>{});
    else navigator.clipboard?.writeText(shareText).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});
  }
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,backdropFilter:"blur(6px)",padding:"24px 16px"}}>
      <div className="pi" onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:24,padding:"32px 24px 28px",width:"100%",maxWidth:380,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div className="sr" style={{fontSize:80,fontWeight:800,color,lineHeight:1,letterSpacing:-3,marginBottom:3}}>{score}</div>
          <div style={{fontSize:13,color:"#9ca3af",marginBottom:10,...F}}>out of 100</div>
          <div style={{display:"inline-block",background:color+"18",color,borderRadius:999,padding:"5px 16px",fontSize:14,fontWeight:600,...F}}>{label}</div>
        </div>
        <div style={{background:"#f7f7f5",borderRadius:14,padding:"13px 16px",marginBottom:16}}>
          <div style={{fontSize:14,color:"#374151",...F}}>{completed.length} of {TOPICS.length} topics complete</div>
          {score<100&&<div style={{fontSize:12,color:"#9ca3af",marginTop:2,...F}}>Complete more to raise your score</div>}
        </div>
        <button onClick={share} className="tap"
          style={{background:copied?"#16a34a":"#111",color:"#fff",border:"none",borderRadius:14,padding:"14px 24px",fontSize:15,fontWeight:600,...F,width:"100%",marginBottom:8,transition:"background 0.2s"}}>
          {copied?"Copied ✓":"Share my score"}
        </button>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#9ca3af",fontSize:14,...F,width:"100%",cursor:"pointer",padding:"6px"}}>Close</button>
      </div>
    </div>
  );
}

function LessonView({topic,appState,persist,onBack}){
  const[phase,setPhase]=useState("steps");
  const[stepIdx,setStepIdx]=useState(0);
  const[stepDir,setStepDir]=useState("fwd");
  const[quizIdx,setQuizIdx]=useState(0);
  const[selected,setSelected]=useState(null);
  const[qResult,setQResult]=useState(null);
  const[score,setScore]=useState(0);
  const[editPrompt,setEditPrompt]=useState(topic.try_it_prompt);
  const[aiOut,setAiOut]=useState("");
  const[aiLoad,setAiLoad]=useState(false);
  const[aiErr,setAiErr]=useState("");
  const[toastMsg,setToastMsg]=useState(null);
  const[toastKey,setToastKey]=useState(0);
  const[whyText,setWhyText]=useState("");
  const[whyLoad,setWhyLoad]=useState(false);

  const cm=CAT[topic.category]||{color:"#6366f1",bg:"#eef2ff"};
  const dd=DIFF[topic.difficulty]||DIFF.Beginner;
  const step=topic.steps[stepIdx];
  const q=topic.quiz[quizIdx];
  const done=appState.completed.includes(topic.slug);
  const fs=Math.min(score,topic.quiz.length);

  function toast(msg){setToastMsg(msg);setToastKey(k=>k+1);}

  function nextStep(){
    setStepDir("fwd");
    if(stepIdx<topic.steps.length-1)setStepIdx(i=>i+1);
    else{setPhase("quiz");setQuizIdx(0);setScore(0);setSelected(null);setQResult(null);setWhyText("");}
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function pickAnswer(i){
    if(qResult)return;setSelected(i);
    const correct=i===q.answer;setQResult(correct?"correct":"wrong");
    if(correct)setScore(s=>s+1);
    if(!correct){
      setWhyLoad(true);
      callClaude(`2 plain sentences, no markdown: why is "${q.opts[i]}" wrong and "${q.opts[q.answer]}" correct for: "${q.q}"`)
        .then(t=>{setWhyText(t.replace(/\n/g," ").replace(/\*\*/g,"").replace(/\*/g,"").trim());setWhyLoad(false);})
        .catch(()=>setWhyLoad(false));
    }
  }

  function nextQuiz(){
    if(quizIdx<topic.quiz.length-1){setQuizIdx(i=>i+1);setSelected(null);setQResult(null);setWhyText("");}
    else{
      const passed=fs>=Math.ceil(topic.quiz.length*0.67);
      if(passed){
        if(!done){
          let s={...appState,completed:[...appState.completed,topic.slug]};
          s=updateStreak(s);s.xp=(s.xp||0)+50;persist(s);toast("Topic complete \u2713");
        }
        setPhase("try");
      } else {setPhase("retry");}
    }
  }

  function runPrompt(){
    if(aiLoad)return;
    const today=new Date().toDateString();
    const runs={...(appState.exerciseRunsToday||{})};
    if((runs[today]||0)>=3){setAiErr("Daily limit reached.");return;}
    setAiLoad(true);setAiOut("");setAiErr("");
    callClaude(editPrompt)
      .then(t=>{setAiOut(t);setAiLoad(false);persist({...appState,exerciseRunsToday:{...runs,[today]:(runs[today]||0)+1}});toast("Done \u2713");})
      .catch(e=>{setAiErr(e.message==="429"?"Rate limit — try again shortly.":"Something went wrong.");setAiLoad(false);});
  }

  const cardTypes={
    misconception:{bg:"#fff1f2",border:"#fecdd3",badge:"#dc2626",label:"Misconception",headColor:"#9f1239"},
    realworld:    {bg:"#f0fdf4",border:"#bbf7d0",badge:"#16a34a",label:"Real World",headColor:"#14532d"},
    scenario:     {bg:"#fffbeb",border:"#fde68a",badge:"#d97706",label:"Scenario",headColor:"#78350f"},
    connect:      {bg:"#f5f3ff",border:"#ddd6fe",badge:"#7c3aed",label:"Connect",headColor:"#4c1d95"},
  };

  function renderStep(){
    if(step.type==="diagram") return(
      <div style={{background:"#fff",borderRadius:20,padding:"22px 18px",border:"1px solid #ebebeb"}}>
        <div style={{fontSize:11,color:cm.color,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12,...F}}>{step.heading}</div>
        <div style={{background:"#f7f7f5",borderRadius:12,padding:"12px",border:"1px solid #ebebeb"}}>{Diagrams[step.diagramKey]?.()}</div>
      </div>
    );
    if(step.type==="analogy") return <AnalogyCard step={step} cm={cm}/>;
    const cfg=cardTypes[step.type];
    if(cfg) return(
      <div style={{background:cfg.bg,borderRadius:20,padding:"26px 22px",border:`1px solid ${cfg.border}`}}>
        <div style={{display:"inline-flex",alignItems:"center",background:cfg.badge,borderRadius:999,padding:"3px 11px",marginBottom:14}}>
          <span style={{fontSize:11,color:"#fff",fontWeight:700,letterSpacing:1,textTransform:"uppercase",...F}}>{cfg.label}</span>
        </div>
        <p style={{fontSize:18,fontWeight:700,color:cfg.headColor,lineHeight:1.3,marginBottom:12,letterSpacing:-0.2}}>{step.heading}</p>
        <p style={{fontSize:16,color:"#374151",lineHeight:1.85,...F}}>{step.body}</p>
      </div>
    );
    return(
      <div style={{background:"#fff",borderRadius:20,padding:"26px 22px",border:"1px solid #ebebeb"}}>
        <div style={{fontSize:11,color:cm.color,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12,...F}}>{STEP_CONFIG[step.type]||step.type}</div>
        <p style={{fontSize:18,fontWeight:700,color:"#111",lineHeight:1.3,marginBottom:12,letterSpacing:-0.2}}>{step.heading}</p>
        <p style={{fontSize:16,color:"#374151",lineHeight:1.85,...F}}>{step.body}</p>
      </div>
    );
  }

  return(
    <div style={{background:"#f7f7f5",minHeight:"100vh",...F,paddingBottom:140}}>
      {toastMsg&&<Toast msg={toastMsg} k={toastKey}/>}
      <div style={{background:"#fff",borderBottom:"1px solid #ebebeb",padding:"12px 20px",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:680,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={onBack} className="tap" style={{background:"none",border:"none",color:"#6b7280",fontSize:15,cursor:"pointer",...F,padding:0,display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontSize:18,lineHeight:1}}>‹</span> Back
          </button>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <span style={{width:7,height:7,borderRadius:999,background:dd.dot}}/>
            <span style={{fontSize:13,color:"#6b7280",...F}}>{topic.difficulty}</span>
            {done&&<span style={{fontSize:13,color:"#22c55e",fontWeight:600,...F}}>· Done</span>}
          </div>
        </div>
      </div>

      <div style={{maxWidth:680,margin:"0 auto",padding:"24px 20px"}}>
        <div className="fu" style={{marginBottom:26}}>
          <div style={{fontSize:38,marginBottom:10,lineHeight:1}}>{topic.emoji}</div>
          <h1 style={{fontSize:26,fontWeight:800,color:"#111",lineHeight:1.2,marginBottom:7,letterSpacing:-0.5}}>{topic.title}</h1>
          <p style={{fontSize:15,color:"#6b7280",lineHeight:1.65,...F}}>{topic.short}</p>
        </div>

        {phase==="steps"&&(
          <div className="fi" key={stepIdx}>
            <div style={{display:"flex",gap:4,marginBottom:18}}>
              {topic.steps.map((_,i)=>(
                <div key={i} style={{flex:1,height:3,borderRadius:999,background:i<=stepIdx?"#6366f1":"#e5e5e5",transition:"background 0.3s"}}/>
              ))}
            </div>
            <div style={{marginBottom:14,overflow:"hidden"}}>
              <div key={stepIdx} className={stepDir==="fwd"?"step-fwd":"step-back"}>
                {renderStep()}
              </div>
            </div>
            <div style={{position:"sticky",bottom:0,background:"rgba(247,247,245,0.92)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",paddingTop:10,paddingBottom:24,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,borderTop:"1px solid rgba(0,0,0,0.06)",zIndex:50}}>
              <button
                onClick={()=>{setStepDir("back");setStepIdx(i=>i-1);window.scrollTo({top:0,behavior:"smooth"});}}
                className="tap"
                disabled={stepIdx===0}
                style={{background:"#fff",border:"1px solid #e5e5e5",color:"#6b7280",borderRadius:12,padding:"12px 18px",fontSize:14,fontWeight:500,...F,visibility:stepIdx===0?"hidden":"visible"}}>
                ← Back
              </button>
              <button onClick={nextStep} className="tap"
                style={{background:cm.color,color:"#fff",border:"none",borderRadius:14,padding:"13px 26px",fontSize:15,fontWeight:600,...F,minWidth:160,textAlign:"center"}}>
                {stepIdx<topic.steps.length-1?"Continue →":"Take the quiz →"}
              </button>
            </div>
          </div>
        )}

        {phase==="quiz"&&(
          <div className="fi" key={`q${quizIdx}`}>
            <div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:22}}>
              {topic.quiz.map((_,i)=>(
                <div key={i} style={{width:24,height:24,borderRadius:999,background:i<quizIdx?"#6366f1":i===quizIdx?"#eef2ff":"#f3f4f6",border:i===quizIdx?"1.5px solid #6366f1":"1.5px solid transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:i<quizIdx?"#fff":i===quizIdx?"#6366f1":"#9ca3af",transition:"all 0.2s"}}>
                  {i<quizIdx?"✓":i+1}
                </div>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:20,padding:"22px 20px",border:"1px solid #ebebeb",marginBottom:10}}>
              <p style={{fontSize:18,fontWeight:700,color:"#111",lineHeight:1.35,marginBottom:20,letterSpacing:-0.2}}>{q.q}</p>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {q.opts.map((opt,i)=>{
                  let bg="#f7f7f5",border="1px solid #e5e5e5",color="#374151",fw=500,shadow="none";
                  if(qResult&&selected===i&&qResult==="correct"){bg="#f0fdf4";border="1.5px solid #22c55e";color="#15803d";fw=600;shadow="0 0 0 3px rgba(34,197,94,0.1)";}
                  else if(qResult&&selected===i&&qResult==="wrong"){bg="#fef2f2";border="1.5px solid #ef4444";color="#dc2626";fw=600;shadow="0 0 0 3px rgba(239,68,68,0.1)";}
                  else if(qResult&&i===q.answer){bg="#f0fdf4";border="1.5px solid #22c55e";color="#15803d";fw=600;}
                  return(
                    <button key={i} onClick={()=>pickAnswer(i)} disabled={!!qResult} className="opt"
                      style={{background:bg,border,color,borderRadius:12,padding:"13px 15px",fontSize:15,fontWeight:fw,textAlign:"left",...F,display:"flex",alignItems:"center",gap:9,boxShadow:shadow,transition:"all 0.13s"}}>
                      <span style={{width:24,height:24,borderRadius:999,background:qResult&&selected===i&&qResult==="correct"?"#22c55e":qResult&&selected===i&&qResult==="wrong"?"#ef4444":qResult&&i===q.answer?"#22c55e":"#e5e5e5",color:qResult&&(selected===i||i===q.answer)?"#fff":"#9ca3af",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0,transition:"all 0.13s"}}>
                        {qResult&&i===q.answer?"✓":qResult&&selected===i?"✗":String.fromCharCode(65+i)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {qResult&&(
                <div className="fi" style={{marginTop:12}}>
                  {qResult==="correct"?(
                    <div style={{padding:"11px 14px",borderRadius:10,background:"#f0fdf4",border:"1px solid #bbf7d0",display:"flex",alignItems:"center",gap:8}}>
                      <span style={{width:24,height:24,borderRadius:999,background:"#22c55e",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,flexShrink:0}}>✓</span>
                      <span style={{fontSize:14,fontWeight:600,color:"#15803d",...F}}>Correct</span>
                    </div>
                  ):(
                    <div style={{borderRadius:12,overflow:"hidden",border:"1px solid #fca5a5"}}>
                      <div style={{padding:"11px 14px",background:"#fef2f2",display:"flex",alignItems:"center",gap:8}}>
                        <span style={{width:24,height:24,borderRadius:999,background:"#ef4444",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,flexShrink:0}}>✗</span>
                        <span style={{fontSize:14,fontWeight:600,color:"#dc2626",...F}}>Incorrect — right answer highlighted</span>
                      </div>
                      {(whyLoad||whyText)&&(
                        <div style={{padding:"12px 14px",background:"#fff"}}>
                          <div style={{fontSize:11,color:"#6366f1",fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:6,...F}}>Why?</div>
                          {whyLoad
                            ?<div style={{fontSize:13,color:"#9ca3af",...F,display:"flex",alignItems:"center",gap:5}}><span className="pulse">●</span> Explaining…</div>
                            :<p style={{fontSize:14,color:"#374151",lineHeight:1.75,...F}}>{whyText}</p>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            {qResult&&(
              <div style={{textAlign:"right"}} className="fi">
                <button onClick={nextQuiz} className="tap"
                  style={{background:"#111",color:"#fff",border:"none",borderRadius:12,padding:"12px 22px",fontSize:14,fontWeight:600,...F}}>
                  {quizIdx<topic.quiz.length-1?"Next →":"See results →"}
                </button>
              </div>
            )}
          </div>
        )}

        {phase==="retry"&&(
          <div className="fi" style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:20,fontWeight:700,color:"#111",marginBottom:6,letterSpacing:-0.3}}>Almost there</div>
            <p style={{fontSize:14,color:"#6b7280",marginBottom:24,lineHeight:1.7,...F}}>{fs}/{topic.quiz.length} correct. Review and try again.</p>
            <div style={{display:"flex",gap:8,justifyContent:"center"}}>
              <button onClick={()=>{setPhase("steps");setStepIdx(0);}} className="tap"
                style={{background:"#fff",border:"1px solid #e5e5e5",color:"#374151",borderRadius:12,padding:"11px 20px",fontSize:14,fontWeight:500,...F}}>Review</button>
              <button onClick={()=>{setPhase("quiz");setQuizIdx(0);setScore(0);setSelected(null);setQResult(null);setWhyText("");}} className="tap"
                style={{background:"#111",color:"#fff",border:"none",borderRadius:12,padding:"11px 20px",fontSize:14,fontWeight:600,...F}}>Try again</button>
            </div>
          </div>
        )}

        {phase==="try"&&(
          <div className="fi">
            <div className="complete-pop" style={{background:"#111",borderRadius:20,padding:"26px 22px",marginBottom:18,textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:8}}>✓</div>
              <div style={{fontSize:20,fontWeight:700,color:"#fff",marginBottom:4,letterSpacing:-0.3}}>{done?"Already done":"Topic complete"}</div>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:18,...F}}>{fs}/{topic.quiz.length} correct</p>
              <div style={{display:"flex",gap:7,justifyContent:"center",flexWrap:"wrap"}}>
                <button onClick={()=>{const text=`Just finished "${topic.title}" on VibeLearn \uD83E\uDDE0 vibelearn-pi.vercel.app`;if(navigator.share)navigator.share({text});else navigator.clipboard?.writeText(text).then(()=>toast("Copied \u2713"));}} className="tap"
                  style={{background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.7)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"9px 16px",fontSize:13,fontWeight:500,...F}}>Share</button>
                <button onClick={onBack} className="tap"
                  style={{background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.7)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"9px 16px",fontSize:13,fontWeight:500,...F}}>All topics</button>
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:20,padding:"20px 18px",border:"1px solid #ebebeb"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:11,color:"#6366f1",fontWeight:700,letterSpacing:1,textTransform:"uppercase",...F}}>Try it live</span>
                <span style={{fontSize:11,color:"#9ca3af",...F}}>3 runs/day</span>
              </div>
              <p style={{fontSize:13,color:"#9ca3af",marginBottom:10,lineHeight:1.6,...F}}>Edit and run for a real AI response.</p>
              <textarea value={editPrompt} onChange={e=>setEditPrompt(e.target.value)} rows={4}
                style={{width:"100%",borderRadius:10,border:"1px solid #e5e5e5",padding:"11px 13px",fontSize:14,color:"#374151",lineHeight:1.7,resize:"vertical",background:"#f7f7f5",...F}}/>
              <button onClick={runPrompt} disabled={aiLoad} className="tap"
                style={{marginTop:9,background:aiLoad?"#d1d5db":"#6366f1",color:"#fff",border:"none",borderRadius:10,padding:"11px 18px",fontSize:13,fontWeight:600,...F,display:"flex",alignItems:"center",gap:5}}>
                {aiLoad?<><span className="pulse">●</span> Running…</>:"▶ Run"}
              </button>
              {aiErr&&<p style={{fontSize:12,color:"#ef4444",marginTop:7,...F}}>{aiErr}</p>}
              {aiOut&&(
                <div style={{marginTop:12,padding:"12px",background:"#f7f7f5",borderRadius:10,border:"1px solid #ebebeb"}}>
                  <div style={{fontSize:10,color:"#9ca3af",fontWeight:600,marginBottom:5,...F,letterSpacing:1,textTransform:"uppercase"}}>Response</div>
                  <div style={{fontSize:14,color:"#374151",lineHeight:1.8,whiteSpace:"pre-wrap",wordBreak:"break-word",...F}}>{aiOut}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VibeLearn(){
  const[st,setSt]=useState(null);
  const[view,setView]=useState("home");
  const[topic,setTopic]=useState(null);
  const[ready,setReady]=useState(false);
  const[showScore,setShowScore]=useState(false);
  const[diagResult,setDiagResult]=useState(null);
  const[filter,setFilter]=useState("All");
  const[filterKey,setFilterKey]=useState(0);
  const[navDir,setNavDir]=useState("forward");

  useEffect(()=>{loadState().then(s=>{setSt(s||defaultState());setReady(true);});},[]);
  const persist=useCallback((s)=>{setSt(s);saveState(s);},[]);

  function openTopic(t){
    setNavDir("forward");
    setTopic(t);setView("topic");
    setTimeout(()=>window.scrollTo({top:0,behavior:"smooth"}),40);
    if(!st.started?.includes(t.slug)&&!st.completed.includes(t.slug)){
      persist({...st,started:[...(st.started||[]),t.slug]});
    }
  }

  function goBack(){
    setNavDir("back");
    setView("home");
    setTimeout(()=>window.scrollTo({top:0}),40);
  }

  function changeFilter(f){
    setFilter(f);
    setFilterKey(k=>k+1);
  }

  if(!ready||!st)return(
    <div style={{background:"#f7f7f5",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",...F}}>
      <div style={{textAlign:"center"}}>
        <div className="pulse" style={{fontSize:32,marginBottom:10,color:"#6366f1"}}>✦</div>
        <div style={{color:"#9ca3af",fontSize:13}}>Loading…</div>
      </div>
    </div>
  );

  if(view==="diagnostic"){
    if(diagResult){
      return(
        <div className="slide-in">
          <DiagnosticResults
            result={diagResult}
            onStart={(t)=>{persist({...st,diagnosticDone:true,diagnosticSlug:t.slug,seenIntro:true});setDiagResult(null);openTopic(t);}}
            onBrowse={()=>{persist({...st,diagnosticDone:true,seenIntro:true});setDiagResult(null);setNavDir("back");setView("home");}}/>
        </div>
      );
    }
    return(
      <div className="slide-in">
        <DiagnosticQuiz onComplete={r=>setDiagResult(r)} onExit={()=>{setNavDir("back");setView("home");setDiagResult(null);}}/>
      </div>
    );
  }

  if(view==="topic"&&topic){
    return(
      <div className={navDir==="forward"?"slide-in":"slide-back"} key={topic.slug}>
        <LessonView topic={topic} appState={st} persist={persist} onBack={goBack}/>
      </div>
    );
  }

  // Home
  const score=calcScore(st.completed);
  const{label:scoreLabel,color:scoreColor}=getScoreLabel(score);
  const pct=Math.round((st.completed.length/TOPICS.length)*100);
  const nextTopic=TOPICS.find(t=>!st.completed.includes(t.slug));

  // Onboarding
  if(!st.seenIntro&&!st.diagnosticDone){
    return(
      <div style={{background:"#f7f7f5",minHeight:"100vh",...F}}>
        <div style={{background:"#fff",borderBottom:"1px solid #ebebeb",padding:"14px 20px"}}>
          <span style={{fontSize:17,fontWeight:700,color:"#111",letterSpacing:-0.3}}>Vibe<span style={{color:"#6366f1"}}>Learn</span></span>
        </div>
        <div style={{maxWidth:480,margin:"0 auto",padding:"64px 24px"}}>
          <div className="fu" style={{textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:22}}>🧠</div>
            <h1 style={{fontSize:30,fontWeight:800,color:"#111",lineHeight:1.15,marginBottom:10,letterSpacing:-0.8}}>AI literacy<br/>for everyone.</h1>
            <p style={{fontSize:16,color:"#6b7280",marginBottom:36,lineHeight:1.65,...F}}>10 questions. 2 minutes.<br/>A personalized path through AI.</p>
            <button onClick={()=>setView("diagnostic")} className="tap"
              style={{background:"#111",color:"#fff",border:"none",borderRadius:16,padding:"17px 28px",fontSize:16,fontWeight:600,...F,width:"100%",marginBottom:12,letterSpacing:-0.2}}>
              Take the diagnostic →
            </button>
            <button onClick={()=>persist({...st,seenIntro:true,diagnosticDone:true})} style={{background:"none",border:"none",color:"#9ca3af",fontSize:14,...F,cursor:"pointer"}}>
              Skip, browse topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filtered=filter==="All"?TOPICS:TOPICS.filter(t=>t.difficulty===filter);
  const interp=getInterpretation(score,scoreLabel,nextTopic);

  return(
    <div className={navDir==="back"?"slide-back":"fi"} style={{background:"#f7f7f5",minHeight:"100vh",...F,paddingBottom:80}}>
      {showScore&&<ScoreModal score={score} completed={st.completed} onClose={()=>setShowScore(false)}/>}

      {/* ── HEADER ── */}
      <div style={{background:"#fff",borderBottom:"1px solid #ebebeb",padding:"13px 20px",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:680,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:17,fontWeight:700,color:"#111",letterSpacing:-0.3}}>Vibe<span style={{color:"#6366f1"}}>Learn</span></span>
          {/* Score pill — score + level */}
          <button onClick={()=>setShowScore(true)} className="tap"
            style={{background:`${scoreColor}10`,border:`1.5px solid ${scoreColor}35`,borderRadius:12,padding:"5px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:7}}>
            <span style={{fontSize:15,fontWeight:800,color:scoreColor,letterSpacing:-0.5,lineHeight:1}}>{score}</span>
            <span style={{width:1,height:13,background:scoreColor,opacity:0.25,flexShrink:0}}/>
            <span style={{fontSize:12,color:scoreColor,fontWeight:600,...F,lineHeight:1}}>{scoreLabel}</span>
          </button>
        </div>
      </div>

      <div style={{maxWidth:680,margin:"0 auto",padding:"22px 20px"}}>

        {/* ── INTERPRETATION BLOCK ── */}
        <div className="fu" style={{marginBottom:20}}>
          <div style={{fontSize:17,fontWeight:700,color:"#111",letterSpacing:-0.3,marginBottom:3,...F}}>{interp.heading}</div>
          <div style={{fontSize:14,color:"#6b7280",lineHeight:1.6,...F}}>{interp.sub}</div>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="fu" style={{marginBottom:26}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
            <span style={{fontSize:13,fontWeight:600,color:"#374151",...F}}>{st.completed.length} of {TOPICS.length} completed</span>
            <span style={{fontSize:13,fontWeight:600,color:"#374151",...F}}>{pct}%</span>
          </div>
          <div style={{background:"#e5e5e5",borderRadius:999,height:8,overflow:"hidden"}}>
            <div style={{background:"linear-gradient(90deg,#6366f1,#818cf8)",height:"100%",width:`${pct}%`,borderRadius:999,transition:"width 1s cubic-bezier(.4,0,.2,1)",minWidth:pct>0?8:0}}/>
          </div>
        </div>

        {/* ── NEXT LESSON CTA ── */}
        {st.completed.length<TOPICS.length&&nextTopic&&(()=>{
          const cm=CAT[nextTopic.category]||{color:"#6366f1"};
          const dd=DIFF[nextTopic.difficulty]||DIFF.Beginner;
          const rt=getReadTime(nextTopic);
          const ctaSub=score<25
            ?"The foundation for everything else in this app."
            :score<50
            ?"Your logical next step."
            :nextTopic.short;
          return(
            <div className="fu" style={{marginBottom:32}}>
              <div onClick={()=>openTopic(nextTopic)} className="tap"
                style={{background:"#111",borderRadius:20,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.18)",border:"1px solid #222"}}>
                {/* Indigo accent line at top */}
                <div style={{height:3,background:"linear-gradient(90deg,#6366f1,#818cf8)"}}/>
                <div style={{padding:"20px 20px 18px",display:"flex",alignItems:"flex-start",gap:14}}>
                  <div style={{fontSize:34,flexShrink:0,lineHeight:1,marginTop:1}}>{nextTopic.emoji}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",fontWeight:700,letterSpacing:1.4,textTransform:"uppercase",marginBottom:6,...F}}>
                      {st.diagnosticDone?"Based on your results · Up next":"Up next"}
                    </div>
                    <div style={{fontSize:19,fontWeight:800,color:"#fff",lineHeight:1.2,marginBottom:6,letterSpacing:-0.4}}>{nextTopic.title}</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",lineHeight:1.5,...F}}>{ctaSub}</div>
                  </div>
                </div>
                {/* CTA strip — indigo button feel */}
                <div style={{background:"#6366f1",margin:"0 14px 14px",borderRadius:12,padding:"13px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{width:6,height:6,borderRadius:999,background:"rgba(255,255,255,0.5)"}}/>
                    <span style={{fontSize:12,color:"rgba(255,255,255,0.7)",...F}}>{nextTopic.difficulty} · {rt}</span>
                  </div>
                  <span style={{fontSize:14,fontWeight:700,color:"#fff",...F,letterSpacing:-0.1}}>Start lesson →</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* All done */}
        {st.completed.length===TOPICS.length&&(
          <div className="fu" style={{background:"#111",borderRadius:20,padding:"26px 22px",marginBottom:32,textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:6}}>🎓</div>
            <div style={{fontSize:18,fontWeight:700,color:"#fff",letterSpacing:-0.3}}>All {TOPICS.length} topics complete</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginTop:3,...F}}>Score: 100/100 · AI Literate</div>
          </div>
        )}

        {/* ── TOPIC LIST — no filter chips, section headers only ── */}
        <div key={filterKey}>
        {(()=>{
          const groups=[
            ["Beginner",  TOPICS.filter(t=>t.difficulty==="Beginner")],
            ["Intermediate",TOPICS.filter(t=>t.difficulty==="Intermediate")],
            ["Advanced",  TOPICS.filter(t=>t.difficulty==="Advanced")],
          ];
          let animIdx=0;
          return groups.map(([label,topics])=>{
            if(!topics.length)return null;
            const dd=DIFF[label]||DIFF.Beginner;
            const doneInGroup=topics.filter(t=>st.completed.includes(t.slug)).length;
            return(
              <div key={label} className="filter-fade" style={{marginBottom:28,animationDelay:label==="Beginner"?"0s":label==="Intermediate"?"0.05s":"0.1s"}}>
                {/* Section header */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,paddingLeft:2}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <span style={{width:8,height:8,borderRadius:999,background:dd.dot,flexShrink:0}}/>
                    <span style={{fontSize:13,fontWeight:700,color:"#374151",...F}}>{label}</span>
                  </div>
                  <span style={{fontSize:12,color:"#b0b0b0",...F}}>{doneInGroup} of {topics.length} completed</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {topics.map((t)=>{
                    const cm=CAT[t.category]||{color:"#6366f1",bg:"#eef2ff"};
                    const isDone=st.completed.includes(t.slug);
                    const isStarted=(st.started||[]).includes(t.slug)&&!isDone;
                    const rt=getReadTime(t);
                    const delay=Math.min(animIdx*0.055,0.6);
                    animIdx++;
                    return(
                      <div key={t.slug} onClick={()=>openTopic(t)} className="tap fu"
                        style={{animationDelay:`${delay}s`,background:isDone?"#f9fdf9":"#fff",borderRadius:16,padding:"15px 16px",display:"flex",alignItems:"center",gap:13,border:isDone?"1px solid #d1fae5":"1px solid #ebebeb",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                        {/* Icon — no strikethrough, green tint bg when done */}
                        <div style={{width:40,height:40,borderRadius:12,background:isDone?"#dcfce7":cm.bg,border:isDone?"1.5px solid #86efac":`1.5px solid ${cm.color}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {isDone
                            ?<span style={{fontSize:17,color:"#16a34a",fontWeight:700}}>✓</span>
                            :<span style={{fontSize:20}}>{t.emoji}</span>}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                            <span style={{fontSize:11,color:cm.color,fontWeight:600,...F,background:cm.bg,borderRadius:999,padding:"2px 8px"}}>{t.category}</span>
                            {isDone&&<span style={{fontSize:11,color:"#16a34a",fontWeight:600,...F}}>Completed</span>}
                            {isStarted&&<span style={{fontSize:11,color:"#d97706",fontWeight:500,...F}}>In progress</span>}
                          </div>
                          {/* Full readable title — no strikethrough */}
                          <div style={{fontSize:15,fontWeight:600,color:isDone?"#374151":"#111",letterSpacing:-0.2,lineHeight:1.3,...F}}>{t.title}</div>
                          <div style={{fontSize:12,color:"#b0b0b0",marginTop:3,...F}}>{rt}</div>
                        </div>
                        <span style={{color:"#d4d4d4",fontSize:18,flexShrink:0}}>›</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          });
        })()}
        </div>

        {/* ── FOOTER ── */}
        <div style={{marginTop:32,paddingTop:16,borderTop:"1px solid #ebebeb",display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
          <button onClick={()=>setView("diagnostic")} style={{background:"none",border:"none",color:"#b0b0b0",fontSize:12,cursor:"pointer",...F}}>
            {st.diagnosticDone?"Retake diagnostic →":"Take the diagnostic →"}
          </button>
          <span style={{color:"#e5e5e5",fontSize:11}}>·</span>
          <a href="https://www.linkedin.com/in/acook11/" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#b0b0b0",...F,textDecoration:"none"}}>About</a>
        </div>
      </div>
      <Analytics />
    </div>
  );
}
