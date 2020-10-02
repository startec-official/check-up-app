import { Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ModalBodyDirective } from './modal-body.directive';
import { ModalFooterDirective } from './modal-footer.directive';
import { ModalHeaderDirective } from './modal-header.directive';

@Component({
  selector: 'app-mod-modal',
  templateUrl: './mod-modal.component.html',
  styleUrls: ['./mod-modal.component.css',
              '../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class ModModalComponent implements OnInit {

  @Input() dataBody : any;
  @Input() visibilityEventEmitter : EventEmitter<any>;
  
  showModal : boolean = false;

  @ContentChild( ModalHeaderDirective, {static : true} ) modalHeaderDirective : ModalHeaderDirective;
  @ContentChild( ModalBodyDirective , {static:true} ) modalBodyDirective : ModalBodyDirective;
  @ContentChild( ModalFooterDirective , {static: true} ) modalFooterDirective : ModalFooterDirective;

  get modalHeaderTpl() : TemplateRef<any> {
    return this.modalHeaderDirective && this.modalHeaderDirective.tpl;
  }

  get modalBodyTpl() : TemplateRef<any> {
    return this.modalBodyDirective && this.modalBodyDirective.tpl;
  }

  get modalFooterTpl() : TemplateRef<any> {
    return this.modalFooterDirective && this.modalFooterDirective.tpl;
  }

  get modalHeaderContext() : object {
    return { $implicit : () => {
      this.closeModal();
    }}
  }

  get modalFooterContext() : object {
    return { $implicit : () => {
      this.closeModal();
    }}
  }

  constructor() { }

  ngOnInit(): void {
    if( this.visibilityEventEmitter !== null ) {
      this.visibilityEventEmitter.subscribe(( visibility : string ) => {
        if( visibility == 'show' ) {
          this.showModal = true;
        }
        else if( visibility == 'hide' ) {
          this.showModal = false;
        }
      });
    }
  }

  closeModal() {
    this.showModal = false;
  }

}
