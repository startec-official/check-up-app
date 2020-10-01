import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appModalBody]'
})
export class ModalBodyDirective {

  constructor(public tpl : TemplateRef<any>) { }

}
