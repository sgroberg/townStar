// ==UserScript==
// @name         TownStar Livestock Management
// @namespace    mailto:7iny.d4nc3r@gmail.com
// @version      1.0
// @description  Alternates between cows and chickens to avoid consuming all feed
// @author       d4nc3r
// @match        https://townstar.sandbox-games.com/launch/
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    console.log(`starting livestock-management on ${document.URL}`);

    /*
    Starts monitoring after Game is available
    */
    let monitoringActive = false;
    new MutationObserver(function(mutations){
        if(typeof Game != 'undefined' && Game.town) {
            if(!monitoringActive) {
              monitoringActive = true;
              activateLivestockManagement();
            }
        }
    }).observe(document, {attributes: true, childList: true , subtree: true});

    function activateLivestockManagement() {
        console.log('Setting up livestock management');
        const timeToCheck = 30; // in seconds

        window.myLivestockTimer = setInterval(() => {
            checkLivestock();
        }, timeToCheck*1000);
    }

    /*
    keep eggs between 3-12
    when eggs are on, turn off one cow - as long as the reqList > 6 (so we don't turn one off that is close to done)
    */
    function checkLivestock() {
        const date = new Date();
        const cows = Game.town.FindObjectsOfType('Milk_Barn').map(mb => mb.logicObject);
        const idleCow = cows.find(c => c.data.state === 'Idle');
        const chickenCoop = Game.town.FindObjectType('Chicken_Coop').logicObject;
        const chickenData = chickenCoop.data;
        const eggCount = Game.town.GetStoredCrafts().Eggs || 0;
        const feedCount = Game.town.GetStoredCrafts().Feed || 0;

        if(eggCount <= 3 && chickenData.craft !== 'Eggs') {
            console.log(`Turning chickens on (${date.toLocaleString('en-US')})`);
            chickenCoop.SetCraft('Eggs');
        }

        if(eggCount >= 12 && chickenData.craft === 'Eggs') {
            console.log(`Turning chickens off (${date.toLocaleString('en-US')})`);
            chickenCoop.ResetCraft();
        }

        if(idleCow && chickenData.state === 'Idle' && feedCount >= 10) {
            console.log(`Turning on the idle cow (${date.toLocaleString('en-US')})`);
            idleCow.SetCraft('Milk');
        }

        if(!idleCow && chickenData.craft === 'Eggs') {
            const cowToTurnOff = cows.find(cow => {
                let count = 0;
                for (const k in cow.data.reqList) count += cow.data.reqList[k];
                return count > 6;
            });

            if(cowToTurnOff) {
                console.log(`Turning off 1 cow (${date.toLocaleString('en-US')})`);
                cowToTurnOff.ResetCraft();
            }
        }

    }

})();
