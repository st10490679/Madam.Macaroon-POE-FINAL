/* script.js - Madam Macaroon
   Adds: accordion, lightbox gallery, simple search, form validation, scroll reveal
   Keep this file in the repo root and link it on each page before </body>.
*/

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------
     1) ACCORDION (if present)
     HTML example:
     <button class="accordion-btn">Question</button>
     <div class="accordion-content">Answer...</div>
  ----------------------- */
  (function initAccordion() {
    const accBtns = document.querySelectorAll(".accordion-btn");
    if (!accBtns.length) return;
    accBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        btn.classList.toggle("active");
        const content = btn.nextElementSibling;
        if (!content) return;
        if (btn.classList.contains("active")) {
          content.style.maxHeight = content.scrollHeight + "px";
        } else {
          content.style.maxHeight = null;
        }
      });
      // Ensure initial closed state
      const content = btn.nextElementSibling;
      if (content) content.style.maxHeight = null;
    });
  })();


  /* -----------------------
     2) LIGHTBOX FOR GALLERY
     Requirements: images inside .gallery-grid (img tags)
     Clicking an image opens a full-screen modal with the image.
  ----------------------- */
  (function initLightbox() {
    const galleryImgs = document.querySelectorAll(".gallery-grid img, .gallery img");
    if (!galleryImgs.length) return;

    // create lightbox container
    const lightbox = document.createElement("div");
    lightbox.id = "mm-lightbox";
    lightbox.style.cssText = "position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);z-index:1200;padding:20px;";
    document.body.appendChild(lightbox);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) hideLightbox();
    });

    function showLightbox(src, alt = "") {
      lightbox.innerHTML = ""; // clear
      const img = document.createElement("img");
      img.src = src;
      img.alt = alt;
      img.style.maxWidth = "95%";
      img.style.maxHeight = "85%";
      img.style.borderRadius = "10px";
      lightbox.appendChild(img);
      lightbox.style.display = "flex";
    }

    function hideLightbox() {
      lightbox.style.display = "none";
    }

    galleryImgs.forEach(img => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => showLightbox(img.src, img.alt || ""));
    });
  })();


  /* -----------------------
     3) SIMPLE SEARCH FILTER (products page)
     HTML expected: <input id="searchBox"> and product cards with class .product-card and product title inside h3
  ----------------------- */
  (function initSearchFilter() {
    const searchBox = document.getElementById("searchBox");
    const products = document.querySelectorAll(".product-card, .product");
    if (!searchBox || !products.length) return;
    searchBox.addEventListener("input", () => {
      const q = searchBox.value.trim().toLowerCase();
      products.forEach(prod => {
        const titleEl = prod.querySelector("h3, h2, .product-title");
        const title = titleEl ? titleEl.textContent.toLowerCase() : "";
        prod.style.display = title.includes(q) ? "" : "none";
      });
    });
  })();


  /* -----------------------
     4) CONTACT + ENQUIRY FORM VALIDATION + AJAX-like behavior
     - contact form (id="contactForm")
     - enquiry form (id="enquiryForm") -> optional cost estimate example
     Both forms use client-side validation and show messages in a small response element.
  ----------------------- */
  (function initForms() {
    /* contact form */
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = contactForm.querySelector("[name='name'], #name")?.value.trim() || "";
        const email = contactForm.querySelector("[name='email'], #email")?.value.trim() || "";
        const message = contactForm.querySelector("[name='message'], #message")?.value.trim() || "";
        const responseEl = contactForm.querySelector(".form-response") || createResponseEl(contactForm);

        if (!name || !email || !message) {
          showResponse(responseEl, "Please fill all required fields.", "error");
          return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          showResponse(responseEl, "Please enter a valid email address.", "error");
          return;
        }

        // Simulate sending (AJAX would go here)
        showResponse(responseEl, "Message sent! We will reply shortly. ✅", "success");
        contactForm.reset();
      });
    }

    /* enquiry form example */
    const enquiryForm = document.getElementById("enquiryForm");
    if (enquiryForm) {
      enquiryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // sample fields: name, email, product, quantity
        const name = enquiryForm.querySelector("[name='name'], #name")?.value.trim() || "";
        const email = enquiryForm.querySelector("[name='email'], #email")?.value.trim() || "";
        const product = enquiryForm.querySelector("[name='product'], #product")?.value.trim() || "";
        const qty = parseInt(enquiryForm.querySelector("[name='quantity'], #quantity")?.value, 10) || 0;
        const responseEl = enquiryForm.querySelector(".form-response") || createResponseEl(enquiryForm);

        if (!name || !email || !product || !qty) {
          showResponse(responseEl, "Please complete all fields.", "error");
          return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          showResponse(responseEl, "Please enter a valid email address.", "error");
          return;
        }

        // simple cost calc example: choose price per item (could be dynamic)
        const priceMap = { "Eclair": 55, "Macaron": 22, "Croissant": 35 };
        const price = priceMap[product] || 30;
        const cost = price * qty;

        showResponse(responseEl, `Thanks ${name}! Estimated cost for ${qty} × ${product} is R${cost}. We will confirm availability via email.`, "success");
        enquiryForm.reset();
      });
    }

    function createResponseEl(form) {
      const el = document.createElement("p");
      el.className = "form-response";
      el.style.marginTop = "10px";
      form.appendChild(el);
      return el;
    }

    function showResponse(el, text, type = "info") {
      el.textContent = text;
      el.style.color = type === "error" ? "#b00020" : (type === "success" ? "#1a7a23" : "#333");
    }
  })();


  /* -----------------------
     5) SCROLL REVEAL 
     Adds .visible to sections when they appear in view
  ----------------------- */
  (function initScrollReveal() {
    const els = document.querySelectorAll("main section, .reveal");
    if (!els.length) return;
    const onScroll = () => {
      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) el.classList.add("visible");
      });
    };
    
    onScroll();
    window.addEventListener("scroll", throttle(onScroll, 200));
  })();


  /* -----------------------
     Utility: throttle
  ----------------------- */
  function throttle(fn, wait) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn(...args);
      }
    };
  }

}); 
// === Lightbox Feature for Gallery ===
const galleryImages = document.querySelectorAll('.gallery-grid img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');

galleryImages.forEach(image => {
  image.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = image.src;
  });
});

closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
  }
});
