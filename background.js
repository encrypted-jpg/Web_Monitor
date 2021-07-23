chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    total: {
      url_wise: {},
      date_wise: {},
    },
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ["./foreground.js"],
      })
      .then(() => {
        console.log("Injected the Script");
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

function getDate() {
  let _now = new Date();
  return {
    month: _now.getMonth() + 1,
    day: _now.getDate(),
    year: _now.getFullYear(),
    hour: _now.getHours(),
    minute: _now.getMinutes(),
    seconds: _now.getSeconds(),
  };
}

function getDateOnly() {
  let _now = new Date();
  return {
    month: _now.getMonth() + 1,
    day: _now.getDate(),
    year: _now.getFullYear(),
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "visit") {
    chrome.storage.local.get("total", (data) => {
      if (chrome.runtime.lastError) {
        sendResponse({
          message: "fail",
        });
        return;
      }
      var url = request.url;
      url = url.replace("www.", "");
      var visit_date = getDate();
      var dict = data.total.url_wise;
      if (dict[url]) {
        dict[url].push({ date: visit_date });
      } else {
        dict[url] = [];
        dict[url].push({ date: visit_date });
      }
      var dict2 = data.total.date_wise;
      var vd = getDateOnly();
      var visit_date = `${vd.day}-${vd.month}-${vd.year}`;
      if (dict2[visit_date]) {
        if (dict2[visit_date][url]) {
          dict2[visit_date][url] += 1;
        } else {
          dict2[visit_date][url] = 1;
        }
      } else {
        dict2[visit_date] = {};
        dict2[visit_date][url] = 1;
      }
      chrome.storage.local.set(
        { total: { url_wise: dict, date_wise: dict2 } },
        () => {
          if (chrome.runtime.lastError) {
            sendResponse({
              message: "fail",
            });
            return;
          }
          sendResponse({
            message: "success",
          });
        }
      );
    });
  }
  return true;
});
