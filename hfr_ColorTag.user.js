// ==UserScript==
// @name          [HFR] ColorTag
// @version       1.0.0
// @namespace     https://github.com/DdsT/hfr_ColorTag/raw/master/hfr_ColorTag.user.js
// @description   Ajoute une étiquette de couleur aux pseudos
// @icon          http://reho.st/self/8be6cfd410001113ffc0e909a807205fdb5b6751.png
// @include		  http://forum.hardware.fr/forum2.php*
// @include       http://forum.hardware.fr/hfr/*
// @grant         GM_getValue
// @grant         GM_setValue
// ==/UserScript==

var root = document.getElementById("mesdiscussions");
var download_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAK2SURBVBgZBcFNiJRlAADg532/b2Z2Z9fdUdfWUlwNooJIFNryEEUSBAVCVy9eIrwJngqCwI4Jdg46VBIdukRQtBAdOliUHQ0qlbXE9afdmXVn5vt7v54ntG0Lznx1axWXHh/MnBhXybhKqpRM6jTENu6jwSYe4DN8nwOkun7+6P75E+df2gcAdsq0OC7T4ua0OVhWbBeNm/cf+vbvnVdxLgdIdb280A3g1lajE4I8kOX0OtGhXpTFqJNx7OCsxxbn9nz8y+2LEaCpqoW5nDqxXQbDiq2C4ZThlAcT7j5swDuX1504MueZpc6+HKCpqj27utFOwc60EWOQI8uIGZkgCySEZuTK9U1X14e3c4CmLJcXZzPDSW1ctGJsZZHYBFkk08oytJmNUeGjtb9GOJMD1GW5srzQMZy2any99qddPcZlbfd81+27EyEy38882u/aHE0Wfvj932EO0JTFyv7FnmsbjRCZjKdeWX3SqePzvrnyj/dOPw0APv3xnpTCzxFeu/DdrKbu9jpR2RC1xkXlv+0arP26AWBaMyq4t1UKIYlQF+W+XiAGErTEGGQtVZNcPHtcSq0mtTJJP0+KojDaKeXQlEU/n+vKI1kMmhTMdKJpUfngy5tioG6S1CQt2ralpd9J8hfPXV7ChdWnDrkzat3caMzNUKdW0dSy2EEraIQQtKnVtkldV8qyljdleRKv/3bths1J7mHRqprW9rjSCbmzb+xSpxKRljYkM3nXh1+sezDakTdVdfzUy8/Ovnv6BQDw5vs/yXQkE59cfdtS/5Aguje+5a3nLolmjItS3lTVjTv3hz5fu2YwP2uwMGMw15PnmcP7WZ7fdvLoqkH3AJGt6QGPzNX6XfIQhGOnLy3hHFawF3uxO/aPHH5iZU9n0BuYyRfUqRJSEtpGCmN/rF93d1T5H4CHTHMseNtCAAAAAElFTkSuQmCC";
var upload_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAK9SURBVBgZBcHLi1VlAADw3/edc+fRmOP4YEzERxQYZGaQaQ8qRDCK+gPcGC1rYbjRWtqiTaAULWrRItwVVAaFBUIvhqjAyixIE41JB8fxzsy9c+855ztfv1/IOYPDH1/bg5N3rxnb169b/bpVt62Vpu1iCTeRsIB5fIizJUDbNI/s2rhq39EnNwCAXtVO9qt2cmGQNlc1S8Pkys1lX1zqHcCREqBtmunVIwFcu510QlAGipLRTrRlNCpi1CnYvXncpsmJte//OPtWBEh1vXqipGlZqoJuze0h3QHdAfMrzC0ncPz0Vfu2T7h/fWdDCZDqeu2dI1FvSG+QxBiUKApiQSEoAi1CWjRzecEvV7uzJUCqqunJ8UJ3pdEfZjFmRSSmoIgUsqJALtxYHDr11d+LOFwCNFW1dXp1R3eQNZApUhAzEoWszFGbSZ2kqZrtn7762K0IkKrh1o2To3pVFiJFCCIiAiBkcqYZDqVqmKCEgye+HC+LODLaiaqURBlZRhJAQIzUKVnu9RssQgnNsNowMTEmBlrIhEAU5EwIXLx0xl+XP7fUXzAV+0V3+cbrHHyjhFQN7ygnRpSRIgapDeSsRQj8+udH5vtfe/rxh21ee69zFz4JM79fP7H3lU1r4hNHTq9vqurEnh1bXF/MrtxIbi0lvYqUsxCyny6c9uCOXVJMdt11QAq1vTsfhZfLVFX78ezPF/+xsFJaHmZ1yoZ1UDWtJrWWuv/phFWeue8lcHT/e8789i4+GytTXT/0wlMPjL92aC8ASJk6ZVXD88e7Lsz+4Pzsd44d+MCbZ180VozCoNi48+A9U5MTz80v1a7O9cwtDiz2a3WTFTEa6QQpDX3zxxnbpre52f9Xtzfn+/PfWrw9PBV2Hzq5HkewFeuwDlOYwuTYSKczNtYRRs5ZSTPaPEDok9+eeWf22P/PLlOL9Py8xgAAAABJRU5ErkJggg==";
var cross_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65WhbmrnZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2+FAAAAABJRU5ErkJggg==";
var accept_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKfSURBVDjLpZPrS1NhHMf9O3bOdmwDCWREIYKEUHsVJBI7mg3FvCxL09290jZj2EyLMnJexkgpLbPUanNOberU5taUMnHZUULMvelCtWF0sW/n7MVMEiN64AsPD8/n83uucQDi/id/DBT4Dolypw/qsz0pTMbj/WHpiDgsdSUyUmeiPt2+V7SrIM+bSss8ySGdR4abQQv6lrui6VxsRonrGCS9VEjSQ9E7CtiqdOZ4UuTqnBHO1X7YXl6Daa4yGq7vWO1D40wVDtj4kWQbn94myPGkCDPdSesczE2sCZShwl8CzcwZ6NiUs6n2nYX99T1cnKqA2EKui6+TwphA5k4yqMayopU5mANV3lNQTBdCMVUA9VQh3GuDMHiVcLCS3J4jSLhCGmKCjBEx0xlshjXYhApfMZRP5CyYD+UkG08+xt+4wLVQZA1tzxthm2tEfD3JxARH7QkbD1ZuozaggdZbxK5kAIsf5qGaKMTY2lAU/rH5HW3PLsEwUYy+YCcERmIjJpDcpzb6l7th9KtQ69fi09ePUej9l7cx2DJbD7UrG3r3afQHOyCo+V3QQzE35pvQvnAZukk5zL5qRL59jsKbPzdheXoBZc4saFhBS6AO7V4zqCpiawuptwQG+UAa7Ct3UT0hh9p9EnXT5Vh6t4C22QaUDh6HwnECOmcO7K+6kW49DKqS2DrEZCtfuI+9GrNHg4fMHVSO5kE7nAPVkAxKBxcOzsajpS4Yh4ohUPPWKTUh3PaQEptIOr6BiJjcZXCwktaAGfrRIpwblqOV3YKdhfXOIvBLeREWpnd8ynsaSJoyESFphwTtfjN6X1jRO2+FxWtCWksqBApeiFIR9K6fiTpPiigDoadqCEag5YUFKl6Yrciw0VOlhOivv/Ff8wtn0KzlebrUYwAAAABJRU5ErkJggg==";
var cog_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGSSURBVCjPVVFNSwJhEF78Ad79Cf6PvXQRsotUlzKICosuRYmR2RJR0KE6lBFFZVEbpFBSqKu2rum6llFS9HHI4iUhT153n6ZtIWMOM+/MM88z7wwH7s9Ub16SJcnbmrNcxVm2q7Z8/QPvEOtntpj92NkCqITLepEpjix7xQtiLOoQ2b6+E7YAN/5nfOEJ2WbKqOIOJ4bYVMEQx4LfBBQDsvFMhUcCVU1/CxVXmDBGA5ZETrhDCQVcYAPbyEJBhvrnBVPiSpNr6cYDNCQwo4zzU/ySckkgDYuNuVpI42T9k4gLKGMPs/xPzzovQiY2hQYe0jlJfyNNhTqiWDYBq/wBMcSRpnyPzu1oS7WtxjVBSthU1vgVksiQ3Dn6Gp5ah2YOKQo5GiuHPA6xT1EKpxQNCNYejgIR457KKio0S56YckjSa9jo//3mrj+BV0QQagqGTOo+Y7gZIf1puP3WHoLhEb2PjTlCTCWGXtbp8DCX3hZuOdaIc9A+aQvWk4ihq95p67a7nP+u+Ws+r0dql9z/zv0NCYhdCPKZ7oYAAAAASUVORK5CYII=";
var colorsave_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAACEFBMVEUAAAD4pQIA3F4LfPjl5xr0bhQO7Op01BgO2vEMBNSM1hgzVrsO6s1V0hUJv/Wi2BMO1UyrMTT5tw0J2ncJ0CA10QwAKuII5rK52w0Apvvr1QoAVvD2ggfiNgMABNMcAMMT0AQA35bZ5AYAgvrwUgAHANAE1ToA2GUAR+sAHuX////7/P7n8u5+pN14ntlzmdJhislUgsSWt+mCp+B6oNuV/Pns9POhv+1sjNuEo9p6ndVri9Voj81ljctch8hVfr5Ba6vX9aKl/53+35rH7oqb/3//xHuZyXCEv1L3+//x+P+Q8v9i6f926P+w5/+T5/9s0f+c0P+Fx/9rx/+exP9bpf9xov+Emv9ql/+flv9ve/9bef9rcf9YUf+A3f5gvv2SpvyOufu1/fp7/fpk/fqEhfiwzfNEd/C6zu+ewO+atu9AUulv/+WC9eTp9OSMr+Szx+Nwj+FZQOH//+CV/+B5/+Cv/9///92b/917nN1ul9Rsi81uk8yX9stn68Zv/8WM/8NdhL+h/77u/73P/72d+buz/7n/+LBEcLBs/646aaouX6b6/6XE/6R6/6Tf/6KZ9qE44aD/vZ6N/5379Jj4/5fT+5fE+ZZX4pT8xZJu/4q2/4mq84jR/4fb94f/74Xs/37j/3x2/3n/6HZY4XTH/3Cu/3D/027++2185mrg72j/o2P4g1n12FX7ulQ91zqgsJJRAAAAKnRSTlMAEQT7+vb09PHx8e7b2tXUz8y2sK+vrq2inpiSjoqFflRSRT4yLiIgDgzu1WcyAAABB0lEQVQY0yXI00JEURQA0N1k23ad5vqO7cm2bdu2bdu/2KnW4wJMEOXv7ujiGRQD/xL8vl8vjo+u3uxCbABL9HrY0ZueHm83Dj598Ah8TxbP7kznlzcv94avMIDo3cnVrX395vbh9bP51D4OAqdGpmfmlhbmlw3m972PcHDr7BgcGBqTUzKlkqJob3AQNdSL6lRNqAdhEhqc0jMys7PUrWgCodS0bho8qnLy8wrUkpQ/nAaCq3MLi4pVLEEQPEmSsxBrW1tSXkGzHEfwPElpAEKba8oqGVYsxMTyFYCkgPbGUqZNaLVYrF2jawCQHOHcx7QMG3U6Y79MC7/iI10ZRa9UqhjXrv8A64hHrocztTAAAAAASUVORK5CYII=";
var colorload_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAACUlBMVEUAAAA3axnXChE3axkC108ANekLfPjl5xr0bhQO7Op01BgO2vEMBNSM1hgO6s1V0hUJv/VEAb6i2BNaALsO1UxhTSHdIghOTUbQBCoxAL/5tw0J2ncJ0CA10QwAKuJyALkI5rK52w0Apvvr1QoAVvD2ggfiNgMABNMcAMMT0AQA35bZ5AYAgvrwUgAHAND0uwX8jQCOu2b///+005eIumGdl/+Ndf+bX/+6Xv90/+OY/9+f/L2l/53+35ro/31hhUdTjCg3axmQ8v9i6f926P+w5/+T5//K5v/l5f9s0f+c0P+Fx/9rx/+exP/xv//Qv/+zvf9bpf9xov/gn/+/n/+Emv9ql/+tfP/Ne/9ve/9bef9rcf95Wv9YUf+A3f5gvv393vySpvyOufvv/vrT/vq1/fp7/fpk/fqY/fmS+vmEhfj/sPShc/NEd/CycfD/8++EY+5AUumC9eT/xuFZQOGv/9/g/9zH/9z6/tn/1dCX9stn68Zv/8X/6cWM/8P/psLu/73P/73Q5rqz/7n/+LD/s69s/67/yqexkKf6/6XE/6R6/6Tf/6KZ9qH/hKE44aD/vZ6N/525lZn79Jj4/5fT+5fE+ZZX4pSx1pL8xZKx05D/kY1u/4q2/4mq84j2e4jR/4fb94f/qof/74WX/4L7g4L/wn7/Zn6e/3t0Y3t2/3n/xXj/jnj/6Hb/ZHZY4XT7hnPH/3Cu/3D/027++23/b2x85mr/i2ng72j/aWf/o2OBq2F1k134g1mdbln12FX7ulRmjk891zpMezFXjy0+bCLmnu1LAAAAMXRSTlMA9tqKIQ37+vb09PHx8dva1dXU0s/Dvr23trawr6+urq2inpiSjoqFflRSRT4yLhIRgomuBAAAAQ5JREFUGNNjAAFNWX4uXiFFbQYIYJE5tG3etKkLd7Ar64P5Iut7bVZs2mjXOXm/lAFQQHq69ZxVS+YusNuy1vaAKgODVn9VW/dEm66eKYs3r57JocugUG1VU2fd3NjQYrts14S9agx8RZaWVqXlZRW17Yu2r9kgxsCZmZ6WkZqSnF/ZOnvrzqVMDNxOzi5uru4eCcX1fcvXzWdiEIjz9PH2DfD3y56056D9PgkGpXivwKBQ05Dgjt3GTYZHRBl02JLCoqLNwiPsZ80wMjRkZGBQyU2MjI0xtzhsbGRkZOzIwMAqV5hlamZucdTExMgEqAIoos5TUpCTt9LB0NjQgRnsXz0NSUFheXFGR0ZmBgCAKVH+6j+KEQAAAABJRU5ErkJggg==";

