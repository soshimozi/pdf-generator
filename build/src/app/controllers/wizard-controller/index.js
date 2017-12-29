export default class {
    constructor($scope, $q, $state, $http, $log, StateStore, pdfStylesheet) {
        this.$q = $q;
        this.$state = $state;
        this.$scope = $scope;
        this.$http = $http;
        this.$log = $log;
        this.pdfStylesheet = pdfStylesheet;

        this.pdfModel = {};

        this.steps = [];



        this.editorModules = {
            toolbar: [
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            ['blockquote', 'code-block'],

            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'align': [] }],
            ['image', 'link']

            ['clean']                                         // remove formatting button
            ]
        };

        // step.canexit = function() {
        //     return $q(function(resolve, reject) {

        //         resolve(true);
        //     });
        // };

        function setDirty() {
            $scope.pdfForm.email.$setDirty();
            $scope.pdfForm.name.$setDirty();
        }

        function canExitProfile() {
            return $q(function(resolve, reject) {
                setDirty();

                if($scope.pdfForm.email.$valid && $scope.pdfForm.name.$valid) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        }

        function canExitTitle() {
            return $q(function(resolve, reject) {
                $scope.pdfForm.title.$setDirty();

                if($scope.pdfForm.title.$valid) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        }

        this.steps.push({state: "wizard.profile", title: "Profile", canexit: canExitProfile});
        this.steps.push({state:"wizard.editor", title: "Editor"});
        this.steps.push({state:"wizard.title", title: "Title", canexit: canExitTitle});
        this.steps.push({state: "wizard.download", title: "Finish"});

        this.currentStep = this.steps[0];
        this.currentStep.selected = true;

        $scope.$listenTo(StateStore, ['currentState', 'name'], () => {
            this._stateChanged(StateStore.state.name) 
        });

        this.submitType = "download";
    }

    _stateChanged(state) {
        if(!window.angular.isUndefined(this.currentStep)) {
            if(this.currentStep.state !== state) {

                // new state, now find step by state
                let newStep = this._stepFromState(state);
                let currentStep = this.currentStep;

                if(newStep !== null) {
                    
                    // make sure the state before the one we are going to is complete
                    let toIndex = this._indexFromStep(newStep);
                    if(toIndex == 0 || this.steps[toIndex-1].completed) {
                        this.goTo(newStep);
                    } else {
                        this.goTo(currentStep);
                    } 
                }
            }
        }
    }

    _stepFromState(state) {
        for(let step in this.steps) {
            if(this.steps[step].state === state) {
                return this.steps[step];
            }
        }

        return null;
    }

    _indexFromStep(step) {
        for(let stepIndex=0; stepIndex < this.steps.length; stepIndex++) {
            if(this.steps[stepIndex] === step) {
                return stepIndex;
            }
        }

        return -1;
    }

    _canEnterStep(step) {
        var defer;
        var canEnter;
        //If no validation function is provided, allow the user to enter the step
        if(step.canenter === undefined){
            return true;
        }
        //If canenter is a boolean value instead of a function, return the value
        if(typeof step.canenter === 'boolean'){
            return step.canenter;
        }
        //If canenter is a string instead of a function, evaluate the function
        if(typeof step.canenter === 'string'){
            var splitFunction = step.canenter.split('(');
            canEnter = eval('$scope.$parent.' + splitFunction[0] + '($scope.context' + splitFunction[1])
        } else {
            canEnter = step.canenter(this.$scope.context);
        }
        //Check to see if the canenter function is a promise which needs to be returned
        if(window.angular.isFunction(canEnter.then)){
            defer = this.$q.defer();
            canEnter.then(function(response){
                defer.resolve(response);
            });
            return defer.promise;
        } else {
            return canEnter === true;
        }
    }    

    _canExitStep(step, stepTo) {
        let defer;
        let canExit;

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

        this.$q.all([this._canExitStep(this.currentStep, step), this._canEnterStep(step)]).then((data) => {
            if(data[0] && data[1]){
                //deselect all steps so you can set fresh below
                window.angular.forEach(this.steps, function (step) {
                    step.selected = false;
                });

                this.currentStep = null;
                this.currentStep = step;

                //setting selected step to argument passed into goTo()
                this.currentStep.selected = true;
                this.$state.go(this.currentStep.state);

                this.$scope.$emit('wizard_stepChanged', {step: step, index: this._indexFromStep(step)});
            } else {
                this.$state.go(this.currentStep.state);
                this.$scope.$emit('wizard_stepChangedFailed', {step: step, index: this._indexFromStep(step)});
            }
        });    
    }

    previousStep() {
        let index = this._indexFromStep(this.currentStep);

        if(index > 0) {

            let nextStep = this.steps[index - 1];
            this.goTo(nextStep)
        }
    }

    completeStep() {
        let index = this._indexFromStep(this.currentStep);

        if(index >=0 && index + 1 < this.steps.length) {

            this.currentStep.completed = true;

            let nextStep = this.steps[index + 1];

            this.goTo(nextStep)
        }
    }

    processForm() {
        console.log('process form');

        if(this.$scope.pdfForm.$valid) {
            let styles = this.pdfStylesheet;
            var text = `<!DOCTYPE html>
            <html>
            <head>   
                <style>${this.pdfStylesheet}</style>
            </head>
            <body>
                <div class="ql-snow">
                    <div class="ql-editor">
                        ${this.pdfModel.text}
                    </div>
                </div>
            </body>
            </html>`;

            // only proceed if we are valid
            let postData = { method: this.pdfModel.submitType, title: this.pdfModel.title, data: text };
            let config =  {responseType: 'arraybuffer'};

            
            this.$http.post('/api/pdf', postData, config)
                .then( (response) => {

                    let data = response.data;

                    let headers = response.headers();

                    let success = response.success;

                    let pdfStreamMime = 'application/pdf'


                    let $log = this.$log;

                    console.log('headers:', headers);
                    
                    // Get the filename from the x-filename header or default to "download.bin"
                    let filename = headers['x-filename'] || 'download.pdf';
 
                    // Determine the content type from the header or default to "application/pdf"
                    let contentType = headers['content-type'] || pdfStreamMime;

 
                    try {
                        // Try using msSaveBlob if supported
                        var blob = new Blob([data], { type: contentType });
                        if (navigator.msSaveBlob)
                            navigator.msSaveBlob(blob, filename);
                        else {
                            // Try using other saveBlob implementations, if available
                            var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                            if (saveBlob === undefined) throw "Not supported";
                                saveBlob(blob, filename);
                        }
                        success = true;
                    } catch (ex) {
                        $log.info("saveBlob method failed with the following exception:");
                        $log.info(ex);
                    }
 
                    if (!success) {
                        // Get the blob url creator
                        var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                        if (urlCreator) {
                            // Try to use a download link
                            var link = document.createElement('a');
                            if ('download' in link) {
                                // Try to simulate a click
                                try {
                                    // Prepare a blob URL
                                    var blob = new Blob([data], { type: contentType });
                                    var url = urlCreator.createObjectURL(blob);
                                    link.setAttribute('href', url);
                                    
                                    // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                                    link.setAttribute("download", filename);
                                    
                                    // Simulate clicking the download link
                                    var event = document.createEvent('MouseEvents');
                                    event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                                    link.dispatchEvent(event);
                                    success = true;
                                
                                } catch (ex) {
                                    $log.info("Download link method with simulated click failed with the following exception:");
                                    $log.info(ex);
                                }
                            }
 
                            if (!success) {
                                // Fallback to window.location method
                                try {
                                    // Prepare a blob URL
                                    // Use application/octet-stream when using window.location to force download
                                    var blob = new Blob([data], { type: pdfStreamMime });
                                    var url = urlCreator.createObjectURL(blob);
                                    window.location = url;
                                    success = true;
                                } catch (ex) {
                                    $log.info("Download link method with window.location failed with the following exception:");
                                    $log.info(ex);
                                }
                            }
                        }
                    }   
 
                    if (!success) {
                        // Fallback to window.open method
                        $log.info("No methods worked for saving the arraybuffer, using last resort window.open");
                        //window.open(httpPath, '_blank', '');
                    }                    
                }, (error) => { console.log('error:', error) 
            });
        }
    }
}
