let tablaUsuariosDT; 

$(document).ready(function() {
    const nombreAdmin = localStorage.getItem("nombre") || "Admin Deluxury";
    $("#admin-name").text(nombreAdmin);

    
    const usuariosPredeterminados = [
        { id: "1001", nombre: "Administrador Principal", email: "admin@deluxury.com", rol: "Administrador" },
        { id: "1002", nombre: "Cliente Premium", email: "cliente@deluxury.com", rol: "Cliente" }
    ];

    const inventarioPredeterminado = [
        { producto: "Pantalón Oversize", stock: 12, estado: "Disponible" },
        { producto: "Hoodie Premium", stock: 5, estado: "Bajo Stock" },
        { producto: "Gorra Deluxe", stock: 18, estado: "Disponible" },
        { producto: "Chaqueta Denim", stock: 7, estado: "Disponible" },
        { producto: "Gafas de Sol", stock: 0, estado: "Agotado" }
    ];

    const ventasPredeterminadas = [
        { id: "FAC-1001", fecha: "2026-06-25 14:32", cliente: "Juan Pérez", items: "2x Hoodie Premium", vendedor: "Ronaldo", total: 640000 },
        { id: "FAC-1002", fecha: "2026-06-24 11:15", cliente: "María Gómez", items: "1x Gorra Deluxe", vendedor: "Messi", total: 90000 }
    ];

    const formatoMoneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });


    function cargarUsuarios() {
        const usuarios = JSON.parse(localStorage.getItem("usuarios_sistema")) || usuariosPredeterminados;
        localStorage.setItem("usuarios_sistema", JSON.stringify(usuarios));

        let tablaCuerpo = $("#tabla-usuarios-cuerpo");
        tablaCuerpo.empty(); 

        usuarios.forEach(user => {
            let badgeClase = "bg-secondary";
            if (user.rol === "Administrador") badgeClase = "bg-danger";
            if (user.rol === "Cliente") badgeClase = "bg-info text-dark";

            let fila = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.nombre}</td>
                    <td>${user.email}</td>
                    <td><span class="badge ${badgeClase}">${user.rol}</span></td>
                    <td><button class="btn btn-sm btn-outline-secondary"><i class="fa-solid fa-pen"></i></button></td>
                </tr>
            `;
            tablaCuerpo.append(fila);
        });
    }

    function cargarInventario() {
        const inventario = JSON.parse(localStorage.getItem("inventario")) || inventarioPredeterminado;
        localStorage.setItem("inventario", JSON.stringify(inventario));

        let tablaCuerpo = $("#tabla-inventario-cuerpo");
        tablaCuerpo.empty(); 

        inventario.forEach((item, index) => {
            let badgeClase = "bg-success";
            if (item.stock > 0 && item.stock <= 5) {
                badgeClase = "bg-warning text-dark";
                item.estado = "Bajo Stock";
            } else if (item.stock == 0) {
                badgeClase = "bg-danger";
                item.estado = "Agotado";
            } else {
                item.estado = "Disponible";
            }

            let fila = `
                <tr>
                    <td class="fw-semibold">${item.producto}</td>
                    <td>${item.stock}</td>
                    <td><span class="badge ${badgeClase}">${item.estado}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-warning btn-editar-stock" data-index="${index}">
                            <i class="fa-solid fa-pen-to-square"></i> Stock
                        </button>
                    </td>
                </tr>
            `;
            tablaCuerpo.append(fila);
        });
    }

    function cargarVentas() {
        const ventas = JSON.parse(localStorage.getItem("registro_ventas")) || ventasPredeterminadas;
        localStorage.setItem("registro_ventas", JSON.stringify(ventas));

        let tablaCuerpo = $("#tabla-ventas-cuerpo");
        tablaCuerpo.empty(); 

        ventas.forEach(venta => {
            let fila = `
                <tr>
                    <td class="fw-bold text-secondary">${venta.id}</td>
                    <td><small class="text-muted">${venta.fecha}</small></td>
                    <td><span class="fw-semibold text-dark">${venta.cliente}</span></td>
                    <td>${venta.items}</td>
                    <td><span class="badge bg-secondary">${venta.vendedor || 'Sistema'}</span></td>
                    <td class="fw-bold text-success">${formatoMoneda.format(venta.total)}</td>
                </tr>
            `;
            tablaCuerpo.append(fila);
        });
    }

    
    cargarUsuarios();
    cargarInventario();
    cargarVentas();

    $('.tab-section').hide();
    $('.tab-section.active-tab').show();

    
    tablaUsuariosDT = $('#tablaUsuario').DataTable({
        language: {
            search: "Buscar miembro:",
            lengthMenu: "Mostrar _MENU_ registros",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            zeroRecords: "No se encontraron resultados",
            paginate: { next: "Siguiente", previous: "Anterior" }
        }
    });

   
    $("#modalUsuario form").on("submit", function(e) {
        e.preventDefault();
        const inputs = $(this).find('input');
        const selectRol = $(this).find('select');

        const id = inputs.eq(0).val();
        const nombre = inputs.eq(1).val();
        const email = inputs.eq(2).val();
        const rol = selectRol.val();

        let badgeClase = "bg-secondary";
        if (rol === "Administrador") badgeClase = "bg-danger";
        if (rol === "Vendedor") badgeClase = "bg-warning text-dark";

        let usuariosActuales = JSON.parse(localStorage.getItem("usuarios_sistema")) || usuariosPredeterminados;
        usuariosActuales.push({ id: id, nombre: nombre, email: email, rol: rol });
        localStorage.setItem("usuarios_sistema", JSON.stringify(usuariosActuales));

        tablaUsuariosDT.row.add([id, nombre, email, `<span class="badge ${badgeClase}">${rol}</span>`, `<button class="btn btn-sm btn-outline-secondary"><i class="fa-solid fa-pen"></i></button>`]).draw(false);

        this.reset();
        bootstrap.Modal.getInstance(document.getElementById('modalUsuario')).hide();
    });

    
    $("#form-inventario").on("submit", function(e) {
        e.preventDefault();
        const inputs = $(this).find('input');
        const nombre = inputs.eq(0).val();
        const stock = parseInt(inputs.eq(1).val());

        let inventario = JSON.parse(localStorage.getItem("inventario")) || inventarioPredeterminado;
        inventario.push({ producto: nombre, stock: stock, estado: "Disponible" });
        localStorage.setItem("inventario", JSON.stringify(inventario));

        cargarInventario();
        this.reset();
        bootstrap.Modal.getInstance(document.getElementById('modalInventario')).hide();
        alert("¡Producto agregado con éxito!");
    });

    
    $(document).on("click", ".btn-editar-stock", function() {
        const index = $(this).data("index");
        let inventario = JSON.parse(localStorage.getItem("inventario")) || inventarioPredeterminado;
        
        const nuevoStock = prompt(`Modificar stock para: "${inventario[index].producto}"`, inventario[index].stock);
        
        if (nuevoStock !== null && nuevoStock.trim() !== "" && !isNaN(nuevoStock)) {
            inventario[index].stock = parseInt(nuevoStock);
            localStorage.setItem("inventario", JSON.stringify(inventario));
            cargarInventario();
        }
    });


    $("#form-venta").on("submit", function(e) {
        e.preventDefault();
        const inputs = $(this).find('input');
        
        const cliente = inputs.eq(0).val();
        const items = inputs.eq(1).val();
        const vendedor = inputs.eq(2).val();
        const total = parseInt(inputs.eq(3).val());

        const idFactura = "FAC-" + Math.floor(1000 + Math.random() * 9000);
        
        
        const ahora = new Date();
        const fechaStr = ahora.getFullYear() + "-" + String(ahora.getMonth() + 1).padStart(2, '0') + "-" + String(ahora.getDate()).padStart(2, '0') + " " + String(ahora.getHours()).padStart(2, '0') + ":" + String(ahora.getMinutes()).padStart(2, '0');

        let ventas = JSON.parse(localStorage.getItem("registro_ventas")) || ventasPredeterminadas;
        ventas.unshift({ id: idFactura, fecha: fechaStr, cliente: cliente, items: items, vendedor: vendedor, total: total });
        localStorage.setItem("registro_ventas", JSON.stringify(ventas));

        cargarVentas();
        this.reset();
        bootstrap.Modal.getInstance(document.getElementById('modalVenta')).hide();
        alert("¡Venta registrada correctamente!");
    });

  
    $('.menu-link').on('click', function(e) {
        const targetSection = $(this).attr('data-target');
        if (!targetSection) return;
        e.preventDefault();

        $('.menu-link').removeClass('active');
        $(this).addClass('active');

        $('.tab-section').hide().removeClass('active-tab');
        $('#' + targetSection).fadeIn(150).addClass('active-tab');

        $('#dinamic-title').text($(this).text().trim());

        if (targetSection === "sec-inventario") cargarInventario();
        if (targetSection === "sec-ventas") cargarVentas();
    });
});