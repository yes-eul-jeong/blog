document.addEventListener("DOMContentLoaded", () => {
  const updateButtonStyles = (activeButton, inactiveButton) => {
    activeButton.classList.add("active");
    activeButton.classList.remove("btn-outline-secondary");
    inactiveButton.classList.remove("active");
    inactiveButton.classList.add("btn-outline-secondary");
  };

  const setTheme = (theme = null) => {
    if (theme === null) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);

    localStorage.setItem("theme", theme);

    const lightButton = document.getElementById("theme-light");
    const darkButton = document.getElementById("theme-dark");
    const mobileLightButton = document.getElementById("mobile-theme-light");
    const mobileDarkButton = document.getElementById("mobile-theme-dark");

    if (theme === "light") {
      updateButtonStyles(lightButton, darkButton);
      updateButtonStyles(mobileLightButton, mobileDarkButton);
    } else {
      updateButtonStyles(darkButton, lightButton);
      updateButtonStyles(mobileDarkButton, mobileLightButton);
    }

    // Utterances 테마 변경
    const utterancesFrame = document.querySelector("iframe.utterances-frame");
    if (utterancesFrame) {
      const message = {
        type: "set-theme",
        theme: `github-${theme}`,
      };
      utterancesFrame.contentWindow.postMessage(message, "*");
      console.log(message);
    }
  };

  const theme = localStorage.getItem("theme");
  setTheme(theme);

  ["dark", "light"].forEach((theme) => {
    const button = document.getElementById(`theme-${theme}`);
    const mobileButton = document.getElementById(`mobile-theme-${theme}`);
    if (button) {
      button.addEventListener("click", () => setTheme(theme));
    }
    if (mobileButton) {
      mobileButton.addEventListener("click", () => setTheme(theme));
    }
  });
});
