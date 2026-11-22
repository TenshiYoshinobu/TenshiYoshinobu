/* =====================================================================
   SISTEMA DE SECRETOS  //  11 enigmas reales + 1 maestro
   Las respuestas se comprueban aquí, en tu navegador. El progreso se guarda en localStorage.
   Pistas repartidas por: mapa 3D (señales), textos de la web, CAPRI, teclado y logo.
   ===================================================================== */
window.DSA_SEC=(function(){
'use strict';
var api=null,found=[],clues={},asked={},KEY='dsa_sec_found',KEYC='dsa_sec_clues';
function N(s){return String(s).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9]/g,'')}

/* kind = tipo de enigma (se enseña); diff = dificultad 1-3; a = respuestas válidas; auto = se descubre con una acción */
var S=[
 {id:'cesar',n:'MENSAJE DEL EMPERADOR',kind:'CIFRADO CLÁSICO',diff:1,a:['NIGHTCITY'],reward:'skin:neon',
  lore:'Night City. Así se llama la ciudad que habitas. Los cuatro mensajes forman una cadena: sigue con el que habla en binario.',
  tips:['Una señal de los Badlands habla un idioma que ya usaba un emperador romano.','Cada letra se desplaza siempre el mismo número de pasos. Tres es tradición.','Mueve cada letra tres posiciones hacia atrás en el alfabeto.']},
 {id:'binario',n:'EL IDIOMA DE LAS MÁQUINAS',kind:'BINARIO',diff:1,a:['FIREWALL'],reward:'car:blanco',
  lore:'FIREWALL: la muralla que decide qué entra y qué sale. Detrás de ella hay puertas con número: pregunta a la caja fuerte cuáles.',
  tips:['En Pacifica, junto al muelle, un paquete solo conoce dos símbolos.','Agrupa de ocho en ocho. Cada grupo es una letra ASCII.','El primer grupo vale 70. ¿Qué letra es el 70 en ASCII?']},
 {id:'hex',n:'VOLCADO DE MEMORIA',kind:'HEXADECIMAL',diff:2,a:['CIFRADO'],reward:'skin:visor',
  lore:'CIFRADO: convertir un mensaje en algo ilegible sin la clave. Quien guarda la clave es quien te escucha.',
  tips:['En una azotea de Watson alguien dejó una memoria volcada, números con letras de la A a la F.','Base dieciséis: cada pareja de caracteres es un byte.','43 en hexadecimal es 67 en decimal. Busca el 67 en la tabla ASCII.']},
 {id:'morse',n:'VOZ DEL SIGLO XIX',kind:'MORSE',diff:2,a:['RAID'],reward:'car:rayas',
  lore:'RAID: varios discos trabajando como uno. Hay otros secretos que no se leen: se pulsan. Prueba con una secuencia clásica de videojuego.',
  tips:['El núcleo de la ciudad late con puntos y rayas.','Un punto es corto; una raya es larga. Las letras se separan con espacios.','.- es la primera letra del alfabeto.']},
 {id:'coord',n:'DONDE ESTÁ EL SERVIDOR',kind:'COORDENADAS',diff:2,a:['MADRID'],reward:'money:500',
  lore:'La ciudad real y la ficticia se parecen más de lo que crees.',
  tips:['En el Apartado Especial hay una referencia geográfica en letra pequeña.','Latitud y longitud señalan una ciudad. La latitud es positiva en el hemisferio norte.','Es una capital europea, con oso y madroño.']},
 {id:'rot13',n:'ETIQUETA DE COPIA',kind:'ROT13',diff:2,a:['BACKUP'],reward:'money:700',
  lore:'BACKUP. La regla 3-2-1 existe por una razón. El último fragmento cifrado necesita una llave con nombre propio.',
  tips:['Mira el pie de la base de datos académica: hay un identificador raro.','Es un cifrado que se deshace aplicándolo dos veces. Rotación de la mitad del alfabeto.','Trece posiciones. La O pasa a ser B.']},
 {id:'vigenere',n:'FRAGMENTO CON LLAVE',kind:'VIGENÈRE',diff:3,a:['SECRETO'],reward:'skin:gold',
  lore:'SECRETO. Pero hay uno más que no está escrito en ningún sitio: pregúntale a CAPRI por la palabra que solo existe mientras nadie la dice.',
  tips:['En los Personal Logs hay un fragmento largo que no es un César. Necesita una palabra clave.','La llave está más cerca de lo que parece: es el nombre de quien te atiende.','Cinco letras que se repiten sobre el texto. Cada una te dice cuánto desplazar.']},
 {id:'safe',n:'LA CAJA FUERTE',kind:'ACCIÓN',diff:1,auto:true,a:[],reward:'money:300',
  lore:'Dos puertos para entrar. Ahora el mundo te espera.',tips:['Dos puertos que cualquier administrador conoce: uno para entrar por consola, otro para navegar seguro.','Piensa en SSH y HTTPS.']},
 {id:'konami',n:'EL CÓDIGO DE LOS 30 VIDAS',kind:'TECLADO',diff:2,auto:true,a:[],reward:'car:oro',
  lore:'Arriba, arriba, abajo, abajo… algunos secretos son de memoria muscular. Aún queda el logo.',
  tips:['Hay una secuencia que los jugadores de los 80 tecleaban sin pensar. Se hace con flechas.','Dos arriba, dos abajo, izquierda y derecha dos veces, y las dos últimas son letras.']},
 {id:'logo',n:'EL LOGO NO ES SOLO UN LOGO',kind:'CLIC',diff:2,auto:true,a:[],reward:'skin:logo',
  lore:'Siete toques: el número de capas del modelo OSI. Ya casi estás.',
  tips:['El logo de la esquina superior izquierda no se queja si lo tocas.','Tócalo tantas veces como capas tiene el modelo OSI.']},
 {id:'silencio',n:'ACERTIJO DE CAPRI',kind:'ACERTIJO',diff:3,a:['SILENCIO'],reward:'car:glass',
  lore:'Lo que se rompe al nombrarlo. Un buen secreto es, sobre todo, silencio.',
  tips:['CAPRI solo suelta su acertijo si le pides la palabra clave adecuada.','Prueba a pedirle "la palabra secreta" o "la contraseña maestra".']},
 {id:'master',n:'ARCHIVO COMPLETO',kind:'MAESTRO',diff:3,auto:true,hidden:true,a:[],reward:'car:master',
  lore:'Lo has descubierto todo. El archivo es tuyo.',tips:['Se abre solo al completar los otros once.']}
];
var BY={};S.forEach(function(s){BY[s.id]=s});
var REW={ /* texto de las recompensas */
 'skin:neon':'Chaqueta NEÓN para tu personaje','skin:visor':'Visor táctico','skin:gold':'Chaqueta DORADA','skin:logo':'Parche DSA',
 'car:blanco':'Pintura blanca perla','car:rayas':'Pintura con rayas de carreras','car:oro':'Pintura dorada','car:glass':'Pintura GLASS (cristal)','car:master':'Hiperdeportivo MASTER',
 'money:300':'+300 € en el modo libre','money:500':'+500 € en el modo libre','money:700':'+700 € en el modo libre'};

