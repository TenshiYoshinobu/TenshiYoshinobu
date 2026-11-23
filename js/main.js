(function(){
'use strict';

/* =====================================================================
   DATOS EDITABLES  (aquí es donde pones tu contenido real)
   ===================================================================== */

var CONFIG={
  SEMESTER2_UNLOCKED:false,          // pon true para desbloquear el semestre 2
  DEFAULT_LEVEL:'medio-basico',      // nivel por defecto de los temas
  EXPERIENCIA:'Este curso hemos trabajado conceptos de seguridad, Docker, criptografía (con GPG y PGP), Lynis, CyberChef, blockchain, seguridad pasiva de equipos y de almacenamiento, el CPD y OpenMediaVault. Además, el profesor nos llevó a ver el servidor en persona y asistimos a una charla de Adrián sobre inteligencia artificial.',
  SAFE_FINAL_MESSAGE:'[ FRAGMENTO RECUPERADO ] Aquí irá tu mensaje especial sobre tu experiencia personal. Edita CONFIG.SAFE_FINAL_MESSAGE.',
  ESPECIAL_INTRO:'Este espacio ha sido creado con el propósito de recopilar y compartir los momentos más significativos de nuestro recorrido. A lo largo de esta sección, abordaremos diversas experiencias que enriquecen nuestra formación, tales como charlas informativas, salidas culturales o educativas y las distintas prácticas que hemos llevado a cabo. De este modo, todo el aprendizaje y las vivencias adquiridas quedarán debidamente documentados, sirviendo como un registro visual y escrito de nuestra evolución.',
  ESPECIAL_INTRO_IMG:'usb',          // clave de imagen (usb, padlock, handoff, cable, scanner) o URL
  CAPRI_IMG:'',                      // URL de tu propia imagen para CAPRI (vacío = rostro animado incluido)
  // URLs de audio propias (mp3/ogg): deben estar ALOJADAS con URL pública directa y debes tener derecho a usarlas.
  // Vacío = ambiente sintético generado en el navegador. Ejemplo: juego:'https://tu-hosting/high-forever.mp3'
  ASSET_BASE:'assets/audio/',        // carpeta de los audios (o URL pública completa terminada en /)
  AUDIO_TRACKS:{inicio:'inicio.mp3',juego:'juego.mp3',semestre1:'semestre1.mp3',semestre2:'',reflexion:'reflexion.mp3'},
  AUDIO_NAMES:{inicio:'High Forever (Remix)',juego:"You Can't Run From Me",semestre1:'Ambiente Semestre 1',reflexion:'A Rusty Dream'}
};


var IMAGES=window.DSA_IMAGES||{};
CONFIG.IMAGE_URLS={};                // clave -> URL propia (opcional). Ej: {usb:'https://.../usb.webp'}

/* Imagen de cada tema del Semestre 1 (número de tema -> clave de imagen o URL). Los que no estén usan su icono. */
var TOPIC_IMG={1:'padlock',2:'cable',4:'scanner',6:'handoff',10:'usb'};

/* Juego de entrada: una pregunta por terminal. ok = posición de la respuesta correcta (0, 1, 2) */
var CHALLENGES=[
 {node:'NODO 01 // CONCEPTOS SOBRE SEGURIDAD',q:'Los tres pilares de la seguridad de la información son confidencialidad, integridad y…',opts:['Anonimato','Velocidad','Disponibilidad'],ok:2,why:'Confidencialidad, integridad y disponibilidad: la tríada CIA.'},
 {node:'NODO 02 // CRIPTOGRAFÍA GPG Y PGP',q:'En GPG/PGP, ¿qué clave NO se debe compartir nunca?',opts:['La clave privada','La clave pública','Ninguna: se comparten las dos'],ok:0,why:'La pública se reparte para que te cifren mensajes; la privada solo la tienes tú.'},
 {node:'NODO 03 // SEGURIDAD PASIVA: ALMACENAMIENTO',q:'¿Qué hace un RAID 1?',opts:['Reparte los datos sin copiarlos','Duplica los datos en dos discos (espejo)','Sustituye a las copias de seguridad'],ok:1,why:'RAID 1 es un espejo: si un disco falla, el otro conserva los datos. Aun así, RAID no es una copia de seguridad.'}
];
/* Frases de CAPRI durante el juego */
var CAPRI_LINES={
 start:'Conexión estable. Soy CAPRI y voy a guiarte por esta red. Tres nodos y se abre la puerta. Fácil… si no te freímos antes.',
 arrive:['Primer nodo. Lo básico de la seguridad: ni un netrunner novato lo falla.','Segundo nodo: criptografía con claves. Piensa en cuál es la secreta.','Último nodo. Almacenamiento y copias: el aburrido que salva vidas.'],
 ok:['Eso ha sido casi elegante.','Nodo abierto. Empiezo a tener esperanzas.','Perfecto. Ahora, a por la puerta.'],
 bad:['ICE detectado. Respira y prueba otra vez.','Error de sistema… tuyo, no mío.','Casi. Bueno, no. Pero ánimo.'],
 gate:'La puerta cede. Dicen que Night City recompensa a los valientes. Mentira, pero hoy sí.'
};

/* Caja fuerte: la combinación es SSH (puerto 22) + HTTPS (puerto 443) */
var SAFE={
  code:'22443',
  clue:'Dos puertos, un destino. Primero, el del acceso remoto seguro. Después, el de la web cifrada.',
  hints:[
    'Acceso remoto seguro = SSH. Web cifrada = HTTPS.',
    'SSH usa el puerto 22 y HTTPS usa el puerto 443.',
    'Junta los dos números sin espacios: 22 y 443.'
  ]
};

/* Niveles disponibles: 'basico' | 'medio-basico' | 'medio' | 'avanzado' */
var LEVELS={'basico':{l:'BÁSICO',n:1},'medio-basico':{l:'MEDIO-BÁSICO',n:2},'medio':{l:'MEDIO',n:3},'avanzado':{l:'AVANZADO',n:4}};

/* Los 11 temas del Semestre 1, en el orden de tu página.
   Rellena las 6 secciones con tu texto (las que estén vacías no se muestran).
   img: URL de tu ilustración (opcional). level: cambia el nivel de cada tema.  */
var TOPICS=[
 {name:'Conceptos sobre Seguridad',icon:'🛡',desc:'Bases de la seguridad informática: qué protegemos y de qué.'},
 {name:'Docker',icon:'🐳',desc:'Contenedores para empaquetar y ejecutar aplicaciones de forma aislada.'},
 {name:'Criptografía',icon:'🔐',desc:'Cómo se protege la información mediante cifrado y hashes.'},
 {name:'Lynis',icon:'🔍',desc:'Herramienta de auditoría de seguridad para sistemas Linux.'},
 {name:'Cyberchef',icon:'🧪',desc:'Herramienta web para codificar, decodificar y analizar datos.'},
 {name:'Criptografía GPG y PGP',icon:'🗝',desc:'Cifrado y firma con pares de claves pública y privada.'},
 {name:'Blockchain',icon:'⛓',desc:'Cadena de bloques enlazados mediante criptografía.'},
 {name:'Seguridad Pasiva: Equipos',icon:'💻',desc:'Medidas para minimizar el daño tras un incidente en los equipos.'},
 {name:'CPD: Arena',icon:'🏢',desc:'Tema sobre el Centro de Procesamiento de Datos (CPD).'},
 {name:'Seguridad Pasiva: Almacenamiento',icon:'💾',desc:'Protección de los datos almacenados: copias y redundancia.'},
 {name:'OpenMediaVault',icon:'📦',desc:'Sistema para montar un servidor de almacenamiento en red (NAS).'}
].map(function(t,i){
  return {n:i+1,name:t.name,icon:t.icon,desc:t.desc,img:TOPIC_IMG[i+1]||'',level:CONFIG.DEFAULT_LEVEL,status:'MISIÓN COMPLETADA',
    sections:{intro:'',aprendido:'',tecnico:'',experiencia:'',impacto:'',conclusion:''},
    evidencias:[] /* [{t:'Título',src:'URL de imagen'}] */};
});

/* Contenido académico (js/content.js): se mezcla sin pisar lo que ya hayas escrito aquí */
if(window.DSA_CONTENT)TOPICS.forEach(function(t){var c=DSA_CONTENT[t.n];if(!c)return;for(var k in c){if(!(t.sections[k]&&t.sections[k].trim()))t.sections[k]=c[k]}});

/* Temas del Semestre 2 (vacío hasta que los tengas) */
var SEMESTER2_TOPICS=[];

var SECTION_DEFS=[
 {key:'intro',label:'INTRODUCCIÓN',hint:'Explicación general del contenido.'},
 {key:'aprendido',label:'CONOCIMIENTOS ADQUIRIDOS',hint:'Qué he aprendido.'},
 {key:'tecnico',label:'DESARROLLO TÉCNICO',hint:'Conceptos, herramientas, prácticas y actividades realizadas.'},
 {key:'experiencia',label:'EXPERIENCIA PERSONAL',hint:'Cómo he vivido el aprendizaje, dificultades e intereses.'},
 {key:'impacto',label:'IMPACTO Y APLICACIÓN',hint:'Relación con la ciberseguridad y utilidad en el mundo real.'},
 {key:'conclusion',label:'CONCLUSIÓN',hint:'Valoración personal de lo aprendido.'}
];

/* Apartado Especial: añade más entradas copiando un bloque */
var ENTRIES=[
 {type:'VISITA',title:'Visita al servidor',img:'',panels:[
  {t:'SUBIMOS A VERLO',x:'El profesor nos llevó arriba para ver el servidor en persona.'},
  {t:'CÓMO FUNCIONA UN SERVIDOR',x:'Vimos cómo funciona un servidor y cómo es por dentro.'},
  {t:'UN SERVIDOR PEQUEÑO',x:'El servidor era pequeño, y eso llamó la atención.'},
  {t:'NECESITA AIRE',x:'Estaba muy encerrado y se sobrecalentaba mucho, así que necesitaba ventilación.'}
 ]},
 {type:'CHARLA',title:'Charla: Adrián',img:'',paragraphs:[
  'En esta charla se abordó el tema de la Inteligencia Artificial (IA) y su funcionamiento. Para empezar, el ponente nos explicó cómo podemos identificarla en nuestro día a día, cuál es su verdadero significado y cómo ha ido evolucionando desde su creación. Además, exploramos conceptos fascinantes como el machine learning (aprendizaje automático) y las redes neuronales, entre otros. También profundizamos en la parte práctica: vimos cómo se programa este tipo de tecnología y comprendimos la lógica detrás de cada línea de código.',
  'Cabe recalcar que esta sesión me resultó especialmente interesante porque actualmente estoy desarrollando mi propia IA en casa. Aunque el proyecto sigue en sus fases iniciales (ya que voy aprendiendo sobre la marcha mientras la construyo), la charla me ayudó enormemente a detectar qué elementos me faltaban y a aclarar dudas que tenía pendientes. Ya he empezado a aplicar estos nuevos conocimientos en mi desarrollo. Aunque todavía se encuentra en etapa de pruebas, esta experiencia me ha dado mucha más confianza para plasmar mis ideas y me ha motivado a seguir investigando.'
 ]}
];

/* Reflexiones (cada punto se abre como una sección del documento) */
var REFLEXIONES=[
 {id:'ciber',img:'scanner',cls:'',code:'LOG_A // CYBER-OUTLOOK',title:'Situación actual de la ciberseguridad',
  sub:'Mi visión sobre la seguridad informática hoy y mañana.',
  items:[
   {h:'Importancia de la seguridad informática',t:''},
   {h:'Amenazas digitales actuales',t:''},
   {h:'Protección de los datos personales',t:''},
   {h:'Privacidad en Internet',t:''},
   {h:'Evolución de los ataques informáticos',t:''},
   {h:'Responsabilidad de usuarios y profesionales',t:''},
   {h:'Mi visión del futuro de la ciberseguridad',t:''}
  ]},
 {id:'gratitud',img:'handoff',cls:'soft',code:'LOG_B // GRATITUDE.log',title:'Gratitud, agradecimiento y perdón',
  sub:'Un archivo más personal, para cerrar esta etapa.',
  items:[
   {h:'Agradecimientos a quienes me han acompañado',t:''},
   {h:'Reconocimiento a quienes han contribuido a mi aprendizaje',t:''},
   {h:'Las dificultades encontradas',t:''},
   {h:'La importancia de reconocer los errores',t:''},
   {h:'El valor del perdón y del crecimiento personal',t:''},
   {h:'Conclusión de esta etapa académica',t:''}
  ]}
];
if(window.DSA_REFLEX)REFLEXIONES.forEach(function(r){var c=DSA_REFLEX[r.id];if(!c)return;r.items.forEach(function(it){if(c[it.h]&&!(it.t&&it.t.trim()))it.t=c[it.h]})});

/* Base de conocimientos de CAPRI. k = palabras clave ('=ia' exige palabra exacta).
   a = respuesta (o lista para elegir al azar). go = {sec, topic} para el botón. */
var KB=[
 {k:['hola','buenas','hey','buenos dias','buenas tardes'],a:['Hola, choom. Aquí CAPRI, en directo desde algún servidor de Night City. ¿En qué te ayudo?','Línea abierta. Habla, que mi tiempo de CPU no es infinito.']},
 {k:['quien eres','que eres','capri'],a:'Soy CAPRI, el asistente de este archivo. Sarcasmo de serie, pero cuando toca explicar algo, lo explico bien. Ojo: funciono con respuestas programadas, no soy una IA conectada a internet.'},
 {k:['ayuda','que puedes','que sabes','temas','que hay'],a:'Puedo explicarte los 11 temas del Semestre 1 (Seguridad, Docker, Criptografía, Lynis, CyberChef, GPG/PGP, Blockchain, Seguridad Pasiva, CPD y OpenMediaVault), hablarte del Apartado Especial, las reflexiones o cómo personalizar la web. Pregunta con tus palabras.'},
 {k:['conceptos','seguridad informatica','confidencialidad','integridad','disponibilidad','amenaza','vulnerabilidad','riesgo','seguridad activa'],go:{sec:'semestres',topic:1},a:'La seguridad informática protege la información y los sistemas. Se apoya en tres pilares: confidencialidad (solo accede quien debe), integridad (los datos no se alteran sin permiso) y disponibilidad (están accesibles cuando se necesitan). Una amenaza es lo que puede causar daño, una vulnerabilidad es el punto débil y el riesgo es la probabilidad de que la amenaza aproveche esa debilidad. La seguridad activa intenta evitar el incidente; la pasiva minimiza el daño si ocurre.'},
 {k:['docker','contenedor','contenedores','dockerfile'],go:{sec:'semestres',topic:2},a:'Docker es una plataforma para empaquetar una aplicación con todo lo que necesita (librerías, configuración) en un contenedor. La imagen es la plantilla y el contenedor es esa imagen en ejecución. Son más ligeros que una máquina virtual porque comparten el kernel del sistema, y aíslan unas aplicaciones de otras, lo que también ayuda a la seguridad.'},
 {k:['criptografia','cifrado','cifrar','simetrico','asimetrico','hash','=aes','=rsa','=sha','firma digital'],go:{sec:'semestres',topic:3},a:'La criptografía transforma la información para que solo quien tenga la clave pueda leerla. En el cifrado simétrico se usa la misma clave para cifrar y descifrar (rápido, p. ej. AES); en el asimétrico hay un par de claves, pública y privada (p. ej. RSA). Un hash (como SHA-256) no es cifrado: es una huella irreversible que sirve para comprobar que algo no ha cambiado. La firma digital combina hash y clave privada para demostrar quién envió algo.'},
 {k:['lynis','auditoria','auditar','hardening'],go:{sec:'semestres',topic:4},a:'Lynis es una herramienta de auditoría de seguridad para sistemas Linux y Unix. Revisa la configuración del equipo (servicios, permisos, actualizaciones, red…) y genera un informe con avisos y sugerencias, además de una puntuación de endurecimiento (hardening). Sirve para saber qué mejorar en un sistema.'},
 {k:['cyberchef','cyber chef','receta','base64','codificar','decodificar'],go:{sec:'semestres',topic:5},a:'CyberChef es una herramienta web creada por el GCHQ británico, conocida como la navaja suiza del análisis de datos. Encadenas operaciones (una "receta") para codificar, decodificar, cifrar, calcular hashes o convertir formatos como Base64 o hexadecimal, todo desde el navegador.'},
 {k:['gpg','pgp','gnupg','openpgp','clave publica','clave privada','firmar'],go:{sec:'semestres',topic:6},a:'PGP es un sistema para cifrar y firmar mensajes y archivos; GPG (GnuPG) es su implementación libre, basada en el estándar OpenPGP. Cada persona tiene un par de claves: la pública se comparte para que te cifren mensajes y la privada, que nunca se comparte, sirve para descifrarlos y para firmar. La firma permite comprobar la autoría y que nada se ha modificado.'},
 {k:['blockchain','cadena de bloques','bloque','criptomoneda','bitcoin','descentralizado'],go:{sec:'semestres',topic:7},a:'Una blockchain es un registro formado por bloques enlazados: cada bloque guarda el hash del anterior, así que alterar uno rompería toda la cadena. Al estar distribuida entre muchos nodos y validada por consenso, no depende de una autoridad central. Es la base de criptomonedas como Bitcoin, aunque tiene más usos.'},
 {k:['seguridad pasiva','seguridad pasiva equipos','pasiva','=sai','=ups','equipos'],go:{sec:'semestres',topic:8},a:'La seguridad pasiva reúne las medidas que reducen el daño cuando un incidente ya ha ocurrido (la activa intenta evitarlo). En los equipos incluye, por ejemplo, copias de seguridad, SAI para los cortes eléctricos, redundancia, protección física del hardware y planes de recuperación.'},
 {k:['cpd','centro de procesamiento','centro de datos','arena','sala de servidores','datacenter'],go:{sec:'semestres',topic:9},a:'Un CPD (Centro de Procesamiento de Datos) es la instalación que alberga los servidores y equipos de red de una organización. Su seguridad cubre el control de acceso físico, la refrigeración, SAI y generadores, detección y extinción de incendios y redundancia para que el servicio no se caiga. Lo de "Arena" lo dejo para tus apuntes: eso solo lo sabes tú.'},
 {k:['almacenamiento','seguridad pasiva almacenamiento','=raid','backup','copia de seguridad','copias de seguridad'],go:{sec:'semestres',topic:10},a:'En almacenamiento, la seguridad pasiva busca que los datos sobrevivan a un fallo. RAID combina varios discos para dar redundancia o rendimiento (RAID 1 duplica los datos, RAID 5 reparte paridad), pero ojo: RAID no es una copia de seguridad. Para eso están los backups; una regla clásica es la 3-2-1: tres copias, en dos soportes distintos y una fuera del sitio.'},
 {k:['openmediavault','omv','=nas','servidor de archivos'],go:{sec:'semestres',topic:11},a:'OpenMediaVault es un sistema operativo libre, basado en Debian, para montar un NAS (almacenamiento conectado en red). Se administra desde una interfaz web: gestionas discos, RAID, usuarios y carpetas compartidas (SMB/NFS) y puedes ampliarlo con plugins.'},
 {k:['juego','minijuego','terminales','nodos','puerta','hackear'],a:'El juego de entrada se abre al descifrar la caja fuerte: recorres una ciudad 3D, hackeas tres terminales respondiendo preguntas de ciberseguridad y la puerta final te da acceso. Si te atascas, hay botón de saltar.',go:{sec:'inicio'}},
 {k:['semestre 2','segundo semestre','restringido','bloqueado','semestre dos'],go:{sec:'semestres'},a:'Semestre 2: ACCESO DENEGADO. Aún no hay datos que mostrar, así que está sellado. Cuando llegue su momento se desbloquea con un simple cambio en el código.'},
 {k:['caja fuerte','combinacion','vault','pista','codigo'],a:'¿La caja fuerte? Mi lema: nunca doy contraseñas. Pista gratis: piensa en dos puertos famosos de red. Uno es de acceso remoto seguro y el otro, de la web cifrada. Lo demás, te lo ganas.',go:{sec:'inicio'}},
 {k:['personalizar','cursor','color','colores','paleta'],a:'Arriba a la derecha, botón PERSONALIZAR: tres cursores (Netrunner, Combat, Hologram) y cuatro perfiles de color. Solo eso; lo demás ni lo toques.'},
 {k:['reflexion','reflexiones','gratitud','perdon','logs'],go:{sec:'reflexion'},a:'En Personal Logs hay dos archivos: uno sobre la situación actual de la ciberseguridad y otro, más personal, sobre gratitud, agradecimiento y perdón.'},
 {k:['apartado especial','charla','adrian','inteligencia artificial','=ia','=ai'],go:{sec:'especial'},a:'El Apartado Especial recoge charlas, salidas y prácticas. Ahora mismo está la charla de Adrián sobre inteligencia artificial, machine learning y redes neuronales.'},
 {k:['nivel','basico','medio','experto','profesional'],a:'Honestidad ante todo: los temas están marcados como medio-básico. Es una primera toma de contacto, no un máster en Arasaka.'},
 {k:['musica','sonido','audio','reproductor'],a:'El reproductor está abajo. No arranca solo (los navegadores lo bloquean): pulsa ▶. La ambientación es sintética y se genera en tu propio navegador.'},
 {k:['phishing','suplantacion','correo falso'],a:'Phishing: engaño para que entregues datos haciéndote pasar por alguien de confianza (correo, SMS, web falsa). Señales: urgencia, enlaces raros, remitente que no cuadra. Ante la duda, no pinches y verifica por otro canal.'},
 {k:['contrasena','password','clave segura'],a:'Una buena contraseña es larga (mejor una frase), única para cada servicio y guardada en un gestor. Y activa la verificación en dos pasos siempre que puedas.'},
 {k:['chiste','broma','gracioso'],a:['¿Por qué el netrunner no sale de casa? Porque tiene demasiados paquetes pendientes.','Mi contraseña es "incorrecta". Así, cuando la olvido, el sistema me dice: tu contraseña es incorrecta.']},
 {k:['modo libre','gta','conducir','policia','coches','dinero','misiones','llamadas'],a:'El botón MODO LIBRE abre una ciudad en vista cenital: andas, robas coches, la policía te persigue, aceptas llamadas con encargos y hackeas terminales. Con el dinero compras mejoras en la tienda amarilla… perdón, cian. Pulsa ESC para el menú. Y no, no te dejo atropellar a nadie de verdad: solo quedan aturdidos.'},
 {k:['mapa 3d','ciudad 3d','mapa','night city'],a:'El MAPA 3D es una ciudad que puedes recorrer: arrastra para girar, rueda para el zoom, y pulsa una torre con baliza para entrar a su sección. Dicen que hay luces amarillas escondidas… yo no he dicho nada.'},
 {k:['gracias','genial'],a:['De nada. Cobro en eurodólares y buen karma.','Un placer. Apúntalo en mi cuenta, choom.']}
];
var KB_FALLBACK=[
 'Mi base de datos no tiene eso. Ni los netrunners de Arasaka lo encontrarían. Prueba con Docker, criptografía, Lynis, GPG, blockchain, RAID, CPD u OpenMediaVault.',
 'Error 404: neurona no encontrada. Reformula la pregunta, choom.',
 'Eso se me escapa… y eso que no tengo vacaciones. Pregúntame por algún tema del Semestre 1.'
];
var KB_OPENERS=['Descargando datos:','Vale, clase magistral:','Ahí va, sin cobrar extra:','Respira, que va:'];

/* =====================================================================
   UTILIDADES
   ===================================================================== */
var root=document.getElementById('ds');
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function h(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function pad(n){return String(n).padStart(2,'0')}
function norm(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function pick(a){return Array.isArray(a)?a[Math.floor(Math.random()*a.length)]:a}
var RM=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
var FINE=!!(window.matchMedia&&window.matchMedia('(pointer:fine)').matches);
function sleep(ms){return new Promise(function(r){setTimeout(r,RM?Math.min(ms,40):ms)})}
var store={
  get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},
  set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}},
  del:function(k){try{localStorage.removeItem(k)}catch(e){}}
};


/* Imágenes: claves incrustadas (IMAGES) o URL propia. Se sirven como variables CSS para no duplicar datos. */
function imgSrc(k){return (CONFIG.IMAGE_URLS&&CONFIG.IMAGE_URLS[k])||IMAGES[k]||''}
function applyImages(){Object.keys(IMAGES).forEach(function(k){var v=imgSrc(k);if(v&&!/^(data:|https?:|\/\/)/.test(v)){try{v=new URL(v,document.baseURI).href}catch(e){}}if(v)root.style.setProperty('--i-'+k,'url("'+v.replace(/"/g,'%22')+'")')})}
function artHTML(ref,cls){
  var bg=imgSrc(ref)?'var(--i-'+ref+')':"url('"+esc(ref)+"')";
  return '<span class="art '+(cls||'')+'"><span class="p"><span class="k" style="background-image:'+bg+'"></span></span></span>';
}

/* =====================================================================
   REGISTRO DE ACTIVIDAD
   ===================================================================== */
var LOGS=[];
function log(msg){
  var t=new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
  LOGS.unshift(t+' // '+msg);
  if(LOGS.length>25)LOGS.length=25;
  $('#logLine').innerHTML='<b>LOG</b> '+esc(LOGS[0]);
  if(!$('#logP').hidden)renderLog();
}
function renderLog(){var p=$('#logP');p.innerHTML='';LOGS.slice(0,10).forEach(function(l){p.appendChild(h('div','',l))})}
$('#logLine').addEventListener('click',function(){
  var p=$('#logP');p.hidden=!p.hidden;this.setAttribute('aria-expanded',String(!p.hidden));if(!p.hidden)renderLog();
});

/* =====================================================================
   AUDIO (música sintética + efectos, nunca automático)
   ===================================================================== */
var Snd=(function(){
  var ctx=null,master=null,scene='inicio',playing=false,userPaused=false,muted=false,sfxOn=true,vol=.5,cfg={ui:true,act:true},eng=null,nodes=[],timers=[],media={},bad={},fadeT=0;
  var SCENES={
    inicio:{name:'INICIO // AMBIENTE FUTURISTA',root:55,wave:'sawtooth',cut:420,chord:[1,1.5,2],lfo:.2},
    juego:{name:'JUEGO // INFILTRACIÓN',root:55,wave:'sawtooth',cut:800,chord:[1,1.5],lfo:.5,pulse:190,seq:[1,1,1.5,1,1.25,1,2,1.5],noise:true},
    semestre1:{name:'SEMESTRE 1 // TECNO ENERGÉTICO',root:65.4,wave:'square',cut:900,chord:[1,1.5],lfo:.4,pulse:240,seq:[1,1,1.5,1,2,1,1.5,1.25]},
    semestre2:{name:'SEMESTRE 2 // INDUSTRIAL',root:49,wave:'sawtooth',cut:260,chord:[1,1.06,1.5],lfo:.1,noise:true,glitch:true},
    reflexion:{name:'REFLEXIÓN // ATMOSFÉRICO',root:110,wave:'sine',cut:1600,chord:[1,1.25,1.5,2],lfo:.06,slow:true}
  };
  function ensure(){
    if(!ctx){
      var AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return false;
      try{ctx=new AC();master=ctx.createGain();master.gain.value=muted?0:vol*.5;master.connect(ctx.destination)}catch(e){ctx=null;return false}
    }
    if(ctx.state==='suspended')ctx.resume();
    return true;
  }
  function clearSynth(){
    nodes.forEach(function(n){try{if(n.stop)n.stop()}catch(e){}try{n.disconnect()}catch(e){}});
    nodes=[];timers.forEach(clearInterval);timers=[];
  }
  function blip(f,d,type,g){
    if(!ctx||muted)return;
    var o=ctx.createOscillator(),e=ctx.createGain(),t=ctx.currentTime;
    o.type=type;o.frequency.value=f;
    e.gain.setValueAtTime(g,t);e.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(e);e.connect(master);o.start(t);o.stop(t+d+.02);
  }
  /* --- pistas de audio reales (archivos). Si falta o falla, se usa el sintético --- */
  function trackUrl(sc){
    var f=(CONFIG.AUDIO_TRACKS||{})[sc];
    if(!f)return '';
    return /^(https?:|data:|\/)/.test(f)?f:String(CONFIG.ASSET_BASE||'')+f;
  }
  function getMedia(sc){
    if(media[sc])return media[sc];
    var u=trackUrl(sc);
    if(!u||bad[sc])return null;
    var a=new window.Audio();
    a.loop=true;a.preload='auto';a.volume=0;
    a.addEventListener('error',function(){bad[sc]=true;if(scene===sc&&playing)build();ui()});
    a.src=u;media[sc]=a;
    return a;
  }
  function target(sc){return (playing&&!muted&&sc===scene)?vol:0}
  function fadeLoop(){
    if(fadeT)return;
    fadeT=setInterval(function(){
      var any=false;
      Object.keys(media).forEach(function(k){
        var a=media[k],t=target(k),v=a.volume,d=t-v,p;
        if(Math.abs(d)<.03){a.volume=Math.max(0,Math.min(1,t));if(t===0&&!a.paused)a.pause()}
        else{a.volume=Math.max(0,Math.min(1,v+(d>0?.04:-.04)));any=true}
        if(t>0&&a.paused&&!bad[k]){p=a.play();if(p&&p.catch)p.catch(function(){})}
      });
      if(!any){clearInterval(fadeT);fadeT=0}
    },50);
  }
  function startSynth(){
    var S=SCENES[scene],g=ctx.createGain(),f=ctx.createBiquadFilter(),i;
    g.gain.value=0;g.gain.linearRampToValueAtTime(.35,ctx.currentTime+(S.slow?3:1));
    f.type='lowpass';f.frequency.value=S.cut;f.connect(g);g.connect(master);nodes.push(g,f);
    S.chord.forEach(function(m,k){
      var o=ctx.createOscillator(),og=ctx.createGain();
      o.type=S.wave;o.frequency.value=S.root*m;o.detune.value=(k-1)*6;og.gain.value=.18;
      o.connect(og);og.connect(f);o.start();nodes.push(o,og);
    });
    var l=ctx.createOscillator(),lg=ctx.createGain();
    l.frequency.value=S.lfo;lg.gain.value=S.cut*.4;l.connect(lg);lg.connect(f.frequency);l.start();nodes.push(l,lg);
    if(S.noise){
      var nb=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d=nb.getChannelData(0);
      for(i=0;i<d.length;i++)d[i]=Math.random()*2-1;
      var ns=ctx.createBufferSource(),bp=ctx.createBiquadFilter(),ng=ctx.createGain();
      ns.buffer=nb;ns.loop=true;bp.type='bandpass';bp.frequency.value=900;ng.gain.value=.05;
      ns.connect(bp);bp.connect(ng);ng.connect(master);ns.start();nodes.push(ns,bp,ng);
    }
    if(S.pulse){var st=0;timers.push(setInterval(function(){blip(S.root*S.seq[st++%S.seq.length]*2,.14,'square',.1)},S.pulse))}
    if(S.glitch){timers.push(setInterval(function(){if(Math.random()<.5)blip(200+Math.random()*1800,.05,'square',.07)},700))}
  }
  function build(){
    clearSynth();
    if(!playing){fadeLoop();return}
    if(getMedia(scene)){fadeLoop();return}
    fadeLoop();
    if(ensure())startSynth();
  }
  function hasFile(sc){return !!trackUrl(sc)&&!bad[sc]}
  function ui(){
    var b=$('#pPlay');
    b.textContent=playing?'❚❚ PAUSAR':'▶ MÚSICA';
    b.setAttribute('aria-label',playing?'Pausar música':'Activar música');
    var nm=hasFile(scene)?((CONFIG.AUDIO_NAMES||{})[scene]||scene.toUpperCase()):SCENES[scene].name;
    $('#pScene').textContent=playing?('♪ '+nm):'AUDIO APAGADO';
    var m=$('#pMute');m.setAttribute('aria-pressed',String(muted));m.textContent=muted?'ACTIVAR SONIDO':'SILENCIAR';
    var s=$('#pSfx');s.setAttribute('aria-pressed',String(sfxOn));s.textContent='EFECTOS: '+(sfxOn?'ON':'OFF');
  }
  function applyVol(){if(master)master.gain.value=muted?0:vol*.5;fadeLoop()}
  return {
    toggle:function(){playing=!playing;userPaused=!playing;if(playing)ensure();build();ui();log(playing?'Audio activado':'Audio en pausa')},
    start:function(){if(!playing&&!userPaused){playing=true;ensure();build();ui();log('Audio activado')}},
    scene:function(s){if(!SCENES[s]||s===scene)return;scene=s;build();ui()},
    mute:function(){muted=!muted;applyVol();ui()},
    sfxToggle:function(){sfxOn=!sfxOn;ui()},
    vol:function(v){vol=v/100;applyVol()},
    fx:function(kind){
      if(!sfxOn||muted)return;
      if((kind==='click'||kind==='key'||kind==='hang')?!cfg.ui:!cfg.act)return;
      if(!ensure())return;
      if(kind==='click')blip(880,.05,'square',.08);
      else if(kind==='key')blip(520,.04,'square',.07);
      else if(kind==='ok'){blip(520,.12,'square',.1);setTimeout(function(){blip(780,.12,'square',.1)},110);setTimeout(function(){blip(1040,.2,'square',.1)},220)}
      else if(kind==='err')blip(130,.35,'sawtooth',.16);
      else if(kind==='call'){blip(700,.12,'sine',.12);setTimeout(function(){blip(900,.12,'sine',.12)},180)}
      else if(kind==='hang'){blip(500,.12,'sine',.1);setTimeout(function(){blip(300,.2,'sine',.1)},150)}
      else if(kind==='boom'){blip(55,.9,'sawtooth',.26);blip(110,.6,'square',.12)}
      else if(kind==='hack'){for(var q=0;q<5;q++)(function(q){setTimeout(function(){blip(300+q*160,.07,'square',.09)},q*55)})(q)}
      else if(kind==='coin'){blip(1200,.07,'square',.09);setTimeout(function(){blip(1800,.14,'square',.09)},70)}
      else if(kind==='hit'){blip(90,.18,'sawtooth',.22);blip(60,.25,'square',.12)}
      else if(kind==='siren'){blip(820,.22,'sine',.07);setTimeout(function(){blip(620,.22,'sine',.07)},230)}
      else if(kind==='shot'){blip(220,.07,'sawtooth',.13);blip(90,.1,'square',.1)}
      else if(kind==='laser'){blip(1500,.05,'sawtooth',.08);setTimeout(function(){blip(700,.08,'sine',.08)},40)}
      else if(kind==='glitch'){for(var i=0;i<5;i++)(function(i){setTimeout(function(){blip(100+Math.random()*1600,.06,'sawtooth',.1)},i*60)})(i)}
    },
    engine:function(v){ /* motor del vehículo: v 0..1 (velocidad); 0 lo detiene */
      if(!ctx||muted||!sfxOn||!cfg.act||!(v>.02)){if(eng){try{eng.g.gain.setTargetAtTime(0,ctx.currentTime,.08);var o=eng.o;setTimeout(function(){try{o.stop()}catch(e){}},400)}catch(e){}eng=null}return}
      if(!eng){var o=ctx.createOscillator(),f=ctx.createBiquadFilter(),g=ctx.createGain();o.type='sawtooth';f.type='lowpass';f.frequency.value=380;g.gain.value=0;o.connect(f);f.connect(g);g.connect(master);o.start();eng={o:o,g:g}}
      var t=ctx.currentTime;eng.o.frequency.setTargetAtTime(48+v*110,t,.06);eng.g.gain.setTargetAtTime(.05+.05*v,t,.08)},
    cfg:cfg,state:function(){return {playing:playing,muted:muted,sfxOn:sfxOn,vol:Math.round(vol*100)}},
    setPlaying:function(b){if(!!b!==playing)Snd.toggle()},setMuted:function(b){if(!!b!==muted)Snd.mute()},
    ui:ui,
    hidden:function(hid){
      if(hid){Object.keys(media).forEach(function(k){media[k].pause()});if(ctx)ctx.suspend()}
      else if(playing){fadeLoop();if(ctx)ctx.resume()}
    }
  };
})();
$('#pPlay').addEventListener('click',function(){Snd.toggle()});
$('#pMute').addEventListener('click',function(){Snd.mute()});
$('#pSfx').addEventListener('click',function(){Snd.sfxToggle()});
$('#pVol').addEventListener('input',function(){Snd.vol(+this.value)});
document.addEventListener('visibilitychange',function(){Snd.hidden(document.hidden)});

/* =====================================================================
   PERSONALIZACIÓN (solo cursor y colores)
   ===================================================================== */
var cur=$('#cur'),rainColor='#00f0ff';
function applyPrefs(){rainColor=(getComputedStyle(root).getPropertyValue('--c3')||'#00f0ff').trim()}
if(!FINE){root.classList.remove('has-cur');cur.hidden=true}

/* cursor + parallax */
var mx=-50,my=-50,raf=0;
root.addEventListener('mousemove',function(e){
  var r=root.getBoundingClientRect();
  mx=e.clientX-r.left;my=e.clientY-r.top;
  if(!raf)raf=requestAnimationFrame(function(){
    raf=0;
    cur.style.transform='translate('+mx+'px,'+my+'px)';cur.style.opacity=1;
    if(!RM&&DSA_SET.get().move){root.style.setProperty('--px',((mx/r.width)-.5)*-30);root.style.setProperty('--mx',(mx/r.width-.5).toFixed(3));root.style.setProperty('--my',(my/r.height-.5).toFixed(3))}
  });
  cur.classList.toggle('hov',!!(e.target.closest&&e.target.closest('button,input,a,.card')));
});
root.addEventListener('mouseleave',function(){cur.style.opacity=0});

DSA_SET.init({root:root,store:store,Snd:Snd,cur:cur,FINE:FINE,rain:$('#rain'),openModal:openModal,log:log,onApply:function(S,rm){RM=rm;applyPrefs()}});
$('#btnPers').addEventListener('click',DSA_SET.open);

/* =====================================================================
   MODALES
   ===================================================================== */
var lastFocus=null;
function openModal(content,cls){
  closeModal(true);
  lastFocus=document.activeElement;
  var m=h('div','modal');m.id='modal';
  var b=h('div','modal-box '+(cls||''));b.setAttribute('role','dialog');b.setAttribute('aria-modal','true');
  var x=h('button','modal-x','CERRAR ✕');x.type='button';x.setAttribute('aria-label','Cerrar');
  x.addEventListener('click',function(){closeModal()});
  b.appendChild(x);b.appendChild(content);m.appendChild(b);
  m.addEventListener('mousedown',function(e){if(e.target===m)closeModal()});
  root.appendChild(m);x.focus();
  return m;
}
function closeModal(quiet){
  var m=$('#modal');if(!m)return;
  m.remove();
  if(!quiet&&lastFocus&&lastFocus.focus)try{lastFocus.focus()}catch(e){}
}
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){if(free){/* el modo libre gestiona Esc */}else if($('#cityOv'))closeCity();else if(game.on)gameSkip();else if($('#modal'))closeModal();else if(!$('#capri').hidden)capriClose()}
});

/* =====================================================================
   NAVEGACIÓN
   ===================================================================== */
var SECS={inicio:'INICIO // SYSTEM BOOT',semestres:'SEMESTRES // KNOWLEDGE DATABASE',especial:'ESPECIAL // FIELD RECORDS',reflexion:'REFLEXIÓN // PERSONAL LOGS'};
var SCENE_OF={inicio:'inicio',semestres:'semestre1',especial:'inicio',reflexion:'reflexion'};
var curSec='';
/* efectos de transición: barrido de luz, entrada escalonada y título que se "decodifica" */
var wipeEl=h('div','wipe');wipeEl.setAttribute('aria-hidden','true');root.appendChild(wipeEl);
function wipeFx(){if(RM)return;wipeEl.classList.remove('go');void wipeEl.offsetWidth;wipeEl.classList.add('go')}
function revealSec(sec){
  if(RM)return;
  var s=$('.sec[data-sec="'+sec+'"]');if(!s)return;
  var els=$$('.sec-h,.sec-sub,.panel,.card,.entry,.doc-card,.stat,.chip,.safe-wrap,.hero-t',s).slice(0,40);
  els.forEach(function(e,i){e.style.setProperty('--i',Math.min(i,14));e.classList.remove('rv');void e.offsetWidth;e.classList.add('rv');
    e.addEventListener('animationend',function f(ev){if(ev.animationName==='rvIn'){e.classList.remove('rv');e.removeEventListener('animationend',f)}})});
  var hd=$('.sec-h',s);
  if(hd){var tx=hd.textContent,n=0,G='01<>/\\#$%&';if(hd._t)clearInterval(hd._t);
    hd._t=setInterval(function(){n++;hd.textContent=tx.split('').map(function(c,k){return c===' '||k<n/1.5?c:G[Math.random()*G.length|0]}).join('');if(n>tx.length*1.5){hd.textContent=tx;clearInterval(hd._t)}},28)}
}
/* ondas al pulsar botones + inclinación 3D de las tarjetas */
document.addEventListener('pointerdown',function(e){
  var b=e.target.closest&&e.target.closest('.btn,.tbtn');if(!b||RM||!root.contains(b))return;
  var r=b.getBoundingClientRect(),d=h('i','rip');d.style.left=(e.clientX-r.left)+'px';d.style.top=(e.clientY-r.top)+'px';d.style.width=d.style.height=Math.max(r.width,r.height)*2+'px';b.appendChild(d);setTimeout(function(){d.remove()},650)});
if(FINE&&!RM)document.addEventListener('pointermove',function(e){
  var c=e.target.closest&&e.target.closest('.card');
  $$('.card.tilt').forEach(function(x){if(x!==c){x.classList.remove('tilt');x.style.removeProperty('--rx');x.style.removeProperty('--ry')}});
  if(!c)return;var r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
  c.classList.add('tilt');c.style.setProperty('--ry',(px*10).toFixed(1)+'deg');c.style.setProperty('--rx',(-py*10).toFixed(1)+'deg')});
var main=$('#main');
function go(sec,quiet){
  if(!SECS[sec])return;
  if(sec===curSec)return;
  curSec=sec;
  closeModal(true);
  if(!RM){main.classList.remove('tr');void main.offsetWidth;main.classList.add('tr')}
  root.setAttribute('data-sec',sec);
  wipeFx();
  if(window.DSA_MOTION)DSA_MOTION.section(SECS[sec]);
  setTimeout(function(){
    $$('.sec').forEach(function(s){s.hidden=s.getAttribute('data-sec')!==sec});
    main.scrollTop=0;
    revealSec(sec);
  },RM?0:160);
  $$('.nav button').forEach(function(b){
    if(b.getAttribute('data-go')===sec)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
  });
  Snd.scene(sec==='semestres'&&semTab===2?'semestre2':SCENE_OF[sec]);
  if(!quiet){Snd.fx('click');log('Archivo consultado: '+SECS[sec])}
}
document.addEventListener('click',function(e){
  var t=e.target.closest&&e.target.closest('[data-go]');
  if(t&&root.contains(t))go(t.getAttribute('data-go'));
});

/* mapa de Night City */
function openMap2D(){
  var box=h('div','');
  box.innerHTML='<div class="tp-head"><span class="tag">NAVEGACIÓN</span><h2>MAPA DE NIGHT CITY</h2></div><div class="map" id="mapA">'+
   '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="rgba(0,240,255,.35)" stroke-width=".5"><path d="M0 30 L40 35 L70 20 L100 28"/><path d="M20 100 L30 60 L55 55 L65 0"/><path d="M0 75 L45 62 L100 80"/><path d="M85 0 L75 45 L90 100"/></g><g fill="none" stroke="rgba(255,42,109,.5)" stroke-width=".6" stroke-dasharray="2 2"><path d="M20 28 L50 62 L78 30 L22 74"/></g></svg></div>';
  var zones=[
   {s:'inicio',n:'CORPO PLAZA',d:'01 // Inicio',x:24,y:22},
   {s:'semestres',n:'WATSON',d:'02 // Semestres',x:70,y:26},
   {s:'especial',n:'BADLANDS',d:'03 // Apartado Especial',x:28,y:76},
   {s:'reflexion',n:'PACIFICA',d:'04 // Reflexión',x:74,y:72}
  ];
  openModal(box);
  var map=$('#mapA');
  zones.forEach(function(z){
    var b=h('button','zone');b.type='button';b.style.left=z.x+'%';b.style.top=z.y+'%';
    if(curSec===z.s)b.setAttribute('aria-current','true');
    b.innerHTML='<b>'+z.n+'</b><small>'+z.d+'</small>';
    b.addEventListener('click',function(){closeModal();curSec='';go(z.s)});
    map.appendChild(b);
  });
  log('Mapa desplegado');
}
/* ---------- mapa 3D explorable ---------- */
var city=null,cityFound=[];
try{cityFound=JSON.parse(store.get('dsa_city_found')||'[]')||[]}catch(e){cityFound=[]}
var CITY_ZONES=[
 {id:'inicio',sec:'inicio',name:'CORPO PLAZA',tag:'01 // INICIO',desc:'Rascacielos corporativos. Aquí empieza todo: presentación, experiencia y la caja fuerte.'},
 {id:'semestres',sec:'semestres',name:'WATSON',tag:'02 // SEMESTRES',desc:'Distrito industrial y base de datos del conocimiento: los 11 temas del Semestre 1.'},
 {id:'especial',sec:'especial',name:'BADLANDS',tag:'03 // APARTADO ESPECIAL',desc:'Registros de campo: charlas y actividades fuera del temario. Hay antenas y cosas ocultas.'},
 {id:'reflexion',sec:'reflexion',name:'PACIFICA',tag:'04 // REFLEXIÓN',desc:'Frente marítimo. Aquí se guardan los registros personales y las reflexiones.'}
];
function closeCity(){
  if(city){try{city.destroy()}catch(e){}city=null}
  var ov=$('#cityOv');if(ov)ov.remove();
}
function openCity(){
  closeCity();closeModal(true);
  var ov=h('div','city-ov');ov.id='cityOv';ov.setAttribute('role','dialog');ov.setAttribute('aria-label','Mapa 3D de Night City');
  ov.innerHTML='<div class="city-bar"><h2>NIGHT CITY // MAPA 3D</h2>'+
    '<button type="button" class="tbtn" data-c="tour" aria-pressed="false">RECORRIDO</button>'+
    '<button type="button" class="tbtn" data-c="aerial">VISTA AÉREA</button>'+
    '<button type="button" class="tbtn" data-c="street">NIVEL CALLE</button>'+
    '<button type="button" class="tbtn" data-c="in" aria-label="Acercar">＋</button>'+
    '<button type="button" class="tbtn" data-c="out" aria-label="Alejar">－</button>'+
    '<button type="button" class="tbtn" data-c="x">CERRAR ✕</button></div>'+
    '<div class="city-stage" id="cityStage"><div class="city-help">Arrastra: girar · Rueda / pellizco: zoom · WASD o flechas: moverte · Q/E: rotar · Pulsa una torre con baliza para entrar. Busca las señales amarillas.</div></div>';
  root.appendChild(ov);
  var stage=$('#cityStage',ov),card=null,toastT=0;
  function showCard(z){
    if(card)card.remove();
    card=h('div','city-card');
    card.innerHTML='<span class="tag">'+esc(z.tag)+'</span><h3>'+esc(z.name)+'</h3><p>'+esc(z.desc)+'</p>';
    var b=h('button','btn','ENTRAR A LA SECCIÓN ▸');b.type='button';
    b.addEventListener('click',function(){var s=z.sec;closeCity();curSec='';go(s)});
    card.appendChild(b);stage.appendChild(card);Snd.fx('click');log('Mapa 3D: '+z.name);
  }
  function toast(msg){
    var t=h('div','city-toast',msg);stage.appendChild(t);clearTimeout(toastT);toastT=setTimeout(function(){t.remove()},5200);
  }
  try{
    city=DSA_CITY.create(stage,{reduced:RM,low:!FINE,zones:CITY_ZONES,found:cityFound,
      onSelect:function(t){var z=CITY_ZONES.filter(function(q){return q.id===t.id})[0];showCard(z)},
      onFound:function(id,msg,n){if(cityFound.indexOf(id)<0)cityFound.push(id);store.set('dsa_city_found',JSON.stringify(cityFound));toast(msg);if(window.DSA_SEC)DSA_SEC.addClue(id,msg);Snd.fx('ok');log('Señal oculta recuperada ('+n+'/4)')}});
  }catch(err){
    closeCity();log('WebGL no disponible: mapa 2D');openMap2D();return;
  }
  ov.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-c]');if(!b||!city)return;var c=b.getAttribute('data-c');Snd.fx('click');
    if(c==='x')closeCity();
    else if(c==='in')city.zoom(.7);else if(c==='out')city.zoom(1.4);
    else if(c==='aerial')city.aerial();else if(c==='street')city.street();
    else if(c==='tour'){b.setAttribute('aria-pressed',String(city.tour()))}
  });
  Snd.fx('glitch');log('Mapa 3D desplegado');
}
$('#btnMap').addEventListener('click',openCity);

