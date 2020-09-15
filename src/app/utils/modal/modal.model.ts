interface ModalInterface {
    showMessage : boolean;
    modalType : string;
    headerMessage : string;
    bodyMessage : string;
    inputData : any;
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
    
}