var metaList = JSON.parse(GM_getValue("pseudolist", "[]"));
var colorList = JSON.parse(GM_getValue("colorlist", null));
if (!colorList) {
	colorList = ["#ffffff", "#b7b7b7", "#000000", "#808000", "#ffff00", "#ffc000", "#ff0000", "#c9462c", "#66ff33", "#00cdff", "#008cf4", "#057c85", "#ff99ff", "#7030a0"];
	GM_setValue("colorlist", JSON.stringify(colorList));
}
var colorSettings;


console.log(document.getElementsByClassName("messagetable").length);

/* Création des cases pour les pseudos */
var pseudos = getElementByXpath(".//table//td[@class=\"messCase1\"]//b[@class=\"s2\"]", root);
pseudos.filter(function (pseudo) {
	return pseudo.innerHTML.match(/Profil su.*prim.*/) === null;
}).forEach(function (pseudo) {
	addCTBox(pseudo, false);
});

/* Création des cases pour les pseudos dans les citations */
var pseudosCitation = getElementByXpath(".//table[@class=\"oldcitation\" or @class=\"citation\"]//td//b[@class=\"s1\"]//a", root);
pseudosCitation.forEach(function (pseudo) {
	addCTBox(pseudo, true);
});
var colorTagBoxes = document.getElementsByClassName("colortag_box");