/* =====================================================================
   INICIO: estadísticas, experiencia, CAJA FUERTE
   ===================================================================== */
function renderHome(){
  $('#expText').textContent=CONFIG.EXPERIENCIA;
  $('#lvlGen').textContent=(LEVELS[CONFIG.DEFAULT_LEVEL]||LEVELS['medio-basico']).l;
  var st=$('#stats');
  st.innerHTML='<span class="chip">TEMAS <b>'+TOPICS.length+'</b></span><span class="chip">CHARLAS/ACTIV. <b>'+ENTRIES.length+'</b></span><span class="chip">SEMESTRE 2 <b>'+(CONFIG.SEMESTER2_UNLOCKED?'ABIERTO':'BLOQUEADO')+'</b></span>';
}
var safe={entry:'',hint:0,tries:0,open:false,busy:false,crashed:false};
function initSafe(){
  $('#safeClue').textContent=SAFE.clue;
  var k=$('#keys');
  ['1','2','3','4','5','6','7','8','9','C','0','OK'].forEach(function(v){
    var b=h('button','',v);b.type='button';b.setAttribute('aria-label',v==='C'?'Borrar':v==='OK'?'Confirmar':'Número '+v);
    b.addEventListener('click',function(){safeKey(v)});k.appendChild(b);
  });
  $('#hintBtn').addEventListener('click',safeHint);
  lcdShow();
}
function lcdShow(cls,txt){
  var l=$('#lcd'),n=SAFE.code.length,s='';
  for(var i=0;i<n;i++)s+=(i<safe.entry.length?safe.entry[i]:'_')+(i<n-1?' ':'');
  l.className='lcd'+(cls?' '+cls:'');
  l.textContent=txt||s;
}
function safeKey(v){
  if(safe.open||safe.busy)return;
  Snd.fx('key');
  if(v==='C'){safe.entry='';lcdShow();return}
  if(v==='OK'){safeCheck();return}
  if(safe.entry.length<SAFE.code.length){safe.entry+=v;lcdShow()}
  if(safe.entry.length===SAFE.code.length)safeCheck();
}
function safeHint(){
  if(safe.open)return;
  var el=$('#safeClue');
  if(safe.hint<SAFE.hints.length){el.textContent='PISTA '+(safe.hint+1)+'/'+SAFE.hints.length+': '+SAFE.hints[safe.hint];safe.hint++;Snd.fx('click');log('Pista de la caja fuerte solicitada')}
  else el.textContent='No hay más pistas. El resto es cosa tuya.';
}
async function safeCheck(){
  if(safe.busy||safe.open)return;
  if(safe.entry===SAFE.code){
    safe.busy=true;
    lcdShow('good','ACCESS GRANTED');Snd.fx('ok');log('Caja fuerte desbloqueada');if(window.DSA_SEC)DSA_SEC.unlock('safe');
    $('#safeState').textContent='UNLOCKING';$('#safeState').style.color='var(--c1)';
    await sleep(700);
    $('#vault').classList.add('open');
    await sleep(1400);
    safe.open=true;safe.busy=false;
    $('#safeState').textContent='OPEN';$('#safeState').style.color='var(--ok)';
    $$('#keys button').forEach(function(b){b.disabled=true});
    var vi=$('#vaultIn');
    vi.innerHTML='<div class="file">▣ PORTAL_NIGHTCITY.exe</div><div style="font-size:12px;color:var(--c2)">▸ acceso a la red detectado</div>';
    var ob=h('button','btn','ENTRAR AL MUNDO ▸');ob.type='button';ob.style.marginTop='8px';ob.style.fontSize='11px';ob.style.padding='8px 14px';
    ob.addEventListener('click',function(){launchGame()});
    vi.appendChild(ob);
    lcdShow('good','VAULT OPEN');
    $('#safeClue').textContent='Dentro hay un portal a la red de Night City. Atraviésalo.';
    $('#hintBtn').hidden=true;
  }else{
    safe.tries++;
    $('#safeInfo').textContent='Intentos: '+safe.tries;
    lcdShow('bad','ACCESS DENIED');Snd.fx('err');
    $('#safe').classList.remove('shake');void $('#safe').offsetWidth;$('#safe').classList.add('shake');
    safe.entry='';
    setTimeout(function(){if(!safe.open)lcdShow()},900);
    if(safe.tries===3)$('#safeClue').textContent='Tres fallos. Quizá te vendría bien una pista…';
  }
}
/* =====================================================================
   SEMESTRES
   ===================================================================== */
