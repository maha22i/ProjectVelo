class LeafletMap {
  /**
   * @param {number} latitude Latitude coordinate that initializes the map layer
   * @param {number} longitude Longitude coordinate that initializes the map layer
   * @param {number} zoom Initial zoom level of the map layer
   * @property {boolean} isAppended If true prevent from displaying a new form
   * @method displayLayer Displays map layer using Mapbox API
   * @method centerMap Recenter map with the initial zoom level
   * @method initMarkers Initializes and displays markers
   * @method mobileOpacity Changes buttons opacity when touching map on mobile
   */

  constructor(lat, lng, zoom) {
    this.lat = lat;
    this.lng = lng;
    this.zoom = zoom;
    this.map = L.map(document.getElementById("map"), {
      center: {
        lat: this.lat,
        lng: this.lng,
      },
      zoom: this.zoom,
    });

    this.map.closePopupOnClick = false;
    this.isAppended = false;

    this.displayLayer();

    this.centerMap();
    this.initMarkers();
    this.mobileOpacity();
  }

  displayLayer() {
    // Load and display tile layer on the map
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/light-v10",
        accessToken:
          "pk.eyJ1IjoiZmEtMiIsImEiOiJja3gzOGprcnUwNm91MnZwMGdjNHVtYW1uIn0.5BO4a6wuQsRrmTObSX5oXA",
      }
    ).addTo(this.map);
  }
  location() {
    // Map initialization
    var map = L.map("map").setView([28.3949, 84.124], 8);

    //osm layer
    var osm = L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/light-v10",
        accessToken:
          "pk.eyJ1IjoiZmEtMiIsImEiOiJja3gzOGprcnUwNm91MnZwMGdjNHVtYW1uIn0.5BO4a6wuQsRrmTObSX5oXA",
      }
    );
    osm.addTo(map);

    L.control.locate().addTo(map);
  }
  zoomToStation(e) {
    this.map.flyTo([e.latlng.lat, e.latlng.lng], 16, {
      animate: true,
      duration: 1,
    });
  }

  centerMap() {
    document
      .getElementById("setView")
      .addEventListener("click", () =>
        this.map.flyTo(L.latLng(43.6044622, 1.4442469), 14)
      );
  }

  mobileOpacity() {
    document.getElementById("container").addEventListener("touchstart", () => {
      document.getElementById("setView").style.opacity = 0.4;
      document.getElementById("instructions").style.opacity = 0.4;
    });
    document
      .getElementById("map-container")
      .addEventListener("touchend", () => {
        document.getElementById("setView").style.opacity = 1;
        document.getElementById("instructions").style.opacity = 1;
      });
  }

  // Changer l'icône du marqueur concernant l'état de la station

  markerIcon(available, status) {
    if (available == 0) {
      return L.icon({
        iconUrl: "images/icons/marker-nonactive-icon.svg",
        id: "markerIcon",
      });
    } else if (available > 0) {
      return L.icon({
        iconUrl: "images/icons/marker-open-icon.svg",
        id: "markerIcon",
      });
    } else if (status === "CLOSE") {
      return L.icon({
        iconUrl: "images/icons/marker-close-icon.svg",
        id: "markerIcon",
      });
    }
  }

  initMarkers() {
    this.fetchData().then((data) => {
      console.log("Liste des stations JCDecaux à Toulouse", data); // Expected output : 92 objects
      for (let station of data) {
        // station = data[i]
        let stations = [station.position.lat, station.position.lng];
        let marker = L.marker(stations, {
          icon: this.markerIcon(station.available_bikes, station.status),
        }).addTo(this.map);

        marker.on("mouseover", () => {
          marker
            .bindTooltip(station.name.substr(7), {
              direction: "top",
            })
            .openTooltip()
            .addTo(this.map);
        });

        marker.on("click", (e) => {
          if (station.available_bikes != 0) {
            $("#infoForm").fadeIn();

            $("#successMessage").remove();
            $("#bookForm").remove();
            this.zoomToStation(e);
            if (document.getElementById("user-info") === null) {
              booking.displayForm();
            }
            // Save session storage items
            sessionStorage.setItem("station_name", station.name); // Save station name session storage
            sessionStorage.setItem("latlng", stations); // Set temp_position in session storage
            // Fill station information
            $("#stationName").html(
              "<h3>" + station.name.substr(7).toLowerCase() + "</h3>"
            );
            $("#stationAdress").html(
              "<h4>" +
                station.address.substr(station.name.substr(7).length + 3) +
                "</h4>"
            );
            $("#stationPlaces").html(
              "<p>" +
                '<img src="images/icons/parking-icon.svg" alt="Parking icon"/>' +
                "   " +
                station.bike_stands +
                " places disponibles </p>"
            );
            $("#stationAvailability").html(
              "<p>" +
                '<img src="images/icons/bike-icon.svg" alt="Bike icon"/>' +
                "   " +
                station.available_bikes +
                " vélos disponibles </p>"
            );
            $("#stationNumber").html(
              "<strong>" +
                '<img src="images/icons/marker-icon.svg" alt="Marker icon"/>' +
                " Station n°" +
                station.number +
                "</strong>"
            );
            // Display popup
            marker.bindPopup(station.name.substr(7)).openPopup();
            L.DomUtil.addClass(marker._icon, "blinking"); // Add animation
          } // Prevent from clicking on a unavailable station
          else {
            marker
              .bindPopup(
                "Aucun vélo n'est disponible à la station " +
                  station.name.substr(7)
              )
              .openPopup();
          }
        });
      }
    });
  }

  async fetchData() {
    try {
      let dataURL =
        "https://api.jcdecaux.com/vls/v1/stations?contract=toulouse&apiKey=28b0fb05678c8dbbccf28ee6cd3b1771fc560c43";
      let response = await fetch(dataURL);

      if (response.ok) {
        return response.json();
      } else {
        console.error("Erreur du serveur : ", response.status);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
