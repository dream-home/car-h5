import { Component, Input, Output, NgZone } from '@angular/core';
import { COMMON_DIRECTIVES, NgSwitch, NgSwitchDefault } from '@angular/common';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';

import { SurveyApi } from 'client';
import * as _ from 'lodash';

@Component({
    moduleId: module.id,
    selector: 'survey-pc',
    styles: [require('./surveyPc.scss')],
    template: require('./surveyPc.html'),
    directives: [ROUTER_DIRECTIVES, COMMON_DIRECTIVES, NgSwitch, NgSwitchDefault],
    providers: [SurveyApi]
})

export class SurveyPcComponent {
    url: string = '';
    sub: any;
    survey: any;
    surveyQustions: Array<any> = [];
    surveySubmitObj = {
        sampleId: null,
        isComplete: false,
        answers: []
    };
    answersObj = {};
    showSurvey: number = 1;
    profile: any;
    constructor( private router: Router, private route: ActivatedRoute, private sApi: SurveyApi ) {
        
    }
    ngOnInit() {
        // 获取 url
        this.sub = this.route.params.subscribe(params => {
            const url = 'url';
            this.url = params[url];
            if (this.url) {
                // 获取问卷
                this.getSurveyQuestions();
            } else {
                this.showSurvey = 3;
            }
        });
        
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    createMeta() {
        let meta = document.querySelectorAll('meta[name="viewport"]')[0];
        meta.setAttribute('content', 'width=640, user-scalable=no, target-densitydpi=device-dpi');
    }

    getSurveyQuestions() {
        this.sApi.surveyLoadUrlGet(this.url).subscribe(data => {
            console.log(data);
            if (data.meta.code !== 200) {
                // 链接已失效
                this.showSurvey = 3;
                return;
            }
            if (data.meta.code === 200 && data.data ) {
                const dd = data.data;
                this.profile = dd.profile;
                // 取得问卷
                this.survey = JSON.parse(dd.survey);
                console.log(this.survey);
                // 取得问卷的问题
                this.surveyQustions = this.survey.pages && this.survey.pages.length ? this.survey.pages[0].questions : [];
                // 格式化问卷问题
                this.surveyQustions = this.formatSurveyQestions(this.surveyQustions);
                console.log(this.surveyQustions);
                // 处理问卷基本信息
                if (this.profile) {
                    this.profileHandle();
                }
                this.showSurvey = 1;
                
            }

        }, err => console.error(err));
    }

    formatSurveyQestions(qs) {
        for ( let i = 0, len = qs.length; i < len; i++ ) {
            let q = qs[i];
            q.answer = '';
            q.hasErr = false;
            if ( q.type === 'score' && q.options.length > 0 ) {
                q.tempPoint = -1;
                this.formatScoreQuestion(q);
            }
            if ( q.type === 'score_multi' && q.children.length > 0 ) {
                q.answer = Array(q.children.length);
                for ( let cq of q.children ) {
                    cq.answer = '';
                    cq.tempPoint = -1;
                    cq.hasErr = false;
                    this.formatScoreQuestion(cq);
                }
            }
            if ( q.type === 'radio' && q.options.length > 0 ) {
                for ( let rq of q.options ) {
                    rq.eid = 'svq-' + q.id + '-' + rq.id;
                }
            }

            if ( q.type === 'stext' ) {
                switch (i) {
                    case 6:
                        // 车牌号
                        q.min = 7;
                        q.max = 9;
                        break;
                    case 7:
                        // 手机号
                        q.min = 0;
                        q.max = 11;
                        break;
                    case 8:
                    case 9:
                        // 车品牌 车型号
                        q.min = 0;
                        q.max = 50;
                        break;
                    default:
                        console.log(i);

                }
            }

        }
        return qs;
    }
    formatScoreQuestion(q) {
        let len = q.options.length;
        if ( len > 0 ) {
            if ( q.options[len - 1].point === 99 ) {
                q.zeroOption = q.options[len - 1];
                q.options.pop();
            }
        }
    }

    // 处理问卷基本信息
    profileHandle() {
        console.log('profile.....')
        const profile = this.profile;
        let questions = this.surveyQustions;
        // 性别
        if ( profile.gender !== null ) {
            let sex = profile.gender === 0 ? '女' : '男';
            for (const opt of questions[4].options) {
                if ( opt.title === sex ) {
                    questions[4].answer = opt.id;
                    break;
                }
            }
        }
        // 出生年份
        if ( profile.birthYear !== null ) {
            let year = parseInt(profile.birthYear, 10);
            year = isNaN(year) ? profile.birthYear : year;
            for (const opt of questions[5].options) {
                if ( opt.title.includes(year) ) {
                    questions[5].answer = opt.id;
                    break;
                }
            }
        }
        // 车牌号
        if ( profile.vehicleLicence !== null) {
            questions[6].answer = profile.vehicleLicence;
        }
        // 手机号 
        if ( profile.mobile !== null) {
            questions[7].answer = profile.mobile;
        }
        // 车品牌 
        if ( profile.vehicleBrand !== null) {
            questions[8].answer = profile.vehicleBrand;
        }
        // 车型号 
        if ( profile.vehicleModel !== null) {
            questions[9].answer = profile.vehicleModel;
        }
        // 购买年份
        if ( profile.birthYear !== null ) {
            let year = parseInt(profile.vehicleYear, 10);
            year = isNaN(year) ? profile.vehicleYear : year;
            for (const opt of questions[10].options) {
                if ( opt.title.includes(year) ) {
                    questions[10].answer = opt.id;
                    break;
                }
            }
        }
        // 行驶里程
        if ( profile.vehicleMiles !== null ) {
            let mile = profile.vehicleMiles.split('公里');
            mile = mile[0].trim();
            for (const opt of questions[11].options) {
                if ( opt.title.includes(mile) ) {
                    questions[11].answer = opt.id;
                    break;
                }
            }
        }
        console.log(this.surveyQustions);
    }

    // 处理多项评分题
    onMscore(q, subq, subidx, ans) {
        let id = 'q_' + q.id + '_' + subq.id;
        console.log(id);
        subq.hasErr = false;
        subq.answer = ans.id;
        subq.tempPoint = ans.point === 99 ? 0 : ans.point;
        
        q.answer[subidx] = {
            questionId: subq.id,
            type: subq.type,
            answers: [ans.id]
        };
        
       
        
    }
    // 处理评分题
    onScore(q, ans) {
        q.answer = ans.id;
        q.tempPoint = ans.point === 99 ? 0 : ans.point;
        q.hasErr = false;
        
    }
    // 处理性别题
    onSex(q, ans) {
        q.answer = ans.id;
        
    }

    onSave() {
        console.log(this.surveyQustions);
        this.surveySubmitObj.answers = [];
        for (let idx = 0, len = this.surveyQustions.length; idx < len; idx++ ) {
            let q = this.surveyQustions[idx];
            switch (q.type) {
                case 'score_multi':
                    for (let i = 0, len = q.answer.length; i < len; i++) {
                        if ( q.answer[i] === undefined ) {
                            // 第 i 个子题没选
                            q.children[i].hasErr = true;
                            alert(`第${idx + 1}题的"${q.children[i].title}"还未评价`);
                            return false;
                        } else {
                            this.surveySubmitObj.answers.push(q.answer[i]);
                        }
                        
                    }
                    break;
                default:
                    if (q.answer === '') {
                        q.hasErr = true;
                        alert(`第${idx + 1}题还未回答`);
                        return false;
                    } else {
                        this.surveySubmitObj.answers.push({
                            questionId: q.id,
                            type: q.type,
                            answers: [q.answer]
                        });
                    }
                        
            }
        }
        console.log(this.surveySubmitObj);
        this.surveySubmitObj.isComplete = true;
        this.sApi.surveyUrlSubmitPost(this.url, this.surveySubmitObj).subscribe(data => {
            console.log(data);
            if (data.meta.code === 200 && data.data) {
                this.showSurvey = 2;
            } else {
                this.showSurvey = 3;
            }

        }, err => console.error(err));
    }
    

    

}
