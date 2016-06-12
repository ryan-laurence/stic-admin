// Default Constants
var CONSOLE_LOG = true;
var DEFAULT_ROOT = '/stic-admin/';
var DEFAULT_PAGE_LOC = 'pages/';
var DEFAULT_COOKIE_LIFE = 1;
var DEFAULT_PAGE_LENGTH = 10;
var DEFAULT_PAGE_FILE_EXT = '.html';
var DEFAULT_DATE_FORMAT = 'MM/DD/YYYY';
var DEFAULT_WRAPPER_ID = '#main-wrapper';
var DEFAULT_COOKIE_USERID = 'stic-admin-userid';
var DEFAULT_COOKIE_USERNAME = 'stic-admin-username';

// Default Datasource
var DEFAULT_DS = 'response.record-list.record';
var DEFAULT_DS_REPORTS = 'response.report-list.report';

// Default DataTables Settings
var DEFAULT_DT_SETTINGS = {
	processing: false,
	lengthChange: false,
	pagingType: 'full',
	language: {
		paginate: {		
			next: '<i class="fa fa-forward"></i>',
			last: '<i class="fa fa-fast-forward"></i>',
			previous: '<i class="fa fa-backward"></i>',
			first: '<i class="fa fa-fast-backward"></i>'
		},
		processing: 
			'<div class="indicator">' +
				'<i class="fa fa-cog fa-spin fa-2x fa-fw margin-bottom"></i> ' +
				'Please wait, loading data.' +
			'</div>',
		search: '<i class="fa fa-search"></i>'
	}
}

// Clients
var CD_CLIENT_LIST = [
	{ data: 'client_id', visible: false, searchable: false },	
	{ data: 'client_address', visible: false, searchable: false },
	{ data: 'client_name' },
	{ data: 'client_contact' },	
	{ data: 'client_email' },
	{ data: 'client_phone', visible: false, searchable: false },
	{ data: 'client_mobile', visible: false, searchable: false },
	{ data: 'status' },
	{ data: 'date_modified' }
	
];
var CD_CLIENT_LOOKUP = [
	{ data: 'client_id', visible: false, searchable: false },	
	{ data: 'client_address', visible: false, searchable: false },
	{ data: 'client_name' },
	{ data: 'client_contact' },	
	{ data: 'client_email', visible: false, searchable: false },
	{ data: 'client_phone', visible: false, searchable: false },
	{ data: 'client_mobile', visible: false, searchable: false },
	{ data: 'status' },
	{ data: 'date_modified' }
	
];
var FORM_NEW_CLIENT_DETAILS = 'pages/clients-form-new.html';
var FORM_EDIT_CLIENT_DETAILS = 'pages/clients-form-edit.html';
var VIEW_CLIENT_DETAILS = 'pages/clients-details.html';
var WS_CLIENT_LIST = '/stic-admin/services/ClientsInfoServices/getAllClientsList?response=application/json&';
var WS_CLIENT_INSERT = '/stic-admin/services/ClientsInfoServices/addClients?response=application/json&';
var WS_CLIENT_UPDATE = '/stic-admin/services/ClientsInfoServices/updateClients?response=application/json&';
var WS_CLIENT_DELETE = '/stic-admin/services/ClientsInfoServices/updateClientsByIsDeleted?response=application/json&status=0&';

// Client Licenses
CD_LIST_LICENSES = [
	{ data: 'cl_id', visible: false, searchable: false },	
	{ data: 'client_id', visible: false, searchable: false },	
	{ data: 'client_name', visible: false, searchable: false },		
	{ data: 'pc_number' },
	{ data: 'hd_serial_number' },
	{ data: 'license_key' },
	{ data: 'license_status' },
	{ data: 'license_duration' },
	{ data: 'activation_date' },		
	{ data: 'expiration_date', name: 'expiration_date' },	
	{ data: 'date_modified', visible: false, searchable: false }
];
var VIEW_LICENSE_DETAILS = 'pages/licenses-details.html';
var FORM_NEW_LICENSE_DETAILS = 'pages/licenses-form-new.html';
var FORM_EDIT_LICENSE_DETAILS = 'pages/licenses-form-edit.html';
var WS_LIST_LICENSES = '/stic-admin/services/ClientLicensesInfoServices/getAllClientLicensesList?response=application/json&';
var WS_INSERT_LICENSES = '/stic-admin/services/ClientsInfoServices/addNewClientLicense?response=application/json&';
var WS_UPDATE_LICENSES = '/stic-admin/services/ClientLicensesInfoServices/updateClientLicenses?response=application/json&';

