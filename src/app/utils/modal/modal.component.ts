import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css',
               '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class ModalComponent implements OnInit {
  @Input() modalType : string; // info or confirm
  @Input() showMessage : boolean = true; // TODO: fix sticky modal responsiveness
  @Input() headerMessage : string;
  @Input() bodyMessage : string;
  @Input() dataBody : any;

  @Output() confirm : EventEmitter<any> = new EventEmitter();
  @Output() cancel : EventEmitter<null> = new EventEmitter();

  // TODO: setup event emitter
  // TODO: setup modal type selective display function

  constructor() { }

  ngOnInit(): void {

  }

  emitConfirmation() {
    this.confirm.emit(this.dataBody);
  }

  cancelModal() {
    this.cancel.emit();
  }
}
