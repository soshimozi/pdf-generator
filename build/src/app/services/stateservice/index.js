const wizardService = function(flux) {

    this.changeStateName = function(name) {
        flux.dispatch('CHANGE_STATE_NAME', {name: name});
    }
};


wizardService.$inject = ['flux'];
module.exports = wizardService;

// export default class  {
//     constructor(flux) {
//         this.flux = flux;
//     }

//     addStep(step) {
//         flux.dispatch('ADD_STEP', step);
//     }
// }
