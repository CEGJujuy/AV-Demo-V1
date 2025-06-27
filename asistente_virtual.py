# Importamos todas las librerías necesarias
import tkinter as tk  # Librería estándar de Python para crear interfaces gráficas
from tkinter import scrolledtext, messagebox  # Widgets adicionales para texto con scroll y mensajes emergentes
import random  # Nos servirá para seleccionar respuestas al azar
import datetime  # Permite trabajar la hora y fecha actual
import json  # Para guardar las consultas no reconocidas
import os  # Para manejo de archivos

# Definimos la clase "Asistente Virtual"
class AsistenteVirtual:
    def __init__(self):
        # Creamos la Pantalla Principal
        self.ventana = tk.Tk()
        self.ventana.title("Asistente Virtual - Estudiantes de Secundaria")
        self.ventana.geometry("700x600")
        self.ventana.configure(bg="#f0f0f0")

        # Lista para almacenar consultas no reconocidas
        self.consultas_no_reconocidas = []
        self.archivo_consultas = "consultas_pendientes.json"
        
        # Cargar consultas pendientes previas
        self.cargar_consultas_pendientes()

        # Organizamos el Diccionario de respuestas por categorías
        self.respuestas = {
            "saludo": [
                "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
                "¡Hola! ¿Cómo estás? ¿Necesitas ayuda con algo?",
                "¡Saludos! Estoy aquí para ayudarte con tus estudios."
            ],
            "matematicas": [
                "Las matemáticas son fundamentales. ¿Necesitas ayuda con álgebra, geometría o aritmética?",
                "Para resolver ecuaciones, recuerda: lo que haces de un lado, hazlo del otro.",
                "En geometría, recuerda las fórmulas básicas: área del círculo = π × r², área del rectángulo = base × altura.",
                "Los números negativos: cuando multiplicas dos negativos, el resultado es positivo.",
                "Para factorizar, busca primero el factor común más grande."
            ],
            "ciencias": [
                "Las ciencias nos ayudan a entender el mundo. ¿Te interesa biología, química o física?",
                "En biología, recuerda que la célula es la unidad básica de la vida.",
                "En química, los elementos se organizan en la tabla periódica según su número atómico.",
                "En física, velocidad = distancia / tiempo. Esta es una fórmula fundamental.",
                "La fotosíntesis: CO₂ + H₂O + luz solar → glucosa + O₂"
            ],
            "historia": [
                "La historia nos enseña sobre el pasado para entender el presente.",
                "Es importante estudiar las fechas clave y entender las causas y consecuencias de los eventos.",
                "Hacer líneas de tiempo te ayudará a organizar mejor los eventos históricos.",
                "Conecta los eventos históricos con sus contextos sociales, económicos y políticos."
            ],
            "lengua": [
                "La lengua y literatura desarrollan tu capacidad de comunicación.",
                "Lee mucho para mejorar tu vocabulario y comprensión lectora.",
                "Practica la escritura diariamente para mejorar tu redacción.",
                "Los conectores dan coherencia a tus textos: además, sin embargo, por lo tanto..."
            ],
            "ingles": [
                "El inglés es fundamental en el mundo globalizado. ¿Necesitas ayuda con gramática o vocabulario?",
                "Para mejorar tu inglés: lee, escucha música, ve películas con subtítulos.",
                "Los tiempos verbales básicos: Present Simple, Past Simple, Future Simple.",
                "Phrasal verbs son muy importantes: get up, turn on, look for, etc."
            ],
            "geografia": [
                "La geografía estudia la Tierra y la relación entre el ser humano y su entorno.",
                "Aprende los continentes, océanos, países y capitales principales.",
                "El clima se ve afectado por la latitud, altitud, corrientes marinas y vientos."
            ],
            "consejos_estudio": [
                "Crea un horario de estudio y síguelo consistentemente.",
                "Encuentra un lugar tranquilo y bien iluminado para estudiar.",
                "Toma descansos cada 45-60 minutos para mantener la concentración.",
                "Usa técnicas como mapas mentales y resúmenes para organizar la información.",
                "La técnica Pomodoro: 25 minutos de estudio, 5 minutos de descanso."
            ],
            "examenes": [
                "Para preparar exámenes: planifica con tiempo, no dejes todo para último momento.",
                "Haz un cronograma de repaso distribuyendo las materias por días.",
                "Practica con exámenes anteriores o ejercicios similares.",
                "Durante el examen: lee bien las preguntas, administra tu tiempo."
            ],
            "motivacion": [
                "¡Tú puedes lograrlo! Cada pequeño esfuerzo cuenta.",
                "Los errores son oportunidades de aprendizaje, no te desanimes.",
                "El éxito viene de la constancia y la dedicación.",
                "Celebra tus pequeños logros, son importantes para tu progreso.",
                "Recuerda por qué empezaste y mantén tus metas claras."
            ],
            "despedida": [
                "¡Hasta luego! Que tengas un excelente día de estudio.",
                "¡Nos vemos! Recuerda que siempre estoy aquí para ayudarte.",
                "¡Adiós! Sigue esforzándote, vas por buen camino."
            ]
        }

        # Establecemos el Diccionario que relaciona palabras clave y categorías
        self.palabras_clave = {
            "hola": "saludo",
            "buenos días": "saludo",
            "buenas tardes": "saludo",
            "buenas noches": "saludo",
            "hey": "saludo",
            "saludos": "saludo",
            "matemáticas": "matematicas",
            "mates": "matematicas",
            "álgebra": "matematicas",
            "geometría": "matematicas",
            "números": "matematicas",
            "ecuaciones": "matematicas",
            "cálculo": "matematicas",
            "trigonometría": "matematicas",
            "ciencias": "ciencias",
            "biología": "ciencias",
            "química": "ciencias",
            "física": "ciencias",
            "laboratorio": "ciencias",
            "experimento": "ciencias",
            "historia": "historia",
            "histórico": "historia",
            "pasado": "historia",
            "guerra": "historia",
            "revolución": "historia",
            "lengua": "lengua",
            "literatura": "lengua",
            "español": "lengua",
            "escribir": "lengua",
            "leer": "lengua",
            "redacción": "lengua",
            "gramática": "lengua",
            "inglés": "ingles",
            "english": "ingles",
            "pronunciación": "ingles",
            "vocabulario": "ingles",
            "geografía": "geografia",
            "mapas": "geografia",
            "países": "geografia",
            "continentes": "geografia",
            "clima": "geografia",
            "estudiar": "consejos_estudio",
            "estudio": "consejos_estudio",
            "concentración": "consejos_estudio",
            "horario": "consejos_estudio",
            "técnicas": "consejos_estudio",
            "exámenes": "examenes",
            "examen": "examenes",
            "prueba": "examenes",
            "evaluación": "examenes",
            "motivación": "motivacion",
            "ánimo": "motivacion",
            "desanimado": "motivacion",
            "difícil": "motivacion",
            "cansado": "motivacion",
            "estrés": "motivacion",
            "adiós": "despedida",
            "hasta luego": "despedida",
            "chau": "despedida",
            "bye": "despedida",
            "nos vemos": "despedida"
        }

        # Se crea la interfaz gráfica
        self.crear_interfaz()

    def cargar_consultas_pendientes(self):
        """Cargar consultas pendientes desde archivo JSON"""
        try:
            if os.path.exists(self.archivo_consultas):
                with open(self.archivo_consultas, 'r', encoding='utf-8') as archivo:
                    self.consultas_no_reconocidas = json.load(archivo)
        except Exception as e:
            print(f"Error al cargar consultas pendientes: {e}")
            self.consultas_no_reconocidas = []

    def guardar_consultas_pendientes(self):
        """Guardar consultas pendientes en archivo JSON"""
        try:
            with open(self.archivo_consultas, 'w', encoding='utf-8') as archivo:
                json.dump(self.consultas_no_reconocidas, archivo, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error al guardar consultas pendientes: {e}")

    def enviar_alerta_docente(self, consulta):
        """Función para enviar alerta al docente sobre consulta no reconocida"""
        consulta_info = {
            "mensaje": consulta,
            "fecha": datetime.datetime.now().strftime("%d/%m/%Y"),
            "hora": datetime.datetime.now().strftime("%H:%M:%S"),
            "timestamp": datetime.datetime.now().isoformat(),
            "estado": "pendiente"
        }
        
        # Agregar a la lista de consultas no reconocidas
        self.consultas_no_reconocidas.append(consulta_info)
        
        # Guardar en archivo
        self.guardar_consultas_pendientes()
        
        # Mostrar alerta visual al docente
        self.mostrar_alerta_docente(consulta_info)
        
        # Log para el sistema
        print(f"🚨 ALERTA DOCENTE - Nueva consulta no reconocida:")
        print(f"   Mensaje: {consulta}")
        print(f"   Fecha: {consulta_info['fecha']} - Hora: {consulta_info['hora']}")
        print(f"   Total consultas pendientes: {len(self.consultas_no_reconocidas)}")

    def mostrar_alerta_docente(self, consulta_info):
        """Mostrar ventana de alerta para el docente"""
        ventana_alerta = tk.Toplevel(self.ventana)
        ventana_alerta.title("🚨 Alerta Docente - Nueva Consulta")
        ventana_alerta.geometry("500x300")
        ventana_alerta.configure(bg="#fff3cd")
        ventana_alerta.transient(self.ventana)
        ventana_alerta.grab_set()
        
        # Centrar la ventana
        ventana_alerta.geometry("+%d+%d" % (self.ventana.winfo_rootx() + 50, self.ventana.winfo_rooty() + 50))
        
        # Título
        titulo = tk.Label(ventana_alerta, text="🚨 NUEVA CONSULTA PENDIENTE", 
                         font=("Arial", 14, "bold"), bg="#fff3cd", fg="#856404")
        titulo.pack(pady=10)
        
        # Información de la consulta
        info_frame = tk.Frame(ventana_alerta, bg="#fff3cd")
        info_frame.pack(pady=10, padx=20, fill=tk.BOTH, expand=True)
        
        tk.Label(info_frame, text="📝 Consulta del estudiante:", 
                font=("Arial", 10, "bold"), bg="#fff3cd", fg="#856404").pack(anchor=tk.W)
        
        consulta_text = tk.Text(info_frame, height=4, font=("Arial", 10), 
                               bg="white", fg="black", wrap=tk.WORD)
        consulta_text.insert(tk.END, f'"{consulta_info["mensaje"]}"')
        consulta_text.config(state=tk.DISABLED)
        consulta_text.pack(fill=tk.BOTH, expand=True, pady=5)
        
        tk.Label(info_frame, text=f"⏰ Fecha y hora: {consulta_info['fecha']} - {consulta_info['hora']}", 
                font=("Arial", 9), bg="#fff3cd", fg="#856404").pack(anchor=tk.W, pady=5)
        
        # Botones
        botones_frame = tk.Frame(ventana_alerta, bg="#fff3cd")
        botones_frame.pack(pady=10)
        
        btn_ver_todas = tk.Button(botones_frame, text="📋 Ver Todas las Consultas", 
                                 font=("Arial", 9, "bold"), bg="#17a2b8", fg="white",
                                 command=lambda: self.abrir_panel_docente())
        btn_ver_todas.pack(side=tk.LEFT, padx=5)
        
        btn_cerrar = tk.Button(botones_frame, text="✅ Entendido", 
                              font=("Arial", 9, "bold"), bg="#28a745", fg="white",
                              command=ventana_alerta.destroy)
        btn_cerrar.pack(side=tk.LEFT, padx=5)

    def abrir_panel_docente(self):
        """Abrir panel de administración para docentes"""
        ventana_docente = tk.Toplevel(self.ventana)
        ventana_docente.title("👨‍🏫 Panel Docente - Consultas Pendientes")
        ventana_docente.geometry("700x500")
        ventana_docente.configure(bg="#f8f9fa")
        
        # Título
        titulo = tk.Label(ventana_docente, text="👨‍🏫 PANEL DOCENTE", 
                         font=("Arial", 16, "bold"), bg="#f8f9fa", fg="#2c3e50")
        titulo.pack(pady=10)
        
        # Frame principal
        main_frame = tk.Frame(ventana_docente, bg="#f8f9fa")
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)
        
        # Lista de consultas
        consultas_frame = tk.LabelFrame(main_frame, text="📋 Consultas Pendientes", 
                                       font=("Arial", 12, "bold"), bg="#f8f9fa", fg="#2c3e50")
        consultas_frame.pack(fill=tk.BOTH, expand=True, pady=10)
        
        # Área de texto con scroll para mostrar consultas
        self.texto_consultas = scrolledtext.ScrolledText(consultas_frame, width=80, height=15, 
                                                        font=("Arial", 10), bg="white", fg="black")
        self.texto_consultas.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)
        
        # Botones de control
        botones_frame = tk.Frame(main_frame, bg="#f8f9fa")
        botones_frame.pack(fill=tk.X, pady=10)
        
        btn_actualizar = tk.Button(botones_frame, text="🔄 Actualizar Lista", 
                                  font=("Arial", 10, "bold"), bg="#007bff", fg="white",
                                  command=self.actualizar_lista_consultas)
        btn_actualizar.pack(side=tk.LEFT, padx=5)
        
        btn_marcar_todas = tk.Button(botones_frame, text="✅ Marcar Todas como Resueltas", 
                                    font=("Arial", 10, "bold"), bg="#28a745", fg="white",
                                    command=self.marcar_todas_resueltas)
        btn_marcar_todas.pack(side=tk.LEFT, padx=5)
        
        btn_exportar = tk.Button(botones_frame, text="📄 Exportar Consultas", 
                                font=("Arial", 10, "bold"), bg="#ffc107", fg="black",
                                command=self.exportar_consultas)
        btn_exportar.pack(side=tk.LEFT, padx=5)
        
        # Cargar consultas inicialmente
        self.actualizar_lista_consultas()

    def actualizar_lista_consultas(self):
        """Actualizar la lista de consultas en el panel docente"""
        self.texto_consultas.config(state=tk.NORMAL)
        self.texto_consultas.delete(1.0, tk.END)
        
        if not self.consultas_no_reconocidas:
            self.texto_consultas.insert(tk.END, "✅ No hay consultas pendientes.\n\n")
        else:
            self.texto_consultas.insert(tk.END, f"📊 TOTAL DE CONSULTAS PENDIENTES: {len(self.consultas_no_reconocidas)}\n")
            self.texto_consultas.insert(tk.END, "=" * 70 + "\n\n")
            
            for i, consulta in enumerate(self.consultas_no_reconocidas, 1):
                self.texto_consultas.insert(tk.END, f"🔸 CONSULTA #{i}\n")
                self.texto_consultas.insert(tk.END, f"📅 Fecha: {consulta['fecha']} - ⏰ Hora: {consulta['hora']}\n")
                self.texto_consultas.insert(tk.END, f"📝 Mensaje: \"{consulta['mensaje']}\"\n")
                self.texto_consultas.insert(tk.END, f"📊 Estado: {consulta['estado'].upper()}\n")
                self.texto_consultas.insert(tk.END, "-" * 50 + "\n\n")
        
        self.texto_consultas.config(state=tk.DISABLED)

    def marcar_todas_resueltas(self):
        """Marcar todas las consultas como resueltas"""
        if self.consultas_no_reconocidas:
            respuesta = messagebox.askyesno("Confirmar", 
                                          f"¿Estás seguro de marcar las {len(self.consultas_no_reconocidas)} consultas como resueltas?")
            if respuesta:
                self.consultas_no_reconocidas.clear()
                self.guardar_consultas_pendientes()
                self.actualizar_lista_consultas()
                messagebox.showinfo("Éxito", "Todas las consultas han sido marcadas como resueltas.")
        else:
            messagebox.showinfo("Información", "No hay consultas pendientes.")

    def exportar_consultas(self):
        """Exportar consultas a un archivo de texto"""
        if not self.consultas_no_reconocidas:
            messagebox.showinfo("Información", "No hay consultas para exportar.")
            return
        
        try:
            nombre_archivo = f"consultas_export_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
            with open(nombre_archivo, 'w', encoding='utf-8') as archivo:
                archivo.write("REPORTE DE CONSULTAS PENDIENTES\n")
                archivo.write("=" * 50 + "\n\n")
                archivo.write(f"Fecha de exportación: {datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
                archivo.write(f"Total de consultas: {len(self.consultas_no_reconocidas)}\n\n")
                
                for i, consulta in enumerate(self.consultas_no_reconocidas, 1):
                    archivo.write(f"CONSULTA #{i}\n")
                    archivo.write(f"Fecha: {consulta['fecha']} - Hora: {consulta['hora']}\n")
                    archivo.write(f"Mensaje: \"{consulta['mensaje']}\"\n")
                    archivo.write(f"Estado: {consulta['estado']}\n")
                    archivo.write("-" * 30 + "\n\n")
            
            messagebox.showinfo("Éxito", f"Consultas exportadas exitosamente a: {nombre_archivo}")
        except Exception as e:
            messagebox.showerror("Error", f"Error al exportar consultas: {e}")

    def crear_interfaz(self):
        # Se Agrega el título en la ventana
        titulo = tk.Label(self.ventana, text="🤖 Asistente Virtual para Estudiantes", 
                         font=("Arial", 16, "bold"), bg="#f0f0f0", fg="#2c3e50")
        titulo.pack(pady=10)

        # Botón para panel docente
        btn_panel_docente = tk.Button(self.ventana, text="👨‍🏫 Panel Docente", 
                                     font=("Arial", 10, "bold"), bg="#dc3545", fg="white",
                                     command=self.abrir_panel_docente, cursor="hand2")
        btn_panel_docente.pack(pady=5)

        # Definimos el Área donde se mostrará la conversación
        self.area_chat = scrolledtext.ScrolledText(self.ventana, width=80, height=20, 
                                                  font=("Arial", 10), bg="white", fg="black", 
                                                  state=tk.DISABLED)
        self.area_chat.pack(padx=10, pady=5, fill=tk.BOTH, expand=True)

        # Definimos el Marco para la entrada de texto y botón
        frame_entrada = tk.Frame(self.ventana, bg="#f0f0f0")
        frame_entrada.pack(fill=tk.X, padx=10, pady=5)

        # Definimos la Entrada para que el usuario ingrese las consultas
        self.entrada_texto = tk.Entry(frame_entrada, font=("Arial", 12), width=60)
        self.entrada_texto.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 5))
        self.entrada_texto.bind("<Return>", self.enviar_mensaje)

        # Definimos el Botón para enviar el mensaje
        boton_enviar = tk.Button(frame_entrada, text="Enviar", font=("Arial", 10, "bold"), 
                                bg="#3498db", fg="white", command=self.enviar_mensaje, cursor="hand2")
        boton_enviar.pack(side=tk.RIGHT)

        # Se establece el Marco para botones rápidos
        frame_botones = tk.Frame(self.ventana, bg="#f0f0f0")
        frame_botones.pack(fill=tk.X, padx=10, pady=5)

        # Definimos los Botones de ayuda rápida
        botones_ayuda = [
            ("📚 Consejos de Estudio", "consejos de estudio"),
            ("💪 Motivación", "necesito motivación"),
            ("🔢 Matemáticas", "ayuda con matemáticas"),
            ("🧪 Ciencias", "ayuda con ciencias"),
            ("📖 Lengua", "ayuda con lengua"),
            ("🌍 Geografía", "ayuda con geografía")
        ]
        
        for i, (texto, comando) in enumerate(botones_ayuda):
            boton = tk.Button(frame_botones, text=texto, font=("Arial", 8), 
                             bg="#ecf0f1", fg="#2c3e50", 
                             command=lambda cmd=comando: self.procesar_comando_rapido(cmd), 
                             cursor="hand2")
            boton.grid(row=i//3, column=i%3, padx=2, pady=2, sticky="ew")
        
        # Configurar columnas para que se expandan uniformemente
        for i in range(3):
            frame_botones.columnconfigure(i, weight=1)

        # Muestra del Mensaje inicial de bienvenida
        mensaje_bienvenida = ("¡Hola! Soy tu asistente virtual educativo. Estoy aquí para ayudarte con tus estudios.\n\n"
                             "Puedes preguntarme sobre:\n"
                             "• Matemáticas, Ciencias, Historia, Lengua, Inglés, Geografía\n"
                             "• Consejos de estudio y técnicas de aprendizaje\n"
                             "• Preparación de exámenes\n"
                             "• Motivación y apoyo académico\n\n"
                             "Si tu consulta no está en mi base de conocimientos, "
                             "será enviada automáticamente a un docente para que te ayude.\n\n"
                             "¡Empecemos!")
        
        self.mostrar_mensaje("Asistente", mensaje_bienvenida)
        self.entrada_texto.focus()

    def mostrar_mensaje(self, remitente, mensaje):
        # Habilita el área para insertar texto
        self.area_chat.config(state=tk.NORMAL)
        hora = datetime.datetime.now().strftime("%H:%M")  # Hora actual
        if remitente == "Tú":
            self.area_chat.insert(tk.END, f"[{hora}] {remitente}: {mensaje}\n", "usuario")
        else:
            self.area_chat.insert(tk.END, f"[{hora}] {remitente}: {mensaje}\n\n", "asistente")
        self.area_chat.config(state=tk.DISABLED)
        self.area_chat.see(tk.END)  # Baja el scroll al final

    def procesar_comando_rapido(self, comando):
        # Insertamos el comando directamente en el campo de entrada
        self.entrada_texto.delete(0, tk.END)
        self.entrada_texto.insert(0, comando)
        self.enviar_mensaje()

    def enviar_mensaje(self, event=None):
        mensaje = self.entrada_texto.get().strip()
        if not mensaje:
            return
        self.mostrar_mensaje("Tú", mensaje)
        self.entrada_texto.delete(0, tk.END)
        respuesta = self.procesar_mensaje(mensaje)
        self.mostrar_mensaje("Asistente", respuesta)

    def procesar_mensaje(self, mensaje):
        mensaje_lower = mensaje.lower()
        
        # Buscar palabra clave
        categoria_encontrada = None
        for palabra_clave, categoria in self.palabras_clave.items():
            if palabra_clave in mensaje_lower:
                categoria_encontrada = categoria
                break
        
        # Si encontramos una categoría, devolver respuesta aleatoria
        if categoria_encontrada and categoria_encontrada in self.respuestas:
            return random.choice(self.respuestas[categoria_encontrada])
        
        # Respuestas automáticas específicas
        if "hora" in mensaje_lower:
            return f"Son las {datetime.datetime.now().strftime('%H:%M')} horas."
        
        if "fecha" in mensaje_lower:
            return f"Hoy es {datetime.datetime.now().strftime('%d de %B de %Y')}."
        
        if "nombre" in mensaje_lower:
            return "Soy tu asistente virtual especializado en educación secundaria. ¡Estoy aquí para ayudarte!"
        
        if "materias" in mensaje_lower or "asignaturas" in mensaje_lower:
            return ("Puedo ayudarte con estas materias:\n\n"
                   "📚 Materias principales:\n"
                   "• Matemáticas • Ciencias (Biología, Química, Física)\n"
                   "• Historia • Lengua y Literatura • Inglés • Geografía\n\n"
                   "🎯 Apoyo académico:\n"
                   "• Técnicas de estudio • Preparación de exámenes\n"
                   "• Organización del tiempo • Motivación\n\n"
                   "¡Usa los botones de ayuda rápida o escribe tu pregunta!")
        
        if "ayuda" in mensaje_lower or "help" in mensaje_lower:
            return ("¡Estoy aquí para ayudarte! Puedo asistirte con:\n\n"
                   "📚 Todas las materias de secundaria\n"
                   "🎯 Técnicas de estudio y preparación de exámenes\n"
                   "💪 Motivación y consejos académicos\n\n"
                   "💡 Cómo usar el asistente:\n"
                   "• Usa los botones de ayuda rápida\n"
                   "• Escribe tu pregunta directamente\n"
                   "• Si no puedo ayudarte, un docente será notificado\n\n"
                   "¡Estoy aquí para ayudarte a tener éxito en tus estudios!")
        
        # Si llegamos aquí, la consulta no fue reconocida
        # Enviar alerta al docente
        self.enviar_alerta_docente(mensaje)
        
        # Devolver mensaje de alerta al estudiante
        return (f"🔔 Tu consulta será evaluada por un Docente\n\n"
                f"Gracias por tu pregunta. He registrado tu consulta y "
                f"en breve un docente se comunicará contigo para brindarte "
                f"la ayuda específica que necesitas.\n\n"
                f"📝 Tu consulta: \"{mensaje}\"\n"
                f"⏰ Registrada a las: {datetime.datetime.now().strftime('%H:%M')}\n\n"
                f"Mientras tanto, puedes:\n"
                f"• Explorar las materias disponibles usando los botones\n"
                f"• Hacer preguntas sobre temas que sí puedo ayudarte\n"
                f"• Revisar los consejos de estudio\n\n"
                f"¡Gracias por tu paciencia!")

    def ejecutar(self):
        self.ventana.mainloop()

# Ejecutamos la aplicación
if __name__ == "__main__":
    asistente = AsistenteVirtual()
    asistente.ejecutar()