RF
-----
# Big idea:  
Developing Vue without waiting for transpiling  

At my fourth attempt to install webpack, second attempt to install vue-cli, third attempt to use Vue just as a templating engine and ∞-th time to figure out a browser based dependency manager:  

# Let me present you:  
A SPA engine, that enables you to use HTML templates aaaalmost like Single Page Components.   Combines routing from Navigo, client-side Vue and does not need transpiling.  

# What does it do:  
Every time you reload the browser, the server reads all files in folder './vues', and puts them into the served html. This way you can keep separate controllers+views in separate files. The sample uses a single page app routing sample with Navigo.  

Basically it serves all .html files from 'vues' folder like this:  
```
-- header from app.js  
<html>  
  <body>  
-- first file from './vues'  
  <style>  
  </style>  
  <div id='hello'>  
  </div>  
  <script>  
  </script>  
-- second file from './vues'  
  <style>  
  </style>  
  <div id='world'>  
  </div>  
  <script>  
  </script>  
-- footer from app.js  
  </body>  
</html>  
```  
Which is like a legit way to do it in HTML, but feels real strange.  

# Minuses:  
global Vue variables  
can't use Vue modules  

# Pluses:  
global Vue variables  
Front end changes don't need server reload  

# Vue quirks when handled this way:  
this.something doesn't work, vueName.something works  
setting vueName.data as function doesn't work  
script tags has to be after HTML, or Vue can't find the element  

# TODO:  
Export all contents for serving  

# Technology:  
uses Glob to read folder contents and Lodash to iterate over folder contents.  
Everything else is handled by nodeJS.  

# installation  
```
npm install  
or  
yarn add  

node app.js  
```
