import {Component, NgZone, OnInit} from '@angular/core';
import {MemberService} from '../member.service';
import {Router} from '@angular/router';
import {Subject} from "rxjs/Subject";

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

    private loginSucceeded: Subject<void>;

    constructor(private memberService: MemberService, private router: Router, private zone: NgZone) {
        this.loginSucceeded = new Subject<void>();
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
        this.loginSucceeded.subscribe(_ => this.onLoginSuccess());
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
                    //setTimeout(_ => this.router.navigateByUrl('/test/results'), 1000);
                    this.router.navigateByUrl('/test/results');
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
        FB.getLoginStatus(response => {
            if (response.status === 'connected') {
                console.log('facebook already connected');
                this.FBLoginCallback(response);
            } else {
                console.log('facebook try to login');
                FB.login(response => this.FBLoginCallback(response), {auth_type: 'rerequest', scope:'email,public_profile,user_friends', return_scopes: true});
            }
        }, true);
    }

    FBLoginCallback(response) {
        console.log(response);
        if (response.status === 'connected') {
            if (response.authResponse.grantedScopes) {
                const scopes = response.authResponse.grantedScopes.split(',');
                if (scopes.indexOf('email') !== -1) {
                    this.memberService.facebookLogin(response.authResponse.accessToken).subscribe(async tokenObj => {
                        console.log('gotToken');
                        console.log(tokenObj);
                        const member = await this.memberService.getMemberInfo();
                        console.log(member);
                        this.zone.run(_ => this.router.navigateByUrl('/test/results'));
                        //console.log('afterRoute');
                    }
                    , err => console.log(err));
                } else {
                    FB.logout(_ => {
                        console.log('Grant email permission next time you log in.');
                    });
                }
            }
        }
    }

    onLoginSuccess() {
        this.router.navigateByUrl('/test/results');
    }
}
