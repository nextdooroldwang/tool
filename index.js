document.addEventListener("DOMContentLoaded", function () {
  const urlInput = document.getElementById("urlInput");
  const keywordInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("subBtn");

  chrome.storage.local.get(["url", "keyword"], function (result) {
    if (result.url) {
      urlInput.value = result.url;
    }
    if (result.keyword) {
      keywordInput.value = result.keyword;
    }
  });

  searchButton.addEventListener("click", function () {
    const url = urlInput.value;
    const keyword = keywordInput.value;

    chrome.storage.local.set({ url, keyword });
    console.log(">>>>>>>>", url);

    chrome.tabs.update(
      { url: `https://www.google.com/search?q=${keyword}` },
      function (tab) {
        chrome.tabs.sendMessage(tab.id, { action: "search", url, keyword });
      }
    );
    // chrome.tabs.create(
    //   { url: `https://www.google.com/search?q=${keyword}` },
    //   function (tab) {
    //     chrome.tabs.onUpdated.addListener(function (
    //       tabId,
    //       changeInfo,
    //       updatedTab
    //     ) {
    //       if (tabId === tab.id && changeInfo.status === "complete") {
    //         chrome.tabs.sendMessage(tabId, { action: "search", keyword, url });
    //       }
    //     });
    //   }
    // );
  });
});
