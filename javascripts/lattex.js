
var LatteX = {};

LatteX.ToC = function() {
	this.rootElement = document.body;

	this.level = 0;
	this.chapter = 0;
  	this.section = 0;
  	this.subsection = 0;

};

LatteX.ToC.prototype.generate = function() {
	var article = this.rootElement.getElementsByTagName("article")[0];

	var children = article.children;
	
	this._numberSections(children);	
}

LatteX.ToC.prototype._numberSections = function(children) {

	for ( var i=0; i<children.length; i++ ) {
		
		if ( children[i].tagName == "SECTION" ) {
			var section = children[i];
			
			var title = section.getElementsByTagName("h1")[0];
			
			switch ( this.level ) {	
				case 0:
					this.chapter++;
					title.innerHTML = this.chapter + "&nbsp;&nbsp;&nbsp;&nbsp;" + title.innerHTML;
					break;
			
				case 1:
					this.section++;
					title.innerHTML = this.chapter + "." + this.section + "&nbsp;&nbsp;&nbsp;&nbsp;" + title.innerHTML;
					break;
				
				case 2:
					this.subsection++;
					title.innerHTML = this.chapter + "." + this.section + "." + this.subsection + "&nbsp;&nbsp;&nbsp;&nbsp;" + title.innerHTML;					
			}
			
			console.log(title.innerHTML);
			
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
	var pre_elements = document.getElementsByTagName("pre");
	
	for (var i=0; i < pre_elements.length; i++) {
		var pre = pre_elements[i];
		var paragraphs = pre.innerHTML.split('\n\n');
		
		for ( paragraph_i in paragraphs ) {
			var p = document.createElement("p");
			p.innerHTML = paragraphs[paragraph_i];
			pre.parentNode.insertBefore(p, pre);
			
		}
		
		pre.style.display = "none";
	}
	
}

window.onload = function() {
	var ltoc = new LatteX.ToC;
	ltoc.generate();

	var lpre = new LatteX.PreParagraphs;
	lpre.process();
}
