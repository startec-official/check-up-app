interface ClientInterface {
    name : string;
    date : string;
    time : string;
    order : number;
    contactNumber : string;
    reason? : string;
}

export class Client implements ClientInterface {
    name: string;
    date: string;
    time: string;
    order : number;
    contactNumber : string;
    reason? : string;

    constructor( _name : string , _date : string , _time : string , _order : number, _contactNumber : string , _reason? : string ) {
        this.name = _name;
        this.date = _date;
        this.time = _time;
        this.order = _order;
        this.contactNumber = _contactNumber;
        this.reason = _reason;
    }
}
