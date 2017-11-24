import { Component, OnInit } from '@angular/core';
import {SearchService} from "../search.service";

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css']
})
export class DictionaryComponent implements OnInit {
  results;

  constructor(private searchService: SearchService) { }

  ngOnInit() {
      this.results = this.searchService.getResults();
      this.searchService.resultsChanged.subscribe( (searchValue) => this.onResultsChanged(searchValue) );
  }

  onResultsChanged(searchValue): void {
    this.results = this.searchService.getResults();
  }
}
