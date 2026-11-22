/* =====================================================================
   ARCHIVE — Expediente: inventario, tablero de investigación, curiosidades
   y conversación ramificada de CAPRI. Se alimenta de DSA_SEC (secretos).
   Guarda en localStorage (clave dsa_arc) a través de api.store.
   ===================================================================== */
window.DSA_ARC=(function(){
'use strict';
var api=null,K='dsa_arc',st={items:{},cur:[],choices:{},talks:0,recent:[],spec:{}},box=null,tab='inv',seenN=0,timer=0;

/* ---------- catálogo de objetos (cada secreto deja uno) ---------- */
var CATS={doc:'Documentos clasificados',mem:'Fragmentos de memoria',dev:'Dispositivos',chip:'Chips de datos',enc:'Archivos cifrados',spe:'Objetos especiales',badge:'Insignias',col:'Coleccionables secretos'};
var RAR={com:['Común','#9aa7b5'],poc:['Poco común','#39ff88'],rar:['Raro','#3aa0ff'],epi:['Épico','#c264ff'],leg:['Legendario','#ffb020'],cla:['Clasificado','#ff3860']};
var ITEMS=[
 {id:'cesar',sec:'cesar',cat:'enc',rar:'rar',n:'Señal de los Badlands',place:'Mapa 3D · Badlands',d:'Una transmisión que repite cuatro palabras desplazadas. Alguien quería que la leyeran solo los que saben contar hacia atrás.',i:'Cifrado César: sustitución monoalfabética con desplazamiento fijo. Se rompe en minutos probando las 25 posibilidades.'},
 {id:'binario',sec:'binario',cat:'chip',rar:'poc',n:'Paquete de Pacifica',place:'Mapa 3D · Pacifica',d:'Un chip con cuadros de ocho bits. Cada grupo es un carácter.',i:'ASCII asigna un número a cada letra: 70 es la F. Un byte = 8 bits.'},
 {id:'hex',sec:'hex',cat:'mem',rar:'rar',n:'Volcado de Watson',place:'Mapa 3D · Watson',d:'Fragmento de memoria RAM copiado a mano en una azotea.',i:'Hexadecimal es base 16: cada par de dígitos representa un byte. Los analistas forenses leen volcados así.'},
 {id:'morse',sec:'morse',cat:'dev',rar:'poc',n:'Transmisor del Núcleo',place:'Mapa 3D · Centro',d:'Un emisor viejo que solo sabe pulsar puntos y rayas.',i:'El código Morse se usó en telegrafía desde 1840. Hoy sigue siendo un canal de emergencia.'},
 {id:'coord',sec:'coord',cat:'doc',rar:'epi',n:'Coordenadas del servidor',place:'Apartado Especial',d:'Una referencia geográfica en letra pequeña. Dos números y un hemisferio.',i:'La ubicación física de un servidor importa: leyes de protección de datos, latencia y riesgo físico.'},
 {id:'rot13',sec:'rot13',cat:'enc',rar:'poc',n:'Etiqueta de copia',place:'Semestres · base de datos',d:'Un identificador raro al pie de la página académica.',i:'ROT13 es un César de 13 posiciones: aplicarlo dos veces devuelve el original. No protege nada, solo oculta.'},
 {id:'vigenere',sec:'vigenere',cat:'doc',rar:'leg',n:'Fragmento con llave',place:'Reflexión · Personal Logs',d:'Un texto largo que no cede con un simple desplazamiento.',i:'Vigenère usa una palabra clave para variar el desplazamiento letra a letra. Resistió siglos hasta el análisis de Kasiski.'},
 {id:'safe',sec:'safe',cat:'dev',rar:'poc',n:'Llave de la caja fuerte',place:'Inicio · caja fuerte',d:'Un código de dos puertos: uno para consola remota y otro para web cifrada.',i:'SSH (22) y HTTPS (443). Dos de los puertos que más se vigilan en cualquier cortafuegos.'},
 {id:'konami',sec:'konami',cat:'badge',rar:'epi',n:'Insignia de las 30 vidas',place:'Teclado',d:'Memoria muscular convertida en medalla.',i:'La secuencia nació en 1986 como truco de desarrollo y acabó siendo un huevo de Pascua universal.'},
 {id:'logo',sec:'logo',cat:'col',rar:'rar',n:'Parche DSA',place:'Cabecera · logo',d:'El logo escondía una puerta. Siete toques, siete capas.',i:'El modelo OSI tiene siete capas: física, enlace, red, transporte, sesión, presentación y aplicación.'},
 {id:'silencio',sec:'silencio',cat:'spe',rar:'epi',n:'La palabra que se rompe',place:'CAPRI',d:'No tiene forma. Solo existe mientras nadie la pronuncia.',i:'Un buen secreto, como una buena contraseña, se protege sobre todo no compartiéndolo.'},
 {id:'master',sec:'master',cat:'doc',rar:'cla',n:'Archivo completo DSA',place:'Todo Night City',d:'El expediente maestro. Contiene todo lo que has descubierto y lo que nadie te dijo.',i:'CLASIFICADO. Reservado a quien ha resuelto cada enigma de la ciudad.'}
];
/* chips por curiosidades leídas */
var CUR_ITEMS=[
 {id:'cur5',n:5,cat:'chip',rar:'com',n2:'Chip de curiosidades I',place:'Night City · ambiente',d:'Cinco datos sueltos que alguien dejó caer por la ciudad.',i:'Las curiosidades son cebo: algunas esconden pistas reales.'},
 {id:'cur10',n:10,cat:'mem',rar:'rar',n2:'Memoria de curiosidades II',place:'Night City · ambiente',d:'Diez fragmentos. Empieza a formarse un dibujo.',i:'Relaciona los datos: ninguna pista funciona sola.'}
];

/* ---------- curiosidades (algunas llevan pista real a un secreto) ---------- */
var CURS=[
 {t:'El primer virus de red, «Creeper» (1971), solo mostraba el mensaje «I\'m the creeper, catch me if you can».'},
 {t:'Julio César no usaba el desplazamiento de 3 por casualidad: era el que mejor recordaban sus oficiales.',clue:['cesar','Pista: el emperador desplazaba tres letras. Hay que deshacerlo hacia atrás.']},
 {t:'Un byte son 8 bits. Con 8 bits caben 256 combinaciones. Una letra mayúscula empieza en el 65.',clue:['binario','Pista: un byte son ocho bits. La A es 65, la F es 70.']},
 {t:'El 90 % de los ciberataques empieza con un correo. El eslabón más débil sigue siendo el humano.'},
 {t:'El Morse se transmitía con luz mucho antes de los ordenadores. Tres puntos, tres rayas, tres puntos: SOS.',clue:['morse','Pista: punto corto, raya larga. Las letras se separan con espacios.']},
 {t:'Una contraseña de 8 caracteres solo minúsculas cae en minutos. Una frase larga aguanta años.'},
 {t:'ROT13 aplicado dos veces te devuelve el texto original. Es un cifrado que se deshace a sí mismo.',clue:['rot13','Pista: trece posiciones. Aplícalo y vuelve a aplicarlo para comprobar.']},
 {t:'En Night City los netrunners nunca escriben su contraseña en notas pegadas al monitor. Casi nunca.'},
 {t:'La regla 3-2-1 de copias: tres copias, dos soportes distintos, una fuera de casa.'},
 {t:'Vigenère se llamó «el cifrado indescifrable» durante 300 años, hasta que alguien miró las repeticiones.',clue:['vigenere','Pista: el cifrado necesita una palabra clave. La llave tiene nombre propio y te escucha.']},
 {t:'La primera «contraseña» documentada fue un santo y seña de centinelas romanos.'},
 {t:'Un cortafuegos sin reglas bien pensadas es solo una puerta con luces bonitas.'},
 {t:'Dos puertos que casi todo administrador conoce: el que abre una consola remota y el que cifra la web.',clue:['safe','Pista: piensa en SSH y en HTTPS.']},
 {t:'El 7 es el número de capas del modelo OSI. A veces un logo también tiene siete capas.',clue:['logo','Pista: toca el logo tantas veces como capas tiene OSI.']}
];

/* ---------- estado ---------- */
function load(){try{var o=JSON.parse(api.store.get(K)||'{}')||{};for(var k in o)st[k]=o[k]}catch(e){}if(!st.items)st.items={};if(!st.cur)st.cur=[];if(!st.choices)st.choices={};if(!st.recent)st.recent=[];if(!st.spec)st.spec={}}
function save(){api.store.set(K,JSON.stringify(st))}
function fdate(iso){try{var d=new Date(iso);return d.toLocaleDateString('es-ES')+' '+d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})}catch(e){return iso}}
function itemById(id){for(var i=0;i<ITEMS.length;i++)if(ITEMS[i].id===id)return ITEMS[i];for(i=0;i<CUR_ITEMS.length;i++)if(CUR_ITEMS[i].id===id)return CUR_ITEMS[i];return null}
function give(id,quiet){
  if(st.items[id])return false;
  st.items[id]=new Date().toISOString();
  var it=itemById(id);if(it&&it.sec)st.recent.push(it.sec);
  save();if(!quiet)toast('NUEVO OBJETO',(it.n2||it.n),RAR[it.rar][0]);
  if(box&&box.isConnected)draw();
  return true;
}
function sync(){
  var f=(window.DSA_SEC&&DSA_SEC.found&&DSA_SEC.found())||[];
  f.forEach(function(s){ITEMS.forEach(function(it){if(it.sec===s)give(it.id,false)})});
}

