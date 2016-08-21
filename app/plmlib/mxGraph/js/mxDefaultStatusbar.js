/**
 * Function: addSwitchMode
 * 
 * Overrides function to allow the creation of buttons with image AND 
 * text if the additional parameter showTextAndIcon is true.
 */
mxToolbar.prototype.addSwitchMode = function(title, icon, funct, pressedIcon, style, showTextAndIcon)
{
	var btn = document.createElement('button');
	btn.initialClassName = style || 'mxToolbarMode';
	btn.className = btn.initialClassName;
	btn.setAttribute('title', title);
	var img = document.createElement('img');
	btn.img = img;
	
	if (icon != null)
	{
		img.setAttribute('src', icon);
		img.altIcon = pressedIcon;
		btn.appendChild(img);
	}
	if (showTextAndIcon)
	{
		var spn = document.createElement('span');
		mxUtils.write(spn, title);
		btn.appendChild(spn);
	}		
	
	mxEvent.addListener(btn, 'click', mxUtils.bind(this, function(evt)
	{
		var tmp = this.selectedMode.altIcon;
		
		if (tmp != null)
		{
			this.selectedMode.img.altIcon = this.selectedMode.getAttribute('src');
			this.selectedMode.img.setAttribute('src', tmp);
		}
		else
		{
			this.selectedMode.className = this.selectedMode.initialClassName;
		}
		
		if (this.updateDefaultMode)
		{
			this.defaultMode = btn;
		}
		
		this.selectedMode = btn;
		
		var tmp = img.altIcon;
		
		if (tmp != null)
		{
			img.altIcon = img.getAttribute('src');
			img.setAttribute('src', tmp);
		}
		else
		{
			btn.className = btn.initialClassName+'Selected';
		}
		
		this.fireEvent(new mxEventObject(mxEvent.SELECT));
		funct();
	}));
	
	this.container.appendChild(btn);

	if (this.defaultMode == null)
	{
		this.defaultMode = btn;
		this.selectedMode = btn;
		
		var tmp = img.altIcon;
		
		if (tmp != null)
		{
			img.altIcon = img.getAttribute('src');
			img.setAttribute('src', tmp);
		}
		else
		{
			btn.className = btn.initialClassName+'Selected';
		}
		
		funct();
	}
	
	return btn;
};

/**
 * Function: selectMode
 * 
 * Overrides the original function to check if the toolbar is enabled 
 * before showing the icon as pressed and calling the associated action.
 * Used by State and Note templates. 
 */
mxToolbar.prototype.selectMode = function(domNode, funct)
{
	if (this.selectedMode != domNode && this.enabled)
	{
		var tmp = this.selectedMode.altIcon;
		
		if (tmp != null)
		{
			this.selectedMode.altIcon = this.selectedMode.getAttribute('src');
			this.selectedMode.setAttribute('src', tmp);
		}
		else
		{
			this.selectedMode.className = this.selectedMode.initialClassName;
		}
		
		this.selectedMode = domNode;
		var tmp = this.selectedMode.altIcon;
		
		if (tmp != null)
		{
			this.selectedMode.altIcon = this.selectedMode.getAttribute('src');
			this.selectedMode.setAttribute('src', tmp);
		}
		else
		{
			this.selectedMode.className = this.selectedMode.initialClassName+'Selected';
		}
		
		this.fireEvent(new mxEventObject(mxEvent.SELECT, "function", funct));
	}
};

/**
 * Function: addItem
 * 
 * Overrides function to allow the creation of buttons with image AND 
 * text if the additional parameter showTextAndIcon is true.
 */
