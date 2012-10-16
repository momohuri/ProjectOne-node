if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name :
(function (define) {
    define([
        'fs'
    ], function (fs) {
        var helpers = {
            manifest:function () {

                function getDirectoryFiles(directory, callback) {
                    fs.readdir(directory, function (err, files) {
                        files.forEach(function (file) {
                            fs.stat(directory + '/' + file, function (err, stats) {
                                if (stats.isFile()) {
                                    callback(directory + '/' + file);
                                }
                                if (stats.isDirectory()) {
                                    getDirectoryFiles(directory + '/' + file, callback);
                                }
                            });
                        });
                    });
                }

                var content = 'CACHE MANIFEST';
                getDirectoryFiles('./public', function (file_with_path) {
                    fs.unlink("public/site.manifest", function (err) {
                        content +='\n '+file_with_path.substr(8,file_with_path.length);
                        fs.writeFile("public/site.manifest", content, function(err) {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log("The file was saved!");
                            }
                        });
                    });
                });

            }
        }

        return helpers;
    });

})(typeof define != "undefined" ? define : function () {
    var result = arguments[arguments.length - 1]();
    if ("undefined" != typeof(result)) {
        module.exports = result;
    }
});