/* Popup */
var ctPopup = document.createElement("div");
ctPopup.setAttribute("id", "colortag_popup");
ctPopup.style.position = "absolute";
ctPopup.style.border = "1px solid black";
ctPopup.style.background = "white";
ctPopup.style.zIndex = "1001";
ctPopup.style.width = "auto";
ctPopup.style.textAlign = "justify";
ctPopup.pseudoclass = "";
ctPopup.pseudoindex = -1;
ctPopup.style.display = "none";
colorList.forEach(function (color, cat) {
	var colorBox = document.createElement("div");
	colorBox.setAttribute("class", "left");
	colorBox.className += " colorbox";
	colorBox.ctcat = cat;
	colorBox.style = "height: 14px; width: 14px; outline: thin solid #000000";
	colorBox.style.marginLeft = (!(cat % 4)) ? "3px" : "2px";
	colorBox.style.marginRight = ((cat % 4) == 3) ? "3px" : "2px";
	colorBox.style.marginBottom = (cat > 11) ? "3px" : "2px";
	colorBox.style.marginTop = (cat < 4) ? "3px" : "2px";
	colorBox.style.backgroundColor = color;
	colorBox.addEventListener("click", function () {
		updateList(ctPopup.pseudoclass, ctPopup.pseudoindex, this.ctcat);
		ctPopup.style.display = "none";
		ctSettingsLowPanel.style.display = "none";
	});

	if (!(cat % 4)) {
		var newRow = document.createElement("div");
		newRow.style.display = "block";
		ctPopup.appendChild(newRow);
	}
	ctPopup.appendChild(colorBox);
});
var colorBoxes = document.getElementsByClassName("colorbox");

