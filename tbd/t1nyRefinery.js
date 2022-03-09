// ==UserScript==
// @name         TownStar Refinery Management
// @namespace    mailto:7iny.d4nc3r@gmail.com
// @version      1.0
// @description  Switches refinery back and forth between Petroleum and Gasoline production, also turns on and off a Power Station
// @author       d4nc3r
// @match        https://townstar.sandbox-games.com/launch/
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    console.log(`starting refinery management`);

    /*
    Starts monitoring after Game is available
    */
    let monitoringActive = false;
    new MutationObserver(function(mutations){
        if(typeof Game != 'undefined' && Game.town) {
            if(!monitoringActive) {
              monitoringActive = true;
              activateRefineryManagement();
            }
        }
    }).observe(document, {attributes: true, childList: true , subtree: true});

    function activateRefineryManagement() {
        const timeToCheck = 30; // in seconds
        // To find your coords, select the Power Plant you want to control and execute this in the console:
        // Game.town.selectedObject.townX
        // Game.town.selectedObject.townZ
        const ppCoords = { townX: 25, townZ: 50 };

        window.myRefineryTimer = setInterval(() => {
            const refinery = Game.town.FindObjectType('Refinery');
            checkRefinery(refinery.logicObject);
            const powerPlant = Game.town.FindObjectsOfType('Power_Plant').find(p => p.townX === ppCoords.townX && p.townZ === ppCoords.townZ).logicObject;
            checkPowerPlant(powerPlant);
        }, timeToCheck*1000);
    }

    /*
    Super simple logic, switches to make Petroleum if there is none in inventory,
    and switches to Gasoline if you hit the magic number of petroleum available
    */
    function checkRefinery(refinery) {
        const date = new Date();
        const petroCountToSwitchAt = 50;
        const data = refinery.data;
        const petroCount = Game.town.GetStoredCrafts().Petroleum || 0;

        if(petroCount === 0 && data.craft !== 'Petroleum') {
            //console.log(`Switching to make Petroleum (${date.toLocaleString('en-US')})`);
            refinery.SetCraft('Petroleum');
        }
