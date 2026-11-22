/* =====================================================================
   CONTENIDO ACADÉMICO — parte teórica y técnica de referencia.
   Se mezcla con TOPICS desde main.js (clave = número de tema).
   REGLAS: aquí solo hay explicación técnica general. Las prácticas hechas,
   tus experiencias, lo aprendido y las conclusiones quedan PENDIENTES
   hasta que los aportes tú. No se inventa ninguna actividad.
   Cada bloque se separa con una línea en blanco.
   ===================================================================== */
window.DSA_CONTENT={
4:{
intro:`Lynis es una herramienta de auditoría de seguridad para sistemas Linux y otros Unix. Revisa la configuración del equipo, comprueba cosas como servicios, permisos, usuarios, red y actualizaciones, y al final entrega un informe con advertencias, sugerencias y una puntuación.`,
tecnico:`EL ÍNDICE Y LOS COLORES

Al terminar la auditoría, Lynis muestra un índice de refuerzo (hardening index): una puntuación que resume cuánto está reforzado el sistema. Cuanto más alto, mejor configurado está. No es una garantía de seguridad, es una medida orientativa de qué se ha revisado y qué se cumple.

Durante la auditoría, cada comprobación se muestra con un color para que se lea de un vistazo:

Verde: la comprobación es correcta, no hay nada que corregir.

Amarillo: hay algo mejorable o una sugerencia. No es un fallo grave, pero conviene revisarlo.

Rojo: hay un problema o una advertencia que requiere atención.

COMANDO BÁSICO (referencia general)

lynis audit system. Ejecuta una auditoría completa del sistema. Suele ejecutarse con privilegios de administrador para poder revisar todo.

[ A REVISAR ] Comprueba con tus apuntes qué puntuaciones del índice se consideraban buenas o malas en clase y qué comandos usasteis, para no afirmar nada que no se viera.`,
experiencia:`En clase vimos, de forma técnica, qué significaba cada color que muestra Lynis (rojo, verde y amarillo) y qué es el índice que aparece al final de la auditoría.

[ PENDIENTE ] Qué hicisteis exactamente con el programa y qué resultado obtuvisteis.`,
impacto:`Una auditoría periódica ayuda a detectar configuraciones débiles antes de que las aproveche un atacante. Los colores permiten priorizar: primero lo rojo, después lo amarillo.`
},
9:{
intro:`Un CPD (Centro de Procesamiento de Datos) es la instalación donde se alojan los servidores y equipos que almacenan y procesan la información de una organización, junto con los sistemas que los mantienen funcionando: alimentación eléctrica, refrigeración y seguridad.`,
experiencia:`Además de la teoría y una práctica con Juan Carlos, el profesor nos llevó arriba a ver el servidor y cómo funciona uno de verdad. Me llamó la atención que era pequeño y que estaba muy encerrado: se sobrecalentaba mucho, así que necesitaba ventilación y mucho aire.

[ PENDIENTE ] Detalles de la práctica con Juan Carlos y cualquier otra cosa que quieras añadir.`,
impacto:`La visita muestra por qué la refrigeración importa: un equipo que se sobrecalienta se degrada o se para, y eso afecta a la disponibilidad. Es la razón por la que un CPD cuida la ventilación, la temperatura y el espacio alrededor de los equipos.`
},
1:{
intro:`La seguridad informática es el conjunto de medidas, técnicas y hábitos que protegen la información y los sistemas que la manejan frente a accesos no autorizados, daños o pérdidas.

Protegemos la información en tres momentos: cuando se almacena (un disco, una base de datos), cuando se procesa (un programa que la usa) y cuando se transmite (un correo, una llamada cifrada, una conexión web). Un ejemplo cotidiano es el teléfono móvil: las comunicaciones van cifradas para que nadie las lea por el camino. Otro es la web de una empresa, donde algunas zonas (el panel de administración, los datos de clientes) solo se abren a usuarios autorizados.

No existe la seguridad absoluta. Siempre queda alguna vulnerabilidad desconocida, un error humano o un atacante con más recursos. Por eso el objetivo real es reducir el riesgo a un nivel aceptable, y ese nivel depende del presupuesto, de la formación de técnicos y usuarios y del valor de lo que se protege.`,
tecnico:`OBJETIVOS DE LA SEGURIDAD

Confidencialidad: solo accede a la información quien está autorizado. Integridad: la información no se altera sin que se detecte. Disponibilidad: los datos y servicios están accesibles cuando se necesitan. Autenticidad: se puede comprobar que quien dice ser alguien lo es. No repudio: quien envía o recibe algo no puede negarlo después.

QUÉ PROTEGEMOS

Equipos (hardware), aplicaciones (software), datos y comunicaciones. El dato suele ser el elemento más valioso y el más difícil de reponer.

SEGURIDAD FÍSICA Y LÓGICA

La física protege el entorno material: control de acceso a salas, climatización, suministro eléctrico, protección contra incendios. La lógica protege lo que hay dentro: contraseñas, permisos, cifrado, antivirus, cortafuegos.

SEGURIDAD ACTIVA Y PASIVA

La activa intenta evitar el incidente (contraseñas, cifrado, cortafuegos, antivirus). La pasiva minimiza las consecuencias cuando el incidente ya ha ocurrido (copias de seguridad, sistemas de alimentación ininterrumpida, redundancia).

AMENAZAS, VULNERABILIDADES Y MECANISMOS

Una amenaza es algo que puede causar daño. Una vulnerabilidad es un punto débil que la amenaza puede aprovechar. Un mecanismo de protección es la medida que reduce el riesgo. Las amenazas sobre la información se clasifican en cuatro tipos: interrupción (el recurso deja de estar disponible), interceptación (alguien accede sin permiso), modificación (se altera el contenido) y fabricación (se crea información falsa).

TIPOS DE AMENAZAS Y ATAQUES

Malware: software malicioso. Incluye virus, gusanos (se propagan solos por la red), troyanos (se hacen pasar por programas legítimos) y spyware (espía la actividad del usuario). Keylogger: registra lo que se teclea para robar contraseñas. Ingeniería social: engañar a la persona en lugar de atacar la máquina. Phishing: correos o mensajes falsos que imitan a una entidad para robar datos. Fuerza bruta: probar combinaciones hasta acertar una contraseña. Spoofing: suplantar una identidad (una IP, un correo, una web). Sniffing: capturar tráfico de red para leerlo. DDoS: saturar un servicio con tráfico desde muchos equipos para que deje de responder.

PERFILES DE ATACANTES

Hacker (conocimiento técnico, no necesariamente malicioso), cracker (rompe sistemas con fines ilícitos), script kiddie (usa herramientas ajenas sin entenderlas), desarrollador de malware, sniffer (captura tráfico) y ciberterrorista (motivación ideológica o política).

BUENAS PRÁCTICAS

Contraseñas largas y distintas por servicio, autenticación en dos pasos, actualizaciones al día, copias de seguridad, no abrir adjuntos ni enlaces dudosos, mínimo privilegio y formación continua.

LEGISLACIÓN Y PROTECCIÓN DE DATOS

En España y la Unión Europea la protección de datos personales se regula con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).

[ A REVISAR ] En tus materiales aparecen los niveles de seguridad básico, medio y alto. Esa clasificación existió en la normativa antigua de protección de datos (Real Decreto 1720/2007), que quedó superada por el RGPD. Hoy el Esquema Nacional de Seguridad usa las categorías básica, media y alta. Revisa en qué contexto los cita tu profesor antes de presentarlos como vigentes.

[ A REVISAR ] La sigla «LUP» que aparece en tus apuntes no se ha interpretado: no está claro su significado y no se ha inventado.

[ PENDIENTE ] Prácticas y actividades de clase de este tema (añádelas tú).`,
impacto:`Todo el resto de temas del curso aplica estos conceptos. El cifrado protege la confidencialidad, los hashes y las firmas protegen la integridad y la autenticidad, y las copias y la redundancia protegen la disponibilidad. Entender la tríada y la diferencia entre amenaza y vulnerabilidad permite razonar qué protección tiene sentido en cada caso, en lugar de aplicar medidas sin criterio.`
},
2:{
intro:`Docker es una plataforma para empaquetar una aplicación y todo lo que necesita (librerías, configuración) en una unidad llamada contenedor, que se ejecuta igual en cualquier equipo con Docker.

Un contenedor es un proceso aislado que comparte el núcleo (kernel) del sistema operativo anfitrión. No incluye un sistema operativo completo, por eso arranca en segundos y ocupa poco.`,
tecnico:`CONTENEDORES Y MÁQUINAS VIRTUALES

Una máquina virtual emula hardware y ejecuta un sistema operativo completo encima de un hipervisor: es más pesada, más aislada y tarda más en arrancar. Un contenedor comparte el kernel del anfitrión: es más ligero y rápido, pero el aislamiento es menor porque todos dependen del mismo núcleo.

ARQUITECTURA

Docker funciona con el modelo cliente-servidor. El cliente (comando docker) envía órdenes al demonio (dockerd), que gestiona imágenes, contenedores, redes y volúmenes. Una imagen es una plantilla de solo lectura; un contenedor es una instancia en ejecución de una imagen; un registro (Docker Hub) almacena imágenes que se descargan con pull.

COMPROBAR QUE DOCKER FUNCIONA

Comando: docker --version. Sirve para ver la versión instalada.

Comando: docker run hello-world. Descarga una imagen mínima y la ejecuta. Si se muestra el mensaje de bienvenida, la instalación y la conexión con el demonio funcionan.

COMANDOS BÁSICOS (referencia general)

docker pull imagen. Descarga una imagen del registro. Ejemplo: docker pull nginx. Resultado: la imagen queda disponible en local.

docker images. Lista las imágenes descargadas.

docker run [opciones] imagen. Crea y arranca un contenedor. Opciones frecuentes: -d (segundo plano), -p 8080:80 (publica el puerto 80 del contenedor en el 8080 del equipo), --name nombre (le da nombre), -it (modo interactivo con terminal). Ejemplo: docker run -d -p 8080:80 --name web nginx. Resultado: un servidor web accesible en el puerto 8080.

docker ps. Lista los contenedores en ejecución. Con -a muestra también los parados.

docker stop nombre / docker start nombre. Detiene o reanuda un contenedor.

docker logs nombre. Muestra lo que el contenedor ha escrito por pantalla.

docker exec -it nombre bash. Abre una terminal dentro de un contenedor en marcha.

docker rm nombre / docker rmi imagen. Eliminan un contenedor o una imagen.

[ PENDIENTE ] Los comandos exactos que usaste en las prácticas de clase. Pásame tus apuntes y los ordeno con su sintaxis y ejemplo respetando los tuyos.`,
impacto:`Los contenedores permiten desplegar servicios de forma rápida y reproducible. En seguridad ayudan a aislar aplicaciones, pero no sustituyen a otras medidas: una imagen descargada de origen dudoso puede contener malware, y un contenedor mal configurado puede dar acceso al anfitrión.`
},
3:{
intro:`La criptografía es la técnica que transforma un mensaje legible (texto plano) en otro ilegible (texto cifrado) para que solo quien conozca la clave pueda recuperarlo. El proceso de convertir es cifrar y el inverso, descifrar.

Se usa para proteger la confidencialidad de la información almacenada y transmitida, y también, combinada con otras técnicas, para garantizar integridad y autenticidad.`,
tecnico:`ELEMENTOS

Texto plano: el mensaje original. Algoritmo: el método matemático de cifrado, que puede ser público. Clave: el dato secreto que controla el resultado. Texto cifrado: el resultado, ilegible sin la clave. La seguridad no debe depender de ocultar el algoritmo, sino de proteger la clave.

CRIPTOGRAFÍA SIMÉTRICA

Se usa la misma clave para cifrar y descifrar. Es rápida y adecuada para grandes cantidades de datos. Su problema es cómo compartir la clave de forma segura entre las dos partes. Ejemplo de algoritmo: AES.

CRIPTOGRAFÍA ASIMÉTRICA

Cada usuario tiene un par de claves: pública (se comparte) y privada (se guarda en secreto). Lo cifrado con la pública solo lo descifra la privada, y viceversa. Resuelve el problema de compartir claves, pero es más lenta. Ejemplo de algoritmo: RSA. En la práctica se combinan: la asimétrica protege el intercambio de una clave simétrica con la que se cifra el resto.

COMPARACIÓN

Simétrica: una clave, muy rápida, problema de distribución. Asimétrica: dos claves, más lenta, no necesita compartir un secreto previo, permite firma digital.

FUNCIONES HASH

Un hash convierte cualquier dato en una huella de longitud fija. Es unidireccional (no se puede revertir) y un pequeño cambio en el dato cambia la huella por completo. Sirve para comprobar integridad, no para ocultar contenido.

RELACIÓN CON LOS OBJETIVOS

Confidencialidad: cifrado. Integridad: hash. Autenticación y no repudio: firma digital con clave privada.

[ PENDIENTE ] Ejercicios y prácticas de criptografía hechos en clase.`,
impacto:`Está presente en HTTPS, en las aplicaciones de mensajería, en las redes privadas, en las contraseñas almacenadas y en las firmas de documentos. Sus límites: un algoritmo sólido no protege si la clave es débil o se filtra.`
},
5:{
intro:`CyberChef es una herramienta web, gratuita y de código abierto, que sirve para aplicar operaciones sobre datos: codificar, decodificar, cifrar, descifrar, calcular hashes y analizar contenido. Funciona en el navegador y no necesita instalación.`,
tecnico:`INTERFAZ

La pantalla tiene cuatro zonas: la lista de operaciones (a la izquierda, con buscador y categorías), la receta (Recipe, donde se colocan las operaciones elegidas), la entrada (Input, donde se pega o escribe el dato) y la salida (Output, el resultado).

CÓMO FUNCIONA

Se arrastra una operación a la receta, se escribe el dato en la entrada y el resultado aparece en la salida. Se pueden encadenar varias operaciones: la salida de cada una es la entrada de la siguiente. Una receta es esa cadena de operaciones ordenada, que se puede guardar y reutilizar.

CODIFICAR NO ES CIFRAR

Codificar (por ejemplo Base64 o hexadecimal) cambia la representación de un dato sin ninguna clave: cualquiera puede deshacerlo. Cifrar exige una clave para volver al original. CyberChef incluye ambos tipos, además de hashes.

[ PENDIENTE ] Los ejercicios concretos que hiciste y sus recetas paso a paso. Pásalos y los describo sin inventar nada.`,
impacto:`Es una herramienta habitual de análisis: permite examinar un dato sospechoso, decodificar cadenas ofuscadas o comprobar un hash. Ayuda a ver de forma práctica cómo se transforma la información.`
},
6:{
intro:`PGP (Pretty Good Privacy) es un sistema de cifrado y firma de mensajes y archivos basado en criptografía de clave pública. GPG (GNU Privacy Guard) es una implementación libre y compatible con el estándar OpenPGP, que es la que se usa habitualmente en Linux.

La diferencia práctica: PGP fue el programa original, con licencia propietaria; GPG es la alternativa libre que sigue el mismo estándar, por lo que ambos pueden intercambiar mensajes y claves.`,
tecnico:`PAR DE CLAVES

Cada usuario genera una clave pública, que reparte a quien quiera escribirle, y una clave privada, que nunca se comparte. Lo cifrado con tu clave pública solo lo puedes abrir tú. Lo firmado con tu clave privada lo puede verificar cualquiera con tu clave pública.

OPERACIONES Y COMANDOS (referencia general)

Generar claves: gpg --full-generate-key. Pregunta algoritmo, tamaño, caducidad, nombre y correo, y una frase de paso.

Listar claves: gpg --list-keys (públicas) y gpg --list-secret-keys (privadas).

Exportar la clave pública: gpg --armor --export correo > publica.asc.

Importar una clave: gpg --import publica.asc.

Cifrar un archivo para alguien: gpg --encrypt --recipient correo archivo.txt. Genera archivo.txt.gpg.

Descifrar: gpg --decrypt archivo.txt.gpg. Solo funciona si tienes la clave privada del destinatario.

Firmar: gpg --sign archivo.txt (o --clearsign para firma legible).

Verificar una firma: gpg --verify archivo.txt.asc. Confirma que el contenido no se ha alterado y que lo firmó esa clave.

CONFIANZA Y AUTENTICIDAD

Importar una clave no garantiza que pertenezca a quien dice. Para comprobarlo se compara la huella (fingerprint) por otro canal y se marca el nivel de confianza. Así se evita aceptar la clave de un impostor.

AMPLIACIÓN DE INVESTIGACIÓN PERSONAL

[ PENDIENTE ] Este espacio es para una ampliación tuya, claramente separada de lo visto en clase: por ejemplo, la red de confianza (web of trust) frente a las autoridades certificadoras, o los servidores de claves. Dime qué has investigado y lo redacto.

[ PENDIENTE ] Prácticas de GPG realizadas en clase.`,
impacto:`Se usa para proteger correos y archivos, firmar software y comprobar que una descarga no ha sido modificada. Si pierdes la clave privada o su frase de paso, no hay forma de recuperar lo cifrado.`
},
7:{
intro:`Blockchain, o cadena de bloques, es una estructura de datos en la que la información se agrupa en bloques enlazados entre sí mediante criptografía. Funciona como un libro de registros distribuido: muchas copias idénticas repartidas entre muchos participantes, sin un único dueño central.

Se dice que es un registro que no se puede borrar ni modificar fácilmente porque cambiar un bloque antiguo obligaría a rehacer todos los siguientes y a convencer a la mayoría de la red.`,
tecnico:`ESTRUCTURA DE UN BLOQUE

Un bloque contiene un conjunto de transacciones, una marca de tiempo, el hash del bloque anterior y su propio hash. Como cada bloque incluye el hash del anterior, forman una cadena. Si alguien altera un dato de un bloque, su hash cambia, deja de coincidir con el que guarda el siguiente, y la manipulación se detecta.

VALIDACIÓN Y CONSENSO

Cuando alguien hace una transacción, los nodos de la red la comprueban antes de incluirla. Para ponerse de acuerdo sobre qué bloque se añade a la cadena se usa un mecanismo de consenso. En Bitcoin es la prueba de trabajo: los mineros compiten por resolver un problema costoso de calcular, y el primero en lograrlo añade el bloque y recibe una recompensa.

SEGURIDAD E INTEGRIDAD

La integridad se apoya en los hashes encadenados y en la copia distribuida. La disponibilidad también mejora, porque no hay un único punto de fallo.

ATAQUE DEL 51 %

Si un atacante controla más de la mitad de la capacidad de cálculo de la red, podría reescribir las últimas transacciones o gastar dos veces las mismas monedas. Es muy costoso en redes grandes, pero posible en redes pequeñas.

BLOCKCHAIN Y BITCOIN

Bitcoin es una criptomoneda que usa blockchain como libro de cuentas. Blockchain es la tecnología y Bitcoin es una aplicación de ella; hay otras aplicaciones además de las monedas.

[ PENDIENTE ] Los ejercicios de Bitcoin que os dio el profesor Juan Carlos. No se describen porque no se dispone de su enunciado: pásamelo y lo redacto fielmente.`,
impacto:`Aporta integridad y trazabilidad en sistemas donde no se quiere depender de una sola entidad. Limitaciones: consumo de recursos, lentitud frente a una base de datos tradicional y el hecho de que lo registrado, incluidos los errores, es difícil de corregir.`
},
8:{
intro:`La seguridad pasiva reúne las medidas que reducen el daño cuando un incidente ya ha ocurrido: un fallo de disco, un corte eléctrico, un fuego o un ataque. No evita el incidente, minimiza sus consecuencias y permite recuperarse.`,
tecnico:`MEDIDAS HABITUALES

Copias de seguridad: duplicados de los datos en otro soporte o lugar. Una regla muy extendida es la 3-2-1: tres copias, en dos tipos de soporte distintos, con una fuera del lugar principal.

Redundancia: tener componentes duplicados (discos, fuentes de alimentación) para que el fallo de uno no pare el servicio.

Sistemas de alimentación ininterrumpida (SAI): mantienen el equipo encendido unos minutos ante un corte eléctrico, para poder apagarlo bien.

Protección del entorno: control de acceso, detección y extinción de incendios, control de temperatura y humedad.

Recuperación: de nada sirve una copia si no se ha comprobado que se puede restaurar.

[ PENDIENTE ] Actividades realizadas en clase sobre seguridad pasiva de equipos.`,
impacto:`Es lo que permite que un incidente sea una molestia y no una catástrofe. Una organización bien protegida activamente que no tiene copias sigue perdiéndolo todo ante un ransomware o un fallo físico.`
},
10:{
intro:`Esta unidad trata de cómo proteger los datos almacenados, que suelen ser el activo más valioso de un sistema. La seguridad pasiva en almacenamiento busca que los datos no se pierdan, no se corrompan y sigan disponibles ante un fallo.`,
tecnico:`IDEAS CLAVE (referencia general)

Protección frente a fallos: los discos acaban fallando, así que no se confía en un único soporte.

Redundancia: tener los datos duplicados o con información de recuperación entre varios discos para que el fallo de uno no suponga pérdida. Por ejemplo, un espejo duplica los datos en dos discos.

Copias de seguridad: siguen siendo necesarias. La redundancia protege de un fallo de hardware, pero no de un borrado accidental ni de un ransomware, porque el error se replica en todos los discos.

Integridad y disponibilidad: los datos deben mantenerse íntegros y accesibles. Se comprueban con hashes y con revisiones periódicas del estado del almacenamiento.

[ PENDIENTE ] Tecnologías, sistemas y configuraciones que se hayan trabajado realmente en clase. No se añaden otras que no aparezcan en tus materiales.`,
impacto:`Una buena estrategia combina redundancia para seguir funcionando y copias para recuperarse. Sin ambas, un único fallo puede ser definitivo.`
}
};

