document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('eventRegister')) {
        const mandatoryCheckbox = document.getElementById('mandatoryCheckbox');
        const eventRegisterForm = document.getElementById('eventRegisterForm');
        const mandatoryError = document.getElementById('mandatoryError');
        const closePopup = document.getElementById('closePopup');

        closePopup.addEventListener('click', function () {
            window.location.href = '/events';
        });

        if (mandatoryCheckbox && eventRegisterForm && mandatoryError) {
            eventRegisterForm.addEventListener("submit", (e) => {
                if (!mandatoryCheckbox.checked) {
                    e.preventDefault();
                    mandatoryError.style.display = 'block';
                    return;
                }

                window.location.href = "/";
            });

            mandatoryCheckbox.addEventListener('change', () => {
                if (mandatoryCheckbox.checked) {
                    mandatoryError.style.display = 'none';
                }
            });
        } else {
            console.error('Mandatory checkbox or form not found in the DOM.');
        }
    }
});