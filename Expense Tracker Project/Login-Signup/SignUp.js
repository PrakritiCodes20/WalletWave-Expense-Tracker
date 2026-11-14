const signupForm = document.getElementById("signupForm");
const messageBox = document.getElementById("signupMessage");

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get input values
  let first = document.getElementById("First").value.trim();
  let last = document.getElementById("Last").value.trim();
  let email = document.getElementById("Email").value.trim();
  let phone = document.getElementById("Phone").value.trim();

  let password = document.getElementById("Create").value;
  let confirmPassword = document.getElementById("Confirm").value;

  // Password matching validation
  if (password !== confirmPassword) {
    messageBox.textContent = "Passwords do not match!";
    messageBox.className = "error";
    return;
  }

  // Password length validation
  if (password.length < 8) {
    messageBox.textContent = "Password must contain at least 8 characters.";
    messageBox.className = "error";
    return;
  }

  // Create user object
  let user = {
    first: first,
    last: last,
    email: email,
    phone: phone,
    password: password,
  };

  // Save user data in localStorage
  localStorage.setItem("user", JSON.stringify(user));

  // Show success message
  messageBox.textContent = "Signup Successful! Redirecting...";
  messageBox.className = "success";

  // Redirect to WalletWave
  setTimeout(function () {
    window.location.href = "WalletWave.html";
  }, 1500);
});
