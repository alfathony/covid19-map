var mymap = L.map("mapid", { scrollWheelZoom: false }).setView(
  [-6.558322, 107.761622],
  12
);

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

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

function status(value, stage) {
  if (value == "ODP") {
    return "Orang Dalam Pemantauan";
  } else if (value == "PDP") {
    return "Pasien Dalam Pemantauan";
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

getJSON("https://covid19-public.digitalservice.id/analytics/longlat/", function(
  err,
  data
) {
  if (err !== null) {
    alert("Something went wrong: " + err);
  } else {
    // alert("Your query count: " + data.data.length);

    document.getElementById("update").innerHTML = data.last_update;

    for (var i = 0; i < data.data.length; i++) {
      if (data.data[i]["wilayah_status_stage_latitude"] != null) {
        marker = new L.marker(
          [
            data.data[i]["wilayah_status_stage_latitude"],
            data.data[i]["wilayah_status_stage_longitude"]
          ],
          {
            icon: iconFile(data.data[i]["status"], data.data[i]["stage"])
          }
        )
          .bindPopup(
            "<b>" +
              status(data.data[i]["status"], data.data[i]["stage"]) +
              "</b><br>" +
              data.data[i]["jenis_kelamin_str"] +
              ", " +
              data.data[i]["umur"] +
              " tahun" +
              "<br>" +
              data.data[i]["desa_str"] +
              ", " +
              data.data[i]["kecamatan_str"] +
              ", " +
              data.data[i]["kabkot_str"]
          )
          .addTo(mymap);
      }
    }
  }
});
