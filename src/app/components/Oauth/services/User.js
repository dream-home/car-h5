goog.provide('API.Client.User');

/**
 * @record
 */
API.Client.User = function() {}

/**
 * 用户uid 
 * @type {!string}
 * @export
 */
API.Client.User.prototype.id;

/**
 * 手机号 
 * @type {!string}
 * @export
 */
API.Client.User.prototype.mobile;

/**
 * 默认是手机号 
 * @type {!string}
 * @export
 */
API.Client.User.prototype.name;

/**
 * 用户登录凭证， 以后的每次请求，客户端务必将token置入httpheader 
 * @type {!string}
 * @export
 */
API.Client.User.prototype.token;

/**
 * 最近登录时间 
 * @type {!API.Client.date}
 * @export
 */
API.Client.User.prototype.loginTime;

/**
 * 上次用户选择的门店，如果第一次是null
 * @type {!string}
 * @export
 */
API.Client.User.prototype.lastShopId;

