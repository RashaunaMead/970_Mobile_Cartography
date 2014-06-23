// adds the find me control
L.Control.Button = L.Control.extend({
  options: {
    position: 'topleft'
  },
  initialize: function (options) {
    this._button = {};
    this.setButton(options);
  },
 
  onAdd: function (map) {
    this._map = map;
    var container = L.DomUtil.create('div', 'leaflet-control-button');
    
    this._container = container;
    
    this._update();
    return this._container;
  },
 
  onRemove: function (map) {
  },
 
  setButton: function (options) {
    var button = {
      'iconUrl': options.iconUrl,           //string
      'onClick': options.onClick,           //callback function
      'maxWidth': options.maxWidth || 70,     //number
      'doToggle': options.toggle,           //bool
      'toggleStatus': false                 //bool
    };
 
    this._button = button;
    this._update();
  },
  

  getIconUrl: function () {
    return this._button.iconUrl;
  },
  
  destroy: function () {
    this._button = {};
    this._update();
  },
  
  toggle: function (e) {
    if(typeof e === 'boolean'){
        this._button.toggleStatus = e;
    }
    else{
        this._button.toggleStatus = !this._button.toggleStatus;
    }
    this._update();
  },
  
  _update: function () {
    if (!this._map) {
      return;
    }
 
    this._container.innerHTML = '';
    this._makeButton(this._button);
 
  },
 
  _makeButton: function (button) {
    var newButton = L.DomUtil.create('div', 'leaflet-buttons-control-button leaflet-bar a', this._container);
    if(button.toggleStatus)
        L.DomUtil.addClass(newButton,'leaflet-buttons-control-toggleon');
        
    var image = L.DomUtil.create('img', 'leaflet-buttons-control-img', newButton);
    image.setAttribute('src',button.iconUrl);
    
 
    L.DomEvent
      .addListener(newButton, 'click', L.DomEvent.stop)
      .addListener(newButton, 'click', button.onClick,this)
      .addListener(newButton, 'click', this._clicked,this);
    L.DomEvent.disableClickPropagation(newButton);
    return newButton;
 
  },
  
  _clicked: function () {  //'this' refers to button
    if(this._button.doToggle){
        if(this._button.toggleStatus) { //currently true, remove class
            L.DomUtil.removeClass(this._container.childNodes[0],'leaflet-buttons-control-toggleon');
        }
        else{
            L.DomUtil.addClass(this._container.childNodes[0],'leaflet-buttons-control-toggleon');
        }
        this.toggle();
    }
    return;
  }
});