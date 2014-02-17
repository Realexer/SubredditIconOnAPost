var something = "d(*_*)P";
//console.log(something);

var subredditsHeaders = {
	/* 
	subredditName: {
		img: "url_to_img",
		things:[]
	}
	*/
};

/*
	START UP
*/
var siteTable = document.getElementById("siteTable");
var thingsList = [].slice.call(siteTable.getElementsByClassName("thing"));
insertSubredditIconsIntoList(thingsList);

// compatibility with never ending reddit
setInterval(function() 
{
	var currentThings = [].slice.call(siteTable.getElementsByClassName("thing"));

	if(currentThings.length > thingsList.length) 
	{
		var thingsToUpdate = currentThings.slice(thingsList.length);
		insertSubredditIconsIntoList(thingsToUpdate);

		thingsList = currentThings;
	}
	
}, 1000);


/*
	FUNCTIONS
*/
function insertSubredditIconsIntoList(thingsList) 
{
	thingsList.forEach(function (thing) 
	{
		insertSubredditIconIntoPost(thing);
	});	
}

function insertSubredditIconIntoPost(thing) 
{
		var subredditInfo = getLinkToSubreddit(thing);
		if(!subredditInfo)
			return;

		// extra check to make sure that we don't make any redundant web request lol
		if(thing.getElementsByClassName("subredditIcon").length != 0)
			return;

		var insertBeforElm = thing.firstChild;
		if(thing.getElementsByClassName("rank").length != 0) 
		{
			var rank = thing.getElementsByClassName("rank")[0];
			rank.classList.add("subredditIconRank");
			insertBeforElm = rank.nextSibling;
		}
	
		var hyperlinkToSubreddit = document.createElement("a");
		hyperlinkToSubreddit.href = subredditInfo.address;
		hyperlinkToSubreddit.title = subredditInfo.name;
		hyperlinkToSubreddit.classList.add("hyperLinkToSubreddit");
		hyperlinkToSubreddit.classList.add("noIcon");
		hyperlinkToSubreddit.innerHTML = " loading icon ..";
		
		thing.insertBefore(hyperlinkToSubreddit, insertBeforElm);
		
		
		if(subredditsHeaders[subredditInfo.name] != undefined) 
		{
			if(subredditsHeaders[subredditInfo.name].img) 
			{
				setBackgroundImage(thing, subredditsHeaders[subredditInfo.name].img, subredditInfo);
			} 
			else 
			{
				subredditsHeaders[subredditInfo.name].things.push(thing);
			}
			return;
		}

		subredditsHeaders[subredditInfo.name] = {
			img: null,
			things: []
		};
	
		subredditsHeaders[subredditInfo.name].things.push(thing);
	
		chrome.runtime.sendMessage({ name: "GetSubredditImage", subredditInfo: subredditInfo }, 
			function (imgUrl) 
			{
				subredditsHeaders[subredditInfo.name].img = imgUrl;
				subredditsHeaders[subredditInfo.name].things.forEach(function(th) {
					setBackgroundImage(th, imgUrl, subredditInfo);	
				});	
			}
		);
}

function getLinkToSubreddit(thing) 
{
	var subredditInfo = thing.getElementsByClassName("subreddit");
	if(subredditInfo.length == 0)
		return null;
	
	return {
		address: subredditInfo[0].href,
		name: subredditInfo[0].text
	};
}

function setBackgroundImage(thing, imgUrl, subredditInfo) 
{
	var hyperLinkToSubreddit = thing.getElementsByClassName("hyperLinkToSubreddit")[0];
	if(!imgUrl) {
		hyperLinkToSubreddit.innerHTML = subredditInfo.name.capitalize();
		hyperLinkToSubreddit.classList.add("noIcon");
	}
	
	var subredditIconImg = document.createElement("img");
	subredditIconImg.src = imgUrl;
	subredditIconImg.className = "subredditIcon";
	
	subredditIconImg.onload = function() 
	{
		hyperLinkToSubreddit.classList.remove("noIcon");
		hyperLinkToSubreddit.innerHTML = "";
		hyperLinkToSubreddit.appendChild(subredditIconImg);
	};
}