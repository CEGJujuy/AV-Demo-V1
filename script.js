class AsistenteVirtual {
    constructor() {
        this.respuestas = {
            "saludo": [
                "¡Hola! Soy Eduki, tu asistente virtual. ¿En qué materia puedo ayudarte hoy?",
                "¡Hola! ¿Cómo estás? Soy Eduki y estoy aquí para ayudarte con cualquier materia específica.",
                "¡Saludos! Soy Eduki, tu compañero de estudios. Estoy aquí para ayudarte con todas tus materias de secundaria."
            ],
            "matematicas": [
                "Las matemáticas son la base de muchas ciencias. ¿Necesitas ayuda con álgebra, geometría, trigonometría o cálculo?",
                "Para resolver ecuaciones, recuerda: lo que haces de un lado, hazlo del otro lado también.",
                "En geometría, las fórmulas básicas son: área del círculo = π × r², área del rectángulo = base × altura.",
                "Los números negativos: cuando multiplicas dos negativos, el resultado es positivo.",
                "Para factorizar, busca primero el factor común más grande.",
                "Las funciones lineales tienen la forma y = mx + b, donde m es la pendiente y b es la ordenada al origen."
            ],
            "ciencias": [
                "Las ciencias nos ayudan a entender el mundo. ¿Te interesa biología, química, física o ciencias naturales?",
                "En biología, recuerda que la célula es la unidad básica de la vida.",
                "En química, los elementos se organizan en la tabla periódica según su número atómico.",
                "En física, velocidad = distancia / tiempo. Esta es una fórmula fundamental.",
                "La fotosíntesis: CO₂ + H₂O + luz solar → glucosa + O₂",
                "Las leyes de Newton explican el movimiento: 1) Inercia, 2) F=ma, 3) Acción-reacción."
            ],
            "historia": [
                "La historia nos enseña sobre el pasado para entender el presente y construir el futuro.",
                "Es importante estudiar las fechas clave y entender las causas y consecuencias de los eventos.",
                "Hacer líneas de tiempo te ayudará a organizar mejor los eventos históricos.",
                "Conecta los eventos históricos con sus contextos sociales, económicos y políticos.",
                "Lee fuentes primarias cuando sea posible para entender mejor los eventos.",
                "La Revolución Industrial cambió completamente la forma de vida en los siglos XVIII y XIX."
            ],
            "lengua": [
                "La lengua y literatura desarrollan tu capacidad de comunicación y pensamiento crítico.",
                "Lee mucho para mejorar tu vocabulario y comprensión lectora.",
                "Practica la escritura diariamente para mejorar tu redacción.",
                "Los conectores dan coherencia a tus textos: además, sin embargo, por lo tanto, en consecuencia...",
                "Analiza la estructura de los textos que lees para mejorar tu propia escritura.",
                "Los géneros literarios principales son: épico, lírico y dramático."
            ],
            "ingles": [
                "El inglés es fundamental en el mundo globalizado. ¿Necesitas ayuda con gramática, vocabulario o conversación?",
                "Para mejorar tu inglés: lee, escucha música, ve películas con subtítulos y practica hablando.",
                "Los tiempos verbales básicos: Present Simple, Past Simple, Future Simple.",
                "Phrasal verbs son muy importantes: get up, turn on, look for, etc.",
                "Practica la pronunciación con trabalenguas: 'She sells seashells by the seashore'.",
                "False friends: 'actually' no significa 'actualmente', sino 'en realidad'."
            ],
            "geografia": [
                "La geografía estudia la Tierra y la relación entre el ser humano y su entorno.",
                "Aprende los continentes, océanos, países y capitales principales.",
                "El clima se ve afectado por la latitud, altitud, corrientes marinas y vientos.",
                "Los mapas tienen diferentes proyecciones: Mercator, Peters, Robinson.",
                "La tectónica de placas explica terremotos, volcanes y formación de montañas.",
                "Los recursos naturales se clasifican en renovables y no renovables."
            ],
            "educacion_fisica": [
                "La educación física es clave para un desarrollo integral y una vida saludable.",
                "El calentamiento previo al ejercicio previene lesiones y mejora el rendimiento.",
                "Los deportes desarrollan trabajo en equipo, disciplina y perseverancia.",
                "Una buena hidratación es fundamental durante la actividad física.",
                "El ejercicio regular mejora la salud cardiovascular, muscular y mental.",
                "Los estiramientos después del ejercicio ayudan a la recuperación muscular."
            ],
            "arte": [
                "El arte desarrolla la creatividad, sensibilidad y expresión personal.",
                "Los colores primarios son rojo, azul y amarillo. Los secundarios se forman mezclándolos.",
                "Las técnicas artísticas incluyen: dibujo, pintura, escultura, grabado.",
                "La perspectiva da profundidad a los dibujos: lineal, aérea, de color.",
                "Los grandes movimientos artísticos: Renacimiento, Barroco, Impresionismo, Cubismo.",
                "El arte no solo es técnica, también es expresión de emociones e ideas."
            ],
            "musica": [
                "La música desarrolla la sensibilidad artística y habilidades cognitivas.",
                "Las notas musicales son: Do, Re, Mi, Fa, Sol, La, Si.",
                "Los instrumentos se clasifican en: viento, cuerda, percusión.",
                "El compás más común es 4/4: cuatro tiempos por compás.",
                "Los géneros musicales reflejan culturas y épocas: clásica, jazz, rock, folk.",
                "Escuchar música activamente mejora la concentración y memoria."
            ],
            "filosofia": [
                "La filosofía desarrolla el pensamiento crítico y la reflexión sobre la existencia.",
                "Las grandes preguntas filosóficas: ¿Qué es la realidad? ¿Qué es el conocimiento? ¿Qué es el bien?",
                "Grandes filósofos: Sócrates, Platón, Aristóteles, Descartes, Kant.",
                "El método socrático usa preguntas para llegar al conocimiento.",
                "La ética estudia qué está bien y qué está mal en nuestras acciones.",
                "Pensar filosóficamente significa cuestionar lo que damos por obvio."
            ],
            "consejos_estudio": [
                "Crea un horario de estudio realista y síguelo consistentemente.",
                "Encuentra un lugar tranquilo, bien iluminado y libre de distracciones.",
                "Toma descansos cada 45-60 minutos para mantener la concentración.",
                "Usa técnicas como mapas mentales, resúmenes y fichas para organizar información.",
                "Estudia en grupos pequeños para intercambiar ideas y resolver dudas.",
                "Repasa lo aprendido antes de dormir para mejorar la retención.",
                "La técnica Pomodoro: 25 minutos de estudio, 5 minutos de descanso."
            ],
            "examenes": [
                "Para preparar exámenes: planifica con tiempo, no dejes todo para último momento.",
                "Haz un cronograma de repaso distribuyendo las materias por días.",
                "Practica con exámenes anteriores o ejercicios similares.",
                "Durante el examen: lee bien las preguntas, administra tu tiempo.",
                "Empieza por las preguntas que sabes mejor para ganar confianza.",
                "Si no sabes una respuesta, pasa a la siguiente y vuelve después.",
                "Revisa tus respuestas antes de entregar el examen."
            ],
            "tiempo": [
                "Organizar el tiempo es clave para el éxito académico.",
                "Usa una agenda o calendario para planificar tareas y fechas importantes.",
                "Prioriza tareas: urgente e importante, importante no urgente, etc.",
                "Evita la procrastinación: divide tareas grandes en partes pequeñas.",
                "Establece metas diarias y semanales realistas.",
                "Dedica tiempo tanto al estudio como al descanso y recreación.",
                "La regla 80/20: el 80% de los resultados viene del 20% del esfuerzo más efectivo."
            ],
            "motivacion": [
                "¡Tú puedes lograrlo! Cada pequeño esfuerzo cuenta para tu futuro.",
                "Los errores son oportunidades de aprendizaje, no te desanimes.",
                "El éxito viene de la constancia y la dedicación, no de la perfección.",
                "Celebra tus pequeños logros, son importantes para tu progreso.",
                "Recuerda por qué empezaste y mantén tus metas claras.",
                "Cada día que estudias te acercas más a tus objetivos.",
                "Las dificultades de hoy son las fortalezas de mañana.",
                "Rodéate de personas que te apoyen en tu crecimiento académico."
            ],
            "despedida": [
                "¡Hasta luego! Que tengas un excelente día de estudio.",
                "¡Nos vemos! Recuerda que siempre estoy aquí para ayudarte.",
                "¡Adiós! Sigue esforzándote, vas por buen camino.",
                "¡Que tengas un gran día! No olvides repasar lo que aprendiste.",
                "¡Hasta la próxima! Confía en ti mismo y en tu capacidad de aprender."
            ]
        };

        this.palabrasClave = {
            // Saludos
            "hola": "saludo",
            "buenos días": "saludo",
            "buenas tardes": "saludo",
            "buenas noches": "saludo",
            "hey": "saludo",
            "saludos": "saludo",
            
            // Matemáticas
            "matemáticas": "matematicas",
            "mates": "matematicas",
            "álgebra": "matematicas",
            "geometría": "matematicas",
            "números": "matematicas",
            "ecuaciones": "matematicas",
            "cálculo": "matematicas",
            "trigonometría": "matematicas",
            "estadística": "matematicas",
            
            // Ciencias
            "ciencias": "ciencias",
            "biología": "ciencias",
            "química": "ciencias",
            "física": "ciencias",
            "laboratorio": "ciencias",
            "experimento": "ciencias",
            "naturales": "ciencias",
            
            // Historia
            "historia": "historia",
            "histórico": "historia",
            "pasado": "historia",
            "guerra": "historia",
            "revolución": "historia",
            "civilización": "historia",
            
            // Lengua
            "lengua": "lengua",
            "literatura": "lengua",
            "español": "lengua",
            "escribir": "lengua",
            "leer": "lengua",
            "redacción": "lengua",
            "gramática": "lengua",
            "ortografía": "lengua",
            
            // Inglés
            "inglés": "ingles",
            "english": "ingles",
            "pronunciación": "ingles",
            "vocabulario": "ingles",
            "grammar": "ingles",
            
            // Geografía
            "geografía": "geografia",
            "mapas": "geografia",
            "países": "geografia",
            "continentes": "geografia",
            "clima": "geografia",
            "relieve": "geografia",
            
            // Educación Física
            "educación física": "educacion_fisica",
            "deporte": "educacion_fisica",
            "ejercicio": "educacion_fisica",
            "atletismo": "educacion_fisica",
            "gimnasia": "educacion_fisica",
            
            // Arte
            "arte": "arte",
            "dibujo": "arte",
            "pintura": "arte",
            "colores": "arte",
            "creatividad": "arte",
            
            // Música
            "música": "musica",
            "instrumentos": "musica",
            "notas": "musica",
            "ritmo": "musica",
            "melodía": "musica",
            
            // Filosofía
            "filosofía": "filosofia",
            "pensar": "filosofia",
            "reflexión": "filosofia",
            "ética": "filosofia",
            "moral": "filosofia",
            
            // Estudio y organización
            "estudiar": "consejos_estudio",
            "estudio": "consejos_estudio",
            "concentración": "consejos_estudio",
            "horario": "consejos_estudio",
            "técnicas": "consejos_estudio",
            "método": "consejos_estudio",
            "exámenes": "examenes",
            "examen": "examenes",
            "prueba": "examenes",
            "evaluación": "examenes",
            "tiempo": "tiempo",
            "organizar": "tiempo",
            "planificar": "tiempo",
            
            // Motivación
            "motivación": "motivacion",
            "ánimo": "motivacion",
            "desanimado": "motivacion",
            "difícil": "motivacion",
            "cansado": "motivacion",
            "estrés": "motivacion",
            "frustrado": "motivacion",
            
            // Despedidas
            "adiós": "despedida",
            "hasta luego": "despedida",
            "chau": "despedida",
            "bye": "despedida",
            "nos vemos": "despedida"
        };

        this.initializeElements();
        this.setupEventListeners();
        this.setWelcomeTime();
    }

    initializeElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.quickButtons = document.querySelectorAll('.quick-btn');
        this.subjectButtons = document.querySelectorAll('.subject-btn');
    }

    setupEventListeners() {
        // Enviar mensaje con Enter
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.enviarMensaje();
            }
        });

        // Enviar mensaje con botón
        this.sendButton.addEventListener('click', () => {
            this.enviarMensaje();
        });

        // Botones de ayuda rápida
        this.quickButtons.forEach(button => {
            button.addEventListener('click', () => {
                const command = button.getAttribute('data-command');
                this.procesarComandoRapido(command);
            });
        });

        // Botones de materias
        this.subjectButtons.forEach(button => {
            button.addEventListener('click', () => {
                const command = button.getAttribute('data-command');
                this.procesarComandoRapido(command);
            });
        });

        // Auto-resize del input
        this.messageInput.addEventListener('input', () => {
            this.toggleSendButton();
        });
    }

    setWelcomeTime() {
        const welcomeTimeElement = document.getElementById('welcomeTime');
        if (welcomeTimeElement) {
            welcomeTimeElement.textContent = this.obtenerHora();
        }
    }

    toggleSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText;
    }

    obtenerHora() {
        const now = new Date();
        return now.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    procesarComandoRapido(comando) {
        this.messageInput.value = comando;
        this.messageInput.focus();
        this.enviarMensaje();
    }

    enviarMensaje() {
        const mensaje = this.messageInput.value.trim();
        if (!mensaje) return;

        // Mostrar mensaje del usuario
        this.mostrarMensaje(mensaje, 'user');

        // Limpiar input
        this.messageInput.value = '';
        this.toggleSendButton();

        // Simular typing delay
        this.mostrarTyping();

        setTimeout(() => {
            this.ocultarTyping();
            const respuesta = this.procesarMensaje(mensaje);
            this.mostrarMensaje(respuesta, 'assistant');
        }, 1000 + Math.random() * 1000);
    }

    mostrarTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant-message typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <img src="public/Eduki.jpeg" alt="Eduki" class="avatar-mascot">
            </div>
            <div class="message-content">
                <div class="message-text">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;

        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    ocultarTyping() {
        const typingMessage = this.chatMessages.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }

    mostrarMensaje(mensaje, tipo) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${tipo}-message`;

        const avatar = tipo === 'user' ? '👤' : '<img src="public/Eduki.jpeg" alt="Eduki" class="avatar-mascot">';
        const hora = this.obtenerHora();

        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${mensaje}</div>
                <div class="message-time">${hora}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    procesarMensaje(mensaje) {
        const mensajeLower = mensaje.toLowerCase();

        // Buscar palabras clave en el mensaje
        let categoriaEncontrada = null;
        for (const [palabraClave, categoria] of Object.entries(this.palabrasClave)) {
            if (mensajeLower.includes(palabraClave)) {
                categoriaEncontrada = categoria;
                break;
            }
        }

        // Si encontramos una categoría, devolver respuesta aleatoria
        if (categoriaEncontrada && this.respuestas[categoriaEncontrada]) {
            const respuestas = this.respuestas[categoriaEncontrada];
            return respuestas[Math.floor(Math.random() * respuestas.length)];
        }

        // Respuestas específicas para preguntas comunes
        if (mensajeLower.includes('hora')) {
            return `Son las ${this.obtenerHora()} horas.`;
        }

        if (mensajeLower.includes('fecha')) {
            const fecha = new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            return `Hoy es ${fecha}.`;
        }

        if (mensajeLower.includes('nombre')) {
            return "Soy Eduki, tu asistente virtual especializado en educación secundaria. ¡Estoy aquí para ayudarte con todas tus materias!";
        }

        if (mensajeLower.includes('materias') || mensajeLower.includes('asignaturas')) {
            return `Puedo ayudarte con estas materias:

📚 **Materias principales:**
• Matemáticas • Ciencias (Biología, Química, Física)
• Historia • Lengua y Literatura • Inglés
• Geografía

🎨 **Materias complementarias:**
• Arte • Música • Educación Física • Filosofía

🎯 **Apoyo académico:**
• Técnicas de estudio • Preparación de exámenes
• Organización del tiempo • Motivación

¡Haz clic en los botones de materias o escribe tu pregunta!`;
        }

        if (mensajeLower.includes('ayuda') || mensajeLower.includes('help')) {
            return `¡Hola! Soy **Eduki** y estoy aquí para ayudarte! Puedo asistirte con:

📚 **Todas las materias de secundaria:**
Matemáticas, Ciencias, Historia, Lengua, Inglés, Geografía, Arte, Música, Educación Física, Filosofía

🎯 **Apoyo académico:**
• Técnicas de estudio efectivas
• Preparación para exámenes
• Organización del tiempo
• Motivación y consejos

💡 **Cómo usar el asistente:**
• Haz clic en los botones de materias
• Usa los botones de ayuda rápida
• Escribe tu pregunta directamente

¡Estoy aquí para ayudarte a tener éxito en tus estudios!`;
        }

        // Respuestas por defecto más variadas
        const respuestasDefault = [
            "Interesante pregunta. ¿Podrías ser más específico sobre qué materia necesitas ayuda? Puedes usar los botones de materias arriba.",
            "No estoy seguro de entender completamente. ¿Te refieres a alguna materia específica como matemáticas, ciencias, historia o lengua?",
            "Hmm, cuéntame más detalles para poder ayudarte mejor. ¿Es sobre alguna materia en particular?",
            "¿Podrías reformular tu pregunta? Estoy especializado en materias de secundaria y técnicas de estudio.",
            "Me gustaría ayudarte mejor. ¿Puedes darme más contexto sobre lo que necesitas? Usa los botones de materias si te ayuda.",
            "¡Excelente que quieras aprender! ¿En qué materia específica necesitas ayuda? Tengo conocimientos en todas las materias de secundaria."
        ];

        return respuestasDefault[Math.floor(Math.random() * respuestasDefault.length)];
    }
}

// Inicializar el asistente cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new AsistenteVirtual();
    
    // Agregar estilos para el indicador de typing
    if (!document.getElementById('typing-styles')) {
        const style = document.createElement('style');
        style.id = 'typing-styles';
        style.textContent = `
            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .typing-indicator span {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #6c757d;
                animation: typing 1.4s infinite ease-in-out;
            }
            .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
            .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
            @keyframes typing {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
});