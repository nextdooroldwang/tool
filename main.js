function findMatchingWebsite(urlToMatch, maxPages, tabId) {
  let currentPage = 1;

  function searchInCurrentPage() {
    const results = document.querySelectorAll("h3");
    for (const result of results) {
      const link = result.parentElement.href;

      if (link.includes(urlToMatch)) {
        result.parentElement.click();
        return;
      }
    }

    if (currentPage < maxPages) {
      currentPage++;
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      setTimeout(searchInCurrentPage, 2000);
    } else {
      console.log("未找到匹配的网站");
    }
  }

  searchInCurrentPage();
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "search") {
    const urlToMatch = message.url;
    const maxPages = 5;
    const tabId = message.tabId;

    findMatchingWebsite(urlToMatch, maxPages, tabId);
  }
});
