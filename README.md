# WhatSnap

An app where you can chat with your phone contact by sending them images

# Technologies

Front-End : Polymer + Cordova app Showcase
Back-End : NodeJS, MongoDB, Socket.io

## commands to build the cordova project

cordova platform add android
cordova plugin add com.pbakondy.sim
cordova plugin add https://github.com/dbaq/cordova-plugin-contacts-phone-numbers.git

## commands to run the server

you first need to start mongodb using : mongod

cd back-end
node index.js