mxToolbar.prototype.addItem = function(title, icon, funct, pressedIcon, style, factoryMethod, showTextAndIcon)
{
	var btn = document.createElement('button');
	var initialClassName = style || ((factoryMethod != null) ?
			'mxToolbarMode' : 'mxToolbarItem');
	btn.className = initialClassName;
	btn.setAttribute('title', title);
	var img = document.createElement('img');
	
	if (icon != null)
	{
		img.setAttribute('src', icon);
		btn.appendChild(img);
	} 
	else 
	{
		btn.className += ' textOnly';
	}
	
	if (showTextAndIcon)
	{
		var spn = document.createElement('span');
		mxUtils.write(spn, title);
		btn.appendChild(spn);
	}
	if (title != null)
	{
		this.container.appendChild(btn);

		// Invokes the function on a click on the toolbar item
		if (funct != null)
		{
			mxEvent.addListener(btn, /*(mxClient.IS_TOUCH) ? 'touchend' :*/ 'click', funct);
		}
		
		var md = (mxClient.IS_TOUCH) ? 'touchstart' : 'mousedown';
		var mu = (mxClient.IS_TOUCH) ? 'touchend' : 'mouseup';
	
		// Highlights the toolbar item with a gray background
		// while it is being clicked with the mouse
		mxEvent.addListener(btn, md, mxUtils.bind(this, function(evt)
		{
			if (pressedIcon != null)
			{
				img.setAttribute('src', pressedIcon);
			}
			else
			{
				//img.style.backgroundColor = 'gray';
			}
			
			// Popup Menu
			if (factoryMethod != null)
			{
				if (this.menu == null)
				{
					this.menu = new mxPopupMenu();
					this.menu.init();
				}
				
				var last = this.currentImg;
				
				if (this.menu.isMenuShowing())
				{
					this.menu.hideMenu();
				}
				
				if (last != img)
				{
					// Redirects factory method to local factory method
					this.currentImg = img;
					this.menu.factoryMethod = factoryMethod;
					
					var point = new mxPoint(
						img.offsetLeft,
						img.offsetTop + img.offsetHeight);
					this.menu.popup(point.x, point.y, null, evt);
	
					// Sets and overrides to restore classname
					if (this.menu.isMenuShowing())
					{
						img.className = initialClassName + 'Selected';
						
						this.menu.hideMenu = function()
						{
							mxPopupMenu.prototype.hideMenu.apply(this);
							img.className = initialClassName;
							this.currentImg = null;
						};
					}
				}
			}
		}));
	
		var mouseHandler = mxUtils.bind(this, function(evt)
		{
			if (pressedIcon != null)
			{
				img.setAttribute('src', icon);
			}
			else
			{
				//img.style.backgroundColor = '';
			}
		});
		
		mxEvent.addListener(btn, mu, mouseHandler);
		mxEvent.addListener(btn, 'mouseout', mouseHandler);
		
		return btn;

	}

	img.className = initialClassName + ' imageOnly';
	this.container.appendChild(img);
	return img;
		
};

/**
 * Function: addMode
 * 
 * Overrides function to allow the creation of buttons with image AND 
 * text if the additional parameter showTextAndIcon is true.
 */
mxToolbar.prototype.addMode = function(title, icon, funct, pressedIcon, style, showTextAndIcon)
{
	var btn = document.createElement('button');
	var img = document.createElement('img');
	
	btn.img = img;
	btn.initialClassName = style || 'mxToolbarMode';
	btn.className = btn.initialClassName;
	btn.setAttribute('title', title);

	if (icon != null)
	{
		img.setAttribute('src', icon);
		img.altIcon = pressedIcon;
		btn.appendChild(img);
	}
	if (showTextAndIcon != null)
	{
		var spn = document.createElement('span');
		mxUtils.write(spn, title);
		btn.appendChild(spn);
	}
	
	if (this.enabled)
	{
		mxEvent.addListener(btn, 'click', mxUtils.bind(this, function(evt)
		{
			this.selectMode(btn, funct);
			this.noReset = false;
		}));
		mxEvent.addListener(btn, 'dblclick',
			mxUtils.bind(this, function(evt)
			{
				this.selectMode(btn, funct);
				this.noReset = true;
			})
		);
		
		if (this.defaultMode == null)
		{
			this.defaultMode = btn;
			this.selectedMode = btn;
			
			var tmp = img.altIcon;
			
			if (tmp != null)
			{
				img.altIcon = img.getAttribute('src');
				img.setAttribute('src', tmp);
			}
			else
			{
				btn.className = btn.initialClassName+'Selected';
			}
		}
	}

	this.container.appendChild(btn);					

	return btn;
};

/**
 * Function: init
 * 
 * Overrides function to hide the properties panel on any 
 * click inside the toolbar.
 */
mxDefaultToolbar.prototype.init = function(container)
{
	if (container != null)
	{
		this.toolbar = new mxToolbar(container);
		
		mxEvent.addListener(container, 'click',
			mxUtils.bind(this, function()
			{
				if (this.editor.dontHideProperties) {
					this.editor.dontHideProperties = false;
				} else {
					this.editor.hideProperties();
				}
			})
		);
		
		// Installs the insert function in the editor if an item is
		// selected in the toolbar
		this.toolbar.addListener(mxEvent.SELECT,
			mxUtils.bind(this, function(sender, evt)
			{
				var funct = evt.getProperty('function');
				
				if (funct != null)
				{
					this.editor.insertFunction = mxUtils.bind(this, function()
					{
						funct.apply(this, arguments);
						this.toolbar.resetMode();
					});
				}
				else
				{
					this.editor.insertFunction = null;
				}
			})
		);
		
		// Resets the selected tool after a doubleclick or escape keystroke
		this.resetHandler = mxUtils.bind(this, function()
		{
			if (this.toolbar != null)
			{
				this.toolbar.resetMode(true);
			}
		});

		this.editor.graph.addListener(mxEvent.DOUBLE_CLICK, this.resetHandler);
		this.editor.addListener(mxEvent.ESCAPE, this.resetHandler);
	}
};


/**
 * Function: addPrototype
 * 
 * Overrides function to define an ID for every toolbar button.
 */
