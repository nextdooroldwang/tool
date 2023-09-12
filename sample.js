// "matches": ["https://www.google.com/search*"],
// 动态注入
chrome.scripting
  .registerContentScripts([
    {
      id: "session-script",
      js: ["content.js"],
      css: [],
      persistAcrossSessions: false,
      matches: ["*://example.com/*"],
      runAt: "document_start",
    },
  ])
  .then(() => console.log("registration complete"))
  .catch((err) => console.warn("unexpected error", err));

//   从内容脚本(content_scripts) 发送到 扩展页面（options_page,bakcground,popup）
(async () => {
  const response = await chrome.runtime.sendMessage({ greeting: "hello" });
  console.log(response);
})();
//   从扩展页面（options_page,bakcground,popup）发送到 内容脚本(content_scripts)
(async () => {
  //获取当前的tab页面
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const response = await chrome.tabs.sendMessage(tab.id, { greeting: "hello" });
  console.log(response);
})();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.greeting === "hello")
    //处理完消息后、通知发送方
    sendResponse({ farewell: "goodbye" });
});
