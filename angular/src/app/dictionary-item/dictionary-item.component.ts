import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dictionary-item',
  templateUrl: './dictionary-item.component.html',
  styleUrls: ['./dictionary-item.component.css']
})
export class DictionaryItemComponent implements OnInit {
  @Input() item;

  constructor() { }

  ngOnInit() {
  }

}
