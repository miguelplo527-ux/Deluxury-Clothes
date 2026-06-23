function registrar() {

let nombre = document.getElementById("nombre").value;
let correo = document.getElementById("correo").value;
let password = document.getElementById("password").value;
let rol = document.getElementById("rol").value;

if(nombre === ""){
alert("Ingrese el nombre");
return;
}

if(correo === ""){
alert("Ingrese el correo");
return;
}

if(password === ""){
alert("Ingrese la contraseña");
return;
}

if(rol === ""){
alert("Seleccione un rol");
return;
}

localStorage.setItem("nombre", nombre);
localStorage.setItem("rol", rol);

window.location.href = "index.html";

}