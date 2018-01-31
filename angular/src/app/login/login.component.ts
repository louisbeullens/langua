import { Component, NgZone, OnInit } from '@angular/core';
import { MemberService } from '../member.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from "rxjs/Subject";

declare var window;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    readonly PRELOGIN = 0;
    readonly REGISTER = 1;
    readonly LOGIN = 2;

    public mode = this.PRELOGIN;

    public email = '';
    public grecaptchaResponse = '';

    private grecaptchaId: any = null;

    constructor(private memberService: MemberService, private router: Router, private zone: NgZone, private route: ActivatedRoute) {
        window.fbAsyncInit = function () {
            window.FB.init({
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
        if (this.route.snapshot.data.mode === this.REGISTER) {
            this.mode = this.REGISTER;
        }
    }

    requestPasswordReset() {
        if (this.email !== '') {
            this.memberService.requestPasswordReset(this.email).subscribe(response => {
                this.router.navigateByUrl('/password/reset');
            })
        }
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
                this.memberService.login(form.controls.email.value, form.value.password).subscribe(tokenObj => {
                    this.router.navigateByUrl('/home');
                });
                break;
            case this.REGISTER:
                this.memberService.getReCaptchaResponse().then(response => {
                    this.memberService.register(form.controls.email.value, form.value.firstname, form.value.lastname, form.value.password).subscribe(member => {
                        this.router.navigateByUrl('/home')
                    });
                });
                break;
        }
    }

    onPrevious() {
        this.grecaptchaId = null;
        this.mode = this.PRELOGIN;
    }

    FBLogin() {
        window.FB.login(response => this.FBLoginCallback(response), {
            auth_type: 'rerequest',
            scope: 'email,public_profile,user_friends',
            return_scopes: true
        });
    }

    FBLoginCallback(response) {
        console.log(response);
        if (response.status === 'connected') {
            this.memberService.facebookLogin(response.authResponse.accessToken).subscribe(tokenObj => {
                this.zone.run(_ => this.router.navigateByUrl('/home'));
            }, err => console.log(err));
        }
    }
}
