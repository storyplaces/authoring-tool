/**
 * Created by andy on 25/11/16.
 */
import {HttpClient} from "aurelia-fetch-client";
import {autoinject} from "aurelia-framework";
import {Identifiable} from "../interfaces/Identifiable";
import {Config} from "../../config/Config";
import {FetchConfig} from "aurelia-authentication";

@autoinject()
export class StoryPlacesAPI {
    protected _path;

    constructor(protected client: HttpClient, protected config: Config, private fetchConfig: FetchConfig) {
        this.configure();
    }

    private configure() {

        let headers = {};

        headers['Content-Type'] = "application/json";
        headers['Accept'] = "application/json";

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
        if (path.slice(-1) == "/") {
            this._path = path;
        } else {
            this._path = path.concat("/");
        }
        this.fetchConfig.configure(this.client);
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

    delete(id: string): Promise<Response> {
        return this.client.fetch(this.path + id, {
            method: "delete"
        });
    }

    trigger(object: Identifiable, event: string, fields: Array<string> = ['id']): Promise<Response> {
        if (object.id == undefined) {
            throw new Error("Unable to trigger event as no object ID passed");
        }

        let path = `${this.path}${object.id}/${event}`;

        var body = {};
        fields.forEach((field) => {
            body[field] = object[field];
        });

        console.log(JSON.stringify(body));

        return this.client.fetch(path, {
            method: 'post',
            body: JSON.stringify(body)
        });
    }

    uploadItem(storyId: string, itemType: string, formData: FormData): Promise<Response> {
        return this.client.fetch(`${this.path}${storyId}/${itemType}`, {
            method: 'post',
            body: formData
        });
    }
}
