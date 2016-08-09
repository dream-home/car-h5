import {
  Component,Input
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'page-footer',
  template: require('./pageFooter.html'),
  styles: [require('./pageFooter.scss')]
})

export class PageFooterComponent {
  @Input() cls: string;
  @Input() footContent: string;
  constructor() {}
  ngOnInit() {
    if (!this.footContent) {
      this.footContent = '2006-2016 All rights reserved 上海皓煦数据技术有限公司 沪ICP备08012157号-5';
    }    
  }
}
