import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegaComponent } from './sega.component';

describe('SegaComponent', () => {
  let component: SegaComponent;
  let fixture: ComponentFixture<SegaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SegaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
