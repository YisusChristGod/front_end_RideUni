import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-informacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informacion.html',
  styleUrl: './informacion.css'
})
export class InformacionComponent {

  abrirMapa: boolean = false;

  camiones = [
    {
      placa: 'ABC-123',
      disponible: true,
      conductor: 'Juan Pérez',
      telefono: '6441234567'
    },
    {
      placa: 'DEF-456',
      disponible: false,
      conductor: 'Luis García',
      telefono: '6449876543'
    },
    {
      placa: 'GHI-789',
      disponible: true,
      conductor: 'María López',
      telefono: '6445551234'
    }
  ];

}