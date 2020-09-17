import { Component } from '@angular/core';

interface ModalInterface {
    showMessage : boolean;
    modalType : string;
    headerMessage : string;
    bodyMessage : string;
    inputData : any;
    isProcessDone? : boolean;

    setModal( _showMessage : boolean , _modalType : string , _headerMessage : string , _bodyMessage : string , _inputData : any , _isProcessDone? : boolean ) : void;
}

export class Modal implements ModalInterface {
    showMessage: boolean;
    modalType: string;
    headerMessage: string;
    bodyMessage: string;
    inputData: any;
    isProcessDone : boolean;

    constructor( _showMessage : boolean , _modalType : string , _headerMessage : string , _bodyMessage : string , _inputData : any , _isProcessDone? : boolean ) {
        this.showMessage = _showMessage;
        this.modalType = _modalType;
        this.headerMessage = _headerMessage;
        this.bodyMessage = _bodyMessage;
        this.inputData = _inputData;
        this.isProcessDone = _isProcessDone;
    }
    setModal(_showMessage: boolean, _modalType: string, _headerMessage: string, _bodyMessage: string, _inputData: any , _isProcessDone? : boolean ): void {
        this.showMessage = _showMessage;
        this.modalType = _modalType;
        this.headerMessage = _headerMessage;
        this.bodyMessage = _bodyMessage;
        this.inputData = _inputData;
        this.isProcessDone = _isProcessDone;
    }
}