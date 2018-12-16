// ==UserScript==
// @name        [HFR] Color Tag
// @namespace   ddst.github.io
// @version     2.1.0
// @author      DdsT
// @downloadURL https://ddst.github.io/hfr_ColorTag/hfrcolortag.user.js
// @updateURL   https://ddst.github.io/hfr_ColorTag/hfrcolortag.meta.js
// @description Colorier et Annoter les messages en fonction du pseudo
// @icon        https://www.hardware.fr/images_skin_2010/facebook/logo.png
// @match       *://forum.hardware.fr/forum2.php*
// @match       *://forum.hardware.fr/hfr/*/*sujet_*
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM.getValue
// @grant       GM.setValue
// ==/UserScript==

/*
Copyright (C) 2018 DdsT

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see https://ddst.github.io/hfr_ColorTag/LICENSE.
*/
(async () => { //le script s'exécute de manière asynchrone pour récupérer les données via GM.getValue

const STYLE = `
.ct-button {
  cursor     : pointer;
  box-shadow :  1px  1px 2px rgba(0, 0, 0, 0.05),
               -1px -1px 2px rgba(0, 0, 0, 0.05),
               -1px  1px 2px rgba(0, 0, 0, 0.05),
                1px -1px 2px rgba(0, 0, 0, 0.05);
}
.ct-button:hover {
  cursor     : pointer;
  box-shadow :  1px  1px 3px rgba(0, 0, 0, 0.15),
               -1px -1px 3px rgba(0, 0, 0, 0.15),
               -1px  1px 3px rgba(0, 0, 0, 0.15),
                1px -1px 3px rgba(0, 0, 0, 0.15);
}
.ct-profile {
  border-radius : 10px;
  height        : 14px;
  width         : 14px;
  margin-right  :  2px;
  margin-left   :  2px;
}
.ct-quote {
  border-radius : 10px;
  height        : 12px;
  width         : 12px;
  margin-right  :  3px;
}
.ct-note {
  font-style : italic;
}
.ct-input {
  font-style  : italic;
  font-size   : 10px;
  font-family : Verdana, Arial, sans-serif, Helvetica;
  height      :  8px;
  border      :  1px solid #000;
  background  : rgb(0,0,0,0);
  width       : 140px;
}
#ct-menu {
  box-shadow : 3px 3px 2px -1px rgba(0, 0, 0, 0.4);
  position   : absolute;
  border     :  1px solid black;
  background : white;
  z-Index    : 1003;
  width      : 72px;
  padding    :  1px;
  display    : none;
  font-size  : 10px;
}
.ct-box {
  outline :  1px solid #000;
  margin  :  2px;
  height  : 14px;
  width   : 14px;
  float   : left;
  cursor  : pointer;
}
.ct-box:hover {
  box-shadow :  1px  1px 2px #666,
               -1px -1px 2px #666,
               -1px  1px 2px #666,
                1px -1px 2px #666;
}
#ct-menu input {
  float : left;
}
.ct-image {
  margin : 1px;
  float  : left;
}
.ct-image:hover {
  filter : drop-shadow(0px 0px 1px #666);
}
.ct-checkbox {
  -webkit-appearance : none;
  -moz-appearance    : none;
  appearance         : none;
  color              : #000;
  background-color   : #fff;
  cursor             : pointer;
  border             :  1px solid #888;
  border-radius      :  1px;
  width              : 16px;
  height             : 16px;
  margin             :  0px;
  margin-right       :  4px;
}
.ct-checkbox:hover {
  border                : 1px solid #000;
}
.ct-checkbox:checked:after {
  content     : '✔';
  font-size   : 16px;
  line-height : 12px;
}
#ct-menu label {
  font-size     :  9px;
  height        : 14px;
  width         : 71px;
  margin-top    :  1px;
  margin-left   :  1px;
  margin-bottom :  3px;
  line-height   : 15px;
  float         : left;
  text-align    : left;
}
.ct-rainbow {
  background-image : linear-gradient(45deg, red, orange, yellow, green, blue, indigo);
}
#ct-transparent {
  background-image      : linear-gradient(#ddd, #ddd),
                          linear-gradient(90deg, #000 50%, #fff 0),
                          linear-gradient(#000 50%, #fff 0);
  background-blend-mode : lighten, difference, normal;
  background-size       : 10px 10px;
}
#ct-background {
  position         : fixed;
  left             : 0;
  top              : 0;
  height           : 100%;
  width            : 100%;
  background-color : #fff;
  z-index          : 1001;
  display          : none;
  opacity          : 0;
  transition       : opacity 0.7s ease 0s;
}
#ct-settings {
  box-shadow  : 0 4px  8px 0 rgba(0, 0, 0, 0.2),
                0 6px 20px 0 rgba(0, 0, 0, 0.19);
  position    : fixed;
  width       : 700px;
  background  : white;
  z-index     : 1002;
  display     : none;
  opacity     : 0;
  left        : 50%;
  top         : 50%;
  transform   : translate(-50%, -50%);
  transition  : opacity 0.7s ease 0s;
  padding     : 0 16px 16px 16px;
}
.ct-table {
  border-spacing : 0px;
}
.ct-table td, .ct-table th{
  padding : 4px;
}
.ct-table td a{
  color : #000;
}
.ct-palette {
  outline :  1px solid #000;
  margin  :  3px;
  height  : 28px;
  width   : 28px;
  float   : left;
  cursor  : pointer;
}
.ct-submit {
  width  : 135px;
  margin : 10px 2px 10px 2px;
}
.ct-member-container {
  overflow : auto;
}
.ct-color-settings {
  cursor : pointer;
  width  : 20px;
}
.ct-note-settings {
  cursor     : text;
  font-style : italic;
}
.ct-input-settings {
  border       : 0;
  font-family  : Verdana, Arial, sans-serif, Helvetica;
  line-height  : 0;
  font-style   : italic;
  width        : 100%;
  padding-left : 0;
  padding-top  : 2px;
}
.ct-checkbox-cell {
  width : 20px;
}
`;

const VERSION = GM.info.script.version;

const EDIT_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKZSURBVDjLpZM7TFNhFMd/t/f2IqVQqAWM72IVMUEjIRoiYnTxEWEyTjqoiYNuxkSjk5uJg4ODDjoYE6ODm4sOJlopqNRY5VXC09oCRaCg3t572++7DspTnTzJyTnfyTn/739O8lccx+F/TBsdHb0MHAOQUuI4DlLKJS6E+CP+9gdKKpXKBwIBFWAxm7n8b3Euj8ViQnMcR3W73dyMCmzjG9PxVzi5H7jKa6gI1nLE208oFOLy8wyGaWNkbQwzx+PTIYQQqrb417reW+RT7xhJJBieMHCufgQgl8txbV8hUhbMrwUghECbewDkKnfStH0NB3SN1o5OYqo63xgOhymWXQQyHajeWka+vsRdth9NCPFrOC95m16Npk3jLSkhau9masoE7y+A+tA0+cQEhetO4AvuJDNUTc+LhwsMMok+yoNVPNHqmPpss8Kvs+pHEgAr/QzViuPfvIepgR50xaa4ZBXe0soFBmuKZumaLEX6Symr1DFnTYrlBGq2G83di6/qINboI3SPwsiHXqSjk/Q1LgCcP9wwfwvDMLAsC2syQYHZiW9TC2byDi49j9u7gSLnC4FDNxho78Y1B5BIJIhGowwPD+PxeLDGwpBpxRdqwUzexuXOYc9uZOzle2aqTlFYvgkpJUosFusWQtQIIaivr1cikYhjj7dR4Rlna1Mz9vh9FNXGnFlLOvweacwE+7ZcGfp9ux5luRbunVt/pqH55N28UsFKfytlFTrmzDomX79JSyvbUH2hbXCJFpaLo2TjlrvbGs8Sf3SRvnCEgvU7yKfjqTJdPVh7qX1web9reSHeP5a3u54S3LGXoqJqkh2fvptZ+0jtpfbOv6nxjxWON/mzdVWV2q6aII7bimTTE6eOXv84+C85/wR0RnLQ/rM7uwAAAABJRU5ErkJggg==";
const COG_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAABkklEQVQoz1VRTUsCYRBe/AHe/Qn+j710EbKLVJcyiAqLLkWJkdkSUdChOpQRRWVRG6RQUqirtq7pupZRUvRxyOIlIU9ed5+mbSFjDjPvzDPPM+8MB+7PVG9ekiXJ25qzXMVZtqu2fP0D7xDrZ7aY/djZAqiEy3qRKY4se8ULYizqENm+vhO2ADf+Z3zhCdlmyqjiDieG2FTBEMeC3wQUA7LxTIVHAlVNfwsVV5gwRgOWRE64QwkFXGAD28hCQYb65wVT4kqTa+nGAzQkMKOM81P8knJJIA2LjblaSONk/ZOICyhjD7P8T886L0ImNoUGHtI5SX8jTYU6olg2Aav8ATHEkaZ8j87taEu1rcY1QUrYVNb4FZLIkNw5+hqeWodmDikKORorhzwOsU9RCqcUDQjWHo4CEeOeyioqNEuemHJI0mvY6P/95q4/gVdEEGoKhkzqPmO4GSH9abj91h6C4RG9j405Qkwlhl7W6fAwl94WbjnWiHPQPmkL1pOIoaveaeu2u5z/rvlrPq9Hapfc/879DQmIXQjyme6GAAAAAElFTkSuQmCC";
const UNDO_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIJSURBVDjLpVM9aJNRFD35GsRSoUKKzQ/B0NJJF3EQlKrVgijSCBmC4NBFKihIcXBwEZdSHVoUwUInFUEkQ1DQ4CKiFsQsTrb5xNpgaZHw2Uog5t5zn0NJNFaw0guX97hwzuPcc17IOYfNlIdNVrhxufR6xJkZjAbSQGXjNAorqixSWFDV3KPhJ+UGLtSQMPryrDscPwLnAHOEOQc6gkbUpIagGmApWIb/pZRX4fjj889nWiSQtgYyBZ1BTUEj6AjPa0P71nb0Jfqwa+futIheHrzRn2yRQCUK/lOQhApBJVQJChHfnkCqOwWEQ+iORJHckUyX5ksvAEyGNuJC+s6xCRXNHNxzKMmQ4luwgjfvZp69uvr2+IZcyJ8rjIporrxURggetnV0QET3rrPxzMNM2+n7p678jUTrCiWhphAjVHR9DlR0WkSzf4IHxg5MSF0zXZEuVKWKSlCBCostS8zeG7oV64wPqxInbw86lbVXKEQ8mkAqmUJ4SxieeVhcnANFC02C7N2h69HO2IXeWC8MDj2JnqaFNAMd8f3HKjx6+LxQRmnOz1OZaxKIaF1VISYwB9ARZoQaYY6o1WpYCVYxt+zDn/XzVBv/MOWXW5J44ubRyVgkelFpmF/4BJVfOVDlVyqLVBZI5manPjajDOdcswfG9k/3X9v3/vfZv7rFBanriIo++J/f+BMT+YWS6hXl7QAAAABJRU5ErkJggg==";
const BIN_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAA/UlEQVQoFQXBSy5DUQAA0HNf31OqpIRUTDDSEJ/E1EAiVmARNmAZFmEFjCSGZjbgFwkqBhVBiCJyX991TkgAAACAHICzhbd9O/X5WhHU0udDOp0+2HoICcDxZXup4QKFYXN+9K52l3MAUqethk3caBnT65AD0A+Tkm0Ra+qC74wcgOdwqmPWFL48uvGEHIBC07k3f5IRDW0JOQDRqhVEhZ6ulltkAOTqeFboa3iVRGQAlACoiZKIDICBCgDRQEQGQCkCqJQqJTIAPn+71ZAZEUnmI73+kAHwdXJ51zVk1IRx617i6BEhAWDv2mIzVEql97J5P9g47IcEAAAA+AfRlFkdfeEU4AAAAABJRU5ErkJggg==";
const CROSS_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65WhbmrnZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2+FAAAAABJRU5ErkJggg==";
/* Icons by Mark James - http://www.famfamfam.com/lab/icons/silk/ - CC BY 2.5 - https://creativecommons.org/licenses/by/2.5/ */

const ROOT = document.getElementById("mesdiscussions");
const DEFAULTSTORAGE = {
  version: VERSION,
  members: {},
  config: {
    displayButton: 1,
    displayQuote: 0,
    postBackground: 0,
    quoteBackground: 0,
    observeNewPost: 0,
    palette: ["#b7b7b7", "#ffff00", "#ffc000", "#ff0000", "#c9462c", "#66ff33", "#00cdff", "#008cf4", "#057c85", "#ff99ff", "#7030a0", "#808000", "#000000"]
  }
};
const DEFAULTSTRING = JSON.stringify(DEFAULTSTORAGE);
const STORAGE = await GM.getValue("storage", DEFAULTSTRING);

/* un Post décrit une intervention d'un participant de la page (dans une citation ou bien dans un message complet) */
class Post {
  constructor(element) {
    this.element = element;
    this.isQuote = !element.classList.contains("s2");
    if (this.isQuote) {
      this.author = element.innerHTML.substr(0, (element.innerHTML.length - " a écrit :".length));
      this.background = element.parentNode.parentNode.parentNode.parentNode.parentNode;
    } else {
      this.author = element.innerHTML;
      this.background = element.parentNode.parentNode.parentNode;
    }
    this.author = this.author.replace(/\u200b/g, "").toLowerCase();
    this.noAuthor = this.author == "profil supprimé";
    if (!this.noAuthor) {
      if (!participants[this.author]) participants[this.author] = [];
      participants[this.author].push(this);
      this.button = newButton(this);
      if (!this.isQuote) this.note = new Note(this);
    }
  }
  refresh() {
    const [color, note, displayQuote, postBackground, quoteBackground] = db.getParameters(this.author);
    this.button.style.backgroundColor = color;
    this.background.style.background = ((this.isQuote && quoteBackground) || (!this.isQuote && postBackground)) ? color : "";
    this.button.style.display = ((this.isQuote && !displayQuote) || !db.config.displayButton) ? "none" : "inline-block";
    if (!this.isQuote) {
      this.note.element.innerHTML = note;
      this.note.input.value = note;
    }
  }
}

/* Champ de commentaire personnalisé attaché à un post */
class Note {
  constructor(post) {
    this.post = post;
    this.element = document.createElement("div");
    this.element.className = "ct-note";
    this.input = document.createElement("input");
    this.input.className = "ct-input";
    this.input.style.display = "none";
    this.input.onkeyup = function(event) {
      if (event.keyCode == 13) menu.close();
    };
    post.element.parentNode.appendChild(this.input);
    post.element.parentNode.appendChild(this.element);
  }
  save() {
    if (this.element.innerHTML != this.input.value) {
      this.element.innerHTML = this.input.value;
      db.setNote(this.post.author, this.input.value);
    }
  }
  showInput() {
    this.element.style.display = "none";
    this.input.style.display = "block";
  }
  hideInput() {
    this.element.style.display = "block";
    this.input.style.display = "none";
  }
}

/* Ligne du tableau des membres de la page de configuration */
class Row {
  constructor(table, name) {
    this.table = table;
    this.name = name;
    this.tr = table.insertRow();
    this.index = this.tr.rowIndex;
    let profil = document.createElement("a");
    profil.href = "https://forum.hardware.fr/profilebdd.php?config=hfr.inc&pseudo=" + name;
    profil.innerText = name;
    profil.target = "_blank";
    this.tdName = this.tr.insertCell();
    this.tdName.appendChild(profil);
    this.note = this.tr.insertCell();
    this.color = newColorCell(this);
    this.quote = newSettingCheckBox(this, "Afficher la pastille dans les citations", checkQuoteSettings);
    this.postBackground = newSettingCheckBox(this, "Colorier le fond des messages", checkBackgroundPostSettings);
    this.quoteBackground = newSettingCheckBox(this, "Colorier le fond des citations", checkBackgroundQuoteSettings);
    this.tdDelete = this.tr.insertCell();
    this.delete = newImageButton("Supprimer ce membre", BIN_ICON, this.tdDelete, deleteName);
    this.tr.className = "profil";
    this.tdName.className = "profilCase2";
    this.tdDelete.className = "ct-checkbox-cell";
    this.delete.row = this;
    this.note.row = this;
    this.note.onclick = inputFieldSettings.attach;
    this.note.className = "ct-note-settings";
    this.refresh();
  }
  refresh() {
    const [, note, displayQuote, postBackground, quoteBackground] = db.getParameters(this.name);
    this.note.innerHTML = note;
    this.quote.checked = displayQuote;
    this.postBackground.checked = postBackground;
    this.quoteBackground.checked = quoteBackground;
  }
}

/* Pastille à côté du pseudo permettant de faire apparaître le menu contextuel */
function newButton(post) {
  let button = document.createElement("div");
  button.className = (post.isQuote) ? "ct-button ct-quote left" : "ct-button ct-profile right";
  button.onclick = menu.open;
  button.post = post;
  post.element.parentNode.parentNode.insertBefore(button, post.element.parentNode);
  return button;
}

/* Case de couleur du menu contextuel */
function newBox(color, index, parent, onClickFunction) {
  let box = document.createElement("div");
  box.className = "ct-box";
  box.index = index;
  box.style.backgroundColor = color;
  box.onclick = onClickFunction;
  parent.appendChild(box);
  return box;
}

/* Image cliquable du menu contextuel */
function newImageButton(title, icon, parent, onClickFunction) {
  let button = document.createElement("input");
  button = document.createElement("input");
  button.title = title;
  button.type = "image";
  button.src = icon;
  button.className = "ct-image";
  button.onclick = onClickFunction;
  parent.appendChild(button);
  return button;
}

/* Case à cocher du menu contextuel */
function newCheckBox(title, text, onClickFunction) {
  let label = document.createElement("label");
  let checkbox = document.createElement("input");
  checkbox.className = "ct-checkbox";
  checkbox.type = "checkbox";
  label.innerText = text;
  label.title = title;
  checkbox.onclick = onClickFunction;
  label.appendChild(checkbox);
  menu.page2.appendChild(label);
  return checkbox;
}

/* Ligne de titre de la page de configuration */
function newHeaderRow(table, text, span) {
  let tr = table.insertRow();
  tr.className = "cBackHeader";
  let th = document.createElement("th");
  th.colSpan = span;
  th.innerText = text;
  tr.appendChild(th);
}

/* Ligne de paramètre dans la page de configuration */
function newParameter(table, text) {
  let tr = table.insertRow();
  tr.className = "profil";
  let td = tr.insertCell();
  td.className = "ct-checkbox-cell reponse";
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  td.appendChild(checkbox);
  tr.insertCell().innerHTML = text;
  return checkbox;
}

/* Case de couleur de la palette dans la page de configuration */
function newPalette(color, index, parent, onClickFunction) {
  let palette = document.createElement("div");
  palette.className = "ct-palette";
  palette.style.backgroundColor = color;
  palette.index = index;
  palette.onclick = onClickFunction;
  parent.appendChild(palette);
}

/* Ligne de la palette de la page de configuration */
function newColorRow(table, span) {
  let tr = table.insertRow();
  let td = tr.insertCell();
  let container = document.createElement("div");
  let colorPicker = document.createElement("input");
  colorPicker.type = "color";
  tr.className = "profil";
  td.colSpan = span;
  container.style.margin = "0 auto";
  container.style.width = "442px";
  td.appendChild(container);
  colorPicker.onchange = function() {
    colorPicker.target.style.background = this.value;
  };
  for (let i in db.config.palette) {
    newPalette(db.config.palette[i], i, container, function() {
      colorPicker.target = this;
      colorPicker.value = rgbToHex(this.style.backgroundColor);
      colorPicker.click();
    });
  }
}

/* Bouton dans la page de configuration */
function newSubmit(text, parent, onClickFunction) {
  let button = document.createElement("input");
  button.type = "submit";
  button.className = "ct-submit";
  button.value = text;
  button.onclick = onClickFunction;
  parent.appendChild(button);
}

/* Case de couleur du tableau des membres de la page de configuration */
function newColorCell(row) {
  let cell = row.tr.insertCell();
  cell.className = "ct-color-settings";
  cell.row = row;
  cell.style.background = db.getColor(row.name);
  cell.onclick = menu.open;
  return cell;
}

/* Case à cocher du tableau des membres de la page de configuration */
function newSettingCheckBox(row, title, onClickFunction) {
  let td = row.tr.insertCell();
  td.className = "ct-checkbox-cell";
  let checkbox = document.createElement("input");
  checkbox.row = row;
  checkbox.type = "checkbox";
  checkbox.onclick = onClickFunction;
  checkbox.title = title;
  td.appendChild(checkbox);
  return checkbox;
}

/*** Création des objets et définition de leurs fonctions associées ***/

/* Liste des participants de la page avec leurs interventions */
let participants = {};

function refreshParticipant(name) {
  for (const post of participants[name]) {
    post.refresh();
  }
}

function refreshParticipants() {
  for (const name in participants) {
    refreshParticipant(name);
  }
}

/* Base de données contenant la configuration, les membres et leurs données */
let db = JSON.parse(STORAGE);
clean(db);
db.save = () => {
  let sortedMembers = {};
  for (const key of Object.keys(db.members).sort()) {
    sortedMembers[key] = db.members[key];
  }
  db.members = sortedMembers;
  const newStorage = {
    version: VERSION,
    members: db.members,
    config: db.config,
  };
  GM.setValue("storage", JSON.stringify(newStorage));
};
db.add = name => {
  db.members[name] = ["", "", db.config.displayQuote, db.config.postBackground, db.config.quoteBackground];
}
db.remove = name => {
  delete db.members[name];
  db.save();
}
db.exist = name => db.members[name] != null;
db.getColor = name => (db.exist(name)) ? db.members[name][0] : "";
db.getNote = name => (db.exist(name)) ? db.members[name][1] : "";
db.getParameters =name => (db.exist(name)) ? db.members[name] : ["", "", db.config.displayQuote, db.config.postBackground, db.config.quoteBackground];
db.setColor = (name, color) => {
  if (!db.exist(name)) db.add(name);
  db.members[name][0] = color;
  db.save();
}
db.setNote = (name, note) => {
  if (!db.exist(name)) db.add(name);
  db.members[name][1] = note;
  db.save();
}
db.setParameters = (name, parameters) => {
  if (!db.exist(name)) db.add(name);
  db.members[name] = parameters;
  db.save();
}

/*** Menu contextuel lors du clic sur une pastille ***/
let menu = {
  container: document.createElement("div"),
  page1: document.createElement("div"),
  page2: document.createElement("div")
};
menu.container.id = "ct-menu";
menu.container.appendChild(menu.page1);
menu.container.appendChild(menu.page2);
ROOT.appendChild(menu.container);

menu.close = () => {
  menu.container.style.display = "none";
  if (typeof menu.target != "undefined" && typeof menu.target.post != "undefined") {
    if (!menu.target.post.isQuote) {
      menu.target.post.note.hideInput();
      menu.target.post.note.save();
    }
    refreshParticipant(menu.target.post.author);
  }
}

menu.open = (event) => {
  menu.close();
  menu.goToPage1();
  menu.target = event.target;
  menu.container.style.left = (event.clientX) + "px";
  menu.container.style.top = (window.pageYOffset + event.clientY) + "px";
  menu.container.style.display = "block";
  if (settings.isOpen) {
    menu.name = event.target.row.name;
  } else {
    menu.name = event.target.post.author;
    if (!menu.target.post.isQuote) menu.target.post.note.showInput();
  }
}

menu.goToPage1 = () => {
  menu.page2.style.display = "none";
  menu.page1.style.display = "block";
  closeButton.style.display = (settings.isOpen) ? "block" : "none";
  settingButton.style.display = (settings.isOpen) ? "none" : "block";
}

menu.goToPage2 = () => {
  menu.page2.refresh();
  menu.page1.style.display = "none";
  menu.page2.style.display = "block";
}

menu.page2.refresh = () => {
  const [, , displayQuote, postBackground, quoteBackground] = db.getParameters(menu.target.post.author);
  quote.checked = displayQuote;
  backgroundPost.checked = postBackground;
  backgroundQuote.checked = quoteBackground;
}

/* Éléments de la page 1 du menu contextuel */
let colorPicker = document.createElement("input");
colorPicker.type = "color";

colorPicker.onchange = function() {
  db.setColor(menu.name, this.value);
  if (settings.isOpen) {
    menu.target.row.color.td.style.background = this.value;
  } else {
    refreshParticipant(menu.name);
  }
};

colorPicker.open = () => {
  colorPicker.value = db.getColor(menu.name);
  colorPicker.click();
  menu.close();
}

let closeButton = newImageButton("Fermer", CROSS_ICON, menu.page1, menu.close);
let settingButton = newImageButton("Paramètres d'affichage", EDIT_ICON, menu.page1, menu.goToPage2);
let rainbowBox = newBox("", -1, menu.page1, colorPicker.open);
let transparentBox = newBox("", -1, menu.page1, setColor);
for (const i in db.config.palette) {
  newBox(db.config.palette[i], i, menu.page1, setColor);
}

rainbowBox.className = "ct-box ct-rainbow";
rainbowBox.title = "Choisir une couleur spécifique";
transparentBox.id = "ct-transparent";
transparentBox.title = "Transparent";

function setColor() {
  db.setColor(menu.name, rgbToHex(this.style.backgroundColor));
  if (settings.isOpen) menu.target.row.color.style.background = this.style.backgroundColor;
  menu.close();
}

/* Eléments de la page 2 du menu contextuel */
newImageButton("Revenir au choix de la couleur", UNDO_ICON, menu.page2, menu.goToPage1);
newImageButton("Ouvrir les paramètres du script", COG_ICON, menu.page2, openSettings);
newImageButton("Supprimer ce membre de la base de données", BIN_ICON, menu.page2, deleteParticipant);
newImageButton("Fermer", CROSS_ICON, menu.page2, menu.close);
let quote = newCheckBox("Afficher la pastille dans les citations", "citation", checkQuote);
let backgroundPost = newCheckBox("Colorier le fond des messages", "fond mes.", checkBackgroundPost);
let backgroundQuote = newCheckBox("Colorier le fond des citations", "fond cit.", checkBackgroundQuote);

function deleteParticipant() {
  db.remove(menu.target.post.author);
  menu.close();
}

function checkQuote() {
  checkParameter(this, 2)
}

function checkBackgroundPost() {
  checkParameter(this, 3)
}

function checkBackgroundQuote() {
  checkParameter(this, 4)
}

function checkParameter(checkbox, index) {
  parameters = db.getParameters(menu.target.post.author);
  parameters[index] = (checkbox.checked) ? 1 : 0;
  db.setParameters(menu.target.post.author, parameters);
  refreshParticipant(menu.target.post.author);
}

/* Cache le menu lors d'un clic extérieur */
document.addEventListener("click", (event) => {
  const targetClass = event.target.classList[0];
  if (targetClass != "ct-button" &&
    targetClass != "ct-color-settings" &&
    targetClass != "ct-input" &&
    !event.target.closest("#ct-menu"))
    menu.close();
});

/* Observateur pour gérer les messages ajoutés dynamiquement */
let postObserver = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    for (const message of mutation.addedNodes) {
      colorTag(message);
    }
  }
});

