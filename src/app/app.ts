import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}