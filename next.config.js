// const os = require('node:os'); 
// const path = require("path");

module.exports = {
    webpack(config){
        config.externals.push({
            'utf-8-validate': 'commonjs utf-8-validate',
            bufferutil: 'commonjs bufferutil',
        })
        return config;
    },

}