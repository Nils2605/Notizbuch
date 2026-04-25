let aufgaben = [];

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

function erledigtUmschalten(index) {
  aufgaben[index].erledigt = !aufgaben[index].erledigt;

  aufgabenSpeichern();
  listeAnzeigen();
}

function aufgabeLoeschen(index) {
  aufgaben.splice(index, 1);

  aufgabenSpeichern();
  listeAnzeigen();
}

function listeAnzeigen() {
  let liste = document.getElementById("liste");
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

loginAnzeigen();
aufgabenLaden();