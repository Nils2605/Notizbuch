let aufgaben = [];

// LOGIN

function einloggen() {
  let name = document.getElementById("name").value;

  if (name === "") {
    alert("Bitte gib deinen Namen ein.");
    return;
  }

  localStorage.setItem("benutzerName", name);
  loginAnzeigen();
}

function ausloggen() {
  localStorage.removeItem("benutzerName");

  document.getElementById("loginBereich").style.display = "block";
  document.getElementById("appBereich").style.display = "none";
}

function loginAnzeigen() {
  let name = localStorage.getItem("benutzerName");

  if (name) {
    document.getElementById("loginBereich").style.display = "none";
    document.getElementById("appBereich").style.display = "block";
    document.getElementById("begruessung").innerText = "Hallo " + name + " 👋";
  }
}

// AUFGABEN LADEN & SPEICHERN

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

// AUFGABE HINZUFÜGEN

function aufgabeHinzufuegen() {
  let eingabe = document.getElementById("aufgabe").value;

  if (eingabe === "") return;

  let neueAufgabe = {
    text: eingabe,
    erledigt: false
  };

  aufgaben.push(neueAufgabe);

  document.getElementById("aufgabe").value = "";

  aufgabenSpeichern();
  listeAnzeigen();
}

// ERLEDIGT UMSCHALTEN

function erledigtUmschalten(index) {
  aufgaben[index].erledigt = !aufgaben[index].erledigt;

  aufgabenSpeichern();
  listeAnzeigen();
}

// AUFGABE LÖSCHEN

function aufgabeLoeschen(index) {
  aufgaben.splice(index, 1);

  aufgabenSpeichern();
  listeAnzeigen();
}

// LISTE ANZEIGEN

function listeAnzeigen() {
  let liste = document.getElementById("liste");
  let fortschritt = document.getElementById("fortschritt");
let erledigte = aufgaben.filter(function(aufgabe) {
  return aufgabe.erledigt;
}).length;

fortschritt.innerText = erledigte + " von " + aufgaben.length + " Aufgaben erledigt";

  if (aufgaben.length === 0) {
    liste.innerHTML = "<p>Keine Aufgaben vorhanden 🧘‍♂️</p>";
    return;
  }

  liste.innerHTML = "";

  for (let i = 0; i < aufgaben.length; i++) {
    let li = document.createElement("li");

    let text = document.createElement("span");
    text.innerText = aufgaben[i].text;

    if (aufgaben[i].erledigt) {
      text.className = "erledigt";
    }

    text.onclick = function () {
      erledigtUmschalten(i);
    };

    let btn = document.createElement("button");
    btn.innerText = "X";
    btn.className = "loeschen";

    btn.onclick = function () {
      aufgabeLoeschen(i);
    };

    li.appendChild(text);
    li.appendChild(btn);

    liste.appendChild(li);
  }
}

// ENTER-TASTE

document.getElementById("aufgabe").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    aufgabeHinzufuegen();
  }
});

// INITIAL START

loginAnzeigen();
aufgabenLaden();