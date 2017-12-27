System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var StateMachine;
    return {
        setters: [],
        execute: function () {
            StateMachine = (function () {
                function StateMachine(cfg) {
                    this.eventMap = {};
                    this.stateMap = {};
                    this.eventCb = { before: {}, after: {} };
                    this.stateCb = { enter: {}, leave: {} };
                    this.debug = cfg.debug || false;
                    this.inital = cfg.initial;
                    this.state = cfg.initial;
                    for (var i = 0; i < cfg.events.length; i += 1) {
                        var froms = (cfg.events[i].from instanceof Array) ?
                            cfg.events[i].from : [cfg.events[i].from];
                        for (var j = 0; j < froms.length; j += 1) {
                            this.eventMap['' + froms[j]] = this.eventMap['' + froms[j]] || {};
                            this.eventMap['' + froms[j]]['' + cfg.events[i].name] = cfg.events[i].to;
                        }
                    }
                }
                StateMachine.prototype.input = function (event) {
                    var func;
                    if (this.debug) {
                        console.log('Event: ', event, 'Before: ', this.state);
                    }
                    if (func = this.eventCb.before['' + event]) {
                        func();
                    }
                    if (this.eventMap['' + this.state]['' + event] === undefined) {
                        this.error(this.state, event);
                        return false;
                    }
                    var prevState = this.state;
                    this.state = this.eventMap['' + prevState]['' + event];
                    if (func = this.stateCb.enter['' + this.state]) {
                        func();
                    }
                    if (func = this.stateCb.leave['' + prevState]) {
                        func();
                    }
                    if (func = this.eventCb.after['' + event]) {
                        func();
                    }
                    if (this.debug) {
                        console.log('Event: ', event, 'After: ', this.state);
                    }
                    return true;
                };
                StateMachine.prototype.canInput = function (event) {
                    return true;
                };
                StateMachine.prototype.go = function (state) {
                    var func;
                    return true;
                };
                StateMachine.prototype.canGo = function (state) {
                    return true;
                };
                StateMachine.prototype.is = function (state) { return state == this.state; };
                StateMachine.prototype.current = function () { return this.state; };
                StateMachine.prototype.reset = function () { this.state = this.inital; };
                StateMachine.prototype.onBefore = function (event, cb) { this.eventCb.before['' + event] = cb; };
                StateMachine.prototype.onAfter = function (event, cb) { this.eventCb.after['' + event] = cb; };
                StateMachine.prototype.onEnter = function (state, cb) { this.stateCb.enter['' + state] = cb; };
                StateMachine.prototype.onLeave = function (state, cb) { this.stateCb.leave['' + state] = cb; };
                StateMachine.prototype.onError = function (cb) { this.errorCb = cb; };
                StateMachine.prototype.error = function (from, event, to) {
                    var func;
                    if (func = this.errorCb) {
                        func(from, event);
                    }
                    console.log("error when transition from ", from, " ", event);
                };
                return StateMachine;
            }());
            exports_1("StateMachine", StateMachine);
        }
    };
});
