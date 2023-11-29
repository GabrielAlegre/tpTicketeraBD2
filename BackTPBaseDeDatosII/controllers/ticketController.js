const Ticket = require('../models/ticketModel');

//GET - TRAER TODOS LOS TICKETS
exports.traerTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET - TRAER TICKETS PENDIENTES ($eq)
exports.traerTicketsPendientes = async (req, res) => {
  try {
    const ticketsPendientes = await Ticket.find({ estado: { $eq: "pendiente" } });
    res.status(200).json(ticketsPendientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Tickets con desperfecto y la descripcion
exports.traerTicketsDesperfecto = async (req, res) => {
  try {
    const ticketsDesperfecto = await Ticket.find({ 'detalleTicket.tipoDeTicket': { $eq: 'desperfecto' } });
    res.status(200).json(ticketsDesperfecto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET - TRAER TICKETS NO PENDIENTES ($ne)
exports.traerTicketsNoPendientes = async (req, res) => {
  try {
    const ticketsNoPendientes = await Ticket.find({ estado: { $ne: "pendiente" } });
    res.status(200).json(ticketsNoPendientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET - TRAER TICKETS PENDIENTES DE TIPO ALTA ($and - $expr)
exports.traerTicketsPendientesYTipoEspecifico = async (req, res) => {
  try {
    
    const ticketsPrioridadAlta = await Ticket.find({
      $expr: {
        $and: [
          { $eq: ['$detalleTicket.detalleDelProblema.prioridad', 'Alta'] },
          { $eq: ['$estado', 'pendiente'] }
        ]
      }
    });
    res.status(200).json(ticketsPrioridadAlta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET - TRAER TICKETS RESUELTOS O DE TIPO BAJA ($or)
exports.traerTicketsResueltosOTipoEspecifico = async (req, res) => {
  try {
    const ticketsResueltosOTipoEspecifico = await Ticket.find({
      $or: [
        { estado: "resuelto" },
        { "detalleTicket.tipoDeTicket": "dar de baja" }
      ]
    });

    res.status(200).json(ticketsResueltosOTipoEspecifico);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET - TRAER TICKETS CON CÓDIGO DE EMPLEADO MAYOR A UN VALOR DETERMINADO ($gt)
exports.traerTicketsCodigoEmpleadoMayor = async (req, res) => {
  try {
    const codigoEmpleadoLimite = 12000;

    const ticketsCodigoEmpleadoMayor = await Ticket.find({
      "detalleTicket.empleadoResponsableQueAtendioElTicket.codigoEmpleado": { $gt: codigoEmpleadoLimite }
    });
    res.status(200).json(ticketsCodigoEmpleadoMayor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//GET - Encontrar tickets que no estén resueltos ni tengan un código de empleado mayor o igual a 12000 ($nor y $gte)
exports.traerTicketsNoResueltosNiCodigoEmpleadoMayor = async (req, res) => {
  try {
    const codigoEmpleadoLimite = 12000;
    const ticketsNoResueltosNiCodigoEmpleadoMayor = await Ticket.find({
      $nor: [
        { estado: "resuelto" },
        { "detalleTicket.empleadoResponsableQueAtendioElTicket.codigoEmpleado": { $gte: codigoEmpleadoLimite } }
      ]
    });
    res.status(200).json(ticketsNoResueltosNiCodigoEmpleadoMayor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


//GET - Encontrar tickets que tengan numero de canales menores a 200 ($lt)
exports.traerTicketsNumeroPlanMenoresDocientos = async (req, res) => {
  try {
    const cantidadMaximaCanales = 200;

    const ticketsConPlanMenorCanales = await Ticket.find({
      "clienteInfo.plan.canales": { $lt: cantidadMaximaCanales }
    });

    res.status(200).json(ticketsConPlanMenorCanales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//GET - Encontrar tickets que tengan numero de canales menores o iguales a 213 ($lte)
exports.traerTicketsNumeroPlanMenoresIgual = async (req, res) => {
  try {
    const cantidadMaximaCanales = 213;

    const ticketsConPlanMenorCanales = await Ticket.find({
      "clienteInfo.plan.canales": { $lte: cantidadMaximaCanales }
    });

    res.status(200).json(ticketsConPlanMenorCanales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//GET - Encontrar tickets con beneficios "HBO Max", "Paramount+" ($all)
exports.traerTicketsConTodosBeneficios = async (req, res) => {
  try {
    const beneficiosRequeridos = ["HBO Max", "Paramount+"];

    const ticketsConTodosBeneficios = await Ticket.find({
      "clienteInfo.plan.beneficios": { $all: beneficiosRequeridos }
    });

    res.status(200).json(ticketsConTodosBeneficios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//GET - Encontrar tickets cuyos clientes tengan correo ($exists)
exports.traerTicketsConCorreos = async (req, res) => {
  try {
    const ticketsConCorreos = await Ticket.aggregate([
      {
        $lookup: {
          from: "clientes",
          localField: "clienteInfo.dni",
          foreignField: "dni",
          as: "clienteInfoExtendido"
        }
      },
      {
        $unwind: "$clienteInfoExtendido"
      },
      {
        $match: {
          "clienteInfoExtendido.correos": { $exists: true, $ne: [] }
        }
      }
    ]);

    res.status(200).json(ticketsConCorreos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


//GET - Encontrar tickets que contengan la palabra "alta" en la descripción del problema ($search, $text)
exports.traerTicketsPorTexto = async (req, res) => {
  try {
    const palabraBusqueda = "alta";

    const ticketsPorTexto = await Ticket.find({
      $text: { $search: palabraBusqueda }
    });

    res.status(200).json(ticketsPorTexto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//GET - Encontrar tickets que tengan una derivacion ($size)
exports.traerTicketsConNumeroDerivaciones = async (req, res) => {
  try {
    const cantidadDerivacionesBuscada = 1;

    const ticketsConNumeroDerivaciones = await Ticket.find({
      Derivaciones: { $size: cantidadDerivacionesBuscada }
    });

    res.status(200).json(ticketsConNumeroDerivaciones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//GET - Encontrar la cantidad Total de Beneficios ($unwind, $group)
exports.obtenerTotalBeneficios = async (req, res) => {
  try {
    const totalBeneficios = await Ticket.aggregate([
      { $unwind: "$clienteInfo.plan.beneficios" },
      { $group: { _id: null, total: { $sum: 1 } } }
    ]);

    res.status(200).json(totalBeneficios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// tickets Pendientes con Código de Empleado Mayor a un Valor Específico ($match, $project)
exports.traerTicketsPendientesConEmpleadoMayor = async (req, res) => {
  try {
    const codigoEmpleadoLimite = 12000;

    const ticketsPendientesConEmpleadoMayor = await Ticket.aggregate([
      {
        $match: {
          estado: "pendiente",
          "detalleTicket.empleadoResponsableQueAtendioElTicket.codigoEmpleado": { $gt: codigoEmpleadoLimite }
        }
      },
      {
        $project: {
          _id: 1,
          tipoDeTicket: "$detalleTicket.tipoDeTicket",
          clienteNombre: "$clienteInfo.nombre",
          estado: 1,
          descripcionProblema: "$detalleTicket.detalleDelProblema.descripcion",
          codigoEmpleadoResponsable: "$detalleTicket.empleadoResponsableQueAtendioElTicket.codigoEmpleado",
          nombreEmpleadoResponsable: "$detalleTicket.empleadoResponsableQueAtendioElTicket.nombre"
        }
      }
    ]);

    res.status(200).json(ticketsPendientesConEmpleadoMayor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.traerTicketsConClientesEmpleados = async (req, res) => {
  try {
    const ticketsConClientesEmpleados = await Ticket.aggregate([
      {
        $lookup: {
          from: "clientes",
          localField: "clienteInfo.dni",
          foreignField: "dni",
          as: "clienteInfoExtendido"
        }
      },
      {
        $unwind: "$clienteInfoExtendido"
      },
      {
        $match: {
          "clienteInfoExtendido.esEmpleado": true
        }
      }
    ]);

    res.status(200).json(ticketsConClientesEmpleados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.traerTicketsGeoIntersect = async (req, res) => {
  try {
    const regionEspecifica = {
      type: "Polygon",
      coordinates: [
        [
          [-58.4, -34.7],
          [-58.4, -34.6],
          [-58.2, -34.6],
          [-58.2, -34.7],
          [-58.4, -34.7]
        ]
      ]
    };

    const ticketsIntersectanRegion = await Ticket.find({
      "clienteInfo.ubicacion.coordinates": {
        $geoIntersects: {
          $geometry: regionEspecifica
        }
      }
    });

    res.status(200).json(ticketsIntersectanRegion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//Buscar tickets que tengan una derivacion al departamento de cancelaciones y la solucion fue exitosa
exports.traerTicketsDepCancelacionesSolucionExitosa = async (req, res) => {
  try {
    const ticketsConDerivacionExitosa = await Ticket.find({
      Derivaciones: {
        $elemMatch: {
          departamento: "Departamento de Cancelaciones",
          "solucion.exito": true
        }
      }
    });

    res.status(200).json(ticketsConDerivacionExitosa);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Buscar los tickets cuyas ubicaciones estén dentro de un radio específico alrededor de Mar del Plata
exports.obtenerTicketsAlrededorDeMardel = async (req, res) => {
  try {
    const coordenadasGeoWithinMardel = [-57.559494950533775, -38.00772570972944];//mardel
    const radioEnKilometros = 10;

    const ticketsEnAreaMardel = await Ticket.find({
      "clienteInfo.ubicacion.coordinates": {
        $geoWithin: {
          $centerSphere: [coordenadasGeoWithinMardel, radioEnKilometros / 6371], // radianes
        },
      },
    });

    res.status(200).json(ticketsEnAreaMardel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET - TRAER TICKETS QUE NO SON DE TIPO "desperfecto"
exports.traerTicketsNoDesperfecto = async (req, res) => {
  try {
    const tipoExcluido = "desperfecto";
    const ticketsNoDesperfecto = await Ticket.find({
      "detalleTicket.tipoDeTicket": { $not: { $eq: tipoExcluido } }
    });
    res.status(200).json(ticketsNoDesperfecto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// GET - TRAER TICKETS SIN BENEFICIO "Netflix" NI "Amazon prime"
exports.traerTicketsSinBeneficiosEspecificos = async (req, res) => {
  try {
    const beneficiosExcluidos = ["Netflix", "Amazon prime"];
    const ticketsSinBeneficiosEspecificos = await Ticket.find({
      "clienteInfo.plan.beneficios": { $nin: beneficiosExcluidos }
    });
    res.status(200).json(ticketsSinBeneficiosEspecificos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// GET - TRAER TICKETS CON PRIORIDAD Media O Baja
exports.traerTicketsPrioridadAltaOMedia = async (req, res) => {
  try {
    const prioridades = ["Media", "Baja"];
    const ticketsPrioridadAltaOMedia = await Ticket.find({
      "detalleTicket.detalleDelProblema.prioridad": { $in: prioridades }
    });
    res.status(200).json(ticketsPrioridadAltaOMedia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// GET - a que hora hay más trabajo,
exports.horasConMayorCantidadDeTickets = async (req, res) => {
  try {
    const result = await Ticket.aggregate([
      {
        $group: {
          _id: "$detalleTicket.hora",
          totalTickets: { $sum: 1 }
        }
      },
      { $sort: { totalTickets: -1 } },
      { $limit: 1 }
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET - OBTENER EMPLEADO QUE ATIENDE MÁS TICKETS
exports.empleadoQueAtiendeMasTickets = async (req, res) => {
  try {
    const result = await Ticket.aggregate([
      { $unwind: "$detalleTicket.empleadoResponsableQueAtendioElTicket" },
      {
        $group: {
          _id: "$detalleTicket.empleadoResponsableQueAtendioElTicket.nombre",
          totalTickets: { $sum: 1 }
        }
      },
      { $sort: { totalTickets: -1 } },
      { $limit: 1 }
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Tickets cuyas ubicaciones sean en Cordoba
exports.traerTicketsNear = async (req, res) => {
  try {
    const ticketsMardel = await Ticket.find({
      "clienteInfo.ubicacion.coordinates": {
        $near: {
          $geometry: { type: "Point", coordinates: [-64.1905152695531, -31.41645443141944] },
          $maxDistance: 1000
        }
      }
    });
    res.status(200).json(ticketsMardel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET - ZONA CON MÁS CLIENTES
exports.zonaConMasClientes = async (req, res) => {
  try {
    const result = await Ticket.aggregate([
      {
        $group: {
          _id: "$clienteInfo.ubicacion.coordinates",
          totalTickets: { $sum: 1 }
        }
      },
      { $sort: { totalTickets: -1 } },
      { $limit: 1 }
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET - DESPERFECTOS POR ZONA
exports.desperfectosPorZona = async (req, res) => {
  try {
    const result = await Ticket.aggregate([
      {
        $match: {
          'detalleTicket.tipoDeTicket': 'desperfecto', // Filtra por tipo de ticket 'desperfecto'
        }
      },
      {
        $group: {
          _id: {
            localidad: '$clienteInfo.ubicacion.localidad.descripcion',
            tipoDeTicket: '$detalleTicket.tipoDeTicket',
          },
          totalDesperfectos: { $sum: 1 },
        }
      },
      { $sort: { '_id.localidad': 1 } }, // Ordena por localidad
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET - CANTIDAD DE ATENCIÓN POR ZONA
exports.atencionPorZona = async (req, res) => {
  try {
    const result = await Ticket.aggregate([
      {
        $group: {
          _id: '$clienteInfo.ubicacion.localidad.descripcion',
          totalTickets: { $sum: 1 }
        }
      },
      {
        $sort: { totalTickets: -1 }
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET - CLIENTE QUE HA GENERADO MÁS TICKETS
exports.clienteConMasTickets = async (req, res) => {
  try {
    const result = await Ticket.aggregate([
      {
        $group: {
          _id: '$clienteInfo.nombre',
          totalTickets: { $sum: 1 }
        }
      },
      {
        $sort: { totalTickets: -1 } // Ordenp por la cantidad de tickets generados en orden descendente
      },
      { $limit: 1 } // Limito el resultado al cliente que ha generado más tickets
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET - CLIENTES CON TICKETS SIN RESOLVER
exports.clientesConTicketsSinResolver = async (req, res) => {
  try {
    const result = await Ticket.aggregate([
      {
        $match: { estado: "sin resolver" } // Filtro solo los tickets sin resolver
      },
      {
        $group: {
          _id: '$clienteInfo.nombre',
          totalTickets: { $sum: 1 }
        }
      },
      {
        $sort: { totalTickets: -1 } // Ordeno por la cantidad de tickets sin resolver en orden descendente
      }
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
