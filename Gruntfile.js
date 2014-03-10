'use strict';

module.exports = function (Grunt) {
	Grunt.initConfig({
		pkg: Grunt.file.readJSON('package.json')

		, banner: '/*! <%= pkg.name %> | v<%= pkg.version %> | Author: <%= pkg.author %> | <%= pkg.repository %> | MIT license */ \n'

		, jshint: {
			options: {
				jshintrc: '.jshintrc'
			}
			, files: 'src/Vimg.js'
		}

		, concat: {
			options: {
				banner: '<%= banner %>'
			}
			, dist: {
				src: 'src/Vimg.js'
				, dest: 'dist/vimg.js'
			}
		}

		, uglify: {
			options: {
				banner: '<%= banner %>'
			}
			, dist: {
				src: 'dist/vimg.js'
				, dest: 'dist/vimg.min.js'
			}
		}

	})

	require('matchdep').filterDev('grunt-*').forEach(Grunt.loadNpmTasks);

	Grunt.registerTask('default', [
		'jshint'
		, 'concat'
	]);
}