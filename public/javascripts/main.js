require.config({
    baseUrl: "/javascripts",
    paths: {
        "bootstrap": "extern/bootstrap.min",
        async:'extern/async.min'
    }
});
//call jquery if jquery :)

require(["routes",'extern/backbone'], function(routes) {
    routes.init();
});
