import {Component, NgZone, OnInit, AfterViewChecked } from '@angular/core';
import {MemberService} from '../member.service';
import {Router, ActivatedRoute} from '@angular/router';
import {Subject} from "rxjs/Subject";

declare var window;
declare var FB;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewChecked {
    readonly PRELOGIN = 0;
    readonly REGISTER = 1;
    readonly LOGIN = 2;

    public mode = this.PRELOGIN;

    public email = '';
    public grecaptchaResponse = '';

    private grecaptchaId: any = null;

    constructor(private memberService: MemberService, private router: Router, private zone: NgZone, private route: ActivatedRoute) {
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
        if (this.route.snapshot.data.mode === this.REGISTER) {
            this.mode = this.REGISTER;
        }
    }

    renderReCaptcha() {
        if (window.grecaptcha) {
            this.grecaptchaId = window.grecaptcha.render('g-recaptcha',{
                sitekey: '6LcWl0EUAAAAADyqoxuwJxJNrefNLtO5BE3g_OFl',
                callback: (response => this.grecaptchaCallback(response)),
                'expired-callback': (response => this.grecaptchaExpiredCallback()),
                'error-callback': (_ => this.grecaptchaErrorCallback())
            });
        } else {
            setTimeout(_ => { this.renderReCaptcha() }, 100);
        }
    }

    ngAfterViewChecked() {
        if (this.mode === this.REGISTER && this.grecaptchaId === null) {
            this.grecaptchaId = 'pending';
            this.renderReCaptcha();
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
                this.memberService.login(form.controls.email.value, form.value.password).subscribe(async tokenObj => {
                    console.log(tokenObj);
                    const member = await this.memberService.getMemberInfo();
                    console.log(member);
                    this.router.navigateByUrl('/test/results');
                });
                break;
            case this.REGISTER:
                if (this.grecaptchaResponse !== '') {
                    this.memberService.register(form.controls.email.value, form.value.firstname, form.value.lastname, form.value.password).subscribe(member => {
                        console.log(member);
                    });
                }
                break;
        }
    }

    onPrevious() {
        this.grecaptchaId = null;
        this.mode = this.PRELOGIN;
    }

    FBGetLoginStatus() {
        FB.getLoginStatus(response => {
            if (response.status === 'connected') {
                this.FBLoginCallback(response);
            } else {
                FB.login(response => this.FBLoginCallback(response), {
                    auth_type: 'rerequest',
                    scope: 'email,public_profile,user_friends',
                    return_scopes: true
                });
            }
        }, true);
    }

    FBLoginCallback(response) {
        console.log(response);
        if (response.status === 'connected') {
            this.memberService.facebookLogin(response.authResponse.accessToken).subscribe(async tokenObj => {
                console.log('gotToken');
                console.log(tokenObj);
                const member = await this.memberService.getMemberInfo();
                console.log(member);
                this.zone.run(_ => this.router.navigateByUrl('/test/results'));
            }, err => console.log(err));
        }
    }

    grecaptchaCallback(response) {
        this.grecaptchaResponse = response;
    }

    grecaptchaExpiredCallback() {
        this.grecaptchaResponse = '';
    }

    grecaptchaErrorCallback() {
        this.grecaptchaResponse = 'none';
    }
}
