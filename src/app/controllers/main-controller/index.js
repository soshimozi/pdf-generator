export default class {
    constructor($location, $http) {
        this.$location = $location;
        this.$http = $http;

        this.pdfText = "";
        this.pdfTitle = "";
    }

    submit() {

        var postData = {
            title: this.pdfTitle,
            text: this.pdfText
        };

        this.$http.post("/pdf", postData, {responseType:'arraybuffer'}).then(
            function(response){
                var file = new Blob([response.data], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            }, 
            function(response){
              // failure callback
              console.log('failure: ', response);
            }
         );

    }
}
