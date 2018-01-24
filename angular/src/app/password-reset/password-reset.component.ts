import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  public token: string = null;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.has('token')) {
      this.token = this.route.snapshot.queryParamMap.get('token');
    }
  }

  onChangeInputType(element) {
    element.type = (element.type === 'password') ? 'text' : 'password';
}

  onSubmit(form) {
    this.api.setAccessToken(this.token);
    this.api.post<any>('/Members/reset-password',{ newPassword: form.value.password}).subscribe(response => {
      this.api.resetAccessToken();
      this.router.navigateByUrl('/login');
    });
  }

}
