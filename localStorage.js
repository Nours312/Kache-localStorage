/**
 * La class StorageDatas est une interface entre le navigateur et l'utilisateur
 * elle traite les données et les stockes
 * si elle ne les connaient pas, elle peut les charger sur le serveur (Php)
 *
 * @classe StorageDatas
 * @param string name : nom de la donnée
 * @param bool reloadCache : forcer le rechargement
 * @param bool dontLoadServeur : forcer le non appel au serveur même en cas d'absence de la donnée
 */

var StorageDatas = Class.create({
	initialize : function (name, reloadCache, dontLoadServeur){
		this.loaded = false ;
		this.name = name;
		this.reloadCache = reloadCache;
		this.datas = [];
		this.loadDatas(dontLoadServeur);
	},
	loadDatas : function(dontLoadServeur){
		var ls = localStorage.getItem(this.name);
		if(!ls || ls.empty() || this.reloadCache == true){
			if(dontLoadServeur === true)
				this.update($A())
			else
				new Ajax.Request(Kache.serverUrl.sub('#{name}', this.name) , {parameters : {name:this.name}, onComplete : function(xhr){this.update(xhr.responseJSON ? xhr.responseJSON : xhr.responseText.evalJSON())}.bind(this)}) ;
		} else
			this.init();
	},
	saveDatas : function(){
		// @todo : permettre de sauvegarder les données sur le serveur => à la fermeture de la page par exemple ^^
	},
	update : function(data){
		// au lieu de stocker les données en JSON, on peux les encrypter ici
		localStorage.setItem(this.name, Object.toJSON(data)) ;
		this.datas = data;
		if(Kache.all && !Kache.all.get(this.name) && Kache.all != this)
			Kache.all.add(this.name);
		this.loaded = true ;
	},
	init : function(){
		// Si elle sont encryptées, il faudra les décrypter avant de la manipuler ;)
		this.datas = localStorage.getItem(this.name).evalJSON();
		if(Kache.all && !Kache.all.get(this.name) && Kache.all != this)
			Kache.all.add(''+this.name+'');
		this.loaded = true ;
	},
	add : function(datas){
		this.datas.push(datas);
		return this.update(this.datas);
	},
	del : function(datas){
		this.datas = this.datas.without(datas);
		return this.update(this.datas);
	},
	remove : function(){
		localStorage.removeItem(this.name);
		if(Kache.all && Kache.all.get(this.name))
			Kache.all.del(this.name);
	},
	get : function(arg){
		// si il n'y a pas d'arguments; on retourne toute la donnée
		// sinon, on cherche la clé correspondant dans la donnée .. simple ;)
		// on pourrait y mettre différents parametres à l'image des moteurs de mongoDB ou coucheDB :D .. oui, je revasse ^^
		return (!arg || arg == undefined) ? this.datas : (Object.isArray(this.datas) ? this.datas.find(function(l){return l == arg;}) : (this.datas[arg] != undefined ? this.datas[arg] : null ));
	},
	toJSON : function(){
		return Object.toJSON(this.datas) ;
	}
}) ;

Kache = window.Kache = {
		datas : {},
		all : null,
		serverUrl : 'getDatasFromServer.php?dataName=#{name}',
		init : function(){
			this.all = new StorageDatas('_myCache', false, true);
		},
		set : function(name, datas){
			this.find(name).update(datas);
		},
		find : function(name){
			if(!this.datas[name])
				this.datas[name] = new StorageDatas(name);
			return this.datas[name] ;
		},
		get : function(name, callBack){
			if(this.find(name).loaded)
				return callBack(this.datas[name].get())
			return window.setTimeout(this.get.bind(this), 100, name, callBack);
		},
		purge : function(){
			this.all.get().each(function(k){
				this.find(k).remove()
				this.datas[k] = undefined ;
			}.bind(this))
		}
	};
Kache.init();
//Kache = window.Kache = KACHE();

DescribMe = function(){
	$('main').update('');
	Kache.all.get().each(function(l){
		var el ;
		$('main').insert(el = new Element('fieldset').insert(new Element('legend').update('Object : "'+l+'"')))
		Kache.get(l, function(element){
			this.insert(new Element('pre').update(Object.toJSON(element)));
		}.bind(el)) ;
	}) ;
}





