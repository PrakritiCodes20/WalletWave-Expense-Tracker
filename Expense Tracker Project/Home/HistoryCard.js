let data = JSON.parse(localStorage.getItem("transactions")) || [];

let table = document.getElementById("historyTable");

data.forEach(function (item, index) {
  table.innerHTML += `

    <tr>

    <td>${item.field}</td>

    <td>₹${item.amount}</td>

    <td>${item.category}</td>

    <td class="${item.type.toLowerCase()}">${item.type}</td>
    <td>${item.date}</td>
    <td><button onclick="editTransaction(${index})">Edit</button>
   <button onclick="deleteTransaction(${index})">Delete</button></td>

    </tr>

    `;
});
let searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
  let searchValue = searchInput.value.toLowerCase();

  let rows = document.querySelectorAll("table tr");

  rows.forEach(function (row) {
    if (row.querySelector("th")) {
      return;
    }

    let rowData = row.textContent.toLowerCase();

    if (rowData.includes(searchValue)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});
function deleteTransaction(index) {
  let confirmDelete = confirm(
    "Are you sure you want to delete this transaction?",
  );

  if (confirmDelete) {
    data.splice(index, 1);

    localStorage.setItem("transactions", JSON.stringify(data));

    location.reload();
  }
}
function editTransaction(index) {
  let item = data[index];
  let newAmount = prompt("Enter new amount:", item.amount);

  if (newAmount === null || newAmount.trim() === "") return;

  newAmount = Number(newAmount);

  if (!Number.isFinite(newAmount) || newAmount <= 0) {
    alert("Enter a valid amount");
    return;
  }

  let newField = prompt("Enter new field:", item.field);
  if (newField === null || newField.trim() === "") return;

  let newCategory = prompt("Enter new category:", item.category);
  if (newCategory === null || newCategory.trim() === "") return;

  let newType = prompt("Enter Income or Expense:", item.type);
  if (newType === null) return;

  newType = newType.trim().toLowerCase();

  if (newType !== "income" && newType !== "expense") {
    alert("Enter Income or Expense only");
    return;
  }

  let newDate = prompt("Enter new date (YYYY-MM-DD):", item.date);
  if (newDate === null || newDate.trim() === "") return;

  data[index].field = newField;
  data[index].amount = newAmount;
  data[index].category = newCategory;
  data[index].type = newType === "income" ? "Income" : "Expense";
  data[index].date = newDate;

  localStorage.setItem("transactions", JSON.stringify(data));

  location.reload();
}
let expenseTotals = {
  Food: 0,
  Travel: 0,
  Education: 0,
  Medical: 0,
};

data.forEach(function (item) {
  if (item.type === "Expense" && expenseTotals[item.category] !== undefined) {
    expenseTotals[item.category] += Number(item.amount);
  }
});

let ctx = document.getElementById("expenseChart");

new Chart(ctx, {
  type: "doughnut",

  data: {
    labels: Object.keys(expenseTotals),

    datasets: [
      {
        data: Object.values(expenseTotals),
        backgroundColor: ["#20B486", "#4A90E2", "#F5A623", "#E66B75"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  },

  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.label + ": ₹" + context.raw;
          },
        },
      },
    },
  },
});

// Income vs Expense Chart

let historyIncome = 0;
let historyExpense = 0;

data.forEach(function (item) {
  if (item.type === "Income") {
    historyIncome += Number(item.amount);
  } else if (item.type === "Expense") {
    historyExpense += Number(item.amount);
  }
});

let historyIncomeCanvas = document.getElementById("incomeExpenseChart");

if (historyIncomeCanvas) {
  new Chart(historyIncomeCanvas, {
    type: "bar",

    data: {
      labels: ["Income", "Expense"],

      datasets: [
        {
          label: "Amount (₹)",
          data: [historyIncome, historyExpense],
          backgroundColor: ["#20B486", "#E66B75"],
          borderRadius: 8,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Monthly Expense Chart

let historyMonthlyExpenses = Array(12).fill(0);

data.forEach(function (item) {
  if (item.type === "Expense" && item.date) {
    let monthIndex = new Date(item.date + "T00:00:00").getMonth();

    historyMonthlyExpenses[monthIndex] += Number(item.amount);
  }
});

let historyMonthlyCanvas = document.getElementById("monthlyExpenseChart");

if (historyMonthlyCanvas) {
  new Chart(historyMonthlyCanvas, {
    type: "bar",

    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],

      datasets: [
        {
          label: "Monthly Expense (₹)",
          data: historyMonthlyExpenses,
          backgroundColor: "#4A90E2",
          borderRadius: 6,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

let downloadButton = document.getElementById("downloadReportBtn");

if (downloadButton) {
  downloadButton.addEventListener("click", function () {
    // CSV file ka heading
    let csvContent = "Field,Amount,Category,Type,Date\n";

    // Har transaction ko CSV row mein convert karna
    data.forEach(function (item) {
      let row = [item.field, item.amount, item.category, item.type, item.date];

      csvContent += row.join(",") + "\n";
    });

    // CSV file create karna
    let blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    // Download link create karna
    let link = document.createElement("a");
    let url = URL.createObjectURL(blob);

    link.href = url;
    link.download = "WalletWave_Transaction_Report.csv";

    document.body.appendChild(link);
    link.click();

    // Temporary link remove karna
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}
