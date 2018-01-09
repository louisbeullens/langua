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
import {VerbDetailComponent} from "./verb-detail/verb-detail.component";

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'dictionary', component: DictionaryComponent},
    {path: 'test', children: [
        { path: 'translations', component: TestTranslationsComponent },
        { path: 'conjugations', component: TestConjugationsComponent },
        { path: 'results', component: TestResultsComponent },
    ] },
    {path: 'faq', component: FaqComponent},
    {path: 'verb/detail/:name', component: VerbDetailComponent},
    {path: 'verblist', component: VerbListComponent}
];

@NgModule({
    imports: [ RouterModule.forRoot(routes)],
    exports: [ RouterModule ]
})
export class AppRoutingModule {
}
