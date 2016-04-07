var STIC = {
	// Create DT
	makeDT: function(options) {
		var dt,
			dtCd = options.cd,
			dtDs = options.ds,
			dtWs = options.ws,
			dtDomId = options.domId,
			dtOd = (typeof options.od != 'undefined' ? options.od : false)
			dtPl = (typeof options.pl != 'undefined' ? options.pl : DEFAULT_PAGE_LENGTH);	
			dt = $('#' + dtDomId)
				.DataTable({						
					pageLength: dtPl,
					ordering: dtOd,
					searching: true,
					processing: true,
					lengthChange: false,					
					columns: dtCd,
					dom: 'frtip',
					ajax: { 
						url: dtWs, 
						dataSrc: function(json) {
							var ds = dtDs.split('.'),
								rec = json[ds[0]][ds[1]][ds[2]];
							return ($.isArray(rec) === true ? rec : (rec !== '' ? [rec] : []));
						}  
					}
				});				
			return dt;
	},
	
	// Load Module Page
	loadPage: function(options) {
		var wrapper = DEFAULT_WRAPPER_ID,
			page_loc = DEFAULT_PAGE_LOC,
			page_ext = DEFAULT_PAGE_FILE_EXT,
			page_name = options.page_name;
		$(wrapper).load(page_loc + page_name + page_ext);
	},
	
	// Create Cookie
	createCookie: function(name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = '; expires=' + date.toGMTString();
		}
		else var expires = '';
		document.cookie = name + '=' + value + expires + '; path=/';
	},
	
	// Read Cookie
	readCookie: function(name) {
		var nameEQ = name + '=',
			ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	},
	
	// Remove Cookie
	eraseCookie: function(name) {
		this.createCookie(name, '', -1);
	},
	
	// Check if Logged In
	checkIfLoggedIn: function() {
		if (this.readCookie('stic-user') === null) {
			this.logout();
		} else {
			$('#current-user').text(this.readCookie('stic-name'));
		}	
	},
	
	// Logout
	logout: function() {
		this.eraseCookie('stic-user');
		this.eraseCookie('stic-name');
		window.location = DEFAULT_ROOT;
	},
	
	// Form Validation
	FormValidation: function(options) {
		var clearHelpBlocks = (typeof options.clearHelpBlocks != 'undefined' ? options.clearHelpBlocks : false);
		if (clearHelpBlocks) {
			var elems = $(options.formId).find('input[data-field]');
			$.each(elems, function(idx, elem) {
				var div = $(elem).parent(),
					span = $(div).children('span'),
					small = $(div).children('small');
				span.remove();
				small.remove();
				div.removeClass('has-error has-feedback');	
				div.removeClass('has-success has-feedback');		
			});
			return true;
		} else {
			var errors = 0,
				elems = $(options.formId).find('input[data-field]');
			//console.log('Start Form Validation for: ' + options.formId);
			$.each(elems, function(idx, elem) {
				var input = $(elem).val(),
					div = $(elem).parent(),
					hidden = $(elem).attr('type'),
					span = $(div).children('span'),
					small = $(div).children('small'),				
					notempty = $(elem).attr('data-fv-notempty'),
					notempty_msg = $(elem).attr('data-fv-notempty-msg'),				
					stringlength = $(elem).attr('data-fv-stringlength'),
					stringlength_max = parseInt($(elem).attr('data-fv-stringlength-max')),
					stringlength_msg = $(elem).attr('data-fv-stringlength-msg');
				
				//console.log('Checking ' + $(elem).attr('data-field') + ' : ' + input);
				
				span.remove();
				small.remove();
				div.removeClass('has-error has-feedback');
				
				// Check if Empty
				if (notempty == 'true') {				
					if (input == '') {	
						errors++;
						div.addClass('has-error has-feedback');
						//div.append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
						div.append('<small class="help-block">' + notempty_msg + '</small>');
					} else {
						div.addClass('has-success has-feedback');					
						//div.append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
					}
				} 
				
				// Check Input Length
				if (stringlength == 'true') {
					if (input.length > stringlength_max) {
						errors++;
						div.addClass('has-error has-feedback');
						//div.append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
						div.append('<small class="help-block">' + stringlength_msg + '</small>');
					} else {
						div.addClass('has-success has-feedback');					
						//div.append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
					}
				}
			});	
		}
		//console.log('End Form Validation for: ' + options.formId);
		return errors > 0 ? false : true;
	}
}