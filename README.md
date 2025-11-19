# Asistente Virtual Educativo - Eduki🎓🤖

Esta tesis está dirigida especialmente a estudiantes del nivel secundario. El objetivo, es acompañarlos fuera del aula, respondiendo dudas frecuentes sobre materias curriculares, a través de una interfaz simple y amigable.

## 📦 Requisitos del sistema

### Versión Web (Recomendada)
- Node.js 16 o superior
- npm o yarn
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para Supabase)

### Versión Desktop (Python)
- Python 3.8 o superior
- Sistema operativo Windows, Linux o MacOS
- Librerías necesarias:
  - `tkinter` (viene preinstalado en la mayoría de distribuciones de Python)
  - `datetime`
  - `random`
  - `sqlite3`

## ▶️ Cómo ejecutar

### Versión Web

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir el navegador en `http://localhost:5173`

4. Para compilar para producción:
   ```bash
   npm run build
   ```

### Versión Desktop (Python)

1. Inicialmente tener Python instalado.
2. Ejecutar el script `asistente_virtual.py`:
   ```bash
   python asistente_virtual.py
   ```
3. Se abrirá una ventana donde se podrá interactuar con el asistente.

## 💬 ¿Qué puede hacer el asistente?

- Responder preguntas sobre materias escolares comunes.
- Dar consejos de estudio y motivación.
- Mostrar fecha y hora actual.
- Ofrecer respuestas automáticas ante palabras clave.

## 📌 Funcionalidades destacadas

- Interfaz gráfica intuitiva web y local (Tkinter)
- Diccionario de palabras clave educativas
- Botones de acceso rápido a temas frecuentes
- Diseño de fácil integración con IA más avanzada

## 🔔 Sistema de Alerta al Docente

Cuando se detectan consultas que no pueden ser respondidas:
- Se notifica al estudiante que su consulta será evaluada por un docente.
- Se genera una alerta visual para el docente con la consulta, fecha y hora.

🛠️ El docente accede a un panel de gestión con herramientas para:
- Actualizar consultas.
- Marcar como resueltas.
- Exportar en archivo de texto.
- Incluye interfaz que fortalece el acompañamiento docente con IA educativa.

## 💾 Base de Datos

### Versión Web (Supabase - PostgreSQL)

La versión web utiliza **Supabase** como base de datos en la nube, ofreciendo:

- **Persistencia en tiempo real**: Todas las consultas se guardan automáticamente en la nube
- **Acceso desde cualquier dispositivo**: Los docentes pueden revisar consultas desde cualquier lugar
- **Seguridad**: Row Level Security (RLS) implementado
- **Escalabilidad**: Soporta múltiples estudiantes simultáneamente

#### Tablas implementadas:

1. **consultas_pendientes**
   - `id`: Identificador único (UUID)
   - `mensaje`: Texto de la consulta del estudiante
   - `fecha_hora`: Timestamp de cuando se realizó la consulta
   - `estado`: Estado de la consulta (pendiente/en_revision/resuelta)
   - `respuesta_docente`: Respuesta del docente (opcional)
   - `fecha_respuesta`: Timestamp de cuando se respondió
   - `created_at`, `updated_at`: Timestamps de auditoría

2. **historial_conversaciones**
   - `id`: Identificador único (UUID)
   - `mensaje`: Contenido del mensaje
   - `tipo`: Tipo de mensaje (usuario/asistente)
   - `categoria`: Categoría de la consulta (matemáticas, ciencias, etc.)
   - `fue_reconocida`: Si el asistente pudo responder
   - `session_id`: ID de sesión del usuario
   - `created_at`: Timestamp de creación

#### Módulos de la aplicación:

- **database.js**: Funciones para interactuar con Supabase
  - `guardarConsultaPendiente()`: Guarda una nueva consulta
  - `obtenerConsultasPendientes()`: Obtiene consultas sin resolver
  - `marcarConsultaResuelta()`: Marca una consulta como resuelta
  - `marcarTodasResueltas()`: Marca todas las consultas como resueltas
  - `exportarConsultas()`: Exporta consultas a archivo de texto
  - `guardarMensajeHistorial()`: Guarda el historial de conversación

- **panel-docente.js**: Interfaz del panel docente
  - Actualización automática cada 30 segundos
  - Responder consultas individuales
  - Marcar consultas como resueltas
  - Exportar historial completo

### Versión Desktop (SQLite3)

La versión Python utiliza **SQLite3** como base de datos local:

- Base de datos embebida en archivo `asistente_virtual.db`
- Estructura similar a la versión web
- Ideal para uso sin conexión a internet
- Datos almacenados localmente en el dispositivo

## 📁 Estructura del proyecto

### Versión Web
```
project/
├── index.html              # Página principal
├── script.js               # Lógica del asistente virtual
├── database.js             # Módulo de conexión a Supabase
├── panel-docente.js        # Panel de administración docente
├── style.css               # Estilos de la aplicación
├── package.json            # Dependencias del proyecto
├── .env                    # Variables de entorno (Supabase)
└── public/
    └── Eduki.jpeg          # Mascota del asistente
```

### Versión Desktop
- `asistente_virtual.py`: Código fuente comentado (Python + Tkinter)
- `asistente_virtual.db`: Base de datos SQLite (se crea automáticamente)
- `ManualdeUsuario.pdf`: Guía rápida de uso
- `README.md`: Documentación completa del proyecto

## 🧪 Versión actual

Versión Alpha 1.5 - Junio 2025  
Seminario Final de Informática

## 👤 Autor

- César Eduardo González  
- San Salvador de Jujuy, Argentina 
- Universidad Empresarial Siglo XXI
- Carrera: Licenciatura en Informática
- Legajo: VINF013326  
- Tutor: Leonardo Gabriel Gamboa

---
## ⚠️ Nota Importante: 

Este asistente está planteado como complemento educativo, no como reemplazo de la enseñanza docente.

