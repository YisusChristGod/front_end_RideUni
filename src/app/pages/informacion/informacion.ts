import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamionService } from '../../services/Camion';
import { ConductorService } from '../../services/Conductor';
import { HorarioService } from '../../services/Horario';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-informacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informacion.html',
  styleUrl: './informacion.css'
})
export class InformacionComponent implements OnInit {

  abrirMapa: boolean = false;
  camiones: any[] = [];

  constructor(
    private camionService: CamionService,
    private conductorService: ConductorService,
    private horarioService: HorarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    forkJoin({
      camiones: this.camionService.getCamion(),
      conductores: this.conductorService.getConductor(),
      horarios: this.horarioService.getHorario()
    }).subscribe({
      next: ({ camiones, conductores, horarios }) => {

        console.log('CAMIONES:', camiones);
        console.log('CONDUCTORES:', conductores);
        console.log('HORARIOS:', horarios);

        const conductoresMap = (conductores as any[]).reduce((map, c) => {
          map[c.id] = c;
          return map;
        }, {} as any);

        const horariosMap = (horarios as any[]).reduce((map, h) => {
          map[h.idCamion] = h; // 🔥 ESTE ES EL CAMBIO CLAVE
          return map;
        }, {} as any);

        this.camiones = (camiones as any[]).map(c => {

          const conductor = conductoresMap[c.idConductor];
          const horario = horariosMap[c.id];

          return {
            placa: c.modelo,
            disponible: c.disponibilidad,

            conductor: conductor ? conductor.nombre : 'Sin asignar',
            telefono: conductor ? conductor.numeroCelular : 'N/A',

            salida: horario ? horario.horaSalida : '00:00',
            llegada: horario ? horario.horaLlegada : '07:25'
          };
        });

        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
}