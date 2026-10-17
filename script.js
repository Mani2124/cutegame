(()=>{
const c=document.querySelector("#scene"),ctx=c.getContext("2d"),label=document.querySelector("#current"),btn=document.querySelector("#pause");
const langs=[
["I love you","English"],["நான் உன்னை காதலிக்கிறேன்","Tamil"],["Ich liebe dich","German"],["Je t’aime","French"],["Te amo","Spanish"],["Ti amo","Italian"],["Eu te amo","Portuguese"],["मैं तुमसे प्यार करता हूँ","Hindi"],["আমি তোমাকে ভালোবাসি","Bengali"],["నేను నిన్ను ప్రేమిస్తున్నాను","Telugu"],["ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ","Kannada"],["ഞാൻ നിന്നെ സ്നേഹിക്കുന്നു","Malayalam"],["我爱你","Chinese"],["愛してる","Japanese"],["사랑해","Korean"],["أحبك","Arabic"],["دوستت دارم","Persian"],["Я тебя люблю","Russian"],["Я тебе кохаю","Ukrainian"],["Kocham cię","Polish"],["Ik hou van jou","Dutch"],["Jag älskar dig","Swedish"],["Jeg elsker deg","Norwegian"],["Rakastan sinua","Finnish"],["Σ’ αγαπώ","Greek"],["Seni seviyorum","Turkish"],["Mahal kita","Filipino"],["Aku cinta kamu","Indonesian"],["ฉันรักคุณ","Thai"],["Anh yêu em","Vietnamese"],["Nakupenda","Swahili"],["Ngiyakuthanda","Zulu"],["Te iubesc","Romanian"],["Szeretlek","Hungarian"],["Volim te","Croatian"],["Të dua","Albanian"],["Miluji tě","Czech"],["Aloha au iā ʻoe","Hawaiian"],["Kei te aroha au ki a koe","Māori"],["Ես քեզ սիրում եմ","Armenian"],["אני אוהב אותך","Hebrew"],["မင်းကိုချစ်တယ်","Burmese"],["ខ្ញុំស្រឡាញ់អ្នក","Khmer"],["म तिमीलाई माया गर्छु","Nepali"],["මම ඔයාට ආදරෙයි","Sinhala"],["Ndiyakuthanda","Xhosa"],["Mo nifẹ rẹ","Yoruba"],["Inħobbok","Maltese"],["T'estimo","Catalan"],["Maite zaitut","Basque"]
];
let W,H,DPR,elapsed=0,last=0,paused=false,rose=[],hearts=[],sparkles=[],shown=-1;
const rnd=(a,b)=>a+Math.random()*(b-a),TAU=Math.PI*2;
function heartXY(t){return [16*Math.sin(t)**3,13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t)]}
function reset(){
 W=innerWidth;H=innerHeight;DPR=Math.min(devicePixelRatio||1,2);c.width=W*DPR;c.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);
 rose=[];hearts=[];sparkles=[];
 const s=Math.min(W/470,H/800,1.2),cx=W*.5,headY=H*.37,roseW=Math.min(W*.42,245),roseH=Math.min(H*.31,225),stemEnd=Math.min(H*.83,headY+roseH*1.8);
 // Rose head silhouette: curved layered petals, with a pinched base.
 const rows=25;
 for(let j=0;j<rows;j++){
  const v=j/(rows-1),y=headY+(v-.48)*roseH;
  const radius=(Math.sin(Math.PI*(v*.92+.05))**.67)*(roseW*.5)*(1-.19*v);
  const count=Math.max(2,Math.round(radius/(W<500?18:23)));
  for(let k=-count;k<=count;k++){
   const u=k/count,x=cx+u*radius;
   if(Math.random()<.11)continue;
   const n=rose.length,m=langs[n%langs.length];
   rose.push({x,y:y+Math.sin(u*4+v*7)*roseH*.035,word:m[0],lang:m[1],font:rnd(W<500?6:8,W<500?9:12),delay:n*32,color:n%7===0?"#ff9cb7":n%4===0?"#ff5b88":"#d91b57"});
  }
 }
 // Add curved outer petals and inner spiral with words following rose geometry.
 for(let i=0;i<120;i++){
  const a=i*.24,r=(5+i*.47)*s,ang=a+.6;
  const x=cx+Math.cos(ang)*r,y=headY-roseH*.06+Math.sin(ang)*r*.65;
  if(Math.abs(x-cx)>roseW*.47||Math.abs(y-headY+roseH*.48)>roseH*.52)continue;
  const m=langs[(i*3)%langs.length];
  rose.push({x,y,word:m[0],lang:m[1],font:rnd(7,10),delay:i*39,color:i%3===0?"#ffb3c9":"#ff4277"});
 }
 // Stem formed of words.
 for(let i=0;i<55;i++){
  const v=i/54,x=cx+Math.sin(v*5)*roseW*.035,y=headY+roseH*.45+v*(stemEnd-(headY+roseH*.45));
  const m=langs[(i*7)%langs.length];
  rose.push({x,y,word:m[0],lang:m[1],font:rnd(7,10),delay:1300+i*65,color:i%4===0?"#a1f8a2":"#4bbf70"});
 }
 // Two leaves, also made of words.
 for(const side of [-1,1])for(let i=0;i<54;i++){
  const v=i/53,spread=Math.sin(Math.PI*v)*roseW*.26;
  const x=cx+side*(v*roseW*.57+Math.random()*spread*.4);
  const y=headY+roseH*.82+v*roseH*.39-Math.sin(Math.PI*v)*roseH*.21+Math.random()*15;
  const m=langs[(i*5+17)%langs.length];
  rose.push({x,y,word:m[0],lang:m[1],font:rnd(6,9),delay:1800+i*53,color:"#55c876"});
 }
 // Giant heart BEHIND the rose: little hearts float UP from bottom to outline a heart.
 const heartScale=Math.min(W/(W<600?41:37),H/38),hy=H*.48;
 for(let i=0;i<175;i++){
  const t=TAU*i/175,[hx,hy0]=heartXY(t);
  hearts.push({tx:cx+hx*heartScale,ty:hy-hy0*heartScale,x:rnd(0,W),y:H+rnd(30,H*.7),start:i*65,phase:rnd(0,TAU),size:rnd(7,15),alpha:rnd(.3,.76)});
 }
 for(let i=0;i<55;i++)sparkles.push({x:rnd(0,W),y:rnd(0,H),speed:rnd(7,20),size:rnd(3,10),alpha:rnd(.08,.25)});
}
function ease(t){return 1-(1-t)**3}
function frame(ms){
 if(!last)last=ms;const dt=Math.min((ms-last)/1000,.06);last=ms;if(!paused)elapsed+=dt*1000;
 const cycle=elapsed%23000,fade=cycle>20500?Math.max(0,1-(cycle-20500)/2200):1;
 ctx.fillStyle="#08030f";ctx.fillRect(0,0,W,H);
 const g=ctx.createRadialGradient(W*.5,H*.48,0,W*.5,H*.48,Math.max(W,H)*.65);
 g.addColorStop(0,"#25071e");g.addColorStop(.6,"#100517");g.addColorStop(1,"#08030f");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.textAlign="center";ctx.textBaseline="middle";
 for(const sp of sparkles){const y=(sp.y-elapsed*.001*sp.speed+H*100)%H;ctx.globalAlpha=sp.alpha;ctx.fillStyle="#fa86b0";ctx.font=`${sp.size}px sans-serif`;ctx.fillText("♥",sp.x,y)}
 // Behind rose: heart outline builds slowly, floating from bottom upward.
 ctx.save();ctx.shadowColor="#ff2d7e";ctx.shadowBlur=14;
 for(const p of hearts){
  const k=Math.max(0,Math.min(1,(cycle-p.start)/3900));if(k===0)continue;
  const e=ease(k),x=p.x+(p.tx-p.x)*e+Math.sin(elapsed*.001+p.phase)*(1-e)*18,y=p.y+(p.ty-p.y)*e;
  ctx.globalAlpha=p.alpha*fade*Math.min(1,k*3);ctx.fillStyle="#ff4b91";ctx.font=`${p.size*(1+Math.sin(elapsed*.002+p.phase)*.05)}px sans-serif`;ctx.fillText("♥",x,y);
 }
 ctx.restore();
 // Foreground rose is constructed ENTIRELY of love words.
 ctx.save();ctx.shadowColor="#f52b67";ctx.shadowBlur=3;
 for(let i=0;i<rose.length;i++){
  const p=rose[i],k=Math.max(0,Math.min(1,(cycle-p.delay)/1900));if(k<=0)continue;
  const e=ease(k),x=p.x+Math.sin(elapsed*.0008+i)*(1-e)*45,y=H+35+(p.y-H-35)*e;
  ctx.globalAlpha=fade*Math.min(1,k*4)*.93;ctx.fillStyle=p.color;
  ctx.font=`600 ${p.font}px "Segoe UI","Noto Sans Tamil","Noto Sans Devanagari","Noto Sans Arabic",sans-serif`;
  ctx.fillText(p.word,x,y);
 }
 ctx.restore();ctx.globalAlpha=1;
 const ix=Math.floor(cycle/700);if(ix!==shown){shown=ix;const m=langs[ix%langs.length];label.textContent=`${m[0]} · ${m[1]}`}
 requestAnimationFrame(frame);
}
document.querySelector("#pause").onclick=()=>{paused=!paused;btn.textContent=paused?"▶ Resume":"Ⅱ Pause"};
document.querySelector("#replay").onclick=()=>{elapsed=0;shown=-1;reset();paused=false;btn.textContent="Ⅱ Pause"};
document.querySelector("#share").onclick=async()=>{try{if(navigator.share)await navigator.share({title:document.title,url:location.href});else{await navigator.clipboard.writeText(location.href);alert("Link copied ❤️")}}catch(e){if(e.name!=="AbortError")prompt("Copy link",location.href)}};
addEventListener("resize",reset,{passive:true});reset();requestAnimationFrame(frame);
})();