var semTab=1;
function levelHTML(lv){
  var L=LEVELS[lv]||LEVELS['medio-basico'],s='';
  for(var i=1;i<=4;i++)s+='<i class="'+(i<=L.n?'on':'')+'"></i>';
  return '<span class="lvl" aria-label="Nivel: '+L.l+'">'+s+'<em>'+L.l+'</em></span>';
}
function renderGrid(){
  var g=$('#grid');g.innerHTML='';
  TOPICS.forEach(function(t,i){
    var b=h('button','card');b.type='button';b.style.setProperty('--d',(i*.35)+'s');
    b.innerHTML='<span class="card-n">TEMA '+pad(t.n)+'</span>'+
      '<span class="card-img ico-wrap" style="--ia:var('+['--c1-rgb','--c3-rgb','--c2-rgb'][i%3]+')"><span class="ico-ring"></span><span class="ico-scan"></span>'+((window.DSA_ICONS&&DSA_ICONS[i])||'<span aria-hidden="true" style="font-size:46px">'+t.icon+'</span>')+'</span>'+
      '<span class="card-t">'+esc(t.name)+'</span><span class="card-d">'+esc(t.desc)+'</span>'+levelHTML(t.level)+
      '<span class="st">● '+esc(t.status)+'</span><span class="card-go">ABRIR ARCHIVO ▸</span>';
    b.addEventListener('click',function(){openTopic(i)});
    g.appendChild(b);
  });
  $('#progTxt').textContent='MISIONES COMPLETADAS: '+TOPICS.length+'/'+TOPICS.length;
  $('#progBar').style.width='100%';
}
function paragraphs(txt){
  return String(txt).split(/\n\s*\n/).map(function(p){return '<p>'+esc(p)+'</p>'}).join('');
}
function openTopic(i,fromNav){
  var t=TOPICS[i],box=h('div','');
  box.innerHTML='<div class="tp-head"><span class="tag">TEMA '+pad(t.n)+'</span><h2>'+esc(t.name)+'</h2>'+levelHTML(t.level)+'<span class="st">● '+esc(t.status)+'</span></div><div id="accs"></div>'+
    '<div class="tp-nav"><button type="button" class="btn alt" id="tpPrev"'+(i===0?' disabled style="opacity:.3"':'')+'>◂ ANTERIOR</button><button type="button" class="btn alt" id="tpNext"'+(i===TOPICS.length-1?' disabled style="opacity:.3"':'')+'>SIGUIENTE ▸</button></div>';
  var accs=$('#accs',box);
  var shown=0;
  SECTION_DEFS.forEach(function(s){
    var txt0=t.sections[s.key];if(!(txt0&&txt0.trim())&&!(s.key==='tecnico'&&t.evidencias&&t.evidencias.length))return;
    var k=shown++;
    var d=h('div','acc'),b=h('button','acc-b');b.type='button';b.setAttribute('aria-expanded',k===0?'true':'false');
    b.innerHTML='<b>'+(k+1)+'</b> '+s.label+'<i>'+(k===0?'−':'+')+'</i>';
    var c=h('div','acc-c');c.hidden=k!==0;
    var txt=t.sections[s.key];
    if(txt&&txt.trim())c.innerHTML=paragraphs(txt);
    if(s.key==='tecnico'&&t.evidencias&&t.evidencias.length){
      t.evidencias.forEach(function(ev){c.insertAdjacentHTML('beforeend','<p><b>'+esc(ev.t||'')+'</b><br><img src="'+esc(ev.src)+'" alt="'+esc(ev.t||'Evidencia')+'" style="max-width:100%;border:1px solid var(--c3)"></p>')});
    }
    if(s.key==='tecnico'&&window.DSA_VIS&&DSA_VIS[t.n]){try{c.insertBefore(DSA_VIS[t.n](),c.firstChild)}catch(e){}}
    b.addEventListener('click',function(){
      var open=b.getAttribute('aria-expanded')==='true';
      b.setAttribute('aria-expanded',String(!open));c.hidden=open;b.lastChild.textContent=open?'+':'−';Snd.fx('click');
    });
    d.appendChild(b);d.appendChild(c);accs.appendChild(d);
  });
  var m=openModal(box);
  $('#tpPrev',box).addEventListener('click',function(){if(i>0)openTopic(i-1,true)});
  $('#tpNext',box).addEventListener('click',function(){if(i<TOPICS.length-1)openTopic(i+1,true)});
  if(!fromNav){Snd.fx('ok');log('Archivo consultado: Tema '+pad(t.n)+' '+t.name)}
}
function setSemTab(n){
  semTab=n;
  $('#tab1').setAttribute('aria-selected',String(n===1));
  $('#tab2').setAttribute('aria-selected',String(n===2));
  $('#view1').hidden=n!==1;$('#view2').hidden=n!==2;
  Snd.scene(n===2?'semestre2':'semestre1');
  if(n===2)renderS2();
}
function renderS2(){
  var v=$('#view2');v.innerHTML='';
  if(CONFIG.SEMESTER2_UNLOCKED){
    if(!SEMESTER2_TOPICS.length){v.innerHTML='<div class="panel"><h3>SEMESTRE 2 // DESBLOQUEADO</h3><p class="ph">El semestre 2 todavía no tiene temas.</p></div>';return}
    var g=h('div','grid');
    SEMESTER2_TOPICS.forEach(function(t,i){
      var b=h('button','card');b.type='button';
      b.innerHTML='<span class="card-n">TEMA '+pad(i+1)+'</span><span class="card-t">'+esc(t.name||'')+'</span><span class="card-d">'+esc(t.desc||'')+'</span>'+levelHTML(t.level||CONFIG.DEFAULT_LEVEL);
      g.appendChild(b);
    });
    v.appendChild(g);return;
  }
  v.innerHTML='<div class="s2"><div class="tape" aria-hidden="true"><span>⚠ RESTRICTED AREA</span><span>⚠ DO NOT CROSS</span><span>⚠ RESTRICTED AREA</span><span>⚠ DO NOT CROSS</span><span>⚠ RESTRICTED AREA</span><span>⚠ DO NOT CROSS</span></div>'+
   '<div class="s2-body"><div class="lock" id="lock" aria-hidden="true">🔒</div>'+
   '<h2>ACCESS DENIED</h2><p class="irr" style="color:#ff6b6b;letter-spacing:2px">⚠ RESTRICTED AREA — AUTHORIZATION REQUIRED</p>'+
   '<p class="irr b" style="color:var(--c2);letter-spacing:2px">DATA CORRUPTED // SEMESTER NOT AVAILABLE</p>'+
   '<p style="max-width:560px;margin:10px auto;color:#b88">Segundo semestre: contenido todavía no desarrollado. Permanecerá bloqueado hasta que llegue el momento de completarlo.</p>'+
   '<button type="button" class="btn" id="s2try">INTENTAR ACCESO</button><div class="denied" id="denied" aria-live="assertive"></div></div>'+
   '<div class="tape" aria-hidden="true" style="transform:rotate(1deg)"><span>⚠ RESTRICTED AREA</span><span>⚠ DO NOT CROSS</span><span>⚠ RESTRICTED AREA</span><span>⚠ DO NOT CROSS</span><span>⚠ RESTRICTED AREA</span><span>⚠ DO NOT CROSS</span></div></div>';
  $('#s2try').addEventListener('click',async function(){
    var l=$('#lock'),d=$('#denied');
    d.textContent='ESCANEANDO CREDENCIALES…';Snd.fx('click');await sleep(700);
    l.classList.remove('deny');void l.offsetWidth;l.classList.add('deny');
    d.textContent='✖ ACCESO DENEGADO ✖';Snd.fx('err');log('Acceso denegado: Semestre 2');
  });
}
$('#tab1').addEventListener('click',function(){setSemTab(1);Snd.fx('click')});
$('#tab2').addEventListener('click',function(){setSemTab(2);Snd.fx('click');log('Zona restringida consultada')});

