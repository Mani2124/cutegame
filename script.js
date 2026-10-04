(() => {
  const start=[79.1378,10.7870], end=[78.1667,11.2167];
  const travel=document.getElementById('travel');
  const goGame=()=>document.getElementById('game').scrollIntoView({behavior:'smooth'});
  if(window.maplibregl){try{
    const map=new maplibregl.Map({container:'map',style:'https://demotiles.maplibre.org/style.json',center:[40,20],zoom:1.4,projection:'globe',attributionControl:false});
    map.on('load',()=>{
      map.setFog({color:'rgb(40,25,55)','high-color':'rgb(54,35,68)','horizon-blend':0.09,'space-color':'rgb(26,18,42)','star-intensity':0.3});
      map.addSource('route',{type:'geojson',data:{type:'Feature',geometry:{type:'LineString',coordinates:[start,end]}}});
      map.addLayer({id:'route-line',type:'line',source:'route',paint:{'line-color':'#ff8fa3','line-width':4,'line-dasharray':[2,2]}});
      [[start,'Thanjavur'],[end,'Namakkal']].forEach(([point,name])=>{
        const pin=document.createElement('div');pin.style.cssText='width:18px;height:18px;border-radius:50%;background:#ff4d6d;border:3px solid white;box-shadow:0 0 0 7px #ff4d6d66';
        new maplibregl.Marker({element:pin}).setLngLat(point).setPopup(new maplibregl.Popup().setText(name)).addTo(map);
      });
    });
    travel.addEventListener('click',()=>{map.flyTo({center:start,zoom:6,speed:1.2,essential:true});setTimeout(()=>map.flyTo({center:end,zoom:9,speed:.8,essential:true}),1700);setTimeout(goGame,4400)});
  }catch(e){travel.addEventListener('click',goGame)}}else travel.addEventListener('click',goGame);

  const canvas=document.getElementById('gameCanvas'),ctx=canvas.getContext('2d'),fill=document.getElementById('love-fill'),count=document.getElementById('count');
  const startScreen=document.getElementById('start-screen'),winScreen=document.getElementById('win-screen'),hint=document.getElementById('game-hint');
  let playing=false,score=0,hearts=[],particles=[],frame=0,raf=0;
  const target=12,player={x:0,y:0,w:92};
  function resize(){const box=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(box.width*dpr);canvas.height=Math.round(box.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);player.y=box.height-95;player.x=Math.max(0,Math.min(player.x,box.width-player.w))}
  window.addEventListener('resize',resize);resize();player.x=canvas.clientWidth/2-player.w/2;
  function spawn(){hearts.push({x:25+Math.random()*(canvas.clientWidth-50),y:-35,size:22+Math.random()*14,speed:2+Math.random()*2.4})}
  function heart(x,y,s){ctx.fillStyle='#ff4d6d';ctx.beginPath();ctx.moveTo(x,y+s*.28);ctx.bezierCurveTo(x-s*.6,y-s*.28,x-s,y+s*.35,x,y+s);ctx.bezierCurveTo(x+s,y+s*.35,x+s*.6,y-s*.28,x,y+s*.28);ctx.fill()}
  function basket(){ctx.fillStyle='#ff7994';ctx.beginPath();ctx.ellipse(player.x+player.w/2,player.y+19,player.w/2,28,0,0,Math.PI);ctx.fill();ctx.strokeStyle='#ba3159';ctx.lineWidth=5;ctx.beginPath();ctx.arc(player.x+player.w/2,player.y+8,player.w/2-4,Math.PI,0);ctx.stroke();ctx.font='27px serif';ctx.fillText('🧸',player.x+30,player.y+4)}
  function tick(){if(!playing)return;const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);frame++;if(frame%32===0)spawn();basket();for(let i=hearts.length-1;i>=0;i--){const a=hearts[i];a.y+=a.speed;heart(a.x,a.y,a.size);if(a.y+a.size>player.y&&a.y<player.y+45&&a.x>player.x&&a.x<player.x+player.w){hearts.splice(i,1);score++;fill.style.width=(score/target*100)+'%';count.textContent=score+'/'+target;particles.push({x:a.x,y:a.y,life:35});if(score>=target){playing=false;hint.hidden=true;winScreen.hidden=false;break}}else if(a.y>h+40)hearts.splice(i,1)}for(let i=particles.length-1;i>=0;i--){const p=particles[i];ctx.globalAlpha=p.life/35;ctx.font='25px serif';ctx.fillText('✨',p.x,p.y-(35-p.life));ctx.globalAlpha=1;p.life--;if(!p.life)particles.splice(i,1)}raf=requestAnimationFrame(tick)}
  document.getElementById('start-btn').addEventListener('click',()=>{cancelAnimationFrame(raf);score=0;hearts=[];particles=[];frame=0;fill.style.width='0%';count.textContent='0/'+target;startScreen.hidden=true;winScreen.hidden=true;hint.hidden=false;playing=true;resize();tick()});
  document.getElementById('skip-btn').addEventListener('click',()=>document.getElementById('letters').scrollIntoView({behavior:'smooth'}));
  canvas.addEventListener('pointermove',e=>{if(!playing)return;const rect=canvas.getBoundingClientRect();player.x=Math.max(0,Math.min(e.clientX-rect.left-player.w/2,rect.width-player.w))});
  window.addEventListener('keydown',e=>{if(!playing)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();player.x=Math.max(0,Math.min(player.x+(e.key==='ArrowRight'?45:-45),canvas.clientWidth-player.w))}});
  document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{const messages={'business-yes':'That would make me smile! You can tell Mani when you’re ready. 🌎','business-later':'Of course. Take all the time you need. 💛','personal-yes':'I would love that. You can tell Mani when you feel ready. ☺️','personal-no':'Thank you for being honest. Your answer is respected. 💛'};document.getElementById('reply').textContent=messages[button.dataset.answer]}));
})();
