
if ( typeof(console) == "undefined" ) {
	console = {};
	console.log = function(str) {};
};

var LatteX = function() {
	
};

LatteX.ImageNumbering = function() {
	this.rootElement = document.body;

	this.imageCaptionElement = "span";
	this.imageCaptionClass   = "image-caption";
	this.imageCaptionKeyword = "Figure";
}

LatteX.ImageNumbering.prototype.process = function() {
	var images = this.rootElement.getElementsByTagName("img");

	this._numberImages(images);
}

LatteX.ImageNumbering.prototype._numberImages = function(images) {
	for ( var i=0; i < images.length; i++) {
		var captionElement = document.createElement(this.imageCaptionElement);
		var imageNumber = i+1; // loop starts from 0, but image numbering from 1
		captionElement.setAttribute('class', this.imageCaptionClass);
		captionElement.innerHTML = this.imageCaptionKeyword + " " + imageNumber + ": " + images[i].title;

		this._insertCaption(captionElement, images[i]);
		this._updateImageReferences(images[i], imageNumber);
	}
}

/* Inserts captionElement into the DOM after imageElement. */
LatteX.ImageNumbering.prototype._insertCaption = function(captionElement, imageElement) {
	imageElement.parentNode.insertBefore(captionElement, imageElement.nextSibling);
}

/* Updates references to current image. 
   A reference could be e.g. to a figure 
        <a href="#image-id" data-lattex="image-ref"></a>
  Output: 
   "A reference could be e.g. to a figure 2"
*/
LatteX.ImageNumbering.prototype._updateImageReferences = function(imageElement, imageNumber) {
	// selector: a[data-lattex~='image-ref'][href="#image-id"]
	selector = "a[data-lattex~='image-ref']";
	selector += "[href='#" + imageElement.id + "']";
	referencingElements = this.rootElement.querySelectorAll(selector);
	for (var i=0; i < referencingElements.length; i++) {
		referencingElements[i].innerHTML = imageNumber;
	}
}


LatteX.SectionNumbering = function() {
	this.rootElement = document.body;

	this.level = 0;
	this.chapter = 0;
  	this.section = 0;
  	this.subsection = 0;
	this.subsubsection = 0;

};

LatteX.SectionNumbering.prototype.process = function() {
	var article = this.rootElement.getElementsByTagName("article")[0];
	var children = article.children;
	
	this._numberSections(children);	
}

LatteX.SectionNumbering.prototype._numberSections = function(children) {

	for ( var i=0; i<children.length; i++ ) {
		
		if ( children[i].tagName == "SECTION" ) {
			var section = children[i];
			
			var title = section.getElementsByTagName("h1")[0];
			
			switch ( this.level ) {	
				case 0:
					this.chapter++;
					this.section = 0;
					this.subsection = 0;
					this.subsubsection = 0;
					
					title.innerHTML = this.chapter + "&nbsp;&nbsp;&nbsp;&nbsp;" + title.innerHTML;
					break;
			
				case 1:
					this.section++;
					this.subsection = 0;
					this.subsubsection = 0;

					title.innerHTML = this.chapter + "." + this.section + "&nbsp;&nbsp;&nbsp;&nbsp;" + title.innerHTML;
					break;
				
				case 2:
					this.subsection++;
					this.subsubsection = 0;

					title.innerHTML = this.chapter + "." + this.section + "." + this.subsection + "&nbsp;&nbsp;&nbsp;&nbsp;" + title.innerHTML;					
					break;
				
				case 3:
					this.subsubsection++;
					title.innerHTML = this.chapter + "." + this.section + "." + this.subsection + "." + this.subsubsection + "&nbsp;&nbsp;&nbsp;&nbsp;" + title.innerHTML;					
					break;
			}
						
			if ( section.children.length > 0 ) {
				this.level++;
				this._numberSections(section.children);
			}
		}
		
	}

	this.level--;
}


LatteX.PreParagraphs = function() {
	
}

LatteX.PreParagraphs.prototype.process = function() {
	// whitespaces, like tabs between \n\n need to be detected
	
	var pre_elements = document.getElementsByTagName("pre");
	
	for (var i=0; i < pre_elements.length; i++) {
		var pre = pre_elements[i];
		
		var paragraphs = pre.innerHTML.split(/\s*\n\s*\n/);
		
		for ( paragraph_i in paragraphs ) {
			var p = document.createElement("p");
			
			p.setAttribute("class", "hyphenate");

			p.innerHTML = paragraphs[paragraph_i];
			pre.parentNode.insertBefore(p, pre);
			
		}
		
		pre.style.display = "none";
	}
	
}



LatteX.ToC = function() {
	this.rootElement = document.body;
	
	this.level = 0;
	this.chapter = 0;
  	this.section = 0;
  	this.subsection = 0;
	this.subsubsection = 0;
	
	this.preContents = "";
}