function load(){
  try{found=JSON.parse(api.store.get(KEY)||'[]')||[]}catch(e){found=[]}
  try{clues=JSON.parse(api.store.get(KEYC)||'{}')||{}}catch(e){clues={}}
}
function save(){api.store.set(KEY,JSON.stringify(found));api.store.set(KEYC,JSON.stringify(clues))}
function has(id){return found.indexOf(id)>=0}
function count(){return found.filter(function(i){return i!=='master'}).length}
function total(){return S.length-1}

function unlock(id,quiet){
  var s=BY[id];if(!s||has(id))return false;
  found.push(id);save();
  if(api.onUnlock)api.onUnlock(s,quiet);
  if(!quiet){api.fx('ok');api.log('SECRETO descubierto: '+s.n+' ('+count()+'/'+total()+')');toast(s)}
  if(count()>=total()&&!has('master'))setTimeout(function(){unlock('master')},1400);
  if(panel)drawPanel();
  return true;
}
function toast(s){
  var t=api.h('div','sec-toast');
  t.innerHTML='<b>★ SECRETO DESCUBIERTO</b><span>'+api.esc(s.n)+'</span><small>'+count()+' / '+total()+'</small>';
  t.style.top=(70+api.root.querySelectorAll('.sec-toast').length*70)+'px';api.root.appendChild(t);setTimeout(function(){t.classList.add('out')},3600);setTimeout(function(){t.remove()},4200);
}
function submit(raw){
  var c=N(raw);if(!c)return {ok:false,msg:'Escribe algo.'};
  for(var i=0;i<S.length;i++){var s=S[i];if(s.auto)continue;
    if(s.a.some(function(x){return N(x)===c})){
      if(has(s.id))return {ok:true,again:true,s:s,msg:'Ya lo habías descubierto.'};
      unlock(s.id);return {ok:true,s:s,msg:'Código correcto.'};
    }}
  api.fx('err');return {ok:false,msg:'Código incorrecto. Ese no abre nada… todavía.'};
}
function addClue(id,text){clues[id]=text;save();if(panel)drawPanel()}