/* Reflexiones: BORRADOR en primera persona basado en el artículo del Foro Económico Mundial
   (resumen mensual de ciberseguridad, oct-nov 2026). Sin experiencias personales inventadas.
   La reflexión sobre gratitud queda pendiente: el artículo de Kairós no se pudo abrir. */
window.DSA_REFLEX={
gratitud:{
'La importancia de reconocer los errores':`Creo que reconocer un error es el primer paso para poder corregirlo. Lo relaciono con lo que hemos visto en el ciclo: en un sistema, un fallo que no se admite ni se documenta se repite. En las personas pasa algo parecido, si no reconozco que me he equivocado, difícilmente voy a cambiar.

[ BORRADOR ] No se ha podido leer el artículo de Kairós, así que este texto no se basa en él. Revísalo y cámbialo por tu propia opinión.`,
'El valor del perdón y del crecimiento personal':`Pienso que dar las gracias y pedir perdón son gestos pequeños que cuidan las relaciones. Un agradecimiento sincero reconoce el esfuerzo de otra persona, y una disculpa bien hecha repara algo que se había roto. Creo que ninguna de las dos cosas debe hacerse por compromiso, sino porque realmente se siente.

[ BORRADOR ] Redactado sin el artículo de Kairós y sin experiencias personales. Añade aquí tus propias vivencias si quieres.`
},
ciber:{
'Importancia de la seguridad informática':`Lo que más me ha llamado la atención del artículo es la escala. Dos fallos en PHP, un lenguaje que sostiene buena parte de la web, bastaron para dejar sin servicio a bancos, aerolíneas, administraciones y medios de comunicación. Me hace pensar que la seguridad no es un lujo de empresas grandes: si una pieza pequeña y muy extendida falla, el efecto llega a todo el mundo.

Eso conecta con lo que vemos en el ciclo sobre disponibilidad. Solemos pensar en la confidencialidad, en que nadie robe datos, pero que un servicio deje de funcionar también es un daño real.`,
'Amenazas digitales actuales':`El artículo recoge ejemplos que muestran lo variadas que son las amenazas: el robo de unos 6.300 millones de dólares en una plataforma de criptomonedas, ataques que han llegado a neveras y congeladores conectados en supermercados europeos, o el aumento de los ataques DDoS que cita Cloudflare. Me parece significativo que la amenaza ya no se limita a ordenadores: cualquier objeto conectado a la red es un posible punto de entrada.

También me llama la atención que muchos incidentes siguen siendo de suplantación de identidad. La tecnología cambia, pero el eslabón humano sigue siendo un objetivo.`,
'Evolución de los ataques informáticos':`Una idea del artículo que me parece importante es que la inteligencia artificial sirve a la vez a atacantes y a defensores. Se menciona que modelos de IA ayudaron a encontrar fallos que llevaban décadas sin detectarse. Eso es una ventaja si lo usa quien defiende, pero también acorta el tiempo entre que existe una vulnerabilidad y alguien la aprovecha.

Mi interpretación es que los ataques son cada vez más rápidos y más automáticos, y que por eso la respuesta no puede ser puramente manual.`,
'Responsabilidad de usuarios y profesionales':`Una de las conclusiones del artículo es que las organizaciones que mejor se recuperan no son necesariamente las que más información de amenazas tienen, sino las que han decidido de antemano cómo actuar. Lo relaciono con la seguridad pasiva: tener un plan, copias y procedimientos probados antes de que ocurra el incidente.

Creo que esa responsabilidad es compartida. Los profesionales deben diseñar y mantener los sistemas con criterio, y los usuarios deben cuidar sus hábitos, porque un solo descuido puede ser la puerta de entrada.`,
'Mi visión del futuro de la ciberseguridad':`Creo que el futuro pasará por la cooperación y por la resiliencia. El artículo recuerda que la respuesta internacional no avanza tan deprisa como la inteligencia artificial, y que hace falta un marco común entre gobiernos y empresas. Pienso que no se trata de conseguir sistemas imposibles de atacar, algo que sabemos que no existe, sino de poder resistir, detectar y recuperarse con rapidez.

[ BORRADOR ] Estas reflexiones están redactadas a partir del artículo y de los conceptos generales del curso. Revísalas y cámbialas para que reflejen tu opinión real; no incluyen ninguna experiencia personal tuya.`
}
};
