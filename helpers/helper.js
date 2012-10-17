if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name :
(function (define) {
    define([
        'fs',
        'walk'
    ], function (fs,walk) {
        var helpers = {
            manifest:function () {


                var files   = [];
                var walker  = walk.walk('./public', { followLinks: false });

                walker.on('file', function(root, stat, next) {
                    // Add this file to the list of files
                    files.push(root.substr(8,root.length) + '/' + stat.name);
                    next();
                });

                walker.on('end', function() {
                    createManifest(files);
                });


                    function createManifest(content) {
                    fs.unlink("public/site.manifest", function (err) {
                        fs.writeFile("public/site.manifest", content, function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("manifest generated saved!");
                            }
                        });
                    });
                }


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