package edu.escuelaing.arem.ASE.app.controller;

import static spark.Spark.*;
import java.util.ArrayList;
import java.util.List;
import org.bson.Document;
import com.google.gson.Gson;

import edu.escuelaing.arem.ASE.app.Ticket;
import edu.escuelaing.arem.ASE.app.config.MongoDBConfig;

public class CrearTicketController {

    private static List<Ticket> tickets = new ArrayList<>();

    public static void main(String[] args) {
        port(getPort());
        staticFiles.location("/public");

        get("/ingresarDatos", (req, res) -> {
            res.redirect("index.html");
            return null;
        });

        get("/crearTicket", (req, res) -> {
            String datos = req.queryParams("datos");
            String[] lineas = datos.split("\n");
            for (String linea : lineas) {
                String[] partes = linea.split(":"); // Separar nombre y descripción
                if (partes.length == 2) {
                    String nombre = partes[0].trim(); // Nombre sin espacios al inicio y final
                    String descripcion = partes[1].trim(); // Descripción sin espacios al inicio y final
                    Ticket ticket = new Ticket();
                    ticket.setNombre(nombre);
                    ticket.setDescripcion(descripcion);
                    ticket.setEstado("Nuevo"); // Estado por defecto: Nuevo
                    MongoDBConfig.guardarTicketEnBaseDeDatos(ticket); // Guardar en la base de datos
                    eliminarTicketLocal(ticket); // Eliminar de la lista local de tickets
                }
            }
            res.redirect("index.html");
            return null;
        });

        get("/mostrarTickets", (req, res) -> {
            res.redirect("tickets.html");
            return null;
        });

        get("/obtenerTickets", (req, res) -> {
            List<Document> tickets = MongoDBConfig.obtenerTicketsDeBaseDeDatos();
            Gson gson = new Gson();
            return gson.toJson(tickets); // Convertir la lista de tickets a JSON y enviarla como respuesta
        });

        get("/cambiarEstado", (req, res) -> {
            String id = req.queryParams("id");
            String nuevoEstado = req.queryParams("estado");
            MongoDBConfig.actualizarEstadoDelTicket(id, nuevoEstado);
            return null;
        });

    }

    /**
     * Elimina un ticket de la lista local de tickets.
     * @param ticket el ticket a eliminar
     */
    public static void eliminarTicketLocal(Ticket ticket) {
        tickets.removeIf(t -> t.getId() == ticket.getId());
    }

    private static int getPort() {
        if (System.getenv("PORT") != null) {
            return Integer.parseInt(System.getenv("PORT"));
        }
        return 4567;
    }
}