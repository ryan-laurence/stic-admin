var STIC = {
	
	// Create DT
	DTLookup: function (options) {
		var dt,
			dtCd = options.cd,
			dtDs = options.ds,
			dtWs = options.ws,
			dtDomId = options.domId,
			dtOd = (typeof options.od != 'undefined' ? options.od : true)
			dtPl = (typeof options.pl != 'undefined' ? options.pl : DEFAULT_PAGE_LENGTH);
		dt = $('#' + dtDomId)
			.DataTable({
				pageLength: dtPl,
				ordering: dtOd,
				searching: true,
				processing: false,
				lengthChange: false,
				columns: dtCd,
				dom: '<"dt-toolbar">Bfrtip',
				ajax: {
					url: dtWs,
					dataSrc: function (json) {
						var ds = dtDs.split('.'),
							rec = json[ds[0]][ds[1]][ds[2]];
						return ($.isArray(rec) === true ? rec : (rec !== '' ? [rec] : []));
					}
				},
				buttons: [{
					name: 'reload',
					text: '<i class="fa fa-refresh"></i> Refresh',
					className: 'btn-primary',
					action: function (e, dt, node, config) {
						dt.ajax.reload();
					}
				}]
			});
		dt.column('0:visible').order('asc').draw();
		return dt;
	},
	
	// Enable Buttons
	EnableButtons: function (buttons) {
		btns = buttons || [];
		if (btns.length > 0) {
			$.each(btns, function(idx, btn) {
				$(btn).prop('disabled', false);
			});
		}
	},
	
	// Disable Buttons
	DisableButtons: function (buttons) {
		btns = buttons || [];
		if (btns.length > 0) {
			$.each(btns, function(idx, btn) {
				$(btn).prop('disabled', true);
			});
		}
	},
	
	// DT toggle Row Select
	DtToggleRowSelect: function (params) {
		var pid = params.pid,
			row = params.row,
			table = params.table,
			buttons = params.buttons || [];
		if (table.row(row).data()[pid] != '') {
			if ($(row).hasClass('selected')) {
				$(row).removeClass('selected');
				this.DisableButtons(buttons);
			} else {
				table.$('tr.selected').removeClass('selected');
				$(row).addClass('selected');
				this.EnableButtons(buttons);
			}
		}
	},
	
	// Load module page
	LoadPage: function (params) {
		var wrapper = DEFAULT_WRAPPER_ID,
			pageLoc = DEFAULT_PAGE_LOC,
			pageExt = DEFAULT_PAGE_FILE_EXT;
		$(wrapper).load(pageLoc + params.modName + pageExt);
	},
	
	// Create Cookie
	CreateCookie: function (name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = '; expires=' + date.toGMTString();
		}
		else var expires = '';
		document.cookie = name + '=' + value + expires + '; path=/';
	},
	
	// Read Cookie
	ReadCookie: function (name) {
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
	EraseCookie: function (name) {
		this.CreateCookie(name, '', -1);
	},

	// Remove from Audit Trail
	RemoveToContext: function () {
		if (this.ReadCookie('stic-name') !== null) {
			var JSONObject = {
				user_name: this.ReadCookie('stic-name')
			};
			$.post(WS_USER_REMOVE_FROM_AUDIT, JSONObject)
				.done(function (results, status) {
					if (results.response.type === 'FAILED') {
						STIC.ShowWSError();
					}
				})
				.fail(function () {
					STIC.ShowWSError();
				});
		}
	},
	
	// Check if User is valid
	CheckIfValid: function (logout) {
		var userId = this.ReadCookie('stic-user'),
			userName = this.ReadCookie('stic-name'),
			forceLogOut = typeof logout !== 'undefined' 
					? logout : true;

		if (userId !== null && userName !== null) {
			var JSONObject = {
				user_id: userId,
				user_name: userName
			};

			// Call WS Validation
			$.post(WS_USER_AUTHENTICATE, JSONObject)
				.done(function (results, status) {
					if (results.response.type === 'SUCCESS') {
						$('#current-user').text(userName);
						if (!forceLogOut)
							window.location = DEFAULT_ROOT + 'main.html';
					} else {
						if (forceLogOut)
							this.Logout();
					}
				})
				.fail(function () {
					STIC.ShowWSError();
				});
		} else {
			if (forceLogOut) {
				this.Logout();
			} else {
				this.RemoveToContext();
				this.EraseCookie('stic-user');
				this.EraseCookie('stic-name');
			}
		}
	},
	
	// Login
	Login: function () {
		var totalErrors = 0,
			username = $('#username').val(),
			password = $('#password').val();					
		
		// Clear error messages & styles
		$('.login-form').find('div.form-group')
			.removeClass('has-error has-feedback')
			.removeClass('has-success has-feedback');
		$('.login-form').find('div.form-group').find('span.glyphicon, small.help-block')
			.remove();	
		$('.login-form').find('div.alert')
			.remove();
		
		// Validate user name
		var divInputGroup = $('.login-form').find('#username').parent(),
				divFormGroup = $('.login-form').find('#username').parent().parent();		
		if (username == '') {										
			divFormGroup.addClass('has-error has-feedback');
			divFormGroup.append('<small class="help-block" style="text-align: left">Username is required.</small>');
			divInputGroup.append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
			totalErrors++;
		} else {
			divFormGroup.addClass('has-success has-feedback');								
			divInputGroup.append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
		}
		
		// Validate user password
		var divInputGroup = $('.login-form').find('#password').parent(),
				divFormGroup = $('.login-form').find('#password').parent().parent();	
		if (password == '') {
			divFormGroup.addClass('has-error has-feedback');
			divFormGroup.append('<small class="help-block" style="text-align: left">Password is required.</small>');
			divInputGroup.append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
			totalErrors++;
		} else {
			divFormGroup.addClass('has-success has-feedback');								
			divInputGroup.append('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
		}
		
		// Authenticate user 
		if (totalErrors <= 0 ) {
			$.post(WS_USER_CHECK, { user_name: username, user_password: password })
				.done(function (result, status) {
					var response = result.response;

					// Authenticated
					if (response.type === 'SUCCESS') {
						var user = response['users-list'].user;
						
						// Create Cookies					
						STIC.CreateCookie('stic-user', user.user_id, 1);
						STIC.CreateCookie('stic-name', user.user_name, 1);
						
						window.location = DEFAULT_ROOT + 'main.html';
					
					// Not Authorized
					} else {
						// Clear error messages & styles
						$('.login-form').find('div.form-group')
							.removeClass('has-error has-feedback')
							.removeClass('has-success has-feedback');
						$('.login-form').find('div.form-group').find('span.glyphicon, small.help-block')
							.remove();	
						$('.login-form').find('div.alert')
							.remove();
						
						// Show error messages & styles
						$('.login-form hr:first').after(MSG_ALERT_INVALID_LOGIN);
						$('.login-form').find('#username, #password').parent()
							.append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
						$('.login-form').find('#username, #password').parent().parent()
							.addClass('has-error has-feedback');
						$('.login-form').find('#username').parent().parent()
							.append('<small class="help-block" style="text-align: left">Username is invalid.</small>');
						$('.login-form').find('#password').parent().parent()
							.append('<small class="help-block" style="text-align: left">Password is invalid.</small>');
					}
				})
				
				// Show WS Error
				.fail(function () {
					STIC.ShowWSError();
				})
		} else {
			$('.login-form hr:first').after(MSG_ALERT_LOGIN_FORM_ERROR);
		}
	},
	
	// Confirm Logout
	ConfirmLogout: function () {
		BootstrapDialog.confirm({
			title: MSG_TITLE_CONFIRM_LOGOUT,
			message: MSG_CONFIRM_LOGOUT,
			callback: function (result) {
				if (result) {
					STIC.Logout();
				}
			}
		});
	},
	
	// Logout
	Logout: function () {
		this.RemoveToContext();
		this.EraseCookie('stic-user');
		this.EraseCookie('stic-name');
		window.location = DEFAULT_ROOT;
	},
	
	// Navigation Tabs
	NavTabs: function () {
		var first_tab = $('#tab-main > li:first-child'),
			all_tabs = $('#tab-main > li[data-toggle="tab-main"]');
		
		$(all_tabs).click(function (e) {
			var source = $(this).attr('data-url'),
				target = $(this).attr('data-target');			
			
			$.get(source, function (data) {
				$(target).html(data);				
			});
			
			$(all_tabs).removeClass('active');
			$(all_tabs).children('a')
				.removeClass('make-bold');
			
			$(this).addClass('active');
			$(this).children('a')
				.addClass('make-bold');
		});
		
		$(first_tab).trigger('click');
	},
	
	// Show Duplicate Error messages on form after submit
	ShowDuplicateError: function (params) {
		var div = $(params.formId).find('label[for="' + params.ukey + '"]').parent(),
			input = $(params.formId).find('input[data-field="' + params.ukey + '"]');

		// Remove error messages & styles
		this.clearHelpBlocks({ formId: params.formId });

		// Show duplicate error message
		$(params.formId).prepend(MSG_ALERT_DUPLICATE_REC);

		// Show form error messages & styles
		div.addClass('has-error has-feedback');
		div.append('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
		div.append('<small class="help-block">' + input.attr('data-fv-unique-msg') + '</small>');
	},
	
	// Show WS Error message on form after submit
	ShowWSError: function (params) {
		var params = typeof params !== 'undefined' ? params : {};		
		if (typeof params.formId !== 'undefined') {
			var formId = params.formId;
			$(formId).find('div.alert').remove();
			$(formId).prepend(MSG_ALERT_WS_ERROR);
		} else {
			BootstrapDialog.closeAll();
			BootstrapDialog.alert({
				type: 'type-danger',
				title: MSG_TITLE_WS_ERROR,
				message: MSG_INFO_WS_ERROR,
				callback: function(result) {
					BootstrapDialog.closeAll();
				}
			});
		}
	},
	
	// Remove error messages & styles
	ClearHelpBlocks: function (params) {
		$(params.formId).find('div.form-group')
			.removeClass('has-error has-feedback')
			.removeClass('has-success has-feedback');
		$(params.formId).find('div.alert, span.glyphicon, small.help-block')
			.remove();
	},
	
	// Form Validation
	FormValidation: function (options) {
		var clearHelpBlocks = (typeof options.clearHelpBlocks != 'undefined'
			? options.clearHelpBlocks : false);

		// Clear Help Blocks
		if (clearHelpBlocks) {

			// Remove error messages & styles
			this.ClearHelpBlocks({ formId: options.formId });

			return true;

		// Validate Form
		} else {
			var totalErrors = 0, postString = '',
				elems = $(options.formId).find('input[data-field], select[data-field]');

			// Remove error messages & styles
			this.ClearHelpBlocks({ formId: options.formId });

			// Validate each field
			$.each(elems, function(idx, elem) {
				if ($(elem).attr('type') == 'hidden' || $(elem).attr('type') == 'checkbox')
					return;

				var errorMsg = '', stringMax = 0, fieldErrors = 0,
					fieldValue = $(elem).val(), fieldName = $(elem).attr('data-field'),

					// Field container
					div = $(options.formId).find('label[for="' + fieldName + '"]').parent();

				// Check if Empty
				if ($(elem).data('fv-notempty') === true) {
					errorMsg = MSG_FV_NOTEMPTY;
					if (fieldValue === '')
						fieldErrors++;
				}
				
				// Check for Special Characters
				if ($(elem).data('fv-specialchars') === true && fieldErrors <= 0) {
					var pattern = new RegExp(/[^\w ]/g);
					errorMsg = MSG_FV_SPECIAL_CHARS;
					if (pattern.test(fieldValue) === true)
						fieldErrors++;
				}

				// Check Input Length
				if ($(elem).data('fv-stringlength') === true && fieldErrors <= 0) {
					errorMsg = $(elem).data('fv-stringlength-msg');
					if (fieldValue.length > parseInt($(elem).data('fv-stringlength-max')))
						fieldErrors++;
				}

				// Check Field Match
				if ($(elem).data('fv-fieldmatch') === true && fieldErrors <= 0) {
					errorMsg = $(elem).data('fv-fieldmatch-msg');
					if (fieldValue !== $($(elem).data('fv-fieldmatch-dom')).val())
						fieldErrors++;
				}
				
				// Check if Integer	
				if ($(elem).data('fv-integer') === true && fieldErrors <= 0) {
					var pattern = new RegExp(/^\d+$/g);
					errorMsg = MSG_FV_INTEGER;
					if (pattern.test(fieldValue) === false)
						fieldErrors++;
				}
				
				// Check if Float 		
				if ($(elem).data('fv-float') === true && fieldErrors <= 0) {
					var pattern = new RegExp(/^\d*(\.\d{1,2})?$/g);
					errorMsg = MSG_FV_FLOAT;
					if (pattern.test(fieldValue) === false)
						fieldErrors++;
				}

				// Toggle error messages & styles
				if (fieldErrors > 0) {
					div.addClass('has-error has-feedback');
					$(elem).parent().addClass('has-error has-feedback');
					if (!$(elem).is('select'))
						$(elem).after(
							'<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>' +
							'<small class="help-block">' + errorMsg + '</small>'
						);
					else
						$(elem).parent().after('<small class="help-block" style="margin-top: 5px">' + errorMsg + '</small>');
				} else {
					div.addClass('has-success has-feedback');
					$(elem).parent().addClass('has-success has-feedback');
					if (!$(elem).is('select'))
						$(elem).after('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
				}

				// Accumulate Error count
				totalErrors += fieldErrors;
			});

			if (totalErrors > 0)
				$(options.formId).prepend(MSG_ALERT_FORM_ERROR);

			return totalErrors > 0 ? false : true;
		}
	},
	
	// Default AJAX Post
	PostData: function (params) {
		// Check if callback is passed
		var callback = (typeof params.callback !== 'undefined'
			? params.callback : '');

		$.post(params.url, params.data)
			.done(function(result, status) {
				// Execute callback function
				$.isFunction(callback.func)
					? callback.func(callback.args) : '';

				// Reload DT
				(typeof params.dt !== 'undefined'
					? params.dt.ajax.reload() : '');

				var response = result.response;

				// on Success
				if (response.type == 'SUCCESS') {
					BootstrapDialog.closeAll();
					BootstrapDialog.alert({
						type: 'type-primary',
						title: params.title,
						message: params.message,
						callback: function(result) {
							BootstrapDialog.closeAll();
						}
					});

				// on WS Error
				} else {
					STIC.ShowWSError({ formId: params.formId });
				}
			})

			// on Request Error
			.fail(function() {
				STIC.ShowWSError({ formId: params.formId });
			});
	},
	
	// Client Details
	ClientDetails: function (params) {		
		// DT Buttons Text
		var dtBtnNewTxt = '<i class="fa fa-plus"></i> New Client',
		dtBtnEditTxt = '<i class="fa fa-pencil"></i> Edit Client',
		dtBtnDtlTxt = '<i class="fa fa-info-circle"></i> Client Details',
		dtBtnRelTxt = '<i class="fa fa-refresh"></i> Refresh',

		// Modal Form Options
		modalNewFrmContent = $('<div></div>').load(params.formSrcNew),
		modalEditFrmContent = $('<div></div>').load(params.formSrcEdit),
		modalViewContent = $('<div></div>').load(params.viewSrc),
		modalNewTitle = '<i class="fa fa-plus"></i> New ' + params.modTitle,
		modalEditTitle = '<i class="fa fa-pencil"></i> Edit ' + params.modTitle,
		modalViewTitle = '<i class="fa fa-info-circle"></i> ' + params.modTitle,

		// Modal Buttons > Save
		modalBtnSave = {
			label: 'Save',
			icon: 'fa fa-floppy-o',
			cssClass: 'btn-primary',
			action: btnSaveAction
		},

		// Modal Buttons > Cancel
		modalBtnCancel = {
			label: 'Cancel',
			icon: 'fa fa-ban',
			cssClass: 'btn-primary',
			action: function (dialogItself) {
				BootstrapDialog.closeAll();
			}
		},

		// DT Buttons > New
		dtBtnNew = {
			name: 'new',
			text: dtBtnNewTxt,
			className: 'btn-primary',
			action: function (e, dt, node, config) {
				BootstrapDialog.show({
					closable: false,
					title: modalNewTitle,
					message: modalNewFrmContent,
					onshown: modalNewOnShown,
					onhidden: modalOnHidden,
					buttons: [modalBtnSave, modalBtnCancel]
				});
			}
		},

		// DT Buttons > Edit
		dtBtnEdit = {
			name: 'edit',
			enabled: false,
			text: dtBtnEditTxt,
			className: 'btn-danger',
			action: function (e, dt, node, config) {
				BootstrapDialog.show({
					closable: false,
					title: modalEditTitle,
					message: modalEditFrmContent,
					onshown: modalEditOnShown,
					onhidden: modalOnHidden,
					buttons: [modalBtnSave, modalBtnCancel]
				});
			}
		},

		// DT Buttons > Details
		dtBtnDetails = {						
			name: 'details',
			text: dtBtnDtlTxt,	
			enabled: false,
			className: 'btn-primary',
			action: function (e, dt, node, config) {
				BootstrapDialog.show({
					closable: false,
					title: modalViewTitle,
					message: modalViewContent,
					onshown: modalViewOnShown,
					onhidden: function (dialogRef) {
						var modalBody = dialogRef.getModalBody();
						modalBody.find('td[data-cell]').text('');
					},
					buttons: [modalBtnCancel]
				});
			}			
		},		

		// DT Buttons > Refresh
		dtBtnReload = {
			name: 'reload',
			text: dtBtnRelTxt,
			className: 'btn-primary',
			action: function (e, dt, node, config) {
				dt.ajax.reload();
			}
		};

		// Trigger on New Modal OnShown event
		function modalNewOnShown(dialogRef) {
			var modalBody = dialogRef.getModalBody();
			modalBody.find('input[data-field]').val('');
		}

		// Trigger on Edit Modal onshown event
		function modalEditOnShown(dialogRef) {
			var rowData = dt.row('.selected').data(),
				modalBody = dialogRef.getModalBody();
			$.each(rowData, function(name, value) {
				modalBody.find('input[data-field="' + name + '"]').val(value);
				if (name === 'status') {
					modalBody.find('select[data-field="status"]').val(value === 'Active' ? '1' : '0')
					modalBody.find('select[data-field="status"]').selectpicker('refresh');
				}					
			});
		}
		
		// Trigger on View Modal OnShown event
		function modalViewOnShown(dialogRef) {
			var rowData = dt.row('.selected').data(),
				modalBody = dialogRef.getModalBody();
			$.each(rowData, function (name, value) {
				modalBody.find('td[data-cell="' + name + '"]').text(value);
			});
		}

		// Trigger on Modal OnHidden
		function modalOnHidden(dialogRef) {	
			var modalBody = dialogRef.getModalBody();
			modalBody.find('input[data-field]').val('');
			modalBody.find('select[data-field="status"]').val('1');
			modalBody.find('select[data-field="status"]').selectpicker('destroy');
			STIC.ClearHelpBlocks({ formId: params.formId });
			dt.ajax.reload();
		}

		// New & Edit Save Button Action
		function btnSaveAction(dialogRef) {
			// Form Validation
			var isValid = STIC.FormValidation({ formId: params.formId });

			// Proceed if form is valid
			if (isValid) {
				var wsPost = '', postString = '', 
					infoTitle = '', infoMessage = '',
					JSONString = '', JSONObject = {},
					modalBody = dialogRef.getModalBody(),
					pkey = $('input[data-field="' + params.pkey + '"]'),
					elements = modalBody.find('input[data-field], select[data-field]');

				// Switch between insert & update options
				if (pkey.val() != '') {
					wsPost = params.wsUpdate;
					infoTitle = MSG_TITLE_EDIT_REC;
					infoMessage = MSG_INFO_EDIT_REC;
				} else {
					wsPost = params.wsInsert;
					infoTitle = MSG_TITLE_ADD_REC;
					infoMessage = MSG_INFO_ADD_REC;
				}
				
				var input = $(params.formId).find('input[data-fv-unique="true"]'),
					fieldValue = $(input).val(), fieldName = $(input).attr('data-field'),
					postString = '{"' + fieldName + '": "' + fieldValue + '"}';			
				
				// Check for duplicate entry if required
				if (input.length > 0) {
					if (pkey.val() != '')
						$.extend(JSONObject, $.parseJSON('{"' + params.pkey + '": "' + pkey.val() + '"}'));				
					
					$.extend(JSONObject, $.parseJSON(postString));
					$.post(WS_UNIQUE_CHECK[fieldName], JSONObject)
						.done(function (result, status) {
							
							// Proceed with insert if no duplicate records found
							if (result.response.type === 'FAILED') {
								insertUpdateData({
									url: wsPost,
									title: infoTitle,
									message: infoMessage,
									elements: elements
								});
								
							// Show errors if there are duplicate records found
							} else {
								STIC.ShowDuplicateError({
									ukey: fieldName,
									formId: params.formId
								});
							}
						})
						
						// Show WS Error
						.fail(function () {
							STIC.ShowWSError({ formId: params.formId });
						});
				
				// Proceed with insert if not required to check duplicate
				} else {
					insertUpdateData({
						url: wsPost,
						title: infoTitle,
						message: infoMessage,
						elements: elements
					});
				}
			}
		}
		
		// Insert & Update
		function insertUpdateData(o) {
			var postString = '', JSONString = '', 
				JSONObject = {};
			
			// Build post data
			$.each(o.elements, function(idx, elem) {
				var input = $(elem),
					inputValue = input.val(),
					inputField = input.attr('data-field');
				postString = '{"' + inputField + '":"' + inputValue + '"}';
				$.extend(JSONObject, $.parseJSON(postString));
			});
			
			//$.extend(JSONObject, { activation_date: moment(new Date()).format('YYYY-MM-DD') });	

			// Build JSON string
			JSONString = params.objectId + '=' + JSON.stringify(JSONObject);
			
			// Call WS
			STIC.PostData({
				url: o.url,
				data: JSONString,
				title: o.title,
				message: o.message,
				formId: params.formId
			});
		}

		// DT Initialization
		var dt = $('#table-data')
			.DataTable({
				ordering: true,
				searching: true,
				processing: false,
				lengthChange: false,
				dom: '<"dt-toolbar">Bfrtip',
				pageLength: DEFAULT_PAGE_LENGTH,
				columns: params.cd,
				ajax: {
					url: params.wsList,
					dataSrc: function(json) {
						var ds = params.ds.split('.'),
							rec = json[ds[0]][ds[1]][ds[2]];
						return ($.isArray(rec) === true ? rec : (rec !== '' ? [rec] : []));
					}
				},
				buttons: [dtBtnNew, dtBtnEdit, dtBtnDetails, dtBtnReload],
				createdRow: function (row, data, index) {
					if (data.status === 'Active') {
						$(row).addClass('success');
					} else {
						$(row).addClass('warning');
					}
        }
			})
			.on('draw.dt', function (e, settings, data) {
				dt.button('edit:name').disable();
				dt.button('details:name').disable();
				dt.$('tr.selected').removeClass('selected');
			});

		// DT Default Sorting
		dt.column('0:visible').order('asc').draw();

		// DT Row Click Event
		$('#table-data tbody').on('click', 'tr', function () {
			if (dt.row(this).data()[params.pkey] != '') {
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
					dt.button('edit:name').disable();
					dt.button('details:name').disable();
				} else {
					dt.$('tr.selected').removeClass('selected');
					$(this).addClass('selected');
					dt.button('edit:name').enable();
					dt.button('details:name').enable();
				}
			}
		});
	}
}