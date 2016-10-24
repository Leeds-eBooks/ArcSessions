module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    uglify: {
      dist: {
        src: '_site/js/index.js',
        dest: '_site/js/index.min.js'
      }
    },
    'string-replace': {
      'test-js': {
        files: {
          '_site/index.html': '_site/index.html',
        },
        options: {
          replacements: [
            {
              pattern: '<!-- <script src="{{ "/js/index.min.js" | prepend: site.baseurl }}"></script> -->',
              replacement: '<script src="{{ "/js/index.min.js" | prepend: site.baseurl }}"></script>'
            },{
              pattern: '<script src="{{ "/js/index.js" | prepend: site.baseurl }}"></script>',
              replacement: '<!-- <script src="{{ "/js/index.js" | prepend: site.baseurl }}"></script> -->'
            }
          ]
        }
      }
    },
    jekyll: {
      'default': {}
    },
    'ftp-deploy': {
      arcpub: {
        auth: {
          host: 'arcpublications.co.uk',
          port: 21,
          authKey: 'ben-arcpublications'
        },
        src: '_site',
        dest: '/sessions'
      }
    }
  })

  grunt.registerTask('default', ['uglify', 'string-replace', 'jekyll', 'ftp-deploy'])
}
