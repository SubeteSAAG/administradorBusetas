import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEstudianteComponent } from './gestion-estudiante.component';

describe('GestionEstudianteComponent', () => {
  let component: GestionEstudianteComponent;
  let fixture: ComponentFixture<GestionEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionEstudianteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