/* Popup paramètres */
var ctSettings = document.createElement("div");
ctSettings.setAttribute("id", "colortag_parameters");
ctSettings.style.position = "absolute";
ctSettings.style.border = "1px solid black";
ctSettings.style.background = "#bbbbbb";
ctSettings.style.zIndex = "1001";
ctSettings.style.width = "auto";
ctSettings.style.textAlign = "justify";
ctSettings.style.display = "none";
colorList.forEach(function (color, cat) {
	var inputColor = document.createElement("input");
	inputColor.type = "color";
	inputColor.ctcat = cat;
	var colorBox = document.createElement("div");
	colorBox.setAttribute("class", "left");
	colorBox.className += " colorbox_setting";
	colorBox.ctcat = cat;
	colorBox.style = "height: 14px; width: 14px; outline: thin solid #000000";
	colorBox.style.marginLeft = (!(cat % 4)) ? "3px" : "2px";
	colorBox.style.marginRight = ((cat % 4) == 3) ? "3px" : "2px";
	colorBox.style.marginBottom = (cat > 11) ? "3px" : "2px";
	colorBox.style.marginTop = (cat < 4) ? "3px" : "2px";
	colorBox.addEventListener("click", function () {
		inputColor.value = colorSettings[colorBox.ctcat];
		inputColor.click();
	});
	inputColor.addEventListener("input", function () {
		colorBox.style.backgroundColor = inputColor.value;
		colorSettings[colorBox.ctcat] = inputColor.value;
	});

	if (!(cat % 4)) {
		var newRow = document.createElement("div");
		newRow.style.display = "block";
		ctSettings.appendChild(newRow);
	}
	ctSettings.appendChild(colorBox);
});
var colorBoxesSettings = document.getElementsByClassName("colorbox_setting");

