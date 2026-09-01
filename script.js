document.addEventListener("DOMContentLoaded", () => {
  const c = window.SITE_CONFIG;
  document.querySelectorAll("[data-config]").forEach(el => {
    const key = el.dataset.config;
    if (c[key] !== undefined) el.textContent = c[key];
  });
  document.querySelectorAll(".pdf-link").forEach(a => a.href = c.pdfs[a.dataset.pdf] || "#");
  document.querySelectorAll('[data-social="instagram"]').forEach(a => a.href = c.instagramUrl);
  document.querySelectorAll('[data-social="whatsapp"]').forEach(a => a.href = c.whatsappUrl);
  document.querySelectorAll('[data-social="email"]').forEach(a => a.href = `mailto:${c.email}`);
  document.getElementById("year").textContent = new Date().getFullYear();

  const nav = document.querySelector(".nav");
  document.querySelector(".menu-toggle").addEventListener("click", () => nav.classList.toggle("mobile-open"));
  document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => nav.classList.remove("mobile-open")));

  const form = document.getElementById("orderForm");
  const modal = document.getElementById("successModal");
  const codeEl = document.getElementById("orderCode");
  const submitBtn = form.querySelector("button[type=submit]");

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!c.orderApiUrl || c.orderApiUrl.includes("https://script.google.com/macros/s/AKfycbwBg8zbOPDjUHU5l3sauqPyFqcM2nkiRajPWMwMjEt3RkyXK90CpXnd9BcLDpgaakibWw/exec")) {
      alert("Please configure orderApiUrl in config.js first.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Submitting…";

    const data = Object.fromEntries(new FormData(form).entries());
    data.action = "createOrder";
    data.website = location.hostname;

    try {
      const response = await fetch(c.orderApiUrl, {
        method: "POST",
        mode: "cors",
        headers: {"Content-Type": "text/plain;charset=utf-8"},
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!result.ok) throw new Error(result.message || "Order failed");

      codeEl.textContent = result.orderCode;
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
      form.reset();
    } catch (err) {
      alert("Order could not be submitted. Please try again or contact us on Instagram.");
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Place Order &amp; Generate Code <span>→</span>';
    }
  });

  document.querySelector(".modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  function closeModal() { modal.classList.remove("show"); modal.setAttribute("aria-hidden", "true"); }

  document.getElementById("copyCode").addEventListener("click", async () => {
    const code = codeEl.textContent;
    try {
      await navigator.clipboard.writeText(code);
      document.getElementById("copyCode").textContent = "Copied ✓";
      setTimeout(() => document.getElementById("copyCode").textContent = "Copy Code", 1500);
    } catch { alert("Your Order Code is: " + code); }
  });
});
