describe("mbox", function(){
    describe("mbox(options)", function(){
        it("should return instance of Mbox", function(done){
            _use(["mbox@0.0.1"],function(mbox) {
                expect(mbox({})).to.be.a("object");
            }); 
        });
    });
});