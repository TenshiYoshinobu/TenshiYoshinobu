/* =====================================================================
   MINIJUEGOS DE HACKEO  //  DSA_HACK.run(contenedor,{type,level,onDone})
   Tipos: route (reconstruir ruta), packets (análisis de paquetes),
          memory (patrón de memoria), decrypt (descifrado). Nivel 1-5.
   ===================================================================== */
window.DSA_HACK=(function(){
'use strict';
function rnd(n){return Math.random()*n|0}
function pick(a){return a[rnd(a.length)]}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=rnd(i+1),t=a[i];a[i]=a[j];a[j]=t}return a}
var TITLES={route:'RECONSTRUIR RUTA',packets:'ANÁLISIS DE PAQUETES',memory:'PATRÓN DE MEMORIA',decrypt:'DESCIFRADO'};

function run(box,o){
  var type=o.type||'route',lv=Math.max(1,Math.min(5,o.level||1)),done=false,timers=[],fx=o.fx||function(){};
  box.innerHTML='';
  var root=el('div','hk');
  var hd=el('div','hk-h');hd.innerHTML='<b>'+TITLES[type]+'</b><span>NIVEL '+'★★★★★'.slice(0,lv)+'☆☆☆☆☆'.slice(0,5-lv)+'</span>';
  var tm=el('div','hk-t'),tbar=el('i');tm.appendChild(tbar);
  var info=el('p','hk-i'),body=el('div','hk-b'),msg=el('div','hk-m');
  var ab=el('button','btn alt hk-x','ABORTAR');ab.type='button';
  root.appendChild(hd);root.appendChild(tm);root.appendChild(info);root.appendChild(body);root.appendChild(msg);root.appendChild(ab);box.appendChild(root);
  function finish(ok,txt){
    if(done)return;done=true;timers.forEach(clearInterval);
    msg.className='hk-m '+(ok?'ok':'bad');msg.textContent=txt||(ok?'ACCESO CONCEDIDO':'ACCESO DENEGADO');fx(ok?'ok':'err');
    body.classList.add('end');ab.hidden=true;
    setTimeout(function(){if(o.onDone)o.onDone(ok)},ok?900:1100);
  }
  ab.addEventListener('click',function(){finish(false,'CONEXIÓN ABORTADA')});
  var total=0,left=0;
  function timer(sec){total=left=sec;tbar.style.width='100%';timers.push(setInterval(function(){left-=.1;tbar.style.width=Math.max(0,left/total*100)+'%';tm.classList.toggle('low',left<total*.25);if(left<=0)finish(false,'TIEMPO AGOTADO')},100))}
  ({route:route,packets:packets,memory:memory,decrypt:decrypt})[type]();

  /* ----- 1. reconstruir ruta: gira las piezas para unir ORIGEN y DESTINO ----- */
  function route(){
    var n=Math.min(6,3+Math.ceil(lv/1.4)),N=1,E=2,S=4,W=8,DX={1:0,2:1,4:0,8:-1},DY={1:-1,2:0,4:1,8:0},OPP={1:4,2:8,4:1,8:2};
    info.textContent='Pulsa las piezas para girarlas. Conecta el ORIGEN (izquierda) con el DESTINO (derecha) antes de que se acabe el tiempo.';
    var path=[],seen={},tries=0;
    (function gen(){ /* camino aleatorio que no se cruza: de (0,0) a (n-1,n-1) */
      path=[[0,0]];seen={'0,0':1};
      var x=0,y=0;
      while(!(x===n-1&&y===n-1)&&tries<400){tries++;
        var opts=[];[[1,0],[0,1],[-1,0],[0,-1]].forEach(function(d){var nx=x+d[0],ny=y+d[1];if(nx>=0&&ny>=0&&nx<n&&ny<n&&!seen[nx+','+ny])opts.push([nx,ny,d])});
        if(!opts.length){path=[[0,0]];seen={'0,0':1};x=0;y=0;continue}
        opts.sort(function(a,b){return (Math.abs(a[0]-(n-1))+Math.abs(a[1]-(n-1)))-(Math.abs(b[0]-(n-1))+Math.abs(b[1]-(n-1)))+(Math.random()-.5)*3});
        var c=opts[0];x=c[0];y=c[1];seen[x+','+y]=1;path.push([x,y]);
      }
    })();
    var grid=[],i,j;for(j=0;j<n;j++){grid.push([]);for(i=0;i<n;i++)grid[j].push(0)}
    function dirOf(a,b){var dx=b[0]-a[0],dy=b[1]-a[1];return dx===1?E:dx===-1?W:dy===1?S:N}
    path.forEach(function(p,k){var m=0;m|=(k===0)?W:dirOf(p,path[k-1]);m|=(k===path.length-1)?E:dirOf(p,path[k+1]);grid[p[1]][p[0]]=m});
    var STR=[5,10,N|E,E|S,S|W,W|N];
    for(j=0;j<n;j++)for(i=0;i<n;i++)if(!grid[j][i])grid[j][i]=pick(STR);
    function rot(m){return ((m<<1)&15)|(m>>3)}
    for(j=0;j<n;j++)for(i=0;i<n;i++){var r=1+rnd(3);while(r--)grid[j][i]=rot(grid[j][i])}
    var wrap=el('div','hk-grid');wrap.style.setProperty('--n',n);var cells=[];
    body.appendChild(wrap);
    var so=el('span','hk-tag','ORIGEN ▸'),de=el('span','hk-tag r','▸ DESTINO');
    body.insertBefore(so,wrap);body.appendChild(de);
    function pipe(m){
      var s='<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="4" fill="currentColor"/>';
      if(m&N)s+='<rect x="17" y="0" width="6" height="21" fill="currentColor"/>';if(m&E)s+='<rect x="19" y="17" width="21" height="6" fill="currentColor"/>';
      if(m&S)s+='<rect x="17" y="19" width="6" height="21" fill="currentColor"/>';if(m&W)s+='<rect x="0" y="17" width="21" height="6" fill="currentColor"/>';
      return s+'</svg>'}
    function flow(){ /* BFS desde el origen */
      var ok={},q=[[0,0]],hit=false;if(!(grid[0][0]&W))return ok;
      ok['0,0']=1;
      while(q.length){var c=q.pop();[N,E,S,W].forEach(function(d){
        if(!(grid[c[1]][c[0]]&d))return;var nx=c[0]+DX[d],ny=c[1]+DY[d];
        if(nx<0||ny<0||nx>=n||ny>=n||ok[nx+','+ny])return;if(grid[ny][nx]&OPP[d]){ok[nx+','+ny]=1;q.push([nx,ny])}})}
      return ok}
    function paint(){
      var ok=flow();
      for(j=0;j<n;j++)for(i=0;i<n;i++){var c=cells[j][i];c.innerHTML=pipe(grid[j][i]);c.classList.toggle('on',!!ok[i+','+j])}
      if(ok[(n-1)+','+(n-1)]&&(grid[n-1][n-1]&E))finish(true,'RUTA RECONSTRUIDA // ACCESO CONCEDIDO');
    }
    for(j=0;j<n;j++){cells.push([]);for(i=0;i<n;i++)(function(i,j){
      var b=el('button','hk-cell');b.type='button';b.setAttribute('aria-label','Pieza '+(i+1)+','+(j+1)+', girar');
      b.addEventListener('click',function(){if(done)return;grid[j][i]=rot(grid[j][i]);fx('key');paint()});
      wrap.appendChild(b);cells[j].push(b)})(i,j)}
    paint();timer(Math.max(25,70-lv*8));
  }

  /* ----- 2. análisis de paquetes: señala el paquete sospechoso ----- */
  function packets(){
    var rules=[
      {t:'Un equipo interno abre una conexión hacia el puerto 4444 de una IP externa (típico de una shell inversa). Marca ese paquete.',
       bad:function(){return {src:'192.168.1.'+(20+rnd(80)),dst:'185.220.'+rnd(200)+'.'+rnd(250),pr:'TCP',pt:4444,inf:'SYN → conexión saliente'}}},
      {t:'Alguien usa un servicio SIN cifrar para administrar un equipo (Telnet). Marca el paquete.',
       bad:function(){return {src:'192.168.1.'+(10+rnd(30)),dst:'192.168.1.1',pr:'TCP',pt:23,inf:'Telnet: usuario/contraseña en texto plano'}}},
      {t:'Una IP externa intenta adivinar la contraseña de SSH muchas veces. Marca el paquete con el intento de fuerza bruta.',
       bad:function(){return {src:'45.'+rnd(200)+'.'+rnd(250)+'.'+rnd(250),dst:'192.168.1.5',pr:'TCP',pt:22,inf:'SSH: 38 intentos fallidos en 10 s'}}},
      {t:'Un DNS devuelve una respuesta anormalmente enorme a un equipo que no la pidió (amplificación). Marca el paquete.',
       bad:function(){return {src:'8.8.'+rnd(250)+'.'+rnd(250),dst:'192.168.1.'+(40+rnd(40)),pr:'UDP',pt:53,inf:'DNS respuesta 4096 B sin consulta previa'}}}
    ];
    var rule=rules[Math.min(rules.length-1,Math.max(0,lv-1+rnd(2)-(lv>3?0:0)))];if(lv<=2)rule=rules[rnd(2)];
    info.textContent=rule.t;
    var rows=[],N=6+lv*2,i;
    var norm=[
      function(){return {src:'192.168.1.'+(10+rnd(80)),dst:'142.250.'+rnd(200)+'.'+rnd(250),pr:'TCP',pt:443,inf:'TLS datos cifrados'}},
      function(){return {src:'192.168.1.'+(10+rnd(80)),dst:'192.168.1.1',pr:'UDP',pt:53,inf:'DNS consulta A'}},
      function(){return {src:'192.168.1.'+(10+rnd(80)),dst:'52.'+rnd(200)+'.'+rnd(250)+'.'+rnd(250),pr:'TCP',pt:443,inf:'TLS handshake'}},
      function(){return {src:'192.168.1.'+(10+rnd(30)),dst:'192.168.1.5',pr:'TCP',pt:22,inf:'SSH sesión normal (clave pública)'}},
      function(){return {src:'192.168.1.1',dst:'192.168.1.'+(10+rnd(80)),pr:'UDP',pt:123,inf:'NTP sincronización'}},
      function(){return {src:'192.168.1.'+(10+rnd(80)),dst:'93.184.216.34',pr:'TCP',pt:80,inf:'HTTP GET /index.html'}}
    ];
    for(i=0;i<N-1;i++)rows.push(pick(norm)());
    var bad=rule.bad();bad.bad=true;rows.splice(rnd(N),0,bad);
    var tb=el('div','hk-tbl');tb.innerHTML='<div class="hk-r hd"><span>#</span><span>ORIGEN</span><span>DESTINO</span><span>PROTO</span><span>PUERTO</span><span>INFO</span></div>';
    var lives=2+(lv<3?1:0);
    rows.forEach(function(r,k){
      var b=el('button','hk-r');b.type='button';
      b.innerHTML='<span>'+(k+1)+'</span><span>'+r.src+'</span><span>'+r.dst+'</span><span>'+r.pr+'</span><span>'+r.pt+'</span><span>'+r.inf+'</span>';
      b.addEventListener('click',function(){
        if(done||b.disabled)return;
        if(r.bad){b.classList.add('ok');finish(true,'AMENAZA AISLADA // ACCESO CONCEDIDO')}
        else{b.classList.add('bad');b.disabled=true;lives--;fx('err');msg.className='hk-m bad';msg.textContent='Ese es tráfico normal. Intentos: '+lives;if(lives<=0)finish(false,'ALERTA FALLIDA // TRAZA PERDIDA')}
      });tb.appendChild(b)});
    body.appendChild(tb);timer(35+N*3);
  }

  /* ----- 3. patrón de memoria: repite la secuencia de bloques ----- */
  function memory(){
    var len=3+lv,seq=[],play=false,pos=0,lives=lv<3?2:1;
    info.textContent='Memoriza la secuencia de bloques iluminados y repítela en el mismo orden.';
    var HEX=['A1','B7','C3','D9','E5','F2','1D','2E','3F','4A','5B','6C','7D','8E','9F','0A'];
    var g=el('div','hk-mem'),cells=[];
    HEX.forEach(function(h,i){var b=el('button','hk-mc',h);b.type='button';b.disabled=true;b.addEventListener('click',function(){press(i)});g.appendChild(b);cells.push(b)});
    body.appendChild(g);var st=el('div','hk-st','OBSERVA…');body.appendChild(st);
    for(var k=0;k<len;k++)seq.push(rnd(16));
    function flash(i,ms){cells[i].classList.add('lit');setTimeout(function(){cells[i].classList.remove('lit')},ms)}
    function show(){
      play=true;pos=0;st.textContent='OBSERVA…';cells.forEach(function(c){c.disabled=true});
      var t=0,ms=Math.max(280,620-lv*60);
      seq.forEach(function(s,k){setTimeout(function(){if(done)return;flash(s,ms*.7);fx('key')},700+k*ms)});
      setTimeout(function(){if(done)return;play=false;st.textContent='TU TURNO';cells.forEach(function(c){c.disabled=false})},700+seq.length*ms);
    }
    function press(i){
      if(done||play)return;flash(i,200);
      if(i===seq[pos]){pos++;fx('click');if(pos>=seq.length)finish(true,'PATRÓN CORRECTO // ACCESO CONCEDIDO')}
      else{lives--;fx('err');if(lives<0)finish(false,'PATRÓN INCORRECTO');else{st.textContent='ERROR. Repite desde el principio.';setTimeout(show,900)}}
    }
    show();timer(30+len*7);
  }

  /* ----- 4. descifrado: mueve el desplazamiento hasta que el texto tenga sentido ----- */
  function decrypt(){
    var PL=['EL SERVIDOR ESTA SEGURO','LA COPIA DE SEGURIDAD EXISTE','NUNCA REUTILICES CONTRASENAS','ACTUALIZA TU SISTEMA HOY','CIFRA TODO LO IMPORTANTE','EL FIREWALL VIGILA LA RED'];
    var plain=pick(PL),sh=3+rnd(20),rev=lv>=4,txt=plain;
    function enc(s,k){return s.replace(/[A-Z]/g,function(c){return String.fromCharCode((c.charCodeAt(0)-65+k)%26+65)})}
    function dec(s,k){return enc(s,(26-k)%26)}
    var cipher=enc(plain,sh);if(rev)cipher=cipher.split('').reverse().join('');
    info.textContent=rev?'El texto está cifrado con César Y escrito del revés. Ajusta el desplazamiento y pulsa INVERTIR.':'Mensaje cifrado con César. Mueve el deslizador hasta que el texto tenga sentido y pulsa DESCIFRAR.';
    var c1=el('div','hk-cipher',cipher),out=el('div','hk-out'),sl=el('input');sl.type='range';sl.min=0;sl.max=25;sl.value=0;sl.setAttribute('aria-label','Desplazamiento');
    var lab=el('div','hk-lab','DESPLAZAMIENTO: 0'),flip=false;
    function draw(){var v=+sl.value,t=dec(cipher,v);if(flip)t=t.split('').reverse().join('');out.textContent=t;lab.textContent='DESPLAZAMIENTO: '+v}
    sl.addEventListener('input',function(){fx('key');draw()});
    body.appendChild(c1);body.appendChild(sl);body.appendChild(lab);body.appendChild(out);
    var row=el('div','hk-row');
    if(rev){var iv=el('button','btn alt','INVERTIR');iv.type='button';iv.addEventListener('click',function(){flip=!flip;fx('click');draw()});row.appendChild(iv)}
    var go=el('button','btn','DESCIFRAR');go.type='button';
    var lives=2;
    go.addEventListener('click',function(){if(done)return;if(out.textContent===plain)finish(true,'MENSAJE DESCIFRADO');else{lives--;fx('err');msg.className='hk-m bad';msg.textContent='Eso no tiene sentido. Intentos: '+Math.max(0,lives);if(lives<=0)finish(false,'DESCIFRADO FALLIDO')}});
    row.appendChild(go);body.appendChild(row);draw();timer(45+lv*5);
  }
  return {destroy:function(){done=true;timers.forEach(clearInterval);box.innerHTML=''}};
}
return {run:run,types:['route','packets','memory','decrypt']};
})();
