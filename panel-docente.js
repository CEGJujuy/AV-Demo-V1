import { obtenerConsultasPendientes, marcarConsultaResuelta, marcarTodasResueltas, exportarConsultas } from './database.js';

let consultasActuales = [];

export function inicializarPanelDocente() {
    const teacherPanel = document.getElementById('teacherPanel');
    const toggleBtn = document.getElementById('toggleTeacherPanel');
    const teacherContent = document.getElementById('teacherContent');
    const refreshBtn = document.getElementById('refreshQueries');
    const pendingQueries = document.getElementById('pendingQueries');

    setTimeout(() => {
        teacherPanel.style.display = 'block';
    }, 5000);

    toggleBtn.addEventListener('click', () => {
        const isVisible = teacherContent.style.display !== 'none';
        teacherContent.style.display = isVisible ? 'none' : 'block';
        toggleBtn.textContent = isVisible ? '👨‍🏫 Panel Docente' : '👨‍🏫 Ocultar Panel';

        if (!isVisible) {
            actualizarConsultasPendientes();
        }
    });

    refreshBtn.addEventListener('click', actualizarConsultasPendientes);

    const btnMarcarTodas = document.getElementById('markAllResolved');
    if (btnMarcarTodas) {
        btnMarcarTodas.addEventListener('click', marcarTodasComoResueltas);
    }

    const btnExportar = document.getElementById('exportQueries');
    if (btnExportar) {
        btnExportar.addEventListener('click', exportarConsultasDocente);
    }

    setInterval(() => {
        if (teacherContent.style.display !== 'none') {
            actualizarConsultasPendientes();
        }
    }, 30000);
}

async function actualizarConsultasPendientes() {
    const pendingQueries = document.getElementById('pendingQueries');

    pendingQueries.innerHTML = '<p class="loading">Cargando consultas...</p>';

    const resultado = await obtenerConsultasPendientes();

    if (resultado.success) {
        consultasActuales = resultado.data;

        if (consultasActuales.length === 0) {
            pendingQueries.innerHTML = '<p class="no-queries">✅ No hay consultas pendientes</p>';
        } else {
            let html = '';
            consultasActuales.forEach((consulta, index) => {
                const fechaHora = new Date(consulta.fecha_hora).toLocaleString('es-ES');
                html += `
                    <div class="query-item">
                        <div class="query-header">
                            <span class="query-number">#${index + 1}</span>
                            <span class="query-time">${fechaHora}</span>
                        </div>
                        <div class="query-message">"${consulta.mensaje}"</div>
                        <div class="query-actions">
                            <button class="respond-btn" onclick="responderConsultaPorId('${consulta.id}', ${index})">
                                📝 Responder
                            </button>
                            <button class="mark-resolved-btn" onclick="marcarResueltoPorId('${consulta.id}')">
                                ✅ Marcar como resuelto
                            </button>
                        </div>
                    </div>
                `;
            });
            pendingQueries.innerHTML = html;
        }
    } else {
        pendingQueries.innerHTML = '<p class="error">❌ Error al cargar consultas</p>';
        console.error('Error al obtener consultas:', resultado.error);
    }
}

window.responderConsultaPorId = async function(consultaId, index) {
    const respuesta = prompt('Escribe tu respuesta para el estudiante:');
    if (respuesta && respuesta.trim()) {
        const resultado = await marcarConsultaResuelta(consultaId, respuesta.trim());

        if (resultado.success) {
            alert(`✅ Respuesta enviada al estudiante: "${respuesta}"`);
            console.log('📧 Respuesta del docente guardada:', resultado.data);
            await actualizarConsultasPendientes();
        } else {
            alert('❌ Error al guardar la respuesta. Por favor, intenta de nuevo.');
            console.error('Error al responder consulta:', resultado.error);
        }
    }
};

window.marcarResueltoPorId = async function(consultaId) {
    const confirmacion = confirm('¿Marcar esta consulta como resuelta?');
    if (confirmacion) {
        const resultado = await marcarConsultaResuelta(consultaId);

        if (resultado.success) {
            alert('✅ Consulta marcada como resuelta');
            await actualizarConsultasPendientes();
        } else {
            alert('❌ Error al marcar la consulta. Por favor, intenta de nuevo.');
            console.error('Error al marcar consulta:', resultado.error);
        }
    }
};

async function marcarTodasComoResueltas() {
    if (consultasActuales.length === 0) {
        alert('No hay consultas pendientes para marcar.');
        return;
    }

    const confirmacion = confirm(`¿Estás seguro de marcar como resueltas las ${consultasActuales.length} consultas pendientes?`);

    if (confirmacion) {
        const resultado = await marcarTodasResueltas();

        if (resultado.success) {
            alert(`✅ ${resultado.data.length} consultas marcadas como resueltas`);
            await actualizarConsultasPendientes();
        } else {
            alert('❌ Error al marcar las consultas. Por favor, intenta de nuevo.');
            console.error('Error al marcar todas las consultas:', resultado.error);
        }
    }
}

async function exportarConsultasDocente() {
    const resultado = await exportarConsultas();

    if (resultado.success) {
        alert(`✅ Consultas exportadas exitosamente. Total: ${resultado.data.length}`);
    } else {
        alert('❌ Error al exportar las consultas. Por favor, intenta de nuevo.');
        console.error('Error al exportar consultas:', resultado.error);
    }
}
