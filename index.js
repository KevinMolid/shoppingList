import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://realtime-database-1944c-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")
const booksInDB = ref(database, "Books")

const addBtn = document.getElementById("add-btn")
const inputField = document.getElementById("input-field")
const shoppingList = document.getElementById("shopping-list")

onValue(shoppingListInDB, function(snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val())

    clearShoppingList()
  
    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i]
      let currentItemID = currentItem[0]
      let currentItemValue = currentItem[1]
  
      addToShoppingList(currentItem)
    }
  } else {
    shoppingList.innerHTML = `Your shopping list is empty!`
  }
})

addBtn.addEventListener("click", function() {
  let inputValue = inputField.value
  if (inputValue != "") {
    clearInputField()

    push(shoppingListInDB, inputValue)
  
    console.log(`${inputValue} added to database`)
  }
})

function clearInputField() {
  inputField.value = ""
}

function clearShoppingList() {
  shoppingList.innerHTML = ""
}

function addToShoppingList(item) {
  // shoppingList.innerHTML += `<li>${item}</li>`
  let itemID = item[0]
  let itemValue = item[1]

  let newEl = document.createElement("li")

  newEl.addEventListener("dblclick", function() {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)

    remove(exactLocationOfItemInDB)
    console.log(`${itemValue} removed from database`)
  })

  newEl.textContent = itemValue
  shoppingList.append(newEl)
}