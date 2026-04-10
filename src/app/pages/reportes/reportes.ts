import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../services/Reporrte';

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
  loading = false;

  constructor(
    private reporteService: ReporteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.reporteService.getReporte().subscribe({
      next: (data) => {
        this.reportes = (data as any[]).map(r => ({
          id: r.id,
          descripcion: r.descripcion,
          fecha: new Date(r.fecha)
        }));

        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  agregarReporte() {
    if (this.nuevoReporte.trim() === '' || this.loading) return;

    const nuevo = {
      descripcion: this.nuevoReporte,
      fecha: new Date(),
      idcamion: 1
    };

    this.loading = true;

    this.reporteService.insertReporte(nuevo as any).subscribe({
      next: (res: any) => {


        this.reportes.unshift({
          id: res?.id || Date.now(),
          descripcion: this.nuevoReporte,
          fecha: new Date()
        });

        this.nuevoReporte = '';
        this.loading = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

}