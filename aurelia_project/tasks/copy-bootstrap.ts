import * as gulp from 'gulp';
import * as project from '../aurelia.json';

export default function copyBootStrap() {
  return gulp.src(project.paths.bootstrapRoot + "/fonts/*").pipe(gulp.dest("fonts"));
}

