// conexion.js - Configuración e interacción REST nativa con Supabase y Rebrickable

const SUPABASE_BASE_URL = 'https://whuzozhhgljlvpssdtup.supabase.co/rest/v1';
const SUPABASE_API_KEY = 'sb_publishable_gM76Ne6ydsE3RoFVdQvyPQ_AKeCr8ay';

const headersComunes = {
    'apikey': SUPABASE_API_KEY,
    'Authorization': `Bearer ${SUPABASE_API_KEY}`,
    'Content-Type': 'application/json'
};

/**
 * Consulta las piezas e inventario desde Supabase mediante la API REST nativa
 * @param {string|null} categoriaFiltro - Tipo de categoría a filtrar
 */
async function obtenerInventarioSupabase(categoriaFiltro = null) {
    try {
        // Consultamos la vista o tabla con joins de piezas, colores y categorías
        let url = `${SUPABASE_BASE_URL}/inventario_piezas?select=id,part_num,color,imprenta_diseno,condicion,precio,cantidad_stock,categoria,imagen_url`;
        
        if (categoriaFiltro) {
            url += `&categoria=eq.${encodeURIComponent(categoriaFiltro)}`;
        }

        const respuesta = await fetch(url, {
            method: 'GET',
            headers: headersComunes
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        return await respuesta.json();
    } catch (err) {
        console.warn("No se pudo obtener el inventario de Supabase o la tabla no está creada aún:", err);
        return null;
    }
}

/**
 * Agrega o actualiza una pieza en el inventario de Supabase
 */
async function guardarPiezaEnSupabase(datosPieza) {
    try {
        const respuesta = await fetch(`${SUPABASE_BASE_URL}/inventario_piezas`, {
            method: 'POST',
            headers: {
                ...headersComunes,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(datosPieza)
        });

        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
        return await respuesta.json();
    } catch (err) {
        console.error("Error al guardar pieza en Supabase:", err);
        return null;
    }
}
