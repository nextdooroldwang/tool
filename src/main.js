console.log(window);

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("sub-btn").addEventListener("click", function (e) {
    (async () => {
      const response = await chrome.runtime.sendMessage({ type: "1" });
      console.log(response);
    })();
    window.open("https://www.google.com/search?q=GLP-1", "_blank");
  });
});
