/* =====================================================================
   NIGHT CITY LIBRE  //  juego 2D con vista cenital, estilo GTA (no es un quiz)
   - Andar/correr, robar y conducir coches, peatones, tráfico y policía con nivel de búsqueda
   - Llamadas y misiones encadenadas + contratos infinitos + eventos aleatorios
   - Dinero, tienda, desbloqueables (también por secretos) y personaje personalizable
   - Minijuegos de hackeo (js/hack.js)
   Sin violencia gráfica: los peatones quedan aturdidos y el arma es un pulso EMP.
   ===================================================================== */
window.DSA_GTA=(function(){
'use strict';
var P=360,RD=96,NB=10,WS=P*NB;
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function rr(n){return Math.random()*n}
function ri(n){return Math.random()*n|0}
function pick(a){return a[ri(a.length)]}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function angDiff(a,b){var d=(b-a)%(Math.PI*2);if(d>Math.PI)d-=Math.PI*2;if(d<-Math.PI)d+=Math.PI*2;return d}
function pad(n){return n<10?'0'+n:''+n}

var PAINTS=[
 {n:'Rojo carmesí',c:'#c0213c',cost:80},{n:'Azul eléctrico',c:'#1f6fff',cost:80},{n:'Verde tóxico',c:'#2bd36b',cost:80},{n:'Negro mate',c:'#16171f',cost:80},
 {n:'Perla',c:'#e9edf5',cost:0,rw:'car:blanco'},{n:'Rayas de carreras',c:'#c0213c',cost:0,rw:'car:rayas',stripe:true},
 {n:'Oro',c:'#e8b923',cost:0,rw:'car:oro'},{n:'GLASS',c:'#7fe9ff',cost:0,rw:'car:glass',glass:true}];
var CT={ /* tipos de vehículo: l largo, w ancho, top velocidad máx, acc aceleración */
 sedan:{l:56,w:30,top:330,acc:300,grip:.9,hp:100},sport:{l:58,w:28,top:430,acc:420,grip:.93,hp:90},van:{l:72,w:34,top:240,acc:180,grip:.86,hp:150},
 master:{l:60,w:28,top:540,acc:560,grip:.95,hp:200},cruiser:{l:58,w:30,top:310,acc:290,grip:.9,hp:110},swat:{l:74,w:36,top:290,acc:240,grip:.88,hp:200}};
var COLS=['#7c3cff','#ff8a00','#2bd36b','#1f6fff','#8a8fa3','#c0213c','#e9edf5','#ffd34d','#16171f','#00b7c2'];
var CALLERS={capri:'CAPRI',fixer:'FIXER // ANÓNIMO',rogue:'ROGUE'};

function create(box,api){
  var h=api.h,esc=api.esc,fx=api.fx,RM=!!api.reduced;
  var dead=false,raf=0,last=performance.now(),T=0;
  /* ---------- guardado ---------- */
  var save={money:200,mi:0,done:0,paint:0,owned:[],emp:0,claimed:[],stats:{stolen:0,missions:0,hacks:0,busts:0}};
  try{var sv=JSON.parse(api.store.get('dsa_gta')||'null');if(sv){for(var k in save)if(sv[k]!=null)save[k]=sv[k]}}catch(e){}
  function persist(){api.store.set('dsa_gta',JSON.stringify(save))}
  function has(r){return window.DSA_SEC&&DSA_SEC.has&&DSA_SEC.rewards().indexOf(r)>=0}

  /* ---------- DOM ---------- */
  var ov=h('div','gta');
  ov.innerHTML='<canvas class="gta-cv"></canvas>'+
   '<div class="gta-hud" hidden>'+
    '<div class="gh-top"><span class="gh-money" id="ghMoney">€ 0</span><span class="gh-stars" id="ghStars" aria-label="Nivel de búsqueda"></span><span class="gh-emp" id="ghEmp">EMP LISTO [F]</span></div>'+
    '<canvas class="gh-map" id="ghMap" width="170" height="170" aria-hidden="true"></canvas>'+
    '<div class="gh-mis" id="ghMis" hidden><small id="ghMisN"></small><b id="ghMisT"></b><span id="ghMisD"></span></div>'+
    '<div class="gh-msgs" id="ghMsgs" aria-live="polite"></div>'+
    '<div class="gh-call" id="ghCall" hidden><div class="gh-face" id="ghFace"></div><div><small>LLAMADA ENTRANTE</small><b id="ghWho"></b><p id="ghTxt"></p><button type="button" class="btn" id="ghAns">CONTESTAR [ENTER]</button></div></div>'+
    '<div class="gh-act" id="ghAct" hidden></div>'+
    '<div class="gh-help">WASD / flechas: mover · SHIFT: correr · E: entrar/salir/usar · ESPACIO: freno de mano · F: pulso EMP · ENTER: contestar · ESC: menú</div>'+
   '</div>'+
   '<div class="gta-menu" id="gMenu"></div><div class="gta-shop" id="gShop" hidden></div><div class="gta-hack" id="gHack" hidden></div><div class="gta-fade" id="gFade"></div>';
  box.appendChild(ov);
  var cv=ov.querySelector('.gta-cv'),ctx=cv.getContext('2d'),mm=ov.querySelector('#ghMap'),mctx=mm.getContext('2d');
  var $=function(s){return ov.querySelector(s)};
  var hud=$('.gta-hud');

  /* ---------- mundo ---------- */
  var rnd=mulberry(90210),BL=[],BS=[],TREES=[],POI={};
  function quadOf(x,y){return x<WS/2?(y<WS/2?0:2):(y<WS/2?1:3)}
  var QC=['#ff2a6d','#00f0ff','#ff8a00','#a66bff'];
  POI.shop={bx:3,by:3,name:'TIENDA DE MODS',col:'#00f0ff'};POI.station={bx:6,by:3,name:'COMISARÍA',col:'#4d7cff'};POI.garage={bx:3,by:6,name:'GARAJE',col:'#ffe600'};POI.hub={bx:6,by:6,name:'NEXO',col:'#39ff88'};
  Object.keys(POI).forEach(function(k){var p=POI[k];p.x=p.bx*P+P/2;p.y=p.by*P+P/2});
  function isPoi(bx,by){for(var k in POI)if(POI[k].bx===bx&&POI[k].by===by)return k;return null}
  (function build(){
    for(var by=0;by<NB;by++)for(var bx=0;bx<NB;bx++){
      var list=[],x0=bx*P+RD/2,y0=by*P+RD/2,B=P-RD,q=quadOf(x0+B/2,y0+B/2);
      BL.push(list);
      if(isPoi(bx,by))continue;
      if(rnd()<.1){for(var t=0;t<7;t++)TREES.push({x:x0+20+rnd()*(B-40),y:y0+20+rnd()*(B-40),r:9+rnd()*8});continue}
      var split=rnd()<.5?2:1,lots=[];
      var m=12;
      if(split===2){var sw=(B-3*m)/2;lots.push([x0+m,y0+m,sw,B-2*m],[x0+2*m+sw,y0+m,sw,B-2*m]);if(rnd()<.5){lots=[[x0+m,y0+m,B-2*m,(B-3*m)/2],[x0+m,y0+2*m+(B-3*m)/2,B-2*m,(B-3*m)/2]]}}
      else lots.push([x0+m,y0+m,B-2*m,B-2*m]);
      lots.forEach(function(l){
        var bd={x:l[0],y:l[1],w:l[2],h:l[3],q:q,ht:(q===0?60+rnd()*140:q===1?40+rnd()*80:q===2?18+rnd()*40:30+rnd()*70),tone:rnd(),ac:rnd()<.5};
        list.push(bd);BS.push(bd)});
    }
  })();
  function blk(x,y){return {bx:clamp(Math.floor(x/P),0,NB-1),by:clamp(Math.floor(y/P),0,NB-1)}}
  function hitB(x,y,r){ /* círculo contra edificios: devuelve {nx,ny,d} o null */
    var b=blk(x,y),best=null;
    for(var j=-1;j<=1;j++)for(var i=-1;i<=1;i++){
      var bx=b.bx+i,by=b.by+j;if(bx<0||by<0||bx>=NB||by>=NB)continue;
      var L=BL[bx+by*NB];
      for(var k=0;k<L.length;k++){var bd=L[k],cx=clamp(x,bd.x,bd.x+bd.w),cy=clamp(y,bd.y,bd.y+bd.h),dx=x-cx,dy=y-cy,d2=dx*dx+dy*dy;
        if(d2<r*r){var d=Math.sqrt(d2)||.001;if(!best||r-d>best.pen){if(d<.01){dx=1;dy=0}best={nx:dx/d,ny:dy/d,pen:r-d}}}}
    }
    return best;
  }
  function onRoad(x,y){var mx=((x%P)+P)%P,my=((y%P)+P)%P,h2=RD/2;return mx<h2||mx>P-h2||my<h2||my>P-h2}
  function roadPoint(minD,maxD,from){ /* punto en una carretera a cierta distancia */
    for(var t=0;t<60;t++){var a=rr(6.283),d=minD+rr(maxD-minD),x=from.x+Math.cos(a)*d,y=from.y+Math.sin(a)*d;
      if(x<60||y<60||x>WS-60||y>WS-60)continue;
      var vx=Math.round(x/P)*P,vy=Math.round(y/P)*P;
      if(Math.abs(x-vx)<Math.abs(y-vy))x=vx;else y=vy;
      if(x>40&&y>40&&x<WS-40&&y<WS-40)return {x:x,y:y}}
    return {x:WS/2,y:WS/2};
  }

  /* ---------- entidades ---------- */
  var pl={x:POI.hub.x,y:POI.hub.y+90,a:-1.57,vx:0,vy:0,car:null,hp:100,cd:0,walk:0};
  var cars=[],peds=[],pick_=[],parts=[],events=[],bust=0;
  var heat=0,unseen=0,emp=0,cam={x:pl.x,y:pl.y,z:1},darkT=0,paused=true,started=false;
  function mkCar(type,x,y,a,ai,col){var s=CT[type];return {type:type,x:x,y:y,a:a,vx:0,vy:0,w:s.w,l:s.l,ai:ai,col:col||pick(COLS),hp:s.hp,stun:0,dir:Math.round(a/(Math.PI/2))&3,turn:0,sp:0,driver:ai==='traffic',stuck:0,rev:0,siren:0,r:Math.max(s.w,s.l*.45)/2+2}}
  function spawnTraffic(){
    var p=roadPoint(520,980,pl),dir=ri(4),d=[[1,0],[0,1],[-1,0],[0,-1]][dir];
    var vert=(dir&1)===1,cx=vert?Math.round(p.x/P)*P:p.x,cy=vert?p.y:Math.round(p.y/P)*P;
    var off=24,x=vert?cx+(-d[1])*0+(-d[0]*0)+(dir===1?-off:off):cx,y=vert?cy:cy+(dir===0?off:-off);
    if(vert)x=cx+(dir===1?-off:off);
    var c=mkCar(Math.random()<.18?'van':'sedan',x,y,dir*Math.PI/2,'traffic');c.dir=dir;c.sp=110+rr(50);
    for(var i=0;i<cars.length;i++)if(Math.hypot(cars[i].x-x,cars[i].y-y)<70)return;
    cars.push(c);
  }
  function spawnParked(n){
    for(var i=0;i<n;i++){var p=roadPoint(200,1000,pl),vert=Math.abs(p.x-Math.round(p.x/P)*P)<1;
      var c=mkCar(Math.random()<.2?'sport':'sedan',vert?p.x+(Math.random()<.5?-38:38):p.x,vert?p.y:p.y+(Math.random()<.5?-38:38),vert?1.5708:0,'park');
      var ok=true;for(var j=0;j<cars.length;j++)if(Math.hypot(cars[j].x-c.x,cars[j].y-c.y)<80)ok=false;
      if(ok&&!hitB(c.x,c.y,18))cars.push(c)}
  }
  function spawnPed(){
    for(var t=0;t<12;t++){var a=rr(6.283),d=260+rr(520),x=pl.x+Math.cos(a)*d,y=pl.y+Math.sin(a)*d;
      if(x<40||y<40||x>WS-40||y>WS-40||hitB(x,y,10))continue;
      peds.push({x:x,y:y,a:rr(6.283),v:30+rr(26),col:pick(['#ff2a6d','#00f0ff','#ffe600','#a66bff','#cfd6e6','#ff8a00']),t:rr(3),st:'walk',dn:0});return}
  }
  function spawnPolice(){
    var stars=starsN(),sw=stars>=4&&Math.random()<.4,p=roadPoint(560,900,pl),vert=Math.abs(p.x-Math.round(p.x/P)*P)<1;
    var c=mkCar(sw?'swat':'cruiser',p.x,p.y,vert?1.57:0,'police','#e9edf5');c.sp=0;c.siren=rr(6);cars.push(c);
  }
  function seed(){
    cars.length=0;peds.length=0;pick_.length=0;
    for(var i=0;i<26;i++)spawnTraffic();spawnParked(46);for(i=0;i<34;i++)spawnPed();
    for(i=0;i<46;i++){var p=roadPoint(80,1500,pl),a=rr(6.283);pick_.push({x:p.x+Math.cos(a)*30,y:p.y+Math.sin(a)*30,v:50+ri(7)*25,t:0})}
    spawnOwned();
  }
  function spawnOwned(){
    cars=cars.filter(function(c){return !c.own});
    var o=save.owned;
    function mk(type,dx){var c=mkCar(type,POI.garage.x+dx,POI.garage.y+ -P/2+RD/2-14,0,'park',PAINTS[save.paint].c);c.own=true;c.y=POI.garage.y-P/2+18;c.x=POI.garage.x+dx;c.col=PAINTS[save.paint].c;c.stripe=PAINTS[save.paint].stripe;c.glass=PAINTS[save.paint].glass;cars.push(c)}
    if(o.indexOf('sport')>=0)mk('sport',-60);
    if(has('car:master'))mk('master',60);
  }
  function starsN(){return heat<=0?0:Math.min(5,Math.ceil(heat/20))}
  function addHeat(n,why){
    var b=starsN();heat=Math.min(100,heat+n);unseen=0;
    if(starsN()>b){msg('BÚSQUEDA '+'★'.repeat(starsN())+(why?' — '+why:''),'bad');fx('siren')}
  }

  /* ---------- mensajes, llamadas y misiones ---------- */
  var msgBox=$('#ghMsgs'),callEl=$('#ghCall'),ring=null,mis=null,nextCall=6,evT=40;
  function msg(t,kind,who){
    var d=h('div','gm '+(kind||''));d.innerHTML=(who?'<b>'+esc(who)+'</b> ':'')+esc(t);msgBox.appendChild(d);
    while(msgBox.children.length>4)msgBox.removeChild(msgBox.firstChild);
    setTimeout(function(){d.classList.add('out')},5200);setTimeout(function(){d.remove()},5800);
  }
  function money(n,why){save.money=Math.max(0,save.money+n);persist();if(n>0){fx('coin');if(why)msg('+€'+n+' · '+why,'ok')}else if(why)msg('−€'+(-n)+' · '+why,'bad')}
  function R(){return pl.car||pl}
  function spot(minD,maxD){return roadPoint(minD,maxD,R())}
  var STORY=[
   {n:'PRIMER ENCARGO',who:'capri',call:'Choom, soy CAPRI. Estás vivo, qué sorpresa. Tengo un trabajillo fácil: ve a un punto que te marco. A pie o en coche, me da igual. Sorpréndeme.',
    reward:250,make:function(){return [{t:'goto',p:spot(500,800),r:70,txt:'Ve al punto marcado'}]}},
   {n:'ENTREGA URGENTE',who:'fixer',call:'Tengo un paquete que no debe tocar la policía. Recógelo, y llévalo antes de que caduque. Necesitarás un coche; tienes los de la calle. No son tuyos, pero tampoco de nadie.',
    reward:450,make:function(){var a=spot(350,600);return [{t:'goto',p:a,r:70,txt:'Recoge el paquete'},{t:'goto',p:spot(1300,1900),r:80,car:true,time:120,txt:'Entrega el paquete en coche (120 s)'}]}},
   {n:'HACKEO EN LA TORRE',who:'capri',call:'Hay un terminal con datos del tema 4: auditoría. Entra y hackéalo, yo mientras me limo las uñas virtuales. Cuidado con los guardias: vigilan.',
    reward:600,make:function(){return [{t:'hack',p:spot(500,900),r:60,type:'route',level:1,txt:'Hackea el terminal'}]}},
   {n:'EL DEPORTIVO',who:'rogue',call:'Quiero ese deportivo plateado. Aparca en el garaje amarillo y no lo rayes. Si te ve la poli… es tu problema, no el mío.',
    reward:900,make:function(){var p=spot(600,1100);return [{t:'getcar',p:p,type:'sport',col:'#cfd6e6',txt:'Roba el deportivo marcado'},{t:'goto',p:{x:POI.garage.x,y:POI.garage.y},r:110,target:true,txt:'Llévalo al garaje (zona amarilla)'}]}},
   {n:'ANÁLISIS DE TRÁFICO',who:'capri',call:'Alguien está filtrando datos. Ve al nodo de red y revisa los paquetes. Encuentra el sospechoso. Esta vez con más ruido.',
    reward:900,make:function(){return [{t:'hack',p:spot(700,1200),r:60,type:'packets',level:2,txt:'Analiza el tráfico del nodo'}]}},
   {n:'CARRERA DE MADRUGADA',who:'rogue',call:'Cinco checkpoints, tiempo justo. Si llegas, te pago. Si te estrellas, te pago el café.',
    reward:1200,make:function(){var o=R(),pts=[],c=o;for(var i=0;i<5;i++){c=roadPoint(300,520,c);pts.push(c)}return [{t:'race',pts:pts,time:85,txt:'Pasa por los 5 checkpoints (85 s)'}]}},
   {n:'SIGUE AL COCHE',who:'fixer',call:'Ese sedán negro lleva información. No lo pierdas de vista y no te acerques demasiado. Cuando pare, avísame.',
    reward:1300,make:function(){var p=spot(500,800);return [{t:'tail',p:p,end:spot(1200,1700),txt:'Sigue al coche objetivo sin perderlo'}]}},
   {n:'EVASIÓN TOTAL',who:'capri',call:'Qué aburrimiento. Sube tu nivel de búsqueda a 3 estrellas y luego piérdelos. Es un test de rendimiento, no un delito. Bueno, sí lo es.',
    reward:1800,make:function(){return [{t:'wanted',stars:3,txt:'Consigue 3 estrellas de búsqueda'},{t:'lose',txt:'Pierde a la policía'}]}}
  ];
  function gen(){
    var lv=Math.min(5,1+Math.floor(save.done/3)),kinds=['hackR','hackP','hackM','hackD','deliver','race','steal'],k=pick(kinds);
    var rw=300+lv*160+ri(120);
    if(k.indexOf('hack')===0){var map={hackR:'route',hackP:'packets',hackM:'memory',hackD:'decrypt'};return {n:'CONTRATO #'+pad(save.done+1),who:'fixer',call:'Contrato nuevo, mismo precio de siempre: poco y a deshoras. Hay un terminal que hackear.',reward:rw,make:function(){return [{t:'hack',p:spot(500,1300),r:60,type:map[k],level:lv,txt:'Hackea el terminal (nivel '+lv+')'}]}}}
    if(k==='deliver')return {n:'CONTRATO #'+pad(save.done+1),who:'fixer',call:'Mercancía a medio camino. Recógela y entrégala a tiempo.',reward:rw,make:function(){return [{t:'goto',p:spot(300,700),r:70,txt:'Recoge el encargo'},{t:'goto',p:spot(1200,2000),r:80,car:true,time:110-lv*4,txt:'Entrégalo en coche'}]}};
    if(k==='race')return {n:'CONTRATO #'+pad(save.done+1),who:'rogue',call:'Carrera ilegal, premio gordo. No me defraudes.',reward:rw+200,make:function(){var o=R(),pts=[],c=o;for(var i=0;i<5+lv;i++){c=roadPoint(300,520,c);pts.push(c)}return [{t:'race',pts:pts,time:80+lv*6,txt:'Checkpoints contrarreloj'}]}};
    return {n:'CONTRATO #'+pad(save.done+1),who:'rogue',call:'Hay un coche que me interesa. Tráelo al garaje.',reward:rw+100,make:function(){var p=spot(600,1200);return [{t:'getcar',p:p,type:Math.random()<.5?'sport':'sedan',col:pick(COLS),txt:'Roba el coche marcado'},{t:'goto',p:{x:POI.garage.x,y:POI.garage.y},r:110,target:true,txt:'Llévalo al garaje'}]}};
  }
  function curDef(){return save.mi<STORY.length?STORY[save.mi]:gen()}
  var pendingDef=null;
  function incoming(){
    if(mis||ring||callEl.hidden===false)return;
    pendingDef=curDef();var who=pendingDef.who;
    ring={t:0,def:pendingDef};callEl.hidden=false;$('#ghWho').textContent=CALLERS[who]||who;$('#ghTxt').textContent='…';
    $('#ghFace').innerHTML=who==='capri'&&api.capriSVG?'<span class="cap-face sq">'+api.capriSVG('38 34 124 124')+'</span>':'<span>☎</span>';fx('call');
  }
  function answer(){
    if(!ring)return;var d=ring.def;ring=null;callEl.hidden=true;fx('click');
    msg(d.call,'call',CALLERS[d.who]);
    mis={def:d,obj:d.make(),i:0,t:0,fail:0};
    mis.obj.forEach(function(o){o.done=false});
    startObj();showMis();
  }
  function missRing(){if(!ring)return;ring=null;callEl.hidden=true;nextCall=25;msg('Llamada perdida. Volverán a llamar.','')}
  function startObj(){
    var o=mis.obj[mis.i];if(!o)return;
    o.t0=T;
    if(o.t==='getcar'){var c=mkCar(o.type,o.p.x,o.p.y,0,'park',o.col);c.mark=true;c.x+=(Math.abs(o.p.x-Math.round(o.p.x/P)*P)<1?(Math.random()<.5?-36:36):0);if(Math.abs(o.p.y-Math.round(o.p.y/P)*P)<1&&Math.abs(o.p.x-Math.round(o.p.x/P)*P)>1)c.y+=36;c.a=Math.abs(o.p.x-Math.round(o.p.x/P)*P)<1?1.57:0;cars.push(c);o.car=c}
    if(o.t==='tail'){var c2=mkCar('sedan',o.p.x,o.p.y,0,'target','#101018');c2.dir=Math.abs(o.p.x-Math.round(o.p.x/P)*P)<1?1:0;c2.a=c2.dir*1.5708;c2.sp=0;c2.tg=o.end;c2.go=false;c2.lane=true;cars.push(c2);o.car=c2;o.far=0}
    if(o.t==='race'){o.k=0}
    if(o.t==='wanted'&&starsN()>=o.stars){}
    fx('click');
  }
  function objPos(o){
    if(!o)return null;
    if(o.t==='race')return o.pts[o.k];
    if(o.t==='getcar')return o.car?{x:o.car.x,y:o.car.y}:null;
    if(o.t==='tail')return o.car?{x:o.car.x,y:o.car.y}:null;
    return o.p||null;
  }
  function showMis(){
    var m=$('#ghMis');if(!mis){m.hidden=true;return}
    m.hidden=false;$('#ghMisN').textContent='MISIÓN // '+mis.def.n+' // €'+mis.def.reward;$('#ghMisT').textContent=mis.obj[mis.i].txt;
  }
  function missionEnd(ok,why){
    if(!mis)return;var d=mis.def;
    if(mis.obj.forEach)mis.obj.forEach(function(o){if(o.car&&o.car.mark){o.car.mark=false}if(o.car&&o.t==='tail'){o.car.ai='traffic';o.car.driver=true}});
    if(ok){money(d.reward,'MISIÓN COMPLETADA: '+d.n);save.done++;save.stats.missions++;if(save.mi<STORY.length)save.mi++;persist();fx('ok');msg('MISIÓN COMPLETADA','ok')}
    else{fx('err');msg('MISIÓN FALLIDA'+(why?': '+why:''),'bad')}
    mis=null;showMis();nextCall=ok?14:22;
  }
  function updateMission(dt){
    if(!mis)return;var o=mis.obj[mis.i],r=R(),p=objPos(o),inCar=!!pl.car;
    if(!o)return;
    var tl=o.time?(o.time-(T-o.t0)):null;
    var dtxt='';if(p)dtxt=Math.round(Math.hypot(p.x-r.x,p.y-r.y)/10)+' m';if(tl!=null)dtxt+=' · '+Math.max(0,Math.ceil(tl))+' s';
    if(o.t==='race')dtxt='Checkpoint '+(o.k+1)+'/'+o.pts.length+' · '+Math.max(0,Math.ceil(o.time-(T-o.t0)))+' s';
    if(o.t==='wanted'||o.t==='lose')dtxt='Nivel actual: '+'★'.repeat(starsN())+'☆'.repeat(5-starsN());
    $('#ghMisD').textContent=dtxt;$('#ghMisT').textContent=o.txt;
    function next(){fx('ok');mis.i++;if(mis.i>=mis.obj.length)missionEnd(true);else{startObj();showMis();msg(mis.obj[mis.i].txt,'ok')}}
    if(tl!=null&&tl<=0)return missionEnd(false,'se acabó el tiempo');
    if(o.t==='goto'){
      if(o.car&&!inCar){/* debe ir en coche */}
      var okc=(!o.car||inCar)&&(!o.target||(pl.car&&pl.car.mark2));
      if(o.target)okc=!!(pl.car&&pl.car.mission);
      if(p&&Math.hypot(p.x-r.x,p.y-r.y)<o.r&&okc)next();
      else if(p&&Math.hypot(p.x-r.x,p.y-r.y)<o.r&&o.car&&!inCar&&T-(o.nt||0)>4){o.nt=T;msg('Necesitas un coche para esto.','bad')}
    }else if(o.t==='hack'){
      if(Math.hypot(p.x-r.x,p.y-r.y)<o.r){setAct('Pulsa E para hackear');if(o.pressed){o.pressed=false;openHack(o,function(ok){if(ok){save.stats.hacks++;next()}})}}
    }else if(o.t==='getcar'){
      if(pl.car&&pl.car===o.car){o.car.mission=true;o.car.mark=false;next()}
      else if(o.car&&o.car.hp<=0)missionEnd(false,'coche destruido');
    }else if(o.t==='race'){
      var cp=o.pts[o.k];if(Math.hypot(cp.x-r.x,cp.y-r.y)<75){fx('coin');o.k++;if(o.k>=o.pts.length)next()}
    }else if(o.t==='tail'){
      var c=o.car;if(!c)return;
      var d=dist(c,r);
      if(!c.go&&d<340){c.go=true;msg('El objetivo arranca. Sigue sin acercarte demasiado.','')}
      if(c.go){var tgd=Math.hypot(c.x-o.end.x,c.y-o.end.y);if(tgd<90){c.go=false;c.sp=0;c.stopped=true}if(c.stopped&&d<160)next()}
      if(d>620){o.far+=dt;if(o.far>6)missionEnd(false,'perdiste al objetivo');if(Math.floor(o.far*2)%2===0)setAct('¡Te estás quedando atrás!')}else o.far=Math.max(0,o.far-dt);
      if(d<70&&c.go){o.close=(o.close||0)+dt;if(o.close>4){missionEnd(false,'te has acercado demasiado')}}else o.close=0;
    }else if(o.t==='wanted'){if(starsN()>=o.stars)next();else if(T-o.t0>2&&Math.random()<dt*.02)setAct('Atropella peatones o roba coches para subir la búsqueda')}
    else if(o.t==='lose'){if(starsN()===0&&T-o.t0>3)next()}
  }
  function setAct(t){var a=$('#ghAct');a.hidden=!t;a.textContent=t||'';actT=.12}
  var actT=0;

  /* ---------- minijuego ---------- */
  var hackBox=$('#gHack'),inHack=false;
  function openHack(o,cb){
    inHack=true;hackBox.hidden=false;paused=true;
    var inner=h('div','gta-hk');hackBox.innerHTML='';hackBox.appendChild(inner);
    DSA_HACK.run(inner,{type:o.type,level:o.level,fx:fx,onDone:function(ok){inHack=false;hackBox.hidden=true;hackBox.innerHTML='';paused=false;if(ok){msg('Hackeo completado','ok');money(40+o.level*20,'datos extraídos')}else msg('Hackeo fallido. Puedes reintentarlo en el terminal.','bad');cb(ok)}});
  }

  /* ---------- tienda ---------- */
  var shopEl=$('#gShop');
  function openShop(){
    paused=true;shopEl.hidden=false;drawShop();fx('click');
  }
  function closeShop(){shopEl.hidden=true;paused=false;fx('click')}
  function drawShop(){
    var s='<div class="sh-box"><div class="sh-h"><b>TIENDA DE MODS</b><span>€ '+save.money+'</span></div><div class="sh-body">';
    s+='<h4>MANTENIMIENTO</h4><button type="button" class="sh-i" data-b="repair">Reparar tu vehículo <em>€50</em></button><button type="button" class="sh-i" data-b="plate">Cambiar matrícula (borra la búsqueda) <em>€300</em></button>';
    s+='<h4>MEJORAS</h4><button type="button" class="sh-i" data-b="emp">Pulso EMP+ (más radio, menos espera) · nivel '+save.emp+'/3 <em>'+(save.emp<3?'€'+(400+save.emp*400):'MÁX')+'</em></button>';
    s+='<button type="button" class="sh-i" data-b="sport">'+(save.owned.indexOf('sport')>=0?'Deportivo propio ✔ (en el garaje)':'Comprar deportivo propio (aparece en el garaje)')+' <em>'+(save.owned.indexOf('sport')>=0?'COMPRADO':'€1500')+'</em></button>';
    s+='<h4>PINTURA DE TU COCHE</h4><div class="sh-paints">';
    PAINTS.forEach(function(p,i){var lk=p.rw&&!has(p.rw);s+='<button type="button" class="sh-p'+(save.paint===i?' on':'')+(lk?' locked':'')+'" data-p="'+i+'"'+(lk?' disabled':'')+'><i style="background:'+p.c+'"></i>'+esc(p.n)+'<em>'+(lk?'🔒 secreto':(p.cost?'€'+p.cost:'GRATIS'))+'</em></button>'});
    s+='</div></div><button type="button" class="btn" data-b="close">SALIR [ESC]</button></div>';
    shopEl.innerHTML=s;
  }
  shopEl.addEventListener('click',function(e){
    var b=e.target.closest('[data-b],[data-p]');if(!b)return;
    if(b.dataset.b==='close')return closeShop();
    function pay(n){if(save.money<n){fx('err');msg('No tienes suficiente dinero','bad');return false}money(-n);return true}
    if(b.dataset.b==='repair'){if(pl.car&&pay(50)){pl.car.hp=CT[pl.car.type].hp;pl.car.stun=0;msg('Vehículo reparado','ok')}else if(!pl.car){msg('Necesitas estar dentro de un coche','bad')}}
    else if(b.dataset.b==='plate'){if(heat>0&&pay(300)){heat=0;msg('Matrícula cambiada: búsqueda borrada','ok')}else if(heat<=0)msg('No te busca nadie','')}
    else if(b.dataset.b==='emp'){if(save.emp<3&&pay(400+save.emp*400)){save.emp++;persist();msg('EMP mejorado','ok')}}
    else if(b.dataset.b==='sport'){if(save.owned.indexOf('sport')<0&&pay(1500)){save.owned.push('sport');persist();spawnOwned();msg('Deportivo comprado: míralo en el garaje amarillo','ok')}}
    else if(b.dataset.p!=null){var i=+b.dataset.p,p=PAINTS[i];if(save.paint===i)return;if(!p.cost||pay(p.cost)){save.paint=i;persist();spawnOwned();fx('ok')}}
    drawShop();
  });

  /* ---------- entrada ---------- */
  var keys={},once={};
  function kd(e){
    if(dead||!ov.isConnected)return;var t=e.target&&e.target.tagName;if(t==='INPUT'||t==='TEXTAREA')return;
    if(e.key==='Escape'){
      if(!started||inHack)return;
      if(!shopEl.hidden)closeShop();else if(!menu.hidden){menu.hidden=true;paused=false}else{paused=true;drawMenu('pause')}
      return;
    }
    if(inHack)return;
    var k=e.key.length===1?e.key.toLowerCase():e.key;
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].indexOf(k)>=0&&started)e.preventDefault();
    if(!keys[k])once[k]=true;keys[k]=true;
  }
  function ku(e){var k=e.key.length===1?e.key.toLowerCase():e.key;delete keys[k]}
  window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);
  function pressed(k){if(once[k]){once[k]=false;return true}return false}

  /* ---------- menú ---------- */
  var menu=$('#gMenu');
  function drawMenu(mode){
    var cfg=window.DSA_CHAR?DSA_CHAR.get():null;
    var s='<div class="gm-box"><div class="gm-l">'+(cfg?'<div class="gm-port">'+DSA_CHAR.svg(cfg,150)+'</div>':'')+'</div><div class="gm-r"><small>NIGHT CITY // MODO LIBRE</small><h2>'+(mode==='pause'?'PAUSA':'NIGHT CITY LIBRE')+'</h2>';
    s+='<p>Roba coches, evita a la policía, acepta llamadas, hackea terminales y gana dinero. No es un test: es la ciudad.</p>';
    s+='<div class="gm-stats">€ '+save.money+' · Misiones '+save.stats.missions+' · Hackeos '+save.stats.hacks+' · Secretos '+(window.DSA_SEC?DSA_SEC.count()+'/'+DSA_SEC.total():'-')+'</div>';
    s+='<button type="button" class="btn" data-m="play">'+(mode==='pause'?'CONTINUAR':'JUGAR')+'</button> <button type="button" class="btn alt" data-m="char">PERSONAJE</button> <button type="button" class="btn alt" data-m="exit">SALIR</button>';
    s+='<p class="gm-note">Requiere teclado (WASD, E, F, Espacio). Tu progreso se guarda en este navegador.</p></div></div>';
    menu.innerHTML=s;menu.hidden=false;
  }
  menu.addEventListener('click',function(e){
    var b=e.target.closest('[data-m]');if(!b)return;var m=b.dataset.m;fx('click');
    if(m==='play'){menu.hidden=true;begin()}
    else if(m==='char'){DSA_CHAR.open(api,function(){drawMenu(started?'pause':'start')})}
    else if(m==='exit'){api.exit()}
  });
  function begin(){
    if(!started){started=true;seed();spawnClaims();api.snd.scene('juego');api.snd.start();msg('Bienvenido a Night City. Espera una llamada.','');nextCall=7}
    paused=false;hud.hidden=false;
  }
  function spawnClaims(){
    (window.DSA_SEC?DSA_SEC.rewards():[]).forEach(function(r){
      if(r.indexOf('money:')===0&&save.claimed.indexOf(r)<0){save.claimed.push(r);var n=+r.split(':')[1];save.money+=n;persist();msg('Recompensa de secreto: +€'+n,'ok')}});
  }

  /* ---------- física y IA ---------- */
  function carBox(c){ /* círculos de colisión a lo largo del coche */
    var f=c.l/2-9,ca=Math.cos(c.a),sa=Math.sin(c.a);return [[c.x+ca*f,c.y+sa*f],[c.x,c.y],[c.x-ca*f,c.y-sa*f]];
  }
  function spark(x,y,n,col){if(parts.length>160)return;for(var i=0;i<n;i++)parts.push({x:x,y:y,vx:rr(180)-90,vy:rr(180)-90,t:.4+rr(.4),c:col||'#ffd34d',s:2})}
  function smoke(c){if(parts.length>160)return;parts.push({x:c.x+rr(10)-5,y:c.y+rr(10)-5,vx:rr(14)-7,vy:rr(14)-14,t:1.2,c:'rgba(160,160,180,.35)',s:9,sm:1})}
  function hurtCar(c,imp){c.hp-=imp*.06;if(c.hp<0)c.hp=0}
  function colBuild(c,dt){
    var bx=carBox(c),hit=false,ix=0;
    for(var i=0;i<bx.length;i++){var r=hitB(bx[i][0],bx[i][1],c.w/2-1);
      if(r){hit=true;c.x+=r.nx*r.pen;c.y+=r.ny*r.pen;var vn=c.vx*r.nx+c.vy*r.ny;if(vn<0){var imp=-vn;c.vx-=(1.3)*vn*r.nx;c.vy-=(1.3)*vn*r.ny;ix=Math.max(ix,imp)}}}
    var m=30;if(c.x<m||c.y<m||c.x>WS-m||c.y>WS-m){c.x=clamp(c.x,m,WS-m);c.y=clamp(c.y,m,WS-m);c.vx*=-.3;c.vy*=-.3}
    if(ix>60){spark(c.x,c.y,6);hurtCar(c,ix);if(c===pl.car){fx('hit');shake=Math.min(10,ix*.04)}}
    return hit;
  }
  var shake=0;
  function driveCar(c,dt,thr,steer,hb){
    var s=CT[c.type],fx_=Math.cos(c.a),fy=Math.sin(c.a),vf=c.vx*fx_+c.vy*fy,vl=-c.vx*fy+c.vy*fx_;
    if(c.hp<=0||c.stun>0){thr=0;steer=0;hb=true}
    var top=s.top*(c.boost||1);
    if(thr>0){if(vf<top)vf+=s.acc*thr*dt}else if(thr<0){vf+=(vf>5?-s.acc*1.6:-s.acc*.6)*(-thr)*dt;if(vf<-top*.35)vf=-top*.35}else vf*=Math.pow(.55,dt);
    var g=hb?.985:s.grip;vl*=Math.pow(1-g,dt*3.2)<.0001?0:Math.pow(1-g,dt*3.2);if(hb)vf*=Math.pow(.35,dt);
    var sp=Math.abs(vf),turn=steer*clamp(sp/90,0,1)*(sp>top*.7?.75:1)*2.5*(vf<0?-1:1)*(hb?1.5:1);
    c.a+=turn*dt;
    fx_=Math.cos(c.a);fy=Math.sin(c.a);c.vx=fx_*vf-fy*vl;c.vy=fy*vf+fx_*vl;
    c.x+=c.vx*dt;c.y+=c.vy*dt;c.sp=sp;
    if(hb&&sp>100&&Math.abs(vl)>40&&parts.length<150)parts.push({x:c.x-fx_*20,y:c.y-fy*20,vx:0,vy:0,t:.9,c:'rgba(10,10,14,.5)',s:3,skid:1});
  }
  function updatePlayer(dt){
    var up=keys.w||keys.ArrowUp,dn=keys.s||keys.ArrowDown,lf=keys.a||keys.ArrowLeft,rt=keys.d||keys.ArrowRight;
    if(pl.car){
      var c=pl.car;c.ai='player';
      driveCar(c,dt,up?1:dn?-1:0,(rt?1:0)-(lf?1:0),!!keys[' ']);
      colBuild(c,dt);
      pl.x=c.x;pl.y=c.y;pl.a=c.a;
      if(c.hp<=0&&!c.dead){c.dead=true;msg('Vehículo averiado. Sal con E y busca otro.','bad');if(mis&&mis.obj[mis.i]&&mis.obj[mis.i].t==='goto'&&mis.obj[mis.i].target)missionEnd(false,'coche destruido')}
      if(c.hp<35)smoke(c);
    }else{
      var sp=(keys.Shift?210:120),mx=(rt?1:0)-(lf?1:0),my=(dn?1:0)-(up?1:0);
      if(mx||my){var l=Math.hypot(mx,my);mx/=l;my/=l;pl.a=Math.atan2(my,mx);pl.walk+=dt*(keys.Shift?14:9)}
      pl.vx=mx*sp;pl.vy=my*sp;pl.x+=pl.vx*dt;pl.y+=pl.vy*dt;
      var r=hitB(pl.x,pl.y,9);if(r){pl.x+=r.nx*r.pen;pl.y+=r.ny*r.pen}
      pl.x=clamp(pl.x,20,WS-20);pl.y=clamp(pl.y,20,WS-20);
      /* coches te empujan / atropellan */
      for(var i=0;i<cars.length;i++){var c2=cars[i];if(c2.sp>80&&Math.hypot(c2.x-pl.x,c2.y-pl.y)<c2.l*.5){if(pl.cd<=0){pl.hp-=24;pl.cd=1.2;fx('hit');spark(pl.x,pl.y,5,'#ff2a6d');shake=6;if(c2.ai==='player')addHeat(25,'atropello')}}}
      if(pl.cd>0)pl.cd-=dt;
      if(pl.hp<=0)respawn('hospital');
      pl.hp=Math.min(100,pl.hp+dt*2);
    }
    /* interacción E */
    var near=null;
    if(!pl.car){var bd=70;cars.forEach(function(c){var d=dist(c,pl);if(d<bd&&c.hp>0){bd=d;near=c}})}
    var onShop=Math.hypot(R().x-POI.shop.x,R().y-POI.shop.y)<150;
    var o=mis&&mis.obj[mis.i];
    if(!inHack&&!shopEl.hidden===false){
      if(pl.car)setAct(onShop?'E: tienda':'E: salir del coche');
      else if(near)setAct('E: '+(near.driver?'robar coche':'entrar al coche'));
      else if(onShop)setAct('E: tienda');
    }
    if(pressed('e')||pressed('E')){
      if(o&&o.t==='hack'&&Math.hypot(o.p.x-R().x,o.p.y-R().y)<o.r)o.pressed=true;
      else if(onShop&&(!pl.car||CT[pl.car.type]))openShop();
      else if(pl.car)exitCar();
      else if(near)enterCar(near);
    }
    if(pressed('f')||pressed('F'))useEmp();
    if(pressed('Enter')||pressed('p'))answer();
  }
  function enterCar(c){
    if(c.driver){addHeat(30,'robo de coche');c.driver=false;msg('Has robado un coche. El conductor huye.','');save.stats.stolen++}
    pl.car=c;c.ai='player';c.stun=0;fx('click');
  }
  function exitCar(){
    var c=pl.car;if(!c)return;
    var s=c.a+1.57,nx=c.x+Math.cos(s)*(c.w/2+16),ny=c.y+Math.sin(s)*(c.w/2+16);
    if(hitB(nx,ny,9)){nx=c.x-Math.cos(s)*(c.w/2+16);ny=c.y-Math.sin(s)*(c.w/2+16)}
    pl.x=nx;pl.y=ny;c.ai=c.own?'park':'park';c.vx*=.2;c.vy*=.2;pl.car=null;fx('click');
  }
  function useEmp(){
    if(emp>0)return;var rad=200*(1+save.emp*.35);emp=12*(1-save.emp*.2);fx('glitch');
    var R_=R();parts.push({x:R_.x,y:R_.y,vx:0,vy:0,t:.7,c:'ring',s:rad,ring:1});
    cars.forEach(function(c){if(c===pl.car)return;if(Math.hypot(c.x-R_.x,c.y-R_.y)<rad){c.stun=3.2;if(c.ai==='police')addHeat(2)}});
    peds.forEach(function(p){if(Math.hypot(p.x-R_.x,p.y-R_.y)<rad){p.st='down';p.dn=2.5}});
  }
  function respawn(kind){
    $('#gFade').classList.add('on');paused=true;
    setTimeout(function(){
      if(dead)return;var fee=Math.floor(save.money*(kind==='busted'?.15:.1));save.money-=fee;persist();
      if(pl.car){pl.car.ai='park';pl.car=null}
      pl.x=POI.station.x;pl.y=POI.station.y+90;pl.hp=100;heat=0;bust=0;
      cars=cars.filter(function(c){return c.ai!=='police'});
      msg((kind==='busted'?'DETENIDO. ':'HOSPITAL. ')+'Gastos: −€'+fee,'bad');if(kind==='busted')save.stats.busts++;
      if(mis&&kind==='busted'){missionEnd(false,'te han detenido')}
      $('#gFade').classList.remove('on');paused=false;
    },900);
  }
  function aiTraffic(c,dt){
    var d=[[1,0],[0,1],[-1,0],[0,-1]][c.dir],vert=(c.dir&1)===1,off=24;
    var want=(c.ai==='target'&&!c.go)?0:c.ai==='target'?150:(c.sp0||150);
    /* obstáculo delante */
    for(var i=0;i<cars.length;i++){var o=cars[i];if(o===c)continue;var dx=o.x-c.x,dy=o.y-c.y,f=dx*d[0]+dy*d[1],l=Math.abs(-dx*d[1]+dy*d[0]);
      if(f>0&&f<c.l+34&&l<c.w+4)want=Math.min(want,f<c.l+12?0:o.sp*.8)}
    if(pl.car!==c){var dx2=pl.x-c.x,dy2=pl.y-c.y,f2=dx2*d[0]+dy2*d[1],l2=Math.abs(-dx2*d[1]+dy2*d[0]);if(f2>0&&f2<c.l+40&&l2<c.w+8)want=0}
    for(i=0;i<peds.length;i++){var p=peds[i],dx3=p.x-c.x,dy3=p.y-c.y,f3=dx3*d[0]+dy3*d[1],l3=Math.abs(-dx3*d[1]+dy3*d[0]);if(f3>0&&f3<70&&l3<22&&p.st!=='down')want=Math.min(want,0)}
    var vf=Math.hypot(c.vx,c.vy);vf+=(want-vf)*Math.min(1,dt*(want<vf?4:1.4));if(c.stun>0)vf*=Math.pow(.2,dt);
    /* carril */
    var ta=c.dir*Math.PI/2;c.a+=angDiff(c.a,ta)*Math.min(1,dt*6);
    c.vx=Math.cos(c.a)*vf;c.vy=Math.sin(c.a)*vf;
    if(vert){var lx=Math.round(c.x/P)*P+(c.dir===1?-off:off);c.x+=(lx-c.x)*Math.min(1,dt*3)}else{var ly=Math.round(c.y/P)*P+(c.dir===0?off:-off);c.y+=(ly-c.y)*Math.min(1,dt*3)}
    c.x+=c.vx*dt;c.y+=c.vy*dt;c.sp=vf;
    /* cruces: giro aleatorio */
    var ax=vert?c.y:c.x,cr=Math.round(ax/P)*P;
    if(Math.abs(ax-cr)<6&&!c.turnd){c.turnd=true;var r=Math.random();
      var nd=c.dir;if(c.ai==='target'&&c.tg){var tx=c.tg.x-c.x,ty=c.tg.y-c.y;nd=vert?(Math.abs(tx)>P/2?(tx>0?0:2):c.dir):(Math.abs(ty)>P/2?(ty>0?1:3):c.dir)}
      else if(r<.22)nd=(c.dir+1)&3;else if(r<.44)nd=(c.dir+3)&3;
      var nx=Math.round(c.x/P)*P,ny=Math.round(c.y/P)*P;
      if((nd===0&&nx>=WS-P*.5)||(nd===2&&nx<=P*.5)||(nd===1&&ny>=WS-P*.5)||(nd===3&&ny<=P*.5))nd=(c.dir+2)&3;
      if(nd!==c.dir){c.dir=nd;if(nd&1)c.x=nx;else c.y=ny}}
    else if(Math.abs(ax-cr)>20)c.turnd=false;
    if(c.x<20||c.y<20||c.x>WS-20||c.y>WS-20){c.dir=(c.dir+2)&3}
  }
  function aiPolice(c,dt){
    var s=CT[c.type],ps=starsN(),tgt=pl.car||pl;
    if(c.stun>0||c.hp<=0){c.vx*=Math.pow(.15,dt);c.vy*=Math.pow(.15,dt);c.x+=c.vx*dt;c.y+=c.vy*dt;c.sp=Math.hypot(c.vx,c.vy);if(c.stun>0&&Math.random()<dt*8)smoke(c);colBuild(c,dt);return}
    var tx=tgt.x+(tgt.vx||0)*.4,ty=tgt.y+(tgt.vy||0)*.4,desired=Math.atan2(ty-c.y,tx-c.x),thr=1;
    /* evita edificios: prueba un punto adelante */
    var best=desired,bestScore=1e9;
    [0,.5,-.5,1,-1,1.6,-1.6].forEach(function(o){var a=desired+o,px=c.x+Math.cos(a)*70,py=c.y+Math.sin(a)*70,pen=hitB(px,py,16)?1000:0;var sc=pen+Math.abs(o)*10;if(sc<bestScore){bestScore=sc;best=a}});
    if(c.rev>0){c.rev-=dt;thr=-1;best=desired+3}
    var diff=angDiff(c.a,best),steer=clamp(diff*2,-1,1);
    var d=dist(c,tgt);if(d<70)thr=.2;
    driveCar(c,dt,thr*(.85+ps*.05),steer,false);
    if(c.sp<25&&d>90){c.stuck+=dt;if(c.stuck>1.1){c.stuck=0;c.rev=.9}}else c.stuck=0;
    colBuild(c,dt);
    c.siren+=dt;
  }
  function updateCars(dt){
    var i,c;
    for(i=0;i<cars.length;i++){c=cars[i];if(c===pl.car)continue;
      if(c.stun>0)c.stun-=dt;
      if(c.ai==='traffic'||c.ai==='target'){if(c.stun>0||c.hp<=0){c.vx*=Math.pow(.2,dt);c.vy*=Math.pow(.2,dt);c.x+=c.vx*dt;c.y+=c.vy*dt;c.sp=Math.hypot(c.vx,c.vy)}else aiTraffic(c,dt);if(c.hp<35)smoke(c)}
      else if(c.ai==='police')aiPolice(c,dt);
      else{c.vx*=Math.pow(.1,dt);c.vy*=Math.pow(.1,dt);if(c.sp>3){c.x+=c.vx*dt;c.y+=c.vy*dt;colBuild(c,dt)}c.sp=Math.hypot(c.vx,c.vy)}
    }
    /* colisiones coche-coche */
    for(i=0;i<cars.length;i++)for(var j=i+1;j<cars.length;j++){
      var a=cars[i],b=cars[j],dx=b.x-a.x,dy=b.y-a.y;if(Math.abs(dx)>70||Math.abs(dy)>70)continue;
      var d=Math.hypot(dx,dy),mind=(a.l+b.l)*.36;if(d<mind&&d>.01){
        var nx=dx/d,ny=dy/d,pen=mind-d,rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;
        var wa=(a.ai==='park'&&a.sp<3&&a!==pl.car)?.2:1,wb=(b.ai==='park'&&b.sp<3&&b!==pl.car)?.2:1,tw=wa+wb;
        a.x-=nx*pen*wa/tw;a.y-=ny*pen*wa/tw;b.x+=nx*pen*wb/tw;b.y+=ny*pen*wb/tw;
        if(rv<0){var jj=-rv*1.2;a.vx-=nx*jj*wa/tw;a.vy-=ny*jj*wa/tw;b.vx+=nx*jj*wb/tw;b.vy+=ny*jj*wb/tw;
          if(-rv>70){spark((a.x+b.x)/2,(a.y+b.y)/2,5);hurtCar(a,-rv);hurtCar(b,-rv);if(a===pl.car||b===pl.car){fx('hit');shake=Math.min(9,-rv*.04);var o=a===pl.car?b:a;if(o.ai==='police')addHeat(20,'choque con la policía');else if(o.ai==='traffic'&&Math.random()<.5)addHeat(8,'accidente')}}}
      }
    }
    /* limpieza y reaparición */
    var pc=R(),cnt=0,pcnt=0;
    for(i=cars.length-1;i>=0;i--){c=cars[i];if(c===pl.car||c.own||c.mark||c.mission||c.ai==='target')continue;var dd=Math.hypot(c.x-pc.x,c.y-pc.y);
      if(c.ai==='traffic'){cnt++;if(dd>1250)cars.splice(i,1)}else if(c.ai==='police'){pcnt++;if(dd>1500||(starsN()===0&&dd>620))cars.splice(i,1)}else if(c.ai==='park'&&dd>1700)cars.splice(i,1)}
    if(cnt<24&&Math.random()<dt*3)spawnTraffic();
    var want=starsN()?Math.min(6,1+starsN()):0;if(pcnt<want&&Math.random()<dt*1.5)spawnPolice();
    var parked=cars.filter(function(c){return c.ai==='park'}).length;if(parked<36&&Math.random()<dt)spawnParked(1);
  }
  function updatePeds(dt){
    var pc=R(),i;
    for(i=peds.length-1;i>=0;i--){var p=peds[i];
      if(p.st==='down'){p.dn-=dt;if(p.dn<=0){p.st='flee';p.t=4}continue}
      p.t-=dt;if(p.t<=0){p.a+=rr(2)-1;p.t=1+rr(2.5);if(p.st==='flee'&&p.t>1)p.st='walk'}
      var fs=0;
      cars.forEach(function(c){if(c.sp>60&&Math.hypot(c.x-p.x,c.y-p.y)<90){p.a=Math.atan2(p.y-c.y,p.x-c.x);p.st='flee';p.t=2;fs=1}
        if(c.sp>85&&Math.hypot(c.x-p.x,c.y-p.y)<c.l*.45){p.st='down';p.dn=4;spark(p.x,p.y,4,'#fff');if(c===pl.car){addHeat(25,'atropello');fx('hit')}}});
      var v=p.v*(p.st==='flee'?2.8:1),nx=p.x+Math.cos(p.a)*v*dt,ny=p.y+Math.sin(p.a)*v*dt;
      if(hitB(nx,ny,7)||nx<30||ny<30||nx>WS-30||ny>WS-30){p.a+=Math.PI*(.7+rr(.6));p.t=.8}else{p.x=nx;p.y=ny}
      if(Math.hypot(p.x-pc.x,p.y-pc.y)>1000)peds.splice(i,1);
    }
    if(peds.length<34&&Math.random()<dt*4)spawnPed();
  }
  function updatePickups(dt){
    var r=R();pick_.forEach(function(k,i){k.t+=dt;if(Math.hypot(k.x-r.x,k.y-r.y)<34){money(k.v,null);msg('+€'+k.v+' dinero encontrado','ok');var p=roadPoint(300,1500,r),a=rr(6.283);k.x=p.x+Math.cos(a)*30;k.y=p.y+Math.sin(a)*30;k.v=50+ri(7)*25}});
  }
  function updatePolice(dt){
    var r=R(),near=false,pol=null;
    cars.forEach(function(c){if(c.ai==='police'){var d=Math.hypot(c.x-r.x,c.y-r.y);if(d<480&&c.stun<=0)near=true;
      if(d<62&&c.hp>0&&c.stun<=0&&starsN()>0){pol=c}}});
    if(heat>0){
      if(near)unseen=0;else unseen+=dt;
      if(unseen>9)heat=Math.max(0,heat-dt*9);
      if(unseen>9&&Math.random()<dt*.5&&heat<=0)msg('Has despistado a la policía.','ok');
    }
    var sp=pl.car?pl.car.sp:Math.hypot(pl.vx,pl.vy);
    if(pol&&sp<80)bust+=dt;else bust=Math.max(0,bust-dt*1.5);
    if(bust>2.4){bust=0;respawn('busted')}
    if(starsN()>0&&near&&Math.random()<dt*.6)fx('siren');
  }
  function events_(dt){
    evT-=dt;if(evT>0||inHack)return;evT=45+rr(40);
    var k=ri(4),r=R();
    if(k===0){var p=roadPoint(300,700,r);events.push({t:'crate',x:p.x,y:p.y,v:150+ri(250),life:70});msg('EVENTO: contenedor caído. Hay dinero en el mapa (marcador verde).','')}
    else if(k===1){darkT=16;msg('APAGÓN en el distrito. Las luces fallan unos segundos.','')}
    else if(k===2&&starsN()===0){addHeat(30,'redada policial');}
    else{var p2=roadPoint(500,900,r);events.push({t:'racer',x:p2.x,y:p2.y,v:300,life:50,t0:T});msg('EVENTO: un piloto te reta. Llega al punto marcado en 40 s por €300.','')}
  }
  function updateEvents(dt){
    var r=R();for(var i=events.length-1;i>=0;i--){var e=events[i];e.life-=dt;
      if(Math.hypot(e.x-r.x,e.y-r.y)<60){if(e.t==='crate'){money(e.v,'contenedor recuperado');events.splice(i,1);continue}if(e.t==='racer'&&pl.car){money(e.v,'reto ganado');events.splice(i,1);continue}}
      if(e.life<=0){if(e.t==='racer')msg('Reto expirado.','');events.splice(i,1)}}
    if(darkT>0)darkT-=dt;
  }

  /* ---------- dibujo ---------- */
  var W=2,H=2,DPR=1;
  function size(){DPR=Math.min(window.devicePixelRatio||1,1.5);var w=Math.max(2,cv.clientWidth*DPR|0),h2=Math.max(2,cv.clientHeight*DPR|0);if(cv.width!==w||cv.height!==h2){cv.width=w;cv.height=h2}W=cv.width;H=cv.height}
  function shade(c,k){var n=parseInt(c.slice(1),16),r=clamp((n>>16)*k,0,255),g=clamp(((n>>8)&255)*k,0,255),b=clamp((n&255)*k,0,255);return 'rgb('+(r|0)+','+(g|0)+','+(b|0)+')'}
  function drawWorld(){
    var S=cam.z*DPR,vw=W/S,vh=H/S,x0=cam.x-vw/2,y0=cam.y-vh/2,x1=x0+vw,y1=y0+vh;
    var sx=shake>0?(Math.random()-.5)*shake:0,sy=shake>0?(Math.random()-.5)*shake:0;
    ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#05060b';ctx.fillRect(0,0,W,H);
    ctx.setTransform(S,0,0,S,(W/2-cam.x*S)+sx,(H/2-cam.y*S)+sy);
    /* suelo: manzanas */
    var bx0=clamp(Math.floor(x0/P),0,NB-1),bx1=clamp(Math.floor(x1/P),0,NB-1),by0=clamp(Math.floor(y0/P),0,NB-1),by1=clamp(Math.floor(y1/P),0,NB-1),bx,by;
    ctx.fillStyle='#0d0f19';ctx.fillRect(0,0,WS,WS);
    for(by=by0;by<=by1;by++)for(bx=bx0;bx<=bx1;bx++){
      var q=quadOf(bx*P+P/2,by*P+P/2),px=bx*P+RD/2,py=by*P+RD/2,B=P-RD;
      ctx.fillStyle='#161a28';ctx.fillRect(px,py,B,B);
      ctx.strokeStyle=QC[q];ctx.globalAlpha=.5;ctx.lineWidth=2;ctx.strokeRect(px+1,py+1,B-2,B-2);ctx.globalAlpha=1;
      var pk=isPoi(bx,by);
      if(pk){var p=POI[pk];ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(px+10,py+10,B-20,B-20);ctx.strokeStyle=p.col;ctx.lineWidth=3;ctx.globalAlpha=.6+.3*Math.sin(T*3);ctx.strokeRect(px+10,py+10,B-20,B-20);ctx.globalAlpha=1;
        ctx.fillStyle=p.col;ctx.font='900 22px Orbitron,Arial,sans-serif';ctx.textAlign='center';ctx.fillText(p.name,px+B/2,py+B/2+8)}
    }
    /* líneas de carretera */
    ctx.strokeStyle='rgba(255,230,120,.5)';ctx.lineWidth=2;ctx.setLineDash([22,26]);ctx.beginPath();
    for(var i=Math.max(0,Math.floor(x0/P));i<=Math.min(NB,Math.ceil(x1/P));i++){ctx.moveTo(i*P,Math.max(0,y0));ctx.lineTo(i*P,Math.min(WS,y1))}
    for(i=Math.max(0,Math.floor(y0/P));i<=Math.min(NB,Math.ceil(y1/P));i++){ctx.moveTo(Math.max(0,x0),i*P);ctx.lineTo(Math.min(WS,x1),i*P)}
    ctx.stroke();ctx.setLineDash([]);
    /* árboles */
    ctx.fillStyle='#10301e';TREES.forEach(function(t){if(t.x<x0-20||t.x>x1+20||t.y<y0-20||t.y>y1+20)return;ctx.beginPath();ctx.arc(t.x,t.y,t.r,0,6.283);ctx.fill()});
    /* marcadores del suelo */
    pick_.forEach(function(k){if(k.x<x0||k.x>x1||k.y<y0||k.y>y1)return;ctx.fillStyle='#39ff88';ctx.globalAlpha=.7+.3*Math.sin(T*5+k.v);ctx.beginPath();ctx.arc(k.x,k.y,7,0,6.283);ctx.fill();ctx.globalAlpha=1;ctx.fillStyle='#021';ctx.font='700 9px Arial';ctx.textAlign='center';ctx.fillText('€',k.x,k.y+3)});
    /* sombras y vehículos aparcados */
    cars.forEach(function(c){if(c.x<x0-60||c.x>x1+60||c.y<y0-60||c.y>y1+60)return;drawCar(c)});
    peds.forEach(function(p){if(p.x<x0-20||p.x>x1+20||p.y<y0-20||p.y>y1+20)return;drawPed(p)});
    if(!pl.car)drawPlayer();
    /* partículas */
    parts.forEach(function(p){if(p.ring){ctx.strokeStyle='rgba(0,240,255,'+p.t*1.2+')';ctx.lineWidth=4;ctx.beginPath();ctx.arc(p.x,p.y,p.s*(1-p.t/.7),0,6.283);ctx.stroke();return}
      ctx.globalAlpha=clamp(p.t*(p.sm?.6:2),0,1);ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.sm?p.s*(1.6-p.t):p.s,0,6.283);ctx.fill();ctx.globalAlpha=1});
    /* edificios con extrusión falsa (parallax) */
    BS.forEach(function(b){if(b.x>x1+80||b.y>y1+80||b.x+b.w<x0-80||b.y+b.h<y0-80)return;drawBuilding(b)});
    /* marcadores de misión */
    drawMarkers();
    /* brillos aditivos */
    ctx.globalCompositeOperation='lighter';
    cars.forEach(function(c){if(c.x<x0-80||c.x>x1+80||c.y<y0-80||c.y>y1+80)return;glowCar(c)});
    events.forEach(function(e){ctx.fillStyle='rgba(57,255,136,.35)';ctx.beginPath();ctx.arc(e.x,e.y,26+4*Math.sin(T*4),0,6.283);ctx.fill()});
    ctx.globalCompositeOperation='source-over';
    /* oscuridad (apagón) */
    ctx.setTransform(1,0,0,1,0,0);
    if(darkT>0){ctx.fillStyle='rgba(0,0,8,'+Math.min(.65,darkT/4)+')';ctx.fillRect(0,0,W,H)}
    /* viñeta de policía */
    if(starsN()>0){var f=(Math.sin(T*8)>0);var g=ctx.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.85);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,f?'rgba(255,30,60,.28)':'rgba(40,80,255,.28)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
    /* flecha hacia el objetivo */
    drawArrow(S);
  }
  function drawBuilding(b){
    var cx=b.x+b.w/2,cy=b.y+b.h/2,k=b.ht/1800,ox=(cx-cam.x)*k,oy=(cy-cam.y)*k,col=QC[b.q],base=shade('#1a1d2c',.7+b.tone*.5);
    var A=[[b.x,b.y],[b.x+b.w,b.y],[b.x+b.w,b.y+b.h],[b.x,b.y+b.h]];
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(b.x+4,b.y+6,b.w,b.h);
    for(var i=0;i<4;i++){var p=A[i],q=A[(i+1)&3],nx=q[1]-p[1],ny=p[0]-q[0],mx=(p[0]+q[0])/2-cx,my=(p[1]+q[1])/2-cy;
      if(nx*(mx*-1)+ny*(my*-1)>0&&false)continue;
      ctx.fillStyle=shade('#12141f',.8+i*.12);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.lineTo(q[0]+ox,q[1]+oy);ctx.lineTo(p[0]+ox,p[1]+oy);ctx.closePath();ctx.fill()}
    ctx.fillStyle=base;ctx.fillRect(b.x+ox,b.y+oy,b.w,b.h);
    ctx.strokeStyle=col;ctx.lineWidth=2;ctx.globalAlpha=.9;ctx.strokeRect(b.x+ox+1,b.y+oy+1,b.w-2,b.h-2);ctx.globalAlpha=1;
    ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(b.x+ox+8,b.y+oy+8,b.w*.35,b.h*.3);
    if(b.ac){ctx.fillStyle='#232738';ctx.fillRect(b.x+ox+b.w*.6,b.y+oy+b.h*.55,Math.min(34,b.w*.25),Math.min(34,b.h*.25));ctx.fillStyle=col;ctx.globalAlpha=.6+.4*Math.sin(T*2+b.x);ctx.fillRect(b.x+ox+b.w*.6+4,b.y+oy+b.h*.55+4,5,5);ctx.globalAlpha=1}
  }
  function drawCar(c){
    ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.a);var l=c.l,w=c.w;
    ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(-l/2+3,-w/2+4,l,w);
    var col=c.ai==='police'?(c.type==='swat'?'#222a3a':'#e9edf5'):c.col;
    ctx.fillStyle=col;rrect(-l/2,-w/2,l,w,7);ctx.fill();
    if(c.stripe){ctx.fillStyle='#fff';ctx.fillRect(-l/2+4,-3,l-8,6)}
    if(c.glass){ctx.fillStyle='rgba(255,255,255,.25)';rrect(-l/2+3,-w/2+3,l-6,w-6,6);ctx.fill()}
    if(c.ai==='police'){ctx.fillStyle='#1d2a55';ctx.fillRect(-l/2+6,-w/2,l*.38,w);}
    ctx.fillStyle='#0b0e18';rrect(-l*.1,-w/2+4,l*.3,w-8,3);ctx.fill();rrect(-l*.42,-w/2+5,l*.18,w-10,3);ctx.fill();
    if(c.type==='sport'||c.type==='master'){ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(-l/2,-2,l*.45,4)}
    ctx.fillStyle='#fff';ctx.globalAlpha=.9;ctx.fillRect(l/2-3,-w/2+3,3,5);ctx.fillRect(l/2-3,w/2-8,3,5);ctx.globalAlpha=1;
    ctx.fillStyle='#ff2a2a';ctx.fillRect(-l/2,-w/2+3,2,5);ctx.fillRect(-l/2,w/2-8,2,5);
    if(c.mark){ctx.strokeStyle='#ffe600';ctx.lineWidth=3;rrect(-l/2-3,-w/2-3,l+6,w+6,9);ctx.stroke()}
    if(c.stun>0){ctx.fillStyle='rgba(0,240,255,.35)';rrect(-l/2,-w/2,l,w,7);ctx.fill()}
    ctx.restore();
  }
  function glowCar(c){
    ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.a);var l=c.l,w=c.w;
    if(c.hp>0&&c.stun<=0){var g=ctx.createRadialGradient(l/2+24,0,2,l/2+24,0,46);g.addColorStop(0,'rgba(255,250,215,.28)');g.addColorStop(1,'rgba(255,250,215,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(l/2+24,0,46,0,6.283);ctx.fill()}
    if(c.ai==='police'){var on=Math.sin(c.siren*14)>0;ctx.fillStyle=on?'rgba(255,40,60,.9)':'rgba(40,110,255,.9)';ctx.beginPath();ctx.arc(0,on?-6:6,16,0,6.283);ctx.fill()}
    if(c.own||c.glass){ctx.fillStyle='rgba(0,240,255,.2)';rrect(-l/2-6,-w/2-6,l+12,w+12,12);ctx.fill()}
    ctx.restore();
  }
  function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath()}
  function drawPed(p){
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);
    if(p.st==='down'){ctx.fillStyle=p.col;ctx.globalAlpha=.7;ctx.fillRect(-9,-4,18,8);ctx.globalAlpha=1;ctx.fillStyle='#d39a73';ctx.beginPath();ctx.arc(9,0,4,0,6.283);ctx.fill()}
    else{var s=Math.sin(T*8+p.x)*2;ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(1,2,7,6,0,0,6.283);ctx.fill();ctx.fillStyle=p.col;ctx.beginPath();ctx.ellipse(0,0,5,8,0,0,6.283);ctx.fill();ctx.fillStyle='#d39a73';ctx.beginPath();ctx.arc(2,0,4.2,0,6.283);ctx.fill();ctx.fillStyle='#111';ctx.fillRect(-2+s,-2,2,2)}
    ctx.restore();
  }
  function drawPlayer(){
    var cc=window.DSA_CHAR?DSA_CHAR.colors(DSA_CHAR.get()):{skin:'#d39a73',hair:'#0d0d12',jacket:'#1a1d28'};
    ctx.save();ctx.translate(pl.x,pl.y);ctx.rotate(pl.a);
    ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(2,3,9,11,0,0,6.283);ctx.fill();
    var s=Math.sin(pl.walk)*3;ctx.fillStyle='#222';ctx.fillRect(-4+s,-9,6,4);ctx.fillRect(-4-s,5,6,4);
    ctx.fillStyle=cc.jacket;ctx.beginPath();ctx.ellipse(0,0,6.5,11,0,0,6.283);ctx.fill();
    ctx.strokeStyle='#00f0ff';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-1,-9);ctx.lineTo(-1,9);ctx.stroke();
    ctx.fillStyle=cc.skin;ctx.beginPath();ctx.arc(2,0,5.2,0,6.283);ctx.fill();
    ctx.fillStyle=cc.hair;ctx.beginPath();ctx.arc(1,0,5.4,1.6,4.7);ctx.fill();
    ctx.restore();
  }
  function drawMarkers(){
    var o=mis&&mis.obj[mis.i],p=objPos(o);
    if(o&&p){
      var col='#ffe600';
      if(o.t==='race'){o.pts.forEach(function(q,i){if(i<o.k)return;ctx.strokeStyle=i===o.k?'#ffe600':'rgba(255,230,0,.35)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(q.x,q.y,i===o.k?44:30,0,6.283);ctx.stroke()})}
      else if(!(o.t==='getcar'||o.t==='tail')){ctx.strokeStyle=col;ctx.lineWidth=4;ctx.globalAlpha=.6+.4*Math.sin(T*5);ctx.beginPath();ctx.arc(p.x,p.y,(o.r||60)*.7+4*Math.sin(T*4),0,6.283);ctx.stroke();ctx.fillStyle='rgba(255,230,0,.12)';ctx.fill();ctx.globalAlpha=1}
      ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(p.x,p.y-70-Math.sin(T*4)*5);ctx.lineTo(p.x-10,p.y-90-Math.sin(T*4)*5);ctx.lineTo(p.x+10,p.y-90-Math.sin(T*4)*5);ctx.fill();
    }
    events.forEach(function(e){ctx.fillStyle='#39ff88';ctx.beginPath();ctx.moveTo(e.x,e.y-34);ctx.lineTo(e.x-8,e.y-50);ctx.lineTo(e.x+8,e.y-50);ctx.fill()});
  }
  function drawArrow(S){
    var o=mis&&mis.obj[mis.i],p=objPos(o);if(!p)return;
    var sx=W/2+(p.x-cam.x)*S,sy=H/2+(p.y-cam.y)*S;
    if(sx>40&&sx<W-40&&sy>40&&sy<H-40)return;
    var a=Math.atan2(sy-H/2,sx-W/2),ex=W/2+Math.cos(a)*(Math.min(W,H)/2-50),ey=H/2+Math.sin(a)*(Math.min(W,H)/2-50);
    ctx.save();ctx.translate(ex,ey);ctx.rotate(a);ctx.fillStyle='#ffe600';ctx.globalAlpha=.9;ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(-10,-12);ctx.lineTo(-4,0);ctx.lineTo(-10,12);ctx.closePath();ctx.fill();ctx.restore();
  }
  function drawMini(){
    var S=.12,w=170,hh=170;mctx.fillStyle='#070912';mctx.fillRect(0,0,w,hh);
    var r=R(),cx=r.x,cy=r.y;
    mctx.save();mctx.translate(w/2,hh/2);
    mctx.strokeStyle='rgba(0,240,255,.35)';mctx.lineWidth=5*S*2;
    for(var i=0;i<=NB;i++){var x=(i*P-cx)*S;if(Math.abs(x)<w){mctx.beginPath();mctx.moveTo(x,-hh);mctx.lineTo(x,hh);mctx.stroke()}var y=(i*P-cy)*S;if(Math.abs(y)<hh){mctx.beginPath();mctx.moveTo(-w,y);mctx.lineTo(w,y);mctx.stroke()}}
    for(var k in POI){var q=POI[k];mctx.fillStyle=q.col;mctx.fillRect((q.x-cx)*S-4,(q.y-cy)*S-4,8,8)}
    var o=mis&&mis.obj[mis.i],p=objPos(o);
    if(p){var px=clamp((p.x-cx)*S,-76,76),py=clamp((p.y-cy)*S,-76,76);mctx.fillStyle='#ffe600';mctx.beginPath();mctx.arc(px,py,5,0,6.283);mctx.fill()}
    events.forEach(function(e){mctx.fillStyle='#39ff88';mctx.fillRect(clamp((e.x-cx)*S,-78,78)-3,clamp((e.y-cy)*S,-78,78)-3,6,6)});
    cars.forEach(function(c){if(c.ai!=='police')return;var px=(c.x-cx)*S,py=(c.y-cy)*S;if(Math.abs(px)<80&&Math.abs(py)<80){mctx.fillStyle=Math.sin(T*10)>0?'#ff2a4d':'#3b7bff';mctx.fillRect(px-3,py-3,6,6)}});
    mctx.fillStyle='#fff';mctx.rotate(pl.a);mctx.beginPath();mctx.moveTo(7,0);mctx.lineTo(-5,-5);mctx.lineTo(-5,5);mctx.fill();
    mctx.restore();mctx.strokeStyle='#00f0ff';mctx.lineWidth=2;mctx.strokeRect(1,1,w-2,hh-2);
  }
  var hudT=0;
  function updateHud(){
    $('#ghMoney').textContent='€ '+save.money;
    var s=starsN(),st='';for(var i=0;i<5;i++)st+=i<s?'★':'☆';var se=$('#ghStars');se.textContent=st;se.classList.toggle('on',s>0);
    var e=$('#ghEmp');e.textContent=emp>0?'EMP '+Math.ceil(emp)+' s':'EMP LISTO [F]';e.classList.toggle('rdy',emp<=0);
    if(pl.car&&pl.car.hp<CT[pl.car.type].hp)e.textContent+='  ·  CASCO '+Math.round(pl.car.hp/CT[pl.car.type].hp*100)+'%';
  }

  /* ---------- bucle ---------- */
  function frame(now){
    raf=requestAnimationFrame(frame);
    if(dead)return;
    var dt=Math.min(.05,(now-last)/1000);last=now;
    size();
    if(document.hidden)return;
    if(!paused&&started){
      T+=dt;
      if(!ring)nextCall-=dt;if(nextCall<=0&&!mis&&!ring&&!inHack)incoming();
      if(ring){ring.t+=dt;if(ring.t>.2&&$('#ghTxt').textContent==='…')$('#ghTxt').textContent=ring.def.n+' — pulsa ENTER para contestar';if(ring.t>22)missRing()}
      if(emp>0)emp-=dt;
      updatePlayer(dt);updateCars(dt);updatePeds(dt);updatePickups(dt);updatePolice(dt);updateMission(dt);events_(dt);updateEvents(dt);
      actT-=dt;if(actT<=0&&!$('#ghAct').hidden)$('#ghAct').hidden=true;
      for(var i=parts.length-1;i>=0;i--){var p=parts[i];p.t-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.t<=0)parts.splice(i,1)}
      if(shake>0)shake=Math.max(0,shake-dt*30);
      var r=R(),sp=pl.car?pl.car.sp:0,tz=clamp(1-sp/1100,.62,1);cam.z+=(tz*(W/DPR<700?.8:1)-cam.z)*Math.min(1,dt*2);
      var lx=pl.car?pl.car.vx*.35:0,ly=pl.car?pl.car.vy*.35:0;
      cam.x+=(r.x+lx-cam.x)*Math.min(1,dt*5);cam.y+=(r.y+ly-cam.y)*Math.min(1,dt*5);
      hudT+=dt;if(hudT>.1){hudT=0;updateHud()}
      drawMini();
    }else if(started&&!menu.hidden===false&&!inHack){/* en pausa */}
    if(!started||!paused||true)drawWorld();
    if(started&&paused&&menu.hidden&&shopEl.hidden&&!inHack&&pressed('Escape')){/* ya gestionado */}
    for(var k in once)once[k]=false;
  }
  size();cam.x=pl.x;cam.y=pl.y;cam.z=1;
  drawMenu('start');
  raf=requestAnimationFrame(frame);
  $('#ghAns').addEventListener('click',answer);
  ov.addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden&&started){menu.hidden=true;paused=false}});

  return {
    destroy:function(){dead=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);if(ov.parentNode)ov.parentNode.removeChild(ov)},
    state:function(){return {started:started,paused:paused,money:save.money,heat:heat,stars:starsN(),mission:mis&&mis.def.n,obj:mis&&mis.obj[mis.i]&&mis.obj[mis.i].t,cars:cars.length,peds:peds.length,inCar:!!pl.car,x:pl.x,y:pl.y,ring:!!ring}},
    _t:{pl:pl,cars:function(){return cars},addHeat:addHeat,answer:answer,incoming:incoming,enterCar:enterCar,keys:keys,openShop:openShop,hit:function(){}}
  };
}
return {create:create,PAINTS:PAINTS};
})();
