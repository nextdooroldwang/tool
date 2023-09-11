function download(url) {
  var options = {
    url: url,
  };
  chrome.downloads.download(options);
}

async function onMenuClick() {
  //获取当前打开的tab
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  //发送消息，告诉页面，我们需要获取图片元素
  var response = await chrome.tabs.sendMessage(tab.id, { type: "images" });
  var data = response || [];
  //获取配置信息
  chrome.storage.local.get(["filterUrl"]).then((result) => {
    var value = result["filterUrl"];
    if (value) {
      //循环下载
      data.filter((src) => src.indexOf(value) != -1).map(download);
    } else {
      data.map(download);
    }
  });
}

async function open(url) {
  return new Promise((resolve) => {
    chrome.tabs.create(
      {
        url,
      },
      (tab) => resolve(tab.id)
    );
  });
}

async function activate(tabId, url) {
  if (typeof tabId === "undefined") {
    return tabId;
  }

  const options = IS_FIREFOX ? { active: true } : { selected: true };
  if (url) {
    options.url = url;
  }

  return new Promise((resolve) => {
    chrome.tabs.update(tabId, options, () => resolve(tabId));
  });
}

async function openOrActivate(url) {
  const pattern = getUrlPattern(url);
  return new Promise((resolve) => {
    chrome.tabs.query(
      {
        url: pattern,
      },
      (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
          return Tabs.activate(tabs[0].id);
        } else {
          this.open(url).then((id) => resolve(id));
        }
      }
    );
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.type === "1") {
    open("https://www.google.com/search?q=GLP-1");
    //处理完消息后、通知发送方
    sendResponse({ farewell: "goodbye" });
  }
});