/* Volet inférieur des paramètres */
var ctSettingsLowPanel = document.createElement("div");
ctSettingsLowPanel.setAttribute("id", "colortag_lowerpanel");
ctSettingsLowPanel.style.position = "absolute";
ctSettingsLowPanel.style.border = "1px solid black";
ctSettingsLowPanel.style.background = "#bbbbbb";
ctSettingsLowPanel.style.zIndex = "1001";
ctSettingsLowPanel.style.width = "auto";
ctSettingsLowPanel.style.textAlign = "justify";
ctSettingsLowPanel.style.display = "none";

/* Créations des boutons de la popup */
var inputSave = createButton("Exporter la liste des pseudos", download_icon, function () {
		downloadList("pseudolist");
	});
inputSave.style.marginLeft = "2px";
var inputLoad = createButton("Importer une liste de pseudos depuis un fichier", upload_icon, function () {
		uploadColorTagList();
		ctPopup.style.display = "none";
	});
var inputSaveColor = createButton("Exporter la liste des couleurs", colorsave_icon, function () {
		downloadList("colorlist");
	});
var inputLoadColor = createButton("Importer une liste de couleurs depuis un fichier", colorload_icon, function () {
		uploadColorList();
	});
inputLoadColor.style.marginRight = "2px";
var inputSettings = createButton("Ouvrir les paramètres", cog_icon, function () {
		ctSettingsLowPanel.style.display = "block";
		ctSettingsLowPanel.style.top = (Number(ctPopup.style.top.replace("px", "")) + 78) + "px";
		ctSettingsLowPanel.style.left = ctPopup.style.left;
		ctSettings.style.display = "block";
		ctSettings.style.top = ctPopup.style.top;
		ctSettings.style.left = ctPopup.style.left;
		colorSettings = colorList.slice();
		for (var colorBox of colorBoxesSettings) {
			colorBox.style.backgroundColor = colorSettings[colorBox.ctcat];
			console.log("hello");
		}
	});
