import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbDetailEnglishComponent } from './verb-detail-english.component';

describe('VerbDetailSpanishComponent', () => {
  let component: VerbDetailEnglishComponent;
  let fixture: ComponentFixture<VerbDetailEnglishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerbDetailEnglishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerbDetailEnglishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
