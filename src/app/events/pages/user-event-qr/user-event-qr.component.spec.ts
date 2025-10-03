import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEventQrComponent } from './user-event-qr.component';

describe('UserEventQrComponent', () => {
  let component: UserEventQrComponent;
  let fixture: ComponentFixture<UserEventQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEventQrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEventQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
