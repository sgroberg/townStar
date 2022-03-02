// ==UserScript==
// @name         5mu3:Lumber2
// @namespace    mailto:sgroberg@gmail.com
// @version      1.
// @description  {Turns off Lumber Mill at 2}
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
    let lumber = Game.town.GetStoredCrafts().Lumber || 0;

    // ToDo Get the number of Lumber_Mills

    // observer to check if script should run or not, script wont run if you already have a town placed.
    let observer = new MutationObserver(function(m){

        // hud-right must exist
        if($('.hud-right').length){

            console.log('SCRIPT "Lumber2" HAS STARTED.');

            // dont watch anymore
            observer.disconnect();

            // run
            activateLumberManagement();
            addButton();

        }

    });
    observer.observe(document, {childList: true , subtree: true});

    // *** Functions *** //
    function activateLumberManagement() {
        console.log('Setting up lumber management');
        const timeToCheck = 60; // in seconds

        window.myLumberTimer = setInterval(() => {
            checkLumber();
        }, timeToCheck*1000);
    }
    /*
    If lumber is greater than 1: off.  If less than 1:on
    - ToDo: add check for Energy Inventory
    - ToDo: to shut off if wood <= 10
    */
    function checkLumber() {
        const lumberCountToSwitchAt = 1;
        const lumberMill = Game.town.FindObjectType('Lumber_Mill').logicObject;
        const data = lumberMill.data;
        const lumber = Game.town.GetStoredCrafts().Lumber || 0;

        if(lumber <= lumberCountToSwitchAt&& data.craft !== 'Lumber') {
            console.log('Switching on Lumber Mill');
            // turn on Lumber Mill
            lumber.SetCraft('Lumber');

        }

        if(lumberCount > lumberCountToSwitchAt && data.craft == 'Lumber') {
            console.log('Switching off Lumber Mill');
            // turn off Lumber Mill
            lumber.ResetCraft('Lumber');
        }

    }

    /**
     * Add restart button HTML
     */
    function addButton(){

        // add button with listener
        let html = '<button id="sg-lumber-button"/>Lumber fctcn</button>';
        $('.hud-right').after(html);

        // bind function
        // $("#sg-lumber-button").click({onClick});

        // add some simple css to the button
        $("#sg-lumber-button").css({
            'width':'92%',
            'padding':'10px',
            'margin-top':'10px',
            'border-radius':'5px',
            'border':'solid 1px #ccc',
            'background-color':'#28a745'
        });

    }

    /**
     * Toggles test on/off
     * @return {[type]} [description]
     */
    function lumberMill(){

        if(lumber == true){

            lumber < 1;
            // *** Start Lumber Mill  ***
            $("#sg-lumber-button").html("Lumber:On");
            $("#sg-lumber-button").css({
                'background-color':'#dc3545'
            });

        }else{

            lumber > 1;
            //*** Stop Lumber Mill ***
            $("#sg-lumber-button").html("Lumber:idle");
            $("#sg-lumber-button").css({
                'background-color':'#28a745'
            });


        }

    }


})();
