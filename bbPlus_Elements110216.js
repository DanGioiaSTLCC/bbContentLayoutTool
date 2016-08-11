var USCWizard_Objects = {
	"Lesson Structure": {
		"Learning Outcomes":{
			LayoutHTML: "<div class=\"bbplus bbpclt bbp-struct bbp-struct-learning-outcomes $_VariantClass_$\"><ol><li>The first learning outcome</li><li>The second learning outcome</li><li>etc.</li></ol></div>&nbsp;"
		},
		"Activity":{
			LayoutHTML:"<div class=\"bbplus bbpclt bbp-layout bbp-activity $_VariantClass_$\"><h4><span>$_VariantName_$ </span>Title for this activity</h4><p>Enter your activity content here.</p></div>&nbsp;",
			Variant:{
				"Default": {VariantClass:"", VariantName:"Activity"},
				"Read": {VariantClass:"bbp-act-read", VariantName:"Read"},
				"Watch": {VariantClass:"bbp-act-watch", VariantName:"Watch"},
				"Apply": {VariantClass:"bbp-act-apply", VariantName:"Apply"},
				"Discuss": {VariantClass:"bbp-act-discuss", VariantName:"Discuss"},
				"Module": {VariantClass:"bbp-act-module", VariantName:"Module"},
				"Group/Tutorial": {VariantClass:"bbp-act-group", VariantName:"Group/Tutorial"},
				"Lab": {VariantClass:"bbp-act-lab", VariantName:"Laboratory"},
				"Quiz": {VariantClass:"bbp-act-quiz", VariantName:"Quiz"},
				"Recap": {VariantClass:"bbp-act-recap", VariantName:"Recap"}
			}
		},
		"Resource":{
			LayoutHTML:"<div class=\"bbplus bbpclt bbp-layout bbp-resource $_VariantClass_$\"><h4><span>$_VariantName_$ </span>Title for this Resource</h4><p>Enter your resource content here.</p></div>&nbsp;",
			Variant:{
				"Default": {VariantClass:"", VariantName:"Resources"},
				"Lecture Notes": {VariantClass:"bbp-res-lnotes", VariantName:"Lecture Notes"},
				"Files": {VariantClass:"bbp-res-files", VariantName:"Files"}
			}
		}
	},
	"Content Layout":{
		"Table":{
			LayoutHTML:"<div class=\"bbplus bbpclt bbp-layout bbp-table $_VariantClass_$\"><table><thead><tr><th>#</th><th>First Name</th><th>Last Name</th><th>Username</th></tr></thead><tbody><tr><td>1</td><td>Mark</td><td>Otto</td><td>@mdo</td></tr><tr><td>2</td><td>Otto</td><td>Sally</td><td>@TwBootstrap</td></tr><tr class=\"error\"><td>3</td><td>Jacob</td><td>Thornton</td><td>@fat</td></tr><tr><td>4</td><td>Larry</td><td>Bird</td><td>@twitter</td></tr></tbody></table></div>&nbsp;",
			Variant:{
				"Default": {VariantClass:""},
				"Expanded": {VariantClass:"bbp-table-expanded"},
				"Bordered": {VariantClass:"bbp-table-bordered"},
				"Striped": {VariantClass:"bbp-table-striped"}
			}
		},
		"Information Panel": {
			LayoutHTML: "<div class=\"bbplus bbpclt bbp-layout bbp-info-panel $_VariantClass_$\"><h4>A brief highlight.</h4><p>This panel should be use to highlight content from the rest of the page, so keep it brief (one or two short paragraphs).</p></div>&nbsp;",
			Variant: {
				"Default": {VariantClass:""},
				"Tip": {VariantClass:"bbp-info-tip"},
				"Key": {VariantClass:"bbp-info-key"},
				"Warning": {VariantClass:"bbp-info-warning"}
			}
		},
		"Image Panel":{
			LayoutHTML:"<div class=\"bbplus bbpclt bbp-layout bbp-image-panel $_VariantClass_$\"><img src=\"/branding/themes/USC/custom/images/bbplus/bbplus_thumb.jpg\" alt=\"?\" /><h4>The heading for your image panel</h4><p>A panel of content with an image.</p></div>&nbsp;",
			Variant:{
				"Default":{VariantClass:""},
				"Aligned Right":{VariantClass:"bbp-image-panel-right"},
				"Bordered":{VariantClass:"bbp-image-panel-bordered"},
				"Bordered/Aligned Right":{VariantClass:"bbp-image-panel-right bbp-image-panel-bordered"},
			}
		},
		"Copyright":{
			LayoutHTML:"<div class=\"bbplus bbp-layout bbp-copyright\">$_VariantContent_$</div>&nbsp;",
			Variant:{
				"Default":{VariantContent:"<h5>Copyright Notice</h5><p>COMMONWEALTH OF AUSTRALIA Copyright Act 1968 WARNING<br/>This material has been copied and communicated to you by or on behalf of the University of the Sunshine Coast under Part VA or Part VB of the Copyright Act 1968 (the Act). The material in this communication may be subject to copyright under the Act. Any further copying or communication of this material by you may be the subject of copyright or performers’ protection under the Act.<br/><em>Do not remove this notice.</em></p>"},
				"Attribution":{VariantContent:"<p>Copyright &copy; [year], [Title of image] by [copyright holder] sourced from [publication/website].</p>"}
			}
		}
	}
} 