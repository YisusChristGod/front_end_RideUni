import { Component, OnInit } from '@angular/core';
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
    private conductorService: ConductorService
  ) {}

  ngOnInit(): void {
    this.cargarCamiones();
  }

  cargarCamiones(): void {
    console.log('Iniciando carga de camiones...');
    
    forkJoin({
      camiones: this.camionService.getCamion(),
      conductores: this.conductorService.getConductor()
    }).subscribe({
      next: ({ camiones, conductores }) => {
        console.log('Camiones recibidos:', camiones);
        console.log('Conductores recibidos:', conductores);
        
        // Mapear conductores por ID
        const conductoresMap = (conductores as any[]).reduce((map, conductor) => {
          map[conductor.id] = conductor;
          return map;
        }, {});
        
        // Transformar datos al formato esperado
        this.camiones = (camiones as any[]).map(c => ({
          id: c.id,
          placa: c.modelo,
          disponible: c.disponibilidad,
          conductor: conductoresMap[c.idConductor] || { nombre: 'Sin asignar', telefono: 'N/A' }
        }));
        
        console.log('Camiones transformados:', this.camiones);
      },
      error: (error) => {
        console.error('Error:', error);
      }
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