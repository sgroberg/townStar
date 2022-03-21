// ==UserScript==
// @name         5mu3:chickenCoop
// @namespace    mailto:sgroberg@gmail.com
// @version      1.
// @description  {Turns chicken Coop on/off}
// @author       5mu3_
// @match        https://townstar.sandbox-games.com/launch
// @grant        none
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function() {

    ///////////////////////
    // HOW TO USE SCRIPT //
    ///////////////////////

    // 1. Display Lumber Mills status button.

    // Get the number of lumber
    // let lumberCount = Game.town.GetStoredCrafts().Lumber || 0;

    let eggs = false;


    // ToDo Get the number of Lumber_Mills

    // const lumberCountToSwitchAt = 1;
    // const lumberMill = Game.town.FindObjectType('Lumber_Mill').logicObject;
    // const data = lumberMill.data; // ToDo Multiple Lumber_Mills
    // const lumberCount = Game.town.GetStoredCrafts().Lumber || 0;

    // observer to check if script should run or not, script wont run if you already have a town placed.
    let observer = new MutationObserver(function(m){

        // hud-right must exist
        if($('.hud-right').length){

            console.log('SCRIPT "chickenCoop.js" HAS STARTED.');

            // dont watch anymore
            observer.disconnect();

            // run
            //addButton();

        }

    });
    observer.observe(document, {childList: true , subtree: true});




    /**
     * Toggles Chicken Coop on/off
     */


    function checkChickenCoop() {

        let eggCountToSwitchOnAt = 2;
        let eggCountToSwitchOffAt = 5;
        let chickenCoop = Game.town.FindObjectType('Chicken_Coop').logicObject;
        let data = chickenCoop.data; // ToDo Multiple coops
        let eggCount = Game.town.GetStoredCrafts().Chicken_Coop || 0;


        if(eggCount < eggCountToSwitchOnAt) {
            console.log('Switching on Chicken Coop');
            // turn on Lumber Mill

            lumber.SetCraft('eggs');

            // lumber.SetCraft('Lumber');
            lumber = true;
        }

        if(eggCount > eggCountToSwitchOffAt) {
            console.log('Switching off Chicken Coop');
            // turn off Chicken Coop
            lumber.ResetCraft('Chicken_Coop');
            lumber = false;
        }
    }

    function activateChickenCoopManagement() {
        console.log('Setting up Chicken Coop management');
        const timeToCheck = 30; // in seconds

        window.myLumberTimer = setInterval(() => {
            checkChickenCoop();
        }, timeToCheck*1000);
    }

})();
