/* =====================================================================
   PERSONAJE  //  editor modular estilo Cyberpunk (retrato SVG generado por código)
   DSA_CHAR.svg(cfg,w)  DSA_CHAR.open(api,onDone)  DSA_CHAR.get()  DSA_CHAR.colors(cfg)
   ===================================================================== */
window.DSA_CHAR=(function(){
'use strict';
var SKIN=['#f6d5c0','#eab998','#d39a73','#b97a52','#8f5a3a','#6a4029','#4b2c1d','#cfe3e8'];
var HAIRC=['#0d0d12','#4a2c1a','#8a5a2b','#d9b66b','#e8e8ee','#ff2a6d','#00f0ff','#7c3cff','#39ff88','#ff8a00'];
var EYEC=['#2a1a10','#3b6ea5','#2e8b57','#b07a2a','#ff2a6d','#00f0ff','#c9c9d6','#ffe600'];
var JACKC=['#1a1d28','#7a1f2b','#1f4d7a','#2d5a3d','#555a6b','#e8e8ee','#6b3fa0','#ff8a00','#39ff88','#e8b923'];
var SHIRTC=['#e8e8ee','#101018','#c0213c','#12a9b8','#0a0a0f'];
var DEF={body:1,skin:2,face:0,eyes:0,eyeC:1,nose:0,mouth:0,ears:0,hair:0,hairC:0,jacket:0,jackC:0,shirt:1,acc:0,tattoo:0,implant:0};
/* opciones bloqueadas por secretos: campo -> {índice: id del secreto} */
var LOCK={jackC:{8:'cesar',9:'vigenere'},acc:{2:'hex'},tattoo:{4:'logo'}};

var FIELDS=[
 {tab:'CUERPO',k:'body',l:'Complexión',names:['Delgado','Normal','Fornido']},
 {tab:'CUERPO',k:'skin',l:'Tono de piel',sw:SKIN},
 {tab:'CARA',k:'face',l:'Forma de la cara',names:['Ovalada','Cuadrada','Estrecha','Redonda']},
 {tab:'CARA',k:'eyes',l:'Ojos',names:['Redondos','Rasgados','Anime','Ciber','Cansados','Grandes']},
 {tab:'CARA',k:'eyeC',l:'Color de ojos',sw:EYEC},
 {tab:'CARA',k:'nose',l:'Nariz',names:['Recta','Aguileña','Chata','Ancha']},
 {tab:'CARA',k:'mouth',l:'Boca',names:['Neutra','Sonrisa','Mueca','Abierta']},
 {tab:'CARA',k:'ears',l:'Orejas',names:['Normales','Élficas','Ciber-puerto']},
 {tab:'PELO',k:'hair',l:'Peinado',names:['Pinchos','Largo','Cresta','Bob','Rapado','Coleta','Rizado','Calvo']},
 {tab:'PELO',k:'hairC',l:'Color de pelo',sw:HAIRC},
 {tab:'ROPA',k:'jacket',l:'Chaqueta',names:['Bomber','Gabardina','Chaleco','Sudadera','Blindada','Kimono']},
 {tab:'ROPA',k:'jackC',l:'Color de chaqueta',sw:JACKC},
 {tab:'ROPA',k:'shirt',l:'Camiseta',sw:SHIRTC},
 {tab:'EXTRAS',k:'acc',l:'Accesorio',names:['Ninguno','Gafas','Visor táctico','Máscara','Pendiente','Auricular']},
 {tab:'EXTRAS',k:'tattoo',l:'Tatuaje',names:['Ninguno','Línea facial','Cuello tribal','Código de barras','Parche DSA']},
 {tab:'EXTRAS',k:'implant',l:'Implante',names:['Ninguno','Circuito','Placa sien','Anillo ocular','Placa mandíbula']}
];

function get(){try{var o=JSON.parse(localStorage.getItem('dsa_char')||'null');if(o)return fix(o)}catch(e){}return fix({})}
function fix(o){var c={};for(var k in DEF)c[k]=(typeof o[k]==='number')?o[k]:DEF[k];return c}
function put(c){try{localStorage.setItem('dsa_char',JSON.stringify(c))}catch(e){}}
function colors(c){return {skin:SKIN[c.skin],hair:HAIRC[c.hairC],jacket:JACKC[c.jackC],eye:EYEC[c.eyeC]}}

/* ---------- dibujo ---------- */
var HEAD=[
 'M100 38C130 38 142 62 142 92C142 130 124 158 100 158C76 158 58 130 58 92C58 62 70 38 100 38Z',
 'M64 52Q100 34 136 52L142 100Q140 148 100 158Q60 148 58 100Z',
 'M100 36C124 38 136 62 134 96C132 136 116 160 100 164C84 160 68 136 66 96C64 62 76 38 100 36Z',
 'M100 42C138 42 148 76 146 100C144 138 124 158 100 158C76 158 56 138 54 100C52 76 62 42 100 42Z'];
function shade(hex,k){var n=parseInt(hex.slice(1),16),r=Math.max(0,Math.min(255,(n>>16)*k)),g=Math.max(0,Math.min(255,((n>>8)&255)*k)),b=Math.max(0,Math.min(255,(n&255)*k));return 'rgb('+(r|0)+','+(g|0)+','+(b|0)+')'}
function eye(cx,cy,t,col,m){
  var s=m?-1:1,o='';
  var sc='#f4f4f8';
  if(t===0)o='<ellipse cx="'+cx+'" cy="'+cy+'" rx="8" ry="6.5" fill="'+sc+'"/><circle cx="'+cx+'" cy="'+cy+'" r="4.2" fill="'+col+'"/><circle cx="'+cx+'" cy="'+cy+'" r="1.8" fill="#000"/><circle cx="'+(cx-1.6)+'" cy="'+(cy-1.8)+'" r="1.2" fill="#fff"/>';
  else if(t===1)o='<path d="M'+(cx-9)+' '+cy+'Q'+cx+' '+(cy-8)+' '+(cx+9)+' '+(cy-1)+'Q'+cx+' '+(cy+5)+' '+(cx-9)+' '+cy+'Z" fill="'+sc+'"/><circle cx="'+cx+'" cy="'+(cy-1)+'" r="3.8" fill="'+col+'"/><circle cx="'+cx+'" cy="'+(cy-1)+'" r="1.6" fill="#000"/>';
  else if(t===2)o='<ellipse cx="'+cx+'" cy="'+cy+'" rx="8.5" ry="10.5" fill="'+sc+'"/><ellipse cx="'+cx+'" cy="'+(cy+.5)+'" rx="6" ry="8.2" fill="'+col+'"/><ellipse cx="'+cx+'" cy="'+(cy+1)+'" rx="2.8" ry="4.6" fill="#000"/><circle cx="'+(cx-2.4)+'" cy="'+(cy-3.4)+'" r="2.4" fill="#fff"/><circle cx="'+(cx+2.2)+'" cy="'+(cy+4)+'" r="1.1" fill="#fff"/><path d="M'+(cx-9.5)+' '+(cy-6)+'Q'+cx+' '+(cy-13)+' '+(cx+9.5)+' '+(cy-6)+'" stroke="#000" stroke-width="2.6" fill="none"/>';
  else if(t===3)o='<rect x="'+(cx-9)+'" y="'+(cy-3.5)+'" width="18" height="7" rx="3" fill="#05070c"/><rect x="'+(cx-7)+'" y="'+(cy-1.4)+'" width="14" height="2.8" rx="1.4" fill="'+col+'" style="filter:drop-shadow(0 0 3px '+col+')"/><circle cx="'+(cx+s*3)+'" cy="'+cy+'" r="1.6" fill="#fff"/>';
  else if(t===4)o='<ellipse cx="'+cx+'" cy="'+cy+'" rx="8" ry="6" fill="'+sc+'"/><circle cx="'+cx+'" cy="'+(cy+1)+'" r="4" fill="'+col+'"/><circle cx="'+cx+'" cy="'+(cy+1)+'" r="1.7" fill="#000"/><path d="M'+(cx-9)+' '+(cy-.5)+'Q'+cx+' '+(cy-4)+' '+(cx+9)+' '+(cy-.5)+'L'+(cx+9)+' '+(cy-8)+'L'+(cx-9)+' '+(cy-8)+'Z" fill="rgba(0,0,0,.28)"/><path d="M'+(cx-9)+' '+(cy-.5)+'Q'+cx+' '+(cy-4)+' '+(cx+9)+' '+(cy-.5)+'" stroke="#000" stroke-width="1.6" fill="none"/>';
  else o='<ellipse cx="'+cx+'" cy="'+cy+'" rx="10" ry="7.5" fill="'+sc+'"/><circle cx="'+cx+'" cy="'+cy+'" r="5" fill="'+col+'"/><circle cx="'+cx+'" cy="'+cy+'" r="2.1" fill="#000"/><circle cx="'+(cx-2)+'" cy="'+(cy-2)+'" r="1.4" fill="#fff"/>';
  return o+(t===3?'':'<path d="M'+(cx-11)+' '+(cy-12)+'Q'+cx+' '+(cy-16)+' '+(cx+11)+' '+(cy-12)+'" stroke="rgba(0,0,0,.55)" stroke-width="2.6" fill="none" stroke-linecap="round"/>');
}
function hairBack(i,c){
  if(i===1)return '<path d="M52 96C46 150 50 200 44 236L156 236C150 200 154 150 148 96Z" fill="'+c+'"/>';
  if(i===3)return '<path d="M54 90C48 130 56 156 62 164L138 164C144 156 152 130 146 90Z" fill="'+c+'"/>';
  if(i===5)return '<path d="M142 70C176 74 184 130 160 176C168 130 156 100 140 96Z" fill="'+c+'"/>';
  if(i===6)return '<g fill="'+c+'"><circle cx="56" cy="80" r="16"/><circle cx="144" cy="80" r="16"/><circle cx="48" cy="104" r="14"/><circle cx="152" cy="104" r="14"/></g>';
  return '';
}
function hairFront(i,c){
  var d=shade(c,.7);
  if(i===0)return '<path d="M56 86C52 56 68 34 100 32C132 34 148 56 144 86C140 66 132 60 126 56L120 44L112 58L100 40L90 58L80 44L74 56C66 62 60 70 56 86Z" fill="'+c+'"/>';
  if(i===1)return '<path d="M54 92C50 54 68 32 100 32C132 32 150 54 146 92C142 70 130 56 112 54C100 66 76 64 62 76C58 80 56 86 54 92Z" fill="'+c+'"/>';
  if(i===2)return '<path d="M88 44L92 12L100 28L108 8L112 44C108 56 92 56 88 44Z" fill="'+c+'"/><path d="M56 86C58 64 70 54 86 50L86 62C74 66 64 74 56 86Z" fill="'+d+'" opacity=".6"/><path d="M144 86C142 64 130 54 114 50L114 62C126 66 136 74 144 86Z" fill="'+d+'" opacity=".6"/>';
  if(i===3)return '<path d="M52 100C46 52 66 30 100 30C134 30 154 52 148 100C146 84 138 72 128 66C112 76 88 76 72 66C62 72 54 84 52 100Z" fill="'+c+'"/>';
  if(i===4)return '<path d="M58 80C60 52 78 40 100 40C122 40 140 52 142 80C132 64 118 58 100 58C82 58 68 64 58 80Z" fill="'+c+'" opacity=".85"/>';
  if(i===5)return '<path d="M56 88C52 52 70 34 100 34C130 34 148 52 144 88C138 66 124 58 100 58C76 58 62 66 56 88Z" fill="'+c+'"/>';
  if(i===6)return '<g fill="'+c+'"><circle cx="70" cy="52" r="15"/><circle cx="92" cy="40" r="16"/><circle cx="116" cy="40" r="16"/><circle cx="136" cy="54" r="15"/><circle cx="100" cy="52" r="14"/><circle cx="62" cy="72" r="11"/><circle cx="142" cy="72" r="11"/></g>';
  return '';
}
function jacket(i,col,body,shirt){
  var w=[56,70,84][body],x0=100-w,x1=100+w,dk=shade(col,.62),lt=shade(col,1.35),o='';
  /* torso */
  o+='<path d="M'+(x0-6)+' 262L'+(x0-2)+' 200Q'+(x0+4)+' 172 78 166L122 166Q'+(x1-4)+' 172 '+(x1+2)+' 200L'+(x1+6)+' 262Z" fill="'+col+'"/>';
  o+='<path d="M86 166L100 204L114 166Z" fill="'+shirt+'"/>';
  if(i===0){o+='<path d="M'+(x0-2)+' 200Q'+(x0+4)+' 172 78 166L88 172L100 262L'+(x0-6)+' 262Z" fill="'+dk+'" opacity=".5"/><path d="M100 204L100 262" stroke="'+lt+'" stroke-width="2"/><rect x="'+(x0+6)+'" y="236" width="'+(2*w-12)+'" height="8" fill="'+dk+'"/><path d="M78 166Q100 180 122 166L122 176Q100 190 78 176Z" fill="'+dk+'"/>'}
  else if(i===1){o+='<path d="M70 150L84 168L100 204L116 168L130 150L142 170L124 214L100 262L76 214L58 170Z" fill="'+dk+'"/><path d="M100 204L100 262" stroke="'+lt+'" stroke-width="2"/><circle cx="92" cy="226" r="2.4" fill="'+lt+'"/><circle cx="108" cy="226" r="2.4" fill="'+lt+'"/>'}
  else if(i===2){o+='<ellipse cx="'+(x0-2)+'" cy="196" rx="20" ry="12" fill="'+dk+'"/><ellipse cx="'+(x1+2)+'" cy="196" rx="20" ry="12" fill="'+dk+'"/><path d="M84 168L100 238L116 168" fill="none" stroke="'+lt+'" stroke-width="3"/>'}
  else if(i===3){o+='<path d="M60 168Q100 214 140 168L132 150Q100 196 68 150Z" fill="'+dk+'"/><path d="M92 196L92 226M108 196L108 226" stroke="'+lt+'" stroke-width="2.4"/><rect x="80" y="232" width="40" height="18" rx="4" fill="'+dk+'"/>'}
  else if(i===4){o+='<path d="M'+(x0)+' 190L78 172L100 200L122 172L'+(x1)+' 190L'+(x1)+' 214L100 240L'+x0+' 214Z" fill="'+dk+'"/><path d="M'+(x0+4)+' 200L96 232M'+(x1-4)+' 200L104 232" stroke="var(--c3)" stroke-width="2.4" style="filter:drop-shadow(0 0 3px var(--c3))"/><rect x="'+(x0-8)+'" y="176" width="26" height="14" rx="4" fill="'+lt+'" opacity=".6"/><rect x="'+(x1-18)+'" y="176" width="26" height="14" rx="4" fill="'+lt+'" opacity=".6"/>'}
  else{o+='<path d="M68 166L100 262L132 166L120 166L100 214L80 166Z" fill="'+dk+'"/><path d="M80 166L100 214L120 166" fill="none" stroke="'+lt+'" stroke-width="2"/><path d="M'+(x0+6)+' 232L'+(x1-6)+' 232" stroke="'+lt+'" stroke-width="5" opacity=".7"/>'}
  return o;
}
function svg(c,w){
  c=fix(c||{});var skin=SKIN[c.skin],hc=HAIRC[c.hairC],ec=EYEC[c.eyeC],jc=JACKC[c.jackC],sh=SHIRTC[c.shirt],sd=shade(skin,.82),o='';
  var neon='var(--c3)',pink='var(--c1)';
  o+=hairBack(c.hair,hc);
  /* cuello */
  o+='<rect x="84" y="140" width="32" height="34" fill="'+sd+'"/>';
  o+=jacket(c.jacket,jc,c.body,sh);
  if(c.tattoo===2)o+='<path d="M86 156l6 8-6 6M114 156l-6 8 6 6M92 150l8 10 8-10" stroke="'+neon+'" stroke-width="2" fill="none" opacity=".9"/>';
  if(c.tattoo===4)o+='<text x="'+(c.body===0?58:c.body===1?46:36)+'" y="198" font-family="Orbitron,Arial Black,sans-serif" font-weight="900" font-size="12" fill="'+pink+'">DSA</text>';
  /* orejas */
  if(c.ears===1)o+='<path d="M58 92L38 70L60 108Z M142 92L162 70L140 108Z" fill="'+skin+'"/>';
  else o+='<ellipse cx="58" cy="104" rx="7" ry="12" fill="'+skin+'"/><ellipse cx="142" cy="104" rx="7" ry="12" fill="'+skin+'"/>';
  if(c.ears===2)o+='<circle cx="57" cy="104" r="5" fill="#0a0a10" stroke="'+neon+'" stroke-width="1.6"/><circle cx="143" cy="104" r="5" fill="#0a0a10" stroke="'+neon+'" stroke-width="1.6"/><circle cx="57" cy="104" r="1.8" fill="'+neon+'"/><circle cx="143" cy="104" r="1.8" fill="'+neon+'"/>';
  /* cabeza */
  o+='<path d="'+HEAD[c.face]+'" fill="'+skin+'"/><path d="'+HEAD[c.face]+'" fill="url(#shd)" opacity=".5"/>';
  /* mejillas */
  o+='<ellipse cx="74" cy="122" rx="9" ry="5" fill="#ff7a8a" opacity=".16"/><ellipse cx="126" cy="122" rx="9" ry="5" fill="#ff7a8a" opacity=".16"/>';
  /* implantes y tatuajes en la cara */
  if(c.implant===1)o+='<path d="M120 112h14l4 6h-8M126 122h10M132 104l8-4" stroke="'+neon+'" stroke-width="1.6" fill="none" style="filter:drop-shadow(0 0 3px '+neon+')"/><circle cx="134" cy="112" r="1.8" fill="'+neon+'"/>';
  if(c.implant===2)o+='<path d="M60 80L74 74L78 96L64 100Z" fill="#14161f" stroke="'+neon+'" stroke-width="1.4"/><circle cx="68" cy="87" r="2" fill="'+pink+'"/>';
  if(c.implant===4)o+='<path d="M64 128L80 146L100 152L120 146L136 128" stroke="'+neon+'" stroke-width="3" fill="none" opacity=".9" style="filter:drop-shadow(0 0 3px '+neon+')"/>';
  if(c.tattoo===1)o+='<path d="M70 104l24 -12M72 112l22 -10" stroke="'+pink+'" stroke-width="2" opacity=".85"/>';
  if(c.tattoo===3)o+='<g stroke="'+neon+'" stroke-width="1.4" opacity=".9"><path d="M122 110v14M125 110v14M128 110v14M132 110v14M135 110v14"/></g>';
  /* ojos */
  o+=eye(82,96,c.eyes,ec,false)+eye(118,96,c.eyes,ec,true);
  if(c.implant===3)o+='<circle cx="118" cy="96" r="13" fill="none" stroke="'+neon+'" stroke-width="2.2" style="filter:drop-shadow(0 0 4px '+neon+')"/><circle cx="118" cy="96" r="13" fill="none" stroke="'+pink+'" stroke-width="1" stroke-dasharray="3 5"/>';
  /* nariz */
  var N=[['M100 100q-4 12 -1 16','M96 118q4 3 8 0'],['M100 100l-5 16h10','M95 116q5 3 10 0'],['M96 114q4 4 8 0','M95 110q5 -4 10 0'],['M92 116q8 6 16 0','M93 112q7 -6 14 0']][c.nose];
  o+='<path d="'+N[0]+'" stroke="'+shade(skin,.6)+'" stroke-width="2" fill="none" stroke-linecap="round"/><path d="'+N[1]+'" stroke="'+shade(skin,.6)+'" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
  /* boca */
  var M=['<path d="M88 136Q100 139 112 136" stroke="#7a2a3a" stroke-width="2.6" fill="none" stroke-linecap="round"/>','<path d="M86 134Q100 148 114 134" stroke="#7a2a3a" stroke-width="2.6" fill="none" stroke-linecap="round"/>','<path d="M88 138Q100 136 114 130" stroke="#7a2a3a" stroke-width="2.6" fill="none" stroke-linecap="round"/>','<path d="M86 132Q100 152 114 132Z" fill="#4a1220"/><path d="M90 133h20" stroke="#fff" stroke-width="2.4"/>'][c.mouth];
  if(c.acc!==3)o+=M;
  /* accesorios */
  if(c.acc===1)o+='<g><rect x="66" y="86" width="30" height="20" rx="4" fill="rgba(10,12,20,.78)" stroke="'+pink+'" stroke-width="2"/><rect x="104" y="86" width="30" height="20" rx="4" fill="rgba(10,12,20,.78)" stroke="'+pink+'" stroke-width="2"/><path d="M96 94h8" stroke="'+pink+'" stroke-width="2.4"/><path d="M70 92l10 -2M108 92l10 -2" stroke="#fff" stroke-width="1.4" opacity=".6"/></g>';
  if(c.acc===2)o+='<g><path d="M56 84h88v20H56Z" fill="rgba(8,10,16,.88)" stroke="'+neon+'" stroke-width="2"/><rect x="62" y="91" width="76" height="6" rx="3" fill="'+neon+'" style="filter:drop-shadow(0 0 5px '+neon+')"><animate attributeName="opacity" values="1;.55;1" dur="1.8s" repeatCount="indefinite"/></rect></g>';
  if(c.acc===3)o+='<path d="M62 122Q100 118 138 122L132 148Q100 160 68 148Z" fill="#0b0d14" stroke="'+neon+'" stroke-width="1.8"/><path d="M82 132h36M82 138h36M82 144h36" stroke="'+neon+'" stroke-width="1.2" opacity=".7"/>';
  if(c.acc===4)o+='<circle cx="57" cy="118" r="3.4" fill="#ffd34d"/><circle cx="57" cy="126" r="3" fill="none" stroke="#ffd34d" stroke-width="1.6"/><circle cx="143" cy="118" r="3.4" fill="#ffd34d"/>';
  if(c.acc===5)o+='<path d="M56 100C50 44 150 44 144 100" fill="none" stroke="#14161f" stroke-width="6"/><rect x="46" y="94" width="14" height="26" rx="6" fill="#14161f" stroke="'+neon+'" stroke-width="1.6"/><rect x="140" y="94" width="14" height="26" rx="6" fill="#14161f" stroke="'+neon+'" stroke-width="1.6"/><path d="M52 120Q54 142 84 144" fill="none" stroke="#14161f" stroke-width="3"/><circle cx="86" cy="144" r="4" fill="'+pink+'"/>';
  /* pelo delante */
  o+=hairFront(c.hair,hc);
  var wd=w||200;
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 20 160 244" width="'+wd+'" height="'+Math.round(wd*244/160)+'" class="char-svg" role="img" aria-label="Retrato del personaje"><defs><radialGradient id="shd" cx=".5" cy=".4" r=".7"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient></defs>'+o+'</svg>';
}

/* ---------- editor ---------- */
function open(api,onDone){
  var cfg=get(),tabs=[],tab='CARA',h=api.h,esc=api.esc;
  FIELDS.forEach(function(f){if(tabs.indexOf(f.tab)<0)tabs.push(f.tab)});
  var box=h('div','');
  box.innerHTML='<div class="tp-head"><span class="tag">IDENTIDAD</span><h2>EDITOR DE PERSONAJE</h2></div><div class="ce"><div class="ce-pre" id="cePre"></div><div class="ce-ui"><div class="ce-tabs" role="tablist"></div><div class="ce-rows"></div><div class="ce-act"></div></div></div>';
  var pre=box.querySelector('#cePre'),tb=box.querySelector('.ce-tabs'),rows=box.querySelector('.ce-rows'),act=box.querySelector('.ce-act');
  function locked(k,i){var l=LOCK[k];return l&&l[i]&&!(window.DSA_SEC&&DSA_SEC.has(l[i]))?l[i]:null}
  function drawPre(){pre.innerHTML=svg(cfg,220)}
  function drawTabs(){
    tb.innerHTML='';
    tabs.forEach(function(t){var b=h('button','ce-tab'+(t===tab?' on':''),t);b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(t===tab));b.addEventListener('click',function(){tab=t;api.fx('click');drawTabs();drawRows()});tb.appendChild(b)});
  }
  function drawRows(){
    rows.innerHTML='';
    FIELDS.filter(function(f){return f.tab===tab}).forEach(function(f){
      var r=h('div','ce-row'),l=h('label','',f.l);r.appendChild(l);var g=h('div','ce-opts');
      var n=f.sw?f.sw.length:f.names.length;
      for(var i=0;i<n;i++)(function(i){
        var b=h('button','ce-o'+(cfg[f.k]===i?' on':''));b.type='button';
        var lk=locked(f.k,i);
        if(f.sw){b.classList.add('sw');b.style.background=f.sw[i];b.setAttribute('aria-label',f.l+' '+(i+1))}
        else b.textContent=f.names[i];
        if(lk){b.classList.add('locked');b.disabled=true;b.title='Bloqueado: descubre un secreto';if(!f.sw)b.textContent='🔒 '+f.names[i]}
        b.setAttribute('aria-pressed',String(cfg[f.k]===i));
        b.addEventListener('click',function(){cfg[f.k]=i;api.fx('key');drawPre();drawRows()});
        g.appendChild(b)})(i);
      r.appendChild(g);rows.appendChild(r);
    });
  }
  act.innerHTML='';
  var rnd=h('button','btn alt','ALEATORIO');rnd.type='button';
  rnd.addEventListener('click',function(){FIELDS.forEach(function(f){var n=f.sw?f.sw.length:f.names.length,v,t=0;do{v=Math.random()*n|0;t++}while(locked(f.k,v)&&t<20);cfg[f.k]=locked(f.k,v)?0:v});api.fx('glitch');drawPre();drawRows()});
  var ok=h('button','btn','GUARDAR PERSONAJE');ok.type='button';
  ok.addEventListener('click',function(){put(cfg);api.fx('ok');api.log('Personaje guardado');api.closeModal();if(onDone)onDone(cfg)});
  act.appendChild(rnd);act.appendChild(ok);
  drawPre();drawTabs();drawRows();
  api.openModal(box,'ce-box');
}
return {svg:svg,open:open,get:get,put:put,colors:colors,SKIN:SKIN,HAIRC:HAIRC,JACKC:JACKC};
})();
