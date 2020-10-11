# Seldon: [https://github.com/darkforest-eth/client/](Dark Forest Eth bot)

Things the bot can currently and will do

- Directives: Strategic use of Routines
   - sprawl[WIP]: non-top 15 planets with no set subroutines should explore
   - score[WIP]: Move silver to top 15 planets and upgrade them 
  
- Routines: Groups of subroutines for many planets
 - swarm: continous small uncoordinated attacks
 - flood: large coordinated one-off attack to land in close succession
  
- Subroutines: atomic action for one planet 
  - pester: a small recurring attack
  - explore: find and take medium sized pirate planets
  - delayedMove: launch an attack after a certain time
  - snipe[WIP]: find nearby enemy planets that can be taken in 1 attack
  - supply[WIP]: Send energy to friendly planet when below 50%
  - bank[WIP]: send silver to friendly planet with minimal energy spent


# Warning/Disclaimer
You will need to copy this script into your chrome dev tools this is scary and you should not take it lightly. Random scripts run in your dev tools have access to your secret key and wallet. I could take all of the money in your dai wallet. The whole bot is about 500 loc with no external dependencies aside from the bundler. You or someone you trust should be able to review it.

Feel free to fork this repo and review the code so you can be sure their are no shenanigans. 

## Usage:
### Setup
- Copy and Paste /dist/seldon.umd.js into your chrome devtools. 
- let op = new Seldon()
  
# Things todo

Annoy a large enemy planet with a smaller nearby planet

`op.pester(yourSmallPlanetId,theirLargeplanetId) //srcid = small planet nearby big enemy, syncId = large enemy planet`
  
or set up a lot of pesters quickly

`op.swarm(theirLargePlanetId)`

or launch a large coordinated attack

`op.flood(theirLargePlanetId)`

or setup a far off planet to capture pirate planets as their discoverd

`op.explore(yourPlanetId)`


## High Level: How this works or Architecture
there is core loop that runs every 60 seconds. That core loop iterates over the actions array. The actions array is a big list of subroutines to run.  `op.pester()` inserts an action into the actions array. `op.swarm()` inspects the game state and inserts actions based on the best planets for the job.

## FAQ
Q: What happens if I refresh, will I lose all of the actions in memory?

A: Actions are store in localStorage when ever the `op.createAction()` is called. `createAction` runs underneath every subroutine. Seldon reads from localStorage on initialization, so you should not lose your actions on refresh, unless you clear your application state.

Q: Will the core loop continue to run if I loose access to the Seldon reference? 

A: Yes, the core loop will continue to run, this is important if you overwrite the variable you've set it to. If you initialize a new Seldon instance, the old coreLoop will be stopped and a new one started.  This important for protecting again multiple coreLoops running at the same time. 


  