/* ---------- aviso ---------- */
function toast(a,b,c){
  var t=api.h('div','arc-toast');
  t.innerHTML='<b>'+api.esc(a)+'</b><span>'+api.esc(b)+'</span><small>'+api.esc(c||'')+'</small>';
  (api.root||document.body).appendChild(t);
  setTimeout(function(){t.classList.add('out')},3600);setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t)},4400);
  try{api.fx('ok')}catch(e){}
}
function curiosity(){
  if(document.hidden||document.getElementById('modal')||document.getElementById('cityOv'))return;
  var left=[];CURS.forEach(function(c,i){if(st.cur.indexOf(i)<0)left.push(i)});
  if(!left.length)return;
  var i=left[Math.floor(Math.random()*left.length)],c=CURS[i];
  var t=api.h('button','arc-cur');t.type='button';
  t.innerHTML='<b>◈ DATO INTERCEPTADO</b><span>'+api.esc(c.t)+'</span><small>Toca para archivarlo</small>';
  (api.root||document.body).appendChild(t);
  var done=false;
  function end(){if(done)return;done=true;t.classList.add('out');setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t)},600)}
  t.addEventListener('click',function(){
    st.cur.push(i);
    if(c.clue&&window.DSA_SEC&&DSA_SEC.addClue&&!DSA_SEC.has(c.clue[0]))DSA_SEC.addClue(c.clue[0],c.clue[1]);
    CUR_ITEMS.forEach(function(ci){if(st.cur.length>=ci.n)give(ci.id,false)});
    save();api.fx('click');end();if(box&&box.isConnected)draw();
  });
  setTimeout(end,12000);
}
function schedule(){clearTimeout(timer);timer=setTimeout(function(){curiosity();schedule()},65000+Math.random()*50000)}

