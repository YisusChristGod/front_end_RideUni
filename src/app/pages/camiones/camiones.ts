import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamionService } from '../../services/Camion';
import { ConductorService } from '../../services/Conductor';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-camiones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camiones.html',
  styleUrl: './camiones.css'
})
export class CamionesComponent implements OnInit {

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
          id: c.id,
          placa: c.modelo,
          disponible: c.disponibilidad,
          conductor: conductoresMap[c.idConductor] || { nombre: 'Sin asignar', telefono: 'N/A' }
        }));

        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  get total() {
    return this.camiones.length;
  }

  get disponibles() {
    return this.camiones.filter(c => c.disponible).length;
  }

  get noDisponibles() {
    return this.camiones.filter(c => !c.disponible).length;
  }

}