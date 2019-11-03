# newJuxters
 
This is made with Pixi.js. docs are here: http://pixijs.download/release/docs/index.html
but i've included all the dependencies for now. 

to develop it locally, you will need to run a simple html server, because of CORS issues i'm looking into resolving. 

building the page with github fixes this (obviously) but you can only build from one branch at a time, so i'd prefer you don't use that for testing, and develop in your own branch. 

basically everything is in load.js at the moment. because of the nature of pixi.js, it will probably continue to be almost exclusively in js files! 

this tutorial gives a good overview of how sprites work: https://github.com/kittykatattack/learningPixi

Things that DO work:
- canvas loads based on screen size and should look relatively ok on desktop and mobile
- load letters as sprite (eventually this will be good, because i can really take advantage of the framework and do animations and stuff. those benefits just aren't super evident yet)
- generate letters randomly & refresh pile
- drag and drop from pile to board


Things that do not work:
- dictionary load or check
- scoring (i have put in the text for it
- generate letters intelligently

Front-End Next Steps:
- better layout, to allow more than 4 letters in the pile lol


Oh I also used TexturePacker to create the sprite sheet. @Ravi, that might be a good thing to look at. But it's really simple, especially with only the free version.