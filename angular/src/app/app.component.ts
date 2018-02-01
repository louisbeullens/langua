import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { TestService } from "./test.service";
import { MemberService } from "./member.service";
import { SearchService } from './search.service';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

declare var window: any;
declare var screen: any;
declare var FB: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'Langua';

    public languages = null;
    public currentLanguage = '';
    public searchValue = '';
    public email;

    private grecaptchaId: any = null;

    constructor(public api: ApiService, public searchService: SearchService, private router: Router, public memberService: MemberService, public testService: TestService) {
    }

    ngOnInit() {
        this.searchService.searchValueChanged.subscribe(event => {
            if (event.id !== 0) {
                this.searchValue = event.value;
            }
        });

        this.api.getLanguages().then(lanugages => {
            const currentLanguageId = this.memberService.getCurrentLanguageId();
            for (let i = 0; i < lanugages.length; i++) {
                if (lanugages[i].id === currentLanguageId) {
                    this.currentLanguage = lanugages[i].name;
                    break;
                }
            }
            this.languages = lanugages;
        });
    }

    onSubmit() {
        this.memberService.getReCaptchaResponse().then(response => {
            console.log(response);
            this.api.post<any>('/MailingList', {
                email: this.email,
                grecaptchaResponse: response
            }).subscribe(response => {
                this.email = '';
            });
        });
    }

    search() {
        this.searchService.setSearchValue(this.searchValue, 0);
        if (this.searchValue !== '') {
            this.router.navigateByUrl('/dictionary');
        }
    }

    onDonate() {
        const left = (screen.width - 800) / 2;
        const top = (screen.height - 600) / 2;
        const paypal = window.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YLAADHGWPMBJS", "donate", "menubar=no,titlebar=no,status=no,left=" + left.toString() + ",top=" + top + ",width=800,height=600");
        if (paypal) {
            paypal.focus();
        }
    }

    onLanguageChange(languageId, language) {
        this.currentLanguage = language;
        this.memberService.setCurrentLanguageId(languageId);
    }

    onLogout() {
        this.memberService.logout();
        this.router.navigateByUrl('/login');
    }

    grecaptchaCallback(response) {
        this.memberService.recaptchaResponseReceived.next(response);
    }

    renderReCaptcha() {
        if (window.grecaptcha) {
            this.grecaptchaId = window.grecaptcha.render('g-recaptcha', {
                sitekey: '6Lc9mUMUAAAAAGvR9gPNHmOaVeEqVWcssKV4RjNO',
                badge: 'bottomleft',
                size: 'invisible',
                callback: (response => this.grecaptchaCallback(response)),

            });
        } else {
            setTimeout(_ => { this.renderReCaptcha() }, 100);
        }
    }

    ngAfterViewInit() {
        if (this.grecaptchaId === null) {
            this.grecaptchaId = 'pending';
            this.renderReCaptcha();
        }
    }
}