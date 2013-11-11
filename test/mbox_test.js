var mbox = require("mbox");
var $ = require("jquery");

describe("single mbox", function(){
    it("should return instance of Mbox", function(){
        expect(mbox({})).to.be.a("object");
    });
    it("should open and close properly", function(){
        var mybox = mbox({
            content:"<div>see me</div>"
        });

        expect(mybox).to.be.a("object");
        mybox.open();
        expect($("#mbox_overlay").length).to.equal(1);
        mybox.close();
        expect($("#mbox_overlay").length).to.equal(0);
    });
});

describe("multi mboxes",function(){

    it("should be able to open multi mboxes", function(){
        var mybox1 = mbox({
            content:"<div>see me</div>"
        });
        var mybox2 = mbox({
            content:"<div>see me</div>"
        });
        var mybox3 = mbox({
            content:"<div>see me</div>"
        });

        mybox1.open();mybox2.open();mybox3.open();
        expect($("#mbox_overlay").length).to.equal(1);
        mybox1.close();mybox2.close();
        expect($("#mbox_overlay").length).to.equal(1);
        mybox3.close();
        expect($("#mbox_overlay").length).to.equal(0);
    });

});