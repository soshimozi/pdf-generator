export default class {
    constructor($location, $http, $sce, $timeout, $uibModal, pdfStylesheet) {
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

      this.pdfStylesheet = pdfStylesheet;

      this.toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      
      ['link', 'image'],

      ['formula'],
      
      ['clean']                                         // remove formatting button
      ];

      this.userFields = [
        {
          // the key to be used in the model values
          // so this will be bound to vm.user.username
          key: 'username',
          type: 'input',
          templateOptions: {
            label: 'Username',
            placeholder: 'johndoe',
            required: true,
            description: 'Descriptive text'
          }
        },
        {
          key: 'password',
          type: 'input',
          templateOptions: {
            type: 'password',
            label: 'Password',
            required: true
          },
          expressionProperties: {
            'templateOptions.disabled': '!model.username' // disabled when username is blank
          }
        }
      ];        
    }

    submit() {

        let styles = this.pdfStylesheet;
        var text = `<!DOCTYPE html>
        <html>
        <head>   
            <style>${this.pdfStylesheet}</style>
        </head>
        <body>
            <div class="ql-snow">
                <div class="ql-editor">
                    ${this.pdfText}
                </div>
            </div>
        </body>
        </html>`;


        var postData = {
            text: text
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
