    const wizardHandler = function () {
        var service = {};

        var wizards = {};

        service.defaultName = "defaultWizard";

        service.addWizard = function(name, wizard) {
            wizards[name] = wizard;
        };

        service.removeWizard = function(name) {
            delete wizards[name];
        };

        service.wizard = function(name) {
            var nameToUse = name;
            if (!name) {
                nameToUse = service.defaultName;
            }
            
            return wizards[nameToUse];
        };
    };

    module.exports = wizardHandler;
    