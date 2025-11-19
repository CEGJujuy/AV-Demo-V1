import { createClient } from '@supabase/supabase-js';
import { config } from './config.js';

const supabaseUrl = config.supabaseUrl;
const supabaseKey = config.supabaseKey;

console.log('✅ Supabase configurado correctamente');
console.log('URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey);

let useLocalStorage = false;

async function testSupabaseConnection() {
    try {
        const { error } = await supabase.from('consultas_pendientes').select('count', { count: 'exact', head: true });
        if (error) {
            console.warn('⚠️ Supabase no disponible, usando localStorage como fallback');
            useLocalStorage = true;
            return false;
        }
        return true;
    } catch (err) {
        console.warn('⚠️ Supabase no disponible, usando localStorage como fallback');
        useLocalStorage = true;
        return false;
    }
}

testSupabaseConnection();

function getLocalData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function setLocalData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch {
        return false;
    }
}

export async function guardarConsultaPendiente(mensaje, fecha, hora, categoria = null) {
    const consultaData = {
        id: Date.now().toString(),
        mensaje: mensaje,
        fecha_hora: new Date().toISOString(),
        estado: 'pendiente',
        categoria: categoria
    };

    if (!useLocalStorage) {
        try {
            const { data, error } = await supabase
                .from('consultas_pendientes')
                .insert([consultaData])
                .select();

            if (!error) {
                console.log('✅ Consulta guardada en Supabase:', data);
                return { success: true, data };
            }
        } catch (err) {
            console.warn('⚠️ Error con Supabase, guardando localmente');
            useLocalStorage = true;
        }
    }

    const consultas = getLocalData('consultas_pendientes');
    consultas.push(consultaData);
    setLocalData('consultas_pendientes', consultas);
    console.log('✅ Consulta guardada en localStorage');
    return { success: true, data: [consultaData] };
}

export async function obtenerConsultasPendientes() {
    if (!useLocalStorage) {
        try {
            const { data, error } = await supabase
                .from('consultas_pendientes')
                .select('*')
                .eq('estado', 'pendiente')
                .order('fecha_hora', { ascending: false });

            if (!error) {
                return { success: true, data: data || [] };
            }
        } catch (err) {
            console.warn('⚠️ Error con Supabase, usando localStorage');
            useLocalStorage = true;
        }
    }

    const consultas = getLocalData('consultas_pendientes').filter(c => c.estado === 'pendiente');
    return { success: true, data: consultas };
}

export async function obtenerTodasLasConsultas() {
    if (!useLocalStorage) {
        try {
            const { data, error } = await supabase
                .from('consultas_pendientes')
                .select('*')
                .order('categoria', { ascending: true })
                .order('fecha_hora', { ascending: false });

            if (!error) {
                return { success: true, data: data || [] };
            }
        } catch (err) {
            console.warn('⚠️ Error con Supabase, usando localStorage');
            useLocalStorage = true;
        }
    }

    const consultas = getLocalData('consultas_pendientes');
    return { success: true, data: consultas };
}

export async function marcarConsultaResuelta(id, respuestaDocente = null) {
    const updateData = {
        estado: 'resuelta',
        fecha_respuesta: new Date().toISOString(),
        respuesta_docente: respuestaDocente
    };

    if (!useLocalStorage) {
        try {
            const { data, error } = await supabase
                .from('consultas_pendientes')
                .update(updateData)
                .eq('id', id)
                .select();

            if (!error) {
                console.log('✅ Consulta marcada como resuelta en Supabase');
                return { success: true, data };
            }
        } catch (err) {
            console.warn('⚠️ Error con Supabase, actualizando localmente');
            useLocalStorage = true;
        }
    }

    const consultas = getLocalData('consultas_pendientes');
    const index = consultas.findIndex(c => c.id === id);
    if (index !== -1) {
        consultas[index] = { ...consultas[index], ...updateData };
        setLocalData('consultas_pendientes', consultas);
        console.log('✅ Consulta marcada como resuelta en localStorage');
        return { success: true, data: [consultas[index]] };
    }
    return { success: false, error: 'Consulta no encontrada' };
}

export async function marcarTodasResueltas() {
    const updateData = {
        estado: 'resuelta',
        fecha_respuesta: new Date().toISOString()
    };

    if (!useLocalStorage) {
        try {
            const { data, error } = await supabase
                .from('consultas_pendientes')
                .update(updateData)
                .eq('estado', 'pendiente')
                .select();

            if (!error) {
                console.log('✅ Todas las consultas marcadas como resueltas en Supabase');
                return { success: true, data };
            }
        } catch (err) {
            console.warn('⚠️ Error con Supabase, actualizando localmente');
            useLocalStorage = true;
        }
    }

    const consultas = getLocalData('consultas_pendientes');
    const actualizadas = consultas.map(c => {
        if (c.estado === 'pendiente') {
            return { ...c, ...updateData };
        }
        return c;
    });
    setLocalData('consultas_pendientes', actualizadas);
    console.log('✅ Todas las consultas marcadas como resueltas en localStorage');
    return { success: true, data: actualizadas };
}

export async function guardarMensajeHistorial(mensaje, tipo, categoria = null, fueReconocida = true) {
    const mensajeData = {
        id: Date.now().toString() + Math.random(),
        mensaje: mensaje,
        tipo: tipo,
        categoria: categoria,
        fue_reconocida: fueReconocida,
        session_id: obtenerSessionId(),
        fecha_hora: new Date().toISOString()
    };

    if (!useLocalStorage) {
        try {
            const { data, error } = await supabase
                .from('historial_conversaciones')
                .insert([mensajeData])
                .select();

            if (!error) {
                return { success: true, data };
            }
        } catch (err) {
            useLocalStorage = true;
        }
    }

    const historial = getLocalData('historial_conversaciones');
    historial.push(mensajeData);
    setLocalData('historial_conversaciones', historial);
    return { success: true, data: [mensajeData] };
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
    let consultas = [];

    if (!useLocalStorage) {
        try {
            const { data, error } = await supabase
                .from('consultas_pendientes')
                .select('*')
                .order('fecha_hora', { ascending: false });

            if (!error) {
                consultas = data;
            } else {
                consultas = getLocalData('consultas_pendientes');
            }
        } catch (err) {
            consultas = getLocalData('consultas_pendientes');
        }
    } else {
        consultas = getLocalData('consultas_pendientes');
    }

    const fecha = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
    const hora = new Date().toLocaleTimeString('es-ES').replace(/:/g, '-');
    const nombreArchivo = `consultas_export_${fecha}_${hora}.txt`;

    let contenido = 'REPORTE DE CONSULTAS\n';
    contenido += '='.repeat(50) + '\n\n';
    contenido += `Fecha de exportación: ${new Date().toLocaleString('es-ES')}\n`;
    contenido += `Total de consultas: ${consultas.length}\n\n`;

    consultas.forEach((consulta, index) => {
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

    return { success: true, data: consultas };
}
