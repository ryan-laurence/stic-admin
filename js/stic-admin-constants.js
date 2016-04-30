// Default Constants
var CONSOLE_LOG = true;
var DEFAULT_ROOT = '/stic-admin/';
var DEFAULT_PAGE_LOC = 'pages/';
var DEFAULT_PAGE_LENGTH = 10;
var DEFAULT_PAGE_FILE_EXT = '.html';
var DEFAULT_WRAPPER_ID = '#main-wrapper';

// Default Datasource
var DEFAULT_DS = 'response.record-list.record';
var DEFAULT_DS_REPORTS = 'response.report-list.report';

// Default DataTables Settings
var DEFAULT_DT_SETTINGS = {
	pagingType: 'full',
	language: {
		paginate: {
			first: '<i class="fa fa-fast-backward"></i> First',
			previous: '<i class="fa fa-backward"></i> Previous',							
			next: 'Next <i class="fa fa-forward"></i>',
			last: 'Last <i class="fa fa-fast-forward"></i>'
		}
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
	{ data: 'client_name' },		
	{ data: 'license_key' },
	{ data: 'license_status' },
	{ data: 'license_duration' },
	{ data: 'activation_date' },		
	{ data: 'expiration_date' },	
	{ data: 'date_modified', visible: false, searchable: false }
];
var VIEW_LICENSE_DETAILS = 'pages/licenses-details.html';
var FORM_NEW_LICENSE_DETAILS = 'pages/licenses-form-new.html';
var FORM_EDIT_LICENSE_DETAILS = 'pages/licenses-form-edit.html';
var WS_LIST_LICENSES = '/stic-admin/services/ClientLicensesInfoServices/getAllClientLicensesList?response=application/json&';
var WS_INSERT_LICENSES = '/stic-admin/services/ClientsInfoServices/addNewClientLicense?response=application/json&';
var WS_UPDATE_LICENSES = '/stic-admin/services/ClientLicensesInfoServices/updateClientLicenses?response=application/json&';

// Users
var WS_USER_CHECK = '/scaletech/services/UserInfoServices/getUserByNamePassList?response=application/json&';
var WS_USER_AUTHENTICATE = '/scaletech/services/UserInfoServices/checkIfUserIsAuthentication?response=application/json&';
var WS_USER_REMOVE_FROM_AUDIT = '/scaletech/services/UserInfoServices/removeUser?response=application/json&';

// Button Labels
var BTN_LABEL_CONFIRM_UPDATE = '<i class="fa fa-pencil"></i> Confirm Update';
var BTN_LABEL_CANCEL_UPDATE = '<i class="fa fa-ban"></i> Cancel';

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
var MSG_TITLE_WS_ERROR = '<i class="fa fa-exclamation-circle"></i> Web Service Error';
var MSG_TITLE_CONFIRM_LOGOUT = '<i class="fa fa-info-circle"></i> Confirm Logout';
var MSG_TITLE_CONFIRM_UPDATE = '<i class="fa fa-question-circle"></i> Confirm Update';
var MSG_TITLE_CONFIRM_DELETE = '<i class="fa fa-question-circle"></i> Confirm Deletion';

// CRUD Messages
var MSG_INFO_ADD_REC = '<strong>Success</strong>. A new record has been <strong>created</strong> in the system.';
var MSG_INFO_EDIT_REC = '<strong>Success</strong>. The selected record was <strong>updated</strong> in the system.';
var MSG_INFO_DEL_REC = '<strong>Success</strong>. The selected record was <strong>deleted</strong> from the system.';
var MSG_INFO_WS_ERROR = '<div class="alert alert-danger" role="alert" style="margin-bottom: 5px;"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> Your request was <strong>not successful</strong> because there was an <strong>error</strong> in the Web Service response. If issue still persists, please contact your System Developer.</div>';

// Confirm Messages
var MSG_CONFIRM_LOGOUT = 'Are you sure you want to logout of the system?';
var MSG_CONFIRM_DELETE_RECORD = '<div class="alert alert-danger" role="alert" style="margin-bottom: 5px;"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> The changes you are requesting will <strong>delete</strong> the selected record from the system. Please <strong>confirm</strong> if you want to perform this action. Press <strong>OK</strong> to continue.</div>';
var MSG_CONFIRM_UPDATE_RECORD = '<div class="alert alert-danger" role="alert" style="margin-bottom: 5px;"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i>You are about to <strong>update</strong> an existing license which will have an impact on the client\'s side. Please <strong>confirm</strong> if you want to perform this action. Press <strong>Confirm Update</strong> to continue.</div>';

// Alert Messages
var MSG_ALERT_LOGIN_FORM_ERROR = '<div class="alert alert-danger" role="alert" style="text-align: left; margin-bottom: 20px;"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> Your request was <strong>not submitted</strong> because of the following <strong>errors</strong>. Change the value of the field(s) that contains errors and try again.</div>';
var MSG_ALERT_INVALID_OLD_PASS = '<div class="alert alert-danger" role="alert"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> The changes you requested were <strong>not submitted</strong> because you provided an <strong>invalid old password</strong>. Change the value of the field(s) that contains errors and try again.</div>';
var MSG_ALERT_INVALID_LOGIN = '<div class="alert alert-danger" role="alert" style="text-align: left; margin-bottom: 20px;"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> You are <strong>not allowed</strong> to access the system. Please enter a valid <strong>Username</strong> and <strong>Password</strong> to continue.</div>';
var MSG_ALERT_FORM_ERROR = '<div class="alert alert-danger" role="alert"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> The changes you requested were <strong>not submitted</strong> because of the following <strong>errors</strong>. Change the value of the field(s) that contains errors and try again.</div>';
var MSG_ALERT_DUPLICATE_REC = '<div class="alert alert-danger" role="alert"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> The changes you requested were <strong>not submitted</strong> because they would create <strong>duplicate data</strong> in the system. Change the value of the field(s) that contains duplicate data and try again.</div>';
var MSG_ALERT_WS_ERROR = '<div class="alert alert-danger" role="alert"><i class="fa fa-exclamation-circle fa-4x fa-pull-left"></i> Your request was <strong>not successful</strong> because there was an <strong>error</strong> in the Web Service response. If issue still persists, please contact your System Developer.</div>';