/* =====================================================================
   APARTADO ESPECIAL
   ===================================================================== */
var espFilter='TODAS';
function renderEspecial(){
  $('#espIntro').textContent=CONFIG.ESPECIAL_INTRO;
  var im=$('#espIntroImg');
  if(CONFIG.ESPECIAL_INTRO_IMG)im.innerHTML=artHTML(CONFIG.ESPECIAL_INTRO_IMG);
  var types=['TODAS'];ENTRIES.forEach(function(e){if(types.indexOf(e.type)<0)types.push(e.type)});
  var f=$('#filters');f.innerHTML='';
  types.forEach(function(t){
    var b=h('button','',t);b.type='button';b.setAttribute('aria-pressed',String(espFilter===t));
    b.addEventListener('click',function(){espFilter=t;Snd.fx('click');renderEspecial()});f.appendChild(b);
  });
  var list=$('#entries');list.innerHTML='';
  ENTRIES.filter(function(e){return espFilter==='TODAS'||e.type===espFilter}).forEach(function(e){
    var a=h('article','entry comic');
    var panels=e.panels||e.paragraphs.map(function(p,i){return {t:i===0?'QUÉ SE EXPLICÓ':'MI EXPERIENCIA',x:p}});
    a.innerHTML='<div class="cm-hero"><div class="geo" data-geo="'+(ENTRIES.indexOf(e)%4)+'" role="img" aria-label="Animación geométrica decorativa"></div><div><span class="tag">'+esc(e.type)+'</span><h3>'+esc(e.title)+'</h3><small>Pulsa una viñeta para desplegarla</small></div></div><div class="cm-grid"></div>';
    var g=a.querySelector('.cm-grid');
    panels.forEach(function(p,i){
      var b=h('button','cm-p');b.type='button';b.setAttribute('aria-expanded','false');
      b.innerHTML='<i>'+pad(i+1)+'</i><b>'+esc(p.t)+'</b><span>'+esc(p.x)+'</span>';
      b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!o));Snd.fx('click')});
      g.appendChild(b);
    });
    list.appendChild(a);if(window.DSA_GEO)DSA_GEO.scan(a);
  });
}

