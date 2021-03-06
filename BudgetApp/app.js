//Budget Controller
var budgetController = (function() {

   var Expense = function(id, description , value){
       this.id =id ;
       this.description = description ;
       this.value = value ;

   };
   var Income = function(id, description , value){
    this.id =id ;
    this.description = description ;
    this.value = value ;
   };

   var calculateTotal = function(type){
       var sum = 0 ;
       data.allItems[type].forEach(function(cur){
           sum += cur.value;

       });
       data.totals[type] =sum; 

   };

   var data = {
       allItems: {
       exp : [],
       inc : []
   },
    totals : { 
        exp : 0,
        inc : 0
    },
    budget : 0 ,
    percentage : -1
};
return {
    addItem : function(type , des , val){
       var newItem , ID ;
        // create new id
        if(data.allItems[type].length>0){
         ID = data.allItems[type][data.allItems[type].length -1].id + 1
        }
        else {
            ID= 0;
        }

         // create new item based on 'inc' or 'exp'

        if (type === 'exp'){
       newItem = new Expense(ID , des , val);
        }
        else if (type ==='inc'){
            newItem = new Income(ID , des , val);
        }
        data.allItems[type].push(newItem);
        return newItem ; 
    },

    deleteItem : function(type , id ){
        var ids , index ; 
       ids = data.allItems[type].map(function(current){
          return current.id;
        });

        index = ids.indexOf(id);

        if(index !== -1){
            data.allItems[type].splice(index , 1);
        }


                 
    },

    calculateBudget: function(){
    //calculate total income and expenses 
        calculateTotal('exp');
        calculateTotal('inc');

    // calculate the budget : income -expenses
    
   
    data.budget = data.totals.inc - data.totals.exp ;
    if(data.totals.inc > 0){
    // calculate the percentage of income that we spent 
    data.percentage =Math.round((data.totals.exp / data.totals.inc) * 100) ;
    }
    else{
        data.percentage = -1 ;
    }
    },

    getbudget : function(){

        return{
            budget : data.budget,
            totalInc : data.totals.inc ,
            totalExp : data.totals.exp,
            percentage : data.percentage
        };


    },

    testing : function(){
        console.log(data);
    }
};


}) ();
 



//UI Controller
var UIController = (function(){
    var DOMstrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputButton : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel :'.budget__income--value',
        expenseLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        container : '.container',

    };

    return {
            getinput : function(){
                return {
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription).value ,
            value:parseFloat( document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addlistItem : function(obj ,type){
            var html, newHtml , element;

            // create html string with placeholder text 
            if (type === 'inc'){
             element = DOMstrings.incomeContainer  ;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description</div><div class="right clearfix"><div class="item__value">%value</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type==='exp'){
            element = DOMstrings.expenseContainer ;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description</div><div class="right clearfix"><div class="item__value">%value</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
          // Replace the placeholder text with some actual data 

          newHtml = html.replace('%id', obj.id);
          newHtml = newHtml.replace('%description', obj.description);
          newHtml = newHtml.replace('%value', obj.value);

         document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

        deleteListItem: function(selectorID) {
          var el=  document.getElementById(selectorID);
          el.parentNode.removeChild(el);
           
        },


        clearFields : function(){
            var fields , fieldsArr ;

        fields = document.querySelectorAll(DOMstrings.inputDescription + ' ,' + DOMstrings.inputValue);
           
         fieldsArr= Array.prototype.slice.call(fields);

         fieldsArr.forEach(function(current, index , array){
             current.value = "";
         });

         fieldsArr[0].focus();

        },

        displayBudget : function(obj){
            
            document.querySelector(DOMstrings.budgetLabel).textContent =obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent =obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent =obj.totalExp;
           
             if (obj.percentage >0 ){
                document.querySelector(DOMstrings.percentageLabel).textContent =obj.percentage + '%';
             }
             else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
             }

        },

        getDomStrings : function(){
            return DOMstrings ;
        }
    }

})();







//Global App Controller
var controller = (function(budgetCtrl, UIctrl){


     var setupEventListeners = function(){

    var DOM = UIctrl.getDomStrings();
    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
 
    document.addEventListener('keypress', function(event){
        if(event.keyCode===13 || event.which===13){

         ctrlAddItem();

        }
    });

    document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);



 };


     var updatebudget = function(){
         // calculate the budget 
           budgetCtrl.calculateBudget();

           // return the budget 
           var budget = budgetCtrl.getbudget();

           UIctrl.displayBudget(budget);

     };

     var updatePercentage: Function(){

     }


    var ctrlAddItem = function(){

    var input , newItem ;
     //Get the field input data  

    input = UIctrl.getinput ();

    if(input.description !== "" && !isNaN(input.value) && input.value>0){

     // add the item to the budget controller 

    newItem= budgetCtrl.addItem(input.type , input. description , input .value);
    

     // Add the item to the UI
     UIctrl.addlistItem(newItem, input.type);

     // clears the fields 

     UIctrl.clearFields();

    
    // calculate and update budget
    
    updatebudget();

    }

    };

    var ctrlDeleteItem = function(event){
         var itemID , splitID ;
         itemID =event.target.parentNode.parentNode.parentNode.parentNode.id;

         if(itemID){
          //spliting the string and number [inc-1]
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Delete the item from the data structure

             budgetCtrl.deleteItem(type, ID);


            //Delete the item from the UI 
            UIctrl.deleteListItem(itemID);

            //update and show the budget 

            updatebudget();


         } 
    };

     return {
         init : function(){
             console.log('Application started');
             UIctrl.displayBudget({
                budget : 0 ,
                totalInc : 0,
                totalExp : 0,
                percentage : -1
            }); 
             setupEventListeners(); 

         }
     };    

}) (budgetController , UIController);

controller.init();