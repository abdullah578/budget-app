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
        inputVal: ".add__value",
        exp: ".expenses__list",
        inc: ".income__list"
    };
    return {
        getInputData: function () {
            return {
                type: document.querySelector(DOMclasses.inputType).value,
                description: document.querySelector(DOMclasses.inputDesc).value,
                value: document.querySelector(DOMclasses.inputVal).value

            };
        },
        addToUI: function (obj, type) {
            var htmlString, newHTML;
            if (type == "inc") {
                htmlString = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            }
            else {
                htmlString = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete">  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }
            newHTML = htmlString.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);
            document.querySelector(DOMclasses[type]).insertAdjacentHTML("beforeend", newHTML);

        }
    }
})();

var controller = (function (dataMod, UImod) {
    var action = function () {
        var userInput, newItem;
        userInput = UImod.getInputData();
        newItem = dataMod.addItem(userInput.type, userInput.description, userInput.value);
        UImod.addToUI(newItem, userInput.type);
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