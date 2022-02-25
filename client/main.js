// save the URL of the server for future uses
const msgURL = "https://curriculum-api.codesmith.io/messages";

// Load the latest 50 messages by sending a GET request
document.addEventListener("DOMContentLoaded", () => {
  fetch(msgURL)
    .then((data) => data.json())
    .then((data) => {
      const messages = data.reverse().slice(-50).reverse();
      displayMessages(messages);
    });
});

// create another GET request every 3s to refresh the chatbox
document.addEventListener("DOMContentLoaded", function () {
  const fetchInterval = 3000;
  // Invoke the request every 3 seconds.
  setInterval(() => {
    fetch(msgURL)
      .then((data) => data.json())
      .then((data) => {
        // before adding the new retrieved messages, need clear past html elements
        document.getElementById("chatbox").innerHTML = null;
        const messages = data.reverse().slice(-50).reverse();
        displayMessages(messages);
      });
  }, fetchInterval);
});

// add a function to the "send" button
const button = document.getElementById("send-button");
button.addEventListener("click", sendMessage);

// add a function to press "enter" key
// and this should only work when the cursor is on the chatbox
const inputBox = document.getElementById("message-to-send");
inputBox.addEventListener("keydown", function (event) {
  if (event.key === "Enter") sendMessage();
});

// takes the message from the the input box and sends to the chatroom
function sendMessage() {
  // create the body of POST request
  const message = {
    message: document.getElementById("message-to-send").value,
    created_by: document.getElementById("username-box").value,
  };
  // if nothing in the chatbox, do nothing
  if (!message["message"]) return;

  // when we send out the request, clear input box
  document.getElementById("message-to-send").value = "";

  // send out the POST request
  fetch(msgURL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

// use data from messages to create new html elements by DOM
function displayMessages(messages) {
  messages.forEach(function (msg) {
    /*
    ----------------|
    |name  |  time  |
    |---------------|
    |content        |
    ----------------
    */
    const greaterDiv = document.createElement("div");
    const nameAndTime = document.createElement("div");
    nameAndTime.classList.add("nameAndTime");
    const content = document.createElement("div");
    content.classList.add("content");
    greaterDiv.appendChild(nameAndTime);
    greaterDiv.appendChild(content);

    const keys = ["created_by", "created_at", "message"];
    keys.forEach(function (key) {
      const smallerDiv = document.createElement("div");
      smallerDiv.classList.add(key);
      // add contents into the chatbox, and format the time
      if (key !== "created_at") smallerDiv.innerText = msg[key];
      else
        smallerDiv.innerText = msg[key]
          .replace("T", " ")
          .replace("Z", " ")
          .slice(0, -5);
      // put name and time in one div, content in the other div
      if (key !== "message") nameAndTime.appendChild(smallerDiv);
      else content.appendChild(smallerDiv);
    });

    document.getElementById("chatbox").appendChild(greaterDiv);
  });
}
