import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdSenseComponent } from './ad-sense.component';

describe('AdSenseComponent', () => {
  let component: AdSenseComponent;
  let fixture: ComponentFixture<AdSenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdSenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdSenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
