var gulp  = require('gulp'),
    moment = require('moment'),
    dest = require('gulp-dest'),
    gutil = require('gulp-util'),
    zip = require('gulp-zip');

var current=new Date();
var dateStr=moment(current).format('DDMMMYY');
var timeStr=moment(current).format('hhmmA');

gulp.task('default',()=>gutil.log('Type:\n\tgulp createPluginPackage\t\tto create Watson Assistant Wordpress plugin zip file.'));

gulp.task('createPluginPackage',()=>gulp.src('../watson-conversation/**/*')
                                    .pipe(zip('watson-wordpress-plugin-'+dateStr+"_"+timeStr+'.zip'))
                                    .pipe(gulp.dest('../dist')));