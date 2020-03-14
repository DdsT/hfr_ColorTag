// ==UserScript==
// @name        [HFR] Color Tag
// @namespace   ddst.github.io
// @version     2.3.3
// @author      DdsT
// @downloadURL https://ddst.github.io/hfr_ColorTag/hfrcolortag.user.js
// @updateURL   https://ddst.github.io/hfr_ColorTag/hfrcolortag.meta.js
// @supportURL  https://ddst.github.io/hfr_ColorTag/
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
Copyright (C) 2020 DdsT

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

/* v2.3.3
 * ------
 * Correction d'un bug lors d'un clic sur le panneau de configuration
 */

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
.ct-checkbox:enabled:hover {
  border : 1px solid #000;
}
.ct-checkbox:checked:after {
  content     : '✔';
  font-size   : 16px;
  line-height : 12px;
}
.ct-checkbox:disabled {
  opacity : 0.35;
}
#ct-menu label {
  font-size     :  9px;
  height        : 14px;
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
  z-index          : 1002;
  display          : none;
  opacity          : 0;
  transition       : opacity 0.7s ease 0s;
}

#ct-settings-container {
    position       : fixed;
    left           : 0;
    right          : 0;
    top            : 0;
    bottom         : 0;
    z-index        : 1001;
    display        : none;
}

#ct-settings {
  box-shadow : 0 4px  8px 0 rgba(0, 0, 0, 0.2),
              0 6px 20px 0 rgba(0, 0, 0, 0.19);
  position   : static;
  background : white;
  display    : block;
  opacity    : 0;
  margin     : auto auto;
  transition : opacity 0.7s ease 0s;
  padding    : 0 16px 16px 16px;
  z-index    : 1003;
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

.ct-show {
  display : block;
}

