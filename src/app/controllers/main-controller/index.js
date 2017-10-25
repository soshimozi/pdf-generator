export default class {
    constructor($location, $http, $sce, $timeout) {
        this.$location = $location;
        this.$http = $http;
	    this.$sce = $sce;
        this.$timeout = $timeout;

        this.pdfText = "";
        this.pdfTitle = "";
        this.content = null;
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
}