/* =====================================================================
   REFLEXIÓN
   ===================================================================== */
function renderDocs(){
  var d=$('#docs');d.innerHTML='';
  REFLEXIONES.forEach(function(r,i){
    var b=h('button','doc-card '+r.cls);b.type='button';
    b.innerHTML=(r.img?artHTML(r.img,'doc-art'):'')+'<span class="code">'+esc(r.code)+'</span><h3>'+esc(r.title)+'</h3><p>'+esc(r.sub)+'</p><span class="card-go">ABRIR ARCHIVO ▸</span>';
    b.addEventListener('click',function(){openDoc(i)});d.appendChild(b);
  });
}
function openDoc(i){
  var r=REFLEXIONES[i],box=h('div','');
  box.innerHTML='<div class="tp-head"><span class="tag">'+esc(r.code)+'</span><h2>'+esc(r.title)+'</h2></div><div id="dAcc"></div>';
  var acc=$('#dAcc',box);
  r.items.filter(function(it){return it.t&&it.t.trim()}).forEach(function(it,k){
    var d=h('div','acc'),b=h('button','acc-b');b.type='button';b.setAttribute('aria-expanded',k===0?'true':'false');
    b.innerHTML='<b>'+pad(k+1)+'</b> '+esc(it.h)+'<i>'+(k===0?'−':'+')+'</i>';
    var c=h('div','acc-c');c.hidden=k!==0;
    c.innerHTML=paragraphs(it.t);
    b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!o));c.hidden=o;b.lastChild.textContent=o?'+':'−';Snd.fx('click')});
    d.appendChild(b);d.appendChild(c);acc.appendChild(d);
  });
  openModal(box,r.cls==='soft'?'doc-b':'');
  Snd.fx('ok');log('Archivo personal abierto: '+r.code);
}

/* =====================================================================
   CAPRI
   ===================================================================== */
var capri={open:false,welcomed:false,busy:false,timer:0};
var capEl=$('#capri'),fab=$('#capriFab'),msgs=$('#msgs'),capIn=$('#capIn');
function capStatus(s,sig){
  var e=$('#capSt');e.textContent=s;e.setAttribute('data-s',s);
  capEl.classList.toggle('busy',s==='BUSY');capEl.classList.toggle('conn',s==='CONNECTING');
  $('#capSig').setAttribute('data-n',sig||4);
  $('#capWave').classList.toggle('live',s==='ONLINE'||s==='BUSY');
  $('#capSend').disabled=(s!=='ONLINE');
}
function addMsg(txt,cls,go){
  var m=h('div','msg '+cls);
  if(cls==='sys')m.textContent=txt;else m.textContent=txt;
  if(go){
    var b=h('button','go',go.label);b.type='button';
    b.addEventListener('click',function(){capriGo(go)});m.appendChild(b);
  }
  msgs.appendChild(m);msgs.scrollTop=msgs.scrollHeight;
  return m;
}
async function capriOpen(){
  if(capri.open)return;
  capri.open=true;fab.hidden=true;capEl.hidden=false;capEl.classList.remove('closing');
  capStatus('CONNECTING',1);telStart();Snd.fx('call');log('Llamada entrante: CAPRI');
  await sleep(700);capStatus('CONNECTING',2);Snd.fx('call');
  await sleep(700);capStatus('CONNECTING',3);
  await sleep(500);
  if(!capri.open)return;
  capStatus('ONLINE',4);Snd.fx('ok');
  if(!capri.welcomed){
    capri.welcomed=true;
    addMsg('— CONEXIÓN ESTABLECIDA —','sys');
    addMsg('Conexión establecida. Soy CAPRI, tu enlace en Night City. Pregúntame por cualquier tema del Semestre 1… o por la caja fuerte. Esa no te la resuelvo, por cierto.','cap');
  }else addMsg('— RECONECTADO —','sys');
  var oc=window.DSA_ARC&&DSA_ARC.openingComment();if(oc)addMsg(oc,'cap');
  if(window.DSA_ARC)capriDialog('root');
  capIn.focus();
}
async function capriClose(){
  if(!capri.open)return;
  capri.open=false;telStop();capEl.classList.remove('talking');capStatus('DISCONNECTED',0);Snd.fx('hang');
  addMsg('— LLAMADA FINALIZADA —','sys');
  await sleep(600);
  capEl.classList.add('closing');
  await sleep(RM?0:380);
  capEl.hidden=true;fab.hidden=false;fab.classList.add('idle');fab.querySelector('small').textContent='CAPRI';
  try{fab.focus()}catch(e){}
}
function capriAnswer(q){
  var sr=window.DSA_SEC&&DSA_SEC.capri(q);if(sr)return sr;
  if(/^\s*(menu|menú|opciones|conversar|hablar)\s*$/i.test(q))return {t:'Vale, charlamos. Elige.',menu:1};
  var sp=window.DSA_ARC&&DSA_ARC.special(q);if(sp)return sp;
  var n=' '+norm(q).replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ')+' ',best=null,score=0;
  KB.forEach(function(e){
    var s=0;
    e.k.forEach(function(k){
      var w=k.charAt(0)==='=';
      var kk=norm(w?k.slice(1):k);
      if(w){if(n.indexOf(' '+kk+' ')>=0)s+=kk.length+1}
      else if(n.indexOf(kk)>=0)s+=kk.length;
    });
    if(s>score){score=s;best=e}
  });
  if(!best)return {t:pick(KB_FALLBACK)};
  var t=pick(best.a);
  if(best.go&&best.go.topic&&Math.random()<.4)t=pick(KB_OPENERS)+' '+t;
  var go=null;
  if(best.go){
    go={sec:best.go.sec,topic:best.go.topic,label:best.go.topic?'ABRIR TEMA '+pad(best.go.topic)+' ▸':'IR A '+SECS[best.go.sec].split(' //')[0]+' ▸'};
  }
  return {t:t,go:go};
}
function capriDialog(id){
  var old=msgs.querySelectorAll('.msg.opts');Array.prototype.forEach.call(old,function(e){e.remove()});
  var n=DSA_ARC.dialog(id);if(!n)return;
  if(id!=='root'||capri.welcomed&&msgs.querySelectorAll('.msg.cap').length>1)addMsg(n.t,'cap');else addMsg(n.t,'cap');
  var box=h('div','msg opts');
  n.o.forEach(function(o){
    var b=h('button','go',o[0]);b.type='button';
    b.addEventListener('click',function(){
      Snd.fx('click');addMsg(o[0],'me');
      var k=o[1];
      if(k==='end'){capriClose();return}
      if(k.indexOf('go:')===0){
        var w=k.slice(3);
        if(w==='map'){capriClose();openCity()}else if(w==='free'){capriClose();openFree()}else if(w==='arc'){capriClose();DSA_ARC.open('inv')}else{capriClose();curSec='';go(w)}
        return;
      }
      capriDialog(k);
    });
    box.appendChild(b);
  });
  msgs.appendChild(box);msgs.scrollTop=msgs.scrollHeight;
}
function capriGo(g){
  if(g.sec&&g.sec!=='semestres'||!g.topic){curSec='';go(g.sec);return}
  curSec='';go('semestres');setSemTab(1);
  setTimeout(function(){openTopic(g.topic-1)},RM?0:260);
}
capEl.querySelector('#capForm').addEventListener('submit',function(e){
  e.preventDefault();
  var q=capIn.value.trim();
  if(!q||capri.busy||!capri.open)return;
  capIn.value='';Snd.fx('key');
  addMsg(q,'me');
  capri.busy=true;capStatus('BUSY',3);
  var typing=addMsg('▮▮▮ transmitiendo datos…','sys');
  var r=capriAnswer(q);
  setTimeout(function(){
    typing.remove();
    if(!capri.open){capri.busy=false;return}
    var m=addMsg('','cap');
    capEl.classList.add('talking');
    var i=0,txt=r.t;
    (function type(){
      if(RM||i>=txt.length){
        m.textContent=txt;
        if(r.menu&&window.DSA_ARC)capriDialog('root');
        if(r.go){var b=h('button','go',r.go.label);b.type='button';b.addEventListener('click',function(){capriGo(r.go)});m.appendChild(b)}
        msgs.scrollTop=msgs.scrollHeight;capEl.classList.remove('talking');capri.busy=false;if(capri.open)capStatus('ONLINE',4);return;
      }
      i+=3;m.textContent=txt.slice(0,i);msgs.scrollTop=msgs.scrollHeight;
      capri.timer=setTimeout(type,14);
    })();
  },RM?0:650+Math.random()*500);
});
fab.addEventListener('click',capriOpen);
$('#capClose').addEventListener('click',capriClose);

