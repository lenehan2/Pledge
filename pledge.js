/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:




var $Promise = function(){
	this.state = "pending";
	this.handlerGroups = [];
};

var Deferral = function(){
	this.$promise = new $Promise();
	// this.$promise.state = "pending"

};

var defer = function() {
 	return new Deferral();
};

Deferral.prototype.resolve = function(someData){
	
	this.$promise.value = this.$promise.state === "pending" ? someData : this.$promise.value;
	this.$promise.state = this.$promise.state === "pending" ? "resolved" : this.$promise.state;

	while(this.$promise.handlerGroups.length > 0) {
		this.$promise.callHandlers(this.$promise.value);
	}
}

Deferral.prototype.reject = function(myReason) {
	
	this.$promise.value = this.$promise.state === "pending" ? myReason : this.$promise.value;
	this.$promise.state = this.$promise.state === "pending" ? "rejected" : this.$promise.state;

	while(this.$promise.handlerGroups.length > 0) {
		this.$promise.callHandlers(this.$promise.value);
	}
};

$Promise.prototype.then = function(successCb,errorCb){
	successCb = typeof successCb === "function" ? successCb : null;
	errorCb = typeof errorCb === "function" ? errorCb : null;
	this.handlerGroups.push({successCb: successCb, errorCb: errorCb});

	if(this.state !== "pending"){
		this.callHandlers(this.value);
	}

}

$Promise.prototype.callHandlers = function(value) {
	if(this.state === "resolved"){
		this.handlerGroups[0].successCb(value);
	}else{
		this.handlerGroups[0].errorCb(value);
	}
	this.handlerGroups = this.handlerGroups.slice(1);
};

/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
