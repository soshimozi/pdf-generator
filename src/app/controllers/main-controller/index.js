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

    convertJson() {
        this.jsonObject = JSON.parse(this.jsonText);
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
                    this.jsonObject = {};
                }
              
                convertJson() {
                  this.jsonObject = JSON.parse(this.jsonText)
                }
            }
          });
    }
}
