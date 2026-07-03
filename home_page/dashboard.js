let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
    alert("User not logged in");
    window.location.href = "../index.html";
}
let chartCanvas = document.getElementById("cashFlowChart");
let cashFlowChart
let logOutBtn = document.getElementById("log-out-btn");

let transactionForm = document.querySelector("#transaction-form");
let transactionList = document.querySelector("#transaction-list");

const overlay = document.getElementById("modal-overlay");
const addBtn = document.getElementById("add-btn");
const closeBtn = document.getElementById("close-modal");

const dashboardLink = document.getElementById("dashboard");
const settingsLink = document.getElementById("setting");
const dashboardSection = document.querySelector(".dashboard-section");
const settingsSection = document.querySelector(".settings-section");

let currentBalance = document.querySelector("#current-balance");
let totalIncome = document.querySelector("#total-income");
let totalExpense = document.querySelector("#total-expense");
let totalTransactions = document.querySelector("#total-transactions");

let searchInput = document.querySelector("#search-input");
let searchOptions = document.querySelector("#select-options");

let checkBox = document.querySelector(".theme-switch__checkbox");
let theme = JSON.parse(localStorage.getItem("theme")) || "light";

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editIndex = null;

let loggedUser=JSON.parse(localStorage.getItem("loggedInUser"));
let userNameInput= document.querySelector("#userNameInput");
userNameInput.value=loggedUser;


let currencySelection=document.querySelector("#currency-selection")
currencySelection.value =JSON.parse(localStorage.getItem("currencySymbol")) || "$";
let settingSaveBtn= document.querySelector("#settings-save-btn");
let navName= document.querySelector("#user-name")
navName.innerHTML=`${loggedUser}`


if (theme === "dark") {
    checkBox.checked = true;
    document.body.classList.add("dark-theme");
} else {
    checkBox.checked = false;
    document.body.classList.remove("dark-theme");
}

logOutBtn.addEventListener("click", () => {
    logOutBtn.style.backgroundColor = "rgb(156, 27, 27)";
    logOutBtn.style.color = "white";
    logOutBtn.style.border = "1px solid white";

    localStorage.removeItem("loggedInUser");
    window.location.href = "../index.html";
});

transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let expenseType = e.target[0].value;
    let description = e.target[1].value;
    let amount = e.target[2].value;
    let date = e.target[3].value;
    let category = e.target[4].value;

    if (
        expenseType === "" ||
        description.trim() === "" ||
        amount === "" ||
        amount <= 0 ||
        date === "" ||
        category === ""
    ) {
        alert("Fill all values");
        return;
    }

    let transaction = {
        expenseType,
        description,
        amount,
        date,
        category
    };

    if (editIndex === null) {
        transactions.push(transaction);
    } else {
        transactions[editIndex] = transaction;
        localStorage.setItem("transactions", JSON.stringify(transactions));
        renderTransaction(transactions);
        editIndex = null;
    }
    localStorage.setItem("transactions", JSON.stringify(transactions));

    renderTransaction(transactions);
    updateDashboardCards();
    updateChart()
    transactionForm.reset();
    overlay.style.display = "none";
});

addBtn.addEventListener("click", () => {
    overlay.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
});

dashboardLink.addEventListener("click", (e) => {
    e.preventDefault();

    dashboardSection.style.display = "block";
    settingsSection.style.display = "none";
});

settingsLink.addEventListener("click", (e) => {
    e.preventDefault();

    settingsSection.style.display = "block";
    dashboardSection.style.display = "none";
});

searchInput.addEventListener("input", (e) => {

    let description = e.target.value.toLowerCase();

    let filteredTransactions = transactions.filter((value) => {
        return value.description.toLowerCase().includes(description);
    });

    renderTransaction(filteredTransactions);
});

searchOptions.addEventListener("change", (e) => {
    let option = e.target.value;

    if (option === "all") {
        renderTransaction(transactions);
    } else {
        let selectedTransactions = transactions.filter(t => t.expenseType === option);
        renderTransaction(selectedTransactions);
    }
});

