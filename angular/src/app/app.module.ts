import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule} from "@angular/forms";
import { MemberService } from './member.service';
import {HttpClientModule} from "@angular/common/http";
import { SearchComponent } from './search/search.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { SearchService } from './search.service';
import { AppRoutingModule } from './app-routing.module';
import { DictionaryItemComponent } from './dictionary-item/dictionary-item.component';
import { SelectLanguageComponent } from './select-language/select-language.component';
import { ApiService } from './api.service';
import { CreateTestTranslationsComponent } from './create-test-translations/create-test-translations.component';
import { TestService } from './test.service';
import { TranslationQuestionComponent } from './translation-question/translation-question.component';
import { TestTranslationsComponent } from './test-translations/test-translations.component';
import { TestConjugationsComponent } from './test-conjugations/test-conjugations.component';
import { CreateTestConjugationsComponent } from './create-test-conjugations/create-test-conjugations.component';
import { ConjugationQuestionComponent } from './conjugation-question/conjugation-question.component';
import { TestResultsComponent } from './test-results/test-results.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchComponent,
    DictionaryComponent,
    DictionaryItemComponent,
    SelectLanguageComponent,
    CreateTestTranslationsComponent,
    TranslationQuestionComponent,
    TestTranslationsComponent,
    TestConjugationsComponent,
    CreateTestConjugationsComponent,
    ConjugationQuestionComponent,
    TestResultsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [MemberService, SearchService, ApiService, TestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
