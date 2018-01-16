import { Component, OnInit } from '@angular/core';
import {SearchService} from "../search.service";

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css']
})
export class DictionaryComponent implements OnInit {
  public results = [];

  constructor(private searchService: SearchService) { }

  ngOnInit() {
      this.results = this.searchService.getResults();
      this.searchService.resultsChanged.subscribe(_ => this.onResultsChanged() );
  }

  onResultsChanged(): void {
    this.results = this.searchService.getResults();
  }
}
