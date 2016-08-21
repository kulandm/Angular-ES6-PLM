var fs = require('fs');

function saveLog(msg){
	var today = new Date();
	var fn =  today.getFullYear()+'_'+today.getMonth()+'_'+today.getDate()+'_'+today.getHours()+'.log';
	fs.appendFile(fn, msg+'\n');
}

var Logger = {
	info:function(msg){
		saveLog('[INFO] - '+(new Date())+' - '+msg);
	},
	debug:function(msg){
		saveLog('[DEBUG] - '+(new Date())+' - '+msg);
	},
	warn:function(msg){
		saveLog('[WARN] - '+(new Date())+' - '+msg);
	},
	err:function(msg){
		saveLog('[ERROR] - '+(new Date())+' - '+msg);
	}
};

module.exports = Logger;