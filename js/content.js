/* =====================================================================
   CONTENIDO ACADÉMICO — parte teórica y técnica de referencia.
   Se mezcla con TOPICS desde main.js (clave = número de tema).
   REGLAS: aquí solo hay explicación técnica general. Las prácticas hechas,
   tus experiencias, lo aprendido y las conclusiones no se incluyen
   hasta que los aportes tú. No se inventa ninguna actividad.
   Cada bloque se separa con una línea en blanco.
   ===================================================================== */
window.DSA_CONTENT={
11:{
intro:`OpenMediaVault (OMV) es un sistema operativo libre, basado en Debian, pensado para montar un NAS (Network Attached Storage): un servidor de almacenamiento conectado a la red. Se administra desde una interfaz web, sin necesidad de usar la terminal para las tareas habituales.

Un NAS es un equipo dedicado a guardar archivos y ofrecerlos a otros dispositivos por red. Los usuarios acceden a las carpetas compartidas desde sus ordenadores como si fueran un disco más.`,
tecnico:`QUÉ OFRECE (referencia general)

Gestión de discos y sistemas de archivos, carpetas compartidas, usuarios y permisos, y servicios de red para acceder a los datos (por ejemplo SMB/CIFS para equipos Windows, NFS, FTP o SSH). También permite programar tareas como las copias.

FLUJO TÍPICO DE USO

Instalar el sistema, entrar en la interfaz web, preparar los discos y sus sistemas de archivos, crear usuarios, crear carpetas compartidas, asignar permisos y activar el servicio por el que se accederá. Después, se comprueba el acceso desde otro equipo de la red.

ADMINISTRACIÓN Y SEGURIDAD DE LOS DATOS

Los permisos limitan quién lee o modifica cada carpeta (confidencialidad e integridad). Los discos y la configuración determinan la disponibilidad. Un NAS no sustituye a una copia de seguridad: si todo está en la misma máquina, un fallo grave puede perderlo todo.`,
impacto:`OpenMediaVault sirve para gestionar el almacenamiento en red y está muy ligado a la seguridad pasiva: centraliza los datos, controla el acceso y facilita las copias. No audita la seguridad del sistema: esa función la cumple una herramienta distinta como Lynis.`
},
4:{
intro:`Lynis es una herramienta de auditoría de seguridad para sistemas Linux y otros Unix. Revisa la configuración del equipo, comprueba cosas como servicios, permisos, usuarios, red y actualizaciones, y al final entrega un informe con advertencias, sugerencias y una puntuación.`,
tecnico:`EL ÍNDICE Y LOS COLORES

Al terminar la auditoría, Lynis muestra un índice de refuerzo (hardening index): una puntuación que resume cuánto está reforzado el sistema. Cuanto más alto, mejor configurado está. No es una garantía de seguridad, es una medida orientativa de qué se ha revisado y qué se cumple.

Durante la auditoría, cada comprobación se muestra con un color para que se lea de un vistazo:

Verde: la comprobación es correcta, no hay nada que corregir.

Amarillo: hay algo mejorable o una sugerencia. No es un fallo grave, pero conviene revisarlo.

Rojo: hay un problema o una advertencia que requiere atención.

COMANDO BÁSICO (referencia general)

lynis audit system. Ejecuta una auditoría completa del sistema. Analiza áreas como el arranque, usuarios y contraseñas, servicios, red, permisos de archivos, software instalado y actualizaciones, y al final muestra advertencias, sugerencias y el índice. Suele ejecutarse con privilegios de administrador para poder revisar todo.`,
experiencia:`En clase vimos, de forma técnica, qué significaba cada color que muestra Lynis (rojo, verde y amarillo) y qué es el índice que aparece al final de la auditoría.`,
impacto:`Una auditoría periódica ayuda a detectar configuraciones débiles antes de que las aproveche un atacante. Los colores permiten priorizar: primero lo rojo, después lo amarillo.

Lynis audita la seguridad de un sistema y señala qué mejorar. No gestiona almacenamiento: eso lo hace OpenMediaVault. Son herramientas distintas que se complementan, una administra y la otra revisa.`
},
9:{
intro:`Un CPD (Centro de Procesamiento de Datos) es la instalación donde se alojan los servidores y equipos que almacenan y procesan la información de una organización, junto con los sistemas que los mantienen funcionando: alimentación eléctrica, refrigeración y seguridad.`,
experiencia:`Además de la teoría y una práctica con Juan Carlos, el profesor nos llevó arriba a ver el servidor y cómo funciona uno de verdad. Me llamó la atención que era pequeño y que estaba muy encerrado: se sobrecalentaba mucho, así que necesitaba ventilación y mucho aire.`,
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

En España y la Unión Europea la protección de datos personales se regula con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).`,
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

docker rm nombre / docker rmi imagen. Eliminan un contenedor o una imagen.`,
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

Confidencialidad: cifrado. Integridad: hash. Autenticación y no repudio: firma digital con clave privada.`,
impacto:`Está presente en HTTPS, en las aplicaciones de mensajería, en las redes privadas, en las contraseñas almacenadas y en las firmas de documentos. Sus límites: un algoritmo sólido no protege si la clave es débil o se filtra.`
},
5:{
intro:`CyberChef es una herramienta web, gratuita y de código abierto, que sirve para aplicar operaciones sobre datos: codificar, decodificar, cifrar, descifrar, calcular hashes y analizar contenido. Funciona en el navegador y no necesita instalación.`,
tecnico:`INTERFAZ

La pantalla tiene cuatro zonas: la lista de operaciones (a la izquierda, con buscador y categorías), la receta (Recipe, donde se colocan las operaciones elegidas), la entrada (Input, donde se pega o escribe el dato) y la salida (Output, el resultado).

CÓMO FUNCIONA

Se arrastra una operación a la receta, se escribe el dato en la entrada y el resultado aparece en la salida. Se pueden encadenar varias operaciones: la salida de cada una es la entrada de la siguiente. Una receta es esa cadena de operaciones ordenada, que se puede guardar y reutilizar.

CODIFICAR NO ES CIFRAR

Codificar (por ejemplo Base64 o hexadecimal) cambia la representación de un dato sin ninguna clave: cualquiera puede deshacerlo. Cifrar exige una clave para volver al original. CyberChef incluye ambos tipos, además de hashes.`,
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

AMPLIACIÓN DE INVESTIGACIÓN PERSONAL`,
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

Bitcoin es una criptomoneda que usa blockchain como libro de cuentas. Blockchain es la tecnología y Bitcoin es una aplicación de ella; hay otras aplicaciones además de las monedas.`,
impacto:`Aporta integridad y trazabilidad en sistemas donde no se quiere depender de una sola entidad. Limitaciones: consumo de recursos, lentitud frente a una base de datos tradicional y el hecho de que lo registrado, incluidos los errores, es difícil de corregir.`
},
8:{
intro:`La seguridad pasiva reúne las medidas que reducen el daño cuando un incidente ya ha ocurrido: un fallo de disco, un corte eléctrico, un fuego o un ataque. No evita el incidente, minimiza sus consecuencias y permite recuperarse.`,
tecnico:`MEDIDAS HABITUALES

Copias de seguridad: duplicados de los datos en otro soporte o lugar. Una regla muy extendida es la 3-2-1: tres copias, en dos tipos de soporte distintos, con una fuera del lugar principal.

Redundancia: tener componentes duplicados (discos, fuentes de alimentación) para que el fallo de uno no pare el servicio.

Sistemas de alimentación ininterrumpida (SAI): mantienen el equipo encendido unos minutos ante un corte eléctrico, para poder apagarlo bien.

Protección del entorno: control de acceso, detección y extinción de incendios, control de temperatura y humedad.

Recuperación: de nada sirve una copia si no se ha comprobado que se puede restaurar.`,
impacto:`Es lo que permite que un incidente sea una molestia y no una catástrofe. Una organización bien protegida activamente que no tiene copias sigue perdiéndolo todo ante un ransomware o un fallo físico.`
},
10:{
intro:`Esta unidad trata de cómo proteger los datos almacenados, que suelen ser el activo más valioso de un sistema. La seguridad pasiva en almacenamiento busca que los datos no se pierdan, no se corrompan y sigan disponibles ante un fallo.`,
tecnico:`IDEAS CLAVE (referencia general)

Protección frente a fallos: los discos acaban fallando, así que no se confía en un único soporte.

Redundancia: tener los datos duplicados o con información de recuperación entre varios discos para que el fallo de uno no suponga pérdida. Por ejemplo, un espejo duplica los datos en dos discos.

Copias de seguridad: siguen siendo necesarias. La redundancia protege de un fallo de hardware, pero no de un borrado accidental ni de un ransomware, porque el error se replica en todos los discos.

Integridad y disponibilidad: los datos deben mantenerse íntegros y accesibles. Se comprueban con hashes y con revisiones periódicas del estado del almacenamiento.`,
impacto:`Una buena estrategia combina redundancia para seguir funcionando y copias para recuperarse. Sin ambas, un único fallo puede ser definitivo.`
}
};

/* Reflexiones: texto en primera persona basado en el artículo del Foro Económico Mundial
   (resumen mensual de ciberseguridad, oct-nov 2026). Sin experiencias personales inventadas.
   La reflexión sobre gratitud no se basa en el artículo de Kairós, que no se pudo abrir. */
window.DSA_REFLEX={
gratitud:{
'La importancia de reconocer los errores':`Creo que reconocer un error es el primer paso para poder corregirlo. Lo relaciono con lo que hemos visto en el ciclo: en un sistema, un fallo que no se admite ni se documenta se repite. En las personas pasa algo parecido, si no reconozco que me he equivocado, difícilmente voy a cambiar.`,
'El valor del perdón y del crecimiento personal':`Pienso que dar las gracias y pedir perdón son gestos pequeños que cuidan las relaciones. Un agradecimiento sincero reconoce el esfuerzo de otra persona, y una disculpa bien hecha repara algo que se había roto. Creo que ninguna de las dos cosas debe hacerse por compromiso, sino porque realmente se siente.`
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
'Mi visión del futuro de la ciberseguridad':`Creo que el futuro pasará por la cooperación y por la resiliencia. El artículo recuerda que la respuesta internacional no avanza tan deprisa como la inteligencia artificial, y que hace falta un marco común entre gobiernos y empresas. Pienso que no se trata de conseguir sistemas imposibles de atacar, algo que sabemos que no existe, sino de poder resistir, detectar y recuperarse con rapidez.`
}
};

/* CONCLUSIONES: resumen de ideas clave de cada tema. Son síntesis del contenido técnico,
   sin experiencias personales; puedes añadir tu valoración propia debajo. */
window.DSA_CONCL={
1:`La seguridad informática se resume en proteger la información, que es lo más valioso de cualquier sistema, equilibrando cinco objetivos: confidencialidad, integridad, disponibilidad, autenticidad y no repudio. La idea más importante es que no existe la seguridad absoluta: se trabaja con el riesgo, combinando prevención (seguridad activa), recuperación (seguridad pasiva), buenas prácticas y formación. Este tema es la base de todos los demás, porque da el vocabulario para entender qué amenaza combate cada herramienta.`,
2:`Docker permite empaquetar una aplicación con todo lo que necesita y ejecutarla de forma aislada, ligera y reproducible. Su valor frente a las máquinas virtuales está en el consumo de recursos y la rapidez, a cambio de un aislamiento menor al compartir el núcleo. Dominar sus comandos básicos (descargar imágenes, crear, listar, parar y borrar contenedores) es la puerta de entrada al despliegue moderno de servicios, y obliga a pensar en la seguridad de las imágenes que se usan.`,
3:`La criptografía convierte la información en algo ilegible para quien no tiene la clave, y es la herramienta que sostiene la confidencialidad, la integridad y la autenticación en Internet. La diferencia esencial es que la simétrica es rápida pero exige compartir un secreto, mientras que la asimétrica resuelve ese problema con un par de claves a costa de velocidad; en la práctica se combinan. Lo que protege de verdad no es ocultar el algoritmo, sino cuidar la clave.`,
4:`Lynis permite auditar un sistema Linux y traducir su estado a un informe comprensible: los colores indican qué está bien, qué es mejorable y qué es un problema, y el índice resume el nivel de refuerzo. Su aportación es enseñar a revisar la seguridad de forma metódica y a priorizar lo urgente. Auditar con regularidad es una buena práctica, porque un sistema bien configurado hoy puede dejar de estarlo mañana.`,
5:`CyberChef demuestra que codificar, cifrar y calcular hashes son operaciones distintas, y que muchas se pueden encadenar visualmente en una receta. Es una herramienta sencilla para entender cómo se transforma un dato y para analizar contenido sospechoso. Lo más útil que deja es distinguir qué operaciones son reversibles sin clave y cuáles no.`,
6:`GPG y PGP aplican la criptografía de clave pública a la vida real: cifrar mensajes y archivos, firmarlos y comprobar su autenticidad. La clave privada es lo que hay que proteger por encima de todo, y la confianza en una clave pública se verifica comparando su huella, no se da por supuesta. Es un buen ejemplo de cómo la criptografía resuelve a la vez la confidencialidad, la integridad y el no repudio.`,
7:`Blockchain es un libro de registros distribuido en el que cada bloque contiene el hash del anterior, de modo que alterar el pasado es detectable y muy costoso. Su fortaleza está en la integridad y en la ausencia de un punto central de fallo, y su límite está en el consumo de recursos y en ataques como el del 51 %. Bitcoin es su aplicación más conocida, pero la tecnología es más amplia que las criptomonedas.`,
8:`La seguridad pasiva no evita el incidente, reduce su impacto y permite recuperarse: copias de seguridad, redundancia, alimentación de respaldo y protección del entorno. La idea clave es que una copia no probada no es una garantía, y que la protección activa por sí sola no basta. Planificar la recuperación antes de que ocurra el fallo marca la diferencia entre una molestia y una pérdida irreparable.`,
9:`El CPD reúne los equipos que guardan y procesan la información, y su seguridad depende tanto del software como del entorno físico: refrigeración, ventilación, energía y control de acceso. La visita al servidor mostró de forma directa que el sobrecalentamiento es un riesgo real para la disponibilidad. La conclusión es que cuidar el espacio físico es parte de la seguridad, no un detalle secundario.`,
10:`La seguridad del almacenamiento busca que los datos no se pierdan, no se corrompan y sigan disponibles. La redundancia protege frente a fallos de hardware y las copias protegen frente a borrados, errores y ataques; ninguna sustituye a la otra. Entender esta diferencia permite diseñar una protección con sentido en lugar de confiar en una sola medida.`,
11:`OpenMediaVault permite montar y administrar un NAS desde una interfaz web: discos, carpetas compartidas, usuarios, permisos y servicios de red. Su aporte a la seguridad está en centralizar los datos y controlar quién accede a ellos, aunque no sustituye a las copias ni audita el sistema. Complementa a Lynis: una gestiona el almacenamiento y la otra revisa la seguridad.`
};
(function(){for(var k in DSA_CONCL){if(!DSA_CONTENT[k])DSA_CONTENT[k]={};DSA_CONTENT[k].conclusion=DSA_CONCL[k]}})();
