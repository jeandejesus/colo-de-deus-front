import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibleComponent } from './bible.component';

describe('BibleComponent', () => {
  let component: BibleComponent;
  let fixture: ComponentFixture<BibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
