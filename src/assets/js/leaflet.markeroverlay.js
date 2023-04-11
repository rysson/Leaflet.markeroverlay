/*!
 * leaflet-markeroverlay
 * Custom Marker Overlay for Leaflet JS.
 * Leaflet MarkerOverlay, inspirited by MarkerOverlay.
 * https://github.com/rysson/Leaflet.markeroverlay/
 * @author rysson
 * @version 0.1
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
		typeof define === 'function' && define.amd ? define(['exports'], factory) :
		(factory((global.leaflet = global.leaflet || {}, global.leaflet['extra-markers'] = {})));
}(this, (function (exports) { 'use strict';

	var MarkerOverlay = L.MarkerOverlay = {};
	MarkerOverlay.version = '0.1';
	MarkerOverlay.Icon = L.Icon.extend({
		options: {
			icon: undefined,
			iconOpacity: undefined,
			overlay: undefined,
			badge: undefined,      // badgeOptions or list of badgeOptions
			extraClasses: '',       // space separated list of user classes
		},
		badgeOptions: {
			value: '',
			style: '',              // material, holo, classic, nova
			position: 'top right',  // top middle bottom  left center right  (default top right)
			opacity: undefined,
			translate: undefined,
			extraClasses: '',       // space separated list of user classes
		},
		initialize: function(options) {
			options = L.Util.setOptions(this, options);
			// TODO: merge options for badges
		},
		createIcon: function() {
			let div = document.createElement('div');
			if(this.options.icon) {
				let options = this.options, badgeOptions = this.badgeOptions;
				div.classList.add('markeroverlay')
				let icon_div = this.options.icon;
				if(icon_div instanceof L.Icon) {
					icon_div = icon_div.createIcon();
					div.appendChild(icon_div);
				} else if(typeof icon_div === 'function') {
					icon_div = icon_div();
					div.appendChild(icon_div);
				} else if(icon_div instanceof L.Marker) {
					icon_div = icon_div.getIcon().createIcon();
					div.appendChild(icon_div);
				}
				let ov_div = this._create_custom_div(options.overlay, 'overlay', options)
				if(options.badge) {
					if(options.badge instanceof Array) {
						for(let badge of options.badge)
							ov_div.appendChild(this._create_custom_div(badge.value, 'badge', badge, badgeOptions));
					} else if(options.badge.constructor && options.badge.constructor.name === "Object") {
						ov_div.appendChild(this._create_custom_div(options.badge.value, 'badge', options.badge, badgeOptions));
					} else {
						ov_div.appendChild(this._create_custom_div(options.badge, 'badge', {}, badgeOptions));
					}
				}
				if(options.iconOpacity == undefined) {
					icon_div.appendChild(ov_div);
				} else {
					div.classList.add('markeroverlay-icon-box')
					ov_div.style.width = icon_div.style.width;
					ov_div.style.height = icon_div.style.height;
					// ov_div.style.marginLeft = icon_div.style.marginLeft;
					// ov_div.style.marginTop = icon_div.style.marginTop;
					icon_div.style.opacity = options.iconOpacity;
					div.appendChild(ov_div);
				}
				div.style.width = icon_div.style.width;
				div.style.height = icon_div.style.height;
				div.style.marginLeft = icon_div.style.marginLeft;
				div.style.marginTop = icon_div.style.marginTop;
				icon_div.style.marginLeft = 0;
				icon_div.style.marginTop = 0;
				// console.log(div.getBoundingClientRect());  // DEBUG
			}
			return div;
		},

		createShadow: function() {
			if(this.options.icon)
				return this.options.icon.createShadow();
		},

		_create_custom_div: function(content, cls, options, defaults) {
			if(defaults)
				options = Object.assign({}, defaults, options);  // TODO: move option merge to initialize()
			let div = document.createElement('div');
			if(cls) {
				div.classList.add('markeroverlay-' + cls)
				if(options.style) {
					for(let st of options.style.split(/\s+/))
						div.classList.add('markeroverlay-' + cls + '-style-' + st)
				}
				if(options.position) {
					for(let st of options.position.split(/\s+/))
						div.classList.add('markeroverlay-' + cls + '-style-' + st)
				}
			}
			if(options.extraClasses) {
				for(let st of options.extraClasses.split(/\s+/))
					div.classList.add(st)
			}
			if(typeof content === 'function')
				content = content();
			if(typeof content === "string" || content instanceof String)
				div.innerHTML = content;
			else if(is_dom_element(content))
				div.appendChild(content);
			else if(content !== undefined && content !== null)
				div.innerHTML = `${content}`;
			if(options.opacity != undefined)
				div.style.opacity = options.opacity;
			if(options.translate != undefined)
				div.style.translate = options.translate;
			return div;
		}

	});
	MarkerOverlay.icon = L.MarkerOverlay.icon = function(options) {
		return new L.MarkerOverlay.Icon(options);
	};

	exports.MarkerOverlay = MarkerOverlay;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