var inputClose = createButton("Fermer", cross_icon, function () {
		ctPopup.style.display = "none";
		ctSettings.style.display = "none";
		ctSettingsLowPanel.style.display = "none";
	});
var inputConfirm = createButton("Confirmer les nouvelles couleurs", accept_icon, function () {
		for (var colorTagBox of colorTagBoxes) {
			colorTagBox.style.backgroundColor = colorSettings[colorTagBox.ctcat];
		}
		for (var colorBox of colorBoxes) {
			colorBox.style.backgroundColor = colorSettings[colorBox.ctcat];
		}
		GM_setValue("colorlist", JSON.stringify(colorSettings));
		colorList = colorSettings.slice();
		ctSettings.style.display = "none";
		ctSettingsLowPanel.style.display = "none";
		ctPopup.style.display = "block";
	});
var inputCancel = createButton("Retour", cross_icon, function () {
		ctSettings.style.display = "none";
		ctSettingsLowPanel.style.display = "none";
		ctPopup.style.display = "block";
	});

ctPopup.appendChild(inputSettings);
ctPopup.appendChild(inputClose);
root.appendChild(ctPopup);
ctSettings.appendChild(inputCancel);
ctSettings.appendChild(inputConfirm);
root.appendChild(ctSettings);
ctSettingsLowPanel.appendChild(inputSave);
ctSettingsLowPanel.appendChild(inputLoad);
ctSettingsLowPanel.appendChild(inputSaveColor);
ctSettingsLowPanel.appendChild(inputLoadColor);
root.appendChild(ctSettingsLowPanel);

/* Cache la popup lors d"un clic extérieur */
document.addEventListener("click", function (e) {
	if (!(e.target.className.split(" ")[3] === "colortag_box") && !e.target.closest("#colortag_popup") && !e.target.closest("#colortag_parameters"))
		ctPopup.style.display = "none";
});

/** Crée une image cliquable */
function createButton(title, icon, onClickFunction) {
	var newButton = document.createElement("input");
	newButton.setAttribute("title", title);
	newButton.type = "image";
	newButton.src = icon;
	newButton.style.marginRight = "1px";
	newButton.style.marginLeft = "1px";
	newButton.style.marginTop = "1px";
	newButton.style.marginBottom = "1px";
	newButton.addEventListener("click", onClickFunction);
	return newButton;
}

