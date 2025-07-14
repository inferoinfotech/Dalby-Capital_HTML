document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll("form.form");

    forms.forEach(form => {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Disable all inputs/buttons in the form
            const elements = form.querySelectorAll("input, textarea, button, select");
            elements.forEach(el => el.disabled = true);

            const formData = new FormData(form);
            const jsonData = Object.fromEntries(formData.entries());

            const formId = form.id;
            if (!formId) {
                console.error("Form must have an ID");
                elements.forEach(el => el.disabled = false); // Re-enable before exit
                return;
            }

            try {
                const response = await fetch(`/api/forms/${formId}/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(jsonData)
                });

                if (!response.ok) {
                    throw new Error("Form submission failed.");
                }

                const result = await response.json();
                console.log("Success:", result);
                // Optionally reset the form here
                // form.reset();
            } catch (error) {
                console.error("Error submitting form:", error);
            } finally {
                // Re-enable all form elements
                elements.forEach(el => el.disabled = false);
            }
        });
    });
});