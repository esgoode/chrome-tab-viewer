var tabImages = [];
var test = "test";
// var tabImages = test;

chrome.tabs.onActivated.addListener(function(activeInfo){
	chrome.tabs.captureVisibleTab(null, {'format':'png'}, function(data){
		tabImages[activeInfo.tabId] = data;
	});
});