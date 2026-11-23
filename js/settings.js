/* SETTINGS — panel de personalización estilo "cyberware" (pestañas A–F).
   Los ajustes de la página (A–E) viven aquí; los gráficos del juego (F) los gestiona DSA_GFX
   y son independientes. Todo se aplica en vivo (vista previa); GUARDAR lo conserva en este navegador. */
window.DSA_SET=(function(){
var KEY='dsa_prefs',ctx=null,S={},saved={},mm=null;
var THEMES={
 nightcity:['NIGHT CITY','Amarillo y negro'],edgerunners:['EDGERUNNERS','Magenta y cian'],arasaka:['ARASAKA','Rojo y negro'],
 afterlife:['AFTERLIFE','Violeta y azul eléctrico'],synthwave:['SYNTHWAVE','Rosa, violeta y cian'],toxic:['TOXIC','Verde ácido'],militech:['MILITECH','Azul acero']};
var ACC=[['','Según paleta'],['#fcee0a','Amarillo'],['#ff2a6d','Rosa'],['#00f0ff','Cian'],['#39ff88','Verde'],['#a66bff','Violeta'],['#ff8a00','Naranja'],['#ffffff','Blanco']];
var CURS={netrunner:['NETRUNNER','Cursor tecnológico'],combat:['COMBAT','Mira futurista'],hologram:['HOLOGRAM','Cursor holográfico']};
var CVAR={theme:['Color del tema','none'],white:['Blanco','grayscale(1) brightness(1.7)'],shift:['Cromático','hue-rotate(150deg)'],warm:['Cálido','hue-rotate(-50deg) saturate(1.3)']};
function sysRM(){return !!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)}
function defaults(){return {theme:'nightcity',accent:'',neon:1,glow:1,fx:1,pa:1,border:'cut',card:'holo',
 cursor:'netrunner',cvar:'theme',csize:1,canim:1,chover:'ring',hover:'lift',
 glitch:2,scan:1,interf:0,holo:0,part:1,amb:0,
 vol:50,ui:1,act:1,sound:1,
 spd:1,trans:'glitch',secfx:1,move:1,reduce:sysRM()?1:0}}
function load(){
  S=defaults();
  try{var sv=JSON.parse(ctx.store.get(KEY)||'null');if(sv){var D=defaults();for(var k in D)if(sv[k]!=null&&typeof sv[k]===typeof D[k])S[k]=sv[k];if(!THEMES[S.theme])S.theme='nightcity';if(!CURS[S.cursor])S.cursor='netrunner'}}catch(e){}
  saved=JSON.parse(JSON.stringify(S));
}
function hex2rgb(h){var n=parseInt(h.slice(1),16);return (n>>16)+','+((n>>8)&255)+','+(n&255)}
var ov={};
function overlay(c){if(!ov[c]){var d=document.createElement('div');d.className='fx-o fx-'+c;d.setAttribute('aria-hidden','true');ctx.root.appendChild(d);ov[c]=d}return ov[c]}
function apply(){
  var r=ctx.root,st=r.style,rm=!!S.reduce;
  r.setAttribute('data-theme',S.theme);
  if(S.accent){st.setProperty('--c1',S.accent);st.setProperty('--c1-rgb',hex2rgb(S.accent))}else{st.removeProperty('--c1');st.removeProperty('--c1-rgb')}
  st.setProperty('--neon',S.neon);st.setProperty('--glow',S.glow);st.setProperty('--fx',S.fx);st.setProperty('--pa',S.pa);
  st.setProperty('--sat',(.55+.45*S.neon).toFixed(2));st.setProperty('--spd',S.spd);
  r.toggleAttribute('data-adj',Math.abs(S.neon-1)>.02);
  r.toggleAttribute('data-pa',S.pa<.99);
  r.setAttribute('data-border',S.border);r.setAttribute('data-card',S.card);r.setAttribute('data-hover',S.hover);r.setAttribute('data-hv',S.chover);
  r.setAttribute('data-trans',S.trans);r.classList.toggle('rm',rm);
  /* cursor */
  r.setAttribute('data-cursor',S.cursor);ctx.cur.setAttribute('data-k',S.cursor);
  st.setProperty('--cur-f',CVAR[S.cvar]?CVAR[S.cvar][1]:'none');st.setProperty('--cur-s',S.csize);r.setAttribute('data-curanim',S.canim?'on':'off');
  /* efectos */
  var gl=[0,2.4,1,.45][S.glitch]||0;r.setAttribute('data-glitch',S.glitch?'on':'off');st.setProperty('--gl',gl||1);
  r.setAttribute('data-scan',S.scan>.02?'on':'off');st.setProperty('--scan',S.scan);
  st.setProperty('--int',S.interf);st.setProperty('--holo',S.holo);st.setProperty('--amb',S.amb);
  overlay('int');overlay('holo');overlay('amb');
  var rc=ctx.rain;if(rc){rc.hidden=S.part<.02||rm;rc.style.opacity=(.32*Math.min(S.part,1.5)).toFixed(3)}
  window.DSA_RAIN_SPEED=S.part>1?1.5:1;
  /* sonido */
  var Sn=ctx.Snd;Sn.vol(S.vol);var pv=document.getElementById('pVol');if(pv)pv.value=S.vol;
  Sn.cfg.ui=!!S.ui;Sn.cfg.act=!!S.act;Sn.setMuted(!S.sound);
  /* navegación */
  var M=window.DSA_MOTION;if(M){M.setRM(rm);M.cfg.sec=S.secfx?1:0;M.cfg.burst=S.secfx?1:0;M.cfg.reveal=S.secfx?1:0;M.cfg.spd=S.spd;M.cfg.par=S.move?1:0;M.cfg.mag=S.move?1:0;M.cfg.spot=S.move?1:0}
  ctx.onApply&&ctx.onApply(S,rm);
}
function persist(){saved=JSON.parse(JSON.stringify(S));ctx.store.set(KEY,JSON.stringify(S))}
function init(c){ctx=c;load();apply()}
function set(k,v){S[k]=v;apply()}

/* ---------- UI ---------- */
var TABS=[['A','Apariencia'],['B','Cursor'],['C','Efectos'],['D','Sonido'],['E','Navegación'],['F','Gráficos del juego']];
function h(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function open(){
  var box=h('div','st'),tab=0,dirty=false,done=false;
  var head=h('div','tp-head');head.innerHTML='<span class="tag">CYBERWARE // AJUSTES</span><h2>PERSONALIZACIÓN</h2>';
  var prev=h('div','st-prev');prev.innerHTML='<div class="st-pt"><span class="tag">VISTA PREVIA</span><b class="glitch" data-text="NIGHT CITY">NIGHT CITY</b><span class="chip"><b>CHIP</b> activo</span><span class="btn st-pb">BOTÓN</span></div><div class="st-pc card"><b>Tarjeta de ejemplo</b><small>Así se ve una tarjeta con tus ajustes.</small></div><div class="demo st-pd"><span class="cur-demo" data-k="'+S.cursor+'"></span></div>';
  var tabs=h('div','st-tabs');tabs.setAttribute('role','tablist');
  var body=h('div','st-body');
  var foot=h('div','st-foot');
  var bSave=h('button','btn','GUARDAR');bSave.type='button';
  var bRes=h('button','btn alt','RESTAURAR VALORES');bRes.type='button';
  var bCan=h('button','btn alt','DESCARTAR CAMBIOS');bCan.type='button';
  var note=h('span','st-note','Sin cambios pendientes');
  foot.appendChild(bSave);foot.appendChild(bCan);foot.appendChild(bRes);foot.appendChild(note);
  box.appendChild(head);box.appendChild(prev);box.appendChild(tabs);box.appendChild(body);box.appendChild(foot);
  var m=ctx.openModal(box,'st-modal');
  function mark(){dirty=JSON.stringify(S)!==JSON.stringify(saved);note.textContent=dirty?'Cambios sin guardar (vista previa activa)':'Sin cambios pendientes';note.classList.toggle('dirty',dirty);
    var pd=prev.querySelector('.cur-demo');if(pd)pd.setAttribute('data-k',S.cursor)}
  function ch(k,v,render){set(k,v);ctx.Snd.fx('click');mark();if(render)draw()}
  /* controles */
  function sect(t){body.appendChild(h('h3','eyebrow',t))}
  function range(k,l,min,max,step,fmt,render){
    var row=h('label','st-r');row.appendChild(h('span','',l));var i=h('input');i.type='range';i.min=min;i.max=max;i.step=step;i.value=S[k];
    var o=h('em','',fmt?fmt(S[k]):Math.round(S[k]*100)+'%');
    i.addEventListener('input',function(){set(k,+i.value);o.textContent=fmt?fmt(+i.value):Math.round(i.value*100)+'%';mark()});
    row.appendChild(i);row.appendChild(o);body.appendChild(row)}
  function sw(k,l,desc){var row=h('div','st-r');row.appendChild(h('span','',l));var b=h('button','st-sw');b.type='button';b.setAttribute('role','switch');b.setAttribute('aria-checked',String(!!S[k]));b.textContent=S[k]?'ON':'OFF';
    b.addEventListener('click',function(){ch(k,S[k]?0:1,true)});row.appendChild(b);if(desc)row.appendChild(h('small','',desc));body.appendChild(row)}
  function seg(k,l,opts,render){var row=h('div','st-r');row.appendChild(h('span','',l));var g=h('div','st-seg');
    opts.forEach(function(o){var b=h('button','',o[1]);b.type='button';b.setAttribute('aria-pressed',String(S[k]===o[0]));b.addEventListener('click',function(){ch(k,o[0],true)});g.appendChild(b)});row.appendChild(g);body.appendChild(row)}
  function cards(k,obj,sub){var g=h('div','opts');Object.keys(obj).forEach(function(id){var b=h('button','opt');b.type='button';b.setAttribute('aria-pressed',String(S[k]===id));if(k==='theme')b.setAttribute('data-theme',id);
      b.innerHTML=(k==='theme'?'<div class="sw"><i></i><i></i><i></i></div>':'<div class="demo"><span class="cur-demo" data-k="'+id+'"></span></div>')+'<b>'+obj[id][0]+'</b><small>'+obj[id][1]+'</small>';
      b.addEventListener('click',function(){ch(k,id,true)});g.appendChild(b)});body.appendChild(g)}
  function draw(){
    tabs.querySelectorAll('button').forEach(function(b,i){b.setAttribute('aria-selected',String(i===tab))});
    var sc=body.scrollTop;body.innerHTML='';
    if(tab===0){
      sect('PALETA');cards('theme',THEMES);
      sect('COLOR DE ACENTO');var ac=h('div','st-acc');ACC.forEach(function(a){var b=h('button','st-dot');b.type='button';b.title=a[1];b.setAttribute('aria-label','Acento: '+a[1]);b.setAttribute('aria-pressed',String(S.accent===a[0]));b.style.background=a[0]||'conic-gradient(#fcee0a,#ff2a6d,#00f0ff,#fcee0a)';b.addEventListener('click',function(){ch('accent',a[0],true)});ac.appendChild(b)});
      var ci=h('input');ci.type='color';ci.value=S.accent||'#fcee0a';ci.setAttribute('aria-label','Color de acento personalizado');ci.addEventListener('input',function(){set('accent',ci.value);mark()});ac.appendChild(ci);body.appendChild(ac);
      sect('INTENSIDAD');range('neon','Intensidad del neón (saturación y brillo)',.3,1.6,.05);range('glow','Resplandor (glow)',0,2,.05);range('fx','Intensidad de efectos visuales',0,1.5,.05);range('pa','Opacidad de los paneles',.45,1,.05);
      sect('ESTILO');seg('border','Bordes',[['cut','Corte'],['round','Redondeado'],['sharp','Recto'],['neon','Marco neón']]);seg('card','Tarjetas',[['holo','Holo'],['flat','Plano'],['glass','Cristal']]);
    }else if(tab===1){
      if(!ctx.FINE)body.appendChild(h('p','ph','Este dispositivo no tiene ratón: el cursor personalizado solo se ve con puntero fino. Puedes dejar tus preferencias guardadas igualmente.'));
      sect('TIPO DE CURSOR');cards('cursor',CURS);
      sect('VARIANTE Y TAMAÑO');seg('cvar','Color',Object.keys(CVAR).map(function(k){return [k,CVAR[k][0]]}));range('csize','Tamaño',.7,1.8,.05);
      sect('ANIMACIÓN Y HOVER');sw('canim','Cursor animado');seg('chover','Al pasar sobre botones',[['ring','Anillo'],['glow','Resplandor'],['none','Ninguno']]);seg('hover','Efecto hover de tarjetas',[['lift','Elevar'],['glow','Brillo'],['none','Ninguno']]);
    }else if(tab===2){
      sect('GLITCH E INTERFERENCIAS');seg('glitch','Glitch en títulos',[[0,'Apagado'],[1,'Suave'],[2,'Normal'],[3,'Intenso']]);range('scan','Líneas de escaneo',0,1.5,.05);range('interf','Interferencia / ruido de señal',0,1,.05);
      sect('HOLOGRAMA Y AMBIENTE');range('holo','Destello holográfico',0,1,.05);range('amb','Luz ambiental',0,1,.05);range('part','Lluvia digital (partículas)',0,1.5,.05);
      body.appendChild(h('p','st-hint','La intensidad general de efectos está en la pestaña A. Con "reducir movimiento" los efectos animados se desactivan.'));
    }else if(tab===3){
      sect('VOLUMEN Y ACTIVACIÓN');range('vol','Volumen general',0,100,1,function(v){return Math.round(v)+'%'});sw('sound','Sonido general');
      var st=ctx.Snd.state();var row=h('div','st-r');row.appendChild(h('span','','Música ambiente'));var mb=h('button','st-sw');mb.type='button';mb.setAttribute('aria-checked',String(st.playing));mb.textContent=st.playing?'ON':'OFF';mb.addEventListener('click',function(){ctx.Snd.setPlaying(!ctx.Snd.state().playing);ctx.Snd.fx('click');setTimeout(draw,60)});row.appendChild(mb);row.appendChild(h('small','','El navegador exige un clic para iniciar el audio, por eso la música no se guarda como activa.'));body.appendChild(row);
      sect('EFECTOS DE SONIDO');sw('ui','Sonidos de interfaz (clics)');sw('act','Sonidos de interacción (acciones, juego, hackeo)');
      var t=h('button','btn alt','PROBAR SONIDO');t.type='button';t.addEventListener('click',function(){ctx.Snd.fx('click');setTimeout(function(){ctx.Snd.fx('ok')},200)});body.appendChild(t);
    }else if(tab===4){
      sect('ANIMACIONES');range('spd','Velocidad de animación (mayor = más lenta)',.5,1.8,.05,function(v){return '×'+(+v).toFixed(2)});seg('trans','Transición entre secciones',[['glitch','Glitch'],['fade','Fundido'],['none','Ninguna']]);
      sect('EFECTOS');sw('secfx','Efectos de sección (banner, partículas, revelado)');sw('move','Movimiento con el ratón (paralaje, botones magnéticos, foco de luz)');
      sect('ACCESIBILIDAD');sw('reduce','Reducir movimiento','Apaga animaciones, lluvia digital y efectos de transición.');
    }else{
      body.appendChild(h('p','st-hint','Estos ajustes son del juego y del mapa 3D, no de la página. Se guardan al momento, de forma independiente.'));
      var host=h('div','st-gfx');body.appendChild(host);
      if(window.DSA_GFX)DSA_GFX.ui(host,function(){});else host.textContent='Módulo gráfico no disponible.';
    }
    body.scrollTop=sc;
  }
  TABS.forEach(function(t,i){var b=h('button','st-tab');b.type='button';b.setAttribute('role','tab');b.innerHTML='<b>'+t[0]+'</b> '+t[1];b.addEventListener('click',function(){tab=i;ctx.Snd.fx('click');draw()});tabs.appendChild(b)});
  bSave.addEventListener('click',function(){persist();mark();ctx.Snd.fx('ok');ctx.log&&ctx.log('Personalización guardada')});
  bCan.addEventListener('click',function(){S=JSON.parse(JSON.stringify(saved));apply();mark();ctx.Snd.fx('click');draw()});
  bRes.addEventListener('click',function(){S=defaults();apply();persist();mark();ctx.Snd.fx('ok');if(window.DSA_GFX)DSA_GFX.reset();ctx.log&&ctx.log('Valores originales restaurados');draw()});
  /* al cerrar sin guardar, se revierte la vista previa */
  var mo=new MutationObserver(function(){if(!ctx.root.contains(m)){mo.disconnect();if(JSON.stringify(S)!==JSON.stringify(saved)){S=JSON.parse(JSON.stringify(saved));apply();ctx.log&&ctx.log('Cambios sin guardar descartados')}}});
  mo.observe(ctx.root,{childList:true});
  draw();mark();
}
return {init:init,open:open,get:function(){return S}};
})();