/* ---------- ventana ---------- */
function svgIcon(cat,col){
  var p={doc:'<path d="M8 4h10l6 6v18H8z M18 4v6h6 M11 15h10 M11 19h10 M11 23h7"/>',mem:'<rect x="6" y="9" width="20" height="14"/><path d="M10 9V5M15 9V5M20 9V5M10 23v4M15 23v4M20 23v4"/>',
   dev:'<rect x="8" y="5" width="16" height="22" rx="2"/><path d="M13 9h6M16 22v.5"/><circle cx="16" cy="16" r="3"/>',chip:'<rect x="9" y="9" width="14" height="14"/><path d="M6 12h3M6 16h3M6 20h3M23 12h3M23 16h3M23 20h3M12 6v3M16 6v3M20 6v3M12 23v3M16 23v3M20 23v3"/>',
   enc:'<rect x="7" y="14" width="18" height="13"/><path d="M11 14V10a5 5 0 0 1 10 0v4M16 19v4"/>',spe:'<path d="M16 3l3.5 9 9.5 .5-7.5 6 2.5 9.5L16 22.5 8 28l2.5-9.5L3 12.5 12.5 12z"/>',
   badge:'<circle cx="16" cy="13" r="8"/><path d="M11 20l-3 9 8-4 8 4-3-9M16 9v8M12 13h8"/>',col:'<path d="M16 4l11 6v12l-11 6-11-6V10z M16 4v24 M5 10l22 12 M27 10L5 22"/>'};
  return '<svg viewBox="0 0 32 32" fill="none" stroke="'+col+'" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">'+(p[cat]||p.doc)+'</svg>';
}
function open(t){
  sync();if(t)tab=t;
  box=api.h('div','arc');
  box.innerHTML='<div class="tp-head"><span class="tag">EXPEDIENTE PERSONAL</span><h2>NIGHT CITY // ARCHIVO</h2></div>'+
   '<div class="arc-tabs" role="tablist"><button type="button" class="arc-tab" data-t="inv">INVENTARIO</button><button type="button" class="arc-tab" data-t="board">TABLERO</button><button type="button" class="arc-tab" data-t="cur">CURIOSIDADES</button></div><div class="arc-body"></div>';
  api.openModal(box,'arc-box');
  Array.prototype.forEach.call(box.querySelectorAll('.arc-tab'),function(b){b.addEventListener('click',function(){tab=b.getAttribute('data-t');api.fx('click');draw()})});
  draw();
}
function draw(){
  if(!box||!box.isConnected)return;
  Array.prototype.forEach.call(box.querySelectorAll('.arc-tab'),function(b){b.classList.toggle('on',b.getAttribute('data-t')===tab);b.setAttribute('aria-selected',b.getAttribute('data-t')===tab)});
  var body=box.querySelector('.arc-body');body.innerHTML='';
  if(tab==='inv')drawInv(body);else if(tab==='board')drawBoard(body);else drawCur(body);
}
function drawInv(body){
  var all=ITEMS.concat(CUR_ITEMS),got=all.filter(function(i){return st.items[i.id]}).length;
  body.innerHTML='<div class="arc-sum">OBJETOS <b>'+got+'/'+all.length+'</b></div>';
  Object.keys(CATS).forEach(function(c){
    var list=all.filter(function(i){return i.cat===c});if(!list.length)return;
    var sec=api.h('div','arc-cat');sec.innerHTML='<h4>'+CATS[c]+'</h4>';
    var g=api.h('div','arc-grid');
    list.forEach(function(it){
      var own=!!st.items[it.id],col=RAR[it.rar][1];
      var b=api.h('button','arc-slot'+(own?' own':' empty'));b.type='button';
      b.style.setProperty('--rc',col);
      b.innerHTML=svgIcon(own?it.cat:'enc',own?col:'#4b5563')+'<span>'+(own?api.esc(it.n2||it.n):'? ? ?')+'</span><i>'+(own?RAR[it.rar][0]:'Sin descubrir')+'</i>';
      if(own)b.addEventListener('click',function(){inspect(it)});else b.disabled=true;
      g.appendChild(b);
    });
    sec.appendChild(g);body.appendChild(sec);
  });
}
function inspect(it){
  var col=RAR[it.rar][1],w=api.h('div','arc-insp');w.style.setProperty('--rc',col);
  w.innerHTML='<div class="arc-ph">'+svgIcon(it.cat,col)+'</div><div><span class="tag" style="color:'+col+'">'+RAR[it.rar][0].toUpperCase()+' · '+CATS[it.cat].toUpperCase()+'</span><h3>'+api.esc(it.n2||it.n)+'</h3>'+
   '<p>'+api.esc(it.d)+'</p><dl><dt>Descubierto en</dt><dd>'+api.esc(it.place)+'</dd><dt>Obtenido</dt><dd>'+api.esc(fdate(st.items[it.id]))+'</dd><dt>Información</dt><dd>'+api.esc(it.i)+'</dd></dl>'+
   '<button type="button" class="btn arc-back">VOLVER</button></div>';
  var body=box.querySelector('.arc-body');body.innerHTML='';body.appendChild(w);
  w.querySelector('.arc-back').addEventListener('click',function(){api.fx('click');draw()});
}

