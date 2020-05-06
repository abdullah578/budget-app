var dataModule = (function () {
    var Expense = function (description, value, id) {
        this.description = description;
        this.value = value;
        this.id = id;
    };
    var Income = function (description, value, id) {
        this.description = description;
        this.value = value;
        this.id = id;
    }
    var userData = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }
    return {
        addItem: function (type, desc, val) {
            var newItem, ID;
            ID = userData.items[type].length === 0 ? 0 : userData.items[type][userData.items[type].length - 1].id + 1;
            if (type == "exp") {
                newItem = new Expense(desc, val, ID);
            } else {
                newItem = new Income(desc, val, ID);
            }
            userData.items[type].push(newItem);
            return newItem;
        }
    };

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
        var userInput, newItem;
        userInput = UImod.getInputData();
        newItem = dataMod.addItem(userInput.type, userInput.description, userInput.value);
    }

    var events = function () {
        document.querySelector(".add__btn").addEventListener('click', action);
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13) {
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