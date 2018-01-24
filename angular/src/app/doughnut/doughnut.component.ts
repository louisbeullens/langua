import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.css']
})
export class DoughnutComponent implements OnInit {

  @Input() public title;
  @Input() public width;
  @Input() public height;
  @Input() public data;

  public options = {
    legend: {
      display: false,
      position: 'bottom'
    }
  };

  public labels = ['juist', 'fout'];
  public colors = [
    {
      backgroundColor: ['#b5d56a', '#ea7066']
    }
  ];

  constructor() { }

  ngOnInit() {

  }

}
