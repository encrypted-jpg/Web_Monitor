chrome.runtime.sendMessage(
  {
    message: "visit",
    url: window.location.hostname,
  },
  (response) => {
    if (response.message === "success") {
      console.log("Noted!!");
    } else {
      console.log(response.message);
    }
  }
);