function toggleObserver() {
  if (db.config.observeNewPost) {
    postObserver.observe(ROOT, {
      childList: true
    });
  } else {
    postObserver.disconnect();
  }
}

/* Page de configuration du script */
let settings = document.createElement("div");
settings.id = "ct-settings";
let background = document.createElement("div");
background.id = "ct-background";
background.onclick = hideSettings;
background.addEventListener("transitionend", endTranstion, false);
window.addEventListener("resize", () => {
  background.style.width = "100%"
  members.updateHeight();
});
ROOT.appendChild(background);
ROOT.appendChild(settings);

let title = document.createElement("div");
title.innerHTML = '<h4 class="Ext">Configuration du script [HFR] Color Tag</h4>';
settings.appendChild(title);

/* Tableau des paramètres configuration */
let parameters = document.createElement("table");
parameters.className = "main ct-table";
settings.appendChild(parameters);

newHeaderRow(parameters, "Paramètres d'affichage par défaut", 2);
let cbButton = newParameter(parameters, "Afficher les pastilles");
let cbQuote = newParameter(parameters, "Afficher la pastille à côté du pseudo dans les citations");
let cbBackgroundPost = newParameter(parameters, "Colorier le fond des messages");
let cbBackgroundQuote = newParameter(parameters, "Colorier le fond des citations");
let cbObserveNewPost = newParameter(parameters, "Traiter les messages ajoutés via d'autres scripts");
newHeaderRow(parameters, "Palette de couleur", 2);
newColorRow(parameters, 2);

