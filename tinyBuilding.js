// ==UserScript==
// @name         T1ny:Building Management
// @version      1.0
// @description  Manages refinery, power plant, lumber mill, and water tower using local storage
// @author       d4nc3r
// @match        https://townstar.sandbox-games.com/launch
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    /*
    Starts monitoring after Game is available
    */
    let monitoringActive = false;
    let storageKey;
    new MutationObserver(function(mutations){
        if(typeof Game != 'undefined' && Game.town) {
            if(!monitoringActive) {
              monitoringActive = true;
              API.getGameSelf().then(response => {
                  storageKey = `${response.gameId}-${response.name}`;
                  const currentValues = window.localStorage.getItem(storageKey);
                  if(!currentValues) {
                      const storageValue = JSON.stringify({
                          refinery: {
                              active: true,
                              gasCount: 20,
                              petroCount: 5
                          },
                          powerPlant: {
                              active: true,
                              x: 5,
                              z: 40,
                              energyMin: 5,
                              energyMax: 8
                          },
                          lumberMill: {
                              active: true,
                              lumberMin: 3,
                              lumberMax: 5
                          },
                          waterFacility: {
                              active: true,
                              drumMin: 4,
                              drumMax: 8
                          }
                      });
                      window.localStorage.setItem(storageKey, storageValue);
                  }
              });
              activateRefineryManagement();
            }
        }
    }).observe(document, {attributes: true, childList: true , subtree: true});

    function activateRefineryManagement() {
        const timeToCheck = 30; // in seconds

        window.myRefineryTimer = setInterval(() => {
            const currentValues = JSON.parse(window.localStorage.getItem(storageKey));
            const refineryValues = currentValues.refinery;
            const powerPlantValues = currentValues.powerPlant;
            const lumberMillValues = currentValues.lumberMill;
            const waterFacilityValues = currentValues.waterFacility;

            if(refineryValues.active) {
                const refinery = Game.town.FindObjectType('Refinery');
                checkRefinery(refinery.logicObject, refineryValues.gasCount, refineryValues.petroCount);
            }

            if(powerPlantValues.active) {
                const powerPlant = Game.town.FindObjectsOfType('Power_Plant').find(p => p.townX === powerPlantValues.x && p.townZ === powerPlantValues.z).logicObject;
                checkPowerPlant(powerPlant, powerPlantValues.energyMin, powerPlantValues.energyMax);
            }

            if(lumberMillValues.active) {
                const mill = Game.town.FindObjectType('Lumber_Mill');
                checkLumberMill(mill.logicObject, lumberMillValues.lumberMin, lumberMillValues.lumberMax);
            }

            if(waterFacilityValues.active) {
                const waterFacility = Game.town.FindObjectType('Water_Facility');
                checkWaterFacility(waterFacility.logicObject, waterFacilityValues.drumMin, waterFacilityValues.drumMax);
            }
        }, timeToCheck*1000);
    }

    /*
    Super simple logic, switches to make Petroleum if there is none in inventory,
    and switches to Gasoline if you hit the magic number of petroleum available
    */
    function checkRefinery(refinery, gasToStopAt, petroCountToSwitchAt) {
        const date = new Date();
        //const petroCountToSwitchAt = 5;
        const data = refinery.data;
        const petroCount = Game.town.GetStoredCrafts().Petroleum || 0;
        const gasCount = Game.town.GetStoredCrafts().Gasoline || 0;

        if(petroCount === 0 && data.craft !== 'Petroleum' && data.state !== 'Produce') {
            //console.log(`Switching to make Petroleum (${date.toLocaleString('en-US')})`);
            refinery.SetCraft('Petroleum');
        }

        if(petroCount >= petroCountToSwitchAt && data.craft === 'Petroleum' && gasCount < gasToStopAt) {
            //console.log(`Switching to make Gas (${date.toLocaleString('en-US')})`);
           //const craft = gasCount > 25 ? 'Jet_Fuel' : 'Gasoline';
            refinery.SetCraft('Gasoline');
        }

        if(petroCount >= petroCountToSwitchAt && gasCount >= gasToStopAt) {
            refinery.ResetCraft();
        }

        if(petroCount > 0 && gasCount < gasToStopAt && data.state === 'Idle') {
            refinery.SetCraft('Gasoline');
        }

    }

    function checkPowerPlant(powerPlant, energyMin, energyMax) {
        const date = new Date();
        const isCrafting = powerPlant.data.craft === 'Energy';
        const energyCount = Game.town.GetStoredCrafts().Energy || 0;

        if(isCrafting && energyCount >= energyMax) {
            powerPlant.ResetCraft();
        } else if (!isCrafting && energyCount <= energyMin) {
            powerPlant.SetCraft('Energy');
        }
    }

    function checkLumberMill(mill, lumberMin, lumberMax) {
        const date = new Date();
        const isCrafting = mill.data.craft === 'Lumber';
        const lumberCount = Game.town.GetStoredCrafts().Lumber || 0;

        if(isCrafting && lumberCount >= lumberMax) {
            mill.ResetCraft();
        } else if (!isCrafting && lumberCount <= lumberMin) {
            mill.SetCraft('Lumber');
        }
    }

    function checkWaterFacility(waterFacility, drumMin, drumMax) {
        const isWaterOff = waterFacility.data.state === 'Idle';
        const drumCount = Game.town.GetStoredCrafts().Water_Drum || 0;

        if(isWaterOff && drumCount < drumMin) {
            waterFacility.SetCraft('Water_Drum');
        }

        if(!isWaterOff && drumCount >= drumMax) {
            waterFacility.ResetCraft();
        }

    }

})();