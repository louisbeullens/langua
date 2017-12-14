import {Component, OnInit} from '@angular/core';
import {MemberService} from '../member.service';
import {Member} from "../interfaces";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    readonly PRELOGIN = 0;
    readonly REGISTER = 1;
    readonly LOGIN = 2;

    inputType = 'password';
    mode = this.PRELOGIN;
    username = '';
    password = '';
    success = '';

    constructor(private memberService: MemberService) {
    }

    ngOnInit() {
    }

    onChangeInputType() {
        this.inputType = (this.inputType === 'password') ? 'text' : 'password';
        console.log('inputtype '+this.inputType);
    }

    onClick(loginForm): void {
        switch (this.mode) {
            case this.PRELOGIN:
                this.memberService.emailExists(loginForm.value.email).subscribe(exists => {
                    this.mode = exists ? this.LOGIN : this.REGISTER;
                });
                break;
            case this.LOGIN:
                this.memberService.login(loginForm.value.email, loginForm.value.password).subscribe( async tokenObj => {
                    console.log(tokenObj);
                    const member = await this.memberService.getMemberInfo();
                    console.log(member);
                });
                break;
        }
    }

}
