let useIndexedDB = location.hash.includes("useIDB");
let news_root = qq("#news__content");
let news = new ContentManager("news", useIndexedDB);

news.subscribe(() => {
	news.list.forEach((post) => {
		if(!news_root.qq(`#post-${post.id}`)){
			let postHTML = generatePostHTML(post);
			news_root.insertAdjacentHTML('beforeend', postHTML);
		}
	});
});

function generatePostHTML(post){
	const time = new Date(post.timestamp).toLocaleString();
	return `
		<div class="col-md-3 mb-3" id="post-${post.id}">
			<div class="card h-100">
				<img class="card-img-top border-bottom" src="${post.image}">
				<div class="card-header">
					<h5 class="card-title mb-0">${post.title}</h5>
				</div>
				<div class="card-body">
					<p class="card-text">${post.text}</p>
				</div>
			</div>
		</div>
	`;
}
