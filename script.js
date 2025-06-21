class AsistenteVirtual {
    constructor() {
        this.respuestas = {
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
                "Para factorizar, busca el factor común más grande primero."
            ],
            "ciencias": [
                "Las ciencias nos ayudan a entender el mundo. ¿Te interesa biología, química o física?",
                "En biología, recuerda que la célula es la unidad básica de la vida.",
                "En química, los elementos se organizan en la tabla periódica según su número atómico.",
                "En física, recuerda que velocidad = distancia / tiempo.",
                "La fotosíntesis convierte CO₂ + H₂O + luz solar en glucosa + O₂."
            ],
            "historia": [
                "La historia nos enseña sobre el pasado para entender el presente.",
                "Es importante estudiar las fechas clave y entender las causas y consecuencias de los eventos.",
                "Hacer líneas de tiempo te ayudará a organizar mejor los eventos históricos.",
                "Conecta los eventos históricos con sus contextos sociales y económicos.",
                "Lee fuentes primarias cuando sea posible para entender mejor los eventos."
            ],
            "lengua": [
                "La lengua y literatura desarrollan tu capacidad de comunicación.",
                "Lee mucho para mejorar tu vocabulario y comprensión lectora.",
                "Practica la escritura diariamente para mejorar tu redacción.",
                "Los conectores ayudan a dar coherencia a tus textos: además, sin embargo, por lo tanto...",
                "Analiza la estructura de los textos que lees para mejorar tu escritura."
            ],
            "consejos_estudio": [
                "Crea un horario de estudio y síguelo consistentemente.",
                "Encuentra un lugar tranquilo y bien iluminado para estudiar.",
                "Toma descansos cada 45-60 minutos para mantener la concentración.",
                "Usa técnicas como mapas mentales y resúmenes para organizar la información.",
                "Estudia en grupos pequeños para intercambiar ideas y resolver dudas.",
                "Repasa lo aprendido antes de dormir para mejorar la retención."
            ],
            "motivacion": [
                "¡Tú puedes lograrlo! Cada pequeño esfuerzo cuenta.",
                "Los errores son oportunidades de aprendizaje, no te desanimes.",
                "El éxito viene de la constancia y la dedicación.",
                "Celebra tus pequeños logros, son importantes para tu progreso.",
                "Recuerda por qué empezaste y mantén tus metas claras.",
                "Cada día que estudias te acercas más a tus objetivos."
            ],
            "despedida": [
                "¡Hasta luego! Que tengas un excelente día de estudio.",
                "¡Nos vemos! Recuerda que siempre estoy aquí para ayudarte.",
                "¡Adiós! Sigue esforzándote, vas por buen camino.",
                "¡Que tengas un gran día! No olvides repasar lo que aprendiste."
            ]
        };

        this.palabrasClave = {
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
            "estudiar": "consejos_estudio",
            "estudio": "consejos_estudio",
            "concentración": "consejos_estudio",
            "horario": "consejos_estudio",
            "técnicas": "consejos_estudio",
            "método": "consejos_estudio",
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

        // Auto-resize del textarea (si fuera necesario)
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
        }, 1000 + Math.random() * 1000); // Delay aleatorio entre 1-2 segundos
    }

    mostrarTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant-message typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
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

        const avatar = tipo === 'user' ? '👤' : '🤖';
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
            return "Soy tu asistente virtual para estudiantes. Puedes llamarme como quieras. ¡Estoy aquí para ayudarte!";
        }

        if (mensajeLower.includes('ayuda') || mensajeLower.includes('help')) {
            return `Puedo ayudarte con:

📚 **Materias:**
• Matemáticas (álgebra, geometría, aritmética)
• Ciencias (biología, química, física)
• Historia y fechas importantes
• Lengua y literatura

🎯 **Apoyo académico:**
• Consejos de estudio y técnicas de aprendizaje
• Motivación para estudiar
• Organización del tiempo

Solo escribe tu pregunta o usa los botones de ayuda rápida. ¡Estoy aquí para ayudarte a tener éxito en tus estudios!`;
        }

        // Respuestas por defecto más variadas
        const respuestasDefault = [
            "Interesante pregunta. ¿Podrías ser más específico sobre qué materia necesitas ayuda?",
            "No estoy seguro de entender completamente. ¿Te refieres a matemáticas, ciencias, historia o lengua?",
            "Hmm, cuéntame más detalles para poder ayudarte mejor.",
            "¿Podrías reformular tu pregunta? Estoy aquí para ayudarte con tus estudios.",
            "Me gustaría ayudarte mejor. ¿Puedes darme más contexto sobre lo que necesitas?",
            "¡Excelente que quieras aprender! ¿En qué materia específica necesitas ayuda?"
        ];

        return respuestasDefault[Math.floor(Math.random() * respuestasDefault.length)];
    }
}

// Inicializar el asistente cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new AsistenteVirtual();
});