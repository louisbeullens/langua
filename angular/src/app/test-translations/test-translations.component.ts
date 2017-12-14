import { Component, OnInit } from '@angular/core';
import {TestService} from "../test.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-test-translations',
  templateUrl: './test-translations.component.html',
  styleUrls: ['./test-translations.component.css']
})
export class TestTranslationsComponent implements OnInit {

  constructor(public testService: TestService) { }

  ngOnInit() {
  }

}
