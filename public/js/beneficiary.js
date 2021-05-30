let searchform = document.forms[0];
let blankResultsLogSite = document.querySelector("#result-blank");

searchform.onsubmit = (event)=>{
	if (searchform.checkValidity()) {
		itemDemanded = searchform.querySelector("input").value;
		event.preventDefault();
		try {
			blankResultsLogSite.innerText = "Searching our database ...";
			search();
		}
		catch (err) {
			blankResultsLogSite.innerText = "Sorry! Your requested item " + itemDemanded + " is not available with us at the moment. Please come back and retry later.";			
		}
		finally {
			setTimeout(()=>{
				blankResultsLogSite.innerText = " Please search for any other item to check for availability of your demand. "; 
			}, 1500);
		}
	}
}