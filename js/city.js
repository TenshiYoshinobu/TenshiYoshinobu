/* =====================================================================
   NIGHT CITY 3D  //  mapa explorable (WebGL propio, sin librerías)
   DSA_CITY.create(contenedor, opciones) -> {destroy, focus}
   Lanza un Error si el navegador no tiene WebGL (main.js usa entonces el mapa 2D).
   ===================================================================== */
window.DSA_CITY=(function(){
'use strict';

/* ---------- matemáticas ---------- */
function mul(a,b){var o=new Float32Array(16);for(var i=0;i<4;i++)for(var j=0;j<4;j++){var s=0;for(var k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];o[i*4+j]=s}return o}
function persp(f,a,n,fr){var t=1/Math.tan(f/2),o=new Float32Array(16);o[0]=t/a;o[5]=t;o[10]=(fr+n)/(n-fr);o[11]=-1;o[14]=2*fr*n/(n-fr);return o}
function norm(v){var l=Math.hypot(v[0],v[1],v[2])||1;return [v[0]/l,v[1]/l,v[2]/l]}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function look(e,c,u){var f=norm([c[0]-e[0],c[1]-e[1],c[2]-e[2]]),s=norm(cross(f,u)),w=cross(s,f),o=new Float32Array(16);
  o[0]=s[0];o[4]=s[1];o[8]=s[2];o[1]=w[0];o[5]=w[1];o[9]=w[2];o[2]=-f[0];o[6]=-f[1];o[10]=-f[2];
  o[12]=-(s[0]*e[0]+s[1]*e[1]+s[2]*e[2]);o[13]=-(w[0]*e[0]+w[1]*e[1]+w[2]*e[2]);o[14]=f[0]*e[0]+f[1]*e[1]+f[2]*e[2];o[15]=1;return o}
function yawM(x,y,z,sx,sy,sz,a){var c=Math.cos(a),s=Math.sin(a);return new Float32Array([c*sx,0,-s*sx,0, 0,sy,0,0, s*sz,0,c*sz,0, x,y,z,1])}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function ease(k){return k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}

var PITCH=26; /* separación de calles */

/* ---------- shaders ---------- */
var VS='attribute vec3 aP;attribute vec3 aN;uniform mat4 uM,uVP;uniform vec3 uS;varying vec3 vN,vNo,vW,vL;'+
 'void main(){vec4 w=uM*vec4(aP,1.);vW=w.xyz;vNo=aN;vN=mat3(uM)*aN;vL=aP*uS;gl_Position=uVP*w;}';
var FS='#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n'+
 'uniform vec3 uCol,uTint,uTint2,uCam,uFogC,uQ0,uQ1,uQ2,uQ3;uniform vec2 uWin;uniform float uAdd,uMode,uSeed,uT,uAl,uDens,uH,uFog,uFl;varying vec3 vN,vNo,vW,vL;'+
 'float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
 'void main(){vec3 c=vec3(0.);float a=uAl;'+
 'if(uMode<.5){'+
   'float side=1.-step(.5,abs(vNo.y));float hz=mix(vL.x,vL.z,step(.5,abs(vNo.x)));'+
   'vec2 q=vec2(hz*uWin.x,vL.y*uWin.y);vec2 cell=floor(q);vec2 f=fract(q);float r=hs(cell+uSeed);'+
   'float on=step(1.-uDens,r)*step(vL.y+.0,uH-.9);'+
   'float win=step(.16,f.x)*step(f.x,.84)*step(.22,f.y)*step(f.y,.78);'+
   'float fl=1.-.6*step(.992,sin(uT*2.+r*60.));'+
   'vec3 wc=mix(uTint,uTint2,hs(cell.yx+uSeed*3.));'+
   'float lg=.45+.55*max(dot(normalize(vN),normalize(vec3(.4,.8,.45))),0.);'+
   'c=uCol*lg+side*win*on*wc*1.1*fl;'+
   'c+=side*uTint*.9*smoothstep(uH-.7,uH-.35,vL.y)*(1.-smoothstep(uH-.35,uH-.2,vL.y));'+
   'c+=(1.-side)*uTint*.07;'+
 '}else if(uMode<1.5){c=uCol*uFl;}'+
 'else if(uMode<2.5){float d=length(vL.xy*2.);a*=pow(clamp(1.-d,0.,1.),2.);c=uCol;}'+
 'else if(uMode<3.5){'+
   'vec2 p=vW.xz;float P='+PITCH+'.;vec2 m=mod(p+P*.5,P)-P*.5;'+
   'vec3 qc=p.x<0.?(p.y<0.?uQ0:uQ2):(p.y<0.?uQ1:uQ3);'+
   'float inx=step(abs(m.x),4.),inz=step(abs(m.y),4.);float st=max(inx,inz);'+
   'float out_=step(P*4.5,max(abs(p.x),abs(p.y)));'+
   'vec3 road=vec3(.022,.026,.04)+.02*hs(floor(p*3.));'+
   'float lane=(inx*step(abs(m.x),.14)*step(.5,fract(p.y*.2))+inz*step(abs(m.y),.14)*step(.5,fract(p.x*.2)))*(1.-inx*inz);'+
   'float edge=(inx*(1.-step(.4,abs(abs(m.x)-4.)))+inz*(1.-step(.4,abs(abs(m.y)-4.))))*(1.-inx*inz);'+
   'float wet=.5+.5*sin(p.x*.6+uT*.25)*sin(p.y*.8-uT*.2);'+
   'c=mix(vec3(.07,.075,.11),road,st);c+=lane*vec3(.7,.6,.25)+edge*qc*1.6+st*qc*.05*wet;'+
   'float glw=(1.-st)*step(.92,fract(p.x*.5))*.02;c+=glw*qc;'+
   'if(out_>.5){c=vec3(.025,.03,.05)+qc*.015;float wt=step(P*4.5+10.,p.y);'+
     'float sh=sin(p.x*.3+uT*.7)*sin(p.y*.25+uT*.5);c=mix(c,vec3(.02,.05,.1)+qc*.08*max(sh,0.)*exp(-(p.y-P*4.5)*.035),wt);}'+
 '}else if(uMode<4.5){float h2=clamp((vL.y+.5),0.,1.);a*=pow(clamp(1.-abs(vL.x*2.),0.,1.),2.)*(1.-h2*.7);c=uCol;}'+
 'float k=uFog*distance(vW,uCam);float fg=1.-exp(-k*k);if(uAdd>.5)c*=(1.-fg);else c=mix(c,uFogC,fg);'+
 'gl_FragColor=vec4(c,a);}';
var SVS='attribute vec2 aP;varying vec2 v;void main(){v=aP;gl_Position=vec4(aP,.999,1.);}';
var SFS='precision mediump float;varying vec2 v;uniform float uHor,uT,uAsp;uniform vec3 uTop,uHzc;'+
 'float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
 'void main(){float y=v.y*.5+.5;float t=clamp((y-uHor)/(1.-uHor+.001),0.,1.);vec3 c=mix(uHzc,uTop,pow(t,.55));'+
 'float below=step(y,uHor);c=mix(c,uHzc*.5,below);'+
 'vec2 g=floor(gl_FragCoord.xy/2.);float s=step(.9985,hs(g))*t*(.6+.4*sin(uT*2.+hs(g)*30.));c+=s;'+
 'c+=uHzc*.5*exp(-abs(y-uHor)*9.);gl_FragColor=vec4(c,1.);}';

/* ---------- main ---------- */
function create(box,opt){
  opt=opt||{};
  var RM=!!opt.reduced,zones=opt.zones||[];
  var cv=document.createElement('canvas');cv.className='city-cv';cv.setAttribute('aria-label','Mapa 3D de Night City. Arrastra para girar, rueda para acercar, pulsa un edificio con baliza para seleccionarlo.');
  cv.tabIndex=0;box.appendChild(cv);
  var gl=cv.getContext('webgl',{antialias:true,alpha:false,powerPreference:'high-performance'})||cv.getContext('experimental-webgl');
  if(!gl){box.removeChild(cv);throw new Error('sin WebGL')}

  function sh(t,src){var o=gl.createShader(t);gl.shaderSource(o,src);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o}
  function prog(vs,fs){var p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,vs));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs));gl.bindAttribLocation(p,0,'aP');gl.bindAttribLocation(p,1,'aN');gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p}
  function locs(p,n){var o={};n.forEach(function(k){o[k]=gl.getUniformLocation(p,k)});return o}
  var P,SP,U,SU;
  try{
    P=prog(VS,FS);SP=prog(SVS,SFS);
    U=locs(P,['uM','uVP','uS','uCol','uTint','uTint2','uCam','uFogC','uQ0','uQ1','uQ2','uQ3','uWin','uAdd','uMode','uSeed','uT','uAl','uDens','uH','uFog','uFl']);
    SU=locs(SP,['uHor','uT','uAsp','uTop','uHzc']);
  }catch(e){box.removeChild(cv);throw e}

  /* geometría */
  function buf(arr,idx){var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(arr),gl.STATIC_DRAW);var ib=null;if(idx){ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx),gl.STATIC_DRAW)}return{b:b,ib:ib,n:idx.length}}
  var cv_=[],ci=[];
  [[0,0,1,[-.5,0,.5,.5,0,.5,.5,1,.5,-.5,1,.5]],[0,0,-1,[.5,0,-.5,-.5,0,-.5,-.5,1,-.5,.5,1,-.5]],[1,0,0,[.5,0,.5,.5,0,-.5,.5,1,-.5,.5,1,.5]],[-1,0,0,[-.5,0,-.5,-.5,0,.5,-.5,1,.5,-.5,1,-.5]],[0,1,0,[-.5,1,.5,.5,1,.5,.5,1,-.5,-.5,1,-.5]]].forEach(function(f,i){
    for(var k=0;k<4;k++)cv_.push(f[3][k*3],f[3][k*3+1],f[3][k*3+2],f[0],f[1],f[2]);var o=i*4;ci.push(o,o+1,o+2,o,o+2,o+3)});
  var CUBE=buf(cv_,ci);
  var QUAD=buf([-.5,-.5,0,0,0,1, .5,-.5,0,0,0,1, .5,.5,0,0,0,1, -.5,.5,0,0,0,1],[0,1,2,0,2,3]);
  var GROUND=buf([-400,0,-400,0,1,0, 400,0,-400,0,1,0, 400,0,400,0,1,0, -400,0,400,0,1,0],[0,2,1,0,3,2]);
  var SKY=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,SKY);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,1,1,-1,1]),gl.STATIC_DRAW);
  function bind(g){gl.bindBuffer(gl.ARRAY_BUFFER,g.b);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,g.ib)}

  /* paleta desde el tema activo */
  var root=document.getElementById('ds')||document.documentElement;
  function pal(v,d){var a=(getComputedStyle(root).getPropertyValue(v)||'').split(',');return a.length===3?[a[0]/255,a[1]/255,a[2]/255]:d}
  var C1=pal('--c1-rgb',[1,.16,.43]),C2=pal('--c2-rgb',[1,.9,.2]),C3=pal('--c3-rgb',[0,.94,1]);
  var VIO=[.65,.42,1],ORA=[1,.55,.1];
  var QCOL=[C1,C3,ORA,VIO]; /* NO: corpo(rosa)  NE: watson(cian)  SO: badlands(naranja)  SE: pacifica(violeta) */
  var QTINT2=[[1,.85,.9],[.8,1,1],[1,.9,.5],[.85,.8,1]];
  var BASE=[[.06,.05,.1],[.05,.08,.11],[.1,.07,.06],[.07,.06,.12]];
  function quad(x,z){return x<0?(z<0?0:2):(z<0?1:3)}

  /* ---------- construcción de la ciudad ---------- */
  var rnd=mulberry(77231),B=[],TOWERS=[],CARS=[],AIR=[],GLYPH=[],LIGHTS=[];
  var ZPOS={inicio:[-39,-39],semestres:[39,-39],especial:[-39,39],reflexion:[39,39]};
  for(var bi=-4;bi<=4;bi++)for(var bj=-4;bj<=4;bj++){
    var cx=(bi+.5)*PITCH,cz=(bj+.5)*PITCH;
    if(bi===-2&&bj===-2||bi===1&&bj===-2||bi===-2&&bj===1||bi===1&&bj===1)continue; /* bloques de los 4 puntos de interés */
    var q=quad(cx,cz),dist=Math.hypot(cx,cz);
    for(var lx=0;lx<2;lx++)for(var lz=0;lz<2;lz++){
      var w=6+rnd()*3,d=6+rnd()*3,x=cx+(lx?4.4:-4.4)+(rnd()-.5)*1.2,z=cz+(lz?4.4:-4.4)+(rnd()-.5)*1.2,hh;
      if(q===0)hh=34+rnd()*rnd()*95*(1-dist/190);
      else if(q===1){hh=16+rnd()*40;w+=2}
      else if(q===2){if(rnd()<.3)continue;hh=5+rnd()*18}
      else hh=10+rnd()*34;
      if(Math.abs(cx)<30&&Math.abs(cz)<30)hh+=14;
      B.push({x:x,z:z,w:w,d:d,h:hh,q:q,seed:Math.floor(rnd()*500),dens:.28+rnd()*.4,sx:.5+rnd()*.14,sy:.4+rnd()*.07,flip:rnd()<.5,
        top:hh>50&&rnd()<.6?{w:w*.5,d:d*.5,h:8+rnd()*14}:null});
    }
  }
  /* anillo de rascacielos lejanos para que la ciudad no termine en el vacío */
  for(var ri=0;ri<70;ri++){var ang=rnd()*Math.PI*2,rad=150+rnd()*90,rx=Math.cos(ang)*rad,rz=Math.sin(ang)*rad;if(rz>125)continue;
    var rw=8+rnd()*10,rh=30+rnd()*90;B.push({x:rx,z:rz,w:rw,d:rw,h:rh,q:quad(rx,rz),seed:Math.floor(rnd()*500),dens:.3,sx:.4,sy:.35,top:null})}
  /* torres: cada punto de interés es una sección de la web */
  zones.forEach(function(z){
    var p=ZPOS[z.id]||[0,0],t={id:z.id,sec:z.sec,name:z.name,desc:z.desc,x:p[0],z:p[1],q:quad(p[0],p[1]),col:null,top:0};
    t.col=QCOL[t.q];t.top=z.id==='inicio'?132:z.id==='semestres'?84:z.id==='especial'?64:112;TOWERS.push(t);
  });
  /* tráfico por las calles */
  function lane(){var axis=rnd()<.5?0:1,idx=(Math.floor(rnd()*10)-5)*PITCH,off=(rnd()<.5?-1:1)*(1+rnd()*1.6);return {axis:axis,idx:idx,off:off}}
  var NC=opt.low?40:90;
  for(var i=0;i<NC;i++){var l=lane();CARS.push({ax:l.axis,fix:l.idx+l.off,pos:(rnd()*2-1)*130,v:(5+rnd()*9)*(l.off<0?1:-1),len:1.7+rnd()*1.4,col:[C1,C2,C3,[1,1,1]][i%4]})}
  for(i=0;i<(opt.low?10:26);i++)AIR.push({ax:rnd()<.5?0:1,fix:(rnd()*2-1)*120,y:28+rnd()*70,pos:(rnd()*2-1)*140,v:(10+rnd()*18)*(rnd()<.5?-1:1),col:[C1,C3,VIO][i%3]});
  /* luces de calle (aditivas, solo cercanas) */
  for(i=-5;i<=5;i++)for(var j=-5;j<=5;j++)if((i+j)%2===0)LIGHTS.push({x:i*PITCH+4.2,z:j*PITCH+4.2,q:quad(i*PITCH,j*PITCH)});

  /* señales ocultas (el sistema de secretos las usará más adelante) */
  var GL=[
   {id:'g1',x:-91,z:52,y:2.2,msg:'Señal 1/4 recuperada en los Badlands. Fragmento: «22»'},
   {id:'g2',x:104,z:96,y:2.4,msg:'Señal 2/4 recuperada junto al muelle de Pacifica. Fragmento: «443»'},
   {id:'g3',x:52,z:-78,y:10,msg:'Señal 3/4 recuperada en una azotea de Watson. Fragmento: «SSH + HTTPS»'},
   {id:'g4',x:0,z:0,y:16,msg:'Señal 4/4 recuperada en el núcleo neural. Fragmento: «El orden importa»'}
  ];
  var found={};(opt.found||[]).forEach(function(k){found[k]=true});
  function nFound(){return Object.keys(found).length}

  /* ---------- cámara ---------- */
  var cam={tx:0,tz:6,d:250,yaw:.7,pit:.62},goal=null,auto=!RM,tour=null,lastInput=performance.now(),sel=null,hov=null;
  var keys={},VP=new Float32Array(16),eye=[0,0,0],W=2,H=2,dead=false,raf=0,T=0,last=performance.now(),fpsA=60,scale=1,lowT=0;
  function flyTo(g,ms){goal={a:{tx:cam.tx,tz:cam.tz,d:cam.d,yaw:cam.yaw,pit:cam.pit},b:g,t:0,dur:RM?.05:(ms||1.6)};auto=false;tour=null}
  function nearAngle(from,to){var d=((to-from+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;return from+d}
  function selectZone(id,fly){
    var z=TOWERS.filter(function(t){return t.id===id})[0];if(!z)return;
    sel=z;if(opt.onSelect)opt.onSelect(z);
    if(fly!==false)flyTo({tx:z.x,tz:z.z,d:70,yaw:nearAngle(cam.yaw,cam.yaw),pit:.42},1.5);
  }
  var TOUR=[{tx:-39,tz:-39,d:80,yaw:.5,pit:.35},{tx:0,tz:-10,d:34,yaw:1.4,pit:.14},{tx:39,tz:-39,d:70,yaw:2.2,pit:.4},{tx:60,tz:40,d:46,yaw:3.2,pit:.2},{tx:39,tz:39,d:80,yaw:3.8,pit:.35},{tx:-39,tz:39,d:70,yaw:5.0,pit:.3},{tx:-20,tz:0,d:150,yaw:5.6,pit:.6}];
  function startTour(){if(tour){tour=null;return false}if(cam.d<90){cam.d=120;cam.pit=Math.max(cam.pit,.35)}tour={i:0,t:0,a:null};goal=null;auto=false;return true}

  /* ---------- entrada ---------- */
  var ptr={},drag=null,moved=0,pinch=0;
  function stopAuto(){auto=false;lastInput=performance.now();if(tour)tour=null}
  cv.addEventListener('pointerdown',function(e){cv.setPointerCapture&&cv.setPointerCapture(e.pointerId);ptr[e.pointerId]={x:e.clientX,y:e.clientY};drag={x:e.clientX,y:e.clientY,btn:e.button};moved=0;stopAuto();goal=null;cv.focus()});
  cv.addEventListener('pointermove',function(e){
    var p=ptr[e.pointerId];
    if(!p){hover(e.clientX,e.clientY);return}
    var ids=Object.keys(ptr);
    if(ids.length===2){
      var o=ptr[ids[0]===String(e.pointerId)?ids[1]:ids[0]],nd=Math.hypot(e.clientX-o.x,e.clientY-o.y);
      if(pinch)cam.d=clamp(cam.d*pinch/nd,10,280);pinch=nd;p.x=e.clientX;p.y=e.clientY;return}
    var dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;moved+=Math.abs(dx)+Math.abs(dy);
    if(drag&&(drag.btn===2||e.shiftKey)){var k2=cam.d*.0016,c1=Math.cos(cam.yaw),s1=Math.sin(cam.yaw);cam.tx+=-dx*c1*k2-dy*s1*k2;cam.tz+=dx*s1*k2-dy*c1*k2;limit()}
    else{cam.yaw-=dx*.006;cam.pit=clamp(cam.pit+dy*.005,.05,1.45)}
  });
  function up(e){
    var had=ptr[e.pointerId];delete ptr[e.pointerId];pinch=0;
    if(had&&moved<6&&Object.keys(ptr).length===0)clickAt(e.clientX,e.clientY);
    drag=null;
  }
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',function(e){delete ptr[e.pointerId];pinch=0;drag=null});
  cv.addEventListener('contextmenu',function(e){e.preventDefault()});
  cv.addEventListener('wheel',function(e){e.preventDefault();cam.d=clamp(cam.d*Math.exp(e.deltaY*.0012),10,280);stopAuto();goal=null},{passive:false});
  function kd(e){if(!box.isConnected)return;var k=e.key.toLowerCase();if('wasdqe'.indexOf(k)>=0&&k.length===1||k.indexOf('arrow')===0){keys[k]=true;stopAuto();goal=null;if(k.indexOf('arrow')===0&&document.activeElement===cv)e.preventDefault()}}
  function ku(e){delete keys[e.key.toLowerCase()]}
  window.addEventListener('keydown',kd);window.addEventListener('keyup',ku);
  function limit(){var m=PITCH*4.6;cam.tx=clamp(cam.tx,-m,m);cam.tz=clamp(cam.tz,-m,m+30)}

  /* proyección de un punto del mundo a píxeles de CSS */
  function proj(x,y,z){var m=VP,cx=m[0]*x+m[4]*y+m[8]*z+m[12],cy=m[1]*x+m[5]*y+m[9]*z+m[13],cw=m[3]*x+m[7]*y+m[11]*z+m[15];if(cw<=.1)return null;
    var r=cv.getBoundingClientRect();return{x:(cx/cw*.5+.5)*r.width,y:(1-(cy/cw*.5+.5))*r.height,w:cw}}
  function pickAt(cx,cy,rad){
    var r=cv.getBoundingClientRect(),px=cx-r.left,py=cy-r.top,best=null,bd=rad;
    TOWERS.forEach(function(t){var p=proj(t.x,t.top*.75,t.z);if(!p)return;var d=Math.hypot(p.x-px,p.y-py);if(d<bd){bd=d;best={kind:'z',o:t}}});
    GL.forEach(function(g){if(found[g.id])return;var p=proj(g.x,g.y,g.z);if(!p)return;var d=Math.hypot(p.x-px,p.y-py);if(d<Math.min(rad,30)&&d<bd){bd=d;best={kind:'g',o:g}}});
    return best;
  }
  function hover(x,y){var h=pickAt(x,y,34);cv.style.cursor=h?'pointer':'';hov=h&&h.kind==='z'?h.o:null}
  function clickAt(x,y){
    var h=pickAt(x,y,46);if(!h)return;
    if(h.kind==='z')selectZone(h.o.id);
    else{found[h.o.id]=true;if(opt.onFound)opt.onFound(h.o.id,h.o.msg,nFound());flyTo({tx:h.o.x,tz:h.o.z,d:28,yaw:cam.yaw,pit:.35},1.2)}
  }

  /* ---------- dibujo ---------- */
  var curG=null;
  function setCommon(){gl.uniform3fv(U.uCam,eye);gl.uniform3f(U.uFogC,.03,.025,.07);gl.uniform1f(U.uT,T);gl.uniform1f(U.uFog,.0052);
    gl.uniform3fv(U.uQ0,QCOL[0]);gl.uniform3fv(U.uQ1,QCOL[1]);gl.uniform3fv(U.uQ2,QCOL[2]);gl.uniform3fv(U.uQ3,QCOL[3])}
  function D(g,M,s,mode,o){o=o||{};
    if(curG!==g){bind(g);curG=g}
    gl.uniformMatrix4fv(U.uM,false,M);gl.uniform3f(U.uS,s[0],s[1],s[2]);gl.uniform1f(U.uMode,mode);
    var c=o.col||[1,1,1];gl.uniform3f(U.uCol,c[0],c[1],c[2]);gl.uniform1f(U.uAl,o.al==null?1:o.al);gl.uniform1f(U.uAdd,o.add?1:0);gl.uniform1f(U.uFl,o.fl==null?1:o.fl);
    if(mode<.5){gl.uniform3fv(U.uTint,o.tint);gl.uniform3fv(U.uTint2,o.tint2);gl.uniform2f(U.uWin,o.wx,o.wy);gl.uniform1f(U.uSeed,o.seed);gl.uniform1f(U.uDens,o.dens);gl.uniform1f(U.uH,s[1])}
    var add=o.add;gl.blendFunc(add?gl.SRC_ALPHA:gl.ONE,add?gl.ONE:gl.ZERO);if(!add&&mode===0)gl.blendFunc(gl.ONE,gl.ZERO);
    gl.depthMask(!add);gl.drawElements(gl.TRIANGLES,g.n,gl.UNSIGNED_SHORT,0)}
  var RIGHT=[1,0,0],UPV=[0,1,0],FWD=[0,0,-1];
  function bb(x,y,z,sx,sy,rot){ /* billboard hacia la cámara; rot=true -> vertical fijo en Y */
    var r=RIGHT,u=rot?[0,1,0]:UPV;return new Float32Array([r[0]*sx,r[1]*sx,r[2]*sx,0, u[0]*sy,u[1]*sy,u[2]*sy,0, FWD[0],FWD[1],FWD[2],0, x,y,z,1])}
  var CULL=300;

  function frame(now){
    raf=requestAnimationFrame(frame);
    if(dead||document.hidden){last=now;return}
    var dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;
    fpsA+=((1/Math.max(dt,.001))-fpsA)*.05;
    /* calidad adaptativa: si baja de 28 fps durante 2 s se reduce la resolución */
    if(fpsA<28){lowT+=dt;if(lowT>2&&scale>.5){scale-=.15;lowT=0;fpsA=40}}else lowT=0;
    var dpr=Math.min(window.devicePixelRatio||1,1.5)*scale;
    var nw=Math.max(2,cv.clientWidth*dpr|0),nh=Math.max(2,cv.clientHeight*dpr|0);
    if(cv.width!==nw||cv.height!==nh){cv.width=nw;cv.height=nh}W=nw;H=nh;
    gl.viewport(0,0,W,H);
    /* controles */
    var mv=cam.d*.45*dt,c=Math.cos(cam.yaw),s=Math.sin(cam.yaw),mx=0,mz=0;
    if(keys.w||keys.arrowup){mx-=s;mz-=c}if(keys.s||keys.arrowdown){mx+=s;mz+=c}
    if(keys.a||keys.arrowleft){mx-=c;mz+=s}if(keys.d||keys.arrowright){mx+=c;mz-=s}
    cam.tx+=mx*mv;cam.tz+=mz*mv;if(keys.q)cam.yaw+=dt*1.2;if(keys.e)cam.yaw-=dt*1.2;limit();
    if(goal){goal.t+=dt;var k=ease(Math.min(1,goal.t/goal.dur)),a=goal.a,b=goal.b;
      cam.tx=a.tx+(b.tx-a.tx)*k;cam.tz=a.tz+(b.tz-a.tz)*k;cam.d=a.d+(b.d-a.d)*k;cam.yaw=a.yaw+(nearAngle(a.yaw,b.yaw)-a.yaw)*k;cam.pit=a.pit+(b.pit-a.pit)*k;if(goal.t>=goal.dur)goal=null}
    else if(tour){
      if(!tour.a){var wp=TOUR[tour.i%TOUR.length];tour.a={tx:cam.tx,tz:cam.tz,d:cam.d,yaw:cam.yaw,pit:cam.pit};tour.b=wp;tour.t=0;tour.dur=6}
      tour.t+=dt;var kk=ease(Math.min(1,tour.t/tour.dur)),A=tour.a,Bb=tour.b;
      cam.tx=A.tx+(Bb.tx-A.tx)*kk;cam.tz=A.tz+(Bb.tz-A.tz)*kk;cam.d=A.d+(Bb.d-A.d)*kk;cam.yaw=A.yaw+(nearAngle(A.yaw,Bb.yaw)-A.yaw)*kk;cam.pit=A.pit+(Bb.pit-A.pit)*kk;
      if(tour.t>=tour.dur+1.2){tour.i++;tour.a=null}}
    else if(!RM&&!sel&&performance.now()-lastInput>9000)auto=true;
    if(auto&&!goal&&!tour)cam.yaw+=dt*.07;
    var cp=Math.cos(cam.pit);
    eye=[cam.tx+cam.d*Math.sin(cam.yaw)*cp,Math.max(1.6,cam.d*Math.sin(cam.pit)+ (cam.pit<.2?2:0)),cam.tz+cam.d*Math.cos(cam.yaw)*cp];
    var tgt=[cam.tx,Math.min(14,cam.d*.08)*(cam.pit<.3?1:0),cam.tz];
    var view=look(eye,tgt,[0,1,0]);VP=mul(persp(1.0,W/H,.5,900),view);
    var f=norm([tgt[0]-eye[0],tgt[1]-eye[1],tgt[2]-eye[2]]),r=norm(cross(f,[0,1,0])),u=cross(r,f);RIGHT=r;UPV=u;FWD=f;

    /* cielo */
    gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.useProgram(SP);
    var hp=proj(eye[0]+f[0]*1000+0,eye[1]*0,eye[2]+f[2]*1000);var hor=.5;
    if(hp){var rr=cv.getBoundingClientRect();hor=1-hp.y/rr.height}
    gl.uniform1f(SU.uHor,clamp(hor,-.5,1.5));gl.uniform1f(SU.uT,T);gl.uniform1f(SU.uAsp,W/H);gl.uniform3f(SU.uTop,.02,.015,.06);gl.uniform3f(SU.uHzc,.28,.07,.3);
    gl.bindBuffer(gl.ARRAY_BUFFER,SKY);gl.enableVertexAttribArray(0);gl.disableVertexAttribArray(1);gl.vertexAttribPointer(0,2,gl.FLOAT,false,8,0);gl.drawArrays(gl.TRIANGLE_FAN,0,4);
    gl.enableVertexAttribArray(1);gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.useProgram(P);gl.uniformMatrix4fv(U.uVP,false,VP);curG=null;setCommon();

    /* suelo */
    D(GROUND,yawM(cam.tx,0,cam.tz,1,1,1,0),[1,1,1],3);
    /* edificios (con descarte por distancia) */
    for(var i=0;i<B.length;i++){var b=B[i],dd=Math.hypot(b.x-eye[0],b.z-eye[2]);if(dd>CULL+b.h)continue;
      var tn=QCOL[b.q];
      D(CUBE,yawM(b.x,0,b.z,b.w,b.h,b.d,0),[b.w,b.h,b.d],0,{col:BASE[b.q],tint:tn,tint2:QTINT2[b.q],wx:b.sx,wy:b.sy,seed:b.seed,dens:b.dens});
      if(b.top)D(CUBE,yawM(b.x,b.h,b.z,b.top.w,b.top.h,b.top.d,0),[b.top.w,b.top.h,b.top.d],0,{col:BASE[b.q],tint:tn,tint2:QTINT2[b.q],wx:b.sx,wy:b.sy,seed:b.seed+9,dens:b.dens})}
    /* torres de interés */
    TOWERS.forEach(function(t,ti){
      var col=t.col,bs={col:[.07,.08,.13],tint:col,tint2:QTINT2[t.q],wx:.6,wy:.45,dens:.6},x=t.x,z=t.z,hot=(sel===t||hov===t);
      if(t.id==='inicio'){D(CUBE,yawM(x,0,z,13,70,13,0),[13,70,13],0,assign(bs,{seed:11}));D(CUBE,yawM(x,70,z,9,40,9,0),[9,40,9],0,assign(bs,{seed:12}));D(CUBE,yawM(x,110,z,4.5,22,4.5,0),[4.5,22,4.5],0,assign(bs,{seed:13}))}
      else if(t.id==='semestres'){D(CUBE,yawM(x,0,z,15,24,15,0),[15,24,15],0,assign(bs,{seed:21}));D(CUBE,yawM(x-4,24,z,7,48,7,0),[7,48,7],0,assign(bs,{seed:22}));D(CUBE,yawM(x+4,24,z+3,6,34,6,0),[6,34,6],0,assign(bs,{seed:23}));D(CUBE,yawM(x,72,z,3,12,3,0),[3,12,3],0,assign(bs,{seed:24}))}
      else if(t.id==='especial'){D(CUBE,yawM(x,0,z,16,6,16,0),[16,6,16],0,assign(bs,{seed:31}));D(CUBE,yawM(x,6,z,2,58,2,0),[2,58,2],0,assign(bs,{seed:32,dens:.9}));D(CUBE,yawM(x+7,0,z-5,5,12,5,0),[5,12,5],0,assign(bs,{seed:33}))}
      else{D(CUBE,yawM(x,0,z,10,50,10,0),[10,50,10],0,assign(bs,{seed:41}));D(CUBE,yawM(x,50,z,6,46,6,0),[6,46,6],0,assign(bs,{seed:42}));D(CUBE,yawM(x,96,z,3,12,3,0),[3,12,3],0,assign(bs,{seed:43}))}
    });
    /* ----- aditivo ----- */
    /* neón de los carteles de las torres + anillos */
    TOWERS.forEach(function(t,ti){
      var hot=(sel===t||hov===t),pu=.7+.3*Math.sin(T*2+ti*1.7);
      for(var k=0;k<3;k++){var yy=t.top*(.35+.25*k);D(CUBE,yawM(t.x,yy,t.z,(t.id==='inicio'?14:16)+k*.2,.35,(t.id==='inicio'?14:16)+k*.2,T*(.4+k*.2)*(k%2?-1:1)),[1,1,1],1,{col:t.col,add:true,al:(hot?1:.7)*pu,fl:1})}
      var bh=t.top;
      D(QUAD,bb(t.x,bh+40,t.z,hot?16:11,90,true),[1,1,1],4,{col:t.col,add:true,al:hot?.9:.55});
      D(QUAD,bb(t.x,bh+2,t.z,32,32),[1,1,1],2,{col:t.col,add:true,al:.5*pu});
    });
    /* monumento central */
    D(CUBE,yawM(0,6,0,3,3,3,T*.8),[1,1,1],1,{col:C3,add:true,al:.9});
    D(CUBE,yawM(0,16,0,5,.3,5,-T*.6),[1,1,1],1,{col:C1,add:true,al:.8});
    D(QUAD,bb(0,14,0,26,26),[1,1,1],2,{col:C3,add:true,al:.45+.15*Math.sin(T*2)});
    D(QUAD,bb(0,60,0,6,100,true),[1,1,1],4,{col:C3,add:true,al:.25});
    /* luces de calle y neones cercanos */
    for(i=0;i<LIGHTS.length;i++){var Ls=LIGHTS[i];if(Math.hypot(Ls.x-cam.tx,Ls.z-cam.tz)>cam.d*1.6+60)continue;D(QUAD,bb(Ls.x,7,Ls.z,5,5),[1,1,1],2,{col:QCOL[Ls.q],add:true,al:.55});}
    /* señales ocultas */
    GL.forEach(function(g,gi){var fd=found[g.id],pu=.5+.5*Math.sin(T*3+gi*2);
      D(CUBE,yawM(g.x,g.y,g.z,.9,.9,.9,T*2),[1,1,1],1,{col:fd?[.2,1,.5]:C2,add:true,al:fd?.5:.35+.55*pu});
      D(QUAD,bb(g.x,g.y+.4,g.z,fd?4:6,fd?4:6),[1,1,1],2,{col:fd?[.2,1,.5]:C2,add:true,al:fd?.25:.25+.35*pu})});
    /* tráfico terrestre */
    for(i=0;i<CARS.length;i++){var cr=CARS[i];cr.pos+=cr.v*dt*(RM?.2:1);if(cr.pos>135)cr.pos=-135;else if(cr.pos<-135)cr.pos=135;
      var x2=cr.ax?cr.pos:cr.fix,z2=cr.ax?cr.fix:cr.pos;
      if(Math.hypot(x2-cam.tx,z2-cam.tz)>cam.d*1.4+50)continue;
      var ang=cr.ax?(cr.v>0?-1.5708:1.5708):(cr.v>0?0:3.1416);
      D(CUBE,yawM(x2,.35,z2,1.5,.9,cr.len,ang+0),[1,1,1],1,{col:[.05,.06,.1]});
      var fx=cr.ax?Math.sign(cr.v)*cr.len*.5:0,fz=cr.ax?0:Math.sign(cr.v)*cr.len*.5;
      D(QUAD,bb(x2+fx,.8,z2+fz,4.2,4.2),[1,1,1],2,{col:[1,1,.85],add:true,al:.9});
      D(QUAD,bb(x2-fx,.8,z2-fz,3.6,3.6),[1,1,1],2,{col:cr.col,add:true,al:.8})}
    /* vehículos aéreos */
    for(i=0;i<AIR.length;i++){var ar=AIR[i];ar.pos+=ar.v*dt*(RM?.2:1);if(ar.pos>160)ar.pos=-160;else if(ar.pos<-160)ar.pos=160;
      var ax=ar.ax?ar.pos:ar.fix,az=ar.ax?ar.fix:ar.pos;if(Math.hypot(ax-cam.tx,az-cam.tz)>cam.d*2+100)continue;
      D(QUAD,bb(ax,ar.y,az,3.5,3.5),[1,1,1],2,{col:ar.col,add:true,al:.95});
      D(QUAD,bb(ax-(ar.ax?Math.sign(ar.v)*3:0),ar.y,az-(ar.ax?0:Math.sign(ar.v)*3),7,7),[1,1,1],2,{col:ar.col,add:true,al:.25})}
    /* resplandor del horizonte */
    gl.disable(gl.BLEND);gl.enable(gl.BLEND);

    overlay();
  }
  function assign(a,b){var o={};for(var k in a)o[k]=a[k];for(k in b)o[k]=b[k];return o}

  /* ---------- HTML superpuesto: etiquetas y HUD ---------- */
  var lab=document.createElement('div');lab.className='city-labels';box.appendChild(lab);
  var LB={};
  zones.forEach(function(z){
    var b=document.createElement('button');b.type='button';b.className='city-lbl';b.innerHTML='<b>'+z.name+'</b><small>'+z.tag+'</small>';
    b.addEventListener('click',function(){selectZone(z.id)});lab.appendChild(b);LB[z.id]=b});
  var hud=document.createElement('div');hud.className='city-hud';box.appendChild(hud);
  var hudT=0;
  function overlay(){
    TOWERS.forEach(function(t){var p=proj(t.x,t.top+6,t.z),b=LB[t.id];if(!b)return;
      if(!p||p.x<-60||p.y<-30){b.style.display='none';return}
      b.style.display='';b.style.transform='translate('+p.x.toFixed(0)+'px,'+p.y.toFixed(0)+'px) translate(-50%,-100%)';
      b.classList.toggle('on',sel===t);b.style.opacity=clamp(1.15-p.w/420,.35,1)});
    if(T-hudT>.25){hudT=T;
      var q=quad(cam.tx,cam.tz),nm=['CORPO PLAZA','WATSON','BADLANDS','PACIFICA'][q];
      hud.textContent='DISTRITO '+nm+'  ·  X '+cam.tx.toFixed(0)+' Z '+cam.tz.toFixed(0)+'  ·  ALT '+Math.max(0,eye[1]).toFixed(0)+'  ·  SEÑALES OCULTAS '+nFound()+'/'+GL.length+'  ·  '+Math.round(fpsA)+' FPS'+(scale<1?' (calidad adaptada)':'')}
  }
  cv.addEventListener('webglcontextlost',function(e){e.preventDefault();dead=true;if(opt.onLost)opt.onLost()});

  /* vista inicial */
  cam.yaw=.6;
  raf=requestAnimationFrame(frame);
  return {
    focus:function(id){selectZone(id)},
    zoom:function(f){cam.d=clamp(cam.d*f,10,280);stopAuto();goal=null},
    street:function(){var tx=Math.round(cam.tx/PITCH)*PITCH;flyTo({tx:tx,tz:cam.tz,d:18,yaw:Math.cos(cam.yaw)>=0?0:Math.PI,pit:.12},1.4)},
    aerial:function(){flyTo({tx:cam.tx,tz:cam.tz,d:200,yaw:cam.yaw,pit:.75},1.4)},
    tour:startTour,
    toggleAuto:function(){auto=!auto;if(auto){tour=null;goal=null}return auto},
    clearSel:function(){sel=null},
    found:nFound,
    destroy:function(){dead=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);try{var x=gl.getExtension('WEBGL_lose_context');if(x)x.loseContext()}catch(e){}
      if(cv.parentNode)cv.parentNode.removeChild(cv);if(lab.parentNode)lab.parentNode.removeChild(lab);if(hud.parentNode)hud.parentNode.removeChild(hud)}
  };
}
return {create:create};
})();