LatteX.ToC.prototype.process = function() {
	var article = this.rootElement.getElementsByTagName("article")[0];
	var children = article.children;
	
	this._generateContents(children);

	var preElement = document.createElement("pre");
	preElement.innerHTML = this.preContents;
	document.body.getElementsByTagName("nav")[0].appendChild(preElement);
}

LatteX.ToC.prototype._generateContents = function(children) {
	
	for ( var i=0; i<children.length; i++ ) {
		
		if ( children[i].tagName == "SECTION" ) {
			var section = children[i];
			
			var title = section.getElementsByTagName("h1")[0];
			
			switch ( this.level ) {	
				case 0:
					this.chapter++;
					this.section = 0;
					this.subsection = 0;
					this.subsubsection = 0;
					
					this.preContents = this.preContents + this.chapter + " " + title.innerHTML;
					break;
			
				case 1:
					this.section++;
					this.subsection = 0;
					this.subsubsection = 0;
					
					this.preContents = this.preContents + this.chapter + "." + this.section + " " + title.innerHTML;
					break;
				
				case 2:
					this.subsection++;
					this.subsubsection = 0;
					
					this.preContents = this.preContents + this.chapter + "." + this.section + "." + this.subsection + " " + title.innerHTML;
					break;

				case 3:
					this.subsubsection++;
					this.preContents = this.preContents + this.chapter + "." + this.section + "." + this.subsection + "." + this.subsubsection + " "+ title.innerHTML;
					break;
			}
			
			this.preContents = this.preContents + "\n\n";
			
			if ( section.children.length > 0 ) {
				this.level++;
				this._generateContents(section.children);
			}
		}
		
	}

	this.level--;

}


LatteX.Cite = function() {
	
	// TODO: rootElement toistuu kaikille, perintä?
	this.rootElement = document.body;
	
}

LatteX.Cite.prototype.process = function() {
	
	var cites = this.rootElement.getElementsByTagName("cite");
	
	for (var i=0; i<cites.length; i++) {
		var cite = cites[i];
		var citeKeys = cite.innerHTML.split(",");
		
		cite.innerHTML = "[";
		
		for (var j=0; j < citeKeys.length; j++) {
			if (j>0) {
				cite.innerHTML += ", ";
			}
			
			var citeKey = citeKeys[j].trim();
			
			var refKey = this._getReferenceKey(citeKey);
			
			cite.innerHTML += "<a href=\"#ref-"+refKey+"\">"+refKey+"</a>";
		}
		
		cite.innerHTML += "]";
	}
	
}

LatteX.Cite.prototype._getReferenceKey = function(key) {
	
	// TODO: too large scope
	
	var dts = document.body.getElementsByTagName("dt");
	
	for (var i = 0; i < dts.length; i++) {
		if ( dts[i].getAttribute("data-lattex") == key )
			return dts[i].innerHTML;
	}
	
	alert("Reference with key " + key + " was not found.")
}


LatteX.References = function () {
	var articles = document.body.getElementsByTagName("article");
	
	for (var i = 0; i < articles.length; i++) {
		if (articles[i].className == "references") {
			this.rootElement = articles[i];
		}
	}

	for (var i = 0; i < this.rootElement.children.length; i++) {
		if ( this.rootElement.children[i].tagName == "DL" ) {
			this.dl = this.rootElement.children[i];
		}
	}

}

LatteX.References.prototype.process = function() {
	
	for (var i = 0; i < this.dl.children.length; i++) {
		var element = this.dl.children[i];
		if ( element.tagName == "DT") {
			element.id = "ref-" + element.innerHTML;
		}
	}
}



LatteX.Data = function() {
	this.rootElement = document.body;
	
	this.data = {};
	this.data.title = document.getElementsByTagName("title")[0].text;
}

LatteX.Data.prototype.process = function() {

	var h1s = this.rootElement.getElementsByTagName("h1");
	
	for (var i=0; i<h1s.length; i++) {
		var h1 = h1s[i];
		var dataKey = h1.getAttribute("data-lattex");
		
		switch (dataKey) {
			case "title":
				h1.innerHTML = this.data.title;
				break;
		}
	}
}


window.onload = function() {

	var ltoc = new LatteX.ToC;
	ltoc.process();
	
	var lsections = new LatteX.SectionNumbering;
	lsections.process();

	var limages = new LatteX.ImageNumbering;
	limages.process();
	
	var lpre = new LatteX.PreParagraphs;
	lpre.process();

	var lcite = new LatteX.Cite;
	lcite.process();
	
	var ldata = new LatteX.Data;
	ldata.process();
	
	var lref = new LatteX.References;
	lref.process();
	
	Hyphenator.run();
}
