// ==UserScript==
// @name         5mu3_: Key Commands
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Bind key press to actions
// @author       5mu3_
// @match        https://townstar.sandbox-games.com/launch
// @grant        none
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

$(function() {

    ///////////////////////
    // HOW TO USE SCRIPT //
    ///////////////////////

    // 1. Click a tile on your town.
    // 2. Press a key that binds to a function.

    ///////////
    // NOTES //
    ///////////

    // 1. Sometimes when I build a dirt road, and then remove another tile, the dirt road doesn't auto complete.
    // 2. You might want to comment out the remove bind if you are worried you might destroy a building by accident.

    // keybinds to trigger functions
    const binds = {
        "R":"remove",               // remove tile
        "u":"upgrade",               // upgrade dirt
        "d":"dirtRoad",             // build and auto complete dirt road
        "1":"buildFarm",            // open build menu to farm tab
        "2":"buildRanch",           // open build menu to ranch tab
        "3":"buildTerrain",         // open build menu to terrain tab
        "4":"buildIndustrial",      // open build menu to industrial tab
        "5":"buildTrade",           // open build menu to trade tab
        "t":"tree",                 // build and auto complete tree
        "w":"windMill",             // build and auto complete Wind Mill
        "f":"farm",                 // Build and auto complete farm
        "l":"Lumberjack_House",            // Build and auto complete lumberjack
        //"a":"availableDepot"        // Reset the const availableDepots
        "s":"Sugar_Cane_Field"                // build and auto complete sugarcane
    };
    // Item to try to sell
    const itemsToSell = [
        { craft: 'Candy_Canes', minAmt: 0 },
        { craft: 'Peppermint', minAmt: 1 },
    ];

    let availableDepots = [];

    // on "key" press, do value()
    $(document).on("keypress", function (e) {

        // convert keycode into character
        let char = String.fromCharCode(e.which);

        // get value from binds
        let value = binds[char];

        switch(value){
            case "remove": remove(); break;
            case "cancel": remove(); break;
            case "dirtRoad": dirtRoad(); break;
            case "buildFarm": buildMenu("Farm"); break;
            case "buildRanch": buildMenu("Ranch"); break;
            case "buildTerrain": buildMenu("Terrain"); break;
            case "buildIndustrial": buildMenu("Industrial"); break;
            case "buildTrade": buildMenu("Trade"); break;
            case "tree": tree(); break;
            case "windMill": windMill(); break;
            case "farm": farm(); break;
            case "Lumberjack_House": Lumberjack_House(); break;
            case "availableDepot": availableDepot(); break;
            case "Sugar_Cane_Field": Sugar_Cane_Field(); break;
            default:
                console.log("Can't find function [" + value + "]");
        }

    });

    /**
     * Build and complete a "Pinot Noir Vines".
     */

    async function grapes(){

        if( $('.hud-store-button:visible').length ){

            let e;

            await buildMenu("Farm");

            // buy dirt road
            e = await waitForProduct('Pinot Noir Vines');
            e.click();

            // complete the building
            await completeBuilding()

        }

    }

    /**
     * Build and complete a tree.
     */
    async function tree(){

        if( $('.hud-store-button:visible').length ){

            let e;

            await buildMenu("Farm");

            // buy dirt road
            e = await waitForProduct('Tree');
            e.click();

            // complete the building
            await completeBuilding()

        }

    }

    /**
     * Build and complete a Sugar_Cane_Field
     */
    async function Sugar_Cane_Field(){

        if( $('.hud-store-button:visible').length ){

            let e;

            await buildMenu("Farm");

            // buy dirt road
            e = await waitForProduct('Sugar_Cane_Field');
            e.click();

            // complete the building
            await completeBuilding()

        }

    }

    /**
     * Build and complete a Wind Mill.
     */
    async function windMill(){

        if( $('.hud-store-button:visible').length ){

            let e;

            await buildMenu("Farm");

            // buy wind mill
            e = await waitForProduct('Wind Mill');
            e.click();

            // complete the building
            await completeBuilding()

        }

    }

    /**
     * Build and complete a Farm
     */
    async function farm(){

        if( $('.hud-store-button:visible').length ){

            let e;

            await buildMenu("Farm");

            // buy farm
            e = await waitForProduct('Farm');
            e.click();

            // complete the building
            await completeBuilding()

        }

    }

   /**
     * Build and complete a Farm
     */
    async function Lumberjack_House(){

        if( $('.hud-store-button:visible').length ){

            let e;

            await buildMenu("Farm");

            // buy farm
            e = await waitForProduct('Lumberjack_House');
            e.click();

            // complete the building
            await completeBuilding()

        }

    }

    /**
     * Build and complete a dirt road.
     */
    async function dirtRoad(){

        if( $('.hud-store-button:visible').length ){

            let e;

            await buildMenu("Terrain");

            // buy dirt road
            e = await waitForProduct('Dirt Road');
            e.click();

            // complete the building
            await completeBuilding()

        }

    }

    /**
     * Upgrade a dirt road.
     */
    async function upgradeRoad(){

        if($('.menu-upgrade:visible').length){
            $('.menu-upgrade .upgrade').click();
        }else if($('.menu-cancel:visible').length){
            $('.menu-cancel .upgrade').click();
        }else{
            return;
        }

        // ToDo: hide menu that appears when you remove a tree/marsh etc
        $('#CancelItem-confirm').hide();
        setTimeout(function(){
            $('#CancelItem-confirm .yes').click();
            $('#CancelItem-confirm').show();
        },500);


    }


    /**
     * Remove a building.
     */

    /**
     * Build and list of depots".
     */

   function availableDepot(){

      let availableDepots = [...Game.town.FindObjectsOfType('Express_Depot'), ...Game.town.FindObjectsOfType('Trade_Depot')];
      console.log(`there are ${availableDepots.length} available depots`);

     // let depotObj = availableDepots[Math.floor(Math.random() * (availableDepots.length) + 1)];

     let craftTarget = document.getElementById("trade-craft-target");
     craftTarget.querySelector('').click();
 }

    function remove(){

        if($('.menu-remove:visible').length){
            $('.menu-remove .remove').click();
        }else if($('.menu-cancel:visible').length){
            $('.menu-cancel .remove').click();
        }else{
            return;
        }

        // ToDo: hide menu that appears when you remove a tree/marsh etc
        $('#RemoveItem-confirm').hide();
        setTimeout(function(){
            $('#RemoveItem-confirm .yes').click();
            $('#RemoveItem-confirm').show();
        },500);

    }

    /**
     * Open build menu to specified tab.
     */
    async function buildMenu(tab){

        //
        let map = [
            "Farm",
            "Ranch",
            "Terrain",
            "Industrial",
            "Trade",
        ];
        let index = map.indexOf(tab);

        if(index == -1){
            console.log("Can't map [" + tab + "] in buildMenu().");
            return;
        }

        // open store and select tab
        if( $('.hud-store-button:visible').length ){

            e = await waitForElement('.hud-store-button');
            e.click();

            e = await waitForElement('.store .footer-row button:eq(' + index + ')');
            e.click();

        }

        // select tab ( if store already open )
        if( $('.store .footer-row:visible').length ){

            e = await waitForElement('.store .footer-row button:eq(' + index + ')');
            e.click();

        }

    }

    ////////////
    // UTLITY //
    ////////////

    /**
     * Wait for element to load and return the element
     * @param  {[type]} selector [description]
     * @return {[type]}          [description]
     */
    async function waitForElement(selector) {

        while (!$(selector).length) {
            await new Promise( r => setTimeout(r, 500) )
        }
        return $(selector);

    }

    /**
     * Wait for product to load and return the "buy" button
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    async function waitForProduct(name) {

        while (!$('.store .product.can-purchase').find("h2:contains('" + name + "')").parent().find('button').length) {
            await new Promise( r => setTimeout(r, 500) )
        }
        return $('.store .product.can-purchase').find("h2:contains('" + name + "')").parent().find('button');

    }

    /**
     * Completes newly created building
     * @return {[type]} [description]
     */
    async function completeBuilding() {

        let selectedObj = Game.town.selectedObject;
        let obj = Object.values(Game.town.objectDict).filter(o => o.townX == selectedObj.townX && o.townZ == selectedObj.townZ)[0];
        let buildTime;

        // while state is "WaitForReqs" or buildTime is changing, delay hitting "complete"
        while (obj.data.buildTime != buildTime || obj.data.state == "WaitForReqs") {
            buildTime = obj.data.buildTime;
            await new Promise( r => setTimeout(r, 500) )
        }

        obj.logicObject.CompleteBuild();

    }

});