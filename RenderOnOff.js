// ==UserScript==
// @name         5mu3: RenderOnOff
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Allow you to toggle render on/off to increase FPS.
// @author       5mu3_ based on MohKari
// @credits      Kaif0naft
// @match        https://townstar.sandbox-games.com/launch
// @grant        none
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function() {

    ///////////////////////
    // HOW TO USE SCRIPT //
    ///////////////////////

    // 1. Toggle render "on/off" buttons.

    // render is on by default
    let render = true;

    // observer to check if script should run or not, script wont run if you already have a town placed.
    let observer = new MutationObserver(function(m){

        // hud-right must exist
        if($('.hud-right').length){

            console.log('SCRIPT "render-on-off" HAS STARTED.');

            // dont watch anymore
            observer.disconnect();

            // run
            addButton();

        }

    });
    observer.observe(document, {childList: true , subtree: true});

    /**
     * Add restart button HTML
     */
    function addButton(){

        // add button with listener
        let html = '<button id="sg-rof-button"/>Render On</button>';
        $('.hud-right').after(html);

        // bind function
        $("#sg-rof-button").click(toggleRender);

        // add some simple css to the button
        $("#sg-rof-button").css({
            'width':'92%',
            'padding':'10px',
            'margin-top':'10px',
            'border-radius':'5px',
            'border':'solid 1px #ccc',
            'background-color':'#28a745'
        });

    }

    /**
     * Toggles render on/off
     * @return {[type]} [description]
     */
    function toggleRender(){

        if(render == true){

            render = false;
            app.autoRender = false;
            $("#sg-rof-button").html("Render Off");
            $("#sg-rof-button").css({
                'background-color':'#dc3545'
            });

        }else{

            render = true;
            app.autoRender = true;
            $("#sg-rof-button").html("Render On");
            $("#sg-rof-button").css({
                'background-color':'#28a745'
            });


        }

    }

})();
