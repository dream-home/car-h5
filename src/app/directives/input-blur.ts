import { Directive,ElementRef,Renderer } from '@angular/core';

@Directive({
  selector: 'input,select',
  host: {'(blur)': 'onBlur($event)'}
})
export class BlurForwarder {
  constructor(private elRef:ElementRef, private renderer:Renderer) {}

  onBlur($event) {
    this.renderer.invokeElementMethod(this.elRef.nativeElement,
        'dispatchEvent',
        [new CustomEvent('input-blur', { bubbles: true })]);
  }
}
