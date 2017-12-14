import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {DictionaryComponent} from "./dictionary/dictionary.component";
import {CreateTestTranslationsComponent} from "./create-test-translations/create-test-translations.component";
import {TestTranslationsComponent} from "./test-translations/test-translations.component";

const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'dictionary', component: DictionaryComponent},
    {path: 'test/translations', component: TestTranslationsComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes)],
    exports: [ RouterModule ]
})
export class AppRoutingModule {
}
