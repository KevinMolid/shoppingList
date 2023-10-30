import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, get, child, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://realtime-database-1944c-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const addBtn = document.getElementById("add-btn")
const inputField = document.getElementById("input-field")
const shoppingList = document.getElementById("shopping-list")

onValue(shoppingListInDB, function(snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val())

    clearShoppingList()
  
    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i]
      let currentItemActive = currentItem[1].active
  
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

    const newItem = {value: inputValue, category: 'none', active: true}

    push(shoppingListInDB, newItem)
  
    console.log(`${inputValue} added to database`)

    inputField.focus()
  }
})

function clearInputField() {
  inputField.value = ""
}

function clearShoppingList() {
  shoppingList.innerHTML = ""
}

function addToShoppingList(item) {
  let itemID = item[0]
  let itemValue = item[1].value
  let itemCategory = item[1].category
  let itemActive = item[1].active

  let newEl = document.createElement("li")

  /* Set style according to active status */
  if(itemActive){
    newEl.classList.remove('inactive')
  } else{
    newEl.classList.add('inactive')
  }

  newEl.addEventListener('click', function(){
    /* Toggles active status when clicked */
    itemActive = !itemActive
  })

  newEl.addEventListener("dblclick", function() {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)

    remove(exactLocationOfItemInDB)
    console.log(`${itemValue} removed from database`)
  })

  /* Set text of element to item value*/
  newEl.textContent = itemValue

  shoppingList.append(newEl)
}