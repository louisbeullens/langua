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


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchComponent,
    DictionaryComponent,
    DictionaryItemComponent,
    SelectLanguageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [MemberService, SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
