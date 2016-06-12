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
					className: 'btn-primary',
					text: BTN_LABEL_REFRESH_RECORD,
					titleAttr: BTN_TITLE_REFRESH_RECORD,					
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
	CreateCookie: function (name, value, hours) {
		if (hours) {
			var date = new Date();
			date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
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
		this.CreateCookie(name, '', -DEFAULT_COOKIE_LIFE);
	},

	// Remove from Audit Trail
	RemoveToContext: function () {
		if (this.ReadCookie(DEFAULT_COOKIE_USERNAME) !== null) {
			var JSONObject = {
				user_name: this.ReadCookie(DEFAULT_COOKIE_USERNAME)
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
		var userId = this.ReadCookie(DEFAULT_COOKIE_USERID),
			userName = this.ReadCookie(DEFAULT_COOKIE_USERNAME),
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
				this.EraseCookie(DEFAULT_COOKIE_USERID);
				this.EraseCookie(DEFAULT_COOKIE_USERNAME);
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
						STIC.CreateCookie(DEFAULT_COOKIE_USERID, user.user_id, DEFAULT_COOKIE_LIFE);
						STIC.CreateCookie(DEFAULT_COOKIE_USERNAME, user.user_name, DEFAULT_COOKIE_LIFE);
						
						window.location = DEFAULT_ROOT + 'main.html';
					
					// Not Authorized
					} else {
						// Clear error messages & styles
						$('.login-form').find('div.form-group')
							.removeClass('has-error has-feedback')
							.removeClass('has-success has-feedback');
						$('.login-form').find('div.form-group').find('span.glyphicon, small.help-block')
							.remove();	
						$('.login-form').find('div.alert-danger')
							.remove();
						$('.login-form').find('div.alert-info')
							.hide();
						
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
			$('.login-form').find('div.alert-danger').remove();
			$('.login-form').find('div.alert-info').hide();				
			$('.login-form hr:first').after(MSG_ALERT_LOGIN_FORM_ERROR);
		}
	},
	
	// Confirm Logout
	ConfirmLogout: function () {
		BootstrapDialog.confirm({
			title: MSG_TITLE_INFO,
			message: MSG_CONFIRM_LOGOUT,
			btnOKLabel: BTN_LABEL_CONFIRM_LOGOUT,
			btnCancelLabel: BTN_LABEL_CANCEL,
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
		this.EraseCookie(DEFAULT_COOKIE_USERID);
		this.EraseCookie(DEFAULT_COOKIE_USERNAME);
		window.location = DEFAULT_ROOT;
	},
	
	// Navigation Tabs
	NavTabs: function () {		
		var first_tab = $('#nav-wrapper > li:first-child > a')
		
		// Navigation onClick Event
		$('[data-mod-name]').on('click', function () {
			var modName = $(this).attr('data-mod-name');

			// Clear active modules style
			$('#nav-wrapper')
				.find('li.active')
				.removeClass('active');

			// Set active module style
			if (modName != '') {
				$('a[data-mod-name="' + modName + '"]')
					.parent('li')
					.addClass('active');
			} 

			// Load module page
			STIC.LoadPage({ 
				modName: modName 
			});							
			
		});
		
		$(first_tab).trigger('click');
	},
	
	// Show Duplicate Error messages on form after submit
	ShowDuplicateError: function (params) {
		var div = $(params.formId).find('label[for="' + params.ukey + '"]').parent(),
			input = $(params.formId).find('input[data-field="' + params.ukey + '"]');
		
		// Remove error messages & styles
		div
			.removeClass('has-error has-feedback')
			.removeClass('has-success has-feedback');
		input.next('span.glyphicon, small.help-block')
			.remove();
		$(params.formId).find('div.alert-info')
			.hide();

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
				title: MSG_TITLE_INFO,
				message: MSG_INFO_WS_ERROR,
				callback: function (result) {
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
		$(params.formId).find('div.alert-danger, span.glyphicon, small.help-block')
			.remove();
		$(params.formId).find('div.alert-info')
			.show();
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

			if (totalErrors > 0) {
				$(options.formId).find('div.alert-info').hide();
				$(options.formId).prepend(MSG_ALERT_FORM_ERROR);
			}				

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
					var pattern = new RegExp(/Duplicate entry/g);
					if (pattern.test(response.message) === true) {
						var ukey = response.message.match(/(\'\w*\')(?!.*\'\w*\')/g);
						STIC.ShowDuplicateError({
							formId: '#formClientDetails'	,
							ukey: ukey[0].replace(/\'/g, '')													
						})
					} else {
						STIC.ShowWSError({ formId: params.formId });
					}
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
			className: 'btn-primary',
			text: BTN_LABEL_NEW_RECORD,
			titleAttr: 'New Client',
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
			className: 'btn-danger',
			text: BTN_LABEL_EDIT_RECORD,
			titleAttr: 'Edit Client',			
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
			enabled: false,
			className: 'btn-primary',
			text: BTN_LABEL_DETAILS_RECORD,	
			titleAttr: 'Client Details',	
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
			className: 'btn-primary',
			text: BTN_LABEL_REFRESH_RECORD,
			titleAttr: 'Refresh Clients List',				
			action: function (e, dt, node, config) {
				dt.ajax.reload();
			}
		};

		// Trigger on New Modal OnShown event
		function modalNewOnShown(dialogRef) {
			var modalBody = dialogRef.getModalBody();
			modalBody.find('input[data-field]').val('');
		}

		// Trigger on Edit Modal OnShown event
		function modalEditOnShown(dialogRef) {
			var rowData = dt.row('.selected').data(),
				modalBody = dialogRef.getModalBody(),
			
			// For checking active licenses
			params = { 
				license_status: 1,
				clientLicenseId: rowData.client_id 
			};
				
			// Check if client have active licenses
			$.post(WS_LIST_LICENSES, params)
				.done(function (results, status) {
					
					// Remove elements for status
					modalBody.find('select[data-field="status"]').selectpicker('destroy');
					modalBody.find('select[data-field="status"]').remove();
					modalBody.find('input[data-field="status"]').remove();
					modalBody.find('input[data-value="status"]').remove();
					
					// Append input (readonly) 
					if (results.response.type === 'SUCCESS') {						
						modalBody.find('#status-box').append(
							'<input type="hidden" data-field="status" value="1">' +
							'<input type="text" class="form-control" data-value="status" value="Active" readonly>'
						);
						
					// Append select
					} else {					
						modalBody.find('#status-box').append(
							'<select class="form-control" data-field="status">' +
								'<option value="1">Active</option>' +
								'<option value="0">Inactive</option>' +
							'</select>'
						);						
					}	

					// Load form values
					$.each(rowData, function (name, value) {						
						if (name === 'status') {
							modalBody.find('select[data-field="status"]').val(value === 'Active' ? '1' : '0')
							modalBody.find('select[data-field="status"]').selectpicker();
						}	else {
							modalBody.find('input[data-field="' + name + '"]').val(value);							
						}				
					});						
				})
				
				// Show WS Error
				.fail(function () {
					STIC.ShowWSError({ formId: params.formId });
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
				if (pkey.length > 0 && pkey.val() != '') {
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
									dt: dt,
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
						dt: dt,
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
			
			$.extend(JSONObject, { 
				activation_date: moment(new Date()).format('YYYY-MM-DD'), 
				license_status: 0
			});	

			// Build JSON string
			JSONString = params.objectId + '=' + JSON.stringify(JSONObject);
			
			// Call WS
			STIC.PostData({
				dt: o.dt,
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
	},
	
	// Set PDF Styles
	SetPDFStyles: function (params) {
		var doc = params.doc,			
			footerData = params.footerData || [];
		
		// Get Column Widths & Set Footer Columns
		var widths = [], footerCols = [];
		$.each(params.cd, function (idx, column) {
			if (typeof column.visible === 'undefined') {

				// Get Column Width
				var width = typeof column.width !== 'undefined' ? column.width : '*';
				widths.push(width);

				// Set Table Footer
				if (footerData.length > 0) {
					var hasMatch = 0;
					$.each(footerData, function (idy, footer) {
						if (footer.data === column.data) {
							hasMatch++;
							footerCols.push({
								text: footer.text,
								style: 'tableFooter',
								alignment: 'left'
							});
						} 
					});
					if (hasMatch === 0)
						footerCols.push({ text: '' });
				} else {
					footerCols.push({ text: '' });
				}					
			}
		});		
		
		// Default Styles
		doc.defaultStyle.columnGap = 5;

		// Table Header Styles overrides
		doc.styles.tableHeader.fillColor = '';
		doc.styles.tableHeader.color = '#000000';
		doc.styles.tableHeader.alignment = 'left';
		doc.styles.tableHeader.margin = [0, 12, 0, 2];

		// Table Body Styles overrides
		doc.styles.tableBodyOdd.fillColor = '';
		doc.styles.tableBodyEven.fillColor = '';

		// Table Footer Styles overrides
		doc.styles.tableFooter.bold = true;
		doc.styles.tableFooter.fillColor = '';
		doc.styles.tableFooter.color = '#000000';

		// Table Widths
		doc.content[1]['table']['widths'] = widths;

		// Table Layout
		doc.content[1]['layout'] = {
			hLineWidth: function (i, node) {
				return (i === 1 || i === (node.table.body.length - 1)) ? 1 : 0;
			},
			hLineColor: function (i, node) {
				return (i === 1 || i === (node.table.body.length - 1)) ? 'black' : '';
			},
			vLineWidth: function (i, node) { return 0; },
			vLineColor: function (i, node) { return ''; },
			paddingLeft: function (i, node) { return 2; },
			paddingRight: function (i, node) { return 2; },
			paddingTop: function (i, node) { return 6; },
			paddingBottom: function (i, node) { return 6; }
		};
		
		// Table Footer
		var rowCount = doc.content[1]['table']['body'].length;
		doc.content[1]['table']['body'].splice(rowCount, 0, footerCols);
		
		return doc;
	},		

	
	// Summary Reports
	SummaryReport: function (params) {

		// License Status
		$('#license_status').selectpicker();	
	
		var setDTP = function (dp1, dp2) {
			$(dp1).datetimepicker({ 
				format: DEFAULT_DATE_FORMAT 
			});
			$(dp2).datetimepicker({ 
				format: DEFAULT_DATE_FORMAT 
			});
			$(dp1).on('dp.change', function (e) {
				$(dp2).data('DateTimePicker').minDate(e.date);
			});
			$(dp2).on('dp.change', function (e) {
				$(dp1).data('DateTimePicker').maxDate(e.date);
			});
		}
		
		// Set DP
		setDTP('#gd-dp1', '#gd-dp2');
		setDTP('#ad-dp1', '#ad-dp2');
		setDTP('#ed-dp1', '#ed-dp2');

		// DT Buttons > Copy
		dtBtnCopy = {
			name: 'copy',
			extend: 'copyHtml5',
			className: 'btn-primary',
			text: BTN_LABEL_COPY,
			titleAttr: BTN_TITLE_COPY,
			exportOptions: {
				columns: ':visible',
				modifier: {
					page: 'current'
				}
			}
		},

		// DT Buttons > CSV
		dtBtnCSV = {
			name: 'csv',
			extend: 'csvHtml5',
			className: 'btn-primary',
			text: BTN_LABEL_EXPORT_CSV,
			titleAttr: BTN_TITLE_EXPORT_CSV,
			exportOptions: {
				columns: ':visible'
			}
		},

		// DT Buttons > Excel
		dtBtnExcel = {
			name: 'excel',
			extend: 'excelHtml5',
			className: 'btn-primary',
			text: BTN_LABEL_EXPORT_EXCEL,
			titleAttr: BTN_TITLE_EXPORT_EXCEL,
			exportOptions: {
				columns: ':visible'
			}
		},

		// DT Buttons > PDF
		dtBtnPDF = {
			name: 'pdf',
			extend: 'pdfHtml5',
			title: params.title,
			className: 'btn-primary',
			text: BTN_LABEL_EXPORT_PDF,
			titleAttr: BTN_TITLE_EXPORT_PDF,
			customize: dtPDFPrintCustom,
			orientation: 'landscape',
			pageSize: 'legal',
			exportOptions: {
				columns: ':visible'
			}
		},
		
		// DT Buttons > Web Page Print
		dtBtnPrint = {						
			name: 'print',
			extend: 'print',		
			enabled: false,
			autoPrint: false,		
			title: params.title,	
			className: 'btn-primary',
			text: BTN_LABEL_PRINT_RECORD,
			titleAttr: BTN_TITLE_PRINT_RECORD,
			customize: dtWebPagePrintCustom,		
			exportOptions: { 
				columns: ':visible' 
			}				
		};
		
		// DT Init
		var dtSummary = $('#table-summary')
			.DataTable({
				pageLength: 10,
				ordering: true,
				searching: false,
				columns: params.cd,			
				ajax: {
					url: params.ws,
					dataSrc: function (json) {
						var ds = params.ds.split('.'),
							rec = json[ds[0]][ds[1]][ds[2]];
						return ($.isArray(rec) === true ? rec : (rec !== '' ? [rec] : []));
					}
				},
				dom: '<"dt-toolbar">B<"dt-total">rtip',
				buttons: [dtBtnCopy, dtBtnCSV, dtBtnExcel, dtBtnPrint]
			})
			.on('draw.dt', function (e, settings, data) {
				var btns = [
					'copy:name', 
					'csv:name', 
					'excel:name', 
					'pdf:name', 
					'print:name'
				];			
				dtSummary.data().length > 0 ?
					dtSummary.buttons(btns).enable() :
					dtSummary.buttons(btns).disable();
			});

		// DT Default Sorting
		dtSummary.column('expiration_date:name').order('asc').draw();
		
		// Search Report
		$('#search-report').on('click', function () {
			var JSONObject = {},
				JSONString = '';
			
			if ($('#client_name').val() !== '') {
				$.extend(JSONObject, { client_name: $('#client_name').val() });	
			}
			
			if ($('#pc_number').val() !== '') {
				$.extend(JSONObject, { pc_number: $('#pc_number').val() });	
			}
			
			if ($('#hd_serial_number').val() !== '') {
				$.extend(JSONObject, { hd_serial_number: $('#hd_serial_number').val() });	
			}
			
			if ($('#license_key').val() !== '') {
				$.extend(JSONObject, { license_key: $('#license_key').val() });	
			}
			
			if ($('#license_status').val() !== '') {
				$.extend(JSONObject, { license_status: $('#license_status').val() });	
			}
			
			if ($('#gd-start-date').val() !== '' && $('#gd-end-date').val() !== '') {
				$.extend(JSONObject, { 
					generateDateFrom: $('#gd-start-date').val(),
					generateDateTo: $('#gd-end-date').val(),					
				});	
			}
			
			if ($('#ad-start-date').val() !== '' && $('#ad-end-date').val() !== '') {
				$.extend(JSONObject, { 
					activationDateFrom: $('#ad-start-date').val(),
					activationDateTo: $('#ad-end-date').val(),					
				});	
			}
			
			if ($('#ed-start-date').val() !== '' && $('#ed-end-date').val() !== '') {
				$.extend(JSONObject, { 
					expirationDateFrom: $('#ed-start-date').val(),
					expirationDateTo: $('#ed-end-date').val(),					
				});	
			}
			
			JSONString = 'filtersParameters=' + JSON.stringify(JSONObject);
			dtSummary.ajax.url(params.ws + JSONString).load();			
		});		
		
		// Reset Report
		$('#reset-report').on('click', function () {				
			$('.form-control').val('');
			$('#license_status').selectpicker('val', '');
			dtSummary.ajax.url(params.ws).load();
		});
		
		// Customize PDF Print Output
		function dtPDFPrintCustom(doc) {	
			// Set Default Styles
			var pdfDoc = STIC.SetPDFStyles({
				doc: doc,
				cd: params.cd
			});

			// Set add. messages
			/*var fromLabel = { width: 30, bold: true, text: 'From :' },			
				toLabel = { width: 30, bold: true, text: 'To :' },
				fromDate = { width: 'auto', text: $('#start-date').val() },
				toDate = { width: 'auto', text: $('#end-date').val() };
			pdfDoc.content.splice(1, 0, { columns: [fromLabel, fromDate] });
			pdfDoc.content.splice(2, 0, { columns: [toLabel, toDate] });*/
		}
		
		// Customize Web Page Print Output
		function dtWebPagePrintCustom(win) {
			$(win.document.body)
				.css('background', 'none')
				.css('font-weight', 'normal')
				.css('font-family', 'Monospaced');						
			// Title
			$(win.document.body).find('h1')								
				.css('font-size', '16pt')
				.css('text-align', 'center');							
			// Message
			$(win.document.body).find('div')							
				.css('font-size', '11pt')
				.css('text-align', 'left')
				.css('margin', '20px 0px 15px 0px')
				.html('');						
			// Data Table
			$(win.document.body).find('table')
				.removeClass('display')
				.removeClass('compact');							
			$(win.document.body).find('table th')
				.css('font-size', '11pt')
				.css('text-align', 'left')
				.css('padding-left', '0px');							
			$(win.document.body).find('table td')							
				.css('font-size', '10pt')
				.css('text-align', 'left')
				.css('padding-left', '0px')
				.css('padding-top', '10px')
				.css('padding-bottom', '10px')
				.css('font-weight', 'normal');							
		}
	}
}


