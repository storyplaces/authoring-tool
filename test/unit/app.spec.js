"use strict";
var app_1 = require('../../src/app');
describe('the app', function () {
    it('says hello', function () {
        expect(new app_1.App().message).toBe('Hello World!');
    });
});