cbButton.onclick = () => {
  if (db.config.displayButton && !cbButton.checked)
    alert("Pour accéder à cette page de configuration sans les pastilles, utiliser les commandes de script depuis le menu de l'extension.\nSi celui-ci est indisponible (par exemple avec Grease Monkey 4), faire un clic droit dans un topic et sélectionner « Paramètres HFR Color Tag ».");
}

let buttonContainer = document.createElement("div");
newSubmit("Importer", buttonContainer, importData);
newSubmit("Exporter", buttonContainer, exportData);
newSubmit("Valeurs par défaut", buttonContainer, defaultSettings);
newSubmit("Annuler", buttonContainer, hideSettings);
newSubmit("Valider", buttonContainer, applySettings);
settings.appendChild(buttonContainer);

/* Tableau des membres */
let memberContainer = document.createElement("div");
memberContainer.className = "ct-member-container";

let members = document.createElement("table");
members.className = "main ct-table";
members.id = "ct-members";

newHeaderRow(members, "Liste des membres", 7);

members.initialize = () => {
  for (const name in db.members) {
    let row = new Row(members, name);
  }
}
members.refresh = () => {
  for (const row of document.querySelectorAll("#ct-members .profil")) {
    row.parentElement.removeChild(row);
  }
  members.initialize();
}
members.updateHeight = () => {
  memberContainer.style.maxHeight = (document.documentElement.clientHeight - 360) + "px";
};

