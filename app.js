if (typeof define !== 'function') {
    var define = (require('amdefine'))(module);
}
define([
    'express',
    './routes/routes',
    'http',
    'ejs',
    'path',
    './helpers/helper',
    './model/relation',
    'sequelize'
], function (express, routes, http,ejs, path,helpers,relation,Sequelize) {

    var app = express();
    global.sequelize = new Sequelize("projectone", "root", "root");
    app.configure(function () {
        app.set('port', process.env.PORT || 3000);
        app.set('views', __dirname + '/views');
        app.engine('.html', ejs.__express );
        app.set('view engine', 'html');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser('mouhahaha'));
        app.use(express.session());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(app.router);
        routes.route(app);
        relation.create();
        if(typeof(process.env.VCAP_SERVICES)!='undefined'){
            helpers.manifest();
        }

    });



    app.configure('development', function () {
        app.use(express.errorHandler());
    });


    http.createServer(app).listen(app.get('port'), function () {
        console.log("Express server listening on port " + app.get('port'));
    });

});