export default class {
    constructor($location, $http, $sce, $timeout, $uibModal) {
        this.$location = $location;
        this.$http = $http;
	    this.$sce = $sce;
        this.$timeout = $timeout;
        this.$uibModal = $uibModal;

        this.pdfText = "";
        this.pdfTitle = "";
        this.content = null;
        this.jsonText = "";
        this.jsonObject = null;
        this.alerts = [];
    }

    submit() {

        var postData = {
            title: this.pdfTitle,
            text: this.pdfText
        };

        this.$http.post("/pdf", postData, {responseType:'arraybuffer'}).then( (response) => {
            var file = new Blob([response.data], {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file, 'myfile');

            this.active = 1;
            this.content = this.$sce.trustAsResourceUrl(fileURL);
        });		
    }

    closeAlert(index) {
        this.alerts.splice(index, 1);
    }

    convertJson() {
        try {
        this.jsonObject = JSON.parse(this.jsonText);
        }
        catch(error) {
            this.alerts.push({msg: 'Could not parse JSON object.', type:'danger'});
        }
        // TODO: error checking

        for(var key in this.jsonObject) {
            console.log(key + ': ', typeof(this.jsonObject[key]));
        }
    }

    clipboardCopiedSuccess(e) {
        this.alerts.push( {msg: 'Copied data successfully to clipboard', type:'success'})
    }    

    showJsonHelper() {
        this.$uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            template: require('../../templates/modals/jsonHelper'),
            size: 'lg',
            controllerAs: 'vm',
            controller: class  {
                constructor() {
                    this.jsonText = '';
                    this.jsonObject = null;
                }
              
                convertJson() {
                  this.jsonObject = JSON.parse(this.jsonText)
                }
            }
          });
    }
}
