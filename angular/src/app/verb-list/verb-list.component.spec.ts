import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbListComponent } from './verb-list.component';

describe('VerbListComponent', () => {
  let component: VerbListComponent;
  let fixture: ComponentFixture<VerbListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerbListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
