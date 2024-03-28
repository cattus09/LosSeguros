function mostrarTickets() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const tickets = JSON.parse(this.responseText);
            const table = document.createElement("table");
            const header = table.createTHead();
            const row = header.insertRow(0);
            const headers = ["Nombre", "Descripción", "Estado", "Fecha de Creación"];
            headers.forEach(headerText => {
                const th = document.createElement("th");
                const text = document.createTextNode(headerText);
                th.appendChild(text);
                row.appendChild(th);
            });
            const tbody = table.createTBody();
            tickets.forEach(ticket => {
                const tr = tbody.insertRow();
                const data = [ticket.nombre, ticket.descripcion];
                data.forEach(cellData => {
                    const td = document.createElement("td");
                    const text = document.createTextNode(cellData);
                    td.appendChild(text);
                    tr.appendChild(td);
                });
                const tdEstado = document.createElement("td");
                const selectEstado = document.createElement("select");
                selectEstado.setAttribute("id", "estado_" + ticket.id); // Asignar un ID único para el select
                const estados = ["Nuevo", "En revisión", "Mitigado"];
                estados.forEach(estado => {
                    const option = document.createElement("option");
                    option.setAttribute("value", estado);
                    option.text = estado;
                    if (estado === ticket.estado) {
                        option.setAttribute("selected", "selected");
                    }
                    selectEstado.appendChild(option);
                });
                selectEstado.addEventListener("change", function() {
                    cambiarEstado(ticket.id, this.value); // Llamar a la función cambiarEstado cuando cambie el valor del select
                });
                tdEstado.appendChild(selectEstado);
                tr.appendChild(tdEstado);
                const tdFecha = document.createElement("td");
                const fecha = new Date(ticket.fechaCreacion);
                const fechaFormateada = fecha.toLocaleString();
                const fechaText = document.createTextNode(fechaFormateada);
                tdFecha.appendChild(fechaText);
                tr.appendChild(tdFecha);
            });
            document.getElementById("ticketsTable").appendChild(table);
        }
    };
    xhttp.open("GET", "/obtenerTickets", true);
    xhttp.send();
}

// Función para cambiar el estado del ticket
function cambiarEstado(id, nuevoEstado) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/cambiarEstado?id=" + id + "&estado=" + nuevoEstado, true);
    xhttp.send();
}

// Llamar a mostrarTickets() cuando la página se carga por primera vez
window.onload = function() {
    mostrarTickets();
};