-Sac-Jam-Game-05
================

This was the game I made for the fifth game jam, the theme was evolution... Sadly though a lot of things went wrong for
this game jam. As in I arrived very late and spent my time trying to make a multiplayer game. That was a big mistake 
because I spent my entire time trying to build a socket server with Node.js... Nothing worked like I wanted it to. 

I wanted to make a simple game where people logged in and using Flex who ever clicked the most of a particular color first
would win. The code is pretty broken and nothing really works... I got as far as making it so that players could login, 
once that was finished then it would change states to the main game. 

What I did to make sure I could "listen" for the right incoming event from the node server I used a string split creating 
the type of event on the left and data on the right... like "addPlayerEvent_23", etc... Probably not the best way, but
it got the job done, sorta.

http://www.meetup.com/gamedeveloper/events/65880022/