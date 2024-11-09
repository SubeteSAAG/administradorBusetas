import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRecorridoComponent } from './gestion-recorrido.component';

describe('GestionRecorridoComponent', () => {
  let component: GestionRecorridoComponent;
  let fixture: ComponentFixture<GestionRecorridoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionRecorridoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionRecorridoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
