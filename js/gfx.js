/* GFX — configuración gráfica del juego (mundo abierto 2D y mapa 3D).
   Guarda en localStorage (dsa_gfx). El juego lee DSA_GFX.get() en cada fotograma,
   así que los cambios se aplican al instante, también en mitad de la partida. */
window.DSA_GFX=(function(){
var KEY='dsa_gfx',listeners=[];
var PRE={
 low:{shadows:0,light:0,parts:.4,refl:0,dist:.8,tex:0,post:0,rain:0},
 med:{shadows:1,light:1,parts:.7,refl:0,dist:1,tex:1,post:1,rain:1},
 high:{shadows:1,light:1,parts:1,refl:1,dist:1.25,tex:2,post:2,rain:1}
};
var st={profile:'med'};
function copy(o,t){for(var k in o)t[k]=o[k];return t}
copy(PRE.med,st);
function lsGet(){try{return localStorage.getItem(KEY)}catch(e){return null}}
function lsSet(v){try{localStorage.setItem(KEY,v)}catch(e){}}
try{var sv=JSON.parse(lsGet()||'null');if(sv){if(PRE[sv.profile])st.profile=sv.profile;for(var k in PRE.med)if(typeof sv[k]==='number')st[k]=sv[k]}}catch(e){}
function emit(){lsSet(JSON.stringify(st));listeners.forEach(function(f){try{f(st)}catch(e){}})}
function preset(name){if(!PRE[name])return;st.profile=name;copy(PRE[name],st);emit()}
function set(k,v){st[k]=+v;st.profile='custom';emit()}
function reset(){preset('med')}
var OPTS=[
 ['shadows','Sombras','sw',['No','Sí']],
 ['light','Iluminación (luces y neones)','sw',['No','Sí']],
 ['parts','Partículas','rg',[.4,1,.1],'x'],
 ['refl','Reflejos en el asfalto','sw',['No','Sí']],
 ['dist','Distancia de dibujado','rg',[.7,1.4,.05],'x'],
 ['tex','Calidad de texturas','sel',['Baja','Media','Alta']],
 ['post','Postprocesado','sel',['Desactivado','Viñeta','Viñeta + bloom']],
 ['rain','Lluvia y clima','sw',['No','Sí']]
];
function ui(host,onChange){
  host.innerHTML='';
  var wrap=document.createElement('div');wrap.className='gfx-ui';
  var pr=document.createElement('div');pr.className='gfx-pre';
  [['low','BAJO'],['med','MEDIO'],['high','ALTO']].forEach(function(p){
    var b=document.createElement('button');b.type='button';b.className='gfx-b';b.textContent=p[1];b.setAttribute('aria-pressed',String(st.profile===p[0]));
    b.addEventListener('click',function(){preset(p[0]);ui(host,onChange);if(onChange)onChange()});pr.appendChild(b)});
  if(st.profile==='custom'){var c=document.createElement('span');c.className='gfx-cu';c.textContent='PERSONALIZADO';pr.appendChild(c)}
  wrap.appendChild(pr);
  OPTS.forEach(function(o){
    var row=document.createElement('label');row.className='gfx-r';
    var t=document.createElement('span');t.textContent=o[1];row.appendChild(t);
    var inp;
    if(o[2]==='rg'){inp=document.createElement('input');inp.type='range';inp.min=o[3][0];inp.max=o[3][1];inp.step=o[3][2];inp.value=st[o[0]];
      var out=document.createElement('em');out.textContent=Math.round(st[o[0]]*100)+'%';
      inp.addEventListener('input',function(){set(o[0],inp.value);out.textContent=Math.round(st[o[0]]*100)+'%';markCustom(wrap);if(onChange)onChange()});
      row.appendChild(inp);row.appendChild(out)}
    else{inp=document.createElement('select');
      var n=o[3].length;for(var i=0;i<n;i++){var op=document.createElement('option');op.value=i;op.textContent=o[3][i];inp.appendChild(op)}
      inp.value=st[o[0]];inp.addEventListener('change',function(){set(o[0],inp.value);markCustom(wrap);if(onChange)onChange()});row.appendChild(inp)}
    wrap.appendChild(row);
  });
  host.appendChild(wrap);
}
function markCustom(w){Array.prototype.forEach.call(w.querySelectorAll('.gfx-b'),function(b){b.setAttribute('aria-pressed','false')});if(!w.querySelector('.gfx-cu')){var c=document.createElement('span');c.className='gfx-cu';c.textContent='PERSONALIZADO';w.querySelector('.gfx-pre').appendChild(c)}}
return {get:function(){return st},preset:preset,set:set,reset:reset,ui:ui,on:function(f){listeners.push(f)}};
})();
