if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}
/**
 * Date: 10/07/12
 * Time: 16:03
 * @module routes
 *
 */
(function (define) {
    define([
        'fs',
        '../controller/guest',
        '../controller/connected'
    ], function (fs,Cguest,Cconnected) {
        "use strict";

        var Controller = [];
        Controller.guest = Cguest;
        Controller.connected = Cconnected;


        var routes = {
            route:function (app) {

//                //ici on eut mettre les type de truc ou faut etre logger (ici /admin*)
//                app.all('/admin*', function (req, res, next) {
//                    if (req.session.authed) {
//                        next();
//                    } else {
//                        res.json(['must auth']);
//                    }
//                });
//                app.all('/*', function (req, res, next) {
//                    console.log(req.session);
//                    next();
//                });


                var routesConf = JSON.parse(fs.readFileSync("./config/routes.json", "utf-8"));
                var controller = [];
                var func = [];
                for (var i in routesConf.ROUTE) {
                    var page = routesConf.ROUTE[i]['route'];

                    controller[page] = routesConf.ROUTE[i]['controller'];
                    func[page] = routesConf.ROUTE[i]['func'];
                    var method = routesConf.ROUTE[i]['method'];

                    if(routesConf.ROUTE[i].hasOwnProperty('controller')){
                        app[method](page, function (req, res) {
                            Controller[controller[req.route.path]][func[req.route.path]](req, res);
                        });
                    }
                };


//                app.all('*', function (req, res) {
//                    res.render(routesConf.ROUTE['404']['render']);
//                });


            }
        }
        return routes;


    });
})(typeof define != "undefined" ? define : function () {
    var result = arguments[arguments.length - 1]();
    if ("undefined" != typeof(result)) {
        module.exports = result;
    }
});
