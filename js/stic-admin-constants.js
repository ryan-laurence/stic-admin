// Default Constants
var CONSOLE_LOG = true;
var DEFAULT_ROOT = '/stic-admin/';
var DEFAULT_PAGE_LOC = 'pages/';
var DEFAULT_PAGE_LENGTH = 10;
var DEFAULT_PAGE_FILE_EXT = '.html';
var DEFAULT_WRAPPER_ID = '#main-wrapper';

var DEFAULT_DS = 'response.record-list.record';
var DEFAULT_DS_REPORTS = 'response.report-list.report';

// Generic Dialog Messages
var MSG_TITLE_ADD_REC = '<i class="fa fa-info-circle"></i> Information';
var MSG_TITLE_EDIT_REC = '<i class="fa fa-info-circle"></i> Information';
var MSG_TITLE_DEL_REC = '<i class="fa fa-info-circle"></i> Information';
var MSG_TITLE_CONF_SAVE = '<i class="fa fa-question-circle"></i> Confirm Update';
var MSG_TITLE_CONF_DELETE = '<i class="fa fa-question-circle"></i> Confirm Deletion';
var MSG_TITLE_WS_ERROR = '<i class="fa fa-exclamation-circle"></i> Web Service Error';
var MSG_TITLE_CONF_LOGOUT = '<i class="fa fa-question-circle"></i> Confirm Logout';

var MSG_CONF_SAVE_RECORD = 'This will update the current selected record. Press OK to continue.';
var MSG_CONF_DELETE_RECORD = 'This will delete the selected record. Press OK to continue.';

var MSG_INFO_ADD_REC = 'Success. A new record has been created.';
var MSG_INFO_EDIT_REC = 'Success. The selected record was updated.';
var MSG_INFO_DEL_REC = 'Success. The selected record was deleted.';
var MSG_INFO_WS_ERROR = 'Unable to commit changes due to web service error.';

// Other Dialog Messages
var MSG_TITLE_BASIC = '<i class="fa fa-info-circle"></i> Information';

// 
var CD_CLIENT_LIST = [
	{ data: 'client_id', visible: false, searchable: false },	
	{ data: 'license_id', visible: false, searchable: false },	
	{ data: 'cl_id', visible: false, searchable: false },	
	{ data: 'client_contact', visible: false },
	{ data: 'client_address', visible: false },
	{ data: 'client_email', visible: false },
	{ data: 'client_phone', visible: false },
	{ data: 'client_mobile', visible: false },
	{ data: 'license_key', visible: false, searchable: false },
	{ data: 'client_name' },	
	{ data: 'license_duration' },
	{ data: 'effectivity_date' },	
	{ data: 'expiry_date' },
	{ data: 'exp_count' }
];
var VIEW_CLIENTS = 'pages/clients-details.html';
var FRM_CLIENTS = 'pages/clients-form.html';
var WS_CLIENT_LIST = '/stic-admin/services/ClientsInfoServices/getAllClientsList?response=application/json&';
var WS_CLIENT_INSERT = '/stic-admin/services/ClientsInfoServices/addClients?response=application/json&';
var WS_CLIENT_UPDATE = '/stic-admin/services/ClientsInfoServices/updateClients?response=application/json&';
var WS_CLIENT_DELETE = '/stic-admin/services/ClientsInfoServices/updateClientsByIsDeleted?response=application/json&isDeleted=0&clientId=';