/* Retrato de CAPRI: SVG original estilo anime (netrunner de pelo afilado y ojo cibernético).
   Si CONFIG.CAPRI_IMG tiene URL, se usa esa imagen en su lugar. */
function capriSVG(vb){
  var R='';
  for(var i=0;i<30;i++){var a=i*Math.PI*2/30,c=Math.cos(a),n=Math.sin(a);R+='M'+(100+c*50).toFixed(1)+' '+(95+n*50).toFixed(1)+'L'+(100+c*160).toFixed(1)+' '+(95+n*160).toFixed(1);}
  return [
  '<svg viewBox="'+vb+'" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">',
  '<rect x="-30" y="-30" width="260" height="260" fill="#050a12"/>',
  '<circle class="halo" cx="100" cy="95" r="72"/>',
  '<g class="rays"><path d="'+R+'"/></g>',
  '<path class="hairb" d="M44 110 L14 54 L56 76 L44 14 L84 58 L100 2 L118 58 L158 12 L146 76 L188 50 L158 110 Z"/>',
  '<path class="jacket" d="M12 200 L30 166 L78 150 L100 166 L122 150 L170 166 L188 200 Z"/>',
  '<path class="jacket" d="M78 150 L62 188 L96 180 L100 166 Z"/><path class="jacket" d="M122 150 L138 188 L104 180 L100 166 Z"/>',
  '<path class="stripe" d="M30 166 L40 200 L54 200 L43 163 Z"/><path class="stripe" d="M170 166 L160 200 L146 200 L157 163 Z"/>',
  '<path class="ln2" d="M100 168 L100 200"/>',
  '<path class="skin" d="M84 126 L84 158 L100 172 L116 158 L116 126 Z"/><path class="shd" d="M84 126 L116 126 L116 142 L84 152 Z"/>',
  '<path class="cable" d="M84 140 L68 154 L64 178"/><path class="cable" d="M116 140 L132 154 L136 178"/>',
  '<rect class="stripe" x="95" y="152" width="10" height="3"/>',
  '<path class="skin" d="M58 64 L142 64 L148 100 L134 140 L112 160 L88 160 L66 140 L52 100 Z"/>',
  '<path class="shd" d="M120 64 L142 64 L148 100 L134 140 L112 160 L122 120 Z"/>',
  '<rect class="glowc" x="43" y="100" width="9" height="24" rx="2"/>',
  '<rect class="stripe" x="147" y="98" width="10" height="4"/><rect class="stripe" x="147" y="106" width="10" height="4"/>',
  '<g class="eyeL"><path class="sclera" d="M68 111 L98 106 L96 122 L72 123 Z"/><rect class="iris" x="80" y="108" width="12" height="13"/><rect class="pupil" x="84" y="111" width="5" height="8"/><path class="ink" d="M64 110 L100 104" style="stroke-width:4"/></g>',
  '<circle class="cybR" cx="127" cy="114" r="13"/><circle class="cybC" cx="127" cy="114" r="6.5"/>',
  '<path class="cybX" d="M127 98 L127 105 M127 123 L127 130 M111 114 L118 114 M136 114 L143 114"/><circle cx="125" cy="112" r="2" fill="#fff"/>',
  '<path class="ink" d="M102 127 L106 135 L99 136"/>',
  '<path class="ln2" d="M133 130 L147 126 L145 136"/><path class="ln2" d="M70 128 L76 141"/>',
  '<path class="mopen" d="M88 143 L112 143 L108 153 L92 153 Z"/><rect class="teeth" x="90" y="143" width="20" height="3"/>',
  '<path class="ink" d="M84 143 L116 141 L121 136"/>',
  '<path class="hairf" d="M50 100 L47 54 L72 36 L80 72 L98 40 L110 74 L130 40 L138 74 L160 50 L150 100 L142 84 L130 94 L114 84 L100 96 L86 84 L72 96 Z"/>',
  '<path class="hl" d="M80 60 L90 47 M120 58 L130 46 M138 66 L150 56"/>',
  '<path class="brow" d="M62 93 L100 101"/><path class="brow" d="M110 101 L148 91"/>',
  '</svg>'].join('');
}
(function(){
  var small=CONFIG.CAPRI_IMG?'<img src="'+esc(CONFIG.CAPRI_IMG)+'" alt="">':capriSVG('38 34 124 124');
  var big=CONFIG.CAPRI_IMG?'<img src="'+esc(CONFIG.CAPRI_IMG)+'" alt="">':capriSVG('0 0 200 200');
  $('#fabFace').innerHTML=small;$('#capFace').innerHTML=small;$('#capPort').innerHTML=big;
})();
/* telemetría de la llamada (puro ambiente) */
var telTimer=0;
function telStart(){
  clearInterval(telTimer);
  telTimer=setInterval(function(){
    $('#telPing').textContent=(8+Math.random()*34|0)+' ms';
    $('#telPat').textContent=(Math.random()*40|0)+'%';
  },900);
}
function telStop(){clearInterval(telTimer)}

/* =====================================================================
   LLUVIA DIGITAL (canvas ligero, se pausa si la pestaña no se ve)
   ===================================================================== */
(function(){
  if(RM)return;
  var cv=$('#rain'),cx=cv.getContext('2d'),fs=16,cols=[],last=0;
  var GL='アイウエオカキクケコサシスセソ0123456789ABCDEF<>/|';
  function size(){
    cv.width=root.clientWidth;cv.height=root.clientHeight;
    cols=[];for(var i=0;i<Math.ceil(cv.width/fs);i++)cols.push(Math.random()*cv.height/fs|0);
  }
  function tick(t){
    requestAnimationFrame(tick);
    if(document.hidden||cv.hidden||t-last<60/(window.DSA_RAIN_SPEED||1))return;
    last=t;
    cx.fillStyle='rgba(5,6,10,.14)';cx.fillRect(0,0,cv.width,cv.height);
    cx.fillStyle=rainColor;cx.font=fs+'px monospace';
    for(var i=0;i<cols.length;i++){
      cx.fillText(GL.charAt(Math.random()*GL.length|0),i*fs,cols[i]*fs);
      if(cols[i]*fs>cv.height&&Math.random()>.975)cols[i]=0;
      cols[i]++;
    }
  }
  size();window.addEventListener('resize',size);requestAnimationFrame(tick);
})();

/* =====================================================================
   SECUENCIA DE ARRANQUE
   ===================================================================== */
var bootSkip=false;
async function boot(){
  var out=$('#bootLines'),bar=$('#bootBar');
  var L=[['DSA-BIOS v2.077 ... ','OK','ok'],['Comprobando memoria: 65536 MB ... ','OK','ok'],['Conectando con NIGHT CITY NET ... ','OK','ok'],['Cargando protocolos ICE ... ','OK','ok'],['Montando /archive/semester01 ... ','OK','ok'],['Montando /archive/semester02 ... ','LOCKED','lk'],['Montando /archive/field_records ... ','OK','ok'],['Iniciando enlace CAPRI ... ','SEÑAL ENCONTRADA','ok']];
  for(var i=0;i<L.length;i++){
    if(bootSkip)break;
    var d=h('div','ln '+L[i][2]);d.innerHTML=esc(L[i][0])+'<b>['+L[i][1]+']</b>';out.appendChild(d);
    bar.style.width=Math.round((i+1)/L.length*100)+'%';
    await sleep(300);
  }
  bar.style.width='100%';
  await sleep(350);
  $('#boot').hidden=true;
  log('Conexión establecida con Night City');
}
$('#bootSkip').addEventListener('click',function(){bootSkip=true});
$('#boot').addEventListener('click',function(){bootSkip=true});

/* =====================================================================
   JUEGO DE ENTRADA — mini motor WebGL propio (sin librerías externas)
   Se abre al descifrar la caja fuerte. Si WebGL no está disponible se usa
   un modo ligero con las ilustraciones (misma lógica, sin 3D).
   ===================================================================== */
var STOP_Z=[-24,-64,-104],GATE_Z=-150;

function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

var M4={
  mul:function(a,b){var o=new Float32Array(16);for(var i=0;i<4;i++)for(var j=0;j<4;j++)o[j*4+i]=a[i]*b[j*4]+a[4+i]*b[j*4+1]+a[8+i]*b[j*4+2]+a[12+i]*b[j*4+3];return o},
  persp:function(f,asp,n,fa){var t=1/Math.tan(f/2),m=new Float32Array(16);m[0]=t/asp;m[5]=t;m[10]=(fa+n)/(n-fa);m[11]=-1;m[14]=2*fa*n/(n-fa);return m},
  look:function(e,t,u){
    var zx=e[0]-t[0],zy=e[1]-t[1],zz=e[2]-t[2],l=Math.hypot(zx,zy,zz);zx/=l;zy/=l;zz/=l;
    var xx=u[1]*zz-u[2]*zy,xy=u[2]*zx-u[0]*zz,xz=u[0]*zy-u[1]*zx;l=Math.hypot(xx,xy,xz);xx/=l;xy/=l;xz/=l;
    var yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;
    return new Float32Array([xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,-(xx*e[0]+xy*e[1]+xz*e[2]),-(yx*e[0]+yy*e[1]+yz*e[2]),-(zx*e[0]+zy*e[1]+zz*e[2]),1]);
  },
  trs:function(x,y,z,sx,sy,sz,ry){var c=Math.cos(ry),s=Math.sin(ry);return new Float32Array([c*sx,0,-s*sx,0,0,sy,0,0,s*sz,0,c*sz,0,x,y,z,1])}
};

