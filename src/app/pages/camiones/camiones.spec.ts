import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Camiones } from './camiones';

describe('Camiones', () => {
  let component: Camiones;
  let fixture: ComponentFixture<Camiones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Camiones],
    }).compileComponents();

    fixture = TestBed.createComponent(Camiones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
