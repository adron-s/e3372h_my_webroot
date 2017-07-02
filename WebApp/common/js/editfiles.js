function op_file_to_edit_box(op, data, file, edit_box){
	edit_box.val("Загрузка данных...");
	jQuery.ajax({
		type: "POST",
		url: "http://" + location.hostname + ":5080/cgi-bin/edit_files.cgi",
		data: op + file + data,
		processData: false,
		success: function(data, textStatus, jqXHR){
			edit_box.val(data);
		},
		dataType: "text",
	});
}

function load_file_to_edit_box(file, edit_box){
	op_file_to_edit_box("load", "", file, edit_box);
}
function save_file_from_edit_box(file, edit_box){
	console.log(edit_box);
	op_file_to_edit_box("save", edit_box.val(), file, edit_box);
}

function allow_tabs(edit_box){
	edit_box.on('keydown', function(e){
		var keyCode = e.keyCode || e.which;
		if(keyCode == 9){
			e.preventDefault();
			var start = this.selectionStart;
			var end = this.selectionEnd;
			var val = this.value;
			var selected = val.substring(start, end);
			var re = /^/gm;
			var count = selected.match(re).length;

			this.value = val.substring(0, start) +
				selected.replace(re, '\t') + val.substring(end);
			this.selectionStart = end + count;
			this.selectionEnd = end + count;
		}
	});
}

$( function(){
	var files = [
		[ "Конфиг MSTP",  "0000" ],
		[ "Конфиг DHCPS", "0001" ]
	];
	var file_to_edit = $("#file_to_edit");
	var edit_file_content = $("#edit_file_content");
	file_to_edit.children(":first-child").data("delme", 1);
	for(var p in files){
		var descr = files[p][0];
		var fname = files[p][1];
		file_to_edit.append(
			"<option value='" + fname + "'>" +
			descr + "</option>"
		);
	}
	file_to_edit.change(function(){
		var first = file_to_edit.children(":first-child");
		if(first.data("delme") == 1)
			first.remove();
		load_file_to_edit_box(file_to_edit.val(), edit_file_content);
	});
	allow_tabs(edit_file_content);

	$("#edit_files_reload_file").click(function(){
		if(file_to_edit.val() != "9999")
			load_file_to_edit_box(file_to_edit.val(), edit_file_content);
		else
			console.log("STUBB Sel!");
	});
	$("#edit_files_save_file").click(function(){
		if(file_to_edit.val() != "9999")
			save_file_from_edit_box(file_to_edit.val(), edit_file_content);
		else
			console.log("STUBB Sel!");
	});


});
