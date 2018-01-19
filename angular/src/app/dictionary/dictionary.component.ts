import { Component, OnInit } from '@angular/core';
import { SearchService } from "../search.service";
import { ApiService } from '../api.service';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css']
})
export class DictionaryComponent implements OnInit {
  public searchValue = '';
  public results = { native: [], current: [] };
  public nativeLanguage = '';
  public currentLanguage = '';

  constructor(private searchService: SearchService, private api: ApiService, private memberService: MemberService) { }

  ngOnInit() {
    this.searchService.searchValueChanged.subscribe(event => {
      if (event.id !== 1) {
        this.onSearchValueChanged(event.value);
      }
    });
    this.memberService.currentLanguageIdChanged.subscribe(languageId => this.onCurrentLanguageIdChanged(languageId));
    
    this.api.getLanguageById(this.memberService.getNativeLanguageId()).then(language => this.nativeLanguage = language.name);
    this.api.getLanguageById(this.memberService.getCurrentLanguageId()).then(language => this.currentLanguage = language.name);
    this.onSearchValueChanged(this.searchService.getSearchValue());
  };

  onSearchValueChanged(searchValue: string): void {
    this.searchValue = searchValue;
    if (searchValue !== '') {
      this.searchService.getResults(searchValue).then(results => this.results = results);
    } else {
      this.results = { native: [], current: [] };
    }
  }

  onCurrentLanguageIdChanged(languageId: number): void {
    this.api.getLanguageById(languageId).then(language => this.currentLanguage = language.name);
    this.searchService.getResults(this.searchValue).then(results => this.results = results);
  }

  onKeyup(searchValue: string) {
    this.searchService.setSearchValue(searchValue, 1);
    if (searchValue.length > 1) {
      this.searchService.getResults(searchValue).then(results => this.results = results);
    } else {
      this.results = { native: [], current: [] };
    }
  }

  onClick() {
    if (this.searchValue !== '') {
      this.searchService.getResults(this.searchValue).then(results => this.results = results);
    }
  }
}
