const ServiceBusServiceBase = require('azure-sb/lib/servicebusservicebase');
const WebResource = require('azure-common/lib/http/webresource');
const ServiceBusService = require('azure-sb/lib/servicebusservice');
const SharedAccessSignature = require('azure-sb/lib/internal/sharedaccesssignature');
const notificationHubResult = require('azure-sb/lib/models/notificationhubresult');

var util = require('util');
var azureCommon = require('azure-common');
var azureutil = azureCommon.util;
var crypto = require('crypto');

ServiceBusService.prototype.createOrUpdateNotificationHub = function(
  hubPath,
  optionsOrCallback,
  callback,
) {
  validateHubName(hubPath);
  this._createOrUpdateResource(
    hubPath,
    notificationHubResult,
    null,
    optionsOrCallback,
    callback,
  );
};

SharedAccessSignature.prototype.generateSignature = function(
  targetUri,
  expirationDate,
) {
  //console.log(targetUri);
  var targetUri = encodeURIComponent(targetUri.toLowerCase()).toLowerCase();

  var expirationDate = Math.round(azureCommon.date.minutesFromNow(5) / 1000);
  var signature = this._generateSignature(targetUri, expirationDate);

  return util.format(
    'SharedAccessSignature sig=%s&se=%s&skn=%s&sr=%s',
    signature,
    expirationDate,
    this.keyName,
    targetUri,
  );
};

ServiceBusServiceBase.prototype._createOrUpdateResource = function(
  path,
  handler,
  validators,
  optionsOrCallback,
  callback,
) {
  var options = null;
  if (typeof optionsOrCallback === 'function' && !callback) {
    callback = optionsOrCallback;
  } else {
    options = optionsOrCallback;
  }

  if (!callback) {
    throw new Error('No Callback present');
  }

  var resource = handler.serialize(options);

  var webResource = WebResource.put(path);
  webResource.withHeader(
    'content-type',
    'application/atom+xml;type=entry;charset=utf-8',
  );
  webResource.withHeader('content-length', Buffer.byteLength(resource, 'utf8'));
  webResource.withHeader('if-match', '*');

  this._executeRequest(webResource, resource, handler, validators, callback);
};

function validateHubName(hub) {
  if (!hub || typeof hub !== 'string' || hub.length === 0) {
    throw new Error('Notification hub name must be a non empty string.');
  }
}
