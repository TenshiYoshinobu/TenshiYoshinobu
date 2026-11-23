/* GEO — figuras geométricas entrelazadas (Canvas 2D con perspectiva propia).
   Poliedros wireframe que giran, anillos, red de partículas que se conecta y desconecta.
   Se pausa fuera de pantalla y con la pestaña oculta; con movimiento reducido dibuja un fotograma. */
window.DSA_GEO=(function(){
var PAL=[['#00f0ff','#ff2bd6','#9b5cff','#ffe600'],['#ff2bd6','#9b5cff','#00f0ff','#ffe600'],['#9b5cff','#00f0ff','#ff2bd6','#ffe600'],['#00f0ff','#9b5cff','#ffe600','#ff2bd6']];
var RM=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
function poly(kind){
  var v=[],e=[],i,j,t=(1+Math.sqrt(5))/2;
  if(kind===0){v=[[1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],[-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1]]}
  else if(kind===1){v=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]}
  else{v=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]]}
  var m=1e9;for(i=0;i<v.length;i++)for(j=i+1;j<v.length;j++){var d=dist(v[i],v[j]);if(d<m)m=d}
  for(i=0;i<v.length;i++)for(j=i+1;j<v.length;j++)if(Math.abs(dist(v[i],v[j])-m)<.01)e.push([i,j]);
  var n=Math.sqrt(v[0][0]*v[0][0]+v[0][1]*v[0][1]+v[0][2]*v[0][2]);
  return {v:v.map(function(p){return [p[0]/n,p[1]/n,p[2]/n]}),e:e};
}
function dist(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])}
function rot(p,ax,ay,az){
  var x=p[0],y=p[1],z=p[2],c=Math.cos(ax),s=Math.sin(ax),t=y*c-z*s;z=y*s+z*c;y=t;
  c=Math.cos(ay);s=Math.sin(ay);t=x*c+z*s;z=-x*s+z*c;x=t;
  c=Math.cos(az);s=Math.sin(az);t=x*c-y*s;y=x*s+y*c;x=t;return [x,y,z];
}
function mount(host,seed){
  if(!host||host._geo)return;host._geo=1;seed=seed|0;
  var cv=document.createElement('canvas');cv.setAttribute('aria-hidden','true');cv.className='geo-cv';host.appendChild(cv);
  var cx=cv.getContext('2d'),pal=PAL[seed%PAL.length],W=0,H=0,dpr=Math.min(2,window.devicePixelRatio||1);
  var shapes=[{p:poly(seed%3),s:1,sp:[.31,.47,.12],c:0},{p:poly((seed+2)%3),s:.62,sp:[-.42,.28,.2],c:1},{p:poly((seed+1)%3),s:.34,sp:[.6,-.35,.3],c:3}];
  var rings=[{r:1.18,tilt:[1.1,0,.3],sp:.5,c:2},{r:.82,tilt:[.3,.9,0],sp:-.7,c:0}];
  var pts=[];for(var i=0;i<26;i++){var a=Math.random()*6.283,b=Math.acos(2*Math.random()-1),r=.9+Math.random()*.8;pts.push({x:r*Math.sin(b)*Math.cos(a),y:r*Math.sin(b)*Math.sin(a),z:r*Math.cos(b),ph:Math.random()*6.283,sp:.2+Math.random()*.4})}
  function size(){var r=host.getBoundingClientRect();W=Math.max(60,r.width|0);H=Math.max(60,r.height|0);cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';cx.setTransform(dpr,0,0,dpr,0,0)}
  function proj(p){var f=3.2/(3.2-p[2]*.9),k=Math.min(W,H)*.34;return [W/2+p[0]*k*f,H/2+p[1]*k*f,f]}
  function frame(t){
    cx.clearRect(0,0,W,H);cx.globalCompositeOperation='lighter';cx.lineCap='round';
    var g=cx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.min(W,H)*.5);g.addColorStop(0,'rgba(155,92,255,.16)');g.addColorStop(1,'rgba(155,92,255,0)');cx.fillStyle=g;cx.fillRect(0,0,W,H);
    var ry=t*.00012;
    rings.forEach(function(rg){
      cx.strokeStyle=pal[rg.c];cx.lineWidth=1;cx.globalAlpha=.5;cx.beginPath();
      for(var k=0;k<=48;k++){var a=k/48*6.283,q=rot([Math.cos(a)*rg.r,Math.sin(a)*rg.r,0],rg.tilt[0]+t*.00005*rg.sp,rg.tilt[1]+t*.0002*rg.sp,rg.tilt[2]),pr=proj(q);k?cx.lineTo(pr[0],pr[1]):cx.moveTo(pr[0],pr[1])}
      cx.stroke();
    });
    shapes.forEach(function(sh){
      var q=sh.p.v.map(function(p){var r=rot(p,t*.0004*sh.sp[0],t*.0004*sh.sp[1],t*.0004*sh.sp[2]);return proj([r[0]*sh.s,r[1]*sh.s,r[2]*sh.s])});
      cx.strokeStyle=pal[sh.c];cx.lineWidth=1.2;cx.globalAlpha=.85;cx.shadowColor=pal[sh.c];cx.shadowBlur=6;
      sh.p.e.forEach(function(e){var a=q[e[0]],b=q[e[1]];cx.beginPath();cx.moveTo(a[0],a[1]);cx.lineTo(b[0],b[1]);cx.stroke()});
      cx.shadowBlur=0;cx.fillStyle=pal[(sh.c+1)%4];q.forEach(function(p){cx.globalAlpha=.9;cx.fillRect(p[0]-1.5,p[1]-1.5,3,3)});
    });
    /* red de partículas: se conectan y desconectan según la distancia */
    var P=pts.map(function(p){var r=rot([p.x,p.y,p.z],0,t*.00018*p.sp+p.ph,0);r[1]+=Math.sin(t*.001*p.sp+p.ph)*.08;return proj(r)});
    for(var i=0;i<P.length;i++)for(var j=i+1;j<P.length;j++){
      var d=Math.hypot(P[i][0]-P[j][0],P[i][1]-P[j][1]),lim=Math.min(W,H)*.3;
      if(d<lim){cx.globalAlpha=(1-d/lim)*.45;cx.strokeStyle=pal[2];cx.lineWidth=.7;cx.beginPath();cx.moveTo(P[i][0],P[i][1]);cx.lineTo(P[j][0],P[j][1]);cx.stroke()}
    }
    P.forEach(function(p,i){cx.globalAlpha=.7;cx.fillStyle=pal[i%4];cx.fillRect(p[0]-1,p[1]-1,2,2)});
    cx.globalAlpha=1;cx.globalCompositeOperation='source-over';
  }
  size();
  if(RM){frame(2200);return}
  var on=false,raf=0;
  function loop(t){if(!on||document.hidden){raf=0;return}frame(t);raf=requestAnimationFrame(loop)}
  function start(){if(!raf&&on)raf=requestAnimationFrame(loop)}
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){on=es[0].isIntersecting;if(on)start()},{threshold:0}).observe(host)}else{on=true;start()}
  document.addEventListener('visibilitychange',start);
  if('ResizeObserver' in window)new ResizeObserver(size).observe(host);
  frame(2200);
}
function scan(root){(root||document).querySelectorAll('[data-geo]').forEach(function(h){mount(h,+h.getAttribute('data-geo')||0)})}
return {mount:mount,scan:scan};
})();
