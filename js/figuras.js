/* =========================================================================
   FIGURAS INTERACTIVAS — datos
   Solo para la web. Cada figura estática del PDF se reescribe acá como
   datos estructurados que el motor (figuras-render.js) convierte en un
   componente legible e interactivo dentro del panel.
   La info es la misma del PDF; cambia la forma de leerla.
   ========================================================================= */
window.FIGURAS = {

  /* ---------- FIG.01 · timeline (5 orientaciones) ---------- */
  fig01: {
    tipo: 'timeline',
    num: '01',
    nom: 'Las cinco orientaciones de marketing',
    escala: ['← más antiguo', 'más actual →'],
    hint: 'Tocá cada orientación para ver de qué se trata',
    pasos: [
      { n: '01', t: 'PRODUCCIÓN', k: 'disponibilidad y bajo precio',
        body: 'El foco está en producir mucho y barato. Se asume que la gente va a elegir lo más accesible y disponible, así que la clave es la eficiencia y el precio bajo.' },
      { n: '02', t: 'PRODUCTO', k: 'calidad que se elige sola',
        body: 'Se confía en que un producto de mejor calidad se vende solo. El riesgo es enamorarse del producto y olvidar si alguien de verdad lo necesita.' },
      { n: '03', t: 'VENTAS', k: 'promover e inducir la compra',
        body: 'La preocupación pasa a empujar la venta: promoción agresiva para inducir la compra. Se vende lo que se fabrica, no necesariamente lo que se busca.' },
      { n: '04', t: 'MARKETING', k: 'mirar el mercado, no la fábrica',
        body: 'Recién acá el foco se corre hacia afuera: se parte de las necesidades del mercado y desde ahí se construye la oferta. Se mira el mercado, no la fábrica.' },
      { n: '05', t: 'MARKETING SOCIAL', k: '+ bien de la sociedad',
        body: 'Suma una tercera pata: además del cliente y la empresa, el bienestar de la sociedad a largo plazo. Vender bien sin dejar de lado el impacto colectivo.' },
    ],
    lectura: 'De la fábrica al bien común. Las tres primeras miran hacia adentro (qué produzco, qué tan bueno es, cómo lo empujo); recién en la cuarta el foco se corre al mercado, y en la quinta se abre a la sociedad entera.'
  },

  /* ---------- FIG.02 · pirámide (Maslow) ---------- */
  fig02: {
    tipo: 'piramide',
    num: '02',
    nom: 'La pirámide de Maslow',
    topLabel: 'NECESIDAD más elevada',
    bottomLabel: 'NECESIDAD más básica',
    hint: 'Tocá cada nivel',
    // de arriba (elevada) a abajo (básica)
    niveles: [
      { t: 'AUTORREALIZACIÓN', body: 'El deseo de desarrollarse, crecer, ser la mejor versión de uno mismo. Marcas que apelan a superación personal, propósito o expresión.' },
      { t: 'RECONOCIMIENTO', body: 'Estatus, prestigio, respeto. La necesidad de ser valorado por los demás. Muchas marcas premium le hablan directamente a este piso.' },
      { t: 'AFILIACIÓN', body: 'Pertenencia, afecto, formar parte de un grupo. La necesidad de vínculo y comunidad que explota buena parte de la publicidad emocional.' },
      { t: 'SEGURIDAD', body: 'Protección, estabilidad, resguardo. Salud, seguros, ahorro: categorías que trabajan sobre la necesidad de sentirse a salvo.' },
      { t: 'FISIOLÓGICAS', body: 'Lo básico para vivir: comer, beber, dormir. Un agua embotellada resuelve la sed, aunque después su publicidad le hable a lo de arriba.' },
    ],
    lectura: 'No es que una marca elija un piso y se quede ahí: es que el mismo producto puede leerse en varios niveles. Un agua embotellada resuelve lo fisiológico (sed), pero su publicidad casi siempre le habla a lo de arriba: pertenencia, identidad, estatus.'
  },

  /* ---------- FIG.03 · balanza (valor) ---------- */
  fig03: {
    tipo: 'balanza',
    num: '03',
    nom: 'La balanza del valor',
    formula: 'VALOR = lo que CREO recibir − lo que CREO sacrificar',
    hint: 'Tocá cada platillo',
    lados: [
      { t: 'BENEFICIOS', signo: '+', items: [
        { l: 'funcional', d: 'lo que el producto resuelve en la práctica: para qué sirve, qué problema saca de encima.' },
        { l: 'emocional', d: 'lo que hace sentir: placer, seguridad, orgullo, pertenencia.' },
        { l: 'económico', d: 'la percepción de que lo que pago vale la pena por lo que obtengo.' },
      ]},
      { t: 'COSTOS', signo: '−', items: [
        { l: 'tangible', d: 'el precio en plata, pero también tiempo y esfuerzo para conseguirlo.' },
        { l: 'intangible', d: 'el costo de aprender a usarlo, de cambiar de hábito, de arriesgarse.' },
        { l: 'psicológico', d: 'el miedo a equivocarse, la culpa, la incertidumbre de la decisión.' },
      ]},
    ],
    lectura: 'El valor no es un dato objetivo del producto: es una percepción. La persona pesa lo que cree que va a recibir contra lo que cree que va a sacrificar. Por eso dos personas frente a la misma góndola y el mismo precio toman decisiones opuestas.'
  },

  /* ---------- FIG.04 · tarjetas (4 lentes segmentación) ---------- */
  fig04: {
    tipo: 'tarjetas',
    num: '04',
    nom: 'Las cuatro lentes de la segmentación',
    cols: 4,
    hint: 'Tocá cada lente',
    items: [
      { n: '01', t: 'GEOGRÁFICO', k: '¿dónde están?',
        body: 'Recorta por lugar: país, ciudad, barrio, clima. Dónde vive y se mueve la audiencia condiciona qué se le puede ofrecer y cómo llega.' },
      { n: '02', t: 'DEMOGRÁFICO', k: '¿quiénes son?',
        body: 'Edad, género, ingresos, ocupación, educación. Los datos duros que describen a la persona. Fácil de medir, pero insuficiente por sí solo.' },
      { n: '03', t: 'PSICOGRÁFICO', k: '¿por qué eligen?',
        body: 'Valores, estilo de vida, personalidad, motivaciones. El porqué de las decisiones. Es la lente que más cuesta y la que más diferencia.' },
      { n: '04', t: 'CONDUCTUAL', k: '¿qué hacen?',
        body: 'Comportamiento real: qué compran, con qué frecuencia, cuán fieles son, qué buscan al usar el producto. Se basa en hechos, no en supuestos.' },
    ],
    lectura: 'Cada lente recorta a la audiencia con una pregunta distinta. Combinadas, transforman una multitud anónima en un grupo con cara, nombre y deseos reconocibles. La lente psicográfica —el porqué— suele ser la que más cuesta y la que más diferencia.'
  },

  /* ---------- FIG.05 · mix central (marketing mix 4P) ---------- */
  fig05: {
    tipo: 'nucleo',
    num: '05',
    nom: 'El marketing mix: las cuatro variables que se equilibran',
    centro: { t: 'MARKETING MIX', k: 'las 4 P' },
    hint: 'Tocá cada P',
    items: [
      { t: 'PRODUCTO', k: '¿qué ofrezco?',
        body: 'El bien, servicio o idea con valor que se pone en el mercado. Todo lo demás se ordena alrededor de esta decisión.' },
      { t: 'PRECIO', k: '¿cuánto vale?',
        body: 'La única P que genera ingresos; las otras tres son costos. Fija cuánto se pide a cambio y comunica posicionamiento.' },
      { t: 'PLAZA', k: '¿dónde llega?',
        body: 'Logística y canales de distribución: cómo y dónde el producto queda disponible para la persona que lo quiere.' },
      { t: 'PROMOCIÓN', k: '¿cómo lo digo?',
        body: 'Comunicar: informar, persuadir, recordar. La P que le cuenta al mercado que el producto existe y por qué elegirlo.' },
    ],
    lectura: 'Producto, precio, plaza y promoción no son cuatro decisiones separadas: son una mezcla. Un cambio en la plaza (dónde vendo) puede subir el costo y obligar a mover el precio; una promesa de promoción que el producto no cumple, destruye valor. Por eso se llama mix.'
  },

  /* ---------- FIG.06 · comparación 2 columnas (4P → 4C) ---------- */
  fig06: {
    tipo: 'giro',
    num: '06',
    nom: 'De las 4P a las 4C: girar la silla hacia el consumidor',
    ladoA: 'LAS 4 P · mirada de la empresa',
    ladoB: 'LAS 4 C · mirada del consumidor',
    hint: 'Tocá cada par',
    pares: [
      { a: 'PRODUCTO', ad: 'lo que la empresa vende', b: 'CLIENTE', bd: 'el deseo y su solución',
        body: 'La empresa piensa en el producto que ofrece; el consumidor piensa en su deseo y en qué lo resuelve. Se empieza por la necesidad, no por el catálogo.' },
      { a: 'PRECIO', ad: 'el número que fija', b: 'COSTO', bd: 'lo que está dispuesto a pagar',
        body: 'La empresa fija un precio; el consumidor evalúa el costo total, incluyendo tiempo, esfuerzo y riesgo, no solo la plata.' },
      { a: 'PLAZA', ad: 'dónde lo pone disponible', b: 'CONVENIENCIA', bd: 'qué tan fácil le resulta',
        body: 'La empresa decide dónde distribuir; al consumidor le importa qué tan fácil le resulta conseguirlo, sin trabas ni vueltas.' },
      { a: 'PROMOCIÓN', ad: 'el mensaje que emite', b: 'COMUNICACIÓN', bd: 'el diálogo de ida y vuelta',
        body: 'La empresa emite un mensaje; el consumidor espera un diálogo de ida y vuelta, donde también escucha y responde.' },
    ],
    lectura: 'Las 4P miran desde la empresa; las 4C, desde el consumidor. No es un cambio cosmético: es empezar por el deseo del cliente y recién después construir la oferta, en vez de al revés.'
  },

  /* ---------- FIG.07 · tarjetas (3 componentes de marca) ---------- */
  fig07: {
    tipo: 'tarjetas',
    num: '07',
    nom: 'Los tres componentes de la marca',
    cols: 3,
    hint: 'Tocá cada componente',
    items: [
      { t: 'SEMÁNTICO', k: 'el nombre',
        body: 'Lo que se pronuncia: la palabra. El nombre de la marca, lo que la gente dice cuando la nombra.' },
      { t: 'VISUAL', k: 'el signo',
        body: 'Logotipo (solo tipografía), isotipo (solo símbolo) o isologotipo (ambos, indivisibles). El que más trabajo, pero es solo uno de los tres.' },
      { t: 'AUDIOVISUAL', k: 'el sonido',
        body: 'Jingle, slogan o sonido de marca. La dimensión sonora que también construye identidad y memoria.' },
    ],
    lectura: 'El componente visual —el que más trabajo— es solo uno de los tres. Y dentro de él, la distinción técnica importa: logotipo (solo tipografía), isotipo (solo símbolo) e isologotipo (ambos, indivisibles).'
  },

  /* ---------- FIG.08 · núcleo (ecosistema digital) ---------- */
  fig08: {
    tipo: 'nucleo',
    num: '08',
    nom: 'El ecosistema digital y sus activos',
    centro: { t: 'USUARIO', k: 'objetivo común' },
    nota: 'Como condición de entrada, la analítica: si no se puede medir, no entra.',
    hint: 'Tocá cada activo',
    items: [
      { t: 'SITIO WEB', k: 'local 24/7',
        body: 'El local abierto todo el día: donde la marca controla la experiencia de punta a punta y concreta la conversión.' },
      { t: 'SEO · SEM', k: 'buscadores',
        body: 'Buscadores: aparecer justo en el momento en que la persona busca. SEO (orgánico) y SEM (pago) para estar cuando preguntan.' },
      { t: 'REDES', k: 'comunidad',
        body: 'El espacio de la comunidad: conversación, presencia cotidiana y construcción de vínculo con la audiencia.' },
      { t: 'EMAIL', k: '1 a 1',
        body: 'La conversación uno a uno: el canal más directo y personal, ideal para fidelizar y sostener la relación en el tiempo.' },
      { t: 'ANALÍTICA', k: 'medir todo',
        body: 'La condición de entrada: si no se puede medir, no entra. Todo activo digital existe porque se puede leer su resultado.' },
    ],
    lectura: 'Los activos no se eligen por moda sino por función: el sitio web como local abierto 24/7, los buscadores para aparecer en el momento de la búsqueda, el email para la conversación uno a uno, las redes para la comunidad. En el centro, el usuario; como condición de entrada, la analítica: si no se puede medir, no entra.'
  },

  /* ---------- FIG.09 · espectro (propios / pago / ganados) ---------- */
  fig09: {
    tipo: 'espectro',
    num: '09',
    nom: 'Medios propios, de pago y ganados',
    eje: 'a mayor control de la marca (izquierda) → menor credibilidad;  a menor control (derecha) → mayor credibilidad',
    hint: 'Tocá cada tipo de medio',
    items: [
      { t: 'PROPIOS', en: 'owned', k: 'la marca controla el mensaje',
        detalle: 'sitio web · app · SEO · perfiles en redes',
        body: 'Los canales que la marca posee y controla del todo. Máximo control del mensaje, pero por eso mismo es lo que el usuario cree menos: sabe que es la marca hablando de sí misma.' },
      { t: 'DE PAGO', en: 'paid', k: 'la plataforma controla quién lo ve',
        detalle: 'SEM · display · ads · influencers pagos',
        body: 'Espacios que se compran. La marca controla el mensaje, pero la plataforma controla quién lo ve. Queda en el medio del espectro de credibilidad.' },
      { t: 'GANADOS', en: 'earned', k: 'el usuario controla el mensaje',
        detalle: 'reseñas · menciones · notas de prensa',
        body: 'Lo que otros dicen de la marca sin que ella lo pague. El usuario controla el mensaje, y por eso es lo más creíble: nadie sospecha de una recomendación genuina.' },
    ],
    lectura: 'Cuanto más controla la marca el mensaje (medios propios), menos lo cree el usuario; cuanto menos lo controla (medios ganados), más credibilidad tiene. Los medios de pago están en el medio: la marca controla el mensaje, pero la plataforma controla quién lo ve.'
  },

  /* ---------- FIG.10 · comparación antes/después (AIDA → hoy) ---------- */
  fig10: {
    tipo: 'giro',
    num: '10',
    nom: 'De AIDA al embudo de fidelización: 120 años de la misma intuición',
    ladoA: '1898 · AIDA',
    ladoB: 'hoy · FIDELIZACIÓN',
    hint: 'Tocá cada modelo',
    pares: [
      { a: 'AIDA', ad: 'Atención · Interés · Deseo · Acción', b: 'FIDELIZACIÓN', bd: 'Descubre · Considera · Decide · Convierte · Fideliza',
        body: 'La lógica es la misma desde 1898: muchos entran arriba, pocos llegan abajo. AIDA miraba el mensaje (qué le pasa a la persona); el modelo de hoy mira al usuario y no se cierra en la acción: agrega la fidelización.' },
    ],
    lectura: 'La lógica es la misma desde 1898: muchas personas entran arriba, pocas llegan abajo. Lo que cambia es la perspectiva —del mensaje al usuario— y que el modelo final no se cierra en la conversión: sigue hasta la fidelización.'
  },

  /* ---------- FIG.11 · embudo vertical (fidelización) ---------- */
  fig11: {
    tipo: 'embudo',
    num: '11',
    nom: 'El embudo de fidelización: del descubrimiento a que vuelva',
    topLabel: 'muchos',
    bottomLabel: 'pocos',
    hint: 'Tocá cada etapa',
    etapas: [
      { t: 'DESCUBRIMIENTO', k: 'no te conoce · atraer',
        body: 'Arriba del embudo: la persona todavía no te conoce. El objetivo es atraer, aparecer, generar el primer contacto.' },
      { t: 'CONSIDERACIÓN', k: 'evalúa · convencer',
        body: 'Ya te vio y te está evaluando junto a otras opciones. El objetivo es convencer: mostrar por qué sos una alternativa válida.' },
      { t: 'DECISIÓN', k: 'compara · elegir',
        body: 'Compara en detalle antes de decidir. El objetivo es que te elija: sacar dudas, dar la información que falta, facilitar el paso.' },
      { t: 'CONVERSIÓN', k: 'actúa · convertir',
        body: 'Hace eso que buscamos en esta etapa. Convertir no es solo vender: es lograr la acción concreta, evitando que se frene por falta de información.' },
      { t: 'FIDELIZACIÓN', k: 'vuelve · recompra · recomienda',
        body: 'La quinta etapa reinicia el ciclo: un cliente fiel vuelve a entrar arriba y, además, trae a otros. La venta no es el final.' },
    ],
    lectura: 'Este es el modelo de referencia de la cursada. No se cierra en la venta: la quinta etapa —la fidelización— reinicia el ciclo, porque un cliente fiel vuelve a entrar arriba y, además, trae a otros. Convertir no es necesariamente vender: es lograr que el usuario haga eso que buscamos en cada etapa, evitando que no avance por falta de información.'
  },

  /* ---------- FIG.12 · timeline (customer journey como ruta) ---------- */
  fig12: {
    tipo: 'timeline',
    num: '12',
    nom: 'El recorrido del cliente, dibujado como una ruta',
    hint: 'Tocá cada estación del recorrido',
    pasos: [
      { n: '01', t: 'DESCUBRE', k: 'busca en Google · ZMOT',
        body: 'El punto de partida: la persona googlea antes de comprar. Ese instante de búsqueda previa es el ZMOT, el momento cero de la verdad.' },
      { n: '02', t: 'INVESTIGA', k: 'compara · lee reseñas',
        body: 'Compara opciones y lee reseñas. Busca prueba social y razones para confiar antes de dar el siguiente paso.' },
      { n: '03', t: 'DECIDE', k: 'micromomento: quiero',
        body: 'El micromomento en que quiere saber, ir, hacer o comprar. La marca tiene que estar justo ahí, cuando la intención aparece.' },
      { n: '04', t: 'COMPRA', k: 'convierte en la app',
        body: 'Concreta la acción: convierte, en la app o donde sea. El recorrido llega a su punto de conversión.' },
      { n: '05', t: 'VUELVE', k: 'fideliza · recomienda',
        body: 'No termina en la compra: vuelve, fideliza y recomienda. El buen recorrido reinicia el ciclo con un cliente que trae a otros.' },
    ],
    lectura: 'Cada estación es un momento con su activo, su mensaje y su llamado a la acción. El ZMOT —ese instante en que googleamos antes de comprar— y los micromomentos —quiero saber, ir, hacer, comprar— explican por qué el recorrido ya no es un camino continuo sino una sucesión de impulsos que la marca debe atender justo cuando ocurren.'
  },

  /* ---------- FIG.13 · tarjetas (3 objetivos de campaña) ---------- */
  fig13: {
    tipo: 'tarjetas',
    num: '13',
    nom: 'Los tres objetivos de campaña, según la etapa del embudo',
    cols: 3,
    hint: 'Tocá cada objetivo',
    items: [
      { t: 'VISIBILIDAD', k: 'awareness',
        body: 'Que te conozcan y recuerden. Vive arriba del embudo: no se puede pedir conversión a quien todavía no te descubrió.' },
      { t: 'CONVERSIÓN', k: 'resultados',
        body: 'Que hagan la acción que buscás. Vive en el medio-abajo del embudo, cuando la audiencia ya te conoce y evalúa.' },
      { t: 'FIDELIZACIÓN', k: 'loyalty',
        body: 'Que vuelvan y recomienden. Vive al final y más allá del embudo: sostener la relación con quien ya te eligió.' },
    ],
    lectura: 'Cada objetivo vive en una zona del embudo: visibilidad arriba (que te conozcan), conversión en el medio-abajo (que actúen), fidelización al final y más allá (que vuelvan). No se puede pedir conversión a una audiencia que todavía no te descubrió.'
  },

  /* ---------- FIG.14 · matriz 2×2 (contenidos) ---------- */
  fig14: {
    tipo: 'matriz',
    num: '14',
    nom: 'La matriz de contenidos',
    ejeY: ['↑ EMOCIONAL', '↓ RACIONAL'],
    ejeX: ['← CONOCER (branding)', 'CONVERTIR (venta) →'],
    hint: 'Tocá cada cuadrante',
    // orden: los dos de arriba (emocional), luego los dos de abajo (racional)
    cuadrantes: [
      { t: 'ENTRETENER', eje: 'emocional', items: 'sorteos · concursos · juegos',
        body: 'Contenido emocional pensado para captar y divertir. Genera alcance y simpatía, pero por sí solo no convierte.' },
      { t: 'INSPIRAR', eje: 'emocional', items: 'testimonios · historias · UGC',
        body: 'Emociona y genera identificación: historias, testimonios, contenido de los propios usuarios. Construye comunidad y deseo.' },
      { t: 'EDUCAR', eje: 'racional', items: 'guías · webinars · infografías',
        body: 'Aporta valor racional: enseña, explica, resuelve dudas. Construye autoridad y acompaña la etapa de consideración.' },
      { t: 'CONVERTIR', eje: 'racional', items: 'demos · reseñas · casos',
        body: 'Contenido racional de fondo de embudo, orientado a la decisión: demos, reseñas, casos. El que efectivamente vende.' },
    ],
    lectura: 'La matriz cruza dos ejes: de arriba abajo, el registro —arriba lo EMOCIONAL (entretener, inspirar), abajo lo RACIONAL (educar, convertir)—; de izquierda a derecha, la intención —a la izquierda el contenido que da a CONOCER la marca (branding), a la derecha el que empuja a CONVERTIR (venta)—. Así, cada cuadrante combina un registro y una intención: entretener es emocional-y-de-marca; convertir es racional-y-de-venta. El error más común es vivir en un solo cuadrante: marcas que solo venden y se preguntan por qué nadie las sigue, o que solo entretienen y nunca convierten. Una comunidad sana necesita algo de los cuatro.'
  },

  /* ---------- FIG.15 · grilla de categorías (clasificación de redes) ---------- */
  fig15: {
    tipo: 'grilla',
    num: '15',
    nom: 'Clasificación de redes sociales según el vínculo que busca el usuario',
    sub: 'SEGÚN EL TIPO DE RELACIÓN QUE BUSCA EL USUARIO',
    cols: 3,
    hint: 'Tocá cada categoría',
    items: [
      { t: 'RELACIONES', k: 'conectar personas', ej: 'Facebook · Instagram',
        body: 'Redes pensadas para conectar personas y sostener vínculos. El usuario entra a ver y ser visto por su círculo.' },
      { t: 'ENTRETENIMIENTO', k: 'consumir contenido', ej: 'YouTube · TikTok · Pinterest',
        body: 'El usuario busca consumir contenido y pasarla bien. El formato manda: video, descubrimiento, inspiración visual.' },
      { t: 'PROFESIONALES', k: 'vínculos laborales', ej: 'LinkedIn · Behance',
        body: 'Espacios para construir vínculos laborales y mostrar trabajo. El tono es corporativo, el objetivo es profesional.' },
      { t: 'NICHO', k: 'interés específico', ej: 'TripAdvisor · DeviantArt',
        body: 'Comunidades alrededor de un interés muy específico. Público chico pero altamente involucrado en el tema.' },
      { t: 'MENSAJERÍA', k: 'comunicación directa', ej: 'WhatsApp · Telegram',
        body: 'Canales de comunicación directa y privada. Cada vez más usados por marcas para atención y venta uno a uno.' },
      { t: 'MICROBLOGGING', k: 'opinión y actualidad', ej: 'X · Threads · Tumblr',
        body: 'El pulso de la opinión y la actualidad en tiempo real. Conversación pública, rápida y muy ligada a lo que pasa ahora.' },
    ],
    lectura: 'La misma plataforma puede caer en más de una categoría y cambiar con el tiempo. Lo útil no es memorizar la grilla, sino preguntarse qué va a buscar mi Buyer Persona en cada espacio.'
  },

  /* ---------- FIG.16 · fórmula (engagement) ---------- */
  fig16: {
    tipo: 'formula',
    num: '16',
    nom: 'Alcance, impresiones e interacción: la fórmula del engagement',
    hint: 'Tocá cada término',
    terminos: [
      { t: 'ALCANCE', k: 'cuántas personas lo vieron',
        body: 'La cantidad de personas distintas que vieron el contenido. Cuenta cabezas, no repeticiones.' },
      { t: 'IMPRESIONES', k: 'cuántas veces se mostró',
        body: 'La cantidad de veces que el contenido se mostró, aunque sea a la misma persona varias veces. Cuenta apariciones, no personas.' },
      { t: 'INTERACCIONES', k: 'me gusta, guardar, compartir, comentar',
        body: 'Las acciones que hace la gente: me gusta, guardar, compartir, comentar. La señal de que el contenido movió algo.' },
    ],
    ecuacion: { res: 'ENGAGEMENT %', num: 'interacciones', den: 'alcance', factor: '× 100', pie: 'mide el vínculo, no el tamaño' },
    lectura: 'El engagement mide el vínculo, no el tamaño. Una cuenta con pocos seguidores muy activos puede tener mejor engagement que una gigante con público dormido. Existe la versión simple (sobre alcance), la de seguidores y la ponderada, que le da más peso a las interacciones más valiosas (un compartido pesa más que un me gusta).'
  },

  /* ---------- FIG.17 · traducción (marketing → diseño) ---------- */
  fig17: {
    tipo: 'traduccion',
    num: '17',
    nom: 'La decisión de marketing se traduce en decisión de diseño',
    ladoA: 'DECISIÓN DE MARKETING',
    ladoB: 'DECISIÓN DE DISEÑO',
    hint: 'Tocá cada traducción',
    pares: [
      { a: '¿en qué etapa está?', b: 'TÍTULO',
        body: 'Saber en qué etapa del embudo está la persona define qué va como título: el primer mensaje que tiene que entrar por los ojos.' },
      { a: '¿qué necesita saber?', b: 'subtítulo',
        body: 'Lo que la persona necesita saber en ese momento se traduce en el subtítulo y los apoyos: la información de segundo nivel.' },
      { a: '¿qué acción busco?', b: 'cuerpo + CTA',
        body: 'La acción que buscamos se vuelve cuerpo y llamado a la acción: cuánto peso visual se le da al paso que queremos que dé.' },
    ],
    lectura: 'Cada pregunta estratégica —¿en qué etapa está?, ¿qué necesita saber?, ¿qué acción busco?— tiene su contracara visual: qué va de título, qué de apoyo, cuánto pesa el CTA. La jerarquía visual no es una cuestión de gusto: es la traducción gráfica de una jerarquía de mensajes que el marketing ya definió.'
  },


  /* ---------- FIG.E3 · comparación de dos cuentas (Salus) ---------- */
  figE3: {
    tipo: 'giro',
    num: 'E3',
    nom: 'Ejercicio · las dos cuentas de Salus, dos targets distintos',
    ladoA: '@salusuruguay · el agua',
    ladoB: '@salus_frutte · las saborizadas',
    hint: 'Tocá cada dimensión para comparar las dos cuentas',
    pares: [
      { a: 'AGUA', ad: 'sin distinguir formato (600ml, 1lt, 2.25lt)', b: 'SABORIZADAS', bd: 'aguas con sabor, sin aditivos',
        body: 'La cuenta del agua trata a todos los formatos como un mismo producto: lo que se comunica es el agua, no el envase. La de Frutté, en cambio, gira alrededor de las aguas saborizadas sin aditivos como categoría propia.' },
      { a: 'PÚBLICO ADULTO GENÉRICO', ad: 'sin recorte fino de edad', b: 'ADULTO JOVEN', bd: 'con figuras de redes',
        body: 'El agua le habla a un adulto amplio, sin segmentar demasiado. Frutté apunta a un público adulto más joven y se apoya en figuras de redes para conectar con ese target.' },
      { a: 'URUGUAYISMO', ad: 'mundial, carnaval, origen de marca', b: 'DIVERSIÓN SIN CULPA', bd: 'lo sano sin perder lo divertido',
        body: 'El agua se posiciona desde lo uruguayo: el Mundial, el Carnaval, el origen de la marca. Frutté se posiciona desde el disfrute: lo sano sin perder la diversión.' },
      { a: '#YoPrefieroAgua', ad: 'el agua frente a los refrescos', b: 'FERIAS Y PUNTOS DE HIDRATACIÓN', bd: 'presencia en eventos gastronómicos',
        body: 'La bandera del agua es elegirla por encima de los refrescos (#YoPrefieroAgua). Frutté juega en otro lado: sponsoreo de ferias gastronómicas y puntos de hidratación, donde su categoría tiene sentido.' },
    ],
    lectura: 'No es una marca hablándole distinto a varios segmentos desde un mismo perfil: son dos cuentas separadas, cada una con su producto, su público y su tono. El agua se planta en el uruguayismo y en elegir agua frente al refresco; Frutté, en el disfrute sin culpa para un público más joven.'
  },


  /* ---------- FIG.E8 · matriz de contenidos de Prex (pre-2024) ---------- */
  figE8: {
    tipo: 'matriz',
    num: 'E8',
    nom: 'Ejercicio · la matriz de contenidos de Prex (hasta 2024)',
    hint: 'Tocá cada cuadrante para ver las piezas',
    ejeY: ['↑ EMOCIONAL', '↓ RACIONAL'],
    ejeX: ['← CONOCER (branding)', 'CONVERTIR (venta) →'],
    cuadrantes: [
      { eje: 'emocional', t: 'ENTRETENER', items: 'Pícnic · Copa Prex · eventos',
        body: 'Sponsoreo del festival gastronómico Pícnic en el Jardín Botánico y la Copa Prex–Pasión Real junto a la Fundación Real Madrid: contenido de comunidad y presencia, no de venta.' },
      { eje: 'emocional', t: 'INSPIRAR', items: '#2Millones · historias · inclusión',
        body: 'El relato de los #2Millones de usuarios con el hashtag #ConfianzaQueSeAgranda: historias que apelan a la emoción y al orgullo de pertenecer.' },
      { eje: 'racional', t: 'EDUCAR', items: 'educación financiera · cómo invertir · Prex Teen',
        body: 'Educación financiera, cómo invertir y la línea Prex Teen para que los adolescentes aprendan a administrar su plata. El pilar que le da autoridad a la marca.' },
      { eje: 'racional', t: 'CONVERTIR', items: 'abrí tu cuenta · créditos · inversiones',
        body: 'Prex Teen, créditos e inversiones con DriveWealth, con el llamado directo a abrir cuenta. El cuadrante de venta, el único que la mayoría de las marcas ocupa.' },
    ],
    lectura: 'Los mismos dos ejes: vertical, lo EMOCIONAL arriba (entretener, inspirar) y lo RACIONAL abajo (educar, convertir); horizontal, a la izquierda lo que da a CONOCER la marca y a la derecha lo que empuja a CONVERTIR. Hasta 2024 Prex repartía en los cuatro sin recostarse solo en la venta: eventos y comunidad para entretener (emocional/branding), el relato de los #2Millones para inspirar (emocional/conversión), educación financiera para educar (racional/branding) y sus productos para convertir (racional/venta). Ese equilibrio es justo lo que se rompe cuando todo el contenido se corre al cuadrante de conversión.'
  },


  /* ---------- FIG.E1 · Buyer Persona (ficha con foto) ---------- */
  figE1: {
    tipo: 'ficha',
    num: 'E1',
    nom: 'Ejercicio · Buyer Persona de Volcánica',
    hint: 'Tocá cada bloque para ver los campos',
    foto: 'assets/Martina.png',
    iniciales: 'MG',
    nombre: 'MARTINA GONZÁLEZ',
    datos: '31 años · Montevideo · sueldo medio-alto',
    lema: 'La curiosa que elige con criterio',
    bloques: [
      { t: '¿QUIÉN ES?', items: ['Diseñadora, personalidad curiosa e inquieta', 'Estudios terciarios · ingreso medio-alto', 'Sociable, valora lo auténtico sobre lo masivo'] },
      { t: 'INTERESES Y DESEOS', items: ['Finde de ferias, food trucks y previas en casa', 'Viaja cuando puede · ve series · escucha vinilos', 'Prefiere reuniones chicas a boliches grandes'] },
      { t: '¿DÓNDE SE ENCUENTRA?', items: ['Vive en Cordón, trabaja en Ciudad Vieja', 'Sale a comer a bares de barrio con onda', 'Busca la birra en almacenes de especialidad y bares'] },
      { t: '¿EN QUÉ MOMENTOS?', items: ['Estudió/trabaja de día, se libera de tarde', 'Viaja en bici o caminando, mira el celu en pausas', 'Tiempo libre: viernes de tarde en adelante'] },
      { t: '¿POR QUÉ ELIGE?', items: ['Le gusta el sabor con carácter, no la industrial', 'Jamás compraría la marca de todos; busca historia', 'Después de una buena, la recomienda y la postea'] },
      { t: '¿QUÉ HACE EN DIGITAL?', items: ['Vive en Instagram y un poco de TikTok', 'Produce: stories de lo que come y toma', 'Desconfía de lo demasiado publicitado; confía en el boca a boca'] },
    ],
    lectura: 'La ficha no describe a un cliente en abstracto: describe a Martina con la densidad suficiente para que, al escribir un posteo, sepamos si le hablamos a ella o no. Los campos digitales (dónde está, qué le da confianza) son los que después definen en qué red publicar y con qué tono.'
  },

  /* ---------- FIG.E2 · Mapa de Empatía ---------- */
  figE2: {
    tipo: 'empatia',
    num: 'E2',
    nom: 'Ejercicio · Mapa de Empatía del mismo Buyer Persona',
    hint: 'Tocá cada zona del mapa',
    centro: { t: 'CLIENTE', k: 'ideal' },
    cuadrantes: [
      { t: '¿QUÉ PIENSA Y SIENTE?', body: 'Quiere darse un gusto sin culpa; le importa que sea genuino, no careta.' },
      { t: '¿QUÉ VE?', body: 'Amigos posteando birras raras; ferias y bares de especialidad por todos lados.' },
      { t: '¿QUÉ DICE Y HACE?', body: 'Recomienda lo que descubre; habla de sabores; lleva la birra distinta a la previa.' },
      { t: '¿QUÉ ESCUCHA?', body: 'Amigos foodies; referentes que sigue; "probá esta que está buenísima".' },
    ],
    esfuerzos: 'Que le salga cara y no valga la pena; que sea otra "artesanal" de marketing sin nada distinto adentro.',
    beneficios: 'Descubrir algo rico y con historia para compartir; sentirse parte de algo auténtico y no masivo.',
    lectura: 'El Mapa de Empatía conecta directo con la balanza del valor: los esfuerzos y temores son los costos percibidos; los beneficios esperados, lo que Martina cree que va a recibir. Diseñar para ella es inclinar esa balanza.'
  },


  /* ---------- FIG.E4 · marketing mix de Grido (4P) ---------- */
  figE4: {
    tipo: 'tarjetas',
    num: 'E4',
    nom: 'Ejercicio · el marketing mix de Grido',
    hint: 'Tocá cada P para ver la decisión detrás',
    cols: 4,
    items: [
      { n: 'P1', t: 'PRODUCTO', k: 'volumen y variedad',
        body: 'El corazón son las cremas heladas de alta rotación —los clásicos cucuruchos bañados en chocolate—, pero Grido diversificó hacia tortas heladas, postres, paletas y una línea de congelados (Frizzio). La lógica es doble: un núcleo masivo que rota muchísimo y una variedad que capta distintas ocasiones. No es un producto premium de degustación: está pensado para el volumen.' },
      { n: 'P2', t: 'PRECIO', k: 'accesibilidad',
        body: 'Es el verdadero motor. El diferencial es la relación precio-calidad: un helado de calidad estandarizada a un precio accesible, un antojo que se puede repetir seguido sin culpa. Toda la operación —fábrica única en Córdoba, logística centralizada, producción de escala— existe para sostener ese precio bajo sin resignar volumen. Es la decisión de la que cuelga todo lo demás.' },
      { n: 'P3', t: 'PLAZA', k: 'proximidad',
        body: 'Quizá la P más ingeniosa. Grido no llega con grandes locales en avenidas caras: llega con franquicias de cercanía, de baja inversión inicial, una en cada barrio. Ese modelo de "franquicia inclusiva" —emprendedores locales que gestionan su propio local con acompañamiento de la marca— le dio un punto de venta a la vuelta de casa en decenas de ciudades uruguayas. Si el helado tiene que ser cotidiano, tiene que estar cerca.' },
      { n: 'P4', t: 'PROMOCIÓN', k: 'cercanía afectiva',
        body: 'La comunicación se apoya en lo emocional: familia, encuentro, momentos felices, cercanía comunitaria. No te habla del sabor gourmet: te habla del rato compartido. Suma jugadas tácticas como el cobranding (Milka, Oreo, Toddy) para entrar en distintos target, y el delivery vía PedidosYa como canal adicional. No promete lujo: promete pertenencia a un ritual barrial.' },
    ],
    lectura: 'Ninguna P trabaja sola: el producto de alta rotación permite el precio bajo; el precio bajo exige volumen; el volumen se logra con la plaza de cercanía; y la promoción emocional convierte ese consumo frecuente en hábito familiar. Sacá una pata y se cae la mesa.'
  },


  /* ---------- FIG.E7 · customer journey de Tienda Inglesa ---------- */
  figE7: {
    tipo: 'timeline',
    num: 'E7',
    nom: 'Ejercicio · el customer journey de Tienda Inglesa',
    hint: 'Tocá cada estación · activo, mensaje y llamado a la acción',
    escala: ['ZMOT · descubrimiento', 'fidelización'],
    pasos: [
      { n: '01', t: 'DESCUBRE', k: 'app · omnicanal',
        body: 'Micromomento ZMOT. Activo: la app y la presencia omnicanal. Mensaje: "tenés todos los mundos de Tienda Inglesa en un lugar". CTA: descargar / abrir.' },
      { n: '02', t: 'ARMA', k: 'compara · carrito',
        body: 'Micromomento "quiero comprar". Activo: el buscador y el carrito. Mensaje: "encontrá y compará rápido". CTA: agregar al carrito.' },
      { n: '03', t: 'ELIGE', k: 'Súper · Express · C&G',
        body: 'Micromomento "cómo lo quiero". Activo: las opciones Súper / Express / Click&Go. Mensaje: "vos elegís cómo y cuándo". CTA: seleccionar entrega.' },
      { n: '04', t: 'PAGA', k: 'checkout',
        body: 'La conversión. Activo: el checkout. Mensaje: "confirmá y listo". CTA: pagar. Y acá, según las reseñas, el recorrido se rompe: la estación más decisiva es la que falla.' },
      { n: '05', t: 'VUELVE', k: 'Ofertas para vos',
        body: 'Fidelización. Activo: "Ofertas para vos". Mensaje: "esto es para vos" (personalizado con tus datos). CTA: usar el cupón.' },
    ],
    lectura: 'El recorrido cubre distintos micromomentos con distintas modalidades, y está bien pensado de punta a punta. La estación crítica es paga: el punto de conversión donde, según las reseñas, el journey se rompe —justo donde más duele—.'
  },


  /* ---------- FIG.E5 · ecosistema digital de PedidosYa (nucleo) ---------- */
  figE5: {
    tipo: 'nucleo',
    num: 'E5',
    nom: 'Ejercicio · el ecosistema digital de PedidosYa',
    centro: { t: 'PEDIDOSYA', k: 'un mismo objetivo' },
    nota: 'La analítica está en el centro del sistema: cada activo devuelve datos, y ese es el hilo que mantiene todo coordinado.',
    hint: 'Tocá cada activo del ecosistema',
    items: [
      { t: 'APP / WEB', k: 'local 24/7',
        body: 'El local abierto todo el día: donde PedidosYa controla la experiencia de punta a punta y concreta la conversión (el pedido).' },
      { t: 'BUSCADORES', k: 'SEO · SEM',
        body: 'Aparecer justo cuando alguien busca "delivery cerca". SEO (orgánico) y SEM (pago) para estar en el momento en que preguntan.' },
      { t: 'REDES', k: 'comunidad',
        body: 'El espacio de la comunidad: presencia cotidiana, memes, conversación y construcción de vínculo con la audiencia.' },
      { t: 'PUSH / MAIL', k: '1 a 1',
        body: 'El canal más directo: notificaciones y mails uno a uno para reactivar al usuario dormido y avisar promociones puntuales.' },
      { t: 'ADS', k: 'posiciona',
        body: 'Publicidad paga que amplifica el alcance y posiciona la marca frente a públicos nuevos o en momentos clave.' },
      { t: 'ANALÍTICA', k: 'mide todo',
        body: 'La condición de entrada: cada activo devuelve datos. Sin medición no hay ajuste, y es el hilo que mantiene todo el sistema coordinado.' },
    ],
    lectura: 'Cada nodo cumple una función distinta, pero todos empujan lo mismo: recurrencia. La analítica es la condición de entrada —cada activo devuelve datos— y el hilo que mantiene al sistema coordinado.'
  },

  /* ---------- FIG.E6 · embudo de fidelización de PedidosYa Plus (embudo) ---------- */
  figE6: {
    tipo: 'embudo',
    num: 'E6',
    nom: 'Ejercicio · el embudo de fidelización de PedidosYa Plus',
    topLabel: 'muchos',
    bottomLabel: 'pocos',
    hint: 'Tocá cada etapa',
    etapas: [
      { t: 'DESCUBRE', k: 'baja la app',
        body: 'Arriba del embudo, el momento más masivo: la persona conoce PedidosYa y baja la app. Todavía no pidió nada.' },
      { t: 'PRUEBA', k: 'primer pedido',
        body: 'Hace su primer pedido. Es el salto de "usuario que bajó la app" a "cliente": la primera conversión real.' },
      { t: 'RECOMPRA', k: 'vuelve a pedir',
        body: 'Vuelve a pedir. Deja de ser una prueba y empieza a volverse hábito: acá arranca la retención.' },
      { t: 'SE SUSCRIBE', k: 'se hace Plus',
        body: 'Se suscribe a PedidosYa Plus. El vínculo se formaliza: paga por adelantado para tener beneficios, señal de compromiso.' },
      { t: 'FIDELIZACIÓN — PLUS', k: 'compra 3× más · recomienda',
        body: 'El objetivo real. El cliente Plus compra mucho más que el promedio y recomienda la marca: es pocos en número, pero muchísimo en valor.' },
    ],
    lectura: 'El usuario baja la app, hace un primer pedido, recompra y en algún punto se suscribe a Plus. La quinta etapa —la fidelización— es el objetivo real: el cliente Plus, que compra mucho más y trae a otros.'
  },

};
