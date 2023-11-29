import { Component } from '@angular/core';
import { TicketsService } from '../../services/tickets.service';
@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {
  infoSeleccionada = '';
  tickets: any[] = [];
  esProject = false;
  esGroup = false;
  verHoraConMasTrabajo = false;
  verDesperfectoPorZona=false;
  

  constructor(private ticketService: TicketsService) {

   }

  botones=[
    {
      descripcion:"Traer todos",
      operadorUtilizado:"Traer",
      link: "https://tp-ticketera-six.vercel.app/api/tickets",
      resultado: null,
    },
    {
      descripcion:"Traer tickets pendientes",
      operadorUtilizado:"($eq)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/pendientes",
      resultado: null,
    },
    {
      descripcion:"Traer tickets no pendientes",
      operadorUtilizado:"($ne)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/nopendientes",
      resultado: null,
    },
    {
      descripcion:"Tickets con prioridad 'Alta' y el estado en 'pendiente'.",
      operadorUtilizado:"($and - $expr)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/and",
      resultado: null,
    },
    {
      descripcion:"Traer tickets resueltos o de tipo baja",
      operadorUtilizado:"($or)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/or",
      resultado: null,
    },
    {
      descripcion:"Traer tickets que NO son del tipo 'Desperfecto'",
      operadorUtilizado:"($not)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/not",
      resultado: null,
    }  ,
    {
      descripcion:"Encontrar tickets con prioridad Media o Baja",
      operadorUtilizado:"($in)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/in",
      resultado: null,
    }
    ,
    {
      descripcion:"Traer tickets que no tengan como beneficio 'Netflix' NI 'Amazon prime'",
      operadorUtilizado:"($nin)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/nin",
      resultado: null,
    },
    {
  
      descripcion:"Tickets con codigo de empleato mayor a 12.000",
      operadorUtilizado:"($gt)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/gt",
      resultado: null,
    }
    ,
    {
      descripcion:"Tickets no resueltos y código de empleado mayor o igual a 12000",
      operadorUtilizado:"($nor y $gte)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/norGte",
      resultado: null,
    }
    ,
    {
      descripcion:"Encontrar tickets que tengan numero de canales menores a 200",
      operadorUtilizado:"($lt)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/lt",
      resultado: null,
    }
    ,
    {
      descripcion:"Tickets que tengan numero de canales menores o iguales a 213",
      operadorUtilizado:"($lte)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/lte",
      resultado: null,
    }
    ,
    {
      descripcion:"Encontrar tickets con beneficios 'HBO Max', 'Paramount+'",
      operadorUtilizado:"($all)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/all",
      resultado: null,
    }
    ,
    {
      descripcion:"Encontrar tickets cuyos clientes tengan correo",
      operadorUtilizado:"($exists - $lookup - $unwind)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/exists",
      resultado: null,
    }
    ,
    {
      descripcion:"Tickets que contengan la palabra 'alta' en la descripción del problema",
      operadorUtilizado:"($search, $text)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/textsearch",
      resultado: null,
    }
    ,
    {
      descripcion:"Encontrar tickets que tengan una derivacion",
      operadorUtilizado:"($size)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/size",
      resultado: null,
    }
    ,
    {
      descripcion:"tickets Pendientes con Código de Empleado Mayor a 12.000",
      operadorUtilizado:"($match, $project)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/match",
      resultado: null,
    }
   ,
    {
      descripcion:"Encontrar tickets donde el cliente es además empleado.",
      operadorUtilizado:"($lookup)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/lookup",
      resultado: null,
    },
    {
      descripcion:"Tickets cuyas ubicaciones sean alrededor de la UTN Mitre",
      operadorUtilizado:"($geoIntersects)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/geoIntersects",
      resultado: null,
    },
    {
      descripcion:"Tickets cuyas ubicaciones sean en Cordoba",
      operadorUtilizado:"($near)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/near",
      resultado: null,
    },
    {
      descripcion:"Tickets derivados al departamento de cancelaciones y su solucion fue exitosa",
      operadorUtilizado:"($elemMatch)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/elemMatch",
      resultado: null,
    },
    {
      descripcion:"Tickets donde el cliente En Mardel o alrededores.",
      operadorUtilizado:"($geoWithin)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/geoWithin",
      resultado: null,
    }
    ,
    {
      descripcion:"Tickets con desperfecto y la descripcion de lo que ocurre",
      operadorUtilizado:"($eq)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/ticketDesperfecto",
      resultado: null,
    }
    ,
    {
      descripcion:"Ver a que hora hay mas trabajo",
      operadorUtilizado:"($group)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/horas",
      resultado: null,
    }
    ,
    {
      descripcion:"Encontrar la cantidad Total de Beneficios",
      operadorUtilizado:"($unwind, $group)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/unwind",
      resultado: null,
    }
    ,
    {
      descripcion:"que empleado atiende más ticket",
      operadorUtilizado:"($group - $unwind)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/masAtiende",
      resultado: null,
    }
    ,
    {
      descripcion:"En qué zona tenemos más clientes",
      operadorUtilizado:"($group - $limit)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/zonaConMasClientes",
      resultado: null,
    }
    ,
    {
      descripcion:"Ver desperfecto por zona",
      operadorUtilizado:"($group - $match)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/desperfectoPorZona",
      resultado: null,
    }
    ,
    {
      descripcion:"Cantidad de atención hecha por zona,",
      operadorUtilizado:"($group - $sort)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/atencionPorZona",
      resultado: null,
    }
    ,
    {
      descripcion:"Cliente que ha generado mas tickets",
      operadorUtilizado:"($group - $sort - $limit)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/clienteMasTicket",
      resultado: null,
    }
    ,
    {
      descripcion:"Clientes con tickets sin resolver",
      operadorUtilizado:"($group - $sort - $match)",
      link: "https://tp-ticketera-six.vercel.app/api/tickets/clienteTicketSinResolver",
      resultado: null,
    }
  ]

  traerResultado(boton : any){
    if(boton.link=="https://tp-ticketera-six.vercel.app/api/tickets/match")
    {
      this.esProject=true;
    }
    else{
      this.esProject=false;
    }
    if(boton.link=="https://tp-ticketera-six.vercel.app/api/tickets/desperfectoPorZona")
    {
      this.verDesperfectoPorZona=true;
    }
    else{
      this.verDesperfectoPorZona=false;
    }

    if(boton.link=="https://tp-ticketera-six.vercel.app/api/tickets/unwind")
    {
      this.esGroup=true;
    }
    else{
      this.esGroup=false;
    }

    if(boton.link=="https://tp-ticketera-six.vercel.app/api/tickets/horas" || boton.link=="https://tp-ticketera-six.vercel.app/api/tickets/masAtiende"
    || boton.link=="https://tp-ticketera-six.vercel.app/api/tickets/zonaConMasClientes" || boton.link=="https://tp-ticketera-six.vercel.app/api/tickets/atencionPorZona"
    || boton.link=="https://tp-ticketera-six.vercel.app/api/tickets/clienteMasTicket" || boton.link=="https://tp-ticketera-six.vercel.app/api/tickets/clienteTicketSinResolver")
    {
      this.verHoraConMasTrabajo=true;
    }else{
      this.verHoraConMasTrabajo=false;
    }

    this.botones.forEach(boton => {
      boton.resultado = null;
    });

    this.ticketService.getData(boton.link).subscribe((datos : any)=>{
      this.tickets = datos;
    });
    console.log(this.tickets);
  }

  mostrarInfo(info: string) {
    this.infoSeleccionada = info;
  }
}