// Users
var WS_USER_CHECK = '/stic-admin/services/UserInfoServices/getUserByNamePassList?response=application/json&';
var WS_USER_AUTHENTICATE = '/stic-admin/services/UserInfoServices/checkIfUserIsAuthentication?response=application/json&';
var WS_USER_REMOVE_FROM_AUDIT = '/stic-admin/services/UserInfoServices/removeUser?response=application/json&';

// Report Summary
var CD_REPORT_CLIENT_LICENSES = [
	{ data: 'client_name', name: 'client_name' },
	{ data: 'pc_number', name: 'pc_number' },
	{ data: 'hd_serial_number', name: 'hd_serial_number' },
	{ data: 'license_key', name: 'license_key' },
	{ data: 'license_duration', name: 'license_duration' },
	{ data: 'license_status', name: 'license_status' },
	{ data: 'generation_date', name: 'generation_date' },
	{ data: 'activation_date', name: 'activation_date' },
	{ data: 'expiration_date', name: 'expiration_date' }
];
var REPORT_TITLE_CLIENT_LICENSES = 'Client Licenses Summary';
var WS_REPORT_CLIENT_LICENSES = '/stic-admin/services/ClientLicensesInfoServices/getLicenseKeyByClientsList?response=application/json&';

// Button Labels
var BTN_LABEL_NEW_RECORD = '<i class="fa fa-plus"></i>';
var BTN_LABEL_EDIT_RECORD = '<i class="fa fa-pencil"></i>';
var BTN_LABEL_DELETE_RECORD = '<i class="fa fa-trash-o"></i>';
var BTN_LABEL_DETAILS_RECORD = '<i class="fa fa-info-circle"></i>';
var BTN_LABEL_REFRESH_RECORD = '<i class="fa fa-refresh"></i>';
var BTN_LABEL_CONFIRM_UPDATE = '<i class="fa fa-pencil"></i> Confirm Update';
var BTN_LABEL_CONFIRM_LOGOUT = '<i class="fa fa-sign-out"></i> Confirm Logout';
var BTN_LABEL_CANCEL = '<i class="fa fa-ban"></i> Cancel';
var BTN_LABEL_COPY = '<i class="fa fa-clone"></i>';
var BTN_LABEL_EXPORT_CSV = '<i class="fa fa-file-text-o"></i>';
var BTN_LABEL_EXPORT_EXCEL = '<i class="fa fa-file-excel-o"></i>';
var BTN_LABEL_EXPORT_PDF = '<i class="fa fa-file-pdf-o"></i>';
var BTN_LABEL_PRINT_RECORD = '<i class="glyphicon glyphicon-print"></i>';

// Button Title Attribute
var BTN_TITLE_NEW_RECORD = 'New Data';
var BTN_TITLE_EDIT_RECORD = 'Edit Data';
var BTN_TITLE_DELETE_RECORD = 'Delete Data';
var BTN_TITLE_REFRESH_RECORD = 'Refresh Data Table';
var BTN_TITLE_COPY = 'Copy Data to Clipboard';
var BTN_TITLE_EXPORT_CSV = 'Export Data to CSV File';
var BTN_TITLE_EXPORT_EXCEL = 'Export Data to Excel File';
var BTN_TITLE_EXPORT_PDF = 'Export Data to PDF File';
var BTN_TITLE_PRINT_RECORD = 'Print Data';

