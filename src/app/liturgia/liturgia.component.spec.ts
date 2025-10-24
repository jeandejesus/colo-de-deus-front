import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiturgiaComponent } from './liturgia.component';

describe('LiturgiaComponent', () => {
  let component: LiturgiaComponent;
  let fixture: ComponentFixture<LiturgiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiturgiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiturgiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
