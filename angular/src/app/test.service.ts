///<reference path="../../node_modules/rxjs/operators/tap.d.ts"/>
import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs/Observable';
import {MemberService} from './member.service';
import {tap} from 'rxjs/operators';

@Injectable()
export class TestService {
    public test: any = null;

    constructor(private api: ApiService, private memberService: MemberService) {
    }

    resetTest() {
        this.test = null;
    }

    async createTestTranslations(fromLanguageId, toLanguageId, wordTypeIds, selection): Promise<any> {
        try {
            const data = {
                type: 'T',
                memberId: await this.memberService.getMemberId(),
                languageQuestionId: fromLanguageId,
                languageAnswerId: toLanguageId,
                wordTypeIds: wordTypeIds,
                selection: selection
            };

            return this.api.post('/Tests', data).pipe(
                tap(test => {
                    this.test = test;
                })
            );
        } catch (err) {
            return new Observable(observable => {
                observable.error(err);
            });
        }
    }

    async createTestConjugations(languageId, tenseIds, regularity, selection): Promise<any> {
        try {
            const data = {
                type: 'C',
                memberId: await this.memberService.getMemberId(),
                languageQuestionId: languageId,
                tenseIds: tenseIds,
                regularity: regularity,
                selection: selection
            };

            return this.api.post('/Tests', data).pipe(
                tap(test => {
                    this.test = test;
                })
            );
        } catch (err) {
            return new Observable(observable => {
                observable.error(err);
            });
        }
    }

    async getUnfinishedTranslationTests() {
        return this.api.get('/Members/' + (await this.memberService.getMemberId(false)).toString() + '/unfinishedTests');
    }

    getQuestion(): Observable<any> {
        return this.api.get('/Tests/' + this.test.id.toString() + '/question/' + (this.test.lastQuestion + 1).toString());
    }

    postAnswer(questionId, answer): Observable<any> {
        return this.api.post('/Questions/' + questionId.toString() + '/Answers', {answer: answer});
    }

    setCurrentTest(test) {
        this.test = test;
    }

    containsTestTranslation(): boolean {
        return (this.test !== null && this.test.type === 'T');
    }

    containsTestConjugation(): boolean {
        return (this.test !== null && this.test.type === 'C');
    }
}
