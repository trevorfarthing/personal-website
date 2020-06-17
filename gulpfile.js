const { src, dest, series, parallel } = require('gulp');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
var replace = require('gulp-replace');
var realFavicon = require ('gulp-real-favicon');
var fs = require('fs');

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

function cleanDist() {
  return del(['dist/*']);
}

function minifyJS() {
  return src(['src/script/*.js', '!src/script/soundcloud.js', '!src/script/music.js'])
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('dist/script/'));
}

function minifyImages() {
  return src('src/assets/*.pdf')
    .pipe(dest('dist/assets/'))
    .pipe(src(['src/assets/*.{png,PNG,gif,GIF,jpg,jpeg,JPG,svg}' ]))
    .pipe(imagemin({ verbose: true }))
    .pipe(dest('dist/assets/'));
}

// Not used currently
function minifyCSS() {
  return src('src/styles/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest('dist/styles/'));
}

function updateScriptStyleReferences() {
  return src('src/*.html')
    .pipe(useref())
    .pipe(gulpif('*.css', cleanCSS({compatibility: 'ie8'})))
    .pipe(gulpif('*.js', uglify()))
    .pipe(dest('dist/'))
}

function minifyHTML() {
  return src('dist/*.html')
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true, removeComments: true }))
    .pipe(replace('typewriter.js', 'typewriter.min.js'))// Both of these can be extrapolated to regex
    .pipe(replace('slideMenu.js', 'slideMenu.min.js'))
    .pipe(dest('dist/'));
}

function copyFonts() {
  return src('src/fonts/**/*.{ttf,eot,woff,woff2}')
    .pipe(dest('dist/fonts/'));
}

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
function generateFavicon(done) {
	realFavicon.generateFavicon({
		masterPicture: 'src/assets/favicon.svg',
		dest: 'dist/icons',
		iconsPath: 'icons',
		design: {
			ios: {
				pictureAspect: 'noChange',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				}
			},
			desktopBrowser: {
				design: 'background',
				backgroundColor: '#333333',
				backgroundRadius: 0.35,
				imageScale: 0.9
			},
			windows: {
				pictureAspect: 'noChange',
				backgroundColor: '#603cba',
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				}
			},
			androidChrome: {
				pictureAspect: 'shadow',
				themeColor: '#ffffff',
				manifest: {
					name: 'Trevor Farthing',
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			},
			safariPinnedTab: {
				pictureAspect: 'blackAndWhite',
				threshold: 47.5,
				themeColor: '#5bbad5'
			}
		},
		settings: {
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false,
			readmeFile: false,
			htmlCodeFile: true,
			usePathAsIs: false
		},
		markupFile: FAVICON_DATA_FILE
	}, function() {
		done();
	});
}

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
function checkForFaviconUpdate(done) {
	var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
	realFavicon.checkForUpdates(currentVersion, function(err) {
		if (err) {
			throw err;
		}
    done();
	});
}

exports.default = series(cleanDist, parallel(minifyJS, minifyImages, copyFonts, series(generateFavicon, updateScriptStyleReferences, minifyHTML)));
exports.checkForFaviconUpdate = checkForFaviconUpdate;
