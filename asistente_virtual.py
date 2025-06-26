# Importamos todas las librerías necesarias
import tkinter as tk  # Librería estándar de Python para crear interfaces gráficas
from tkinter import scrolledtext, messagebox  # Widgets adicionales para texto con scroll y mensajes emergentes
import random  # Nos servirá para seleccionar respuestas al azar
import datetime  # Permite trabajar la hora y fecha actual

# Definimos la clase "Asistente Virtual"
class AsistenteVirtual:
    def __init__(self):
        # Creamos la Pantalla Principal
        self.ventana = tk.Tk()
        self.ventana.title("Asistente Virtual - Estudiantes de Secundaria")
        self.ventana.geometry("600x500")
        self.ventana.configure(bg="#f0f0f0")

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
                "En geometría, recuerda las fórmulas básicas: área del círculo = π × r², área del rectángulo = base × altura."
            ],
            "ciencias": [
                "Las ciencias nos ayudan a entender el mundo. ¿Te interesa biología, química o física?",
                "En biología, recuerda que la célula es la unidad básica de la vida.",
                "En química, los elementos se organizan en la tabla periódica según su número atómico."
            ],
            "historia": [
                "La historia nos enseña sobre el pasado para entender el presente.",
                "Es importante estudiar las fechas clave y entender las causas y consecuencias de los eventos.",
                "Hacer líneas de tiempo te ayudará a organizar mejor los eventos históricos."
            ],
            "lengua": [
                "La lengua y literatura desarrollan tu capacidad de comunicación.",
                "Lee mucho para mejorar tu vocabulario y comprensión lectora.",
                "Practica la escritura diariamente para mejorar tu redacción."
            ],
            "consejos_estudio": [
                "Crea un horario de estudio y síguelo consistentemente.",
                "Encuentra un lugar tranquilo y bien iluminado para estudiar.",
                "Toma descansos cada 45-60 minutos para mantener la concentración.",
                "Usa técnicas como mapas mentales y resúmenes para organizar la información."
            ],
            "motivacion": [
                "¡Tú puedes lograrlo! Cada pequeño esfuerzo cuenta.",
                "Los errores son oportunidades de aprendizaje, no te desanimes.",
                "El éxito viene de la constancia y la dedicación.",
                "Celebra tus pequeños logros, son importantes para tu progreso."
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
            "hey": "saludo",
            "matemáticas": "matematicas",
            "mates": "matematicas",
            "álgebra": "matematicas",
            "geometría": "matematicas",
            "números": "matematicas",
            "ecuaciones": "matematicas",
            "ciencias": "ciencias",
            "biología": "ciencias",
            "química": "ciencias",
            "física": "ciencias",
            "historia": "historia",
            "lengua": "lengua",
            "literatura": "lengua",
            "español": "lengua",
            "escribir": "lengua",
            "leer": "lengua",
            "estudiar": "consejos_estudio",
            "estudio": "consejos_estudio",
            "concentración": "consejos_estudio",
            "horario": "consejos_estudio",
            "motivación": "motivacion",
            "ánimo": "motivacion",
            "desanimado": "motivacion",
            "difícil": "motivacion",
            "adiós": "despedida",
            "hasta luego": "despedida",
            "chau": "despedida",
            "bye": "despedida"
        }

        # Se crea la interfaz gráfica
        self.crear_interfaz()

    def crear_interfaz(self):
        # Se Agrega el título en la ventana
        titulo = tk.Label(self.ventana, text="🤖 Asistente Virtual para Estudiantes", font=("Arial", 16, "bold"), bg="#f0f0f0", fg="#2c3e50")
        titulo.pack(pady=10)

        # Definimos el Área donde se mostrará la conversación
        self.area_chat = scrolledtext.ScrolledText(self.ventana, width=70, height=20, font=("Arial", 10), bg="white", fg="black", state=tk.DISABLED)
        self.area_chat.pack(padx=10, pady=5, fill=tk.BOTH, expand=True)

        # Definimos el Marco para la entrada de texto y botón
        frame_entrada = tk.Frame(self.ventana, bg="#f0f0f0")
        frame_entrada.pack(fill=tk.X, padx=10, pady=5)

        # Definimos la Entrada para que el usuario ingrese las consultas
        self.entrada_texto = tk.Entry(frame_entrada, font=("Arial", 12), width=50)
        self.entrada_texto.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 5))
        self.entrada_texto.bind("<Return>", self.enviar_mensaje)

        # Definimos el Botón para enviar el mensaje
        boton_enviar = tk.Button(frame_entrada, text="Enviar", font=("Arial", 10, "bold"), bg="#3498db", fg="white", command=self.enviar_mensaje, cursor="hand2")
        boton_enviar.pack(side=tk.RIGHT)

        # Se establece el Marco para botones rápidos
        frame_botones = tk.Frame(self.ventana, bg="#f0f0f0")
        frame_botones.pack(fill=tk.X, padx=10, pady=5)

        # Definimos los Botones de ayuda rápida
        botones_ayuda = [
            ("📚 Consejos de Estudio", "consejos de estudio"),
            ("💪 Motivación", "necesito motivación"),
            ("🔢 Matemáticas", "ayuda con matemáticas"),
            ("🧪 Ciencias", "ayuda con ciencias")
        ]
        for texto, comando in botones_ayuda:
            boton = tk.Button(frame_botones, text=texto, font=("Arial", 8), bg="#ecf0f1", fg="#2c3e50", command=lambda cmd=comando: self.procesar_comando_rapido(cmd), cursor="hand2")
            boton.pack(side=tk.LEFT, padx=2, pady=2)

        # Muestra del Mensaje inicial de bienvenida
        self.mostrar_mensaje("Asistente", "¡Hola! Soy tu asistente virtual. Estoy aquí para ayudarte con tus estudios. Puedes preguntarme sobre matemáticas, ciencias, historia, lengua, o pedirme consejos de estudio. ¡Empecemos!")
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
        if categoria_encontrada and categoria_encontrada in self.respuestas:
            return random.choice(self.respuestas[categoria_encontrada])
        # Respuestas automáticas
        if "hora" in mensaje_lower:
            return f"Son las {datetime.datetime.now().strftime('%H:%M')} horas."
        if "fecha" in mensaje_lower:
            return f"Hoy es {datetime.datetime.now().strftime('%d de %B de %Y')}."
        if "nombre" in mensaje_lower:
            return "Soy tu asistente virtual para estudiantes. Puedes llamarme como quieras."
        if "ayuda" in mensaje_lower or "help" in mensaje_lower:
            return ("Puedo ayudarte con:\n"
                   "• Matemáticas (álgebra, geometría, aritmética)\n"
                   "• Ciencias (biología, química, física)\n"
                   "• Historia y fechas importantes\n"
                   "• Lengua y literatura\n"
                   "• Consejos de estudio\n"
                   "• Motivación para estudiar\n\n"
                   "Solo escribe tu pregunta o usa los botones de ayuda rápida.")
        # Respuesta por defecto
        respuestas_default = [
            "Interesante pregunta. ¿Podrías ser más específico sobre qué materia necesitas ayuda?",
            "No estoy seguro de entender completamente. ¿Te refieres a matemáticas, ciencias, historia o lengua?",
            "Hmm, cuéntame más detalles para poder ayudarte mejor.",
            "¿Podrías reformular tu pregunta? Estoy aquí para ayudarte con tus estudios."
        ]
        return random.choice(respuestas_default)

    def ejecutar(self):
        self.ventana.mainloop()

# Ejecutamos la aplicación
if __name__ == "__main__":
    asistente = AsistenteVirtual()
    asistente.ejecutar()
