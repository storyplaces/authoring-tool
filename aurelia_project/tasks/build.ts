import * as gulp from "gulp";
import transpile from "./transpile";
import dist from "./dist";
import processMarkup from "./process-markup";
import processCSS from "./process-css";
import copyBootstrap from "./copy-bootstrap";
import {build} from "aurelia-cli";
import * as project from "../aurelia.json";

export default gulp.series(
    readProjectConfiguration,
    gulp.parallel(
        transpile,
        processMarkup,
        processCSS,
        copyBootstrap
    ),
    writeBundles,
    dist
);

function readProjectConfiguration() {
    return build.src(project);
}

function writeBundles() {
    return build.dest();
}
