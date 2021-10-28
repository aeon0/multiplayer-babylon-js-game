// Code is from this github repo: https://github.com/zhfuzzy/tfsm
// It seems quite abondend, that's why I copy pasted it to tweak it to my needs

export interface StateMachineConfig<StateEnum, EventEnum> {
    initial?: StateEnum,
    events: any,
    debug?: boolean
}

export class StateMachine<StateEnum, EventEnum> {
    private inital: StateEnum;

    private state: StateEnum;

    private asyncing: boolean;

    private eventMap: { [from: string]: { [event: string]: StateEnum } } = {};

    private stateMap: { [from: string]: [string] } = {};

    private eventCb: {
        before: { [event: string]: Function },
        after: { [event: string]: Function }
    } = { before: {}, after: {} };

    private stateCb: {
        enter: { [event: string]: Function },
        leave: { [event: string]: Function }
    } = { enter: {}, leave: {} };

    private errorCb: Function;
    private debug: boolean;

    constructor(cfg: StateMachineConfig<StateEnum, EventEnum>) {
        console.log(cfg);
        this.debug = cfg.debug || false;
        this.inital = cfg.initial;
        this.state = cfg.initial;

        for (let i = 0; i < cfg.events.length; i += 1) {
            // to statisfy type infer, actualy this should be StateEnum[]
            let froms: any = (cfg.events[i].from instanceof Array) ?
                cfg.events[i].from : [cfg.events[i].from];

            for (let j = 0; j < froms.length; j += 1) {
                this.eventMap['' + froms[j]] = this.eventMap['' + froms[j]] || {};
                this.eventMap['' + froms[j]]['' + cfg.events[i].name] = cfg.events[i].to;
            }
        }
    }

    input(event: EventEnum): boolean {
        let func: Function;
        if (this.debug) { console.log('Event: ', event, 'Before: ', this.state); }

        if (func = this.eventCb.before['' + event]) { func(); }
        if (this.eventMap['' + this.state]['' + event] === undefined) {
            this.error(this.state, event);
            return false;
        }

        let prevState = this.state;

        this.state = this.eventMap['' + prevState]['' + event];

        if (func = this.stateCb.enter['' + this.state]) { func(); }
        if (func = this.stateCb.leave['' + prevState]) { func(); }
        if (func = this.eventCb.after['' + event]) { func(); }

        if (this.debug) { console.log('Event: ', event, 'After: ', this.state); }
        return true;
    }

    // TODO
    canInput(event: EventEnum): boolean {
        return true;
    }

    // TODO
    go(state: StateEnum): boolean {
        let func: Function;
        return true;
    }

    // TODO
    canGo(state: StateEnum): boolean {
        return true;
    }

    is(state: StateEnum) { return state == this.state; }

    current() { return this.state; }

    reset() { this.state = this.inital; }

    onBefore(event: EventEnum, cb: Function) { this.eventCb.before['' + event] = cb; }

    onAfter(event: EventEnum, cb: Function) { this.eventCb.after['' + event] = cb; }

    onEnter(state: StateEnum, cb: Function) { this.stateCb.enter['' + state] = cb; }

    onLeave(state: StateEnum, cb: Function) { this.stateCb.leave['' + state] = cb; }

    onError(cb: Function) { this.errorCb = cb; }

    error(from: StateEnum, event: EventEnum, to?: StateEnum) {
        let func: Function;
        if (func = this.errorCb) { func(from, event); }
        console.log("error when transition from ", from, " ", event);
    }
}