import {Component} from '@angular/core';
import {TestService} from "./test.service";
import {MemberService} from "./member.service";
import { SearchService } from './search.service';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { OnInit } from '@angular/core';

declare var window: any;
declare var screen: any;
declare var FB: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Langua';

    public languages = null;
    public currentLanguage = '';
    public searchValue = '';

    constructor(public apiService: ApiService, public searchService: SearchService, private router: Router , public memberService: MemberService, public testService: TestService) {
    }

    ngOnInit() {
        this.apiService.getLanguages().then(lanugages => {
            const currentLanguageId = this.memberService.getCurrentLanguageId();
            for (let i=0; i< lanugages.length; i++) {
                if (lanugages[i].id === currentLanguageId) {
                    this.currentLanguage = lanugages[i].name;
                    break;
                }
            }
            this.languages = lanugages;
        });
    }

    search() {
        this.searchService.changeSearchValue(this.searchValue);
        this.router.navigateByUrl('/dictionary');
    }

    onDonate() {
        const left = (screen.width - 800) / 2;
        const top = (screen.height - 600) / 2;
        const paypal = window.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YLAADHGWPMBJS","donate","menubar=no,titlebar=no,status=no,left="+ left.toString() +",top="+ top +",width=800,height=600");
        if (paypal) {
            paypal.focus();
        }
    }

    onLanguageChange(languageId, language) {
        this.currentLanguage = language;
        this.memberService.changeCurrentLanguageId(languageId);
    }
}