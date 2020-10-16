import { Moment } from 'moment';

interface ClientInterface {
    userId : number;
    name : string;
    date : Moment;
    time : string;
    order : number;
    contactNumber : string;
    code : string;
    reason? : string;
}

export class Client implements ClientInterface {
    userId : number;
    name: string;
    date: Moment;
    time: string;
    order : number;
    contactNumber : string;
    code : string;
    reason? : string;

    constructor( _userId : number , _name : string , _date : Moment , _time : string , _order : number, _contactNumber : string , _code : string , _reason? : string ) {
        this.userId = _userId;
        this.name = _name;
        this.date = _date;
        this.time = _time;
        this.order = _order;
        this.contactNumber = _contactNumber;
        this.code = _code;
        this.reason = _reason;
    }
}
