var mysql = require("mysql");
var inquirer = require("inquirer")
var fs = require("fs")
var clear = require("clear")
var product = "";
var buycount;
var stockCount;
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "InSeCt!@#4",
    database: "bamazon"
  });
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    bamazon_customer();
  });

  function bamazon_customer() {
    clear();
    inquirer
      .prompt({
        name: "shop",
        type: "list",
        message: "Welcome to Handy-Hardware! what would you like to do?",
        choices: [
          "Browse all tools",
          "Find tools name",
          "Enter item ID",
          "exit"
        ]
      })
      .then(function(answer) {
        switch (answer.shop) {
        case "Browse all tools":
          browse();
          break;
  
        case "Find tools name":
          name_srch();
          break;

        case "Enter item ID":
          id_srch();
          break;

        case "exit":
          connection.end();
          break;
        }
      });
  }
  
  
  function browse() {
    connection.query("SELECT * FROM products", function(err, res) {
      var productlist = [];
      if (err) throw err;
      for (i = 0; i < res.length; i++){
          productlist.push(res[i].product_name)
        }
      inquirer
        .prompt({
          name: "shopall",
          type: "list",
          message: "Please select an item:",
          choices: productlist
        })
        .then(function(answer) {
          for (i = 0; i < productlist.length; i++){
            switch (answer.shopall) {
              case productlist[i]:
              console.log("you've selected: " + res[i].product_name+"\n price: "+res[i].price+"\n Number Available: "+res[i].stock_quantity)
              product = res[i].product_name
              stockCount = res[i].stock_quantity
              buyconfirm();
              break;
            }
          }
        });
        

    })
  };
  
  function id_srch(){
    inquirer
    .prompt({
      name: "id",
      type: "input",
      message: "Enter Item number"
    })
     .then(function(answer) {
       console.log(answer.id)
       connection.query("SELECT * FROM products WHERE item_id='" + answer.id + "';", function(err, res) {
         if (err) throw err
         console.log("you've selected: " + res[0].product_name+"\n price: "+res[0].price+"\n Number Available: "+res[0].stock_quantity)
         product = res[0].product_name
         stockCount = res[0].stock_quantity
         buyconfirm();
        });
       });
  }

  function name_srch(){
    var resultlist = [];
    inquirer
    .prompt({
      name: "name",
      type: "input",
      message: "Enter Item Name"
    })
     .then(function(answer) {
       console.log(answer.name)
       connection.query("SELECT * FROM bamazon.products WHERE UPPER(product_name) LIKE UPPER('" + answer.name + "%');", function(err, res) {
         if (err) throw err
         for (i = 0; i < res.length; i++){
          resultlist.push(res[i].product_name)
        };
        inquirer
        .prompt({
          name: "srchResult",
          type: "list",
          message: "Please select an item:",
          choices: resultlist
        })
        .then(function(answer) {
          for (i = 0; i < resultlist.length; i++){
            switch (answer.srchResult) {
              case resultlist[i]:
              console.log("you've selected: " + res[i].product_name+"\n price: "+res[i].price+"\n Number Available: "+res[i].stock_quantity)
              product = res[i].product_name
              stockCount = res[i].stock_quantity
              buyconfirm();
              break;
            }
          }
        });
        });
       });
  }

  function buyconfirm(){
     inquirer
       .prompt({
         name: "buy",
         type: "confirm",
         message: "Would you like to by this item?"
       })
       .then(function(answer) {
         console.log(answer)
          if (answer.buy == true){
            inquirer
              .prompt({
                name: "howmany",
                type: "input",
                message: "How many "+product+ " would you like to buy?",
                validate: validateInput,
                filter: Number
               
              })
              .then(function(answer) {
                buycount = answer.howmany
                  if (buycount > stockCount){
                    console.log("sorry we only have: "+stockCount+" in stock");
                    buyconfirm();
                  }else{
                  console.log("sold")
                  updateinventory();
                  }
              })
          }
          else {
            console.log("Cancelled \n Returning to main menu")
            bamazon_customer();
          }
      })
  }

  function updateinventory(){
    connection.query("UPDATE bamazon.products SET stock_quantity = stock_quantity - "+buycount+" WHERE product_name='"+product+"';", function(err, res) {
      if (err) throw err


      
    })
    connection.query("SELECT * FROM bamazon.products WHERE UPPER(product_name) LIKE UPPER('" + product + "%');", function(err, res) {
      if (err) throw err
      stockCount = res[0].stock_quantity
      console.log(product+" Stock Updated! \n " +stockCount+" "+product+" Left In-Stock." )
      setTimeout(bamazon_customer, 3500)
    })
  }

  function validateInput(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);
  
    if (integer && (sign === 1)) {
      return true;
    } else {
      return 'Please enter a whole non-zero number.';
    }
  }
 