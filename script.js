let aufgaben = [];
let deleteIndex = -1;
let filterStatus = "alle";

// ============ LOGIN ============

function einloggen() {
  let name = document.getElementById("name").value.trim();

  if (name === "") {
    alert("Bitte gib deinen Namen ein.");
    return;
  }

  localStorage.setItem("benutzerName", name);
  loginAnzeigen();
}

function ausloggen() {
  localStorage.removeItem("benutzerName");
  filterStatus = "alle";
  updateFilterButtons();

  document.getElementById("loginBereich").style.display = "flex";
  document.getElementById("appBereich").style.display = "none";
  document.getElementById("name").value = "";
}

function loginAnzeigen() {
  let name = localStorage.getItem("benutzerName");

  if (name) {
    document.getElementById("loginBereich").style.display = "none";
    document.getElementById("appBereich").style.display = "block";
    document.getElementById("begruessung").innerText = "Hallo " + name + " 👋";
  }
}

// ============ AUFGABEN LADEN & SPEICHERN ============

function aufgabenLaden() {
  let gespeicherteAufgaben = localStorage.getItem("aufgaben");

  if (gespeicherteAufgaben) {
    aufgaben = JSON.parse(gespeicherteAufgaben);
  }

  listeAnzeigen();
}

function aufgabenSpeichern() {
  localStorage.setItem("aufgaben", JSON.stringify(aufgaben));
}

// ============ AUFGABE HINZUFÜGEN ============

function aufgabeHinzufuegen() {
  let eingabe = document.getElementById("aufgabe").value.trim();
  let prioritaet = document.getElementById("prioritaetSelect").value;
  let faellig = document.getElementById("faelligDatum").value;

  if (eingabe === "") {
    alert("Bitte gib eine Aufgabe ein.");
    return;
  }

  // PHASE 1: Duplikate verhindern
  let existiert = aufgaben.some(function (aufgabe) {
    return aufgabe.text.toLowerCase() === eingabe.toLowerCase();
  });

  if (existiert) {
    alert("Diese Aufgabe existiert bereits.");
    return;
  }

  // PHASE 2: Erweiterte Datenstruktur
  let neueAufgabe = {
    text: eingabe,
    erledigt: false,
    prioritaet: prioritaet,
    faellig: faellig,
    status: "offen",
  };

  aufgaben.push(neueAufgabe);

  document.getElementById("aufgabe").value = "";
  document.getElementById("faelligDatum").value = "";
  document.getElementById("prioritaetSelect").value = "mittel";

  aufgabenSpeichern();
  listeAnzeigen();
}

// ============ ERLEDIGT UMSCHALTEN ============

function erledigtUmschalten(index) {
  aufgaben[index].erledigt = !aufgaben[index].erledigt;
  aufgaben[index].status = aufgaben[index].erledigt ? "erledigt" : "offen";

  aufgabenSpeichern();
  listeAnzeigen();
}

// ============ AUFGABE LÖSCHEN ============

function aufgabeLoeschen(index) {
  deleteIndex = index;
  document.getElementById("dialogOverlay").classList.add("active");
  document.getElementById("confirmDialog").classList.add("active");
}

function confirmDelete() {
  if (deleteIndex >= 0) {
    aufgaben.splice(deleteIndex, 1);
    aufgabenSpeichern();
    listeAnzeigen();
    closeDialog();
  }
}

function closeDialog() {
  deleteIndex = -1;
  document.getElementById("dialogOverlay").classList.remove("active");
  document.getElementById("confirmDialog").classList.remove("active");
}

// ============ FILTER ============

function filterSetzen(status) {
  if (["alle", "offen", "erledigt"].includes(status)) {
    filterStatus = status;
    updateFilterButtons();
    listeAnzeigen();
  }
}

function updateFilterButtons() {
  let buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(function (btn) {
    btn.classList.remove("active");
    if (btn.getAttribute("onclick").includes("'" + filterStatus + "'")) {
      btn.classList.add("active");
    }
  });
}

function aufgabenFiltern() {
  return aufgaben.filter(function (aufgabe) {
    if (filterStatus === "alle") return true;
    return aufgabe.status === filterStatus;
  });
}

