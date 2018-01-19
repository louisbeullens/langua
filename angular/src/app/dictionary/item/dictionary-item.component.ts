import {Component, Input, OnInit} from '@angular/core';
import { SearchService } from '../../search.service';

@Component({
  selector: 'app-dictionary-item',
  templateUrl: './dictionary-item.component.html',
  styleUrls: ['./dictionary-item.component.css']
})
export class DictionaryItemComponent implements OnInit {
  @Input() searchValue;
  @Input() item;

  constructor(public searchService: SearchService) { }

  ngOnInit() {
  }

}
