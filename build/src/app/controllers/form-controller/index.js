export default class {
    constructor($q, $state) {
        this.$q = $q;
        this.$state = $state;

        this.steps = [];

        var step = {};
        step.index = 0;
        step.completed = false;
        step.state = "form.profile";
        step.title = "Profile";
        step.canexit = function() {
            return $q(function(resolve, reject) {

                resolve(true);
            });
        };
        this.steps.push(step);

        step = {};
        step.index = 1;
        step.completed = false;
        step.state = "form.interests";
        step.title = "Interests";
        this.steps.push(step);

        step = {};
        step.index = 2;
        step.completed = false;
        step.state = "form.payment";
        step.title = "Payment";
        this.steps.push(step);

        this.currentStep = this.steps[0];
        this.currentStep.selected = true;
    }

    _indexFromStep(step) {
        for(let stepIndex=0; stepIndex < this.steps.length; stepIndex++) {
            if(this.steps[stepIndex] === step) {
                return stepIndex;
            }
        }

        return -1;
    }

    _canExitStep(step, stepTo) {
        let defer;
        let canExit;

        console.log('step', step);
        console.log('stepTo', stepTo);

        let fromIndex = this._indexFromStep (step);
        let toIndex = this._indexFromStep (stepTo);
        let currentIndex = this._indexFromStep(this.currentStep);

        //Exiting the step should be allowed if no validation function was provided or if the user is moving backwards
        if(typeof(step.canexit) === 'undefined' || this._indexFromStep(stepTo) < this._indexFromStep(this.currentStep) + 1){
            return true;
        }

        //If canexit is a boolean value instead of a function, return the value
        if(typeof step.canexit === 'boolean'){
            return step.canexit;
        }

        canExit = step.canexit(this);

        //Check to see if the canexit function is a promise which needs to be returned
        if(window.angular.isFunction(canExit.then)){
            defer = this.$q.defer();
            canExit.then(function(response){
                defer.resolve(response);
            });
            return defer.promise;
        } else {
            return canExit === true;
        }
    }

    goTo(step) {
        console.log('goto: ', step);
    }

    nextState() {
        let index = this._indexFromStep(this.currentStep);
        console.log(index);

        if(index >=0 && index + 1 < this.steps.length) {

            console.log(this.steps);

            let nextStep = this.steps[index + 1];

            if(this._canExitStep(this.currentStep, nextStep)) {
                this.currentStep.completed = true;
                this.currentStep.selected  = false;

                this.currentStep = nextStep;
                this.currentStep.selected = true;

                console.log('state', this.currentStep.state);
                // now navigate to that state!!
                this.$state.go(this.currentStep.state);
            }
        }
    }


}
