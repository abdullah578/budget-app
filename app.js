var dataModule = (function () {
    //function constructors to create the income and expense objects
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
    // calculates the total income and the total expenses
    var calculateTotals = function (type) {
        var sum = 0;
        userData.items[type].forEach(function (curr) {
            sum += curr.value;
        });
        userData.totals[type] = sum;

    }
    // used to hold the data structures
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
        //adds item to the data structure
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
        // removes item from data structure
        removeItem: function (type, ID) {
            userData.items[type] = userData.items[type].filter(function (curr) {
                return curr.id !== ID;
            });
        },
        //calculates the budget
        calculateBudget: function () {
            calculateTotals("inc");
            calculateTotals("exp");
            userData.budget = userData.totals.inc - userData.totals.exp;
            userData.percentage = userData.totals.inc > 0 ? Math.round((userData.totals.exp / userData.totals.inc) * 100) : -1;
        },
        //calculates the expense percentages
        calculatePercentages: function () {
            userData.items.exp.forEach(function (curr) {
                curr.calcPercentage(userData.totals.inc);
            });
        },
        //return the budget
        getBudget: function () {
            return {
                budget: userData.budget,
                percentage: userData.percentage,
                total: userData.totals
            }
        },
        //returns the expense percentages
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
    //holds the required  DOM css selectors 
    var DOMclasses = {
        inputType: ".add__type",
        inputDesc: ".add__description",
        inputVal: ".add__value",
        inputBtn: ".add__btn",
        exp: ".expenses__list",
        inc: ".income__list",
        budgetIncome: ".budget__income--value",
        budgetExpense: ".budget__expenses--value",
        budgetExpensePercentage: ".budget__expenses--percentage",
        budgetValue: ".budget__value",
        percentages: ".item__percentage",
        month: ".budget__title--month"
    };
    // display numbers with two decimal points and with the appropiate sign
    var formatNumbers = function (num, type) {
        var int, dec, sign;
        num = Math.abs(num);
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
        // acquire data from the input fields
        getInputData: function () {
            return {
                type: document.querySelector(DOMclasses.inputType).value,
                description: document.querySelector(DOMclasses.inputDesc).value,
                value: parseFloat(document.querySelector(DOMclasses.inputVal).value)

            };
        },
        // dislay the income/expense in the user interface
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
        //remove the expense/budget from the user interface
        deleteFromUI: function (selectorID) {
            var deleteElem = document.getElementById(selectorID);
            deleteElem.parentNode.removeChild(deleteElem);
        },
        //clear out the empty fields
        emptyFields: function () {
            var inputItems, inputArray;
            inputItems = document.querySelectorAll(DOMclasses.inputVal + "," + DOMclasses.inputDesc);
            inputArray = Array.prototype.slice.call(inputItems);
            inputArray.forEach(function (current) {
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
        //display the month and year on the user interface
        displayDate: function () {
            var now, currentYear, currentMonth;
            var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            now = new Date();
            currentYear = now.getFullYear();
            currentMonth = now.getMonth();
            document.querySelector(DOMclasses.month).textContent = monthArray[currentMonth] + " " + currentYear;
        },
        //chage outline to red for expenses
        changeFocus: function () {
            var inputItems, inputArray;
            inputItems = document.querySelectorAll(DOMclasses.inputVal + "," + DOMclasses.inputDesc + "," + DOMclasses.inputType);
            inputArray = Array.prototype.slice.call(inputItems);
            inputArray.forEach(function (curr) {
                curr.classList.toggle("red-focus");
            });
            document.querySelector(DOMclasses.inputBtn).classList.toggle("red");
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
        // get item from the input fields
        userInput = UImod.getInputData();
        if (userInput.description !== "" && !isNaN(userInput.value) && userInput.value > 0) {
            //add item to data structure
            newItem = dataMod.addItem(userInput.type, userInput.description, userInput.value);
            //add item to the user interface
            UImod.addToUI(newItem, userInput.type);
            // empty the input fields
            UImod.emptyFields();
            //update the budget and percentages
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
            //delete item from data structure
            dataMod.removeItem(type, ID);
            //delete item from user interface
            UImod.deleteFromUI(itemID);
            //update budget and percentages
            updateBudget(dataMod, UImod);
            updatePercentages(dataMod, UImod);
        }
    }

    var events = function () {
        //event listeners
        document.querySelector(".add__btn").addEventListener('click', addItem);
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13) {
                addItem();
            }

        })
        document.querySelector(".container").addEventListener("click", deleteItem);
        document.querySelector(".add__type").addEventListener("change", UImod.changeFocus);
    }
    return {
        init: function () {
            events();
            UImod.displayDate();
        }
    }

})(dataModule, UImodule);

controller.init();