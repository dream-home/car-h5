import { Component, Input, Output, NgZone } from '@angular/core';
import { COMMON_DIRECTIVES, NgSwitch, NgSwitchDefault } from '@angular/common';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';

import { SurveyApi, SurveySubmitRequest } from 'client';
import * as _ from 'lodash';
declare var jQuery: JQueryStatic;

@Component({
    moduleId: module.id,
    selector: 'survey-mobile',
    styles: [require('./surveyMobile.scss')],
    template: require('./surveyMobile.html'),
    directives: [ROUTER_DIRECTIVES, COMMON_DIRECTIVES, NgSwitch, NgSwitchDefault],
    providers: [SurveyApi]
})
export class SurveyMobileComponent {
    sub: any;
    url: string = '';
    survey: any;
    surveyQustions: Array<any> = [];
    surveySubmitObj = {
        sampleId: undefined,
        isComplete: false,
        answers: []
    };
    // surveySubmitObj: SurveySubmitRequest;
    answersObj = {};
    // 1 为显示问卷， 2 为问卷答完保存成功 3为已经答过了或没有url
    showSurvey: number = 0;
    currentPage: number = 0;
    waitingPage: number = 0;
    tempPageAnswers = [];
    profile: any;
    constructor( private router: Router, private route: ActivatedRoute, private sApi: SurveyApi ) {
    }
    ngOnInit() {
        this.createMeta();
        // 获取 url
        this.sub = this.route.params.subscribe(params => {
            this.url = params['url'];
            if (this.url) {
                this.getSurveyQuestions();
            } else {
                this.showLastCreen(3);
            }
        });
    }

    // 显示最后一屏
    showLastCreen(status) {
        this.showSurvey = status;
        this.currentPage = 100;
        this.waitingPage = 100;
    }

    // 显示问卷首页 
    showFirstCreen() {
        this.showSurvey = 1;
        this.currentPage = 0;
        this.waitingPage = 0;
    }
    // 添加 viewport = 640
    createMeta() {
        let meta = document.querySelectorAll('meta[name="viewport"]')[0];
        meta.setAttribute('content', 'width=640, user-scalable=no, target-densitydpi=device-dpi');
    }

    // 获取问卷
    getSurveyQuestions() {
        this.sApi.surveyLoadUrlGet(this.url).subscribe(data => {
            if (data.meta.code !== 200) {
                this.showLastCreen(3);
                return;
            }
            if (data && data.data) {
                const dd = data.data;
                this.profile = dd.profile;
                // 取得问卷
                this.survey = JSON.parse(dd.survey);
                // 取得问卷的问题
                this.surveyQustions = this.survey.pages && this.survey.pages.length ? this.survey.pages[0].questions : [];
                // 格式化问卷问题
                this.surveyQustions = this.formatSurveyQestions(_.cloneDeep(this.surveyQustions));
                // 处理问卷基本信息
                if (this.profile) {
                    this.profileHandle();
                }
                this.showFirstCreen();
            }
        }, err => console.error(err));
    }

