var mysql = require("mysql");
var inquirer = require("inquirer")
var fs = require("fs")
var product = "";

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
        };
        productlist.push(new inquirer.Separator())
        productlist.push("return")
        productlist.push(new inquirer.Separator())
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
        resultlist.push(new inquirer.Separator())
        resultlist.push("return")
        resultlist.push(new inquirer.Separator())
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
              console.log("sold")
              updateinventory();
          }
          else {
            console.log("Cancelled \n Returning to main menu")
            bamazon_customer();
          }
      })
    }
  function updateinventory(){
    connection.query("UPDATE bamazon.products SET stock_quantity = stock_quantity - 1 WHERE product_name='"+product+"';", function(err, res) {
      if (err) throw err
      console.log(product+" Stock Updated!")
      bamazon_customer();
    })
  }
 