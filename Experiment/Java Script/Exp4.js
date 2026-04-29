const form = document.getElementById("userForm");
const userList = document.getElementById("userList");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let valid = true;

    // Clear errors
    document.getElementById("nameError").innerText = "";
    document.getElementById("emailError").innerText = "";
    document.getElementById("passwordError").innerText = "";

    // Validation
    if (name.trim() === "") {
        document.getElementById("nameError").innerText = "Name is required";
        valid = false;
    }

    if (email.trim() === "") {
        document.getElementById("emailError").innerText = "Email is required";
        valid = false;
    } else if (!email.includes("@")) {
        document.getElementById("emailError").innerText = "Enter valid email";
        valid = false;
    }

    if (password.length < 6) {
        document.getElementById("passwordError").innerText = "Password must be at least 6 characters";
        valid = false;
    }

    // DOM Manipulation
    if (valid) {
        // Create new list item
        const li = document.createElement("li");
        li.className = "list-group-item";

        li.innerHTML = `
            <strong>Name:</strong> ${name} <br>
            <strong>Email:</strong> ${email}
        `;

        // Add to list
        userList.appendChild(li);

        alert("User Added Successfully ✅");

        // Reset form
        form.reset();
    }
});