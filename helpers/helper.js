if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}

//class name :
(function (define) {
    define([
        'fs',
        'walk',
        'sequelize',
        'uglify-js',
        'uglifycss'
    ], function (fs,walk,Sequelize,UglifyJS,uglifycss) {
        var helpers = {
            manifest:function () {

               var files   = [];
                var walker  = walk.walk('./public', { followLinks: false });

                walker.on('file', function(root, stat, next) {
                    // Add this file to the list of files
                    files.push(root.substr(8,root.length) + '/' + stat.name);

                    if(stat.name.substr(-2,2)=='js'){
                    var result = UglifyJS.minify(root + '/' + stat.name);
                     result= result.code;
                     // minified output
                     }else if (stat.name.substr(-3,3)=='css'){

                        var result= uglifycss.processFiles([root + '/' + stat.name]) ;
                    }
                    if( stat.name.substr(-3,3)=='css'){
                    fs.unlink(root + '/' + stat.name, function (err) {
                            if(!err){
                                fs.writeFile(root + '/' + stat.name, result, function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log("win");
                                    }
                                });
                            }else{
                                console.log(err)
                            }

                        });
                    }
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


            },
            connectDb:function(){
                if (!global.sequelize) {
                    if(process.env.VCAP_SERVICES){
                        var env = JSON.parse(process.env.VCAP_SERVICES);
                        var mysql_config = env["mysql-5.1"][0]["credentials"];
                        var username = mysql_config["username"];
                        var pass=mysql_config["password"];
                        var port = mysql_config["port"];
                        var db = mysql_config["name"];
                        var hostname = mysql_config["hostname"];

                        return new Sequelize(db, username, pass, {
                            host: hostname,
                            port: port
                        });

                    }else{
                        var username='root';
                        var pass='root';
                        return  global.sequelize = new Sequelize("projectone", username,pass);
                    }
                } else {
                    return  global.sequelize;
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