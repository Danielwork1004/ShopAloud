const div = document.getElementById("toggle");
div.innerHTML = "Mouse over this box to toggle colors!"


setInterval(() => {
	const elemDiv = document.createElement('div');
	elemDiv.className = "added";
	elemDiv.innerHTML = "externally added";
	document.body.appendChild(elemDiv);
}, 3000);

setTimeout(() => { document.getElementById("hidden").className = ""; }, 6000);
