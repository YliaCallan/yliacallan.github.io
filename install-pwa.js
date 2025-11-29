// ———— ADD THESE TWO LINES FIRST ————
const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
// ——————————————————————————————————

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

  if (isInstalled || standalone) {
    installButton.style.display = "none";
    iosPrompt.style.display = "none";
    return;
  }

  // Android / Chrome — only show when we have a prompt
  if (!isiOS && !isFirefox && deferredPrompt) {
    installButton.style.display = "block";
    return;
  }

  // iOS — always show the button (click → manual popup)
  if (isiOS) {
    installButton.style.display = "block";
    iosPrompt.style.display = "none";
    return;
  }

  // Firefox — show button (click → instructions)
  if (isFirefox) {
    installButton.style.display = "block";
    return;
  }

  // Everything else (desktop, etc.) — hide
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

  if (isiOS) {
    iosPrompt.style.display = "flex";
    return;
  }

  if (isFirefox) {
    alert(
      "Firefox Install:\n\n" +
      "1. Tap the menu button (⋮)\n" +
      '2. Select "Install" or "Add to Home Screen"\n' +
      "3. App will appear on your home screen"
    );
    return;
  }

  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
      console.log("PWA Debug: User choice:", choice.outcome);
      if (choice.outcome === "accepted") isInstalled = true;
      deferredPrompt = null;
      updateInstallUI();
    });
  } else {
    alert("Install unavailable. Try refreshing the page.");
  }
}

/* -------------------------------------------------------
   iOS POPUP CLOSE BUTTON
------------------------------------------------------- */
function hideIosPrompt() {
  iosPrompt.style.display = "none";
}

/* -------------------------------------------------------
   INIT
------------------------------------------------------- */
window.addEventListener("load", () => {
  console.log("PWA Debug: Page loaded → updating install UI");
  updateInstallUI();
});

// Expose functions globally
window.triggerInstall = triggerInstall;
window.hideIosPrompt = hideIosPrompt;