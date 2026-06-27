let tablaDT;

$(document).ready(function() {

    const nombreCliente = localStorage.getItem("nombre") || "Cliente Premium";
    document.getElementById("cliente-name").innerText = nombreCliente;
    document.getElementById("input-nombre").value = nombreCliente;

    renderizerFavoritosUI();
    renderizarComprasUI();
    inicializarDataTables();

    const btnCompras = document.getElementById("btn-compras");
    const btnCatalogo = document.getElementById("btn-catalogo");
    const btnFavoritos = document.getElementById("btn-favoritos");
    const btnPerfil = document.getElementById("btn-perfil");

    const seccionCompras = document.getElementById("seccion-compras");
    const seccionCatalogo = document.getElementById("seccion-catalogo");
    const seccionFavoritos = document.getElementById("seccion-favoritos");
    const seccionPerfil = document.getElementById("seccion-perfil");
    
    const topbarTitle = document.getElementById("dashboard-title");
    const topbarSubtitle = document.getElementById("dashboard-subtitle");

    function limpiarMenuActivo() {
        btnCompras.classList.remove("active");
        btnCatalogo.classList.remove("active");
        btnFavoritos.classList.remove("active");
        btnPerfil.classList.remove("active");
    }

    function ocultarSecciones() {
        seccionCompras.style.display = "none";
        seccionCatalogo.style.display = "none";
        seccionFavoritos.style.display = "none";
        seccionPerfil.style.display = "none";
    }

    btnCompras.addEventListener("click", function(e) {
        e.preventDefault(); ocultarSecciones(); limpiarMenuActivo();
        seccionCompras.style.display = "block"; btnCompras.classList.add("active");
        topbarTitle.innerText = "Mi Panel Premium";
        topbarSubtitle.innerText = "Bienvenido a tu espacio exclusivo en Deluxury Clothes.";
    });

    btnCatalogo.addEventListener("click", function(e) {
        e.preventDefault(); ocultarSecciones(); limpiarMenuActivo();
        seccionCatalogo.style.display = "block"; btnCatalogo.classList.add("active");
        topbarTitle.innerText = "Catálogo de Prendas";
        topbarSubtitle.innerText = "Explora y adquiere tus artículos favoritos de la colección oficial.";
    });

    btnFavoritos.addEventListener("click", function(e) {
        e.preventDefault(); ocultarSecciones(); limpiarMenuActivo();
        seccionFavoritos.style.display = "block"; btnFavoritos.classList.add("active");
        topbarTitle.innerText = "Mis Favoritos";
        topbarSubtitle.innerText = "Gestiona las prendas que tienes bajo la mira.";
        renderizerFavoritosUI(); 
    });

    btnPerfil.addEventListener("click", function(e) {
        e.preventDefault(); ocultarSecciones(); limpiarMenuActivo();
        seccionPerfil.style.display = "block"; btnPerfil.classList.add("active");
        topbarTitle.innerText = "Mi Cuenta";
        topbarSubtitle.innerText = "Modifica tus credenciales y preferencias de cliente.";
    });

    
    const botonesComprar = document.querySelectorAll('.btn-comprar');

    for (let i = 0; i < botonesComprar.length; i++) {
        botonesComprar[i].addEventListener('click', function() {
            
            const nombreProducto = this.getAttribute('data-nombre');
            const precioProducto = parseInt(this.getAttribute('data-precio'));

            const fechaActual = new Date().toISOString().split('T')[0];
            const idFactura = `FAC-${1000 + Math.floor(Math.random() * 9000)}`;

            const precioFormateado = new Intl.NumberFormat('es-CO', {
                style: 'currency', currency: 'COP', minimumFractionDigits: 0
            }).format(precioProducto);

            let comprasExistentes = JSON.parse(localStorage.getItem("mis_compras")) || [];
            const nuevaCompra = {
                id: idFactura,
                fecha: fechaActual,
                producto: `1x ${nombreProducto}`,
                total: precioFormateado,
                estado: "Procesando"
            };
            comprasExistentes.push(nuevaCompra);
            localStorage.setItem("mis_compras", JSON.stringify(comprasExistentes));

            
            tablaDT.row.add([
                nuevaCompra.id, nuevaCompra.fecha, nuevaCompra.producto, nuevaCompra.total,
                `<span class="badge bg-warning text-dark">${nuevaCompra.estado}</span>`
            ]).draw(false);

            document.getElementById("contador-pedidos").innerText = comprasExistentes.length;
            alert(`¡Compra exitosa! Has adquirido: ${nombreProducto}.`);
            btnCompras.click();
        });
    }

    
    document.getElementById("form-perfil").addEventListener("submit", function(e) {
        e.preventDefault();
        const nuevoNombre = document.getElementById("input-nombre").value;
        localStorage.setItem("nombre", nuevoNombre);
        document.getElementById("cliente-name").innerText = nuevoNombre;
        alert("¡Perfil actualizado con éxito!");
    });
});


function renderizerFavoritosUI() {
    const contenedor = document.getElementById("contenedor-favoritos");
    
    
    const favoritosSimulados = [
        { nombre: "Hoodie True Religom", precio: "$250.000", img: "./img/Hoodie" },
        { nombre: "Jeans Street Wear True Religion", precio: "$450.000", img: "./img/Pantalon Oversize.jpg" }
    ];

    let html = "";
    favoritosSimulados.forEach(item => {
        html += `
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm">
                    <img src="${item.img}" class="card-img-top" style="height: 180px; object-fit: cover;">
                    <div class="card-body p-3">
                        <h6 class="fw-bold mb-1">${item.nombre}</h6>
                        <p class="text-dark fw-bold mb-2">${item.precio}</p>
                        <button class="btn btn-outline-danger btn-sm w-100"><i class="fa-solid fa-trash"></i> Quitar</button>
                    </div>
                </div>
            </div>
        `;
    });
    contenedor.innerHTML = html;
}

function renderizarComprasUI() {
    const compras = JSON.parse(localStorage.getItem("mis_compras")) || [];
    const tbody = document.getElementById("lista-compras-body");
    document.getElementById("contador-pedidos").innerText = compras.length;

    let html = "";
    compras.forEach(compra => {
        html += `
            <tr>
                <td>${compra.id}</td>
                <td>${compra.fecha}</td>
                <td>${compra.producto}</td>
                <td>${compra.total}</td>
                <td><span class="badge bg-success">${compra.estado}</span></td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function inicializarDataTables() {
    tablaDT = $('#tablaComprasCliente').DataTable({
        language: {
            search: "Filtrar compras:",
            lengthMenu: "Mostrar _MENU_ registros",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            zeroRecords: "No tienes compras registradas aún",
            emptyTable: "No hay datos disponibles",
            paginate: { next: "Siguiente", previous: "Anterior" }
        }
    });
}