/**
 * Created by andy on 25/11/16.
 */

import {HttpClient} from 'aurelia-fetch-client';
import {autoinject} from 'aurelia-framework';
import {Identifiable} from "../interfaces/Identifiable";
import {Config} from "../../config/Config";
import {Authenticator} from "../auth/Authenticator";

@autoinject()
export class StoryPlacesAPI {
    protected _path;

    constructor(protected client: HttpClient, protected config: Config, private authenticator: Authenticator) {
        this.configure()
    }

    private configure() {
        let headers = {};

        headers['Content-Type'] = "application/json";
        headers['Accept'] = "application/json";
        //headers['AuthToBeWorkedOut'] = this.authenticator.jwt;

        this.client.configure(config => {
            config
                .withBaseUrl(this.config.read('server'))
                .withDefaults({
                    headers: headers
                })
                .useStandardConfiguration();
        });
    }

    set path(path: string) {
        // Add the trailing / if there is not one already
        if (path.slice(-1) == "/"){
            this._path = path;
        } else {
            this._path = path.concat("/");
        }
    }

    get path(): string {
        return this._path;
    }

    getAll(): Promise<Response> {
        return this.client.fetch(this._path);
    }

    getOne(id: String): Promise<Response> {
        return this.client.fetch(this._path + id);
    }

    save(object: Identifiable): Promise<Response> {
        let method;
        let path;
        if (typeof object.id !== 'undefined') {
            method = 'put';
            path = this._path + object.id;
        } else {
            method = 'post';
            path = this._path;
        }
        return this.client.fetch(path, {
            method: method,
            body: JSON.stringify(object)
        });
    }

    trigger(object: Identifiable, event: string): Promise<Response> {
        if (object.id == undefined) {
            throw new Error("Unable to trigger event as no object ID passed");
        }

        let path = `${this.path}${object.id}/${event}`;

        return this.client.fetch(path, {
            method: 'post',
            body: JSON.stringify({id: object.id})
        });
    }
}
