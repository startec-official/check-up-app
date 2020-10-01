import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appModalFooter]'
})
export class ModalFooterDirective {

  constructor(public tpl : TemplateRef<any>) { }

}
