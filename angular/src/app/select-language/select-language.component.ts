import { Component, OnInit } from '@angular/core';
import {MemberService} from "../member.service";

@Component({
  selector: 'app-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.css']
})
export class SelectLanguageComponent implements OnInit {
  choosenLanguage: number;

  constructor(private memberService: MemberService) { }

  ngOnInit() {
    this.choosenLanguage = this.memberService.getCurrentLanguageId();
  }

  onChange(event) {
    console.log(this.choosenLanguage);
    this.memberService.setCurrentLanguageId(this.choosenLanguage);
  }

}