/** Ajoute une case à la section contenant le pseudo */
function addCTBox(pseudo, citation) {
	var ctBox = document.createElement("div");
	ctBox.setAttribute("class", "colortag");
	var pseudoValue;
	if (citation) {
		ctBox.className += "_citation";
		ctBox.className += " left";
		ctBox.style = "width: 13px; outline: thin solid #bbbbbb";
		ctBox.style.marginRight = "3px";
		ctBox.style.height = "13px";
		pseudoValue = pseudo.innerHTML.substr(0, (pseudo.innerHTML.length - " a écrit :".length));
	} else {
		ctBox.className += " right";
		ctBox.style = "height: 15px; width: 15px; outline: thin solid #bbbbbb";
		ctBox.style.marginRight = "2px";
		pseudoValue = getRealPseudo(pseudo.innerHTML);
	}
	ctBox.className += " ct_" + escape(pseudoValue);
	ctBox.className += " colortag_box";
	var pseudoIndex = searchArray(pseudoValue, metaList);
	var pseudoCat = (pseudoIndex < 0) ? 0 : metaList[pseudoIndex][1];
	if (citation && !pseudoCat) {
		ctBox.style.width = "0px";
		ctBox.style.outline = "";
		ctBox.style.marginRight = "0px";
	}
	var pseudoColor = colorList[pseudoCat];
	ctBox.ctpseudoindex = pseudoIndex;
	ctBox.ctcat = pseudoCat;
	ctBox.style.backgroundColor = pseudoColor;
	pseudo.parentNode.parentNode.insertBefore(ctBox, pseudo.parentNode);
	ctBox.addEventListener("click", function (e) {
		ctPopup.pseudoclass = this.className.split(" ")[2];
		ctPopup.pseudoindex = this.ctpseudoindex;
		ctPopup.style.left = (e.clientX) + "px";
		ctPopup.style.top = (window.pageYOffset + e.clientY) + "px";
		ctPopup.style.display = "block";
		ctSettingsLowPanel.style.display = "none";
		ctSettings.style.display = "none";
	});
}

/** Mise à jour des cases associées au pseudo et de la liste globale */
function updateList(pseudoClass, pseudoIndex, cat) {
	var ctBoxes = document.getElementsByClassName(pseudoClass);
	var localList = metaList.slice();
	for (var ctBox of ctBoxes) {
		ctBox.style.backgroundColor = colorList[cat];
		if (ctBox.className.split(" ")[0] === "colortag_citation") {
			if (cat > 0) {
				ctBox.style.width = ctBox.style.height;
				ctBox.style.outline = "thin solid #bbbbbb";
				ctBox.style.marginRight = "3px";
			} else {
				ctBox.style.width = "0px";
				ctBox.style.outline = "";
				ctBox.style.marginRight = "0px";
			}
		}
	}
	if (pseudoIndex < 0) {
		ctBox.pseudoindex = metaList.length;
		metaList.push([unescape(pseudoClass).substr(3).toLowerCase(), cat]);
		localList.push([unescape(pseudoClass).substr(3).toLowerCase(), cat]);
		localList.sort(sortFunction);
	} else {
		metaList[pseudoIndex][1] = cat;
		if (!cat) {
			localList.splice(pseudoIndex, 1);
		} else {
			localList[pseudoIndex][1] = cat;
		}
	}
	GM_setValue("pseudolist", JSON.stringify(localList));
}

/** Téléchargement d"une liste */
function downloadList(listName) {
	var blob = new Blob([GM_getValue(listName)], {
			type: "text/plain"
		});
	var url = window.URL.createObjectURL(blob);
	var d = new Date();
	var downloadedfile;
	if (document.getElementById("download_list")) {
		downloadedfile = document.getElementById("download_list");
	} else {
		downloadedfile = document.createElement("a");
		downloadedfile.setAttribute("id", "download_list");
		document.body.appendChild(downloadedfile);
	}
	downloadedfile.setAttribute("download", d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "_" + listName + ".colortag");
	downloadedfile.setAttribute("href", url);
	downloadedfile.click();
	window.URL.revokeObjectURL(url);
}