/* ---------- panel ---------- */
var panel=null,boxEl=null;
function stars(n){var s='';for(var i=0;i<3;i++)s+=i<n?'★':'☆';return s}
function drawPanel(){
  if(!boxEl||!boxEl.isConnected){panel=null;return}
  var list=boxEl.querySelector('.sx-list'),cnt=boxEl.querySelector('.sx-count');
  cnt.innerHTML='DESCUBIERTOS <b>'+count()+'/'+total()+'</b>'+(has('master')?' · <span class="ok">ARCHIVO COMPLETO</span>':'');
  boxEl.querySelector('.sx-bar i').style.width=(count()/total()*100)+'%';
  list.innerHTML='';
  S.forEach(function(s,i){
    if(s.hidden&&!has(s.id))return;
    var d=has(s.id),r=api.h('div','sx-it'+(d?' on':''));
    var rw=REW[s.reward]||'';
    r.innerHTML='<span class="sx-n">'+(i+1<10?'0':'')+(i+1)+'</span><div><b>'+(d?api.esc(s.n):'??? ??? ???')+'</b><small>'+api.esc(s.kind)+' · '+stars(s.diff)+(s.auto?' · SE DESCUBRE HACIENDO ALGO':'')+'</small>'+
      (d?'<p>'+api.esc(s.lore)+'</p><em>RECOMPENSA: '+api.esc(rw)+'</em>':(clues[s.id]?'<p class="cl">'+api.esc(clues[s.id])+'</p>':''))+'</div>';
    list.appendChild(r);
  });
  var cl=boxEl.querySelector('.sx-sig'),sigs=Object.keys(clues).filter(function(k){return /^g\d$/.test(k)});
  cl.innerHTML=sigs.length?'<h4>SEÑALES RECUPERADAS</h4>'+sigs.sort().map(function(k){return '<p>'+api.esc(clues[k])+'</p>'}).join(''):'<h4>SEÑALES RECUPERADAS</h4><p class="mut">Ninguna todavía. Explora el MAPA 3D: hay luces amarillas escondidas.</p>';
}
function openPanel(){
  var box=api.h('div','');boxEl=box;panel=true;
  box.innerHTML='<div class="tp-head"><span class="tag">ARCHIVO CLASIFICADO</span><h2>SECRETOS DE NIGHT CITY</h2></div>'+
   '<p class="sx-intro">Hay enigmas repartidos por toda la web, el mapa 3D, CAPRI y el teclado. Cada uno tiene una respuesta real. Aquí solo ves cuántos llevas, no cuáles faltan.</p>'+
   '<div class="sx-count"></div><div class="bar sx-bar"><i></i></div>'+
   '<form class="sx-form" autocomplete="off"><input type="text" id="sxIn" placeholder="Introduce un código…" aria-label="Código secreto" maxlength="40"><button type="submit" class="btn">PROBAR</button></form><div class="sx-msg" id="sxMsg" aria-live="polite"></div>'+
   '<div class="sx-sig"></div><div class="sx-list"></div>';
  api.openModal(box,'sx-box');
  box.querySelector('form').addEventListener('submit',function(e){
    e.preventDefault();var inp=box.querySelector('#sxIn'),m=box.querySelector('#sxMsg'),r=submit(inp.value);
    m.className='sx-msg '+(r.ok?'ok':'bad');m.textContent=r.ok?(r.again?r.msg:'✔ '+r.s.n+' — '+r.s.lore):r.msg;
    if(r.ok)inp.value='';drawPanel();
  });
  drawPanel();
}

