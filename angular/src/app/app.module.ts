import * as Raven from 'raven-js';

import { BrowserModule } from '@angular/platform-browser';
import {ChartsModule} from "ng2-charts";
import { NgModule, LOCALE_ID, ErrorHandler } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';

import { AppComponent } from './app.component';
import { AdSenseComponent } from './ad-sense/ad-sense.component';
import { BlogComponent } from './blog/blog.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { MemberService } from './member.service';
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './search/search.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { SearchService } from './search.service';
import { AppRoutingModule } from './app-routing.module';
import { DictionaryItemComponent } from './dictionary/item/dictionary-item.component';
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
import { ProfileComponent } from './profile/profile.component';


registerLocaleData(localeNl, 'nl');

Raven
  .config('https://66bff354602649099aacf516e03836b4@sentry.io/281436')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err:any) : void {
    Raven.captureException(err.originalError || err);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchComponent,
    DictionaryComponent,
    DictionaryItemComponent,
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
    QuickStartComponent,
    AdSenseComponent,
    ProfileComponent,
    ComingSoonComponent,
    BlogComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [ { provide: ErrorHandler, useClass: RavenErrorHandler }, { provide: LOCALE_ID, useValue: 'nl' }, MemberService, SearchService, ApiService, TestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
