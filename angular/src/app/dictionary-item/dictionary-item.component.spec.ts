import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionaryItemComponent } from './dictionary-item.component';

describe('DictionaryItemComponent', () => {
  let component: DictionaryItemComponent;
  let fixture: ComponentFixture<DictionaryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DictionaryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictionaryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
