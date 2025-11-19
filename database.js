import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function guardarConsultaPendiente(mensaje, fecha, hora, categoria = null) {
    try {
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

        if (error) {
            console.error('Error al guardar consulta:', error);
            return { success: false, error };
        }

        console.log('✅ Consulta guardada en la base de datos:', data);
        return { success: true, data };
    } catch (err) {
        console.error('Error al guardar consulta:', err);
        return { success: false, error: err };
    }
}

export async function obtenerConsultasPendientes() {
    try {
        const { data, error } = await supabase
            .from('consultas_pendientes')
            .select('*')
            .eq('estado', 'pendiente')
            .order('fecha_hora', { ascending: false });

        if (error) {
            console.error('Error al obtener consultas pendientes:', error);
            return { success: false, error, data: [] };
        }

        return { success: true, data: data || [] };
    } catch (err) {
        console.error('Error al obtener consultas pendientes:', err);
        return { success: false, error: err, data: [] };
    }
}

export async function obtenerTodasLasConsultas() {
    try {
        const { data, error } = await supabase
            .from('consultas_pendientes')
            .select('*')
            .order('categoria', { ascending: true })
            .order('fecha_hora', { ascending: false });

        if (error) {
            console.error('Error al obtener todas las consultas:', error);
            return { success: false, error, data: [] };
        }

        return { success: true, data: data || [] };
    } catch (err) {
        console.error('Error al obtener todas las consultas:', err);
        return { success: false, error: err, data: [] };
    }
}

export async function marcarConsultaResuelta(id, respuestaDocente = null) {
    try {
        const updateData = {
            estado: 'resuelta',
            fecha_respuesta: new Date().toISOString()
        };

        if (respuestaDocente) {
            updateData.respuesta_docente = respuestaDocente;
        }

        const { data, error } = await supabase
            .from('consultas_pendientes')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error al marcar consulta como resuelta:', error);
            return { success: false, error };
        }

        console.log('✅ Consulta marcada como resuelta:', data);
        return { success: true, data };
    } catch (err) {
        console.error('Error al marcar consulta como resuelta:', err);
        return { success: false, error: err };
    }
}

export async function marcarTodasResueltas() {
    try {
        const { data, error } = await supabase
            .from('consultas_pendientes')
            .update({
                estado: 'resuelta',
                fecha_respuesta: new Date().toISOString()
            })
            .eq('estado', 'pendiente')
            .select();

        if (error) {
            console.error('Error al marcar todas las consultas como resueltas:', error);
            return { success: false, error };
        }

        console.log('✅ Todas las consultas marcadas como resueltas:', data);
        return { success: true, data };
    } catch (err) {
        console.error('Error al marcar todas las consultas como resueltas:', err);
        return { success: false, error: err };
    }
}

export async function guardarMensajeHistorial(mensaje, tipo, categoria = null, fueReconocida = true) {
    try {
        const { data, error } = await supabase
            .from('historial_conversaciones')
            .insert([
                {
                    mensaje: mensaje,
                    tipo: tipo,
                    categoria: categoria,
                    fue_reconocida: fueReconocida,
                    session_id: obtenerSessionId()
                }
            ])
            .select();

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

function obtenerSessionId() {
    let sessionId = sessionStorage.getItem('assistant_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('assistant_session_id', sessionId);
    }
    return sessionId;
}

export async function exportarConsultas() {
    try {
        const { data, error } = await supabase
            .from('consultas_pendientes')
            .select('*')
            .order('fecha_hora', { ascending: false });

        if (error) {
            console.error('Error al exportar consultas:', error);
            return { success: false, error };
        }

        const fecha = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
        const hora = new Date().toLocaleTimeString('es-ES').replace(/:/g, '-');
        const nombreArchivo = `consultas_export_${fecha}_${hora}.txt`;

        let contenido = 'REPORTE DE CONSULTAS\n';
        contenido += '='.repeat(50) + '\n\n';
        contenido += `Fecha de exportación: ${new Date().toLocaleString('es-ES')}\n`;
        contenido += `Total de consultas: ${data.length}\n\n`;

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

        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return { success: true, data };
    } catch (err) {
        console.error('Error al exportar consultas:', err);
        return { success: false, error: err };
    }
}
