class Booking {
  /**
   * @property {boolean} inputValidation Check if all the written input are correct
   * @property {boolean} open If true prevent from opening a new window dialog
   * @method displayForm Displays first form / with submit button
   * @method book Displays second form / with input and Canvas
   * @method validationForm Displays last form  / with success message
   * @method appendTimerModal Displays booking modal when a reservation is active
   * @method setTimerInterval Launches timer
   */

  constructor() {
    this.inputValidation = false;
    this.appendTimerModal();
    this.setTimerInterval();
  }

  displayForm() {
    // Afficher le formulaire de réservation de l'utilisateur
    let basicElements = HtmlProvider.basicElements();
    let firstForm = HtmlProvider.firstForm();
    let closeBtn = HtmlProvider.closeButton();
    //Ajouter le premier formulaire
    for (let i = 0; i < firstForm.length; i++) {
      firstForm[0].append(firstForm[i]);
    }
    basicElements[0].prepend(basicElements[1]);
    basicElements[1].append(firstForm[0]);
    setTimeout(
      () =>
        (document.getElementById("user-info").style.transform = "translate(0)"),
      50
    );
    // Ajouter et afficher le bouton de fermeture
    closeBtn[0].append(closeBtn[1]);
    basicElements[1].append(closeBtn[0]);
    document
      .getElementById("closeForm")
      .addEventListener("click", () => this.closeForm());
    // Form actions
    $("#successMessage").remove();
    $("#bookForm").remove();
    $("#options").remove();
    this.open = false;

    this.bookAction();
    $("#user-info").bind("touchmove", (e) => e.preventDefault());
  }

  closeForm() { // Add a close button option to the form
    $("form").fadeOut("slow");
    $("#successMessage").fadeOut("slow");
    let animClass = $(".circle").data("animation");
    $(".circle").addClass(animClass); // Animate close button

    setTimeout(() => {
      $("#user-info").css({
        "min-width": "0px",
        "max-width": "0px",
      });
    }, 300);
    setTimeout(() => $("#user-info").remove(), 800);

    setTimeout(() => $(".circle").removeClass(animClass), 1000); // Remove animation after timeout
    if (sessionStorage.getItem("timestamp") != null) {
      $("#cancelModal").fadeIn("slow"); // Add cancel button on Timer modal
    }
  }

  bookAction() {
    // Action en cliquant sur le bouton Soumettre
    document.getElementById("submit").addEventListener("click", () => {
      if (document.getElementById("modal") != null) {
        this.openDialog();
      } else {
        this.book();
      }
    });
  }

  openDialog() {
    // Ouvrir une fenêtre de dialogue si une réservation est en cours

    if (this.open === false) {
      // Empêcher l'ouverture de plusieurs fenêtres de dialogue à chaque fois qu'un utilisateur clique sur Soumettre
      let dialog = HtmlProvider.dialogModal();
      dialog[1].append(dialog[2], dialog[3]);
      dialog[4].append(dialog[5], dialog[6]);
      dialog[0].append(dialog[1], dialog[4]);
      $("#map-container").append(dialog[0]); // Appends dialog window
      $("#modal-example").fadeIn(); // Display dialog window

      document.getElementById("continue").addEventListener("click", () => {
        //Supprimer la position et le nom de la station précédente dans la session Stockage
        sessionStorage.removeItem("position");
        sessionStorage.removeItem("name");
        $("dialog").fadeOut("slow");
        $("dialog").remove();
        this.clearTimerInterval(); //  Effacer la réservation précédente
        this.removeTimerModal();
        this.book(); // Lancer une nouvelle réservation
      });

      document.getElementById("closeDialog").addEventListener("click", () => {
        this.open = false;
        $("dialog").fadeOut("slow");
        $("dialog").remove();
      });
      this.open = true;
    }
  }

  book() {
    // Save station position and name in sessionStorage
    sessionStorage.setItem(
      "position",
      JSON.stringify(sessionStorage.getItem("latlng"))
    );
    sessionStorage.setItem(
      "station",
      JSON.stringify(sessionStorage.getItem("station_name"))
    );
    clearInterval(this.interval); // Clear timer interval
    $("#infoForm").hide();
    // Append second form, input elements, Canvas and previous/next buttons
    let secondForm = HtmlProvider.secondForm();
    for (let i = 1; i <= 10; i++) {
      secondForm[0].append(secondForm[i]);
    }
    for (let j = 7; j <= 9; j++) {
      secondForm[7].append(secondForm[j]);
    }
    for (let k = 10; k <= 12; k++) {
      secondForm[10].append(secondForm[k]);
    }

    $("#user-info").append(secondForm[0]); // Append second form

    if (
      typeof localStorage.getItem("name") != "null" &&
      typeof localStorage.getItem("surname") != "null"
    ) {
      document.getElementById("name").value = localStorage.getItem("name");
      document.getElementById("surname").value =
        localStorage.getItem("surname");
    }
    this.canvas = new Canvas(
      document.getElementById("canvasSignature"),
      "gold",
      1
    );
    this.name = document.getElementById("name");
    this.surname = document.getElementById("surname");
    this.inputListener(); // Listen input and Canvas
    document
      .getElementById("previousForm")
      .addEventListener("click", () => this.previous());
    document
      .getElementById("nextForm")
      .addEventListener("click", () => this.next());
  }

  previous() {
    // Previous button action
    $("#bookForm").remove();
    $("#options").remove();
    $("#infoForm").fadeIn("slow");
  }

