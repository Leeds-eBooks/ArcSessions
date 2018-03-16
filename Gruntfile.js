module.exports = grunt => {
  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    'ftp-deploy': {
      arcpub: {
        auth: {
          host: 'arcpublications.co.uk',
          port: 21,
          authKey: 'ben-arcpublications',
        },
        src: '_site',
        dest: '/sessions',
      },
    },
  })

  grunt.registerTask('default', ['ftp-deploy'])
}