settings.appendChild(memberContainer);
memberContainer.appendChild(members);
settings.isOpen = false;

let inputFieldSettings = document.createElement("input");
inputFieldSettings.className = "ct-input-settings";
inputFieldSettings.attach = function() {
  if (inputFieldSettings.row) inputFieldSettings.save();
  inputFieldSettings.style.display = "block";
  inputFieldSettings.row = this.row;
  inputFieldSettings.row.note.innerHTML = "";
  inputFieldSettings.value = db.getNote(inputFieldSettings.row.name);
  inputFieldSettings.row.note.appendChild(inputFieldSettings);
  inputFieldSettings.focus();
}
inputFieldSettings.save = () => {
  db.setNote(inputFieldSettings.row.name, inputFieldSettings.value)
  inputFieldSettings.row.note.innerHTML = inputFieldSettings.value;
  inputFieldSettings.style.display = "none";
}
inputFieldSettings.onkeyup = (event) => {
  if (event.keyCode == 13) inputFieldSettings.save()
};

function openSettings() {
  menu.close();
  settings.isOpen = true;
  background.style.display = "block";
  settings.style.display = "block";
  (background.offsetHeight); //repaint nécessaire pour amorcer la transition
  background.style.opacity = "0.8";
  settings.style.opacity = "1";
  refreshSettings();
  members.updateHeight();
}

