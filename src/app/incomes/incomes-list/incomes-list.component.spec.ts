import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomesListComponent } from './incomes-list.component';

describe('IncomesListComponent', () => {
  let component: IncomesListComponent;
  let fixture: ComponentFixture<IncomesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
