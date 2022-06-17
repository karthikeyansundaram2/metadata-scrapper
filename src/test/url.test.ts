/* eslint-disable @typescript-eslint/no-var-requires */
// const LambdaTester = require('lambda-tester');
const expect = require('chai').expect;

import { handler } from "../functions/url";
describe('myLambda', function () {
    [
        "https://ogp.me/",
        "https://www.npmjs.com/package/cheerio"

    ].forEach(function (validUrl) {
        it(`successful invocation: body=${JSON.stringify({ "url": validUrl})}`, function (done) {

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const context = {
                succeed: function (result) {
                    expect(result).to.exist;
                    done();
                },

                fail: function () {

                    done(new Error('never context.fail'));
                }
            }
            handler({ body: { "url": validUrl } }, { /* context */ }, (err, result) => {

                try {
                    expect(err).to.not.exist;
                    expect(result).to.exist;
                    done();
                }
                catch (error) {

                    done(error);
                }
            });
        });
    });

    [
        "qwerty",
        " "

    ].forEach(function (invalidUrl) {

        it(`fail: when url is invalid: body=${JSON.stringify({ "url": invalidUrl })}`, function (done) {
            handler({ body: { "url": invalidUrl } }, { /* context */ }, (err, result) => {
                try {
                    console.log("result", err, result)
                    expect(err).to.exist;
                    expect(result).to.not.exist;

                    done();
                }
                catch (error) {
                    done(error);
                }
            });
        });
    });
});