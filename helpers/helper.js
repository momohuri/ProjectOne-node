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


                    function createManifest(files) {
                        var content='CACHE MANIFEST \n';
                        files.forEach(function(item){
                            if(item!='/site.manifest'){
                                content+=item+'\n';
                            }
                        })


                    fs.unlink("./public/site.manifest", function (err) {
                        if(!err){
                            console.log('deleted');
                            content+="NETWORK: \n\
http://maps.gstatic.com/\n \
http://maps.google.com/\n \
http://maps.googleapis.com/\n \
http://mt0.googleapis.com/\n\
http://mt1.googleapis.com/\n\
http://mt2.googleapis.com/ \n\
http://mt3.googleapis.com/ \n\
http://khm0.googleapis.com/ \n\
http://khm1.googleapis.com/ \n\
http://cbk0.googleapis.com/ \n\
http://cbk1.googleapis.com/ \n\
http://www.google-analytics.com/ \n\
http://gg.google.com/";
                              fs.writeFile("public/site.manifest", content, function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("manifest generated saved!");
                                }
                           });
                        }else{
                            console.log(err)
                        }



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