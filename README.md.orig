# bbContentLayoutTool
A Blackboard 'javascript hack' for easily dropping html layout artifacts into the Blackboard WYSIWIG editor.

<h3>Background</h3>

This hack allows Blackboard content editors (Academics/etc.) with little or no HTML knowledge to drop HTML layouts into the WYSIWIG editor, ready for content entry. It was built as part of Blackboard+, an initiative of the University of the Sunshine Coast's C~SALT (Centre for Support and Advancement of Learning and Teaching) team. The hack comes with USC's Blackboard+ HTML artifacts (BbPlus.css).

You can check out a video of how the Content Layout Tool works here: https://mediasite.usc.edu.au/Mediasite/Play/b6bb9131d2494e85bbaaafd13c2f76991d

<h3>Dependencies</h3>

You will need the 'Javascript Hack' building block installed in Blackboard. Your theme should also include the 'Font Awesome' fonts, declared with:  font family 'FontAwesome';

<h3>Installing the Hack</h3>

<<<<<<< HEAD
=======
To install the hack, simply add (upload) the three resource files into the hack and insert into the snippet area as below:
```
<link rel="stylesheet" type="text/css" href="${resourcePath}/bbcltool.css">
<script type="text/javascript" src="${resourcePath}/bbContentLayoutTool.1.0.js"></script>
<script type="text/javascript" src="${resourcePath}/bbPlus_Elements110216.js"></script>
```

The bbplus.css provides the presentation to the HTML artifacts, but this needs to be included inside your Theme.

```
/* BbPlus HTML artifacts */
@import "bbplus.css";
```

<h3>Customising the HTML artifacts</h3>

You can customise or create your own HTML artifacts. The bbPlus_Elements110216.js is a JS object of all the HTML artifacts (HTML structure and variant settings), and is accompanied by the bbplus.css (layout/presentation).

You need to maintain the structure of the file however you can customise what appears within the 'LayoutHTML' and 'Variants' nodes. The 'LayoutHTML' node stores the HTML markup for the artifact, while the 'Variant' node contains the properties that change for each variant. 
Add as many variants for an artifact as you like, and you can create your own custom variant properties. For example, with the Resource artifact below, the 'VariantName' property refers to the H4 title.

``` javascript
"Resource":{
	LayoutHTML:"<div class=\"bbplus bbpclt bbp-layout bbp-resource $_VariantClass_$\"><h4><span>$_VariantName_$ </span>Title for this Resource</h4><p>Enter your resource content here.</p></div>&nbsp;",
	Variant:{
		"Default": {VariantClass:"", VariantName:"Resources"},
		"Lecture Notes": {VariantClass:"bbp-res-lnotes", VariantName:"Lecture Notes"},
		"Files": {VariantClass:"bbp-res-files", VariantName:"Files"}
	}
}
```

>>>>>>> de0a0a3bd6bbeed30218283ca16317ffb1d44c8c