/* ---------- tablero de investigación ---------- */
var NODES={cesar:[12,14],binario:[38,10],safe:[64,14],hex:[14,48],morse:[40,44],konami:[66,48],coord:[88,30],rot13:[12,80],vigenere:[40,78],logo:[66,80],silencio:[90,62]};
var LINKS=[['cesar','binario'],['binario','safe'],['hex','morse'],['morse','konami'],['konami','logo'],['hex','vigenere'],['rot13','vigenere'],['vigenere','silencio'],['cesar','coord'],['safe','konami'],['coord','silencio']];
function drawBoard(body){
  var f=(window.DSA_SEC&&DSA_SEC.found&&DSA_SEC.found())||[],has=function(i){return f.indexOf(i)>=0};
  var wrap=api.h('div','arc-board'),svg='<svg class="arc-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">';
  LINKS.forEach(function(l){
    var a=NODES[l[0]],b=NODES[l[1]],both=has(l[0])&&has(l[1]),one=has(l[0])||has(l[1]);
    if(!one)return;
    svg+='<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" class="'+(both?'full':'half')+'" vector-effect="non-scaling-stroke"/>';
  });
  wrap.innerHTML=svg+'</svg>';
  ITEMS.forEach(function(it){
    var p=NODES[it.id];if(!p||it.id==='master')return;
    var n=api.h('div','arc-node'+(has(it.id)?' on':''));n.style.left=p[0]+'%';n.style.top=p[1]+'%';
    var found=has(it.id);
    n.innerHTML=found?'<i>'+svgIcon(it.cat,RAR[it.rar][1])+'</i><b>'+api.esc(it.n)+'</b>':'<i class="q">?</i><b>sin identificar</b>';
    wrap.appendChild(n);
  });
  body.innerHTML='<p class="arc-note">Los hilos aparecen cuando conectas pistas: un hilo continuo une dos secretos que ya has resuelto; uno discontinuo señala que el vecino aún falta.</p>';
  body.appendChild(wrap);
  var notes=api.h('div','arc-notes');
  notes.innerHTML='<label for="arcNote">NOTAS DEL CASO (se guardan en este navegador)</label><textarea id="arcNote" rows="3" maxlength="800" placeholder="Anota tus teorías…"></textarea>';
  var ta=notes.querySelector('textarea');ta.value=st.note||'';
  ta.addEventListener('input',function(){st.note=ta.value;save()});
  body.appendChild(notes);
}
function drawCur(body){
  var n=st.cur.length;
  body.innerHTML='<div class="arc-sum">DATOS ARCHIVADOS <b>'+n+'/'+CURS.length+'</b></div><p class="arc-note">Los datos aparecen de vez en cuando mientras navegas. Algunos esconden una pista real. Toca el aviso para archivarlo.</p>';
  var l=api.h('div','arc-curs');
  if(!n)l.innerHTML='<p class="mut">Todavía no has interceptado ninguno. Sigue navegando.</p>';
  st.cur.forEach(function(i){var c=CURS[i];if(!c)return;var d=api.h('div','arc-c'+(c.clue?' hint':''));d.innerHTML='<p>'+api.esc(c.t)+'</p>'+(c.clue?'<small>◈ contiene una pista (mira SECRETOS)</small>':'');l.appendChild(d)});
  body.appendChild(l);
}