// ============ LISTE ANZEIGEN ============

function listeAnzeigen() {
  let liste = document.getElementById("liste");
  let fortschritt = document.getElementById("fortschritt");
  let progressFill = document.getElementById("progressFill");

  let gefiltert = aufgabenFiltern();
  let erledigte = gefiltert.filter(function (aufgabe) {
    return aufgabe.erledigt;
  }).length;

  // Fortschrittstext
  if (gefiltert.length === 0) {
    fortschritt.innerText = "0 von 0 Aufgaben erledigt";
    progressFill.style.width = "0%";
  } else {
    fortschritt.innerText =
      erledigte + " von " + gefiltert.length + " Aufgaben erledigt";
    let prozent = (erledigte / gefiltert.length) * 100;
    progressFill.style.width = prozent + "%";
  }

  if (gefiltert.length === 0) {
    liste.innerHTML =
      "<li style='text-align: center; padding: 2rem; color: #94a3b8;'>Keine Aufgaben vorhanden 🧘‍♂️</li>";
    return;
  }

  liste.innerHTML = "";

  for (let i = 0; i < aufgaben.length; i++) {
    let aufgabe = aufgaben[i];

    // Wenn gefiltert wird, nur angepasste anzeigen
    if (filterStatus !== "alle" && aufgabe.status !== filterStatus) {
      continue;
    }

    let li = document.createElement("li");
    li.className = "task-item";

    // Checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = aufgabe.erledigt;
    checkbox.onclick = function () {
      erledigtUmschalten(i);
    };

    // Content
    let content = document.createElement("div");
    content.className = "task-content";

    let text = document.createElement("span");
    text.className = "task-text";
    text.innerText = aufgabe.text;

    if (aufgabe.erledigt) {
      text.style.textDecoration = "line-through";
      text.style.color = "#94a3b8";
    }

    content.appendChild(text);

    // Meta-Informationen
    let meta = document.createElement("div");
    meta.className = "task-meta";

    // Prioritäts-Badge
    let priorityBadge = document.createElement("span");
    priorityBadge.className = "priority-badge " + aufgabe.prioritaet;
    priorityBadge.innerText = aufgabe.prioritaet;
    meta.appendChild(priorityBadge);

    // Datum-Badge
    if (aufgabe.faellig) {
      let dateBadge = document.createElement("span");
      dateBadge.className = "date-badge";
      dateBadge.innerText = "📅 " + formatDatum(aufgabe.faellig);
      meta.appendChild(dateBadge);
    }

    content.appendChild(meta);

    // Delete-Button
    let actions = document.createElement("div");
    actions.className = "task-actions";

    let btn = document.createElement("button");
    btn.innerText = "🗑️";
    btn.className = "btn-delete-task";
    btn.setAttribute("data-index", i);

    btn.onclick = function () {
      aufgabeLoeschen(i);
    };

    actions.appendChild(btn);

    li.appendChild(checkbox);
    li.appendChild(content);
    li.appendChild(actions);

    liste.appendChild(li);
  }
}

// ============ HELFER ============

function formatDatum(datum) {
  if (!datum) return "";
  let d = new Date(datum + "T00:00:00");
  let options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return d.toLocaleDateString("de-DE", options);
}

// ============ ENTER-TASTE ============

document.addEventListener("DOMContentLoaded", function () {
  // Enter beim Login
  let nameInput = document.getElementById("name");
  if (nameInput) {
    nameInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        einloggen();
      }
    });
  }

  // Enter bei Aufgabe hinzufügen
  let aufgabeInput = document.getElementById("aufgabe");
  if (aufgabeInput) {
    aufgabeInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        aufgabeHinzufuegen();
      }
    });
  }

  // Dialog schließen bei Esc
  document.addEventListener("keypress", function (event) {
    if (event.key === "Escape") {
      closeDialog();
    }
  });

  // Overlay klick zum schließen
  document
    .getElementById("dialogOverlay")
    .addEventListener("click", closeDialog);
});

// ============ INITIAL START ============

loginAnzeigen();
aufgabenLaden();
