<?xml version="1.0"?>

<!-- USAGE: xsltproc ––html ––encoding utf-8 latte.xsl pietu.html > pietu.tex -->

<!-- Global TODO:

	loppuun \end{document}

-->


<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	version="1.0"
	xmlns:str="http://exslt.org/strings">
<xsl:output method="text" />


<!-- TODO: ANTEEKSI part 1-->
<xsl:variable name="apos">
	<xsl:text>'</xsl:text>
</xsl:variable>
<xsl:variable name="quot">
	<xsl:text>"</xsl:text>
</xsl:variable>
<xsl:variable name="hash">
	<xsl:text>#</xsl:text>
</xsl:variable>

<!-- latex-erikoismerkit, eli kommentti-prosentit % pitäis suojata TODO: onko muita? -->
<xsl:template match="text()">
	<xsl:value-of select="str:replace(.,'%','\%')" />
</xsl:template>

<xsl:template match="text()">
	<xsl:value-of select="str:replace(.,'$','\$')" />
</xsl:template>

<!-- TODO: ei toimi millään! ei '#', eikä $hashina -->
<xsl:template match="text()">
	<xsl:value-of select="str:replace(.,$hash,concat('\',$hash))" />
</xsl:template>

<!-- TODO: ANTEEKSI part 2-->

<xsl:template match="text()">
	<xsl:value-of select="str:replace(.,$quot,concat($apos,$apos))" />
</xsl:template>


<!-- EMO-ELEMENTIT -->

<xsl:template match="html">
	\documentclass{tktltiki}
	\usepackage{ae,aecompl}
	\usepackage{url}
	\usepackage{amsfonts}
	\usepackage{color}
	\usepackage{graphicx}
	
	\begin{document}
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="head">
	\title{<xsl:value-of select="title" />}
	\author{<xsl:value-of select="/body/header/address" />}
	\date{\today}
	\level{Sosiaalisen median tekniikat seminaari}
	\maketitle
</xsl:template>

<xsl:template match="body">

	\onehalfspacing

	\level{Seminaarityö}
	\faculty{Matemaattis-luonnontieteellinen}
	\department{Tietojenksittelytieteen laitos}
	\subject{Tietojenksittelytiede}
	\numberofpagesinformation{\numberofpages\ sivua}

	\keywords{UTF-8, Ääkköset}

	\begin{abstract}
		Ääkkönen
	\end{abstract}

	\setcounter{tocdepth}{3}
	\mytableofcontents

	<xsl:apply-templates />
</xsl:template>

<!-- SECTION-REKURSIO -->

<!-- MOI! Ilmeisesti esimerkki-lähde-html on jo osittain muunnettu, kun siellä on
     latexin \section \subsection aina html <section> jälkeen?
     Mieluummin tunnistaisin ne seuraavasti ja sectionin otsikko ois sitten h[1]-elementissä!
-->

<xsl:template match="section">
	% latte.xsl says: \section
	<xsl:apply-templates>
		<xsl:with-param name="sec">\section</xsl:with-param>
	</xsl:apply-templates>
</xsl:template>

<xsl:template match="section/section">
	% latte.xsl says: \subsection
	<xsl:apply-templates>
		<xsl:with-param name="sec">\subsection</xsl:with-param>
	</xsl:apply-templates>
</xsl:template>

<xsl:template match="section/section/section">
	<!-- NOTE: kaikki syvemmät tulevat myös subsubsectioneiksi -->
	% latte.xsl says: \subsubsection
	<xsl:apply-templates>
		<xsl:with-param name="sec">\subsubsection</xsl:with-param>
	</xsl:apply-templates>
</xsl:template>

<xsl:template match="h1">
	<xsl:param name="sec">\section</xsl:param>
	<xsl:value-of select="$sec" />{<xsl:apply-templates />}
</xsl:template>

<!-- KUVAT ja LISTAT -->

<xsl:template match="img">
	\begin{figure}
		\centering
		\includegraphics[width=0.6\textwidth]{<xsl:value-of select="@src" />}
		\caption{<xsl:value-of select="@title" />}
		<!-- TODO: string-process @data-lattex: "fig-facebook-dataflow"->"dataflow" ? -->
		\label{<xsl:value-of select="@data-lattex" />}
	\end{figure}
</xsl:template>

<xsl:template match="ul | ol">
	<!-- TODO: ol tekee varmaan eri itemizen? -->
	\begin{itemize}
	<xsl:for-each select="li">\item{<xsl:apply-templates />}
	</xsl:for-each>
	\end{itemize}
</xsl:template>


<!-- LOPPUHIFISTELYT -->

<!-- TODO: näihin tulee aina rivinvaihto, pitäiskö olla samalla rivillä ettei tulis? -->
<xsl:template match="em">\emph{<xsl:apply-templates />}</xsl:template>
<xsl:template match="strong">\textbf{<xsl:apply-templates />}</xsl:template>
<xsl:template match="cite">\cite{<xsl:apply-templates />}</xsl:template>


</xsl:stylesheet>
