import {TypeChecker} from "../../../src/resources/utilities/TypeChecker";
/*******************************************************************
 *
 * StoryPlaces
 *
 This application was developed as part of the Leverhulme Trust funded
 StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk
 Copyright (c) $today.year
 University of Southampton
 Charlie Hargood, cah07r.ecs.soton.ac.uk
 Kevin Puplett, k.e.puplett.soton.ac.uk
 David Pepper, d.pepper.soton.ac.uk

 All rights reserved.
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 * The name of the University of Southampton nor the name of its
 contributors may be used to endorse or promote products derived from
 this software without specific prior written permission.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED. IN NO EVENT SHALL THE ABOVE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

describe("TypeChecker", () => {

    //region String
    it("throws an error if type checking a string and you don't pass a string", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateAsStringOrUndefined("test", 1)
        }).toThrow();
    });

    it("does not throw an error if type checking a string and you pass a string", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateAsStringOrUndefined("test", "a")
        }).not.toThrow();
    });

    it("does not throw an error if type checking a string and you pass undefined", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateAsStringOrUndefined("test", undefined)
        }).not.toThrow();
    });
    //endregion

    //region Number
    it("throws an error if type checking a number and you don't pass a number", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateAsNumberOrUndefined("test", "a")
        }).toThrow();
    });

    it("does not throw an error if type checking a number and you pass a number", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateAsNumberOrUndefined("test", 1)
        }).not.toThrow();
    });

    it("does not throw an error if type checking a number and you pass a number", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateAsNumberOrUndefined("test", undefined)
        }).not.toThrow();
    });
    //endregion

    //region Boolean
    it("throws an error if type checking a boolean and you don't pass a boolean", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateAsBooleanOrUndefined("test", "a")
        }).toThrow();
    });

    it("does not throw an error if type checking a boolean and you pass a boolean", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateAsBooleanOrUndefined("test", true)
        }).not.toThrow();
    });

    it("does not throw an error if type checking a boolean and you pass a boolean", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateAsBooleanOrUndefined("test", undefined)
        }).not.toThrow();
    });
    //endregion

    //region Object
    it("throws an error if type checking an object and you don't pass an object", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateAsObjectOrUndefined("test", "a", "testObject", Function);
        }).toThrow();
    });

    it("throws an error if type checking an object and you don't pass that object", () => {
        class TestClass {
        }

        let typeChecker = new TypeChecker();
        let testClass = new TestClass();

        expect(() => {
            typeChecker.validateAsObjectOrUndefined("test", testClass, "testObject", TypeChecker);
        }).toThrow();
    });

    it("does not throw an error if type checking an object and you do pass that object", () => {
        class TestClass {
        }

        let typeChecker = new TypeChecker();
        let testClass = new TestClass();

        expect(() => {
            typeChecker.validateAsObjectOrUndefined("test", testClass, "testObject", TestClass);
        }).not.toThrow();
    });

    it("does not throw an error if type checking an object and you do pass undefined", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateAsObjectOrUndefined("test", undefined, "testObject", TypeChecker);
        }).not.toThrow();
    });
    //endregion

    //region Value comparison
    it("throws an error if comparing values and expected and actual don't match (string vs string)", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateScalarValue("test", "expected", "actual")
        }).toThrow();
    });

    it("throws an error if comparing values and expected and actual don't match (string vs number)", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateScalarValue("test", "expected", 1)
        }).toThrow();
    });

    it("throws an error if comparing values and expected and actual don't match (boolean vs number)", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateScalarValue("test", true, 1)
        }).toThrow();
    });

    it("throws an error if comparing values and expected and actual don't match (undefined vs number)", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateScalarValue("test", undefined, 1)
        }).toThrow();
    });

    it("does not throw an error if comparing values and expected and actual do match (string)", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateScalarValue("test", "expected", "expected")
        }).not.toThrow();
    });

    it("does not throw an error if comparing values and expected and actual do match (number)", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateScalarValue("test", 12, 12)
        }).not.toThrow();
    });

    it("does not throw an error if comparing values and expected and actual do match (boolean)", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateScalarValue("test", true, true);
        }).not.toThrow();
    });

    it("does not throw an error if comparing values and expected and actual do match (undefined)", () => {
        let typeChecker = new TypeChecker();
        expect(() => {
            typeChecker.validateScalarValue("test", undefined, undefined);
        }).not.toThrow();
    });
    //endregion

    //region Plain object
    describe("method validateAsObjectAndNotArray", () => {
        it("throws an error if you don't pass an object", () => {
            let typeChecker = new TypeChecker();
            expect(() => {
                typeChecker.validateAsObjectAndNotArray("test", "a");
            }).toThrow();
        });

        it("throws an error if you pass an array", () => {
            let typeChecker = new TypeChecker();
            expect(() => {
                typeChecker.validateAsObjectAndNotArray("test", ["a"]);
            }).toThrow();
        });

        it("does not throw an error if you pass an object", () => {
            let typeChecker = new TypeChecker();
            expect(() => {
                typeChecker.validateAsObjectAndNotArray("test", {a: "a"});
            }).not.toThrow();
        });

        it("does not throw an error if you pass undefined", () => {
            let typeChecker = new TypeChecker();
            expect(() => {
                typeChecker.validateAsObjectAndNotArray("test", undefined);
            }).not.toThrow();
        });
    });
    //endregion

    describe("method isArrayOf", () => {
        it("does not throw an error if you pass an array of the required type", () => {
            let typeChecker = new TypeChecker();

            expect(() => {
                typeChecker.isArrayOf("field", ["a", "b", "c"], "string");
            }).not.toThrow();
        });

        it("throws an error if you pass an array with an item of the wrong type", () => {
            let typeChecker = new TypeChecker();

            expect(() => {
                typeChecker.isArrayOf("field", ["a", "b", 1], "string");
            }).toThrow();
        });

        it("throws an error if you pass something other than an array", () => {
            let typeChecker = new TypeChecker();

            expect(() => {
                typeChecker.isArrayOf("field", "a", "string");
            }).toThrow();
        });

        it("throws an error if you pass undefined", () => {
            let typeChecker = new TypeChecker();

            expect(() => {
                typeChecker.isArrayOf("field", undefined, "string");
            }).toThrow();
        });
    });

    describe("method isUndefinedOrArrayOf", () => {
        it("will not throw and error if undefined is passed", () => {
            let typeChecker = new TypeChecker();

            expect(() => {
                typeChecker.isUndefinedOrArrayOf("field", undefined, "string");
            }).not.toThrow();
        });

        it("will defer to isArrayOf if something other than undefined is passed", () => {
            let typeChecker = new TypeChecker();
            spyOn(typeChecker, 'isArrayOf').and.returnValue(undefined);

            typeChecker.isUndefinedOrArrayOf("field", ["a", "b", "c"], "string");
            expect(typeChecker.isArrayOf).toHaveBeenCalledWith("field", ["a", "b", "c"], "string");
        });
    });

    describe("method isTimePatternString", () => {
        it("will not throw an error if passed a time pattern string", () => {
            let typeChecker = new TypeChecker();

            expect(() => {
                typeChecker.isTimePatternString("field", "12:12");
            }).not.toThrow();
        });

        it("will throw an error if passed a non time pattern string", () => {
            let typeChecker = new TypeChecker();

            expect(() => {
                typeChecker.isTimePatternString("field", "abc");
            }).toThrow();
        });

        it("will throw an error if passed something other than a string", () => {
            let typeChecker = new TypeChecker();

            expect(() => {
                typeChecker.isTimePatternString("field", 123);
            }).toThrow();
        });

    });
});
 