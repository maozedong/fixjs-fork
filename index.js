'use strict';

var assert = require('assert');

const net = require('net');
var fix = require('./fix');
const Msgs = fix.Msgs;
const conf = require('./config.json');

// var through = require('through2');
// var duplexer = require('duplexer2');
// var stream_server = through();
// var stream_client = through();
//
// var server = fix.createServer();
// server.attach(duplexer(stream_client, stream_server));
//
// let clientStream = duplexer(stream_server, stream_client);
// var client = fix.createClient(clientStream);
//
// server.on('session', function(session) {
//     session.on('logon', ()=>console.log('logon server'));
// });
// var session = client.session('KOYFINFX', 'CIB');

let clientSocket = net.createConnection({host: conf.host, port: conf.port});
let client = fix.createClient(clientSocket);
var session = client.session('KOYFINFX', 'CIB');
session.on('logon', ()=>{
    console.log('logon session');
});
session.on('logout', ()=>{
    console.log('session logout');
});


clientSocket.on('close', (has_error) => {
    console.log('close', has_error);
});
clientSocket.on('connect', () => {
    console.log('connect');

    // session.send(new Msgs.Heartbeat());

    session.logon();
});
clientSocket.on('data', (data) => {
    console.log('data', data.toString());
});
clientSocket.on('drain', () => {
    console.log('drain');
});
clientSocket.on('end', () => {
    console.log('end');
});
clientSocket.on('error', (err) => {
    console.log('error', err);
});
clientSocket.on('lookup', () => {
    console.log('lookup');
});
clientSocket.on('timeout', () => {
    console.log('timeout');
});




process.on('SIGINT', function() {
    session.end();
    console.log("session ended");
    console.log("Bye!");
    process.exit();
});