  checkInput(
    elt // Check input elements adding a visual reminder for the user
  ) {
    if (
      elt.value.length > 0 &&
      RegExp(/^[a-zA-Z\-*\ *]+$/).test(elt.value) == true
    ) {
      elt.style.borderColor = "green";
      elt.style.borderColor = "green";
      elt.style.outline = "none";
      elt.classList.remove("invalid");
      elt.classList.add("valid");
      return (this.inputValidation = true);
    } else {
      elt.style.borderColor = "red";
      elt.classList.remove("valid");
      elt.classList.add("invalid"); // Add animation
    }
  }

  inputListener() {
    // Listen input contents
    if (
      localStorage.getItem("name") != null &&
      localStorage.getItem("surname") != null
    ) {
      this.checkInput(this.name);
      this.checkInput(this.surname);
    } else if (
      localStorage.getItem("name") === null &&
      localStorage.getItem("surname") === null
    ) {
      this.name.addEventListener("blur", () => this.checkInput(this.name));
      this.surname.addEventListener("blur", () =>
        this.checkInput(this.surname)
      );
    }
  }

  setTimerInterval() {
    setInterval(() => {
      this.timestamp = sessionStorage.getItem("timestamp");
      let now = this.timestamp - Date.now();
      now = now / 1000;
      let component = (a, b) => Math.floor(a / b);
      let minutes = component(now, 60) % 60;
      let seconds = component(now, 1) % 60;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      $("#timer").html(minutes + ":" + seconds); // Display timer
      if (seconds == 0 && minutes == 0) {
        // Stop timer and remove modal when finished
        this.cancelBooking();
      }
    }, 1000);
  }

  cancelBooking() {
    // Cancel the current reservation
    this.removeTimerModal(); // Remove timer modal
    this.clearTimerInterval(); // Remove timer interval
    $("#successMessage").fadeOut("slow");
    if (document.getElementById("user-info") != null) {
      setTimeout(() => {
        $("#user-info").css({
          "min-width": "0px",
          "max-width": "0px",
        });
      }, 300);
      setTimeout(() => $("#user-info").remove(), 800);
    }
    this.centerMap = map.map.flyTo(L.latLng(49.610821, 6.132882), 14);
  }

  clearTimerInterval() {
    // Remove session storage items
    sessionStorage.removeItem("timestamp");
    sessionStorage.removeItem("position");
    // Clear all timer intervals
    clearInterval(this.interval);
  }

  findMyStation() {
    // Localiser la dernière réservation
    // Crée un tableau contenant lat et lng sous forme de chaînes
    let latlng = JSON.parse(sessionStorage.getItem("position")).split(",");
    let station = sessionStorage.getItem("station");
    this.reset = map.map.flyTo(L.latLng(latlng), 16); // Zoom to reserved station
    this.popup = L.popup()
      .setLatLng(latlng)
      .setContent(station.substr(7))
      .openOn(map.map);
  }

  appendTimerModal() {
    // Append modal when Booking is valid
    if (sessionStorage.getItem("timestamp") != null) {
      let modal = HtmlProvider.timerModal();
      console.log(document.getElementById("user-info") === null);

      for (let i = 0; i < modal.length; i++) {
        modal[0].append(modal[i]);
      }
      $("body").append(modal[0]);
      if (document.getElementById("user-info") != null) {
        $("#cancelModal").hide();
      }
      document
        .getElementById("cancelModal")
        .addEventListener("click", () => this.cancelBooking());
      document
        .getElementById("locate")
        .addEventListener("click", () => this.findMyStation());
    }
  }

  removeTimerModal() {
    // Affichage modal si l'utilisateur annule

    document.getElementById("modal").style.height = "0";
    setTimeout(() => $("#modal").remove(), 600);
  }

  validationForm() {
    $("#successMessage").remove();
    $("#bookForm").hide();
    $("#options").remove();
    // Supprimer les formulaires précédents
    // Ajout du dernier formulaire
    let thirdForm = HtmlProvider.thirdForm();
    for (let i = 0; i < thirdForm.length; i++) {
      thirdForm[0].append(thirdForm[i]);
    }
    thirdForm[2].append(thirdForm[3]);
    $("#user-info").append(thirdForm[0]); // Appends last form
  }

  next() {
    // Actions en cliquant sur le bouton suivant
    // Vérifie si l'utilisateur a bien rempli tous les champs demandés

    if (
      this.checkInput(this.name) &&
      this.checkInput(this.surname) &&
      this.canvas.pixelChecker()
    ) {
      // Save user info and timer info
      localStorage.setItem("name", document.getElementById("name").value);
      localStorage.setItem("surname", document.getElementById("surname").value);
      let expire = Date.now() + 1200000; // Save expiration time : 20 minutes
      sessionStorage.setItem("timestamp", expire);
      // Save station position and name
      sessionStorage.setItem(
        "position",
        JSON.stringify(sessionStorage.getItem("latlng"))
      );
      sessionStorage.setItem("station", sessionStorage.getItem("station_name"));
      this.interval = this.setTimerInterval(); // Start timer
      this.appendTimerModal(); // Append timer modal
      this.validationForm(); // Append last form
      // Cancel Booking
      $("#cancelReservation").addClass("cancelbtn");
      document
        .getElementById("cancelReservation")
        .addEventListener("click", () => this.cancelBooking());
    } else if (this.inputValidation == false) {
      // Prevent from going further
      document.getElementById("name").style.borderColor = "red";
      document.getElementById("surname").style.borderColor = "red";
    }
  }
}
