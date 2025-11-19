// Importar la función createClient del paquete de Supabase para crear una instancia del cliente
import { createClient } from '@supabase/supabase-js';

// Obtener la URL y la clave anónima de Supabase desde las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Crear y exportar la instancia del cliente de Supabase usando la URL y la clave
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Función para guardar una nueva consulta pendiente en la base de datos
 * @param {string} mensaje - El mensaje de la consulta del estudiante
 * @param {string} fecha - La fecha de la consulta
 * @param {string} hora - La hora de la consulta
 * @param {string} categoria - La categoría de la materia (opcional)
 * @returns {Object} Objeto con success y data/error
 */
export async function guardarConsultaPendiente(mensaje, fecha, hora, categoria = null) {
    try {
        // Insertar una nueva fila en la tabla 'consultas_pendientes'
        const { data, error } = await supabase
            .from('consultas_pendientes')
            .insert([
                {
                    mensaje: mensaje,
                    fecha_hora: new Date().toISOString(),
                    estado: 'pendiente',
                    categoria: categoria
                }
            ])
            .select();

        // Si hay un error en la inserción, registrarlo y devolver resultado negativo
        if (error) {
            console.error('Error al guardar consulta:', error);
            return { success: false, error };
        }

        // Si la inserción fue exitosa, registrar y devolver resultado positivo
        console.log('✅ Consulta guardada en la base de datos:', data);
        return { success: true, data };
    } catch (err) {
        // Capturar cualquier error inesperado y devolverlo
        console.error('Error al guardar consulta:', err);
        return { success: false, error: err };
    }
}

/**
 * Función para obtener todas las consultas con estado 'pendiente'
 * @returns {Object} Objeto con success y array de consultas pendientes
 */
export async function obtenerConsultasPendientes() {
    try {
        // Consultar todas las filas con estado 'pendiente', ordenadas por fecha descendente
        const { data, error } = await supabase
            .from('consultas_pendientes')
            .select('*')
            .eq('estado', 'pendiente')
            .order('fecha_hora', { ascending: false });

        // Si hay un error en la consulta, registrarlo y devolver array vacío
        if (error) {
            console.error('Error al obtener consultas pendientes:', error);
            return { success: false, error, data: [] };
        }

        // Devolver los datos obtenidos o un array vacío si no hay resultados
        return { success: true, data: data || [] };
    } catch (err) {
        console.error('Error al obtener consultas pendientes:', err);
        return { success: false, error: err, data: [] };
    }
}

/**
 * Función para obtener todas las consultas (pendientes y resueltas)
 * @returns {Object} Objeto con success y array de todas las consultas
 */
export async function obtenerTodasLasConsultas() {
    try {
        // Consultar todas las filas, ordenadas primero por categoría y luego por fecha
        const { data, error } = await supabase
            .from('consultas_pendientes')
            .select('*')
            .order('categoria', { ascending: true })
            .order('fecha_hora', { ascending: false });

        // Si hay un error en la consulta, registrarlo y devolver array vacío
        if (error) {
            console.error('Error al obtener todas las consultas:', error);
            return { success: false, error, data: [] };
        }

        // Devolver los datos obtenidos o un array vacío si no hay resultados
        return { success: true, data: data || [] };
    } catch (err) {
        console.error('Error al obtener todas las consultas:', err);
        return { success: false, error: err, data: [] };
    }
}

/**
 * Función para marcar una consulta específica como resuelta
 * @param {string} id - El ID de la consulta a marcar como resuelta
 * @param {string} respuestaDocente - La respuesta del docente (opcional)
 * @returns {Object} Objeto con success y data/error
 */
export async function marcarConsultaResuelta(id, respuestaDocente = null) {
    try {
        // Crear objeto con los datos a actualizar
        const updateData = {
            estado: 'resuelta',
            fecha_respuesta: new Date().toISOString()
        };

        // Si se proporciona una respuesta del docente, añadirla al objeto de actualización
        if (respuestaDocente) {
            updateData.respuesta_docente = respuestaDocente;
        }

        // Actualizar la fila que coincida con el ID proporcionado
        const { data, error } = await supabase
            .from('consultas_pendientes')
            .update(updateData)
            .eq('id', id)
            .select();

        // Si hay un error en la actualización, registrarlo y devolver resultado negativo
        if (error) {
            console.error('Error al marcar consulta como resuelta:', error);
            return { success: false, error };
        }

        // Registrar el éxito y devolver los datos actualizados
        console.log('✅ Consulta marcada como resuelta:', data);
        return { success: true, data };
    } catch (err) {
        console.error('Error al marcar consulta como resuelta:', err);
        return { success: false, error: err };
    }
}

/**
 * Función para marcar todas las consultas pendientes como resueltas
 * @returns {Object} Objeto con success y data/error
 */
