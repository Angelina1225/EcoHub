document.addEventListener("DOMContentLoaded", () => {
    const mandatoryCheckbox = document.getElementById("mandatoryCheckbox");
    const eventRegisterForm = document.getElementById("eventRegisterForm");
    if (mandatoryCheckbox && eventRegisterForm) {
        eventRegisterForm.addEventListener("submit", (e) => {
            if (!mandatoryCheckbox.checked) {
                e.preventDefault();
                alert("You must agree to participate in the event to proceed!");
                return;
            }

            e.preventDefault();
            alert("Successfully registered!");
            window.location.href = "/";
        });
    } else {
        console.error("Mandatory checkbox or form not found in the DOM.");
    }
});
