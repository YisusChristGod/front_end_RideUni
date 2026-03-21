import { Component } from '@angular/core';

@Component({
  selector: 'app-camiones',
  templateUrl: './camiones.html',
  styleUrls: ['./camiones.css']
})
export class CamionesComponent {

  camiones = [
    { placa: "ABC-123", disponible: true, conductor: "Juan Pérez", telefono: "6441234567" },
    { placa: "DEF-456", disponible: false, conductor: "Luis García", telefono: "6449876543" }
  ];

}