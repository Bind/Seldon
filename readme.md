# Seldon: A set of scripts for [Dark Forest Eth](https://zkga.me)

Things the bot can currently and will do

  __Directives__: Strategic use of Routines
   - __sprawl[WIP]__: non-top 15 planets with no set subroutines should explore
   - __score[WIP]__: Move silver to top 15 planets and upgrade them 
  
  __Routines__: Groups of subroutines for many planets
 - __swarm__: continous small uncoordinated attacks
 - __flood__: large coordinated one-off attack to land in close succession
  
  __Subroutines__: atomic action for one planet 
  - __pester__: a small recurring attack
  - __explore__: find and take medium sized pirate planets
  - __delayedMove__: launch an attack after a certain time
  - __snipe[WIP]__: find nearby enemy planets that can be taken in 1 attack
  - __supply[WIP]__: Send energy to friendly planet when below 50%
  - __bank[WIP]__: send silver to friendly planet with minimal energy spent


# Warning/Disclaimer
You will need to copy this script into your browser console. This is scary and should not be taken lightly. Scripts run in your browser console have access to your secret key and wallet. I could take all of the money in your wallet. The whole bot is about 500 loc with no external dependencies aside from the bundler. You or someone you trust should be able to review it.

Feel free to fork this repo and review the code so you can be sure their are no shenanigans. 


# Usage & Setup
- Copy and Paste /dist/seldon.umd.js into your chrome devtools. 
- let op = new Seldon()
  
# Things todo

Annoy a large enemy planet with a smaller nearby planet

`op.pester(yourSmallPlanetId,theirLargeplanetId)`
  
or set up a lot of pesters quickly

`op.swarm(theirLargePlanetId)`

or launch a large coordinated attack

`op.flood(theirLargePlanetId)`

or setup a far off planet to capture pirate planets as their discovered

`op.explore(yourPlanetId)`


## High Level: How this works or Architecture
there is core loop that runs every 60 seconds. That core loop iterates over the actions array. The actions array is a big list of subroutines to run.  `op.pester()` inserts an action into the actions array. `op.swarm()` inspects the game state and inserts actions based on the best planets for the job.

## FAQ
__Q__: What happens if I refresh, will I lose all of the actions in memory?

__A__: Actions are store in localStorage when ever the `op.createAction()` is called. `createAction` runs underneath every subroutine. Seldon reads from localStorage on initialization, so you should not lose your actions on refresh, unless you clear your application state.

__Q__: Will the core loop continue to run if I loose access to the Seldon reference? 

__A__: Yes, the core loop will continue to run, this is important if you overwrite the variable you've set it to. If you initialize a new Seldon instance, the old coreLoop will be stopped and a new one started.  This important for protecting again multiple coreLoops running at the same time. 


  









