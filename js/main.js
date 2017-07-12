var skip = 0;

//0 - initial
// 1 - intro
// 2 - baraban
// 3 - show
// 4 - bukva
// 5 - slovo otgadano
var game_stage = 4;

var last_char;

( function () {
    window.addEventListener( 'tizenhwkey', function( ev ) {
        if( ev.keyName === "back" ) {
            var activePopup = document.querySelector( '.ui-popup-active' ),
                page = document.getElementsByClassName( 'ui-page-active' )[0],
                pageid = page ? page.id : "";

            if( pageid === "main" && !activePopup ) {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {
                }
            } else {
                window.history.back();
            }
        }
    } );
    
    $("#kb_popup_no").click(function(){ // dont delete pls
		$("#kb_popup").hide();
	});
    
    

    // [1] - intro
    // set background
    // yakub predstavlyaet igrokov
    // govorit krutit pervomu
    
    // [2] - baraban
    // krutitsa
    
    // [3] - show
    // vistuplenia (tanec, pesnya, sin-vnuk rasskazivaet stix)
    // gostinci (ogurci, salo, lapti, pryaniki, whatnot)
    // esli est ZH - cveti v studiyu po pervomu M
    // istoria o sebe
    // peredat privet
    
    // [4] - bukva
    // baraban ostanovilsa, ukazatel na sektor
    // yakub prosit nazvat bukvu
    	// verno -> [2]
    		// esli konec slova -> [5]
    	// neverno -> hod perehodit k drugomu igroku (prosto dialog) -> [2]
    next_stage(game_stage);
} () );

function next_stage(st) {
	if (st === 0) { // initial
		// draw bg
		game_stage = 1;
		next_stage(game_stage);
	} else if (st === 1) { // set intro
		draw_dialog("yakub", ["zdorovenki buli hlopci"], function() {
			next_stage(game_stage);
		});
		game_stage = 2;
	} else if (st === 2) { // set baraban
		draw_baraban(function() {
			setTimeout(function(){ next_stage(game_stage); }, 5000);
		});
		game_stage = 3;
	} else if (st === 3) { // set show
		$("#baraban").hide();
		draw_dialog("igrok", ["mi vam podgotovili"], function() {
			$("#spinner").show();
		});
		game_stage = 4;
	} else if (st === 4) { // bukva (slozhno)
		draw_keyboard("rus");
	}
}

function draw_baraban(cb) {
	$("#baraban").show();
	$("#baraban_img").on("click", function() {
		console.log("baraban clicked!");
		console.log(this);
		$(this).addClass("spinleft");
	});
	cb();
}


function draw_dialog(name, lines, xape) {
	$("#dialog").show();
	$("#dialog_name").text(function(){
		return name;
	});
	dialog_text_draw(lines, 0, 0, xape);
}

function dialog_text_draw(text, i, j, xape) {
	document.getElementById("dialog_blinker").innerHTML = " ";
	if (skip === 1) {
		skip = 0;
		document.getElementById("dialog_text").innerHTML = text[j];
		j++;
		if (j === text.length) {
			$("#dialog").off("click");
			$("#dialog").click(function() {
				$(this).hide();
				xape();
			});
			return;
		} else {
			$("#dialog").off("click");
			$("#dialog").click(function() {
				dialog_text_draw(text, 0, j, xape);
			});
		}
		document.getElementById("dialog_blinker").innerHTML = " &#128898";
		return;
	}
	if (skip === 0) {
		$("#dialog").off("click");
	    $("#dialog").on("click", function() {
	    	skip = 1;
		});
	 }
	i++;
	document.getElementById("dialog_text").innerHTML = text[j].slice(0, i);
	if (i === text[j].length) {
		document.getElementById("dialog_blinker").innerHTML = " &#128898";
		j++;
		if (j === text.length) {
			$("#dialog").off("click");
			$("#dialog").click(function() {
				$(this).hide();
				xape();
			});
			return;
		} else {
			$("#dialog").off("click");
			$("#dialog").click(function() {
				dialog_text_draw(text, 0, j, xape);
			});
		}
		return;
	} else {
		var t = setTimeout(function(){ dialog_text_draw(text, i, j, xape); }, 100);
	}
}

function keyboard(lang) {
	if (lang === "rus") {
		return ["а","б","в","г","д","е","ё","ж","з","и","й","к","л","м",
		        "н","о","п","р","с","т","у","ф","х","ц","ч","ш","щ","ъ","ы","ь","э","ю","я"];
	}
}

function draw_keyboard(lang) {
	var kb = keyboard(lang);
	var br_line = 0;
	for (var i = 0; i < kb.length; i++) {
    	if (br_line === 4) {
    		$("#keyboard").append("<button class='kb_btn' onclick='kb_btn_click(" + i + ")' id='key" + i + "'>" + 
    				kb[i] + "</button><br />");
    		br_line = 0;
    	} else {
    		$("#keyboard").append("<button class='kb_btn' onclick='kb_btn_click(" + i + ")' id='key" + i + "'>" + 
    				kb[i] + "</button>");
    		br_line++;
    	}
    }
}

function kb_btn_click(index) {
	$("#kb_popup_text").text("Kakaya bukva? " + keyboard("rus")[index] + "?");
	last_char = index;
	document.getElementById("kb_popup").style.display = "block";
}

function random_between(min, max) { // both inclusive!
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}