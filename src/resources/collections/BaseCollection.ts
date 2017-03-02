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
import {Identifiable} from "../interfaces/Identifiable";

export abstract class BaseCollection<DATA_TYPE extends Identifiable> {


    protected _data: Array<DATA_TYPE> = [];

    public length(): number {
        return this._data.length;
    }

    get all(): Array<DATA_TYPE> {
        return this._data;
    }

    public get(id: string): DATA_TYPE {
        return this._data.find(item => item.id == id)
    }

    public getMany(ids: Array<string>): Array<DATA_TYPE> {
        let items: Array<DATA_TYPE> = [];
        for(let id of ids){
            items.push(this.get(id));
        }
        return items;
    }

    public getOrFail(id: string, type?: string): DATA_TYPE {
        let item: DATA_TYPE = this.get(id);

        if (!item) {
            throw Error("Unable to get " + type || "item" + " with id " + id);
        }

        return item
    }

    public save(passedItem: any): string {
        let item = this.itemFromObject(passedItem);

        if (item.id == undefined) {
            item.id = this.getNewUniqueId();
        }

        let foundIndex = this.findIndex(item);

        if (foundIndex !== undefined) {
            this._data[foundIndex] = item;
            return item.id;
        }

        this._data.push(item);

        return item.id;
    }

    public getNewUniqueId() {
        let guid = this.guid();
        while (this.findIndexById(guid)!=undefined) {
            guid = this.guid();
        }
        return guid;
    }

    public guid() {
        let group = () => {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        };
        return (group() + group() + "-" + group() + "-4" + group().substr(0, 3) + "-" + group() + "-" + group() + group() + group()).toLowerCase();
    }

    protected findIndex(item: DATA_TYPE): number|null {
        return this.findIndexById(item.id);
    }

    private findIndexById(itemId: string): number|null {
        let foundIndex = this._data.findIndex(found => found.id == itemId);
        return foundIndex != -1 ? foundIndex : undefined;
    }

    public saveMany(items: Array<any>): void {
        items.forEach(item => {
            this.save(item)
        });
    }

    public remove(id: string): void {
        let foundIndex = this.findIndexById(id);
        if (foundIndex != null) {
            this._data.splice(foundIndex, 1);
        }
    }

    public toArray(): Array<DATA_TYPE> {
        return this._data;
    }

    public toJSON(): Array<DATA_TYPE> {
        return this._data;
    }

    public forEach(callback, thisArg = null) {
        this._data.forEach(callback, thisArg);
    }

    protected itemFromObject(item: any): DATA_TYPE {
        return item as DATA_TYPE;
    }

    protected checkIfCollection(data: any) {
        if (data instanceof BaseCollection) {
            return data.toArray();
        }

        return data;
    }
}