.ct-hide {
  display : none;
}
`;

const VERSION = GM.info.script.version;

const EDIT_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKZSURBVDjLpZM7TFNhFMd/t/f2IqVQqAWM72IVMUEjIRoiYnTxEWEyTjqoiYNuxkSjk5uJg4ODDjoYE6ODm4sOJlopqNRY5VXC09oCRaCg3t572++7DspTnTzJyTnfyTn/739O8lccx+F/TBsdHb0MHAOQUuI4DlLKJS6E+CP+9gdKKpXKBwIBFWAxm7n8b3Euj8ViQnMcR3W73dyMCmzjG9PxVzi5H7jKa6gI1nLE208oFOLy8wyGaWNkbQwzx+PTIYQQqrb417reW+RT7xhJJBieMHCufgQgl8txbV8hUhbMrwUghECbewDkKnfStH0NB3SN1o5OYqo63xgOhymWXQQyHajeWka+vsRdth9NCPFrOC95m16Npk3jLSkhau9masoE7y+A+tA0+cQEhetO4AvuJDNUTc+LhwsMMok+yoNVPNHqmPpss8Kvs+pHEgAr/QzViuPfvIepgR50xaa4ZBXe0soFBmuKZumaLEX6Symr1DFnTYrlBGq2G83di6/qINboI3SPwsiHXqSjk/Q1LgCcP9wwfwvDMLAsC2syQYHZiW9TC2byDi49j9u7gSLnC4FDNxho78Y1B5BIJIhGowwPD+PxeLDGwpBpxRdqwUzexuXOYc9uZOzle2aqTlFYvgkpJUosFusWQtQIIaivr1cikYhjj7dR4Rlna1Mz9vh9FNXGnFlLOvweacwE+7ZcGfp9ux5luRbunVt/pqH55N28UsFKfytlFTrmzDomX79JSyvbUH2hbXCJFpaLo2TjlrvbGs8Sf3SRvnCEgvU7yKfjqTJdPVh7qX1web9reSHeP5a3u54S3LGXoqJqkh2fvptZ+0jtpfbOv6nxjxWON/mzdVWV2q6aII7bimTTE6eOXv84+C85/wR0RnLQ/rM7uwAAAABJRU5ErkJggg==";
const COG_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAABkklEQVQoz1VRTUsCYRBe/AHe/Qn+j710EbKLVJcyiAqLLkWJkdkSUdChOpQRRWVRG6RQUqirtq7pupZRUvRxyOIlIU9ed5+mbSFjDjPvzDPPM+8MB+7PVG9ekiXJ25qzXMVZtqu2fP0D7xDrZ7aY/djZAqiEy3qRKY4se8ULYizqENm+vhO2ADf+Z3zhCdlmyqjiDieG2FTBEMeC3wQUA7LxTIVHAlVNfwsVV5gwRgOWRE64QwkFXGAD28hCQYb65wVT4kqTa+nGAzQkMKOM81P8knJJIA2LjblaSONk/ZOICyhjD7P8T886L0ImNoUGHtI5SX8jTYU6olg2Aav8ATHEkaZ8j87taEu1rcY1QUrYVNb4FZLIkNw5+hqeWodmDikKORorhzwOsU9RCqcUDQjWHo4CEeOeyioqNEuemHJI0mvY6P/95q4/gVdEEGoKhkzqPmO4GSH9abj91h6C4RG9j405Qkwlhl7W6fAwl94WbjnWiHPQPmkL1pOIoaveaeu2u5z/rvlrPq9Hapfc/879DQmIXQjyme6GAAAAAElFTkSuQmCC";
const UNDO_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIJSURBVDjLpVM9aJNRFD35GsRSoUKKzQ/B0NJJF3EQlKrVgijSCBmC4NBFKihIcXBwEZdSHVoUwUInFUEkQ1DQ4CKiFsQsTrb5xNpgaZHw2Uog5t5zn0NJNFaw0guX97hwzuPcc17IOYfNlIdNVrhxufR6xJkZjAbSQGXjNAorqixSWFDV3KPhJ+UGLtSQMPryrDscPwLnAHOEOQc6gkbUpIagGmApWIb/pZRX4fjj889nWiSQtgYyBZ1BTUEj6AjPa0P71nb0Jfqwa+futIheHrzRn2yRQCUK/lOQhApBJVQJChHfnkCqOwWEQ+iORJHckUyX5ksvAEyGNuJC+s6xCRXNHNxzKMmQ4luwgjfvZp69uvr2+IZcyJ8rjIporrxURggetnV0QET3rrPxzMNM2+n7p678jUTrCiWhphAjVHR9DlR0WkSzf4IHxg5MSF0zXZEuVKWKSlCBCostS8zeG7oV64wPqxInbw86lbVXKEQ8mkAqmUJ4SxieeVhcnANFC02C7N2h69HO2IXeWC8MDj2JnqaFNAMd8f3HKjx6+LxQRmnOz1OZaxKIaF1VISYwB9ARZoQaYY6o1WpYCVYxt+zDn/XzVBv/MOWXW5J44ubRyVgkelFpmF/4BJVfOVDlVyqLVBZI5manPjajDOdcswfG9k/3X9v3/vfZv7rFBanriIo++J/f+BMT+YWS6hXl7QAAAABJRU5ErkJggg==";
const DEL_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKRSURBVDjLpZNrSNNRGIeVuaSLrW2NCozlSsrCvqifKrG1vyznRDLQMi9TsamsUCzvSWJKC0Ms0/I2hratmVbi3bLIysRZlgh9qFGuCKOF5KaonV9n+yAGokIHHs7hhd/zvofDcQHg8j8sW0wN2FpQJuVNl8u2QC3loEDMtUX7CYrXJDjrx8u6FcYlNVE83KbciOCiNISD9MDNRHaQf3lVQZWMgwYaVNNQqcwBF1dCBbhwlIczfpypVQWlgZvQVZUPS6cag7XpOBckQIZkB9IYEZIPcee02XL3FQU1scKfM98/YOpFFb72XseooRDm9quwmk3QKXdPvdOkrltRUBG9f8A6dBeTw0bY3+ooeufZatLhToLv8IpX2CZrYnsfTtXqVP6YHa7FzFirE/ubJrRk+sM3UHlfwNSsX1YgCNG586WNKZ7SPox9mYYhLwz6PLkTx/n5+G94Bj8BT1x3ni+u3vCPgH/c4OoRbIgXhg5g3GJHowXIGANSXgOJT4G4DkBTXolnMT7oFbPxgNlo7WDYuYuCAxH14ZKTahgHF1A9CqheESj7CZK6CWIfElwrqsRI5hHMtJeBjHfBps/AUJrvn55jbiqnYCR/38JkWzZu1rchvpN2pR0VjwhimglONREYw/fATsOokANZXKDECz/UQeiWsD45BaMFPsTaU4So5AYU99oQ3Qyc1hNEagkiagn66NjE1IKl61fhdlp3I07Be60qx5TjPa9QlMwHxPdDQUdPWELrCSGm6xIBGpq96AIr5bOShW6GZVl8BbM+xeNSbjF/V3hbtTBIMyFi7tlEwc1zIolxLjM0bv5l4l58y/LCZA4bH5Nc8VjuttDFsHLX/G0HIndm045mx9h0n3CEHfW/dpehdpL0UXsAAAAASUVORK5CYII=";
const CROSS_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65WhbmrnZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2+FAAAAABJRU5ErkJggg==";
const PENADD_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABIFBMVEX////kui/epDWYYyBJeC43axk3axk3axm6izvCgjHSnS/bqk83axlZhEBulFg3axk5bBtdh0TLk1PJkE/Kk1A3axlMezFTjChXjy1YQBNZQhJeQhVmjk+Bq2GHuWCHumCLumKMvGWNumSPu2qPvGeTbR6caSWgj0alkUqqYBax05Cx1pKy0pW0diy01JW1fTS21Jy5iSa/kCfBi0jCZxXDmTHHgzTIkE7IqWfJkU/KlULPnErQnVnQ5rrUnF3YpWrZjzvZqFDcxG3dq3Pdrmzhy7Dkui/mtF3omEDsqmHsz6ny4cjy5r7zz2/0z6X01Kf01kT1z6b12Wj13GD327334cn44cX44qj448v47cP548v548z659H67o789LP///9mEfVoAAAAFXRSTlMACRkgfISIjK2u3+ry8vL39/f3/f3+EWHRAAAAnUlEQVR4AWPAAxi5Rcy5mJAEHO1DI6w4EXw3/7Do6BBhBD8y3MXPL0QIwY8L8rVxtkTiBwfEujvg4huh8Q19wHwNPhleFiCX2dDVAsRXl9WzVZZgZ2BQ9Y7RN3WyNhPU0o5XVOEHCkR5epho6jKIGcTHx+uIMjBI2QV6GesyMAgoyMfLgVRISqvpcgDNYhVX0lESZ0fyHBuPKA8bAwARQR9Q8uhEpAAAAABJRU5ErkJggg==";
const PENDEL_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABL1BMVEX////kui/epDWYYyC6QwS5RQPEVx24RQPDVxq6izvCgjG5RAO5RAO5RQPSnS/ATQ65RQO5RQO5RQPbqk/Lk1PRczjJZCW9TQTLay3JkE/Kk1C8QgRYQBNZQhJeQhWTbR6caSWqYBa0diy1fTS5iSa/kCfBi0jCZxXDmTHHgzTIkE7IqWfJkU/KlULPdS3PnErQnVnUnF3YpWrZjzvZqFDcxG3dZAHdq3PdrmzhaAPhy7Dkui/mdyHmtF3omEDqeQXrikDsqmHsz6nudgDvfxjy4cjy5r7zz2/0nWP0z6X01Kf01kT1qHL1z6b12Wj13GD2tY33tY3327334cn4dgD44cX44qj448v47cP548v548z659H67o789LP+za7+1rj/dxH/fxj/hiH/kk3////jTOc1AAAAHHRSTlMACRkgbXh4eoCtrt3e39/h4uPk6vf5+/z8/f3+3whj2wAAAJ5JREFUeAFjwAMYhaW0+JiQBEyMgsN1uRB8a6/QqKggSQQ/IszC0zNIBMGP9XM3MNdB4vt7x9ga4+KrovFV3MB8PX5pAVYgl1nFShvMFw2M95FgYWCQd41W1jDV1+QOSE5IcuABCkQ62qkrKjFIx6WkpLhIMzDIGvo6qSkxMAh6JIY4WwoxMMjIKShxAs3iELOxNxNnR/IcG6+0IDsDAIv5H4jtkhCxAAAAAElFTkSuQmCC";

/* Icons by Mark James - http://www.famfamfam.com/lab/icons/silk/ - CC BY 2.5 - https://creativecommons.org/licenses/by/2.5/ */

const ROOT = document.getElementById("mesdiscussions");
const RESPONSE_URL = document.querySelector(".message a[href^='/message.php']");
const TOPIC = RESPONSE_URL ? RESPONSE_URL.href.replace(/.*cat=(\d+).*post=(\d+).*/g,"$1&$2") : "";
        
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

let db;                // Base de données contenant la configuration, les membres et leurs données
let participants = {}; // Liste des participants de la page avec leurs interventions
let menu;              // Menu contextuel lors du clic sur une pastille
let settings;          // Page de configuration du script

/* Créer la base de données */
function createDB(json) {
  db = JSON.parse(json);
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
    db.members[name] = ["", "", db.config.displayQuote, db.config.postBackground, db.config.quoteBackground, {}];
  }
  db.remove = name => {
    delete db.members[name];
    db.save();
  }
  db.exist = name => db.members[name] != null;
  db.getColor = name => (db.exist(name)) ? db.members[name][0] : "";
  db.getNote = name => (db.exist(name)) ? db.members[name][1] : "";
  db.getParameters =name => {
    if (db.exist(name)) {
      return (db.members[name][5][TOPIC] && !settings.isOpen) ? db.members[name][5][TOPIC] : db.members[name];
    }
    return ["", "", db.config.displayQuote, db.config.postBackground, db.config.quoteBackground, {}];
  }
  db.setParameter = (name, parameter, value) => {
    if (!db.exist(name)) db.add(name);
    if (db.members[name][5][TOPIC] && !settings.isOpen) {
      db.members[name][5][TOPIC][parameter] = value;
    } else {
      db.members[name][parameter] = value;
    }
    db.save();
  }
  
  /* Mise à jour de la base de données lors d'une mise à jour du script */
  repair(db);
  if (db.repaired) db.save();
}

/* un Post décrit une intervention d'un participant de la page (dans une citation ou bien dans un message complet) */
class Post {
  constructor(element) {
    this.element = element;
    this.isQuote = !element.classList.contains("s2");
    if (this.isQuote) {
      this.author = element.textContent.replace(/ a écrit :/g,"");
      this.background = element.closest(".citation, .oldcitation");
    } else {
      this.author = element.textContent;
      this.background = element.closest(".message");
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
  get customTopic() {
    return db.exist(this.author) && db.members[this.author][5][TOPIC];
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
    this.element = document.createElement("span");
    this.element.className = "ct-note";
    this.input = document.createElement("input");
    this.input.className = "ct-input ct-hide";
    this.input.onkeyup = function(event) {
      if (event.keyCode == 13) menu.close();
    };
    let container = document.createElement("div");
    container.className = "ct-note-container";
    container.appendChild(this.input);
    container.appendChild(this.element);
    post.element.parentNode.appendChild(container);
  }
  save() {
    if (this.element.innerHTML != this.input.value) {
      this.element.innerHTML = this.input.value;
      db.setParameter(this.post.author, 1, this.input.value);
    }
  }
  showInput() {
    this.element.classList.add("ct-hide");
    this.input.classList.remove("ct-hide");
  }
  hideInput() {
    this.element.classList.remove("ct-hide");
    this.input.classList.add("ct-hide");
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
    this.delete = newImageButton("Supprimer ce membre", DEL_ICON, this.tdDelete, deleteName);
    this.tr.className = "profil";
    this.tdName.className = "profilCase2";
    this.tdDelete.className = "ct-checkbox-cell";
    this.delete.row = this;
    this.note.row = this;
    this.note.onclick = settings.inputFieldSettings.attach;
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
  cell.style.background = db.getParameters(row.name)[0];
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


function refreshParticipant(name) {
  if (participants[name]) {
    for (const post of participants[name]) {
      post.refresh();
    }
  }
}

function refreshParticipants() {
  for (const name in participants) {
    refreshParticipant(name);
  }
}

function createMenu() {
  menu = {
    container: document.createElement("div"),
    page1: document.createElement("div"),
    page2: document.createElement("div"),
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
      refreshParticipant(menu.name);
    }
  }
  
  menu.open = (event) => {
    menu.close();
    menu.target = event.target;
    menu.container.style.left = (event.clientX) + "px";
    menu.container.style.top = (window.pageYOffset + event.clientY) + "px";
    menu.container.style.display = "block";
    menu.container.style.backgroundColor = "#fff";
    if (settings.isOpen) {
      menu.name = event.target.row.name;
    } else {
      menu.name = event.target.post.author;
      if (menu.target.post.customTopic) menu.container.style.backgroundColor = "#ddd";
      if (!menu.target.post.isQuote) menu.target.post.note.showInput();
    }
    menu.goToPage1();
  }
  
  menu.goToPage1 = () => {
    menu.page2.style.display = "none";
    menu.page1.style.display = "block";
    menu.container.style.width = "72px";
    if (settings.isOpen) {
      closeButton.style.display =  "block";
      settingButton.style.display = "none";
    } else {
      closeButton.style.display = "none";
      settingButton.style.display =  "block";
    }
  }
  
  menu.goToPage2 = () => {
    menu.page2.refresh();
    menu.container.style.width = "90px";
    menu.page1.style.display = "none";
    menu.page2.style.display = "block";
  }
  
  menu.page2.refresh = () => {
    const [, , displayQuote, postBackground, quoteBackground] = db.getParameters(menu.name);
    quote.checked = displayQuote;
    backgroundPost.checked = postBackground;
    backgroundQuote.checked = quoteBackground;
    if (menu.target.post.customTopic) {
      menu.container.style.backgroundColor = "#ddd";
      customTopicImage.onclick = deleteCustomTopic;
      customTopicImage.src = PENDEL_ICON;
      customTopicImage.title = "Supprimer la personnalisation spéficique pour ce sujet";
    } else {
      menu.container.style.backgroundColor = "#fff";
      customTopicImage.onclick = addCustomTopic;
      customTopicImage.src = PENADD_ICON;
      customTopicImage.title = "Utiliser une personnalisation spéficique pour ce sujet";
    }
    if (db.exist(menu.name)) {
      deleteImage.onclick = deleteParticipant;
      deleteImage.style.opacity = 1;
    } else {
      deleteImage.onclick = null;
      deleteImage.style.opacity = 0.35;
    }
  }
  
  /* Éléments de la page 1 du menu contextuel */
  let colorPicker = document.createElement("input");
  colorPicker.type = "color";
  
  colorPicker.onchange = function() {
    db.setParameter(menu.name, 0, this.value);
    if (settings.isOpen) {
      menu.target.row.color.td.style.background = this.value;
    } else {
      refreshParticipant(menu.name);
    }
  };
  
  colorPicker.open = () => {
    colorPicker.value = db.getParameters(menu.name)[0];
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
  
  /* Eléments de la page 2 du menu contextuel */
  newImageButton("Revenir au choix de la couleur", UNDO_ICON, menu.page2, menu.goToPage1);
  newImageButton("Ouvrir les paramètres du script", COG_ICON, menu.page2, openSettings);
  let customTopicImage = newImageButton("", "", menu.page2, null);
  let deleteImage = newImageButton("Supprimer ce membre de la base de données", DEL_ICON, menu.page2, null);
  newImageButton("Fermer", CROSS_ICON, menu.page2, menu.close);
  let quote = newCheckBox("Afficher la pastille dans les citations", "citation", checkQuote);
  let backgroundPost = newCheckBox("Colorier le fond des messages", "fond message", checkBackgroundPost);
  let backgroundQuote = newCheckBox("Colorier le fond des citations", "fond citation", checkBackgroundQuote);
  
  /* Cache le menu lors d'un clic extérieur */
  document.addEventListener("click", (event) => {
  const targetClass = event.target.classList[0];
  if (targetClass != "ct-button" &&
    targetClass != "ct-color-settings" &&
    targetClass != "ct-input" &&
    !event.target.closest("#ct-menu"))
    menu.close();
  });
}

function setColor() {
  db.setParameter(menu.name, 0, rgbToHex(this.style.backgroundColor));
  if (settings.isOpen) menu.target.row.color.style.background = this.style.backgroundColor;
  menu.close();
}

function addCustomTopic() {
  if (!db.exist(menu.name)) db.add(menu.name);
  let parameters = db.getParameters(menu.name)
  db.members[menu.name][5][TOPIC] = parameters.slice(0,5);
  db.save();
  menu.page2.refresh();
  refreshParticipant(menu.name);
}

function deleteCustomTopic() {
  delete db.members[menu.name][5][TOPIC];
  db.save();
  menu.page2.refresh();
  refreshParticipant(menu.name);
}

function deleteParticipant() {
  db.remove(menu.name);
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

function checkParameter(checkbox, parameter) {
  db.setParameter(menu.name, parameter, (checkbox.checked) ? 1 : 0);
  refreshParticipant(menu.name);
  menu.page2.refresh();
}

/* Page de configuration du script */
function createSettings() {
  settings = document.createElement("div");
  settings.id = "ct-settings";
  settings.background = document.createElement("div");
  settings.background.id = "ct-background";
  settings.background.addEventListener("transitionend", endTranstion, false);
  window.addEventListener("resize", () => {
    settings.background.style.width = "100%"
    settings.members.updateHeight();
  });
  
  settings.container = document.createElement("div");
  settings.container.id = "ct-settings-container";
  settings.background.onclick = hideSettings;
  
  ROOT.appendChild(settings.container).appendChild(settings);
  settings.container.appendChild(settings.background);
  
  let title = document.createElement("div");
  title.innerHTML = '<h4 class="Ext">Configuration du script [HFR] Color Tag</h4>';
  settings.appendChild(title);
  
  /* Tableau des paramètres configuration */
  let parameters = document.createElement("table");
  parameters.className = "main ct-table";
  settings.appendChild(parameters);
  
  newHeaderRow(parameters, "Paramètres d'affichage par défaut", 2);
  settings.cbButton = newParameter(parameters, "Afficher les pastilles");
  settings.cbQuote = newParameter(parameters, "Afficher la pastille à côté du pseudo dans les citations");
  settings.cbBackgroundPost = newParameter(parameters, "Colorier le fond des messages");
  settings.cbBackgroundQuote = newParameter(parameters, "Colorier le fond des citations");
  settings.cbObserveNewPost = newParameter(parameters, "Traiter les messages ajoutés via d'autres scripts");
  newHeaderRow(parameters, "Palette de couleur", 2);
  newColorRow(parameters, 2);
  
  settings.cbButton.onclick = () => {
    if (db.config.displayButton && !settings.cbButton.checked)
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
  
  settings.members = document.createElement("table");
  settings.members.className = "main ct-table";
  settings.members.id = "ct-members";
  
  newHeaderRow(settings.members, "Liste des membres", 7);
  
  settings.members.initialize = () => {
    for (const name in db.members) {
      let row = new Row(settings.members, name);
    }
  }
  settings.members.refresh = () => {
    for (const row of document.querySelectorAll("#ct-members .profil")) {
      row.parentElement.removeChild(row);
    }
    settings.members.initialize();
  }
  settings.members.updateHeight = () => {
    memberContainer.style.maxHeight = (document.documentElement.clientHeight - 360) + "px";
  };
  
  settings.appendChild(memberContainer);
  memberContainer.appendChild(settings.members);
  settings.isOpen = false;
  
  settings.inputFieldSettings = document.createElement("input");
  settings.inputFieldSettings.className = "ct-input-settings";
  settings.inputFieldSettings.attach = function() {
    if (settings.inputFieldSettings.row) settings.inputFieldSettings.save();
    settings.inputFieldSettings.style.display = "block";
    settings.inputFieldSettings.row = this.row;
    settings.inputFieldSettings.row.note.innerHTML = "";
    settings.inputFieldSettings.value = db.getParameters(settings.inputFieldSettings.row.name)[1];
    settings.inputFieldSettings.row.note.appendChild(settings.inputFieldSettings);
    settings.inputFieldSettings.focus();
  }
  settings.inputFieldSettings.save = () => {
    db.setParameter(settings.inputFieldSettings.row.name, 1, settings.inputFieldSettings.value)
    settings.inputFieldSettings.row.note.innerHTML = settings.inputFieldSettings.value;
    settings.inputFieldSettings.style.display = "none";
  }
  settings.inputFieldSettings.onkeyup = (event) => {
    if (event.keyCode == 13) settings.inputFieldSettings.save()
  };
}

function openSettings() {
  menu.close();
  settings.isOpen = true;
  settings.container.style.display = "flex";
  settings.background.style.display = "block";
  (settings.background.offsetHeight); //repaint nécessaire pour amorcer la transition
  settings.background.style.opacity = "0.8";
  settings.style.opacity = "1";
  refreshSettings();
  settings.members.updateHeight();
}

function hideSettings() {
  settings.isOpen = false;
  settings.background.style.opacity = "0";
  settings.style.opacity = "0";
}

function endTranstion() {
  if (settings.background.style.opacity == "0") {
    settings.background.style.display = "none";
    settings.container.style.display = "none";
    document.removeEventListener("keypress", escapeKey, false);
  }
  if (settings.background.style.opacity == "0.8") {
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
        repair(importedDB);
        checkCoherence(importedDB);
        db.config = importedDB.config;
        db.members = importedDB.members;
        db.save();
        settings.members.refresh();
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

/* Vérifier si tous les paramètres sont présents, les créer dans le cas contraire */
function repair(importedDB) {
  let hasNoVersion = !importedDB.version;
  importedDB.repaired = false;
  for (const key in DEFAULTSTORAGE) {
    if (typeof importedDB[key] == "undefined") {
      importedDB[key] = DEFAULTSTORAGE[key];
      importedDB.repaired = true;
    }
  }
  for (const key in DEFAULTSTORAGE.config) {
    if (typeof importedDB.config[key] == "undefined"){
      importedDB.config[key] = DEFAULTSTORAGE.config[key];
      importedDB.repaired = true;
    }
  }
  if (hasNoVersion || importedDB.version < "2.1.1") {
    for (const name in importedDB.members) {
      if (importedDB.members[name].length < 6) importedDB.members[name] = [...importedDB.members[name],{}];
      importedDB.repaired = true;
    }
  } else if (importedDB.version < "2.3.0") {
    for (const name in importedDB.members) {
      importedDB.members[name].push({});
      for (const topic of importedDB.members[name][6]) {
        let newtopic = topic.replace(/(\d+)&\d+(&\d+)/g,"$1$2");
        if (importedDB.members[name][5]) {
          importedDB.members[name][7][newtopic] = importedDB.members[name].slice(0,4);
        } else {
          importedDB.members[name][7][newtopic] = ["", "", db.config.displayQuote, db.config.postBackground, db.config.quoteBackground];
        }
      }
      if (importedDB.members[name][5]) {
        importedDB.members[name] = ["", "", db.config.displayQuote, db.config.postBackground, db.config.quoteBackground, importedDB.members[name][7]];
      } else {
        importedDB.members[name].splice(5,2);
      }
      importedDB.repaired = true;
    }  
  } else if (importedDB.version < "2.3.1") {
    for (const name in importedDB.members) {
      for (const topic in importedDB.members[name][5]) {
        let newtopic = topic.replace(/(\d+)&\d+(&\d+)/g,"$1$2");
        importedDB.members[name][5][newtopic] = importedDB.members[name][5][topic];
        delete importedDB.members[name][5][topic];
      }
    }  
    importedDB.repaired = true;
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
        importedDB.members[name].length == 6;
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
  settings.cbButton.checked = DEFAULTSTORAGE.config.displayButton;
  settings.cbQuote.checked = DEFAULTSTORAGE.config.displayQuote;
  settings.cbBackgroundPost.checked = DEFAULTSTORAGE.config.postBackground;
  settings.cbBackgroundQuote.checked = DEFAULTSTORAGE.config.quoteBackground;
  settings.cbObserveNewPost.checked = DEFAULTSTORAGE.config.observeNewPost;
  for (const box of document.getElementsByClassName("ct-palette")) {
    box.style.backgroundColor = DEFAULTSTORAGE.config.palette[box.index];
  }
}

function refreshSettings() {
  settings.cbButton.checked = db.config.displayButton;
  settings.cbQuote.checked = db.config.displayQuote;
  settings.cbBackgroundPost.checked = db.config.postBackground;
  settings.cbBackgroundQuote.checked = db.config.quoteBackground;
  settings.cbObserveNewPost.checked = db.config.observeNewPost;
  for (const box of document.getElementsByClassName("ct-palette")) {
    box.style.backgroundColor = db.config.palette[box.index];
  }
  settings.members.refresh();
}

function applySettings() {
  db.config.displayButton = settings.cbButton.checked;
  db.config.displayQuote = settings.cbQuote.checked;
  db.config.postBackground = settings.cbBackgroundPost.checked;
  db.config.quoteBackground = settings.cbBackgroundQuote.checked;
  db.config.observeNewPost = settings.cbObserveNewPost.checked;
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

function checkParameterSettings(checkbox, parameter) {
  db.setParameter(checkbox.row.name, parameter, (checkbox.checked) ? 1 : 0);
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
  for (const element of node.querySelectorAll(".messagetable b.s2:not(.hfr-chat-dummy), table.citation b.s1 a, table.oldcitation b.s1 a")) {
    let post = new Post(element);
    if (!post.noAuthor) post.refresh();
  }
}


/* Observateur pour gérer les messages ajoutés dynamiquement */
let postObserver;

function createObserver() {
  postObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const message of mutation.addedNodes) {
        colorTag(message);
      }
    };
  });
  toggleObserver();
}

function toggleObserver() {
  if (db.config.observeNewPost) {
    postObserver.observe(ROOT, {
      childList: true
    });
  } else {
    postObserver.disconnect();
  }
}

async function initialize() {
  createDB(DEFAULTSTRING);
  createMenu();
  createSettings();
  GM.addStyle(STYLE);
  colorTag(ROOT);
  GM.registerMenuCommand("Paramètres HFR Color Tag", openSettings, "p");
  const STORAGE = await GM.getValue("storage", DEFAULTSTRING);
  createDB(STORAGE);
  refreshParticipants();
  settings.members.refresh();
  createObserver();
}

/*** Initialisation ***/
initialize();
