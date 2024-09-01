import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPasajeroComponent } from './gestion-pasajero.component';

describe('GestionPasajeroComponent', () => {
  let component: GestionPasajeroComponent;
  let fixture: ComponentFixture<GestionPasajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPasajeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPasajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
