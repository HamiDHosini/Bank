
let users = [
  { username: "user1", name: "علی", password: "1234", balance: 5000, transactions: [] },
  { username: "user2", name: "محمد", password: "5678", balance: 3000, transactions: [] },
  { username: "user3", name: "زهرا", password: "abcd", balance: 7000, transactions: [] }
];

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function loadUsers() {
  const storedUsers = localStorage.getItem("users");
  if (storedUsers) {
    users = JSON.parse(storedUsers);
  }
}

loadUsers();

let currentUser = null;

function checkLoginStatus() {
  const savedUsername = localStorage.getItem("currentUser");
  if (savedUsername) {
    currentUser = users.find(user => user.username === savedUsername);
    if (currentUser) {
      document.getElementById("auth-section").classList.add("d-none");
      document.getElementById("account-section").classList.remove("d-none");
      document.getElementById("user-info").classList.remove("d-none");
      document.getElementById("user-name").innerText = currentUser.name;
      updateBalance();
      displayTransactions();
    }
  }
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  currentUser = users.find(user => user.username === username && user.password === password);

  if (currentUser) {
    localStorage.setItem("currentUser", currentUser.username);
    document.getElementById("auth-section").classList.add("d-none");
    document.getElementById("account-section").classList.remove("d-none");
    document.getElementById("user-info").classList.remove("d-none");
    document.getElementById("user-name").innerText = currentUser.name;
    updateBalance();
    displayTransactions();
  } else {
    showAlert("نام کاربری یا رمز عبور اشتباه است.", "danger");
  }
}

function updateBalance() {
  document.getElementById("balance").innerText = currentUser.balance;
}

function displayTransactions() {
const receivedTransactionsContainer = document.getElementById("received-transactions");
const sentTransactionsContainer = document.getElementById("sent-transactions");

receivedTransactionsContainer.innerHTML = "";
sentTransactionsContainer.innerHTML = "";

currentUser.transactions.forEach(transaction => {
const transactionDiv = document.createElement("div");
transactionDiv.classList.add("transaction");

const transactionDate = document.createElement("p");
transactionDate.classList.add("transaction-date");
transactionDate.innerText = `${transaction.date}`;
transactionDiv.appendChild(transactionDate);

const transactionType = document.createElement("p");
transactionType.classList.add("transaction-type");
transactionType.innerText = transaction.type; 
transactionDiv.appendChild(transactionType);

const transactionAmount = document.createElement("p");
transactionAmount.classList.add("transaction-amount");
transactionAmount.innerText = `$${transaction.amount}`;
if (transaction.type === "دریافت") {
  transactionDiv.classList.add("transaction-received");
  transactionAmount.classList.add("transaction-amount-received");
} else {
  transactionDiv.classList.add("transaction-sent");
  transactionAmount.classList.add("transaction-amount-sent");
}
transactionDiv.appendChild(transactionAmount);

const transactionSenderReceiver = document.createElement("p");
transactionSenderReceiver.classList.add("transaction-sender-receiver");

const senderUser = users.find(user => user.username === transaction.sender);
const receiverUser = users.find(user => user.username === transaction.receiver);

transactionSenderReceiver.innerText = `از ${senderUser ? senderUser.name : transaction.sender} به ${receiverUser ? receiverUser.name : transaction.receiver}`;
transactionDiv.appendChild(transactionSenderReceiver);

if (transaction.type === "دریافت") {
  receivedTransactionsContainer.appendChild(transactionDiv);
} else {
  sentTransactionsContainer.appendChild(transactionDiv);
}
});
}


function showAlert(message, type) {
  const alertContainer = document.getElementById("alert-container");
  const alertDiv = document.createElement("div");
  alertDiv.classList.add("alert", `alert-${type}`);
  alertDiv.innerText = message;
  alertContainer.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}
function transferMoney() {
const transferTo = document.getElementById("transfer-to").value;
const transferAmount = parseFloat(document.getElementById("transfer-amount").value);

if (currentUser.username === transferTo) {
showAlert("شما نمی‌توانید پول به حساب خودتان انتقال دهید.", "warning");
return;
}

const receiver = users.find(user => user.username === transferTo);
if (receiver && transferAmount > 0 && currentUser.balance >= transferAmount) {
currentUser.balance -= transferAmount;
receiver.balance += transferAmount;
currentUser.transactions.push({
  type: "ارسال",
  amount: transferAmount,
  sender: currentUser.username,
  receiver: receiver.username,
  date: new Date().toLocaleString()
});
receiver.transactions.push({
  type: "دریافت",
  amount: transferAmount,
  sender: currentUser.username,
  receiver: receiver.username,
  date: new Date().toLocaleString()
});

document.getElementById("transfer-to").value = "";
document.getElementById("transfer-amount").value = "";

saveUsers();
updateBalance();
displayTransactions();
showAlert("انتقال وجه با موفقیت انجام شد.", "success");
} else {
showAlert("مبلغ انتقال اشتباه است یا موجودی کافی ندارید.", "danger");
}
}

function logout() {
  localStorage.removeItem("currentUser");
  currentUser = null;
  document.getElementById("auth-section").classList.remove("d-none");
  document.getElementById("account-section").classList.add("d-none");
  document.getElementById("user-info").classList.add("d-none");
}
document.getElementById("sort-transactions-btn").addEventListener("click", sortTransactions);


function sortTransactions() {
currentUser.transactions.sort((a, b) => new Date(b.date) - new Date(a.date)); 
displayTransactions();
}


checkLoginStatus();

document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("transfer-btn").addEventListener("click", transferMoney);
document.getElementById("logout-btn").addEventListener("click", logout);
