let useIndexedDB = location.hash.includes("useIDB");
let comments_root = qq("#comments__content");
let comments = new ContentManager("comments", useIndexedDB);

comments.subscribe(() => {
	comments.list.forEach((comment) => {
		if(!comments_root.qq(`#comment-${comment.id}`)){
			let commentHTML = generateCommentHTML(comment);
			comments_root.insertAdjacentHTML('beforeend', commentHTML);
		}
	});
});

function generateCommentHTML(comment){
	const time = new Date(comment.timestamp*1).toLocaleString();
	return `<section class="row" id="comment-${comment.id}">
			<div class="col">
				<div class="mb-3 p-3 rounded bg-light border">
					${comment.text}
					<div class="d-flex justify-content-between mt-3">
						<span class="h5">${comment.name}</span>
						<span class="text-black-50">${time}</span>
					</div>
				</div>
			</div>
		</section>`;
};

/*
	SUBMIT
*/
qq("#comment__submit").addEventListener("click", (e) => {
	event.preventDefault();
	
	const name_el = qq("#comment__name");
	const text_el = qq("#comment__text");
	
	name_el.classList.remove("is-invalid");
	text_el.classList.remove("is-invalid");
	
	const name_val = clearText(name_el.value);
	const text_val = clearText(text_el.value);
	
	let all_correct = true;
	
	if(name_val.length === 0){
		name_el.classList.add("is-invalid");
		all_correct = false;
	}
	if(text_val.length === 0){
		text_el.classList.add("is-invalid");
		all_correct = false;
	}
	
	if(!all_correct){
		return;
	}
	
	let commentObject = {
		name: name_val,
		text: text_val,
		time: new Date().getTime()
	};
	comments.add(commentObject);
	
	name_el.value = "";
	text_el.value = "";
	name_el.classList.remove("is-valid");
	text_el.classList.remove("is-valid");
});

qq("#comment__name").on("keyup", (e) => {
	validateInput(e.target);
});

qq("#comment__text").on("keyup", (e) => {
	validateInput(e.target);
});


/*
	ONLINE
*/
window.addEventListener('online', (e) => {
	qq("#comments__bad-internet").style.display = 'none';
});

window.addEventListener('offline', (e) => {
	qq("#comments__bad-internet").style.display = '';
});