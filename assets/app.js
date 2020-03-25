var getJSON = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};

var getMarkers = function(city) {
  getJSON(
    "https://covid19-public.digitalservice.id/analytics/longlat/",
    function(err, data) {
      if (err !== null) {
        alert("Something went wrong: " + err);
      } else {
        // last update
        document.getElementById("update").innerHTML = data.last_update;

        var datas = data.data;

        //filter
        if (city == "subang") {
          var filteredData = datas.filter(function(city) {
            return city.kabkot_str == "Kabupaten Subang";
          });
        } else {
          var filteredData = datas; // jabar
        }

        var odp = filteredData.filter(function(value) {
          return value.status == "ODP";
        });

        var pdp = filteredData.filter(function(value) {
          return value.status == "PDP";
        });

        var positif = filteredData.filter(function(value) {
          return value.status == "Positif";
        });

        var sembuh = filteredData.filter(function(value) {
          return value.status == "Positif" && value.stage == "Sembuh";
        });

        var meninggal = filteredData.filter(function(value) {
          return value.status == "Positif" && value.stage == "Meninggal";
        });

        document.getElementById("kasus").innerHTML = filteredData.length;
        document.getElementById("odp").innerHTML = odp.length;
        document.getElementById("pdp").innerHTML = pdp.length;
        document.getElementById("positif").innerHTML = positif.length;
        document.getElementById("sembuh").innerHTML = sembuh.length;
        document.getElementById("meninggal").innerHTML = meninggal.length;

        for (var i = 0; i < filteredData.length; i++) {
          if (filteredData[i]["wilayah_status_stage_latitude"] != null) {
            marker = new L.marker(
              [
                filteredData[i]["wilayah_status_stage_latitude"],
                filteredData[i]["wilayah_status_stage_longitude"]
              ],
              {
                icon: iconFile(
                  filteredData[i]["status"],
                  filteredData[i]["stage"]
                )
              }
            )
              .bindPopup(
                "<b>" +
                  status(filteredData[i]["status"], filteredData[i]["stage"]) +
                  "</b><br>" +
                  filteredData[i]["jenis_kelamin_str"] +
                  ", " +
                  filteredData[i]["umur"] +
                  " tahun" +
                  "<br>" +
                  filteredData[i]["desa_str"] +
                  ", " +
                  filteredData[i]["kecamatan_str"] +
                  ", " +
                  filteredData[i]["kabkot_str"]
              )
              .addTo(mymap);
          }
        }
      }
    }
  );
};

var mymap = L.map("mapid", { scrollWheelZoom: false }).setView(
  [-6.558322, 107.761622],
  10
);

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

function status(value, stage) {
  if (value == "ODP") {
    return "Orang Dalam Pemantauan";
  } else if (value == "PDP") {
    return "Pasien Dalam Pengawasan";
  } else if (value == "Positif") {
    if (stage == "Sembuh") {
      return "Positif (Sembuh)";
    } else if (stage == "Meninggal") {
      return "Positif (Meninggal)";
    } else if (stage == "Aktif") {
      return "Positif (Aktif)";
    } else {
      return "Positif";
    }
  }
}

var iconODP = L.icon({
  iconUrl: "assets/odp.png",
  iconSize: [32, 32] // size of the icon
});

var iconPDP = L.icon({
  iconUrl: "assets/pdp.png",
  iconSize: [32, 32] // size of the icon
});

var iconPositif = L.icon({
  iconUrl: "assets/positif.png",
  iconSize: [32, 32] // size of the icon
});

var iconSembuh = L.icon({
  iconUrl: "assets/sembuh.png",
  iconSize: [32, 32] // size of the icon
});

var iconMeinggal = L.icon({
  iconUrl: "assets/meninggal.png",
  iconSize: [32, 32] // size of the icon
});

function iconFile(value, stage) {
  if (value == "ODP") {
    return iconODP;
  } else if (value == "PDP") {
    return iconPDP;
  } else if (value == "Positif") {
    if (stage == "Sembuh") {
      return iconSembuh;
    } else if (stage == "Meninggal") {
      return iconMeinggal;
    } else if (stage == "Aktif") {
      return iconPositif;
    } else {
      return iconPositif;
    }
  }
}

function switchMap(val) {
  navSubang = document.getElementById("subang");
  navJabar = document.getElementById("jabar");

  if (val == "subang") {
    navSubang.classList.add("active");
    navJabar.classList.remove("active");
  } else {
    navSubang.classList.remove("active");
    navJabar.classList.add("active");
  }

  console.log(val);
  title = val == "subang" ? "Kabupaten Subang" : "Jawa Barat";
  document.getElementById("titleMap").innerHTML = title;
  getMarkers(val);
}

switchMap("subang");

// share
const shareButton = document.querySelector(".share-button");

shareButton.addEventListener("click", event => {
  if (navigator.share) {
    navigator
      .share({
        title: "Covid19 Subang, Jawa Barat",
        url: "https://covid19.alfathony.com"
      })
      .then(() => {
        console.log("Thanks for sharing!");
      })
      .catch(console.error);
  } else {
    shareDialog.classList.add("is-open");
  }
});
