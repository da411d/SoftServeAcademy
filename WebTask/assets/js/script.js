HTMLDocument.prototype.on = HTMLDocument.prototype.addEventListener;
HTMLDocument.prototype.qq = HTMLDocument.prototype.querySelector;
HTMLDocument.prototype.qqq = HTMLDocument.prototype.querySelectorAll;
HTMLElement.prototype.on = HTMLElement.prototype.addEventListener;
HTMLElement.prototype.qq = HTMLElement.prototype.querySelector;
HTMLElement.prototype.qqq = HTMLElement.prototype.querySelectorAll;
function qq(t){return document.qq(t);}
function qqq(t){return document.qqq(t);}
function sleep(t){
	return new Promise((resolve) => setTimeout(resolve, t));
}

function isOnline(){
	return window.navigator.onLine;
}

function clearText(text){
	text = text.trim();
	text = text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
	text = text.substring(0, 1024*8);
	
	return text;
}

function validateInput(element){
	element.classList.remove("is-invalid");
	element.classList.remove("is-valid");
	
	if(clearText(element.value).length > 0){
		element.classList.add("is-valid");
		return true;
	}else{
		element.classList.add("is-invalid");
		return false;
	}
}

/*
	CONTENT MANAGER
*/
class ContentManager{
	_callbacks = [];
	
	_list = [];
	
	constructor(type, useIndexedDB = false){
		this._type = type;
		
		if(useIndexedDB){
			this._pendings = new IndexedDBListStorage(type + ".pending");
		}else{
			this._pendings = new LocalStorageListStorage(type + ".pending");
		}
		this.downloadListFromServer();
		if(isOnline()){
			this.tryUpload();
		}
		
		window.addEventListener('online', (e) => {
			this.tryUpload();
		});
	}

	get list(){
		return this._list;
	}
	
	get pendings(){
		return this._pendings;
	}
	
	async downloadListFromServer(){
		const data = new FormData();
		data.append("action", this._type + ".get");
		let loadedList = await fetch("/backend.php", {
			method: 'POST',
			body: data
		}).then(d=>d.json());
		this._list.push(...loadedList);
		this.notify();
	}
	
	add(data){
		this.pushToPendings(data);
	};
	
	pushToPendings(data){
		this._pendings.add(data);
		
		if(isOnline()){
			this.tryUpload();
		}
	};
	
	async tryUpload(){
		let pendings = await this._pendings.getAll();
		for(let pending of pendings){
			const formData = new FormData();
			formData.append("action", this._type + ".push");
			for(let key in pending){
				formData.append(key, pending[key]);
			}
			let uploadedItem = await fetch("/backend.php", {
				method: 'POST',
				body: formData
			}).then(d=>d.json());
			
			this._list.push(uploadedItem);
			this._pendings.deleteById(pending.id);
			this.notify();
		}
	};
	
	subscribe(callback){
		this._callbacks.push(callback);
	}
	
	notify(){
		this._callbacks.forEach(cb => cb());
	}
}

/*
	LIST STORAGE ABSTRACT CLASS
*/
class ListStorage{
	_ready = false;
	
	constructor(name){
		this._name = name;
	}
	
	async getAll(){};
	
	async add(){};
	
	async deleteById(){};
	
	async clear(){};
}

/*
	INDEXED DB
*/
class IndexedDBListStorage extends ListStorage{
	constructor(name){
		super(name);
		
		const request = window.indexedDB.open('DakiDB', 1);
		request.onupgradeneeded = (event) => {
			this._db = event.target.result;
			if (!this._db.objectStoreNames.contains(this._name)) {
				let objectStore = this._db.createObjectStore(this._name, {
					keyPath: 'id',
					autoIncrement: true
				});
			}
		}
		request.onerror = (event) => {
			console.warn('ERROR');
		};
		request.onsuccess = (event) => {
			this._ready = true;
			this._db = event.target.result;
		};
	}
	
	async getAll(){
		while(!this._ready){
			await sleep(50);
		}
		return new Promise((resolve, reject) => {
			let transaction = this._db.transaction([this._name], 'readwrite');
			let getData = transaction.objectStore(this._name).getAll();
			getData.onsuccess = (event) => {
				let data = getData.result;
				resolve(data);
			};
			getData.onerror = reject;
		});
	}
	
	async add(data){
		while(!this._ready){
			await sleep(50);
		}
		if(!data.id){
			data.id = new Date().getTime() + Math.random();
		}
		const transaction = this._db.transaction([this._name], 'readwrite');
		transaction.objectStore(this._name).add(data);
	}
	
	async deleteById(id){
		while(!this._ready){
			await sleep(50);
		}
		const transaction = this._db.transaction([this._name], 'readwrite');
		transaction.objectStore(this._name).delete(id);
	}
	
	async clear(){
		while(!this._ready){
			await sleep(50);
		}
		const transaction = this._db.transaction([this._name], 'readwrite');
		transaction.objectStore(this._name).clear();
	}
}

/*
	LOCAL STORAGE
*/
class LocalStorageListStorage extends ListStorage{
	constructor(name){
		super(name);
	}
	
	async getAll(){
		let dataArrayRaw = localStorage.getItem(this._name) || '[]';
		let dataArray = JSON.parse(dataArrayRaw);
		
		return dataArray;
	}
	
	async add(data){
		let dataArrayRaw = localStorage.getItem(this._name) || '[]';
		let dataArray = JSON.parse(dataArrayRaw);
		
		if(!data.id){
			data.id = new Date().getTime() + Math.random();
		}
		dataArray.push(data);
		
		dataArrayRaw = JSON.stringify(dataArray);
		localStorage.setItem(this._name, dataArrayRaw);
	}
	
	async deleteById(id){
		let dataArrayRaw = localStorage.getItem(this._name) || '[]';
		let dataArray = JSON.parse(dataArrayRaw);
		
		dataArray = dataArray.filter((item) => item.id != id);
		
		dataArrayRaw = JSON.stringify(dataArray);
		localStorage.setItem(this._name, dataArrayRaw);
	}
	
	async clear(){
		localStorage.setItem(this._name, '[]');
	}
}



