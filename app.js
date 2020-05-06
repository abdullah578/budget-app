var dataModule = (function () {

})();

var UImodule = (function () {
    var DOMclasses = {
        inputType: ".add__type",
        inputDesc: ".add__description",
        inputVal: ".add__value"
    };
    return {
        getInputData: function () {
            return {
                type: document.querySelector(DOMclasses.inputType).value,
                description: document.querySelector(DOMclasses.inputDesc).value,
                value: document.querySelector(DOMclasses.inputVal).value

            };
        }
    }
})();

var controller = (function (dataMod, UImod) {
    var action = function () {
        var userInput = UImod.getInputData();
    }

    var events = function () {
        document.querySelector(".add__btn").addEventListener('click', action);
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 1) {
                action();
            }

        })
    }
    return {
        init: function () {
            events();
        }
    }

})(dataModule, UImodule);

controller.init();