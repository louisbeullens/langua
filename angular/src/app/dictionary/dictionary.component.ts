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
  public results = [[],[]];
  public nativeLanguage = '';
  public currentLanguage = '';

  constructor(private searchService: SearchService, private api: ApiService, private memberService: MemberService) { }

  ngOnInit() {
    this.searchValue = this.searchService.getSearchValue();
    this.api.getLanguageById(this.memberService.getNativeLanguageId()).then(language => this.nativeLanguage = language.name);
    this.api.getLanguageById(this.memberService.getCurrentLanguageId()).then(language => this.currentLanguage = language.name);
    this.results = this.searchService.getResults();
    this.memberService.currentLanguageIdChanged.subscribe(languageId => this.onCurrentLanguageIdChanged(languageId));
    this.searchService.resultsChanged.subscribe(_ => this.onResultsChanged());
  };

  onResultsChanged(): void {
    this.results = this.searchService.getResults();
  }

  onCurrentLanguageIdChanged(languageId): void {
    this.api.getLanguageById(languageId).then(language => this.currentLanguage = language.name);
  }

  onKeyup() {
    if (this.searchValue === '') {
      this.results = [[],[]];
    } else {
      this.searchService.changeSearchValue(this.searchValue);
    }
  }
}
