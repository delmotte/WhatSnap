### Comment avez vous réalisé l’exemple ?

  Nous avons combiné Polymer et Cordova afin de réaliser cet exemple. Polymer nous a servis pour réaliser les
  templates et les vues webs, alors que Cordova nous a permis d'exporter ce code web sur une plateforme mobile 
  et de bénéficier de certaines capacités natives de l'appareil.


### Avec quel outil de développement, de tests ?

  Nous avons utilisé Webstorm 10 pour le développement
  Nous avons testé sur Google Chrome, un Wiko Highway (Android 4.4), un Sony M2 (Android 5.1).
  Nous avons également testé (grâce à la console Google) sur la plupart des résolutions / orientations d'écran.
  Nous n'avons pas testé sur d'autres navigateurs car la compatibilité avec Polymer est compromise.

### Comment déploie-t-on et exécute-t-on l'exemple ?

  git clone
  
  cd app
  
  cordova platform add android
  
  cordova plugin add cordova-plugin-whitelist
  
  cordova plugin add cordova-plugin-device-motion
  
  cd app/web
  
  bower install
  

### Comment teste-t-on les capacités d’adaptations ?