    formatSurveyQestions(qs) {
        for ( let i = 0, len = qs.length; i < len; i++ ) {
            let q = qs[i];
            q.answer = '';
            q.hasErr = false;
            q.errMsg = '';
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
                        q.subtype = 'car-plate';
                        q.disabled = true;
                        q.min = 7;
                        q.max = 9;
                        break;
                    case 7:
                        // 手机号
                        q.subtype="mobile";
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
        if ( profile.vehicleYear !== null ) {
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
    }

    // 处理多项评分题
    onMscore(q, subq, subidx, ans) {
        let id = 'q_' + q.id + '_' + subq.id;
        subq.hasErr = false;
        subq.answer = ans.id;
        subq.tempPoint = ans.point === 99 ? 0 : ans.point;
        q.hasErr = false;
        q.errMsg = '';
        q.answer[subidx] = {
            questionId: subq.id,
            type: subq.type,
            answers: [ans.id]
        };
        
       
        
    }
    // 处理评分题
    onScore(q, ans) {
        let id = 'q_' + q.id;
        q.answer = ans.id;
        q.tempPoint = ans.point === 99 ? 0 : ans.point;
        q.hasErr = false;
        q.errMsg = '';
        
    }
    // 处理性别题
    onSex(q, ans) {
        let id = 'q_' + q.id;
        q.answer = ans.id;
        q.hasErr = false;
        q.errMsg = '';
    }

    onSave() {

        this.surveySubmitObj.isComplete = true;
        this.surveySubmitObj.sampleId = this.surveySubmitObj.sampleId || null;
        this.sApi.surveyUrlSubmitPost(this.url, this.surveySubmitObj).subscribe(data => {
            if (data.meta.code === 200 && data.data) {
                this.showLastCreen(2);
            } else {
                this.showLastCreen(3);
            }
        }, err => console.error(err));
    }
    


    // 去某一屏
    goto(page) {
        this.currentPage = page;
        setTimeout(() => {
            this.waitingPage = page;
        }, 800);
    }

    gotoNext(page) {
        let valid = true;
        if (page !== 100) {
            switch (page) {
                case 2:
                case 3:
                case 4:
                    // 验证第一题 验证第二题 验证第三题
                    valid = this.scoreMultiValid(this.surveyQustions[page - 2], page - 2, page);
                    break;
                case 5:
                    // 验证第四题
                    valid = this.questionGroupValid([3], 4);
                    break;
                case 6:
                    // 验证第五题 验证第六题 验证第七题
                    valid = this.questionGroupValid([4, 5, 6], 5);
                    break;
                case 7:
                    // 验证第八题 验证第九题 验证第十题
                    valid = this.questionGroupValid([7, 8, 9], 6);
                    break;
                case 8:
                    // 验证第十一题
                    valid = this.questionGroupValid([10], 7);
                    break;
                default:
                    console.log(page);
            }
            if (valid) {
                this.goto(page);
            }
        } else {
            // 验证第十二题
            valid = this.questionGroupValid([11], 8);
            if (valid) {
                this.onSave();
            }
        }
            
    }

    // 多项评分题验证
    scoreMultiValid(q, idx, page) {
        let tempArr = [];
        for (let i = 0, len = q.answer.length; i < len; i++) {
            if ( q.answer[i] === undefined ) {
                // 第 i 个子题没选
                q.children[i].hasErr = true;
                // alert(`第${idx + 1}题的"${q.children[i].title}"还未评价`);
                q.hasErr = true;
                q.errMsg = '该问题没有回答完整，请继续作答';
                this.mScroll('p-thzs-q-' + (page - 1) );
                return false;
            } else {
                tempArr.push(q.answer[i]);
            }
        }
        this.surveySubmitObj.answers = this.surveySubmitObj.answers.concat(tempArr);
        return true;
    }
    // 常规问题验证
    questionValid (q, idx, page) {
        if ( q.type === 'stext' && !this.stextBlur(q, idx) ) {
            let position = jQuery('#thzs-q-' + (idx + 1)).position();
            this.mScroll('p-thzs-q-' + page, position.top );
            return false;
        }
        if (q.answer === '') {
            // q.hasErr = true;
            // alert(`第${idx + 1}题还未回答`);
            q.hasErr = true;
            q.errMsg = '请您回答该题';
            this.mScroll('p-thzs-q-' + page, 0 );
            return false;
        }
        this.tempPageAnswers.push({
            questionId: q.id,
            type: q.type,
            answers: [q.answer]
        });
        return true;
    }

    // 每页问题组验证
    questionGroupValid (idxArr, page) {
        this.tempPageAnswers = [];
        for (const idx of idxArr) {
            if (!this.questionValid(this.surveyQustions[idx], idx, page)) {
                return false;
            }
            
        }
        this.surveySubmitObj.answers = this.surveySubmitObj.answers.concat(this.tempPageAnswers);
        return true;
    }

    //滚动到指定位置
    mScroll(id, top = 0) {
        jQuery('#' + id).animate({
            scrollTop: top
        }, 1000);
    }
    
    stextBlur(q, i) {
        if (q.answer === '') {
            q.hasErr = true;
            q.errMsg = '请您回答该题';
            return false;
        }
        if ( q.subtype && q.subtype === 'mobile' ) {
            if (!/^(13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[579])[0-9]{8}$/.test(q.answer)) {
                q.hasErr = true;
                q.errMsg = '请输入正确的手机号!';
                return false;
            }
        }
        if (q.subtype && q.subtype === 'car-plate') {
            if ( q.answer.length < 7 ) {
                q.hasErr = true;
                q.errMsg = '请输入正确的车牌号!';
                return false;
            }
        }
        return true;
    }

    stextFocus(q) {
        q.hasErr = false;
        q.errMsg = '';
    }

}
