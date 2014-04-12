maxisix-gulp-template
=====================

I use Gulp as a task manager. Here's my config.

http://gulpjs.com/


** Install node.js. http://nodejs.org/

** Then we need to install gulp: npm install gulp -g

*** If you want to update the plugins you can use this on the root of your project folder (use sudo if you dont have the right)

npm install gulp-sass gulp-autoprefixer gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-watch --save-dev


If there are two gulp versions. The CLI, and the project specific installed version.

To check the CLI and local version run: gulp -v To check the Installed project version via npm run: npm ls and look for gulp

Update the project specific version to 3.3.4 to solve that issue. From a terminal in your project folder: npm install gulp@3.3.4 --save