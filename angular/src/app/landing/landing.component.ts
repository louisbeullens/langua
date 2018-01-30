import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../api.service';
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

declare const jQuery: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, AfterViewChecked {

  constructor(private api: ApiService, private http: HttpClient) { }

  public info: any = null;
  public checked: boolean = false;

  public questionSend = false;

  @ViewChild('counterUp') private counterUp:ElementRef;
  @ViewChild('contactForm') private contactForm: ElementRef; 

  ngOnInit() {
      this.api.getLanguaInfo().then(info => this.info = info.other);
    jQuery('.bannercontainerV1 .fullscreenbanner').revolution({
        delay: 5000,
        startwidth: 1170,
        startheight: 560,
        fullWidth: "on",
        fullScreen: "off",
        hideCaptionAtLimit: "",
        dottedOverlay: "twoxtwo",
        navigationStyle: "preview4",
        fullScreenOffsetContainer: "",
        hideTimerBar:"on",

    });
}

ngAfterViewChecked() {
    if (this.counterUp && this.checked === false) {
        this.checked = true;
        jQuery('.counter').counterUp({
            delay: 10,
            time: 2000
        });
    }
}

onSubmit(form) {
    this.http.post<any>(location.protocol + '//' + environment.backend + '/faq/askQuestion', form.value).subscribe(response => {
      this.questionSend = true;
      form.value.name = '';
      form.value.email = '';
      form.value.message = '';
    });
  }

  goToContactForm() {
    if (this.contactForm) {
      this.contactForm.nativeElement.scrollIntoView({behavior: 'smooth'});
    }
  }

}
