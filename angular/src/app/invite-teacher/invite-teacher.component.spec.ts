import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteTeacherComponent } from './invite-teacher.component';

describe('InviteTeacherComponent', () => {
  let component: InviteTeacherComponent;
  let fixture: ComponentFixture<InviteTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
