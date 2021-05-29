let mailform = document.forms[0];

mailform.onsubmit = (event)=>{
	if (mailform.checkValidity()) {
		event.preventDefault();
		data = {"email": mailform.querySelector("#mail").value};
		$.post("/signin", data, (data, status)=>{
			console.log(data, "posted and status:", status);
		});
	}
}