function hideSettings() {
  settings.isOpen = false;
  background.style.opacity = "0";
  settings.style.opacity = "0";
}

function endTranstion() {
  if (background.style.opacity == "0") {
    background.style.display = "none";
    settings.style.display = "none";
    document.removeEventListener("keypress", escapeKey, false);
  }
  if (background.style.opacity == "0.8") {
    document.addEventListener("keypress", escapeKey, false);
  }
}

function escapeKey(event) {
  if (event.code == "Escape") hideSettings();
}

function importData() {
  let input = document.getElementById("ct-import") || document.createElement("input");
  input.id = "ct-import";
  input.type = "file";
  input.accept = ".json";
  input.style.display = "none";
  input.onchange = function(event) {
    let reader = new FileReader();
    reader.onload = function() {
      try {
        let importedDB = JSON.parse(this.result);
        clean(importedDB);
        checkCoherence(importedDB);
        db.config = importedDB.config;
        db.members = importedDB.members;
        db.save();
        members.refresh();
        refreshParticipants();
      } catch (err) {
        let message = (typeof err == "string") ? err : "le fichier n'est pas valide.";
        alert("Échec de l'import : " + message);
      }
    };
    reader.readAsText(event.target.files[0]);
  };
  ROOT.appendChild(input);
  input.click();
}

