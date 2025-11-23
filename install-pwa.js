/* -------------------------------------------------------
   PWA INSTALL CONTROLLER — CLEAN VERSION  
   Works correctly for:
   - Android Chrome (native install prompt)
   - iOS Safari (manual popup ONLY on click)
   - Desktop Chrome (no auto UI)
   - Firefox (manual instructions)
------------------------------------------------------- */

let deferredPrompt = null;
let isInstalled = false;

const installButton = document.getElementById("installButton");
const iosPrompt = document.getElementById("iosPrompt");

// Detect platforms
const isiOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
const isFirefox = /Firefox/.test(navigator.userAgent);

// Detect if already installed
function isAlreadyInstalled() {
  return (
    window.navigator.standalone === true || 
    window.matchMedia("(display-mode: standalone)").matches
  );
}

// Update the install button visibility
function updateInstallUI() {
  const standalone = isAlreadyInstalled();

  console.log("PWA Debug: updateInstallUI()", {
    isInstalled,
    standalone,
    deferredPrompt
  });

  // Hide if installed
  if (isInstalled || standalone) {
    installButton.style.display = "none";
    iosPrompt.style.display = "none";
    return;
  }

  // ANDROID / CHROME — Show only when beforeinstallprompt happens
  if (!isiOS && !isFirefox && deferredPrompt) {
    installButton.style.display = "block";
    return;
  }

  // iOS — Show install button (but NOT the popup)
  if (isiOS) {
    installButton.style.display = "block";
    iosPrompt.style.display = "none";
    return;
  }

  // Firefox — Show button (manual instructions)
  if (isFirefox) {
    installButton.style.display = "block";
    return;
  }

  // Desktop Chrome / others — hide
  installButton.style.display = "none";
}

/* -------------------------------------------------------
   BEFOREINSTALLPROMPT — Android/Chrome ONLY
------------------------------------------------------- */
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("PWA Debug: beforeinstallprompt fired");
  e.preventDefault();
  deferredPrompt = e;

  updateInstallUI();
});

/* -------------------------------------------------------
   APP INSTALLED
------------------------------------------------------- */
window.addEventListener("appinstalled", () => {
  console.log("PWA Debug: appinstalled fired!");
  isInstalled = true;
  updateInstallUI();
});

/* -------------------------------------------------------
   USER CLICKED INSTALL BUTTON
------------------------------------------------------- */
function triggerInstall() {
  console.log("PWA Debug: triggerInstall()");

  // iOS — Show custom popup
  if (isiOS) {
    console.log("PWA Debug: iOS detected → showing manual popup");
    iosPrompt.style.display = "flex";
    return;
  }

  // Firefox — no native install prompt
  if (isFirefox) {
    console.log("PWA Debug: Firefox → showing instructions");
    alert(
      "Firefox Install:\n\n" +
      "1. Tap the menu button (⋮)\n" +
      '2. Select "Install" or "Add to Home Screen"\n' +
      "3. App will appear on your home screen"
    );
    return;
  }

  // Chrome/Android — native install
  if (deferredPrompt) {
    console.log("PWA Debug: Showing native install prompt");
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choice) => {
      console.log("PWA Debug: User choice:", choice.outcome);

      if (choice.outcome === "accepted") {
        isInstalled = true;
      }

      deferredPrompt = null;
      updateInstallUI();
    });
  } else {
    console.log("PWA Debug: No prompt available");
    alert("Install unavailable. Try refreshing the page.");
  }
}

/* -------------------------------------------------------
   iOS POPUP CLOSE BUTTON
------------------------------------------------------- */
function hideIosPrompt() {
  console.log("PWA Debug: hideIosPrompt()");
  iosPrompt.style.display = "none";
}

/* -------------------------------------------------------
   INIT
------------------------------------------------------- */
window.addEventListener("load", () => {
  console.log("PWA Debug: Page loaded → updating install UI");
  updateInstallUI();
});

// Expose functions
window.triggerInstall = triggerInstall;
window.hideIosPrompt = hideIosPrompt;
