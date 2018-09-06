var should = require('chai').should(),
    expect = require('chai').expect,
    request = require('supertest'),
    assert = require("assert"),
    url = process.env.HOST || 'http://localhost:8000';
    console.log(url)
    api = request(url);

    describe('Cross Origin Requests', function(){

        var results = [];

    	it('should return the correct CORS headers', function(done){
    		api.get('/')
    			.set('Accept', 'application/json')
    			.set('Origin', 'http://someplace.com')
    			.expect(200)
    			.end(function (err, res) {
    				var props = ['access-control-allow-origin', 'x-frame-options', 'date', 'server', 'allow'] 
    				props.forEach(function(el){
    					expect(res.header).to.have.property(el);
    				});

                    results.push(res);

					done();
				});

		});

        it('should allow all origins', function(){
            expect(results[0].header['access-control-allow-origin']).to.equal('*');
        });

    });

    describe('Create todo item', function(done){

        var results = [];

        it('should return a 201 CREATED response', function(done){
            api.post('/todos')
                .send({ "title": "Walk the dog" })
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    expect(res).to.have.property('status', 201); 
                    results.push(res);
                    done(); 
                });


        });

        it('should receive a location hyperlink', function() {
            expect(results[0].header.location).to.match(/^https?:\/\/.+\/todos\/[\d]+$/);
        });

        it('should create the item', function(done){
            request(results[0].header['location'])
                .get('')
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    // console.log(res.body.title)
                    expect(res).to.have.property('status', 200);
                    results.push(res);
                    done();
                });

        });

        it('what we get shuold be what we created', function(){
            expect(results[1].body.title).to.equal("Walk the dog");
        });

        after(function () {
            return request(results[0].header['location']).delete('');
        });


    });
