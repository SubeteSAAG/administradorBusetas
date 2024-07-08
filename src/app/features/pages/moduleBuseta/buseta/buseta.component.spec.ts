import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusetaComponent } from './buseta.component';

describe('BusetaComponent', () => {
  let component: BusetaComponent;
  let fixture: ComponentFixture<BusetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusetaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
