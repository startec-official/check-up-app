export interface AppEntryInterface {
    appCount? : number;
    startTime? : string;
    endTime? : string;
}

export class AppEntry implements AppEntryInterface {
    startTime? : string;
    endTime? : string;
    appCount? : number;

    constructor( _appCount : number , _startTime : string , _endTime : string ) {
        this.startTime = _startTime || '';
        this.endTime = _endTime || '';
        this.appCount = _appCount || 0;
    }
}