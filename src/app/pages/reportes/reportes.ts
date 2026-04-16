import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../services/Reporrte';
import { CamionService } from '../../services/Camion';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class ReportesComponent implements OnInit {

  nuevoReporte: string = '';
  reportes: any[] = [];
  camiones: any[] = [];
  idCamionSeleccionado: number | null = null;
  loading = false;
  intentoEnviar = false;

  constructor(
    private reporteService: ReporteService,
    private camionService: CamionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.camionService.getCamion().subscribe({
      next: (camionesData) => {

        this.camiones = camionesData;

        this.reporteService.getReporte().subscribe({
          next: (reportesData) => {

            this.reportes = (reportesData as any[]).map(r => {

              const camion = this.camiones.find(c =>
                c.id === r.idcamion || c.id === r.idCamion
              );

              return {
                id: r.id,
                descripcion: r.descripcion,
                fecha: new Date(r.fecha),
                camion: camion ? camion.modelo : 'Desconocido'
              };
            });

            this.cdr.detectChanges();
          },
          error: (err) => console.error(err)
        });

      },
      error: (err) => console.error(err)
    });
  }

  agregarReporte() {

    this.intentoEnviar = true;

    if (
      this.loading ||
      !this.idCamionSeleccionado ||
      this.nuevoReporte.trim() === ''
    ) return;

    const nuevo = {
      descripcion: this.nuevoReporte.trim(),
      fecha: new Date(),
      idcamion: this.idCamionSeleccionado
    };

    this.loading = true;

    this.reporteService.insertReporte(nuevo as any).subscribe({
      next: (res: any) => {

        const camion = this.camiones.find(c => c.id === this.idCamionSeleccionado);

        this.reportes.unshift({
          id: res?.id || Date.now(),
          descripcion: nuevo.descripcion,
          fecha: new Date(),
          camion: camion ? camion.modelo : 'Desconocido'
        });

        this.nuevoReporte = '';
        this.idCamionSeleccionado = null;
        this.loading = false;
        this.intentoEnviar = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}