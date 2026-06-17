const SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyG2V0a1iHcTgvk3OoWgEfXQ7Hh_H0cPnmbZW3RaOgwAt5E7RCwTTdW8In7gPAW9aST9Q/exec";

const form = document.querySelector("#feedbackForm");
const submitButton = document.querySelector("#submitButton");
const formStatus = document.querySelector("#formStatus");
const setupStatus = document.querySelector("#setupStatus");
const feedback = document.querySelector("#feedback");
const feedbackCount = document.querySelector("#feedbackCount");
const feedbackLimit = 5000;

const errors = {
  feedback: document.querySelector('[data-error-for="feedback"]'),
};

const endpointConfigured = SHEETS_WEB_APP_URL.trim().startsWith("https://script.google.com/");

if (!endpointConfigured) {
  setupStatus.hidden = false;
}

feedback.addEventListener("input", updateFeedbackCount);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearErrors();

  if (!validateForm()) {
    setStatus("Please fix the highlighted fields before submitting.", "error");
    return;
  }

  if (!endpointConfigured) {
    setStatus(
      "The Google Sheets endpoint is not configured yet. Follow the setup steps below before publishing.",
      "error",
    );
    return;
  }

  const payload = buildPayload();
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  setStatus("Submitting...", "");

  try {
    await fetch(SHEETS_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    form.reset();
    updateFeedbackCount();
    clearInvalidState();
    setStatus(
      "Thank you. Your feedback was sent to the independent review Sheet.",
      "success",
    );
  } catch (error) {
    setStatus(
      "The submission could not be sent. Please try again later or use one of the routed contacts above.",
      "error",
    );
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit anonymous feedback";
  }
});

function validateForm() {
  let valid = true;

  if (!feedback.value.trim()) {
    markInvalid(
      feedback,
      errors.feedback,
      "Enter feedback before submitting.",
    );
    valid = false;
  }

  return valid;
}

function buildPayload() {
  const formData = new FormData(form);
  return {
    submittedAt: new Date().toISOString(),
    topic: clean(formData.get("topic")),
    context: clean(formData.get("context")),
    feedback: clean(formData.get("feedback")),
    identifier: clean(formData.get("identifier")) || "Anonymous",
  };
}

function clean(value) {
  return String(value || "").trim();
}

function updateFeedbackCount() {
  feedbackCount.textContent = `${(feedback.value || "").length} / ${feedbackLimit}`;
}

function markInvalid(field, target, message) {
  field.setAttribute("aria-invalid", "true");
  target.textContent = message;
}

function clearInvalidState() {
  form
    .querySelectorAll("[aria-invalid]")
    .forEach((field) => field.removeAttribute("aria-invalid"));
}

function clearErrors() {
  clearInvalidState();
  Object.values(errors).forEach((target) => {
    target.textContent = "";
  });
}

function setStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = "form-status";

  if (type) {
    formStatus.classList.add(`form-status--${type}`);
  }
}
