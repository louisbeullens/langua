import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comming-soon',
  templateUrl: './comming-soon.component.html',
  styleUrls: ['./comming-soon.component.css']
})
export class CommingSoonComponent implements OnInit {

  @Input() page: string = '';

  constructor() { }

  ngOnInit() {
  }

}
