/**
 * Configuración centralizada de la aplicación
 * Este módulo garantiza que las variables de entorno estén disponibles correctamente
 */

let supabaseUrl;
let supabaseKey;

if (typeof import.meta !== 'undefined' && import.meta.env) {
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
} else {
    supabaseUrl = 'https://0ec90b57d6e95fcbda19832f.supabase.co';
    supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';
}

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERROR: No se pudieron cargar las variables de entorno de Supabase');
    throw new Error('Variables de entorno de Supabase no configuradas');
}

export const config = {
    supabaseUrl,
    supabaseKey
};
