document.addEventListener("DOMContentLoaded", function () {

    const config = window.SITE_CONFIG;

    // Basic config
    document.querySelectorAll("[data-config]").forEach(function (element) {
        const key = element.getAttribute("data-config");

        if (config && config[key] !== undefined) {
            element.textContent = config[key];
        }
    });

    // PDF links
    document.querySelectorAll(".pdf-link").forEach(function (link) {
        const type = link.getAttribute("data-pdf");

        if (config && config.pdfs && config.pdfs[type]) {
            link.href = config.pdfs[type];
        }
    });

    // Social links
    document.querySelectorAll('[data-social="instagram"]').forEach(function (link) {
        link.href = config.instagramUrl;
    });

    document.querySelectorAll('[data-social="whatsapp"]').forEach(function (link) {
        link.href = config.whatsappUrl;
    });

    document.querySelectorAll('[data-social="email"]').forEach(function (link) {
        link.href = "mailto:" + config.email;
    });

    // Year
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Mobile menu
    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (menuButton && nav) {
        menuButton.addEventListener("click", function () {
            nav.classList.toggle("mobile-open");
        });
    }

    // ORDER FORM
    const form = document.getElementById("orderForm");
    const modal = document.getElementById("successModal");
    const codeElement = document.getElementById("orderCode");

    if (!form) {
        console.error("Order form not found.");
        return;
    }

    form.addEventListener("submit", async function (event) {

        // VERY IMPORTANT
        event.preventDefault();

        const apiUrl = config.orderApiUrl;

        if (!apiUrl || apiUrl.includes("PASTE_YOUR")) {
            alert("Order system is not connected yet. Please add the Google Apps Script URL in config.js.");
            return;
        }

        const submitButton = form.querySelector("button[type='submit']");

        submitButton.disabled = true;
        submitButton.innerHTML = "Submitting...";

        const formData = new FormData(form);

        const order = {
            action: "createOrder",
            name: formData.get("name"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            address: formData.get("address"),
            edition: formData.get("edition"),
            quantity: formData.get("quantity"),
            notes: formData.get("notes")
        };

        try {

            const response = await fetch(apiUrl, {
                method: "POST",
                body: JSON.stringify(order)
            });

            const result = await response.json();

            if (!result.ok) {
                throw new Error(result.message || "Order failed");
            }

            // SHOW ORDER CODE
            codeElement.textContent = result.orderCode;

            modal.classList.add("show");
            modal.setAttribute("aria-hidden", "false");

            form.reset();

        } catch (error) {

            console.error(error);

            alert(
                "Order submit nahi ho saka.\n\n" +
                "Please try again or contact us on Instagram."
            );

        } finally {

            submitButton.disabled = false;
            submitButton.innerHTML =
                'Place Order & Generate Code <span>→</span>';
        }

    });

    // CLOSE MODAL
    const closeButton = document.querySelector(".modal-close");

    if (closeButton) {
        closeButton.addEventListener("click", function () {
            modal.classList.remove("show");
            modal.setAttribute("aria-hidden", "true");
        });
    }

    // COPY ORDER CODE
    const copyButton = document.getElementById("copyCode");

    if (copyButton) {

        copyButton.addEventListener("click", async function () {

            const code = codeElement.textContent;

            try {

                await navigator.clipboard.writeText(code);

                copyButton.textContent = "Copied ✓";

                setTimeout(function () {
                    copyButton.textContent = "Copy Code";
                }, 1500);

            } catch {

                alert("Your Order Code is: " + code);

            }

        });

    }

});
