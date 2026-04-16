import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
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

  //ZOOM + DRAG
  zoom: number = 1;
  posX: number = 0;
  posY: number = 0;

  isDragging = false;
  startX = 0;
  startY = 0;

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

        const conductoresMap = (conductores as any[]).reduce((map, c) => {
          map[c.id] = c;
          return map;
        }, {} as any);

        const horariosMap = (horarios as any[]).reduce((map, h) => {
          map[h.idCamion] = h;
          return map;
        }, {} as any);

        this.camiones = (camiones as any[])
          .filter(c => c.disponibilidad === true)
          .map(c => {

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

  //ZOOM EN CURSOR
  onZoom(event: WheelEvent) {
    event.preventDefault();

    const scaleAmount = 0.15;
    const rect = (event.target as HTMLElement).getBoundingClientRect();

    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const prevZoom = this.zoom;

    if (event.deltaY < 0) {
      this.zoom += scaleAmount;
    } else {
      this.zoom -= scaleAmount;
    }

    this.zoom = Math.max(1, Math.min(this.zoom, 4));

    const zoomRatio = this.zoom / prevZoom;

    this.posX = offsetX - zoomRatio * (offsetX - this.posX);
    this.posY = offsetY - zoomRatio * (offsetY - this.posY);
  }

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX - this.posX;
    this.startY = event.clientY - this.posY;
  }

  onDrag(event: MouseEvent) {
    if (!this.isDragging) return;

    this.posX = event.clientX - this.startX;
    this.posY = event.clientY - this.startY;
  }

  stopDrag() {
    this.isDragging = false;
  }

  @HostListener('window:mouseup')
  onGlobalMouseUp() {
    this.isDragging = false;
  }

  @HostListener('window:mouseleave')
  onMouseLeaveWindow() {
    this.isDragging = false;
  }

  cerrarMapa() {
    this.abrirMapa = false;
    this.zoom = 1;
    this.posX = 0;
    this.posY = 0;
  }
}