checkBox.addEventListener("change", () => {
    if (checkBox.checked) {
        theme = "dark";
        document.body.classList.add("dark-theme");
    } else {
        theme = "light";
        document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("theme", JSON.stringify(theme));
});

function renderTransaction(array) {
    let currency=JSON.parse(localStorage.getItem("currencySymbol"))||"$"

    transactionList.innerHTML = "";

    array.forEach((elem, index) => {

        let sign;
        let textColor;

        if (elem.expenseType === "expense") {
            sign = "-";
            textColor = "red";
        } else {
            sign = "+";
            textColor = "green";
        }

        transactionList.innerHTML += `
            <tr>
                <td>${elem.date}</td>
                <td>${elem.description}</td>
                <td>${elem.category}</td>
                <td style="color:${textColor};">${currency}${elem.amount}</td>
               <td>
    <button onclick="editTransaction(${index})" class="edit-btn">
        Edit
    </button>

    <button onclick="deleteTransaction(${index})" class="delete-btn">
        Delete
    </button>
</td>
            </tr>
        `;
    });
}

function deleteTransaction(index) {

    transactions.splice(index, 1);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    renderTransaction(transactions);
    updateDashboardCards();
    updateChart()
}

function updateDashboardCards() {

    let income, expense, transactionCount, balance;

    income = transactions.reduce((acc, elem) => {

        if (elem.expenseType === "income") {
            return acc + Number(elem.amount);
        }

        return acc;

    }, 0);

    expense = transactions.reduce((acc, elem) => {

        if (elem.expenseType === "expense") {
            return acc + Number(elem.amount);
        }

        return acc;

    }, 0);

    transactionCount = transactions.length;
    balance = income - expense;
    let symbol=JSON.parse(localStorage.getItem("currencySymbol"))||"$"

  currentBalance.innerHTML = `${symbol}${balance}`;
totalIncome.innerHTML = `${symbol}${income}`;
totalExpense.innerHTML = `${symbol}${expense}`;
    totalTransactions.innerHTML = transactionCount;
}

function editTransaction(index) {
    editIndex = index;
    let element = transactions[index];
    let expenseType = element.expenseType;
    let description = element.description;
    let date = element.date;
    let category = element.category;
    let amount = element.amount;

    overlay.style.display = "flex";
    transactionForm[0].value = expenseType;
    transactionForm[1].value = description;
    transactionForm[2].value = amount;
    transactionForm[3].value = date;
    transactionForm[4].value = category;
}

function updateChart() {
    let income, expense;

        income = transactions.reduce((acc, elem) => {

            if (elem.expenseType === "income") {
                return acc + Number(elem.amount);
            }

            return acc;

        }, 0);

    expense = transactions.reduce((acc, elem) => {

        if (elem.expenseType === "expense") {
            return acc + Number(elem.amount);
        }

        return acc;

    }, 0);
    if(cashFlowChart){
        cashFlowChart.destroy();

    }
   cashFlowChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
        labels: ["Income", "Expense"],
        datasets: [{
            data: [income, expense],
            backgroundColor: [
                "#22c55e",
                "#ef4444"
            ]
        }]
    }
});
}

function saveSettings() {
    let name = userNameInput.value.trim();
    let symbol=currencySelection.value;
    localStorage.setItem("currencySymbol",JSON.stringify(symbol))

    if (name === "") {
        alert("Please enter your name.");
        return;
    }


    loggedUser = name;

    localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));

    navName.innerHTML = name;

    updateDashboardCards();
    renderTransaction(transactions);

    alert("Settings Saved Successfully!");
}
let resetBtn= document.querySelector("#reset-btn")

resetBtn.addEventListener("click",()=>{

let choice= confirm("Do you want to reset?");
if(choice){
    transactions=[];
    localStorage.setItem("transactions",JSON.stringify(transactions));
    renderTransaction(transactions)
    updateDashboardCards();
    updateChart()
    
}



})

settingSaveBtn.addEventListener("click", saveSettings);


renderTransaction(transactions);
updateDashboardCards();
updateChart()