function clean(importedDB) {
  for (const key in DEFAULTSTORAGE) {
    if (typeof importedDB[key] == "undefined") importedDB[key] = DEFAULTSTORAGE[key];
  }
  for (const key in DEFAULTSTORAGE.config) {
    if (typeof importedDB.config[key] == "undefined") importedDB.config[key] = DEFAULTSTORAGE.config[key];
  }
}

function checkCoherence(importedDB) {
  try {
    let isOK = importedDB.config.displayButton < 2 &&
      importedDB.config.displayQuote < 2 &&
      importedDB.config.postBackground < 2 &&
      importedDB.config.observeNewPost < 2 &&
      importedDB.config.palette.length == 13;
    for (const color of importedDB.config.palette) {
      isOK &= /#[\da-f]{6}/i.test(color);
    }
    if (!isOK) throw "configuration non valide.";
    isOK &= typeof importedDB.members != "undefined";
    for (const name in importedDB.members) {
      isOK &= (name == name.toLowerCase()) &&
        (importedDB.members[name][0] == "" || /#[\da-f]{6}/i.test(importedDB.members[name][0])) &&
        importedDB.members[name][2] < 2 &&
        importedDB.members[name][3] < 2 &&
        importedDB.members[name][4] < 2;
    }
    if (!isOK) throw "liste des membres non valide.";
  } catch (err) {
    throw err;
  }
}

function exportData() {
  let d = new Date();
  const today = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  const time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  const exportStorage = {
    version: VERSION,
    date: today + " " + time,
    members: db.members,
    config: db.config,
  };
  const data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportStorage, null, "\t"));
  let a = document.getElementById("ct-download") || document.createElement("a");
  a.id = "ct-download";
  a.href = "data:" + data;
  a.download = today + "_hfrcolortag.json";
  ROOT.appendChild(a);
  a.click();
}

