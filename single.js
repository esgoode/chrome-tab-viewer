var NUM_TITLE_LINES = 1;
var screenShots;

function init() {
	var parent = document.querySelector('#most-visited');
	var old = parent.querySelector('#mv-tiles');
	var tiles = old.getElementsByClassName("mv-tile");
	var numTiles = 0;

	chrome.tabs.query({}, function(all_tabs){
		addTiles(all_tabs)
	});
	
	//updateTiles();
	chrome.tabs.onCreated.addListener(function(tab){
		var all_tabs = [tab];
		addTiles(all_tabs);
	});
	//chrome.tabs.onRemoved.addListener(function callback)

}

var addTiles = function(all_tabs) {
	//get TAB data
	var tiles = document.querySelector('#mv-tiles');

	chrome.runtime.getBackgroundPage(function(backgroundPage) {
		screenShots = backgroundPage.tabImages;
		for(var i = 0; i < all_tabs.length; i++){
			var cTab = all_tabs[i];
			var data = {
				faviconUrl: cTab.favIconUrl,
				id: cTab.id,
				tid: cTab.id,
				title: cTab.title,
				url: cTab.url
			}
			tiles.append(renderTile(data));
		}
	});
}

var renderTile = function(data) {
	var tile = document.createElement('a');

	if (data == null) {
		tile.className = 'mv-empty-tile';
		return tile;
	}

	//append tile to end of all tiles
	//var position = tiles.children.length;

	tile.className = 'mv-tile';
	tile.setAttribute('data-tid', data.tid);
	var html = [];
	html.push('<div class="mv-favicon"></div>');
	html.push('<div class="mv-title"></div><div class="mv-thumb"></div>');
	html.push('<div class="mv-x" role="button"></div>');
	tile.innerHTML = html.join('');

	//Set title
	tile.setAttribute('aria-label', data.title);
	tile.title = data.title;

	var title = tile.querySelector('.mv-title');
  	title.innerText = data.title;
  	title.style.direction = data.direction || 'ltr';
  	if (NUM_TITLE_LINES > 1) {
    	title.classList.add('multiline');
  	}

	//Set thumbnail image
	var results = []
	var thumb = tile.querySelector('.mv-thumb');
	var img = document.createElement('img');
	
	if(screenShots[data.tid] != null){
		img.src = screenShots[data.tid];
	}

	thumb.appendChild(img);

	var favicon = tile.querySelector('.mv-favicon');
	if (data.faviconUrl) {
		var fi = document.createElement('img');
		fi.src = data.faviconUrl;
		// Set the title to empty
		fi.title = '';
		favicon.appendChild(fi);
	} else {
		favicon.classList.add('failed-favicon');
	}

	var mvx = tile.querySelector('.mv-x');
  	
  	tile.addEventListener('click', function(){
  		chrome.tabs.update(data.tid, {selected: true});
  		ev.preventDefault();
	    ev.stopPropagation();
	});

  	mvx.addEventListener('click', function(ev) {
	    tile.remove();
	    chrome.tabs.remove(data.tid);
	    ev.preventDefault();
	    ev.stopPropagation();
	});

	//consider putting in sound and mute functionality
	
 	return tile;
 }

// //
// var updateTiles = function() {

// }




//Kick things off
document.addEventListener('DOMContentLoaded', init);

