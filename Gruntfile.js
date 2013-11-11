module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'lib/**/*.js'],
            options: require('./.jshintrc.js')
        },
        uglify: {
            all: {
                files: [{
                    expand: true,
                    cwd: "src",
                    src: ['**'],
                    dest: 'dest',
                    filter: 'isFile'
                }]
            }
        },
        "neuron-test":{
            all:{}
        },
        "neuron-build": {
            server: {
                all:{},
                options:{
                    cwd:process.cwd()
                }
            }
        }
        // mocha: {
        //     all: ['http://localhost:9074/mod/mbox/0.0.1/test/index.html'],
        //     options: {
        //         reporter: 'Spec',
        //         run: false,
        //         ignoreLeaks: false,
        //         timeout:5000
        //     }
        // }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-cortex-neuron-build");
    grunt.loadNpmTasks("grunt-cortex-neuron-test");
    // grunt.loadNpmTasks("grunt-mocha");
    // grunt.loadNpmTasks("grunt-contrib-uglify");


    grunt.registerTask("default", ["jshint" /*, "uglify" */]);
};