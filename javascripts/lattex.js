
if ( typeof(console) == "undefined" ) {
	console = {}
	console.log = function(str) {}
}

var LatteX = {};

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


window.onload = function() {
	var ltoc = new LatteX.ToC;
	ltoc.process();
	
	var lsections = new LatteX.SectionNumbering;
	lsections.process();
	
	var lpre = new LatteX.PreParagraphs;
	lpre.process();
}
