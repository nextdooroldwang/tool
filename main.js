function findMatchingWebsite(urlToMatch, maxPages) {
  let currentPage = 1;

  function searchInCurrentPage() {
    const results = document.querySelectorAll("h3");
    for (const result of results) {
      const link = result.parentElement.href;

      if (link.includes(urlToMatch)) {
        window.alert(link);
        // window.location.href = link;

        result.parentElement.click();
        return;
      }
    }

    if (currentPage < maxPages) {
      currentPage++;
      window.scrollTo(0, document.body.scrollHeight);
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
    findMatchingWebsite(urlToMatch, maxPages);
  }
});
