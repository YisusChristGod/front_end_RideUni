import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class ReportesComponent {

  nuevoReporte: string = '';

  reportes = [
    {
      id: 1,
      descripcion: 'El camión ABC-123 no pasó por la parada de Ingeniería',
      fecha: new Date()
    },
    {
      id: 2,
      descripcion: 'Retraso de 20 minutos en la ruta',
      fecha: new Date()
    },
    {
      id: 3,
      descripcion: 'Camión fuera de servicio por mantenimiento',
      fecha: new Date()
    }
  ];

  agregarReporte() {
    if (this.nuevoReporte.trim() === '') return;

    this.reportes.unshift({
      id: this.reportes.length + 1,
      descripcion: this.nuevoReporte,
      fecha: new Date()
    });

    this.nuevoReporte = '';
  }
}