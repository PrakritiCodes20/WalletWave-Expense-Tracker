document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  let email = document.getElementById("Email").value;
  let password = document.getElementById("password").value;

  let user = JSON.parse(localStorage.getItem("user"));

  if (user == null) {
    alert("Please Signup First");
    return;
  }

  if (email === user.email && password === user.password) {
    alert("Login Successful");
    window.location.href = "../Home/WalletWaveHome.html";
  } else {
    alert("Wrong Email or Password");
  }
});

// Show / Hide Password
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    togglePassword.textContent = "Show";
  }
});
