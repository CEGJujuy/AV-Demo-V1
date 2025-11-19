import { obtenerConsultasPendientes, marcarConsultaResuelta, marcarTodasResueltas, exportarConsultas, obtenerTodasLasConsultas } from './database.js';

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

    const btnVerTodas = document.getElementById('showAllQueries');
    if (btnVerTodas) {
        btnVerTodas.addEventListener('click', mostrarTodasLasConsultas);
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

async function mostrarTodasLasConsultas() {
    const resultado = await obtenerTodasLasConsultas();

    if (!resultado.success) {
        alert('❌ Error al cargar las consultas. Por favor, intenta de nuevo.');
        console.error('Error al obtener todas las consultas:', resultado.error);
        return;
    }

    const consultas = resultado.data;

    if (consultas.length === 0) {
        alert('ℹ️ No hay consultas registradas en el sistema.');
        return;
    }

    const consultasPorMateria = {};
    consultas.forEach(consulta => {
        const materia = consulta.categoria || 'general';
        if (!consultasPorMateria[materia]) {
            consultasPorMateria[materia] = [];
        }
        consultasPorMateria[materia].push(consulta);
    });

    const modal = document.createElement('div');
    modal.id = 'modal-todas-consultas';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000000;
        padding: 20px;
    `;

    let contenidoHTML = `
        <div style="
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 1200px;
            width: 95%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.4);
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 3px solid #e74c3c; padding-bottom: 15px;">
                <h2 style="color: #2c3e50; margin: 0; font-size: 1.8rem;">
                    📊 Todas las Consultas por Materia
                </h2>
                <button
                    onclick="cerrarModalTodasConsultas()"
                    style="
                        background: #e74c3c;
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        cursor: pointer;
                        font-size: 1.2rem;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    "
                    onmouseover="this.style.background='#c0392b'"
                    onmouseout="this.style.background='#e74c3c'"
                >
                    ✕
                </button>
            </div>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 25px;">
                <p style="margin: 0; font-size: 1rem; color: #2c3e50;">
                    <strong>📈 Total de consultas:</strong> ${consultas.length} |
                    <strong>📚 Materias:</strong> ${Object.keys(consultasPorMateria).length} |
                    <strong>✅ Resueltas:</strong> ${consultas.filter(c => c.estado === 'resuelta').length} |
                    <strong>⏳ Pendientes:</strong> ${consultas.filter(c => c.estado === 'pendiente').length}
                </p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 25px;">
    `;

    const materiasOrdenadas = Object.keys(consultasPorMateria).sort((a, b) => {
        return consultasPorMateria[b].length - consultasPorMateria[a].length;
    });

    materiasOrdenadas.forEach(materia => {
        const consultasMateria = consultasPorMateria[materia];
        const materiaLabel = obtenerLabelCategoria(materia);
        const totalMateria = consultasMateria.length;
        const resueltasMateria = consultasMateria.filter(c => c.estado === 'resuelta').length;
        const pendientesMateria = consultasMateria.filter(c => c.estado === 'pendiente').length;

        contenidoHTML += `
            <div style="
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                border-radius: 12px;
                padding: 20px;
                border: 2px solid #e9ecef;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 12px;
                    border-bottom: 2px solid #e74c3c;
                ">
                    <h3 style="
                        color: #e74c3c;
                        margin: 0;
                        font-size: 1.3rem;
                        font-weight: 700;
                    ">
                        ${materiaLabel}
                    </h3>
                    <div style="
                        display: flex;
                        gap: 12px;
                        font-size: 0.85rem;
                        font-weight: 600;
                    ">
                        <span style="
                            background: #3498db;
                            color: white;
                            padding: 4px 12px;
                            border-radius: 20px;
                        ">
                            Total: ${totalMateria}
                        </span>
                        <span style="
                            background: #27ae60;
                            color: white;
                            padding: 4px 12px;
                            border-radius: 20px;
                        ">
                            ✅ ${resueltasMateria}
                        </span>
                        <span style="
                            background: #f39c12;
                            color: white;
                            padding: 4px 12px;
                            border-radius: 20px;
                        ">
                            ⏳ ${pendientesMateria}
                        </span>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px;">
        `;

        consultasMateria.forEach((consulta, index) => {
            const fechaHora = new Date(consulta.fecha_hora).toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            const estadoColor = consulta.estado === 'resuelta' ? '#27ae60' : '#f39c12';
            const estadoTexto = consulta.estado === 'resuelta' ? '✅ Resuelta' : '⏳ Pendiente';

            contenidoHTML += `
                <div style="
                    background: white;
                    border-radius: 10px;
                    padding: 15px;
                    border-left: 4px solid ${estadoColor};
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: start;
                        margin-bottom: 10px;
                    ">
                        <div style="flex: 1;">
                            <div style="
                                display: flex;
                                align-items: center;
                                gap: 10px;
                                margin-bottom: 8px;
                            ">
                                <span style="
                                    background: ${estadoColor};
                                    color: white;
                                    padding: 3px 10px;
                                    border-radius: 12px;
                                    font-size: 0.75rem;
                                    font-weight: 600;
                                ">
                                    ${estadoTexto}
                                </span>
                                <span style="
                                    color: #7f8c8d;
                                    font-size: 0.8rem;
                                    font-weight: 500;
                                ">
                                    📅 ${fechaHora}
                                </span>
                            </div>
                            <div style="
                                color: #2c3e50;
                                font-size: 0.75rem;
                                opacity: 0.7;
                                margin-bottom: 8px;
                            ">
                                🆔 ID: ${consulta.id.substring(0, 12)}...
                            </div>
                            <div style="
                                color: #2c3e50;
                                line-height: 1.6;
                                font-size: 0.95rem;
                                margin-bottom: 10px;
                            ">
                                <strong>💬 Consulta:</strong><br>
                                <span style="
                                    display: block;
                                    margin-top: 5px;
                                    padding: 10px;
                                    background: #f8f9fa;
                                    border-radius: 6px;
                                    font-style: italic;
                                ">
                                    "${consulta.mensaje}"
                                </span>
                            </div>
                            ${consulta.respuesta_docente ? `
                                <div style="
                                    margin-top: 12px;
                                    padding: 12px;
                                    background: #e8f5e9;
                                    border-radius: 8px;
                                    border-left: 3px solid #27ae60;
                                ">
                                    <div style="
                                        color: #27ae60;
                                        font-weight: 700;
                                        margin-bottom: 6px;
                                        font-size: 0.9rem;
                                    ">
                                        👨‍🏫 Respuesta del docente:
                                    </div>
                                    <div style="
                                        color: #2c3e50;
                                        line-height: 1.6;
                                        font-size: 0.9rem;
                                    ">
                                        "${consulta.respuesta_docente}"
                                    </div>
                                    ${consulta.fecha_respuesta ? `
                                        <div style="
                                            margin-top: 8px;
                                            color: #7f8c8d;
                                            font-size: 0.75rem;
                                        ">
                                            📅 Respondida: ${new Date(consulta.fecha_respuesta).toLocaleString('es-ES')}
                                        </div>
                                    ` : ''}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        contenidoHTML += `
                </div>
            </div>
        `;
    });

    contenidoHTML += `
            </div>

            <div style="
                margin-top: 25px;
                padding-top: 20px;
                border-top: 2px solid #e9ecef;
                text-align: center;
            ">
                <button
                    onclick="cerrarModalTodasConsultas()"
                    style="
                        background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        padding: 12px 30px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                    "
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(0, 0, 0, 0.3)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 10px rgba(0, 0, 0, 0.2)'"
                >
                    Cerrar
                </button>
            </div>
        </div>
    `;

    modal.innerHTML = contenidoHTML;
    document.body.appendChild(modal);
}

window.cerrarModalTodasConsultas = function() {
    const modal = document.getElementById('modal-todas-consultas');
    if (modal) {
        modal.remove();
    }
};
