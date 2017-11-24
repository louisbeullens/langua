import { Component, OnInit } from '@angular/core';
import {MemberService} from '../member.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  success = '';

  constructor(private memberService: MemberService) { }

  ngOnInit() {
  }

  onLoginClick(): void {
    const component = this;
    this.memberService.Login(this.username, this.password).subscribe( data => {
      component.success = 'login successfull. ';
      this.memberService.getMemberInfo().subscribe(memberData => component.success = component.success + 'Welkom ' + memberData.firstname + ' ' + memberData.lastname);
    }, err => {
        component.success = 'login failed.';
    });
  }

}