function defaultSettings() {
  cbButton.checked = DEFAULTSTORAGE.config.displayButton;
  cbQuote.checked = DEFAULTSTORAGE.config.displayQuote;
  cbBackgroundPost.checked = DEFAULTSTORAGE.config.postBackground;
  cbBackgroundQuote.checked = DEFAULTSTORAGE.config.quoteBackground;
  cbObserveNewPost.checked = DEFAULTSTORAGE.config.observeNewPost;
  for (const box of document.getElementsByClassName("ct-palette")) {
    box.style.backgroundColor = DEFAULTSTORAGE.config.palette[box.index];
  }
}

function refreshSettings() {
  cbButton.checked = db.config.displayButton;
  cbQuote.checked = db.config.displayQuote;
  cbBackgroundPost.checked = db.config.postBackground;
  cbBackgroundQuote.checked = db.config.quoteBackground;
  cbObserveNewPost.checked = db.config.observeNewPost;
  for (const box of document.getElementsByClassName("ct-palette")) {
    box.style.backgroundColor = db.config.palette[box.index];
  }
  members.refresh();
}

function applySettings() {
  db.config.displayButton = cbButton.checked;
  db.config.displayQuote = cbQuote.checked;
  db.config.postBackground = cbBackgroundPost.checked;
  db.config.quoteBackground = cbBackgroundQuote.checked;
  db.config.observeNewPost = cbObserveNewPost.checked;
  for (const box of document.getElementsByClassName("ct-palette")) {
    db.config.palette[box.index] = rgbToHex(box.style.backgroundColor);
  }
  for (const box of document.querySelectorAll("#ct-menu .ct-box")) {
    box.style.backgroundColor = db.config.palette[box.index];
  }
  db.save();
  refreshParticipants();
  toggleObserver();
  hideSettings();
}

