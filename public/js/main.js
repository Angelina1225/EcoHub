// Remove search query
if (window.location.pathname === '/events') {
    const navigationEntries = window.performance.getEntriesByType('navigation');

    if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('query')) {
            urlParams.delete('query');

            const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');

            window.location.replace(newUrl);
        }
    }
}

// Set minimum event date for event form
const eventForm = document.getElementById('eventForm');
if (eventForm) {
    const eventDate = document.getElementById('eventDate');
    const today = new Date();

    today.setDate(today.getDate() + 1);
    eventDate.setAttribute('min', today.toISOString().split('T')[0]);
}

// Show number of volunteer needed field
function toggleVolunteerInput() {
    const volunteerField = document.getElementById("volunteerField");
    const volunteersNeeded = document.getElementById("volunteersNeeded");

    if (volunteersNeeded.checked) {
        volunteerField.style.display = "block";
    } else {
        volunteerField.style.display = "none";
    }
}