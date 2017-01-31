/*******************************************************************
 *
 * StoryPlaces
 *
 This application was developed as part of the Leverhulme Trust funded
 StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk
 Copyright (c) 2016
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

export class TypeChecker {
    protected validateAsScalarOrUndefined(fieldName: string, value: any, scalarType: string) {
        if (value !== undefined && typeof value !== scalarType) {
            throw TypeError(fieldName + " must be a " + scalarType + ", a " + typeof value + " was passed.");
        }
    }

    validateAsStringOrUndefined(fieldName: string, value: any) {
        this.validateAsScalarOrUndefined(fieldName, value, 'string');
    }

    validateAsNumberOrUndefined(fieldName: string, value: any) {
        this.validateAsScalarOrUndefined(fieldName, value, 'number');
    }

    validateAsBooleanOrUndefined(fieldName: string, value: any) {
        this.validateAsScalarOrUndefined(fieldName, value, 'boolean');
    }

    validateAsObjectOrUndefined(fieldName: string, value: any, objectName: string, object: Function) {
        if (value !== undefined && !(value instanceof object)) {
            throw TypeError(fieldName + " must be of type " + objectName);
        }
    }

    validateScalarValue(fieldName: string, expected: any, actual: any) {
        if (expected !== actual) {
            throw TypeError(fieldName + " was expected to be " + expected + " but was " + actual);
        }
    }

    validateAsObjectAndNotArray(fieldName: string, value: any) {
        this.validateAsObjectOrUndefined(fieldName, value, "Object", Object);

        if (Array.isArray(value)) {
            throw TypeError(fieldName + " was expected not to be an array");
        }
    }

    isArrayOf(fieldName: string, value:any, itemType:string) {
        if (!Array.isArray(value)) {
            throw new TypeError(fieldName + " is not an array");
        }

        value.forEach((item) => {
            this.validateAsScalarOrUndefined(fieldName + " item", item, itemType);
        });
    }

    isUndefinedOrArrayOf(fieldName: string, value: any, itemType: string) {
        if (value === undefined) {
            return;
        }

        this.isArrayOf(fieldName, value, itemType)
    }

    isTimePatternString(fieldName: string, value:any) {
        if (value === undefined) {
            return;
        }

        this.validateAsStringOrUndefined(fieldName, value);

        let reg = new RegExp('^[0-9]{1,2}:[0-9]{2}$');
        if (!reg.test(value)) {
            throw TypeError("The contents of " + fieldName + " must be in the format HH:MM");
        }
    }
}