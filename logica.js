// logica.js - Lógica principal del catálogo de la tienda

// Catálogo base con la estructura exacta requerida (Rebrickable + Stock + Estampados)
const PIEZAS_CATALOGO = {
    normales: [
        { part_num: "3001", nombre: "Brick 2x2", color: "Rojo (Red)", imprenta_diseno: "Sin estampado", cantidad_stock: 15, imagen_url: "https://cdn.rebrickable.com/media/parts/elements/300121.jpg" },
        { part_num: "3001", nombre: "Brick 2x2", color: "Blanco (White)", imprenta_diseno: "Sin estampado", cantidad_stock: 0, imagen_url: "https://cdn.rebrickable.com/media/parts/elements/300101.jpg" },
        { part_num: "3002", nombre: "Brick 2x3", color: "Negro (Black)", imprenta_diseno: "Sin estampado", cantidad_stock: 8, imagen_url: "https://cdn.rebrickable.com/media/parts/elements/300226.jpg" }
    ],
    especiales: [
        { part_num: "3040b", nombre: "Slope 45 2x2", color: "Azul (Blue)", imprenta_diseno: "Sin estampado", cantidad_stock: 0, imagen_url: "https://cdn.rebrickable.com/media/parts/elements/304023.jpg" },
        { part_num: "3700", nombre: "Technic Brick 1x2 Hole", color: "Amarillo (Yellow)", imprenta_diseno: "Sin estampado", cantidad_stock: 22, imagen_url: "https://cdn.rebrickable.com/media/parts/elements/370024.jpg" }
    ],
    munecos: [
        { part_num: "3626c", nombre: "Cabeza Minifigura", color: "Amarillo (Yellow)", imprenta_diseno: "Carita Sonriente Clásica", cantidad_stock: 5, imagen_url: "https://cdn.rebrickable.com/media/parts/elements/362624.jpg" },
        { part_num: "973", nombre: "Torso Minifigura Espacial", color: "Negro (Black)", imprenta_diseno: "Logo Space Classic", cantidad_stock: 0, imagen_url: "https://cdn.rebrickable.com/media/parts/elements/4114309.jpg" }
    ],
    accesorios_munecos: [
        { part_num: "3842", nombre: "Casco de Minifigura", color: "Gris (Light Gray)", imprenta_diseno: "Sin estampado", cantidad_stock: 4, imagen_url: "https://cdn.rebrickable.com/media/parts/elements/384202.jpg" }
    ],
    animales: [
        { part_num: "13337", nombre: "Gato de Pie", color: "Gris Claro", imprenta_diseno: "Ojos y Nariz impresos", cantidad_stock: 3, imagen_url: "https://cdn.rebrickable.com/media/parts/elements/6022170.jpg" }
    ],
    series: [
        { part_num: "85863", nombre: "Microfig Star Wars", color: "Azul Oscuro", imprenta_diseno: "Traje R2-D2", cantidad_stock: 12, imagen_url: "https://cdn.rebrickable.com/media/parts/elements/6000000.jpg" }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    cargarCategoria('normales');
});

/**
 * Evento al hacer clic en los botones de navegación
 */
function filtrarCategoria(categoria, elemento) {
    document.querySelectorAll('.btn-cat').forEach(btn => btn.classList.remove('active'));
    elemento.classList.add('active');
    cargarCategoria(categoria);
}

/**
 * Carga las piezas obteniendo primero de Supabase (REST fetch) y usando fallback local
 */
async function cargarCategoria(categoria) {
    const contenedor = document.getElementById('piezas-container');
    contenedor.innerHTML = '<div class="loading">Consultando piezas...</div>';

    // Intentamos consultar la base de datos de Supabase vía fetch REST
    let piezas = await obtenerInventarioSupabase(categoria);

    // Si Supabase devuelve array vacío o null (por no haber creado la tabla inventario_piezas aún),
    // mostramos los datos locales estructurados de Rebrickable
    if (!piezas || piezas.length === 0) {
        piezas = PIEZAS_CATALOGO[categoria] || [];
    }

    renderizarPiezas(piezas);
}

/**
 * Muestra las tarjetas de las piezas con stock y detalles en el DOM
 */
function renderizarPiezas(piezas) {
    const contenedor = document.getElementById('piezas-container');
    contenedor.innerHTML = '';

    if (piezas.length === 0) {
        contenedor.innerHTML = '<div class="loading">No hay piezas en esta categoría.</div>';
        return;
    }

    piezas.forEach(pieza => {
        const hayStock = pieza.cantidad_stock > 0;
        const badgeStock = hayStock 
            ? `<span class="stock-badge in-stock">EN STOCK (${pieza.cantidad_stock} ud.)</span>`
            : `<span class="stock-badge out-of-stock">SIN STOCK</span>`;

        const card = document.createElement('div');
        card.className = 'pieza-card';

        card.innerHTML = `
            <div class="img-container">
                <img src="${pieza.imagen_url}" alt="${pieza.nombre}" onerror="this.src='https://via.placeholder.com/150?text=Lego+Piece'">
            </div>
            <div class="pieza-info">
                <div class="pieza-nombre">${pieza.nombre}</div>
                <div class="pieza-num">Nº de Pieza Rebrickable: <strong>${pieza.part_num}</strong></div>
                <div class="pieza-detalles">
                    <div class="detalle-item">
                        <span class="detalle-label">Color:</span>
                        <span>${pieza.color || 'Varios'}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Diseño / Imprenta:</span>
                        <span>${pieza.imprenta_diseno || 'Sin estampado'}</span>
                    </div>
                    <div class="detalle-item" style="margin-top: 12px;">
                        <span class="detalle-label">Disponibilidad:</span>
                        ${badgeStock}
                    </div>
                </div>
            </div>
        `;

        contenedor.appendChild(card);
    });
}
