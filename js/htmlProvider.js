class HtmlProvider {
  static basicElements() {
    let $container = $("#map-container");
    let $userInfo = $('<div id="user-info"></div>');

    let $basicElements = [];
    $basicElements.push($container, $userInfo);
    return $basicElements;
  }

  static closeButton() {
    // Create close button on form
    let $divClosebtn = $('<div id="closeForm" class="circCont"></div>');
    let $closebtn = $(
      '<button class="circle" data-animation="showShadow" data-remove="3000"></button>'
    );

    let $button = [];
    $button.push($divClosebtn, $closebtn);
    return $button;
  }

  static firstForm() {
    let $infoForm = $('<form id="infoForm"></form>');
    let $submit = $('<input type="button" value="Réserver" id="submit">');
    let $stationNumber = $('<div id="stationNumber"></div>');
    let $stationName = $('<div id="stationName"></div>');
    let $stationAdress = $('<div id="stationAdress"></div>');
    let $stationAvailability = $('<div id="stationAvailability"></div>');
    let $stationPlaces = $('<div id="stationPlaces"></div>');

    let $firstForm = [];
    $firstForm.push(
      $infoForm,
      $stationNumber,
      $stationName,
      $stationAdress,
      $stationAvailability,
      $stationPlaces,
      $submit
    );
    return $firstForm;
  }

  static secondForm() {
    let $bookForm = $('<form id="bookForm"></form>');
    let $textSurname = $("<em>Nom</em>");
    let $textName = $("<em>Prénom</em>");
    let $inputName = $(
      '<input type="text" name="name" placeholder="Renseignez votre prénom" id="name" class="inputForm" minlength="2" maxlength="30" required>'
    );
    let $inputSurname = $(
      '<input type="text" name="surname" placeholder="Renseignez votre nom" id="surname" class="inputForm" minlength="2" maxlength="30" required>'
    );
    let $inputSignature = $(
      "<p>Pour finaliser votre réservation, veuillez signer ci-dessous</p>"
    );

    let $divOptions = $('<div id="options"></div>');
    let $previous = $(
      '<img src="images/icons/previous-icon.svg" id="previousForm" />'
    );
    let $next = $('<img src="images/icons/next-icon.svg" id="nextForm" />');
    let $divErase = $('<div id="erase"></div>');
    let $iconErase = $('<img src="images/icons/erase.svg" id="eraseBtn" />');
    let $textErase = $("<p>Effacer ma sélection</p>");
    let $canvas = $(
      '<canvas id="canvasSignature" class="canvas" width="250px" height="160px"></canvas><span id="errorSignature"></span>'
    );

    let $secondForm = [];
    $secondForm.push(
      $bookForm,
      $textSurname,
      $inputSurname,
      $textName,
      $inputName,
      $inputSignature,
      $canvas,
      $divErase,
      $iconErase,
      $textErase,
      $divOptions,
      $previous,
      $next
    );
    return $secondForm;
  }

  static thirdForm() {
    let $station = sessionStorage.getItem("station_name");
    let $divSuccess = $('<div id="successMessage"></div>');
    let $textSuccess = $(
      "<p> Merci d'avoir réservé votre vélo avec OpenBike.</p><p>Votre vélo est réservé pour les 20 prochaines minutes à la statio " +
        $station.substr(7) +
        ", ne perdez pas de temps !</p><p>À très bientôt sur le réseau Velo OpenBike.</p><p>En sélectionnant une nouvelle station, votre réservation sera annulée. </p> "
    );

    let $divCancel = $('<div id="cancelReservation"></div>');
    let $textCancel = $("<p>Annuler</p>");

    let $thirdForm = [];
    $thirdForm.push($divSuccess, $textSuccess, $divCancel, $textCancel);
    return $thirdForm;
  }

  static timerModal() {
    let $divModal = $('<div id="modal"></div>');
    let $text = $('<p>Il vous reste <span id="timer"></span> minutes</p>');
    let $position = $(
      '<button type="button" id="locate"><a href="#container">Retrouver ma station <img src="images/icons/gps.svg"/></a></button>'
    );
    let $cancel = $(
      '<button type="button" id="cancelModal">Annuler la réservation</button>'
    );

    let $modal = [$divModal, $text, $position, $cancel];
    $modal.push();
    return $modal;
  }

  static dialogModal() {
    let $divDialog = $(
      '<dialog class="mdl-dialog" id="modal-example"></dialog>'
    );

    let $content = $('<div class="mdl-dialog__content"></div>');
    let $title = $("<h5>Annuler la réservation en cours ?</h5>");
    let $text = $(
      "<p>En cliquant sur le bouton Annuler, votre réservation actuelle sera annulée.</p><p>Vous pourrez effectuer une nouvelle réservation à la station sélectionnée.</p>"
    );

    let $actions = $(
      '<div class="mdl-dialog__actions mdl-dialog__actions--full-width"></div>'
    );
    let $closeBtn = $(
      '<button type="button" id="closeDialog" class="mdl-button">Retour</button>'
    );
    let $continueBtn = $(
      '<button type="button" id="continue" class="mdl-button">Annuler</button>'
    );

    let $dialog = [];
    $dialog.push(
      $divDialog,
      $content,
      $title,
      $text,
      $actions,
      $closeBtn,
      $continueBtn
    );
    return $dialog;
  }
}