function checkQuoteSettings() {
  checkParameterSettings(this, 2)
}

function checkBackgroundPostSettings() {
  checkParameterSettings(this, 3)
}

function checkBackgroundQuoteSettings() {
  checkParameterSettings(this, 4)
}

function checkParameterSettings(checkbox, index) {
  parameters = db.getParameters(checkbox.row.name);
  parameters[index] = (checkbox.checked) ? 1 : 0;
  db.setParameters(checkbox.row.name, parameters);
  checkbox.row.refresh();
  refreshParticipant(checkbox.row.name);
}

function deleteName() {
  db.remove(this.row.name);
  refreshParticipant(this.row.name);
  this.row.tr.parentElement.removeChild(this.row.tr);
}

/*** Fonctions diverses ***/

/* Convertir le format rgb(r,g,b) en hexadécimal */
function rgbToHex(string) {
  if (string == "" || /#[\da-f]{6}/i.test(string)) return string;
  let [r, g, b] = string.match(/[\d]+/g).map(x => (parseInt(x)));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/* Scanner un noeud DOM et lui rajouter les pastilles */
function colorTag(node) {
  for (const element of node.querySelectorAll(".messagetable b.s2, table.citation b.s1 a, table.oldcitation b.s1 a")) {
    let post = new Post(element);
    if (!post.noAuthor) post.refresh();
  }
}

/*** Initialisation ***/
GM.addStyle(STYLE);
colorTag(ROOT);
toggleObserver();
GM.registerMenuCommand("Paramètres HFR Color Tag", openSettings, "p");

})(); // Fin de l'exécution asynchrone