/* ---------- CAPRI: pistas ambiguas, nunca la solución ---------- */
var RIDDLE='Te doy un acertijo, choom, pero solo uno: «Soy lo que se rompe en cuanto me nombras. Cuanto más hablas, menos me tienes.» Si sabes qué soy, escríbelo en SECRETOS (arriba, el botón con la estrella).';
var KW=[
 {r:/(palabra|contrasena|clave)\s+(secreta|maestra|magica)|palabra clave|palabra magica/,f:function(){asked.silencio=1;return RIDDLE}},
 {r:/\bcesar\b|emperador|desplaz|rotar/,id:'cesar'},{r:/binario|\bbits?\b|ceros y unos|\bascii\b/,id:'binario'},
 {r:/hexadecimal|\bhex\b/,id:'hex'},{r:/morse|puntos y rayas/,id:'morse'},
 {r:/coordenadas|latitud|longitud|\bgps\b|donde esta el servidor/,id:'coord'},{r:/rot ?13|rotacion/,id:'rot13'},
 {r:/vigenere|\bllave\b|clave de cifrado/,id:'vigenere',key:true},
 {r:/konami|arriba arriba|truco|trampa/,id:'konami'},{r:/\blogo\b|osi|capas/,id:'logo'},
 {r:/acertijo|adivinanza/,id:'silencio'}
];
var GENERIC=/secreto|misterio|enigma|oculto|oculta|escondid|easter|huevo de pascua|que mas hay|algo mas/;
var ORDER=['cesar','binario','hex','morse','coord','rot13','vigenere','safe','konami','logo','silencio'];
function tip(id){
  var s=BY[id];if(!s)return '';
  asked[id]=(asked[id]||0)+1;var t=s.tips,i=Math.min(t.length-1,asked[id]-1);return t[i];
}
function capri(q){
  if(!api)return null;
  var n=' '+String(q).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ')+' ';
  for(var i=0;i<KW.length;i++){var k=KW[i];
    if(k.r.test(n)){
      if(k.f)return {t:k.f()};
      if(has(k.id))return {t:'Ese ya lo tienes en el bolsillo. Qué rápido, choom. Mira lo que te queda en SECRETOS.'};
      if(k.key)return {t:'La llave la lleva quien te atiende. No es ninguna contraseña tuya. '+tip(k.id)};
      return {t:pickTone()+tip(k.id)};
    }}
  if(GENERIC.test(n)){
    if(count()>=total())return {t:'Los tienes todos. Ya no me queda nada que insinuarte, solo envidia.'};
    var next=ORDER.filter(function(i){return !has(i)})[0];
    var intro=count()===0?'Secretos, dice. Yo no sé nada… pero mira el mapa 3D y las luces amarillas. ':'Quedan '+(total()-count())+' cosas por encontrar. No te diré cuáles. ';
    return {t:intro+tip(next)};
  }
  return null;
}
var TONES=['Te lo susurro solo una vez: ','Sin spoilers, pero: ','Si te lo digo, me cobran: ','Pista barata, no te acostumbres: '];
function pickTone(){return TONES[Math.random()*TONES.length|0]}

/* ---------- acciones: Konami y logo ---------- */
function actions(){
  var seq=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'],pos=0;
  document.addEventListener('keydown',function(e){
    if(!api.root.isConnected)return;
    var t=e.target&&e.target.tagName;if(t==='INPUT'||t==='TEXTAREA')return;
    var k=e.key.length===1?e.key.toLowerCase():e.key;
    pos=(k===seq[pos])?pos+1:(k===seq[0]?1:0);
    if(pos===seq.length){pos=0;if(!has('konami')){unlock('konami');api.fx('glitch')}}
  });
  var lg=api.root.querySelector('.logo'),n=0,tm=0;
  if(lg)lg.addEventListener('click',function(){n++;clearTimeout(tm);tm=setTimeout(function(){n=0},2500);api.fx('key');if(n>=7){n=0;if(!has('logo'))unlock('logo')}});
}
/* ---------- pistas visibles en la web (texto pequeño, sin explicación) ---------- */
function plant(){
  function note(secSel,html){var s=api.root.querySelector(secSel);if(!s)return;var p=api.h('p','sec-note');p.innerHTML=html;var a=s.querySelector('.sec-sub');if(a&&a.parentNode)a.parentNode.insertBefore(p,a.nextSibling);else s.insertBefore(p,s.firstChild)}
  note('[data-sec="especial"]','REF. GEO &nbsp;40.4168° N &nbsp;·&nbsp; 3.7038° O &nbsp;<span>// servidor de respaldo</span>');
  note('[data-sec="semestres"]','ID_COPIA: ONPXHC &nbsp;<span>// no es un nombre, es un recibo</span>');
  note('[data-sec="reflexion"]','FRAGMENTO_CIFRADO: UERIMVO &nbsp;<span>// con llave</span>');
}

return {
  init:function(a){api=a;load();plant();actions();if(count()>=total()&&!has('master'))unlock('master',true)},
  list:S,has:has,count:count,total:total,unlock:unlock,submit:submit,addClue:addClue,capri:capri,openPanel:openPanel,
  rewards:function(){return found.map(function(i){return BY[i]&&BY[i].reward}).filter(Boolean)},
  rewardText:function(k){return REW[k]||k},
  found:function(){return found.slice()}
};
})();
