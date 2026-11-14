// Get form and input elements
const savingsForm = document.getElementById("savingsForm");

const goalName = document.getElementById("goalName");
const targetAmount = document.getElementById("targetAmount");
const savedAmount = document.getElementById("savedAmount");

// Store all savings goals
let goals = JSON.parse(localStorage.getItem("savingsGoals")) || [];

savingsForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const goal = {
    id: Date.now(),
    name: goalName.value,
    target: Number(targetAmount.value),
    saved: Number(savedAmount.value),
  };

  if (goal.saved > goal.target) {
    alert("Saved amount cannot exceed target amount!");
    return;
  }

  goals.push(goal);

  localStorage.setItem("savingsGoals", JSON.stringify(goals));
  displayGoals();

  alert("Savings Goal Added Successfully!");

  savingsForm.reset();
});

const goalsContainer = document.getElementById("goalsContainer");

function displayGoals() {
  goalsContainer.innerHTML = "";
  if (goals.length === 0) {
    goalsContainer.innerHTML =
      "<p>No savings goals yet. Create your first goal!</p>";
    return;
  }

  goals.forEach(function (goal) {
    const goalCard = document.createElement("div");

    goalCard.className = "goal-card";
    const percentage = Math.min((goal.saved / goal.target) * 100, 100);

    goalCard.innerHTML = `
  <h3>${goal.name}</h3>

  <p>Target Amount: ₹${goal.target}</p>
  <p>Already Saved: ₹${goal.saved}</p>

  <p>Progress: ${percentage.toFixed(1)}%</p>

  <div class="goal-progress">
    <div class="goal-progress-fill"
         style="width: ${percentage}%">
    </div>
    
  </div>
  ${percentage >= 100 ? '<p class="goal-complete">🎉 Congratulations! Goal Completed!</p>' : ""}
  <button onclick="updateSavings(${goal.id})">
  Update Savings
</button>
 <button onclick="deleteGoal(${goal.id})">
    Delete Goal
  </button>
`;

    goalsContainer.appendChild(goalCard);
  });
}

displayGoals();

function updateSavings(id) {
  const goal = goals.find(function (item) {
    return item.id === id;
  });

  const newAmount = prompt("Enter your total saved amount:");

  if (newAmount === null || newAmount.trim() === "") {
    return;
  }

  const amount = Number(newAmount);

  if (!Number.isFinite(amount) || amount < 0 || amount > goal.target) {
    alert("Please enter a valid amount!");
    return;
  }

  goal.saved = amount;

  localStorage.setItem("savingsGoals", JSON.stringify(goals));

  displayGoals();

  alert("Savings updated successfully!");
}

function deleteGoal(id) {
  const confirmDelete = confirm("Are you sure you want to delete this goal?");

  if (confirmDelete) {
    goals = goals.filter(function (goal) {
      return goal.id !== id;
    });

    localStorage.setItem("savingsGoals", JSON.stringify(goals));

    displayGoals();

    alert("Goal deleted successfully!");
  }
}