/** Import de la liste globale depuis un fichier */
function uploadColorTagList() {
	var uploadedfile;
	if (document.getElementById("uploaded_colortag_list")) {
		uploadedfile = document.getElementById("uploaded_colortag_list");
	} else {
		uploadedfile = document.createElement("input");
		uploadedfile.setAttribute("id", "uploaded_colortag_list");
		uploadedfile.setAttribute("type", "file");
		uploadedfile.accept = ".colortag,.txt";
		uploadedfile.style.display = "none";
		uploadedfile.addEventListener("change", function (e) {
			var files = e.target;
			var file = files.files[0];
			var reader = new FileReader();
			reader.onload = function () {
				try {
					var uploadedList = JSON.parse(this.result);
					uploadedList.forEach(function (pseudo) {
						pseudo[0] = getRealPseudo(pseudo[0]).toLowerCase();
						if ((pseudo[1] < 0) || (pseudo[1] > 13)) {
							throw "bad cat";
						}
					});
					uploadedList.sort(sortFunction);
					GM_setValue("pseudolist", JSON.stringify(uploadedList));
					location.reload();
				} catch (err) {
					alert("Echec de l\"import : le fichier n\"est pas valide.");
					return;
				}
			};
			reader.readAsText(file);
		});
		document.body.appendChild(uploadedfile);
	}
	uploadedfile.click();
}

/** Import de la liste des couleurs depuis un fichier */
function uploadColorList() {
	var uploadedfile;
	if (document.getElementById("uploaded_color_list")) {
		uploadedfile = document.getElementById("uploaded_color_list");
	} else {
		uploadedfile = document.createElement("input");
		uploadedfile.setAttribute("id", "uploaded_color_list");
		uploadedfile.setAttribute("type", "file");
		uploadedfile.accept = ".colortag,.txt";
		uploadedfile.style.display = "none";
		uploadedfile.addEventListener("change", function (e) {
			var files = e.target;
			var file = files.files[0];
			var reader = new FileReader();
			reader.onload = function () {
				try {
					var uploadedList = JSON.parse(this.result);
					for (i = 0; i < 14; i++) {
						if (!(/^#[0-9A-F]{6}$/i.test(uploadedList[i])))
							throw "not hex";
					}
					colorSettings = uploadedList.slice();
					for (var colorBox of colorBoxesSettings) {
						colorBox.style.backgroundColor = colorSettings[colorBox.ctcat];
					}
				} catch (err) {
					alert("Echec de l\"import : le fichier n\"est pas valide.");
					return;
				}

			};
			reader.readAsText(file);
		});
		document.body.appendChild(uploadedfile);
	}
	uploadedfile.click();
}

/** Suppression du caractère spécial dans les pseudos longs */
function getRealPseudo(pseudoValue) {
	return pseudoValue.split(String.fromCharCode(8203)).join("");
}

/** Recherche par dichotomie selon la 1ere colonne */
function searchArray(aChercher, tableau) {
	if (typeof(tableau) == "undefined" || !tableau.length)
		return -1;
	var high = tableau.length - 1;
	var low = 0;
	aChercher = aChercher.toLowerCase();
	while (low <= high) {
		mid = parseInt((low + high) / 2);
		element = tableau[mid][0];
		if (element > aChercher) {
			high = mid - 1;
		} else if (element < aChercher) {
			low = mid + 1;
		} else {
			return mid;
		}
	}
	return -1;
}

/** Tri selon la 1ere colonne pour les tableaux */
function sortFunction(a, b) {
	if (a[0] === b[0]) {
		return 0;
	} else {
		return (a[0] < b[0]) ? -1 : 1;
	}
}

/** Récupère un élément via son path */
function getElementByXpath(path, element) {
	var arr = Array(),
	xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (; item = xpr.iterateNext(); )
		arr.push(item);
	return arr;
}
