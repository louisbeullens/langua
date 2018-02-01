import { Component, OnInit } from '@angular/core';
import { SearchService } from "../search.service";
import { ApiService } from '../api.service';
import { MemberService } from '../member.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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

  private languageId: number;

  constructor(private searchService: SearchService, private api: ApiService, private memberService: MemberService, private route: ActivatedRoute, private locationService: Location) { }

  ngOnInit() {

    const languageIds = { es: 1, en: 2, nl: 4, fr: 5 };
    const locales = { 1: 'es', 2: 'en', 4: 'nl', 5: 'fr' };
    this.route.params.subscribe(params => {
      if (this.route.snapshot.paramMap.has('locale')) {
        this.languageId = languageIds[this.route.snapshot.params['locale']] || this.languageId;
        this.api.getLanguageById(this.languageId).then(language => this.currentLanguage = language.name);
        this.searchService.getResults(this.searchValue, this.languageId);
      }
    });
    this.memberService.currentLanguageIdChanged.subscribe(languageId => {
      this.languageId = languageId;
      if (this.route.snapshot.paramMap.has('locale')) {
        this.locationService.go('/dictionary/' + locales[languageId]);
      }
    });
    this.languageId = this.memberService.getCurrentLanguageId();
    if (this.route.snapshot.paramMap.has('locale')) {
      this.languageId = languageIds[this.route.snapshot.params['locale']] || this.languageId;
    }

    this.searchService.searchValueChanged.subscribe(event => {
      if (event.id !== 1) {
        this.onSearchValueChanged(event.value);
      }
    });
    this.memberService.currentLanguageIdChanged.subscribe(languageId => this.onCurrentLanguageIdChanged(languageId));

    this.api.getLanguageById(this.memberService.getNativeLanguageId()).then(language => this.nativeLanguage = language.name);
    this.api.getLanguageById(this.languageId).then(language => this.currentLanguage = language.name);
    this.onSearchValueChanged(this.searchService.getSearchValue());
  };

  onSearchValueChanged(searchValue: string): void {
    this.searchValue = searchValue;
    if (searchValue !== '') {
      this.searchService.getResults(searchValue, this.languageId).then(results => this.results = results);
    } else {
      this.results = { native: [], current: [] };
    }
  }

  onCurrentLanguageIdChanged(languageId: number): void {
    this.api.getLanguageById(languageId).then(language => this.currentLanguage = language.name);
    this.searchService.getResults(this.searchValue, this.languageId).then(results => this.results = results);
  }

  onKeyup(searchValue: string) {
    this.searchService.setSearchValue(searchValue, 1);
    if (searchValue.length > 1) {
      console.log('searchValue', searchValue);
      this.searchService.getResults(searchValue, this.languageId).then(results => this.results = results);
    } else {
      this.results = { native: [], current: [] };
    }
  }

  onClick() {
    if (this.searchValue !== '') {
      this.searchService.getResults(this.searchValue, this.languageId).then(results => {
        this.results = results;
      });
    }
  }
}