/* ---------- CAPRI: respuestas especiales, memoria y diálogo ---------- */
function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
function special(q){
  var n=norm(q);
  if(/\blaura\b/.test(n)){st.spec.l=(st.spec.l||0)+1;save();return {t:st.spec.l===1?'Las de Miguel son mejores.':(st.spec.l<4?'Ya lo he dicho. Las de Miguel.':'Sigues con Laura. Qué constancia.')}}
  if(/kardashian/.test(n)){st.spec.k=(st.spec.k||0)+1;save();return {t:st.spec.k===1?'Colinas sagradas.':(st.spec.k<4?'Colinas sagradas. Repito por si acaso.':'Lo del apellido no me lo vas a sacar. Colinas sagradas.')}}
  return null;
}
function prog(){var c=(window.DSA_SEC&&DSA_SEC.count&&DSA_SEC.count())||0,t=(window.DSA_SEC&&DSA_SEC.total&&DSA_SEC.total())||11;return {c:c,t:t}}
function openingComment(){
  var r=st.recent.splice(0,3);if(!r.length)return null;save();
  var it=itemById(ITEMS.filter(function(i){return i.sec===r[r.length-1]})[0].id);
  return 'Vaya, has conseguido «'+it.n+'». No esperaba que llegaras tan lejos. Tampoco te lo voy a reconocer en voz alta.';
}
var D={
 root:function(){
  var p=prog(),t;
  if(!st.talks)t='Vaya, por fin alguien ha decidido conectarse. Ya estaba pensando que habías vendido tus implantes por unos cuantos eddies.';
  else if(p.c>=p.t)t='Otra vez tú. Lo has descubierto todo y aun así vuelves a hablar conmigo. Me halagas, aunque no lo diré.';
  else t='Otra vez por aquí. Llevas '+p.c+' de '+p.t+' secretos. ¿Qué quieres ahora?';
  st.talks++;save();
  return {t:t,o:[['¿Qué necesitas?','need'],['¿Tienes información?','info'],['¿Qué está pasando en Night City?','city'],['Necesito ayuda.','help'],['Déjame en paz.','leave']]};
 },
 need:{t:'Yo, nada. Eres tú quien tiene un portafolio que enseñar. Pero ya que preguntas: que cuentes a todos que existo, y que no toques la caja fuerte con pulgares.',o:[['¿Y qué gano yo?','gain'],['Volver','root']]},
 gain:{t:'Respeto. Y puede que alguna chaqueta de neón si te portas bien. Los secretos tienen recompensa.',o:[['Quiero ver mi progreso','progress'],['Volver','root']]},
 info:{t:'Información tengo mucha. Gratis, poca. Elige tema.',o:[['Temas del Semestre 1','topics'],['Cifrados','cipher'],['Algo curioso','fun'],['Volver','root']]},
 topics:{t:'Seguridad pasiva y activa, criptografía, copias, redes, cortafuegos, malware… Tienes once temas en SEMESTRES. Pregúntame por uno en concreto y te lo cuento sin florituras.',o:[['Ir a SEMESTRES','go:semestres'],['Volver','info']]},
 cipher:{t:'César, Morse, binario, hexadecimal, ROT13 y Vigenère. Están repartidos por el mapa 3D, la web y el teclado. No te digo dónde. Tampoco las soluciones.',o:[['Dame una pista suave','hint'],['Volver','info']]},
 hint:function(){
  var p=prog();
  if(p.c>=p.t)return {t:'No me queda nada que darte. Lo tienes todo. Qué envidia.',o:[['Volver','info']]};
  var o=ITEMS.filter(function(i){return i.sec!=='master'&&(!window.DSA_SEC||!DSA_SEC.has(i.sec))});
  var pick=o[Math.floor(Math.random()*o.length)];
  var h={cesar:'Un emperador cambiaba tres letras de sitio. Busca señales que suenen raro.',binario:'Hay un paquete que solo sabe dos símbolos. Mira cerca del agua.',hex:'Números con letras de la A a la F. Una azotea guarda una memoria.',morse:'Algo late con puntos y rayas en el centro de la ciudad.',coord:'Latitud y longitud, y una capital europea con oso.',rot13:'Pie de página. Un identificador que no parece de aquí.',vigenere:'Un texto largo, con llave. La llave está más cerca de lo que crees.',safe:'Dos puertos: uno para entrar por consola y otro para navegar seguro.',konami:'Una secuencia de los 80, con flechas.',logo:'El logo de arriba no se queja si lo tocas. Cuéntale capas.',silencio:'Pídeme la palabra secreta. Con tacto.'};
  return {t:h[pick.sec]||'Sigue explorando.',o:[['Otra pista','hint'],['Volver','info']]};
 },
 fun:function(){return {t:CURS[Math.floor(Math.random()*CURS.length)].t,o:[['Otra','fun'],['Volver','info']]}},
 city:{t:'Lo de siempre: megacorporaciones, netrunners vendiendo su alma por un parche y alguien dejando mensajes cifrados por toda la ciudad. Tú, de momento, solo miras.',o:[['¿Quién deja los mensajes?','who'],['¿Dónde puedo explorar?','where'],['Volver','root']]},
 who:{t:'No lo sé. O sí, pero no te lo voy a decir. Si lo supiera tendría que dejar de ser sarcástica y eso sería una pérdida.',o:[['Volver','city']]},
 where:{t:'El MAPA 3D tiene luces amarillas escondidas, y el MODO LIBRE te deja conducir, ganar pasta y evitar a la policía. Con mejor puntería de la que tienes.',o:[['Abrir mapa 3D','go:map'],['Abrir modo libre','go:free'],['Volver','city']]},
 help:{t:'Vale, en serio. ¿Con qué?',o:[['Con un tema del curso','topics'],['Con los secretos','cipher'],['Con el modo libre','free'],['Volver','root']]},
 free:{t:'Controles: WASD o flechas para moverte, Espacio para el freno, E para entrar o salir del coche, Esc para el menú. Haz clic dentro del juego primero o no oirá tus teclas.',o:[['Gracias','root']]},
 progress:function(){var p=prog(),n=Object.keys(st.items).length;return {t:'Llevas '+p.c+' de '+p.t+' secretos, '+n+' objetos en el inventario y '+st.cur.length+' datos archivados. '+(p.c===0?'Nada. Cero. Impresionante.':(p.c<p.t/2?'Vas por la mitad del camino de la mitad.':'No está mal para alguien con tus implantes.')),o:[['Abrir expediente','go:arc'],['Volver','root']]}},
 leave:{t:'Vale. Me quedo aquí flotando en la red, que es lo que hago siempre. Llámame cuando tengas hambre de secretos.',o:[['Colgar','end'],['Espera, vuelve','root']]}
};
function dialog(id){var n=D[id];if(!n)return null;n=(typeof n==='function')?n():n;st.choices[id]=(st.choices[id]||0)+1;save();return n}

return {
  init:function(a){api=a;load();sync();setInterval(sync,2500);schedule()},
  open:open,give:give,sync:sync,special:special,dialog:dialog,openingComment:openingComment,
  count:function(){return Object.keys(st.items).length}
};
})();
