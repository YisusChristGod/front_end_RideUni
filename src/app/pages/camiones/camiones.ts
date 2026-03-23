import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camiones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camiones.html',
  styleUrl: './camiones.css'
})
export class CamionesComponent {

  camiones = [
    {
      id: 1,
      placa: 'ABC-123',
      disponible: true,
      conductor: { nombre: 'Juan Pérez', telefono: '555-0101' }
    },
    {
      id: 2,
      placa: 'DEF-456',
      disponible: true,
      conductor: { nombre: 'María González', telefono: '555-0102' }
    },
    {
      id: 3,
      placa: 'GHI-789',
      disponible: false,
      conductor: { nombre: 'Carlos Ramírez', telefono: '555-0103' }
    },
    {
      id: 4,
      placa: 'JKL-012',
      disponible: true,
      conductor: { nombre: 'Ana Martínez', telefono: '555-0104' }
    },
    {
      id: 5,
      placa: 'MNO-345',
      disponible: true,
      conductor: { nombre: 'Luis Torres', telefono: '555-0105' }
    },
    {
      id: 6,
      placa: 'PQR-678',
      disponible: false,
      conductor: { nombre: 'Sofía López', telefono: '555-0106' }
    }
  ];

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