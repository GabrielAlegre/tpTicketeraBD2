const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  detalleTicket: {
    fecha: Date, 
    hora: String, 
    empleadoResponsableQueAtendioElTicket: {
      nombre: String,
      codigoEmpleado: Number,
      areaDelEmpleado: String,
      loDerivaAlAreaDe: String
    },
    tipoDeTicket: String,
    detalleDelProblema: {
      descripcion: String,
      prioridad: String
    }
  },
  estado: String,
  Derivaciones: [
    {
      departamento: String,
      EmpleadoAsignado: {
        nombre: String,
        codigoEmpleado: Number
      },
      solucion: {
        descripcion: String,
        exito: Boolean
      }
    }
  ],
  clienteInfo: {
    nombre: String,
    plan: {
      planNombre: String,
      canales: [Number],
      beneficios: [String]
    },
    direccion: String,
    telefonos: [String],
    correos: [String],
    ubicacion: {
      localidad: {
        codigoPostal: String,
        descripcion: String
      },
      coordenadas: {
        latitud: Number,
        longitud: Number
      }
    }
  },
  esEmpleado: Boolean
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;