export async function marcarTodasResueltas() {
    try {
        // Actualizar todas las filas que tengan estado 'pendiente'
        const { data, error } = await supabase
            .from('consultas_pendientes')
            .update({
                estado: 'resuelta',
                fecha_respuesta: new Date().toISOString()
            })
            .eq('estado', 'pendiente')
            .select();

        // Si hay un error en la actualización, registrarlo y devolver resultado negativo
        if (error) {
            console.error('Error al marcar todas las consultas como resueltas:', error);
            return { success: false, error };
        }

        // Registrar el éxito y devolver los datos de todas las consultas actualizadas
        console.log('✅ Todas las consultas marcadas como resueltas:', data);
        return { success: true, data };
    } catch (err) {
        console.error('Error al marcar todas las consultas como resueltas:', err);
        return { success: false, error: err };
    }
}

/**
 * Función para guardar un mensaje en el historial de conversaciones
 * @param {string} mensaje - El contenido del mensaje
 * @param {string} tipo - Tipo de mensaje ('usuario' o 'asistente')
 * @param {string} categoria - Categoría de la materia (opcional)
 * @param {boolean} fueReconocida - Indica si la consulta fue reconocida por el asistente
 * @returns {Object} Objeto con success y data/error
 */
export async function guardarMensajeHistorial(mensaje, tipo, categoria = null, fueReconocida = true) {
    try {
        // Insertar el mensaje en la tabla 'historial_conversaciones'
        const { data, error } = await supabase
            .from('historial_conversaciones')
            .insert([
                {
                    mensaje: mensaje,
                    tipo: tipo,
                    categoria: categoria,
                    fue_reconocida: fueReconocida,
                    session_id: obtenerSessionId() // Obtener o crear un ID de sesión único
                }
            ])
            .select();

        // Si hay un error en la inserción, registrarlo y devolver resultado negativo
        if (error) {
            console.error('Error al guardar mensaje en historial:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Error al guardar mensaje en historial:', err);
        return { success: false, error: err };
    }
}

/**
 * Función para obtener o crear un ID de sesión único
 * El ID se almacena en sessionStorage para mantenerlo durante la sesión del navegador
 * @returns {string} ID de sesión único
 */
function obtenerSessionId() {
    // Intentar obtener el ID de sesión existente del sessionStorage
    let sessionId = sessionStorage.getItem('assistant_session_id');
    // Si no existe, crear uno nuevo usando timestamp y caracteres aleatorios
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        // Guardar el nuevo ID en sessionStorage
        sessionStorage.setItem('assistant_session_id', sessionId);
    }
    return sessionId;
}

/**
 * Función para exportar todas las consultas a un archivo de texto
 * @returns {Object} Objeto con success y data/error
 */
export async function exportarConsultas() {
    try {
        // Obtener todas las consultas de la base de datos
        const { data, error } = await supabase
            .from('consultas_pendientes')
            .select('*')
            .order('fecha_hora', { ascending: false });

        // Si hay un error en la consulta, registrarlo y devolver resultado negativo
        if (error) {
            console.error('Error al exportar consultas:', error);
            return { success: false, error };
        }

        // Crear el nombre del archivo con la fecha y hora actuales
        const fecha = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
        const hora = new Date().toLocaleTimeString('es-ES').replace(/:/g, '-');
        const nombreArchivo = `consultas_export_${fecha}_${hora}.txt`;

        // Crear el encabezado del reporte con información general
        let contenido = 'REPORTE DE CONSULTAS\n';
        contenido += '='.repeat(50) + '\n\n';
        contenido += `Fecha de exportación: ${new Date().toLocaleString('es-ES')}\n`;
        contenido += `Total de consultas: ${data.length}\n\n`;

        // Iterar sobre cada consulta y añadir sus detalles al contenido
        data.forEach((consulta, index) => {
            contenido += `CONSULTA #${index + 1}\n`;
            contenido += `Fecha: ${new Date(consulta.fecha_hora).toLocaleString('es-ES')}\n`;
            if (consulta.categoria) {
                contenido += `Categoría: ${consulta.categoria.toUpperCase()}\n`;
            }
            contenido += `Mensaje: "${consulta.mensaje}"\n`;
            contenido += `Estado: ${consulta.estado.toUpperCase()}\n`;
            if (consulta.respuesta_docente) {
                contenido += `Respuesta del docente: "${consulta.respuesta_docente}"\n`;
                contenido += `Fecha respuesta: ${new Date(consulta.fecha_respuesta).toLocaleString('es-ES')}\n`;
            }
            contenido += '-'.repeat(30) + '\n\n';
        });

        // Crear un blob con el contenido del reporte
        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        // Crear una URL temporal para el blob
        const url = URL.createObjectURL(blob);
        // Crear un enlace de descarga invisible
        const link = document.createElement('a');
        link.href = url;
        link.download = nombreArchivo;
        // Añadir el enlace al DOM, hacer clic y eliminarlo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Liberar la URL temporal del blob
        URL.revokeObjectURL(url);

        return { success: true, data };
    } catch (err) {
        console.error('Error al exportar consultas:', err);
        return { success: false, error: err };
    }
}
