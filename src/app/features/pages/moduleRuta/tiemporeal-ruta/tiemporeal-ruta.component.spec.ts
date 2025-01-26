import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiemporealRutaComponent } from './tiemporeal-ruta.component';

describe('TiemporealRutaComponent', () => {
  let component: TiemporealRutaComponent;
  let fixture: ComponentFixture<TiemporealRutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiemporealRutaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiemporealRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
