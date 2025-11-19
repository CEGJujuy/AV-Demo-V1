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
                const categoria = consulta.categoria || 'general';
                const categoriaLabel = obtenerLabelCategoria(categoria);

                html += `
                    <div class="query-item">
                        <div class="query-header">
                            <span class="query-number">#${index + 1}</span>
                            <span class="query-time">${fechaHora}</span>
                        </div>

                        <span class="query-category ${categoria}">${categoriaLabel}</span>

                        <div class="query-metadata">
                            <div class="query-metadata-item">
                                <strong>📚 Asignatura:</strong> ${categoriaLabel}
                            </div>
                            <div class="query-metadata-item">
                                <strong>📅 Fecha:</strong> ${fechaHora}
                            </div>
                            <div class="query-metadata-item">
                                <strong>🆔 ID:</strong> ${consulta.id.substring(0, 8)}...
                            </div>
                        </div>

                        <div class="query-message">
                            <strong>💬 Consulta del estudiante:</strong><br>
                            "${consulta.mensaje}"
                        </div>

                        <div class="query-actions">
                            <button class="respond-btn" onclick="abrirModalRespuesta('${consulta.id}', \`${consulta.mensaje.replace(/`/g, '\\`').replace(/"/g, '&quot;')}\`, '${categoriaLabel}')">
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

function obtenerLabelCategoria(categoria) {
    const labels = {
        'matematicas': 'Matemáticas',
        'ciencias': 'Ciencias',
        'historia': 'Historia',
        'lengua': 'Lengua y Literatura',
        'ingles': 'Inglés',
        'geografia': 'Geografía',
        'educacion_fisica': 'Educación Física',
        'arte': 'Arte',
        'musica': 'Música',
        'filosofia': 'Filosofía',
        'consejos_estudio': 'Consejos de Estudio',
        'examenes': 'Exámenes',
        'tiempo': 'Organización del Tiempo',
        'motivacion': 'Motivación',
        'general': 'General'
    };
    return labels[categoria] || 'General';
}

window.abrirModalRespuesta = function(consultaId, mensajeConsulta, categoria) {
    const modal = document.createElement('div');
    modal.id = 'modal-respuesta';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        ">
            <h2 style="color: #2c3e50; margin-bottom: 20px; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">
                📝 Responder Consulta
            </h2>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0;"><strong>📚 Asignatura:</strong> ${categoria}</p>
                <p style="margin: 0;"><strong>💬 Consulta del estudiante:</strong></p>
                <p style="
                    margin: 10px 0 0 0;
                    padding: 10px;
                    background: white;
                    border-radius: 8px;
                    font-style: italic;
                    border-left: 4px solid #e74c3c;
                ">"${mensajeConsulta}"</p>
            </div>

            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50;">
                ✍️ Tu respuesta para el estudiante:
            </label>
            <textarea
                id="respuesta-textarea"
                style="
                    width: 100%;
                    min-height: 150px;
                    padding: 12px;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    font-family: inherit;
                    font-size: 14px;
                    resize: vertical;
                    box-sizing: border-box;
                "
                placeholder="Escribe aquí tu respuesta detallada para el estudiante..."
            ></textarea>

            <div style="display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end;">
                <button
                    onclick="cerrarModalRespuesta()"
                    style="
                        padding: 10px 20px;
                        background: #6c757d;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    "
                >
                    ❌ Cancelar
                </button>
                <button
                    onclick="enviarRespuesta('${consultaId}')"
                    style="
                        padding: 10px 20px;
                        background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    "
                >
                    ✅ Enviar Respuesta
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.getElementById('respuesta-textarea').focus();
};

window.cerrarModalRespuesta = function() {
    const modal = document.getElementById('modal-respuesta');
    if (modal) {
        modal.remove();
    }
};

window.enviarRespuesta = async function(consultaId) {
    const respuesta = document.getElementById('respuesta-textarea').value.trim();

    if (!respuesta) {
        alert('⚠️ Por favor, escribe una respuesta antes de enviar.');
        return;
    }

    const resultado = await marcarConsultaResuelta(consultaId, respuesta);

    if (resultado.success) {
        alert(`✅ Respuesta enviada al estudiante exitosamente`);
        console.log('📧 Respuesta del docente guardada:', resultado.data);
        cerrarModalRespuesta();
        await actualizarConsultasPendientes();
    } else {
        alert('❌ Error al guardar la respuesta. Por favor, intenta de nuevo.');
        console.error('Error al responder consulta:', resultado.error);
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
