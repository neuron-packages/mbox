var mbox = require("../lib/index");
var $ = require("jquery");
var assert = require("assert");
describe("single mbox", function() {

  // it("should fail in ie",function(){
  //     console.log(navigator.userAgent);
  //     assert.equal(/msie/i.test(navigator.userAgent),false);
  // });

  it("should return instance of Mbox", function() {
    assert.equal(typeof mbox({}), "object");
  });

  it("should open and close properly", function() {
    var mybox = mbox({
      content: "<div>see me</div>"
    });

    console.log(mybox);
    assert.equal(typeof mybox, "object");
    mybox.open();
    assert.equal($("#mbox_overlay").length, 1);
    mybox.close();
    assert.equal($("#mbox_overlay").length, 0);
  });
});

describe("multi mboxes", function() {

  it("should be able to open multi mboxes", function() {
    var mybox1 = mbox({
      content: "<div>see me</div>"
    });
    var mybox2 = mbox({
      content: "<div>see me</div>"
    });
    var mybox3 = mbox({
      content: "<div>see me</div>"
    });

    mybox1.open();
    mybox2.open();
    mybox3.open();
    assert.equal($("#mbox_overlay").length, 1);
    mybox1.close();
    mybox2.close();
    assert.equal($("#mbox_overlay").length, 1);
    mybox3.close();
    assert.equal($("#mbox_overlay").length, 0);
  });

});