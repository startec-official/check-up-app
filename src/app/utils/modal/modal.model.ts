import { Component } from '@angular/core';

interface ModalInterface {
    showMessage : boolean;
    modalType : string;
    headerMessage : string;
    bodyMessage : string;
    inputData : any;

    setModal( _showMessage : boolean , _modalType : string , _headerMessage : string , _bodyMessage : string , _inputData : any ) : void;
}

export class Modal implements ModalInterface {
    showMessage: boolean;
    modalType: string;
    headerMessage: string;
    bodyMessage: string;
    inputData: any;

    constructor( _showMessage : boolean , _modalType : string , _headerMessage : string , _bodyMessage : string , _inputData : any ) {
        this.showMessage = _showMessage;
        this.modalType = _modalType;
        this.headerMessage = _headerMessage;
        this.bodyMessage = _bodyMessage;
        this.inputData = _inputData;
    }
    setModal(_showMessage: boolean, _modalType: string, _headerMessage: string, _bodyMessage: string, _inputData: any): void {
        this.showMessage = _showMessage;
        this.modalType = _modalType;
        this.headerMessage = _headerMessage;
        this.bodyMessage = _bodyMessage;
        this.inputData = _inputData;
    }
}