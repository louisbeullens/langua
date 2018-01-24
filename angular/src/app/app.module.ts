import { BrowserModule } from '@angular/platform-browser';
import {ChartsModule} from "ng2-charts";
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { MemberService } from './member.service';
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './search/search.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { SearchService } from './search.service';
import { AppRoutingModule } from './app-routing.module';
import { DictionaryItemComponent } from './dictionary/item/dictionary-item.component';
import { SelectLanguageComponent } from './select-language/select-language.component';
import { ApiService } from './api.service';
import { TestTranslationsCreateComponent } from './test/translation/create/test-translations-create.component';
import { TestService } from './test.service';
import { TestTranslationQuestionComponent } from './test/translation/question/test-translation-question.component';
import { TestTranslationsComponent } from './test/translation/container/test-translations.component';
import { TestConjugationsComponent } from './test/conjugation/container/test-conjugations.component';
import { TestConjugationsCreateComponent } from './test/conjugation/create/test-conjugations-create.component';
import { TestConjugationQuestionComponent } from './test/conjugation/question/test-conjugation-question.component';
import { TestResultsComponent } from './test/results/test-results.component';
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';
import { VerbListComponent } from './verb-list/verb-list.component';
import { VerbDetailSpanishComponent } from './verb-detail/spanish/verb-detail-spanish.component';
import { VerbDetailEnglishComponent } from './verb-detail/english/verb-detail-english.component';
import { VerbDetailFrenchComponent } from './verb-detail/french/verb-detail-french.component';
import { ConjugationDetailComponent } from './conjugation-detail/conjugation-detail.component';
import { HighlightPipe } from './highlight.pipe';
import { VerbDetailContainerComponent } from './verb-detail/container/verb-detail-container.component';
import { LandingComponent } from './landing/landing.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { DoughnutComponent } from './doughnut/doughnut.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { QuickStartComponent } from './quick-start/quick-start.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchComponent,
    DictionaryComponent,
    DictionaryItemComponent,
    SelectLanguageComponent,
    TestTranslationsCreateComponent,
    TestTranslationQuestionComponent,
    TestTranslationsComponent,
    TestConjugationsComponent,
    TestConjugationsCreateComponent,
    TestConjugationQuestionComponent,
    TestResultsComponent,
    HomeComponent,
    FaqComponent,
    VerbListComponent,
    VerbDetailSpanishComponent,
    VerbDetailEnglishComponent,
    VerbDetailFrenchComponent,
    ConjugationDetailComponent,
    HighlightPipe,
    VerbDetailContainerComponent,
    LandingComponent,
    TestimonialComponent,
    DoughnutComponent,
    PasswordResetComponent,
    QuickStartComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [MemberService, SearchService, ApiService, TestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
