function loginUsuario(event) {
   
    event.preventDefault();
    
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
     
    
    if (email === "" || password === "") {
        alert("Campos Vacíos: Por favor complete los campos");
        return; 
    }

    
    if (email === 'admin@deluxury.com' && password === '12345') {
        localStorage.setItem("nombre", "Administrador Principal");
        localStorage.setItem("rol", "Administrador");
        alert("¡Acceso concedido como Administrador!");
        window.location.href = "dashboard.html"; 
        return; 
    } 
    
    
    else if (email === 'vendedor@deluxury.com' && password === '12345') {
        localStorage.setItem("nombre", "Asesor de Ventas");
        localStorage.setItem("rol", "Vendedor");
        alert("¡Acceso concedido como Personal de Ventas!");
        window.location.href = "index.html"; 
        return; 
    }
    
    
    else if (email === 'cliente@deluxury.com' && password === '12345') {
        localStorage.setItem("nombre", "Cliente Premium");
        localStorage.setItem("rol", "Cliente");
        alert("¡Bienvenido a Deluxury Clothes!");
        window.location.href = "index.html";
        return; // Detiene la función
    }
    
    
    else {
        alert("Error: Correo o contraseña incorrectos. Inténtelo nuevamente.");
        
    }
}
function registrar() {
    
    const rol = document.getElementById('rol').value;
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();

    
    if (rol === "" || nombre === "" || correo === "" || password === "") {
        alert("Por favor, complete todos los campos para registrarse.");
        return; 
    }

   
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("rol", rol);
    localStorage.setItem("correo", correo);

    
    alert(`¡Cuenta creada con éxito!\nBienvenido, ${nombre} (${rol}).`);

    
    if (rol === "Administrador") {
        window.location.href = "admin/dashboard.html"; 
    } else if (rol === "Vendedor") {
        window.location.href = "ventas.html";
    } else {
        window.location.href = "index.html"; 
    }
}