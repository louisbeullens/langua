import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {DictionaryComponent} from "./dictionary/dictionary.component";
import {TestTranslationsComponent} from "./test/translation/container/test-translations.component";
import {TestConjugationsComponent} from "./test/conjugation/container/test-conjugations.component";
import {TestResultsComponent} from "./test/results/test-results.component";
import {HomeComponent} from "./home/home.component";
import {FaqComponent} from "./faq/faq.component";
import {VerbListComponent} from "./verb-list/verb-list.component";
import {VerbDetailSpanishComponent} from "./verb-detail/spanish/verb-detail-spanish.component";
import { VerbDetailContainerComponent } from './verb-detail/container/verb-detail-container.component';
import { LandingComponent } from './landing/landing.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ProfileComponent } from './profile/profile.component';
import { BlogComponent } from './blog/blog.component';

const routes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'blog', component: BlogComponent},
    {path: 'dictionary', component: DictionaryComponent},
    {path: 'dictionary/:locale', component: DictionaryComponent},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'faq', component: FaqComponent},
    {path: 'member/profile', component: ProfileComponent},
    {path: 'password/reset', component: PasswordResetComponent},
    {path: 'register', component: LoginComponent, data: {mode: 1}},
    {path: 'test', children: [
        { path: 'conjugations', component: TestConjugationsComponent },
        { path: 'conjugations/es', component: TestConjugationsComponent, data: {languageId: 1} },
        { path: 'conjugations/en', component: TestConjugationsComponent, data: {languageId: 2} },
        { path: 'conjugations/fr', component: TestConjugationsComponent, data: {languageId: 5} },
        { path: 'results', component: TestResultsComponent },
        { path: 'translations', component: TestTranslationsComponent },
        { path: 'translations/es', component: TestTranslationsComponent, data: {languageId: 1} },
        { path: 'translations/en', component: TestTranslationsComponent, data: {languageId: 2} },
        { path: 'translations/fr', component: TestTranslationsComponent, data: {languageId: 5} },
    ] },
    { path: 'testimonial', component: TestimonialComponent },
    {path: 'verb/:name', component: VerbDetailContainerComponent},
    {path: 'verblist', component: VerbListComponent},
    {path: 'verblist/:locale', component: VerbListComponent}
];

@NgModule({
    imports: [ RouterModule.forRoot(routes)],
    exports: [ RouterModule ]
})
export class AppRoutingModule {
}
