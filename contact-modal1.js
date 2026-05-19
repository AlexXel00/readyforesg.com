(function () {
    const modal = document.getElementById("contactModal");
    if (!modal) return;

    const form = document.getElementById("leadInquiryForm");
    const backdrop = modal.querySelector(".contact-modal__backdrop");
    const closeButtons = modal.querySelectorAll("[data-close-contact-modal]");
    const successBox = modal.querySelector(".contact-form__success");
    const errorBox = modal.querySelector(".contact-form__error");
    const sourceInput = form.querySelector('input[name="source"]');
    const pageInput = form.querySelector('input[name="page"]');
    const submitButton = form.querySelector('button[type="submit"]');

    function resetMessages() {
        successBox.classList.remove("is-visible");
        errorBox.classList.remove("is-visible");
        errorBox.textContent = "Senden fehlgeschlagen. Bitte versuchen Sie es erneut.";
    }

    function openModal(sourceLabel) {
        modal.classList.add("is-open");
        document.body.style.overflow = "hidden";

        if (sourceInput) sourceInput.value = sourceLabel || "Unknown trigger";
        if (pageInput) pageInput.value = window.location.pathname;

        resetMessages();
    }

    function closeModal() {
        modal.classList.remove("is-open");
        document.body.style.overflow = "";
    }

    document.querySelectorAll(".js-open-inquiry").forEach((el) => {
        el.addEventListener("click", function (event) {
            event.preventDefault();
            const sourceLabel = this.dataset.inquirySource || this.textContent.trim();
            openModal(sourceLabel);
        });
    });

    if (backdrop) {
        backdrop.addEventListener("click", closeModal);
    }

    closeButtons.forEach((btn) => {
        btn.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal.classList.contains("is-open")) {
            closeModal();
        }
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        resetMessages();

        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Wird gesendet...";

        const formData = new FormData(form);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || "Senden fehlgeschlagen. Bitte versuchen Sie es erneut.");
            }

            form.reset();
            successBox.classList.add("is-visible");

            setTimeout(() => {
                closeModal();
            }, 1500);
        } catch (error) {
            errorBox.textContent = error.message || "Senden fehlgeschlagen. Bitte versuchen Sie es erneut.";
            errorBox.classList.add("is-visible");
            console.error("Web3Forms error:", error);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
})();