function makeWorld(cv){
  var gl=cv.getContext('webgl',{antialias:false,alpha:false})||cv.getContext('experimental-webgl');
  if(!gl)throw new Error('sin WebGL');
  var rnd=mulberry(20771),dead=false,raf=0,T=0,last=performance.now(),VP=new Float32Array(16);
  var FOG=.024,FOGC=[.03,.02,.06];
  function pal(v){var a=(getComputedStyle(root).getPropertyValue(v)||'').split(',');return a.length===3?[a[0]/255,a[1]/255,a[2]/255]:[1,1,1]}
  var C1=pal('--c1-rgb'),C2=pal('--c2-rgb'),C3=pal('--c3-rgb'),OKC=[.22,1,.53];
  function css(c){return 'rgb('+(c[0]*255|0)+','+(c[1]*255|0)+','+(c[2]*255|0)+')'}

  /* ---------- shaders ---------- */
  var VS='attribute vec3 aP;attribute vec2 aT;uniform mat4 uM,uVP;uniform vec3 uCam;uniform vec2 uRep;varying vec2 vT;varying float vD;'+
    'void main(){vec4 w=uM*vec4(aP,1.);vD=distance(w.xyz,uCam);vT=aT*uRep;gl_Position=uVP*w;}';
  var FS='precision mediump float;uniform sampler2D uTex;uniform vec4 uCol;uniform vec3 uFogC;uniform float uUse,uAdd,uFog,uAl,uFl;varying vec2 vT;varying float vD;'+
    'void main(){vec4 c=uCol;if(uUse>.5)c*=texture2D(uTex,vT);float k=uFog*vD;float f=1.-exp(-k*k);'+
    'vec3 fc=uFogC*(1.-uAdd);c.rgb=mix(c.rgb*uFl,fc,f);gl_FragColor=vec4(c.rgb,c.a*uAl);}';
  var RVS='attribute vec3 aP;attribute float aE;uniform mat4 uVP;uniform float uT,uCz;varying float vA;'+
    'void main(){float y=mod(aP.y-uT*16.,20.);float z=uCz+5.-mod(uCz+5.-aP.z,50.);'+
    'vA=(.12+.2*(1.-aE))*clamp(1.-(uCz+5.-z)/50.,0.,1.);gl_Position=uVP*vec4(aP.x,y+aE*.9,z,1.);}';
  var RFS='precision mediump float;uniform vec3 uC;varying float vA;void main(){gl_FragColor=vec4(uC,vA);}';
  function sh(t,src){var o=gl.createShader(t);gl.shaderSource(o,src);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o}
  function prog(vs,fs,a1){var p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,vs));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs));gl.bindAttribLocation(p,0,'aP');gl.bindAttribLocation(p,1,a1);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p}
  function locs(p,n){var o={};n.forEach(function(k){o[k]=gl.getUniformLocation(p,k)});return o}
  var P=prog(VS,FS,'aT'),PR=prog(RVS,RFS,'aE');
  var U=locs(P,['uM','uVP','uCam','uRep','uTex','uCol','uFogC','uUse','uAdd','uFog','uAl','uFl']);
  var UR=locs(PR,['uVP','uT','uCz','uC']);
  gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.enableVertexAttribArray(0);gl.enableVertexAttribArray(1);

  /* ---------- geometría ---------- */
  function geo(v,idx,mode,us){var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);var ib=null;if(idx){ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx),gl.STATIC_DRAW)}return{b:b,ib:ib,n:idx?idx.length:v.length/(3+us),mode:mode,us:us}}
  function draw(g){gl.bindBuffer(gl.ARRAY_BUFFER,g.b);var st=(3+g.us)*4;gl.vertexAttribPointer(0,3,gl.FLOAT,false,st,0);gl.vertexAttribPointer(1,g.us,gl.FLOAT,false,st,12);if(g.ib){gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,g.ib);gl.drawElements(g.mode,g.n,gl.UNSIGNED_SHORT,0)}else gl.drawArrays(g.mode,0,g.n)}
  var UV=[0,0,1,0,1,1,0,1];
  function faces(f){var v=[],ix=[];f.forEach(function(q,i){for(var k=0;k<4;k++)v.push(q[k*3],q[k*3+1],q[k*3+2],UV[k*2],UV[k*2+1]);var o=i*4;ix.push(o,o+1,o+2,o,o+2,o+3)});return geo(v,ix,gl.TRIANGLES,2)}
  var cube=faces([[-.5,0,.5,.5,0,.5,.5,1,.5,-.5,1,.5],[.5,0,-.5,-.5,0,-.5,-.5,1,-.5,.5,1,-.5],[.5,0,.5,.5,0,-.5,.5,1,-.5,.5,1,.5],[-.5,0,-.5,-.5,0,.5,-.5,1,.5,-.5,1,-.5],[-.5,1,.5,.5,1,.5,.5,1,-.5,-.5,1,-.5]]);
  var quad=faces([[-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0]]);
  var floor=faces([[-.5,0,.5,.5,0,.5,.5,0,-.5,-.5,0,-.5]]);
  var gv=[],gi;for(gi=-8;gi<=8;gi+=2)gv.push(gi,.02,20,0,0,gi,.02,-280,0,0);for(gi=20;gi>=-280;gi-=4)gv.push(-8,.02,gi,0,0,8,.02,gi,0,0);
  var grid=geo(gv,null,gl.LINES,2);
  var rv=[];for(var ri=0;ri<1500;ri++){var rx=(rnd()*2-1)*7.5,ry=rnd()*20,rz=rnd()*50;rv.push(rx,ry,rz,0,rx,ry,rz,1)}
  var rain=geo(rv,null,gl.LINES,1);

  /* ---------- texturas ---------- */
  function cnv(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;return c}
  function upload(t,c,wrap){gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);var w=wrap?gl.REPEAT:gl.CLAMP_TO_EDGE;gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,w);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,w)}
  function tex(c,wrap){var t=gl.createTexture();upload(t,c,wrap);return t}
  function winTex(cols,p){var c=cnv(128,256),x=c.getContext('2d');x.fillStyle='#090c15';x.fillRect(0,0,128,256);
    for(var r=0;r<16;r++)for(var q=0;q<8;q++){if(rnd()<p){x.fillStyle=cols[rnd()*cols.length|0];x.globalAlpha=.55+rnd()*.45}else{x.fillStyle='#111827';x.globalAlpha=1}x.fillRect(q*16+3,r*16+3,10,9)}
    x.globalAlpha=1;return tex(c,true)}
  var WIN=[winTex([css(C3),css(C2)],.4),winTex([css(C1),'#ff8a00'],.35),winTex([css(C3),'#ffffff'],.3),winTex([css(C2),'#a66bff'],.4)];
  var roadT=(function(){var c=cnv(256,256),x=c.getContext('2d');x.fillStyle='#08090f';x.fillRect(0,0,256,256);
    for(var i=0;i<26;i++){x.fillStyle=rnd()<.5?'rgba(255,42,109,.07)':'rgba(0,240,255,.07)';x.beginPath();x.ellipse(rnd()*256,rnd()*256,10+rnd()*30,4+rnd()*8,0,0,7);x.fill()}
    x.fillStyle=css(C3);x.fillRect(6,0,5,256);x.fillRect(245,0,5,256);x.fillStyle=css(C1);x.fillRect(125,16,6,90);x.fillRect(125,144,6,90);return tex(c,true)})();
  var glowT=(function(){var c=cnv(128,128),x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return tex(c,false)})();
  var frameT=(function(){var c=cnv(512,256),x=c.getContext('2d');x.strokeStyle='#fff';x.lineWidth=10;x.shadowColor='#fff';x.shadowBlur=18;x.strokeRect(14,14,484,228);x.lineWidth=3;x.strokeRect(30,30,452,196);return tex(c,false)})();
  var doorT=(function(){var c=cnv(256,512),x=c.getContext('2d');x.fillStyle='#0d111b';x.fillRect(0,0,256,512);x.fillStyle=css(C1);
    for(var i=-40;i<300;i+=40){x.beginPath();x.moveTo(i,0);x.lineTo(i+20,0);x.lineTo(i+60,36);x.lineTo(i+40,36);x.fill();x.beginPath();x.moveTo(i,476);x.lineTo(i+20,476);x.lineTo(i+60,512);x.lineTo(i+40,512);x.fill()}
    x.strokeStyle=css(C3);x.lineWidth=4;x.strokeRect(14,60,228,390);x.fillStyle=css(C3);x.fillRect(120,70,16,370);return tex(c,false)})();
  function signTex(t,col){var c=cnv(512,128),x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,512,128);var sz=64;x.textAlign='center';x.textBaseline='middle';
    do{x.font='900 '+sz+'px Orbitron,Arial Black,Arial,sans-serif';sz-=4}while(x.measureText(t).width>470&&sz>20);
    x.shadowColor=col;x.shadowBlur=22;x.fillStyle=col;x.fillText(t,256,66);x.shadowBlur=6;x.strokeStyle='#fff';x.lineWidth=2;x.strokeText(t,256,66);return tex(c,false)}
  var gateT=signTex('ACCESO CONCEDIDO',css(C1));
  var imgT={};
  Object.keys(IMAGES).forEach(function(k){var im=new Image();im.crossOrigin='anonymous';im.onload=function(){if(dead)return;var c=cnv(1024,512);c.getContext('2d').drawImage(im,0,0,1024,512);try{imgT[k]=tex(c,false)}catch(e){}};im.src=imgSrc(k)});

  /* ---------- escena ---------- */
  var B=[];
  function row(side,xmin,hmin,hmax,gap){var z=18;while(z>-260){var w=5+rnd()*5,d=5+rnd()*6,hh=hmin+rnd()*(hmax-hmin);var x=side*(xmin+w/2+(xmin>20?rnd()*14:0));
    B.push({x:x,z:z-d/2,w:w,h:hh,d:d,t:rnd()*4|0,rep:[(w+d)/16,hh/19],c:.6+rnd()*.4});z-=d+gap*rnd()+.5}}
  row(-1,8.5,14,58,1.5);row(1,8.5,14,58,1.5);row(-1,24,45,120,5);row(1,24,45,120,5);
  var SIGNS=[['FIREWALL',-1,-10,12,0],['CIFRADO',1,-18,15,1],['SSH :22',-1,-40,16,2],['HTTPS :443',1,-46,13,0],['RAID 1',-1,-72,14,1],['BACKUP 3-2-1',1,-90,17,2],['GPG',-1,-96,12,0],['CPD',1,-118,15,1],['LYNIS',-1,-126,16,2],['OPENMEDIAVAULT',1,-138,13,0]]
    .map(function(a){var col=[C1,C2,C3][a[4]];return{t:signTex(a[0],css(col)),side:a[1],z:a[2],y:a[3],col:col}});
  var BILLS=[['scanner',-1,-4,8],['handoff',1,-30,9],['usb',-1,-56,8.5],['cable',1,-80,9],['padlock',-1,-108,8],['scanner',1,-132,9]]
    .map(function(a,i){return{k:a[0],side:a[1],z:a[2],y:a[3],col:[C1,C2,C3][i%3]}});
  var CARS=[];for(var ci=0;ci<16;ci++)CARS.push({x:(rnd()*2-1)*6.5,y:5+rnd()*20,z:-rnd()*160,v:(6+rnd()*14)*(rnd()<.5?-1:1),len:2+rnd()*3,col:[C1,C2,C3][ci%3]});
  var TERM=STOP_Z.map(function(z,i){return{x:i%2?3.4:-3.4,z:z,ok:false,c:cnv(256,128),t:null}});
  function paintScr(i){var t=TERM[i],x=t.c.getContext('2d'),col=t.ok?css(OKC):css(C2);x.fillStyle='#050a10';x.fillRect(0,0,256,128);x.strokeStyle=col;x.lineWidth=4;x.strokeRect(4,4,248,120);
    x.fillStyle=col;x.textAlign='center';x.font='900 24px Orbitron,Arial,sans-serif';x.fillText('NODO 0'+(i+1),128,44);x.font='700 17px Orbitron,Arial,sans-serif';x.fillText(t.ok?'DESBLOQUEADO':'BLOQUEADO',128,76);
    x.fillRect(28,92,t.ok?200:90,7);if(t.t)upload(t.t,t.c,false);else t.t=tex(t.c,false)}
  TERM.forEach(function(t,i){paintScr(i)});
  var fyaw=TERM.map(function(t){var cx=Math.sin((t.z+7)*.045)*.7;return Math.atan2(-(t.x-cx),7)*.75});

  /* ---------- cámara y estado ---------- */
  var cam={z:14},trav=null,focus=-1,yawB=0,lmx=0,lmy=0,tmx=0,tmy=0,gateGo=false,gateOpen=0;

  function D(g,M,o){o=o||{};gl.uniformMatrix4fv(U.uM,false,M);var c=o.col||[1,1,1,1];gl.uniform4f(U.uCol,c[0],c[1],c[2],c[3]);
    if(o.tex){gl.bindTexture(gl.TEXTURE_2D,o.tex);gl.uniform1f(U.uUse,1)}else gl.uniform1f(U.uUse,0);
    var r=o.rep||[1,1];gl.uniform2f(U.uRep,r[0],r[1]);gl.uniform1f(U.uAdd,o.add?1:0);gl.uniform1f(U.uFog,o.fog==null?FOG:o.fog);gl.uniform1f(U.uAl,o.alpha==null?1:o.alpha);gl.uniform1f(U.uFl,o.fl==null?1:o.fl);
    gl.blendFunc(gl.SRC_ALPHA,o.add?gl.ONE:gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(!o.add);draw(g)}
  function A(c,a){return [c[0],c[1],c[2],a==null?1:a]}

  function frame(now){
    raf=requestAnimationFrame(frame);
    if(dead||document.hidden){last=now;return}
    var dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;
    var dpr=Math.min(window.devicePixelRatio||1,1.5),W=Math.max(2,cv.clientWidth*dpr|0),H=Math.max(2,cv.clientHeight*dpr|0);
    if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
    gl.viewport(0,0,W,H);
    var moving=false;
    if(trav){trav.t+=dt;var k=Math.min(1,trav.t/trav.d),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;cam.z=trav.a+(trav.b-trav.a)*e;moving=k<1;if(k>=1){var cb=trav.cb;trav=null;if(cb)cb()}}
    lmx+=(tmx-lmx)*Math.min(1,dt*4);lmy+=(tmy-lmy)*Math.min(1,dt*4);
    yawB+=((focus>=0?fyaw[focus]:0)-yawB)*Math.min(1,dt*2.2);
    var mv=moving&&!RM;
    var eye=[Math.sin(cam.z*.045)*.7,1.7+(mv?Math.sin(T*9)*.045:0),cam.z];
    var yaw=yawB-lmx*.26,pit=-lmy*.1+(mv?Math.sin(T*4.5)*.01:0),roll=mv?Math.sin(T*4.5)*.008:0,cp=Math.cos(pit);
    var fw=[-Math.sin(yaw)*cp,Math.sin(pit),-Math.cos(yaw)*cp];
    VP=M4.mul(M4.persp(1.15,W/H,.1,400),M4.look(eye,[eye[0]+fw[0],eye[1]+fw[1],eye[2]+fw[2]],[Math.sin(roll),Math.cos(roll),0]));
    if(gateGo&&gateOpen<1)gateOpen=Math.min(1,gateOpen+dt/3.2);
    gl.clearColor(FOGC[0],FOGC[1],FOGC[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.useProgram(P);gl.uniformMatrix4fv(U.uVP,false,VP);gl.uniform3fv(U.uCam,eye);gl.uniform3fv(U.uFogC,FOGC);gl.uniform1i(U.uTex,0);

    /* --- opacos --- */
    D(floor,M4.trs(0,-.03,-130,140,1,300,0),{col:[.02,.025,.04,1]});
    D(floor,M4.trs(0,0,-130,16,1,300,0),{tex:roadT,rep:[1,56]});
    for(var i=0;i<B.length;i++){var b=B[i];if(b.z>cam.z+30||b.z<cam.z-210)continue;D(cube,M4.trs(b.x,0,b.z,b.w,b.h,b.d,0),{tex:WIN[b.t],rep:b.rep,col:[b.c,b.c,b.c,1]})}
    BILLS.forEach(function(bl){if(bl.z>cam.z+25||bl.z<cam.z-170)return;var ry=bl.side<0?1.2:-1.2,y=bl.y+Math.sin(T*.8+bl.z)*.15,fl=Math.sin(T*23+bl.z)>.985?.35:1,tx=imgT[bl.k];
      D(quad,M4.trs(bl.side*8.3,y,bl.z,6.4,3.6,1,ry),tx?{tex:tx,fl:fl}:{col:[.08,.09,.14,1]})});
    TERM.forEach(function(t,i){if(t.z>cam.z+25||t.z<cam.z-170)return;D(cube,M4.trs(t.x,0,t.z,.9,1.5,.9,0),{col:[.07,.09,.14,1]});D(quad,M4.trs(t.x,2.15,t.z+.2,1.7,.85,1,t.x<0?.4:-.4),{tex:t.t})});
    D(cube,M4.trs(-8.8,0,GATE_Z,2.2,18,2.4,0),{col:[.07,.08,.12,1]});D(cube,M4.trs(8.8,0,GATE_Z,2.2,18,2.4,0),{col:[.07,.08,.12,1]});D(cube,M4.trs(0,15,GATE_Z,20,3,2.4,0),{col:[.07,.08,.12,1]});
    var dx=3.6+gateOpen*7.4;D(cube,M4.trs(-dx,0,GATE_Z,7.2,13.5,.9,0),{tex:doorT});D(cube,M4.trs(dx,0,GATE_Z,7.2,13.5,.9,0),{tex:doorT});

    /* --- luminosos (aditivo) --- */
    D(grid,M4.trs(0,0,0,1,1,1,0),{add:true,col:A(C3,.22)});
    D(quad,M4.trs(0,24,-235,170,80,1,0),{tex:glowT,add:true,col:A(C2,1),alpha:.4,fog:0});
    D(quad,M4.trs(-40,10,-200,90,60,1,0),{tex:glowT,add:true,col:A(C3,1),alpha:.25,fog:0});
    SIGNS.forEach(function(sg){if(sg.z>cam.z+25||sg.z<cam.z-170)return;var fl=Math.sin(T*17+sg.z*3)>.97?.3:1;D(quad,M4.trs(sg.side*8.3,sg.y,sg.z,7.5,1.9,1,sg.side<0?1.2:-1.2),{tex:sg.t,add:true,fl:fl,fog:.015})});
    BILLS.forEach(function(bl){if(bl.z>cam.z+25||bl.z<cam.z-170)return;D(quad,M4.trs(bl.side*8.28,bl.y+Math.sin(T*.8+bl.z)*.15,bl.z,6.95,3.95,1,bl.side<0?1.2:-1.2),{tex:frameT,add:true,col:A(bl.col),fog:.012})});
    CARS.forEach(function(c){c.z+=c.v*dt;if(c.z<cam.z-140)c.z=cam.z+30;else if(c.z>cam.z+35)c.z=cam.z-140;D(quad,M4.trs(c.x,c.y,c.z,c.len,.14,1,1.5708),{add:true,col:A(c.col),fog:.01})});
    TERM.forEach(function(t,i){if(t.z>cam.z+25||t.z<cam.z-170)return;var col=t.ok?OKC:C2,pu=1+.12*Math.sin(T*3+i);
      D(quad,M4.trs(t.x,2.15,t.z+.3,3.6*pu,3.6*pu,1,0),{tex:glowT,add:true,col:A(col),alpha:.7,fog:.008});
      D(quad,M4.trs(t.x,7,t.z,1.4,14,1,0),{tex:glowT,add:true,col:A(col),alpha:.45+.15*Math.sin(T*3+i),fog:0})});
    D(quad,M4.trs(-7.6,8,GATE_Z+1.25,.25,16,1,0),{add:true,col:A(C1),fog:0});D(quad,M4.trs(7.6,8,GATE_Z+1.25,.25,16,1,0),{add:true,col:A(C1),fog:0});
    D(quad,M4.trs(0,16.7,GATE_Z+1.3,12,3,1,0),{tex:gateT,add:true,fog:0});
    D(quad,M4.trs(0,9,GATE_Z+2,34,44,1,0),{tex:glowT,add:true,col:A(C3),alpha:.3,fog:0});
    if(gateOpen>0)D(quad,M4.trs(0,7,GATE_Z-1.2,16,15,1,0),{tex:glowT,add:true,col:[.85,1,1,1],alpha:Math.min(1,gateOpen*1.6),fog:0});
    gl.useProgram(PR);gl.uniformMatrix4fv(UR.uVP,false,VP);gl.uniform1f(UR.uT,T);gl.uniform1f(UR.uCz,cam.z);gl.uniform3f(UR.uC,C3[0],C3[1],C3[2]);
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.depthMask(false);draw(rain);
  }
  function proj(x,y,z,rc){var m=VP,cx=m[0]*x+m[4]*y+m[8]*z+m[12],cy=m[1]*x+m[5]*y+m[9]*z+m[13],cw=m[3]*x+m[7]*y+m[11]*z+m[15];if(cw<=0)return null;return{x:(cx/cw*.5+.5)*rc.width,y:(1-(cy/cw*.5+.5))*rc.height}}
  function pick(px,py){var rc=cv.getBoundingClientRect(),best=-1,bd=1e9;TERM.forEach(function(t,i){var p=proj(t.x,2.1,t.z,rc);if(!p)return;var d=Math.hypot(p.x-(px-rc.left),p.y-(py-rc.top));if(d<90&&d<bd){bd=d;best=i}});return best}
  cv.addEventListener('webglcontextlost',function(e){e.preventDefault();dead=true});
  raf=requestAnimationFrame(frame);
  return{kind:'gl',
    look:function(x,y){tmx=x;tmy=y},
    travel:function(z,ms,cb){trav={a:cam.z,b:z,t:0,d:RM?.05:ms/1000,cb:cb}},
    focus:function(i){focus=i},
    solve:function(i){TERM[i].ok=true;paintScr(i)},
    openGate:function(){gateGo=true},
    pick:pick,
    destroy:function(){dead=true;cancelAnimationFrame(raf);try{var x=gl.getExtension('WEBGL_lose_context');if(x)x.loseContext()}catch(e){}}
  };
}

/* Modo ligero (sin WebGL): mismas fases, fondo con las ilustraciones animadas */
function makeLite(){
  var el=$('#gLite'),k=$('#gLiteK'),keys=Object.keys(IMAGES),n=0;
  el.hidden=false;el.classList.remove('open');
  function show(){k.style.backgroundImage='var(--i-'+keys[n%keys.length]+')';n++}
  show();
  return{kind:'lite',look:function(){},focus:function(){},solve:function(){},pick:function(){return -1},
    travel:function(z,ms,cb){el.classList.add('moving');show();setTimeout(function(){el.classList.remove('moving');if(cb)cb()},RM?50:Math.min(ms,1800))},
    openGate:function(){el.classList.add('open')},
    destroy:function(){el.hidden=true;el.classList.remove('open','moving')}};
}

/* ---------- controlador del juego ---------- */
var game={on:false,r:null,i:0,solved:[],timers:[],ended:false,ct:0};
function gT(fn,ms){var t=setTimeout(fn,RM?Math.min(ms,60):ms);game.timers.push(t);return t}
function comm(txt){$('#gCommTxt').textContent=txt;var c=$('#gComm');c.classList.add('talking');clearTimeout(game.ct);game.ct=setTimeout(function(){c.classList.remove('talking')},Math.min(3600,txt.length*45))}
function nodesUI(){var n=game.solved.filter(Boolean).length;$('#gNodes').innerHTML='NODOS <b>'+n+'/'+CHALLENGES.length+'</b>'+CHALLENGES.map(function(c,i){return '<i class="'+(game.solved[i]?'on':'')+'"></i>'}).join('')}
function launchGame(){
  if(game.on)return;
  game.on=true;game.ended=false;game.r=null;game.i=0;game.solved=CHALLENGES.map(function(){return false});
  var g=$('#game'),dk=$('.dock');g.hidden=false;g.style.bottom=((dk&&dk.offsetHeight)||44)+'px';
  root.classList.add('ingame');
  $('#gIntro').hidden=false;$('#gEnd').hidden=true;$('#gCh').hidden=true;$('#gAct').hidden=true;$('#gFlash').className='g-flash';$('#gCommTxt').textContent='';
  var bar=$('#gIntro .bar i');bar.style.animation='none';void bar.offsetWidth;bar.style.animation='';
  nodesUI();Snd.scene('juego');Snd.start();Snd.fx('glitch');log('Portal abierto: juego de entrada iniciado');
  gT(startWorld,2800);
}
function startWorld(){
  if(!game.on||game.r||game.ended)return;
  $('#gIntro').hidden=true;
  try{game.r=makeWorld($('#gCv'))}catch(e){game.r=makeLite();log('Modo ligero activado (WebGL no disponible)')}
  comm(CAPRI_LINES.start);
  gT(nextStop,1500);
}
function nextStop(){
  if(!game.on||game.ended||!game.r)return;
  var i=game.solved.indexOf(false);
  if(i<0){finalRun();return}
  game.i=i;$('#gAct').hidden=true;game.r.focus(-1);
  game.r.travel(STOP_Z[i]+7,i===0?4200:3400,function(){arrived(i)});
}
function arrived(i){
  if(!game.on||game.ended)return;
  game.r.focus(i);
  var a=$('#gAct');a.textContent='HACKEAR TERMINAL 0'+(i+1)+' ▸';a.hidden=false;try{a.focus()}catch(e){}
  comm(CAPRI_LINES.arrive[i]||CAPRI_LINES.arrive[0]);Snd.fx('call');
}
function openChallenge(i){
  if(!game.on||game.ended||game.i!==i||game.solved[i]||!$('#gCh').hidden)return;
  var c=CHALLENGES[i],ch=$('#gCh'),o=$('#gOpts');
  $('#gAct').hidden=true;ch.hidden=false;
  $('#gChNode').textContent=c.node;$('#gChQ').textContent=c.q;$('#gFb').textContent='';$('#gNext').hidden=true;o.innerHTML='';
  c.opts.forEach(function(t,k){var b=h('button','g-opt');b.type='button';b.innerHTML='<b>'+(k+1)+'</b>'+esc(t);b.addEventListener('click',function(){answer(i,k,b)});o.appendChild(b)});
  Snd.fx('hack');if(o.firstChild)try{o.firstChild.focus()}catch(e){}
}
function answer(i,k,btn){
  var c=CHALLENGES[i];if(game.solved[i])return;
  if(k===c.ok){
    game.solved[i]=true;btn.classList.add('ok');$$('#gOpts .g-opt').forEach(function(b){b.disabled=true});
    $('#gFb').innerHTML='<b style="color:var(--ok)">ACCESS GRANTED.</b> '+esc(c.why);
    Snd.fx('ok');game.r.solve(i);nodesUI();comm(CAPRI_LINES.ok[i%CAPRI_LINES.ok.length]);
    var n=$('#gNext');n.hidden=false;n.textContent=game.solved.every(Boolean)?'ABRIR LA PUERTA ▸':'SIGUIENTE NODO ▸';try{n.focus()}catch(e){}
    log('Nodo '+pad(i+1)+' hackeado');
  }else{
    btn.classList.add('bad');btn.disabled=true;Snd.fx('err');
    $('#gFb').innerHTML='<b style="color:var(--bad)">ICE DETECTADO.</b> Respuesta incorrecta, prueba otra.';
    var ch=$('#gCh');ch.classList.remove('shake');void ch.offsetWidth;ch.classList.add('shake');
    comm(CAPRI_LINES.bad[Math.random()*CAPRI_LINES.bad.length|0]);
  }
}
function finalRun(){
  comm(CAPRI_LINES.gate);game.r.openGate();Snd.fx('boom');
  game.r.travel(GATE_Z-16,5200,function(){
    if(!game.on||game.ended)return;
    $('#gFlash').classList.add('on');Snd.fx('glitch');
    gT(function(){showEnd(false)},950);
  });
}
function showEnd(skipped){
  if(game.ended)return;game.ended=true;
  game.timers.forEach(clearTimeout);game.timers=[];
  if(game.r){game.r.destroy();game.r=null}
  $('#gCh').hidden=true;$('#gAct').hidden=true;$('#gFlash').className='g-flash';
  $('#gEndMsg').textContent=CONFIG.SAFE_FINAL_MESSAGE;
  $('#gEnd').hidden=false;try{$('#gEndGo').focus()}catch(e){}
  if(!skipped)Snd.fx('ok');
  log(skipped?'Juego omitido':'Juego completado: acceso concedido');
  var vi=$('#vaultIn');vi.innerHTML='';
  vi.appendChild(h('div','file','▣ FRAGMENTO RECUPERADO'));
  var p=h('div','',CONFIG.SAFE_FINAL_MESSAGE);p.style.fontSize='13px';vi.appendChild(p);
  var rb=h('button','tbtn','JUGAR DE NUEVO');rb.type='button';rb.style.marginTop='6px';rb.addEventListener('click',function(){launchGame()});vi.appendChild(rb);
  var vt=$('#vault');vt.style.height='auto';vt.style.minHeight='120px';
}
function closeGame(sec){
  game.on=false;$('#game').hidden=true;$('#gLite').hidden=true;root.classList.remove('ingame');Snd.scene('inicio');
  if(sec){curSec='';go(sec)}
}
function gameSkip(){if(game.on&&!game.ended)showEnd(true)}
function initGame(){
  $('#gFace').innerHTML=capriSVG('38 34 124 124');
  $('#gAct').addEventListener('click',function(){openChallenge(game.i)});
  $('#gNext').addEventListener('click',function(){$('#gCh').hidden=true;nextStop()});
  $('#gSkip').addEventListener('click',gameSkip);
  $('#gEndGo').addEventListener('click',function(){closeGame('semestres')});
  $('#gEndStay').addEventListener('click',function(){closeGame()});
  $('#gIntro').addEventListener('click',startWorld);
  $('#game').addEventListener('pointermove',function(e){if(!game.r)return;var b=this.getBoundingClientRect();game.r.look((e.clientX-b.left)/b.width*2-1,(e.clientY-b.top)/b.height*2-1)});
  $('#gCv').addEventListener('click',function(e){if(!game.r||game.r.kind!=='gl'||$('#gAct').hidden)return;var i=game.r.pick(e.clientX,e.clientY);if(i>=0&&i===game.i)openChallenge(i)});
  document.addEventListener('keydown',function(e){
    if(!game.on||$('#gCh').hidden)return;
    var n=parseInt(e.key,10);if(n>=1&&n<=9){var b=$$('#gOpts .g-opt')[n-1];if(b&&!b.disabled)b.click()}
  });
}

/* =====================================================================
   INICIALIZACIÓN
   ===================================================================== */
applyImages();
renderHome();initSafe();initGame();renderGrid();renderEspecial();renderDocs();
if(CONFIG.SEMESTER2_UNLOCKED){
  $('#tab2s').textContent='UNLOCKED // ACCESS GRANTED';$('#tab2').classList.remove('no');$('#tab2').classList.add('ok');
}
window.DSA_API={root:root,h:h,esc:esc,store:store,fx:function(k){Snd.fx(k)},log:log,openModal:openModal,closeModal:closeModal,snd:Snd,go:function(s){curSec='';go(s)},closeAll:function(){closeCity();closeModal(true)}};
if(window.DSA_SEC)DSA_SEC.init(DSA_API);
if(window.DSA_MOTION)DSA_MOTION.init(root,RM,FINE);
if(window.DSA_GEO)DSA_GEO.scan(root);
if(window.DSA_ARC){DSA_ARC.init(DSA_API);var bA=$('#btnArc');if(bA)bA.addEventListener('click',function(){Snd.fx('click');DSA_ARC.open('inv')})}
var free=null;
function closeFree(){if(free){try{free.destroy()}catch(e){}free=null}Snd.scene(curSecScene())}
function curSecScene(){return {inicio:'inicio',semestres:'semestre1',especial:'inicio',reflexion:'reflexion'}[(root.getAttribute('data-sec')||'inicio')]||'inicio'}
function openFree(){
  closeFree();closeCity();closeModal(true);
  var dk=$('.dock'),wrap=h('div','');root.appendChild(wrap);
  try{
    free=DSA_GTA.create(wrap,{h:h,esc:esc,fx:function(k){Snd.fx(k)},store:store,snd:Snd,log:log,reduced:RM,capriSVG:capriSVG,openModal:openModal,closeModal:closeModal,
      exit:function(){var w=wrap;closeFree();w.remove()}});
    var g=wrap.querySelector('.gta');if(g)g.style.bottom=((dk&&dk.offsetHeight)||44)+'px';
    window.DSA_FREE=free;log('Modo libre iniciado');
  }catch(err){wrap.remove();free=null;log('Error en modo libre: '+err.message)}
}
$('#btnFree').addEventListener('click',function(){Snd.fx('glitch');openFree()});
$('#btnSec').addEventListener('click',function(){Snd.fx('click');DSA_SEC.openPanel()});
Snd.ui();
go('inicio',true);
log('Sistema listo');
boot();
})();
