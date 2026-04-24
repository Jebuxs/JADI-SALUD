/* CEREBRO JADI SALUD - GENERADOR DE IDS
   Este archivo crea el ADN único para cada registro del sistema.
*/

export const JADI_CORE = {
    // Genera ID de Negocio (Ej: JADI-AZM-01)
    generateBusinessID: (name, count = 1) => {
        const consonants = name.toUpperCase().replace(/[AEIOU\s]/g, '').substring(0, 3);
        const formatCount = count.toString().padStart(2, '0');
        return `JADI-${consonants}-${formatCount}`;
    },

    // Genera ID de Historia Clínica (Ej: HC-1723456789)
    generateHC: (cedula) => `HC-${cedula}`,

    // Genera ID de Examen/Estudio (Ej: RX-2026-A12B)
    generateStudyID: (type) => {
        const prefixes = {
            rayosX: 'RX',
            tomografia: 'TAC',
            laboratorio: 'LAB',
            panoramica: 'PAN'
        };
        const year = new Date().getFullYear();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefixes[type] || 'GEN'}-${year}-${random}`;
    }
};
