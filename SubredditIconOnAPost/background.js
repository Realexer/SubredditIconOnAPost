var something = "d(*_*)P";
console.log(something);

chrome.runtime.onMessage.addListener(function(msg, sender, callback) {
	
	switch (msg.name) 
	{
		case "GetSubredditImage":
			
			new Ajax().Invoke({
					url: msg.subredditInfo.address + "about.json",
					type: "GET"
				}, function(subredditInfoJson) {
					
					var subredditInfo = JSON.parse(subredditInfoJson);

					callback(subredditInfo.data.header_img);
				});
		
			break;
	}
});

	
