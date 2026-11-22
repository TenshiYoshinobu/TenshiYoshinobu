/* MOTION — capa de animación e interacción (no cambia contenido ni lógica):
   banner de acceso a módulo, foco de luz en tarjetas, partículas al pulsar,
   botones magnéticos, paralaje del fondo y descifrado de títulos al abrir paneles.
   Todo se desactiva con "reducir movimiento" y los efectos de cursor solo con ratón. */
window.DSA_MOTION=(function(){
var root=null,RM=false,FINE=false,ban=null,tm=0;
function h(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}

function section(label){
  if(RM||!root)return;
  if(!ban){ban=h('div','mo-ban');ban.setAttribute('aria-hidden','true');ban.innerHTML='<div class="mo-l"></div><div class="mo-t"></div><div class="mo-b"><i></i></div><div class="mo-s"></div>';root.appendChild(ban)}
  ban.querySelector('.mo-t').textContent='ACCEDIENDO // '+label;
  ban.querySelector('.mo-s').textContent='MÓDULO CARGADO · '+(Math.random()*9000+1000|0).toString(16).toUpperCase();
  ban.classList.remove('on');void ban.offsetWidth;ban.classList.add('on');
  clearTimeout(tm);tm=setTimeout(function(){ban.classList.remove('on')},900);
}

function burst(x,y){
  var r=root.getBoundingClientRect();
  for(var i=0;i<10;i++){
    var p=h('i','mo-p'),a=Math.random()*6.283,d=22+Math.random()*34;
    p.style.left=(x-r.left)+'px';p.style.top=(y-r.top)+'px';
    p.style.setProperty('--dx',Math.cos(a)*d+'px');p.style.setProperty('--dy',Math.sin(a)*d+'px');
    p.style.background=i%2?'var(--c1)':'var(--c3)';
    root.appendChild(p);setTimeout(function(q){return function(){if(q.parentNode)q.parentNode.removeChild(q)}}(p),600);
  }
}

function scramble(el){
  if(RM||!el||el._sc)return;
  var tx=el.textContent,n=0,G='01<>/\\#$%&';el._sc=1;
  var iv=setInterval(function(){
    n++;el.textContent=tx.split('').map(function(c,k){return c===' '||k<n/1.2?c:G[Math.random()*G.length|0]}).join('');
    if(n>tx.length*1.2){el.textContent=tx;clearInterval(iv);el._sc=0}
  },26);
}

function init(r,rm,fine){
  root=r;RM=rm;FINE=fine;
  if(RM)return;
  /* partículas al pulsar elementos interactivos */
  document.addEventListener('pointerdown',function(e){
    var t=e.target.closest&&e.target.closest('button,a,.card,.doc-card,.cm-p,.arc-slot');
    if(t&&root.contains(t))burst(e.clientX,e.clientY);
  });
  /* panel recién abierto: barrido de escaneo + título descifrándose */
  new MutationObserver(function(ms){
    ms.forEach(function(m){m.addedNodes.forEach(function(n){
      if(n.nodeType===1&&n.classList&&n.classList.contains('modal')){
        var hd=n.querySelector('.tp-head h2');if(hd)scramble(hd);
        var s=h('div','mo-scan');s.setAttribute('aria-hidden','true');var box=n.querySelector('.modal-box');if(box){box.appendChild(s);setTimeout(function(){if(s.parentNode)s.parentNode.removeChild(s)},900)}
      }
    })});
  }).observe(root,{childList:true});
  if(FINE){
    var raf=0,lx=0,ly=0;
    document.addEventListener('pointermove',function(e){
      lx=e.clientX;ly=e.clientY;if(raf)return;
      raf=requestAnimationFrame(function(){
        raf=0;
        var t=document.elementFromPoint(lx,ly),c=t&&t.closest&&t.closest('.card,.doc-card,.panel,.entry,.cm-p,.arc-slot,.stat');
        if(c){var b=c.getBoundingClientRect();c.style.setProperty('--mx',(lx-b.left)+'px');c.style.setProperty('--my',(ly-b.top)+'px')}
        var rr=root.getBoundingClientRect();
        root.style.setProperty('--px',((lx-rr.left)/rr.width-.5).toFixed(3));root.style.setProperty('--py',((ly-rr.top)/rr.height-.5).toFixed(3));
        var m=t&&t.closest&&t.closest('.tbtn,.nav button');
        document.querySelectorAll('.mo-mag').forEach(function(x){if(x!==m){x.classList.remove('mo-mag');x.style.removeProperty('--tx');x.style.removeProperty('--ty')}});
        if(m){var q=m.getBoundingClientRect();m.classList.add('mo-mag');m.style.setProperty('--tx',((lx-q.left-q.width/2)*.12).toFixed(1)+'px');m.style.setProperty('--ty',((ly-q.top-q.height/2)*.2).toFixed(1)+'px')}
      });
    });
  }
}
return {init:init,section:section,scramble:scramble};
})();
