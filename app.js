var dataModule = (function () {
    var Expense = function (description, value, id) {
        this.description = description;
        this.value = value;
        this.id = id;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function (totalIncome) {
        this.percentage = totalIncome > 0 ? Math.round((this.value / totalIncome) * 100) : -1;

    }
    var Income = function (description, value, id) {
        this.description = description;
        this.value = value;
        this.id = id;
    }
    var calculateTotals = function (type) {
        var sum = 0;
        userData.items[type].forEach(function (curr) {
            sum += curr.value;
        });
        userData.totals[type] = sum;

    }
    var userData = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        },
        removeItem: function (type, ID) {
            userData.items[type] = userData.items[type].filter(function (curr) {
                return curr.id !== ID;
            });
        },
        calculateBudget: function () {
            calculateTotals("inc");
            calculateTotals("exp");
            userData.budget = userData.totals.inc - userData.totals.exp;
            userData.percentage = userData.totals.inc > 0 ? Math.round((userData.totals.exp / userData.totals.inc) * 100) : -1;
        },
        calculatePercentages: function () {
            userData.items.exp.forEach(function (curr) {
                curr.calcPercentage(userData.totals.inc);
            });
        },
        getBudget: function () {
            return {
                budget: userData.budget,
                percentage: userData.percentage,
                total: userData.totals
            }
        },
        getPercentages: function () {
            var percentageArray;
            percentageArray = userData.items.exp.map(function (curr) {
                console.log(curr.percentage);
                return curr.percentage;
            });
            return percentageArray;
        }

    };

})();

var UImodule = (function () {
    var DOMclasses = {
        inputType: ".add__type",
        inputDesc: ".add__description",
        inputVal: ".add__value",
        exp: ".expenses__list",
        inc: ".income__list",
        budgetIncome: ".budget__income--value",
        budgetExpense: ".budget__expenses--value",
        budgetExpensePercentage: ".budget__expenses--percentage",
        budgetValue: ".budget__value",
        percentages: ".item__percentage",
        month: ".budget__title--month"
    };
    var formatNumbers = function (num, type) {
        var int, dec, sign;
        num = num.toFixed(2);
        num = num.toString();
        int = num.split(".")[0];
        dec = num.split(".")[1];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
        }
        sign = type === "inc" ? "+" : "-";
        return sign + " " + int + "." + dec
    }
    return {
        getInputData: function () {
            return {
                type: document.querySelector(DOMclasses.inputType).value,
                description: document.querySelector(DOMclasses.inputDesc).value,
                value: parseFloat(document.querySelector(DOMclasses.inputVal).value)

            };
        },
        addToUI: function (obj, type) {
            var htmlString, newHTML;
            if (type == "inc") {
                htmlString = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            }
            else {
                htmlString = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete">  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }
            newHTML = htmlString.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', formatNumbers(obj.value, type));
            document.querySelector(DOMclasses[type]).insertAdjacentHTML("beforeend", newHTML);

        },
        deleteFromUI: function (selectorID) {
            var deleteElem = document.getElementById(selectorID);
            deleteElem.parentNode.removeChild(deleteElem);
        },
        emptyFields: function () {
            var inputItems, inputArray;
            inputItems = document.querySelectorAll(DOMclasses.inputVal + "," + DOMclasses.inputDesc);
            inputArray = Array.prototype.slice.call(inputItems);
            inputArray.forEach(function (current, i, arr) {
                current.value = "";
            });
            inputArray[0].focus();
        },
        displayBudget: function (obj) {
            var budgetType;
            budgetType = obj.budget >= 0 ? "inc" : "exp";
            document.querySelector(DOMclasses.budgetIncome).textContent = formatNumbers(obj.total.inc, "inc");
            document.querySelector(DOMclasses.budgetExpense).textContent = formatNumbers(obj.total.exp, "exp");
            document.querySelector(DOMclasses.budgetExpensePercentage).textContent = obj.percentage > 0 ? obj.percentage + "%" : "-";
            document.querySelector(DOMclasses.budgetValue).textContent = formatNumbers(obj.budget, budgetType);
        },
        displayPercentages: function (perc) {
            var inputItems, inputArray;
            inputItems = document.querySelectorAll(DOMclasses.percentages);
            inputArray = Array.prototype.slice.call(inputItems);
            inputArray.forEach(function (elem, index) {
                elem.textContent = perc[index] >= 0 ? perc[index] + "%" : "-";
            });
        },
        displayDate: function () {
            var now, currentYear, currentMonth;
            var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            now = new Date();
            currentYear = now.getFullYear();
            currentMonth = now.getMonth();
            document.querySelector(DOMclasses.month).textContent = monthArray[currentMonth] + " " + currentYear;
        }
    }
})();

var controller = (function (dataMod, UImod) {
    var updateBudget = function () {
        var budgetObj;
        dataMod.calculateBudget();
        budgetObj = dataMod.getBudget();
        UImod.displayBudget(budgetObj);
    };
    var updatePercentages = function () {
        var percentages;
        dataMod.calculatePercentages();
        percentages = dataMod.getPercentages();
        UImod.displayPercentages(percentages);
    }
    var addItem = function () {
        var userInput, newItem;
        userInput = UImod.getInputData();
        if (userInput.description !== "" && !isNaN(userInput.value) && userInput.value > 0) {
            newItem = dataMod.addItem(userInput.type, userInput.description, userInput.value);
            UImod.addToUI(newItem, userInput.type);
            UImod.emptyFields();
            updateBudget(dataMod, UImod);
            updatePercentages(dataMod, UImod);
        }
    }
    var deleteItem = function (e) {
        var itemID, type, ID;
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            type = itemID.split("-")[0];
            ID = parseInt(itemID.split("-")[1]);
        }
        dataMod.removeItem(type, ID);
        UImod.deleteFromUI(itemID);
        updateBudget(dataMod, UImod);
        updatePercentages(dataMod, UImod);
    }

    var events = function () {
        document.querySelector(".add__btn").addEventListener('click', addItem);
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13) {
                addItem();
            }

        })
        document.querySelector(".container").addEventListener("click", deleteItem);
    }
    return {
        init: function () {
            events();
            UImod.displayDate();
        }
    }

})(dataModule, UImodule);

controller.init();