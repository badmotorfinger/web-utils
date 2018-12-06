// jQuery, horrible!

// Formats any inputs with the attribute "currency-format" and only allows numeric characters, decimal, $ and comma characters.

$("input[currency-format]").on("blur", function (e){    
	formatCurrency(this);	
}).keypress(function (e) {

	if(e.which == 46){
        if(this.value.indexOf('.') != -1) {
            return false;
        }
    }

    if (e.which != 36 && e.which != 44 && e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
        return false;
    }
});

$("input[currency-format]").each(function(e) { formatCurrency(this); });

function formatCurrency(element) {
	var val = element.value.trim();
	
	if (val[0] === '$') { val = val.substr(1).trim() };
	
	while (/(\d+)(\d{3})/.test(val)){
	  val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	}
	
	element.value = "$ " + val;
}
