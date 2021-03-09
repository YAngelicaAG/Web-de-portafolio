var gulp    = require('gulp'),
    sass    = require('gulp-sass'),
    connect = require('gulp-connect'),
    pug     = require('gulp-pug'),
    babel   = require('gulp-babel'),
    plumber = require('gulp-plumber'),
    concat  = require('gulp-concat'),
    rename  = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer');

function reload(done) {
  connect.server({
    livereload: true,
    port: 8080
  });
  done();
}

function styles() {
  return (
    gulp.src('source/scss/theme_briefcase.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 3 versions'],
      cascade: false
    }))
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(gulp.dest('briefcase-angel/static/css'))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(rename('theme_briefcase.scss'))
    .pipe(gulp.dest('briefcase-angel/static/css'))
    .pipe(connect.reload())
  );
}

function scripts() {
  return (
    gulp.src('source/js/briefcase-angel.js')
    .pipe(plumber())
    .pipe(concat('briefcase-angel.js'))
    .pipe(babel({
      presets: [
        ['@babel/env']
      ]
    }))
    .pipe(gulp.dest('briefcase-angel/static/js'))
    .pipe(connect.reload())
  );
}

function html() {
  return (
    gulp.src('*.html')
    .pipe(plumber())
    .pipe(connect.reload())
  );
}

function views() {
  return (
    gulp.src('source/templates/pages/*.pug')
    .pipe(plumber())
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest('briefcase-angel/'))
    .pipe(connect.reload())
  )
}

function watchTask(done) {
  gulp.watch('*.html', html);
  gulp.watch('source/scss/**/*.scss', styles);
  gulp.watch('source/js/theme_aserta.js', scripts);
  gulp.watch('source/templates/**/*.pug', views);
  done();
}

const watch = gulp.parallel(watchTask, reload);
const build = gulp.series(gulp.parallel(styles, scripts, html, views));

exports.reload = reload;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.views = views;
exports.watch = watch;
exports.build = build;
exports.default = watch;