// Form Validation Messages
var MSG_FV_NOTEMPTY = 'This field is required and should not be empty.';
var MSG_FV_SPECIAL_CHARS = 'Special and non alphanumeric characters are not allowed.';
var MSG_FV_INTEGER = 'An integer value is required for this field. (e.g. 1999)';
var MSG_FV_FLOAT = 'The correct numeric formats are ".99", "1999.99", "1999.9" or "1999".';

// Message Title
var MSG_TITLE_INFO = '<i class="fa fa-info-circle"></i> Information';
var MSG_TITLE_ADD_REC = '<i class="fa fa-info-circle"></i> Information';
var MSG_TITLE_EDIT_REC = '<i class="fa fa-info-circle"></i> Information';
var MSG_TITLE_DEL_REC = '<i class="fa fa-info-circle"></i> Information';

// CRUD Messages
var MSG_INFO_ADD_REC = '<div class="alert alert-success all-middle no-margin-bottom" role="alert"><i class="fa fa-check-circle fa-2x"></i> The new record was created successfully in the system.</div>';
var MSG_INFO_EDIT_REC = '<div class="alert alert-success all-middle no-margin-bottom" role="alert"><i class="fa fa-check-circle fa-2x"></i> The selected record was updated successfully in the system.</div>';
var MSG_INFO_DEL_REC = '<div class="alert alert-success all-middle no-margin-bottom" role="alert"><i class="fa fa-check-circle fa-2x"></i> The selected record was deleted successfully from the system.</div>';
var MSG_INFO_WS_ERROR = '<div class="alert alert-danger no-margin-bottom" role="alert"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> Your request was not successful because there was an error in the Web Service response. If issue still persists, please contact your System Developer.</div>';

// Confirm Messages
var MSG_CONFIRM_LOGOUT = '<div class="alert alert-info no-margin-bottom" role="alert"><i class="fa fa-question-circle fa-3x fa-pull-left"></i> Your request will log you out of the system. Please make sure all changes are saved. Press Confirm Logout to continue.</div>';
var MSG_CONFIRM_DELETE_RECORD = '<div class="alert alert-danger no-margin-bottom" role="alert"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> The changes you are requesting will delete the selected record from the system. Please confirm if you want to perform this action. Press Confirm Delete to continue.</div>';
var MSG_CONFIRM_UPDATE_RECORD = '<div class="alert alert-danger no-margin-bottom" role="alert"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i>You are about to update an existing license which will have an impact on the client\'s side. Please confirm if you want to perform this action. Press Confirm Update to continue.</div>';

// Alert Messages
var MSG_ALERT_LOGIN_FORM_ERROR = '<div class="alert alert-danger" role="alert" style="text-align: left; margin-bottom: 20px;"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> Your request was not submitted because of the following errors. Change the value of the field(s) that contains errors and try again.</div>';
var MSG_ALERT_INVALID_OLD_PASS = '<div class="alert alert-danger" role="alert"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> The changes you requested were not submitted because you provided an invalid old password. Change the value of the field(s) that contains errors and try again.</div>';
var MSG_ALERT_INVALID_LOGIN = '<div class="alert alert-danger" role="alert" style="text-align: left; margin-bottom: 20px;"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> You are not allowed to access the system. Please enter a valid Username and Password to continue.</div>';
var MSG_ALERT_FORM_ERROR = '<div class="alert alert-danger all-middle" role="alert"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> The changes you requested were not submitted because of the following errors. Change the value of the field(s) that contains errors and try again.</div>';
var MSG_ALERT_DUPLICATE_REC = '<div class="alert alert-danger" role="alert"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> The changes you requested were not submitted because they would create duplicate data in the system. Change the value of the field(s) that contains duplicate data and try again.</div>';
var MSG_ALERT_WS_ERROR = '<div class="alert alert-danger" role="alert"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> Your request was not successful because there was an error in the Web Service response. If issue still persists, please contact your System Developer.</div>';