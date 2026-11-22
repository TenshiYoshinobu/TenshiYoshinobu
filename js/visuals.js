/* VISUALES INTERACTIVOS por tema (clave = número de tema). Son demostraciones
   explicativas: no representan prácticas concretas de clase salvo que se indique. */
window.DSA_VIS=(function(){
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function wrap(title,note){var w=el('div','vis');w.appendChild(el('div','vis-h','▌ '+title));if(note)w.appendChild(el('p','vis-n',note));return w}
function btn(t,f){var b=el('button','vis-b',t);b.type='button';b.addEventListener('click',f);return b}

/* 2 · DOCKER: terminal simulada */
var DK=[
 ['docker --version','Docker version 2x.x.x, build xxxxxxx'],
 ['docker run hello-world','Unable to find image \'hello-world:latest\' locally\nlatest: Pulling from library/hello-world\nHello from Docker!\nThis message shows that your installation appears to be working correctly.'],
 ['docker images','REPOSITORY    TAG      IMAGE ID       SIZE\nhello-world   latest   xxxxxxxxxxxx   ~13kB'],
 ['docker ps -a','CONTAINER ID   IMAGE         COMMAND    STATUS\nxxxxxxxxxxxx   hello-world   "/hello"   Exited (0)'],
 ['docker run -d -p 8080:80 --name web nginx','xxxxxxxxxxxxxxxxxxxxxxxx   (contenedor en segundo plano; web en el puerto 8080)'],
 ['docker stop web','web']
];
function docker(){
  var w=wrap('TERMINAL DOCKER // DEMOSTRACIÓN','Simulación orientativa: la salida real varía y estos no son necesariamente los comandos de tus prácticas.');
  var t=el('pre','vis-term','$ _');t.setAttribute('aria-live','polite');
  var row=el('div','vis-row');
  DK.forEach(function(d){row.appendChild(btn(d[0].split(' ').slice(0,3).join(' '),function(){t.textContent='$ '+d[0]+'\n'+d[1]}))});
  w.appendChild(row);w.appendChild(t);return w;
}

/* 3 · CRIPTOGRAFÍA: César con deslizador */
function cesar(){
  var w=wrap('CIFRADO Y DESCIFRADO // CÉSAR','Cifrado clásico y muy débil, útil para entender texto plano, clave y texto cifrado.');
  var i=el('input','vis-in');i.type='text';i.value='HOLA MUNDO';i.setAttribute('aria-label','Texto plano');i.maxLength=40;
  var k=el('input','');k.type='range';k.min=1;k.max=25;k.value=3;k.setAttribute('aria-label','Clave');
  var kl=el('span','vis-k','CLAVE 3');
  var o=el('div','vis-out');
  function up(){
    var n=+k.value;kl.textContent='CLAVE '+n;
    o.textContent=i.value.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[A-Z]/g,function(c){return String.fromCharCode((c.charCodeAt(0)-65+n)%26+65)});
  }
  i.addEventListener('input',up);k.addEventListener('input',up);up();
  w.appendChild(el('label','vis-l','TEXTO PLANO'));w.appendChild(i);w.appendChild(kl);w.appendChild(k);
  w.appendChild(el('label','vis-l','TEXTO CIFRADO'));w.appendChild(o);return w;
}

/* 6 · GPG: panel de claves */
function gpg(){
  var w=wrap('PANEL DE CLAVES // PÚBLICA Y PRIVADA','Pulsa cada operación para ver qué clave se usa.');
  var info=el('div','vis-keys');
  var A=el('div','vis-key pub','CLAVE PÚBLICA\n(se comparte)'),B=el('div','vis-key priv','CLAVE PRIVADA\n(secreta)');
  info.appendChild(A);info.appendChild(B);
  var msg=el('p','vis-msg','Elige una operación.');
  var ops=[['Cifrar para Ana','Se cifra con la CLAVE PÚBLICA de Ana. Solo la privada de Ana puede abrirlo.','a'],
   ['Descifrar (Ana)','Ana usa su CLAVE PRIVADA para leer el mensaje.','b'],
   ['Firmar','Se firma con tu CLAVE PRIVADA: demuestra que lo enviaste tú y que no se alteró.','b'],
   ['Verificar firma','Cualquiera usa tu CLAVE PÚBLICA para comprobar la firma.','a']];
  var row=el('div','vis-row');
  ops.forEach(function(o){row.appendChild(btn(o[0],function(){A.classList.toggle('hot',o[2]==='a');B.classList.toggle('hot',o[2]==='b');msg.textContent=o[1]}))});
  w.appendChild(row);w.appendChild(info);w.appendChild(msg);return w;
}

/* 7 · BLOCKCHAIN: cadena de bloques con SHA-256 real */
function sha(s){
  if(window.crypto&&crypto.subtle){return crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)).then(function(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return ('0'+x.toString(16)).slice(-2)}).join('')})}
  var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Promise.resolve(('00000000'+(h>>>0).toString(16)).slice(-8).repeat(8));
}
function chain(){
  var w=wrap('CADENA DE BLOQUES // HASHES ENLAZADOS','Edita los datos de un bloque: su hash cambia y los siguientes dejan de coincidir. Hash SHA-256 real, sin minería.');
  var data=['Ana paga 5 a Luis','Luis paga 2 a Eva','Eva paga 1 a Ana'],orig=[],blocks=el('div','vis-chain');
  w.appendChild(blocks);
  var inputs=[];
  function calc(){
    /* secuencial: cada hash depende del anterior */
    var res=[],chainP=Promise.resolve('0'.repeat(64));
    data.forEach(function(d,i){chainP=chainP.then(function(p){return sha(i+'|'+p+'|'+d).then(function(h){res.push({p:p,h:h});return h})})});
    return chainP.then(function(){return res});
  }
  function draw(){
    calc().then(function(res){
      if(!orig.length)orig=res.map(function(r){return r.h});
      res.forEach(function(r,i){
        var b=blocks.children[i];
        b.classList.toggle('bad',r.h!==orig[i]);
        b.querySelector('.p').textContent='ANTERIOR '+r.p.slice(0,10)+'…';
        b.querySelector('.h').textContent='HASH '+r.h.slice(0,10)+'…';
      });
    });
  }
  data.forEach(function(d,i){
    var b=el('div','vis-blk');b.appendChild(el('b','','BLOQUE '+(i+1)));
    var inp=el('input','vis-in');inp.type='text';inp.value=d;inp.maxLength=40;inp.setAttribute('aria-label','Datos del bloque '+(i+1));
    inp.addEventListener('input',function(){data[i]=inp.value;draw()});
    b.appendChild(inp);b.appendChild(el('code','p'));b.appendChild(el('code','h'));blocks.appendChild(b);
  });
  var reset=btn('RESTAURAR',function(){var d0=['Ana paga 5 a Luis','Luis paga 2 a Eva','Eva paga 1 a Ana'];data=d0.slice();Array.prototype.forEach.call(blocks.querySelectorAll('input'),function(x,i){x.value=d0[i]});draw()});
  w.appendChild(reset);draw();return w;
}
return {2:docker,3:cesar,6:gpg,7:chain};
})();
