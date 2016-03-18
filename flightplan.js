var request = require('request');
'use strict';
var plan = require('flightplan');
var argv = require('yargs').argv;
var req = require('request');

////////plans///////////////////////////////
//targets
plan.target('server', {
    host: argv.host,
//    username: 'root',
//    privateKey: '/var/lib/jenkins/.ssh/id_rsa'
    username: 'peter',
    privateKey: '/Users/peter/.ssh/id_rsa'
});

plan.target('local', {
});

plan.local(function(local) {
}); //close plan local
//////// end plans///////////////////////////////

var url = 'http://' + argv.a + ':17007/inventory-3/1/item/v_99871.json?fields=seller&apiToken=dibs_1GS11hYd8FZcEAserMr8rtbaEpjcFahH';

function check_service_code(url, cb){
var respCODE = 0;
	request(url, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
                respCODE =  response.statusCode;
                cb(respCODE);
            }
            else {
               respCODE = 502;
//               cb(respCODE);
	    }
	});
}

check_service_code(url, function(something) {
    var serviceSTATUS = 0;
    var maxTRIES = 0;

while (serviceSTATUS !=1 && maxTRIES !=10)  {
    console.log('Checking service code status');
    console.log('serviceSTATUS = ' + serviceSTATUS);
    console.log('maxTRIES = ' + maxTRIES);
    console.log('something = ' + something);



    if (something == 200){
	console.log('Service is up with code: ' + something);	
        serviceSTATUS = 1;
    }
    else {
    console.log('Health check still failing. Check #:' + maxTRIES); 
    sleep();
    maxTRIES++;
    }

}//close while

});



function add_varn_inventory(remote) {

remote.exec("/usr/bin/varnishadm backend.set_health tomcat_localhost_inventory auto");

}

function stop_tomcat_inventory(remote) {

remote.exec("/etc/init.d/dibs-inventory stop");

}


function start_tomcat_inventory(remote) {

remote.exec("/etc/init.d/dibs-inventory start");

}

function rem_varn_inventory(remote) {
console.log('asdasd');
remote.exec("/usr/bin/varnishadm backend.set_health tomcat_localhost_inventory sick");
}

function sleep() {
  var now = new Date().getTime();
  while(new Date().getTime() < now + 15000) {
  }
//  callback();
}

//  sleep();

plan.local(function(local) { /* ... */ });
plan.local('check_service_code', check_service_code);
plan.remote('rem_varn_inventory', rem_varn_inventory);
plan.remote('add_varn_inventory', add_varn_inventory);
plan.remote('start_tomcat_inventory', start_tomcat_inventory);
plan.remote('stop_tomcat_inventory', stop_tomcat_inventory);

//plan.local('', );
//plan.local('', );
