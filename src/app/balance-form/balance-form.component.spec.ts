import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceFormComponent } from './balance-form.component';

describe('BalanceFormComponent', () => {
  let component: BalanceFormComponent;
  let fixture: ComponentFixture<BalanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
