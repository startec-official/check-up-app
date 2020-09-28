import { Moment } from 'moment';

interface ClientInterface {
    userId : number;
    name : string;
    date : Moment;
    time : string;
    order : number;
    contactNumber : string;
    reason? : string;
}

export class Client implements ClientInterface {
    userId : number;
    name: string;
    date: Moment;
    time: string;
    order : number;
    contactNumber : string;
    reason? : string;

    constructor( _userId : number , _name : string , _date : Moment , _time : string , _order : number, _contactNumber : string , _reason? : string ) {
        this.userId = _userId;
        this.name = _name;
        this.date = _date;
        this.time = _time;
        this.order = _order;
        this.contactNumber = _contactNumber;
        this.reason = _reason;
    }
}
