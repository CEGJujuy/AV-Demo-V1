# Documentación de Base de Datos - Asistente Virtual Eduki

## Índice
1. [Visión General](#visión-general)
2. [Arquitectura de Datos](#arquitectura-de-datos)
3. [Configuración](#configuración)
4. [Estructura de Datos](#estructura-de-datos)
5. [Funciones y API](#funciones-y-api)
6. [Sistema de Fallback](#sistema-de-fallback)
7. [Manejo de Errores](#manejo-de-errores)
8. [Guía de Uso](#guía-de-uso)

---

## Visión General

El sistema de base de datos del Asistente Virtual Eduki implementa una **arquitectura híbrida resiliente** que garantiza el funcionamiento continuo de la aplicación en cualquier entorno. El sistema utiliza:

- **Supabase** como base de datos principal (PostgreSQL en la nube)
- **localStorage** como sistema de respaldo automático
- **Detección automática** de disponibilidad de servicios
- **Transición transparente** entre sistemas de almacenamiento

### Tecnologías Utilizadas
- **Supabase**: Base de datos PostgreSQL serverless
- **@supabase/supabase-js**: Cliente oficial de Supabase para JavaScript
- **localStorage**: API de almacenamiento local del navegador
- **sessionStorage**: Para gestión de sesiones de usuario

---

## Arquitectura de Datos

### Diagrama de Flujo de Datos

```
┌─────────────────┐
│   Aplicación    │
│   (script.js)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   database.js   │
│  (Capa de       │
│   Abstracción)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────────┐
│Supabase │ │ localStorage │
│ (Cloud) │ │  (Fallback)  │
└─────────┘ └──────────────┘
```

### Principios de Diseño

1. **Resiliencia**: El sistema nunca falla, siempre hay un respaldo
2. **Transparencia**: La aplicación no necesita saber qué sistema de almacenamiento se está usando
3. **Automatización**: La detección de problemas y el cambio de sistema es automático
4. **Consistencia**: Todos los datos siguen la misma estructura independientemente del sistema

---

## Configuración

### Archivo: `config.js`

Este archivo centraliza todas las variables de configuración de Supabase:

```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '[ANON_KEY]';

export const config = {
    supabaseUrl,
    supabaseKey
};
```

**Características:**
- Utiliza variables de entorno de Vite (`VITE_*`)
- Incluye valores de respaldo (fallback) codificados
- Garantiza que siempre haya valores disponibles

### Variables de Entorno

Archivo `.env`:
```env
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=[TU_ANON_KEY_AQUI]
```

---

## Estructura de Datos

### Tabla 1: `consultas_pendientes`

Almacena todas las consultas de estudiantes que el asistente no pudo responder y necesitan atención docente.

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| `id` | string/number | Identificador único | Sí |
| `mensaje` | string | Texto de la consulta del estudiante | Sí |
| `fecha_hora` | ISO 8601 string | Timestamp de creación | Sí |
| `estado` | string | Estado: 'pendiente' o 'resuelta' | Sí |
| `categoria` | string | Materia relacionada (ej: 'matematicas') | No |
| `respuesta_docente` | string | Respuesta del docente | No |
| `fecha_respuesta` | ISO 8601 string | Timestamp de resolución | No |

**Ejemplo de registro:**
```json
{
  "id": "1700000000000",
  "mensaje": "¿Cómo resuelvo ecuaciones cuadráticas complejas?",
  "fecha_hora": "2025-11-19T14:30:00.000Z",
  "estado": "pendiente",
  "categoria": "matematicas",
  "respuesta_docente": null,
  "fecha_respuesta": null
}
```

### Tabla 2: `historial_conversaciones`

Registra todo el historial de interacciones entre estudiantes y el asistente para análisis y mejora continua.

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| `id` | string | Identificador único | Sí |
| `mensaje` | string | Contenido del mensaje | Sí |
| `tipo` | string | 'usuario' o 'asistente' | Sí |
| `categoria` | string | Categoría de la consulta | No |
| `fue_reconocida` | boolean | Si el asistente reconoció la consulta | Sí |
| `session_id` | string | ID de sesión del usuario | Sí |
| `fecha_hora` | ISO 8601 string | Timestamp del mensaje | Sí |

**Ejemplo de registro:**
```json
{
  "id": "1700000000000.123456",
  "mensaje": "Hola, necesito ayuda con matemáticas",
  "tipo": "usuario",
  "categoria": "matematicas",
  "fue_reconocida": true,
  "session_id": "session_1700000000000_abc123xyz",
  "fecha_hora": "2025-11-19T14:30:00.000Z"
}
```

---

## Funciones y API

### Inicialización

#### `testSupabaseConnection()`
Verifica automáticamente la conectividad con Supabase al cargar el módulo.

```javascript
async function testSupabaseConnection() {
    try {
        const { error } = await supabase
            .from('consultas_pendientes')
            .select('count', { count: 'exact', head: true });

        if (error) {
            useLocalStorage = true;
            return false;
        }
        return true;
    } catch (err) {
        useLocalStorage = true;
        return false;
    }
}
```

---

### Funciones de Consultas Pendientes

#### `guardarConsultaPendiente(mensaje, fecha, hora, categoria)`

Guarda una nueva consulta que el asistente no pudo responder.

**Parámetros:**
- `mensaje` (string): Texto de la consulta
- `fecha` (string): Fecha en formato local
- `hora` (string): Hora en formato HH:MM
- `categoria` (string, opcional): Categoría de la materia

**Retorna:**
```javascript
{
    success: true,
    data: [{ /* objeto consulta */ }]
}
```

**Ejemplo de uso:**
```javascript
const resultado = await guardarConsultaPendiente(
    "¿Cómo funciona la fotosíntesis?",
    "19/11/2025",
    "14:30",
    "ciencias"
);

if (resultado.success) {
    console.log("Consulta guardada:", resultado.data);
}
```

#### `obtenerConsultasPendientes()`

Recupera todas las consultas con estado 'pendiente'.

**Retorna:**
```javascript
{
    success: true,
    data: [ /* array de consultas pendientes */ ]
}
```

**Ejemplo de uso:**
```javascript
const resultado = await obtenerConsultasPendientes();
console.log(`Hay ${resultado.data.length} consultas pendientes`);
```

#### `obtenerTodasLasConsultas()`

Recupera todas las consultas (pendientes y resueltas), ordenadas por categoría y fecha.

**Retorna:**
```javascript
{
    success: true,
    data: [ /* array de todas las consultas */ ]
}
```

#### `marcarConsultaResuelta(id, respuestaDocente)`

Marca una consulta específica como resuelta y opcionalmente añade la respuesta del docente.

**Parámetros:**
- `id` (string): ID de la consulta
- `respuestaDocente` (string, opcional): Respuesta proporcionada por el docente

**Retorna:**
```javascript
{
    success: true,
    data: [{ /* consulta actualizada */ }]
}
```

**Ejemplo de uso:**
```javascript
const resultado = await marcarConsultaResuelta(
    "1700000000000",
    "La fotosíntesis es el proceso mediante el cual las plantas..."
);
```

#### `marcarTodasResueltas()`

Marca todas las consultas pendientes como resueltas en un solo paso.

**Retorna:**
```javascript
{
    success: true,
    data: [ /* array de consultas actualizadas */ ]
}
```

---

### Funciones de Historial

#### `guardarMensajeHistorial(mensaje, tipo, categoria, fueReconocida)`

Registra cada mensaje de la conversación en el historial.

**Parámetros:**
- `mensaje` (string): Contenido del mensaje
- `tipo` (string): 'usuario' o 'asistente'
- `categoria` (string, opcional): Categoría detectada
- `fueReconocida` (boolean): Si el asistente reconoció la consulta

**Retorna:**
```javascript
{
    success: true,
    data: [{ /* mensaje guardado */ }]
}
```

**Ejemplo de uso:**
```javascript
await guardarMensajeHistorial(
    "¿Qué es el álgebra?",
    "usuario",
    "matematicas",
    true
);
```

#### `obtenerSessionId()`

Genera o recupera un ID único de sesión para el usuario actual.

**Características:**
- Usa `sessionStorage` para persistir durante la sesión del navegador
- Formato: `session_[timestamp]_[random]`
- Se crea automáticamente en la primera interacción

---

### Funciones de Exportación

#### `exportarConsultas()`

Exporta todas las consultas a un archivo de texto descargable.

**Características:**
- Formato: `.txt` con codificación UTF-8
- Nombre del archivo: `consultas_export_[fecha]_[hora].txt`
- Incluye todas las consultas con sus detalles completos

**Formato del archivo generado:**
```
REPORTE DE CONSULTAS
==================================================

Fecha de exportación: 19/11/2025, 14:30:00
Total de consultas: 15

CONSULTA #1
Fecha: 19/11/2025, 14:25:00
Categoría: MATEMATICAS
Mensaje: "¿Cómo resuelvo ecuaciones cuadráticas?"
Estado: PENDIENTE
------------------------------

CONSULTA #2
Fecha: 19/11/2025, 13:15:00
Categoría: CIENCIAS
Mensaje: "¿Qué es la fotosíntesis?"
Estado: RESUELTA
Respuesta del docente: "La fotosíntesis es..."
Fecha respuesta: 19/11/2025, 13:45:00
------------------------------
```

---

## Sistema de Fallback

### Cómo Funciona

El sistema implementa un mecanismo de fallback automático que garantiza la continuidad del servicio:

#### 1. Detección de Estado
```javascript
let useLocalStorage = false;  // Estado global
```

- Variable que controla qué sistema de almacenamiento usar
- Empieza en `false` (intenta usar Supabase)
- Cambia a `true` automáticamente si Supabase falla

#### 2. Intento de Conexión Inicial
```javascript
async function testSupabaseConnection() {
    try {
        const { error } = await supabase
            .from('consultas_pendientes')
            .select('count', { count: 'exact', head: true });

        if (error) {
            useLocalStorage = true;
        }
    } catch (err) {
        useLocalStorage = true;
    }
}
```

#### 3. Lógica Dual en Cada Función
Todas las funciones siguen este patrón:

```javascript
export async function funcionEjemplo() {
    // 1. Si NO está en modo local, intentar Supabase
    if (!useLocalStorage) {
        try {
            const { data, error } = await supabase
                .from('tabla')
                .operacion();

            // 2. Si funciona, retornar datos de Supabase
            if (!error) {
                return { success: true, data };
            }
        } catch (err) {
            // 3. Si falla, activar modo local
            useLocalStorage = true;
        }
    }

    // 4. Usar localStorage como fallback
    const datos = getLocalData('clave');
    return { success: true, data: datos };
}
```

### Funciones Helper de localStorage

#### `getLocalData(key)`
Lee y parsea datos desde localStorage.

```javascript
function getLocalData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];  // Array vacío si hay error
    }
}
```

#### `setLocalData(key, data)`
Guarda datos en localStorage con stringify automático.

```javascript
function setLocalData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch {
        return false;  // Falla silenciosamente
    }
}
```

### Ventajas del Sistema de Fallback

1. **Alta Disponibilidad**: La aplicación siempre funciona
2. **Experiencia Consistente**: El usuario no nota la diferencia
3. **Sin Configuración**: El cambio es completamente automático
4. **Recuperación Automática**: Si Supabase vuelve, el sistema puede usarlo
5. **Datos Preservados**: Nada se pierde durante la transición

---

## Manejo de Errores

### Estrategia de Errores

El sistema implementa un manejo de errores robusto en múltiples niveles:

#### Nivel 1: Captura en Funciones de Base de Datos

```javascript
export async function guardarConsultaPendiente(...) {
    if (!useLocalStorage) {
        try {
            // Intento de operación con Supabase
        } catch (err) {
            console.warn('⚠️ Error con Supabase, guardando localmente');
            useLocalStorage = true;
            // Continúa con localStorage
        }
    }
    // Código de fallback
}
```

**Características:**
- Try-catch en todas las operaciones
- Logs informativos con emojis para fácil identificación
- Cambio automático a fallback
- Nunca lanza excepciones al código que llama

#### Nivel 2: Captura en Lógica de Aplicación

En `script.js`:

```javascript
async enviarAlertaDocente(consulta, categoriaDetectada) {
    try {
        const resultado = await guardarConsultaPendiente(...);
        if (resultado.success) {
            console.log('✅ Consulta guardada:', resultado.data);
        }
    } catch (err) {
        console.warn('⚠️ Error al guardar consulta, pero continuando:', err);
    }

    try {
        await guardarMensajeHistorial(...);
    } catch (err) {
        console.warn('⚠️ Error al guardar historial, pero continuando:', err);
    }
}
```

**Características:**
- Cada operación de BD está protegida
- Los errores no interrumpen el flujo del usuario
- Logs detallados para debugging
- La aplicación continúa funcionando

### Tipos de Mensajes de Log

```javascript
// ✅ Operación exitosa
console.log('✅ Consulta guardada en Supabase:', data);

// ⚠️ Advertencia (fallback activado)
console.warn('⚠️ Supabase no disponible, usando localStorage como fallback');

// ❌ Error capturado (solo para debugging)
console.error('❌ Error al guardar consulta en Supabase:', error);
```

---

## Guía de Uso

### Para Desarrolladores

#### Inicialización Básica

```javascript
// 1. Importar funciones necesarias
import {
    guardarConsultaPendiente,
    obtenerConsultasPendientes,
    marcarConsultaResuelta
} from './database.js';

// 2. Las funciones están listas para usar
// No requieren inicialización manual
```

#### Guardar una Consulta

```javascript
async function procesarConsultaNoReconocida(mensaje) {
    const fecha = new Date().toLocaleDateString('es-ES');
    const hora = new Date().toLocaleTimeString('es-ES');

    const resultado = await guardarConsultaPendiente(
        mensaje,
        fecha,
        hora,
        'matematicas'  // categoría opcional
    );

    if (resultado.success) {
        console.log('Consulta guardada con ID:', resultado.data[0].id);
        return resultado.data[0];
    }
}
```

#### Obtener y Mostrar Consultas Pendientes

```javascript
async function mostrarConsultasPendientes() {
    const resultado = await obtenerConsultasPendientes();

    if (resultado.success) {
        const consultas = resultado.data;

        consultas.forEach(consulta => {
            console.log(`
                ID: ${consulta.id}
                Mensaje: ${consulta.mensaje}
                Categoría: ${consulta.categoria}
                Fecha: ${new Date(consulta.fecha_hora).toLocaleString()}
            `);
        });

        return consultas;
    }
}
```

#### Resolver una Consulta

```javascript
async function resolverConsulta(idConsulta, respuesta) {
    const resultado = await marcarConsultaResuelta(
        idConsulta,
        respuesta
    );

    if (resultado.success) {
        console.log('Consulta resuelta exitosamente');
        return true;
    }
    return false;
}
```

### Para Implementación en Panel Docente

```javascript
// En panel-docente.js

async function cargarConsultasPendientes() {
    const resultado = await obtenerConsultasPendientes();
    const consultas = resultado.data;

    // Renderizar en el DOM
    consultas.forEach(consulta => {
        const elementoHTML = crearElementoConsulta(consulta);
        contenedorConsultas.appendChild(elementoHTML);
    });
}

async function responderConsulta(id, respuesta) {
    await marcarConsultaResuelta(id, respuesta);
    await cargarConsultasPendientes();  // Recargar lista
}
```

---

## Mejores Prácticas

### 1. Siempre Usar Try-Catch

```javascript
// ✅ CORRECTO
try {
    const resultado = await guardarConsultaPendiente(...);
    if (resultado.success) {
        // procesar
    }
} catch (err) {
    console.warn('Error:', err);
    // manejar error
}

// ❌ INCORRECTO
const resultado = await guardarConsultaPendiente(...);
// Sin manejo de errores
```

### 2. Verificar resultado.success

```javascript
// ✅ CORRECTO
const resultado = await obtenerConsultasPendientes();
if (resultado.success && resultado.data.length > 0) {
    procesarConsultas(resultado.data);
}

// ❌ INCORRECTO
const resultado = await obtenerConsultasPendientes();
procesarConsultas(resultado.data);  // Podría ser undefined
```

### 3. Usar Categorías Consistentes

```javascript
// Categorías predefinidas
const CATEGORIAS = {
    MATEMATICAS: 'matematicas',
    CIENCIAS: 'ciencias',
    HISTORIA: 'historia',
    LENGUA: 'lengua',
    // ... etc
};

// Uso
await guardarConsultaPendiente(
    mensaje,
    fecha,
    hora,
    CATEGORIAS.MATEMATICAS
);
```

### 4. Logging Apropiado

```javascript
// En desarrollo
console.log('✅ Consulta guardada:', resultado.data);

// En producción (solo errores críticos)
if (error) {
    console.error('Error crítico en BD:', error);
}
```

---

## Solución de Problemas

### Problema: "Supabase no disponible"

**Síntomas:**
```
⚠️ Supabase no disponible, usando localStorage como fallback
```

**Soluciones:**
1. Verificar conexión a internet
2. Verificar que las credenciales en `.env` sean correctas
3. Verificar que el proyecto Supabase esté activo
4. El sistema continuará funcionando con localStorage

### Problema: "localStorage lleno"

**Síntomas:**
- Los datos no se guardan
- Console muestra errores de quota excedida

**Soluciones:**
```javascript
// Limpiar datos antiguos
localStorage.clear();

// O exportar datos primero
await exportarConsultas();
localStorage.clear();
```

### Problema: "Variables de entorno no cargadas"

**Síntomas:**
```
❌ ERROR: No se pudieron cargar las variables de entorno
```

**Soluciones:**
1. Verificar que existe el archivo `.env`
2. Verificar que las variables empiezan con `VITE_`
3. Reiniciar el servidor de desarrollo (`npm run dev`)
4. El sistema usará valores de respaldo automáticamente

---

## Mantenimiento y Actualización

### Limpieza de Datos

```javascript
// Limpiar consultas resueltas antiguas (más de 30 días)
async function limpiarConsultasAntiguas() {
    const resultado = await obtenerTodasLasConsultas();
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    const consultasRecientes = resultado.data.filter(consulta => {
        const fechaConsulta = new Date(consulta.fecha_hora);
        return fechaConsulta > hace30Dias || consulta.estado === 'pendiente';
    });

    // Actualizar storage
    setLocalData('consultas_pendientes', consultasRecientes);
}
```

### Migración de Datos

Si necesitas migrar datos de localStorage a Supabase:

```javascript
async function migrarDatosASupabase() {
    const consultasLocales = getLocalData('consultas_pendientes');

    for (const consulta of consultasLocales) {
        const { data, error } = await supabase
            .from('consultas_pendientes')
            .insert([consulta])
            .select();

        if (error) {
            console.error('Error migrando consulta:', consulta.id);
        } else {
            console.log('✅ Consulta migrada:', consulta.id);
        }
    }
}
```

---

## Resumen Técnico

### Stack Tecnológico
- **Frontend**: Vanilla JavaScript (ES6+)
- **Base de Datos**: Supabase (PostgreSQL)
- **Cliente DB**: @supabase/supabase-js v2.83.0
- **Fallback**: localStorage API
- **Build Tool**: Vite 5.0.0

### Características Clave
✅ Arquitectura híbrida resiliente
✅ Fallback automático transparente
✅ Manejo robusto de errores
✅ Sin dependencias externas adicionales
✅ Compatible con todos los navegadores modernos
✅ Funciona offline con localStorage
✅ Exportación de datos integrada

### Límites y Consideraciones
- **localStorage**: ~5-10MB de capacidad (varía por navegador)
- **Supabase free tier**: Límites de requests/mes según plan
- **sessionStorage**: Se limpia al cerrar el navegador
- **Datos locales**: Solo disponibles en el mismo navegador/dispositivo

---

## Conclusión

Este sistema de base de datos está diseñado para ser extremadamente robusto y resiliente. Garantiza que la aplicación Asistente Virtual Eduki funcione en cualquier circunstancia, proporcionando una experiencia fluida al usuario independientemente del estado de los servicios externos.

La arquitectura dual con fallback automático asegura que ningún dato se pierda y que los docentes siempre puedan acceder a las consultas de los estudiantes, cumpliendo con el objetivo principal del sistema educativo.
