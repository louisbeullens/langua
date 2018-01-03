import {Component, OnInit} from '@angular/core';
import {MemberService} from '../member.service';

declare var window;
declare var FB;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    readonly PRELOGIN = 0;
    readonly REGISTER = 1;
    readonly LOGIN = 2;

    mode = this.PRELOGIN;

    public email = '';

    constructor(private memberService: MemberService) {
        window.fbAsyncInit = function () {
            FB.init({
                appId: '699980090205893',
                autoLogAppEvents: true,
                version: 'v2.11'
            });
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    ngOnInit() {
    }

    onChangeInputType(element) {
        element.type = (element.type === 'password') ? 'text' : 'password';
    }

    onSubmit(form: any): void {
        switch (this.mode) {
            case this.PRELOGIN:
                this.memberService.emailExists(form.value.email).subscribe(exists => {
                    this.mode = exists ? this.LOGIN : this.REGISTER;
                });
                break;
            case this.LOGIN:
                this.memberService.login(form.controls.email.value, form.value.password).subscribe(async tokenObj => {
                    console.log(tokenObj);
                    const member = await this.memberService.getMemberInfo();
                    console.log(member);
                });
                break;
            case this.REGISTER:
                this.memberService.register(form.controls.email.value, form.value.firstname, form.value.lastname, form.value.password).subscribe(member => {
                    console.log(member);
                });
                break;
        }
    }

    FBGetLoginStatus() {
        const component = this;

        FB.getLoginStatus(function(response) {
            console.log('getLoginStatus', response);
            if (response.status === 'connected') {
                component.FBLoginCallback(response);
            } else {
                FB.login(function(response) { component.FBLoginCallback(response); }, {auth_type: 'rerequest', scope:'email,public_profile,user_friends', return_scopes: true});
            }
        }, true);

    }

    FBLoginCallback(response) {
        console.log('Login',response);
        const component = this;

        if (response.status === 'connected') {
            if (response.authResponse.grantedScopes) {
                const scopes = response.authResponse.grantedScopes.split(',');
                if (scopes.indexOf('email') !== -1) {
                    component.memberService.facebookLogin(response.authResponse.accessToken).subscribe(accessToken => console.log(accessToken), err => console.log(err));
                } else {
                    FB.logout(function () {
                        console.log('Grant email permission next time you log in.');
                    });
                }
            }
        }
    }
}
