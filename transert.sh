rm -rf cordova_test/www/bower_components
rm -rf cordova_test/www/components
rm cordova_test/www/bower.json
cp -r app/bower_components cordova_test/www
cp -r app/components cordova_test/www
cp -r app/bower.json cordova_test/www