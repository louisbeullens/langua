import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {MemberService} from '../member.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  public questionSend = false;

  constructor(private http: HttpClient, private memberService: MemberService) { }

  ngOnInit() {
  }

  onSubmit(form) {
      this.memberService.getReCaptchaResponse().then(response => {
          form.value.grecaptchaResponse = response;
          form.value.location = 'faq';
          this.http.post<any>(location.protocol + '//' + environment.backend + '/faq/askQuestion', form.value).subscribe(response => {
              if (response.status === 'ok') {
                  this.questionSend = true;
                  form.value.grecaptchaResponse = undefined;
                  form.value.name = '';
                  form.value.email = '';
                  form.value.message = '';
              }
          });
      });
  }

}
