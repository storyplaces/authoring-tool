import {Aurelia} from "aurelia-framework";
import environment from "./environment";
import {AuthConfig} from "./resources/auth/AuthConfig";
import {Config} from "./config/Config";

//Configure Bluebird Promises.
(<any>Promise).config({
    longStackTraces: environment.debug,
    warnings: {
        wForgottenReturn: false
    }
});

export function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .feature('resources')
        .plugin('aurelia-validation')
        .plugin("aurelia-dialog")
        .plugin('aurelia-api', config => {
            config.registerEndpoint('auth');
        })
        .plugin('aurelia-authentication', baseConfig => {
            baseConfig.configure((new AuthConfig(new Config)).authConfig);
        });

    if (environment.debug) {
        aurelia.use.developmentLogging();
    }

    if (environment.testing) {
        aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(() => aurelia.setRoot());
}
