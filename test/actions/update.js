// Load modules
var Lab = require('lab');
var Hoek = require('hoek');
var Path = require('path');
var Hapi = require('hapi')
var Async = require('async')
var ServerSetup = require('../server.setup.js');

// Test shortcuts
var lab = exports.lab = Lab.script();
var expect = Lab.expect;
var before = lab.before;
var after = lab.after;
var experiment = lab.experiment;
var test = lab.test;



experiment('Update bedwetter', function () {
    
    // This will be a Hapi server for each test.
    var server = new Hapi.Server();

    // Setup Hapi server to register the plugin
    before(function(done){
        
        ServerSetup(server, {
            userModel: 'animals',
            userIdProperty: 'animal.id',
            userUrlPrefix: '/animal'
        }, function(err) {
            
            if (err) done(err);
            
            server.route([
            { // update
                method: ['PATCH', 'POST'],
                path: '/treat/{id}',
                handler: {
                    bedwetter: {}
                }
            }]);
            
            done();
        });
    });
    
    test('updates with post.', function (done) {
        
        server.inject({
            method: 'PATCH',
            url: '/treat/2',
            payload: {
                name: "Fried BOreos"
            }
        }, function(res) {
            
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.be.an.object;
            expect(res.result.name).to.equal("Fried BOreos");
            //console.log(res.statusCode, res.result);
            
            done();
        })
        
    });
    
    test('updates with patch.', function (done) {
        
        server.inject({
            method: 'PATCH',
            url: '/treat/2',
            payload: {
                name: "Fried Oreos"
            }
        }, function(res) {
            
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.be.an.object;
            expect(res.result.name).to.equal("Fried Oreos");
            //console.log(res.statusCode, res.result);
            
            done();
        })
        
    });
    
    after(function(done) {
        
        var orm = server.plugins.dogwater.zoo.waterline;
        
        // Take each connection used by the orm... 
        Async.each(Object.keys(orm.connections), function(key, cbDone) {
            
            var adapter = orm.connections[key]._adapter;
            
            // ... and use the relevant adapter to kill it. 
            if (typeof adapter.teardown === "function") {
                
                adapter.teardown(function() {
                    cbDone();
                });
                
            } else {
                cbDone();
            }
            
        },
        function (err) {
            done(err);
        });
        
    });
    
});

