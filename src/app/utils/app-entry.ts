import { ElementArrayFinder } from 'protractor';

export interface AppEntryInterface {
    appDate? : string;
    appCount? : number;
    startTime? : string;
    endTime? : string;
}

export class AppEntry implements AppEntryInterface {
    appDate? : string;
    startTime? : string;
    endTime? : string;
    appCount? : number;

    constructor( _appDate : string , _appCount : number , _startTime : string , _endTime : string ) {
        this.startTime = _startTime || '';
        this.endTime = _endTime || '';
        this.appCount = _appCount || 0;
        this.appDate = _appDate || '';
    }

    static simplify( appEntries : AppEntry[] ) {
        let rows = [];
        appEntries.forEach( entry => {
            const entryTime = `${entry.startTime}-${entry.endTime}`;
            if( rows.filter( rowEntry => 
                    rowEntry.date === entry.appDate && rowEntry.time == entryTime
                 ).length < 1 ) {
                rows.push( { date : entry.appDate , time : entryTime , appCount : entry.appCount } );
            }
        });

        return rows;
    }
}