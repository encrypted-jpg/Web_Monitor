var win = navigator.platform.indexOf("Win") > -1;
if (win && document.querySelector("#sidenav-scrollbar")) {
  var options = {
    damping: "0.5",
  };
  Scrollbar.init(document.querySelector("#sidenav-scrollbar"), options);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

chrome.storage.local.get("total", (data) => {
  if (chrome.runtime.lastError) {
    console.log("Something Went Wrong!");
    return;
  }
  var url = data.total.url_wise;
  var dict = url;
  var items = Object.keys(dict).map(function (key) {
    return [key, dict[key].length];
  });

  // Sort the array based on the second element
  items.sort(function (first, second) {
    return second[1] - first[1];
  });
  var count = 0;
  for (var i = 0; i < items.length; i++) {
    count += items[i][1];
  }
  var ulst = [".com", ".ac", ".in", ".net", ".org", ".gov", ".info", ".io"];
  var table = document.getElementById("tableContent");
  for (var i = 0; i < items.length; i++) {
    var a = items[i][0];
    for (var ul in ulst) {
      a = a.replace(ulst[ul], "");
    }
    a = capitalizeFirstLetter(a);
    var b = items[i][1];
    var logo =
      "https://www.google.com/s2/favicons?sz=64&domain_url=" + items[i][0];
    var c = (b * 100.0) / count;
    c = c.toFixed(2);
    var txt = `<tr>
                        <td>
                          <div class="d-flex px-2">
                            <div>
                              <img
                                src="${logo}"
                                class="avatar avatar-sm rounded-circle me-2"
                                alt="${a}"
                              />
                            </div>
                            <div class="my-auto">
                              <h6 class="mb-0 text-sm">${a}</h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p class="text-sm font-weight-bold mb-0">${b}</p>
                        </td>
                        <td class="align-middle text-center">
                          <div
                            class="
                              d-flex
                              align-items-center
                              justify-content-center
                            "
                          >
                            <span class="me-2 text-xs font-weight-bold"
                              >${c}%</span
                            >
                            <div>
                              <div class="progress">
                                <div
                                  class="progress-bar bg-gradient-info"
                                  role="progressbar"
                                  aria-valuenow="60"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                  style="width: ${c}%"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td><a href="https://${items[i][0]}" target="_blank" style="color:red;">Visit Site</a></td>
                      </tr>`;
    table.innerHTML += txt;
  }
});

function makeHttpObject() {
  try {
    return new XMLHttpRequest();
  } catch (error) {}
  try {
    return new ActiveXObject("Msxml2.XMLHTTP");
  } catch (error) {}
  try {
    return new ActiveXObject("Microsoft.XMLHTTP");
  } catch (error) {}

  throw new Error("Could not create HTTP request object.");
}
