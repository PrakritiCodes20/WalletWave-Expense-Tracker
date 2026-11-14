let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

updateCards();

document.getElementById("addBtn").addEventListener("click", function () {
  let field = document.getElementById("Fields").value;
  let amountValue = document.getElementById("amount").value;
  let amount = Number(amountValue);
  let category = document.getElementById("category").value;
  let date = document.getElementById("date").value;

  let type = "";

  if (document.getElementById("income").checked) {
    type = "Income";
  } else if (document.getElementById("expense").checked) {
    type = "Expense";
  }

  if (
    field == "" ||
    amountValue == "" ||
    category == "" ||
    type == "" ||
    date == ""
  ) {
    alert("Please Fill All Fields");
    return;
  }

  let obj = {
    field,
    amount,
    category,
    type,
    date,
  };

  transactions.push(obj);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateCards();

  alert("Transaction Added Successfully");

  window.location.href = "HistoryCard.html";
});

function updateCards() {
  let income = 0;
  let expense = 0;

  transactions.forEach(function (item) {
    if (item.type == "Income") {
      income += item.amount;
    } else {
      expense += item.amount;
    }
  });

  let balance = income - expense;

  document.getElementById("card1").innerHTML =
    "<p>Current Balance : ₹" + balance + "</p>";

  document.getElementById("card2").innerHTML =
    "<p>Income : ₹" + income + "</p>";

  document.getElementById("card3").innerHTML =
    "<p>Expense : ₹" + expense + "</p>";
}

// Set Monthly Budget
document.getElementById("setBudgetBtn").addEventListener("click", function () {
  let budget = Number(document.getElementById("budgetAmount").value);

  if (!budget || budget <= 0) {
    alert("Please enter a valid budget");
    return;
  }

  localStorage.setItem("monthlyBudget", budget);

  updateBudget();
});

// Update Budget Details
function updateBudget() {
  let budget = Number(localStorage.getItem("monthlyBudget")) || 0;

  let currentMonth = new Date().toISOString().slice(0, 7);

  let spent = 0;

  transactions.forEach(function (item) {
    if (item.type === "Expense" && item.date.startsWith(currentMonth)) {
      spent += Number(item.amount);
    }
  });

  let remaining = budget - spent;

  document.getElementById("budgetDisplay").innerText =
    "Monthly Budget: ₹" + budget;

  document.getElementById("spentDisplay").innerText = "Total Spent: ₹" + spent;

  document.getElementById("remainingDisplay").innerText =
    "Remaining: ₹" + remaining;

  let percentage = budget > 0 ? (spent / budget) * 100 : 0;

  let progress = Math.min(percentage, 100);

  document.getElementById("budgetProgress").style.width = progress + "%";

  document.getElementById("progressText").innerText =
    Math.round(percentage) + "% Used";

  // Budget Alert
  let budgetAlert = document.getElementById("budgetAlert");

  if (budget > 0 && percentage >= 100) {
    budgetAlert.innerText =
      "⚠️ Budget Exceeded! You have crossed your monthly budget.";
    budgetAlert.style.color = "#E63946";
  } else if (percentage >= 80) {
    budgetAlert.innerText = "⚠️ Warning! You have used 80% of your budget.";
    budgetAlert.style.color = "#E5A12A";
  } else if (percentage >= 50) {
    budgetAlert.innerText = "ℹ️ You have used 50% of your monthly budget.";
    budgetAlert.style.color = "#4A90E2";
  } else {
    budgetAlert.innerText = "✅ Your budget is under control.";
    budgetAlert.style.color = "#20B486";
  }
}

updateBudget();

// Dark Mode Toggle
let themeButton = document.getElementById("themeToggle");

if (themeButton) {
  let savedTheme = localStorage.getItem("walletTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeButton.textContent = "☀️ Light Mode";
  }

  themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("walletTheme", "dark");
      themeButton.textContent = "☀️ Light Mode";
    } else {
      localStorage.setItem("walletTheme", "light");
      themeButton.textContent = "🌙 Dark Mode";
    }
  });
}
