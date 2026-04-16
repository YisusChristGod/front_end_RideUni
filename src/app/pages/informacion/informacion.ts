import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamionService } from '../../services/Camion';
import { ConductorService } from '../../services/Conductor';
import { HorarioService } from '../../services/Horario';
import { forkJoin } from 'rxjs';
import * as L from 'leaflet';


@Component({
  selector: 'app-informacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informacion.html',
  styleUrl: './informacion.css'
})
export class InformacionComponent implements OnInit, AfterViewInit {

  camiones: any[] = [];
  private map: L.Map | undefined;

  constructor(
    private camionService: CamionService,
    private conductorService: ConductorService,
    private horarioService: HorarioService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private async initMap() {
    // Inicializar mapa
    this.map = L.map('map').setView([27.4828, -109.9304], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Definir las 4 rutas solicitadas
    const rutas = [
      {
        nombre: '1. Fundición a UTS',
        camion: 'UTS- 202',
        color: '#16a34a', // Verde normal
        stops: [
          { coords: [27.3297, -109.7394], label: 'Inicio: Fundición' },
          { coords: [27.3670, -109.8960], label: 'Parada: Tobarito / Marte R. Gomez' },
          { coords: [27.3750, -109.9530], label: 'Fin: UTS' }
        ]
      },
      {
        nombre: '2. Cócorit a UTS',
        camion: 'UTS-303',
        color: '#059669', // Verde esmeralda
        stops: [
          { coords: [27.5819, -109.9602], label: 'Inicio: Cócorit' },
          { coords: [27.5020, -109.9400], label: 'Parada: C. California (Norte)' },
          { coords: [27.4800, -109.9400], label: 'Parada: C. California (Centro)' },
          { coords: [27.4600, -109.9400], label: 'Parada: C. California (Sur)' },
          { coords: [27.4500, -109.9320], label: 'Parada: C. Miguel Alemán (Norte)' },
          { coords: [27.4300, -109.9320], label: 'Parada: C. Miguel Alemán (Sur)' },
          { coords: [27.3750, -109.9530], label: 'Fin: UTS' }
        ]
      },
      {
        nombre: '3. Villa Juárez a UTS',
        camion: 'UTS-505',
        color: '#65a30d', // Verde lima oscuro
        stops: [
          { coords: [27.1360, -109.8390], label: 'Inicio: Villa Juárez' },
          { coords: [27.2000, -109.8700], label: 'Parada 1' },
          { coords: [27.2800, -109.9000], label: 'Parada 2' },
          { coords: [27.3750, -109.9530], label: 'Fin: UTS' }
        ]
      },
      {
        nombre: '4. Pueblo Yaqui a UTS',
        camion: 'UTS-101',
        color: '#10b981', // Verde claro
        stops: [
          { coords: [27.3500, -110.0300], label: 'Inicio: Pueblo Yaqui' },
          { coords: [27.3600, -109.9900], label: 'Parada Media' },
          { coords: [27.3750, -109.9530], label: 'Fin: UTS' }
        ]
      }
    ];

    const allBounds: L.LatLngTuple[] = [];

    // Iterar y dibujar cada ruta usando la API de ruteo gratuita de OSRM para seguir las calles
    for (const ruta of rutas) {
      // La API requiere formato: lng,lat;lng,lat
      const points = ruta.stops.map(s => `${s.coords[1]},${s.coords[0]}`).join(';');
      const url = `https://router.project-osrm.org/route/v1/driving/${points}?overview=full&geometries=geojson`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data && data.routes && data.routes.length > 0) {
          // Extraer coordenadas del GeoJSON (vienen como [lng, lat], Leaflet ocupa [lat, lng])
          const routeCoords = data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]);

          L.polyline(routeCoords, {
            color: ruta.color,
            weight: 5,
            opacity: 0.8
          })
          .bindPopup(`<b>Camión: ${ruta.camion}</b><br><small>${ruta.nombre}</small>`)
          .addTo(this.map);

          routeCoords.forEach((c: L.LatLngTuple) => allBounds.push(c));
        } else {
          // Fallback a línea recta si la API falla por alguna razón
          const fallbackCoords = ruta.stops.map(s => s.coords) as L.LatLngTuple[];
          L.polyline(fallbackCoords, { color: ruta.color, weight: 5, opacity: 0.8 })
            .bindPopup(`<b>Camión: ${ruta.camion}</b><br><small>${ruta.nombre}</small>`)
            .addTo(this.map);
          fallbackCoords.forEach(c => allBounds.push(c));
        }
      } catch (err) {
        console.error('Error dibujando ruta:', err);
      }

      // Dibujar los marcadores (puntos naranjas) para las paradas
      ruta.stops.forEach(parada => {
        L.circleMarker(parada.coords as L.LatLngExpression, {
          color: '#d97706',
          fillColor: '#f59e0b',
          fillOpacity: 1,
          radius: 7,
          weight: 2
        })
          .bindPopup(`<b>${parada.label}</b><br><small>${ruta.nombre}</small>`)
          .addTo(this.map!);
      });
    }

    // Centrar mapa ajustando a todas las rutas trazadas
    if (allBounds.length > 0) {
      this.map.fitBounds(L.latLngBounds(allBounds), { padding: [30, 30] });
    }
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
}