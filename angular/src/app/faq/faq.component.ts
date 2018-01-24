import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  public questionSend = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSubmit(form) {
    console.log(form);
    this.http.post<any>(location.protocol + '//' + environment.backend + '/faq/askQuestion', form.value).subscribe(response => {
      this.questionSend = true;
      form.value.firstname = '';
      form.value.email = '';
      form.value.message = '';
    });
  }

}
