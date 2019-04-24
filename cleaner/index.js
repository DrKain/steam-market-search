module.exports = (function(){
    var files = {};
    require('fs').readdirSync( __dirname ).map(function(file) {
        if(file !== "index.js") files[file.split('.js').shift()] = require('./' + file);
    });
    return files;
}());