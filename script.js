// main.js (Firebase Modular API)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded, onChildChanged, onChildRemoved, update, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUzB0ouxr2PtKioOu2hW-EgKM7Tn8cgFY",
  authDomain: "chatapp-238f4.firebaseapp.com",
  databaseURL: "https://chatapp-238f4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatapp-238f4",
  storageBucket: "chatapp-238f4.firebasestorage.app",
  messagingSenderId: "281859247367",
  appId: "1:281859247367:web:abbac69eaf82b41e2689a2"
};


const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


// ==================================
// Google Authentication
// ==================================
onAuthStateChanged(auth, (user) => {
    if(user) {
        $("#userInfo").text("Log in as " + user.displayName)
        $("#loginBtn").hide()
        $("#addChatBtn").show()
        $("#logoutBtn").show()
    }else
    {
        $("#userInfo").text("Please login to continue")
        $("#loginBtn").show()
        $("#addChatBtn").hide()
        $("#logoutBtn").hide()
    }
})


// ==================================
// Login / Logout
// ==================================
$(document).ready(function() {
    $("#loginBtn").click(async function () {
        try {
            const result = await signInWithPopup(auth, provider)
        } catch (err)
        {
            console.error("Google Login Error")
        }
    })

    $("#logoutBtn").click(async function () {
        try {
            await signOut(auth)
        }catch(err)
        {
            console.error("Logout error: " + err)
        }
    })
})




// define chatBox draggability
const dragSettings= {
    // the chatBox becomes undraggable when people starts typing
    cancel: '.textarea', 

    // a chatBox being draaged has to go to the top layer
    "zIndex": 3000,

    // maintain stacking order
    "stack": '.chatBox'
}

// on page loaded
$(document).ready(function() {
    rebuildAllChats()

    $('#addChatBtn').click(addChatToBoard)

    // save all raw just before the app is closed
    window.onbeforeunload = saveChatToStorage
})


function buildChatBox(text="", top=150, left=30)
{
    // create a chatbox using html codes 
    let chatBox = ''
    + ' <div class="chatBox" '

    + 'style="left:' + left + 'px; '
    + 'top:' + top + 'px" >'

    + ' <div class="toolbar"> '
    + ' <span class="close"> x </span> '
    + ' </div> '

    + ' <div class="textarea" contenteditable="true"> '
    + text
    + ' </div> '

    + ' </div> '

    return chatBox
}

function addChatToBoard()
{
    var newChat = buildChatBox()
    $('#pinboard').append(newChat)
    $('.chatBox').draggable(dragSettings)
    $('span.close').click(deleteChat)
}

function deleteChat()
{
    // identify the chatBox the close button belongs to
    // this refers to the close button itself
    $(this).closest('.chatBox').fadeOut('fast', function() {
        $(this).remove()
    })
}


function saveChatToStorage()
{
    // clear all data in local storage
    window.localStorage.clear()

    // convert chat into JSON (JavaScript Object Notation) object
    // JSON decribes how data are transferred accross the network
    // JSON stores data in key-value pair
    $('.chatBox').each(function() {
        const jsonData = {
            top: parseInt($(this).position().top),
            left: parseInt($(this).position().left),
            text: $(this).children('.textarea').text(),
        }

        // assign an id to each jsonData 
        var chatID = window.localStorage.length

        // push jsonData to browser's local storage
        window.localStorage.setItem(chatID, JSON.stringify(jsonData))

    })
}

function rebuildAllChats()
{
    // identify the number of jsonData in local storage
    const numData = window.localStorage.length
    
    // begin reconstruction if it has at least 1 jsonData
    if(numData > 0)
    {
        for(var i = 0; i < numData; i++)
        {
            // retrieve chatID
            var chatID = window.localStorage.key(i)

            // retrieve the corresponding jsonData
            const jsonData = JSON.parse(window.localStorage.getItem(chatID))

            // rebuild chatBox with jsonData
            const chatBox = buildChatBox(jsonData.text, jsonData.top, jsonData.left)

            // re-attach chatBox to pinboard
            $('#pinboard').append(chatBox)
        }
    }

    $('chatBox').draggable(dragSettings)
    $('span.close').click(deleteChat)
}