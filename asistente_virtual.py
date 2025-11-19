# Importa el módulo tkinter, que permite crear interfaces gráficas de usuario (GUI) en Python.
import tkinter as tk

# Importa componentes específicos de tkinter: cuadro de texto con scroll y cuadros de diálogo de mensajes.
from tkinter import scrolledtext, messagebox

# Importa el módulo random, utilizado para seleccionar respuestas aleatorias de una lista.
import random

# Importa el módulo datetime, utilizado para trabajar con fechas y horarios actuales.
import datetime

# Importa el módulo sqlite3, que permite conectarse y trabajar con bases de datos SQLite embebidas.
import sqlite3


# Define la clase principal del sistema, que representa al asistente virtual para estudiantes.
class AsistenteVirtual:
    # Método constructor de la clase, se ejecuta al crear una nueva instancia de AsistenteVirtual.
    def __init__(self):
        # Crea la ventana principal de la interfaz gráfica.
        self.ventana = tk.Tk()
        # Establece el título de la ventana principal.
        self.ventana.title("Asistente Virtual - Estudiantes de Secundaria")
        # Define el tamaño de la ventana principal en píxeles (ancho x alto).
        self.ventana.geometry("700x600")
        # Configura el color de fondo de la ventana principal.
        self.ventana.configure(bg="#f0f0f0")

        # Llama al método que inicializa la base de datos SQLite y sus tablas.
        self.inicializar_base_datos()

        # Inicializa una lista en memoria para almacenar consultas no reconocidas.
        self.consultas_no_reconocidas = []

        # Carga desde la base de datos las consultas pendientes de resolución.
        self.cargar_consultas_pendientes()

        # Define un diccionario que agrupa respuestas predefinidas según categorías temáticas.
        self.respuestas = {
            # Categoría de respuestas de saludo inicial.
            "saludo": [
                "¡Hola! ¿En qué materia necesitas ayuda hoy?",
                "¡Hola! Estoy listo para ayudarte con tus estudios.",
                "¡Hola! Cuéntame, ¿en qué asignatura tienes dudas?"
            ],
            # Categoría de respuestas relacionadas con matemáticas.
            "matematicas": [
                "Las matemáticas son fundamentales. ¿Necesitas ayuda con álgebra, geometría o aritmética?",
                "Para resolver ecuaciones, recuerda: lo que haces de un lado, hazlo del otro.",
                "En geometría, recuerda las fórmulas básicas: área del círculo = π × r², área del rectángulo = base × altura.",
                "Los números negativos: cuando multiplicas dos negativos, el resultado es positivo.",
                "Para factorizar, busca primero el factor común más grande."
            ],
            # Categoría de respuestas de ciencias naturales (biología, química, física).
            "ciencias": [
                "Las ciencias nos ayudan a entender el mundo. ¿Te interesa biología, química o física?",
                "En biología, recuerda que la célula es la unidad básica de la vida.",
                "En química, los elementos se organizan en la tabla periódica según su número atómico.",
                "En física, velocidad = distancia / tiempo. Esta es una fórmula fundamental.",
                "La fotosíntesis: CO₂ + H₂O + luz solar → glucosa + O₂."
            ],
            # Categoría de respuestas relacionadas con historia.
            "historia": [
                "La historia nos enseña sobre el pasado para entender el presente.",
                "Es importante estudiar las fechas clave y entender las causas y consecuencias de los eventos.",
                "Hacer líneas de tiempo te ayudará a organizar mejor los eventos históricos.",
                "Conecta los eventos históricos con sus contextos sociales, económicos y políticos."
            ],
            # Categoría de respuestas de lengua y literatura.
            "lengua": [
                "La lengua y literatura desarrollan tu capacidad de comunicación.",
                "Lee mucho para mejorar tu vocabulario y comprensión lectora.",
                "Practica la escritura diariamente para mejorar tu redacción.",
                "Los conectores dan coherencia a tus textos: además, sin embargo, por lo tanto..."
            ],
            # Categoría de respuestas relacionadas con el idioma inglés.
            "ingles": [
                "El inglés es fundamental en el mundo globalizado. ¿Necesitas ayuda con gramática o vocabulario?",
                "Para mejorar tu inglés: lee, escucha música, ve películas con subtítulos.",
                "Los tiempos verbales básicos: Present Simple, Past Simple, Future Simple.",
                "Los phrasal verbs son muy importantes: get up, turn on, look for, etc."
            ],
            # Categoría de respuestas referidas a geografía.
            "geografia": [
                "La geografía estudia la Tierra y la relación entre el ser humano y su entorno.",
                "Aprende los continentes, océanos, países y capitales principales.",
                "El clima se ve afectado por la latitud, altitud, corrientes marinas y vientos."
            ],
            # Categoría de respuestas sobre educación física.
            "educacion_fisica": [
                "La educación física es esencial para el desarrollo integral.",
                "Mantén una rutina de ejercicio regular para mejorar tu salud.",
                "El calentamiento previo previene lesiones durante la actividad física.",
                "Una buena hidratación es fundamental durante el ejercicio."
            ],
            # Categoría de respuestas sobre arte.
            "arte": [
                "El arte es expresión y creatividad sin límites.",
                "Observa obras de diferentes artistas para inspirarte.",
                "Practica diferentes técnicas: dibujo, pintura, escultura.",
                "El arte refleja la sociedad y la época en la que se crea."
            ],
            # Categoría de respuestas sobre música.
            "musica": [
                "La música es el lenguaje universal de las emociones.",
                "Practica regularmente para mejorar tu técnica musical.",
                "Aprende teoría musical: notas, escalas, ritmos.",
                "Escucha diferentes géneros musicales para ampliar tu cultura."
            ],
            # Categoría de respuestas sobre filosofía.
            "filosofia": [
                "La filosofía te enseña a pensar críticamente.",
                "Cuestiona todo y busca comprender el porqué de las cosas.",
                "Los grandes filósofos nos enseñan diferentes formas de ver el mundo.",
                "La ética y la moral son fundamentales en la filosofía."
            ],
            # Categoría de respuestas sobre técnicas y consejos de estudio.
            "consejos_estudio": [
                "Crea un horario de estudio y síguelo consistentemente.",
                "Encuentra un lugar tranquilo y bien iluminado para estudiar.",
                "Toma descansos cada 45-60 minutos para mantener la concentración.",
                "Usa técnicas como mapas mentales y resúmenes para organizar la información.",
                "La técnica Pomodoro: 25 minutos de estudio, 5 minutos de descanso."
            ],
            # Categoría de respuestas sobre preparación para exámenes.
            "examenes": [
                "Para preparar exámenes: planifica con tiempo, no dejes todo para último momento.",
                "Haz un cronograma de repaso distribuyendo las materias por días.",
                "Practica con exámenes anteriores o ejercicios similares.",
                "Durante el examen: lee bien las preguntas y administra tu tiempo."
            ],
            # Categoría de respuestas sobre organización del tiempo.
            "tiempo": [
                "Organiza tu tiempo con un calendario semanal.",
                "Prioriza las tareas más importantes primero.",
                "Divide proyectos grandes en tareas más pequeñas.",
                "Usa recordatorios y alarmas para no olvidar compromisos importantes."
            ],
            # Categoría de respuestas motivacionales.
            "motivacion": [
                "¡Tú puedes lograrlo! Cada pequeño esfuerzo cuenta.",
                "Los errores son oportunidades de aprendizaje, no te desanimes.",
                "El éxito viene de la constancia y la dedicación.",
                "Celebra tus pequeños logros, son importantes para tu progreso.",
                "Recuerda por qué empezaste y mantén tus metas claras."
            ],
            # Categoría de respuestas de despedida.
            "despedida": [
                "¡Hasta luego! Que tengas un excelente día de estudio.",
                "¡Adiós! Recuerda que puedes volver cuando necesites ayuda.",
                "¡Nos vemos pronto! Sigue esforzándote en tus estudios."
            ]
        }

        # Define un diccionario que asocia palabras clave con categorías de respuestas.
        self.palabras_clave = {
            # Palabras de saludo asociadas a la categoría "saludo".
            "hola": "saludo",
            "buenos días": "saludo",
            "buenas tardes": "saludo",
            "buenas noches": "saludo",
            "hey": "saludo",
            "saludos": "saludo",

            # Palabras relacionadas con matemáticas asociadas a "matematicas".
            "matemáticas": "matematicas",
            "mates": "matematicas",
            "álgebra": "matematicas",
            "geometría": "matematicas",
            "números": "matematicas",
            "ecuaciones": "matematicas",
            "cálculo": "matematicas",
            "trigonometría": "matematicas",

            # Palabras relacionadas con ciencias naturales asociadas a "ciencias".
            "ciencias": "ciencias",
            "biología": "ciencias",
            "química": "ciencias",
            "física": "ciencias",
            "laboratorio": "ciencias",
            "experimento": "ciencias",

            # Palabras relacionadas con historia asociadas a "historia".
            "historia": "historia",
            "histórico": "historia",
            "pasado": "historia",
            "guerra": "historia",
            "revolución": "historia",

            # Palabras relacionadas con lengua y literatura asociadas a "lengua".
            "lengua": "lengua",
            "literatura": "lengua",
            "español": "lengua",
            "escribir": "lengua",
            "leer": "lengua",
            "redacción": "lengua",
            "gramática": "lengua",

            # Palabras relacionadas con inglés asociadas a "ingles".
            "inglés": "ingles",
            "english": "ingles",
            "pronunciación": "ingles",
            "vocabulario": "ingles",

            # Palabras relacionadas con geografía asociadas a "geografia".
            "geografía": "geografia",
            "mapas": "geografia",
            "países": "geografia",
            "continentes": "geografia",
            "clima": "geografia",

            # Palabras relacionadas con educación física asociadas a "educacion_fisica".
            "educación física": "educacion_fisica",
            "deporte": "educacion_fisica",
            "ejercicio": "educacion_fisica",

            # Palabras relacionadas con arte asociadas a "arte".
            "arte": "arte",
            "pintura": "arte",
            "dibujo": "arte",

            # Palabras relacionadas con música asociadas a "musica".
            "música": "musica",
            "canción": "musica",
            "instrumento": "musica",

            # Palabras relacionadas con filosofía asociadas a "filosofia".
            "filosofía": "filosofia",
            "ética": "filosofia",
            "moral": "filosofia",

            # Palabras relacionadas con estudio y técnicas de estudio asociadas a "consejos_estudio".
            "estudiar": "consejos_estudio",
            "estudio": "consejos_estudio",
            "concentración": "consejos_estudio",
            "horario": "consejos_estudio",
            "técnicas": "consejos_estudio",

            # Palabras relacionadas con exámenes asociadas a "examenes".
            "exámenes": "examenes",
            "examen": "examenes",
            "prueba": "examenes",
            "evaluación": "examenes",

            # Palabras relacionadas con organización del tiempo asociadas a "tiempo".
            "tiempo": "tiempo",
            "organizar": "tiempo",
            "planificar": "tiempo",

            # Palabras relacionadas con motivación asociadas a "motivacion".
            "motivación": "motivacion",
            "ánimo": "motivacion",
            "desanimado": "motivacion",
            "difícil": "motivacion",
            "cansado": "motivacion",
            "estrés": "motivacion",

            # Palabras relacionadas con despedida asociadas a "despedida".
            "adiós": "despedida",
            "hasta luego": "despedida",
            "chau": "despedida",
            "bye": "despedida",
            "nos vemos": "despedida"
        }

        # Llama al método que construye todos los elementos de la interfaz gráfica del asistente.
        self.crear_interfaz()

        # Registra una función de cierre para cuando el usuario intenta cerrar la ventana principal.
        self.ventana.protocol("WM_DELETE_WINDOW", self.cerrar_aplicacion)

    # ---------------------- BASE DE DATOS ----------------------

    # Método que inicializa la conexión y estructura de la base de datos SQLite.
    def inicializar_base_datos(self):
        """Crear/abrir la base de datos SQLite y las tablas necesarias"""
        # Abre una conexión a un archivo de base de datos SQLite llamado "asistente_virtual.db".
        self.conn = sqlite3.connect("asistente_virtual.db")
        # Obtiene un cursor para ejecutar sentencias SQL sobre la conexión actual.
        self.cursor = self.conn.cursor()

        # Ejecuta una sentencia SQL para crear la tabla de consultas pendientes si aún no existe.
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS consultas_pendientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mensaje TEXT NOT NULL,
                fecha TEXT NOT NULL,
                hora TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                estado TEXT NOT NULL,
                categoria TEXT,
                respuesta_docente TEXT,
                fecha_respuesta TEXT
            )
        """)

        # Confirma (hace commit) todos los cambios realizados en la base de datos.
        self.conn.commit()

    # Método para cargar desde la base de datos las consultas pendientes.
    def cargar_consultas_pendientes(self):
        """Cargar consultas pendientes desde la base de datos SQLite"""
        # Reinicia la lista en memoria de consultas no reconocidas.
        self.consultas_no_reconocidas = []
        try:
            # Selecciona todas las columnas relevantes de las consultas con estado "pendiente".
            self.cursor.execute("""
                SELECT id, mensaje, fecha, hora, timestamp, estado, categoria, respuesta_docente, fecha_respuesta
                FROM consultas_pendientes
                WHERE estado = 'pendiente'
                ORDER BY timestamp DESC
            """)
            # Recupera todas las filas resultantes de la consulta.
            filas = self.cursor.fetchall()
            # Recorre las filas obtenidas para convertirlas en diccionarios.
            for fila in filas:
                id_consulta, mensaje, fecha, hora, ts, estado, categoria, respuesta, fecha_resp = fila
                # Agrega cada consulta pendiente a la lista en memoria.
                self.consultas_no_reconocidas.append({
                    "id": id_consulta,
                    "mensaje": mensaje,
                    "fecha": fecha,
                    "hora": hora,
                    "timestamp": ts,
                    "estado": estado,
                    "categoria": categoria,
                    "respuesta_docente": respuesta,
                    "fecha_respuesta": fecha_resp
                })
        except Exception as e:
            # En caso de error, lo muestra por consola e inicializa la lista vacía.
            print(f"Error al cargar consultas desde la BD: {e}")
            self.consultas_no_reconocidas = []

    # Método para obtener todas las consultas (pendientes y resueltas)
    def obtener_todas_consultas(self):
        """Obtener todas las consultas de la base de datos"""
        try:
            self.cursor.execute("""
                SELECT id, mensaje, fecha, hora, timestamp, estado, categoria, respuesta_docente, fecha_respuesta
                FROM consultas_pendientes
                ORDER BY categoria, timestamp DESC
            """)
            filas = self.cursor.fetchall()
            consultas = []
            for fila in filas:
                id_consulta, mensaje, fecha, hora, ts, estado, categoria, respuesta, fecha_resp = fila
                consultas.append({
                    "id": id_consulta,
                    "mensaje": mensaje,
                    "fecha": fecha,
                    "hora": hora,
                    "timestamp": ts,
                    "estado": estado,
                    "categoria": categoria or "general",
                    "respuesta_docente": respuesta,
                    "fecha_respuesta": fecha_resp
                })
            return consultas
        except Exception as e:
            print(f"Error al obtener todas las consultas: {e}")
            return []

    # Método para detectar la categoría de un mensaje
    def detectar_categoria(self, mensaje):
        """Detectar la categoría del mensaje según las palabras clave"""
        mensaje_lower = mensaje.lower()
        for palabra_clave, categoria in self.palabras_clave.items():
            if palabra_clave in mensaje_lower:
                return categoria
        return "general"

    # Método que registra en BD y notifica al docente una consulta no reconocida por el asistente.
    def enviar_alerta_docente(self, consulta, categoria="general"):
        """Registrar en BD y notificar al docente sobre una consulta no reconocida"""
        # Obtiene la fecha y hora actuales del sistema.
        ahora = datetime.datetime.now()
        # Construye un diccionario con la información de la consulta no reconocida.
        consulta_info = {
            "mensaje": consulta,
            "fecha": ahora.strftime("%d/%m/%Y"),
            "hora": ahora.strftime("%H:%M:%S"),
            "timestamp": ahora.isoformat(),
            "estado": "pendiente",
            "categoria": categoria
        }

        # Intenta insertar la consulta en la tabla consultas_pendientes de la base de datos.
        try:
            self.cursor.execute("""
                INSERT INTO consultas_pendientes (mensaje, fecha, hora, timestamp, estado, categoria)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                consulta_info["mensaje"],
                consulta_info["fecha"],
                consulta_info["hora"],
                consulta_info["timestamp"],
                consulta_info["estado"],
                consulta_info["categoria"]
            ))
            # Confirma el registro de la nueva consulta en la base de datos.
            self.conn.commit()

            # Obtiene el ID de la consulta recién insertada
            consulta_info["id"] = self.cursor.lastrowid
        except Exception as e:
            # Si ocurre un error al guardar en la base de datos, se informa por consola.
            print(f"Error al guardar consulta en BD: {e}")
            return

        # Agrega la consulta recién registrada a la lista en memoria.
        self.consultas_no_reconocidas.append(consulta_info)

        # Llama al método que muestra una ventana emergente de alerta para el docente.
        self.mostrar_alerta_docente(consulta_info)

        # Imprime en consola información de registro para monitorear el funcionamiento.
        print("🚨 ALERTA DOCENTE - Nueva consulta no reconocida:")
        print(f"   Mensaje: {consulta}")
        print(f"   Categoría: {categoria}")
        print(f"   Fecha: {consulta_info['fecha']} - Hora: {consulta_info['hora']}")
        print(f"   Total consultas pendientes: {len(self.consultas_no_reconocidas)}")

    # ---------------------- INTERFAZ DOCENTE ----------------------

    # Método que construye y muestra una ventana de alerta para el docente con la consulta no reconocida.
    def mostrar_alerta_docente(self, consulta_info):
        """Mostrar ventana de alerta para el docente"""
        # Crea una nueva ventana secundaria (Toplevel) dependiente de la ventana principal.
        ventana_alerta = tk.Toplevel(self.ventana)
        # Establece el título de la ventana de alerta.
        ventana_alerta.title("🚨 Alerta Docente - Nueva Consulta")
        # Define el tamaño de la ventana de alerta.
        ventana_alerta.geometry("500x350")
        # Configura el color de fondo de la ventana de alerta.
        ventana_alerta.configure(bg="#fff3cd")
        # Indica que esta ventana es hija de la ventana principal.
        ventana_alerta.transient(self.ventana)
        # Bloquea la interacción con otras ventanas hasta cerrar ésta (modo modal).
        ventana_alerta.grab_set()

        # Posiciona la ventana de alerta cerca de la ventana principal utilizando sus coordenadas.
        ventana_alerta.geometry(
            "+%d+%d" % (self.ventana.winfo_rootx() + 50, self.ventana.winfo_rooty() + 50)
        )

        # Crea una etiqueta de título dentro de la ventana de alerta.
        titulo = tk.Label(
            ventana_alerta,
            text="🚨 NUEVA CONSULTA PENDIENTE",
            font=("Arial", 14, "bold"),
            bg="#fff3cd",
            fg="#856404"
        )
        # Muestra la etiqueta de título con un margen vertical.
        titulo.pack(pady=10)

        # Crea un contenedor (Frame) para los elementos de información de la consulta.
        info_frame = tk.Frame(ventana_alerta, bg="#fff3cd")
        # Coloca el contenedor en la ventana de alerta, expandiéndolo.
        info_frame.pack(pady=10, padx=20, fill=tk.BOTH, expand=True)

        # Muestra la categoría
        categoria_label = self.obtener_label_categoria(consulta_info.get("categoria", "general"))
        tk.Label(
            info_frame,
            text=f"📚 Categoría: {categoria_label}",
            font=("Arial", 10, "bold"),
            bg="#fff3cd",
            fg="#856404"
        ).pack(anchor=tk.W, pady=5)

        # Crea y muestra una etiqueta indicando que a continuación se verá la consulta del estudiante.
        tk.Label(
            info_frame,
            text="📝 Consulta del estudiante:",
            font=("Arial", 10, "bold"),
            bg="#fff3cd",
            fg="#856404"
        ).pack(anchor=tk.W)

        # Crea un widget de texto para mostrar el contenido completo de la consulta.
        consulta_text = tk.Text(
            info_frame,
            height=4,
            font=("Arial", 10),
            bg="white",
            fg="black",
            wrap=tk.WORD
        )
        # Inserta el mensaje del estudiante dentro del widget de texto.
        consulta_text.insert(tk.END, f'"{consulta_info["mensaje"]}"')
        # Configura el widget de texto como de solo lectura.
        consulta_text.config(state=tk.DISABLED)
        # Coloca el widget de texto en el contenedor info_frame.
        consulta_text.pack(fill=tk.BOTH, expand=True, pady=5)

        # Crea y muestra una etiqueta con la fecha y hora en que se registró la consulta.
        tk.Label(
            info_frame,
            text=f"⏰ Fecha y hora: {consulta_info['fecha']} - {consulta_info['hora']}",
            font=("Arial", 9),
            bg="#fff3cd",
            fg="#856404"
        ).pack(anchor=tk.W, pady=5)

        # Crea un contenedor para los botones de acción.
        botones_frame = tk.Frame(ventana_alerta, bg="#fff3cd")
        # Coloca el contenedor de botones en la ventana de alerta.
        botones_frame.pack(pady=10)

        # Crea un botón para abrir el panel que muestra todas las consultas pendientes.
        btn_ver_todas = tk.Button(
            botones_frame,
            text="📋 Ver Todas las Consultas",
            font=("Arial", 9, "bold"),
            bg="#17a2b8",
            fg="white",
            command=self.abrir_panel_docente
        )
        # Coloca el botón en el contenedor de botones, con separación horizontal.
        btn_ver_todas.pack(side=tk.LEFT, padx=5)

        # Crea un botón para cerrar la ventana de alerta y confirmar que el docente la vio.
        btn_cerrar = tk.Button(
            botones_frame,
            text="✅ Entendido",
            font=("Arial", 9, "bold"),
            bg="#28a745",
            fg="white",
            command=ventana_alerta.destroy
        )
        # Coloca el botón de cierre al lado del botón anterior.
        btn_cerrar.pack(side=tk.LEFT, padx=5)

    def obtener_label_categoria(self, categoria):
        """Obtener el label legible de una categoría"""
        labels = {
            'matematicas': 'Matemáticas',
            'ciencias': 'Ciencias',
            'historia': 'Historia',
            'lengua': 'Lengua y Literatura',
            'ingles': 'Inglés',
            'geografia': 'Geografía',
            'educacion_fisica': 'Educación Física',
            'arte': 'Arte',
            'musica': 'Música',
            'filosofia': 'Filosofía',
            'consejos_estudio': 'Consejos de Estudio',
            'examenes': 'Exámenes',
            'tiempo': 'Organización del Tiempo',
            'motivacion': 'Motivación',
            'general': 'General'
        }
        return labels.get(categoria, 'General')

    # Método que construye y muestra el panel docente completo con la lista de consultas pendientes.
    def abrir_panel_docente(self):
        """Abrir panel de administración para docentes"""
        # Crea una nueva ventana secundaria para el panel docente.
        ventana_docente = tk.Toplevel(self.ventana)
        # Establece el título de la ventana del panel docente.
        ventana_docente.title("👨‍🏫 Panel Docente - Consultas Pendientes")
        # Define el tamaño de la ventana del panel docente.
        ventana_docente.geometry("800x600")
        # Configura el color de fondo de la ventana del panel docente.
        ventana_docente.configure(bg="#f8f9fa")

        # Crea una etiqueta de título principal para el panel docente.
        titulo = tk.Label(
            ventana_docente,
            text="👨‍🏫 PANEL DOCENTE",
            font=("Arial", 16, "bold"),
            bg="#f8f9fa",
            fg="#2c3e50"
        )
        # Coloca el título en la parte superior de la ventana.
        titulo.pack(pady=10)

        # Crea un contenedor principal para agrupar los elementos del panel docente.
        main_frame = tk.Frame(ventana_docente, bg="#f8f9fa")
        # Coloca el contenedor principal, permitiendo que se expanda.
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)

        # Crea un marco con título para mostrar la lista de consultas pendientes.
        consultas_frame = tk.LabelFrame(
            main_frame,
            text="📋 Consultas Pendientes",
            font=("Arial", 12, "bold"),
            bg="#f8f9fa",
            fg="#2c3e50"
        )
        # Coloca el marco de consultas dentro del contenedor principal.
        consultas_frame.pack(fill=tk.BOTH, expand=True, pady=10)

        # Crea un cuadro de texto con barra de desplazamiento para mostrar las consultas.
        self.texto_consultas = scrolledtext.ScrolledText(
            consultas_frame,
            width=90,
            height=18,
            font=("Arial", 10),
            bg="white",
            fg="black"
        )
        # Coloca el cuadro de texto con scroll dentro del marco de consultas.
        self.texto_consultas.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)

        # Crea un contenedor para los botones de control del panel docente.
        botones_frame = tk.Frame(main_frame, bg="#f8f9fa")
        # Coloca el contenedor de botones al final del panel.
        botones_frame.pack(fill=tk.X, pady=10)

        # Crea un botón para actualizar la lista de consultas con los datos más recientes de la BD.
        btn_actualizar = tk.Button(
            botones_frame,
            text="🔄 Actualizar",
            font=("Arial", 10, "bold"),
            bg="#007bff",
            fg="white",
            command=lambda: self.actualizar_lista_consultas()
        )
        # Coloca el botón de actualización en el panel de botones.
        btn_actualizar.pack(side=tk.LEFT, padx=5)

        # Crea un botón para marcar todas las consultas pendientes como resueltas.
        btn_marcar_todas = tk.Button(
            botones_frame,
            text="✅ Marcar Todas",
            font=("Arial", 10, "bold"),
            bg="#28a745",
            fg="white",
            command=self.marcar_todas_resueltas
        )
        # Coloca el botón para marcar todas las consultas en el panel de botones.
        btn_marcar_todas.pack(side=tk.LEFT, padx=5)

        # Crea un botón para ver todas las consultas organizadas por materia
        btn_consultas_previas = tk.Button(
            botones_frame,
            text="📊 Consultas Previas",
            font=("Arial", 10, "bold"),
            bg="#9b59b6",
            fg="white",
            command=self.mostrar_consultas_previas
        )
        btn_consultas_previas.pack(side=tk.LEFT, padx=5)

        # Crea un botón para exportar las consultas a un archivo de texto externo.
        btn_exportar = tk.Button(
            botones_frame,
            text="📄 Exportar",
            font=("Arial", 10, "bold"),
            bg="#ffc107",
            fg="black",
            command=self.exportar_consultas
        )
        # Coloca el botón de exportación junto a los demás botones.
        btn_exportar.pack(side=tk.LEFT, padx=5)

        # Llama al método para cargar inmediatamente las consultas dentro del cuadro de texto.
        self.actualizar_lista_consultas()

    # Método que actualiza el contenido de la lista de consultas en el panel docente.
    def actualizar_lista_consultas(self):
        """Actualizar la lista de consultas en el panel docente desde la BD"""
        # Recarga las consultas pendientes desde la base de datos.
        self.cargar_consultas_pendientes()

        # Permite la edición temporal del cuadro de texto para actualizar su contenido.
        self.texto_consultas.config(state=tk.NORMAL)
        # Borra todo el contenido actual del cuadro de texto.
        self.texto_consultas.delete(1.0, tk.END)

        # Verifica si no hay consultas pendientes.
        if not self.consultas_no_reconocidas:
            # Muestra un mensaje indicando que no hay consultas pendientes.
            self.texto_consultas.insert(tk.END, "✅ No hay consultas pendientes.\n\n")
        else:
            # Muestra el total de consultas pendientes registradas.
            self.texto_consultas.insert(
                tk.END,
                f"📊 TOTAL DE CONSULTAS PENDIENTES: {len(self.consultas_no_reconocidas)}\n"
            )
            # Agrega una línea divisoria visual.
            self.texto_consultas.insert(tk.END, "=" * 80 + "\n\n")

            # Recorre la lista de consultas y las va escribiendo una por una.
            for i, consulta in enumerate(self.consultas_no_reconocidas, 1):
                # Inserta el número de consulta.
                self.texto_consultas.insert(tk.END, f"🔸 CONSULTA #{i}\n")
                # Inserta la categoría
                categoria_label = self.obtener_label_categoria(consulta.get('categoria', 'general'))
                self.texto_consultas.insert(tk.END, f"📚 Categoría: {categoria_label}\n")
                # Inserta la fecha y hora de la consulta.
                self.texto_consultas.insert(
                    tk.END,
                    f"📅 Fecha: {consulta['fecha']} - ⏰ Hora: {consulta['hora']}\n"
                )
                # Inserta el ID de la consulta
                self.texto_consultas.insert(
                    tk.END,
                    f"🆔 ID: {consulta['id']}\n"
                )
                # Inserta el mensaje del estudiante.
                self.texto_consultas.insert(
                    tk.END,
                    f"📝 Mensaje: \"{consulta['mensaje']}\"\n"
                )
                # Inserta el estado actual de la consulta en mayúsculas.
                self.texto_consultas.insert(
                    tk.END,
                    f"📊 Estado: {consulta['estado'].upper()}\n"
                )

                # Botones de acción para cada consulta
                self.texto_consultas.insert(tk.END, "\n")

                # Inserta una línea separadora entre consultas.
                self.texto_consultas.insert(tk.END, "-" * 60 + "\n\n")

        # Vuelve a establecer el cuadro de texto como de solo lectura.
        self.texto_consultas.config(state=tk.DISABLED)

    def mostrar_consultas_previas(self):
        """Mostrar todas las consultas organizadas por materia"""
        consultas = self.obtener_todas_consultas()

        if not consultas:
            messagebox.showinfo("Información", "No hay consultas registradas en el sistema.")
            return

        # Agrupar consultas por categoría
        consultas_por_categoria = {}
        for consulta in consultas:
            categoria = consulta['categoria']
            if categoria not in consultas_por_categoria:
                consultas_por_categoria[categoria] = []
            consultas_por_categoria[categoria].append(consulta)

        # Crear ventana
        ventana_previas = tk.Toplevel(self.ventana)
        ventana_previas.title("📊 Consultas Previas por Materia")
        ventana_previas.geometry("900x700")
        ventana_previas.configure(bg="#f8f9fa")

        # Título
        titulo = tk.Label(
            ventana_previas,
            text="📊 Todas las Consultas por Materia",
            font=("Arial", 16, "bold"),
            bg="#f8f9fa",
            fg="#2c3e50"
        )
        titulo.pack(pady=10)

        # Estadísticas generales
        total = len(consultas)
        resueltas = sum(1 for c in consultas if c['estado'] == 'resuelta')
        pendientes = sum(1 for c in consultas if c['estado'] == 'pendiente')

        stats_frame = tk.Frame(ventana_previas, bg="#e9ecef", relief=tk.RIDGE, borderwidth=2)
        stats_frame.pack(fill=tk.X, padx=20, pady=10)

        stats_text = f"📈 Total: {total} | 📚 Materias: {len(consultas_por_categoria)} | ✅ Resueltas: {resueltas} | ⏳ Pendientes: {pendientes}"
        tk.Label(
            stats_frame,
            text=stats_text,
            font=("Arial", 11, "bold"),
            bg="#e9ecef",
            fg="#2c3e50"
        ).pack(pady=10)

        # Área con scroll para las consultas
        texto_frame = tk.Frame(ventana_previas)
        texto_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)

        texto_scroll = scrolledtext.ScrolledText(
            texto_frame,
            width=100,
            height=30,
            font=("Arial", 9),
            bg="white",
            fg="black"
        )
        texto_scroll.pack(fill=tk.BOTH, expand=True)

        # Ordenar categorías por cantidad de consultas
        categorias_ordenadas = sorted(
            consultas_por_categoria.items(),
            key=lambda x: len(x[1]),
            reverse=True
        )

        # Mostrar consultas por categoría
        for categoria, consultas_cat in categorias_ordenadas:
            categoria_label = self.obtener_label_categoria(categoria)
            total_cat = len(consultas_cat)
            resueltas_cat = sum(1 for c in consultas_cat if c['estado'] == 'resuelta')
            pendientes_cat = sum(1 for c in consultas_cat if c['estado'] == 'pendiente')

            texto_scroll.insert(tk.END, "=" * 90 + "\n")
            texto_scroll.insert(tk.END, f"📚 {categoria_label.upper()}\n", "categoria")
            texto_scroll.insert(tk.END, f"Total: {total_cat} | ✅ Resueltas: {resueltas_cat} | ⏳ Pendientes: {pendientes_cat}\n")
            texto_scroll.insert(tk.END, "=" * 90 + "\n\n")

            for i, consulta in enumerate(consultas_cat, 1):
                estado_emoji = "✅" if consulta['estado'] == 'resuelta' else "⏳"
                texto_scroll.insert(tk.END, f"{estado_emoji} Consulta #{i}\n")
                texto_scroll.insert(tk.END, f"📅 {consulta['fecha']} - {consulta['hora']}\n")
                texto_scroll.insert(tk.END, f"🆔 ID: {consulta['id']}\n")
                texto_scroll.insert(tk.END, f"📝 Consulta: \"{consulta['mensaje']}\"\n")

                if consulta['respuesta_docente']:
                    texto_scroll.insert(tk.END, f"👨‍🏫 Respuesta: \"{consulta['respuesta_docente']}\"\n")
                    if consulta['fecha_respuesta']:
                        texto_scroll.insert(tk.END, f"📅 Respondida: {consulta['fecha_respuesta']}\n")

                texto_scroll.insert(tk.END, "-" * 70 + "\n\n")

            texto_scroll.insert(tk.END, "\n")

        # Configurar tags para formato
        texto_scroll.tag_config("categoria", font=("Arial", 11, "bold"), foreground="#e74c3c")
        texto_scroll.config(state=tk.DISABLED)

        # Botón de cerrar
        btn_cerrar = tk.Button(
            ventana_previas,
            text="Cerrar",
            font=("Arial", 11, "bold"),
            bg="#6c757d",
            fg="white",
            command=ventana_previas.destroy
        )
        btn_cerrar.pack(pady=10)

    # Método que marca todas las consultas con estado "pendiente" como "resuelta" en la base de datos.
    def marcar_todas_resueltas(self):
        """Marcar todas las consultas como resueltas (actualizando la BD)"""
        try:
            # Consulta cuántas consultas pendientes existen actualmente en la base de datos.
            self.cursor.execute(
                "SELECT COUNT(*) FROM consultas_pendientes WHERE estado = 'pendiente'"
            )
            # Recupera el valor numérico que indica la cantidad de pendientes.
            total_pendientes = self.cursor.fetchone()[0]
        except Exception as e:
            # En caso de error, muestra un mensaje emergente informando el problema.
            messagebox.showerror("Error", f"Error al consultar la BD: {e}")
            return

        # Verifica si hay al menos una consulta pendiente.
        if total_pendientes > 0:
            # Pregunta al usuario (docente) si confirma marcar todas como resueltas.
            respuesta = messagebox.askyesno(
                "Confirmar",
                f"¿Estás seguro de marcar como resueltas las {total_pendientes} consultas pendientes?"
            )
            # Si el usuario confirma la acción, procede con la actualización.
            if respuesta:
                try:
                    # Actualiza el campo estado de todas las consultas pendientes a "resuelta".
                    self.cursor.execute("""
                        UPDATE consultas_pendientes
                        SET estado = 'resuelta',
                            fecha_respuesta = ?
                        WHERE estado = 'pendiente'
                    """, (datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S"),))
                    # Confirma los cambios en la base de datos.
                    self.conn.commit()

                    # Recarga las consultas desde la base para reflejar el nuevo estado.
                    self.cargar_consultas_pendientes()
                    # Actualiza la visualización en el panel docente.
                    self.actualizar_lista_consultas()

                    # Notifica al usuario que la operación fue exitosa.
                    messagebox.showinfo(
                        "Éxito",
                        "Todas las consultas han sido marcadas como resueltas."
                    )
                except Exception as e:
                    # Si se produce un error al actualizar la base de datos, se notifica mediante un mensaje emergente.
                    messagebox.showerror("Error", f"Error al actualizar la BD: {e}")
        else:
            # Si no hay consultas pendientes, se informa al usuario.
            messagebox.showinfo("Información", "No hay consultas pendientes.")

    # Método que exporta las consultas pendientes a un archivo de texto externo.
    def exportar_consultas(self):
        """Exportar todas las consultas a un archivo de texto desde la BD"""
        # Obtiene todas las consultas
        consultas = self.obtener_todas_consultas()

        # Verifica si la lista está vacía.
        if not consultas:
            # Informa al usuario que no hay datos para exportar.
            messagebox.showinfo("Información", "No hay consultas para exportar.")
            return

        try:
            # Genera un nombre de archivo único usando la fecha y hora actuales.
            nombre_archivo = (
                f"consultas_export_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
            )
            # Abre el archivo en modo escritura con codificación UTF-8.
            with open(nombre_archivo, 'w', encoding='utf-8') as archivo:
                # Escribe un encabezado general en el archivo.
                archivo.write("REPORTE DE CONSULTAS\n")
                archivo.write("=" * 50 + "\n\n")
                # Escribe la fecha y hora de generación del reporte.
                archivo.write(
                    f"Fecha de exportación: "
                    f"{datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n"
                )
                # Escribe el total de consultas incluidas en el reporte.
                archivo.write(
                    f"Total de consultas: {len(consultas)}\n\n"
                )

                # Recorre cada consulta y la vuelca en el archivo de texto.
                for i, consulta in enumerate(consultas, 1):
                    archivo.write(f"CONSULTA #{i}\n")
                    archivo.write(
                        f"Fecha: {consulta['fecha']} - Hora: {consulta['hora']}\n"
                    )
                    if consulta['categoria']:
                        categoria_label = self.obtener_label_categoria(consulta['categoria'])
                        archivo.write(f"Categoría: {categoria_label}\n")
                    archivo.write(f"Mensaje: \"{consulta['mensaje']}\"\n")
                    archivo.write(f"Estado: {consulta['estado'].upper()}\n")
                    if consulta['respuesta_docente']:
                        archivo.write(f"Respuesta del docente: \"{consulta['respuesta_docente']}\"\n")
                        if consulta['fecha_respuesta']:
                            archivo.write(f"Fecha respuesta: {consulta['fecha_respuesta']}\n")
                    archivo.write("-" * 30 + "\n\n")

            # Informa al usuario que el archivo se generó correctamente.
            messagebox.showinfo(
                "Éxito",
                f"Consultas exportadas exitosamente a: {nombre_archivo}"
            )
        except Exception as e:
            # En caso de error al generar o escribir el archivo, se muestra un mensaje emergente.
            messagebox.showerror("Error", f"Error al exportar consultas: {e}")

    # ---------------------- INTERFAZ PRINCIPAL ----------------------

    # Método que construye todos los elementos de la interfaz principal del asistente virtual.
    def crear_interfaz(self):
        # Crea una etiqueta que funciona como título principal del asistente en la ventana.
        titulo = tk.Label(
            self.ventana,
            text="🤖 Asistente Virtual para Estudiantes",
            font=("Arial", 16, "bold"),
            bg="#f0f0f0",
            fg="#2c3e50"
        )
        # Ubica el título en la parte superior con un espacio vertical.
        titulo.pack(pady=10)

        # Crea un botón que permite acceder al panel docente desde la interfaz principal.
        btn_panel_docente = tk.Button(
            self.ventana,
            text="👨‍🏫 Panel Docente",
            font=("Arial", 10, "bold"),
            bg="#dc3545",
            fg="white",
            command=self.abrir_panel_docente,
            cursor="hand2"
        )
        # Sitúa el botón de panel docente debajo del título.
        btn_panel_docente.pack(pady=5)

        # Crea un área de texto con scroll para mostrar la conversación completa del chat.
        self.area_chat = scrolledtext.ScrolledText(
            self.ventana,
            width=80,
            height=15,
            font=("Arial", 10),
            bg="white",
            fg="black",
            state=tk.DISABLED
        )
        # Coloca el área de chat en la ventana principal, permitiendo que se expanda.
        self.area_chat.pack(padx=10, pady=5, fill=tk.BOTH, expand=True)

        # Crea un contenedor para agrupar la entrada de texto del usuario y el botón de envío.
        frame_entrada = tk.Frame(self.ventana, bg="#f0f0f0")
        # Ubica el contenedor de entrada en la parte inferior de la ventana.
        frame_entrada.pack(fill=tk.X, padx=10, pady=5)

        # Crea el campo de entrada donde el estudiante escribe sus mensajes.
        self.entrada_texto = tk.Entry(
            frame_entrada,
            font=("Arial", 12),
            width=60
        )
        # Coloca el campo de entrada, permitiendo que se expanda horizontalmente.
        self.entrada_texto.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 5))
        # Asocia la tecla Enter para que envíe el mensaje automáticamente.
        self.entrada_texto.bind("<Return>", self.enviar_mensaje)

        # Crea el botón que permite al usuario enviar su mensaje al asistente.
        boton_enviar = tk.Button(
            frame_entrada,
            text="Enviar",
            font=("Arial", 10, "bold"),
            bg="#3498db",
            fg="white",
            command=self.enviar_mensaje,
            cursor="hand2"
        )
        # Coloca el botón de envío a la derecha del campo de entrada.
        boton_enviar.pack(side=tk.RIGHT)

        # Crea un contenedor para los botones de ayuda rápida con comandos predefinidos.
        frame_botones = tk.Frame(self.ventana, bg="#f0f0f0")
        # Coloca el contenedor de botones rápidos debajo del área de chat.
        frame_botones.pack(fill=tk.X, padx=10, pady=5)

        # Define una lista de botones de ayuda rápida, cada uno con un texto visible y un comando asociado.
        botones_ayuda = [
            ("🔢 Matemáticas", "ayuda con matemáticas"),
            ("🧪 Ciencias", "ayuda con ciencias"),
            ("🏛️ Historia", "ayuda con historia"),
            ("📖 Lengua", "ayuda con lengua"),
            ("🌐 Inglés", "ayuda con inglés"),
            ("🌍 Geografía", "ayuda con geografía"),
            ("🏃 Ed. Física", "ayuda con educación física"),
            ("🎨 Arte", "ayuda con arte"),
            ("🎵 Música", "ayuda con música"),
            ("🤔 Filosofía", "ayuda con filosofía"),
            ("📚 Consejos", "consejos de estudio"),
            ("💪 Motivación", "necesito motivación"),
            ("📝 Exámenes", "preparar exámenes"),
            ("⏰ Tiempo", "organizar tiempo")
        ]

        # Recorre la lista de botones de ayuda rápida para crearlos dinámicamente.
        for i, (texto, comando) in enumerate(botones_ayuda):
            # Crea un botón por cada elemento de la lista, con su texto y comando correspondiente.
            boton = tk.Button(
                frame_botones,
                text=texto,
                font=("Arial", 8),
                bg="#ecf0f1",
                fg="#2c3e50",
                command=lambda cmd=comando: self.procesar_comando_rapido(cmd),
                cursor="hand2"
            )
            # Coloca cada botón en una cuadrícula de 5 columnas, ajustando su posición según el índice.
            boton.grid(row=i // 5, column=i % 5, padx=2, pady=2, sticky="ew")

        # Configura cada columna del contenedor de botones para que se expanda proporcionalmente.
        for i in range(5):
            frame_botones.columnconfigure(i, weight=1)

        # Define el texto del mensaje de bienvenida que se mostrará al iniciar el asistente.
        mensaje_bienvenida = (
            "¡Hola! Soy tu asistente virtual educativo. Estoy aquí para ayudarte con tus estudios.\n\n"
            "Puedes preguntarme sobre:\n"
            "• Matemáticas, Ciencias, Historia, Lengua, Inglés, Geografía\n"
            "• Educación Física, Arte, Música, Filosofía\n"
            "• Consejos de estudio y técnicas de aprendizaje\n"
            "• Preparación de exámenes\n"
            "• Organización del tiempo\n"
            "• Motivación y apoyo académico\n\n"
            "Si tu consulta no está en mi base de conocimientos, "
            "será enviada automáticamente a un docente para que te ayude.\n\n"
            "¡Empecemos!"
        )

        # Muestra el mensaje de bienvenida en el área de chat, con el remitente "Asistente".
        self.mostrar_mensaje("Asistente", mensaje_bienvenida)
        # Establece el foco del teclado en el campo de entrada de texto.
        self.entrada_texto.focus()

    # ---------------------- LÓGICA DEL CHAT ----------------------

    # Método que muestra un mensaje (del estudiante o del asistente) en el área de chat.
    def mostrar_mensaje(self, remitente, mensaje):
        """Mostrar mensaje en el área de chat"""
        # Cambia el estado del área de chat a editable temporalmente.
        self.area_chat.config(state=tk.NORMAL)
        # Inserta el texto del remitente y el mensaje, seguidos de una línea en blanco.
        self.area_chat.insert(tk.END, f"{remitente}: {mensaje}\n\n")
        # Desplaza la vista hacia el final del área de chat para ver el último mensaje.
        self.area_chat.yview(tk.END)
        # Vuelve a establecer el área de chat como de solo lectura.
        self.area_chat.config(state=tk.DISABLED)

    # Método que gestiona el envío de mensajes por parte del usuario.
    def enviar_mensaje(self, event=None):
        """Enviar mensaje del usuario y procesar respuesta"""
        # Obtiene el texto actual del campo de entrada y elimina espacios en blanco iniciales y finales.
        mensaje = self.entrada_texto.get().strip()
        # Si el campo está vacío, no realiza ninguna acción.
        if not mensaje:
            return

        # Muestra en el área de chat el mensaje enviado por el estudiante.
        self.mostrar_mensaje("Estudiante", mensaje)
        # Limpia el campo de entrada de texto para el siguiente mensaje.
        self.entrada_texto.delete(0, tk.END)

        # Llama al método que analizará el mensaje y generará una respuesta adecuada.
        respuesta = self.procesar_mensaje(mensaje)

        # Muestra la respuesta generada por el asistente en el área de chat.
        self.mostrar_mensaje("Asistente", respuesta)

    # Método que permite procesar un comando rápido a partir de un botón predefinido.
    def procesar_comando_rapido(self, comando):
        """Procesar un comando rápido desde los botones"""
        # Limpia el campo de entrada de texto.
        self.entrada_texto.delete(0, tk.END)
        # Inserta el comando predefinido en el campo de entrada.
        self.entrada_texto.insert(0, comando)
        # Llama al método de envío de mensaje para procesar automáticamente ese comando.
        self.enviar_mensaje()

    # Método principal de lógica, que analiza el mensaje del estudiante y decide qué respuesta devolver.
    def procesar_mensaje(self, mensaje):
        """Analizar el mensaje y devolver una respuesta"""
        # Convierte el mensaje a minúsculas para facilitar la búsqueda de palabras clave.
        mensaje_lower = mensaje.lower()

        # Inicializa la variable que guardará la categoría encontrada, si existe.
        categoria_encontrada = None
        # Recorre el diccionario de palabras clave para ver si alguna está contenida en el mensaje.
        for palabra_clave, categoria in self.palabras_clave.items():
            # Verifica si la palabra clave actual se encuentra en el texto del mensaje.
            if palabra_clave in mensaje_lower:
                # Si se encuentra, almacena la categoría correspondiente y termina la búsqueda.
                categoria_encontrada = categoria
                break

        # Si se encontró una categoría y esta existe en el diccionario de respuestas…
        if categoria_encontrada and categoria_encontrada in self.respuestas:
            # Devuelve una respuesta aleatoria dentro de la lista asociada a esa categoría.
            return random.choice(self.respuestas[categoria_encontrada])

        # Si el mensaje contiene la palabra "hora", responde con la hora actual del sistema.
        if "hora" in mensaje_lower:
            return f"Son las {datetime.datetime.now().strftime('%H:%M')} horas."

        # Si el mensaje contiene la palabra "fecha", responde con la fecha actual.
        if "fecha" in mensaje_lower:
            return f"Hoy es {datetime.datetime.now().strftime('%d de %B de %Y')}."

        # Si el mensaje contiene la palabra "nombre", responde explicando la identidad del asistente.
        if "nombre" in mensaje_lower:
            return (
                "Soy tu asistente virtual especializado en educación secundaria. "
                "¡Estoy aquí para ayudarte!"
            )

        # Si el mensaje hace referencia a "materias" o "asignaturas", lista las áreas en las que puede ayudar.
        if "materias" in mensaje_lower or "asignaturas" in mensaje_lower:
            return (
                "Puedo ayudarte con estas materias:\n\n"
                "📚 Materias principales:\n"
                "• Matemáticas • Ciencias (Biología, Química, Física)\n"
                "• Historia • Lengua y Literatura • Inglés • Geografía\n"
                "• Educación Física • Arte • Música • Filosofía\n\n"
                "🎯 Apoyo académico:\n"
                "• Técnicas de estudio • Preparación de exámenes\n"
                "• Organización del tiempo • Motivación\n\n"
                "¡Usa los botones de ayuda rápida o escribe tu pregunta!"
            )

        # Si el mensaje contiene la palabra "ayuda" o "help", explica las capacidades generales del asistente.
        if "ayuda" in mensaje_lower or "help" in mensaje_lower:
            return (
                "¡Estoy aquí para ayudarte! Puedo asistirte con:\n\n"
                "📚 Todas las materias de secundaria\n"
                "🎯 Técnicas de estudio y preparación de exámenes\n"
                "💪 Motivación y consejos académicos\n\n"
                "💡 Cómo usar el asistente:\n"
                "• Usa los botones de ayuda rápida\n"
                "• Escribe tu pregunta directamente\n"
                "• Si no puedo ayudarte, un docente será notificado\n\n"
                "¡Estoy aquí para ayudarte a tener éxito en tus estudios!"
            )

        # Si ninguna condición anterior se cumple, se considera que la consulta no fue reconocida.
        # Detecta la categoría del mensaje
        categoria = self.detectar_categoria(mensaje)
        # En ese caso, se envía una alerta al docente con el contenido de la consulta.
        self.enviar_alerta_docente(mensaje, categoria)

        # Devuelve al estudiante un mensaje informando que su consulta será evaluada por un docente.
        return (
            "🔔 Tu consulta será evaluada por un Docente\n\n"
            "Gracias por tu pregunta. He registrado tu consulta y "
            "en breve un docente se comunicará contigo para brindarte "
            "la ayuda específica que necesitas.\n\n"
            f"📝 Tu consulta: \"{mensaje}\"\n"
            f"⏰ Registrada a las: {datetime.datetime.now().strftime('%H:%M')}\n\n"
            "Mientras tanto, puedes:\n"
            "• Explorar las materias disponibles usando los botones\n"
            "• Hacer preguntas sobre temas que sí puedo ayudarte\n"
            "• Revisar los consejos de estudio\n\n"
            "¡Gracias por tu paciencia!"
        )

    # ---------------------- CIERRE ----------------------

    # Método que se ejecuta al cerrar la aplicación, liberando recursos de la base de datos.
    def cerrar_aplicacion(self):
        """Cerrar ventana y conexión a la base de datos"""
        try:
            # Intenta cerrar la conexión con la base de datos SQLite.
            self.conn.close()
        except Exception:
            # Si ocurre algún error al cerrar la conexión, se omite sin interrumpir el cierre.
            pass
        # Destruye la ventana principal y finaliza la interfaz gráfica.
        self.ventana.destroy()

    # Método público que inicia el bucle principal de la interfaz gráfica para mantener la ventana activa.
    def ejecutar(self):
        # Entra en el loop principal de eventos de tkinter.
        self.ventana.mainloop()


# Verifica que el archivo se esté ejecutando directamente y no siendo importado como módulo.
if __name__ == "__main__":
    # Crea una instancia de la clase AsistenteVirtual.
    asistente = AsistenteVirtual()
    # Llama al método ejecutar para iniciar la aplicación.
    asistente.ejecutar()