mxDefaultToolbar.prototype.addPrototype = function(as, icon, ptype, pressed, insert)
{
	// Creates a wrapper function that is in charge of constructing
	// the new cell instance to be inserted into the graph
	var factory = function()
	{
		if (typeof(ptype) == 'function')
		{
			return ptype();
		}
		else if (ptype != null)
		{
			return ptype.clone();
		}
		
		return null;
	};
	
	// Defines the function for a click event on the graph
	// after this item has been selected in the toolbar
	var clickHandler = mxUtils.bind(this, function(evt, cell)
	{
		this.editor.hideProperties();
		
		if (typeof(insert) == 'function')
		{
			insert(this.editor, factory(), evt, cell);
		}
		else
		{
			this.drop(factory(), evt, cell);
		}
		
		this.toolbar.resetMode();
		mxEvent.consume(evt);
	});
	
	var title = mxResources.get(as) || as;
	var btn = this.toolbar.addMode(title, icon, clickHandler, pressed);
	btn.setAttribute('id', 'btn_' + as);
				
	// Creates a wrapper function that calls the click handler without
	// the graph argument
	var dropHandler = function(graph, evt, cell)
	{
		clickHandler(evt, cell);
	};
	
	this.installDropHandler(btn.img, dropHandler);
	
	return btn;
};

/**
 * Function: addMode
 * 
 * Overrides function to define an ID for every toolbar button.
 */
mxDefaultToolbar.prototype.addMode = function(as, icon, mode, pressed, funct, showTextAndIcon)
{
	var clickHandler = mxUtils.bind(this, function()
	{
		this.editor.setMode(mode);
		
		if (funct != null)
		{
			this.editor.hideProperties();
			funct(this.editor);
		}
	});
	
	var title = mxResources.get(as) || as;
	var img = this.toolbar.addSwitchMode(title, icon, clickHandler, pressed, showTextAndIcon);
	img.setAttribute('id', 'btn_' + as);
	return img;
};

/**
 * Function: addItem
 * 
 * Overrides function to define an ID for every toolbar button.
 */
mxDefaultToolbar.prototype.addItem = function(as, icon, funct, pressedIcon, style, factoryMethod, showTextAndIcon)
{
	var clickHandler = mxUtils.bind(this, function()
	{
		if (funct != null && funct.length > 0)
		{
			this.editor.hideProperties();
			this.editor.execute(funct);
		}
	});
	
	var title = mxResources.get(as) || as;
	var item = this.toolbar.addItem(title, icon, clickHandler, pressedIcon, style, factoryMethod, showTextAndIcon);
	item.setAttribute('id', 'btn_' + as);
	return item;
};

/**
 * Function: updateZoomInput
 * 
 * Invoked when the graph zoom changes to keep the zoom textbox updated.
 */
mxDefaultToolbar.prototype.updateZoomInput = function() 
{
	var current = this.editor.graph.getView().scale * 100;
	var input = document.getElementById('txtZoom');
	if (input != undefined) {
		input.value = Math.round(current) + "%";
	}
};

/**
 * Function: addZoomCustom
 * 
 * Called from mxDefaultStatusbarCodec when an Add item with action 
 * 'zoomCustom' is found, inserts a numeric spinner on the toolbar to 
 * control the graph zoom value.
 */
mxDefaultToolbar.prototype.addZoomCustom = function()
{
	var input = document.createElement('input');
	input.id = 'txtZoom';
	input.className = 'mxToolbarInput';		
	this.toolbar.container.appendChild(input);
	var graph = this.editor.graph;
	$(input).spinner({
		start: 100,
		stepping: 10,
		currency: '%',
		onChange:  function() {
			var input = document.getElementById('txtZoom');
			var scale = parseFloat(input.value.replace(/[^0-9]/g, '')) / 100;
			graph.getView().setScale(scale);
		}
	});
	this.updateZoomInput();

	return input;
};

/**
 * Function: addSeparator
 * 
 * Overrides function to return created element.
 */
mxDefaultToolbar.prototype.addSeparator = function(icon)
{
	icon = icon || mxClient.imageBasePath + '/separator.gif';
	return this.toolbar.addSeparator(icon);
};

mxDefaultToolbar.prototype.addInfo = function()
{
	var div = document.createElement('div');
	div.className = 'mxToolbarItem';		
	this.toolbar.container.appendChild(div);

	return div;
};

/**
 * Extends mxDefaultToolbar to define a status bar with buttons loaded 
 * from the XML config file. 
 */
function mxDefaultStatusbar(container, editor)
{
	mxDefaultToolbar.call(this, container, editor);
};

mxDefaultStatusbar.prototype = new mxDefaultToolbar();

mxDefaultStatusbar.prototype.constructor = mxDefaultStatusbar;

mxDefaultStatusbar.prototype.addZoomCustom = function()
{
	mxDefaultToolbar.prototype.addZoomCustom.call(this);
};


