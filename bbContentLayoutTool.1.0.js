  var afDropper = null;

  /* 
  /* -----------------------------------------------------------------------------
  /* Document Loaded - start
  /* ----------------------------------------------------------------------------- 
  */

  Event.observe(document, "dom:loaded", function() {

    var _debug = false;
    var _selectedElement = null;
    var _colours = ['#C9DECB', '#F2F4B3', '#A8E4FF', '#B5FFC8', '#FFBBBB', '#D0BCFE'];
    var _clearAcknowledged = false;

    //Layout Item being actively hovered
    var activeItem = undefined;
    var activePlaceHolder = undefined;
    var activeVariants = undefined;
    var scrollTopPos = 0;

    //Close Wizard
    var bWizCloseWizard = function() {
      if (_debug) {
        console.log('Closing Wizard');
      }
      document.getElementById('uscWizContainer').style.display = 'none';
      document.body.removeClassName('noscroll');
      document.body.removeChild(document.getElementById('uscWizContainer'));
      
      _clearAcknowledged = false;
      _selectedElement = null;
      activeItem = undefined;
      activePlaceHolder = undefined;
      activeVariants = undefined;
    }

    /* 
    /* -----------------------------------------------------------------------------
    /* Interaction Listeners (Prototype.js)
    /* ----------------------------------------------------------------------------- 
    */


    var deactivateEverything = function() {
      //hide toolbar
      var wizToolBar = document.getElementById('uscWizItemToolbar');
      wizToolBar.removeClassName('activate');

      //remove all active classes from wiz Toolbar
      var wizToolBarActiveItems = wizToolBar.getElementsByClassName('active');
      for (var i = 0; i < wizToolBarActiveItems.length; i++) {
        wizToolBarActiveItems[i].removeClassName('active');
      }

      document.getElementById('uscWizPreviewHidden').appendChild(wizToolBar);



      if (activePlaceHolder !== undefined) {

        //---- activePlaceHolder has been ACTIVE ----//

        //Layout item selected for dropping
        if(activeItem !== undefined) {
          
          //Get index of activePlaceHolder's parent (nodeParent item)
          var aIndex = activePlaceHolder.parentNode.previousSiblings().size();

          //Insert new item at index
          var uscPreview = document.getElementById('uscWizPreview');
          uscPreview.insertBefore(
            buildNode(
              replaceItemSnippetShortCodes(activeItem.htmlObj, "default"),
              activeItem.hasVariants,
              activeItem.category,
              activeItem.name,
              activeItem.variants
              ).build(), document.getElementById('uscWizPreview').children[aIndex + 1]);


          activePlaceHolder.removeClassName("activate");

          //Remove the Message panel
          var msgPanel = uscPreview.getElementsByClassName('bWizMsgPanel');
          for (var i = 0; i < msgPanel.length; i++) {
              uscPreview.removeChild(msgPanel[i]);
          }

          //deactivate drop state
          activePlaceHolder.removeClassName("drop");

        }

        //deactivate placeholder
        activePlaceHolder.removeClassName("activate");

        //Clean up
        activeItem = undefined;
        activePlaceHolder = undefined;

      } else if(activeVariants !== undefined) {

        //---- activeVariants has been ACTIVE ----//
        activeVariants.removeClassName('activate');
        activeVariants = undefined;

      }

      console.log("Everything deactivated.");
    }


    var uscWizAddItemPlaceholderMouseDown = function(event) {

      var wizToolBar = document.getElementById('uscWizItemToolbar');
      //
      activePlaceHolder = this;
      activePlaceHolder.appendChild(wizToolBar);

      activePlaceHolder.addClassName("activate");
      wizToolBar.addClassName("activate");

      console.log("activePlaceHolder:" + activePlaceHolder);
    }

    var uscWizAddItemPlaceholderMouseUp = function(event) {
      
      deactivateEverything();
    }
    
    var uscWizContainerMouseUp = function(event) {
      deactivateEverything();

    }

    var uscWizLayoutItemCategoryOver = function(event) {
      this.addClassName('active');
    }

    var uscWizLayoutItemCategoryOut = function(event) {
      this.removeClassName('active');
      event.stop(); //stop event bubbling to parent - fade out toolbar (firefox bug)
    }


    var uscWizItemUnsetMouseOver = function(event) {

      mouseX = Event.pointerX(event);
      mouseY = Event.pointerY(event);

      //console.log('nodeLeft: ' + this.next(1));
      console.log('position ' + mouseX + ' -- ' + mouseY);
      
      activeVariants = this.next(1);
      activeVariants.setStyle({
        left: mouseX + 'px',
        top: (mouseY - scrollTopPos) + 'px' //scrollTopPos - calculated on clTool launch
      });
      activeVariants.addClassName("activate");

      console.log("activeVariants:" + activeVariants);
      

    }

    var uscWizItemUnsetMouseUp = function(event) {
      deactivateEverything();
    }


    /* 
    /* -----------------------------------------------------------------------------
    /* Search/Replace Item Template Shortcodes - $_ _$ variables (ie. ImageLocation / Class / etc.)
    /* ----------------------------------------------------------------------------- 
    */
    var replaceItemSnippetShortCodes = function(htmlObj, variable) {
      var variableDetails = null;
      console.log("htmlObj:" + htmlObj);
      console.dir(htmlObj);
      var tmpHTMLArr = htmlObj.LayoutHTML.split('$_');
      //var tmpHTMLArr = htmlObj.split('$_');
      var rtrnStr = null;
      HTMLReplaceArr = [];
      for (var i = 0; i < tmpHTMLArr.length; i++) {
        tmpHTMLArr[i] = tmpHTMLArr[i].substring(0, tmpHTMLArr[i].indexOf('_$'));
        if (tmpHTMLArr[i] !== "") {
          HTMLReplaceArr.push(tmpHTMLArr[i]);
          if (_debug) {
            console.log("Adding Variable Name: " + tmpHTMLArr[i]);
          }
        }
      }
      delete tmpHTMLArr;

      //afDropper = HTMLReplaceArr;

      if (!htmlObj.Variant) {
        rtrnStr = htmlObj.LayoutHTML;
      } else if (htmlObj.Variant && htmlObj.Variant[variable]) {
        if (_debug) {
          console.log("trying to return 1: " + htmlObj.Variant[variable]);
        }
        variableDetails = htmlObj.Variant[variable];
        var replacedHTML = htmlObj.LayoutHTML;
        for (var i = 0; i < HTMLReplaceArr.length; i++) {
          if (_debug) {
            console.log("$_" + HTMLReplaceArr[i] + "_$ = " + variableDetails[HTMLReplaceArr[i]]);
          }
          replacedHTML = replacedHTML.replace("$_" + HTMLReplaceArr[i] + "_$", variableDetails[HTMLReplaceArr[i]]);
        }
        rtrnStr = replacedHTML;
      } else {
        if (_debug) {
          console.log("trying to return 2: " + htmlObj.Variant["Default"]);
        }
        variableDetails = htmlObj.Variant["Default"];
        for (var i = 0; i < HTMLReplaceArr.length; i++) {
          if (_debug) {
            console.log("$_" + HTMLReplaceArr[i] + "_$ = " + variableDetails[HTMLReplaceArr[i]]);
          }
          rtrnStr = htmlObj.LayoutHTML.replace("$_" + HTMLReplaceArr[i] + "_$", variableDetails[HTMLReplaceArr[i]]);
        }
      }
      return rtrnStr;
    }

    /*
    var updateItemWithVariant = function() {

      //console.log(hoverItem.parentNode.parentNode.variants);
   
      //TODO: Fix
      var tmpMetaData = [];
      var tmpNode = this.parentNode.parentNode.parentNode.querySelector('#nodeLeft').firstChild;
      tmpMetaData[0] = tmpNode.getAttribute("data-wizLayoutItemCat");
      tmpMetaData[1] = tmpNode.getAttribute("data-wizLayoutItem");
      tmpMetaData[2] = tmpNode.getAttribute("data-wizLayoutItemVariant");

      //Update node HTML
      this.parentNode.parentNode.parentNode.querySelector('#nodeLeft').innerHTML = replaceItemSnippetShortCodes(obj, Object.keys(obj.Variant)[w]);

      //Append new meta Data
      appendMetaData(this.parentNode.parentNode.parentNode.querySelector('#nodeLeft').firstChild, tmpMetaData[0], tmpMetaData[1], Object.keys(obj.Variant)[w]);




      //Update node HTML
      this.parentNode.parentNode.parentNode.querySelector('#nodeLeft').innerHTML = replaceItemSnippetShortCodes(obj, Object.keys(obj.Variant)[w]);

      //Append new meta Data
      appendMetaData(this.parentNode.parentNode.parentNode.querySelector('#nodeLeft').firstChild, tmpMetaData[0], tmpMetaData[1], Object.keys(obj.Variant)[w]);


    }
    */

    /* 
    /* -----------------------------------------------------------------------------
    /* Retrieve Wizard Layout Items for Category (ele)
    /* ----------------------------------------------------------------------------- 
    */
    var LayoutItemObj = Class.create({
      initialize: function(id, name, hasVariants, category, htmlObj, variants, catItem) {
        this.name = name;
        this.hasVariants = hasVariants;
        this.category = category;
        this.htmlObj = htmlObj;
        this.variants = variants;
        //DOM Sprite for Object
        //console.log('catItem: ' + catItem);
        this.catItem = catItem;
        this.sprite = document.createElement('li');
        this.sprite.id = id;
        this.sprite.innerHTML = this.name;
        catItem.appendChild(this.sprite);
        //console.log('test--> ' + $(this.sprite).id);
        $(this.sprite).observe('mouseover', this.itemOver.bind(this));
        $(this.sprite).observe('mouseout', this.itemOut.bind(this));
        //console.log('new Layout Item created');
      },
      itemOver: function(e, callback) {
        //console.log("event-" + e + " --- " + this.name + " hovered");
        this.sprite.addClassName('active');
        activeItem = this;
        activePlaceHolder.addClassName('drop');
      },
      itemOut: function(e, callback) {
        this.sprite.removeClassName('active');
        activeItem = undefined;
        activePlaceHolder.removeClassName('drop');
        e.stop(); //stop event bubbling to parent - fade out toolbar (firefox bug)
     }

   });

  var VariantItemObj = Class.create({
    initialize: function(name, layoutNodeObj, variantList, nodeDOMObj) {
      this.name = name;
      this.variantList = variantList;
      this.layoutNodeObj = layoutNodeObj;
      this.nodeDOMObj = nodeDOMObj; //nodeDOMObj.firstChild;
      this.sprite = document.createElement('li');
      this.sprite.innerHTML = this.name;
      variantList.appendChild(this.sprite);
      //
      $(this.sprite).observe('mouseover',this.itemOver.bind(this));
      $(this.sprite).observe('mouseout',this.itemOver.bind(this));
    },
    itemOver: function(e, callback) {
      this.sprite.toggleClassName('active');

      //Set current variant
      var arr = this.sprite.siblings();
      arr.each(function(node){
        node.removeClassName('current');
      });
      this.sprite.addClassName('current');
      this.nodeDOMObj.innerHTML = replaceItemSnippetShortCodes(this.layoutNodeObj,this.name);

      //Append new meta Data
      //appendMetaData(this.nodeDOMObj, tmpMetaData[0], tmpMetaData[1], Object.keys(obj.Variant)[w]);     

    }

  });

  var retrieveLayoutItemObjects = function(ele, btn, y) {

      //Category has no objects
      if (Object.keys(USCWizard_Objects[ele]).length === 0) {
        if (_debug) {
          console.log('Nothing Defined for type ' + ele.name);
        }
        //Retrieve Category items
      } else {
        //Debug  
        if (_debug) {
          console.log(ele + ' = ' + USCWizard_Objects[ele] + ' - ' + Object.keys(USCWizard_Objects[ele]));
        }

        //Create new list to store category Layout Items
        var uscWizCatList = document.createElement('ul');
        uscWizCatList.className = 'uscWizItems';
        uscWizCatList.id = "uscWiz-cat-" + ele;

        //Retrieve and populate list with Layout items
        for (var i = 0; i < Object.keys(USCWizard_Objects[ele]).length; i++) {
          (function() {
            var k = i;

            //Set Item Layout Name
            //uscWizLayoutItem.innerHTML = Object.keys(USCWizard_Objects[ele])[i];

            //Retrieve object data
            var tmpElement = USCWizard_Objects[Object.keys(USCWizard_Objects)[y]];
            var tmpElementObjs = tmpElement[Object.keys(tmpElement)[k]];
            var hasVariants = false;
            if (tmpElementObjs.Variant) {
              hasVariants = true;
            }

            //var uscWizLayoutItem = document.createElement('li');
            var lItemID = "uscWiz-" + ele + "-item-" + k;
            var uscWizLayoutItem = new LayoutItemObj(lItemID, Object.keys(tmpElement)[k], hasVariants, Object.keys(USCWizard_Objects)[y], tmpElementObjs, "default", uscWizCatList);

          }())
        }
      }


      return uscWizCatList;

      //_selectedElement.classList.remove('btnActive');
      // _selectedElement = btn;
      // btn.classList.add('btnActive');
    }

    /*** Build Raw elements ***/
    var buildRawHTML = function(obj) {
      var str = "";
      for (var i = 0; i < obj.childNodes.length; i++) {
        if (obj.childNodes[i].querySelector('#nodeLeft')) {
          str += obj.childNodes[i].querySelector('#nodeLeft').innerHTML;
        } else {
          str += obj.childNodes[i].toString();
        }
      }
      return str;
    }

    /*
    Not used? - Early code from Ashley depreciated ?

    var contentBuild = function(object, variant) {
      var rtrnStr = null;

      console.log('contentBuild -' + object + ' - variant: ' + variant);

      if (!variant) {
        if (_debug) {
          console.log("No variant defined, only spitting out LayoutHTML");
        }
        rtrnStr = object.LayoutHTML;
        if (_debug) {
          console.log(object);
        }
      } else {
        if (_debug) {
          console.log(variant + " variant requested.");
        }
        rtrnStr = placeholderReplace(object.LayoutHTML, variant);
      }

      return rtrnObj;
    }
    */

    var splitMetaData = function(obj) {
      var attr = {};
      var objHTML = obj.innerHTML;
    }


    //Create data attributes for element - TIM
    var createDataAttribute = function(node, attr, val) {
      var tmpAttr = document.createAttribute("data-" + attr);
      tmpAttr.value = val;
      node.setAttributeNode(tmpAttr);
      return true;
    }

    //Appends data to nodeParent's first child - <div>
    var appendMetaData = function(node, ele, obj, variant) {

      var nodeMetaDataElement = document.createAttribute("data-wizLayoutItemCat");
      nodeMetaDataElement.value = ele;
      node.setAttributeNode(nodeMetaDataElement);

      var nodeMetaDataObject = document.createAttribute("data-wizLayoutItem");
      nodeMetaDataObject.value = obj;
      node.setAttributeNode(nodeMetaDataObject);

      var nodeMetaDataVariant = document.createAttribute("data-wizLayoutItemVariant");
      nodeMetaDataVariant.value = variant;
      node.setAttributeNode(nodeMetaDataVariant);

      console.log("Meta Data Appended");
      return true;
    }

    var getWizMsgPanel = function(msgContent,includePlaceholder) {

      includePlaceholder = typeof includePlaceholder !== false ? includePlaceholder : false;

      msgPanel = document.createElement('div');
      msgPanel.className = 'nodeParent bWizMsgPanel';
      msgPanel.innerHTML = msgContent;
      //Include Placeholder?
      if(includePlaceholder) msgPanel.appendChild(getPlaceholder());

      return msgPanel;
      
    }

    //Creates 'Add New Layout Item' Placeholder
    var getPlaceholder = function() {
      placeholder = document.createElement('div');
      placeholder.className = 'uscWizAddItemPlaceholder';
      placeholder.innerHTML = '<i class="icon-plus"></i>';
      placeholder.observe('mousedown', uscWizAddItemPlaceholderMouseDown);
      //placeholder.observe('mouseup', uscWizAddItemPlaceholderMouseUp);
      return placeholder;
    }

    /* 
    /* -----------------------------------------------------------------------------
    /* Build new Layout Item 'Node'
    /* ----------------------------------------------------------------------------- 
    */

    var buildNode = function(content, hasVariants, elemCat, elemItem, elemVariant) {

      elemCat = typeof elemCat !== null ? elemCat : null;
      elemItem = typeof elemItem !== null ? elemItem : null;
      elemVariant = typeof elemVariant !== null ? elemVariant : null;

      /*
      if (!elemCat || elemCat === null) {
        elemCat = null;
      }

      if (!elemItem || elemItem === null) {
        elemItem = null;
      }

      if (!elemVariant || elemVariant === null) {
        elemVariant = null;
      }
      */

      var hasVariants = hasVariants;

      var nodeParent = document.createElement('div');
      nodeParent.id = 'nodeParent';
      nodeParent.className = 'nodeParent fresh unset';

      var nodeLeft = document.createElement('div');
      nodeLeft.id = 'nodeLeft';
      nodeLeft.className = 'nodeLeft';
      nodeLeft.innerHTML = content;

      // If no metadata object exists on the node
      if (!nodeLeft.firstChild.dataset.wizLayoutItemCat) {
        if (_debug) {
          console.log('No Meta Data on this object');
        }
        //Set new data attributes on element
        appendMetaData(nodeLeft.firstChild, elemCat, elemItem, elemVariant);

      } else {
        //Retreive existing data attributes for element
        ele = USCWizard_Objects[nodeLeft.firstChild.getAttribute("data-wizLayoutItemCat")];
        obj = ele[nodeLeft.firstChild.getAttribute("data-wizLayoutItem")];

        //If this element has a 'variant' data attribute
        if (nodeLeft.firstChild.getAttribute("data-wizvariant") && obj.Variant) {
          hasVariants = true;
          console.log("Has Variants " + nodeLeft.firstChild.innerHTML)
        } else {
          console.log("Has metadata, but no variants available");
        }

        if (_debug) {
          console.log('Meta Data Exists');
        }

        //console.log(nodeLeft.firstChild.dataset.wizLayoutItemCat + ' | ' + nodeLeft.firstChild.dataset.wizLayoutItem + ' | ' + nodeLeft.firstChild.dataset.data-wizLayoutItemVariant);
      }


      //Define Node edit tools
      var nodeRight = document.createElement('ul');
      nodeRight.id = 'nodeRight';
      nodeRight.className = 'uscWizNodeEditTools';


      //Node edit tool - remove
      var nodeRemove = document.createElement('li');
      nodeRemove.className = 'uscRemove';
      nodeRemove.id = 'btnRemove';
      nodeRemove.innerHTML = '<i class="icon-remove"></i>';
      nodeRemove.addEventListener("click", function() {
        
        //Tim - this needs moving
        var uscWizPreviewDiv = document.getElementById('uscWizPreview');
        uscWizPreviewDiv.removeChild(this.parentNode.parentNode);

        //console.log('test:' + uscWizPreviewDiv.firstChild.hasClassName("bWizMsgPanel"));
        //if(uscWizPreviewDiv.firstChild == null || uscWizPreviewDiv.firstChild.hasClassName("bWizMsgPanel")) { 
        
        //Just removed last item?
        if(uscWizPreviewDiv.childNodes.length == 0) { //|| uscWizPreviewDiv.firstChild.hasClassName("bWizMsgPanel") != true) {
          console.log('no content!'); 
          //Add new welcome message
          var newLayoutMsg = "<div><h3>Hello. Your layout is blank.</h3><p>To get started with building your Item layout, launch the Layout Toolbar.</p></div>";
          uscWizPreviewDiv.appendChild(getWizMsgPanel(newLayoutMsg, true));
        }
      });

      //Node edit tool - move down
      var nodeDown = document.createElement('li');
      //nodeDown.className = 'btnNodeControl';
      nodeDown.id = 'btnMoveDown';
      nodeDown.innerHTML = '<i class="icon-chevron-down"></i>';
      nodeDown.addEventListener("click", function() {
        var ele = this.parentNode.parentNode;
        ele.parentNode.insertBefore(ele, ele.nextElementSibling.nextElementSibling);
      });

      //Node edit tool - move up
      var nodeUp = document.createElement('li');
      //nodeUp.className = 'btnNodeControl';
      nodeUp.innerHTML = '<i class="icon-chevron-up"></i>';
      nodeUp.addEventListener("click", function() {
        var ele = this.parentNode.parentNode;

        //if previous sibling is welcome message panel (0 index) don't move up
        if(!ele.previousElementSibling.hasClassName('bWizMsgPanel')) {        
          ele.parentNode.insertBefore(ele, ele.previousElementSibling);
        }
      });

      nodeRight.appendChild(nodeRemove);
      nodeRight.appendChild(nodeUp);
      nodeRight.appendChild(nodeDown);
      nodeRight.className = 'uscWizNodeEditTools';

      //Build Variant Item List?
      var nodeVariantList = document.createElement('ul');
      nodeVariantList.id = "uscWizNodeVariants";
      nodeVariantList.className = "uscWizNodeVariants disabled";
      //nodeVariantList.innerHTML = '<i class="fa fa-ban fa-2x"></i>';

      if (hasVariants) {

        //remove disabled
        nodeVariantList.removeClassName('disabled');

        nodeVariantList.innerHTML = '<i class="icon-magic"></i>';


        //Variant List event listeners
        nodeLeft.observe("mousedown", uscWizItemUnsetMouseOver);
        nodeLeft.observe("mouseup", uscWizItemUnsetMouseUp);
        //nodeVariantList replaced with nodeLeft

        //nodeVariantList.addEventListener("mousedown", function() {

          if (!_clearAcknowledged) {
            console.log("-- TODO -- Lock content if content has been edited?? (Please be aware, if content exists in the node you're modifying, the content will be removed) ");
            _clearAcknowledged = true;
          }

        //Retrieve object and category
        ele = USCWizard_Objects[nodeLeft.firstChild.getAttribute("data-wizLayoutItemCat")];
        obj = ele[nodeLeft.firstChild.getAttribute("data-wizLayoutItem")];

        //Variant Popout
        //var uscWizVariantPopout = document.createElement('ul');
        //uscWizVariantPopout.className = 'uscWizVariantPopout';
        //uscWizVariantPopout.style.left = this.style.left;
        //uscWizVariantPopout.style.top = this.style.top;

        //Retrieve variants and add to variant list
        for (var v = 0; v < Object.keys(obj.Variant).length; v++) {

          //(function() {

          //Create new variant item
          var uscWizVariantItem = document.createElement('li');
          var w = v;
          uscWizVariantItem.className = 'uscWizVariantItem';
          uscWizVariantItem.id = Object.keys(obj.Variant)[v];
          uscWizVariantItem.innerHTML = Object.keys(obj.Variant)[v];
          //uscWizVariantItem.innerHTML = '<span>' + Object.keys(obj.Variant)[v] + '</span><i class="fa fa-edit"></i>';

          //Hover event listener
          //uscWizVariantItem.observe("mouseover", uscWizItemVariantHover);


          //Append to variant list
          //nodeVariantList.appendChild(uscWizVariantItem);

          //Variant Object
          var uscWizVariantItem2 = new VariantItemObj(Object.keys(obj.Variant)[v], obj ,nodeVariantList, nodeLeft);

          //}())

        }

        /*uscWizVariantPopout.addEventListener("mouseleave", function() {
          this.parentNode.removeChild(this);
        });
        this.parentNode.appendChild(uscWizVariantPopout);
        */

        //});

        //Append variant list to parent node
        //nodeParent.appendChild(nodeVariantList);
      }
      //what's this for? - Tim
      var tmpEle = USCWizard_Objects[elemCat];


      //The Node object
      var node = {
        parent: nodeParent,
        nodeContent: nodeLeft,
        nodeEditTools: nodeRight,
        nodeVariantList: nodeVariantList,
        placeholder: getPlaceholder(),
        build: function() {
          this.parent.appendChild(this.nodeContent);
          this.parent.appendChild(this.nodeEditTools);
          this.parent.appendChild(this.nodeVariantList);
          this.parent.appendChild(this.placeholder);
          return this.parent;
        }
      }
      return node;
    }


    /* 
    /* -----------------------------------------------------------------------------
    /* Build Wizard 
    /* ----------------------------------------------------------------------------- 
    */

    var uscBuildWizard = function() {
      /*if (document.getElementById('user_title') && document.getElementById('user_title').value === "") {
        document.getElementById('user_title').value = "USC's Blackboard Wizard";
      }*/

      //Stop scroll on body
      document.body.addClassName('noscroll');
      //Scroll Page to top
      scrollTopPos = document.viewport.getScrollOffsets()['top'];
      //document.body.scrollTo(0);


      //Wizard Interface - Container (LightBox)
      var uscWizContainer = document.createElement('section');
      uscWizContainer.className = 'uscWizContainer uscBorderBox';
      uscWizContainer.id = 'uscWizContainer';

      //Wizard Interface - Container Event Listener (mouseup)
      uscWizContainer.observe('mouseup', uscWizContainerMouseUp);


      //Wizard Interface - Wrapper
      var uscWizWrapper = document.createElement('div');
      uscWizWrapper.className = 'uscWizWrapper';

      //Wizard Interface - Main Controls (Save/Close)
      var uscWizardControls = document.createElement('ul');
      uscWizardControls.className = 'uscWizardControls';
      uscWizardControls.id = 'uscWizardControls';

      //var controlItem = document.createElement('li');

      var uscWizCancelBtn = document.createElement('a');
      uscWizCancelBtn.className = 'uscBorderBox';
      uscWizCancelBtn.innerHTML = "Cancel <i class=\"icon-remove\"></i>";
      uscWizCancelBtn.addEventListener("click", function() {
        bWizCloseWizard();
      }, false);

      var uscWizCancelBtnWrapper = document.createElement('li');
      uscWizCancelBtnWrapper.appendChild(uscWizCancelBtn);


      var uscWizCommitBtn = document.createElement('a');
      uscWizCommitBtn.className = 'uscBorderBox';
      uscWizCommitBtn.innerHTML = "Ok <i class=\"icon-save\"></i>";
      uscWizCommitBtn.addEventListener("click", function() {
        if (_debug) {
          console.log("commit");
        }

        //Check if bWizMsgPanel exists
        var uscPreview = document.getElementById('uscWizPreview');
        var msgPanel = uscPreview.getElementsByClassName('bWizMsgPanel');
        for (var i = 0; i < msgPanel.length; i++) {
            uscPreview.removeChild(msgPanel[i]);
        }

        tinyMCE.activeEditor.setContent(buildRawHTML(document.getElementById('uscWizPreview')));
        bWizCloseWizard();
      }, false);

      var uscWizCommitBtnWrapper = document.createElement('li');
      uscWizCommitBtnWrapper.appendChild(uscWizCommitBtn);

      //Append links to Panel control
      uscWizardControls.appendChild(uscWizCancelBtnWrapper);
      uscWizardControls.appendChild(uscWizCommitBtnWrapper);

      uscWizContainer.appendChild(uscWizWrapper);
      uscWizWrapper.appendChild(uscWizardControls);


      /*
      TO_DELETE
            //Wizard Tools Navigation
            var uscWizTools = document.createElement('aside');
            uscWizTools.className = 'uscWizTools uscBorderBox';
            uscWizTools.innerHTML = '<h3><i class=\"fa fa-chevron-right\"></i></h3>';
            */


      //Preview Panel
      var uscWizLayout = document.createElement('article');
      uscWizLayout.className = 'uscWizLayout uscBorderBox';
      uscWizLayout.id = 'uscWizLayout';

      var uscWizPreview = document.createElement('div');
      uscWizPreview.className = 'uscWizPreview uscBorderBox';
      uscWizPreview.id = 'uscWizPreview';

      //Preview hidden Panel (Existing WYSIWIG editor content)
      var uscWizPreviewHidden = document.createElement('div');
      uscWizPreviewHidden.className = 'uscWizPreviewHidden uscBorderBox';
      uscWizPreviewHidden.id = 'uscWizPreviewHidden';

      //uscWizPreviewHidden.appendChild(getWizMsgPanel());

      uscWizLayout.appendChild(uscWizPreview);
      uscWizLayout.appendChild(uscWizPreviewHidden);

      //TO_DELETE uscWizWrapper.appendChild(uscWizTools);
      uscWizWrapper.appendChild(uscWizLayout);


      /* 
      /* -----------------------------------------------------------------------------
      /* Build Wizard Toolbar - Layout Items
      /* ----------------------------------------------------------------------------- 
      */

      //Wizard Tools Category Items
      var uscWizItemToolbar = document.createElement('ul');
      uscWizItemToolbar.className = 'uscWizItemToolbar uscBorderBox';
      uscWizItemToolbar.id = 'uscWizItemToolbar';
      //Wizard Tools Element Items

      var uscWizElements = document.createElement('ul');
      uscWizElements.className = 'uscWizElements uscBorderBox';
      uscWizElements.id = 'uscWizElements';

      //Append Layout Toolbar here for start
      uscWizLayout.appendChild(uscWizItemToolbar);

      //
      //TO_DELETE uscWizTools.appendChild(uscWizItemToolbar);
      //TO_DELETE uscWizTools.appendChild(uscWizElements);


      //Build Wizard Toolbar Category elements
      for (var i = 0; i < Object.keys(USCWizard_Objects).length; i++) {
        (function() {

          //Create item
          var k = i;
          var uscWizElement = document.createElement('li');
          //uscWizElement.className = 'uscWizElement uscBorderBox';
          //uscWizElement.className = 'active';
          uscWizElement.innerHTML = '<i class=\"fa fa-tasks fa-2x\"></i><span>' + Object.keys(USCWizard_Objects)[k] + '</span>';

          //hover event listener
          uscWizElement.observe('mouseover', uscWizLayoutItemCategoryOver);
          uscWizElement.observe('mouseout', uscWizLayoutItemCategoryOut);

          //Add Layout Item Category to Toolbar
          uscWizItemToolbar.appendChild(uscWizElement);

          //Append category Layout Item list

          //var newList = retrieveLayoutItemObjects(Object.keys(USCWizard_Objects)[k], this, k);
          //console.log(Object.keys(USCWizard_Objects)[k] + ' list: ' + newList);

          uscWizElement.appendChild(retrieveLayoutItemObjects(Object.keys(USCWizard_Objects)[k], this, k));

        }())
}

      // Add Wizard Interface to Page
      document.body.appendChild(uscWizContainer);
    }


    /* 
    /* -----------------------------------------------------------------------------
    /* Create Layout Wizard launch button and reset/setup Layout Preview panel
    /* ----------------------------------------------------------------------------- 
    */

    var summonWizard = function() {
      // Add the Button to start the wizard
      var uscWizLaunchButton = document.createElement('a');
      uscWizLaunchButton.className = 'launch-btn';
      uscWizLaunchButton.innerHTML = 'Launch Content Layout Tool';
      //When Wizard is launched
      uscWizLaunchButton.addEventListener("click", function() {
        //Build Wizard
        uscBuildWizard();
        
        //Retrieve content from WYSIWIG editor
        document.getElementById('uscWizPreviewHidden').innerHTML = tinyMCE.activeEditor.getContent({ format: 'raw' }); //LIVE
        //document.getElementById('uscWizPreviewHidden').innerHTML = '<br>'; //DEV -- <p><br data-mce-bogus="1"></p>

        //Clear Wizard Layout Preview panel
        var uscWizPreviewDiv = document.getElementById('uscWizPreview');
        uscWizPreviewDiv.innerHTML = "";

        //Existing content?
        if(document.getElementById('uscWizPreviewHidden').childNodes.length > 0 && (document.getElementById('uscWizPreviewHidden').childNodes[0].outerHTML !== '<p><br data-mce-bogus="1"></p>') && (document.getElementById('uscWizPreviewHidden').childNodes[0].outerHTML !== '<br>')) {

          //Add Basic layout Message
          var basicMsg = "<div><h3>You've got some content there.</h3><p>Build the rest of your Item layout by adding to your content with the Layout Toolbar.</div>";
          //BBCon - removed message that appears when content already exists
          uscWizPreviewDiv.appendChild(getWizMsgPanel(basicMsg,true));

        //Populate Wizard Layout Preview panel with existing content
        for (var i = 0; i < document.getElementById('uscWizPreviewHidden').childNodes.length; i++) {
            //Build new Node for each content item
            uscWizPreviewDiv.appendChild(buildNode(document.getElementById('uscWizPreviewHidden').childNodes[i].outerHTML).build());
        }
      } else {
        //Add New Layout message
        var newLayoutMsg = "<div><h3>Hello. Your layout is blank.</h3><p>To get started with building your Item layout, launch the Layout Toolbar.</p></div>";
        uscWizPreviewDiv.appendChild(getWizMsgPanel(newLayoutMsg, true));
      }
    }, false);


      //Finally - add Layout Wizard Launch button to page
      document.getElementById('dataCollectionContainer').querySelector('#step1').appendChild(uscWizLaunchButton);
    }

    /* 
    /* -----------------------------------------------------------------------------
    /* Make it happen!
    /* ----------------------------------------------------------------------------- 
    */
    summonWizard();
    //if(_debug) { console.log(Object.keys(USCWizard_Objects)); }

  });