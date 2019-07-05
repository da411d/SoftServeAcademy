let useIndexedDB = location.hash.includes("useIDB");
let news = new ContentManager("news", useIndexedDB);

qq("#news__submit").addEventListener("click", (e) => {
	e.preventDefault();
	
	const title_el = qq("#news__title");
	const text_el = qq("#news__text");
	const image_el = qq("#news__image_b64");
	
	title_el.classList.remove("is-invalid");
	text_el.classList.remove("is-invalid");
	
	const title_val = clearText(title_el.value);
	const text_val = clearText(text_el.value);
	const image_val = image_el.value;
	
	let all_correct = true;
	
	if(title_val.length === 0){
		title_el.classList.add("is-invalid");
		all_correct = false;
	}
	if(text_val.length === 0){
		text_el.classList.add("is-invalid");
		all_correct = false;
	}
	
	if(!all_correct){
		return;
	}
	
	let postObject = {
		title: title_val,
		text: text_val,
		image: image_val,
		time: new Date().getTime()
	};
	news.add(postObject);
	
	title_el.value = "";
	text_el.value = "";
	image_el.value = "";
	qq("#news__preview").src = "/assets/images/image-icon.png";
});

qq("#news__file").addEventListener("change", (e) => {
	e.preventDefault();
	
	let preview = qq("#news__preview");
	let hiddenField = qq("#news__image_b64");
	let file = qq("#news__file").files[0];

	if (file) {
		let reader = new FileReader();
		reader.onloadend = function () {
			preview.src = reader.result;
			hiddenField.value = reader.result;
		}
		reader.readAsDataURL(file);
	}
});

qq("#news__title").addEventListener("keyup", (e) => {
	validateInput(e.target);
});

qq("#news__text").addEventListener("keyup", (e) => {
	validateInput(e.target);
});

qq("#news__alert-success").addEventListener("click", (e) => {
	qq("#news__alert-success").style.display = "none";
});