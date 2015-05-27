var Injector = require("./injector");
var BaseModule = require("./basemodule");

var Injection = {
	Injector: Injector,
	BaseModule: BaseModule,
	defaultInjector: new Injector()
}

module.exports = Injection;