import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamionService } from '../../services/Camion';
import { ConductorService } from '../../services/Conductor';
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCamiones();
  }

  cargarCamiones(): void {
    forkJoin({
      camiones: this.camionService.getCamion(),
      conductores: this.conductorService.getConductor()
    }).subscribe({
      next: ({ camiones, conductores }) => {

        const conductoresMap = (conductores as any[]).reduce((map, conductor) => {
          map[conductor.id] = conductor;
          return map;
        }, {} as any);

        this.camiones = (camiones as any[]).map(c => ({
          placa: c.modelo,
          disponible: c.disponibilidad,
          conductor: conductoresMap[c.idConductor]?.nombre || 'Sin asignar',
          telefono: conductoresMap[c.idConductor]?.telefono || 'N/A'
        }));

        this.cdr.detectChanges(); // 
      },
      error: (err) => console.error(err)
    });
  }

}