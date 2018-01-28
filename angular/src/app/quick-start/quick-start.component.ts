import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-quick-start',
  templateUrl: './quick-start.component.html',
  styleUrls: ['./quick-start.component.css']
})
export class QuickStartComponent implements OnInit {

  public info: any = null;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getLanguaInfo().then(info => {
      this.info = info;
    });
  }

}
