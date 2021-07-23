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

chrome.storage.local.get("total", (data) => {
  if (chrome.runtime.lastError) {
    console.log("Something Went Wrong!");
    return;
  }
  var date = data.total.date_wise;
  var labels = [];
  var lst = [];

  var today = getDate();

  for (let i = 0; i < 7; i++) {
    var day = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * i);
    var abd = {
      month: day.getMonth() + 1,
      day: day.getDate(),
      year: day.getFullYear(),
    };
    var txt = `${abd.day}-${abd.month}-${abd.year}`;
    labels.push(txt);
    if (date[txt]) {
      let j = 0;
      for (key in date[txt]) {
        j += date[txt][key];
      }
      lst.push(j);
    } else {
      lst.push(0);
    }
  }

  labels.reverse();
  lst.reverse();
  var ctx = document.getElementById("chart-bars").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Visit Count",
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false,
          backgroundColor: "#fff",
          data: lst,
          maxBarThickness: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            suggestedMin: 0,
            suggestedMax: 500,
            beginAtZero: true,
            padding: 15,
            font: {
              size: 14,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
            color: "#fff",
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            display: false,
          },
        },
      },
    },
  });

  var ctx2 = document.getElementById("chart-line").getContext("2d");

  var gradientStroke1 = ctx2.createLinearGradient(0, 230, 0, 50);

  gradientStroke1.addColorStop(1, "rgba(203,12,159,0.2)");
  gradientStroke1.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke1.addColorStop(0, "rgba(203,12,159,0)"); //purple colors

  var gradientStroke2 = ctx2.createLinearGradient(0, 230, 0, 50);

  gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
  gradientStroke2.addColorStop(0.2, "rgba(72,72,176,0.0)");
  gradientStroke2.addColorStop(0, "rgba(20,23,39,0)"); //purple colors
  var url = data.total.url_wise;
  var dict = url;
  var items = Object.keys(dict).map(function (key) {
    return [key, dict[key].length];
  });

  // Sort the array based on the second element
  items.sort(function (first, second) {
    return second[1] - first[1];
  });
  var n = Math.min(items.length, 5);
  lst = [];
  var border = ["#cb0c9f", "#3A416F", "	#90EE90", "#FF4500", "#00FFFF"];
  for (let j = 0; j < n; j++) {
    var arr = [];
    for (let i = 6; i >= 0; i--) {
      var day = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * i);
      var abd = {
        month: day.getMonth() + 1,
        day: day.getDate(),
        year: day.getFullYear(),
      };
      var txt = `${abd.day}-${abd.month}-${abd.year}`;
      if (date[txt]) {
        if (date[txt][items[j][0]]) {
          arr.push(date[txt][items[j][0]]);
        } else {
          arr.push(0);
        }
      } else {
        arr.push(0);
      }
    }
    lst.push({
      label: items[j][0],
      tension: 0.4,
      borderWidth: 0,
      pointRadius: 0,
      borderColor: border[j],
      borderWidth: 3,
      backgroundColor: gradientStroke1,
      fill: true,
      data: arr,
      maxBarThickness: 6,
    });
  }
  new Chart(ctx2, {
    type: "line",
    data: {
      labels: labels,
      datasets: lst,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            padding: 10,
            color: "#b2b9bf",
            font: {
              size: 11,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            color: "#b2b9bf",
            padding: 20,
            font: {
              size: 11,
              family: "Open Sans",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
    },
  });

  var win = navigator.platform.indexOf("Win") > -1;
  if (win && document.querySelector("#sidenav-scrollbar")) {
    var options = {
      damping: "0.5",
    };
    Scrollbar.init(document.querySelector("#sidenav-scrollbar"), options);
  }
  var day = new Date(new Date().valueOf());
  var abd = {
    month: day.getMonth() + 1,
    day: day.getDate(),
    year: day.getFullYear(),
  };
  var txt = `${abd.day}-${abd.month}-${abd.year}`;
  var count = 0;
  var total = 0;
  for (var key in date[txt]) {
    count++;
    total += date[txt][key];
  }
  document.getElementById("tSiteCount").innerText = count;
  document.getElementById("tVisits").innerText = total;
  count = 0;
  total = 0;
  for (var key in url) {
    count++;
    total += url[key].length;
  }
  document.getElementById("totSiteCount").innerText = count;
  document.getElementById("totVisits").innerText = total;
  return;
});
