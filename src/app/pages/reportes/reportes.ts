import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css']
})
export class ReportesComponent {

  nuevoReporte = "";
  reportes: string[] = [];

  agregarReporte() {
    if (this.nuevoReporte.trim()) {
      this.reportes.push(this.nuevoReporte);
      this.nuevoReporte = "";
    }
  }

}