(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createButton;

var _SubdivisionModifier = require('../thirdparty/SubdivisionModifier');

var SubdivisionModifier = _interopRequireWildcard(_SubdivisionModifier);

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createButton() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  var BUTTON_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var BUTTON_HEIGHT = height - Layout.PANEL_MARGIN;
  var BUTTON_DEPTH = Layout.BUTTON_DEPTH;

  var group = new THREE.Group();

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  //  base checkbox
  var divisions = 4;
  var aspectRatio = BUTTON_WIDTH / BUTTON_HEIGHT;
  var rect = new THREE.BoxGeometry(BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_DEPTH, Math.floor(divisions * aspectRatio), divisions, divisions);
  var modifier = new THREE.SubdivisionModifier(1);
  modifier.modify(rect);
  rect.translate(BUTTON_WIDTH * 0.5, 0, 0);

  //  hitscan volume
  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  hitscanVolume.position.x = width * 0.5;

  var material = new THREE.MeshBasicMaterial({ color: Colors.BUTTON_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  hitscanVolume.add(filledVolume);

  var buttonLabel = textCreator.create(propertyName, { scale: 0.866 });

  //  This is a real hack since we need to fit the text position to the font scaling
  //  Please fix me.
  buttonLabel.position.x = BUTTON_WIDTH * 0.5 - buttonLabel.layout.width * 0.000011 * 0.5;
  buttonLabel.position.z = BUTTON_DEPTH * 1.2;
  buttonLabel.position.y = -0.025;
  filledVolume.add(buttonLabel);

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_BUTTON);
  controllerID.position.z = depth;

  panel.add(descriptorLabel, hitscanVolume, controllerID);

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handleOnPress);
  interaction.events.on('onReleased', handleOnRelease);

  updateView();

  function handleOnPress(p) {
    if (group.visible === false) {
      return;
    }

    object[propertyName]();

    hitscanVolume.position.z = BUTTON_DEPTH * 0.1;

    p.locked = true;
  }

  function handleOnRelease() {
    hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  }

  function updateView() {

    if (interaction.hovering()) {
      material.color.setHex(Colors.BUTTON_HIGHLIGHT_COLOR);
    } else {
      material.color.setHex(Colors.BUTTON_COLOR);
    }
  }

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.updateControl = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.updateLabel(str);
    return group;
  };

  return group;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"../thirdparty/SubdivisionModifier":18,"./colors":3,"./grab":7,"./interaction":11,"./layout":12,"./sharedmaterials":15,"./textlabel":17}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCheckbox;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _graphic = require('./graphic');

var Graphic = _interopRequireWildcard(_graphic);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createCheckbox() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$initialValue = _ref.initialValue,
      initialValue = _ref$initialValue === undefined ? false : _ref$initialValue,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  var CHECKBOX_WIDTH = Layout.CHECKBOX_SIZE;
  var CHECKBOX_HEIGHT = CHECKBOX_WIDTH;
  var CHECKBOX_DEPTH = depth;

  var INACTIVE_SCALE = 0.001;
  var ACTIVE_SCALE = 0.9;

  var state = {
    value: initialValue,
    listen: false
  };

  var group = new THREE.Group();

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  //  base checkbox
  var rect = new THREE.BoxGeometry(CHECKBOX_WIDTH, CHECKBOX_HEIGHT, CHECKBOX_DEPTH);
  rect.translate(CHECKBOX_WIDTH * 0.5, 0, 0);

  //  hitscan volume
  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = depth;
  hitscanVolume.position.x = width * 0.5;

  //  outline volume
  // const outline = new THREE.BoxHelper( hitscanVolume );
  // outline.material.color.setHex( Colors.OUTLINE_COLOR );

  //  checkbox volume
  var material = new THREE.MeshBasicMaterial({ color: Colors.CHECKBOX_BG_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  // filledVolume.scale.set( ACTIVE_SCALE, ACTIVE_SCALE,ACTIVE_SCALE );
  hitscanVolume.add(filledVolume);

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_CHECKBOX);
  controllerID.position.z = depth;

  var borderBox = Layout.createPanel(CHECKBOX_WIDTH + Layout.BORDER_THICKNESS, CHECKBOX_HEIGHT + Layout.BORDER_THICKNESS, CHECKBOX_DEPTH, true);
  borderBox.material.color.setHex(0x1f7ae7);
  borderBox.position.x = -Layout.BORDER_THICKNESS * 0.5 + width * 0.5;
  borderBox.position.z = depth * 0.5;

  var checkmark = Graphic.checkmark();
  checkmark.position.z = depth * 0.51;
  hitscanVolume.add(checkmark);

  panel.add(descriptorLabel, hitscanVolume, controllerID, borderBox);

  // group.add( filledVolume, outline, hitscanVolume, descriptorLabel );

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handleOnPress);

  updateView();

  function handleOnPress(p) {
    if (group.visible === false) {
      return;
    }

    state.value = !state.value;

    object[propertyName] = state.value;

    if (onChangedCB) {
      onChangedCB(state.value);
    }

    p.locked = true;
  }

  function updateView() {

    if (state.value) {
      checkmark.visible = true;
    } else {
      checkmark.visible = false;
    }
    if (interaction.hovering()) {
      borderBox.visible = true;
    } else {
      borderBox.visible = false;
    }
  }

  var onChangedCB = void 0;
  var onFinishChangeCB = void 0;

  group.onChange = function (callback) {
    onChangedCB = callback;
    return group;
  };

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.listen = function () {
    state.listen = true;
    return group;
  };

  group.name = function (str) {
    descriptorLabel.updateLabel(str);
    return group;
  };

  group.updateControl = function (inputObjects) {
    if (state.listen) {
      state.value = object[propertyName];
    }
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    updateView();
  };

  return group;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"./colors":3,"./grab":7,"./graphic":8,"./interaction":11,"./layout":12,"./sharedmaterials":15,"./textlabel":17}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorizeGeometry = colorizeGeometry;
/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var DEFAULT_COLOR = exports.DEFAULT_COLOR = 0x2FA1D6;
var HIGHLIGHT_COLOR = exports.HIGHLIGHT_COLOR = 0x43b5ea;
var INTERACTION_COLOR = exports.INTERACTION_COLOR = 0x07ABF7;
var EMISSIVE_COLOR = exports.EMISSIVE_COLOR = 0x222222;
var HIGHLIGHT_EMISSIVE_COLOR = exports.HIGHLIGHT_EMISSIVE_COLOR = 0x999999;
var OUTLINE_COLOR = exports.OUTLINE_COLOR = 0x999999;
var DEFAULT_BACK = exports.DEFAULT_BACK = 0x1a1a1a;
var DEFAULT_FOLDER_BACK = exports.DEFAULT_FOLDER_BACK = 0x101010;
var HIGHLIGHT_BACK = exports.HIGHLIGHT_BACK = 0x313131;
var INACTIVE_COLOR = exports.INACTIVE_COLOR = 0x161829;
var CONTROLLER_ID_SLIDER = exports.CONTROLLER_ID_SLIDER = 0x2fa1d6;
var CONTROLLER_ID_CHECKBOX = exports.CONTROLLER_ID_CHECKBOX = 0x806787;
var CONTROLLER_ID_BUTTON = exports.CONTROLLER_ID_BUTTON = 0xe61d5f;
var CONTROLLER_ID_TEXT = exports.CONTROLLER_ID_TEXT = 0x1ed36f;
var CONTROLLER_ID_DROPDOWN = exports.CONTROLLER_ID_DROPDOWN = 0xfff000;
var DROPDOWN_BG_COLOR = exports.DROPDOWN_BG_COLOR = 0xffffff;
var DROPDOWN_FG_COLOR = exports.DROPDOWN_FG_COLOR = 0x000000;
var CHECKBOX_BG_COLOR = exports.CHECKBOX_BG_COLOR = 0xffffff;
var BUTTON_COLOR = exports.BUTTON_COLOR = 0xe61d5f;
var BUTTON_HIGHLIGHT_COLOR = exports.BUTTON_HIGHLIGHT_COLOR = 0xfa3173;
var SLIDER_BG = exports.SLIDER_BG = 0x444444;

function colorizeGeometry(geometry, color) {
  geometry.faces.forEach(function (face) {
    face.color.setHex(color);
  });
  geometry.colorsNeedUpdate = true;
  return geometry;
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCheckbox;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _graphic = require('./graphic');

var Graphic = _interopRequireWildcard(_graphic);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                    * dat-guiVR Javascript Controller Library for VR
                                                                                                                                                                                                    * https://github.com/dataarts/dat.guiVR
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Copyright 2016 Data Arts Team, Google Inc.
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                    * you may not use this file except in compliance with the License.
                                                                                                                                                                                                    * You may obtain a copy of the License at
                                                                                                                                                                                                    *
                                                                                                                                                                                                    *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                    * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                    * See the License for the specific language governing permissions and
                                                                                                                                                                                                    * limitations under the License.
                                                                                                                                                                                                    */

function createCheckbox() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$initialValue = _ref.initialValue,
      initialValue = _ref$initialValue === undefined ? false : _ref$initialValue,
      _ref$options = _ref.options,
      options = _ref$options === undefined ? [] : _ref$options,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  var state = {
    open: false,
    listen: false
  };

  var DROPDOWN_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var DROPDOWN_HEIGHT = height - Layout.PANEL_MARGIN;
  var DROPDOWN_DEPTH = depth;
  var DROPDOWN_OPTION_HEIGHT = height - Layout.PANEL_MARGIN * 1.2;
  var DROPDOWN_MARGIN = Layout.PANEL_MARGIN * -0.4;

  var group = new THREE.Group();

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  group.hitscan = [panel];

  var labelInteractions = [];
  var optionLabels = [];

  //  find actually which label is selected
  var initialLabel = findLabelFromProp();

  function findLabelFromProp() {
    if (Array.isArray(options)) {
      return options.find(function (optionName) {
        return optionName === object[propertyName];
      });
    } else {
      return Object.keys(options).find(function (optionName) {
        return object[propertyName] === options[optionName];
      });
    }
  }

  function createOption(labelText, isOption) {
    var label = (0, _textlabel2.default)(textCreator, labelText, DROPDOWN_WIDTH, depth, Colors.DROPDOWN_FG_COLOR, Colors.DROPDOWN_BG_COLOR, 0.866);

    group.hitscan.push(label.back);
    var labelInteraction = (0, _interaction2.default)(label.back);
    labelInteractions.push(labelInteraction);
    optionLabels.push(label);

    if (isOption) {
      labelInteraction.events.on('onPressed', function (p) {
        selectedLabel.setString(labelText);

        var propertyChanged = false;

        if (Array.isArray(options)) {
          propertyChanged = object[propertyName] !== labelText;
          if (propertyChanged) {
            object[propertyName] = labelText;
          }
        } else {
          propertyChanged = object[propertyName] !== options[labelText];
          if (propertyChanged) {
            object[propertyName] = options[labelText];
          }
        }

        collapseOptions();
        state.open = false;

        if (onChangedCB && propertyChanged) {
          onChangedCB(object[propertyName]);
        }

        p.locked = true;
      });
    } else {
      labelInteraction.events.on('onPressed', function (p) {
        if (state.open === false) {
          openOptions();
          state.open = true;
        } else {
          collapseOptions();
          state.open = false;
        }

        p.locked = true;
      });
    }
    label.isOption = isOption;
    return label;
  }

  function collapseOptions() {
    optionLabels.forEach(function (label) {
      if (label.isOption) {
        label.visible = false;
        label.back.visible = false;
      }
    });
  }

  function openOptions() {
    optionLabels.forEach(function (label) {
      if (label.isOption) {
        label.visible = true;
        label.back.visible = true;
      }
    });
  }

  //  base option
  var selectedLabel = createOption(initialLabel, false);
  selectedLabel.position.x = Layout.PANEL_MARGIN * 0.5 + width * 0.5;
  selectedLabel.position.z = depth;

  var downArrow = Graphic.downArrow();
  // Colors.colorizeGeometry( downArrow.geometry, Colors.DROPDOWN_FG_COLOR );
  downArrow.position.set(DROPDOWN_WIDTH - 0.04, 0, depth * 1.01);
  selectedLabel.add(downArrow);

  function configureLabelPosition(label, index) {
    label.position.y = -DROPDOWN_MARGIN - (index + 1) * DROPDOWN_OPTION_HEIGHT;
    label.position.z = depth;
  }

  function optionToLabel(optionName, index) {
    var optionLabel = createOption(optionName, true);
    configureLabelPosition(optionLabel, index);
    return optionLabel;
  }

  if (Array.isArray(options)) {
    selectedLabel.add.apply(selectedLabel, _toConsumableArray(options.map(optionToLabel)));
  } else {
    selectedLabel.add.apply(selectedLabel, _toConsumableArray(Object.keys(options).map(optionToLabel)));
  }

  collapseOptions();

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_DROPDOWN);
  controllerID.position.z = depth;

  var borderBox = Layout.createPanel(DROPDOWN_WIDTH + Layout.BORDER_THICKNESS, DROPDOWN_HEIGHT + Layout.BORDER_THICKNESS * 0.5, DROPDOWN_DEPTH, true);
  borderBox.material.color.setHex(0x1f7ae7);
  borderBox.position.x = -Layout.BORDER_THICKNESS * 0.5 + width * 0.5;
  borderBox.position.z = depth * 0.5;

  panel.add(descriptorLabel, controllerID, selectedLabel, borderBox);

  updateView();

  function updateView() {

    labelInteractions.forEach(function (interaction, index) {
      var label = optionLabels[index];
      if (label.isOption) {
        if (interaction.hovering()) {
          Colors.colorizeGeometry(label.back.geometry, Colors.HIGHLIGHT_COLOR);
        } else {
          Colors.colorizeGeometry(label.back.geometry, Colors.DROPDOWN_BG_COLOR);
        }
      }
    });

    if (labelInteractions[0].hovering() || state.open) {
      borderBox.visible = true;
    } else {
      borderBox.visible = false;
    }
  }

  var onChangedCB = void 0;
  var onFinishChangeCB = void 0;

  group.onChange = function (callback) {
    onChangedCB = callback;
    return group;
  };

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.listen = function () {
    state.listen = true;
    return group;
  };

  group.updateControl = function (inputObjects) {
    if (state.listen) {
      selectedLabel.setString(findLabelFromProp());
    }
    labelInteractions.forEach(function (labelInteraction) {
      labelInteraction.update(inputObjects);
    });
    grabInteraction.update(inputObjects);
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
  };

  return group;
}

},{"./colors":3,"./grab":7,"./graphic":8,"./interaction":11,"./layout":12,"./sharedmaterials":15,"./textlabel":17}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createFolder;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _graphic = require('./graphic');

var Graphic = _interopRequireWildcard(_graphic);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

var _palette = require('./palette');

var Palette = _interopRequireWildcard(_palette);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                    * dat-guiVR Javascript Controller Library for VR
                                                                                                                                                                                                    * https://github.com/dataarts/dat.guiVR
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Copyright 2016 Data Arts Team, Google Inc.
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                    * you may not use this file except in compliance with the License.
                                                                                                                                                                                                    * You may obtain a copy of the License at
                                                                                                                                                                                                    *
                                                                                                                                                                                                    *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                    * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                    * See the License for the specific language governing permissions and
                                                                                                                                                                                                    * limitations under the License.
                                                                                                                                                                                                    */

function createFolder() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      name = _ref.name,
      guiAdd = _ref.guiAdd,
      guiRemove = _ref.guiRemove,
      addSlider = _ref.addSlider,
      addDropdown = _ref.addDropdown,
      addCheckbox = _ref.addCheckbox,
      addButton = _ref.addButton,
      addImageButton = _ref.addImageButton;

  var width = Layout.FOLDER_WIDTH;
  var depth = Layout.PANEL_DEPTH;

  var state = {
    collapsed: false,
    previousParent: undefined
  };

  var group = new THREE.Group();
  var collapseGroup = new THREE.Group();
  group.add(collapseGroup);

  var isAccordion = false;
  /** When true, will keep only one child folder of this folder open at a time.
   * Siblings automatically close.
   */
  Object.defineProperty(group, 'accordion', {
    get: function get() {
      return isAccordion;
    },
    set: function set(newValue) {
      if (newValue && !isAccordion) group.guiChildren.filter(function (c) {
        return c.isFolder;
      }).map(function (c) {
        return c.close();
      });
      isAccordion = newValue;
      performLayout();
    }
  });

  //expose as public interface so that children can call it when their spacing changes
  group.performLayout = performLayout;
  group.isCollapsed = function () {
    return state.collapsed;
  };

  //useful to have access to this as well. Using in remove implementation
  Object.defineProperty(group, 'guiChildren', {
    get: function get() {
      return collapseGroup.children;
    }
  });
  // returns true if all of the supplied args are members of this folder
  group.hasChild = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return !args.includes(function (obj) {
      return group.guiChildren.indexOf(obj) === -1;
    });
  };

  group.folderName = name; //for debugging

  //  Yeah. Gross.
  var addOriginal = THREE.Group.prototype.add;
  //as long as no-one expects this to behave like a regular THREE.Group, the changed definition of remove shouldn't hurt
  //const removeOriginal = THREE.Group.prototype.remove; 

  function addImpl(o) {
    addOriginal.call(group, o);
  }

  addImpl(collapseGroup);

  var panel = Layout.createPanel(width, Layout.FOLDER_HEIGHT, depth, true);
  addImpl(panel);

  var descriptorLabel = textCreator.create(name);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN * 1.5;
  descriptorLabel.position.y = -0.03;
  descriptorLabel.position.z = depth;
  panel.add(descriptorLabel);

  var downArrow = Layout.createDownArrow();
  Colors.colorizeGeometry(downArrow.geometry, 0xffffff);
  downArrow.position.set(0.05, 0, depth * 1.01);
  panel.add(downArrow);

  var grabber = Layout.createPanel(width, Layout.FOLDER_GRAB_HEIGHT, depth, true);
  grabber.position.y = Layout.FOLDER_HEIGHT * 0.86; //XXX: magic number
  grabber.name = 'grabber';
  addImpl(grabber);

  var grabBar = Graphic.grabBar();
  grabBar.position.set(width * 0.5, 0, depth * 1.001);
  grabber.add(grabBar);
  group.isFolder = true;
  group.hideGrabber = function () {
    grabber.visible = false;
  };

  group.add = function () {
    var newController = guiAdd.apply(undefined, arguments);

    if (newController) {
      group.addController(newController);
      return newController;
    } else {
      return new THREE.Group();
    }
  };

  /* 
  Removes the given controllers from the GUI.
    If the arguments are invalid, it will attempt to detect this before making any changes, 
  aborting the process and returning false from this method.
    Note: as with add, this overwrites an existing property of THREE.Group.
  As long as no-one expects folders to behave like regular THREE.Groups, that shouldn't matter.
  */
  group.remove = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var ok = guiRemove.apply(undefined, args); // any invalid arguments should cause this to return false
    if (!ok) return false;
    args.forEach(function (obj) {
      console.assert(group.hasChild(obj), "internal problem with housekeeping logic of dat.GUIVR folder not caught by sanity check");
      if (obj.isFolder) {
        obj.remove.apply(obj, _toConsumableArray(obj.guiChildren));
      }
      collapseGroup.remove(obj);
    });
    //TODO: defer actual layout performance; set a flag and make sure it gets done before any rendering or hit-testing happens.
    performLayout();
    return true;
  };

  group.addController = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    args.forEach(function (obj) {
      collapseGroup.add(obj);
      obj.folder = group;
      if (obj.isFolder) {
        obj.hideGrabber();
        obj.close();
      }
    });

    performLayout();
  };

  group.addFolder = function () {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    args.forEach(function (obj) {
      collapseGroup.add(obj);
      obj.folder = group;
      obj.hideGrabber();
      obj.close();
    });

    performLayout();
  };

  function performLayout() {
    var spacingPerController = Layout.PANEL_HEIGHT + Layout.PANEL_SPACING;
    var emptyFolderSpace = Layout.FOLDER_HEIGHT + Layout.PANEL_SPACING;
    var totalSpacing = emptyFolderSpace;

    collapseGroup.children.forEach(function (c) {
      c.visible = !state.collapsed;
    });

    if (state.collapsed) {
      downArrow.rotation.z = Math.PI * 0.5;
    } else {
      downArrow.rotation.z = 0;

      var y = 0,
          lastHeight = emptyFolderSpace;

      collapseGroup.children.forEach(function (child) {
        var h = child.spacing ? child.spacing : spacingPerController;
        // how far to get from the middle of previous to middle of this child?
        // half of the height of previous plus half height of this.
        var spacing = 0.5 * (lastHeight + h);

        if (child.isFolder) {
          // For folders, the origin isn't in the middle of the entire height of the folder,
          // but just the middle of the top panel.
          var offset = 0.5 * (lastHeight + emptyFolderSpace);
          child.position.y = y - offset;
        } else {
          child.position.y = y - spacing;
        }
        // in any case, for use by the next object along we remember 'y' as the middle of the whole panel
        y -= spacing;
        lastHeight = h;
        totalSpacing += h;
        child.position.x = 0.026;
      });
    }

    group.spacing = totalSpacing;

    //make sure parent folder also performs layout.
    if (group.folder !== group) group.folder.performLayout();

    // if we're a subfolder, use a smaller panel
    var panelWidth = Layout.FOLDER_WIDTH;
    if (group.folder !== group) {
      panelWidth = Layout.SUBFOLDER_WIDTH;
    }

    Layout.resizePanel(panel, panelWidth, Layout.FOLDER_HEIGHT, depth);
  }

  function updateView() {
    if (interaction.hovering()) {
      panel.material.color.setHex(Colors.HIGHLIGHT_BACK);
    } else {
      panel.material.color.setHex(Colors.DEFAULT_FOLDER_BACK);
    }

    if (grabInteraction.hovering()) {
      grabber.material.color.setHex(Colors.HIGHLIGHT_BACK);
    } else {
      grabber.material.color.setHex(Colors.DEFAULT_FOLDER_BACK);
    }
  }

  var interaction = (0, _interaction2.default)(panel);
  interaction.events.on('onPressed', function (p) {
    if (state.collapsed) group.open();else group.close();
    p.locked = true;
  });

  group.open = function () {
    if (!state.collapsed) return;
    if (group.folder !== group && group.folder.accordion) {
      group.folder.guiChildren.filter(function (c) {
        return c.isFolder && c !== group;
      }).forEach(function (c) {
        return c.close();
      });
    }
    state.collapsed = false;
    performLayout();
  };

  group.close = function () {
    if (state.collapsed) return;
    state.collapsed = true;
    performLayout();
  };

  group.folder = group;

  var grabInteraction = Grab.create({ group: group, panel: grabber });
  var paletteInteraction = Palette.create({ group: group, panel: panel });

  group.updateControl = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    paletteInteraction.update(inputObjects);

    updateView();
  };

  group.name = function (str) {
    descriptorLabel.updateLabel(str);
    return group;
  };

  group.hitscan = [panel, grabber];

  group.beingMoved = false;

  group.addSlider = function () {
    var controller = addSlider.apply(undefined, arguments);
    if (controller) {
      group.addController(controller);
      return controller;
    } else {
      return new THREE.Group();
    }
  };
  group.addDropdown = function () {
    var controller = addDropdown.apply(undefined, arguments);
    if (controller) {
      group.addController(controller);
      return controller;
    } else {
      return new THREE.Group();
    }
  };
  group.addCheckbox = function () {
    var controller = addCheckbox.apply(undefined, arguments);
    if (controller) {
      group.addController(controller);
      return controller;
    } else {
      return new THREE.Group();
    }
  };
  group.addButton = function () {
    var controller = addButton.apply(undefined, arguments);
    if (controller) {
      group.addController(controller);
      return controller;
    } else {
      return new THREE.Group();
    }
  };
  group.addImageButton = function () {
    var controller = addImageButton.apply(undefined, arguments);
    if (controller) {
      group.addController(controller);
      return controller;
    } else {
      return new THREE.Group();
    }
  };

  return group;
}

},{"./colors":3,"./grab":7,"./graphic":8,"./interaction":11,"./layout":12,"./palette":13,"./sharedmaterials":15,"./textlabel":17}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.image = image;
exports.fnt = fnt;
/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function image() {
  var image = new Image();
  image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAEACAMAAADyTj5VAAAAjVBMVEVHcEz///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+umAc7AAAAL3RSTlMAWnJfbnqDWGR4a2ZcYnBRalRLgH6ETnR8UGh2RoZDXlaHSYo8QHU2LyYcFAwFmmUR1OIAAJFhSURBVHhetL2JWmu7jjUKIQkkQLqZvgMCZO2zT/33/R/vSkNDkj2TrOarVd5V6xDP3pJlWdKQ7qaPb6+vrw8vj+PZ/vvrxz///Pj63s/G7/cP2n0/XZ6Op6X8fJHfaG/3j9q5X/LKt/t3v/QfufQk/Xoubolz/Dq5LH7y1nLVl9xeH4b28jidncZy/ZM0P+Wff/7zn//8++9//sG5Uztav3H1inJIXkle8Qvn3+OROP2oj5OPmz7ev+m5PDDFyXan/UwewBd8124ZDn2o3eTBBmCKAzZQfjY75WX//Y+/Kj6Ln77//uF3r24vHyfP5ae9cRRsaH5I/48veQqP5Kh9X9z86wvn+wjhZfmYjTzmyBflSOBz5V1lXO8eH54mw8nzK8dTHsnPepbupwft1Vu+PslvaZPts73FaWxXbp/iUjx/I9SUc3HLqZ2DhntVP0ERfN79q918+/T2uFlO8ew8BW+qw4Rz5RZbOTp5fsJj+dTqFZ/llTAquLc+Em8jA/4dA/S89c95khEh8ZTYm8e3p+0QV9xP5f5fQjU8VLueJ3ite9CT9Lezn5ID+Kp8tB3EmOfdefsl580PY1WMDkaBNFXqH5VjeSSG5HjRdTzq+eAMjP+EL8vHyCSzFzW6LE96Prjv7uVpMup0uluMp7IpuWXb7XQ6wycZttkUb93toI269rHLKa8cbp0UnM2vTxM9t/v88IhzeN3k6SV/4tbyZse9fd4Qfd2JvO7m8eG5W57yDRbArMK5uDveGCT9Qb7IV+zaGM72xxPuPcLpSs8j59nzpBufM3x24nHavtoDhnIP6SXV8N64aDQkPTlRtnb2s99E39RfdRifrrwknbw7bo/JhXlLwelPmciT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";
  return image;
}

function fnt() {
  return "info face=\"Roboto\" size=192 bold=0 italic=0 charset=\"\" unicode=1 stretchH=100 smooth=1 aa=1 padding=24,24,24,24 spacing=12,12 outline=0\ncommon lineHeight=192 base=152 scaleW=3072 scaleH=1536 pages=1 packed=0 alphaChnl=0 redChnl=4 greenChnl=4 blueChnl=4\npage id=0 file=\"roboto_0.png\"\nchars count=194\nchar id=0    x=636   y=1438  width=48    height=49    xoffset=-24   yoffset=167   xadvance=0     page=0  chnl=15\nchar id=2    x=576   y=1438  width=48    height=49    xoffset=-24   yoffset=167   xadvance=0     page=0  chnl=15\nchar id=13   x=450   y=1439  width=51    height=49    xoffset=-25   yoffset=167   xadvance=40    page=0  chnl=15\nchar id=32   x=2987  y=1242  width=51    height=49    xoffset=-25   yoffset=167   xadvance=40    page=0  chnl=15\nchar id=33   x=1714  y=769   width=66    height=163   xoffset=-12   yoffset=14    xadvance=41    page=0  chnl=15\nchar id=34   x=1999  y=1263  width=81    height=87    xoffset=-14   yoffset=8     xadvance=51    page=0  chnl=15\nchar id=35   x=1214  y=951   width=136   height=162   xoffset=-15   yoffset=14    xadvance=99    page=0  chnl=15\nchar id=36   x=1610  y=0     width=122   height=196   xoffset=-16   yoffset=-4    xadvance=90    page=0  chnl=15\nchar id=37   x=1341  y=595   width=152   height=165   xoffset=-17   yoffset=13    xadvance=117   page=0  chnl=15\nchar id=38   x=1658  y=592   width=141   height=165   xoffset=-17   yoffset=13    xadvance=99    page=0  chnl=15\nchar id=39   x=2092  y=1263  width=62    height=85    xoffset=-17   yoffset=8     xadvance=28    page=0  chnl=15\nchar id=40   x=103   y=0     width=90    height=213   xoffset=-14   yoffset=0     xadvance=55    page=0  chnl=15\nchar id=41   x=0     y=0     width=91    height=213   xoffset=-22   yoffset=0     xadvance=56    page=0  chnl=15\nchar id=42   x=664   y=1294  width=114   height=114   xoffset=-23   yoffset=14    xadvance=69    page=0  chnl=15\nchar id=43   x=0     y=1317  width=128   height=129   xoffset=-19   yoffset=34    xadvance=91    page=0  chnl=15\nchar id=44   x=1916  y=1264  width=71    height=88    xoffset=-22   yoffset=111   xadvance=31    page=0  chnl=15\nchar id=45   x=233   y=1457  width=88    height=60    xoffset=-22   yoffset=74    xadvance=44    page=0  chnl=15\nchar id=46   x=2828  y=1245  width=68    height=65    xoffset=-14   yoffset=112   xadvance=42    page=0  chnl=15\nchar id=47   x=0     y=429   width=109   height=172   xoffset=-23   yoffset=14    xadvance=66    page=0  chnl=15\nchar id=48   x=2392  y=583   width=122   height=165   xoffset=-16   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=49   x=112   y=1143  width=93    height=162   xoffset=-11   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=50   x=1443  y=772   width=126   height=163   xoffset=-17   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=51   x=2660  y=575   width=121   height=165   xoffset=-17   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=52   x=1794  y=943   width=132   height=162   xoffset=-21   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=53   x=539   y=779   width=121   height=164   xoffset=-13   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=54   x=406   y=779   width=121   height=164   xoffset=-14   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=55   x=2082  y=941   width=127   height=162   xoffset=-19   yoffset=14    xadvance=90    page=0  chnl=15\nchar id=56   x=2526  y=581   width=122   height=165   xoffset=-16   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=57   x=1581  y=771   width=121   height=163   xoffset=-17   yoffset=13    xadvance=90    page=0  chnl=15\nchar id=58   x=2383  y=1113  width=67    height=134   xoffset=-14   yoffset=43    xadvance=39    page=0  chnl=15\nchar id=59   x=372   y=1140  width=73    height=156   xoffset=-22   yoffset=43    xadvance=34    page=0  chnl=15\nchar id=60   x=539   y=1307  width=113   height=119   xoffset=-19   yoffset=42    xadvance=81    page=0  chnl=15\nchar id=61   x=1688  y=1269  width=115   height=93    xoffset=-13   yoffset=51    xadvance=88    page=0  chnl=15\nchar id=62   x=411   y=1308  width=116   height=119   xoffset=-14   yoffset=42    xadvance=84    page=0  chnl=15\nchar id=63   x=800   y=779   width=113   height=164   xoffset=-19   yoffset=13    xadvance=76    page=0  chnl=15\nchar id=64   x=1421  y=0     width=177   height=196   xoffset=-16   yoffset=16    xadvance=144   page=0  chnl=15\nchar id=65   x=2708  y=752   width=150   height=162   xoffset=-23   yoffset=14    xadvance=104   page=0  chnl=15\nchar id=66   x=2221  y=939   width=127   height=162   xoffset=-12   yoffset=14    xadvance=100   page=0  chnl=15\nchar id=67   x=1811  y=592   width=137   height=165   xoffset=-15   yoffset=13    xadvance=104   page=0  chnl=15\nchar id=68   x=1650  y=946   width=132   height=162   xoffset=-12   yoffset=14    xadvance=105   page=0  chnl=15\nchar id=69   x=2496  y=934   width=122   height=162   xoffset=-12   yoffset=14    xadvance=91    page=0  chnl=15\nchar id=70   x=2630  y=932   width=120   height=162   xoffset=-12   yoffset=14    xadvance=88    page=0  chnl=15\nchar id=71   x=1960  y=590   width=137   height=165   xoffset=-15   yoffset=13    xadvance=109   page=0  chnl=15\nchar id=72   x=916   y=955   width=137   height=162   xoffset=-12   yoffset=14    xadvance=114   page=0  chnl=15\nchar id=73   x=296   y=1142  width=64    height=162   xoffset=-10   yoffset=14    xadvance=44    page=0  chnl=15\nchar id=74   x=272   y=790   width=122   height=164   xoffset=-21   yoffset=14    xadvance=88    page=0  chnl=15\nchar id=75   x=767   y=955   width=137   height=162   xoffset=-12   yoffset=14    xadvance=100   page=0  chnl=15\nchar id=76   x=2762  y=926   width=119   height=162   xoffset=-12   yoffset=14    xadvance=86    page=0  chnl=15\nchar id=77   x=2197  y=765   width=163   height=162   xoffset=-12   yoffset=14    xadvance=140   page=0  chnl=15\nchar id=78   x=1065  y=952   width=137   height=162   xoffset=-12   yoffset=14    xadvance=114   page=0  chnl=15\nchar id=79   x=1505  y=594   width=141   height=165   xoffset=-16   yoffset=13    xadvance=110   page=0  chnl=15\nchar id=80   x=1938  y=943   width=132   height=162   xoffset=-12   yoffset=14    xadvance=101   page=0  chnl=15\nchar id=81   x=2222  y=207   width=141   height=183   xoffset=-16   yoffset=13    xadvance=110   page=0  chnl=15\nchar id=82   x=1362  y=949   width=132   height=162   xoffset=-11   yoffset=14    xadvance=99    page=0  chnl=15\nchar id=83   x=2109  y=588   width=132   height=165   xoffset=-18   yoffset=13    xadvance=95    page=0  chnl=15\nchar id=84   x=617   y=955   width=138   height=162   xoffset=-21   yoffset=14    xadvance=95    page=0  chnl=15\nchar id=85   x=128   y=792   width=132   height=164   xoffset=-14   yoffset=14    xadvance=104   page=0  chnl=15\nchar id=86   x=2870  y=749   width=147   height=162   xoffset=-22   yoffset=14    xadvance=102   page=0  chnl=15\nchar id=87   x=2002  y=767   width=183   height=162   xoffset=-20   yoffset=14    xadvance=142   page=0  chnl=15\nchar id=88   x=312   y=966   width=141   height=162   xoffset=-20   yoffset=14    xadvance=100   page=0  chnl=15\nchar id=89   x=157   y=968   width=143   height=162   xoffset=-24   yoffset=14    xadvance=96    page=0  chnl=15\nchar id=90   x=1506  y=947   width=132   height=162   xoffset=-18   yoffset=14    xadvance=96    page=0  chnl=15\nchar id=91   x=658   y=0     width=79    height=202   xoffset=-13   yoffset=-2    xadvance=42    page=0  chnl=15\nchar id=92   x=2945  y=204   width=111   height=172   xoffset=-22   yoffset=14    xadvance=66    page=0  chnl=15\nchar id=93   x=567   y=0     width=79    height=202   xoffset=-24   yoffset=-2    xadvance=42    page=0  chnl=15\nchar id=94   x=1570  y=1271  width=106   height=105   xoffset=-20   yoffset=14    xadvance=67    page=0  chnl=15\nchar id=95   x=0     y=1458  width=121   height=60    xoffset=-24   yoffset=128   xadvance=72    page=0  chnl=15\nchar id=96   x=2622  y=1258  width=82    height=71    xoffset=-20   yoffset=8     xadvance=49    page=0  chnl=15\nchar id=97   x=1585  y=1121  width=119   height=136   xoffset=-16   yoffset=42    xadvance=87    page=0  chnl=15\nchar id=98   x=677   y=418   width=121   height=170   xoffset=-14   yoffset=8     xadvance=90    page=0  chnl=15\nchar id=99   x=1453  y=1123  width=120   height=136   xoffset=-17   yoffset=42    xadvance=84    page=0  chnl=15\nchar id=100  x=1209  y=413   width=120   height=170   xoffset=-17   yoffset=8     xadvance=90    page=0  chnl=15\nchar id=101  x=1320  y=1125  width=121   height=136   xoffset=-17   yoffset=42    xadvance=85    page=0  chnl=15\nchar id=102  x=1866  y=408   width=101   height=170   xoffset=-20   yoffset=6     xadvance=56    page=0  chnl=15\nchar id=103  x=134   y=612   width=121   height=167   xoffset=-17   yoffset=42    xadvance=90    page=0  chnl=15\nchar id=104  x=2627  y=395   width=116   height=168   xoffset=-14   yoffset=8     xadvance=88    page=0  chnl=15\nchar id=105  x=1050  y=776   width=67    height=164   xoffset=-14   yoffset=12    xadvance=39    page=0  chnl=15\nchar id=106  x=1327  y=0     width=82    height=198   xoffset=-30   yoffset=12    xadvance=38    page=0  chnl=15\nchar id=107  x=2495  y=401   width=120   height=168   xoffset=-14   yoffset=8     xadvance=81    page=0  chnl=15\nchar id=108  x=2755  y=392   width=64    height=168   xoffset=-13   yoffset=8     xadvance=39    page=0  chnl=15\nchar id=109  x=1973  y=1117  width=168   height=134   xoffset=-14   yoffset=42    xadvance=140   page=0  chnl=15\nchar id=110  x=2153  y=1115  width=116   height=134   xoffset=-14   yoffset=42    xadvance=88    page=0  chnl=15\nchar id=111  x=1181  y=1126  width=127   height=136   xoffset=-18   yoffset=42    xadvance=91    page=0  chnl=15\nchar id=112  x=267   y=611   width=121   height=167   xoffset=-14   yoffset=42    xadvance=90    page=0  chnl=15\nchar id=113  x=400   y=600   width=120   height=167   xoffset=-17   yoffset=42    xadvance=91    page=0  chnl=15\nchar id=114  x=2281  y=1113  width=90    height=134   xoffset=-14   yoffset=42    xadvance=54    page=0  chnl=15\nchar id=115  x=1716  y=1120  width=117   height=136   xoffset=-17   yoffset=42    xadvance=83    page=0  chnl=15\nchar id=116  x=457   y=1140  width=95    height=155   xoffset=-24   yoffset=23    xadvance=52    page=0  chnl=15\nchar id=117  x=1845  y=1117  width=116   height=135   xoffset=-14   yoffset=43    xadvance=88    page=0  chnl=15\nchar id=118  x=2772  y=1100  width=122   height=133   xoffset=-22   yoffset=43    xadvance=78    page=0  chnl=15\nchar id=119  x=2462  y=1113  width=163   height=133   xoffset=-22   yoffset=43    xadvance=120   page=0  chnl=15\nchar id=120  x=2637  y=1106  width=123   height=133   xoffset=-22   yoffset=43    xadvance=79    page=0  chnl=15\nchar id=121  x=0     y=613   width=122   height=167   xoffset=-23   yoffset=43    xadvance=76    page=0  chnl=15\nchar id=122  x=2906  y=1097  width=117   height=133   xoffset=-18   yoffset=43    xadvance=79    page=0  chnl=15\nchar id=123  x=458   y=0     width=97    height=202   xoffset=-20   yoffset=3     xadvance=54    page=0  chnl=15\nchar id=124  x=2451  y=206   width=61    height=183   xoffset=-11   yoffset=14    xadvance=39    page=0  chnl=15\nchar id=125  x=349   y=0     width=97    height=202   xoffset=-23   yoffset=3     xadvance=54    page=0  chnl=15\nchar id=126  x=2378  y=1259  width=138   height=79    xoffset=-14   yoffset=65    xadvance=109   page=0  chnl=15\nchar id=160  x=513   y=1439  width=51    height=49    xoffset=-25   yoffset=167   xadvance=40    page=0  chnl=15\nchar id=161  x=217   y=1142  width=67    height=162   xoffset=-14   yoffset=42    xadvance=39    page=0  chnl=15\nchar id=162  x=1341  y=413   width=120   height=170   xoffset=-16   yoffset=25    xadvance=88    page=0  chnl=15\nchar id=163  x=1300  y=774   width=131   height=163   xoffset=-18   yoffset=13    xadvance=93    page=0  chnl=15\nchar id=164  x=702   y=1129  width=149   height=149   xoffset=-17   yoffset=30    xadvance=114   page=0  chnl=15\nchar id=165  x=465   y=955   width=140   height=162   xoffset=-22   yoffset=14    xadvance=97    page=0  chnl=15\nchar id=166  x=2375  y=206   width=64    height=183   xoffset=-13   yoffset=14    xadvance=38    page=0  chnl=15\nchar id=167  x=205   y=0     width=132   height=202   xoffset=-18   yoffset=13    xadvance=98    page=0  chnl=15\nchar id=168  x=2716  y=1251  width=100   height=65    xoffset=-17   yoffset=12    xadvance=67    page=0  chnl=15\nchar id=169  x=995   y=599   width=161   height=165   xoffset=-18   yoffset=13    xadvance=126   page=0  chnl=15\nchar id=170  x=1368  y=1273  width=99    height=109   xoffset=-13   yoffset=13    xadvance=71    page=0  chnl=15\nchar id=171  x=1131  y=1277  width=110   height=110   xoffset=-17   yoffset=54    xadvance=75    page=0  chnl=15\nchar id=172  x=2251  y=1261  width=115   height=81    xoffset=-15   yoffset=65    xadvance=89    page=0  chnl=15\nchar id=173  x=133   y=1458  width=88    height=60    xoffset=-22   yoffset=74    xadvance=44    page=0  chnl=15\nchar id=174  x=1168  y=597   width=161   height=165   xoffset=-18   yoffset=13    xadvance=126   page=0  chnl=15\nchar id=175  x=333   y=1448  width=105   height=59    xoffset=-15   yoffset=14    xadvance=73    page=0  chnl=15\nchar id=176  x=1815  y=1268  width=89    height=88    xoffset=-15   yoffset=13    xadvance=60    page=0  chnl=15\nchar id=177  x=863   y=1129  width=121   height=147   xoffset=-17   yoffset=29    xadvance=85    page=0  chnl=15\nchar id=178  x=899   y=1288  width=97    height=111   xoffset=-19   yoffset=13    xadvance=59    page=0  chnl=15\nchar id=179  x=790   y=1290  width=97    height=112   xoffset=-20   yoffset=13    xadvance=59    page=0  chnl=15\nchar id=180  x=2528  y=1258  width=82    height=71    xoffset=-15   yoffset=8     xadvance=50    page=0  chnl=15\nchar id=181  x=866   y=599   width=117   height=166   xoffset=-13   yoffset=43    xadvance=91    page=0  chnl=15\nchar id=182  x=2893  y=923   width=110   height=162   xoffset=-20   yoffset=14    xadvance=78    page=0  chnl=15\nchar id=183  x=2908  y=1242  width=67    height=65    xoffset=-13   yoffset=62    xadvance=42    page=0  chnl=15\nchar id=184  x=2166  y=1261  width=73    height=82    xoffset=-15   yoffset=128   xadvance=40    page=0  chnl=15\nchar id=185  x=1479  y=1271  width=79    height=109   xoffset=-15   yoffset=14    xadvance=59    page=0  chnl=15\nchar id=186  x=1253  y=1274  width=103   height=109   xoffset=-15   yoffset=13    xadvance=73    page=0  chnl=15\nchar id=187  x=1008  y=1277  width=111   height=110   xoffset=-17   yoffset=54    xadvance=75    page=0  chnl=15\nchar id=188  x=2542  y=758   width=154   height=162   xoffset=-18   yoffset=14    xadvance=117   page=0  chnl=15\nchar id=189  x=2372  y=760   width=158   height=162   xoffset=-18   yoffset=14    xadvance=124   page=0  chnl=15\nchar id=190  x=1129  y=776   width=159   height=163   xoffset=-16   yoffset=13    xadvance=124   page=0  chnl=15\nchar id=191  x=925   y=777   width=113   height=164   xoffset=-19   yoffset=42    xadvance=76    page=0  chnl=15\nchar id=192  x=162   y=225   width=150   height=192   xoffset=-23   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=193  x=324   y=214   width=150   height=192   xoffset=-23   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=194  x=0     y=225   width=150   height=192   xoffset=-23   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=195  x=1359  y=210   width=150   height=190   xoffset=-23   yoffset=-14   xadvance=104   page=0  chnl=15\nchar id=196  x=1814  y=208   width=150   height=188   xoffset=-23   yoffset=-12   xadvance=104   page=0  chnl=15\nchar id=197  x=1016  y=0     width=150   height=199   xoffset=-23   yoffset=-23   xadvance=104   page=0  chnl=15\nchar id=198  x=1792  y=769   width=198   height=162   xoffset=-26   yoffset=14    xadvance=150   page=0  chnl=15\nchar id=199  x=1178  y=0     width=137   height=198   xoffset=-15   yoffset=13    xadvance=104   page=0  chnl=15\nchar id=200  x=2922  y=0     width=122   height=192   xoffset=-12   yoffset=-16   xadvance=91    page=0  chnl=15\nchar id=201  x=641   y=214   width=122   height=192   xoffset=-12   yoffset=-16   xadvance=91    page=0  chnl=15\nchar id=202  x=775   y=213   width=122   height=192   xoffset=-12   yoffset=-16   xadvance=91    page=0  chnl=15\nchar id=203  x=1976  y=207   width=122   height=188   xoffset=-12   yoffset=-12   xadvance=91    page=0  chnl=15\nchar id=204  x=1018  y=211   width=82    height=192   xoffset=-27   yoffset=-16   xadvance=44    page=0  chnl=15\nchar id=205  x=1112  y=211   width=82    height=192   xoffset=-11   yoffset=-16   xadvance=44    page=0  chnl=15\nchar id=206  x=909   y=213   width=97    height=192   xoffset=-27   yoffset=-16   xadvance=44    page=0  chnl=15\nchar id=207  x=2110  y=207   width=100   height=188   xoffset=-28   yoffset=-12   xadvance=44    page=0  chnl=15\nchar id=208  x=0     y=969   width=145   height=162   xoffset=-22   yoffset=14    xadvance=107   page=0  chnl=15\nchar id=209  x=1521  y=208   width=137   height=190   xoffset=-12   yoffset=-14   xadvance=114   page=0  chnl=15\nchar id=210  x=2184  y=0     width=141   height=195   xoffset=-16   yoffset=-17   xadvance=110   page=0  chnl=15\nchar id=211  x=2031  y=0     width=141   height=195   xoffset=-16   yoffset=-17   xadvance=110   page=0  chnl=15\nchar id=212  x=1878  y=0     width=141   height=195   xoffset=-16   yoffset=-17   xadvance=110   page=0  chnl=15\nchar id=213  x=2769  y=0     width=141   height=193   xoffset=-16   yoffset=-15   xadvance=110   page=0  chnl=15\nchar id=214  x=1206  y=210   width=141   height=191   xoffset=-16   yoffset=-13   xadvance=110   page=0  chnl=15\nchar id=215  x=279   y=1316  width=120   height=120   xoffset=-18   yoffset=40    xadvance=85    page=0  chnl=15\nchar id=216  x=2655  y=206   width=143   height=174   xoffset=-16   yoffset=10    xadvance=110   page=0  chnl=15\nchar id=217  x=2625  y=0     width=132   height=194   xoffset=-14   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=218  x=2481  y=0     width=132   height=194   xoffset=-14   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=219  x=2337  y=0     width=132   height=194   xoffset=-14   yoffset=-16   xadvance=104   page=0  chnl=15\nchar id=220  x=1670  y=208   width=132   height=190   xoffset=-14   yoffset=-12   xadvance=104   page=0  chnl=15\nchar id=221  x=486   y=214   width=143   height=192   xoffset=-24   yoffset=-16   xadvance=96    page=0  chnl=15\nchar id=222  x=2360  y=939   width=124   height=162   xoffset=-12   yoffset=14    xadvance=95    page=0  chnl=15\nchar id=223  x=121   y=429   width=127   height=171   xoffset=-14   yoffset=7     xadvance=95    page=0  chnl=15\nchar id=224  x=1604  y=410   width=119   height=170   xoffset=-16   yoffset=8     xadvance=87    page=0  chnl=15\nchar id=225  x=1473  y=412   width=119   height=170   xoffset=-16   yoffset=8     xadvance=87    page=0  chnl=15\nchar id=226  x=1735  y=410   width=119   height=170   xoffset=-16   yoffset=8     xadvance=87    page=0  chnl=15\nchar id=227  x=532   y=600   width=119   height=167   xoffset=-16   yoffset=11    xadvance=87    page=0  chnl=15\nchar id=228  x=2926  y=569   width=119   height=165   xoffset=-16   yoffset=13    xadvance=87    page=0  chnl=15\nchar id=229  x=2524  y=206   width=119   height=177   xoffset=-16   yoffset=1     xadvance=87    page=0  chnl=15\nchar id=230  x=996   y=1129  width=173   height=136   xoffset=-19   yoffset=42    xadvance=135   page=0  chnl=15\nchar id=231  x=1979  y=407   width=120   height=169   xoffset=-17   yoffset=42    xadvance=84    page=0  chnl=15\nchar id=232  x=1076  y=415   width=121   height=170   xoffset=-17   yoffset=8     xadvance=85    page=0  chnl=15\nchar id=233  x=943   y=417   width=121   height=170   xoffset=-17   yoffset=8     xadvance=85    page=0  chnl=15\nchar id=234  x=810   y=417   width=121   height=170   xoffset=-17   yoffset=8     xadvance=85    page=0  chnl=15\nchar id=235  x=2793  y=572   width=121   height=165   xoffset=-17   yoffset=13    xadvance=85    page=0  chnl=15\nchar id=236  x=772   y=600   width=82    height=167   xoffset=-29   yoffset=9     xadvance=40    page=0  chnl=15\nchar id=237  x=2970  y=388   width=82    height=167   xoffset=-13   yoffset=9     xadvance=40    page=0  chnl=15\nchar id=238  x=663   y=600   width=97    height=167   xoffset=-29   yoffset=9     xadvance=40    page=0  chnl=15\nchar id=239  x=0     y=1143  width=100   height=162   xoffset=-30   yoffset=14    xadvance=40    page=0  chnl=15\nchar id=240  x=2810  y=205   width=123   height=173   xoffset=-15   yoffset=5     xadvance=94    page=0  chnl=15\nchar id=241  x=0     y=792   width=116   height=165   xoffset=-14   yoffset=11    xadvance=88    page=0  chnl=15\nchar id=242  x=260   y=429   width=127   height=170   xoffset=-18   yoffset=8     xadvance=91    page=0  chnl=15\nchar id=243  x=538   y=418   width=127   height=170   xoffset=-18   yoffset=8     xadvance=91    page=0  chnl=15\nchar id=244  x=399   y=418   width=127   height=170   xoffset=-18   yoffset=8     xadvance=91    page=0  chnl=15\nchar id=245  x=2831  y=390   width=127   height=167   xoffset=-18   yoffset=11    xadvance=91    page=0  chnl=15\nchar id=246  x=2253  y=583   width=127   height=165   xoffset=-18   yoffset=13    xadvance=91    page=0  chnl=15\nchar id=247  x=140   y=1317  width=127   height=128   xoffset=-19   yoffset=34    xadvance=91    page=0  chnl=15\nchar id=248  x=564   y=1129  width=126   height=153   xoffset=-17   yoffset=34    xadvance=91    page=0  chnl=15\nchar id=249  x=2111  y=407   width=116   height=169   xoffset=-14   yoffset=9     xadvance=88    page=0  chnl=15\nchar id=250  x=2239  y=402   width=116   height=169   xoffset=-14   yoffset=9     xadvance=88    page=0  chnl=15\nchar id=251  x=2367  y=402   width=116   height=169   xoffset=-14   yoffset=9     xadvance=88    page=0  chnl=15\nchar id=252  x=672   y=779   width=116   height=164   xoffset=-14   yoffset=14    xadvance=88    page=0  chnl=15\nchar id=253  x=749   y=0     width=122   height=201   xoffset=-23   yoffset=9     xadvance=76    page=0  chnl=15\nchar id=254  x=883   y=0     width=121   height=201   xoffset=-13   yoffset=8     xadvance=92    page=0  chnl=15\nchar id=255  x=1744  y=0     width=122   height=196   xoffset=-23   yoffset=14    xadvance=76    page=0  chnl=15\nkernings count=1686\nkerning first=32  second=84  amount=-3\nkerning first=40  second=86  amount=2\nkerning first=40  second=87  amount=1\nkerning first=40  second=89  amount=2\nkerning first=40  second=221 amount=2\nkerning first=70  second=44  amount=-18\nkerning first=70  second=46  amount=-18\nkerning first=70  second=65  amount=-13\nkerning first=70  second=74  amount=-21\nkerning first=70  second=84  amount=2\nkerning first=70  second=97  amount=-3\nkerning first=70  second=99  amount=-2\nkerning first=70  second=100 amount=-2\nkerning first=70  second=101 amount=-2\nkerning first=70  second=103 amount=-2\nkerning first=70  second=111 amount=-2\nkerning first=70  second=113 amount=-2\nkerning first=70  second=117 amount=-2\nkerning first=70  second=118 amount=-2\nkerning first=70  second=121 amount=-2\nkerning first=70  second=192 amount=-13\nkerning first=70  second=193 amount=-13\nkerning first=70  second=194 amount=-13\nkerning first=70  second=195 amount=-13\nkerning first=70  second=196 amount=-13\nkerning first=70  second=197 amount=-13\nkerning first=70  second=224 amount=-3\nkerning first=70  second=225 amount=-3\nkerning first=70  second=226 amount=-3\nkerning first=70  second=227 amount=-3\nkerning first=70  second=228 amount=-3\nkerning first=70  second=229 amount=-3\nkerning first=70  second=231 amount=-2\nkerning first=70  second=232 amount=-2\nkerning first=70  second=233 amount=-2\nkerning first=70  second=234 amount=-2\nkerning first=70  second=235 amount=-2\nkerning first=70  second=242 amount=-2\nkerning first=70  second=243 amount=-2\nkerning first=70  second=244 amount=-2\nkerning first=70  second=245 amount=-2\nkerning first=70  second=246 amount=-2\nkerning first=70  second=249 amount=-2\nkerning first=70  second=250 amount=-2\nkerning first=70  second=251 amount=-2\nkerning first=70  second=252 amount=-2\nkerning first=70  second=253 amount=-2\nkerning first=70  second=255 amount=-2\nkerning first=81  second=84  amount=-3\nkerning first=81  second=86  amount=-2\nkerning first=81  second=87  amount=-2\nkerning first=81  second=89  amount=-3\nkerning first=81  second=221 amount=-3\nkerning first=82  second=84  amount=-6\nkerning first=82  second=86  amount=-1\nkerning first=82  second=89  amount=-4\nkerning first=82  second=221 amount=-4\nkerning first=91  second=74  amount=-1\nkerning first=91  second=85  amount=-1\nkerning first=91  second=217 amount=-1\nkerning first=91  second=218 amount=-1\nkerning first=91  second=219 amount=-1\nkerning first=91  second=220 amount=-1\nkerning first=102 second=34  amount=1\nkerning first=102 second=39  amount=1\nkerning first=102 second=99  amount=-2\nkerning first=102 second=100 amount=-2\nkerning first=102 second=101 amount=-2\nkerning first=102 second=103 amount=-2\nkerning first=102 second=113 amount=-2\nkerning first=102 second=231 amount=-2\nkerning first=102 second=232 amount=-2\nkerning first=102 second=233 amount=-2\nkerning first=102 second=234 amount=-2\nkerning first=102 second=235 amount=-2\nkerning first=107 second=99  amount=-2\nkerning first=107 second=100 amount=-2\nkerning first=107 second=101 amount=-2\nkerning first=107 second=103 amount=-2\nkerning first=107 second=113 amount=-2\nkerning first=107 second=231 amount=-2\nkerning first=107 second=232 amount=-2\nkerning first=107 second=233 amount=-2\nkerning first=107 second=234 amount=-2\nkerning first=107 second=235 amount=-2\nkerning first=116 second=111 amount=-2\nkerning first=116 second=242 amount=-2\nkerning first=116 second=243 amount=-2\nkerning first=116 second=244 amount=-2\nkerning first=116 second=245 amount=-2\nkerning first=116 second=246 amount=-2\nkerning first=119 second=44  amount=-10\nkerning first=119 second=46  amount=-10\nkerning first=123 second=74  amount=-2\nkerning first=123 second=85  amount=-2\nkerning first=123 second=217 amount=-2\nkerning first=123 second=218 amount=-2\nkerning first=123 second=219 amount=-2\nkerning first=123 second=220 amount=-2\nkerning first=34  second=34  amount=-8\nkerning first=34  second=39  amount=-8\nkerning first=34  second=111 amount=-5\nkerning first=34  second=242 amount=-5\nkerning first=34  second=243 amount=-5\nkerning first=34  second=244 amount=-5\nkerning first=34  second=245 amount=-5\nkerning first=34  second=246 amount=-5\nkerning first=34  second=65  amount=-9\nkerning first=34  second=192 amount=-9\nkerning first=34  second=193 amount=-9\nkerning first=34  second=194 amount=-9\nkerning first=34  second=195 amount=-9\nkerning first=34  second=196 amount=-9\nkerning first=34  second=197 amount=-9\nkerning first=34  second=99  amount=-5\nkerning first=34  second=100 amount=-5\nkerning first=34  second=101 amount=-5\nkerning first=34  second=103 amount=-5\nkerning first=34  second=113 amount=-5\nkerning first=34  second=231 amount=-5\nkerning first=34  second=232 amount=-5\nkerning first=34  second=233 amount=-5\nkerning first=34  second=234 amount=-5\nkerning first=34  second=235 amount=-5\nkerning first=34  second=109 amount=-2\nkerning first=34  second=110 amount=-2\nkerning first=34  second=112 amount=-2\nkerning first=34  second=241 amount=-2\nkerning first=34  second=97  amount=-4\nkerning first=34  second=224 amount=-4\nkerning first=34  second=225 amount=-4\nkerning first=34  second=226 amount=-4\nkerning first=34  second=227 amount=-4\nkerning first=34  second=228 amount=-4\nkerning first=34  second=229 amount=-4\nkerning first=34  second=115 amount=-6\nkerning first=39  second=34  amount=-8\nkerning first=39  second=39  amount=-8\nkerning first=39  second=111 amount=-5\nkerning first=39  second=242 amount=-5\nkerning first=39  second=243 amount=-5\nkerning first=39  second=244 amount=-5\nkerning first=39  second=245 amount=-5\nkerning first=39  second=246 amount=-5\nkerning first=39  second=65  amount=-9\nkerning first=39  second=192 amount=-9\nkerning first=39  second=193 amount=-9\nkerning first=39  second=194 amount=-9\nkerning first=39  second=195 amount=-9\nkerning first=39  second=196 amount=-9\nkerning first=39  second=197 amount=-9\nkerning first=39  second=99  amount=-5\nkerning first=39  second=100 amount=-5\nkerning first=39  second=101 amount=-5\nkerning first=39  second=103 amount=-5\nkerning first=39  second=113 amount=-5\nkerning first=39  second=231 amount=-5\nkerning first=39  second=232 amount=-5\nkerning first=39  second=233 amount=-5\nkerning first=39  second=234 amount=-5\nkerning first=39  second=235 amount=-5\nkerning first=39  second=109 amount=-2\nkerning first=39  second=110 amount=-2\nkerning first=39  second=112 amount=-2\nkerning first=39  second=241 amount=-2\nkerning first=39  second=97  amount=-4\nkerning first=39  second=224 amount=-4\nkerning first=39  second=225 amount=-4\nkerning first=39  second=226 amount=-4\nkerning first=39  second=227 amount=-4\nkerning first=39  second=228 amount=-4\nkerning first=39  second=229 amount=-4\nkerning first=39  second=115 amount=-6\nkerning first=44  second=34  amount=-13\nkerning first=44  second=39  amount=-13\nkerning first=46  second=34  amount=-13\nkerning first=46  second=39  amount=-13\nkerning first=65  second=118 amount=-4\nkerning first=65  second=121 amount=-4\nkerning first=65  second=253 amount=-4\nkerning first=65  second=255 amount=-4\nkerning first=65  second=67  amount=-1\nkerning first=65  second=71  amount=-1\nkerning first=65  second=79  amount=-1\nkerning first=65  second=81  amount=-1\nkerning first=65  second=216 amount=-1\nkerning first=65  second=199 amount=-1\nkerning first=65  second=210 amount=-1\nkerning first=65  second=211 amount=-1\nkerning first=65  second=212 amount=-1\nkerning first=65  second=213 amount=-1\nkerning first=65  second=214 amount=-1\nkerning first=65  second=85  amount=-1\nkerning first=65  second=217 amount=-1\nkerning first=65  second=218 amount=-1\nkerning first=65  second=219 amount=-1\nkerning first=65  second=220 amount=-1\nkerning first=65  second=34  amount=-9\nkerning first=65  second=39  amount=-9\nkerning first=65  second=111 amount=-1\nkerning first=65  second=242 amount=-1\nkerning first=65  second=243 amount=-1\nkerning first=65  second=244 amount=-1\nkerning first=65  second=245 amount=-1\nkerning first=65  second=246 amount=-1\nkerning first=65  second=87  amount=-5\nkerning first=65  second=84  amount=-10\nkerning first=65  second=117 amount=-1\nkerning first=65  second=249 amount=-1\nkerning first=65  second=250 amount=-1\nkerning first=65  second=251 amount=-1\nkerning first=65  second=252 amount=-1\nkerning first=65  second=122 amount=1\nkerning first=65  second=86  amount=-7\nkerning first=65  second=89  amount=-7\nkerning first=65  second=221 amount=-7\nkerning first=66  second=84  amount=-2\nkerning first=66  second=86  amount=-2\nkerning first=66  second=89  amount=-4\nkerning first=66  second=221 amount=-4\nkerning first=67  second=84  amount=-2\nkerning first=68  second=84  amount=-2\nkerning first=68  second=86  amount=-2\nkerning first=68  second=89  amount=-3\nkerning first=68  second=221 amount=-3\nkerning first=68  second=65  amount=-2\nkerning first=68  second=192 amount=-2\nkerning first=68  second=193 amount=-2\nkerning first=68  second=194 amount=-2\nkerning first=68  second=195 amount=-2\nkerning first=68  second=196 amount=-2\nkerning first=68  second=197 amount=-2\nkerning first=68  second=88  amount=-2\nkerning first=68  second=44  amount=-8\nkerning first=68  second=46  amount=-8\nkerning first=68  second=90  amount=-2\nkerning first=69  second=118 amount=-2\nkerning first=69  second=121 amount=-2\nkerning first=69  second=253 amount=-2\nkerning first=69  second=255 amount=-2\nkerning first=69  second=111 amount=-1\nkerning first=69  second=242 amount=-1\nkerning first=69  second=243 amount=-1\nkerning first=69  second=244 amount=-1\nkerning first=69  second=245 amount=-1\nkerning first=69  second=246 amount=-1\nkerning first=69  second=84  amount=2\nkerning first=69  second=117 amount=-1\nkerning first=69  second=249 amount=-1\nkerning first=69  second=250 amount=-1\nkerning first=69  second=251 amount=-1\nkerning first=69  second=252 amount=-1\nkerning first=69  second=99  amount=-1\nkerning first=69  second=100 amount=-1\nkerning first=69  second=101 amount=-1\nkerning first=69  second=103 amount=-1\nkerning first=69  second=113 amount=-1\nkerning first=69  second=231 amount=-1\nkerning first=69  second=232 amount=-1\nkerning first=69  second=233 amount=-1\nkerning first=69  second=234 amount=-1\nkerning first=69  second=235 amount=-1\nkerning first=72  second=84  amount=-2\nkerning first=72  second=89  amount=-2\nkerning first=72  second=221 amount=-2\nkerning first=72  second=65  amount=1\nkerning first=72  second=192 amount=1\nkerning first=72  second=193 amount=1\nkerning first=72  second=194 amount=1\nkerning first=72  second=195 amount=1\nkerning first=72  second=196 amount=1\nkerning first=72  second=197 amount=1\nkerning first=72  second=88  amount=1\nkerning first=73  second=84  amount=-2\nkerning first=73  second=89  amount=-2\nkerning first=73  second=221 amount=-2\nkerning first=73  second=65  amount=1\nkerning first=73  second=192 amount=1\nkerning first=73  second=193 amount=1\nkerning first=73  second=194 amount=1\nkerning first=73  second=195 amount=1\nkerning first=73  second=196 amount=1\nkerning first=73  second=197 amount=1\nkerning first=73  second=88  amount=1\nkerning first=74  second=65  amount=-2\nkerning first=74  second=192 amount=-2\nkerning first=74  second=193 amount=-2\nkerning first=74  second=194 amount=-2\nkerning first=74  second=195 amount=-2\nkerning first=74  second=196 amount=-2\nkerning first=74  second=197 amount=-2\nkerning first=75  second=118 amount=-3\nkerning first=75  second=121 amount=-3\nkerning first=75  second=253 amount=-3\nkerning first=75  second=255 amount=-3\nkerning first=75  second=67  amount=-2\nkerning first=75  second=71  amount=-2\nkerning first=75  second=79  amount=-2\nkerning first=75  second=81  amount=-2\nkerning first=75  second=216 amount=-2\nkerning first=75  second=199 amount=-2\nkerning first=75  second=210 amount=-2\nkerning first=75  second=211 amount=-2\nkerning first=75  second=212 amount=-2\nkerning first=75  second=213 amount=-2\nkerning first=75  second=214 amount=-2\nkerning first=75  second=111 amount=-2\nkerning first=75  second=242 amount=-2\nkerning first=75  second=243 amount=-2\nkerning first=75  second=244 amount=-2\nkerning first=75  second=245 amount=-2\nkerning first=75  second=246 amount=-2\nkerning first=75  second=117 amount=-2\nkerning first=75  second=249 amount=-2\nkerning first=75  second=250 amount=-2\nkerning first=75  second=251 amount=-2\nkerning first=75  second=252 amount=-2\nkerning first=75  second=99  amount=-2\nkerning first=75  second=100 amount=-2\nkerning first=75  second=101 amount=-2\nkerning first=75  second=103 amount=-2\nkerning first=75  second=113 amount=-2\nkerning first=75  second=231 amount=-2\nkerning first=75  second=232 amount=-2\nkerning first=75  second=233 amount=-2\nkerning first=75  second=234 amount=-2\nkerning first=75  second=235 amount=-2\nkerning first=75  second=45  amount=-5\nkerning first=75  second=173 amount=-5\nkerning first=75  second=109 amount=-2\nkerning first=75  second=110 amount=-2\nkerning first=75  second=112 amount=-2\nkerning first=75  second=241 amount=-2\nkerning first=76  second=118 amount=-10\nkerning first=76  second=121 amount=-10\nkerning first=76  second=253 amount=-10\nkerning first=76  second=255 amount=-10\nkerning first=76  second=67  amount=-5\nkerning first=76  second=71  amount=-5\nkerning first=76  second=79  amount=-5\nkerning first=76  second=81  amount=-5\nkerning first=76  second=216 amount=-5\nkerning first=76  second=199 amount=-5\nkerning first=76  second=210 amount=-5\nkerning first=76  second=211 amount=-5\nkerning first=76  second=212 amount=-5\nkerning first=76  second=213 amount=-5\nkerning first=76  second=214 amount=-5\nkerning first=76  second=85  amount=-4\nkerning first=76  second=217 amount=-4\nkerning first=76  second=218 amount=-4\nkerning first=76  second=219 amount=-4\nkerning first=76  second=220 amount=-4\nkerning first=76  second=34  amount=-26\nkerning first=76  second=39  amount=-26\nkerning first=76  second=87  amount=-11\nkerning first=76  second=84  amount=-21\nkerning first=76  second=117 amount=-3\nkerning first=76  second=249 amount=-3\nkerning first=76  second=250 amount=-3\nkerning first=76  second=251 amount=-3\nkerning first=76  second=252 amount=-3\nkerning first=76  second=86  amount=-14\nkerning first=76  second=89  amount=-19\nkerning first=76  second=221 amount=-19\nkerning first=76  second=65  amount=1\nkerning first=76  second=192 amount=1\nkerning first=76  second=193 amount=1\nkerning first=76  second=194 amount=1\nkerning first=76  second=195 amount=1\nkerning first=76  second=196 amount=1\nkerning first=76  second=197 amount=1\nkerning first=77  second=84  amount=-2\nkerning first=77  second=89  amount=-2\nkerning first=77  second=221 amount=-2\nkerning first=77  second=65  amount=1\nkerning first=77  second=192 amount=1\nkerning first=77  second=193 amount=1\nkerning first=77  second=194 amount=1\nkerning first=77  second=195 amount=1\nkerning first=77  second=196 amount=1\nkerning first=77  second=197 amount=1\nkerning first=77  second=88  amount=1\nkerning first=78  second=84  amount=-2\nkerning first=78  second=89  amount=-2\nkerning first=78  second=221 amount=-2\nkerning first=78  second=65  amount=1\nkerning first=78  second=192 amount=1\nkerning first=78  second=193 amount=1\nkerning first=78  second=194 amount=1\nkerning first=78  second=195 amount=1\nkerning first=78  second=196 amount=1\nkerning first=78  second=197 amount=1\nkerning first=78  second=88  amount=1\nkerning first=79  second=84  amount=-2\nkerning first=79  second=86  amount=-2\nkerning first=79  second=89  amount=-3\nkerning first=79  second=221 amount=-3\nkerning first=79  second=65  amount=-2\nkerning first=79  second=192 amount=-2\nkerning first=79  second=193 amount=-2\nkerning first=79  second=194 amount=-2\nkerning first=79  second=195 amount=-2\nkerning first=79  second=196 amount=-2\nkerning first=79  second=197 amount=-2\nkerning first=79  second=88  amount=-2\nkerning first=79  second=44  amount=-8\nkerning first=79  second=46  amount=-8\nkerning first=79  second=90  amount=-2\nkerning first=80  second=118 amount=1\nkerning first=80  second=121 amount=1\nkerning first=80  second=253 amount=1\nkerning first=80  second=255 amount=1\nkerning first=80  second=111 amount=-1\nkerning first=80  second=242 amount=-1\nkerning first=80  second=243 amount=-1\nkerning first=80  second=244 amount=-1\nkerning first=80  second=245 amount=-1\nkerning first=80  second=246 amount=-1\nkerning first=80  second=65  amount=-11\nkerning first=80  second=192 amount=-11\nkerning first=80  second=193 amount=-11\nkerning first=80  second=194 amount=-11\nkerning first=80  second=195 amount=-11\nkerning first=80  second=196 amount=-11\nkerning first=80  second=197 amount=-11\nkerning first=80  second=88  amount=-2\nkerning first=80  second=44  amount=-25\nkerning first=80  second=46  amount=-25\nkerning first=80  second=90  amount=-2\nkerning first=80  second=99  amount=-1\nkerning first=80  second=100 amount=-1\nkerning first=80  second=101 amount=-1\nkerning first=80  second=103 amount=-1\nkerning first=80  second=113 amount=-1\nkerning first=80  second=231 amount=-1\nkerning first=80  second=232 amount=-1\nkerning first=80  second=233 amount=-1\nkerning first=80  second=234 amount=-1\nkerning first=80  second=235 amount=-1\nkerning first=80  second=97  amount=-1\nkerning first=80  second=224 amount=-1\nkerning first=80  second=225 amount=-1\nkerning first=80  second=226 amount=-1\nkerning first=80  second=227 amount=-1\nkerning first=80  second=228 amount=-1\nkerning first=80  second=229 amount=-1\nkerning first=80  second=74  amount=-16\nkerning first=84  second=118 amount=-6\nkerning first=84  second=121 amount=-6\nkerning first=84  second=253 amount=-6\nkerning first=84  second=255 amount=-6\nkerning first=84  second=67  amount=-2\nkerning first=84  second=71  amount=-2\nkerning first=84  second=79  amount=-2\nkerning first=84  second=81  amount=-2\nkerning first=84  second=216 amount=-2\nkerning first=84  second=199 amount=-2\nkerning first=84  second=210 amount=-2\nkerning first=84  second=211 amount=-2\nkerning first=84  second=212 amount=-2\nkerning first=84  second=213 amount=-2\nkerning first=84  second=214 amount=-2\nkerning first=84  second=111 amount=-8\nkerning first=84  second=242 amount=-8\nkerning first=84  second=243 amount=-8\nkerning first=84  second=244 amount=-8\nkerning first=84  second=245 amount=-8\nkerning first=84  second=246 amount=-8\nkerning first=84  second=87  amount=1\nkerning first=84  second=84  amount=1\nkerning first=84  second=117 amount=-7\nkerning first=84  second=249 amount=-7\nkerning first=84  second=250 amount=-7\nkerning first=84  second=251 amount=-7\nkerning first=84  second=252 amount=-7\nkerning first=84  second=122 amount=-5\nkerning first=84  second=86  amount=1\nkerning first=84  second=89  amount=1\nkerning first=84  second=221 amount=1\nkerning first=84  second=65  amount=-6\nkerning first=84  second=192 amount=-6\nkerning first=84  second=193 amount=-6\nkerning first=84  second=194 amount=-6\nkerning first=84  second=195 amount=-6\nkerning first=84  second=196 amount=-6\nkerning first=84  second=197 amount=-6\nkerning first=84  second=44  amount=-17\nkerning first=84  second=46  amount=-17\nkerning first=84  second=99  amount=-8\nkerning first=84  second=100 amount=-8\nkerning first=84  second=101 amount=-8\nkerning first=84  second=103 amount=-8\nkerning first=84  second=113 amount=-8\nkerning first=84  second=231 amount=-8\nkerning first=84  second=232 amount=-8\nkerning first=84  second=233 amount=-8\nkerning first=84  second=234 amount=-8\nkerning first=84  second=235 amount=-8\nkerning first=84  second=120 amount=-6\nkerning first=84  second=45  amount=-18\nkerning first=84  second=173 amount=-18\nkerning first=84  second=109 amount=-9\nkerning first=84  second=110 amount=-9\nkerning first=84  second=112 amount=-9\nkerning first=84  second=241 amount=-9\nkerning first=84  second=83  amount=-1\nkerning first=84  second=97  amount=-9\nkerning first=84  second=224 amount=-9\nkerning first=84  second=225 amount=-9\nkerning first=84  second=226 amount=-9\nkerning first=84  second=227 amount=-9\nkerning first=84  second=228 amount=-9\nkerning first=84  second=229 amount=-9\nkerning first=84  second=115 amount=-9\nkerning first=84  second=74  amount=-19\nkerning first=85  second=65  amount=-2\nkerning first=85  second=192 amount=-2\nkerning first=85  second=193 amount=-2\nkerning first=85  second=194 amount=-2\nkerning first=85  second=195 amount=-2\nkerning first=85  second=196 amount=-2\nkerning first=85  second=197 amount=-2\nkerning first=86  second=118 amount=-1\nkerning first=86  second=121 amount=-1\nkerning first=86  second=253 amount=-1\nkerning first=86  second=255 amount=-1\nkerning first=86  second=67  amount=-1\nkerning first=86  second=71  amount=-1\nkerning first=86  second=79  amount=-1\nkerning first=86  second=81  amount=-1\nkerning first=86  second=216 amount=-1\nkerning first=86  second=199 amount=-1\nkerning first=86  second=210 amount=-1\nkerning first=86  second=211 amount=-1\nkerning first=86  second=212 amount=-1\nkerning first=86  second=213 amount=-1\nkerning first=86  second=214 amount=-1\nkerning first=86  second=111 amount=-4\nkerning first=86  second=242 amount=-4\nkerning first=86  second=243 amount=-4\nkerning first=86  second=244 amount=-4\nkerning first=86  second=245 amount=-4\nkerning first=86  second=246 amount=-4\nkerning first=86  second=117 amount=-2\nkerning first=86  second=249 amount=-2\nkerning first=86  second=250 amount=-2\nkerning first=86  second=251 amount=-2\nkerning first=86  second=252 amount=-2\nkerning first=86  second=65  amount=-6\nkerning first=86  second=192 amount=-6\nkerning first=86  second=193 amount=-6\nkerning first=86  second=194 amount=-6\nkerning first=86  second=195 amount=-6\nkerning first=86  second=196 amount=-6\nkerning first=86  second=197 amount=-6\nkerning first=86  second=44  amount=-18\nkerning first=86  second=46  amount=-18\nkerning first=86  second=99  amount=-3\nkerning first=86  second=100 amount=-3\nkerning first=86  second=101 amount=-3\nkerning first=86  second=103 amount=-3\nkerning first=86  second=113 amount=-3\nkerning first=86  second=231 amount=-3\nkerning first=86  second=232 amount=-3\nkerning first=86  second=233 amount=-3\nkerning first=86  second=234 amount=-3\nkerning first=86  second=235 amount=-3\nkerning first=86  second=45  amount=-3\nkerning first=86  second=173 amount=-3\nkerning first=86  second=97  amount=-4\nkerning first=86  second=224 amount=-4\nkerning first=86  second=225 amount=-4\nkerning first=86  second=226 amount=-4\nkerning first=86  second=227 amount=-4\nkerning first=86  second=228 amount=-4\nkerning first=86  second=229 amount=-4\nkerning first=87  second=111 amount=-2\nkerning first=87  second=242 amount=-2\nkerning first=87  second=243 amount=-2\nkerning first=87  second=244 amount=-2\nkerning first=87  second=245 amount=-2\nkerning first=87  second=246 amount=-2\nkerning first=87  second=84  amount=1\nkerning first=87  second=117 amount=-1\nkerning first=87  second=249 amount=-1\nkerning first=87  second=250 amount=-1\nkerning first=87  second=251 amount=-1\nkerning first=87  second=252 amount=-1\nkerning first=87  second=65  amount=-3\nkerning first=87  second=192 amount=-3\nkerning first=87  second=193 amount=-3\nkerning first=87  second=194 amount=-3\nkerning first=87  second=195 amount=-3\nkerning first=87  second=196 amount=-3\nkerning first=87  second=197 amount=-3\nkerning first=87  second=44  amount=-10\nkerning first=87  second=46  amount=-10\nkerning first=87  second=99  amount=-2\nkerning first=87  second=100 amount=-2\nkerning first=87  second=101 amount=-2\nkerning first=87  second=103 amount=-2\nkerning first=87  second=113 amount=-2\nkerning first=87  second=231 amount=-2\nkerning first=87  second=232 amount=-2\nkerning first=87  second=233 amount=-2\nkerning first=87  second=234 amount=-2\nkerning first=87  second=235 amount=-2\nkerning first=87  second=45  amount=-5\nkerning first=87  second=173 amount=-5\nkerning first=87  second=97  amount=-3\nkerning first=87  second=224 amount=-3\nkerning first=87  second=225 amount=-3\nkerning first=87  second=226 amount=-3\nkerning first=87  second=227 amount=-3\nkerning first=87  second=228 amount=-3\nkerning first=87  second=229 amount=-3\nkerning first=88  second=118 amount=-2\nkerning first=88  second=121 amount=-2\nkerning first=88  second=253 amount=-2\nkerning first=88  second=255 amount=-2\nkerning first=88  second=67  amount=-2\nkerning first=88  second=71  amount=-2\nkerning first=88  second=79  amount=-2\nkerning first=88  second=81  amount=-2\nkerning first=88  second=216 amount=-2\nkerning first=88  second=199 amount=-2\nkerning first=88  second=210 amount=-2\nkerning first=88  second=211 amount=-2\nkerning first=88  second=212 amount=-2\nkerning first=88  second=213 amount=-2\nkerning first=88  second=214 amount=-2\nkerning first=88  second=111 amount=-2\nkerning first=88  second=242 amount=-2\nkerning first=88  second=243 amount=-2\nkerning first=88  second=244 amount=-2\nkerning first=88  second=245 amount=-2\nkerning first=88  second=246 amount=-2\nkerning first=88  second=117 amount=-2\nkerning first=88  second=249 amount=-2\nkerning first=88  second=250 amount=-2\nkerning first=88  second=251 amount=-2\nkerning first=88  second=252 amount=-2\nkerning first=88  second=86  amount=1\nkerning first=88  second=99  amount=-2\nkerning first=88  second=100 amount=-2\nkerning first=88  second=101 amount=-2\nkerning first=88  second=103 amount=-2\nkerning first=88  second=113 amount=-2\nkerning first=88  second=231 amount=-2\nkerning first=88  second=232 amount=-2\nkerning first=88  second=233 amount=-2\nkerning first=88  second=234 amount=-2\nkerning first=88  second=235 amount=-2\nkerning first=88  second=45  amount=-4\nkerning first=88  second=173 amount=-4\nkerning first=89  second=118 amount=-2\nkerning first=89  second=121 amount=-2\nkerning first=89  second=253 amount=-2\nkerning first=89  second=255 amount=-2\nkerning first=89  second=67  amount=-2\nkerning first=89  second=71  amount=-2\nkerning first=89  second=79  amount=-2\nkerning first=89  second=81  amount=-2\nkerning first=89  second=216 amount=-2\nkerning first=89  second=199 amount=-2\nkerning first=89  second=210 amount=-2\nkerning first=89  second=211 amount=-2\nkerning first=89  second=212 amount=-2\nkerning first=89  second=213 amount=-2\nkerning first=89  second=214 amount=-2\nkerning first=89  second=85  amount=-7\nkerning first=89  second=217 amount=-7\nkerning first=89  second=218 amount=-7\nkerning first=89  second=219 amount=-7\nkerning first=89  second=220 amount=-7\nkerning first=89  second=111 amount=-5\nkerning first=89  second=242 amount=-5\nkerning first=89  second=243 amount=-5\nkerning first=89  second=244 amount=-5\nkerning first=89  second=245 amount=-5\nkerning first=89  second=246 amount=-5\nkerning first=89  second=87  amount=1\nkerning first=89  second=84  amount=1\nkerning first=89  second=117 amount=-3\nkerning first=89  second=249 amount=-3\nkerning first=89  second=250 amount=-3\nkerning first=89  second=251 amount=-3\nkerning first=89  second=252 amount=-3\nkerning first=89  second=122 amount=-2\nkerning first=89  second=86  amount=1\nkerning first=89  second=89  amount=1\nkerning first=89  second=221 amount=1\nkerning first=89  second=65  amount=-7\nkerning first=89  second=192 amount=-7\nkerning first=89  second=193 amount=-7\nkerning first=89  second=194 amount=-7\nkerning first=89  second=195 amount=-7\nkerning first=89  second=196 amount=-7\nkerning first=89  second=197 amount=-7\nkerning first=89  second=88  amount=1\nkerning first=89  second=44  amount=-16\nkerning first=89  second=46  amount=-16\nkerning first=89  second=99  amount=-5\nkerning first=89  second=100 amount=-5\nkerning first=89  second=101 amount=-5\nkerning first=89  second=103 amount=-5\nkerning first=89  second=113 amount=-5\nkerning first=89  second=231 amount=-5\nkerning first=89  second=232 amount=-5\nkerning first=89  second=233 amount=-5\nkerning first=89  second=234 amount=-5\nkerning first=89  second=235 amount=-5\nkerning first=89  second=120 amount=-2\nkerning first=89  second=45  amount=-4\nkerning first=89  second=173 amount=-4\nkerning first=89  second=109 amount=-3\nkerning first=89  second=110 amount=-3\nkerning first=89  second=112 amount=-3\nkerning first=89  second=241 amount=-3\nkerning first=89  second=83  amount=-1\nkerning first=89  second=97  amount=-6\nkerning first=89  second=224 amount=-6\nkerning first=89  second=225 amount=-6\nkerning first=89  second=226 amount=-6\nkerning first=89  second=227 amount=-6\nkerning first=89  second=228 amount=-6\nkerning first=89  second=229 amount=-6\nkerning first=89  second=115 amount=-5\nkerning first=89  second=74  amount=-7\nkerning first=90  second=118 amount=-2\nkerning first=90  second=121 amount=-2\nkerning first=90  second=253 amount=-2\nkerning first=90  second=255 amount=-2\nkerning first=90  second=67  amount=-2\nkerning first=90  second=71  amount=-2\nkerning first=90  second=79  amount=-2\nkerning first=90  second=81  amount=-2\nkerning first=90  second=216 amount=-2\nkerning first=90  second=199 amount=-2\nkerning first=90  second=210 amount=-2\nkerning first=90  second=211 amount=-2\nkerning first=90  second=212 amount=-2\nkerning first=90  second=213 amount=-2\nkerning first=90  second=214 amount=-2\nkerning first=90  second=111 amount=-2\nkerning first=90  second=242 amount=-2\nkerning first=90  second=243 amount=-2\nkerning first=90  second=244 amount=-2\nkerning first=90  second=245 amount=-2\nkerning first=90  second=246 amount=-2\nkerning first=90  second=117 amount=-1\nkerning first=90  second=249 amount=-1\nkerning first=90  second=250 amount=-1\nkerning first=90  second=251 amount=-1\nkerning first=90  second=252 amount=-1\nkerning first=90  second=65  amount=1\nkerning first=90  second=192 amount=1\nkerning first=90  second=193 amount=1\nkerning first=90  second=194 amount=1\nkerning first=90  second=195 amount=1\nkerning first=90  second=196 amount=1\nkerning first=90  second=197 amount=1\nkerning first=90  second=99  amount=-2\nkerning first=90  second=100 amount=-2\nkerning first=90  second=101 amount=-2\nkerning first=90  second=103 amount=-2\nkerning first=90  second=113 amount=-2\nkerning first=90  second=231 amount=-2\nkerning first=90  second=232 amount=-2\nkerning first=90  second=233 amount=-2\nkerning first=90  second=234 amount=-2\nkerning first=90  second=235 amount=-2\nkerning first=97  second=118 amount=-1\nkerning first=97  second=121 amount=-1\nkerning first=97  second=253 amount=-1\nkerning first=97  second=255 amount=-1\nkerning first=97  second=34  amount=-5\nkerning first=97  second=39  amount=-5\nkerning first=98  second=118 amount=-1\nkerning first=98  second=121 amount=-1\nkerning first=98  second=253 amount=-1\nkerning first=98  second=255 amount=-1\nkerning first=98  second=34  amount=-2\nkerning first=98  second=39  amount=-2\nkerning first=98  second=122 amount=-1\nkerning first=98  second=120 amount=-1\nkerning first=99  second=34  amount=-1\nkerning first=99  second=39  amount=-1\nkerning first=101 second=118 amount=-1\nkerning first=101 second=121 amount=-1\nkerning first=101 second=253 amount=-1\nkerning first=101 second=255 amount=-1\nkerning first=101 second=34  amount=-1\nkerning first=101 second=39  amount=-1\nkerning first=104 second=34  amount=-8\nkerning first=104 second=39  amount=-8\nkerning first=109 second=34  amount=-8\nkerning first=109 second=39  amount=-8\nkerning first=110 second=34  amount=-8\nkerning first=110 second=39  amount=-8\nkerning first=111 second=118 amount=-1\nkerning first=111 second=121 amount=-1\nkerning first=111 second=253 amount=-1\nkerning first=111 second=255 amount=-1\nkerning first=111 second=34  amount=-11\nkerning first=111 second=39  amount=-11\nkerning first=111 second=122 amount=-1\nkerning first=111 second=120 amount=-2\nkerning first=112 second=118 amount=-1\nkerning first=112 second=121 amount=-1\nkerning first=112 second=253 amount=-1\nkerning first=112 second=255 amount=-1\nkerning first=112 second=34  amount=-2\nkerning first=112 second=39  amount=-2\nkerning first=112 second=122 amount=-1\nkerning first=112 second=120 amount=-1\nkerning first=114 second=118 amount=1\nkerning first=114 second=121 amount=1\nkerning first=114 second=253 amount=1\nkerning first=114 second=255 amount=1\nkerning first=114 second=34  amount=1\nkerning first=114 second=39  amount=1\nkerning first=114 second=111 amount=-2\nkerning first=114 second=242 amount=-2\nkerning first=114 second=243 amount=-2\nkerning first=114 second=244 amount=-2\nkerning first=114 second=245 amount=-2\nkerning first=114 second=246 amount=-2\nkerning first=114 second=44  amount=-10\nkerning first=114 second=46  amount=-10\nkerning first=114 second=99  amount=-1\nkerning first=114 second=100 amount=-1\nkerning first=114 second=101 amount=-1\nkerning first=114 second=103 amount=-1\nkerning first=114 second=113 amount=-1\nkerning first=114 second=231 amount=-1\nkerning first=114 second=232 amount=-1\nkerning first=114 second=233 amount=-1\nkerning first=114 second=234 amount=-1\nkerning first=114 second=235 amount=-1\nkerning first=114 second=97  amount=-3\nkerning first=114 second=224 amount=-3\nkerning first=114 second=225 amount=-3\nkerning first=114 second=226 amount=-3\nkerning first=114 second=227 amount=-3\nkerning first=114 second=228 amount=-3\nkerning first=114 second=229 amount=-3\nkerning first=118 second=34  amount=1\nkerning first=118 second=39  amount=1\nkerning first=118 second=111 amount=-1\nkerning first=118 second=242 amount=-1\nkerning first=118 second=243 amount=-1\nkerning first=118 second=244 amount=-1\nkerning first=118 second=245 amount=-1\nkerning first=118 second=246 amount=-1\nkerning first=118 second=44  amount=-8\nkerning first=118 second=46  amount=-8\nkerning first=118 second=99  amount=-1\nkerning first=118 second=100 amount=-1\nkerning first=118 second=101 amount=-1\nkerning first=118 second=103 amount=-1\nkerning first=118 second=113 amount=-1\nkerning first=118 second=231 amount=-1\nkerning first=118 second=232 amount=-1\nkerning first=118 second=233 amount=-1\nkerning first=118 second=234 amount=-1\nkerning first=118 second=235 amount=-1\nkerning first=118 second=97  amount=-1\nkerning first=118 second=224 amount=-1\nkerning first=118 second=225 amount=-1\nkerning first=118 second=226 amount=-1\nkerning first=118 second=227 amount=-1\nkerning first=118 second=228 amount=-1\nkerning first=118 second=229 amount=-1\nkerning first=120 second=111 amount=-2\nkerning first=120 second=242 amount=-2\nkerning first=120 second=243 amount=-2\nkerning first=120 second=244 amount=-2\nkerning first=120 second=245 amount=-2\nkerning first=120 second=246 amount=-2\nkerning first=120 second=99  amount=-2\nkerning first=120 second=100 amount=-2\nkerning first=120 second=101 amount=-2\nkerning first=120 second=103 amount=-2\nkerning first=120 second=113 amount=-2\nkerning first=120 second=231 amount=-2\nkerning first=120 second=232 amount=-2\nkerning first=120 second=233 amount=-2\nkerning first=120 second=234 amount=-2\nkerning first=120 second=235 amount=-2\nkerning first=121 second=34  amount=1\nkerning first=121 second=39  amount=1\nkerning first=121 second=111 amount=-1\nkerning first=121 second=242 amount=-1\nkerning first=121 second=243 amount=-1\nkerning first=121 second=244 amount=-1\nkerning first=121 second=245 amount=-1\nkerning first=121 second=246 amount=-1\nkerning first=121 second=44  amount=-8\nkerning first=121 second=46  amount=-8\nkerning first=121 second=99  amount=-1\nkerning first=121 second=100 amount=-1\nkerning first=121 second=101 amount=-1\nkerning first=121 second=103 amount=-1\nkerning first=121 second=113 amount=-1\nkerning first=121 second=231 amount=-1\nkerning first=121 second=232 amount=-1\nkerning first=121 second=233 amount=-1\nkerning first=121 second=234 amount=-1\nkerning first=121 second=235 amount=-1\nkerning first=121 second=97  amount=-1\nkerning first=121 second=224 amount=-1\nkerning first=121 second=225 amount=-1\nkerning first=121 second=226 amount=-1\nkerning first=121 second=227 amount=-1\nkerning first=121 second=228 amount=-1\nkerning first=121 second=229 amount=-1\nkerning first=122 second=111 amount=-1\nkerning first=122 second=242 amount=-1\nkerning first=122 second=243 amount=-1\nkerning first=122 second=244 amount=-1\nkerning first=122 second=245 amount=-1\nkerning first=122 second=246 amount=-1\nkerning first=122 second=99  amount=-1\nkerning first=122 second=100 amount=-1\nkerning first=122 second=101 amount=-1\nkerning first=122 second=103 amount=-1\nkerning first=122 second=113 amount=-1\nkerning first=122 second=231 amount=-1\nkerning first=122 second=232 amount=-1\nkerning first=122 second=233 amount=-1\nkerning first=122 second=234 amount=-1\nkerning first=122 second=235 amount=-1\nkerning first=254 second=118 amount=-1\nkerning first=254 second=121 amount=-1\nkerning first=254 second=253 amount=-1\nkerning first=254 second=255 amount=-1\nkerning first=254 second=34  amount=-2\nkerning first=254 second=39  amount=-2\nkerning first=254 second=122 amount=-1\nkerning first=254 second=120 amount=-1\nkerning first=208 second=84  amount=-2\nkerning first=208 second=86  amount=-2\nkerning first=208 second=89  amount=-3\nkerning first=208 second=221 amount=-3\nkerning first=208 second=65  amount=-2\nkerning first=208 second=192 amount=-2\nkerning first=208 second=193 amount=-2\nkerning first=208 second=194 amount=-2\nkerning first=208 second=195 amount=-2\nkerning first=208 second=196 amount=-2\nkerning first=208 second=197 amount=-2\nkerning first=208 second=88  amount=-2\nkerning first=208 second=44  amount=-8\nkerning first=208 second=46  amount=-8\nkerning first=208 second=90  amount=-2\nkerning first=192 second=118 amount=-4\nkerning first=192 second=121 amount=-4\nkerning first=192 second=253 amount=-4\nkerning first=192 second=255 amount=-4\nkerning first=192 second=67  amount=-1\nkerning first=192 second=71  amount=-1\nkerning first=192 second=79  amount=-1\nkerning first=192 second=81  amount=-1\nkerning first=192 second=216 amount=-1\nkerning first=192 second=199 amount=-1\nkerning first=192 second=210 amount=-1\nkerning first=192 second=211 amount=-1\nkerning first=192 second=212 amount=-1\nkerning first=192 second=213 amount=-1\nkerning first=192 second=214 amount=-1\nkerning first=192 second=85  amount=-1\nkerning first=192 second=217 amount=-1\nkerning first=192 second=218 amount=-1\nkerning first=192 second=219 amount=-1\nkerning first=192 second=220 amount=-1\nkerning first=192 second=34  amount=-9\nkerning first=192 second=39  amount=-9\nkerning first=192 second=111 amount=-1\nkerning first=192 second=242 amount=-1\nkerning first=192 second=243 amount=-1\nkerning first=192 second=244 amount=-1\nkerning first=192 second=245 amount=-1\nkerning first=192 second=246 amount=-1\nkerning first=192 second=87  amount=-5\nkerning first=192 second=84  amount=-10\nkerning first=192 second=117 amount=-1\nkerning first=192 second=249 amount=-1\nkerning first=192 second=250 amount=-1\nkerning first=192 second=251 amount=-1\nkerning first=192 second=252 amount=-1\nkerning first=192 second=122 amount=1\nkerning first=192 second=86  amount=-7\nkerning first=192 second=89  amount=-7\nkerning first=192 second=221 amount=-7\nkerning first=193 second=118 amount=-4\nkerning first=193 second=121 amount=-4\nkerning first=193 second=253 amount=-4\nkerning first=193 second=255 amount=-4\nkerning first=193 second=67  amount=-1\nkerning first=193 second=71  amount=-1\nkerning first=193 second=79  amount=-1\nkerning first=193 second=81  amount=-1\nkerning first=193 second=216 amount=-1\nkerning first=193 second=199 amount=-1\nkerning first=193 second=210 amount=-1\nkerning first=193 second=211 amount=-1\nkerning first=193 second=212 amount=-1\nkerning first=193 second=213 amount=-1\nkerning first=193 second=214 amount=-1\nkerning first=193 second=85  amount=-1\nkerning first=193 second=217 amount=-1\nkerning first=193 second=218 amount=-1\nkerning first=193 second=219 amount=-1\nkerning first=193 second=220 amount=-1\nkerning first=193 second=34  amount=-9\nkerning first=193 second=39  amount=-9\nkerning first=193 second=111 amount=-1\nkerning first=193 second=242 amount=-1\nkerning first=193 second=243 amount=-1\nkerning first=193 second=244 amount=-1\nkerning first=193 second=245 amount=-1\nkerning first=193 second=246 amount=-1\nkerning first=193 second=87  amount=-5\nkerning first=193 second=84  amount=-10\nkerning first=193 second=117 amount=-1\nkerning first=193 second=249 amount=-1\nkerning first=193 second=250 amount=-1\nkerning first=193 second=251 amount=-1\nkerning first=193 second=252 amount=-1\nkerning first=193 second=122 amount=1\nkerning first=193 second=86  amount=-7\nkerning first=193 second=89  amount=-7\nkerning first=193 second=221 amount=-7\nkerning first=194 second=118 amount=-4\nkerning first=194 second=121 amount=-4\nkerning first=194 second=253 amount=-4\nkerning first=194 second=255 amount=-4\nkerning first=194 second=67  amount=-1\nkerning first=194 second=71  amount=-1\nkerning first=194 second=79  amount=-1\nkerning first=194 second=81  amount=-1\nkerning first=194 second=216 amount=-1\nkerning first=194 second=199 amount=-1\nkerning first=194 second=210 amount=-1\nkerning first=194 second=211 amount=-1\nkerning first=194 second=212 amount=-1\nkerning first=194 second=213 amount=-1\nkerning first=194 second=214 amount=-1\nkerning first=194 second=85  amount=-1\nkerning first=194 second=217 amount=-1\nkerning first=194 second=218 amount=-1\nkerning first=194 second=219 amount=-1\nkerning first=194 second=220 amount=-1\nkerning first=194 second=34  amount=-9\nkerning first=194 second=39  amount=-9\nkerning first=194 second=111 amount=-1\nkerning first=194 second=242 amount=-1\nkerning first=194 second=243 amount=-1\nkerning first=194 second=244 amount=-1\nkerning first=194 second=245 amount=-1\nkerning first=194 second=246 amount=-1\nkerning first=194 second=87  amount=-5\nkerning first=194 second=84  amount=-10\nkerning first=194 second=117 amount=-1\nkerning first=194 second=249 amount=-1\nkerning first=194 second=250 amount=-1\nkerning first=194 second=251 amount=-1\nkerning first=194 second=252 amount=-1\nkerning first=194 second=122 amount=1\nkerning first=194 second=86  amount=-7\nkerning first=194 second=89  amount=-7\nkerning first=194 second=221 amount=-7\nkerning first=195 second=118 amount=-4\nkerning first=195 second=121 amount=-4\nkerning first=195 second=253 amount=-4\nkerning first=195 second=255 amount=-4\nkerning first=195 second=67  amount=-1\nkerning first=195 second=71  amount=-1\nkerning first=195 second=79  amount=-1\nkerning first=195 second=81  amount=-1\nkerning first=195 second=216 amount=-1\nkerning first=195 second=199 amount=-1\nkerning first=195 second=210 amount=-1\nkerning first=195 second=211 amount=-1\nkerning first=195 second=212 amount=-1\nkerning first=195 second=213 amount=-1\nkerning first=195 second=214 amount=-1\nkerning first=195 second=85  amount=-1\nkerning first=195 second=217 amount=-1\nkerning first=195 second=218 amount=-1\nkerning first=195 second=219 amount=-1\nkerning first=195 second=220 amount=-1\nkerning first=195 second=34  amount=-9\nkerning first=195 second=39  amount=-9\nkerning first=195 second=111 amount=-1\nkerning first=195 second=242 amount=-1\nkerning first=195 second=243 amount=-1\nkerning first=195 second=244 amount=-1\nkerning first=195 second=245 amount=-1\nkerning first=195 second=246 amount=-1\nkerning first=195 second=87  amount=-5\nkerning first=195 second=84  amount=-10\nkerning first=195 second=117 amount=-1\nkerning first=195 second=249 amount=-1\nkerning first=195 second=250 amount=-1\nkerning first=195 second=251 amount=-1\nkerning first=195 second=252 amount=-1\nkerning first=195 second=122 amount=1\nkerning first=195 second=86  amount=-7\nkerning first=195 second=89  amount=-7\nkerning first=195 second=221 amount=-7\nkerning first=196 second=118 amount=-4\nkerning first=196 second=121 amount=-4\nkerning first=196 second=253 amount=-4\nkerning first=196 second=255 amount=-4\nkerning first=196 second=67  amount=-1\nkerning first=196 second=71  amount=-1\nkerning first=196 second=79  amount=-1\nkerning first=196 second=81  amount=-1\nkerning first=196 second=216 amount=-1\nkerning first=196 second=199 amount=-1\nkerning first=196 second=210 amount=-1\nkerning first=196 second=211 amount=-1\nkerning first=196 second=212 amount=-1\nkerning first=196 second=213 amount=-1\nkerning first=196 second=214 amount=-1\nkerning first=196 second=85  amount=-1\nkerning first=196 second=217 amount=-1\nkerning first=196 second=218 amount=-1\nkerning first=196 second=219 amount=-1\nkerning first=196 second=220 amount=-1\nkerning first=196 second=34  amount=-9\nkerning first=196 second=39  amount=-9\nkerning first=196 second=111 amount=-1\nkerning first=196 second=242 amount=-1\nkerning first=196 second=243 amount=-1\nkerning first=196 second=244 amount=-1\nkerning first=196 second=245 amount=-1\nkerning first=196 second=246 amount=-1\nkerning first=196 second=87  amount=-5\nkerning first=196 second=84  amount=-10\nkerning first=196 second=117 amount=-1\nkerning first=196 second=249 amount=-1\nkerning first=196 second=250 amount=-1\nkerning first=196 second=251 amount=-1\nkerning first=196 second=252 amount=-1\nkerning first=196 second=122 amount=1\nkerning first=196 second=86  amount=-7\nkerning first=196 second=89  amount=-7\nkerning first=196 second=221 amount=-7\nkerning first=197 second=118 amount=-4\nkerning first=197 second=121 amount=-4\nkerning first=197 second=253 amount=-4\nkerning first=197 second=255 amount=-4\nkerning first=197 second=67  amount=-1\nkerning first=197 second=71  amount=-1\nkerning first=197 second=79  amount=-1\nkerning first=197 second=81  amount=-1\nkerning first=197 second=216 amount=-1\nkerning first=197 second=199 amount=-1\nkerning first=197 second=210 amount=-1\nkerning first=197 second=211 amount=-1\nkerning first=197 second=212 amount=-1\nkerning first=197 second=213 amount=-1\nkerning first=197 second=214 amount=-1\nkerning first=197 second=85  amount=-1\nkerning first=197 second=217 amount=-1\nkerning first=197 second=218 amount=-1\nkerning first=197 second=219 amount=-1\nkerning first=197 second=220 amount=-1\nkerning first=197 second=34  amount=-9\nkerning first=197 second=39  amount=-9\nkerning first=197 second=111 amount=-1\nkerning first=197 second=242 amount=-1\nkerning first=197 second=243 amount=-1\nkerning first=197 second=244 amount=-1\nkerning first=197 second=245 amount=-1\nkerning first=197 second=246 amount=-1\nkerning first=197 second=87  amount=-5\nkerning first=197 second=84  amount=-10\nkerning first=197 second=117 amount=-1\nkerning first=197 second=249 amount=-1\nkerning first=197 second=250 amount=-1\nkerning first=197 second=251 amount=-1\nkerning first=197 second=252 amount=-1\nkerning first=197 second=122 amount=1\nkerning first=197 second=86  amount=-7\nkerning first=197 second=89  amount=-7\nkerning first=197 second=221 amount=-7\nkerning first=199 second=84  amount=-2\nkerning first=200 second=118 amount=-2\nkerning first=200 second=121 amount=-2\nkerning first=200 second=253 amount=-2\nkerning first=200 second=255 amount=-2\nkerning first=200 second=111 amount=-1\nkerning first=200 second=242 amount=-1\nkerning first=200 second=243 amount=-1\nkerning first=200 second=244 amount=-1\nkerning first=200 second=245 amount=-1\nkerning first=200 second=246 amount=-1\nkerning first=200 second=84  amount=2\nkerning first=200 second=117 amount=-1\nkerning first=200 second=249 amount=-1\nkerning first=200 second=250 amount=-1\nkerning first=200 second=251 amount=-1\nkerning first=200 second=252 amount=-1\nkerning first=200 second=99  amount=-1\nkerning first=200 second=100 amount=-1\nkerning first=200 second=101 amount=-1\nkerning first=200 second=103 amount=-1\nkerning first=200 second=113 amount=-1\nkerning first=200 second=231 amount=-1\nkerning first=200 second=232 amount=-1\nkerning first=200 second=233 amount=-1\nkerning first=200 second=234 amount=-1\nkerning first=200 second=235 amount=-1\nkerning first=201 second=118 amount=-2\nkerning first=201 second=121 amount=-2\nkerning first=201 second=253 amount=-2\nkerning first=201 second=255 amount=-2\nkerning first=201 second=111 amount=-1\nkerning first=201 second=242 amount=-1\nkerning first=201 second=243 amount=-1\nkerning first=201 second=244 amount=-1\nkerning first=201 second=245 amount=-1\nkerning first=201 second=246 amount=-1\nkerning first=201 second=84  amount=2\nkerning first=201 second=117 amount=-1\nkerning first=201 second=249 amount=-1\nkerning first=201 second=250 amount=-1\nkerning first=201 second=251 amount=-1\nkerning first=201 second=252 amount=-1\nkerning first=201 second=99  amount=-1\nkerning first=201 second=100 amount=-1\nkerning first=201 second=101 amount=-1\nkerning first=201 second=103 amount=-1\nkerning first=201 second=113 amount=-1\nkerning first=201 second=231 amount=-1\nkerning first=201 second=232 amount=-1\nkerning first=201 second=233 amount=-1\nkerning first=201 second=234 amount=-1\nkerning first=201 second=235 amount=-1\nkerning first=202 second=118 amount=-2\nkerning first=202 second=121 amount=-2\nkerning first=202 second=253 amount=-2\nkerning first=202 second=255 amount=-2\nkerning first=202 second=111 amount=-1\nkerning first=202 second=242 amount=-1\nkerning first=202 second=243 amount=-1\nkerning first=202 second=244 amount=-1\nkerning first=202 second=245 amount=-1\nkerning first=202 second=246 amount=-1\nkerning first=202 second=84  amount=2\nkerning first=202 second=117 amount=-1\nkerning first=202 second=249 amount=-1\nkerning first=202 second=250 amount=-1\nkerning first=202 second=251 amount=-1\nkerning first=202 second=252 amount=-1\nkerning first=202 second=99  amount=-1\nkerning first=202 second=100 amount=-1\nkerning first=202 second=101 amount=-1\nkerning first=202 second=103 amount=-1\nkerning first=202 second=113 amount=-1\nkerning first=202 second=231 amount=-1\nkerning first=202 second=232 amount=-1\nkerning first=202 second=233 amount=-1\nkerning first=202 second=234 amount=-1\nkerning first=202 second=235 amount=-1\nkerning first=203 second=118 amount=-2\nkerning first=203 second=121 amount=-2\nkerning first=203 second=253 amount=-2\nkerning first=203 second=255 amount=-2\nkerning first=203 second=111 amount=-1\nkerning first=203 second=242 amount=-1\nkerning first=203 second=243 amount=-1\nkerning first=203 second=244 amount=-1\nkerning first=203 second=245 amount=-1\nkerning first=203 second=246 amount=-1\nkerning first=203 second=84  amount=2\nkerning first=203 second=117 amount=-1\nkerning first=203 second=249 amount=-1\nkerning first=203 second=250 amount=-1\nkerning first=203 second=251 amount=-1\nkerning first=203 second=252 amount=-1\nkerning first=203 second=99  amount=-1\nkerning first=203 second=100 amount=-1\nkerning first=203 second=101 amount=-1\nkerning first=203 second=103 amount=-1\nkerning first=203 second=113 amount=-1\nkerning first=203 second=231 amount=-1\nkerning first=203 second=232 amount=-1\nkerning first=203 second=233 amount=-1\nkerning first=203 second=234 amount=-1\nkerning first=203 second=235 amount=-1\nkerning first=204 second=84  amount=-2\nkerning first=204 second=89  amount=-2\nkerning first=204 second=221 amount=-2\nkerning first=204 second=65  amount=1\nkerning first=204 second=192 amount=1\nkerning first=204 second=193 amount=1\nkerning first=204 second=194 amount=1\nkerning first=204 second=195 amount=1\nkerning first=204 second=196 amount=1\nkerning first=204 second=197 amount=1\nkerning first=204 second=88  amount=1\nkerning first=205 second=84  amount=-2\nkerning first=205 second=89  amount=-2\nkerning first=205 second=221 amount=-2\nkerning first=205 second=65  amount=1\nkerning first=205 second=192 amount=1\nkerning first=205 second=193 amount=1\nkerning first=205 second=194 amount=1\nkerning first=205 second=195 amount=1\nkerning first=205 second=196 amount=1\nkerning first=205 second=197 amount=1\nkerning first=205 second=88  amount=1\nkerning first=206 second=84  amount=-2\nkerning first=206 second=89  amount=-2\nkerning first=206 second=221 amount=-2\nkerning first=206 second=65  amount=1\nkerning first=206 second=192 amount=1\nkerning first=206 second=193 amount=1\nkerning first=206 second=194 amount=1\nkerning first=206 second=195 amount=1\nkerning first=206 second=196 amount=1\nkerning first=206 second=197 amount=1\nkerning first=206 second=88  amount=1\nkerning first=207 second=84  amount=-2\nkerning first=207 second=89  amount=-2\nkerning first=207 second=221 amount=-2\nkerning first=207 second=65  amount=1\nkerning first=207 second=192 amount=1\nkerning first=207 second=193 amount=1\nkerning first=207 second=194 amount=1\nkerning first=207 second=195 amount=1\nkerning first=207 second=196 amount=1\nkerning first=207 second=197 amount=1\nkerning first=207 second=88  amount=1\nkerning first=209 second=84  amount=-2\nkerning first=209 second=89  amount=-2\nkerning first=209 second=221 amount=-2\nkerning first=209 second=65  amount=1\nkerning first=209 second=192 amount=1\nkerning first=209 second=193 amount=1\nkerning first=209 second=194 amount=1\nkerning first=209 second=195 amount=1\nkerning first=209 second=196 amount=1\nkerning first=209 second=197 amount=1\nkerning first=209 second=88  amount=1\nkerning first=210 second=84  amount=-2\nkerning first=210 second=86  amount=-2\nkerning first=210 second=89  amount=-3\nkerning first=210 second=221 amount=-3\nkerning first=210 second=65  amount=-2\nkerning first=210 second=192 amount=-2\nkerning first=210 second=193 amount=-2\nkerning first=210 second=194 amount=-2\nkerning first=210 second=195 amount=-2\nkerning first=210 second=196 amount=-2\nkerning first=210 second=197 amount=-2\nkerning first=210 second=88  amount=-2\nkerning first=210 second=44  amount=-8\nkerning first=210 second=46  amount=-8\nkerning first=210 second=90  amount=-2\nkerning first=211 second=84  amount=-2\nkerning first=211 second=86  amount=-2\nkerning first=211 second=89  amount=-3\nkerning first=211 second=221 amount=-3\nkerning first=211 second=65  amount=-2\nkerning first=211 second=192 amount=-2\nkerning first=211 second=193 amount=-2\nkerning first=211 second=194 amount=-2\nkerning first=211 second=195 amount=-2\nkerning first=211 second=196 amount=-2\nkerning first=211 second=197 amount=-2\nkerning first=211 second=88  amount=-2\nkerning first=211 second=44  amount=-8\nkerning first=211 second=46  amount=-8\nkerning first=211 second=90  amount=-2\nkerning first=212 second=84  amount=-2\nkerning first=212 second=86  amount=-2\nkerning first=212 second=89  amount=-3\nkerning first=212 second=221 amount=-3\nkerning first=212 second=65  amount=-2\nkerning first=212 second=192 amount=-2\nkerning first=212 second=193 amount=-2\nkerning first=212 second=194 amount=-2\nkerning first=212 second=195 amount=-2\nkerning first=212 second=196 amount=-2\nkerning first=212 second=197 amount=-2\nkerning first=212 second=88  amount=-2\nkerning first=212 second=44  amount=-8\nkerning first=212 second=46  amount=-8\nkerning first=212 second=90  amount=-2\nkerning first=213 second=84  amount=-2\nkerning first=213 second=86  amount=-2\nkerning first=213 second=89  amount=-3\nkerning first=213 second=221 amount=-3\nkerning first=213 second=65  amount=-2\nkerning first=213 second=192 amount=-2\nkerning first=213 second=193 amount=-2\nkerning first=213 second=194 amount=-2\nkerning first=213 second=195 amount=-2\nkerning first=213 second=196 amount=-2\nkerning first=213 second=197 amount=-2\nkerning first=213 second=88  amount=-2\nkerning first=213 second=44  amount=-8\nkerning first=213 second=46  amount=-8\nkerning first=213 second=90  amount=-2\nkerning first=214 second=84  amount=-2\nkerning first=214 second=86  amount=-2\nkerning first=214 second=89  amount=-3\nkerning first=214 second=221 amount=-3\nkerning first=214 second=65  amount=-2\nkerning first=214 second=192 amount=-2\nkerning first=214 second=193 amount=-2\nkerning first=214 second=194 amount=-2\nkerning first=214 second=195 amount=-2\nkerning first=214 second=196 amount=-2\nkerning first=214 second=197 amount=-2\nkerning first=214 second=88  amount=-2\nkerning first=214 second=44  amount=-8\nkerning first=214 second=46  amount=-8\nkerning first=214 second=90  amount=-2\nkerning first=217 second=65  amount=-2\nkerning first=217 second=192 amount=-2\nkerning first=217 second=193 amount=-2\nkerning first=217 second=194 amount=-2\nkerning first=217 second=195 amount=-2\nkerning first=217 second=196 amount=-2\nkerning first=217 second=197 amount=-2\nkerning first=218 second=65  amount=-2\nkerning first=218 second=192 amount=-2\nkerning first=218 second=193 amount=-2\nkerning first=218 second=194 amount=-2\nkerning first=218 second=195 amount=-2\nkerning first=218 second=196 amount=-2\nkerning first=218 second=197 amount=-2\nkerning first=219 second=65  amount=-2\nkerning first=219 second=192 amount=-2\nkerning first=219 second=193 amount=-2\nkerning first=219 second=194 amount=-2\nkerning first=219 second=195 amount=-2\nkerning first=219 second=196 amount=-2\nkerning first=219 second=197 amount=-2\nkerning first=220 second=65  amount=-2\nkerning first=220 second=192 amount=-2\nkerning first=220 second=193 amount=-2\nkerning first=220 second=194 amount=-2\nkerning first=220 second=195 amount=-2\nkerning first=220 second=196 amount=-2\nkerning first=220 second=197 amount=-2\nkerning first=221 second=118 amount=-2\nkerning first=221 second=121 amount=-2\nkerning first=221 second=253 amount=-2\nkerning first=221 second=255 amount=-2\nkerning first=221 second=67  amount=-2\nkerning first=221 second=71  amount=-2\nkerning first=221 second=79  amount=-2\nkerning first=221 second=81  amount=-2\nkerning first=221 second=216 amount=-2\nkerning first=221 second=199 amount=-2\nkerning first=221 second=210 amount=-2\nkerning first=221 second=211 amount=-2\nkerning first=221 second=212 amount=-2\nkerning first=221 second=213 amount=-2\nkerning first=221 second=214 amount=-2\nkerning first=221 second=85  amount=-7\nkerning first=221 second=217 amount=-7\nkerning first=221 second=218 amount=-7\nkerning first=221 second=219 amount=-7\nkerning first=221 second=220 amount=-7\nkerning first=221 second=111 amount=-5\nkerning first=221 second=242 amount=-5\nkerning first=221 second=243 amount=-5\nkerning first=221 second=244 amount=-5\nkerning first=221 second=245 amount=-5\nkerning first=221 second=246 amount=-5\nkerning first=221 second=87  amount=1\nkerning first=221 second=84  amount=1\nkerning first=221 second=117 amount=-3\nkerning first=221 second=249 amount=-3\nkerning first=221 second=250 amount=-3\nkerning first=221 second=251 amount=-3\nkerning first=221 second=252 amount=-3\nkerning first=221 second=122 amount=-2\nkerning first=221 second=86  amount=1\nkerning first=221 second=89  amount=1\nkerning first=221 second=221 amount=1\nkerning first=221 second=65  amount=-7\nkerning first=221 second=192 amount=-7\nkerning first=221 second=193 amount=-7\nkerning first=221 second=194 amount=-7\nkerning first=221 second=195 amount=-7\nkerning first=221 second=196 amount=-7\nkerning first=221 second=197 amount=-7\nkerning first=221 second=88  amount=1\nkerning first=221 second=44  amount=-16\nkerning first=221 second=46  amount=-16\nkerning first=221 second=99  amount=-5\nkerning first=221 second=100 amount=-5\nkerning first=221 second=101 amount=-5\nkerning first=221 second=103 amount=-5\nkerning first=221 second=113 amount=-5\nkerning first=221 second=231 amount=-5\nkerning first=221 second=232 amount=-5\nkerning first=221 second=233 amount=-5\nkerning first=221 second=234 amount=-5\nkerning first=221 second=235 amount=-5\nkerning first=221 second=120 amount=-2\nkerning first=221 second=45  amount=-4\nkerning first=221 second=173 amount=-4\nkerning first=221 second=109 amount=-3\nkerning first=221 second=110 amount=-3\nkerning first=221 second=112 amount=-3\nkerning first=221 second=241 amount=-3\nkerning first=221 second=83  amount=-1\nkerning first=221 second=97  amount=-6\nkerning first=221 second=224 amount=-6\nkerning first=221 second=225 amount=-6\nkerning first=221 second=226 amount=-6\nkerning first=221 second=227 amount=-6\nkerning first=221 second=228 amount=-6\nkerning first=221 second=229 amount=-6\nkerning first=221 second=115 amount=-5\nkerning first=221 second=74  amount=-7\nkerning first=224 second=118 amount=-1\nkerning first=224 second=121 amount=-1\nkerning first=224 second=253 amount=-1\nkerning first=224 second=255 amount=-1\nkerning first=224 second=34  amount=-5\nkerning first=224 second=39  amount=-5\nkerning first=225 second=118 amount=-1\nkerning first=225 second=121 amount=-1\nkerning first=225 second=253 amount=-1\nkerning first=225 second=255 amount=-1\nkerning first=225 second=34  amount=-5\nkerning first=225 second=39  amount=-5\nkerning first=226 second=118 amount=-1\nkerning first=226 second=121 amount=-1\nkerning first=226 second=253 amount=-1\nkerning first=226 second=255 amount=-1\nkerning first=226 second=34  amount=-5\nkerning first=226 second=39  amount=-5\nkerning first=227 second=118 amount=-1\nkerning first=227 second=121 amount=-1\nkerning first=227 second=253 amount=-1\nkerning first=227 second=255 amount=-1\nkerning first=227 second=34  amount=-5\nkerning first=227 second=39  amount=-5\nkerning first=228 second=118 amount=-1\nkerning first=228 second=121 amount=-1\nkerning first=228 second=253 amount=-1\nkerning first=228 second=255 amount=-1\nkerning first=228 second=34  amount=-5\nkerning first=228 second=39  amount=-5\nkerning first=229 second=118 amount=-1\nkerning first=229 second=121 amount=-1\nkerning first=229 second=253 amount=-1\nkerning first=229 second=255 amount=-1\nkerning first=229 second=34  amount=-5\nkerning first=229 second=39  amount=-5\nkerning first=231 second=34  amount=-1\nkerning first=231 second=39  amount=-1\nkerning first=232 second=118 amount=-1\nkerning first=232 second=121 amount=-1\nkerning first=232 second=253 amount=-1\nkerning first=232 second=255 amount=-1\nkerning first=232 second=34  amount=-1\nkerning first=232 second=39  amount=-1\nkerning first=233 second=118 amount=-1\nkerning first=233 second=121 amount=-1\nkerning first=233 second=253 amount=-1\nkerning first=233 second=255 amount=-1\nkerning first=233 second=34  amount=-1\nkerning first=233 second=39  amount=-1\nkerning first=234 second=118 amount=-1\nkerning first=234 second=121 amount=-1\nkerning first=234 second=253 amount=-1\nkerning first=234 second=255 amount=-1\nkerning first=234 second=34  amount=-1\nkerning first=234 second=39  amount=-1\nkerning first=235 second=118 amount=-1\nkerning first=235 second=121 amount=-1\nkerning first=235 second=253 amount=-1\nkerning first=235 second=255 amount=-1\nkerning first=235 second=34  amount=-1\nkerning first=235 second=39  amount=-1\nkerning first=241 second=34  amount=-8\nkerning first=241 second=39  amount=-8\nkerning first=242 second=118 amount=-1\nkerning first=242 second=121 amount=-1\nkerning first=242 second=253 amount=-1\nkerning first=242 second=255 amount=-1\nkerning first=242 second=34  amount=-11\nkerning first=242 second=39  amount=-11\nkerning first=242 second=122 amount=-1\nkerning first=242 second=120 amount=-2\nkerning first=243 second=118 amount=-1\nkerning first=243 second=121 amount=-1\nkerning first=243 second=253 amount=-1\nkerning first=243 second=255 amount=-1\nkerning first=243 second=34  amount=-11\nkerning first=243 second=39  amount=-11\nkerning first=243 second=122 amount=-1\nkerning first=243 second=120 amount=-2\nkerning first=244 second=118 amount=-1\nkerning first=244 second=121 amount=-1\nkerning first=244 second=253 amount=-1\nkerning first=244 second=255 amount=-1\nkerning first=244 second=34  amount=-11\nkerning first=244 second=39  amount=-11\nkerning first=244 second=122 amount=-1\nkerning first=244 second=120 amount=-2\nkerning first=245 second=118 amount=-1\nkerning first=245 second=121 amount=-1\nkerning first=245 second=253 amount=-1\nkerning first=245 second=255 amount=-1\nkerning first=245 second=34  amount=-11\nkerning first=245 second=39  amount=-11\nkerning first=245 second=122 amount=-1\nkerning first=245 second=120 amount=-2\nkerning first=246 second=118 amount=-1\nkerning first=246 second=121 amount=-1\nkerning first=246 second=253 amount=-1\nkerning first=246 second=255 amount=-1\nkerning first=246 second=34  amount=-11\nkerning first=246 second=39  amount=-11\nkerning first=246 second=122 amount=-1\nkerning first=246 second=120 amount=-2\nkerning first=253 second=34  amount=1\nkerning first=253 second=39  amount=1\nkerning first=253 second=111 amount=-1\nkerning first=253 second=242 amount=-1\nkerning first=253 second=243 amount=-1\nkerning first=253 second=244 amount=-1\nkerning first=253 second=245 amount=-1\nkerning first=253 second=246 amount=-1\nkerning first=253 second=44  amount=-8\nkerning first=253 second=46  amount=-8\nkerning first=253 second=99  amount=-1\nkerning first=253 second=100 amount=-1\nkerning first=253 second=101 amount=-1\nkerning first=253 second=103 amount=-1\nkerning first=253 second=113 amount=-1\nkerning first=253 second=231 amount=-1\nkerning first=253 second=232 amount=-1\nkerning first=253 second=233 amount=-1\nkerning first=253 second=234 amount=-1\nkerning first=253 second=235 amount=-1\nkerning first=253 second=97  amount=-1\nkerning first=253 second=224 amount=-1\nkerning first=253 second=225 amount=-1\nkerning first=253 second=226 amount=-1\nkerning first=253 second=227 amount=-1\nkerning first=253 second=228 amount=-1\nkerning first=253 second=229 amount=-1\nkerning first=255 second=34  amount=1\nkerning first=255 second=39  amount=1\nkerning first=255 second=111 amount=-1\nkerning first=255 second=242 amount=-1\nkerning first=255 second=243 amount=-1\nkerning first=255 second=244 amount=-1\nkerning first=255 second=245 amount=-1\nkerning first=255 second=246 amount=-1\nkerning first=255 second=44  amount=-8\nkerning first=255 second=46  amount=-8\nkerning first=255 second=99  amount=-1\nkerning first=255 second=100 amount=-1\nkerning first=255 second=101 amount=-1\nkerning first=255 second=103 amount=-1\nkerning first=255 second=113 amount=-1\nkerning first=255 second=231 amount=-1\nkerning first=255 second=232 amount=-1\nkerning first=255 second=233 amount=-1\nkerning first=255 second=234 amount=-1\nkerning first=255 second=235 amount=-1\nkerning first=255 second=97  amount=-1\nkerning first=255 second=224 amount=-1\nkerning first=255 second=225 amount=-1\nkerning first=255 second=226 amount=-1\nkerning first=255 second=227 amount=-1\nkerning first=255 second=228 amount=-1\nkerning first=255 second=229 amount=-1\n";
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      group = _ref.group,
      panel = _ref.panel;

  var interaction = (0, _interaction2.default)(panel);

  interaction.events.on('onPressed', handleOnPress);
  interaction.events.on('tick', handleTick);
  interaction.events.on('onReleased', handleOnRelease);

  var tempMatrix = new THREE.Matrix4();
  var tPosition = new THREE.Vector3();

  var oldParent = void 0;

  function getTopLevelFolder(group) {
    var folder = group.folder;
    while (folder.folder !== folder) {
      folder = folder.folder;
    }return folder;
  }

  function handleTick() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        input = _ref2.input;

    var folder = getTopLevelFolder(group);
    if (folder === undefined) {
      return;
    }

    if (input.mouse) {
      if (input.pressed && input.selected && input.raycast.ray.intersectPlane(input.mousePlane, input.mouseIntersection)) {
        if (input.interaction.press === interaction) {
          folder.position.copy(input.mouseIntersection.sub(input.mouseOffset));
          return;
        }
      } else if (input.intersections.length > 0) {
        var hitObject = input.intersections[0].object;
        if (hitObject === panel) {
          hitObject.updateMatrixWorld();
          tPosition.setFromMatrixPosition(hitObject.matrixWorld);

          input.mousePlane.setFromNormalAndCoplanarPoint(input.mouseCamera.getWorldDirection(input.mousePlane.normal), tPosition);
          // console.log( input.mousePlane );
        }
      }
    }
  }

  function handleOnPress(p) {
    var inputObject = p.inputObject,
        input = p.input;


    var folder = getTopLevelFolder(group);
    if (folder === undefined) {
      return;
    }

    if (folder.beingMoved === true) {
      return;
    }

    if (input.mouse) {
      if (input.intersections.length > 0) {
        if (input.raycast.ray.intersectPlane(input.mousePlane, input.mouseIntersection)) {
          var hitObject = input.intersections[0].object;
          if (hitObject !== panel) {
            return;
          }

          input.selected = folder;

          input.selected.updateMatrixWorld();
          tPosition.setFromMatrixPosition(input.selected.matrixWorld);

          input.mouseOffset.copy(input.mouseIntersection).sub(tPosition);
          // console.log( input.mouseOffset );
        }
      }
    } else {
      tempMatrix.getInverse(inputObject.matrixWorld);

      folder.matrix.premultiply(tempMatrix);
      folder.matrix.decompose(folder.position, folder.quaternion, folder.scale);

      oldParent = folder.parent;
      inputObject.add(folder);
    }

    p.locked = true;

    folder.beingMoved = true;

    input.events.emit('grabbed', input);
  }

  function handleOnRelease(p) {
    var inputObject = p.inputObject,
        input = p.input;


    var folder = getTopLevelFolder(group);
    if (folder === undefined) {
      return;
    }

    if (folder.beingMoved === false) {
      return;
    }

    if (input.mouse) {
      input.selected = undefined;
    } else {

      if (oldParent === undefined) {
        return;
      }

      folder.matrix.premultiply(inputObject.matrixWorld);
      folder.matrix.decompose(folder.position, folder.quaternion, folder.scale);
      oldParent.add(folder);
      oldParent = undefined;
    }

    folder.beingMoved = false;

    input.events.emit('grabReleased', input);
  }

  return interaction;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"./interaction":11}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var grabBar = exports.grabBar = function () {
  var image = new Image();
  image.src = 'data:image/png;base64,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/GMzLdsAADskaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzMiA3OS4xNTkyODQsIDIwMTYvMDQvMTktMTM6MTM6NDAgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDE2LTA5LTI4VDE2OjI1OjMyLTA3OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTYtMDktMjhUMTY6Mzc6MjMtMDc6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE2LTA5LTI4VDE2OjM3OjIzLTA3OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOklDQ1Byb2ZpbGU+c1JHQiBJRUM2MTk2Ni0yLjE8L3Bob3Rvc2hvcDpJQ0NQcm9maWxlPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOmFhYTFjMTQzLTUwZmUtOTQ0My1hNThmLWEyM2VkNTM3MDdmMDwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjdlNzdmYmZjLTg1ZDQtMTFlNi1hYzhmLWFjNzU0ZWQ1ODM3ZjwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOmM1ZmM0ZGYyLTkxY2MtZTI0MS04Y2VjLTMzODIyY2Q1ZWFlOTwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNyZWF0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDpjNWZjNGRmMi05MWNjLWUyNDEtOGNlYy0zMzgyMmNkNWVhZTk8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTYtMDktMjhUMTY6MjU6MzItMDc6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1LjUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y29udmVydGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmFhYTFjMTQzLTUwZmUtOTQ0My1hNThmLWEyM2VkNTM3MDdmMDwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0wOS0yOFQxNjozNzoyMy0wNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+MzAwMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+MzAwMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42NDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4zMjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+OhF7RwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAlElEQVR42uzZsQ3AIAxEUTuTZJRskt5LRFmCdTLapUKCBijo/F0hn2SkJxIKXJJlrsOSFwAAAABA6vKI6O7BUorXdZu1/VEWEZeZfbN5m/ZamjfK+AQAAAAAAAAAAAAAAAAAAAAAACBfuaSna7i/dd1mbX+USTrN7J7N27TX0rxRxgngZYifIAAAAJC4fgAAAP//AwAuMVPw20hxCwAAAABJRU5ErkJggg==';

  var texture = new THREE.Texture();
  texture.image = image;
  texture.needsUpdate = true;
  // texture.minFilter = THREE.LinearMipMapLinearFilter;
  // texture.magFilter = THREE.LinearFilter;
  // texture.generateMipmaps = false;

  var material = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    map: texture
  });
  material.alphaTest = 0.5;

  return function () {
    var geometry = new THREE.PlaneGeometry(image.width / 1000, image.height / 1000, 1, 1);

    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };
}();

var downArrow = exports.downArrow = function () {
  var image = new Image();
  image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAACXBIWXMAACxLAAAsSwGlPZapAAA4K2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzIgNzkuMTU5Mjg0LCAyMDE2LzA0LzE5LTEzOjEzOjQwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE2LTEwLTIwVDIxOjE4OjI1LTA3OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNi0xMC0yMFQyMToxODoyNS0wNzowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDozMDQyYjI0ZS1iMzc2LWI0NGItOGI4Yy1lZTFjY2IzYWU1MDU8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6MzA0MmIyNGUtYjM3Ni1iNDRiLThiOGMtZWUxY2NiM2FlNTA1PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6MzA0MmIyNGUtYjM3Ni1iNDRiLThiOGMtZWUxY2NiM2FlNTA1PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjMwNDJiMjRlLWIzNzYtYjQ0Yi04YjhjLWVlMWNjYjNhZTUwNTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTI4PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjY0PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz5Uilz0AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAJdSURBVHja7N3LccJAEIThRuW7ncUeTQhkQAiIDMgIhUIIcFQWJgJ88FKlovwArN2d6Z45cZGA/T9viYftxeVyQYzudLEEASAmAMQEgBjJeWl1xymlNwAHAMdxHHvFxU8pDQCWAFbjOH7I7ACT+O8ANnkhFONv8hoc8prwA7iJfx0pBJP412mGoDMQXwrBN/GbIuiMxJdA8Ev8Zgg6Q/GpEdwRvwmCzlh8SgQPxK+OoMYOMDwYnwrBE/GnCAbXAPKTX//jFJuUUu84fv9k/OusS/8QdAbl387eI4L8mPcznKroTlhyB1jOeC5XCGaMX2ItqwFYATipISgQ/5TX0heA/N62FIJS8Ut+TlD0IlAJgcf4VV4GKiDwGr/W+wDUCDzHrwaAFYH3+FUBsCFgiF8dAAsClvhNAHhHwBS/GQCvCNjiNwXgDQFj/OYAvCBgjW8CgHUEzPHNALCKgD2+KQDWECjENwfACgKV+CYBTBD0AM61ERSIfwbQW4xvFkBGcMw7QTUEheKv8nNBADCMQDG+eQC1EKjGB4CFl78RlFJa4usXTF7njJRvz35eD/FdASiIAKrx3QEohACq8V1cA1S6JpCM7xKAQQRu47sFYAiB6/iuARhA4D6+ewANEVDEpwDQAAFNfBoAFRFQxacCUAEBXXw6AAURUManBFAAAW18WgAzIqCOTw1gBgT08ekBTBDsnjh0xx5fAkBGMADYPnDINh+DAKCHQCa+FIA7EUjFlwPwBwK5+JIAfkAgGR9w+JWwOef6zWDV+PIAYuLfxgWAWIIAEBMAYgJAjOR8DgD+6Ozgv4uy9gAAAABJRU5ErkJggg==';

  var texture = new THREE.Texture();
  texture.image = image;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  // texture.anisotropic
  // texture.generateMipmaps = false;

  var material = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    map: texture
  });
  material.alphaTest = 0.2;

  return function () {
    var h = 0.3;
    var geo = new THREE.PlaneGeometry(image.width / 1000 * h, image.height / 1000 * h, 1, 1);
    geo.translate(-0.005, -0.004, 0);
    return new THREE.Mesh(geo, material);
  };
}();

var checkmark = exports.checkmark = function () {
  var image = new Image();
  image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAACXBIWXMAACxLAAAsSwGlPZapAAA4K2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzIgNzkuMTU5Mjg0LCAyMDE2LzA0LzE5LTEzOjEzOjQwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE2LTEwLTIwVDIxOjMzOjUzLTA3OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNi0xMC0yMFQyMTozMzo1My0wNzowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDo2ODcxYTk5Yy0zNjE5LTlkNGEtODdkNi0wYWE5YTRiNWU4Mjc8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6Njg3MWE5OWMtMzYxOS05ZDRhLTg3ZDYtMGFhOWE0YjVlODI3PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6Njg3MWE5OWMtMzYxOS05ZDRhLTg3ZDYtMGFhOWE0YjVlODI3PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjY4NzFhOTljLTM2MTktOWQ0YS04N2Q2LTBhYTlhNGI1ZTgyNzwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0xMC0xOFQxNzozMzowNi0wNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+Mjg4MDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTI4PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjY0PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz5z9RT3AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAATtSURBVHja7Jzbb5RFGMZ/2xbCvVhASExUiI144w0hQtHEGrHgISqgN6KgtNYWAb0w0Wo1XqrbPbSlokYSxfMhemX/Aa7wGAVq8XTp30DXi5mJm0a2u9v3/b6Z2XludrOHdw/PMzPP+74zX6FWqyGFgYEBElpGD/AecCtwB/Dbcm+Ym5sT+/Cu9P/nim6gCDwCXAt8DVyX5RdIAsgPBaAEjNQ9diPwFbA5CSB+TAFP/c/jW4HPgL4kgHgxCww1eP5m4GN7mwQQEbos+U808dqtwEf2NgkgErc/0yT5Dn12OdiSBBA++aUWyXfYAnwDXJ8EEG6qNwkMryDGZpsi3pAEEB6qV3D7raIP+NKmikkAgeAt4IhgvJvsTJAE4DkKwCngsELss0kA/q/5s8AhhdjTwEFpd5ogS35VaeTPAk8Di0kA/pJfEl7zHU7SuHKYlgAP1vyykNtfihkt8pMAZEkaVohbVYqbBCCIU8CTCnFLwJj2l08CWNma/7aS268Cx6QNXxKArHmeBh5XWk7GsiA/TwGMYfa/hUp+mfYaO824/eGsyM9LAC9gmiPvAzsDI7/Lrs1DSiN/KI8flCXGgVft/V7gDLArIAFMh+r2fRDAS8DEksc2Ah8C/R3s9svAaJ5TWlbkv3yF59Zjdr1s93ja13L7Fev2azELYLwB+Q5rMb3ubR4avpNKbn8aeAa4nLe6tQ3fRJOv7QW+8Ggm6LEjVKOxM4M5D3A57x+pKYAX6wxfs9gAfALs8IB8rcaOKxvXfFC5lgDGgVfafK8zhrty/E+0XHklL7efpQAmWpj2lxPBbTn8J7Po1fZH8QzSAnjNjn4JrMecjsmqWFQA3lVy+yXr9oldAHcKx7sa+DwDY9hj8/yDiqneYicI4FHgR+GYa5WzA83GzhRw1FfyNQTwC3CPvZXEOuBTzEUUJLEqg1TPW/K1TOCfwCBwUTjuNciWjbsxZViNVC+32r4vaeAfwF3AgnDcTVYEtwuNUA3yy5jdu3SyAAB+B3YrLAcbBOoE7yhN+5N2zScJwGAeeAD4TjhuL6aB1Kon6LbkP6Y08o/jSYXPFwEAnAceVhDBVS1mB66xo0H+FKaxs0hgyKodfAF4EPhJqU6w3EywyhqzQ0rkj4RIfpYCALgE7LEzgiRcxbC/wcivoFPedeQHi6y3hP1ljeG8Uoq4NDsoYIo8Wjt5giY/DwHUp4i/KmQHZ+pEUMDs5NFw+0UyOLQRqwDccnAv8L1w3HXAaZsivq5k+IrACSJBnqeD54EDwAfALYJxNwHfKpmysiV/MRYB5H0y6AKwH/hBOO5qYI2C4TsaE/k+CADM1bH3Il8xlETVGr4akcGXs4F/A3fbGcE3VAioth+qAMB0EXd7JoJJPNzGFasAwDSQBpHfVNKu2z9G5PDxePgC8BBwLueRfyLGNT8EAYDZTHIA+QZSs2v+8djcfmgCcHWC+5FvIC3n9kc7hXzfBeCM4R7ky8Yd5/ZDFQD810C6qPgZ0bv9kAVQnyJqFIvexGzmIAnAb1wC7hM2hkXgWToYoV0lzDWQJFLE6Bo7nSAAlyLuY2UNpAoZXootCUAeC5gG0s9tkj9KQtACANNAGqS1PYalRH48AnApYrPby4oEdmgjCaD5FHEvjbeXvYEp7yZEKADnCfZbEfwDPI85L+DIf44OaOy0g38HAM/e7guIRx94AAAAAElFTkSuQmCC';

  var texture = new THREE.Texture();
  texture.image = image;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  // texture.anisotropic
  // texture.generateMipmaps = false;

  var material = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    map: texture
  });
  material.alphaTest = 0.2;

  return function () {
    var h = 0.4;
    var geo = new THREE.PlaneGeometry(image.width / 1000 * h, image.height / 1000 * h, 1, 1);
    geo.translate(0.025, 0, 0);
    return new THREE.Mesh(geo, material);
  };
}();

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createImageButton;

var _SubdivisionModifier = require('../thirdparty/SubdivisionModifier');

var SubdivisionModifier = _interopRequireWildcard(_SubdivisionModifier);

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createImageButton() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$image = _ref.image,
      image = _ref$image === undefined ? "textures/spotlight.jpg" : _ref$image,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_WIDTH / 4 : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  function applyImageToMaterial(image, targetMaterial) {
    if (typeof image === "string") {
      //TODO cache.  Does TextureLoader already cache?
      //TODO Image only on front face of button.
      new THREE.TextureLoader().load(image, function (texture) {
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        targetMaterial.map = texture;
        targetMaterial.needsUpdate = true;
      });
    } else if (image.isTexture) {
      targetMaterial.map = image;
    } else if (image.isWebGLRenderTarget) {
      targetMaterial.map = image.texture;
    } else throw "not sure how to interpret image " + image;
    targetMaterial.needsUpdate = true;
  }

  var BUTTON_WIDTH = width * 0.25 - Layout.PANEL_MARGIN;
  var BUTTON_HEIGHT = height - Layout.PANEL_MARGIN;
  var BUTTON_DEPTH = Layout.BUTTON_DEPTH * 2;

  var group = new THREE.Group();
  group.spacing = height;

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  //  base checkbox
  var aspectRatio = BUTTON_WIDTH / BUTTON_HEIGHT;
  var rect = new THREE.PlaneGeometry(BUTTON_WIDTH, BUTTON_HEIGHT, 1, 1);
  var modifier = new THREE.SubdivisionModifier(1);
  //modifier.modify( rect );
  rect.translate(BUTTON_WIDTH * 0.5, 0, BUTTON_DEPTH);

  //  hitscan volume
  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = BUTTON_DEPTH;
  hitscanVolume.position.x = width * 0.5;

  var material = new THREE.MeshBasicMaterial();
  material.transparent = true;
  applyImageToMaterial(image, material);
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  hitscanVolume.add(filledVolume);

  //button label removed; might want options like a hover label in future.

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_BUTTON);
  controllerID.position.z = depth;

  panel.add(descriptorLabel, hitscanVolume, controllerID);

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handleOnPress);
  interaction.events.on('onReleased', handleOnRelease);

  updateView();

  function handleOnPress(p) {
    if (group.visible === false) {
      return;
    }

    object[propertyName]();

    hitscanVolume.position.z = BUTTON_DEPTH * 0.1;

    p.locked = true;
  }

  function handleOnRelease() {
    hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  }

  function updateView() {

    if (interaction.hovering()) {
      material.color.setHex(0xFFFFFF);
    } else {
      material.color.setHex(0xCCCCCC);
    }
  }

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.updateControl = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.updateLabel(str);
    return group;
  };

  return group;
} /** 
   * Big button with an image on (which might come from a file or existing texture,
   * the texture might be from a RenderTarget...).
   * 
   * I'd put this more separate from the datgui modules but need to think a little
   * bit about how to structure that etc.  Very un-DRY, but I'm starting by just
   * copying existing button.js in its entirety.
   * 
   * TODO: not just simple 'bang' function but callbacks for hover / etc.
   * 
   * 
   * Copyright  Data Arts Team, Google inc. 2016 / Peter Todd, 2017
   * 
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
   */

},{"../thirdparty/SubdivisionModifier":18,"./colors":3,"./grab":7,"./interaction":11,"./layout":12,"./sharedmaterials":15,"./textlabel":17}],10:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _slider = require('./slider');

var _slider2 = _interopRequireDefault(_slider);

var _checkbox = require('./checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _button = require('./button');

var _button2 = _interopRequireDefault(_button);

var _folder = require('./folder');

var _folder2 = _interopRequireDefault(_folder);

var _dropdown = require('./dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _imagebutton = require('./imagebutton');

var _imagebutton2 = _interopRequireDefault(_imagebutton);

var _sdftext = require('./sdftext');

var SDFText = _interopRequireWildcard(_sdftext);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                    * dat-guiVR Javascript Controller Library for VR
                                                                                                                                                                                                    * https://github.com/dataarts/dat.guiVR
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Copyright 2016 Data Arts Team, Google Inc.
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                    * you may not use this file except in compliance with the License.
                                                                                                                                                                                                    * You may obtain a copy of the License at
                                                                                                                                                                                                    *
                                                                                                                                                                                                    *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                    * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                    * See the License for the specific language governing permissions and
                                                                                                                                                                                                    * limitations under the License.
                                                                                                                                                                                                    */

//PJT: I'd rather inject custom extensions like this, but will work that out later.


var GUIVR = function DATGUIVR() {

  /*
    SDF font
  */
  var textCreator = SDFText.creator();

  /*
    Lists.
    InputObjects are things like VIVE controllers, cardboard headsets, etc.
    Controllers are the DAT GUI sliders, checkboxes, etc.
  */
  var inputObjects = [];
  var controllers = [];

  /*
    Functions for determining whether a given controller is visible (by which we
    mean not hidden, not 'visible' in terms of the camera orientation etc), and
    for retrieving the list of visible hitscanObjects dynamically.
    This might benefit from some caching especially in cases with large complex GUIs.
    I haven't measured the impact of garbage collection etc.
  */
  function isControllerVisible(control) {
    if (!control.visible) return false;
    var folder = control.folder;
    while (folder.folder !== folder) {
      folder = folder.folder;
      if (folder.isCollapsed() || !folder.visible) return false;
    }
    return true;
  }
  function getVisibleControllers() {
    // not terribly efficient
    return controllers.filter(isControllerVisible);
  }
  function getVisibleHitscanObjects() {
    var tmp = getVisibleControllers().map(function (o) {
      return o.hitscan;
    });
    return tmp.reduce(function (a, b) {
      return a.concat(b);
    }, []);
  }

  var mouseEnabled = false;
  var mouseRenderer = undefined;

  function enableMouse(camera, renderer) {
    mouseEnabled = true;
    mouseRenderer = renderer;
    mouseInput.mouseCamera = camera;
    return mouseInput.laser;
  }

  function disableMouse() {
    mouseEnabled = false;
  }

  /*
    The default laser pointer coming out of each InputObject.
  */
  var laserMaterial = new THREE.LineBasicMaterial({ color: 0x55aaff, transparent: true, blending: THREE.AdditiveBlending });
  function createLaser() {
    var g = new THREE.Geometry();
    g.vertices.push(new THREE.Vector3());
    g.vertices.push(new THREE.Vector3(0, 0, 0));
    return new THREE.Line(g, laserMaterial);
  }

  /*
    A "cursor", eg the ball that appears at the end of your laser.
  */
  var cursorMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, blending: THREE.AdditiveBlending });
  function createCursor() {
    return new THREE.Mesh(new THREE.SphereGeometry(0.006, 4, 4), cursorMaterial);
  }

  /*
    Creates a generic Input type.
    Takes any THREE.Object3D type object and uses its position
    and orientation as an input device.
      A laser pointer is included and will be updated.
    Contains state about which Interaction is currently being used or hover.
  */
  function createInput() {
    var inputObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new THREE.Group();

    var input = {
      raycast: new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3()),
      laser: createLaser(),
      cursor: createCursor(),
      object: inputObject,
      pressed: false,
      gripped: false,
      events: new _events2.default(),
      interaction: {
        grip: undefined,
        press: undefined,
        hover: undefined
      }
    };

    input.laser.add(input.cursor);

    return input;
  }

  /*
    MouseInput.
    Allows you to click on the screen when not in VR for debugging.
  */
  var mouseInput = createMouseInput();

  function createMouseInput() {
    var mouse = new THREE.Vector2(-1, -1);

    var input = createInput();
    input.mouse = mouse;
    input.mouseIntersection = new THREE.Vector3();
    input.mouseOffset = new THREE.Vector3();
    input.mousePlane = new THREE.Plane();
    input.intersections = [];

    //  set my enableMouse
    input.mouseCamera = undefined;

    window.addEventListener('mousemove', function (event) {
      // if a specific renderer has been defined
      if (mouseRenderer) {
        var clientRect = mouseRenderer.domElement.getBoundingClientRect();
        mouse.x = (event.clientX - clientRect.left) / clientRect.width * 2 - 1;
        mouse.y = -((event.clientY - clientRect.top) / clientRect.height) * 2 + 1;
      }
      // default to fullscreen
      else {
          mouse.x = event.clientX / window.innerWidth * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }
    }, false);

    window.addEventListener('mousedown', function (event) {
      if (input.intersections.length > 0) {
        // prevent mouse down from triggering other listeners (polyfill, etc)
        event.stopImmediatePropagation();
        input.pressed = true;
      }
    }, true);

    window.addEventListener('mouseup', function (event) {
      input.pressed = false;
    }, false);

    return input;
  }

  /*
    Public function users run to give DAT GUI an input device.
    Automatically detects for ViveController and binds buttons + haptic feedback.
      Returns a laser pointer so it can be directly added to scene.
      The laser will then have two methods:
    laser.pressed(), laser.gripped()
      These can then be bound to any button the user wants. Useful for binding to
    cardboard or alternate input devices.
      For example...
      document.addEventListener( 'mousedown', function(){ laser.pressed( true ); } );
  */
  function addInputObject(object) {
    var input = createInput(object);

    input.laser.pressed = function (flag) {
      // only pay attention to presses over the GUI
      if (flag && input.intersections.length > 0) {
        input.pressed = true;
      } else {
        input.pressed = false;
      }
    };

    input.laser.gripped = function (flag) {
      input.gripped = flag;
    };

    input.laser.cursor = input.cursor;

    if (THREE.ViveController && object instanceof THREE.ViveController) {
      bindViveController(input, object, input.laser.pressed, input.laser.gripped);
    }

    inputObjects.push(input);

    return input.laser;
  }

  /*
    Here are the main dat gui controller types.
  */

  function addSlider(object, propertyName) {
    var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0;
    var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100.0;

    var slider = (0, _slider2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object, min: min, max: max,
      initialValue: object[propertyName]
    });

    controllers.push(slider);

    return slider;
  }

  function addCheckbox(object, propertyName) {
    var checkbox = (0, _checkbox2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object,
      initialValue: object[propertyName]
    });

    controllers.push(checkbox);

    return checkbox;
  }

  function addButton(object, propertyName) {
    var button = (0, _button2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object
    });

    controllers.push(button);
    return button;
  }

  function addImageButton(func, image) {
    var object = { f: func };
    var propertyName = 'f';

    //see also folder.js where this is added to group object...
    //as such this function also needs to be passed as an argument to createFolder.
    //perhaps all of these 'addX' functions could be initially put onto an object so that
    //new additions could be added slightly more easily.
    var button = (0, _imagebutton2.default)({
      textCreator: textCreator, object: object, propertyName: propertyName, image: image
    });
    controllers.push(button);
    return button;
  }

  function addDropdown(object, propertyName, options) {
    var dropdown = (0, _dropdown2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object, options: options
    });

    controllers.push(dropdown);
    return dropdown;
  }

  /*
    An implicit Add function which detects for property type
    and gives you the correct controller.
      Dropdown:
      add( object, propertyName, objectType )
      Slider:
      add( object, propertyOfNumberType, min, max )
      Checkbox:
      add( object, propertyOfBooleanType )
      Button:
      add( object, propertyOfFunctionType )
      Not used directly. Used by folders.
  */

  function add(object, propertyName, arg3, arg4) {

    if (object === undefined) {
      return undefined;
    } else if (object[propertyName] === undefined) {
      console.warn('no property named', propertyName, 'on object', object);
      return new THREE.Group();
    }

    if (isObject(arg3) || isArray(arg3)) {
      return addDropdown(object, propertyName, arg3);
    }

    if (isNumber(object[propertyName])) {
      return addSlider(object, propertyName, arg3, arg4);
    }

    if (isBoolean(object[propertyName])) {
      return addCheckbox(object, propertyName);
    }

    if (isFunction(object[propertyName])) {
      return addButton(object, propertyName);
    }

    //  add couldn't figure it out, pass it back to folder
    return undefined;
  }

  function addSimpleSlider() {
    var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var proxy = {
      number: min
    };

    return addSlider(proxy, 'number', min, max);
  }

  function addSimpleDropdown() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var proxy = {
      option: ''
    };

    if (options !== undefined) {
      proxy.option = isArray(options) ? options[0] : options[Object.keys(options)[0]];
    }

    return addDropdown(proxy, 'option', options);
  }

  function addSimpleCheckbox() {
    var defaultOption = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var proxy = {
      checked: defaultOption
    };

    return addCheckbox(proxy, 'checked');
  }

  function addSimpleButton(fn) {
    var proxy = {
      button: fn !== undefined ? fn : function () {}
    };

    return addButton(proxy, 'button');
  }

  /*
  Not used directly; used by folders.
  Remove controllers from the global list of all controllers known to dat.GUIVR.
  Calls removeTest first to check input arguments.  returns false if this test fails.
  returns true if successful.
    Note that this function does not recursively remove elements from folders; that is dealt with in the folder code which calls this.
  
   */
  function remove() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var argSet = [].concat(_toConsumableArray(new Set(args))); //just in case there were repeated elements in args, turn into Set then back to array.
    if (!removeTest.apply(undefined, _toConsumableArray(argSet))) return false;
    argSet.forEach(function (obj) {
      var i = controllers.indexOf(obj);
      if (i > -1) controllers.splice(i, 1);else {
        // I can't see how this'd happen now we guard against repeated elements.
        console.log("Internal error in remove, not anticipated by removeTest. Internal dat.GUIVR state may be inconsistent.");
        return false;
      }
    });
    return true;
  }

  /*
  Verify that all of the items in provided arguments are existing controllers that should be ok to remove.
    Returns false if there are any mismatches, true if believed ok to continue with actual remove()
    If any of the provided args are folders (have isFolder property) this is called recursively.
  This will result in redundant work as each folder will also call it again as it's removed, but this is cheap
  and it means that any error should be caught as early as possible and the whole process aborted.
  */
  function removeTest() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    for (var i = 0; i < args.length; i++) {
      var obj = args[i];
      if (controllers.indexOf(obj) === -1 || !obj.folder.hasChild(obj)) {
        //TODO: toString implementations for controllers
        console.log("Can't remove controller " + obj); //not sure the preferred way of reporting problem to user.
        return false;
      }
      if (obj.isFolder) {
        if (!removeTest.apply(undefined, _toConsumableArray(obj.guiChildren))) return false;
      }
    }
    return true;
  }

  /*
    Creates a folder with the name.
      Folders are THREE.Group type objects and can do group.add() for siblings.
    Folders will automatically attempt to lay its children out in sequence.
      Folders are given the add() functionality so that they can do
    folder.add( ... ) to create controllers.
  */

  function create(name) {
    var folder = (0, _folder2.default)({
      textCreator: textCreator,
      name: name,
      guiAdd: add,
      guiRemove: remove,
      addSlider: addSimpleSlider,
      addDropdown: addSimpleDropdown,
      addCheckbox: addSimpleCheckbox,
      addButton: addSimpleButton,
      addImageButton: addImageButton
    });

    controllers.push(folder);

    return folder;
  }

  /*
    Perform the necessary updates, raycasts on its own RAF.
  */

  var tPosition = new THREE.Vector3();
  var tDirection = new THREE.Vector3(0, 0, -1);
  var tMatrix = new THREE.Matrix4();

  function update() {
    requestAnimationFrame(update);

    var hitscanObjects = getVisibleHitscanObjects();

    if (mouseEnabled) {
      mouseInput.intersections = performMouseInput(hitscanObjects, mouseInput);
    }

    inputObjects.forEach(function () {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          box = _ref.box,
          object = _ref.object,
          raycast = _ref.raycast,
          laser = _ref.laser,
          cursor = _ref.cursor;

      var index = arguments[1];

      object.updateMatrixWorld();

      tPosition.set(0, 0, 0).setFromMatrixPosition(object.matrixWorld);
      tMatrix.identity().extractRotation(object.matrixWorld);
      tDirection.set(0, 0, -1).applyMatrix4(tMatrix).normalize();

      raycast.set(tPosition, tDirection);

      laser.geometry.vertices[0].copy(tPosition);

      //  debug...
      // laser.geometry.vertices[ 1 ].copy( tPosition ).add( tDirection.multiplyScalar( 1 ) );

      var intersections = raycast.intersectObjects(hitscanObjects, false);
      parseIntersections(intersections, laser, cursor);

      inputObjects[index].intersections = intersections;
    });

    var inputs = inputObjects.slice();

    if (mouseEnabled) {
      inputs.push(mouseInput);
    }

    controllers.forEach(function (controller) {
      //nb, we could do a more thorough check for visibilty, not sure how important
      //this bit is at this stage...
      if (controller.visible) controller.updateControl(inputs);
    });
  }

  function updateLaser(laser, point) {
    laser.geometry.vertices[1].copy(point);
    laser.visible = true;
    laser.geometry.computeBoundingSphere();
    laser.geometry.computeBoundingBox();
    laser.geometry.verticesNeedUpdate = true;
  }

  function parseIntersections(intersections, laser, cursor) {
    if (intersections.length > 0) {
      var firstHit = intersections[0];
      updateLaser(laser, firstHit.point);
      cursor.position.copy(firstHit.point);
      cursor.visible = true;
      cursor.updateMatrixWorld();
    } else {
      laser.visible = false;
      cursor.visible = false;
    }
  }

  function parseMouseIntersection(intersection, laser, cursor) {
    cursor.position.copy(intersection);
    updateLaser(laser, cursor.position);
  }

  function performMouseIntersection(raycast, mouse, camera) {
    raycast.setFromCamera(mouse, camera);
    var hitscanObjects = getVisibleHitscanObjects();
    return raycast.intersectObjects(hitscanObjects, false);
  }

  function mouseIntersectsPlane(raycast, v, plane) {
    return raycast.ray.intersectPlane(plane, v);
  }

  function performMouseInput(hitscanObjects) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        box = _ref2.box,
        object = _ref2.object,
        raycast = _ref2.raycast,
        laser = _ref2.laser,
        cursor = _ref2.cursor,
        mouse = _ref2.mouse,
        mouseCamera = _ref2.mouseCamera;

    var intersections = [];

    if (mouseCamera) {
      intersections = performMouseIntersection(raycast, mouse, mouseCamera);
      parseIntersections(intersections, laser, cursor);
      cursor.visible = true;
      laser.visible = true;
    }

    return intersections;
  }

  update();

  /*
    Public methods.
  */

  return {
    create: create,
    addInputObject: addInputObject,
    enableMouse: enableMouse,
    disableMouse: disableMouse
  };
}();

if (window) {
  if (window.dat === undefined) {
    window.dat = {};
  }

  window.dat.GUIVR = GUIVR;
}

if (module) {
  module.exports = {
    dat: GUIVR
  };
}

if (typeof define === 'function' && define.amd) {
  define([], GUIVR);
}

/*
  Bunch of state-less utility functions.
*/

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isBoolean(n) {
  return typeof n === 'boolean';
}

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

//  only {} objects not arrays
//                    which are technically objects but you're just being pedantic
function isObject(item) {
  return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item) && item !== null;
}

function isArray(o) {
  return Array.isArray(o);
}

/*
  Controller-specific support.
*/

function bindViveController(input, controller, pressed, gripped) {
  controller.addEventListener('triggerdown', function () {
    return pressed(true);
  });
  controller.addEventListener('triggerup', function () {
    return pressed(false);
  });
  controller.addEventListener('gripsdown', function () {
    return gripped(true);
  });
  controller.addEventListener('gripsup', function () {
    return gripped(false);
  });

  var gamepad = controller.getGamepad();
  function vibrate(t, a) {
    if (gamepad && gamepad.hapticActuators.length > 0) {
      gamepad.hapticActuators[0].pulse(t, a);
    }
  }

  function hapticsTap() {
    setIntervalTimes(function (x, t, a) {
      return vibrate(1 - a, 0.5);
    }, 10, 20);
  }

  function hapticsEcho() {
    setIntervalTimes(function (x, t, a) {
      return vibrate(4, 1.0 * (1 - a));
    }, 100, 4);
  }

  input.events.on('onControllerHeld', function (input) {
    vibrate(0.3, 0.3);
  });

  input.events.on('grabbed', function () {
    hapticsTap();
  });

  input.events.on('grabReleased', function () {
    hapticsEcho();
  });

  input.events.on('pinned', function () {
    hapticsTap();
  });

  input.events.on('pinReleased', function () {
    hapticsEcho();
  });
}

function setIntervalTimes(cb, delay, times) {
  var x = 0;
  var id = setInterval(function () {
    cb(x, times, x / times);
    x++;
    if (x >= times) {
      clearInterval(id);
    }
  }, delay);
  return id;
}

},{"./button":1,"./checkbox":2,"./dropdown":4,"./folder":5,"./imagebutton":9,"./sdftext":14,"./slider":16,"events":22}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createInteraction;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createInteraction(hitVolume) {
  var events = new _events2.default();

  var anyHover = false;
  var anyPressing = false;
  var anyActive = false;

  var tVector = new THREE.Vector3();
  var availableInputs = [];

  function update(inputObjects) {

    anyHover = false;
    anyPressing = false;
    anyActive = false;

    inputObjects.forEach(function (input) {

      if (availableInputs.indexOf(input) < 0) {
        availableInputs.push(input);
      }

      var _extractHit = extractHit(input),
          hitObject = _extractHit.hitObject,
          hitPoint = _extractHit.hitPoint;

      var hover = hitVolume === hitObject;
      anyHover = anyHover || hover;

      performStateEvents({
        input: input,
        hover: hover,
        hitObject: hitObject, hitPoint: hitPoint,
        buttonName: 'pressed',
        interactionName: 'press',
        downName: 'onPressed',
        holdName: 'pressing',
        upName: 'onReleased'
      });

      performStateEvents({
        input: input,
        hover: hover,
        hitObject: hitObject, hitPoint: hitPoint,
        buttonName: 'gripped',
        interactionName: 'grip',
        downName: 'onGripped',
        holdName: 'gripping',
        upName: 'onReleaseGrip'
      });

      events.emit('tick', {
        input: input,
        hitObject: hitObject,
        inputObject: input.object
      });
    });
  }

  function extractHit(input) {
    if (input.intersections.length <= 0) {
      return {
        hitPoint: tVector.setFromMatrixPosition(input.cursor.matrixWorld).clone(),
        hitObject: undefined
      };
    } else {
      return {
        hitPoint: input.intersections[0].point,
        hitObject: input.intersections[0].object
      };
    }
  }

  function performStateEvents() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        input = _ref.input,
        hover = _ref.hover,
        hitObject = _ref.hitObject,
        hitPoint = _ref.hitPoint,
        buttonName = _ref.buttonName,
        interactionName = _ref.interactionName,
        downName = _ref.downName,
        holdName = _ref.holdName,
        upName = _ref.upName;

    if (input[buttonName] === true && hitObject === undefined) {
      return;
    }

    //  hovering and button down but no interactions active yet
    if (hover && input[buttonName] === true && input.interaction[interactionName] === undefined) {

      var payload = {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object,
        locked: false
      };
      events.emit(downName, payload);

      if (payload.locked) {
        input.interaction[interactionName] = interaction;
        input.interaction.hover = interaction;
      }

      anyPressing = true;
      anyActive = true;
    }

    //  button still down and this is the active interaction
    if (input[buttonName] && input.interaction[interactionName] === interaction) {
      var _payload = {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object,
        locked: false
      };

      events.emit(holdName, _payload);

      anyPressing = true;

      input.events.emit('onControllerHeld');
    }

    //  button not down and this is the active interaction
    if (input[buttonName] === false && input.interaction[interactionName] === interaction) {
      input.interaction[interactionName] = undefined;
      input.interaction.hover = undefined;
      events.emit(upName, {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object
      });
    }
  }

  function isMainHover() {

    var noMainHover = true;
    for (var i = 0; i < availableInputs.length; i++) {
      if (availableInputs[i].interaction.hover !== undefined) {
        noMainHover = false;
        break;
      }
    }

    if (noMainHover) {
      return anyHover;
    }

    if (availableInputs.filter(function (input) {
      return input.interaction.hover === interaction;
    }).length > 0) {
      return true;
    }

    return false;
  }

  var interaction = {
    hovering: isMainHover,
    pressing: function pressing() {
      return anyPressing;
    },
    update: update,
    events: events
  };

  return interaction;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"events":22}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHECKBOX_SIZE = exports.BORDER_THICKNESS = exports.FOLDER_GRAB_HEIGHT = exports.FOLDER_HEIGHT = exports.SUBFOLDER_WIDTH = exports.FOLDER_WIDTH = exports.BUTTON_DEPTH = exports.CONTROLLER_ID_DEPTH = exports.CONTROLLER_ID_WIDTH = exports.PANEL_VALUE_TEXT_MARGIN = exports.PANEL_LABEL_TEXT_MARGIN = exports.PANEL_MARGIN = exports.PANEL_SPACING = exports.PANEL_DEPTH = exports.PANEL_HEIGHT = exports.PANEL_WIDTH = undefined;
exports.alignLeft = alignLeft;
exports.createPanel = createPanel;
exports.resizePanel = resizePanel;
exports.createControllerIDBox = createControllerIDBox;
exports.createDownArrow = createDownArrow;

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function alignLeft(obj) {
  if (obj instanceof THREE.Mesh) {
    obj.geometry.computeBoundingBox();
    var width = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.max.y;
    obj.geometry.translate(width, 0, 0);
    return obj;
  } else if (obj instanceof THREE.Geometry) {
    obj.computeBoundingBox();
    var _width = obj.boundingBox.max.x - obj.boundingBox.max.y;
    obj.translate(_width, 0, 0);
    return obj;
  }
}

function createPanel(width, height, depth, uniqueMaterial) {
  var material = uniqueMaterial ? new THREE.MeshBasicMaterial({ color: 0xffffff }) : SharedMaterials.PANEL;
  var panel = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  panel.geometry.translate(width * 0.5, 0, 0);

  if (uniqueMaterial) {
    material.color.setHex(Colors.DEFAULT_BACK);
  } else {
    Colors.colorizeGeometry(panel.geometry, Colors.DEFAULT_BACK);
  }

  panel.userData.currentWidth = width;
  panel.userData.currentHeight = height;
  panel.userData.currentDepth = depth;

  return panel;
}
function resizePanel(panel, width, height, depth) {
  panel.geometry.scale(width / panel.userData.currentWidth, height / panel.userData.currentHeight, depth / panel.userData.currentDepth);
  panel.userData.currentWidth = width;
  panel.userData.currentHeight = height;
  panel.userData.currentDepth = depth;
}

function createControllerIDBox(height, color) {
  var panel = new THREE.Mesh(new THREE.BoxGeometry(CONTROLLER_ID_WIDTH, height, CONTROLLER_ID_DEPTH), SharedMaterials.PANEL);
  panel.geometry.translate(CONTROLLER_ID_WIDTH * 0.5, 0, 0);
  Colors.colorizeGeometry(panel.geometry, color);
  return panel;
}

function createDownArrow() {
  var w = 0.0096;
  var h = 0.016;
  var sh = new THREE.Shape();
  sh.moveTo(0, 0);
  sh.lineTo(-w, h);
  sh.lineTo(w, h);
  sh.lineTo(0, 0);

  var geo = new THREE.ShapeGeometry(sh);
  geo.translate(0, -h * 0.5, 0);

  return new THREE.Mesh(geo, SharedMaterials.PANEL);
}

var PANEL_WIDTH = exports.PANEL_WIDTH = 1.0;
var PANEL_HEIGHT = exports.PANEL_HEIGHT = 0.08;
var PANEL_DEPTH = exports.PANEL_DEPTH = 0.01;
var PANEL_SPACING = exports.PANEL_SPACING = 0.001;
var PANEL_MARGIN = exports.PANEL_MARGIN = 0.015;
var PANEL_LABEL_TEXT_MARGIN = exports.PANEL_LABEL_TEXT_MARGIN = 0.06;
var PANEL_VALUE_TEXT_MARGIN = exports.PANEL_VALUE_TEXT_MARGIN = 0.02;
var CONTROLLER_ID_WIDTH = exports.CONTROLLER_ID_WIDTH = 0.02;
var CONTROLLER_ID_DEPTH = exports.CONTROLLER_ID_DEPTH = 0.001;
var BUTTON_DEPTH = exports.BUTTON_DEPTH = 0.01;
var FOLDER_WIDTH = exports.FOLDER_WIDTH = 1.026;
var SUBFOLDER_WIDTH = exports.SUBFOLDER_WIDTH = 1.0;
var FOLDER_HEIGHT = exports.FOLDER_HEIGHT = 0.09;
var FOLDER_GRAB_HEIGHT = exports.FOLDER_GRAB_HEIGHT = 0.0512;
var BORDER_THICKNESS = exports.BORDER_THICKNESS = 0.01;
var CHECKBOX_SIZE = exports.CHECKBOX_SIZE = 0.05;

},{"./colors":3,"./sharedmaterials":15}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.create = create;

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        group = _ref.group,
        panel = _ref.panel;

    var interaction = (0, _interaction2.default)(panel);

    interaction.events.on('onGripped', handleOnGrip);
    interaction.events.on('onReleaseGrip', handleOnGripRelease);

    var oldParent = void 0;
    var oldPosition = new THREE.Vector3();
    var oldRotation = new THREE.Euler();

    var rotationGroup = new THREE.Group();
    rotationGroup.scale.set(0.3, 0.3, 0.3);
    rotationGroup.position.set(-0.015, 0.015, 0.0);

    function handleOnGrip(p) {
        var inputObject = p.inputObject,
            input = p.input;


        var folder = group.folder;
        if (folder === undefined) {
            return;
        }

        if (folder.beingMoved === true) {
            return;
        }

        oldPosition.copy(folder.position);
        oldRotation.copy(folder.rotation);

        folder.position.set(0, 0, 0);
        folder.rotation.set(0, 0, 0);
        folder.rotation.x = -Math.PI * 0.5;

        oldParent = folder.parent;

        rotationGroup.add(folder);

        inputObject.add(rotationGroup);

        p.locked = true;

        folder.beingMoved = true;

        input.events.emit('pinned', input);
    }

    function handleOnGripRelease() {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            inputObject = _ref2.inputObject,
            input = _ref2.input;

        var folder = group.folder;
        if (folder === undefined) {
            return;
        }

        if (oldParent === undefined) {
            return;
        }

        if (folder.beingMoved === false) {
            return;
        }

        oldParent.add(folder);
        oldParent = undefined;

        folder.position.copy(oldPosition);
        folder.rotation.copy(oldRotation);

        folder.beingMoved = false;

        input.events.emit('pinReleased', input);
    }

    return interaction;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"./interaction":11}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMaterial = createMaterial;
exports.creator = creator;

var _sdf = require('three-bmfont-text/shaders/sdf');

var _sdf2 = _interopRequireDefault(_sdf);

var _threeBmfontText = require('three-bmfont-text');

var _threeBmfontText2 = _interopRequireDefault(_threeBmfontText);

var _parseBmfontAscii = require('parse-bmfont-ascii');

var _parseBmfontAscii2 = _interopRequireDefault(_parseBmfontAscii);

var _font = require('./font');

var Font = _interopRequireWildcard(_font);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function createMaterial(color) {

  var texture = new THREE.Texture();
  var image = Font.image();
  texture.image = image;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return new THREE.RawShaderMaterial((0, _sdf2.default)({
    side: THREE.DoubleSide,
    transparent: true,
    color: color,
    map: texture
  }));
}

var textScale = 0.00024;

function creator() {

  var font = (0, _parseBmfontAscii2.default)(Font.fnt());

  var colorMaterials = {};

  function createText(str, font) {
    var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0xffffff;
    var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;


    var geometry = (0, _threeBmfontText2.default)({
      text: str,
      align: 'left',
      width: 10000,
      flipY: true,
      font: font
    });

    var layout = geometry.layout;

    var material = colorMaterials[color];
    if (material === undefined) {
      material = colorMaterials[color] = createMaterial(color);
    }
    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.multiply(new THREE.Vector3(1, -1, 1));

    var finalScale = scale * textScale;

    mesh.scale.multiplyScalar(finalScale);

    mesh.position.y = layout.height * 0.5 * finalScale;

    return mesh;
  }

  function create(str) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$color = _ref.color,
        color = _ref$color === undefined ? 0xffffff : _ref$color,
        _ref$scale = _ref.scale,
        scale = _ref$scale === undefined ? 1.0 : _ref$scale;

    var group = new THREE.Group();

    var mesh = createText(str, font, color, scale);
    group.add(mesh);
    group.layout = mesh.geometry.layout;

    group.updateLabel = function (str) {
      mesh.geometry.update(str);
    };

    return group;
  }

  return {
    create: create,
    getMaterial: function getMaterial() {
      return material;
    }
  };
}

},{"./font":6,"parse-bmfont-ascii":29,"three-bmfont-text":31,"three-bmfont-text/shaders/sdf":34}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FOLDER = exports.LOCATOR = exports.PANEL = undefined;

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var PANEL = exports.PANEL = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: THREE.VertexColors }); /**
                                                                                                                * dat-guiVR Javascript Controller Library for VR
                                                                                                                * https://github.com/dataarts/dat.guiVR
                                                                                                                *
                                                                                                                * Copyright 2016 Data Arts Team, Google Inc.
                                                                                                                *
                                                                                                                * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                * You may obtain a copy of the License at
                                                                                                                *
                                                                                                                *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                *
                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                * limitations under the License.
                                                                                                                */

var LOCATOR = exports.LOCATOR = new THREE.MeshBasicMaterial();
var FOLDER = exports.FOLDER = new THREE.MeshBasicMaterial({ color: 0x000000 });

},{"./colors":3}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSlider;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

var _palette = require('./palette');

var Palette = _interopRequireWildcard(_palette);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createSlider() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      textCreator = _ref.textCreator,
      object = _ref.object,
      _ref$propertyName = _ref.propertyName,
      propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName,
      _ref$initialValue = _ref.initialValue,
      initialValue = _ref$initialValue === undefined ? 0.0 : _ref$initialValue,
      _ref$min = _ref.min,
      min = _ref$min === undefined ? 0.0 : _ref$min,
      _ref$max = _ref.max,
      max = _ref$max === undefined ? 1.0 : _ref$max,
      _ref$step = _ref.step,
      step = _ref$step === undefined ? 0.1 : _ref$step,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height,
      _ref$depth = _ref.depth,
      depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;

  var SLIDER_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var SLIDER_HEIGHT = height - Layout.PANEL_MARGIN;
  var SLIDER_DEPTH = depth;

  var state = {
    alpha: 1.0,
    value: initialValue,
    step: step,
    useStep: true,
    precision: 1,
    listen: false,
    min: min,
    max: max,
    onChangedCB: undefined,
    onFinishedChange: undefined,
    pressing: false
  };

  state.step = getImpliedStep(state.value);
  state.precision = numDecimals(state.step);
  state.alpha = getAlphaFromValue(state.value, state.min, state.max);

  var group = new THREE.Group();

  //  filled volume
  var rect = new THREE.BoxGeometry(SLIDER_WIDTH, SLIDER_HEIGHT, SLIDER_DEPTH);
  rect.translate(SLIDER_WIDTH * 0.5, 0, 0);
  // Layout.alignLeft( rect );

  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = depth;
  hitscanVolume.position.x = width * 0.5;
  hitscanVolume.name = 'hitscanVolume';

  //  sliderBG volume
  var sliderBG = new THREE.Mesh(rect.clone(), SharedMaterials.PANEL);
  Colors.colorizeGeometry(sliderBG.geometry, Colors.SLIDER_BG);
  sliderBG.position.z = depth * 0.5;
  sliderBG.position.x = SLIDER_WIDTH + Layout.PANEL_MARGIN;

  var material = new THREE.MeshBasicMaterial({ color: Colors.DEFAULT_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  filledVolume.position.z = depth * 0.5;
  hitscanVolume.add(filledVolume);

  var endLocator = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05, 1, 1, 1), SharedMaterials.LOCATOR);
  endLocator.position.x = SLIDER_WIDTH;
  hitscanVolume.add(endLocator);
  endLocator.visible = false;

  var valueLabel = textCreator.create(state.value.toString());
  valueLabel.position.x = Layout.PANEL_VALUE_TEXT_MARGIN + width * 0.5;
  valueLabel.position.z = depth * 2.5;
  valueLabel.position.y = -0.0325;

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_SLIDER);
  controllerID.position.z = depth;

  var panel = Layout.createPanel(width, height, depth);
  panel.name = 'panel';
  panel.add(descriptorLabel, hitscanVolume, sliderBG, valueLabel, controllerID);

  group.add(panel);

  updateValueLabel(state.value);
  updateSlider();

  function updateValueLabel(value) {
    if (state.useStep) {
      valueLabel.updateLabel(roundToDecimal(state.value, state.precision).toString());
    } else {
      valueLabel.updateLabel(state.value.toString());
    }
  }

  function updateView() {
    if (state.pressing) {
      material.color.setHex(Colors.INTERACTION_COLOR);
    } else if (interaction.hovering()) {
      material.color.setHex(Colors.HIGHLIGHT_COLOR);
    } else {
      material.color.setHex(Colors.DEFAULT_COLOR);
    }
  }

  function updateSlider() {
    filledVolume.scale.x = Math.min(Math.max(getAlphaFromValue(state.value, state.min, state.max) * width, 0.000001), width);
  }

  function updateObject(value) {
    object[propertyName] = value;
  }

  function updateStateFromAlpha(alpha) {
    state.alpha = getClampedAlpha(alpha);
    state.value = getValueFromAlpha(state.alpha, state.min, state.max);
    if (state.useStep) {
      state.value = getSteppedValue(state.value, state.step);
    }
    state.value = getClampedValue(state.value, state.min, state.max);
  }

  function listenUpdate() {
    state.value = getValueFromObject();
    state.alpha = getAlphaFromValue(state.value, state.min, state.max);
    state.alpha = getClampedAlpha(state.alpha);
  }

  function getValueFromObject() {
    return parseFloat(object[propertyName]);
  }

  group.onChange = function (callback) {
    state.onChangedCB = callback;
    return group;
  };

  group.step = function (step) {
    state.step = step;
    state.precision = numDecimals(state.step);
    state.useStep = true;

    state.alpha = getAlphaFromValue(state.value, state.min, state.max);

    updateStateFromAlpha(state.alpha);
    updateValueLabel(state.value);
    updateSlider();
    return group;
  };

  group.listen = function () {
    state.listen = true;
    return group;
  };

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handlePress);
  interaction.events.on('pressing', handleHold);
  interaction.events.on('onReleased', handleRelease);

  function handlePress(p) {
    if (group.visible === false) {
      return;
    }
    state.pressing = true;
    p.locked = true;
  }

  function handleHold() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        point = _ref2.point;

    if (group.visible === false) {
      return;
    }

    state.pressing = true;

    filledVolume.updateMatrixWorld();
    endLocator.updateMatrixWorld();

    var a = new THREE.Vector3().setFromMatrixPosition(filledVolume.matrixWorld);
    var b = new THREE.Vector3().setFromMatrixPosition(endLocator.matrixWorld);

    var previousValue = state.value;

    updateStateFromAlpha(getPointAlpha(point, { a: a, b: b }));
    updateValueLabel(state.value);
    updateSlider();
    updateObject(state.value);

    if (previousValue !== state.value && state.onChangedCB) {
      state.onChangedCB(state.value);
    }
  }

  function handleRelease() {
    state.pressing = false;
  }

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });
  var paletteInteraction = Palette.create({ group: group, panel: panel });

  group.updateControl = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    paletteInteraction.update(inputObjects);

    if (state.listen) {
      listenUpdate();
      updateValueLabel(state.value);
      updateSlider();
    }
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.updateLabel(str);
    return group;
  };

  group.min = function (m) {
    state.min = m;
    state.alpha = getAlphaFromValue(state.value, state.min, state.max);
    updateStateFromAlpha(state.alpha);
    updateValueLabel(state.value);
    updateSlider();
    return group;
  };

  group.max = function (m) {
    state.max = m;
    state.alpha = getAlphaFromValue(state.value, state.min, state.max);
    updateStateFromAlpha(state.alpha);
    updateValueLabel(state.value);
    updateSlider();
    return group;
  };

  return group;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

var ta = new THREE.Vector3();
var tb = new THREE.Vector3();
var tToA = new THREE.Vector3();
var aToB = new THREE.Vector3();

function getPointAlpha(point, segment) {
  ta.copy(segment.b).sub(segment.a);
  tb.copy(point).sub(segment.a);

  var projected = tb.projectOnVector(ta);

  tToA.copy(point).sub(segment.a);

  aToB.copy(segment.b).sub(segment.a).normalize();

  var side = tToA.normalize().dot(aToB) >= 0 ? 1 : -1;

  var length = segment.a.distanceTo(segment.b) * side;

  var alpha = projected.length() / length;
  if (alpha > 1.0) {
    alpha = 1.0;
  }
  if (alpha < 0.0) {
    alpha = 0.0;
  }
  return alpha;
}

function lerp(min, max, value) {
  return (1 - value) * min + value * max;
}

function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function getClampedAlpha(alpha) {
  if (alpha > 1) {
    return 1;
  }
  if (alpha < 0) {
    return 0;
  }
  return alpha;
}

function getClampedValue(value, min, max) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function getImpliedStep(value) {
  if (value === 0) {
    return 1; // What are we, psychics?
  } else {
    // Hey Doug, check this out.
    return Math.pow(10, Math.floor(Math.log(Math.abs(value)) / Math.LN10)) / 10;
  }
}

function getValueFromAlpha(alpha, min, max) {
  return map_range(alpha, 0.0, 1.0, min, max);
}

function getAlphaFromValue(value, min, max) {
  return map_range(value, min, max, 0.0, 1.0);
}

function getSteppedValue(value, step) {
  if (value % step != 0) {
    return Math.round(value / step) * step;
  }
  return value;
}

function numDecimals(x) {
  x = x.toString();
  if (x.indexOf('.') > -1) {
    return x.length - x.indexOf('.') - 1;
  } else {
    return 0;
  }
}

function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}

},{"./colors":3,"./grab":7,"./interaction":11,"./layout":12,"./palette":13,"./sharedmaterials":15,"./textlabel":17}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTextLabel;

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function createTextLabel(textCreator, str) {
  var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.4;
  var depth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.029;
  var fgColor = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0xffffff;
  var bgColor = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : Colors.DEFAULT_BACK;
  var scale = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1.0;


  var group = new THREE.Group();
  var internalPositioning = new THREE.Group();
  group.add(internalPositioning);

  var text = textCreator.create(str, { color: fgColor, scale: scale });
  internalPositioning.add(text);

  group.setString = function (str) {
    text.updateLabel(str.toString());
  };

  group.setNumber = function (str) {
    text.updateLabel(str.toFixed(2));
  };

  text.position.z = depth;

  var backBounds = 0.01;
  var margin = 0.01;
  var totalWidth = width;
  var totalHeight = 0.04 + margin * 2;
  var labelBackGeometry = new THREE.BoxGeometry(totalWidth, totalHeight, depth, 1, 1, 1);
  labelBackGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(totalWidth * 0.5 - margin, 0, 0));

  var labelBackMesh = new THREE.Mesh(labelBackGeometry, SharedMaterials.PANEL);
  Colors.colorizeGeometry(labelBackMesh.geometry, bgColor);

  labelBackMesh.position.y = 0.03;
  internalPositioning.add(labelBackMesh);
  internalPositioning.position.y = -totalHeight * 0.5;

  group.back = labelBackMesh;

  return group;
}

},{"./colors":3,"./sharedmaterials":15}],18:[function(require,module,exports){
'use strict';

/*
 *	@author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog
 *	@author centerionware / http://www.centerionware.com
 *
 *	Subdivision Geometry Modifier
 *		using Loop Subdivision Scheme
 *
 *	References:
 *		http://graphics.stanford.edu/~mdfisher/subdivision.html
 *		http://www.holmes3d.net/graphics/subdivision/
 *		http://www.cs.rutgers.edu/~decarlo/readings/subdiv-sg00c.pdf
 *
 *	Known Issues:
 *		- currently doesn't handle "Sharp Edges"
 */

THREE.SubdivisionModifier = function (subdivisions) {

		this.subdivisions = subdivisions === undefined ? 1 : subdivisions;
};

// Applies the "modify" pattern
THREE.SubdivisionModifier.prototype.modify = function (geometry) {

		var repeats = this.subdivisions;

		while (repeats-- > 0) {

				this.smooth(geometry);
		}

		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
};

(function () {

		// Some constants
		var WARNINGS = !true; // Set to true for development
		var ABC = ['a', 'b', 'c'];

		function getEdge(a, b, map) {

				var vertexIndexA = Math.min(a, b);
				var vertexIndexB = Math.max(a, b);

				var key = vertexIndexA + "_" + vertexIndexB;

				return map[key];
		}

		function processEdge(a, b, vertices, map, face, metaVertices) {

				var vertexIndexA = Math.min(a, b);
				var vertexIndexB = Math.max(a, b);

				var key = vertexIndexA + "_" + vertexIndexB;

				var edge;

				if (key in map) {

						edge = map[key];
				} else {

						var vertexA = vertices[vertexIndexA];
						var vertexB = vertices[vertexIndexB];

						edge = {

								a: vertexA, // pointer reference
								b: vertexB,
								newEdge: null,
								// aIndex: a, // numbered reference
								// bIndex: b,
								faces: [] // pointers to face

						};

						map[key] = edge;
				}

				edge.faces.push(face);

				metaVertices[a].edges.push(edge);
				metaVertices[b].edges.push(edge);
		}

		function generateLookups(vertices, faces, metaVertices, edges) {

				var i, il, face, edge;

				for (i = 0, il = vertices.length; i < il; i++) {

						metaVertices[i] = { edges: [] };
				}

				for (i = 0, il = faces.length; i < il; i++) {

						face = faces[i];

						processEdge(face.a, face.b, vertices, edges, face, metaVertices);
						processEdge(face.b, face.c, vertices, edges, face, metaVertices);
						processEdge(face.c, face.a, vertices, edges, face, metaVertices);
				}
		}

		function newFace(newFaces, a, b, c) {

				newFaces.push(new THREE.Face3(a, b, c));
		}

		function midpoint(a, b) {

				return Math.abs(b - a) / 2 + Math.min(a, b);
		}

		function newUv(newUvs, a, b, c) {

				newUvs.push([a.clone(), b.clone(), c.clone()]);
		}

		/////////////////////////////

		// Performs one iteration of Subdivision
		THREE.SubdivisionModifier.prototype.smooth = function (geometry) {

				var tmp = new THREE.Vector3();

				var oldVertices, oldFaces, oldUvs;
				var newVertices,
				    newFaces,
				    newUVs = [];

				var n, l, i, il, j, k;
				var metaVertices, sourceEdges;

				// new stuff.
				var sourceEdges, newEdgeVertices, newSourceVertices;

				oldVertices = geometry.vertices; // { x, y, z}
				oldFaces = geometry.faces; // { a: oldVertex1, b: oldVertex2, c: oldVertex3 }
				oldUvs = geometry.faceVertexUvs[0];

				var hasUvs = oldUvs !== undefined && oldUvs.length > 0;

				/******************************************************
     *
     * Step 0: Preprocess Geometry to Generate edges Lookup
     *
     *******************************************************/

				metaVertices = new Array(oldVertices.length);
				sourceEdges = {}; // Edge => { oldVertex1, oldVertex2, faces[]  }

				generateLookups(oldVertices, oldFaces, metaVertices, sourceEdges);

				/******************************************************
     *
     *	Step 1.
     *	For each edge, create a new Edge Vertex,
     *	then position it.
     *
     *******************************************************/

				newEdgeVertices = [];
				var other, currentEdge, newEdge, face;
				var edgeVertexWeight, adjacentVertexWeight, connectedFaces;

				for (i in sourceEdges) {

						currentEdge = sourceEdges[i];
						newEdge = new THREE.Vector3();

						edgeVertexWeight = 3 / 8;
						adjacentVertexWeight = 1 / 8;

						connectedFaces = currentEdge.faces.length;

						// check how many linked faces. 2 should be correct.
						if (connectedFaces != 2) {

								// if length is not 2, handle condition
								edgeVertexWeight = 0.5;
								adjacentVertexWeight = 0;

								if (connectedFaces != 1) {

										if (WARNINGS) console.warn('Subdivision Modifier: Number of connected faces != 2, is: ', connectedFaces, currentEdge);
								}
						}

						newEdge.addVectors(currentEdge.a, currentEdge.b).multiplyScalar(edgeVertexWeight);

						tmp.set(0, 0, 0);

						for (j = 0; j < connectedFaces; j++) {

								face = currentEdge.faces[j];

								for (k = 0; k < 3; k++) {

										other = oldVertices[face[ABC[k]]];
										if (other !== currentEdge.a && other !== currentEdge.b) break;
								}

								tmp.add(other);
						}

						tmp.multiplyScalar(adjacentVertexWeight);
						newEdge.add(tmp);

						currentEdge.newEdge = newEdgeVertices.length;
						newEdgeVertices.push(newEdge);

						// console.log(currentEdge, newEdge);
				}

				/******************************************************
     *
     *	Step 2.
     *	Reposition each source vertices.
     *
     *******************************************************/

				var beta, sourceVertexWeight, connectingVertexWeight;
				var connectingEdge, connectingEdges, oldVertex, newSourceVertex;
				newSourceVertices = [];

				for (i = 0, il = oldVertices.length; i < il; i++) {

						oldVertex = oldVertices[i];

						// find all connecting edges (using lookupTable)
						connectingEdges = metaVertices[i].edges;
						n = connectingEdges.length;

						if (n == 3) {

								beta = 3 / 16;
						} else if (n > 3) {

								beta = 3 / (8 * n); // Warren's modified formula
						}

						// Loop's original beta formula
						// beta = 1 / n * ( 5/8 - Math.pow( 3/8 + 1/4 * Math.cos( 2 * Math. PI / n ), 2) );

						sourceVertexWeight = 1 - n * beta;
						connectingVertexWeight = beta;

						if (n <= 2) {

								// crease and boundary rules
								// console.warn('crease and boundary rules');

								if (n == 2) {

										if (WARNINGS) console.warn('2 connecting edges', connectingEdges);
										sourceVertexWeight = 3 / 4;
										connectingVertexWeight = 1 / 8;

										// sourceVertexWeight = 1;
										// connectingVertexWeight = 0;
								} else if (n == 1) {

										if (WARNINGS) console.warn('only 1 connecting edge');
								} else if (n == 0) {

										if (WARNINGS) console.warn('0 connecting edges');
								}
						}

						newSourceVertex = oldVertex.clone().multiplyScalar(sourceVertexWeight);

						tmp.set(0, 0, 0);

						for (j = 0; j < n; j++) {

								connectingEdge = connectingEdges[j];
								other = connectingEdge.a !== oldVertex ? connectingEdge.a : connectingEdge.b;
								tmp.add(other);
						}

						tmp.multiplyScalar(connectingVertexWeight);
						newSourceVertex.add(tmp);

						newSourceVertices.push(newSourceVertex);
				}

				/******************************************************
     *
     *	Step 3.
     *	Generate Faces between source vertices
     *	and edge vertices.
     *
     *******************************************************/

				newVertices = newSourceVertices.concat(newEdgeVertices);
				var sl = newSourceVertices.length,
				    edge1,
				    edge2,
				    edge3;
				newFaces = [];

				var uv, x0, x1, x2;
				var x3 = new THREE.Vector2();
				var x4 = new THREE.Vector2();
				var x5 = new THREE.Vector2();

				for (i = 0, il = oldFaces.length; i < il; i++) {

						face = oldFaces[i];

						// find the 3 new edges vertex of each old face

						edge1 = getEdge(face.a, face.b, sourceEdges).newEdge + sl;
						edge2 = getEdge(face.b, face.c, sourceEdges).newEdge + sl;
						edge3 = getEdge(face.c, face.a, sourceEdges).newEdge + sl;

						// create 4 faces.

						newFace(newFaces, edge1, edge2, edge3);
						newFace(newFaces, face.a, edge1, edge3);
						newFace(newFaces, face.b, edge2, edge1);
						newFace(newFaces, face.c, edge3, edge2);

						// create 4 new uv's

						if (hasUvs) {

								uv = oldUvs[i];

								x0 = uv[0];
								x1 = uv[1];
								x2 = uv[2];

								x3.set(midpoint(x0.x, x1.x), midpoint(x0.y, x1.y));
								x4.set(midpoint(x1.x, x2.x), midpoint(x1.y, x2.y));
								x5.set(midpoint(x0.x, x2.x), midpoint(x0.y, x2.y));

								newUv(newUVs, x3, x4, x5);
								newUv(newUVs, x0, x3, x5);

								newUv(newUVs, x1, x4, x3);
								newUv(newUVs, x2, x5, x4);
						}
				}

				// Overwrite old arrays
				geometry.vertices = newVertices;
				geometry.faces = newFaces;
				if (hasUvs) geometry.faceVertexUvs[0] = newUVs;

				// console.log('done');
		};
})();

},{}],19:[function(require,module,exports){
var str = Object.prototype.toString

module.exports = anArray

function anArray(arr) {
  return (
       arr.BYTES_PER_ELEMENT
    && str.call(arr.buffer) === '[object ArrayBuffer]'
    || Array.isArray(arr)
  )
}

},{}],20:[function(require,module,exports){
module.exports = function numtype(num, def) {
	return typeof num === 'number'
		? num 
		: (typeof def === 'number' ? def : 0)
}
},{}],21:[function(require,module,exports){
module.exports = function(dtype) {
  switch (dtype) {
    case 'int8':
      return Int8Array
    case 'int16':
      return Int16Array
    case 'int32':
      return Int32Array
    case 'uint8':
      return Uint8Array
    case 'uint16':
      return Uint16Array
    case 'uint32':
      return Uint32Array
    case 'float32':
      return Float32Array
    case 'float64':
      return Float64Array
    case 'array':
      return Array
    case 'uint8_clamped':
      return Uint8ClampedArray
  }
}

},{}],22:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],23:[function(require,module,exports){
/*eslint new-cap:0*/
var dtype = require('dtype')
module.exports = flattenVertexData
function flattenVertexData (data, output, offset) {
  if (!data) throw new TypeError('must specify data as first parameter')
  offset = +(offset || 0) | 0

  if (Array.isArray(data) && Array.isArray(data[0])) {
    var dim = data[0].length
    var length = data.length * dim

    // no output specified, create a new typed array
    if (!output || typeof output === 'string') {
      output = new (dtype(output || 'float32'))(length + offset)
    }

    var dstLength = output.length - offset
    if (length !== dstLength) {
      throw new Error('source length ' + length + ' (' + dim + 'x' + data.length + ')' +
        ' does not match destination length ' + dstLength)
    }

    for (var i = 0, k = offset; i < data.length; i++) {
      for (var j = 0; j < dim; j++) {
        output[k++] = data[i][j]
      }
    }
  } else {
    if (!output || typeof output === 'string') {
      // no output, create a new one
      var Ctor = dtype(output || 'float32')
      if (offset === 0) {
        output = new Ctor(data)
      } else {
        output = new Ctor(data.length + offset)
        output.set(data, offset)
      }
    } else {
      // store output in existing array
      output.set(data, offset)
    }
  }

  return output
}

},{"dtype":21}],24:[function(require,module,exports){
module.exports = function compile(property) {
	if (!property || typeof property !== 'string')
		throw new Error('must specify property for indexof search')

	return new Function('array', 'value', 'start', [
		'start = start || 0',
		'for (var i=start; i<array.length; i++)',
		'  if (array[i]["' + property +'"] === value)',
		'      return i',
		'return -1'
	].join('\n'))
}
},{}],25:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],26:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],27:[function(require,module,exports){
var wordWrap = require('word-wrapper')
var xtend = require('xtend')
var findChar = require('indexof-property')('id')
var number = require('as-number')

var X_HEIGHTS = ['x', 'e', 'a', 'o', 'n', 's', 'r', 'c', 'u', 'm', 'v', 'w', 'z']
var M_WIDTHS = ['m', 'w']
var CAP_HEIGHTS = ['H', 'I', 'N', 'E', 'F', 'K', 'L', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']


var TAB_ID = '\t'.charCodeAt(0)
var SPACE_ID = ' '.charCodeAt(0)
var ALIGN_LEFT = 0, 
    ALIGN_CENTER = 1, 
    ALIGN_RIGHT = 2

module.exports = function createLayout(opt) {
  return new TextLayout(opt)
}

function TextLayout(opt) {
  this.glyphs = []
  this._measure = this.computeMetrics.bind(this)
  this.update(opt)
}

TextLayout.prototype.update = function(opt) {
  opt = xtend({
    measure: this._measure
  }, opt)
  this._opt = opt
  this._opt.tabSize = number(this._opt.tabSize, 4)

  if (!opt.font)
    throw new Error('must provide a valid bitmap font')

  var glyphs = this.glyphs
  var text = opt.text||'' 
  var font = opt.font
  this._setupSpaceGlyphs(font)
  
  var lines = wordWrap.lines(text, opt)
  var minWidth = opt.width || 0

  //clear glyphs
  glyphs.length = 0

  //get max line width
  var maxLineWidth = lines.reduce(function(prev, line) {
    return Math.max(prev, line.width, minWidth)
  }, 0)

  //the pen position
  var x = 0
  var y = 0
  var lineHeight = number(opt.lineHeight, font.common.lineHeight)
  var baseline = font.common.base
  var descender = lineHeight-baseline
  var letterSpacing = opt.letterSpacing || 0
  var height = lineHeight * lines.length - descender
  var align = getAlignType(this._opt.align)

  //draw text along baseline
  y -= height
  
  //the metrics for this text layout
  this._width = maxLineWidth
  this._height = height
  this._descender = lineHeight - baseline
  this._baseline = baseline
  this._xHeight = getXHeight(font)
  this._capHeight = getCapHeight(font)
  this._lineHeight = lineHeight
  this._ascender = lineHeight - descender - this._xHeight
    
  //layout each glyph
  var self = this
  lines.forEach(function(line, lineIndex) {
    var start = line.start
    var end = line.end
    var lineWidth = line.width
    var lastGlyph
    
    //for each glyph in that line...
    for (var i=start; i<end; i++) {
      var id = text.charCodeAt(i)
      var glyph = self.getGlyph(font, id)
      if (glyph) {
        if (lastGlyph) 
          x += getKerning(font, lastGlyph.id, glyph.id)

        var tx = x
        if (align === ALIGN_CENTER) 
          tx += (maxLineWidth-lineWidth)/2
        else if (align === ALIGN_RIGHT)
          tx += (maxLineWidth-lineWidth)

        glyphs.push({
          position: [tx, y],
          data: glyph,
          index: i,
          line: lineIndex
        })  

        //move pen forward
        x += glyph.xadvance + letterSpacing
        lastGlyph = glyph
      }
    }

    //next line down
    y += lineHeight
    x = 0
  })
  this._linesTotal = lines.length;
}

TextLayout.prototype._setupSpaceGlyphs = function(font) {
  //These are fallbacks, when the font doesn't include
  //' ' or '\t' glyphs
  this._fallbackSpaceGlyph = null
  this._fallbackTabGlyph = null

  if (!font.chars || font.chars.length === 0)
    return

  //try to get space glyph
  //then fall back to the 'm' or 'w' glyphs
  //then fall back to the first glyph available
  var space = getGlyphById(font, SPACE_ID) 
          || getMGlyph(font) 
          || font.chars[0]

  //and create a fallback for tab
  var tabWidth = this._opt.tabSize * space.xadvance
  this._fallbackSpaceGlyph = space
  this._fallbackTabGlyph = xtend(space, {
    x: 0, y: 0, xadvance: tabWidth, id: TAB_ID, 
    xoffset: 0, yoffset: 0, width: 0, height: 0
  })
}

TextLayout.prototype.getGlyph = function(font, id) {
  var glyph = getGlyphById(font, id)
  if (glyph)
    return glyph
  else if (id === TAB_ID) 
    return this._fallbackTabGlyph
  else if (id === SPACE_ID) 
    return this._fallbackSpaceGlyph
  return null
}

TextLayout.prototype.computeMetrics = function(text, start, end, width) {
  var letterSpacing = this._opt.letterSpacing || 0
  var font = this._opt.font
  var curPen = 0
  var curWidth = 0
  var count = 0
  var glyph
  var lastGlyph

  if (!font.chars || font.chars.length === 0) {
    return {
      start: start,
      end: start,
      width: 0
    }
  }

  end = Math.min(text.length, end)
  for (var i=start; i < end; i++) {
    var id = text.charCodeAt(i)
    var glyph = this.getGlyph(font, id)

    if (glyph) {
      //move pen forward
      var xoff = glyph.xoffset
      var kern = lastGlyph ? getKerning(font, lastGlyph.id, glyph.id) : 0
      curPen += kern

      var nextPen = curPen + glyph.xadvance + letterSpacing
      var nextWidth = curPen + glyph.width

      //we've hit our limit; we can't move onto the next glyph
      if (nextWidth >= width || nextPen >= width)
        break

      //otherwise continue along our line
      curPen = nextPen
      curWidth = nextWidth
      lastGlyph = glyph
    }
    count++
  }
  
  //make sure rightmost edge lines up with rendered glyphs
  if (lastGlyph)
    curWidth += lastGlyph.xoffset

  return {
    start: start,
    end: start + count,
    width: curWidth
  }
}

//getters for the private vars
;['width', 'height', 
  'descender', 'ascender',
  'xHeight', 'baseline',
  'capHeight',
  'lineHeight' ].forEach(addGetter)

function addGetter(name) {
  Object.defineProperty(TextLayout.prototype, name, {
    get: wrapper(name),
    configurable: true
  })
}

//create lookups for private vars
function wrapper(name) {
  return (new Function([
    'return function '+name+'() {',
    '  return this._'+name,
    '}'
  ].join('\n')))()
}

function getGlyphById(font, id) {
  if (!font.chars || font.chars.length === 0)
    return null

  var glyphIdx = findChar(font.chars, id)
  if (glyphIdx >= 0)
    return font.chars[glyphIdx]
  return null
}

function getXHeight(font) {
  for (var i=0; i<X_HEIGHTS.length; i++) {
    var id = X_HEIGHTS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx].height
  }
  return 0
}

function getMGlyph(font) {
  for (var i=0; i<M_WIDTHS.length; i++) {
    var id = M_WIDTHS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx]
  }
  return 0
}

function getCapHeight(font) {
  for (var i=0; i<CAP_HEIGHTS.length; i++) {
    var id = CAP_HEIGHTS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx].height
  }
  return 0
}

function getKerning(font, left, right) {
  if (!font.kernings || font.kernings.length === 0)
    return 0

  var table = font.kernings
  for (var i=0; i<table.length; i++) {
    var kern = table[i]
    if (kern.first === left && kern.second === right)
      return kern.amount
  }
  return 0
}

function getAlignType(align) {
  if (align === 'center')
    return ALIGN_CENTER
  else if (align === 'right')
    return ALIGN_RIGHT
  return ALIGN_LEFT
}
},{"as-number":20,"indexof-property":24,"word-wrapper":36,"xtend":37}],28:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],29:[function(require,module,exports){
module.exports = function parseBMFontAscii(data) {
  if (!data)
    throw new Error('no data provided')
  data = data.toString().trim()

  var output = {
    pages: [],
    chars: [],
    kernings: []
  }

  var lines = data.split(/\r\n?|\n/g)

  if (lines.length === 0)
    throw new Error('no data in BMFont file')

  for (var i = 0; i < lines.length; i++) {
    var lineData = splitLine(lines[i], i)
    if (!lineData) //skip empty lines
      continue

    if (lineData.key === 'page') {
      if (typeof lineData.data.id !== 'number')
        throw new Error('malformed file at line ' + i + ' -- needs page id=N')
      if (typeof lineData.data.file !== 'string')
        throw new Error('malformed file at line ' + i + ' -- needs page file="path"')
      output.pages[lineData.data.id] = lineData.data.file
    } else if (lineData.key === 'chars' || lineData.key === 'kernings') {
      //... do nothing for these two ...
    } else if (lineData.key === 'char') {
      output.chars.push(lineData.data)
    } else if (lineData.key === 'kerning') {
      output.kernings.push(lineData.data)
    } else {
      output[lineData.key] = lineData.data
    }
  }

  return output
}

function splitLine(line, idx) {
  line = line.replace(/\t+/g, ' ').trim()
  if (!line)
    return null

  var space = line.indexOf(' ')
  if (space === -1) 
    throw new Error("no named row at line " + idx)

  var key = line.substring(0, space)

  line = line.substring(space + 1)
  //clear "letter" field as it is non-standard and
  //requires additional complexity to parse " / = symbols
  line = line.replace(/letter=[\'\"]\S+[\'\"]/gi, '')  
  line = line.split("=")
  line = line.map(function(str) {
    return str.trim().match((/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g))
  })

  var data = []
  for (var i = 0; i < line.length; i++) {
    var dt = line[i]
    if (i === 0) {
      data.push({
        key: dt[0],
        data: ""
      })
    } else if (i === line.length - 1) {
      data[data.length - 1].data = parseData(dt[0])
    } else {
      data[data.length - 1].data = parseData(dt[0])
      data.push({
        key: dt[1],
        data: ""
      })
    }
  }

  var out = {
    key: key,
    data: {}
  }

  data.forEach(function(v) {
    out.data[v.key] = v.data;
  })

  return out
}

function parseData(data) {
  if (!data || data.length === 0)
    return ""

  if (data.indexOf('"') === 0 || data.indexOf("'") === 0)
    return data.substring(1, data.length - 1)
  if (data.indexOf(',') !== -1)
    return parseIntList(data)
  return parseInt(data, 10)
}

function parseIntList(data) {
  return data.split(',').map(function(val) {
    return parseInt(val, 10)
  })
}
},{}],30:[function(require,module,exports){
var dtype = require('dtype')
var anArray = require('an-array')
var isBuffer = require('is-buffer')

var CW = [0, 2, 3]
var CCW = [2, 1, 3]

module.exports = function createQuadElements(array, opt) {
    //if user didn't specify an output array
    if (!array || !(anArray(array) || isBuffer(array))) {
        opt = array || {}
        array = null
    }

    if (typeof opt === 'number') //backwards-compatible
        opt = { count: opt }
    else
        opt = opt || {}

    var type = typeof opt.type === 'string' ? opt.type : 'uint16'
    var count = typeof opt.count === 'number' ? opt.count : 1
    var start = (opt.start || 0) 

    var dir = opt.clockwise !== false ? CW : CCW,
        a = dir[0], 
        b = dir[1],
        c = dir[2]

    var numIndices = count * 6

    var indices = array || new (dtype(type))(numIndices)
    for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
        var x = i + start
        indices[x + 0] = j + 0
        indices[x + 1] = j + 1
        indices[x + 2] = j + 2
        indices[x + 3] = j + a
        indices[x + 4] = j + b
        indices[x + 5] = j + c
    }
    return indices
}
},{"an-array":19,"dtype":21,"is-buffer":26}],31:[function(require,module,exports){
var createLayout = require('layout-bmfont-text')
var inherits = require('inherits')
var createIndices = require('quad-indices')
var buffer = require('three-buffer-vertex-data')
var assign = require('object-assign')

var vertices = require('./lib/vertices')
var utils = require('./lib/utils')

var Base = THREE.BufferGeometry

module.exports = function createTextGeometry (opt) {
  return new TextGeometry(opt)
}

function TextGeometry (opt) {
  Base.call(this)

  if (typeof opt === 'string') {
    opt = { text: opt }
  }

  // use these as default values for any subsequent
  // calls to update()
  this._opt = assign({}, opt)

  // also do an initial setup...
  if (opt) this.update(opt)
}

inherits(TextGeometry, Base)

TextGeometry.prototype.update = function (opt) {
  if (typeof opt === 'string') {
    opt = { text: opt }
  }

  // use constructor defaults
  opt = assign({}, this._opt, opt)

  if (!opt.font) {
    throw new TypeError('must specify a { font } in options')
  }

  this.layout = createLayout(opt)

  // get vec2 texcoords
  var flipY = opt.flipY !== false

  // the desired BMFont data
  var font = opt.font

  // determine texture size from font file
  var texWidth = font.common.scaleW
  var texHeight = font.common.scaleH

  // get visible glyphs
  var glyphs = this.layout.glyphs.filter(function (glyph) {
    var bitmap = glyph.data
    return bitmap.width * bitmap.height > 0
  })

  // provide visible glyphs for convenience
  this.visibleGlyphs = glyphs

  // get common vertex data
  var positions = vertices.positions(glyphs)
  var uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY)
  var indices = createIndices({
    clockwise: true,
    type: 'uint16',
    count: glyphs.length
  })

  // update vertex data
  buffer.index(this, indices, 1, 'uint16')
  buffer.attr(this, 'position', positions, 2)
  buffer.attr(this, 'uv', uvs, 2)

  // update multipage data
  if (!opt.multipage && 'page' in this.attributes) {
    // disable multipage rendering
    this.removeAttribute('page')
  } else if (opt.multipage) {
    var pages = vertices.pages(glyphs)
    // enable multipage rendering
    buffer.attr(this, 'page', pages, 1)
  }
}

TextGeometry.prototype.computeBoundingSphere = function () {
  if (this.boundingSphere === null) {
    this.boundingSphere = new THREE.Sphere()
  }

  var positions = this.attributes.position.array
  var itemSize = this.attributes.position.itemSize
  if (!positions || !itemSize || positions.length < 2) {
    this.boundingSphere.radius = 0
    this.boundingSphere.center.set(0, 0, 0)
    return
  }
  utils.computeSphere(positions, this.boundingSphere)
  if (isNaN(this.boundingSphere.radius)) {
    console.error('THREE.BufferGeometry.computeBoundingSphere(): ' +
      'Computed radius is NaN. The ' +
      '"position" attribute is likely to have NaN values.')
  }
}

TextGeometry.prototype.computeBoundingBox = function () {
  if (this.boundingBox === null) {
    this.boundingBox = new THREE.Box3()
  }

  var bbox = this.boundingBox
  var positions = this.attributes.position.array
  var itemSize = this.attributes.position.itemSize
  if (!positions || !itemSize || positions.length < 2) {
    bbox.makeEmpty()
    return
  }
  utils.computeBox(positions, bbox)
}

},{"./lib/utils":32,"./lib/vertices":33,"inherits":25,"layout-bmfont-text":27,"object-assign":28,"quad-indices":30,"three-buffer-vertex-data":35}],32:[function(require,module,exports){
var itemSize = 2
var box = { min: [0, 0], max: [0, 0] }

function bounds (positions) {
  var count = positions.length / itemSize
  box.min[0] = positions[0]
  box.min[1] = positions[1]
  box.max[0] = positions[0]
  box.max[1] = positions[1]

  for (var i = 0; i < count; i++) {
    var x = positions[i * itemSize + 0]
    var y = positions[i * itemSize + 1]
    box.min[0] = Math.min(x, box.min[0])
    box.min[1] = Math.min(y, box.min[1])
    box.max[0] = Math.max(x, box.max[0])
    box.max[1] = Math.max(y, box.max[1])
  }
}

module.exports.computeBox = function (positions, output) {
  bounds(positions)
  output.min.set(box.min[0], box.min[1], 0)
  output.max.set(box.max[0], box.max[1], 0)
}

module.exports.computeSphere = function (positions, output) {
  bounds(positions)
  var minX = box.min[0]
  var minY = box.min[1]
  var maxX = box.max[0]
  var maxY = box.max[1]
  var width = maxX - minX
  var height = maxY - minY
  var length = Math.sqrt(width * width + height * height)
  output.center.set(minX + width / 2, minY + height / 2, 0)
  output.radius = length / 2
}

},{}],33:[function(require,module,exports){
module.exports.pages = function pages (glyphs) {
  var pages = new Float32Array(glyphs.length * 4 * 1)
  var i = 0
  glyphs.forEach(function (glyph) {
    var id = glyph.data.page || 0
    pages[i++] = id
    pages[i++] = id
    pages[i++] = id
    pages[i++] = id
  })
  return pages
}

module.exports.uvs = function uvs (glyphs, texWidth, texHeight, flipY) {
  var uvs = new Float32Array(glyphs.length * 4 * 2)
  var i = 0
  glyphs.forEach(function (glyph) {
    var bitmap = glyph.data
    var bw = (bitmap.x + bitmap.width)
    var bh = (bitmap.y + bitmap.height)

    // top left position
    var u0 = bitmap.x / texWidth
    var v1 = bitmap.y / texHeight
    var u1 = bw / texWidth
    var v0 = bh / texHeight

    if (flipY) {
      v1 = (texHeight - bitmap.y) / texHeight
      v0 = (texHeight - bh) / texHeight
    }

    // BL
    uvs[i++] = u0
    uvs[i++] = v1
    // TL
    uvs[i++] = u0
    uvs[i++] = v0
    // TR
    uvs[i++] = u1
    uvs[i++] = v0
    // BR
    uvs[i++] = u1
    uvs[i++] = v1
  })
  return uvs
}

module.exports.positions = function positions (glyphs) {
  var positions = new Float32Array(glyphs.length * 4 * 2)
  var i = 0
  glyphs.forEach(function (glyph) {
    var bitmap = glyph.data

    // bottom left position
    var x = glyph.position[0] + bitmap.xoffset
    var y = glyph.position[1] + bitmap.yoffset

    // quad size
    var w = bitmap.width
    var h = bitmap.height

    // BL
    positions[i++] = x
    positions[i++] = y
    // TL
    positions[i++] = x
    positions[i++] = y + h
    // TR
    positions[i++] = x + w
    positions[i++] = y + h
    // BR
    positions[i++] = x + w
    positions[i++] = y
  })
  return positions
}

},{}],34:[function(require,module,exports){
var assign = require('object-assign')

module.exports = function createSDFShader (opt) {
  opt = opt || {}
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001
  var precision = opt.precision || 'highp'
  var color = opt.color
  var map = opt.map

  // remove to satisfy r73
  delete opt.map
  delete opt.color
  delete opt.precision
  delete opt.opacity

  return assign({
    uniforms: {
      opacity: { type: 'f', value: opacity },
      map: { type: 't', value: map || new THREE.Texture() },
      color: { type: 'c', value: new THREE.Color(color) }
    },
    vertexShader: [
      'attribute vec2 uv;',
      'attribute vec4 position;',
      'uniform mat4 projectionMatrix;',
      'uniform mat4 modelViewMatrix;',
      'varying vec2 vUv;',
      'void main() {',
      'vUv = uv;',
      'gl_Position = projectionMatrix * modelViewMatrix * position;',
      '}'
    ].join('\n'),
    fragmentShader: [
      '#ifdef GL_OES_standard_derivatives',
      '#extension GL_OES_standard_derivatives : enable',
      '#endif',
      'precision ' + precision + ' float;',
      'uniform float opacity;',
      'uniform vec3 color;',
      'uniform sampler2D map;',
      'varying vec2 vUv;',

      'float aastep(float value) {',
      '  #ifdef GL_OES_standard_derivatives',
      '    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;',
      '  #else',
      '    float afwidth = (1.0 / 32.0) * (1.4142135623730951 / (2.0 * gl_FragCoord.w));',
      '  #endif',
      '  return smoothstep(0.5 - afwidth, 0.5 + afwidth, value);',
      '}',

      'void main() {',
      '  vec4 texColor = texture2D(map, vUv);',
      '  float alpha = aastep(texColor.a);',
      '  gl_FragColor = vec4(color, opacity * alpha);',
      alphaTest === 0
        ? ''
        : '  if (gl_FragColor.a < ' + alphaTest + ') discard;',
      '}'
    ].join('\n')
  }, opt)
}

},{"object-assign":28}],35:[function(require,module,exports){
var flatten = require('flatten-vertex-data')
var warned = false;

module.exports.attr = setAttribute
module.exports.index = setIndex

function setIndex (geometry, data, itemSize, dtype) {
  if (typeof itemSize !== 'number') itemSize = 1
  if (typeof dtype !== 'string') dtype = 'uint16'

  var isR69 = !geometry.index && typeof geometry.setIndex !== 'function'
  var attrib = isR69 ? geometry.getAttribute('index') : geometry.index
  var newAttrib = updateAttribute(attrib, data, itemSize, dtype)
  if (newAttrib) {
    if (isR69) geometry.addAttribute('index', newAttrib)
    else geometry.index = newAttrib
  }
}

function setAttribute (geometry, key, data, itemSize, dtype) {
  if (typeof itemSize !== 'number') itemSize = 3
  if (typeof dtype !== 'string') dtype = 'float32'
  if (Array.isArray(data) &&
    Array.isArray(data[0]) &&
    data[0].length !== itemSize) {
    throw new Error('Nested vertex array has unexpected size; expected ' +
      itemSize + ' but found ' + data[0].length)
  }

  var attrib = geometry.getAttribute(key)
  var newAttrib = updateAttribute(attrib, data, itemSize, dtype)
  if (newAttrib) {
    geometry.addAttribute(key, newAttrib)
  }
}

function updateAttribute (attrib, data, itemSize, dtype) {
  data = data || []
  if (!attrib || rebuildAttribute(attrib, data, itemSize)) {
    // create a new array with desired type
    data = flatten(data, dtype)

    var needsNewBuffer = attrib && typeof attrib.setArray !== 'function'
    if (!attrib || needsNewBuffer) {
      // We are on an old version of ThreeJS which can't
      // support growing / shrinking buffers, so we need
      // to build a new buffer
      if (needsNewBuffer && !warned) {
        warned = true
        console.warn([
          'A WebGL buffer is being updated with a new size or itemSize, ',
          'however this version of ThreeJS only supports fixed-size buffers.',
          '\nThe old buffer may still be kept in memory.\n',
          'To avoid memory leaks, it is recommended that you dispose ',
          'your geometries and create new ones, or update to ThreeJS r82 or newer.\n',
          'See here for discussion:\n',
          'https://github.com/mrdoob/three.js/pull/9631'
        ].join(''))
      }

      // Build a new attribute
      attrib = new THREE.BufferAttribute(data, itemSize);
    }

    attrib.itemSize = itemSize
    attrib.needsUpdate = true

    // New versions of ThreeJS suggest using setArray
    // to change the data. It will use bufferData internally,
    // so you can change the array size without any issues
    if (typeof attrib.setArray === 'function') {
      attrib.setArray(data)
    }

    return attrib
  } else {
    // copy data into the existing array
    flatten(data, attrib.array)
    attrib.needsUpdate = true
    return null
  }
}

// Test whether the attribute needs to be re-created,
// returns false if we can re-use it as-is.
function rebuildAttribute (attrib, data, itemSize) {
  if (attrib.itemSize !== itemSize) return true
  if (!attrib.array) return true
  var attribLength = attrib.array.length
  if (Array.isArray(data) && Array.isArray(data[0])) {
    // [ [ x, y, z ] ]
    return attribLength !== data.length * itemSize
  } else {
    // [ x, y, z ]
    return attribLength !== data.length
  }
  return false
}

},{"flatten-vertex-data":23}],36:[function(require,module,exports){
var newline = /\n/
var newlineChar = '\n'
var whitespace = /\s/

module.exports = function(text, opt) {
    var lines = module.exports.lines(text, opt)
    return lines.map(function(line) {
        return text.substring(line.start, line.end)
    }).join('\n')
}

module.exports.lines = function wordwrap(text, opt) {
    opt = opt||{}

    //zero width results in nothing visible
    if (opt.width === 0 && opt.mode !== 'nowrap') 
        return []

    text = text||''
    var width = typeof opt.width === 'number' ? opt.width : Number.MAX_VALUE
    var start = Math.max(0, opt.start||0)
    var end = typeof opt.end === 'number' ? opt.end : text.length
    var mode = opt.mode

    var measure = opt.measure || monospace
    if (mode === 'pre')
        return pre(measure, text, start, end, width)
    else
        return greedy(measure, text, start, end, width, mode)
}

function idxOf(text, chr, start, end) {
    var idx = text.indexOf(chr, start)
    if (idx === -1 || idx > end)
        return end
    return idx
}

function isWhitespace(chr) {
    return whitespace.test(chr)
}

function pre(measure, text, start, end, width) {
    var lines = []
    var lineStart = start
    for (var i=start; i<end && i<text.length; i++) {
        var chr = text.charAt(i)
        var isNewline = newline.test(chr)

        //If we've reached a newline, then step down a line
        //Or if we've reached the EOF
        if (isNewline || i===end-1) {
            var lineEnd = isNewline ? i : i+1
            var measured = measure(text, lineStart, lineEnd, width)
            lines.push(measured)
            
            lineStart = i+1
        }
    }
    return lines
}

function greedy(measure, text, start, end, width, mode) {
    //A greedy word wrapper based on LibGDX algorithm
    //https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/BitmapFontCache.java
    var lines = []

    var testWidth = width
    //if 'nowrap' is specified, we only wrap on newline chars
    if (mode === 'nowrap')
        testWidth = Number.MAX_VALUE

    while (start < end && start < text.length) {
        //get next newline position
        var newLine = idxOf(text, newlineChar, start, end)

        //eat whitespace at start of line
        while (start < newLine) {
            if (!isWhitespace( text.charAt(start) ))
                break
            start++
        }

        //determine visible # of glyphs for the available width
        var measured = measure(text, start, newLine, testWidth)

        var lineEnd = start + (measured.end-measured.start)
        var nextStart = lineEnd + newlineChar.length

        //if we had to cut the line before the next newline...
        if (lineEnd < newLine) {
            //find char to break on
            while (lineEnd > start) {
                if (isWhitespace(text.charAt(lineEnd)))
                    break
                lineEnd--
            }
            if (lineEnd === start) {
                if (nextStart > start + newlineChar.length) nextStart--
                lineEnd = nextStart // If no characters to break, show all.
            } else {
                nextStart = lineEnd
                //eat whitespace at end of line
                while (lineEnd > start) {
                    if (!isWhitespace(text.charAt(lineEnd - newlineChar.length)))
                        break
                    lineEnd--
                }
            }
        }
        if (lineEnd >= start) {
            var result = measure(text, start, lineEnd, testWidth)
            lines.push(result)
        }
        start = nextStart
    }
    return lines
}

//determines the visible number of glyphs within a given width
function monospace(text, start, end, width) {
    var glyphs = Math.min(width, end-start)
    return {
        start: start,
        end: start+glyphs
    }
}
},{}],37:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcYnV0dG9uLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNoZWNrYm94LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNvbG9ycy5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxkcm9wZG93bi5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxmb2xkZXIuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcZm9udC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxncmFiLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGdyYXBoaWMuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcaW1hZ2VidXR0b24uanMiLCJtb2R1bGVzXFxkYXRndWl2clxcaW5kZXguanMiLCJtb2R1bGVzXFxkYXRndWl2clxcaW50ZXJhY3Rpb24uanMiLCJtb2R1bGVzXFxkYXRndWl2clxcbGF5b3V0LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHBhbGV0dGUuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcc2RmdGV4dC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxzaGFyZWRtYXRlcmlhbHMuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcc2xpZGVyLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHRleHRsYWJlbC5qcyIsIm1vZHVsZXNcXHRoaXJkcGFydHlcXFN1YmRpdmlzaW9uTW9kaWZpZXIuanMiLCJub2RlX21vZHVsZXMvYW4tYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXMtbnVtYmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2R0eXBlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvZmxhdHRlbi12ZXJ0ZXgtZGF0YS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbmRleG9mLXByb3BlcnR5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xheW91dC1ibWZvbnQtdGV4dC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlLWJtZm9udC1hc2NpaS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9xdWFkLWluZGljZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvbGliL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L2xpYi92ZXJ0aWNlcy5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9zaGFkZXJzL3NkZi5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1idWZmZXItdmVydGV4LWRhdGEvaW5kZXguanMiLCJub2RlX21vZHVsZXMvd29yZC13cmFwcGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3h0ZW5kL2ltbXV0YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O2tCQzRCd0IsWTs7QUFUeEI7O0lBQVksbUI7O0FBRVo7Ozs7QUFDQTs7OztBQUNBOztJQUFZLE07O0FBQ1o7O0lBQVksTTs7QUFDWjs7SUFBWSxlOztBQUNaOztJQUFZLEk7Ozs7OztBQUVHLFNBQVMsWUFBVCxHQU9QO0FBQUEsaUZBQUosRUFBSTtBQUFBLE1BTk4sV0FNTSxRQU5OLFdBTU07QUFBQSxNQUxOLE1BS00sUUFMTixNQUtNO0FBQUEsK0JBSk4sWUFJTTtBQUFBLE1BSk4sWUFJTSxxQ0FKUyxXQUlUO0FBQUEsd0JBSE4sS0FHTTtBQUFBLE1BSE4sS0FHTSw4QkFIRSxPQUFPLFdBR1Q7QUFBQSx5QkFGTixNQUVNO0FBQUEsTUFGTixNQUVNLCtCQUZHLE9BQU8sWUFFVjtBQUFBLHdCQUROLEtBQ007QUFBQSxN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YUFBUyxLQUFULEdBQWlCLFFBQWpCO0FBQ0EsUUFBSyxNQUFMLEVBQWMsU0FBUyxhQUFULENBQXdCLENBQXhCLElBQThCLE1BQTlCOztBQUVkO0FBRUEsR0FuUEQ7QUFxUEEsQ0E1VkQ7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBTdWJkaXZpc2lvbk1vZGlmaWVyIGZyb20gJy4uL3RoaXJkcGFydHkvU3ViZGl2aXNpb25Nb2RpZmllcic7XHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVCdXR0b24oIHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBvYmplY3QsXHJcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXHJcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXHJcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcclxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxyXG59ID0ge30gKXtcclxuXHJcbiAgY29uc3QgQlVUVE9OX1dJRFRIID0gd2lkdGggKiAwLjUgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IEJVVFRPTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IEJVVFRPTl9ERVBUSCA9IExheW91dC5CVVRUT05fREVQVEg7XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIGdyb3VwLmFkZCggcGFuZWwgKTtcclxuXHJcbiAgLy8gIGJhc2UgY2hlY2tib3hcclxuICBjb25zdCBkaXZpc2lvbnMgPSA0O1xyXG4gIGNvbnN0IGFzcGVjdFJhdGlvID0gQlVUVE9OX1dJRFRIIC8gQlVUVE9OX0hFSUdIVDtcclxuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBCVVRUT05fV0lEVEgsIEJVVFRPTl9IRUlHSFQsIEJVVFRPTl9ERVBUSCwgTWF0aC5mbG9vciggZGl2aXNpb25zICogYXNwZWN0UmF0aW8gKSwgZGl2aXNpb25zLCBkaXZpc2lvbnMgKTtcclxuICBjb25zdCBtb2RpZmllciA9IG5ldyBUSFJFRS5TdWJkaXZpc2lvbk1vZGlmaWVyKCAxICk7XHJcbiAgbW9kaWZpZXIubW9kaWZ5KCByZWN0ICk7XHJcbiAgcmVjdC50cmFuc2xhdGUoIEJVVFRPTl9XSURUSCAqIDAuNSwgMCwgMCApO1xyXG5cclxuICAvLyAgaGl0c2NhbiB2b2x1bWVcclxuICBjb25zdCBoaXRzY2FuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcclxuICBoaXRzY2FuTWF0ZXJpYWwudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICBjb25zdCBoaXRzY2FuVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgaGl0c2Nhbk1hdGVyaWFsICk7XHJcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gQlVUVE9OX0RFUFRIICogMC41O1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xyXG5cclxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiBDb2xvcnMuQlVUVE9OX0NPTE9SIH0pO1xyXG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xyXG5cclxuXHJcbiAgY29uc3QgYnV0dG9uTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSwgeyBzY2FsZTogMC44NjYgfSApO1xyXG5cclxuICAvLyAgVGhpcyBpcyBhIHJlYWwgaGFjayBzaW5jZSB3ZSBuZWVkIHRvIGZpdCB0aGUgdGV4dCBwb3NpdGlvbiB0byB0aGUgZm9udCBzY2FsaW5nXHJcbiAgLy8gIFBsZWFzZSBmaXggbWUuXHJcbiAgYnV0dG9uTGFiZWwucG9zaXRpb24ueCA9IEJVVFRPTl9XSURUSCAqIDAuNSAtIGJ1dHRvbkxhYmVsLmxheW91dC53aWR0aCAqIDAuMDAwMDExICogMC41O1xyXG4gIGJ1dHRvbkxhYmVsLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAxLjI7XHJcbiAgYnV0dG9uTGFiZWwucG9zaXRpb24ueSA9IC0wLjAyNTtcclxuICBmaWxsZWRWb2x1bWUuYWRkKCBidXR0b25MYWJlbCApO1xyXG5cclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcblxyXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfQlVUVE9OICk7XHJcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIGNvbnRyb2xsZXJJRCApO1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUmVsZWFzZWQnLCBoYW5kbGVPblJlbGVhc2UgKTtcclxuXHJcbiAgdXBkYXRlVmlldygpO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblByZXNzKCBwICl7XHJcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0oKTtcclxuXHJcbiAgICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAwLjE7XHJcblxyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25SZWxlYXNlKCl7XHJcbiAgICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAwLjU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcblxyXG4gICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuQlVUVE9OX0hJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuQlVUVE9OX0NPTE9SICk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG5cclxuICBncm91cC51cGRhdGVDb250cm9sID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xyXG4gICAgaW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIGdyYWJJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgdXBkYXRlVmlldygpO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlTGFiZWwoIHN0ciApO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0ICogYXMgR3JhcGhpYyBmcm9tICcuL2dyYXBoaWMnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDaGVja2JveCgge1xyXG4gIHRleHRDcmVhdG9yLFxyXG4gIG9iamVjdCxcclxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcclxuICBpbml0aWFsVmFsdWUgPSBmYWxzZSxcclxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcclxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxyXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXHJcbn0gPSB7fSApe1xyXG5cclxuICBjb25zdCBDSEVDS0JPWF9XSURUSCA9IExheW91dC5DSEVDS0JPWF9TSVpFO1xyXG4gIGNvbnN0IENIRUNLQk9YX0hFSUdIVCA9IENIRUNLQk9YX1dJRFRIO1xyXG4gIGNvbnN0IENIRUNLQk9YX0RFUFRIID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IElOQUNUSVZFX1NDQUxFID0gMC4wMDE7XHJcbiAgY29uc3QgQUNUSVZFX1NDQUxFID0gMC45O1xyXG5cclxuICBjb25zdCBzdGF0ZSA9IHtcclxuICAgIHZhbHVlOiBpbml0aWFsVmFsdWUsXHJcbiAgICBsaXN0ZW46IGZhbHNlXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XHJcbiAgZ3JvdXAuYWRkKCBwYW5lbCApO1xyXG5cclxuICAvLyAgYmFzZSBjaGVja2JveFxyXG4gIGNvbnN0IHJlY3QgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIENIRUNLQk9YX1dJRFRILCBDSEVDS0JPWF9IRUlHSFQsIENIRUNLQk9YX0RFUFRIICk7XHJcbiAgcmVjdC50cmFuc2xhdGUoIENIRUNLQk9YX1dJRFRIICogMC41LCAwLCAwICk7XHJcblxyXG5cclxuICAvLyAgaGl0c2NhbiB2b2x1bWVcclxuICBjb25zdCBoaXRzY2FuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcclxuICBoaXRzY2FuTWF0ZXJpYWwudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICBjb25zdCBoaXRzY2FuVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgaGl0c2Nhbk1hdGVyaWFsICk7XHJcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi54ID0gd2lkdGggKiAwLjU7XHJcblxyXG4gIC8vICBvdXRsaW5lIHZvbHVtZVxyXG4gIC8vIGNvbnN0IG91dGxpbmUgPSBuZXcgVEhSRUUuQm94SGVscGVyKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgLy8gb3V0bGluZS5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5PVVRMSU5FX0NPTE9SICk7XHJcblxyXG4gIC8vICBjaGVja2JveCB2b2x1bWVcclxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiBDb2xvcnMuQ0hFQ0tCT1hfQkdfQ09MT1IgfSk7XHJcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcclxuICAvLyBmaWxsZWRWb2x1bWUuc2NhbGUuc2V0KCBBQ1RJVkVfU0NBTEUsIEFDVElWRV9TQ0FMRSxBQ1RJVkVfU0NBTEUgKTtcclxuICBoaXRzY2FuVm9sdW1lLmFkZCggZmlsbGVkVm9sdW1lICk7XHJcblxyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcclxuXHJcbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9DSEVDS0JPWCApO1xyXG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IGJvcmRlckJveCA9IExheW91dC5jcmVhdGVQYW5lbCggQ0hFQ0tCT1hfV0lEVEggKyBMYXlvdXQuQk9SREVSX1RISUNLTkVTUywgQ0hFQ0tCT1hfSEVJR0hUICsgTGF5b3V0LkJPUkRFUl9USElDS05FU1MsIENIRUNLQk9YX0RFUFRILCB0cnVlICk7XHJcbiAgYm9yZGVyQm94Lm1hdGVyaWFsLmNvbG9yLnNldEhleCggMHgxZjdhZTcgKTtcclxuICBib3JkZXJCb3gucG9zaXRpb24ueCA9IC1MYXlvdXQuQk9SREVSX1RISUNLTkVTUyAqIDAuNSArIHdpZHRoICogMC41O1xyXG4gIGJvcmRlckJveC5wb3NpdGlvbi56ID0gZGVwdGggKiAwLjU7XHJcblxyXG4gIGNvbnN0IGNoZWNrbWFyayA9IEdyYXBoaWMuY2hlY2ttYXJrKCk7XHJcbiAgY2hlY2ttYXJrLnBvc2l0aW9uLnogPSBkZXB0aCAqIDAuNTE7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGNoZWNrbWFyayApO1xyXG5cclxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgaGl0c2NhblZvbHVtZSwgY29udHJvbGxlcklELCBib3JkZXJCb3ggKTtcclxuXHJcbiAgLy8gZ3JvdXAuYWRkKCBmaWxsZWRWb2x1bWUsIG91dGxpbmUsIGhpdHNjYW5Wb2x1bWUsIGRlc2NyaXB0b3JMYWJlbCApO1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xyXG5cclxuICB1cGRhdGVWaWV3KCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoIHAgKXtcclxuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGUudmFsdWUgPSAhc3RhdGUudmFsdWU7XHJcblxyXG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IHN0YXRlLnZhbHVlO1xyXG5cclxuICAgIGlmKCBvbkNoYW5nZWRDQiApe1xyXG4gICAgICBvbkNoYW5nZWRDQiggc3RhdGUudmFsdWUgKTtcclxuICAgIH1cclxuXHJcbiAgICBwLmxvY2tlZCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcblxyXG4gICAgaWYoIHN0YXRlLnZhbHVlICl7XHJcbiAgICAgIGNoZWNrbWFyay52aXNpYmxlID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGNoZWNrbWFyay52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xyXG4gICAgICBib3JkZXJCb3gudmlzaWJsZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBib3JkZXJCb3gudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGxldCBvbkNoYW5nZWRDQjtcclxuICBsZXQgb25GaW5pc2hDaGFuZ2VDQjtcclxuXHJcbiAgZ3JvdXAub25DaGFuZ2UgPSBmdW5jdGlvbiggY2FsbGJhY2sgKXtcclxuICAgIG9uQ2hhbmdlZENCID0gY2FsbGJhY2s7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG5cclxuICBncm91cC5saXN0ZW4gPSBmdW5jdGlvbigpe1xyXG4gICAgc3RhdGUubGlzdGVuID0gdHJ1ZTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5uYW1lID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZUxhYmVsKCBzdHIgKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC51cGRhdGVDb250cm9sID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xyXG4gICAgaWYoIHN0YXRlLmxpc3RlbiApe1xyXG4gICAgICBzdGF0ZS52YWx1ZSA9IG9iamVjdFsgcHJvcGVydHlOYW1lIF07XHJcbiAgICB9XHJcbiAgICBpbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB1cGRhdGVWaWV3KCk7XHJcbiAgfTtcclxuXHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5leHBvcnQgY29uc3QgREVGQVVMVF9DT0xPUiA9IDB4MkZBMUQ2O1xyXG5leHBvcnQgY29uc3QgSElHSExJR0hUX0NPTE9SID0gMHg0M2I1ZWE7XHJcbmV4cG9ydCBjb25zdCBJTlRFUkFDVElPTl9DT0xPUiA9IDB4MDdBQkY3O1xyXG5leHBvcnQgY29uc3QgRU1JU1NJVkVfQ09MT1IgPSAweDIyMjIyMjtcclxuZXhwb3J0IGNvbnN0IEhJR0hMSUdIVF9FTUlTU0lWRV9DT0xPUiA9IDB4OTk5OTk5O1xyXG5leHBvcnQgY29uc3QgT1VUTElORV9DT0xPUiA9IDB4OTk5OTk5O1xyXG5leHBvcnQgY29uc3QgREVGQVVMVF9CQUNLID0gMHgxYTFhMWE7XHJcbmV4cG9ydCBjb25zdCBERUZBVUxUX0ZPTERFUl9CQUNLID0gMHgxMDEwMTA7XHJcbmV4cG9ydCBjb25zdCBISUdITElHSFRfQkFDSyA9IDB4MzEzMTMxO1xyXG5leHBvcnQgY29uc3QgSU5BQ1RJVkVfQ09MT1IgPSAweDE2MTgyOTtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfU0xJREVSID0gMHgyZmExZDY7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0NIRUNLQk9YID0gMHg4MDY3ODc7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0JVVFRPTiA9IDB4ZTYxZDVmO1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9URVhUID0gMHgxZWQzNmY7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0RST1BET1dOID0gMHhmZmYwMDA7XHJcbmV4cG9ydCBjb25zdCBEUk9QRE9XTl9CR19DT0xPUiA9IDB4ZmZmZmZmO1xyXG5leHBvcnQgY29uc3QgRFJPUERPV05fRkdfQ09MT1IgPSAweDAwMDAwMDtcclxuZXhwb3J0IGNvbnN0IENIRUNLQk9YX0JHX0NPTE9SID0gMHhmZmZmZmY7XHJcbmV4cG9ydCBjb25zdCBCVVRUT05fQ09MT1IgPSAweGU2MWQ1ZjtcclxuZXhwb3J0IGNvbnN0IEJVVFRPTl9ISUdITElHSFRfQ09MT1IgPSAweGZhMzE3MztcclxuZXhwb3J0IGNvbnN0IFNMSURFUl9CRyA9IDB4NDQ0NDQ0O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbG9yaXplR2VvbWV0cnkoIGdlb21ldHJ5LCBjb2xvciApe1xyXG4gIGdlb21ldHJ5LmZhY2VzLmZvckVhY2goIGZ1bmN0aW9uKGZhY2Upe1xyXG4gICAgZmFjZS5jb2xvci5zZXRIZXgoY29sb3IpO1xyXG4gIH0pO1xyXG4gIGdlb21ldHJ5LmNvbG9yc05lZWRVcGRhdGUgPSB0cnVlO1xyXG4gIHJldHVybiBnZW9tZXRyeTtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBHcmFwaGljIGZyb20gJy4vZ3JhcGhpYyc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUNoZWNrYm94KCB7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgb2JqZWN0LFxyXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxyXG4gIGluaXRpYWxWYWx1ZSA9IGZhbHNlLFxyXG4gIG9wdGlvbnMgPSBbXSxcclxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcclxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxyXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXHJcbn0gPSB7fSApe1xyXG5cclxuXHJcbiAgY29uc3Qgc3RhdGUgPSB7XHJcbiAgICBvcGVuOiBmYWxzZSxcclxuICAgIGxpc3RlbjogZmFsc2VcclxuICB9O1xyXG5cclxuICBjb25zdCBEUk9QRE9XTl9XSURUSCA9IHdpZHRoICogMC41IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBEUk9QRE9XTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IERST1BET1dOX0RFUFRIID0gZGVwdGg7XHJcbiAgY29uc3QgRFJPUERPV05fT1BUSU9OX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU4gKiAxLjI7XHJcbiAgY29uc3QgRFJPUERPV05fTUFSR0lOID0gTGF5b3V0LlBBTkVMX01BUkdJTiAqIC0wLjQ7XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIGdyb3VwLmFkZCggcGFuZWwgKTtcclxuXHJcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgcGFuZWwgXTtcclxuXHJcbiAgY29uc3QgbGFiZWxJbnRlcmFjdGlvbnMgPSBbXTtcclxuICBjb25zdCBvcHRpb25MYWJlbHMgPSBbXTtcclxuXHJcbiAgLy8gIGZpbmQgYWN0dWFsbHkgd2hpY2ggbGFiZWwgaXMgc2VsZWN0ZWRcclxuICBjb25zdCBpbml0aWFsTGFiZWwgPSBmaW5kTGFiZWxGcm9tUHJvcCgpO1xyXG5cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGZpbmRMYWJlbEZyb21Qcm9wKCl7XHJcbiAgICBpZiggQXJyYXkuaXNBcnJheSggb3B0aW9ucyApICl7XHJcbiAgICAgIHJldHVybiBvcHRpb25zLmZpbmQoIGZ1bmN0aW9uKCBvcHRpb25OYW1lICl7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbk5hbWUgPT09IG9iamVjdFsgcHJvcGVydHlOYW1lIF1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMob3B0aW9ucykuZmluZCggZnVuY3Rpb24oIG9wdGlvbk5hbWUgKXtcclxuICAgICAgICByZXR1cm4gb2JqZWN0W3Byb3BlcnR5TmFtZV0gPT09IG9wdGlvbnNbIG9wdGlvbk5hbWUgXTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVPcHRpb24oIGxhYmVsVGV4dCwgaXNPcHRpb24gKXtcclxuICAgIGNvbnN0IGxhYmVsID0gY3JlYXRlVGV4dExhYmVsKFxyXG4gICAgICB0ZXh0Q3JlYXRvciwgbGFiZWxUZXh0LFxyXG4gICAgICBEUk9QRE9XTl9XSURUSCwgZGVwdGgsXHJcbiAgICAgIENvbG9ycy5EUk9QRE9XTl9GR19DT0xPUiwgQ29sb3JzLkRST1BET1dOX0JHX0NPTE9SLFxyXG4gICAgICAwLjg2NlxyXG4gICAgKTtcclxuXHJcbiAgICBncm91cC5oaXRzY2FuLnB1c2goIGxhYmVsLmJhY2sgKTtcclxuICAgIGNvbnN0IGxhYmVsSW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggbGFiZWwuYmFjayApO1xyXG4gICAgbGFiZWxJbnRlcmFjdGlvbnMucHVzaCggbGFiZWxJbnRlcmFjdGlvbiApO1xyXG4gICAgb3B0aW9uTGFiZWxzLnB1c2goIGxhYmVsICk7XHJcblxyXG5cclxuICAgIGlmKCBpc09wdGlvbiApe1xyXG4gICAgICBsYWJlbEludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGZ1bmN0aW9uKCBwICl7XHJcbiAgICAgICAgc2VsZWN0ZWRMYWJlbC5zZXRTdHJpbmcoIGxhYmVsVGV4dCApO1xyXG5cclxuICAgICAgICBsZXQgcHJvcGVydHlDaGFuZ2VkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmKCBBcnJheS5pc0FycmF5KCBvcHRpb25zICkgKXtcclxuICAgICAgICAgIHByb3BlcnR5Q2hhbmdlZCA9IG9iamVjdFsgcHJvcGVydHlOYW1lIF0gIT09IGxhYmVsVGV4dDtcclxuICAgICAgICAgIGlmKCBwcm9wZXJ0eUNoYW5nZWQgKXtcclxuICAgICAgICAgICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSA9IGxhYmVsVGV4dDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIHByb3BlcnR5Q2hhbmdlZCA9IG9iamVjdFsgcHJvcGVydHlOYW1lIF0gIT09IG9wdGlvbnNbIGxhYmVsVGV4dCBdO1xyXG4gICAgICAgICAgaWYoIHByb3BlcnR5Q2hhbmdlZCApe1xyXG4gICAgICAgICAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdID0gb3B0aW9uc1sgbGFiZWxUZXh0IF07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgY29sbGFwc2VPcHRpb25zKCk7XHJcbiAgICAgICAgc3RhdGUub3BlbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiggb25DaGFuZ2VkQ0IgJiYgcHJvcGVydHlDaGFuZ2VkICl7XHJcbiAgICAgICAgICBvbkNoYW5nZWRDQiggb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcC5sb2NrZWQgPSB0cnVlO1xyXG5cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBsYWJlbEludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGZ1bmN0aW9uKCBwICl7XHJcbiAgICAgICAgaWYoIHN0YXRlLm9wZW4gPT09IGZhbHNlICl7XHJcbiAgICAgICAgICBvcGVuT3B0aW9ucygpO1xyXG4gICAgICAgICAgc3RhdGUub3BlbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICBjb2xsYXBzZU9wdGlvbnMoKTtcclxuICAgICAgICAgIHN0YXRlLm9wZW4gPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBsYWJlbC5pc09wdGlvbiA9IGlzT3B0aW9uO1xyXG4gICAgcmV0dXJuIGxhYmVsO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29sbGFwc2VPcHRpb25zKCl7XHJcbiAgICBvcHRpb25MYWJlbHMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsICl7XHJcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xyXG4gICAgICAgIGxhYmVsLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICBsYWJlbC5iYWNrLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvcGVuT3B0aW9ucygpe1xyXG4gICAgb3B0aW9uTGFiZWxzLmZvckVhY2goIGZ1bmN0aW9uKCBsYWJlbCApe1xyXG4gICAgICBpZiggbGFiZWwuaXNPcHRpb24gKXtcclxuICAgICAgICBsYWJlbC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICBsYWJlbC5iYWNrLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vICBiYXNlIG9wdGlvblxyXG4gIGNvbnN0IHNlbGVjdGVkTGFiZWwgPSBjcmVhdGVPcHRpb24oIGluaXRpYWxMYWJlbCwgZmFsc2UgKTtcclxuICBzZWxlY3RlZExhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTUFSR0lOICogMC41ICsgd2lkdGggKiAwLjU7XHJcbiAgc2VsZWN0ZWRMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IGRvd25BcnJvdyA9IEdyYXBoaWMuZG93bkFycm93KCk7XHJcbiAgLy8gQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGRvd25BcnJvdy5nZW9tZXRyeSwgQ29sb3JzLkRST1BET1dOX0ZHX0NPTE9SICk7XHJcbiAgZG93bkFycm93LnBvc2l0aW9uLnNldCggRFJPUERPV05fV0lEVEggLSAwLjA0LCAwLCBkZXB0aCAqIDEuMDEgKTtcclxuICBzZWxlY3RlZExhYmVsLmFkZCggZG93bkFycm93ICk7XHJcblxyXG5cclxuICBmdW5jdGlvbiBjb25maWd1cmVMYWJlbFBvc2l0aW9uKCBsYWJlbCwgaW5kZXggKXtcclxuICAgIGxhYmVsLnBvc2l0aW9uLnkgPSAtRFJPUERPV05fTUFSR0lOIC0gKGluZGV4KzEpICogKCBEUk9QRE9XTl9PUFRJT05fSEVJR0hUICk7XHJcbiAgICBsYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvcHRpb25Ub0xhYmVsKCBvcHRpb25OYW1lLCBpbmRleCApe1xyXG4gICAgY29uc3Qgb3B0aW9uTGFiZWwgPSBjcmVhdGVPcHRpb24oIG9wdGlvbk5hbWUsIHRydWUgKTtcclxuICAgIGNvbmZpZ3VyZUxhYmVsUG9zaXRpb24oIG9wdGlvbkxhYmVsLCBpbmRleCApO1xyXG4gICAgcmV0dXJuIG9wdGlvbkxhYmVsO1xyXG4gIH1cclxuXHJcbiAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xyXG4gICAgc2VsZWN0ZWRMYWJlbC5hZGQoIC4uLm9wdGlvbnMubWFwKCBvcHRpb25Ub0xhYmVsICkgKTtcclxuICB9XHJcbiAgZWxzZXtcclxuICAgIHNlbGVjdGVkTGFiZWwuYWRkKCAuLi5PYmplY3Qua2V5cyhvcHRpb25zKS5tYXAoIG9wdGlvblRvTGFiZWwgKSApO1xyXG4gIH1cclxuXHJcblxyXG4gIGNvbGxhcHNlT3B0aW9ucygpO1xyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcclxuXHJcbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9EUk9QRE9XTiApO1xyXG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG5cclxuICBjb25zdCBib3JkZXJCb3ggPSBMYXlvdXQuY3JlYXRlUGFuZWwoIERST1BET1dOX1dJRFRIICsgTGF5b3V0LkJPUkRFUl9USElDS05FU1MsIERST1BET1dOX0hFSUdIVCArIExheW91dC5CT1JERVJfVEhJQ0tORVNTICogMC41LCBEUk9QRE9XTl9ERVBUSCwgdHJ1ZSApO1xyXG4gIGJvcmRlckJveC5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIDB4MWY3YWU3ICk7XHJcbiAgYm9yZGVyQm94LnBvc2l0aW9uLnggPSAtTGF5b3V0LkJPUkRFUl9USElDS05FU1MgKiAwLjUgKyB3aWR0aCAqIDAuNTtcclxuICBib3JkZXJCb3gucG9zaXRpb24ueiA9IGRlcHRoICogMC41O1xyXG5cclxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgY29udHJvbGxlcklELCBzZWxlY3RlZExhYmVsLCBib3JkZXJCb3ggKTtcclxuXHJcblxyXG4gIHVwZGF0ZVZpZXcoKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xyXG5cclxuICAgIGxhYmVsSW50ZXJhY3Rpb25zLmZvckVhY2goIGZ1bmN0aW9uKCBpbnRlcmFjdGlvbiwgaW5kZXggKXtcclxuICAgICAgY29uc3QgbGFiZWwgPSBvcHRpb25MYWJlbHNbIGluZGV4IF07XHJcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xyXG4gICAgICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgICAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWwuYmFjay5nZW9tZXRyeSwgQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGxhYmVsLmJhY2suZ2VvbWV0cnksIENvbG9ycy5EUk9QRE9XTl9CR19DT0xPUiApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYoIGxhYmVsSW50ZXJhY3Rpb25zWzBdLmhvdmVyaW5nKCkgfHwgc3RhdGUub3BlbiApe1xyXG4gICAgICBib3JkZXJCb3gudmlzaWJsZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBib3JkZXJCb3gudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbGV0IG9uQ2hhbmdlZENCO1xyXG4gIGxldCBvbkZpbmlzaENoYW5nZUNCO1xyXG5cclxuICBncm91cC5vbkNoYW5nZSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApe1xyXG4gICAgb25DaGFuZ2VkQ0IgPSBjYWxsYmFjaztcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG5cclxuICBncm91cC5saXN0ZW4gPSBmdW5jdGlvbigpe1xyXG4gICAgc3RhdGUubGlzdGVuID0gdHJ1ZTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC51cGRhdGVDb250cm9sID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xyXG4gICAgaWYoIHN0YXRlLmxpc3RlbiApe1xyXG4gICAgICBzZWxlY3RlZExhYmVsLnNldFN0cmluZyggZmluZExhYmVsRnJvbVByb3AoKSApO1xyXG4gICAgfVxyXG4gICAgbGFiZWxJbnRlcmFjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsSW50ZXJhY3Rpb24gKXtcclxuICAgICAgbGFiZWxJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgfSk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuICBncm91cC5uYW1lID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZSggc3RyICk7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBHcmFwaGljIGZyb20gJy4vZ3JhcGhpYyc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuaW1wb3J0ICogYXMgUGFsZXR0ZSBmcm9tICcuL3BhbGV0dGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlRm9sZGVyKHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBuYW1lLFxyXG4gIGd1aUFkZCxcclxuICBndWlSZW1vdmUsXHJcbiAgYWRkU2xpZGVyLFxyXG4gIGFkZERyb3Bkb3duLFxyXG4gIGFkZENoZWNrYm94LFxyXG4gIGFkZEJ1dHRvbixcclxuICBhZGRJbWFnZUJ1dHRvblxyXG59ID0ge30gKXtcclxuXHJcbiAgY29uc3Qgd2lkdGggPSBMYXlvdXQuRk9MREVSX1dJRFRIO1xyXG4gIGNvbnN0IGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIO1xyXG5cclxuICBjb25zdCBzdGF0ZSA9IHtcclxuICAgIGNvbGxhcHNlZDogZmFsc2UsXHJcbiAgICBwcmV2aW91c1BhcmVudDogdW5kZWZpbmVkXHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBjb25zdCBjb2xsYXBzZUdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgZ3JvdXAuYWRkKCBjb2xsYXBzZUdyb3VwICk7XHJcblxyXG4gIHZhciBpc0FjY29yZGlvbiA9IGZhbHNlO1xyXG4gIC8qKiBXaGVuIHRydWUsIHdpbGwga2VlcCBvbmx5IG9uZSBjaGlsZCBmb2xkZXIgb2YgdGhpcyBmb2xkZXIgb3BlbiBhdCBhIHRpbWUuXHJcbiAgICogU2libGluZ3MgYXV0b21hdGljYWxseSBjbG9zZS5cclxuICAgKi9cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIGdyb3VwLCAnYWNjb3JkaW9uJywge1xyXG4gICAgZ2V0OiAoKSA9PiB7XHJcbiAgICAgIHJldHVybiBpc0FjY29yZGlvbjtcclxuICAgIH0sXHJcbiAgICBzZXQ6ICggbmV3VmFsdWUgKSA9PiB7XHJcbiAgICAgIGlmICggbmV3VmFsdWUgJiYgIWlzQWNjb3JkaW9uICkgZ3JvdXAuZ3VpQ2hpbGRyZW4uZmlsdGVyKCBjPT5jLmlzRm9sZGVyICkubWFwKCBjPT5jLmNsb3NlKCkgKTtcclxuICAgICAgaXNBY2NvcmRpb24gPSBuZXdWYWx1ZTtcclxuICAgICAgcGVyZm9ybUxheW91dCgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvL2V4cG9zZSBhcyBwdWJsaWMgaW50ZXJmYWNlIHNvIHRoYXQgY2hpbGRyZW4gY2FuIGNhbGwgaXQgd2hlbiB0aGVpciBzcGFjaW5nIGNoYW5nZXNcclxuICBncm91cC5wZXJmb3JtTGF5b3V0ID0gcGVyZm9ybUxheW91dDtcclxuICBncm91cC5pc0NvbGxhcHNlZCA9ICgpID0+IHsgcmV0dXJuIHN0YXRlLmNvbGxhcHNlZCB9XHJcbiAgXHJcbiAgLy91c2VmdWwgdG8gaGF2ZSBhY2Nlc3MgdG8gdGhpcyBhcyB3ZWxsLiBVc2luZyBpbiByZW1vdmUgaW1wbGVtZW50YXRpb25cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZ3JvdXAsICdndWlDaGlsZHJlbicsIHtcclxuICAgIGdldDogKCkgPT4geyByZXR1cm4gY29sbGFwc2VHcm91cC5jaGlsZHJlbiB9XHJcbiAgfSk7XHJcbiAgLy8gcmV0dXJucyB0cnVlIGlmIGFsbCBvZiB0aGUgc3VwcGxpZWQgYXJncyBhcmUgbWVtYmVycyBvZiB0aGlzIGZvbGRlclxyXG4gIGdyb3VwLmhhc0NoaWxkID0gZnVuY3Rpb24gKCAuLi5hcmdzICl7XHJcbiAgICByZXR1cm4gIWFyZ3MuaW5jbHVkZXMoKG9iaikgPT4geyByZXR1cm4gZ3JvdXAuZ3VpQ2hpbGRyZW4uaW5kZXhPZihvYmopID09PSAtMX0pO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAuZm9sZGVyTmFtZSA9IG5hbWU7IC8vZm9yIGRlYnVnZ2luZ1xyXG4gIFxyXG4gIC8vICBZZWFoLiBHcm9zcy5cclxuICBjb25zdCBhZGRPcmlnaW5hbCA9IFRIUkVFLkdyb3VwLnByb3RvdHlwZS5hZGQ7XHJcbiAgLy9hcyBsb25nIGFzIG5vLW9uZSBleHBlY3RzIHRoaXMgdG8gYmVoYXZlIGxpa2UgYSByZWd1bGFyIFRIUkVFLkdyb3VwLCB0aGUgY2hhbmdlZCBkZWZpbml0aW9uIG9mIHJlbW92ZSBzaG91bGRuJ3QgaHVydFxyXG4gIC8vY29uc3QgcmVtb3ZlT3JpZ2luYWwgPSBUSFJFRS5Hcm91cC5wcm90b3R5cGUucmVtb3ZlOyBcclxuXHJcbiAgZnVuY3Rpb24gYWRkSW1wbCggbyApe1xyXG4gICAgYWRkT3JpZ2luYWwuY2FsbCggZ3JvdXAsIG8gKTtcclxuICB9XHJcblxyXG4gIGFkZEltcGwoIGNvbGxhcHNlR3JvdXAgKTtcclxuXHJcbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBMYXlvdXQuRk9MREVSX0hFSUdIVCwgZGVwdGgsIHRydWUgKTtcclxuICBhZGRJbXBsKCBwYW5lbCApO1xyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIG5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTiAqIDEuNTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwgKTtcclxuXHJcbiAgY29uc3QgZG93bkFycm93ID0gTGF5b3V0LmNyZWF0ZURvd25BcnJvdygpO1xyXG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBkb3duQXJyb3cuZ2VvbWV0cnksIDB4ZmZmZmZmICk7XHJcbiAgZG93bkFycm93LnBvc2l0aW9uLnNldCggMC4wNSwgMCwgZGVwdGggICogMS4wMSApO1xyXG4gIHBhbmVsLmFkZCggZG93bkFycm93ICk7XHJcblxyXG4gIGNvbnN0IGdyYWJiZXIgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBMYXlvdXQuRk9MREVSX0dSQUJfSEVJR0hULCBkZXB0aCwgdHJ1ZSApO1xyXG4gIGdyYWJiZXIucG9zaXRpb24ueSA9IExheW91dC5GT0xERVJfSEVJR0hUICogMC44NjsgLy9YWFg6IG1hZ2ljIG51bWJlclxyXG4gIGdyYWJiZXIubmFtZSA9ICdncmFiYmVyJztcclxuICBhZGRJbXBsKCBncmFiYmVyICk7XHJcblxyXG4gIGNvbnN0IGdyYWJCYXIgPSBHcmFwaGljLmdyYWJCYXIoKTtcclxuICBncmFiQmFyLnBvc2l0aW9uLnNldCggd2lkdGggKiAwLjUsIDAsIGRlcHRoICogMS4wMDEgKTtcclxuICBncmFiYmVyLmFkZCggZ3JhYkJhciApO1xyXG4gIGdyb3VwLmlzRm9sZGVyID0gdHJ1ZTtcclxuICBncm91cC5oaWRlR3JhYmJlciA9IGZ1bmN0aW9uKCkgeyBncmFiYmVyLnZpc2libGUgPSBmYWxzZSB9O1xyXG5cclxuICBncm91cC5hZGQgPSBmdW5jdGlvbiggLi4uYXJncyApe1xyXG4gICAgY29uc3QgbmV3Q29udHJvbGxlciA9IGd1aUFkZCggLi4uYXJncyApO1xyXG5cclxuICAgIGlmKCBuZXdDb250cm9sbGVyICl7XHJcbiAgICAgIGdyb3VwLmFkZENvbnRyb2xsZXIoIG5ld0NvbnRyb2xsZXIgKTtcclxuICAgICAgcmV0dXJuIG5ld0NvbnRyb2xsZXI7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyogXHJcbiAgUmVtb3ZlcyB0aGUgZ2l2ZW4gY29udHJvbGxlcnMgZnJvbSB0aGUgR1VJLlxyXG5cclxuICBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCBpdCB3aWxsIGF0dGVtcHQgdG8gZGV0ZWN0IHRoaXMgYmVmb3JlIG1ha2luZyBhbnkgY2hhbmdlcywgXHJcbiAgYWJvcnRpbmcgdGhlIHByb2Nlc3MgYW5kIHJldHVybmluZyBmYWxzZSBmcm9tIHRoaXMgbWV0aG9kLlxyXG5cclxuICBOb3RlOiBhcyB3aXRoIGFkZCwgdGhpcyBvdmVyd3JpdGVzIGFuIGV4aXN0aW5nIHByb3BlcnR5IG9mIFRIUkVFLkdyb3VwLlxyXG4gIEFzIGxvbmcgYXMgbm8tb25lIGV4cGVjdHMgZm9sZGVycyB0byBiZWhhdmUgbGlrZSByZWd1bGFyIFRIUkVFLkdyb3VwcywgdGhhdCBzaG91bGRuJ3QgbWF0dGVyLlxyXG4gICovXHJcbiAgZ3JvdXAucmVtb3ZlID0gZnVuY3Rpb24oIC4uLmFyZ3MgKXtcclxuICAgIGNvbnN0IG9rID0gZ3VpUmVtb3ZlKCAuLi5hcmdzICk7IC8vIGFueSBpbnZhbGlkIGFyZ3VtZW50cyBzaG91bGQgY2F1c2UgdGhpcyB0byByZXR1cm4gZmFsc2VcclxuICAgIGlmICghb2spIHJldHVybiBmYWxzZTtcclxuICAgIGFyZ3MuZm9yRWFjaCggZnVuY3Rpb24oIG9iaiApe1xyXG4gICAgICBjb25zb2xlLmFzc2VydChncm91cC5oYXNDaGlsZChvYmopLCBcImludGVybmFsIHByb2JsZW0gd2l0aCBob3VzZWtlZXBpbmcgbG9naWMgb2YgZGF0LkdVSVZSIGZvbGRlciBub3QgY2F1Z2h0IGJ5IHNhbml0eSBjaGVja1wiKTtcclxuICAgICAgaWYgKG9iai5pc0ZvbGRlcikge1xyXG4gICAgICAgIG9iai5yZW1vdmUoIC4uLm9iai5ndWlDaGlsZHJlbiApO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbGxhcHNlR3JvdXAucmVtb3ZlKG9iaik7XHJcbiAgICB9KTtcclxuICAgIC8vVE9ETzogZGVmZXIgYWN0dWFsIGxheW91dCBwZXJmb3JtYW5jZTsgc2V0IGEgZmxhZyBhbmQgbWFrZSBzdXJlIGl0IGdldHMgZG9uZSBiZWZvcmUgYW55IHJlbmRlcmluZyBvciBoaXQtdGVzdGluZyBoYXBwZW5zLlxyXG4gICAgcGVyZm9ybUxheW91dCgpO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBncm91cC5hZGRDb250cm9sbGVyID0gZnVuY3Rpb24oIC4uLmFyZ3MgKXtcclxuICAgIGFyZ3MuZm9yRWFjaCggZnVuY3Rpb24oIG9iaiApe1xyXG4gICAgICBjb2xsYXBzZUdyb3VwLmFkZCggb2JqICk7XHJcbiAgICAgIG9iai5mb2xkZXIgPSBncm91cDtcclxuICAgICAgaWYgKG9iai5pc0ZvbGRlcikge1xyXG4gICAgICAgIG9iai5oaWRlR3JhYmJlcigpO1xyXG4gICAgICAgIG9iai5jbG9zZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBwZXJmb3JtTGF5b3V0KCk7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAuYWRkRm9sZGVyID0gZnVuY3Rpb24oIC4uLmFyZ3MgKXtcclxuICAgIGFyZ3MuZm9yRWFjaCggZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICBjb2xsYXBzZUdyb3VwLmFkZCggb2JqICk7XHJcbiAgICAgIG9iai5mb2xkZXIgPSBncm91cDtcclxuICAgICAgb2JqLmhpZGVHcmFiYmVyKCk7XHJcbiAgICAgIG9iai5jbG9zZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcGVyZm9ybUxheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcGVyZm9ybUxheW91dCgpe1xyXG4gICAgY29uc3Qgc3BhY2luZ1BlckNvbnRyb2xsZXIgPSBMYXlvdXQuUEFORUxfSEVJR0hUICsgTGF5b3V0LlBBTkVMX1NQQUNJTkc7XHJcbiAgICBjb25zdCBlbXB0eUZvbGRlclNwYWNlID0gTGF5b3V0LkZPTERFUl9IRUlHSFQgKyBMYXlvdXQuUEFORUxfU1BBQ0lORztcclxuICAgIHZhciB0b3RhbFNwYWNpbmcgPSBlbXB0eUZvbGRlclNwYWNlO1xyXG5cclxuICAgIGNvbGxhcHNlR3JvdXAuY2hpbGRyZW4uZm9yRWFjaCggKGMpID0+IHsgYy52aXNpYmxlID0gIXN0YXRlLmNvbGxhcHNlZCB9ICk7XHJcblxyXG4gICAgaWYgKCBzdGF0ZS5jb2xsYXBzZWQgKSB7XHJcbiAgICAgIGRvd25BcnJvdy5yb3RhdGlvbi56ID0gTWF0aC5QSSAqIDAuNTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvd25BcnJvdy5yb3RhdGlvbi56ID0gMDtcclxuXHJcbiAgICAgIHZhciB5ID0gMCwgbGFzdEhlaWdodCA9IGVtcHR5Rm9sZGVyU3BhY2U7XHJcblxyXG4gICAgICBjb2xsYXBzZUdyb3VwLmNoaWxkcmVuLmZvckVhY2goIGZ1bmN0aW9uKCBjaGlsZCApe1xyXG4gICAgICAgIHZhciBoID0gY2hpbGQuc3BhY2luZyA/IGNoaWxkLnNwYWNpbmcgOiBzcGFjaW5nUGVyQ29udHJvbGxlcjtcclxuICAgICAgICAvLyBob3cgZmFyIHRvIGdldCBmcm9tIHRoZSBtaWRkbGUgb2YgcHJldmlvdXMgdG8gbWlkZGxlIG9mIHRoaXMgY2hpbGQ/XHJcbiAgICAgICAgLy8gaGFsZiBvZiB0aGUgaGVpZ2h0IG9mIHByZXZpb3VzIHBsdXMgaGFsZiBoZWlnaHQgb2YgdGhpcy5cclxuICAgICAgICB2YXIgc3BhY2luZyA9IDAuNSAqIChsYXN0SGVpZ2h0ICsgaCk7XHJcblxyXG4gICAgICAgIGlmIChjaGlsZC5pc0ZvbGRlcikge1xyXG4gICAgICAgICAgLy8gRm9yIGZvbGRlcnMsIHRoZSBvcmlnaW4gaXNuJ3QgaW4gdGhlIG1pZGRsZSBvZiB0aGUgZW50aXJlIGhlaWdodCBvZiB0aGUgZm9sZGVyLFxyXG4gICAgICAgICAgLy8gYnV0IGp1c3QgdGhlIG1pZGRsZSBvZiB0aGUgdG9wIHBhbmVsLlxyXG4gICAgICAgICAgdmFyIG9mZnNldCA9IDAuNSAqIChsYXN0SGVpZ2h0ICsgZW1wdHlGb2xkZXJTcGFjZSk7XHJcbiAgICAgICAgICBjaGlsZC5wb3NpdGlvbi55ID0geSAtIG9mZnNldDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2hpbGQucG9zaXRpb24ueSA9IHkgLSBzcGFjaW5nO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpbiBhbnkgY2FzZSwgZm9yIHVzZSBieSB0aGUgbmV4dCBvYmplY3QgYWxvbmcgd2UgcmVtZW1iZXIgJ3knIGFzIHRoZSBtaWRkbGUgb2YgdGhlIHdob2xlIHBhbmVsXHJcbiAgICAgICAgeSAtPSBzcGFjaW5nO1xyXG4gICAgICAgIGxhc3RIZWlnaHQgPSBoO1xyXG4gICAgICAgIHRvdGFsU3BhY2luZyArPSBoO1xyXG4gICAgICAgIGNoaWxkLnBvc2l0aW9uLnggPSAwLjAyNjtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ3JvdXAuc3BhY2luZyA9IHRvdGFsU3BhY2luZztcclxuXHJcbiAgICAvL21ha2Ugc3VyZSBwYXJlbnQgZm9sZGVyIGFsc28gcGVyZm9ybXMgbGF5b3V0LlxyXG4gICAgaWYgKGdyb3VwLmZvbGRlciAhPT0gZ3JvdXApIGdyb3VwLmZvbGRlci5wZXJmb3JtTGF5b3V0KCk7XHJcblxyXG4gICAgLy8gaWYgd2UncmUgYSBzdWJmb2xkZXIsIHVzZSBhIHNtYWxsZXIgcGFuZWxcclxuICAgIGxldCBwYW5lbFdpZHRoID0gTGF5b3V0LkZPTERFUl9XSURUSDtcclxuICAgIGlmIChncm91cC5mb2xkZXIgIT09IGdyb3VwKSB7XHJcbiAgICAgIHBhbmVsV2lkdGggPSBMYXlvdXQuU1VCRk9MREVSX1dJRFRIO1xyXG4gICAgfVxyXG5cclxuICAgIExheW91dC5yZXNpemVQYW5lbChwYW5lbCwgcGFuZWxXaWR0aCwgTGF5b3V0LkZPTERFUl9IRUlHSFQsIGRlcHRoKVxyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKXtcclxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgIHBhbmVsLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9CQUNLICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBwYW5lbC5tYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0ZPTERFUl9CQUNLICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGdyYWJJbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgIGdyYWJiZXIubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSElHSExJR0hUX0JBQ0sgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGdyYWJiZXIubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuREVGQVVMVF9GT0xERVJfQkFDSyApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggcGFuZWwgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBmdW5jdGlvbiggcCApe1xyXG4gICAgaWYgKHN0YXRlLmNvbGxhcHNlZCkgZ3JvdXAub3BlbigpO1xyXG4gICAgZWxzZSBncm91cC5jbG9zZSgpO1xyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG4gIH0pO1xyXG5cclxuICBncm91cC5vcGVuID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoIXN0YXRlLmNvbGxhcHNlZCkgcmV0dXJuO1xyXG4gICAgaWYgKGdyb3VwLmZvbGRlciAhPT0gZ3JvdXAgJiYgZ3JvdXAuZm9sZGVyLmFjY29yZGlvbikge1xyXG4gICAgICBncm91cC5mb2xkZXIuZ3VpQ2hpbGRyZW4uZmlsdGVyKGM9PmMuaXNGb2xkZXIgJiYgYyAhPT0gZ3JvdXApLmZvckVhY2goYz0+Yy5jbG9zZSgpKTtcclxuICAgIH1cclxuICAgIHN0YXRlLmNvbGxhcHNlZCA9IGZhbHNlO1xyXG4gICAgcGVyZm9ybUxheW91dCgpO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmIChzdGF0ZS5jb2xsYXBzZWQpIHJldHVybjtcclxuICAgIHN0YXRlLmNvbGxhcHNlZCA9IHRydWU7XHJcbiAgICBwZXJmb3JtTGF5b3V0KCk7XHJcbiAgfVxyXG5cclxuICBncm91cC5mb2xkZXIgPSBncm91cDtcclxuXHJcbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsOiBncmFiYmVyIH0gKTtcclxuICBjb25zdCBwYWxldHRlSW50ZXJhY3Rpb24gPSBQYWxldHRlLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG5cclxuICBncm91cC51cGRhdGVDb250cm9sID0gZnVuY3Rpb24oIGlucHV0T2JqZWN0cyApe1xyXG4gICAgaW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIGdyYWJJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgcGFsZXR0ZUludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcblxyXG4gICAgdXBkYXRlVmlldygpO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlTGFiZWwoIHN0ciApO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLmhpdHNjYW4gPSBbIHBhbmVsLCBncmFiYmVyIF07XHJcblxyXG4gIGdyb3VwLmJlaW5nTW92ZWQgPSBmYWxzZTtcclxuXHJcbiAgZ3JvdXAuYWRkU2xpZGVyID0gKC4uLmFyZ3MpPT57XHJcbiAgICBjb25zdCBjb250cm9sbGVyID0gYWRkU2xpZGVyKC4uLmFyZ3MpO1xyXG4gICAgaWYoIGNvbnRyb2xsZXIgKXtcclxuICAgICAgZ3JvdXAuYWRkQ29udHJvbGxlciggY29udHJvbGxlciApO1xyXG4gICAgICByZXR1cm4gY29udHJvbGxlcjtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgIH1cclxuICB9O1xyXG4gIGdyb3VwLmFkZERyb3Bkb3duID0gKC4uLmFyZ3MpPT57XHJcbiAgICBjb25zdCBjb250cm9sbGVyID0gYWRkRHJvcGRvd24oLi4uYXJncyk7XHJcbiAgICBpZiggY29udHJvbGxlciApe1xyXG4gICAgICBncm91cC5hZGRDb250cm9sbGVyKCBjb250cm9sbGVyICk7XHJcbiAgICAgIHJldHVybiBjb250cm9sbGVyO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgZ3JvdXAuYWRkQ2hlY2tib3ggPSAoLi4uYXJncyk9PntcclxuICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBhZGRDaGVja2JveCguLi5hcmdzKTtcclxuICAgIGlmKCBjb250cm9sbGVyICl7XHJcbiAgICAgIGdyb3VwLmFkZENvbnRyb2xsZXIoIGNvbnRyb2xsZXIgKTtcclxuICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuICBncm91cC5hZGRCdXR0b24gPSAoLi4uYXJncyk9PntcclxuICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBhZGRCdXR0b24oLi4uYXJncyk7XHJcbiAgICBpZiggY29udHJvbGxlciApe1xyXG4gICAgICBncm91cC5hZGRDb250cm9sbGVyKCBjb250cm9sbGVyICk7XHJcbiAgICAgIHJldHVybiBjb250cm9sbGVyO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgZ3JvdXAuYWRkSW1hZ2VCdXR0b24gPSAoLi4uYXJncyk9PntcclxuICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBhZGRJbWFnZUJ1dHRvbiguLi5hcmdzKTtcclxuICAgIGlmKCBjb250cm9sbGVyICl7XHJcbiAgICAgIGdyb3VwLmFkZENvbnRyb2xsZXIoIGNvbnRyb2xsZXIgKTtcclxuICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbWFnZSgpe1xyXG4gIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgaW1hZ2Uuc3JjID0gYGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBZ0FBQUFFQUNBTUFBQUR5VGo1VkFBQUFqVkJNVkVWSGNFei8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyt1bUFjN0FBQUFMM1JTVGxNQVduSmZibnFEV0dSNGEyWmNZbkJSYWxSTGdINkVUblI4VUdoMlJvWkRYbGFIU1lvOFFIVTJMeVljRkF3Rm1tVVIxT0lBQUpGaFNVUkJWSGhldEwySldtdTdqalVLSVFra1FMcVp2Z01DWk8yelQvMzMvUi92U2tORGtqMlRyT2FyVmQ1VjZ4RFAzcEpsV2RLUTdxYVBiNit2cnc4dmorUFovdnZyeHovLy9QajYzcy9HNy9jUDJuMC9YWjZPcDZYOGZKSGZhRy8zajlxNVgvTEt0L3Qzdi9RZnVmUWsvWG91Ym9sei9EcTVMSDd5MW5MVmw5eGVINGIyOGppZG5jWnkvWk0wUCtXZmYvN3puLy84Kys5Ly9zRzVVenRhdjNIMWluSklYa2xlOFF2bjMrT1JPUDJvajVPUG16N2V2K201UERERnlYYW4vVXdld0JkODEyNFpEbjJvM2VUQkJtQ0tBelpRZmpZNzVXWC8vWSsvS2o2TG43Ny8vdUYzcjI0dkh5ZlA1YWU5Y1JSc2FINUkvNDh2ZVFxUDVLaDlYOXo4Nnd2bit3amhaZm1ZalR6bXlCZmxTT0J6NVYxbFhPOGVINTRtdzhueks4ZFRIc25QZXBidXB3ZnQxVnUrUHNsdmFaUHRzNzNGYVd4WGJwL2lVangvSTlTVWMzSExxWjJEaG50VlAwRVJmTjc5cTkxOCsvVDJ1RmxPOGV3OEJXK3F3NFJ6NVJaYk9UcDVmc0pqK2RUcUZaL2xsVEFxdUxjK0VtOGpBLzRkQS9TODljOTVraEVoOFpUWW04ZTNwKzBRVjl4UDVmNWZRalU4Vkx1ZUozaXRlOUNUOUxlem41SUQrS3A4dEIzRW1PZmRlZnNsNTgwUFkxV01Ea2FCTkZYcUg1VmplU1NHNUhqUmRUenErZUFNalArRUw4dkh5Q1N6RnpXNkxFOTZQcmp2N3VWcE11cDB1bHVNcDdJcHVXWGI3WFE2d3ljWnR0a1ViOTN0b0kyNjlySExLYThjYnAwVW5NMnZUeE05dC92ODhJaHplTjNrNlNWLzR0Ynlac2U5ZmQ0UWZkMkp2TzdtOGVHNVc1N3lEUmJBck1LNXVEdmVHQ1Q5UWI3SVYremFHTTcyeHhQdVBjTHBTczhqNTluenBCdWZNM3gyNG5IYXZ0b0RobklQNlNYVjhONjRhRFFrUFRsUnRuYjJzOTlFMzlSZmRSaWZycndrbmJ3N2JvL0poWGxMd2VsUG1jaVR4N1BUL2x2N1Q3UFo1aEhqbGtQeXRaZlJqNXVEUnJPVG5BOW12WDk0eGtCMGgzeXZ4ODFKQndJdnF2MTRVem4vK0swdmV5ZWpmZTROVnVDQURjWG1PejVyMTl0MTlmS3h2cG44SFBTMDdWWWorOWpITjdsU2ZuZmkwaCtjemNQT2VkQWJkSVNhNzI5UGNnN2F1ZnYwbGovdDFzdjlhYlpVM3B6SXc2U3Q5UHZHTWthZFFad2lBM0hrUFBuZTQ5eVJuanRZa2FSQ052QlF2dUpneHpFOFljQng3NEVOSGNZWnA2NzRPWU56aHh3ZDR1RnB1TktuajdZUGtBekhrNzRSSHJyUzk5cDFKdlpnT1FENnI3UVRCTVc4eFNKNlBQRlY0OU9YeGdDOHUxeWdoSk5SczFWd3RqSDY3M0Q2UktmVWNyYlgvdkYwS2greDdlNktVWk83Nnl5eG0yTWNwbE9jYjh3NnhFQ2NPenQ3V1E2RWRPc25EOERaT0IveTUwNUh1NWx6UEYxc3Zzb2NITXo3SU9JWVhIc2V6SnYrWXRIdk43MGRiaUVUZFR2YU5mMjhWSG5IMkg3WGEvcWc1cnN3eVc2K2tEYVhkMy9MbjQxOXluSThmWC9Yenp2MytvdW1ZQUQ1aVZQd3BpZVRsRElYeC9odU9kaHZRRkliMXBOTmtYTnYzdGRYbEsrUk1RUzlPZUQ5eFp4RFIvb0x6WnErZmM1NmNGYU9CdkgySmg2R3EvV2lQeGh0alM5T1N3d2VicktUSjloYnpuQTJKc3FnV2ZUWHUxR3NXSmpRR0VSOFZ2K1NBZVFDRWc3ZkJyNjdGL3B6R0RBYjc0VUYwQzlOUG5xbGQxcmpLOUNQZ1ZqM0Z4aUhCejFKK3ZmSG1USHJXaitzMTVPWEJRVlBlekpBbzRSUW1mSHk4bWlhR3hpZzF4emtQcmozN09oRUhNemxMZVhtOTNpV3Z2U0hqTmZpOElHUGxYZFhCdEE3TnNJQnloQ25ieFZBZVA2OGYraXZrd0hrc28rQ0FUNE8vYjVSVitmYjJ4dWUxbnpvbU9oOXlRQWZPT1ZOVlU1NVV4V3R5bCtRRHNLRTh5RHB0OHBEOEpDLzRvZU9JYjdtdE1TQXJ3OGZmTjVzekhuV2dQaU44clJ6TkliSmhKMWNJY3pmblVEU2dXZUVBUmFmL1lHODVnRWZSckg2Z0lteWFHU2tNYTd2MUEwd29mMnpkdlVTQURKL2NNQ25tNW56SFE0MGkvbEJCeFNhVlNqTklJY01xYnhvOUd1blRxYTV5aEpwVUtDVjQ4R3NCM0MzUEdVRUNlQ3lxaWZ2bzJPRDg0MWQ3eDR3L1E1enpxZ1RscGVKM3J0djBzNEd2VGtjbEtkazVIRUwrU0x3eFdDOU9BaFBnYzJPOGlVcTVGZjZmWHF0TU0rTC9oUldyQmhnQWNrbG42OUQrL1Q4aktmWlFJbE9XektBTktqcHk3MUpTaDZiNzRRSm5BRk03T0hqRm8zY2VkMHNEZzFGUHNlajZhL3hQQ291T3gyZ2VXOGdUYzkyamw3aVJoQVB3Z0R5aXJaT1kzbFJXc3Bqeit1K3lpblRySEJ6MEwrSDE1Y25ZQnBBTnhCTlRHZEN5Z2Fzcm5nQ1hzQUk5M0N2ZWdEMWFmMEVvVU1ERG9BYUU1cWVUSGFRZWppcyttM2N6dDFRb0lQakcva3c1ZTJ6dlJRVmEyYzlQWjhxMUE5VkFuSDdOV1RTZUFhK2hpeGE3NkR2UUhqZ3dsVkhsczY1VXB3SzNyWnJQSTdSbm1FRmVsQVNINVJIVks1UzU3bGdBQ3BHR0c5cGNvSU9sUHlsc3lnWlFKcnE5RkRvdnIrU0FZVE8vWkFBTHZibWg4TWNyeWl2dEZDQ3YrbU1oMndZREhiR0VQNXRNa0E3MWVsR25iTktPZ29NbjUrTlNKSERvbGxqblo1Q3FLMVdLMkdYaml5dWcvT3FneWY3WURjeXpMdDVJNU50YTJxZGI2TDRXUjBaYTJnVHdxcFVWanNxbzllckxqZGZNeXJIdTBidUlselF6SGRVaUYzNTB6dHBaNmZWcit1MFBEajZaL1pPdmZYNkRCM25QREpOSXhUclhkeElxQTJ1dkZNaUtCa2JJeU1tQ1RxNHVreU5BU0RFaDVNdVNBTUZDVi9aUGE4UEN3aEZiRGJHV0JmNklpekIzbE9WdU52SkpRUFlvSUJ3NTkxdXArTzZXOGtmcTY3Y09CZ0FQYTRVcTQ0SlhWWlhtTDVPUkZ0WnY2a1JVNnhpSWkzOEZYWHBnMFpwUXN2TzVCd2JkWVNxbmE3T0lya1FJdUNka3VUUTE1V2tUekhGSVJXZUdzckY4Z2RJdmVIU3NLUG1PZEFKQkxYdXRERWwra3l0V2I4QU9nWTFrRkJXengyN1pCbktzWTdBZVJjS2NmVHJBQTA2cTh0K1pjdGQ5RSs1eEsxMnZmVjhQb2NRZzdTaVlyM3VzYTE3U20yb3NuY1E1YWtuYmNBc1p4TUpXQU9UQVdUS1RHVFpkMllmbThLOE9EZ0R4QXpsa2p0ZFludCtsUUdFcUdRdGVkUGRTTnBBL29ETzR2Y1k2Q0ZSOTZuUXdmeGhPcTZRZ3dvRFZsQzc3ZUdnUXV4SkNkNC9VSCtkVVh6MTdmR21RNjR4NVhHWHRaQkhENE0vOVBBV041S242bHBuZkVFOThxQy9aS0FnQUpVQnFFNjQ1cmtlZEV5dG8wb2lyR0phODF6WE51Z1lwMXVYdUhMYzB4SHVka1VIdFVsVjlNc0FEVy8wajloUERsY1pOaGYrcFJCVFFUeDJ4VHBiTW9DK3JzOTQxOEZHL0duTHFGMzgyVjhQZEQ3cWpMV1ZoYU9iRExCdk1ZQnEwT3k1WkFCakxUMkdOVVRKUkozRjc5SDBEL29STHArUHRzdWxDSkJlREdxc083NFU2ZDVFS0ZzeGdPdWdKZzhhV2R5NktvVVhoNFZzWWtRRWNGSER1NXI4R2hWcm0vYnlsN0xIWW0yeVIvdWhUaHhNODV4VGp3N2RrRnJ6d2RYQTVjMUxpbkY1ZnRKTnlNSEd0SlNZMisydis2ZGM0aHA1YU5QZ0NUdW9kbU9uWWJSa2dOTTQxbTNjZy9MVXgrUjBzbm1CenhHaG9qelF0VGxaTVFDc2FadHB4UUNRQ2JjWllPWXpUb1VOcDdCZTVpKzcwSS80Q0lWdS81WFMvaFBUOERVWVlLc3NhM3NlRlJFcmFYcW5OZ05BeEtzQTZJeDBBalh6UnYrVysxRmJ6cmVYYVJTanl2SFJSeG9qUUwwZFUzTEtJRVB6MU9NMlpUQUlPbUNoTlpPSGIxNVNqc3ZMMDFWQ1B6Mzh1cC9FVXgwSUt1NWFuclNHdUlvdjYzbVRDVUlHMkZOdmNOMU9CZ2tyUUkvVGVrYTJiVDVVcUtqeWZPYVd0MkNBTHRUM3BWcUIvNEFCc1BaeHhSN2xqQ01EeUVmSVdnbUZqdm8xYUkzMTZlT1Q1OWFLaHkwZ3owTnF1Y21qZkx5UlVuOWd6UnZzZW1RQTQ1MWtnQkVrVXAram1pcUdYTVlWQU5ZUkcydVpFNTJ6YnJENG9rNW1VUTZoTmNkYWN2T1NXd3p3cC8xVERvL3U2VVlqbFRVNXB2eXlEaHVsbFREQWNSWkg4V1VjSkpjUk1MN2hlL3FReWJyVjRxNHBHQURxb2NvQUhmenU3elBBckpDdUhQaVNEUG9SNTE1dVpvL0h1S0JaSkZza0EwQTFVU2JVUnYyNlpnQ3NiaUxEUlFDb1pJSEJweVBYdXNXRHI2T0ttK2xkYnBraWY2cTRvdmFKWVVuTk0xNzBQazgvUTJ2R245QXhibDd5dHhnZ3gxTzA2UzEyUnJZZmVpOWtHeHRjQW52WkJuSUE1VExNb01mOGdWRzNTWWM3eVh3VW1mbUIyN3NPUUZLZFlRMTgxNm15MnExcDkvc2xBOFRxSXlSeHRiT3lBMno1T1RTK2dobUhtSVVZT3V1dEpjQWpuRVg0d1BzTENVQlZDT3ltVDRQQlIyWkt3emZDNjZqTVhnOEdLNTFEWGJuTHVGQ0xPVEQwV1BEVjVTU29GcHcwMUR0TmlYcDlsb2U0Y0wxMXlkOWpBUG5oMjdSWFhSdGlMdWFZSnYwaEFJUUJVb21pRGk2amlmSGQ2Z1FyMlVNTjZMSnkrWlFNN1VCTVJQZ08wN0dWT0pUUHYyQUFyajQ0R2twY1pRbk0wNFBVcHE3by8vTVp5UUI0ZjJ5UjNRdlNZZ0Q5QVhsdmlvRGVTcTBOemdCY1FxbnVETVRwQVI5aXNjMU0zUWdQZFkzZ2haUU5LZ1RSTVVWOE5HOWU4dGNZZ0kvR1RIS05Gbyt1bG9CMEVxa3BXRFFyNDB3eVFLM0dWUXdnRmltc1hHNWhsalVjQXlhNlJqS0FNa2lQUnFYanp4bmdXS3dCenJlUDQ1c01RQnRsaXhLbjFpNEFhckI3UWE0eHdNSkVlWCtnREtCUEdRMkNBZWdFVVVOUU9EMldabjNBQUswWGxPYkwzREhvU3pzVnpPUDFuQnFrWEpucXljMUwvaElEc0o5Y1Zhbkd0UktZVGlKaGdDL3NvMjh4d0I3RGk2ZXRkUU13ekJQSFZNblVydG9rQStqbWQwNGQ4MWNNY0VycEdpdkE4aVlEcUIwMVpERzNyZUNMVXJRK2dLTmNxN3ZOQUI4bSsvV0FFSVdhdld6VG4rRUdsUzI4T1QzQXgycDlzTTE1UG5WY0tVNHYrWlNhbWhCWlRvVmJsL3hsQm1CL0xkZnJiYUJUOFBoTENiQlA4NzVLeGQwcUYrVXhCZ0cvMVFOTFhVWldDU01GUENPL1lJQTA0czNubEl6VE5nT2tQa3FUYjYyTm1VbVdtNG1CU0xhdFd4UitMZ0gwREprZ0trZmtmSkFWMFF1d3JIVE9NQVQ1S3BQS1RzcWQydUxCcDF4K1pFMkYrcEsvendDL2V2VG5ncTNOQU8xVEIyN3UzY0NSaUcxdFg2V2k4TUM2SGwwajdnaGVBMWpBdXVqNXJWMkFxUFdoTXVPTWJXdG9KOE9TMzVhRmpvTmJjb0xHUXFLR2Q3SHdjczkrVFFjQUhXTUpPR01oR1lVaENBSkdiYXZpSkZnTmFKY1FoVDkxandXTkpjdWFBVzVQNTVzTThIOHZBZUN1djdVRURBb0dPRzM4VlBUR2tvOEYrVlM0K0xFeXduKzZxa1lYNHdUTFAzd2d2NzhOUE9iR1hob05iTHlDenFmZFdpYzJYcVhjTTNUSUdDU0czYVFQN1YzbWJqOE90UmtBekMzWHF6eWZpNUVCNmlkWVFvZnYzWll3SFlkSk4xOTZHVnZoejFnQjhKYXAzaFY2MzF0N0lVNzk5Tm9sZjVzQmJxc2ZWQUpYK0svVERTV1FOQXJGditKWmVKZ1JzUWNIUTlPSENXWUhNL3lsSlZDOW9LOS94QUJwMmpQL1VURzBuK0t4TTJNV1hibUZ4cWh0bmFhQWNHQi9MTXdDcXE5STRWQXhBRmZrK1E3bUdGa0t4Unc4bi9lNTJFOExaWEl5TEJqZ0ZPWnkwSXVibzNKOE9mQzNWWEh3OE0xTC9oWUQzTjZBSkYyR2FHNEdrRzBnM2RvaHQ1MkJmWmRsL2hlMHMvSkFMSTJ6dGk5QWxvdHhXNFA0K1RZUUVWcXZXKzFMcFQ3czFvYytEZWFtRzFBWkNVM21FTk54cGlKQWhKUkdBbnhBZjJkMHhtbFRNd0JtQ0hhQTZ2UFY4K0JZWEZQZFQ1dXZPazduUGoyWGNoZnUybkx2bVZzUCtmaUhWNWUyUDkyTTM3Z2tDYW9IWHArNkpPaWY5OTgyUVJSMGVVSmpBSWt3d01sMVhHcHVibXZoOU9JQ2dTQTVjNS83MW1XNXNVKzk3UTBjejRRQ054bmdYUTlyTExjOW5kdXJ3cUUwZDI4TjdvVTVCL29zMkRDU3VDWWlFZGV5bksvWFlheUdiYnBnZ1BSemlCOFYvdGdkL29jaG5VNDY5WG5JUWhMbVpzVFpob2NNKzF2Yk9wMFpEdk84eFlyQm96Zk5jVGN2TWZNN05KY0pydml3QmVSUCs2ZVhSa2lPYXlFQjJMYU00cnBEek1Rb2xlMTBEcHJCbDJhV2hRcXVMWnp0SEUwaEhtaFhNY0JqcmlacWFzTFlYV2NBT01MbFlVL1BwbDl4TmhkTVJIOHRYYVlrVHlveThtRFhHOFVpWVZib0hjSmczQUhQMVNzWWdQNWU1ZlZkSjZKOE95UEdmdEhySWF2T0FRS216MUNuTWVKc2xWNng2TVRhUmJ1eE9BOVQ4elJCNGdiNWN4cmtiMTZTbjNhVzk1SXJQa21NUCsySE1wUnVpTFc3SWE3NUFoamFlamQrdEx1NWY4M2Yzd1FWZm0vSlZTUFJqcytodUdCMHNWb3dHS0YyekNIbXlNYnVDZ04waDBwVklRaUhObGFBa2dIZzFSdHAwSVJKSXM0ZmZnUjFLN0FlMFFoZDRSbmVTcDJUWEwzYzBhVUdmSnI2MUVtdk45OE5OSzZBY2VFZVVhdXF6dWNpVmdZVmRJajdLRmFBTDFvbDVYMWM4OFJZNDJqTEphZnVMQnZhbTVkRVNKTXd0NFJ0NktVd2l2MXh2enk2ZEVUMlBhZ2x2WUZyL2dlYWdRRTBXcEFFaDJCZnBwd2NJVHlaQXk4WER5UVVBTzQ1eGdTcTFBMHhCZ1pZdWxJL3Q0bkxzYnRnQUFrQzBvZjUwSkxkYURtb3hkVWszRHJwbHRmV0RkRXEzQ0VjQU80WGlqWk83Rk9zWG02WW1DN0RWUzhzc0pZMmIvRHloZ3hoVEQyTUFCL3pYQm5zcmVjaVhIempxWmdBTUZOcW5vZEQyRC9IOTllZDhzdWJsMWhRNHdCQnJkUjd3SHQvMnIrOEZZcmdldFVpbWt2dHJ6dWhQd09DUnRTbzdza1IrblpRQ3NEUUloS2IrWndPK2dsZFo3dDBhWTVQaU0vbHlYMExNdVhZelZzTUlEMGgrbFk2NFlSb1pLS0tBUkM5Q3VoWkZmZUZLRmdxVjR4SDNWUDR6QnR3Y3VVa1dCem9uRURJSElOMUZ0QWxZTVBVT3dqOWlhb1JxU1kwUXZ5VE9aVElBT29INVRDZk5ENnhyWG5PWmJoTTgyeUY1ZlE5TEdkMjh4S0xJUkxUZ3hMdFlLRkNlUFlmOXMrdUJpTmxSRkRSa2dHTVpRNE5lVXZYMHd5Y2crU3k4Tis1K29MeDJ0Sk5xY0tRZU1yaGI0NEtlTFB5Y2tnckdVQmFVekRBQVVQTHhiV2xTTDY4M0NOMDJzMlZIcW5tRDI5WkZIWU5KSGZ0SnV6M2JhWmxlRFFtdWN4K2pUaVRJNHpaSlp6dlNaL1R6Slg5QUt3akF6VE4yaEFRMEowckRJenc4MW9QTW5oeFprZ2FCdVpKSEJVRDgwNDNMd0d3QVRibzNscWFCd3N1LzdpL0hZNjRBdjFWOG1HMmxxM2pTNENPNUR5QkNzQVdLQkVCRmpDMWtBOVRnZG5NaVNLYTBpd3o3NUcvaWZQRHlTdFJ4NHY5VFNNTkRKQS9Dd2FRd1ZnbnVNUVpJSVRFZUtQZ0NUS0F2em0xSFdscFVXQ1hqQWF4VytRSjZQbmNGakpnZDZqSUlEUnhiM2c0dndNMGJWbUMxSDQwcXJIbkRBeVVRVHFKZ294YmlUSUdZZ2E4UkVaaDFHRlVxOUFmRU0yYmx4QmpLQWRVN2NFVldQZit0UDhZQWNralUvUzZERWplUVBSVURXdVBNMERpR2lURUtrUll3L21GaCtrVzBJYU1PRUlmbDA0WEt5VWo5KzNOOUF2UHFwWDQySEZBaTU4cjVRZUx1UFo3QXNacTRRa3lmYWdtQ0ZjTEtvU0xTNzQ1QTZNanVoa25vTXQxK2oyQlpGM2lHY0dqSHJLdk1mTGRpRG9IOTBxVE5leGtRbFFhZ1R0SG14QjZ1cUlJRFUyQnRnOGNMRzhFbks0TW9FTlYvUUFsaVNBWWJsNWloSHN5d0NxdUFKMy91RCsvVDQ0QXVJc0hFSDlidFdkQ0srOHdqM3VKYklLQ2F6QWxxcGIyc0dMSVFpdmI2bThpcUk0VnNMamJCWGZqbkJIK3c0QzJmaHFrVDFwZ2ZhbGRvUk1iQlFBQ0FoWWFpSWI2MTRtcmo0d0k0TDVHT2V2Q2R6OWJYTGIwQ1dnSDZPQ25aN1FuNGs3MmNteXZEY0JJSElSTVJRL1dCV21CZy83bXVid1Zid1RZUEc4aVpCRHNqaDNSSndqOXIxOEMraE9RcndlMDRaMFVNQ0x0V3YvUHp2ZnZRM3NBbEoraUIzM1pIb2pvdmNPa1hISG5yS1A5SFFncHpNSEhKVjdpTFljTWNCYU9sUDQyU1VsNE1qZ0FlQi9ja0tQSkFhMS9JbjBBQm9NY3JHVDR4aElhSk1EQUhiOUtRRHlvb0ZJMmYrblQ5K3d5aXM0QWx5VlVubjBuYTdPbDVnZDRlWHVRWnNpenBmUXRaL0tQdEJrK1ZnNUI5MFFITElIYTgyS1pFTDZQZnVxU3Q1Sm11Z3I2bC9ydlJnL2d5TDFjaGU2TlB1VFV1bVFEOUt0TzNlWDBYUTVvd3p2Sm1adk5XSTdYL1dPOTRNcjVlRTg1dXBuaENYTGtYdHI3Vkg3TFVBamphVi9aeUVvLzdyQW9rZjZuSTRqSVJXem9jeEJjbFVObWdMWWpSd29vUm1uNldyaVkrUmN3NWt1T3BnOW8rVk1KdCtSZzNJczBzTEVUd0xoMzZoWG9Td0RsaS93SEtoQTJpVi95MmVEeXBYMmpxZzFqZzh0cTJnanRzaEZheXBrOEpQKzhXNXR1OU1CVU85RWw1MjJtUElJZTlMTUJVWXV4eHhIOWQ4cGJRVmZCMEQveTN2NFEvZmZSbjdhY3lkVit3UHFJNnowYVoyckRBTS80WXpyV2ZtdnY2QUJhbHVmN0FYMS9IQVdqQ3l0TWRYd2UzMjBzeHRiSHdaQ1JseGJvWUN4S1hJd3dCYjhpMzBMT1Fkd3loOHlnNnh3cFBjQnZNdzdRY1NoSElLNmIrU1h4NVNjT2hwTEVQMDZlSGtQSEMzWFlnNWlRYWc2Y0xubzRndmo5NkwyZ09xWU4yQ01QWVVadWxtUVNuVWRrT3BIV004eFd1VUI3ck4rNFhESDFrTDdXcC8rcWVEZHhjRHBSVXJ6b1ZORUQyby9GUUg2aTAwUUlNUEh5VU8zQmllOGc2UkhMTjlxOXJidjRHeEp1TnJNYm9VTmYwZFloN1IrSEhIamhQSk9qdUJwTEFPY0UreWcwd1NWNzVnZllUUFU3TUNReGtabHg1WTFpY0VPNWhnYVJSVXBMSHk3bmRNWCtDQytHazBQVVBVNTVIUzdod05vemVTcjY5T05BU25iQ1VVRFJzVTl4YnJ5cXR4cEhEK0Q5dWRJOUlJbU1LZGdpODdtVVlvSElXK3l0Z2RkZjlYd3NhQS8zNWNxdlBWaU80RHF4MllHQlJCOHY0RHAxV21JdThRcHFIWEV5OUFGR1lwb21nTXRUUjdBMTlYa3JEZk5PbEduOE1DUXliNFFPWm4zNWFtc0NPUDhKcXF2Y1NwVWZoZGErTVU5TTVnalpFbEhERENFMlg2Y2J6azBpMWlubTFNVTd6UW04TnhuQmREUnlWaXBJZUduVEJFMUg0bExPb2REMUhWdHQ0T000R2xDLy9WeDBjU0hTVG15WmN0Uk9Cak9VdHJYN0FZSm5LcDdDRUtXSHVxNm5jdGxTOFQ5S3cvNGZsejhqb1FzUGZadSt3M0daUU5FM215YXNncWJMNmdxSlFjT29NOWtLK3Z3QzZFN21OeDlxRjNZUmVBWk90cDhUVTJ2VGNMMTFyZHBJQ2pmb2MzZUVXR1RxeS9yMzFtMGF1SkgweEJPL25iMjRGNWpZVVhtc0dmTjBHNGloTUlOVzVBZ2hwdTZMT1lKTW81bHh1cjNvcStEbTFqMXp3Zk5HQlVpb3o0d3RwaXpFRm9rbUV1a0ZUUzFwQTc1d1FyOFRHR01XbXI5dndPMDcwSmVxaU00bmpxY0JLRE81Q29GMkRzR3pwQzF2OENQNmJuZllqZHdwK2x5bWNyQlVNVHhFcUJFUjRicWRIaWxPdFVPRE5QMElaOTM4WTY5TElLTFpLYmJXSnp2WXM0ZlhCbTVSRHVnbTltelB3TW40aWJ2RGd1YWZadnZxYzRkTVJMUTUwUWdJYzVPL2FkV2tmVVd3Q21GMjRiZzloelZnSkVlSmN2VmJxWWxnMUxFcklrZklxa3R6cHRMLzN6dVFwWmh1NUFDYnhwZzV6NjBaL285eURsUDI4S045MDU2c1krU0J3Y09zdFhzdURjaWNjaVlTR0FLUnRvTXpUaVVIV0lZTmppZGV5bE1OQUphaXdUNjBlMnVQM29uWWVNdUxzaHFnOTlWaCtYYnVEbVlpT1dRUkp0aE9FeEd1YmtjMVNUR1NESEVLQ2pLY2kxMVJVS3NZTk13QUdpU2tiN0E2OStRdy9jTkhqeDF1NW5wRjA0T1hBaWZiei9PNllheXNmUm90YTNONWNPR05YcTM3VldvTjkydHMzQnlydHcvZksrMkJBN2hOQnl1R05nVm9BYkh0OGh5N2dzRUM3dEN3ZEViLy92ZE9SVGt0VkpSb1JtallPdElzNGhsa3NHNlEvcDRIWnk3TjBmcWh3aGxBU283d25XWlVEcEU1eGZyQkdMcG5OdXRoWTRFY1dPSk50SFIwUEFkbVNUVm5lcjlQV01wVUZ3REVLdmJuaERBcy9aVDF1YlFTNjJlUURtb1VIcXdYSHE3Q0xTdlNuNmlEc0dFb2pibXhYd2xjWlZRRlZxSTZFQ0N4SURPVFdIa0ZETmxDMWN4UUF0KzhJempoZEJSWGdUVFkwbUc3bkY0SituRUdvT0c5UDI4OFFHcXZYNVVlQVhFdnlWZlFnYzJ6RVJzamgrMEtEMjVQbCtZUExBRkdTSjl1R093dzYrQnJNWTBwdldRSzRDb2s3UU43QkF6T29FRGZ1WW16dkNZTHVIbGVkUERLaERCTU5PTUljdEQvc0VDMDJaTXVRNURtU0lBQlh4ck14alpxN3JXd3RERDR6WVFONGJYUkJDS2ZDWUNXZC9KNDhqNjhaK1JXTEZNZWppRE91UVh5V2tBRk16dFR4UUEwT1hrUWZac0JvQUhBaFlJcjlCa1R2clg5eEJFTWZmaHM2VjNyMHhOMm13RVlmVmVuUmptRjMrV2piL2tNM0Z1MU1RWll5NzNsR1F2UHBXRjVWQXBRSFVUQUhSUDFjYnBSSENIYjFZOElHRzcwd01SemdURVZJak5TUlhvZmswdXArMDBpcndrVk9XcC9LaktzSDRoUzZIOWRPSi9jQTJtRHdUd2F4Z0h1ZnRaTHdUcUlva0Yyby9Bak1EeGNCTWxLQkVNNHFiL2lNeFp6OWREcEVlSmVxV25CRk40elA1S3BZTFE3RjB2QWlrYm5HMHNBdmNQU3RSYjh4RTRkUGFzMGZ1T25Ic0hKSHJXaGVQdWRSajFTcVAwT0F3eDZ3UUNleVlOUkFYTkVUOXBRNkNQZ0VXb1duekk1cWRtNFF6MUdoZ3h3UExXbUcyR2pLUUdVZWYzZWV6SUFNdllvMkRMUysyQnZrWWJjTGhHNEhWdEFpb1F3Wjh1UVF6VVE1NCtRYVFmL3dMZndHTkpjSmFVbHgvSkZnUXNkbDdtbTV4bnVUSlVjblFkc09xallIam9EYUZhSnlEQUhvcm1tQmJWQlZDaGM2OUhjT0pWS1lPRjJnb2JOdmtFb2dmNklzcDBKU0ZhK2tKL0NSQkQxVlJBNzhoU1FKRDlqQUxqemRIeWFQdkV6aVpSRytMUkd1cHVybklsaXRvamtsc0M1QlVOZVoxVWVBT2pmMkFiNkNnbEM2bURIQ21GQ25zbWxsRElVSEV6Ym1YNDc1a0Z5ckRaMVArZ0dndzUwWFhDNEo0UkIvODdWUUh3R2h0T1NyVkFUWnhLVUhZNkFBWmg0emJIdGo0a0JneCtCTzY2VnpBV045NlNYRW9HUFBqMGxHbHduYzZkYlMzTmt6Um5xSG9vcUdCa0FlZ1MyZ1NwM25BRzREUnlaeTl1M2dTNWtEdGtZaDVweFV4M0xKMG84SktnbDhqQUQzRzh6QU5Ra0tJRk5zL1lQTG1NUGtYbXNiNkU2eGkrbVVCNGFDQmdMWTFpMlVqOUFtb01CeXVuV0p4aUNpVDh4cTVoR3pPRmtzUWN3WGhaeWVwYXRZekFGQmhxcXcxa0czZFEwSm9USjFrc2NRdEh3L1hUdDZZR0JKOGprR0JQWFZQMVFEMmtFU2Vqb1U3ZXkzVHNYNktHRzRTTHl6ZlU1anZJblpIQ2sycWp4SEUrdmJUQ0xCOUY5QXBwaVNyTXpnRHpYVzBaTzVnMllZRE9pbVI0d2lSMkJjcE1CcU82ZkI1QTZaT0NNa0JrQlFMTVFyU0x3TUZpY2V6b05vSzNBcVpjb0hNWlo3NU1CY3JwbFhzc2ZxZ1JFWXIzMU9zRWsvMEFGQ0xCMjZwWGZzU3pJQkVEV0x3dU9XNWRncUdqOVpJQis5akxFRkZxWUhGQ0VDZzAzTllJcGYzQXpRWVhrY05Cb3I2WVBOWk83ZHhqcGlEL0lsMDBHc05pOFl2akxtN2ZSVEFGUU9lU0hsL0NxQVJ1MzhKdFdYaHlleUd0QlJDZmNUUVlnYjh0WHFXempFbGFBQUxBUU53RUNHSHR1MTU2MmlHNmVWZW1mekRZREJwaVYweTB6MjFvT1c0L0ZheXJWUVE0bFdQdHpFVExGRmNOZTMyYVZMMUtRNm1TQUpsb3lnSncrOTJZTW9LNjlTUHRnNmFsL3lnQWUzTHpRREhDck0zVXJHaWNzTmdTU1BKWGdnZ0Urc1gvNlBRYllaNWFLakJJK2x2aTZFWm9iOFpZdE1NU21obXdSdmZGekJnaDFmNkZyT3BYWUFvSFVoUWtnTUNkdTNKZ2pGVlZHUkpiWU9qME50S1FTK0lRRVdHQkxURGZMZTgyOFhIR0lxZ01ZSU1IYS9RVHFhaThKZ1RVREFvRERsQmdOTm9zWmlld08wVXRyU1J4ZzB0NzlUeGtnUDA3SUR0MHFvOFlyb2pIZXZWd0NGbVRYMzJJQUg1RUtLMXd4d0dUTEJ0MjB6UURqcTJpeFpJREY0cElCTWxYbjJrS0E2N3d5dWltUnpod041blk5SURTMDd3SW1NWTRwdVlRQlZKYkQ3S1Z6bWZxQkhlSTBydzhsYXlSWU95S0tUOTl1UTJWT1Vnb0FMRG5KQUJZVFFpTngwcm5MTmlRT0pBNlFpajlsQUJ5TVhIR2llWE9NUWJTQU9CL214ZGNuQXpCQSsvY1lnQ1BDTEJXRXM1UXZsOGdMTlp6OElRUDBwRjB5QUhoYmQ3eXJjd2o2dksrT3NvalRCUFFGd3lBWGxVZGd3aC9FWVVoYTNtRXVPeVRHOUFOM0ZkdzhCQlV3d2RyOXpObkZURzVPZUdxcGVGcUowbUlUV1ZOT2RPK0Z3Rzh6d1BmUEdTQWtLOGhMdlF0RFdhY1dLYjYrb0EzMGxOSHZNTUMra0tPWk1hb1NUMngwSDF4ZEFnWTNBTU0wcTE5bEFOMVlkbXhFV3d6UTZjRSttQXdBVGlLOE5qbEcxc25hRkdEUXNLOENvcXYvbDY2Q0g3Y1BRV3pFcHFKSmJZamVzaUVwYjRLWURvcGtnQ0VhZGxEalNnS2s3K2hQR1lDWUpLNkNMd1RNdVNzbE5XWitmWXMyUGRNWWZvTUJUblhHb0lDbTVNdlZ5SXRMQnZBVDhkdmZLNWVBcHJsY0FxQURybGFtMU5VTW9DKzhtNnU5SmNWS3NjK1lETXN4akpkUGtmMGxPa0JpTGhKMGo3VG5OdzlSQlNTSzlKeEFYUWJuaFlXQ0EvdFVwK3hiV1RQcmNxVURoTy9vanhuZ0VxNmRlS0NTYUdWbWlhUU5sTWRCNTljTVVBRlV5Zy8zbHp1MGtSZHRCdUJheFQwN1lKbDgwZHZid1BjM0F2U1I2NU5Ea3JzQVMzV2FYMTl1WXFzeExHZHQ1QXIyN1J4NncxV0FPT25iaHlEcFhacnd5VzU0eFZNNFJyWUpuZFFKdTlaczlsYnRYUURINlk4WjRIYjZqYVd0VnBHT3p2ZkZCUU53cy9vYkRGQ01DSWJjVmNvTE84Qk5Cb0Q1a1JEUkovalNmSzBpQTF5VkFJWlp4TjA1SkNuVjRBUUsxR2JGQUlScXVoNVZBVUVKRERtV3FVS1RwZUZHdlhVSWd2NHQ5SW55aGhRQjlCR3BVS0k1eGhuZzg4RFdyeGpnZzIzeGY4QUFtWWltU2tpNUxHaGpFTTdmWUlBVWZDcVQ4MTc1Y3Q0NjE1Y0E1SnZ4ZmZJUU96aXFWN2NaSUZETDVSSVFsc0E1Tm9hZHpHTDdub3NNTGd3bDBEZDFwY2krMit2aVREN2h2NXpMWHpjUGNYZmdpZUZkMm5vcEhVK1dhZ1pSb21sQ0F2UzkxUktnWWZ0Zk1VQ2RmaU1NcVpucVVGcCtmVUVieXlzeitDVUQrSWg4TWt0RmZIaStYSVc4dUdRQUtxUTBXTWk2M3VoNy9kd1paRExERW96dXlBQUoydXdyYmxjVHdic3ZJSFFBMGJib3VhYXZGbFNvUFVMSUR4Q3BCRWhSaHVyY1BsU3FWVEttWkE1b3lSUWNtVkpsYUlDVFhBSUdiTHRhQjJDamUrMXZLb0hUbUN0b3dja0ZiYnJZdUs1L3pRQWNFWWRaZnNTOThwSUNlYkU1dFJtQWZrUGJwY21NbnN2L2NwQnU2Z0NaczZQYnpWM0EySEdZQWdXR056QlFtdE93ME82WTFpOUJ6UmNlSWM4UGdOT1VhR2srT2Q0K1ZJQzFyWDNrSG9FaUFJc2I1aG9tUWpBQTVEQWFZcllLT3NNNllPbW1OcWUvdUExMHkwMHNNNS84K3BJMnlESFVYRExBc1BZRmNFUnlxZjl3bGJMVXZOZ1FZTnBtQUlmZUtZVDNzRkNVNkJ3WXdaOUxBRTdEbFNLcEMzdmZGalFnUmpoUW1oeDk3YUhoS0VITkZ4Nmh1Mkl1YXl2NFpYL3pVS3FBMmVJcHJJeVNYNDNJdkpJQnVsdHIrdEVsbmJVOUkwVHlKeExnencxQkVRclRzSVhjTG1oalM5YmNHU0ExZFFGWkZXbGcyMWtxVXFVc2VNYWJBWGJiREtCR1M1cjJ5VUp6WWhkL3BRTXMxTW14V0hDejV3NmZoVWNFQlVyVHpQSGtNTG1xQWpWSEZoR0s3THVZeXh5ZHpNNTl1bjBvV2NOYnZVZTQrR284K1JlR0lLVytSVFlMeTl4a2dEODNCU2Nicy9VOUkxWHhscWExSHVpTGdxWk9WN3N2cjNoTzdpYzdhRGtyTWdHUU4rUDlpNkdJV0Q2cjZxSnBzQnB6ZVA5cUYzRDRBQmlja2cwamgzSW5qaEZXK3JjcVZ2U0pIWStJWFNkcUtGdDNGM001ZGphejI0ZEt0UXF0TWdYOGtnSFlXcVpnYTEwNlVmNlFBYkRWdStvTUNqYm1neU9wNkZ1VnBoMjVZejQveVFCVWxSWUl0c2xVWldXV2lvbTA4T3ZtM21zZERVUzlaSURFVDQ1R3FPS2pkUVB3a2IreUE4d2JqWE5ZdTc4TUE2U0JKbzRSOXZLbHAyVUJFay9zK0RkRFBNTGdDRkxlZVE3ek9WdXhzN2w5aUFNRTVZQlZuMUt2L0NVRG9Mbk5wMUFDZC9LZk5IdkVIekxBYVhQTEhaeEVRM0FhTjZoWXNNcTN0QkJHWjRDc3ZHSExLOFBTTUNKMHA2R2NHejg4MytmajRLMjV3UUJmQWVGVm5NSndKSTloeW9XYlVjRUlocElnZE9qSVovckw4STVLK201Z2hJblNQUWFIc1RTcWw0aWpkNGVSL0taczNYblZqbDdNNVVpSWZmc1FkNU1IcnVmUWl6TFM2QmNNRUEwSHEyMWdaaEw0VXdiWUwyOEZoS1JsZkRUUmlzcEZERTZaRXM5TUY1NXZqUWg1THE5ZWU0ZUNqMUV6ekZKUmhxZzEvV3cxQXhSRldsaFg4QVgxcTFHbWJvQVlqOXU0QU11MUJWakl5R2dIWlorMU1haDBFZ0ZyY0pma01FQ0p2QzYwMmZDSkFMQWF5SGVNYnVrUEx1Ynk5UFlocWxYUWdCOGVVc1JpRGZnRkEzampRUWFFWktzWjRPT0NBUllsQTJUVzIrc2hZYkhYYXhxWDFQeVZtVFhYU0hadjY2dzBNRUNFVk9UeXlyMGVnOUlvSmpKRXpmUE1aclBZdlFnOERBRkovS1JoRlI4MDlZSWx3dm9KTWdnMTBBa1ZDOXB0RkJZRURGeUJLZGEyZHhBOGtkSEFMU1BOQXFLOGlBRWl2OXdWMUpOR3V0S2dkUE1RckM0ZUpHSVJVbEZNckdDQXBybGdnQ3I0S3hoZ1hqWm1aK1FCai9vdmtvU2t5QzJ5M21adUNxd2prYmdpMXp3UXJmNzE0Z1dHdGxsc0NPdEdKdm5nOGdxOEJKTlFlTUVWaUFuK2lrelQyVmhaaWFRa2FvdGVOa1hWTGNjS2lRVWVFRUw2SjloQUJhb1FWeDF3eTVuaU4wbDViVURBYmd3SnUwOE9VNzdBNFNYd1BzUTJvMGtYTW9TTUJwVGZiK21iUUxqbXp3NXRSMUUrREVzRmY0RlVsNXJHa2U1amRHVnpRcTdxWHVnQUd6K3dxbFB6NVlEekJ3K25ib1hSanNRVlJvQ1FtNW51Z3lLZE5kaGZIdk52S3pwYnB1QWdCcFJKS0x6Z2lvaUovS1UvUUxGc1Zpc3VTZmw2ejBBTDRpZFBRTVhjT3g3NE5qb1lVTmtwNGQ4RW8wK3piWURpMDV2WkthQXNPT3lkZ0doSENIOTlFZHRNSUxReUFHTTRMV01sZExzSTRyeDl5Q084d2VRWkNaN0pvbkxVbjBBZTIzODhTZXh0L21jSEFYcUxSdEtvZHlVT2JPMnVtU1NFQXg0L2NOaDFLMHBLRnQrbFNrejhLZ1RDZmY3QzJpb05BSVg0R3dFeFRQSlJwT0RZS0wyWWhFSTZ5Q1FQL2dzLzZ2WVMrWDg4UXdKeEZXQUJURWFkbko0UkFISWJUZWRyNWdjQWthWEhFa0FzMGFiRWhDTVhCcktQSElGenp1Y2U0L1c0RWtTYUlnNEhTNlpMN2VDY1orTnExajNlUGpSOUpDWVlVUzlnL3ZqbEVOcFMwOURtUU9Kc1cwOHhYbmN6YmFNZmdIZ014SFlNZi9WRHg1VzZsYTF2VEZ3aC9VeGs0Y0JYcm9EOHBRTkpLVm9PcWd6enljaVJLVGc0L0NsWGdYVjdqMStRdVhXYmNpYnlBT0xhQ0syemVFdTlIRTJ1UndvaFpCYnhIc3NRa20vRkJkNlIxOEdzS3RtWnR3N01iN0JvQXJkVlBobGlHdkxIZE9WaHpyTWphZ2Y3UEt0bjNmdnRRODVzV0l6QWVtLzhaU3ROanJxdFZtaVhjNFFweGltUzJDaWI5bkZBS09sSkNxWXhZTEtBZW82UXFTSFdNamNGWnhIR0gyeVJ1VGlVYXY0TGRTM3RoME1YcFRudHBBTVRsTXVyejhlbFo1dzRGY3VzWlFmQ0N2enU5SHJIV3F4VFRqNDdTQWdCWUJMQWxxeVNoNW5od0h1UTE4QkpqVmtCZERZQ05ZVTB1VnlwZHVlNWxkekV2aVJ3VzlmSVlSWUpJcVEyVjlyOVhTYmtzWVVuZjQxdkh5SlhrOG5qbDZmektFZGRwbzRuVWJtWUk5Qk1aampPbHRySk53NlFPcG1rZ0FxTmovdzd0UnRFc0RFM1JUbHB3QUZCQTBEY0FWN21vcG01S3BDNUkxbjB4VHBPTXl5dlBFQXBqb3dUSm1JOWJSR1R2U0ZGQ1AwQUwyQk1ScVFIQ1UvMnBrVGtJbU5Ecm1LR2llWjh4UnNVcEhaZjY1Y2oxRU5oUmVJS1Q1VG9UcllOODk0T2tCSTdpZ1FSVXB1Njl2Nk9XRTRtUWFsbVhYRm9WazNJSW1HSTdpNmdjUEJrYmptL2M1ekhkYUtRSFBRcDhoM2xtWFdlRUI2NFRGSWdMWlppTG5lR1dhWnVkVEZwa2dZWVZhUXY0S0taMlMzZzRrcEY3Z2tkMzBjN2VlWUhuZ3c5Znp4K015blZNOU94UGJnU3Azb2p1MEJDWWxKSVFrOTZKamQyZzIzcXNhQS9NeHl3RUhXUzJ2MHo4bXpmVVBtVzFWTFgwSFllYm5abXZvWXRPQ3BqNHBubTkvTE1BM2VSa0lkWmVueldiZXgzSk9rcFo2b21INHA4SVpGV3luT3BqUEdWSE9hVUhFYVBtU2NJOFFraFovcXAwenBQaUIrWVZVa0s1RUFxNDh4MllndXJhZGNYaythWU5OaDZGV3B0ZTh2Y1d1aVp5OWpLNmZqejdVeTU1SUZBejMvaGF1NENtWEJDMVN1NVgrUnVCQW1KU2dNSkxiSEZrZE9EK1ExeUo3dDNUTHoyZEFFNUlxa2RhTWhNTzYxS0hWemFTc3RaK29RWGlnMkFGY3d6Z2NQekRVaWx4UU5rbHA2d0RrU0NIOCtOUmtrNlk5b2U1dml5RlVrSG5RQWlEaVU1UUllWjVwbmNoVEVqUitvZ09oKzA4UjUxbmhCdDVTMFlXNUxiY1RrVmhLSnFyV2t0TGlaTlFRTkdBMy9USUFJRHhqbDNtb1lpTjFBUHA2dXYxVTliSEFqMFBQbHNwSmtvbUhDQ00zclhxN0xjSjJpVWlTMkVWc3loUUpUNFlrNEdpRlRDaHFuRms1elVFTml1eUZRTTRDUnFNd0RMeDRqdm9Ja3FQMHdaT3o4UXpxMWk1MDZrRVZYMFRPaHo0b1JtZGtSU3c2Uld5c3laNVF2SktiSUMzcE15NEllMGJ6ZlFCdDdEZkRibjBFR1ljZWlIMzZQTUV3SkNFYnlPVy9nMVlaRERaeFdiYTZnQXJVbWozMElhWUtDWkFJV3ZKdjFwYTFxNnBaYzRlNllYMmRERTJQUVRQYy9vZDFSU1lzSUp6bWhZajdQT3hUSks2eGtOb1BmWTlHSitBNTRwaWc1WUFsSTdVTnBWeFpOSXJWVXdRSkxvZ2dHZWtQbEVIR05nVVppM0hMbUpQQXlBTFh4cGhwRFNRekF4SEdrbU1ScHVTWTN5TE9KcjZWL3dLZEtiRzI2TmVRVHNDQkpDQk9LTDcrNDZ5TWFTQURvTUZVQms1QW5oMnhXM1NDL0IvaHFoc1A2ZlZPRjhyQ2JORWttcEFOeEZlQUJGT0JlQUxnTm5LQUYwMEpEVmd0UFZrejh4Z1VXQm5qOXQzTWw4Y0t0LzVuMkFrNS9SOE5DNlJwSFl3a1FzMVd2bU4raDBzUi9HQ3RJRkhIN2RaMTZOOTVJQk1yVldNb0NUU0RyYlN3QUUxR3BYZVFRTnVVa3p0VkgxVG1hT3c3d2NyVFZHTW9aUng0QmFrTWhtekF2N25wSTUwa2pJd0pGMndJUHhFS2k2TE9VY2dpUXJsbGFWUTBVaTVtUGtDYUY4aXVnaWpHRGVZdWxCVmRyRnl2eklRQVl0WHBlb0tpSjBpcVdhc0JsYnhKY25wVDl2Y3Vpdm1TYzVTYzNwYW1sNXlSWkNLcURuVFpBNTZQZHcwRUJOeUJvUDBZTUhtUVdqQVE5L2dseEhZZ3ZicE1jR0cza3NWbHdlc1VGWG9MUVdNb01SWFFheUhLNU1yWlVNY0FhSjBObVdBSkNuZzNrVkUyQVN3RmtXYStmZGZ3cVlWOU1RVzBiL3M5cnJlejdHU2d0Q0Y0eVpIeE1pd0hGckdxVlNJQVJPU0pLbEF0QzYyNlU4WVk2eFBSK3pJRm1lRUsrandDektsS0hrTFUvSEFwbzRvYUF5eXF4a1J0dUNBUXpkTFBFQjZxcnZNUVdPcGR2R3dnQ3ZJVmtjVmpMalpOYVJRSUxDU0VXeGMxK3Q1WGx5UXptVndQQTZud0hIWVlnMlpXYkhIQ01Vc1pGRFFlZWl1M2ZCWjJZTDUvOG9BK1Z3RmFtMWdnRjZTZ3p4VldGZ2FnYXdaQW9BbEI0aUtxaU9uVFpzWUFuellrbklhVVNnZkh4Z1BvWTZ6VXdTRUZCY0JHRDM5UUlESURYekNKZ3QwbzlRQnBVTVVCbHNHZVRNUENIdVE2Sm1rTlVMOUprcWNqaFYrNnJkNGhaTTFNaWMxc2tBdGh2cWVZa0cxZ2ZEYlpXQ3VoWjFxTnVmNkhVZDBkOG5pazdFUldtWDdxY1o3VzNwMXhtRTJtSFZ6RVRlVGpwOHRZUjdRYnk2aU9WS2pPaEkvU1BEME14SlBzU0x0UUxjUjd0SXJSVU0wS2h6RmNNbHZGSXhRTlN0VVVBcFZpVFlESzR5QUtkMkZrWGlMN2w0M2hEYldTRGpJVFl4UnpuellxL1NXNVY1QkN6anNFSnVvUnBnbmFzWUFCNnlyV1hNSndOZ21BZVJqNFU3UU54Y0l5ZE5mcnRhUGxvaFFValhVWmpZN1kyZ0xXWnBLeTcwVnFRbDRpTXpLRXZhaXJvOWQyR20ySWNhbjBVZXNKaGFyMm5Ud041N21ycHBnVVlDdzZBNzRWNlErRTNUTGlJTVFyWWprWVdRbHdpSGM4K0RYRUlDOUJlTkJqblRRMWN4UUZhdUVqMGdjamhjWTRBQzVyWGdXUjd2TlIrZ0VMQ2ozRUtuSDdDV1JKVGFRZTlxQnpQVWlsc29idXM0eWp0ZGZoOHFoS0IxbXpaNkltOTFMRXVNWldSU0lGNFYyMFJDWmIyTTlScU1BV0dFdFlJTDE3eFhGUXRGQVNkNVdvNkRsN1VvazhtTWFUdURZdDhQTmQ3M1p1aEZaRWlLVWhTWGd1V2xqdW1WUmNmelYyYnY5ZnJNdjgwQVowV3c4dkdPc1VHYXFaN0h3dGNNNEFzU0NuNUh0TVkxQmtpWUZ6bXBLSTNmWFZWbEFaRk9jaUtkaUtIZzl1REVaZFlETWM1TUdMV2tHcEtqL0ZUdWEzcHpkRE85bUZjYTBYdGs0ZlpXZENOdlVWYk1FWnA0clJOcTRYMlQ5YzRBbVpBSGdhTE1sUkFaRnlSMktOSzBSZFc0QlFzeG9UZVVlL1JTaEpBQkZzQUhYREtBMlozQXJuK05BWlQrdmcxTjYwQ255MWo0TmdQa2dyUU5kTkQyS2dNVU1DOENQOEFBaGlpckdNRFR5V0ZyTVJqNDltREpaZGFHYzRGZFhCUTJPck5iZGUwNlMwQWYzUTIxdUhHUkJDTUt0MDk5eVdFdkNSWDZJc3I3SGJnQ01tRFhGaTdOd2RncTVBdHAyelN0akF2ejlUeWlSeVBqelJxeHVpdytwV01ENVI2OW40VW9IY1FTRUF4Z2haUTF2dERCcjMrTEFRcjZsM2FBTHU1Nmd3RW9CbDhuN0w3QkFBbnpZcnhYTUlBczA1bE9ZbWFZUDZKVXJTSVZqRW1iV0dhYk5TckxzcmIwZTZnaEhPVXlUOGduNnJZMWg4Z2U0V2daNmMzaXo0U1lMWkFhUTNzUnk0dGVWRjFVUUl6SHFJUVdEckhZa0FFd3FvUXVic01BRmV2MVlLY0k5cXBvTHFwS2lyQUk2NXV2am1mRGoyWFFhQ2lCS1phSm9aYlJKUGoxcnpHQURnME5rWlVsOERjWWdOMDNHYUN0QW00S0JxRDBMSE1ob3BEOHdtclNRZllTZXFzcXcvazhFSUl3ZHB3UU9Pa1c5WGZ0NExGWXZub3k5c3dmaytGbjBGbHl4WW9nWEhpMEdNdkx1WVlianJqT09iUlNQaGxpOFJ5V2hoeFZYYnhZcXdibklyeTYwOG54OEZ4WlBaMiswa3NHOE5BejlMbzhuSXB1NmhQTGZPMUYxcmJSU0M3WHFPQy95QUFLcVdQVzVOTWZNb0E4N0djTWtFa2dQT1k3R1lEQnZzU0plT0ZWUmFtdTV3dEt6Z0ttN05DMWxKS1FrZHE5aTFSRjhXWkNDeDltaXpHelM2VU4zSG1ST0RidHpiVXU4Ym1ycUhPZHdoNmplcDBCdEpsNVpRSW5BRlI3SHc5NkdCZ0lHZ3lBMExNVmU1MEIxSXhRNXJCNlgvb29vdWg1cjJGUnk3L0VBSjhmQjVrcUZMbS95UUNPbFozOFFnZUlKQkFCN2tvR3NGc3dNV0ZVR2RmSnV4cEUvam5IdStzSE0rc2RLUDJTRzM1ZElpaFNTOWE4d3BrOXRFeWdRclpBNDJxa0h4b1FqS1JKS2V3TEJuaTd1Z1RFaHNIQy9tbk1EOTFTeXpHNkVoRVp0N1NUeUtFTDJNTFV3Vkk2TEZZVmxIYkx2OFFBaDhZVzBlM3ZMZ0VaME5udHdvN0swYjlrZ0VnQ0VmRE9OZ05FbmJqTWJERHNodXh0b3l0NkYva3VSQ202RHQwdjA2V1J0OWpZNjBLRXJRb2tqendESHhmalZ6QUFWVGhrUzZtVlFHS3RGdEpTQWlEaG9pRS8vUVpRa0FFUlFlOTFCaGpET0pFRk5zTVo5SmNZUUtoZ1NaZk0rZlViREJEeVNOVWNHY1BiZG9BRUROUGdjNnFYZ01XY0hBQVo1NWpiQkZTODFBeVFRMTl1aTY0elFJSHNjTlhRV3psUTJWc3hRRC9henhnZzFxZVY2bkRjQnJvV1lRV0VpL0wreE8yTEVBOGRnT2lZd3h5OU54bkF2UmtxVnc0b0FvQ1lncHNNd0hWTzdDUzlTeEVtZkhneFhOQjZhZEQ5TlFPUW03blJTUXZZRlFZZ3pDdnh3cWRLQ2RScm1ZKzdXaytKdi85Zk1jQTJHY0I3ZTk0RzVVeUozbUFBd0Z1amRXNHVBZTlaWnh2VnRKdGFYOUIwUllOa0FMNlFBa0tUQVp4WTZMM05BTzdQbEVsakNjbUYvZzVNdFh6em81cFU5aVFSR1RtT2hCcnFKdVJpdUxDaG90L3FOeGhnWEpnNjBnWitsUUdZOGlBU1FaWU1NQUowVVQ2K25YcW1oREZDeXByU1kyTEhGUHZTTkRyTUJEYVhPZ0N0NDF4dlZ2d1BUK1FXbHIwc0ZCcWtYbzJrZFhZclFHbEtZVi80QXR5VkJ6c09sOUg4RXFpdHlRQWNRR3dqbkFGaXlFYXdKTjFrQU9JU3RGeTVlSE54RmpOalVRSkJFanVwMHBNNFh4Q1A2TnNZc3VwVlV6RFZnSjh4Z0tmZWNReDZCWlBLc3J6SkFFeDVrTmpPWkFCNG9BQmV4YkViRXFEWUJRd2RTaytBTGJ2Qi9KZTdnQ0Z4bGdsQ3dRY3FUV2dLREppK2JobFErNFRiTlc0Wk8wci9lUThnMDRTSG03QW4vZEpxK0NuYUdTdmt2dk8rY2tQVlpyRzlMUEM5dXpRazVKc2htVG5zN2xlaGk4UWxzSVM5czhscEhLWm9VSlVNNE52Ymd5b1ZvVmZnVkxMcTRsSmdqblpRQTlKSGlMV1B1TU5nQUxjL2JHcDNCMHROMVdWNWpRRTRjSW51cmhoQW9Zc2thYkg5Z3ZTbTFFOC9xQXJVekg3dkNUVmw5YW5jRVdrSGdQakRjOE1PSU9SREZneVlBbzNVV0t1SitKNUhYbjBPcWxES2ZZZEs2UlQyWVFuY3ZOTnZnRHpPVmsxN2JPb3NNMmdzRHBSQ0NLTFNYcGdTb1JxbVYwWDBCZTA5ZUVMdVN3YjQraTVMMklPa2tWWFFUQ2NMbjZ1MG5acDd3UWdaOXVrNU90ZnVzeWVwNWFsVzh5Wk4ranVzZllZN2hJdElydzhMNUxMR1NURVNwbDJXVjNNRjEzNmc1YjVrQUkwcGgzakhFT2N1UUNWbnlEUERTREtKVlpyODFMVkNIY0lja211TXAwdUFoUm9UNEdzTXlGNWl1eEhwNGRZOUczMVFpcXpsRDF6NGhpc1RabkFHeWRSS2tDblMrMVBpSy8wTjNVNEw4MEpPSllQWHpnUU40a3Ayays5aWI4TUpsZ0kzR1lDZEpta3d3dlJRMEpuaDNrRHpudERCR0hoZ0U5bzdkSHJVVHBCYWpiNmRBWHNSWlVBWUtYR0hzRVVXUG9nbEN5STlFNVhHZ3BKMVdWNGtpNmJnaWN5QkpRT29ZMjZWSUY4TUc2YTZDSlo1WnVEd29DY1lDS3RNTldKRHMyNGk3Rk4va2N0bGtoMDgycURVV1JDL2dMTEY2TFhSMTE3VFJRRDREaDkvUnQrRnNPZTBJZ05nSmlTUUdDV3BlRitRWmQ0TERHdnBUb3dZd3JFRm4xaHZTdGhOSVhCWmdNZEQ4K0c0WktrQ21zL3B6c3lRcXlLaW1JU2tqOW9Mdnp1NE5FaTlCYW5acTdHWmhKRTZHT2grQ3JRd285ODNBSlVnekY2YllTUVFNWmxsZVdkV0w4RG1hZVlPTFJsZzNzd2hUdnVEY3FwelBrS2o5a3JlR0RpNkNLUTM0bjlIN0k0RU5vNFJYblAwR1crMHJCeTBhd2IvUktBdEhJM3ErZDFTQWJNSk5KLzdob3Y1TEhJR1pjazkwQ0NCeEZaTlBiM011MVZnV011QWdvd2lObzgwZTBQQ0xtdUJlMkplVFM5aHoxcVdyS3pvcVJveTZGSTV3REFGRXhJU3JPcDQxTW16ZzB0QmF2d0FkSmk5RzYvQmZPKzRRN1VQRVMyTUtDdXJPejBtb2hUMWZrOE9kSXBLdjJDQTlBUFpxbEF3Z0JZZW8zTXU0TkFvM0VXMzM1bmc5VWhnMGV1WnZwRUlnRWszWFB3bW1RSWp6TkZuMmZwVHJiTTRNR0xqb3cvaFI0dlV5ZVA4QUZWY2pXekRkWm9WTTZqSTEzOXNvWXFCa0xRNEU1emJUUXdydmQxb2lTUGdXaHFkakI1cENWekd3TllsN0szbWRhUnFRUE93NjZ6eHJpMndONnlKSHNpNUlQVUxvTVBzMWV2UnBvN0pBanFjRkI0VEpqejFJNGk5aFVDUTluaGY0ZFR1b0dSa3lZZGdnS1pwc0hSeDlzWlV6L2w0dGtpTUNLVXlxTHhucW1HUjJPMFEzYTZHRUNNc2paT0NFZUF0YkRlaFVhM2U0Zk1UQVZPY1FDQ0szQmk5KzNJR1piNytZd3RWSExWSzlRNUtsZ0lxdThreStaU2xEdmp4M3BTd0lYQXpDTHBWd2g2STFXTkI2NlNmOUFhME1lcUZINGxIMVJiSXVaclU3QlZzR292RjR6WUpZTFZ5cjRIeGlETDRlekM5d2RaUWFoZ2xPRXdIWUQxUlZ3RjlKVU1BNGpsbkx6My9pQmJtZlBUUWNuRDVtMG9xaktlVmNqNTZEWElPODdQaGt3czQxb1JuVzdYZ1dtZGhWaFB0ZlEvRTl6UFJWZzdpSStEbzFhdmFYcGxCWTRpME5wQVlPN2FBZHI4RldSaFdqTjh1U3hXWnRybm9WY2hnQ2x5RFFRQTZreVhzdmZZaWtaTVZWUTFOdDNINC9xTmZFSGhVbnErQzJrbTlTZHlwUW1xUlhZRGpRQWc3SUtxQjhjQXc2ajhRcFpDREpySzhlakpMd09rU2tJbE5kWENJa0VMajdPWHBKK0lGWWo0cThhSzIveHZIODU0NEV1a0cxTERzZHRTNnRMSjdoaFk2QzNvM0tKcHVlR24ydmlob0Y1MDZUZzQ1MURzWXVQcDBNWVBRRDdJVVFHTGdrSUlzTE8ydmdoTlY5b25YejlWU0Q0ekxYdnpHSWY3RVBWblFIdzhtV290aW9VUVJnOUE0UFNURDI1dUxERlRYUFdWeUYwTGNsZFFGN2pRNDNwY1hUMkxCdVVURW04cFJ6ekdEdUMwcUxicURBMnFLUllQdWlGQWwwa05iNHYyRmpYejJZcG9TTVJUek1VbXRZR0RuMnJIS3FLT05zblpyUHpsZm1ZV2poRzRRbW9qZlFtZUpZY2VCNkdVZnp3NU00NFpJVXVrSllwcDhQQ245ODlYa2VnRHNqMG91b0xtMThTaVBCNloxNHh5R2Z2WWE4K2tSSExMSnFKK1ZxSVRrMVNVSFlaUHJQYWJwNW1SNEV3SWNuNTRVdzA4a2pGWnhwczZBNnUva2k4U2RnbFNFRGxQQkxMTEU2ZG5NenFJYlJ2MFgyNmx3VnVyV1J2RkMyS1pheFJESHFBT1FqcFo0LzNwUysxUi9xYjhSMk1BbGhwR05wOGVTaGlOZ1ptTUEvaGJTampHY2VaRm13UWdvOTN2a2E1QmVFTFJPMlJBbzc3MnVJSUZtZklCUXNINWZGeDc0R2VPbHlOSVpwaUJtbTRzdU5KZWhpbnJOaGQ4Wm5ZaGllWDFWRkZyTEQraWNpWnh5ZG53N1JTZEt2RndKdndtUzFOQlJyZTlOSkF5ck9HUFhJSjBXTTYya0xuR25Jd1Nzby82SGJURVpIT3V4bUxROU5UM2RRQ01jM0ZQam42c2l0cGF4Nmc1THkvMjlma2prUHVBa2ZlZk1JYWxFZm1PMmNnSlR5akhWQllieDZiV0F5K2VTYkFOY0pDNkprOEJzWExZaFpVb285OHRyWnR6bGdsY25iWUUrY0tSWWdmN21jTVkzUjdSU002UjI4cElLbDY0RG9ieTBpUFB0aWZZTUxPZEwzYmZTR2E5ZndPYUloQVRsWW5uTTliR2dLRmRUNG9zdFpTdUErNkpXT3hKbW4wSG9ETHNFVGRGTDNHbnVleG5Gdkc3VTFFTGpVOWFsVXk5NUdPdWlOb0phTWdmMHE1TUJOcTV4S0dFejM0bTBXTG15bDdQVnAyWTV5QnhHYllUTG94ZWliT3MxbEl6Z1dIUUlBYWFHN21wSkNlWEdhY3k0ZStRTXk3Uk4wQWhEMlVpeWtDNDJBZDFGMThYZ3l6TDNac2hteTV1YjI1ZHlvd0xvYjI3K0lWdUpQeVNFV1F5TFBEUWFZbVBLNHVGUWtGTkRSbkI4VWxSYllCQk9NN3FrWllvQ2RkUXgwM0VHb1V1Yk82WVRXNmNMM0drWnhkeG5MS2JhR01LMkd4Q25US1dMd3NwV3lQNlZETUNjSkRKcDdqUC9FUlZpVHVvSDl1WnNMUk1URWhzNjVEQVNMdStHR1poRnVsRkRpV0FCbklRNUVraHZNeCtWVUc0YVdyQURwU1NkWk9LMklSZEltNVlreXhrV0J0RGxnUUltckVPQ3FsS21Jbk9vZGhBR2pCWnhpSFRvd05KRTRBR2V4RXFxZ0NUUUNFV1lMT2pzVzJTZ3RmQjltMWtKS3lnVE9pK0x3dkw5VHk4d1E4c3gweng3elBRbVRPSUxKcGZPUUZwRU1TTTRsaEdUSEVMVVF3YWVpY0RYZ0drRG9XUXNCQ1ZRQlpTMnA0Y3lBOW9wODE5azl2dllUelAvZ2cweXNhRWRtdUQ4bWY1RUhWbUY4Smhkemt2Ujlod0NISkdZUkdnbWxGc0JWcEZ4RjVLVXhHTHFSa2NFZlNPemhKT2xhWXd1SVdEb1lWR2toMFlMcWxwc0V6cWpuT1ZvRW9mVnBERGpFRElFS21DMFBPampqTGtvaDNCUFNDaWFTSEFGZytOdDhoSk54MmthRnZIbGRRbXdMUHdxNmZ4Z3VXSFVHMWZjS1Ixb0dkV1F3YkZwUGdWYkEzbUR4N2xKbW95TDZXWktvUFliaktYTWdiakVtTHBaamR0RW42MjEycW5Bd2l0dUxES2lEQzdnZnZUTkVVZmVCQVRZR0tCdkVFU2Ftd25sVm05eVpOemxETXZrclppWW1kbkZLMldDbG9GTzhRSVo0Z2syZkhaSG1kOXJQWVpsODVERWdjck1pR2JwYW9pTmUwMXNIQVBFR2tETkRLRCtYcVRvYjliQ2hSRXg2NkdpVnU0bGZXTGpVZ2NZOU9SOW9RT01HUnhydmxKUHYxdVVBRkhjcVlld1pmWGs0YVFzYVVDMkx1dk1JcFVmQkJFWUYvNGFHakR2VkxnWXVHR2JlVStaS3RWZ2NxZ29YSlgwaHQ1SktVZVJ3MWc2K1QrK1hoUnIxYjRGbzc4RFdoWVFZRHAyNUNvTVpSbDFVc2F1ZUlYN1B2QUVJbWQ1ZldSMlFXcG5qTEx3d1FFVGtMbk5MTnBsaDZCSFdUTG5sRVg3VTBCSmNOazhFWlN6akdnR05zNkJFVlhKL2dGaWYrbEVRL0prenRHekdLNmpXRllFaXl1aEVkck9JUGJVRFVyVVd4RkVNWXh5WXVXZ0RJc2lVRVg5OUpJQm5LMnRXQUNIbFJIZGZXWHAwQmNRRVhKbklEZmVXL21KZDNuRm1OcDhxakpZTC9yS1I0ZUFBSTNEWTc0dVExbm9VWkJPVUMyV0xVSUw1MWpnRUhObnZrU08vZzBHQUpQaDJRT01jSzhKMFR6emFhbnhBV2c5YUVCRlNRZ2RSL3k3Nm1WNWRFaG5lamVET1BqTUFzQllSb0h0cTVMOW91dWZQZGd5a3lldk5VVnRIUndmRkowTWl3cGhsNUJEZWxzaXJEWS8vd1lEaEVEV3d2ZTVCQlJzTGNnYmhtN2pQYmlJV0FnTW5aaXlCR3c5NlgwVUk4L3FzeWhVZG1nV1ZmU2Z6blBwTlRaeVNBNm1TeG5NNXY3U2dRbVlUa0VQVlVYaGE4RGxYRDNKZW0wR3lJaHRnUGxEK2d6bVhrVFpwK1ZpcnZlRUt6Y1A4cFhCQUJaWk9lZFYzQzlqbGhseE1obDZ3UUJ5QWttR1BFd1piRDE1WmxFY0hQUktZQXJlZWNieXdRTlp5MG9PNE5zekhUbDFBNjQrcnRldEdIY1dwSzR4UytjbzkwTFBFekorQ1BzdldnZ3BWUUtURVNPd1JEQ1NWUnlMdVlQQkVsSEpQdS9DOEpyUGlnRk03U1NzaXpBYkJua05rMlkwUFY2cGViL3pCZ2tBVmJ4cjhTMDNKUUFWWHFVL2RyMk4vdUZCVENSa014ajBMY0pqbmdkREFvenc3eHArN3pMMmxYVUVrUG8vcW0rbkpKYWxsSkFtTVN6TTJHODlXaGRMN3BjUnNBN0VlUzFLQUplem85dk5OTldjcHdsRXhPdFdDTk4yaUc4cWdjUndRaytuQU84ZlhMM01XTXlPY011NlpFVGdzYlhKTFpJQnNweENVVkl2MFZmdHVGWEtPYW9va2RuZVdLZU0vNzlhOHg2ZFhTWUJwNWw2R1prUmJqT0FuVUlyMW55dVNxTE1CR05BVGt2cEdmUVh2WjdKZno5WTZ3RENGNFNkTGs5WmFBNG5NaUxZOVNpR2w4MmROcmJublpibC9yblo2bm1jT2NjQVZ0eHVGQS9POVhFZ2RnT21TNnZuYVZHUzVqb0RVQUQyK2lxUHN4SUdyTlg0QnV3N0NCMlBHZ2hvZ2RKQVlNbEtON2FOdEpJQm92akwyZUhFV0FHeSt1elZBUENKaTR1bnQ3THFRazJ6eTVyM1NDRWNaUUNZZERScGZwc0JTT05WVDJrSllzcTlLK21HMG9ieUVpdjh5NFAzMVM2QUt3UDhsVXpCRjA5NGE5Y1pRenE5eFFJUlRwNlJjRnJXSTRSeGpuU0duZFdHYVRLcUNnZHlMMlF4Y0Qya1NWQjFyeGFiOGVRYkRPREJUb2Evbmp0Q0NDWWNiSllCcUxYUS82cUNhZUpiRXJXaXJWd0NPTm5sUEMrRkd6WFFHR1IvalFFcThBMTdhd2E0V3ZOK285N2QvREw0ZkgvRkFMd1phQ3lNSml3NmtzMlB2bTRWZnk2ZnI2VGZXVnJNM1p3ald0b0JMUEJwaUVUeXBhWUhHSGNaNTh3OXA2REJENDBTemFkejBBY2lXSTNGWkEyT2dWN2VQVmVsUThmM2pENWJ3RzdndGdaeURDS2xJYVA0TGRjWjRKM2hqb3RHU2UzMklVc3JDdy9CZVJmbEFiT0dNVnNOaU84M0ltc3JDVkFJb3hEcVRoT0FoWklCMnFUbTJCRVgwRnRWREhDMTV2MjRYUXRxdHY4dEJ1QWszNWsraDV5TkN0WE45VmVaUVJsQXhCdFNyRWtIYWVsR0ttZ05LRnpOR09tU0FYTGt5VFVPZy83UTNlYk9CZjIwUGlzejBoWU1FSFZqN0NTSXZDNHNNSDJOZ2FTZy9oV2FwbVlBb3BPQXZ4YTJKUDRhcmdCdHdnU2o4MFhKdzJqa0xJSU9MblNBMksrdmZRVmdka09lZG9zQjZxcm5MQ1ZSOUY2dGVULytnMnB3d3dzNDBkd1lnSDd1VG9zQlZpTXFnVXF6WUlEMEJleWdKL2JXYmdlckdhQ1NBQm1NakIzZndGVTlwdy9rWkptUmxoT2FEQUM4WWR3S0hncFk1dGFScGVpUEdJRFN0TVpmRXlGRkUwNkJ5WFNqVVphdmc0bVZFZ2RnbXBvQnNySXlORWI2RTVJbXYxNEM3Z3Q0K0Nwb1Z0VzgvMk1HQUVEcS9BY1NRQWZXbGNCbW9PVGo3cDJPcWk1TUFCcEp2R0Nta1NzNndNRXVpclFFUFZoMEVpZFk2UUJWUmxvU1RsOE9YeHhEeHR4dnFHVllvRFJMeGFrc2RWK2tHUUhORTlUTmwrQmxpWkZjcUppZVlCVWg3akdEOTVId2JHVktDaTdrc0dMNEp5d2ZuN1hWNTBid1ZNeHRoM1NWQWJiRWdIRjVJWXBVRVRVSDE5dnFtdmQveUFBeStOangvRVFIMk0yNWJyb1NPRElsMEhRQTF4Qm5jRlVEQmlDa2JFUWx3UzRoQ2g4eEZVRUFYeE5tQ0NaRTBwSmVHakxCK0VhV2x6SWo3WXNmR0VFcWM4aXEzRy9iQ2RNa1VOdkxzbXZkR2pkRlVzY2ZKYXEvdFBuNXVFRkxBVnRVSlE5aGs0VDdyOEtkaVF4c0hLRUVCZ2p6MWdLUEExV1dSRjh4QzlFRkE0Z25wbE5acWpGaGtMUHM0QXhRMTd6L1l3YjQ2Qk1nNWZramJ1d0NLTEJ4RUF6UTZlbS9zVWVjN1NORmVyK252SEdXb1dxQnZuUkZ3S2hkTEVNd2hpMGlUVTZZaUxHWE1LbGY2RmlZM3FqaVJ3WklYb0xsU04rQy9UL0xxb0hSd2JpVDhmTHVxMkwvemEzSElyMkJnOG9TYUJxakU0bEtvQTFyUEc0bURCQVpZajdWcW1XUXNUSVhoQTczUjhVQW1KMzVSQXhMNUpWc25HWlZ6ZnMvMXdFYXhaak0zYk5FSHIxdUJ3Z2pRVElBZm1aaUUvTlZySGU5aFV4M0lVN2NsQzRXTmV0bFBjblM4Z3JYbkp1OHZKSWlQRHBEcXluTWFSZHdUNWlDcTUxejRoaEhuVFFkT21vWnRkU1piSVBmWXQwWTl5cHZINU9QdUo4aGtoTkhQTUQ1TW5qLzBLZkIzbmREV0FMbmtmRjBMd3d3OCtMS3JLaExtNmQ4YWVEa2FnWlFaMXlUVDl3VW1XWG42MWhVcTVyM2Y4NEE4UHJDdC94TFM2QWRiTVRVMGpRd1p3bnI5K3M2MTFaalY0UjBzMHNHQ0M1WGlRWnJPbmZCU1UzVEhUL2xERmd5TndsV3RFTmh3TW42emdNRVU3dnRyTUF4RG16V3VQTUFkMElLTFdUalpBMXkzZ2Zkb1RHTzBjdjVLNS9Qa3gzZlJQK29ZMnpDeVUxY3NBVW1NQzdDUW9vaURId0dIZUE5NjRBU0hNQVUrNEdUYXkwQnVxRkJhVTVIOVdqRk5lYVdEZ2FvYTk3L09RT3NwRVYweVU5OUFXTVg4V3Rrbmp6dmtOTjNaM0hPSnMwTSs2UUxpT3FIWklCdzRkSzFCL2Q3Umxxa2wxQmtIcjJxa0tUdStLcEs5dU1GalhMMEIxTTA2THVGLzFndk5QZGhKdEdUbGlBYjNnZmRoNzdYL1haREVFak5RS0hFVFJVeGdSZkIreDRaRWFnWkJCV09pakR3TzFRdWdqOWdRUk16QVUySms3dlFBWHJyTXFvZ29zV2xwVnA5dGViOUgyMERoOE9JTDB0djRQelNHN2lNUFBzeXpURFBsUDZzVzM4a0F6VHc3UFVWcHQzblJNOHE2eUFPOGlDUW1xNi9tTk5MaEM1aDJWeE9LSFlQV2JJZjVTTmt2QWh1VEY4cHdHSUlWY0JjQ3BETnhpb3NEQkRDd3VBR2xDeXc4OUhkMjdIdWQ0YmNZQUxMeVFoYllJbVNPanlqSGJ6UDJDZ0wwR05Zc1VmNExIVWJhSldMWkNaazRBTkNWaUhWZDJoVU1KTUJySUJ4bHhpd1k5YVhxSzBEN1pyM2YxZ1UvT2twZ2tkblA0c0h5UHlGUXBWR3R4M2hYcDFad1Jpcnp6dEVNbjQ5VE5IQnBPTkdISVQzRUdYSXIvY3dybDdqc0d5L0JGNWNBaUVoTkMwa2FIUjIzNGRGU3hqcVZRbk5HRExwdGdzWUd4ZVlRNEpzb2hETkdkMWU5M3RHaUxOUjJtS2FtRW41RWhkQWNyVEtKOHJKRVZMcmtYK0FoOTZwaktxY2pCWkthWHBkYjNmbTVyVk9CK1dWSkJ3RHhKanNNdi9JMVpyM2YxWVYvaVZMc3Ywc0lzamxGVWRmam1VcC9lK012KzV1S2RMV25PZ00vYXdEL0N6ZStqRmlCUUdRemtyQVdaZ2Rod0lJaVhjQTVVenlja0xhK21peVZ4ZklxUEhPNkZoaURqUHkyUEYwN0dabEZnKzdIYUpOUEtwUnVpK1FRZElxaEFLd0pTZ3VPWXRxYWxuNVVPc0ZJTlc3aGc1a2hvQmplTXI2dHBXZ3E3bXdBMVMxWkw0SWlxbXFFVHhlclhtLzlEaVJDd1pnbW92S05UaVdCcFRKOFdjeGdjZFRqSDdVeDVpQUxsYmR5VVo2OHV6UVgxeEswUUVabWloVFlnOXh2d3psVGxoMnBGM284SkFESWZrT2NqUEdoV2ZFSkFPV0NXUjhMaTRBV08vWnNRYzFuZzVOaUJxb3QvY01pYmU0NXFPQmp0NnI0cFlBeENpY0xJUDN2Yndzd0dpRTFXZ2pQQmdNSU90L3hrUEpqYkVMaVBTLzRXb3VMWUZ2VVUzcUIyRnhyWG9rMTJ2ZXoxclY3Y0FBTE5XRXZVMmF6c0FmMGdEanVJd0tua1JVOEZlTy9vZ1Y4ekhNamxyQlNLdk0wK3VsNmVHY1dBRGN0SVA4Z1NaOGRyeEF3cktKR0tIWVZhZ0J5UmtFOVpPZHBBYUVTU1JKb0V6MGdFL1VETEVuOHVUbGpkMUtPSlo4RGxBTWtRMWFmZXg0cmJnbFNtTE9yTkpzQUJnSktRNnNEV0F6UUFjelZJVHVaTmI1WFRLRlJaVmlhRnlWQkhmNG05eUU1YnFnT0RDendhMmE5NmVxdmlVVlR1L1I1NGZ4SElkUm9RK0lqTnU0QURuTTBTZWlxa0t0ZlJHZHFUS1AwTjhFbVFvNUFibXJZRDdhQ0VLeDlrWmhTckhyU0svRVRMRXRDVzVNa3Fic2ZTU1dMQkZOSjNsS1lBNkJHR1RaU3dXNEVlTm0zVVFZZ3RUdkRocVdHK3NodlliRkxiTkdNWGdTNE5HRU1BdjM2dXFTV0J1aHM5SmZHTUNpUWdjUkV5MnpodGorVmtXRmRrbncwK21vTC9lUE5KVUN0Z3ptWkxsYTgzN2ZxbkI3L001eWpWRTZLWW9qelRBbnRBbkc2aW95NkNpSHk5RTNaREFuRkZDZ09rQUUyR0xDT2NpVXVETEkwRVNac2tUdGlZQk9ZS2JLU3NDQjlaUWpMNFMzVGNlR25ESjBZcFIvRHRuTE9RcUtCcDRmTDIvM2NxSWVJYVB4TnNwc2ltSkRYVTZ0Tis4WVk2K3JPZFlwRDFUaXQ1VjlPMmFWY2h0b09VRE55Y3VqQndhSFdCdlEvOTg3cXcvVkFkS0N0VTBOdXBvckdpRXpyWkxnK25SdHhnRVV4Rzg1V2E3VnZEL1ZOYTR4UWRoRDFoV0NFSk5KdUN3cHBjSzBYYzc1aENFa1VINVdvTEFwbkRodnhzVHc2dlZURy94RWx1STYvOXNoY1RpYlFGVFhtRFlPaEFPeTI1OVY0eUZMSWN1L2dMZ0tLUXpVWlJaZVBGV0RnYXVCZXNka2NiN0lMQVBLL1RhOThGWXMxSXpHNG1ZZ1Z3cnlTR01DS3dic0hxdkUyaWdEL1B1dnhnTUFFSUlTK2FCcXBqV0lyUVFPdFV1Q28rRjhvYi9EYzNPeUhFK3RtdmZzalNyM25DQ2NiZXpKeVlLemVRd1pUVndNSnNBUGgvT1JMT3lzT0crODE3RUVyUkpyajFiUCtobDVyRjBzRTZXYnN6NDhkQ2FSZFZIanVXNXZWUG05cWpmL2t2NmlSSDNncnFIZVUzWHhFYVhJbkF5eFhJSXpvdnl4VFVoZEhMSEE0cTI4SEwwMkZEZGp4ckJVNVNLUlVVVDFyMkJnWlpKQVpZRC8zc20zUkZLTERWY1c1QzlvcHhnNjFTWEJUekUxQWJVbFFEd3lKc1RtTUp0dlNLbVk0RmpXM1piSEplWVFOelp0ekFhQ2lIaGNISGt2S2lFREpkaEVzWkhmSWFOR0tWd0I3UXR3N2N0MW56cEdGc3NrNXVtNXRKcW9zR1BOU2ZSbnc0cFdBaDNqcjVlVXdqRGZSdzFVV20xRHBrSnBVcnNPRkdhbE56ZmFXQ2FwQWU5VXhRWm1DMklaRWh0TEJQMFVmWWEyY3dmc2VXNUJjLzlSTThBcGsxcU1JU294czdoamlMbUtBMlZKY0lMeE1haEZpb2dzMGZ4dE9nRWJwNFh2dlRKVkNiYS9KR3dMYy9qOW5WUEU4ckJnb1RNeGlBNHE2OXFnOThtSFVHcFMvVS9RS3E1d3VPNkY1cTlmVEhRdnU0bDVxdE5ubU1Mcm1MSnNickVPSVN1VGtIL0psUTUyWk1BZWJEeVo3b3dsNHVDemY0SUZ0NGN0czlBN2NrMFJTM3dHOWszSWg2ZVB1SlNEQWRLbGwrWWNsd285dXUwWXVoN2IvUzlqQUptNzR4ckd6K1ViVGJpQ2Y5YWwxOHNhNEtkajRxeXpSTFBocU5EQkJzdVlJUW1oeDArOGIwYXVvSUlmZTdpOUllQ1oxOUNMMW13ejcwVnVORlNEZ1dDTTdEeUVEQkswU3F3OUVNNzMxZDdmQ2xManpxMWltVk56aXBhZUV5eDJYZzZ6RjYzMFdVSElpazNkL3RJckRleFlwRG1XTmhpbDUxWisrc0V1RENjd3ZNdmZhcytDZDlZZEdnMVQyK1BwdTF6S3Y3TG93NmU3OU9TQU9jTEMyV3dlSDBkK3pJNWtBTnZaWWhWekdQK3NUS3JqaUdEYXBORGFOY0FMbkhXVWFDWlBycklGN0dwclNVcEc2SU53cGF2Q2pkcTA0aEdrU1RDclpXWWloZ0FkTmhGaGFrQTVOeFhMejJXaFcwSkd0UVZLRWp4VldQL0FTblhOc1RXaGhZd0NUdCtwTXNBM2hoVXU5NklwV2RxbDR4am13YkJrMkZLWmY0MXUzbmVHNGxScDhBOEw1aFlYZWx2bHVjM0pTM1k2OEE2K3I1VGtFRW9lMWhOaFhWdzVua1BzdjlLVkRWNUZlcGovS0FPWWJRdXJtTVA0TjJWYUxmN0pIRExmYU8wYTRJbXp6cnFCTlBDc28zRVUzNW1xWktkRUlGSnlPUzNyd0owZHVzbzF6T0hzU0NhSGNrRjlkR0M4NVNMTFdTWVhDUVZaeVVyRnh6SktQUURmeHZLYXRQT3Z3LzV2MWcvalZnWTFoQ2VuRGdKbExqaDhQSHk4bjVuSW5nd1EwWEdDdE5RekdOb1RjVWUwZzd1Y3B0VCtMQmhBMkE4U0FFVytXZFU2R0dEZGE3eklnRHZEbGRlTHlvK0hlWVQyejQ3c0Rpakw4TW9LOEYveEJsN0MrTXZFZWc1QVl5SlJHNE5XRGZERVdTUFRQeG1BUUY4Mkg4V0lRZFc2T2p3NVFOekFITHFiT2ZPV2UwWVRQRGVUMURMMlJWTXV3M011cjZBK0dNQzRLQlJaNmtHeDlnTk11ckY3K3JLU0pONkE5MElBUklBbkx4a0FZMDAzOHFKTVpHOExid1laVFREYWtNZnBhbmNHWU9qRkM2ZG5HZUtsbFFvc3VqeFFUTExmTVV5U2hBU0RBZkIwZXJRMktONmFSUjk2ODlLbUQ4SGd3VnNPaENNbGpRSCs1NDYrWmpnOUhNOVVwdFlrSXBna1lGSHd1Z1k0MTBUaXJNa0FtTDRJUUdWam1IYVp3SVFPb013VVhJYTJiQnk5bFNsdHNzQnNWRXJVSDZ3bU0xRmhZVUhRVUVFQ21ZQ1FKSkNnUmxrTnNneGNrUVlYMk40R2ZISEpBTlFBTFh3STZaU1p5ZDZvRWZtMFFVRXJmREZrajU1QWhtWkZvUWNHZnJJUWh0bElPOFlBSFVjeG1iR1Ird1ZqQUNFSW1BTytBaXBMSkhRejZDMDhHSW9sbVpQdWlOeU1sTEJDZnpBQUl2b0dEWnpwREtVbGtXd3lFNWVZRFBBUEdTRERnaTFjZ3pocjdFT3J1aE5sV1ljcG9md3ExVFVUcmNXcmVPQlU0OEZ0dkFYTDlxNE56K1gxUlNQdlJjUkY3OWJLQUJiNDZ3d3dTK20zWWlCc3A4RHdBQ1c1bXpQRXUwVFVsU0Y2YlFZSURSQjV6dUhUVEEyM3Fxb0RZdlhoWWgxRmRaMWdBSUp3U1J1T3JtVy9OQWJ3T2U2WkZHMDdSQVpRNWdDa2FHS1ZzTTEwejdwTThyQk0rMXF0QWZ4Zkh1TUs4UC91NFBhUlNRWkp5akNXMGllYkRxQzJCTWlpREVVMXFRNHRVWW05UTRsa3o0aU10WU1iSWRPNEswejRxaWdPUmoxeW9xcGhwUVFpNTNJNEhEdGEvdzNnOGhGV3pZNHRBZmJwSkliS1pZcW1LdDQ1UHlIQ3RDa3BvYjFkTWtDaEFYNDBkR3FqVlpXUiswWWwrWFNsMXloVmdKZ1RyR3hpNjBWa1k5ZGRLeG5BUXBqTTRZamRpMXFDeUFCa0RtMDYxSlIyV3hZa3dUckEyRTZvZ1R3aWZlZFlpbklGK0g5MzlPRnFnSk5IekY5bmdOc1NJSmIxWFNjVHVqTExBdWFBdEtGbFJDN1dqaTFLOXhXVkNPWktQVkRIVnhIVEl6M05jeUo2R3gxUFlxTkFJWUJCWXRXa1R6K3BGNGtVWGg4TGQ3UFArV1NBeTRwRE5RTndhOEd5R0Jib2hrYi9GNVZVUUtvMHhHcU5wY2t4R3cvSkFPd2hIb01NZ09BMk1vRE9jYVpwNWEyWHdRQmdqak8rcU5RUnlXZHkxTk80STkxVnh2c1Y0Rit6QWhrRDRIc1N4ai9VcWZhSEVpRFdIMjBlVnBHMXpiaTFCaWVYRnc1WC91bnBBNTVrSVRGWVNuTXRTZ1lndERRa2dDd1JqWEFBVjAwbU9kckFCa0RxRGVIdHdMY1Y3bVlBZ0NuemdnRVM5Wlk0aldDQTFBQjFRSGVzVzVUaElpYWhpcG1JT0R0aUFPVU9HUTFqc0RzVE9zRUFzMkFBb0ppUTVHWE9XTitDQVFhVzZxSmgwV0l1bGF5WE02ckkvRVgxRWM4c1Y0QmpyQUIzOU9Fai9NVURsdjZVQWJnRFdUZGxWaHB1aWhlOUl1cHRlcDBCMGdlcytvM3JBSkI2dzNKTnFDSUtVd2RZbmZVeExoZ3poMXEzWTJnZEVIOHl3WXFaanhMVk4wY2t5MDZpNGxDLy9MSmtnTkFBb1R3V0dGd3Z3clFFcUFpVXNCbWhzekZoNS9uNmM0VDhHOTdyZ2dINmEvdC8xWjhqanpzWm9Ha1FHNnZhYlVSVkZmWWVDekxQdlg3dUR4WTljRWdhQWJnQ01FWE12T2NGdW4raEE4RDlYak1Bc1ZrTG9wY2p0Skx5MDdmVzZMM0JBUFF5SVU0MlRCWE12TFgyaENhWERJQWZHbkd0WTRKVmMrQkpqb3o5ZW9yajRpN3RGUzZ0Y0RjL1U5bkwwSExhVER1cTRWMW5BR3FBcUpPTG1ub2ZCMnRrZ0FSVXpIZVF4SWkwSEFSTDUrc2JtMXZtem9JQkhwbXhTWlVaa1NENllYNE1tUjdWZk5sVFFTZmNudFZLV1BreEt1bFJqYVlwZ0FjVkYvVlJHd0YwRDBBR2tHTGVyQXlBOGZnSkE5QVFlQW1zUk9TUUN1TkRQYWtNV3ZEQjJqQTNHQUErWU9RYWF5SU5ubFZmMkdYUjZQSHlrZ0VzRFZWZnczWWJnRWNqeVJHNTh1TXo3VFFhQ0RQRG8rUlpDTzZWUzdLOENlUDNzUkdwR01DelJKbkxsVW1DT2xDdDFteGtBTk44UVhITTA3Tng1bVdob1FHV0NaQ2tHTjJOK1JpZ3pLaWlvc3Q5TUFDZWpaMUxNemlyaUFBRDBLZUVvWTVXTFBYSEZBK3NiUDFhcVlCa0FDM20zVXV3ejIwR09DM1JLZ1lJU3ZkMnhLbXo3am9NM1FZdUN0REZkUVpRdDIzVUQ2ZWQxOEw5ZTU0UkE0NkptZ0dZelE5THBRdzR4dVZ6VVRJQVFyZERSR3Q4aFhxSWFRMUd0RGV0amtVZEl1eUhEaFVEOENWVEExeXNJV3NKWDBnWGU2RUVJTW9hMWJpNHA2aHF6Wm1xQnBJVW93dUhCRTBBcXFqSXg2VU5CQlpiTXdFZ0l4WVlBQ3QyTFBQa3hsVDJTMU9BSU55aU9Dek53TWtBS09hZHFMUGJET0FKdWRzTTRCbXk5RW1seWVXOEU3c0F5dkJSanQ5Z0FCODVnS2hTaDBDV0RxeExUNGl5cXhtQUdYUlJxQVFtQUJrWHA1YjdjV3dKb0NhMW5Ga01lOUlmZVI1Vng4NDZSQnE4N3lTckdTQTB3TSt5bGkyYTV4aGRSdmxDOEJCS01tT3l0MEtpYmF1QWZXZkpBSGdMbWdCa3RtTTVwK1h1WkVac0NEcnBudytVQWJ4YzFyTmpNTkRLN1g1aER1NWJ2b2ZLQ0pCTHdJNFdxNTh6Z1BpTkdLNzQ2eFFoOFBxcHEyNFNGU0lucnpjWllQeVk4TXF0K25vamI0RytXdFQ3cUlQS0hSalJNY081Z24vN0JQalNrd3ZFTHIyMUZnbTluRksxUUlsQmZSYjhoNHpyTjl3UjdFcXhZSGxOcWJRQkh0aUk3MDhuOW42V05ubmxJVmhuYVptcFVURmdFaENxdFFSNEJTZEFnYkF4aDR6Q0NHMk5PWVRZRkZTNHp0alN6TDNTU0VmT2RUVUg4L2pucFJFZ0dZQUUrUlVEaUJSaUFNdmxFckNnYWFOQTlIb09uU0x1L3lZREpBUWFKWUFNc1VpWmxCVi9hZ2J3d2k5bUF0REJ3Wm9KQ2FLeEhHNlVVVStYeC9YSWZLRnFBV2lKeHluUW53bC9aQmpUb3NBUmZxUUd1R2JENjArc1dTQmtLQUZtbkZiRnNoOHFRTWtBZURObzVUbTZicm1IZ3dJSmxpeUZZVkdERWlhQTFacnlod3hRT255a3FVa3dWM3Q0N3N4VHpGaVJNQUw4T1FORVVPQ2tuZGJDNjhlWHlCRDYwaTNaeGU4eFFOT1FTV3VPeUpwZk5RTXdxSmVycGc2T01vQ2xueU1ETE1BQW1lK1l0Y3hZaHJXSVU0QkhFcVdNVE94a1FmbmR6anpaaFFhNFFrUEdqUTRhK0J4TG1mczZzT1JoVjgvMTVMM1NZUUVOMWpHNVpJQzUxMkE5Tk9sbm9wRkpIRzdJTFN0TnhSUkVlaXlleUYybXhzU3FJZ0RXQUxET3BSSGdUeGtBT3hFcmZuZXRRcmN1STZ2TWFoRGxxQ2JoRVBWZVMvVFNXZ0tLK3Y3VXAzbVpXdE1YMXdva2F6aGhZSC9scTRHL2JESkRTWWVwTXRnOE1wSmxlSGNacHhEaWQ2Y0JPYTF5bHZQR1RLdnZvUUdDYzh6SzFHUHpCTFJMT2hzKzVTeVd4M2FIMDZ4a0FCZ1QxRHhYTWdEREhWUXlJWk40ZXBwaFpBTDhTUlV0NXFEb203cnMrYlh0S2ZHTERNQm9NV0F4YWlQQTcwZ0E1RUhJVjNSYkJPMm96Z0JsenJ0QkpMdEFMd1J0cHhNTW1sV2lMZFZCTUFBOXdnUGlZZDBWM0lCUXUrQ2ZGZ1BRSW1HYU1WS1J5S2dsTnRHeUtucEwvNDUydCtJVVppejdPZ2RLbEFVY3VMaVJvOGxxTG1wQm9yNDMra1ZENVRLcVUvUU9MZzJaSERHb0NhVVNpTENrRVJMek5OYklBREJDQWtxR09qNklOeHFNRk12b0dmYVppckg2aFlqU3dHSjBKMjRHL3AwbEFMa01SSHJTRmxmMmE3SzFicnJTdUlVQ1p0b0hLRklrc25DN3A3Zmt5cTRvWFZHNVAvM1RmYmVLWkhmMCswU2ViYURUOUZHM0dFRG90bVBrajZZSnl0UlZmWGxDMEdoZFpPTDdQRVNyTVd1SUV1bXhJcDZyOUJHK29WeEdmd05tUURabkFJcHh5bHZQejVxK3JDMnpaT3BpUXVlSC9DNjNlaytxVDF3bVZDVTJDb0N4VjBZY2h0RXp3MDVoRkpqRUx4VEdTQ3dHOUJRZ2dzd085UDl1TUFDOW1peWFuNGtzSTk4RmNyK0JnOXQ1Ync5ZURiWk1rV2k0K0ZGWmZkU3NON0VFdUdrcFNNdXBaTWtSby9Mc3RQUUZNRlc4WWVRN3BpaENDVXhQN3FKc0JRUDBpMVl4Z0pVYldORUZGNFdXc00wSHplbFVldUV1TXh2ZDBCQmxJVy9kenM1alhHWkFVNUhtL0YvM2lRSjRaakhhYjZqN3hmOXNWOHh3NWplRkZOeXJ3aHFiejZ5eVkyN0Q4dGMrd1hHQnhUZ3B2b0dMd0EwR2lFUkRUVStUQ3NYOG0wYitpblZwODNPYkxYT0xlNllLZ3EvUkc4Z3pNSXVmS29Tb0dVQ2gyeVlCYUhidlZPaTB4L1FHRWxyS0dGTVpKZ1NrZG5vMm16dzhyMjZac3FOcXRrQ25wOW54MThzb3RaYmFBNTJ3dnNkWjVYK01SS3JsTGJGeXVKd3VhdE9pdDBEZHhQOFM4TzhRUUNFeDdkV0pJZGdibEF5d2xUSHdCMW5ETXFFbmpLLzNYNFlyU3l6R1ZCckJKbHdFYmpBQUJnUFJWR1dkaTZubnJJVjZrc1djcTl6M25ENEp2a1p2QUxiQkxIN3F3REpFVXdta1o0ZUtDcXR6MU9pMG9GSTRPd2ljRmwrek5LanNaMWZaSnpXRnFLZ3JXNDY4Wlp6Q0thc2xFbi9OR3NPUXA5dy9HRUFiVGlYd1hka1lpMWpMMjhES0thR0VnbmhabytsRDliOVdZQWhFUm9XMGQ4SzdIVVcwTE5vTUNDU0hZS0E1REsxQzJHd0FaU0lEOElLeWF1elBHSUFsR0FLTXovbEg4N3owVjlVb3JHSVNwa2RXZzAzd05ab0R0aTErbEtkcU04d280YWhRMWRQMW5tVmpXVzBycVVSMTVqdWdJbUlxeGpIT0pwS3Jha29TWk5YWVZzMEN3N05hSXZIWEpOaERRQjI4M0JrQ3NmVGw2Z2FaSWEyVXQ0bVZBd2xSaHBiQXQwZitMeUZLTEpxSHMzQ1Q5MXROWnpBb1dqZWhkNG14QStyT1FTUEVSeWM4STAwQllBQUc5MldBeHBRUjFRSEdKenJVOGxkWW1laGVlUDVSN2M0eDAxa05OaEpZVk1IK3hIb1VCWDZ4d0xHT29wNklXN0lZR2JTZVJLZVZWQ0oybFBBdlNEZmt4ZUJzU25KbDAzbU5tN1lhWnhpUlVNQ0xiWlpvbURrT2R2S0NoM3A0UEFhOGpQODVVQlJ0RS9KMm5NQTFiNEtXYTVFMlFZbzBzd04wRDNnMy9nTmVyV3d2eEJoZWZrU0pzb1g0Si8wNTVMV29Dbi93ZzlXU2dobjM3T3FJbGVHcXdQaXMvUHNZZGRheW1ITmRIZFBMVEg0RGZNMWVBamFrdFF0bks4S04zVzhGREErazNkVEZaTXVhbGdiekFUaDBDU0F0c1gwK1FrdVE2NlZGbzdHQmhMUFY1SEZvNkRpcE5DVzBGSVdNbzVhcGx5SmxxNUNpd0tpUkVTcGtIQm5KUDZIQWtSUGRYZUR1Q0lxV0lTUlhzNUcvU2VxV0dLUDJFZkRRSDhTeDBNalpLYzBldVFhOFJJQi9xWTRFcWtxYkEwY3pHeEJzbjU1UTRRZzZCSUxJeTB6cWVJM3IzaW4rUTJjQ3I2Y2JJanJaT3gyajVxdGRubVZqN2FRb3o1dWkwTWdFNFJLRWUzVHlzUlgwMFZyNjlzVHhKWUhBT3pIcEV0RVBKRHlxRTBzakI1TlhaN05BaXBLcENTME5ERncyREZnQ1JNdmtJTGJnRmVvQUVpTlFwY3hHQW1FbHZGQmt5a3dibk9TRStwdUdWcG85OXNFQUlUZnZDM1ZFQ2RvQzQyOU9Qbjk5VmhPeUNRQytZZkJqTHFDK0J1ak1pUUtpWjB1bWtJdmlpcnhBbUkyWFU3TG1TUXJpZkNsRklmOW04ZTJpZERwSXNVRUJ5NUpBb0hKa1Q2Z2JaR2MxNlpoN0J5RHRyKzhvclZ3azJxcVJvcHdYZERCZWFDSGNOSGR6anpjMExCUGQvYUhDQU9DTVV2NlEwTjRnb3BQVTJUSlRmRC9Ud0pvQXlKUlhoZGtqR1NCcUpITXNYUUsxd2ZnekZ2Q2RlVDFvNjhYY3A1U2tHS2ZBajNGWGxZUS8ybW9URC9BSy9vbmx2a0ptbHljRlhsU0pWZnlONkFld08zcndEeFFYVStXalNTY0FqVVFEMW0xQ0EwWk91c2krQllVYWtHTWNUOGpvcGthS1JtWTI3aUdyRmxsUG5aeVpUYW93czc5RytYRWF4T2RGSzB5eS9XeGxwdmlLQVk2elNIcjNxZTJTQWRweU02dGV1ektqS3BIU2xySVlZamdCbzlYZnFzaTVhOHloMVVDNGtnaVhpR29jNEJWK0FlaFdJclB4TjAvU0NneVJjdVl4L3M0Z1dHNEZvaHVFU1BvWTVGWm43aFVDMGRpVWsyNjF5a1JRUUdGNjZtRTNMV2NjRjV2blpoeWJTWEJkdGdMT3dqYVBHcU9GbWYwMVNuT0hSeVJhWmF2L09IaTd5UUFaRHZENS8wbTd3Z0M1YlVtZEJHWFgwZThLNXVhZEd4cWZ6cjZrVlg5SElUTWtNYUE3V0ZXU2R4TGhFbEd0QitoTTh3dXc1YXlRMmZFMzBUb3dubWtzbHp5dlNFQjFQRm1BdlBZZ0gxZ0IrZ242REZndlloblpFN0taWmJ1Y2RPdmVnS25naU1LTTFNTmhRaVNOdkRXb1dpbGN5LzVEdHRLZlJYb21EckdnWHBZZlQ1ZFl0SFV3UU9uUXVNVUFNaVVZTHdiNlgyTUFGNXFwazJBSnBrRWpGRXpOSTZJdHBqT1h0TWY4Vzg2Qy9ZaldITEdqWTl3Um81NUVxQkhWUEFCbkdpQnFIcjlmSWJPelBoT3pWU3BwMUY4RHV5NVQwRUUwWlFqSElBcTBvU3ZwNHhsT2FmeFAra1RtNzV4MENBL2krWkNMSGpya2xkU1NBUWdVUFVUZVYvWm4rK3hYSG0wd0dKQndMVERPU0pxckJ1a1VqOVpPcUp1Ni9TVURSSmFRNXVNbUExQm9VaVhwdXNaUC9UTVVURVgvYXZQcW51RmZ6YjhkZFdHT2tDZjR6alJhTDczQVZhUFhOdjBsaU5OMXIzV0Z6T2Jmb0UrbUxGZTZsTUFOYkxzSW94NllWeUFaWUVFQ2ZSd2MvVUlHeVBZWkRKQ1RqbDZNTkR0Tjcrbk1hRE1BZ2FKYUhJaVZnSmsxancyZThjcWZwZFFjUk1hT29KN2hETGlPSkFNRWlaUWJrOVNsSWZJcUEvQXpRZityREVCSGZPb2tRK3o1R2RuZ0NpWXMrTDdEd09MbUU1MlRrL0RHOUpnL2UvejhLdWhNRXBBVXlRRDBLNXZyaC9ibENwVmxmMWNCYUVvdDRiS1NBVXlyaDd4cmRuSlR5ellha2VnTjZXT3Z4RlUzQ2NRUXNhTFdvOUlIZmt6SFpod0xZRkJ6dUdBQXhCMElIaUJJQ2s4QTI4NVJ1Ky9wMEl6Y3lqcEZxbXBmTEQvKzhsZ3dRTXJvYXIwbzBxLzhsQUZ1U2dCN1JLR1RkSEtKQktRT2VHSURUL2NiM05zOHQ0eXBSaGJ2UmVNUlExNWFGVVZPd2Q0ak9GS2NUeXhNRTYzRkFJalRaSnpXeS9TWERNQWM3Z1VEVUt0WFNEcHFpbW0xem0xR29vTkFxNmliU20yZjlMRzZ2NVpDb0p4MGtSTCt5YjA1RmhUUUwrUk9ucTlQWDBYc0FyTG1XVk1weDZFbzQxb1JRRVVIYUtYWFFUVm92VXl4azF3bXFhLzNwZzdBSEFzL1dRSXFQZk9RZVpZeFFhSTZiczVzdkN0bnQvN1V2K3pBcTQycG40Z0RYcnM0bldlZ2RnZXR4Z21BL2w1VWZQd3JCdmd3TGlzWndMWDZRZDlpYlRWSU5ubk14ckNiMlFYR29lUnNoK1RWVG52U3lSSFA4MkhPZm43NllYNlZBWjZmSElZRkRuTlB3S3VEMERBVWxRUllwUVJJdlE3cDVpa3Y0dWF4azZ5Z1c5ZDd5UUNXem9BUmdiOWdBQ29sVFZhNGowclo0RndQaG1OMTBveU53UWdkNW5ZQWUxOG52RE1DNUVrNHowaHRYN2FTQVFnQjJiRWtlY2tBRHcrWERMQ3dGNXRVREVDdHZ0K0h0OXIzWFh3RUNMUXRzSWUremRHUHNZL0RNSllFVmF4S2xCYlVaWkhnaFg0dkdhQ1cwaVVEbUpNQzErQTRhMjJuRG9BYVN3Uk1sRFRkRFM0aXFLcWRaSkQ2ZWk4WlFHMkoyQVo2UHBPZk1RQmZhT0FWN2lOdEIwVUFidUhWRVJJZklTUkFXbzFJM2UrbFVDQ0VBYnl3ekR6dVBJc0ZIOHRXV2J4djV4QVFHc2FTQWJiU0xobkF3enFUQVVLck56bXFLbnl2WmdEUUowY0lobzU3c216ZmRQZWFvSjcvM0FuS3VoVXlSRmNaUUZvQmdkZ2c4U3VFbjh3VzF6ekc5UzVBaXdHMjRIZ3VwNEFvSjNWeUoxbVMraU42cnpHQXREMmg0L0R0d3hMMGNZTUJLSkk2UmFHYWtwZ2pGd0JRaDZFS3U0cUhlVzdNamJpMUI4OFZRSXpRTXc3TTREOHA0U1NXNmpJWlFCY1NCc0hUamtyYWp0QXVHY0JlcU0wQWpUUW84Sm9DcG1reGdIeGdBVDdWL0lUT3k3NEFpUFpiTVVBQU9mU0NRcjVsVWFCQ1lxQWx1RkZUYWRxSEpDNDMwVUVmYUo5Ui82T2dYaW1ubkRwc05ha1hWM3Y1eSt5MlNIWUkzejRRVkIrWEVzQ1NFakRYZ1JIY1pCSUhCMlNHUEkvQzIvZ3FYd1E4aHZhTlFXK2krWFpSaVIyeGRQRDNjNnhidFRxUmZUVzZlbzNSMzZJRzlza0FBN1lMQnFBRVNnYWdqUlU2b014UVJhdkRyaG9NQUxVK3dhZW5vMzhJZVlrQWpKb0JraGJVY0xDYSsxTmZDNTBCVTdycE14MlJCelVrY3RzR0x5UUF0NWtPbXkybzkyeUpJd2JKQUlUZWg2TW5UbTczSmdORTRuQ1dwa0JrenZxS0wwQVhaekxBVUN0aHBRU0R4Q01XSGlUMWVZN1BjclV3ZG5vS25uUWtoYjYvdm9sYjR6UVQ0NmtGS2RYZ3RPd1NlU2F5a0Fpcll6SkFQMXFiQVNpQmtnSG9xUllkY0cwNklEMHJ6Z0JvS21lY1B2S1Vpd1ZnMzJhQUhGSXZQMWV3SGQ2WGsvVEQycUZQd0JuVGRGRXRKbE9VMkFDMEszak1rRk1zR2txU3NHR3E1Y25YZW1GTnpzVGh5OGlYdUxyR0FGQ2R3UUN3aFhkUzR0R1BaS0hWRE92MUZKVFRRRzVpR21KbGlDQnRTR0JabnhwcDhid0xVUGx5WDNUcENzVWJzUWdJTmY4Qzh0cGlBTnMxcGpEbXJrNkd5K0R6bWl5aEtCSHJCT283K0hSMm5BVWY4OUhLbERlWGdIdU9oajdUMkk1aHViVzFkdDRUK2pPblhnb0FHb0ZxaEx1MHpFY1UxS3ZsVkw1TW1ZdW1JUFd0M3V6MkdoU1Q0VlVHTUk4Rm9hWG5icG1oSTlEUWgva2M4dHpteUxlN3hEcHFZdVlDb0dRTGVtcjdNRmhENWxlNlpJRHMraFM1cWZNWjV0MzNhZ21JZG1nekFDbm5IK1YySGJFQXdlN1dvMlRrSTB4RVl5M1doeER0ejVXTUN3QjhtbTBsTUhmcXBoSlI5Y2FyMVpQVTJzcFRwSGl1d2lCeXByNkw5RUw0bE1xUTczS0tJdU9YaHFEWFRMU2V2Wlc0T0ttMkN3VFZMUWJRS005UDJzSXJOWkpaSGFWSHFRTTZJejkxWVJLMWVmdEtMSG9hZkp4MkxCVjAvQVVESEV5WkNLV3hVQUxaTGhrQWo4OE5XVmgyc1d3QVBrbkpuVG9BWUN1czBBYnEwTlNCNXpKa3AySUFLbjNGanV5VFFnbU9ncG9Cd29FY2xVYzJZVGZ3NUkyL1lnQnRLRFRQTkJ1dG02Y1hOQW5saS8yeXBSbGtaQWd3OFM4L1k0QytJWjViREtBeWt1Z01LeHZFL0dKbHJxUVBWd0hHbnRQWUN0YUYvdGI1RFFhQUtGZFZQRlN4Y2h1SWRvVUJodEJQbXBvQkVLN01mOW9NUUx1TGNmS3l2UUNndmJhc3J6UUVwWmV3N3czcVNZc0JJb1FFOUs4RXdHcG9ZTjFmTGdIemVWSEJhdHAyQnRIeldURUExZjM5c3IwM0NEcXFiLzhtQThCajBhTlNzbUpTTzE2WU9neUVwQzFzOUluUkZrU3FJZTdaNmVrRHBPM1hTd0M3V0thWDFyanFmYVZkWlFDalhza0FPK0NOMUpZR1FOS2d4UUN4cS9VRUJKTklFMUdZVk10SlIxTnc3ZHhKQm5mSmtEckRBMHBkZ1A2V1VkZU5mWVRydDVUQUswazVkbVVGcTl4aWVMdmkrTVdHUDZwdkhhS2xTVkI1OFRMdmNXUUpvOTBCMGRlSjVKY0xLUUpZTWg5cGdXMEJLSXhFTUFOUWd5NFo0T1BqRHhtQXdwaHF3RzFUY0RJQUFXbmMyMXJPTU5NQnNSVWtvcnhnZ0dlM0JOTW15eHYwVnRFcWd0SXk1dmF2MHJsREV3VTB4NUlCRUt5SW1FYjdZS29OTkFKSnF1V0xiYUQ3bXBLbVpSNzdpNENRTXZRaktTd21QMmVBS2dBbEdJQjVNd3VSSEF3Z2xwdTBBekJ6RnBOVUl5cWtsaHpBbXFWSlZJWjV2VWhENEN5REx3STUrK3NsZ0YyWWphRUcvQTREMkFUMk1DZG1EWVFYRU80QTVwUW9HUUJHZWU1bkl5MVFlOFNLU2RjVXFKaGw0ZHlKQklTNlhsVU1nTGgrRk9TcTAzVGFCanE5Y3gvaGZOSDRoem94VjFTeVNOUjh0bVNBa3NLbzJVU1VhRFlqaTlFTVFLM0V3U1FEWUJ5Y0Fjb2xiNGxWN0dMcGlLZ29tRTk2aFJ2bG5WaXFMS0FmZ1hPL1pnQzZnMjFCK1ExMzhDSmRWTTRBNzZxWHdndG9ZbUJvV1dYNENGL1RYZWRMcGE0dE0yOTR4MlpSRWduNjlJSzZteS9URHVOR1BLOFFCQlRCdS9aZGhKeXlqTXVjTFpPamx3VVR2WmJOUGxIejJSeW4yQ2twL0lNQzUva3lDSFdKR0hzQXRSamZZeXM1OGFHbEtYZ1UzazhTK3lvRGNBR2dFekRkZ21VQXBsK1MxVlorZ3dHZVN6WGd0eGlBdGdpY0ZLbWE1VFFoRCsxbzAwaFlDUUtaV1g1UjJsaXFsZ3dRdTNyNng3RnRaSXk2d3c3VEY4RFFKNlp2UnlrMVNnQkEzZ2VSbnZQYkFhSnNXVXUweUdESi9XZ1I0emdxL3NQMEFLbVR3bWhXOUNSYkZtOUJ2TFFqWXFDaUpqNjBZQUJwZGZ6RFZRYlFsNEptU0NjZzYyOHpiTXJpZDNPR1pJM2FvSFpDcVZ0ZFJzNEY4ejBUM1pzTXdPdks0b1dteFlXMWlaTm92ZEtaeEVvRXREODZnZnpQMk5jUHZPVytxWnAwaVlvNUhzMjV3eHlVa1JSazQxSXZwbzE4TENCNVJTRXZIOUF2QWtTak9XWnFWaGRNUk9Fak9ic1ZzT2VoemlRMUtYeEMyeDhkSlpvTnk4Z3hJcmNmMFdwOGFESkFJODBMWXBOZnJ6R0F1NWQ4N2ZlTmxJRThFU1JjemhDcXhNa0FnNFJTdDd1QU8vVEQ1VTN3ZHg3STRvVTY5QzRXWXhLZE85clhzV2NRUU80RXlqL2ZHTEZUTi9abmpGeWlZcXdJb1RUQ0RvazF4STZvS0g4anlJRnZLR1hmWlNrL002RnJJMENVTFdxSm5sb0ZFNC9BUnJHd1hEYUNIVWhxUW8wSVJKcnRzNGhha0J2M1RzWm80ME9UQWJqaVJRd2s5UDFyREJEMjNqNmN0MHhkeDhoR0ZLaXRaNGpYcVAwcVNFRW9kYnRMNTJjY0xtK0N2L05BRmkvMHZ6SERZaElOOFk5WkxSeEFUZ0s5RkFCZktuVnNhVHV0SjEwV2UyVVYwejFoaDhRYW5oSkJDcnNyRzNnbGkza0MyQ2hOb1NzQWlIcnpJbWwxd2NRWm9IVW5oeWRtbzgwSHBDYUI4NDlsV2JteGVQSW1sNFpMZk9qZCtHWVVORXFJWmgya0lZbVdxcjRzQURsdDNlbXpiOCtRL2RGMG9pQkZRcWxiWGJvaGljUGxUZkMzSHlpTEYrSnZGNHN4aVo2SXZGYTVqZndZZ2VxdEFMNGNMYmIwbnNTa2kxMTl3TEt0amk5aGg0bzEzSXlKV3dxa2svVW80WWlDNHp3MEtUejJ5b2gxZTVUL3hzdnNWZ1Z3bjJoUmxCY0ZadEU1SURHdUwvbkh0S3pkK3BheUo1WERLL2pRdS9GdEhNUVAzOHFXbUVJNk9EeHhHOUxybGRwK2U0WlliY3R2S0NJa1JVS3A5MVdYdkg0ZUxtOHlMYStMNG9YbDMwQ1l6amlKckU0dmNHdGZlT3k3RTJpWmZ3cWxLQy9yNldVdGZsZGxSakV6QVpBa05Dci95SXZZZ3djQmlhaGNFZStRUlVTWElRc0M3Ym9zeXlRV2FGRjA1djh5NWJIWHRJNC93bFNoUkN5MGoycDcyTWFIM2kwdmtWRDNSZUhsc2hZaVlkdUp0WkpaQnVScEF1V3djaVdPZXF5Q1JMb2k4MEdTWW9sMWE3a3N1eEpKcWlmblRRcGd0Z0ZHMFloVDQ1UmhjZVVDY2IyMFF1Q2JBUDF1ZUJLeGlvNXZ5eGExMkRGbFM0UTRjYUpZQ3hJQWQzLy9GbndaMEJsRGlNcVB4RThXck05eW9tQllhZ01KK2kzTEpJNEx0Q2c2OGI4dTduSlhyMkc1L0NPTmxSYVU3ZmszS2dOUkd4OTZON3VCaFdUWjVxSWFhaFJyRDZDZmJiTTVHbzRVUjdIbUJGVmpEbUljYzdJWWhoNC9PTzBlSFZadGg0dVRIV2lNS2VhektxZVgzRHFyUUhQcXMvUW9iZUFzMFU2d0ZWNFA2MjBVbWtiNVdzb1BycFVzS09wS21JMFA2WllBT05FUG5oTGo1dEFaUFNTYmJaNWlqcUZjNlNpQ2RWOFIrNEZBWldlWlJCaXdBaTNxdU8zRXdZVmRUOE55TzFHeGdEdGJEWG5TU0paK21mbjNJaTBXR1dCL0RRMk5yU016Vm1ROTVLWFZPQTlzSURUOGxJZW9oNTIwdHpLMG1JTTYzY2cwYjFCeHZLUy8wMFovZ0lQUXlHSFdoWnZzQVV2MldmWG0xSHZqbkdRQ0pabGVxVmViR3FYemt1d2RGZjMzOUk5N3FYbWo5V3ljZ0hnM3hOcHNsek5aWmpUb05tRUJDdFRkRG96YkVETVJQVjBtVWVqU3BCKzZyb3BpZ3RQQ0loQnBvcW95aVFWYWROTEovNVdqUmE0cmh1VXlFeGwyc0F3c25JUUpzb2FTQ2tLbVpnQXZ6NHhtY2hLSkYwQm02SlpSUkJZMHp1TFBLc0x4eS9IZysrOWErZ05USHpXWldad1FKbU1pckorZE5rb056QldoejlIWEdIU1oxQUVsNVE1RW5wSjZrWXpFNjhFT1kyZWQzVnFRbERzRlpIN2FlMFZSVW9yUFBYbENHMkJFcmFEb3hzT3Bzc3lvRUFubUJwYWdzUnltRWJrQjZRdjFlR1ZwVkFZRGMrcWxMVUwxNlNyamxSci9hTmE0anpLSjZmSERFZkhHNVArQ2ZGREVhZFkrdzhXSmJTK1l4dUxQK0w5Z2l3U1RJOXk0Y2dmY3lhNE5lb2ZRaURNcXFLOWRTQ3lHOVkwMnBDcmwyRDUwTmZ4cTYzL0k4eEp6c091VFJiakVFTlpEcDQxT0Q4YUNmQmRhcHFjOGQwcktZcWU5WGJrTWh3R2ZzdENPb2g1c3A5VTlXcFZGYTJaUlVSU1VPak04QkNtcG1CUW5DNHBDUVZMRUlsMjBtTGtGREY4STJNSzRyZGVvdk5GaklpVzY5ZDNldGRhc1M0dFd6cnVtOGNxQnpLMXBVNVE1K1poejJxQVd4QmM1Q01MaWJnZE5ZRnJrT1I3R3JPVU1lRzZrazZqQzMwOWtBR1lmZkFLUk1LTllDRHdUN2l3SkRjVmNDVGdGNWpKM2F5ek0yOW9CTWsrUXo4SE9nSlBGRnIrekpoWWxiVVlyblNzNnVycFQ5bjBtSmdKa1BQT1FyVmhIYWNRYzhacWJ6YVBSb3g2c0VMWGRuVVZyUUdvajZ0eHJwSFFUUk03YWxRZ2IweS93a0dxV0dVV3F1eklhd3dpWURDRFR5NktoK3NnUnZJZ0FVUjV0RmlxRTIxa3ZGK0ozU2dab1dNY284bzZqQXRtblBpWmpSY2NackRYUWZ4alNyRUtGWEpKUWhNZ2RSTituOFFxcmgvOTdwMk1Fd2VtYXlOajBwaWVoSkhzd2pzSkNrR1lCcU5JblJySUVNMkF1Sy9NTjdWdFJrM2szNTByRnRMRE5YTEYzbHBweDBFQXc0UjZzUmtBTkJqcUpseVp0TUtzNHZUSWxvUnoyZXJEd3I5WGRjeTlhUTFRREs0b2laaVJDUkNNdHBkdzNDNHA2ellJc003cDkvUmtES01VQlNwRWF2dmdEdEJiWjdBRFZCbmtYR1poT0JwQlhvQTRRWlJJN2hiZXlzUXBrSHlRcVFTb2I1dUU4OUN0Y0JzdUZ5MVB0WDNpaEliVEIzd3poUi9TR1d3SXhzcUpaSUNzMjZNWTBRTEpHbmkxZkJYU1QzY0NrbVlmZU9TbVJMQUZjaFIxQlljQ054Q2MrQjBGU1E4Nno4RTVqdE9uUDlRZnVhQm55c2s2RGJaQzU1UFdGdkF0MTJqVUgrNE0wTmIrN1VvOGU5dXp1b0J1WUowNUdSenlCVko0RHM2eGRPVWhzaFBZaWVYaFJadlQrcHd6UURNNG9VOGxzcWtRVjVkR3lNbUpVMXV5VXFYODZ5RlBCMm0yWXpTZ1RvN0hPcTNWa0hpOEttQjdLZ0l5czRKWTFaRStNOEVlQXQ4ZGNxUUFBQTJDTUdwRWhRaVFENERPOGVpVVMxWkFWSmxjTTlNMjNaalFVM2RXT0RZVWlocmVrcTl4bTdvQno4RURVbWVqRTVzblhOTEtXbnZuZ1ZKdGFqa3huQUNhRUEyTUx0VmpZaG45a3JJNGVCdGt5MEZySngrNm1GOUdBU1dwUWFOZldsRkd0TVdFL1dRV3VxL3ozU3daQXp2eGhseVZhcGFOOVZLWVliNGhueHZXWi9HdHJOcGVpN05wYW8rWG1RRHNvVVFsVVRaODhpSXBKWGRZUWhyQmdzUkVWRnlYK2pUdDlMQUhLQUJpNnpJcjlZcWtBVldFcFg1U0puZm1qWkFBL0JEdFVGU3dUYzVBMW1ZMVZ3UmJXTFZNTEFMblBQdVcySjMweEJ2Q1VrSkc5R29WdEVFRXUxSnRUeUFGeDdVVnJWQ3hTN2hyamdyVzZpZkJDcjhGY2hvSGF2Zy9WSG9XNUZpVUQ2UDBHOGp5TE1mc3BBK0E2dmVUWFIyc0dNRUVIbGRxOUNwak5Yb0VNUmFFSE9yVlpDS0tJeWtvQjRBRThSYVdpTjZheEtoUUF1ejlEQXNnQWN2TU1Ya2U1YU0xZG9XUXBpalQzcnpKQWxuTy9oeUNPY0RsdVFHSU9yaGNoV1QxVUNoUVRsakhGSjdJUjc3U2hGS0FuaGFXalZ3U05nY1NzUUdBclhsZDdXUTB3Z1pWUnZMakUyamo0UVFXRVo5Wlh0a2N1dGJrMFp3RHB4ZjFFVFZQZXNIM0ovd2tEbUpVS3htRjY2NWptMzJvTE5RaDA3L1VkdFhYeXFDeVVuY2l3M0Z3RGxHRk1XSUJWUWdFSXE2NXZBOVYwQUwwanNtSmozZFBrS0xGV1FXZURGNzFkc2tFUFVUMGdIYXFBMlVlSFZwMlJDdDdWa3JLaXNRQTJBeVQ5aWlQTWxMOVk0SDl3SDQrVzhJQmpaaGk0ckVMeERPclczUTFib3UyY2Rlam1jQ0MrRElRcEpSRmtwTDFRTGhHcDNjdGR3TjluQUZRME04Y2l6UnRMTGxhaThxQW90S0x0ZkZtUEZVRDNIY1VhRUZuMis0MVhDQ0k4MFZTWmpyWFNFUFNtQW4rbEk4dXMySXk0V1BkQ1dZa2FCSmNaKzNYM0RPOURodE5lQzVrZmFBVzllWVFiWW1KQlJna1I0RStNUjRFQmpBakE4dGg5V09OZWdQTUdFZ3VyRmgrVFlVWGwyem5vaE8yU0FjTE44Ukt5Q3BqU3hpV0FiWEpVR2NKVHJZcjUveEVEN0dGalY3T2o1Wm1iR2VGVW5GdkNnME16WjM1Mm1OSUMxRFl2dE1DTVExeXdRTVBTZzBVdFI4cTZ0ODdZSlRBQW5EMU0wd1A3RitwQXFvVWtxQUpPOUJERWk3Sk5NQkZFUVAzQVFUUDExRlFCMEl2THlsTE5sdlNRZGJySUFITnB5ckRhWEFLZ2lCS0IzeDhMYno5bkFIWkhhek1BN2JOUmloNkZMQUF1U3NDeG1XT1pMQWJ6Ny8rS0FSZ3NCSE1aekNoakYrY0xGS09PV1oyWkNrRDdYckVQekJwaFVUbU9ES0NhRTF0VE1ZQ3EwRGw4UWtidTVRdUlDQmVGYTFWN1lPaURIOTF0S1NWc0xpa2pBZ0JGZEdzR0dEQWZXS3RTd2JuVUFWenNXRzNLT1ZGWjBYYVhTMEI3WldpSzJodGJzNWU3RGpBTWUxUG9DNkpsWkxYWSswaWwzZEVwYUwwSlQ0VnUrZGNZNExUSnRSYkJ2cjRSQkcwNkF6VXRjVmJQTWl4M0VMczdUUGVvRVJZcmdETkFQMXJOQUswcW9PT3cwN2NaNE9NYUE1aU53WnhxekkxYUFHZnoxb09HTmt0Y1Z0MFFTbWN3d09VdWdJc0x5MXM2U0t6RGhsVTU5YnJoSkZONlJEZnVJK3FwNWUrTHJkMUtPbU52bDR1VmdrR2NBYkpYQzdvR0F6eHhIeWxzT2ovOFBRWmc4WGxmNkdlK0VmeWtPZGlVY3E4dzZhaG1xbmNVRGI0R3FMZ2pCdHFkRjluT0pRTmN4T3JTVS9kN0RKQVp5bjA5R0JiUStRVFpxQURJcWZsT21sdjFIWm1SdkR2anRHbzdRSVhXR21HYkNacnFqbk9IRERTUTFOeFV3TTdDaWNJSnBEditqcG9SYmUwTDY4QmdWOWdCN2xtbGNHMEp3NWd4VHYzckF5NE1QUWR4WmQwVXpmRHhGeG1BbnhudU9xcjB0dlNBc2IyS05nUE9wWW13RU9KeXFhUXBvQ3ljTVNPOGExU242S1FTZUpVQnpNSDM4SHNNTUswTXc2Z1RWQ2JQZUhSb25BcUFjOC9sVXBxNWxjVHl1cDYyZzB5VURHQ1JYMWxDN254V3E0RlFSS20zNjFVV0gxU3RLc0JXVTlhenN3cFZjK2MrRzFWRmhLRWFWVkV2Kzd5bUxiSHZNc1N4bllmS1FHekpkMmxnN2g5K253RVdQRnJhVjBJaUV3UmdGcmNzTTZjS09Vc1FOZzAzZ1p6bTlBMVBFTVBzbFZhWUVTVEwwQndad0pDTlB0bmpEUWFBVC8veE54a2dNcFRqOGUwUTBpei9LbU9IRmNDbVptQW1ZUWVnN1libVd3WkptQy9BNHozTnp3MUR1NmJWVVR2dVhQMXV0UGpZSG03TjBzK0hoaXFSTFpSS3Y0VjFuOE1UNGRXb0RoNEV6YTFTSDE0ZlVidVRXZVFPVGUwaWd0WkU4N1lxdlVsaVFQY0M0R0hPM25ZVlRVamp0RDU2TElmT3ZNZXd1WnV4cHdBTHlEUXBxaXJPaW96SnIwWnVWbG9Cdll2Q0dlS1RqeENtYlBDTG80TDBGUVpBVU5mdk1nRDFDLzZxR2VBeEMwQ3JhVklOK0hPYm1rR0MvaHB5V01zeHIrM2pBamFoSTBNd0xNc2o2OVEvb0VyOW9BSDFsRlN3QkpJa0lGUlVmVlBBUEN2Y0FDd2UzZHhUMXRXbzNOMjBodDlYVFlKa2NITUhyMHNuc2J4a09wbTlkTGp5SU5NV0R3bndrS2Q0ZkhyVzBhVTBWcTVvbGZQYno5THJodmc2ZExESUZNbU1kNDI2SzU3bS82a3NMYld2QzJld3lrT2RyTDhNQzc5a2dLL3ZQMldBajJzTThQb1dKZUNCRk0wcVU3b3lnUDdhTlllUEhKdnNNRFBNczRWQkJrc2RhYWJVZ3krM3h5bFIxa1RJc2xWUjRhWW5MYnF4aGZKcVZEc1BnamJYOFFpMTNGSzdaSVVVaStQcGRCa21ndEZuS0VPVURnZXIxSlUzR1BERlNzWjBrK3VWUkMyMnl2a0pvZEx2RG14QUFSWjRlZk40UUV4enI1cVFhZjZ6dEpRSFI1YWxOTEwyQWd0dkdQMnZNOENQUDJLQTdYVUdJTUtGbVNQN05nY2gyN2lrdzVQSm1keTNEQ1JwWjJxQllhT0dFZEE3blJHcEo3WUtUb21xS29wWGZkdnZnMzdhdXQ0OUs2dFIwZkZ5UXNoSnhCUTVkR0FHNmNseU83cDBJbEJNSGhlQlppd3o4WTVIVlpVM0JPRkg0c0ZSSDRFeUdVSlp4OVl3N2lVaWJ4UlpVT3l5aGN3ZS91d0JXNnd3eEQrTTVJK0loa1hoakFqeHdmdnlvY1FSN1ZrODh2Y1k0UEVtQXdqQncvUmE2UUJuMjNON2dna3ozYkxLMU1adDArdWR5K0VCYW45R0p0MG1HN1VKaitLU0p2UUI5ZkFuNnlPVmRaR2k2dHUzVjdqWmVqV3JsNnFhbFUwK0JrRXpmTkJvR05BQkMwWDBnbHN5L0ZNbFRCbHF5bkRKVFZtOEpBcUQyUitJOFViQU1TWWhoVEVtWTVTWFlwa2NoeDlPbzBJSHFVdE1BTURuUkFCRnBMcmgvcFRhQ092eXdrVE9oZ3cybnBqWUFmOThLMzZSNVdOL2l3SHlSODBBMUpJOTltd0pHQW0ySzJ1enVubWh4eDVGcUNYUE1ZdlhTdVp5VkFYc0RKZ2lySzZuRVZuR0dNZkpPbU5PdldmU05LTjN0YkhxbXpTakZCVWdHS3U4bWxVVWJucmhlc2dBWXFPaFV4VU5FYkRXSTlOTjdnbktSTEM1TmlkUlhhOUl6K0hmWHV3SUhFQ0VTQzdMR1ZOck96QStLODZIWUM4ay9TeC9RSFJBcENVaWhuRmJ1UldRSHhhOXlod3ZpbDUxK3Y4dkdTQ0RWc3FOcXloclpmSksxRytBVUdXc3JiNndSck5MSjJleWlHbEdYTEtpVHY0SEdVOC9tWVBqb3BhWTFXY1NnWWRJOUt4d3N3R05ObHFNYXhNanJUVGFNRm84UVhTc2tJTHFpazVMTkJDVUxhZmJIdkZ5SUQzb0lqOFQwVlVVQkFPaExMb2xYTDBwaG1jVXltenNaa1UxU2h0SUhoN1lVK2tqZVhWNngveWVHYndLMUo1QTUzQi82NWtoUGhaTzArdGhFMk1HSUpBZkJjVC9BZ1BNR1dhR2VFc1luZWFlVnh4MkFtcEVUMTVsU21lZ29TYWZZazdyRDQyNWhoM3lFZ3lMdldtaVd3UFNNN1dwNWMzK0VzcnpPRWpHRXppZmdCZGhiRHNtRzRHU1dDN2NGVHZUQnJIYUJtVmFNUzMrcERvUXNqWUxncEZRaUc1aFRJdHZ4cTNVSG9SeTJaNHRNaFVuVWQ4b0lxTm5tTVMrMnd1RmsxcnQrTjVOUDZNcXByelhNQUUrQzJsN1lXNkFBcEVjUU9qLyt3eHdLT01CNk8xanZYc20yVHZ0R1hDNVk1TE9ISktuQjR5K0lVWEJBWmdhTG9meFErbVBPWEE1N2tJdzFuZ0w2WXpVU0lsOHpiVjR4Z1U2aVhUS0FvYnN3aUtnWGREZ0dFb0JCQ1YvRzRqM2toTlpUcy9kWDdQY2tPc0l2SWY0c29yUFRqVWFHcUl5S2tLY0lKU2ptZUVDZ3J2REhjZnpNQTVzb0V5SHZRZlRHeitRbjQzeGpHTG5PUGNZVzBuNjBhQnBtbG1VM0lZQjRMLy9CZjJEQWViekZnT0VPU09oUmNrQTd1MkxldmRFUm1NQ200WUc3Z3locUFBLzNYMncvdDRzd0FoRTVEbWtlVXcwYkEyRzlXVU9qVm8zSWJoRXZtYS9selpNSXJuU1Z5QjEwQ01uUVRPeU92UXN1ODdmOUxlM0V6T0FvYmY0UHBXMFZIdTU3YWM1c2FqNXptTnBhbFFRTFZrRGtJSm9BNW83MUt6bjBBRVYyenpBR0dDMytEckZHRVJqTTF3TnhZT21URHJIclJXaDlnMDIyaVlCV0R4ZTZYOEhDL1FvclV4Z2dEcGZSU1lrb1RlODQ3WHJNYkpibUJhdHBBclZibW5vbXdGMlFtRnN1WE4wL3B0MnBOVG1XbDNXSVZ1aWhVWm02bEVVNGN1cTZZWTZJdkkxKzcyNEtRdnZFSmpGSXNiY3lpOEIzRWZnNHlvQ0xQQ1IrUnRDOUVJYlRRbG5oTVJwT1ZPbzhxNGJNKzh5dW9WcEpyRWZYZytLcUlwc2RJVWlPcWRSYXhhaTIzcCtJRkVBOUhKbGVqUGQya1lDaloxNmttQ0dMd3ZmbXhWRk45QjZ4SnhBc3Y0TCtjRUFtOEtFY2MrMEFIVytDZ3l5UjA3d0IwZWIwTUEzMXFXM2xaUnluU0FUdDA0ay9jZHBxZkpxbElrMlJFMi9ZcWR0ZSs4b3dtYzBRbXBpeXUxbjBDMHNjbTc4Z2NVQUpqVTV5Y3VZTzkzUUE1Z0I4eUY1VHRlMXAvUGhJdGplajRhT3c0U3pteXMya2tWdmZTZ1lvSXFOMGZRMHhabHNqS2wwTDVQNUhRWXJjYUhSL2NlMHJDeGY5TzR4bFlqeGRpVlBxQzBCazR3cDV3ZXVBTFl3c2V5SlNvb0VZV2hDN0RSaENFV1F6S1BPVnhFSlNmUUg2MjJ5ZGoyc2pOemJqRlZXaDVac0dFTkFUS21IalFFdE5LUnNQZzlrZkl4NjB0THB0alp5SUlTMkI1djBoRWF3M3I5QnRqUHlYL3ZjSmorTkF1Zk5uRm1iRWRadVFKQTU1b3dGdlNnb2dZV29jdi9pWVJSa2dMWkZ5Z3RHaUVhRkU4ZFhHS0IvbFFHc3V1QzZuNXBVTEFGekFvTWlvbmVnZFNTYUFrREFpajFySnUvQUpHVGU4aTRqYVVGdDBCeGtwdW5SQk42VVBsdW44RDhsQTN5ZllsZUp5WWU4QU5DNWNuZmppcGIrd0JIOGVNZEdLeXNFUTg3SFBua0RhTEJoZzNFSnl0RXhhZWsyN05wTGt0SHdKRmF5Q3BhTHNNdEM3NFgxbU1HUnVwWlphdjhOalAyWUtOcWRheTF3T1o3Q2t0N2loWkFOMlhBaklFSE9jTlYzYVpIbFZsRUt5b3RSSTFzWkN0RDBLSndqdTF1YkFlWUZBMWdZbk9WUmQ2RnVTUTFYK005VFhuRUYwZUpHWjZ3RGtZRFAzd1YrQzBEUk1jRUhycmpKVDh5ZjdkWk5tQ2h2eisxa3d2bUsxRERKQUxZQmZtY2I0d1REZEVhbkpqbVlvbTFtdEZYUmxBSFRDT2FyN1ZqZndRSjdGcXRBVmdqbG5udThqTXh0WXgvNGUrQTJnVTV1T1pzQnFuVFhETVlIbmhtdW1SNEN0NWl6K01iVytJU0pwZGFEaHZDb2REU3VxUU81OUZWekpDT0RQZTV4M25jR2dJdFhLZUZaZlYwTHFsSzA4am94ZE9vL3VkWmlwZ0l6bEF5UTJuYzZoTlZiUlJFRGtxRjFhd1lBVVJXNUJvaWhpWGkrQ3dZbkFGZm1hZ0lYdWlZTWk2WEpVSituMEtCY0V5TjVRd0NnaWNESHFweEYyWFVSVUZHOXJBekswa1NOOHl3MDk2ci9rYWRzQmdPVXF6S0NkWSsvdjRMOHFoWlNhZGhBL09NN2tRU1dWaXNBOE5SZlFDcTZ4LzF3OEt6Wm9EWG11c25wWVRoMmxmWUQ1WXJNQzZvc0FmZHprOVlLVkExZDAwQ0ZnQnI1N1F3UThaY0pwMEZQMmJvUkhhbHBhSnRGTDdUdGdPR1NBZVF4YTRqbUN3YkFzcVMvc3VJNGM1NXhDU0JSWFdWWldRVWwxOGk4bkFKTmFhbTRiY3lHb1JaTFN0ckU2Wi8yUm9pTldjRytRZ0FrQStTZUYwc3J5aVRyN0MwTXluQk9IT21HaEx1S3Bwd0hPbjFOZk1NTWE4b0FuanAyOG5jN3BxTFpwd3hIcU9yQWVxTUdhVVdtZElkME1HQ2trVm5NbnFKZUUrUUFkU091aE91RkI4WWFBeWc3WUdsT2E0VTVFTWtBakhzTUJraEFUWiswdEo3ZU92NHJBWnNhWGxBb2MzTW9CSEkwR0lBWmNtMFhnRWQ0VWpxNmxERXh0SlU1ejNKdGZMSk55NGc0WjlmSU1MbGh0MjRwVWlkU08ybitmVlFmUVdqZVIwaGxwR3NTK3BzQVlJdk1uMjZ4c0ZTSGtSNkczWnJwMnJYdTdrZyt3b3k1ZUVFYksvam0xRkJ2TEVEeVB5ZzJlS1RpUEVKc09yc1ZjcmwyT3RoWStxVHQ5M1FiVzhoTzZUbDdUeFlrUTJMNWZnMmdYdmM5S25KempRRVlBclJJQnJDNHgxRXdBTlJzUEF0MjdhemhzNGlHSnpMRVJEMVltZUZYVkc4aXJybTdsOG1ic1dNdXBnR2JpcTJwazZ6S2VaWkU5ZndWaEd0RG5vZVc5c1d0VkhUQlBRaHFrK1plNjE3bkxQSlc2azlwNlFNcUdFQ3VqVDB2YSttb3RVYTdkVmhnVUFiVHlvMGRwYXViS1hQbmdBTzRZMXJEVXp1eHhHb2I3dTBBTWxXbFBEQThNbU5VK0M0MFdRS29Gam5tcFRjWFR4WGF1MVhQZTZ5NkMzNWp6aWNENk9MZVJOa0tSK0pYREVEeDNvc2xZS3p2dGswR2VHZGRqeDcrZ1JyWURxWGxOdERWRllMTkxaQjd4V2xOKzU3RUZhTWo3TGRiQmpzV3hpa2xtYlJsbWZOc0dVVDFERFpFOFlWR2hza3RCS1V4SmJ0SWJmeHIwMXhPUXBNL3BTa1AvTURmYmZvalF3Z3BhQ3VtWmVWQnR3NXdyMkY4cVhUVDdyWFdUYkRTbjBwSzVLbWZLM2FmNVllNXR3UElWQ090WW1PRUpEWVNCQ0s5Rk8rV1hXWFhxSXBrejJLNWNHREdyQ2RydGxvVjNwRURWcUFVZWxlVWl0YVEzWjRoNlRJZ1R4R2laQUFaNjVJQndKZmdJblFSL2xHSDB1STFJQlFwbldIaFovRnNYUk0zYnVHbnlWK1psbnRwd041TEh3SVNTVXFqdzU4S2VoS1ZlVmU0bDZaR2hyeEhjT1FyQjFSZHBIYlFIRVJIQThuLzh3OWIrb0NpWVF0WHhQWEFHamM3YmJMYjVpQ3l2dmljVXc3SVZBYXNHUTJzcjB3Tjd1V1lYR1VBOHN1UjNCaUpKSlltLzdEVEpzcE82SStDUzlpbksrOW9IVjZpY2N5VWJzUnVIT05NN0hHRFZjR3hFUTQ3Yk9aNk1jTHRtRGFqMzNoQlRoRm5OUU5Fa0dybTRHaUYwbkpPazYxRE9pTmZYNlJzVlNLbmR5KzlnUmhSdXZveHYwZ3ltOGk1LzBxaU1oaGdFelArdU5kMmhCQVhjc3JWeDZLTDFQNG5TSzVOenNOZlFuTDdpYjlKLzJ6bWZ3d0d3TWVZN1ljcXFxbTQ2Rll5TUtQelFMVXZDRjdzam9tZlFybjF3VG1ENUFZOTYxd1BNc3MxMGtJY1BxVnpiZkdRQklNZ2JOQllncVh1bE1OMmx0ckZ0NEZyZVNGaW5MRU41T1p3ME1TbW55QWlCQTh5RTd2dEtSYlNzVERsUFJpZ0h3eEFtR2dua21MV29iU2MwMXpZUWpydnFZQXJpYXZnTzI2L3B0eEd5MEVRZGJQeFdTdzBLeWV5ZGlkUnFiUlJiUk82NXV3Mm1yYTdTRzM4QzFjZmlCNGsxNS9TOGE4MCtvQ3lNZEV0R1dBWW1qbTdWekFvZTlZWHN5cURBMWpqaDhCSzFmT0YyaEFEemJyYytFSXNXUENXKzhjNlNqT1pzbWZMTEVJNG1Obys1MXdwdURFOEtLcllrbFN3WUxWQnBjK1cxNGNSME9qcU5jUkc2TXN3cTAvYnFpQmY0am0rWnhzcWJDd1lIakRSYmlSU2pGRGFuTk94cFhZS003Umd5bW1OakdqVzBKR1NHejdRME1RUmp1Y1RlVyt0RnVSY0liNXJlWTYvYlVhemgxMVYreGRTL2w5di8wWDdGLytaQzVEMFovT3NuMkFBbDNXUEdETnJVWHhnUXJtT0tNOEZLMzNESlBmK3dxMmVpb0ZGSzJYR1duSFZvUmpjdjNJcGJ5eDYyMzBabWpGY2JKOVpNWmNid3lqL3liMDhNUHlzTGtmblkyZkhmbHpLa0Uvc3AwZWxYVkUvSkhOOFUySGp6OHlHbVVreGw5ZGlkblJxcG5UbUJrdjlISmpXWHo1eFp5UTBKYmVhUkZNUjV5eU9pWnpkU1ZRbzdoNjVrMnM0L2ZpVTZWVlgyWlRPUm5lUy9ILys1My9ROHo5Qi9td2NXS3YwcXZ2ZHRGVnpCNHpHbVdNZVN3WFVmSkQraklNQS9ia01GQXdndnlnQU1LcUFpbkFwNzN1UWVDQTFGTGZZZ3c1QTJ4MGFyYXhrVktWWkpEa3hQOFl3KzVtQzdOVXkreUVoSXowTHBHemtyNHFRRElUa1JqYk10MHlLcVNic3FtR1NmNVhTK2Y4bjcyeGI0Z2lDSUJ3U0FTRVNDTDdsSUJ3WUR3SW45Ly8vWHFiN3FicWEyZnNVUkJDdGpYdHVhUUNzN2RsK205NFNxQjN3UFdaTjhMWHZyeUpLUk5SRjA4VVRQeTZHREkyaytTYnJ1U0dUaGdrVlJIUGhOQ1EvRGZSM3lMOGdmMnJ0SGsxV0VucUpnOGxCMXZQL21UZTkxbCs0YTZSNUF0eE5nL01HMVM1QWhRZTEybnVtVEwrTFZBNFpDYjNhKzMzckYrbGk3d0szU2F1S2hEVHk5cXFLdHVGVDYvZG96OVFXQlNiWXpaMnlES250K2dZZkttUU9TODRSeFEvTDZ1eDFlNDYyRGdpOXFMdTE0Z0tHSEQ2cXlvZEQzNnpuZW9hM2VTL1VDblErYlFYUDl4YzNRT1A1dnM1TDMwK1FpUW5lMC9Ia080QndzWTMvQ1hjdm96UDdGaUE4Y0lLdG50QjMvZHBIN1lKbFJCOTdndkg0ZHRqN0kwYzZEd1k4OXB1YUJhbkpvc0xUN2VOS0ZoVklCQzZGYnpUQk9BNGI1UXdYTy9wTThNVnoySEFyclZablZHMzkrSllMZkxzNkRVVGNhRm9ma1RHR0RHMFVMN2N0Ni9sUnhvMDVYMURCbC85QzJXa2VBUmljKzM0Q3VjYVUzL0gvZkFjNEVYUmZyODFWUHBDYXBaT0FkL1V6N1lEVHlJWEhVZThZcDFiYlF6b0x1SnA2QndOZ0UwVmFSbTZ5c1lVN1lQQTM0ZTJYTVU2NnJnODRaMGpyQ2Nad3JPeE1SdTNXVWo1SXBzbWNjMWh4Wk1hVUhXNGwydEtCZ2h0MWl4dVFaaVdpK2FhQlBwczVUczl3WU9OZXFWZWdGTjA0Z1U3WlBpNUk2cVgxMS92ZTA0Q1dKTUMxeG1lN0RGRHQvNTVLSUgvaGFnenowYUJQdDJ5UkVLUFBHOEtnWXpZRDkxdlh0c1pvQzQvaFR2RjB1MTg0WjYyc0poaUxLOWhiMi9OS0NENFRxT1hJS28zQzhjZldhTXVIRUhIcjU4aHJHYkZqcytpcGMyR2NvM2doVWkvVTYxRHgzb0RDUVBlaHV1K0hqT3hYWEdQWDBYc1NYM21DeTF0UGt3YWsxMTQ5K2RkRWlMOTBBNmpCLy92SU1YZ3c2ZFNuMzdzb3ZJb0hQNU03NWZTYm9oWmgxSWJITDNOb2haRE9qRGNnNGV5dEpRQkxNczFLK3hSM0cvUEdaR0ZpdnNLZ1dibFJ0M1ZGVWpTMWlCWWRxU2UwMmFQdjIwSVpIeWVDY0l2Yzk5TnlWejVOcmpHdndicXRtVzRkQzFDQ1lZdHdDZ0c4V1dIdlZvQXViWTJ0UXZSZTZkVW9ZOVMrUnhNZldMU2RFRXQwYlRqZERSRHQvQURXazlwOC9MSUlXVXdvWWl0eGY3ZUowem5jMXVHVFpjYldiYk9yNS8waWxmczYyaUp1SFBHZ1dMNmdBNjdmSHJWeFlrNEZFL0RTVHpDbmd0czFWcGFsOU84Mk5BYjhha2hBU29HZCtFZ3pVTmNFcmp6R2lNS0cya0x4NVZpMGs5cUdPRVArOTRXQk9vemE4bXZlcEJDQjY0RDBvOXlYalNXNEJpODVvU3FXYlp2RmhqRnJybXk3SWxBM3FyNDNERHZkYlBMZVBhaWZRSzFvMmwxUWFqbkxVa1hBYnFMdEVkOGFFekkxQXhBRXV3R2NuWGdhQjYvMEdIcXpTVkc1N3F6YVRVendTdTVEQ25VWU5kUHdjOTRrVVRUYTFrZTRYRjdtMG80MlpaL3F3SUlsc1ZXOXRHcSszajFTRG5ibFM2K003V2F1ZW9hVHVhL1pPcFNEMVlsQ0pQNk5nV2JaNVpwMklFeVJrRm0zUUMvNFhRWkRiQVNYczdVa3hFeHNEVDZIZEhVK0pMeTBoUVg4R2t3NFFtdWt0dnNXeE5xeFpaMFdRLzQ0T0J3eVJPWkhkY3crdVA2ay9VamE0N0VieHF0T0ZQeUJ1UXJtL2tDdDFwZ29NcW96cUYvYWt6SVlLYkxMTmR2L2RiWDNaRWxpb1lta1F5ZFBadGlBUTlRL2NiQmNya0I5MnpLbmp3cVVwdkpWaHMzdTBYS3R0Q1BSZXp3d1dweUQ4Z2RjQlNNeFRzY1pYdmk4RXJPOC84bUNYMXhBYldQSmh5VzZYZzBiOGViSE1XRlVhUFBiSkFseEZUQUpWelNXdmdMNVB3ZTZkMHlWTC9iS2x4SGpoTTN0eE9PYUJ6ZlZMNHdlWVAxWis5SEx1czdWYk1wZ1FYNDFjRHdkQXZVRmJGb0tsWEJiUG43WlM1S2lpN1JOSnREaUVqaC8rb213dnBCTFFkYzVERXNUdzI0T3kzUnJCTFFUVy82c3hMb0ZzdUJqM29HVVRjb2tCSVp0YnJWU2FZU09LMjhXL0d2dkRGWWJpR0VnYWdodG9hZWtsM2FocDF3S1lmdi92MWRrV1g2YVFDK0Z3SnJxT1JmN2FsdnhXcU54QzZKdkRlaitXMHg4cEZ4Q0VJU2pFSmZwSTFYaUIzL0FkMnpNcVlmWUNBTVM4QU5pTmpjbWtkalFmK1c1bCtPWFlmUXZVMW5Zb1U3YUtRUkIzdmNVaTFtUDVaZG4vZE1memxRZDNzaFlzQVJTd0dleXAwQ0JDekh1VElUSFJlWENhOGhnM2dTZjgwT3pwb1o5WllDWHlCeXRPNDVJekJJSVNGMHl0YjljaUxIWkh6cjNoZXR2MWFvQVFaQVJNdDJjRlZMUnREZ1AzUGE5QlNOdktRR2Z5KzRqYk95aUsvQS9hS1BnaGVKVjVEMHBMNnhsRTNmV0UzdURiMUpleHVFK3I0cXUzQU1wZERmRUNkZGdBVHhOTUoveENBQjhneUZJT3hxMUFKNGhMNEJPRnZnWmxMMGgyWGwzVzAyc0o0Qi9lS01kanNJZjZRUXJVM3pCd2taZnhqV2k1cDVUWWRocWZtSTlzUVlGc25Bd2tWYzJzVUxnTitpdUcwanhzTlhFZTJRRkNncERCTnZNMk5qSjYvaU9sYnE1am5ZMnl3UDYvSysyQUFxdmROTE52RzNaeURJRWZxZkE4cnJJTEpOb2h5UEFDaFFVaDRKdlpuR1lENEhmNUxLNVJBODhEN2hXQUNoUUJBbGQwNUZIWGVEM0ZpT2JGMFhkaWVheG50amJTaFMybGFWZGg3blhOZnBENEdjaldoU1YrVXJXRXd0Ui9BQnR3elltK0l4U2x3QUFBQUJKUlU1RXJrSmdnZz09YDtcclxuICByZXR1cm4gaW1hZ2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmbnQoKXtcclxuICByZXR1cm4gYGluZm8gZmFjZT1cIlJvYm90b1wiIHNpemU9MTkyIGJvbGQ9MCBpdGFsaWM9MCBjaGFyc2V0PVwiXCIgdW5pY29kZT0xIHN0cmV0Y2hIPTEwMCBzbW9vdGg9MSBhYT0xIHBhZGRpbmc9MjQsMjQsMjQsMjQgc3BhY2luZz0xMiwxMiBvdXRsaW5lPTBcclxuY29tbW9uIGxpbmVIZWlnaHQ9MTkyIGJhc2U9MTUyIHNjYWxlVz0zMDcyIHNjYWxlSD0xNTM2IHBhZ2VzPTEgcGFja2VkPTAgYWxwaGFDaG5sPTAgcmVkQ2hubD00IGdyZWVuQ2hubD00IGJsdWVDaG5sPTRcclxucGFnZSBpZD0wIGZpbGU9XCJyb2JvdG9fMC5wbmdcIlxyXG5jaGFycyBjb3VudD0xOTRcclxuY2hhciBpZD0wICAgIHg9NjM2ICAgeT0xNDM4ICB3aWR0aD00OCAgICBoZWlnaHQ9NDkgICAgeG9mZnNldD0tMjQgICB5b2Zmc2V0PTE2NyAgIHhhZHZhbmNlPTAgICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIgICAgeD01NzYgICB5PTE0MzggIHdpZHRoPTQ4ICAgIGhlaWdodD00OSAgICB4b2Zmc2V0PS0yNCAgIHlvZmZzZXQ9MTY3ICAgeGFkdmFuY2U9MCAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTMgICB4PTQ1MCAgIHk9MTQzOSAgd2lkdGg9NTEgICAgaGVpZ2h0PTQ5ICAgIHhvZmZzZXQ9LTI1ICAgeW9mZnNldD0xNjcgICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0zMiAgIHg9Mjk4NyAgeT0xMjQyICB3aWR0aD01MSAgICBoZWlnaHQ9NDkgICAgeG9mZnNldD0tMjUgICB5b2Zmc2V0PTE2NyAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTMzICAgeD0xNzE0ICB5PTc2OSAgIHdpZHRoPTY2ICAgIGhlaWdodD0xNjMgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NDEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MzQgICB4PTE5OTkgIHk9MTI2MyAgd2lkdGg9ODEgICAgaGVpZ2h0PTg3ICAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT01MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0zNSAgIHg9MTIxNCAgeT05NTEgICB3aWR0aD0xMzYgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTk5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTM2ICAgeD0xNjEwICB5PTAgICAgIHdpZHRoPTEyMiAgIGhlaWdodD0xOTYgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9LTQgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MzcgICB4PTEzNDEgIHk9NTk1ICAgd2lkdGg9MTUyICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMTcgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0zOCAgIHg9MTY1OCAgeT01OTIgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTk5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTM5ICAgeD0yMDkyICB5PTEyNjMgIHdpZHRoPTYyICAgIGhlaWdodD04NSAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9MjggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NDAgICB4PTEwMyAgIHk9MCAgICAgd2lkdGg9OTAgICAgaGVpZ2h0PTIxMyAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0wICAgICB4YWR2YW5jZT01NSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD00MSAgIHg9MCAgICAgeT0wICAgICB3aWR0aD05MSAgICBoZWlnaHQ9MjEzICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTAgICAgIHhhZHZhbmNlPTU2ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTQyICAgeD02NjQgICB5PTEyOTQgIHdpZHRoPTExNCAgIGhlaWdodD0xMTQgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NjkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NDMgICB4PTAgICAgIHk9MTMxNyAgd2lkdGg9MTI4ICAgaGVpZ2h0PTEyOSAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD0zNCAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD00NCAgIHg9MTkxNiAgeT0xMjY0ICB3aWR0aD03MSAgICBoZWlnaHQ9ODggICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTExMSAgIHhhZHZhbmNlPTMxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTQ1ICAgeD0yMzMgICB5PTE0NTcgIHdpZHRoPTg4ICAgIGhlaWdodD02MCAgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9NzQgICAgeGFkdmFuY2U9NDQgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NDYgICB4PTI4MjggIHk9MTI0NSAgd2lkdGg9NjggICAgaGVpZ2h0PTY1ICAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0xMTIgICB4YWR2YW5jZT00MiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD00NyAgIHg9MCAgICAgeT00MjkgICB3aWR0aD0xMDkgICBoZWlnaHQ9MTcyICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTY2ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTQ4ICAgeD0yMzkyICB5PTU4MyAgIHdpZHRoPTEyMiAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NDkgICB4PTExMiAgIHk9MTE0MyAgd2lkdGg9OTMgICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTExICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD01MCAgIHg9MTQ0MyAgeT03NzIgICB3aWR0aD0xMjYgICBoZWlnaHQ9MTYzICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTUxICAgeD0yNjYwICB5PTU3NSAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NTIgICB4PTE3OTQgIHk9OTQzICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIxICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD01MyAgIHg9NTM5ICAgeT03NzkgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTU0ICAgeD00MDYgICB5PTc3OSAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NTUgICB4PTIwODIgIHk9OTQxICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD01NiAgIHg9MjUyNiAgeT01ODEgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTU3ICAgeD0xNTgxICB5PTc3MSAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNjMgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NTggICB4PTIzODMgIHk9MTExMyAgd2lkdGg9NjcgICAgaGVpZ2h0PTEzNCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT0zOSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD01OSAgIHg9MzcyICAgeT0xMTQwICB3aWR0aD03MyAgICBoZWlnaHQ9MTU2ICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTM0ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTYwICAgeD01MzkgICB5PTEzMDcgIHdpZHRoPTExMyAgIGhlaWdodD0xMTkgICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NjEgICB4PTE2ODggIHk9MTI2OSAgd2lkdGg9MTE1ICAgaGVpZ2h0PTkzICAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD01MSAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD02MiAgIHg9NDExICAgeT0xMzA4ICB3aWR0aD0xMTYgICBoZWlnaHQ9MTE5ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTg0ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTYzICAgeD04MDAgICB5PTc3OSAgIHdpZHRoPTExMyAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0xOSAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9NzYgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NjQgICB4PTE0MjEgIHk9MCAgICAgd2lkdGg9MTc3ICAgaGVpZ2h0PTE5NiAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xNiAgICB4YWR2YW5jZT0xNDQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD02NSAgIHg9MjcwOCAgeT03NTIgICB3aWR0aD0xNTAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTY2ICAgeD0yMjIxICB5PTkzOSAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTAwICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NjcgICB4PTE4MTEgIHk9NTkyICAgd2lkdGg9MTM3ICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD02OCAgIHg9MTY1MCAgeT05NDYgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwNSAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTY5ICAgeD0yNDk2ICB5PTkzNCAgIHdpZHRoPTEyMiAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NzAgICB4PTI2MzAgIHk9OTMyICAgd2lkdGg9MTIwICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD03MSAgIHg9MTk2MCAgeT01OTAgICB3aWR0aD0xMzcgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTEwOSAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTcyICAgeD05MTYgICB5PTk1NSAgIHdpZHRoPTEzNyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTE0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NzMgICB4PTI5NiAgIHk9MTE0MiAgd2lkdGg9NjQgICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEwICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT00NCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD03NCAgIHg9MjcyICAgeT03OTAgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMjEgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTc1ICAgeD03NjcgICB5PTk1NSAgIHdpZHRoPTEzNyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTAwICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NzYgICB4PTI3NjIgIHk9OTI2ICAgd2lkdGg9MTE5ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT04NiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD03NyAgIHg9MjE5NyAgeT03NjUgICB3aWR0aD0xNjMgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTE0MCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTc4ICAgeD0xMDY1ICB5PTk1MiAgIHdpZHRoPTEzNyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTE0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9NzkgICB4PTE1MDUgIHk9NTk0ICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD04MCAgIHg9MTkzOCAgeT05NDMgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwMSAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTgxICAgeD0yMjIyICB5PTIwNyAgIHdpZHRoPTE0MSAgIGhlaWdodD0xODMgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9ODIgICB4PTEzNjIgIHk9OTQ5ICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTExICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT05OSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD04MyAgIHg9MjEwOSAgeT01ODggICB3aWR0aD0xMzIgICBoZWlnaHQ9MTY1ICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTk1ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTg0ICAgeD02MTcgICB5PTk1NSAgIHdpZHRoPTEzOCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMSAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTUgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9ODUgICB4PTEyOCAgIHk9NzkyICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE2NCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD04NiAgIHg9Mjg3MCAgeT03NDkgICB3aWR0aD0xNDcgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTEwMiAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTg3ICAgeD0yMDAyICB5PTc2NyAgIHdpZHRoPTE4MyAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTQyICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9ODggICB4PTMxMiAgIHk9OTY2ICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD04OSAgIHg9MTU3ICAgeT05NjggICB3aWR0aD0xNDMgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjQgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTk2ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTkwICAgeD0xNTA2ICB5PTk0NyAgIHdpZHRoPTEzMiAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTYgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9OTEgICB4PTY1OCAgIHk9MCAgICAgd2lkdGg9NzkgICAgaGVpZ2h0PTIwMiAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD0tMiAgICB4YWR2YW5jZT00MiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD05MiAgIHg9Mjk0NSAgeT0yMDQgICB3aWR0aD0xMTEgICBoZWlnaHQ9MTcyICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTY2ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTkzICAgeD01NjcgICB5PTAgICAgIHdpZHRoPTc5ICAgIGhlaWdodD0yMDIgICB4b2Zmc2V0PS0yNCAgIHlvZmZzZXQ9LTIgICAgeGFkdmFuY2U9NDIgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9OTQgICB4PTE1NzAgIHk9MTI3MSAgd2lkdGg9MTA2ICAgaGVpZ2h0PTEwNSAgIHhvZmZzZXQ9LTIwICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT02NyAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD05NSAgIHg9MCAgICAgeT0xNDU4ICB3aWR0aD0xMjEgICBoZWlnaHQ9NjAgICAgeG9mZnNldD0tMjQgICB5b2Zmc2V0PTEyOCAgIHhhZHZhbmNlPTcyICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTk2ICAgeD0yNjIyICB5PTEyNTggIHdpZHRoPTgyICAgIGhlaWdodD03MSAgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9NDkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9OTcgICB4PTE1ODUgIHk9MTEyMSAgd2lkdGg9MTE5ICAgaGVpZ2h0PTEzNiAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04NyAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD05OCAgIHg9Njc3ICAgeT00MTggICB3aWR0aD0xMjEgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTkwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTk5ICAgeD0xNDUzICB5PTExMjMgIHdpZHRoPTEyMCAgIGhlaWdodD0xMzYgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODQgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTAwICB4PTEyMDkgIHk9NDEzICAgd2lkdGg9MTIwICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMDEgIHg9MTMyMCAgeT0xMTI1ICB3aWR0aD0xMjEgICBoZWlnaHQ9MTM2ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTg1ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEwMiAgeD0xODY2ICB5PTQwOCAgIHdpZHRoPTEwMSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9NiAgICAgeGFkdmFuY2U9NTYgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTAzICB4PTEzNCAgIHk9NjEyICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMDQgIHg9MjYyNyAgeT0zOTUgICB3aWR0aD0xMTYgICBoZWlnaHQ9MTY4ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEwNSAgeD0xMDUwICB5PTc3NiAgIHdpZHRoPTY3ICAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9MTIgICAgeGFkdmFuY2U9MzkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTA2ICB4PTEzMjcgIHk9MCAgICAgd2lkdGg9ODIgICAgaGVpZ2h0PTE5OCAgIHhvZmZzZXQ9LTMwICAgeW9mZnNldD0xMiAgICB4YWR2YW5jZT0zOCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMDcgIHg9MjQ5NSAgeT00MDEgICB3aWR0aD0xMjAgICBoZWlnaHQ9MTY4ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTgxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEwOCAgeD0yNzU1ICB5PTM5MiAgIHdpZHRoPTY0ICAgIGhlaWdodD0xNjggICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9MzkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTA5ICB4PTE5NzMgIHk9MTExNyAgd2lkdGg9MTY4ICAgaGVpZ2h0PTEzNCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT0xNDAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMTAgIHg9MjE1MyAgeT0xMTE1ICB3aWR0aD0xMTYgICBoZWlnaHQ9MTM0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTExMSAgeD0xMTgxICB5PTExMjYgIHdpZHRoPTEyNyAgIGhlaWdodD0xMzYgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTEyICB4PTI2NyAgIHk9NjExICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT05MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMTMgIHg9NDAwICAgeT02MDAgICB3aWR0aD0xMjAgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTExNCAgeD0yMjgxICB5PTExMTMgIHdpZHRoPTkwICAgIGhlaWdodD0xMzQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9NTQgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTE1ICB4PTE3MTYgIHk9MTEyMCAgd2lkdGg9MTE3ICAgaGVpZ2h0PTEzNiAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD00MiAgICB4YWR2YW5jZT04MyAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMTYgIHg9NDU3ICAgeT0xMTQwICB3aWR0aD05NSAgICBoZWlnaHQ9MTU1ICAgeG9mZnNldD0tMjQgICB5b2Zmc2V0PTIzICAgIHhhZHZhbmNlPTUyICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTExNyAgeD0xODQ1ICB5PTExMTcgIHdpZHRoPTExNiAgIGhlaWdodD0xMzUgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTE4ICB4PTI3NzIgIHk9MTEwMCAgd2lkdGg9MTIyICAgaGVpZ2h0PTEzMyAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT03OCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMTkgIHg9MjQ2MiAgeT0xMTEzICB3aWR0aD0xNjMgICBoZWlnaHQ9MTMzICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTEyMCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEyMCAgeD0yNjM3ICB5PTExMDYgIHdpZHRoPTEyMyAgIGhlaWdodD0xMzMgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9NDMgICAgeGFkdmFuY2U9NzkgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTIxICB4PTAgICAgIHk9NjEzICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT03NiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMjIgIHg9MjkwNiAgeT0xMDk3ICB3aWR0aD0xMTcgICBoZWlnaHQ9MTMzICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTQzICAgIHhhZHZhbmNlPTc5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEyMyAgeD00NTggICB5PTAgICAgIHdpZHRoPTk3ICAgIGhlaWdodD0yMDIgICB4b2Zmc2V0PS0yMCAgIHlvZmZzZXQ9MyAgICAgeGFkdmFuY2U9NTQgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTI0ICB4PTI0NTEgIHk9MjA2ICAgd2lkdGg9NjEgICAgaGVpZ2h0PTE4MyAgIHhvZmZzZXQ9LTExICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0zOSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xMjUgIHg9MzQ5ICAgeT0wICAgICB3aWR0aD05NyAgICBoZWlnaHQ9MjAyICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PTMgICAgIHhhZHZhbmNlPTU0ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTEyNiAgeD0yMzc4ICB5PTEyNTkgIHdpZHRoPTEzOCAgIGhlaWdodD03OSAgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9NjUgICAgeGFkdmFuY2U9MTA5ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTYwICB4PTUxMyAgIHk9MTQzOSAgd2lkdGg9NTEgICAgaGVpZ2h0PTQ5ICAgIHhvZmZzZXQ9LTI1ICAgeW9mZnNldD0xNjcgICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNjEgIHg9MjE3ICAgeT0xMTQyICB3aWR0aD02NyAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTM5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE2MiAgeD0xMzQxICB5PTQxMyAgIHdpZHRoPTEyMCAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MjUgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTYzICB4PTEzMDAgIHk9Nzc0ICAgd2lkdGg9MTMxICAgaGVpZ2h0PTE2MyAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT05MyAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNjQgIHg9NzAyICAgeT0xMTI5ICB3aWR0aD0xNDkgICBoZWlnaHQ9MTQ5ICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTMwICAgIHhhZHZhbmNlPTExNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE2NSAgeD00NjUgICB5PTk1NSAgIHdpZHRoPTE0MCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTcgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTY2ICB4PTIzNzUgIHk9MjA2ICAgd2lkdGg9NjQgICAgaGVpZ2h0PTE4MyAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0zOCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNjcgIHg9MjA1ICAgeT0wICAgICB3aWR0aD0xMzIgICBoZWlnaHQ9MjAyICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTk4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE2OCAgeD0yNzE2ICB5PTEyNTEgIHdpZHRoPTEwMCAgIGhlaWdodD02NSAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MTIgICAgeGFkdmFuY2U9NjcgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTY5ICB4PTk5NSAgIHk9NTk5ICAgd2lkdGg9MTYxICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMjYgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNzAgIHg9MTM2OCAgeT0xMjczICB3aWR0aD05OSAgICBoZWlnaHQ9MTA5ICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTcxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE3MSAgeD0xMTMxICB5PTEyNzcgIHdpZHRoPTExMCAgIGhlaWdodD0xMTAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NTQgICAgeGFkdmFuY2U9NzUgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTcyICB4PTIyNTEgIHk9MTI2MSAgd2lkdGg9MTE1ICAgaGVpZ2h0PTgxICAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD02NSAgICB4YWR2YW5jZT04OSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNzMgIHg9MTMzICAgeT0xNDU4ICB3aWR0aD04OCAgICBoZWlnaHQ9NjAgICAgeG9mZnNldD0tMjIgICB5b2Zmc2V0PTc0ICAgIHhhZHZhbmNlPTQ0ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE3NCAgeD0xMTY4ICB5PTU5NyAgIHdpZHRoPTE2MSAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9MTI2ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTc1ICB4PTMzMyAgIHk9MTQ0OCAgd2lkdGg9MTA1ICAgaGVpZ2h0PTU5ICAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT03MyAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNzYgIHg9MTgxNSAgeT0xMjY4ICB3aWR0aD04OSAgICBoZWlnaHQ9ODggICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTYwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE3NyAgeD04NjMgICB5PTExMjkgIHdpZHRoPTEyMSAgIGhlaWdodD0xNDcgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9MjkgICAgeGFkdmFuY2U9ODUgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTc4ICB4PTg5OSAgIHk9MTI4OCAgd2lkdGg9OTcgICAgaGVpZ2h0PTExMSAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT01OSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xNzkgIHg9NzkwICAgeT0xMjkwICB3aWR0aD05NyAgICBoZWlnaHQ9MTEyICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTEzICAgIHhhZHZhbmNlPTU5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE4MCAgeD0yNTI4ICB5PTEyNTggIHdpZHRoPTgyICAgIGhlaWdodD03MSAgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9NTAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTgxICB4PTg2NiAgIHk9NTk5ICAgd2lkdGg9MTE3ICAgaGVpZ2h0PTE2NiAgIHhvZmZzZXQ9LTEzICAgeW9mZnNldD00MyAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xODIgIHg9Mjg5MyAgeT05MjMgICB3aWR0aD0xMTAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMjAgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTc4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE4MyAgeD0yOTA4ICB5PTEyNDIgIHdpZHRoPTY3ICAgIGhlaWdodD02NSAgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9NjIgICAgeGFkdmFuY2U9NDIgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTg0ICB4PTIxNjYgIHk9MTI2MSAgd2lkdGg9NzMgICAgaGVpZ2h0PTgyICAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xMjggICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xODUgIHg9MTQ3OSAgeT0xMjcxICB3aWR0aD03OSAgICBoZWlnaHQ9MTA5ICAgeG9mZnNldD0tMTUgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTU5ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE4NiAgeD0xMjUzICB5PTEyNzQgIHdpZHRoPTEwMyAgIGhlaWdodD0xMDkgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9NzMgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTg3ICB4PTEwMDggIHk9MTI3NyAgd2lkdGg9MTExICAgaGVpZ2h0PTExMCAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD01NCAgICB4YWR2YW5jZT03NSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xODggIHg9MjU0MiAgeT03NTggICB3aWR0aD0xNTQgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTExNyAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE4OSAgeD0yMzcyICB5PTc2MCAgIHdpZHRoPTE1OCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTI0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTkwICB4PTExMjkgIHk9Nzc2ICAgd2lkdGg9MTU5ICAgaGVpZ2h0PTE2MyAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMjQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xOTEgIHg9OTI1ICAgeT03NzcgICB3aWR0aD0xMTMgICBoZWlnaHQ9MTY0ICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTc2ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE5MiAgeD0xNjIgICB5PTIyNSAgIHdpZHRoPTE1MCAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTkzICB4PTMyNCAgIHk9MjE0ICAgd2lkdGg9MTUwICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xOTQgIHg9MCAgICAgeT0yMjUgICB3aWR0aD0xNTAgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE5NSAgeD0xMzU5ICB5PTIxMCAgIHdpZHRoPTE1MCAgIGhlaWdodD0xOTAgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9LTE0ICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTk2ICB4PTE4MTQgIHk9MjA4ICAgd2lkdGg9MTUwICAgaGVpZ2h0PTE4OCAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD0tMTIgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0xOTcgIHg9MTAxNiAgeT0wICAgICB3aWR0aD0xNTAgICBoZWlnaHQ9MTk5ICAgeG9mZnNldD0tMjMgICB5b2Zmc2V0PS0yMyAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTE5OCAgeD0xNzkyICB5PTc2OSAgIHdpZHRoPTE5OCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0yNiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9MTUwICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MTk5ICB4PTExNzggIHk9MCAgICAgd2lkdGg9MTM3ICAgaGVpZ2h0PTE5OCAgIHhvZmZzZXQ9LTE1ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMDAgIHg9MjkyMiAgeT0wICAgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIwMSAgeD02NDEgICB5PTIxNCAgIHdpZHRoPTEyMiAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjAyICB4PTc3NSAgIHk9MjEzICAgd2lkdGg9MTIyICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTEyICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMDMgIHg9MTk3NiAgeT0yMDcgICB3aWR0aD0xMjIgICBoZWlnaHQ9MTg4ICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PS0xMiAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIwNCAgeD0xMDE4ICB5PTIxMSAgIHdpZHRoPTgyICAgIGhlaWdodD0xOTIgICB4b2Zmc2V0PS0yNyAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9NDQgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjA1ICB4PTExMTIgIHk9MjExICAgd2lkdGg9ODIgICAgaGVpZ2h0PTE5MiAgIHhvZmZzZXQ9LTExICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT00NCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMDYgIHg9OTA5ICAgeT0yMTMgICB3aWR0aD05NyAgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMjcgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTQ0ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIwNyAgeD0yMTEwICB5PTIwNyAgIHdpZHRoPTEwMCAgIGhlaWdodD0xODggICB4b2Zmc2V0PS0yOCAgIHlvZmZzZXQ9LTEyICAgeGFkdmFuY2U9NDQgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjA4ICB4PTAgICAgIHk9OTY5ICAgd2lkdGg9MTQ1ICAgaGVpZ2h0PTE2MiAgIHhvZmZzZXQ9LTIyICAgeW9mZnNldD0xNCAgICB4YWR2YW5jZT0xMDcgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMDkgIHg9MTUyMSAgeT0yMDggICB3aWR0aD0xMzcgICBoZWlnaHQ9MTkwICAgeG9mZnNldD0tMTIgICB5b2Zmc2V0PS0xNCAgIHhhZHZhbmNlPTExNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIxMCAgeD0yMTg0ICB5PTAgICAgIHdpZHRoPTE0MSAgIGhlaWdodD0xOTUgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9LTE3ICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjExICB4PTIwMzEgIHk9MCAgICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE5NSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0tMTcgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMTIgIHg9MTg3OCAgeT0wICAgICB3aWR0aD0xNDEgICBoZWlnaHQ9MTk1ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PS0xNyAgIHhhZHZhbmNlPTExMCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIxMyAgeD0yNzY5ICB5PTAgICAgIHdpZHRoPTE0MSAgIGhlaWdodD0xOTMgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9LTE1ICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjE0ICB4PTEyMDYgIHk9MjEwICAgd2lkdGg9MTQxICAgaGVpZ2h0PTE5MSAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0tMTMgICB4YWR2YW5jZT0xMTAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMTUgIHg9Mjc5ICAgeT0xMzE2ICB3aWR0aD0xMjAgICBoZWlnaHQ9MTIwICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTQwICAgIHhhZHZhbmNlPTg1ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIxNiAgeD0yNjU1ICB5PTIwNiAgIHdpZHRoPTE0MyAgIGhlaWdodD0xNzQgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTAgICAgeGFkdmFuY2U9MTEwICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjE3ICB4PTI2MjUgIHk9MCAgICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE5NCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0tMTYgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMTggIHg9MjQ4MSAgeT0wICAgICB3aWR0aD0xMzIgICBoZWlnaHQ9MTk0ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTEwNCAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIxOSAgeD0yMzM3ICB5PTAgICAgIHdpZHRoPTEzMiAgIGhlaWdodD0xOTQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9LTE2ICAgeGFkdmFuY2U9MTA0ICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjIwICB4PTE2NzAgIHk9MjA4ICAgd2lkdGg9MTMyICAgaGVpZ2h0PTE5MCAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0tMTIgICB4YWR2YW5jZT0xMDQgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMjEgIHg9NDg2ICAgeT0yMTQgICB3aWR0aD0xNDMgICBoZWlnaHQ9MTkyICAgeG9mZnNldD0tMjQgICB5b2Zmc2V0PS0xNiAgIHhhZHZhbmNlPTk2ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIyMiAgeD0yMzYwICB5PTkzOSAgIHdpZHRoPTEyNCAgIGhlaWdodD0xNjIgICB4b2Zmc2V0PS0xMiAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9OTUgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjIzICB4PTEyMSAgIHk9NDI5ICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE3MSAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD03ICAgICB4YWR2YW5jZT05NSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMjQgIHg9MTYwNCAgeT00MTAgICB3aWR0aD0xMTkgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTg3ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIyNSAgeD0xNDczICB5PTQxMiAgIHdpZHRoPTExOSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODcgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjI2ICB4PTE3MzUgIHk9NDEwICAgd2lkdGg9MTE5ICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04NyAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMjcgIHg9NTMyICAgeT02MDAgICB3aWR0aD0xMTkgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMTYgICB5b2Zmc2V0PTExICAgIHhhZHZhbmNlPTg3ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIyOCAgeD0yOTI2ICB5PTU2OSAgIHdpZHRoPTExOSAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xNiAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9ODcgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjI5ICB4PTI1MjQgIHk9MjA2ICAgd2lkdGg9MTE5ICAgaGVpZ2h0PTE3NyAgIHhvZmZzZXQ9LTE2ICAgeW9mZnNldD0xICAgICB4YWR2YW5jZT04NyAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMzAgIHg9OTk2ICAgeT0xMTI5ICB3aWR0aD0xNzMgICBoZWlnaHQ9MTM2ICAgeG9mZnNldD0tMTkgICB5b2Zmc2V0PTQyICAgIHhhZHZhbmNlPTEzNSAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIzMSAgeD0xOTc5ICB5PTQwNyAgIHdpZHRoPTEyMCAgIGhlaWdodD0xNjkgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9NDIgICAgeGFkdmFuY2U9ODQgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjMyICB4PTEwNzYgIHk9NDE1ICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT04NSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMzMgIHg9OTQzICAgeT00MTcgICB3aWR0aD0xMjEgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTg1ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIzNCAgeD04MTAgICB5PTQxNyAgIHdpZHRoPTEyMSAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xNyAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9ODUgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjM1ICB4PTI3OTMgIHk9NTcyICAgd2lkdGg9MTIxICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE3ICAgeW9mZnNldD0xMyAgICB4YWR2YW5jZT04NSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMzYgIHg9NzcyICAgeT02MDAgICB3aWR0aD04MiAgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMjkgICB5b2Zmc2V0PTkgICAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTIzNyAgeD0yOTcwICB5PTM4OCAgIHdpZHRoPTgyICAgIGhlaWdodD0xNjcgICB4b2Zmc2V0PS0xMyAgIHlvZmZzZXQ9OSAgICAgeGFkdmFuY2U9NDAgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjM4ICB4PTY2MyAgIHk9NjAwICAgd2lkdGg9OTcgICAgaGVpZ2h0PTE2NyAgIHhvZmZzZXQ9LTI5ICAgeW9mZnNldD05ICAgICB4YWR2YW5jZT00MCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yMzkgIHg9MCAgICAgeT0xMTQzICB3aWR0aD0xMDAgICBoZWlnaHQ9MTYyICAgeG9mZnNldD0tMzAgICB5b2Zmc2V0PTE0ICAgIHhhZHZhbmNlPTQwICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI0MCAgeD0yODEwICB5PTIwNSAgIHdpZHRoPTEyMyAgIGhlaWdodD0xNzMgICB4b2Zmc2V0PS0xNSAgIHlvZmZzZXQ9NSAgICAgeGFkdmFuY2U9OTQgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjQxICB4PTAgICAgIHk9NzkyICAgd2lkdGg9MTE2ICAgaGVpZ2h0PTE2NSAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD0xMSAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNDIgIHg9MjYwICAgeT00MjkgICB3aWR0aD0xMjcgICBoZWlnaHQ9MTcwICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI0MyAgeD01MzggICB5PTQxOCAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNzAgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9OCAgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjQ0ICB4PTM5OSAgIHk9NDE4ICAgd2lkdGg9MTI3ICAgaGVpZ2h0PTE3MCAgIHhvZmZzZXQ9LTE4ICAgeW9mZnNldD04ICAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNDUgIHg9MjgzMSAgeT0zOTAgICB3aWR0aD0xMjcgICBoZWlnaHQ9MTY3ICAgeG9mZnNldD0tMTggICB5b2Zmc2V0PTExICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI0NiAgeD0yMjUzICB5PTU4MyAgIHdpZHRoPTEyNyAgIGhlaWdodD0xNjUgICB4b2Zmc2V0PS0xOCAgIHlvZmZzZXQ9MTMgICAgeGFkdmFuY2U9OTEgICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjQ3ICB4PTE0MCAgIHk9MTMxNyAgd2lkdGg9MTI3ICAgaGVpZ2h0PTEyOCAgIHhvZmZzZXQ9LTE5ICAgeW9mZnNldD0zNCAgICB4YWR2YW5jZT05MSAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNDggIHg9NTY0ICAgeT0xMTI5ICB3aWR0aD0xMjYgICBoZWlnaHQ9MTUzICAgeG9mZnNldD0tMTcgICB5b2Zmc2V0PTM0ICAgIHhhZHZhbmNlPTkxICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI0OSAgeD0yMTExICB5PTQwNyAgIHdpZHRoPTExNiAgIGhlaWdodD0xNjkgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9OSAgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjUwICB4PTIyMzkgIHk9NDAyICAgd2lkdGg9MTE2ICAgaGVpZ2h0PTE2OSAgIHhvZmZzZXQ9LTE0ICAgeW9mZnNldD05ICAgICB4YWR2YW5jZT04OCAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNTEgIHg9MjM2NyAgeT00MDIgICB3aWR0aD0xMTYgICBoZWlnaHQ9MTY5ICAgeG9mZnNldD0tMTQgICB5b2Zmc2V0PTkgICAgIHhhZHZhbmNlPTg4ICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI1MiAgeD02NzIgICB5PTc3OSAgIHdpZHRoPTExNiAgIGhlaWdodD0xNjQgICB4b2Zmc2V0PS0xNCAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9ODggICAgcGFnZT0wICBjaG5sPTE1XHJcbmNoYXIgaWQ9MjUzICB4PTc0OSAgIHk9MCAgICAgd2lkdGg9MTIyICAgaGVpZ2h0PTIwMSAgIHhvZmZzZXQ9LTIzICAgeW9mZnNldD05ICAgICB4YWR2YW5jZT03NiAgICBwYWdlPTAgIGNobmw9MTVcclxuY2hhciBpZD0yNTQgIHg9ODgzICAgeT0wICAgICB3aWR0aD0xMjEgICBoZWlnaHQ9MjAxICAgeG9mZnNldD0tMTMgICB5b2Zmc2V0PTggICAgIHhhZHZhbmNlPTkyICAgIHBhZ2U9MCAgY2hubD0xNVxyXG5jaGFyIGlkPTI1NSAgeD0xNzQ0ICB5PTAgICAgIHdpZHRoPTEyMiAgIGhlaWdodD0xOTYgICB4b2Zmc2V0PS0yMyAgIHlvZmZzZXQ9MTQgICAgeGFkdmFuY2U9NzYgICAgcGFnZT0wICBjaG5sPTE1XHJcbmtlcm5pbmdzIGNvdW50PTE2ODZcclxua2VybmluZyBmaXJzdD0zMiAgc2Vjb25kPTg0ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD00MCAgc2Vjb25kPTg2ICBhbW91bnQ9MlxyXG5rZXJuaW5nIGZpcnN0PTQwICBzZWNvbmQ9ODcgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NDAgIHNlY29uZD04OSAgYW1vdW50PTJcclxua2VybmluZyBmaXJzdD00MCAgc2Vjb25kPTIyMSBhbW91bnQ9MlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9NDQgIGFtb3VudD0tMThcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTQ2ICBhbW91bnQ9LTE4XHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD02NSAgYW1vdW50PS0xM1xyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9NzQgIGFtb3VudD0tMjFcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTg0ICBhbW91bnQ9MlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9OTcgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9OTkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTAwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTAxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTAzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTExIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTEzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTE3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTE4IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTkyIGFtb3VudD0tMTNcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTE5MyBhbW91bnQ9LTEzXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xOTQgYW1vdW50PS0xM1xyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MTk1IGFtb3VudD0tMTNcclxua2VybmluZyBmaXJzdD03MCAgc2Vjb25kPTE5NiBhbW91bnQ9LTEzXHJcbmtlcm5pbmcgZmlyc3Q9NzAgIHNlY29uZD0xOTcgYW1vdW50PS0xM1xyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjI0IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjI1IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjI2IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjI3IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjI4IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjI5IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjMxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjMyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjMzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjM1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjQyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjQzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjQ5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjUwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjUxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjUyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjUzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwICBzZWNvbmQ9MjU1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTgxICBzZWNvbmQ9ODQgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTgxICBzZWNvbmQ9ODYgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTgxICBzZWNvbmQ9ODcgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTgxICBzZWNvbmQ9ODkgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTgxICBzZWNvbmQ9MjIxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTgyICBzZWNvbmQ9ODQgIGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTgyICBzZWNvbmQ9ODYgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgyICBzZWNvbmQ9ODkgIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTgyICBzZWNvbmQ9MjIxIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTkxICBzZWNvbmQ9NzQgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTkxICBzZWNvbmQ9ODUgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTkxICBzZWNvbmQ9MjE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTkxICBzZWNvbmQ9MjE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTkxICBzZWNvbmQ9MjE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTkxICBzZWNvbmQ9MjIwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9MzQgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0zOSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTk5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTEwMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTEwMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTEwMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTExMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTIzMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTIzMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTIzMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTIzNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTIzNSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTk5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTEwMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTEwMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTEwMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTExMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTIzMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTIzMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTIzMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTIzNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTIzNSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTExMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTI0MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTI0MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTI0NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTI0NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTI0NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTkgc2Vjb25kPTQ0ICBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9MTE5IHNlY29uZD00NiAgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9NzQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9ODUgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9MjE3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9MjE4IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9MjE5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9MjIwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MzQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MzkgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTExIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjQyIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjQzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjQ0IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjQ1IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjQ2IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9NjUgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTkyIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTkzIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTk0IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTk1IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTk2IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTk3IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9OTkgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTAwIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTAxIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTAzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTEzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjMxIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjMyIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjMzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjM0IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjM1IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTA5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTEwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTEyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjQxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9OTcgIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjI0IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjI1IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjI2IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjI3IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjI4IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MjI5IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTM0ICBzZWNvbmQ9MTE1IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MzQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MzkgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTExIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjQyIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjQzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjQ0IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjQ1IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjQ2IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9NjUgIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTkyIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTkzIGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTk0IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTk1IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTk2IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTk3IGFtb3VudD0tOVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9OTkgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTAwIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTAxIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTAzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTEzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjMxIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjMyIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjMzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjM0IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjM1IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTA5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTEwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTEyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjQxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9OTcgIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjI0IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjI1IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjI2IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjI3IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjI4IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MjI5IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTM5ICBzZWNvbmQ9MTE1IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTQ0ICBzZWNvbmQ9MzQgIGFtb3VudD0tMTNcclxua2VybmluZyBmaXJzdD00NCAgc2Vjb25kPTM5ICBhbW91bnQ9LTEzXHJcbmtlcm5pbmcgZmlyc3Q9NDYgIHNlY29uZD0zNCAgYW1vdW50PS0xM1xyXG5rZXJuaW5nIGZpcnN0PTQ2ICBzZWNvbmQ9MzkgIGFtb3VudD0tMTNcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTExOCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTEyMSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI1MyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI1NSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTY3ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTcxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTc5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTgxICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTE5OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTg1ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIxOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIyMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTM0ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTM5ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTg3ICBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTg0ICBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgIHNlY29uZD0xMjIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTg2ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTg5ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD02NSAgc2Vjb25kPTIyMSBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD02NiAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02NiAgc2Vjb25kPTg2ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02NiAgc2Vjb25kPTg5ICBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD02NiAgc2Vjb25kPTIyMSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD02NyAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTg2ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTg5ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTIyMSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTY1ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTE5MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTE5MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTE5NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTg4ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTQ0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTQ2ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD02OCAgc2Vjb25kPTkwICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTExOCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTEyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI1MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI1NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OSAgc2Vjb25kPTg0ICBhbW91bnQ9MlxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9OTkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY5ICBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9ODkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9MjIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9NjUgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD0xOTIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTE5MyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9MTk0IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD0xOTUgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03MiAgc2Vjb25kPTE5NiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTcyICBzZWNvbmQ9MTk3IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzIgIHNlY29uZD04OCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTg5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTIyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTY1ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9MTkyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD0xOTMgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTE5NCBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9MTk1IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzMgIHNlY29uZD0xOTYgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03MyAgc2Vjb25kPTE5NyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTczICBzZWNvbmQ9ODggIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzQgIHNlY29uZD02NSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzQgIHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzQgIHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzQgIHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzQgIHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzQgIHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzQgIHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMTggYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMjEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNTMgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNTUgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD02NyAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD03MSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD03OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD04MSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xOTkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMTAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNDIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNDUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNDkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNTAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD05OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMDAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMDEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMzEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMzIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMzMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yMzUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD00NSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xNzMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMDkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMTAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0xMTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgIHNlY29uZD0yNDEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xMTggYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTIxIGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTI1MyBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0yNTUgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9NjcgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9NzEgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9NzkgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9ODEgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjE2IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTk5IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjEwIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjExIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjEyIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjEzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjE0IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9ODUgIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjE3IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjE4IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjE5IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjIwIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MzQgIGFtb3VudD0tMjZcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTM5ICBhbW91bnQ9LTI2XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD04NyAgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9ODQgIGFtb3VudD0tMjFcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTExNyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTI0OSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTI1MCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTI1MSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTI1MiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTg2ICBhbW91bnQ9LTE0XHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD04OSAgYW1vdW50PS0xOVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MjIxIGFtb3VudD0tMTlcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTY1ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTkyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xOTMgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTE5NCBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc2ICBzZWNvbmQ9MTk1IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgIHNlY29uZD0xOTYgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03NiAgc2Vjb25kPTE5NyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9ODkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9MjIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9NjUgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD0xOTIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTE5MyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9MTk0IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD0xOTUgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03NyAgc2Vjb25kPTE5NiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc3ICBzZWNvbmQ9MTk3IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzcgIHNlY29uZD04OCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTg5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTIyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTY1ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9MTkyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD0xOTMgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTE5NCBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9MTk1IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzggIHNlY29uZD0xOTYgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD03OCAgc2Vjb25kPTE5NyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTc4ICBzZWNvbmQ9ODggIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD04NiAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD04OSAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD0yMjEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD02NSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD04OCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD00NCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD00NiAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9NzkgIHNlY29uZD05MCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xMTggYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTEyMSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MjUzIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0yNTUgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTY1ICBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xOTIgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTkzIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTE5NCBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD0xOTUgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9MTk2IGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTE5NyBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD04OCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODAgIHNlY29uZD00NCAgYW1vdW50PS0yNVxyXG5rZXJuaW5nIGZpcnN0PTgwICBzZWNvbmQ9NDYgIGFtb3VudD0tMjVcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTkwICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTk5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTk3ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIyNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIyNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIyNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIyNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIyOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTIyOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCAgc2Vjb25kPTc0ICBhbW91bnQ9LTE2XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMTggYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMjEgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNTMgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNTUgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD02NyAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD03MSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD03OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD04MSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xOTkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMTAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMTEgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNDIgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNDMgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNDQgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNDUgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yNDYgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD04NyAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTg0ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTE3IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjQ5IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjUwIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjUxIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MjUyIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTIyIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9ODYgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD04OSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIyMSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NjUgIGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTkyIGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTkzIGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTk0IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTk1IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTk2IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTk3IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9NDQgIGFtb3VudD0tMTdcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTQ2ICBhbW91bnQ9LTE3XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD05OSAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMDAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMDEgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMDMgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMTMgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMzEgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMzIgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMzMgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMzQgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0yMzUgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD0xMjAgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODQgIHNlY29uZD00NSAgYW1vdW50PS0xOFxyXG5rZXJuaW5nIGZpcnN0PTg0ICBzZWNvbmQ9MTczIGFtb3VudD0tMThcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTEwOSBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTExMCBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTExMiBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTI0MSBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTgzICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTk3ICBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIyNCBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIyNSBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIyNiBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIyNyBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIyOCBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTIyOSBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTExNSBhbW91bnQ9LTlcclxua2VybmluZyBmaXJzdD04NCAgc2Vjb25kPTc0ICBhbW91bnQ9LTE5XHJcbmtlcm5pbmcgZmlyc3Q9ODUgIHNlY29uZD02NSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODUgIHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODUgIHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODUgIHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODUgIHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODUgIHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODUgIHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD02NyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD03MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD03OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD04MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMTYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xOTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yMTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMTEgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNDIgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNDMgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNDQgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNDUgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNDYgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xMTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNDkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNTAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0yNTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD02NSAgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xOTIgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xOTMgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xOTQgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xOTUgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xOTYgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD0xOTcgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9ODYgIHNlY29uZD00NCAgYW1vdW50PS0xOFxyXG5rZXJuaW5nIGZpcnN0PTg2ICBzZWNvbmQ9NDYgIGFtb3VudD0tMThcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTk5ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTEwMCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTEwMSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTEwMyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTExMyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIzMSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIzMiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIzMyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIzNCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIzNSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTQ1ICBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTE3MyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTk3ICBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIyNCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIyNSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIyNiBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIyNyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIyOCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04NiAgc2Vjb25kPTIyOSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTExMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI0MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI0MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI0NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI0NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTI0NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTg0ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9NjUgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTkyIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTkzIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTk0IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTk1IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTk2IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9MTk3IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg3ICBzZWNvbmQ9NDQgIGFtb3VudD0tMTBcclxua2VybmluZyBmaXJzdD04NyAgc2Vjb25kPTQ2ICBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD05OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xMDAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xMDEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xMDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xMTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMzEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMzIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMzMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMzUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD00NSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0xNzMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD05NyAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMjQgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMjUgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMjYgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMjcgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMjggYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODcgIHNlY29uZD0yMjkgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMTggYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD02NyAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD03MSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD03OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD04MSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xOTkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMTAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yMTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNDIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNDUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0xMTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNDkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNTAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNTEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD0yNTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODggIHNlY29uZD04NiAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTk5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTEwMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTEwMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTEwMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTExMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIzMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIzMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIzMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIzNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTIzNSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTQ1ICBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04OCAgc2Vjb25kPTE3MyBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTExOCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTEyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI1MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI1NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTY3ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTcxICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTc5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTgxICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxNiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTE5OSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTg1ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxNyBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxOCBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIxOSBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTIyMCBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTExMSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI0MiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI0MyBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI0NCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI0NSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTI0NiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTg3ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODQgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMTcgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNDkgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNTAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNTEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0yNTIgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xMjIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04NiAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTg5ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjIxIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD02NSAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xOTIgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xOTMgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xOTQgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xOTUgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xOTYgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD0xOTcgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD04OCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD04OSAgc2Vjb25kPTQ0ICBhbW91bnQ9LTE2XHJcbmtlcm5pbmcgZmlyc3Q9ODkgIHNlY29uZD00NiAgYW1vdW50PS0xNlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9OTkgIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTAwIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTAxIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTAzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTEzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjMxIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjMyIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjMzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjM0IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjM1IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTIwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NDUgIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTczIGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTA5IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTEwIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTEyIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjQxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9ODMgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9OTcgIGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjI0IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjI1IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjI2IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjI3IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjI4IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MjI5IGFtb3VudD0tNlxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9MTE1IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTg5ICBzZWNvbmQ9NzQgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTE4IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjUzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjU1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9NjcgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9NzEgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9NzkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9ODEgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjE2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTk5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjEwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjExIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjEyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjEzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjE0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTExIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjQyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjQzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9NjUgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xOTIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTE5MyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTk0IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xOTUgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD05MCAgc2Vjb25kPTE5NiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTkwICBzZWNvbmQ9MTk3IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD05OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMDAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMDEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMDMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0xMTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMzEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMzIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMzMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTAgIHNlY29uZD0yMzUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTcgIHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTcgIHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTcgIHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTcgIHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTcgIHNlY29uZD0zNCAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9OTcgIHNlY29uZD0zOSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0zNCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0zOSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0xMjIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTggIHNlY29uZD0xMjAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTkgIHNlY29uZD0zNCAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9OTkgIHNlY29uZD0zOSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD0zNCAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD0zOSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTA0IHNlY29uZD0zNCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MTA0IHNlY29uZD0zOSAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MTA5IHNlY29uZD0zNCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MTA5IHNlY29uZD0zOSAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MTEwIHNlY29uZD0zNCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MTEwIHNlY29uZD0zOSAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0zNCAgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MzkgIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTEyMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTEyMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTM0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTM5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTEyMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTEyMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTExOCBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTIxIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yNTMgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTI1NSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MzQgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0zOSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTExMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTI0MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTI0MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTI0NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTI0NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTI0NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTQ0ICBhbW91bnQ9LTEwXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD00NiAgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9OTkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9OTcgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI0IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI1IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI2IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI3IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI4IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI5IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MzQgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0zOSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTQ0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTQ2ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTk5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTk3ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIyNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIyNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIyNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIyNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIyOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTIyOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTExMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTI0MiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTI0MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTI0NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTI0NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTI0NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTk5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTEwMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTEwMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTEwMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTExMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTIzMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTIzMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTIzMyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTIzNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTIzNSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTM0ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MzkgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD00NCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD00NiAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD05OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD05NyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMjQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMjYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMjcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMjggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD0yMjkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD05OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0zNCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0zOSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0xMjIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU0IHNlY29uZD0xMjAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD04NiAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD04OSAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0yMjEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD02NSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0xOTQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0xOTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD04OCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD00NCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD00NiAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD05MCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0xMTggYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0xMjEgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNTMgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNTUgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD02NyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD03MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD03OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0xOTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04NSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMjAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0zNCAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0zOSAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04NyAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04NCAgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MTIyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04NiAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04OSAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMjEgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0xMTggYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0xMjEgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNTMgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNTUgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD02NyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD03MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD03OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0xOTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04NSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMjAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0zNCAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0zOSAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04NyAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04NCAgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MTIyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04NiAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD04OSAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMjEgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0xMTggYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0xMjEgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNTMgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNTUgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD02NyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD03MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD03OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0xOTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04NSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMjAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0zNCAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0zOSAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04NyAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04NCAgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MTIyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04NiAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04OSAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMjEgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0xMTggYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0xMjEgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNTMgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNTUgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD02NyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD03MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD03OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0xOTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04NSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMjAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0zNCAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0zOSAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04NyAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04NCAgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MTIyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04NiAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04OSAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMjEgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0xMTggYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0xMjEgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNTMgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNTUgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD02NyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD03MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD03OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0xOTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04NSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMjAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0zNCAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0zOSAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04NyAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04NCAgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MTIyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04NiAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04OSAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0yMjEgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0xMTggYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0xMjEgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNTMgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNTUgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD02NyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD03MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD03OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04MSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0xOTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04NSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMjAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0zNCAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0zOSAgYW1vdW50PS05XHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04NyAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04NCAgYW1vdW50PS0xMFxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MTIyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04NiAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD04OSAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0yMjEgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MTk5IHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMTggYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAwIHNlY29uZD04NCAgYW1vdW50PTJcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTk5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDAgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTExOCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTEyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI1MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI1NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDEgc2Vjb25kPTg0ICBhbW91bnQ9MlxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9OTkgIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTAwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMSBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTE4IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjUzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjU1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIwMiBzZWNvbmQ9ODQgIGFtb3VudD0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yNTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD05OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAyIHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMTggYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNTUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjAzIHNlY29uZD04NCAgYW1vdW50PTJcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTk5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDMgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTg5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTIyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTY1ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9MTkyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD0xOTMgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTE5NCBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9MTk1IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA0IHNlY29uZD0xOTYgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDQgc2Vjb25kPTE5NyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNCBzZWNvbmQ9ODggIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD04OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD0yMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD02NSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTE5MiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9MTkzIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD0xOTQgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTE5NSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNSBzZWNvbmQ9MTk2IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA1IHNlY29uZD0xOTcgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDUgc2Vjb25kPTg4ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9ODkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9MjIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9NjUgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD0xOTIgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTE5MyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9MTk0IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD0xOTUgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDYgc2Vjb25kPTE5NiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNiBzZWNvbmQ9MTk3IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA2IHNlY29uZD04OCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTg0ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTg5ICBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTIyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTY1ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9MTkyIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD0xOTMgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTE5NCBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9MTk1IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA3IHNlY29uZD0xOTYgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDcgc2Vjb25kPTE5NyBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwNyBzZWNvbmQ9ODggIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD04NCAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD04OSAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD0yMjEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD02NSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTE5MiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9MTkzIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD0xOTQgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTE5NSBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIwOSBzZWNvbmQ9MTk2IGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjA5IHNlY29uZD0xOTcgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMDkgc2Vjb25kPTg4ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9ODYgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9ODkgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MjIxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9NjUgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9ODggIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9NDQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9NDYgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTIxMCBzZWNvbmQ9OTAgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9ODYgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9ODkgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MjIxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9NjUgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9ODggIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9NDQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9NDYgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9OTAgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9ODYgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9ODkgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MjIxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9NjUgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9ODggIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9NDQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9NDYgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9OTAgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9ODYgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9ODkgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MjIxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9NjUgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9ODggIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9NDQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9NDYgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9OTAgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9ODQgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9ODYgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9ODkgIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MjIxIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9NjUgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9ODggIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9NDQgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9NDYgIGFtb3VudD0tOFxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9OTAgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNyBzZWNvbmQ9NjUgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNyBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNyBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNyBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNyBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNyBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxNyBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxOCBzZWNvbmQ9NjUgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxOCBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxOCBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxOCBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxOCBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxOCBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxOCBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxOSBzZWNvbmQ9NjUgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxOSBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxOSBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxOSBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxOSBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxOSBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxOSBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMCBzZWNvbmQ9NjUgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMCBzZWNvbmQ9MTkyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMCBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMCBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMCBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMCBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMCBzZWNvbmQ9MTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTE4IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTIxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjUzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjU1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NjcgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NzEgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NzkgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODEgIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjE2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTk5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjEwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjExIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjEyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjEzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjE0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODUgIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjE3IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjE4IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjE5IGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjIwIGFtb3VudD0tN1xyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTExIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQyIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQzIGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQ0IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQ1IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQ2IGFtb3VudD0tNVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODcgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04NCAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExNyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0OSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI1MCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI1MSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI1MiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTEyMiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTg2ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9ODkgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjEgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTY1ICBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5MiBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5MyBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5NCBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5NSBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5NiBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE5NyBhbW91bnQ9LTdcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTg4ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NDQgIGFtb3VudD0tMTZcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTQ2ICBhbW91bnQ9LTE2XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD05OSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMDAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMDEgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMDMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzEgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzIgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzMgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzQgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzUgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMjAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD00NSAgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xNzMgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMDkgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTAgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTIgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDEgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD04MyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD05NyAgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjQgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjUgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjYgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjcgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjggYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjkgYW1vdW50PS02XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTUgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD03NCAgYW1vdW50PS03XHJcbmtlcm5pbmcgZmlyc3Q9MjI0IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI0IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI0IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI0IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI0IHNlY29uZD0zNCAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjI0IHNlY29uZD0zOSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjI1IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI1IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI1IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI1IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI1IHNlY29uZD0zNCAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjI1IHNlY29uZD0zOSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjI2IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI2IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI2IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI2IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI2IHNlY29uZD0zNCAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjI2IHNlY29uZD0zOSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjI3IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI3IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI3IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI3IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI3IHNlY29uZD0zNCAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjI3IHNlY29uZD0zOSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjI4IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI4IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI4IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI4IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI4IHNlY29uZD0zNCAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjI4IHNlY29uZD0zOSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjI5IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI5IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI5IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI5IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI5IHNlY29uZD0zNCAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjI5IHNlY29uZD0zOSAgYW1vdW50PS01XHJcbmtlcm5pbmcgZmlyc3Q9MjMxIHNlY29uZD0zNCAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjMxIHNlY29uZD0zOSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjMyIHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjMyIHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjMyIHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjMyIHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjMyIHNlY29uZD0zNCAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjMyIHNlY29uZD0zOSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjMzIHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjMzIHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjMzIHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjMzIHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjMzIHNlY29uZD0zNCAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjMzIHNlY29uZD0zOSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjM0IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjM0IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjM0IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjM0IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjM0IHNlY29uZD0zNCAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjM0IHNlY29uZD0zOSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjM1IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjM1IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjM1IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjM1IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjM1IHNlY29uZD0zNCAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjM1IHNlY29uZD0zOSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQxIHNlY29uZD0zNCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjQxIHNlY29uZD0zOSAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0zNCAgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MzkgIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTEyMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDIgc2Vjb25kPTEyMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDMgc2Vjb25kPTM0ICBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0zOSAgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MTIyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0MyBzZWNvbmQ9MTIwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MzQgIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTM5ICBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0xMjIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ0IHNlY29uZD0xMjAgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQ1IHNlY29uZD0zNCAgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MzkgIGFtb3VudD0tMTFcclxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTEyMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDUgc2Vjb25kPTEyMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTM0ICBhbW91bnQ9LTExXHJcbmtlcm5pbmcgZmlyc3Q9MjQ2IHNlY29uZD0zOSAgYW1vdW50PS0xMVxyXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MTIyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NiBzZWNvbmQ9MTIwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTI1MyBzZWNvbmQ9MzQgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD0zOSAgYW1vdW50PTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTI0NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTQ0ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTQ2ICBhbW91bnQ9LThcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTk5ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIzNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTk3ICBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIyNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIyNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIyNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIyNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIyOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTIyOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTUgc2Vjb25kPTM0ICBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTI1NSBzZWNvbmQ9MzkgIGFtb3VudD0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD00NCAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD00NiAgYW1vdW50PS04XHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD05OSAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0xMDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMzIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD05NyAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMjQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMjYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMjcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMjggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD0yMjkgYW1vdW50PS0xXHJcbmA7XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSA9IHt9ICl7XHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIHBhbmVsICk7XHJcblxyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZU9uUHJlc3MgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICd0aWNrJywgaGFuZGxlVGljayApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUmVsZWFzZWQnLCBoYW5kbGVPblJlbGVhc2UgKTtcclxuXHJcbiAgY29uc3QgdGVtcE1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XHJcbiAgY29uc3QgdFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuXHJcbiAgbGV0IG9sZFBhcmVudDtcclxuICBcclxuICBmdW5jdGlvbiBnZXRUb3BMZXZlbEZvbGRlcihncm91cCkge1xyXG4gICAgdmFyIGZvbGRlciA9IGdyb3VwLmZvbGRlcjtcclxuICAgIHdoaWxlIChmb2xkZXIuZm9sZGVyICE9PSBmb2xkZXIpIGZvbGRlciA9IGZvbGRlci5mb2xkZXI7XHJcbiAgICByZXR1cm4gZm9sZGVyO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlVGljayggeyBpbnB1dCB9ID0ge30gKXtcclxuICAgIGNvbnN0IGZvbGRlciA9IGdldFRvcExldmVsRm9sZGVyKGdyb3VwKTtcclxuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGlucHV0Lm1vdXNlICl7XHJcbiAgICAgIGlmKCBpbnB1dC5wcmVzc2VkICYmIGlucHV0LnNlbGVjdGVkICYmIGlucHV0LnJheWNhc3QucmF5LmludGVyc2VjdFBsYW5lKCBpbnB1dC5tb3VzZVBsYW5lLCBpbnB1dC5tb3VzZUludGVyc2VjdGlvbiApICl7XHJcbiAgICAgICAgaWYoIGlucHV0LmludGVyYWN0aW9uLnByZXNzID09PSBpbnRlcmFjdGlvbiApe1xyXG4gICAgICAgICAgZm9sZGVyLnBvc2l0aW9uLmNvcHkoIGlucHV0Lm1vdXNlSW50ZXJzZWN0aW9uLnN1YiggaW5wdXQubW91c2VPZmZzZXQgKSApO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmKCBpbnB1dC5pbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDAgKXtcclxuICAgICAgICBjb25zdCBoaXRPYmplY3QgPSBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ub2JqZWN0O1xyXG4gICAgICAgIGlmKCBoaXRPYmplY3QgPT09IHBhbmVsICl7XHJcbiAgICAgICAgICBoaXRPYmplY3QudXBkYXRlTWF0cml4V29ybGQoKTtcclxuICAgICAgICAgIHRQb3NpdGlvbi5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGhpdE9iamVjdC5tYXRyaXhXb3JsZCApO1xyXG5cclxuICAgICAgICAgIGlucHV0Lm1vdXNlUGxhbmUuc2V0RnJvbU5vcm1hbEFuZENvcGxhbmFyUG9pbnQoIGlucHV0Lm1vdXNlQ2FtZXJhLmdldFdvcmxkRGlyZWN0aW9uKCBpbnB1dC5tb3VzZVBsYW5lLm5vcm1hbCApLCB0UG9zaXRpb24gKTtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCBpbnB1dC5tb3VzZVBsYW5lICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblByZXNzKCBwICl7XHJcblxyXG4gICAgbGV0IHsgaW5wdXRPYmplY3QsIGlucHV0IH0gPSBwO1xyXG5cclxuICAgIGNvbnN0IGZvbGRlciA9IGdldFRvcExldmVsRm9sZGVyKGdyb3VwKTtcclxuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSB0cnVlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiggaW5wdXQubW91c2UgKXtcclxuICAgICAgaWYoIGlucHV0LmludGVyc2VjdGlvbnMubGVuZ3RoID4gMCApe1xyXG4gICAgICAgIGlmKCBpbnB1dC5yYXljYXN0LnJheS5pbnRlcnNlY3RQbGFuZSggaW5wdXQubW91c2VQbGFuZSwgaW5wdXQubW91c2VJbnRlcnNlY3Rpb24gKSApe1xyXG4gICAgICAgICAgY29uc3QgaGl0T2JqZWN0ID0gaW5wdXQuaW50ZXJzZWN0aW9uc1sgMCBdLm9iamVjdDtcclxuICAgICAgICAgIGlmKCBoaXRPYmplY3QgIT09IHBhbmVsICl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpbnB1dC5zZWxlY3RlZCA9IGZvbGRlcjtcclxuXHJcbiAgICAgICAgICBpbnB1dC5zZWxlY3RlZC51cGRhdGVNYXRyaXhXb3JsZCgpO1xyXG4gICAgICAgICAgdFBvc2l0aW9uLnNldEZyb21NYXRyaXhQb3NpdGlvbiggaW5wdXQuc2VsZWN0ZWQubWF0cml4V29ybGQgKTtcclxuXHJcbiAgICAgICAgICBpbnB1dC5tb3VzZU9mZnNldC5jb3B5KCBpbnB1dC5tb3VzZUludGVyc2VjdGlvbiApLnN1YiggdFBvc2l0aW9uICk7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyggaW5wdXQubW91c2VPZmZzZXQgKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZWxzZXtcclxuICAgICAgdGVtcE1hdHJpeC5nZXRJbnZlcnNlKCBpbnB1dE9iamVjdC5tYXRyaXhXb3JsZCApO1xyXG5cclxuICAgICAgZm9sZGVyLm1hdHJpeC5wcmVtdWx0aXBseSggdGVtcE1hdHJpeCApO1xyXG4gICAgICBmb2xkZXIubWF0cml4LmRlY29tcG9zZSggZm9sZGVyLnBvc2l0aW9uLCBmb2xkZXIucXVhdGVybmlvbiwgZm9sZGVyLnNjYWxlICk7XHJcblxyXG4gICAgICBvbGRQYXJlbnQgPSBmb2xkZXIucGFyZW50O1xyXG4gICAgICBpbnB1dE9iamVjdC5hZGQoIGZvbGRlciApO1xyXG4gICAgfVxyXG5cclxuICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuXHJcbiAgICBmb2xkZXIuYmVpbmdNb3ZlZCA9IHRydWU7XHJcblxyXG4gICAgaW5wdXQuZXZlbnRzLmVtaXQoICdncmFiYmVkJywgaW5wdXQgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUmVsZWFzZSggcCApe1xyXG5cclxuICAgIGxldCB7IGlucHV0T2JqZWN0LCBpbnB1dCB9ID0gcDtcclxuXHJcbiAgICBjb25zdCBmb2xkZXIgPSBnZXRUb3BMZXZlbEZvbGRlcihncm91cCk7XHJcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBmb2xkZXIuYmVpbmdNb3ZlZCA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpbnB1dC5tb3VzZSApe1xyXG4gICAgICBpbnB1dC5zZWxlY3RlZCA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcblxyXG4gICAgICBpZiggb2xkUGFyZW50ID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvbGRlci5tYXRyaXgucHJlbXVsdGlwbHkoIGlucHV0T2JqZWN0Lm1hdHJpeFdvcmxkICk7XHJcbiAgICAgIGZvbGRlci5tYXRyaXguZGVjb21wb3NlKCBmb2xkZXIucG9zaXRpb24sIGZvbGRlci5xdWF0ZXJuaW9uLCBmb2xkZXIuc2NhbGUgKTtcclxuICAgICAgb2xkUGFyZW50LmFkZCggZm9sZGVyICk7XHJcbiAgICAgIG9sZFBhcmVudCA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBmb2xkZXIuYmVpbmdNb3ZlZCA9IGZhbHNlO1xyXG5cclxuICAgIGlucHV0LmV2ZW50cy5lbWl0KCAnZ3JhYlJlbGVhc2VkJywgaW5wdXQgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBpbnRlcmFjdGlvbjtcclxufSIsImV4cG9ydCBjb25zdCBncmFiQmFyID0gKGZ1bmN0aW9uKCl7XHJcbiAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICBpbWFnZS5zcmMgPSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFFQUFBQUFnQ0FZQUFBQ2luWDZFQUFBQUNYQklXWE1BQUM0akFBQXVJd0Y0cFQ5MkFBQUtUMmxEUTFCUWFHOTBiM05vYjNBZ1NVTkRJSEJ5YjJacGJHVUFBSGphblZOblZGUHBGajMzM3ZSQ1M0aUFsRXR2VWhVSUlGSkNpNEFVa1NZcUlRa1FTb2dob2RrVlVjRVJSVVVFRzhpZ2lBT09qb0NNRlZFc0RJb0syQWZrSWFLT2c2T0lpc3I3NFh1amE5YTg5K2JOL3JYWFB1ZXM4NTJ6endmQUNBeVdTRE5STllBTXFVSWVFZUNEeDhURzRlUXVRSUVLSkhBQUVBaXpaQ0Z6L1NNQkFQaCtQRHdySXNBSHZnQUJlTk1MQ0FEQVRadkFNQnlIL3cvcVFwbGNBWUNFQWNCMGtUaExDSUFVQUVCNmprS21BRUJHQVlDZG1DWlRBS0FFQUdETFkyTGpBRkF0QUdBbmYrYlRBSUNkK0psN0FRQmJsQ0VWQWFDUkFDQVRaWWhFQUdnN0FLelBWb3BGQUZnd0FCUm1TOFE1QU5ndEFEQkpWMlpJQUxDM0FNRE9FQXV5QUFnTUFEQlJpSVVwQUFSN0FHRElJeU40QUlTWkFCUkc4bGM4OFN1dUVPY3FBQUI0bWJJOHVTUTVSWUZiQ0MxeEIxZFhMaDRvemtrWEt4UTJZUUpobWtBdXdubVpHVEtCTkEvZzg4d0FBS0NSRlJIZ2cvUDllTTRPcnM3T05vNjJEbDh0NnI4Ry95SmlZdVArNWMrcmNFQUFBT0YwZnRIK0xDK3pHb0E3Qm9CdC9xSWw3Z1JvWGd1Z2RmZUxacklQUUxVQW9PbmFWL053K0g0OFBFV2hrTG5aMmVYazVOaEt4RUpiWWNwWGZmNW53bC9BVi8xcytYNDgvUGYxNEw3aUpJRXlYWUZIQlBqZ3dzejBUS1VjejVJSmhHTGM1bzlIL0xjTC8vd2QweUxFU1dLNVdDb1U0MUVTY1k1RW1venpNcVVpaVVLU0tjVWwwdjlrNHQ4cyt3TSszelVBc0dvK0FYdVJMYWhkWXdQMlN5Y1FXSFRBNHZjQUFQSzdiOEhVS0FnRGdHaUQ0YzkzLys4Ly9VZWdKUUNBWmttU2NRQUFYa1FrTGxUS3N6L0hDQUFBUktDQktyQkJHL1RCR0N6QUJoekJCZHpCQy94Z05vUkNKTVRDUWhCQ0NtU0FISEpnS2F5Q1FpaUd6YkFkS21BdjFFQWROTUJSYUlhVGNBNHV3bFc0RGoxd0QvcGhDSjdCS0x5QkNRUkJ5QWdUWVNIYWlBRmlpbGdqamdnWG1ZWDRJY0ZJQkJLTEpDREppQlJSSWt1Uk5VZ3hVb3BVSUZWSUhmSTljZ0k1aDF4R3VwRTd5QUF5Z3Z5R3ZFY3hsSUd5VVQzVURMVkR1YWczR29SR29ndlFaSFF4bW84V29KdlFjclFhUFl3Mm9lZlFxMmdQMm84K1E4Y3d3T2dZQnpQRWJEQXV4c05Dc1Rnc0NaTmp5N0VpckF5cnhocXdWcXdEdTRuMVk4K3hkd1FTZ1VYQUNUWUVkMElnWVI1QlNGaE1XRTdZU0tnZ0hDUTBFZG9KTndrRGhGSENKeUtUcUV1MEpyb1IrY1FZWWpJeGgxaElMQ1BXRW84VEx4QjdpRVBFTnlRU2lVTXlKN21RQWtteHBGVFNFdEpHMG01U0kra3NxWnMwU0Jvams4bmFaR3V5QnptVUxDQXJ5SVhrbmVURDVEUGtHK1FoOGxzS25XSkFjYVQ0VStJb1VzcHFTaG5sRU9VMDVRWmxtREpCVmFPYVV0Mm9vVlFSTlk5YVFxMmh0bEt2VVllb0V6UjFtam5OZ3haSlM2V3RvcFhUR21nWGFQZHByK2gwdWhIZGxSNU9sOUJYMHN2cFIraVg2QVAwZHd3TmhoV0R4NGhuS0JtYkdBY1laeGwzR0srWVRLWVowNHNaeDFRd056SHJtT2VaRDVsdlZWZ3F0aXA4RlpIS0NwVktsU2FWR3lvdlZLbXFwcXJlcWd0VjgxWExWSStwWGxOOXJrWlZNMVBqcVFuVWxxdFZxcDFRNjFNYlUyZXBPNmlIcW1lb2IxUS9wSDVaL1lrR1djTk13MDlEcEZHZ3NWL2p2TVlnQzJNWnMzZ3NJV3NOcTRaMWdUWEVKckhOMlh4MktydVkvUjI3aXoycXFhRTVRek5LTTFlelV2T1VaajhINDVoeCtKeDBUZ25uS0tlWDgzNkszaFR2S2VJcEc2WTBUTGt4WlZ4cnFwYVhsbGlyU0t0UnEwZnJ2VGF1N2FlZHByMUZ1MW43Z1E1Qngwb25YQ2RIWjQvT0JaM25VOWxUM2FjS3B4Wk5QVHIxcmk2cWE2VWJvYnRFZDc5dXArNllucjVlZ0o1TWI2ZmVlYjNuK2h4OUwvMVUvVzM2cC9WSERGZ0dzd3drQnRzTXpoZzh4VFZ4Ynp3ZEw4ZmI4VkZEWGNOQVE2VmhsV0dYNFlTUnVkRThvOVZHalVZUGpHbkdYT01rNDIzR2JjYWpKZ1ltSVNaTFRlcE43cHBTVGJtbUthWTdURHRNeDgzTXphTE4xcGsxbXoweDF6TG5tK2ViMTV2ZnQyQmFlRm9zdHFpMnVHVkpzdVJhcGxudXRyeHVoVm81V2FWWVZWcGRzMGF0bmEwbDFydXR1NmNScDdsT2swNnJudFpudzdEeHRzbTJxYmNac09YWUJ0dXV0bTIyZldGblloZG50OFd1dys2VHZaTjl1bjJOL1QwSERZZlpEcXNkV2gxK2M3UnlGRHBXT3Q2YXpwenVQMzNGOUpicEwyZFl6eERQMkRQanRoUExLY1JwblZPYjAwZG5GMmU1YzRQemlJdUpTNExMTHBjK0xwc2J4dDNJdmVSS2RQVnhYZUY2MHZXZG03T2J3dTJvMjYvdU51NXA3b2Zjbjh3MG55bWVXVE56ME1QSVErQlI1ZEUvQzUrVk1HdmZySDVQUTArQlo3WG5JeTlqTDVGWHJkZXd0NlYzcXZkaDd4Yys5ajV5bitNKzR6dzMzakxlV1YvTU44QzN5TGZMVDhOdm5sK0YzME4vSS85ay8zci8wUUNuZ0NVQlp3T0pnVUdCV3dMNytIcDhJYitPUHpyYlpmYXkyZTFCaktDNVFSVkJqNEt0Z3VYQnJTRm95T3lRclNIMzU1ak9rYzVwRG9WUWZ1alcwQWRoNW1HTHczNE1KNFdIaFZlR1A0NXdpRmdhMFRHWE5YZlIzRU56MzBUNlJKWkUzcHRuTVU4NXJ5MUtOU28rcWk1cVBObzN1alM2UDhZdVpsbk0xVmlkV0Vsc1N4dzVMaXF1Tm01c3Z0Lzg3Zk9INHAzaUMrTjdGNWd2eUYxd2VhSE93dlNGcHhhcExoSXNPcFpBVEloT09KVHdRUkFxcUJhTUpmSVRkeVdPQ25uQ0hjSm5JaS9STnRHSTJFTmNLaDVPOGtncVRYcVM3Skc4Tlhra3hUT2xMT1c1aENlcGtMeE1EVXpkbXpxZUZwcDJJRzB5UFRxOU1ZT1NrWkJ4UXFvaFRaTzJaK3BuNW1aMnk2eGxoYkwreFc2THR5OGVsUWZKYTdPUXJBVlpMUXEyUXFib1ZGb28xeW9Ic21kbFYyYS96WW5LT1phcm5pdk43Y3l6eXR1UU41enZuLy90RXNJUzRaSzJwWVpMVnkwZFdPYTlyR281c2p4eGVkc0s0eFVGSzRaV0Jxdzh1SXEyS20zVlQ2dnRWNWV1ZnIwbWVrMXJnVjdCeW9MQnRRRnI2d3RWQ3VXRmZldmMxKzFkVDFndldkKzFZZnFHblJzK0ZZbUtyaFRiRjVjVmY5Z28zSGpsRzRkdnlyK1ozSlMwcWF2RXVXVFBadEptNmViZUxaNWJEcGFxbCthWERtNE4yZHEwRGQ5V3RPMzE5a1hiTDVmTktOdTdnN1pEdWFPL1BMaThaYWZKenMwN1AxU2tWUFJVK2xRMjd0TGR0V0hYK0c3UjdodDd2UFkwN05YYlc3ejMvVDdKdnR0VkFWVk4xV2JWWmZ0Sis3UDNQNjZKcXVuNGx2dHRYYTFPYlhIdHh3UFNBLzBISXc2MjE3blUxUjNTUFZSU2o5WXI2MGNPeHgrKy9wM3ZkeTBOTmcxVmpaekc0aU53UkhuazZmY0ozL2NlRFRyYWRveDdyT0VIMHg5MkhXY2RMMnBDbXZLYVJwdFRtdnRiWWx1NlQ4dyswZGJxM25yOFI5c2ZENXcwUEZsNVN2TlV5V25hNllMVGsyZnl6NHlkbFoxOWZpNzUzR0Rib3JaNzUyUE8zMm9QYisrNkVIVGgwa1gvaStjN3ZEdk9YUEs0ZFBLeTIrVVRWN2hYbXE4NlgyM3FkT284L3BQVFQ4ZTduTHVhcnJsY2E3bnVlcjIxZTJiMzZSdWVOODdkOUwxNThSYi8xdFdlT1QzZHZmTjZiL2ZGOS9YZkZ0MStjaWY5enN1NzJYY243cTI4VDd4ZjlFRHRRZGxEM1lmVlAxdiszTmp2M0g5cXdIZWc4OUhjUi9jR2hZUFAvcEgxanc5REJZK1pqOHVHRFlicm5qZytPVG5pUDNMOTZmeW5RODlrenlhZUYvNmkvc3V1RnhZdmZ2alY2OWZPMFpqUm9aZnlsNU8vYlh5bC9lckE2eG12MjhiQ3hoNit5WGd6TVY3MFZ2dnR3WGZjZHgzdm85OFBUK1I4SUg4by8yajVzZlZUMEtmN2t4bVRrLzhFQTVqei9HTXpMZHNBQURza2FWUllkRmhOVERwamIyMHVZV1J2WW1VdWVHMXdBQUFBQUFBOFAzaHdZV05yWlhRZ1ltVm5hVzQ5SXUrN3Z5SWdhV1E5SWxjMVRUQk5jRU5sYUdsSWVuSmxVM3BPVkdONmEyTTVaQ0kvUGdvOGVEcDRiWEJ0WlhSaElIaHRiRzV6T25nOUltRmtiMkpsT201ek9tMWxkR0V2SWlCNE9uaHRjSFJyUFNKQlpHOWlaU0JZVFZBZ1EyOXlaU0ExTGpZdFl6RXpNaUEzT1M0eE5Ua3lPRFFzSURJd01UWXZNRFF2TVRrdE1UTTZNVE02TkRBZ0lDQWdJQ0FnSUNJK0NpQWdJRHh5WkdZNlVrUkdJSGh0Ykc1ek9uSmtaajBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TVRrNU9TOHdNaTh5TWkxeVpHWXRjM2x1ZEdGNExXNXpJeUkrQ2lBZ0lDQWdJRHh5WkdZNlJHVnpZM0pwY0hScGIyNGdjbVJtT21GaWIzVjBQU0lpQ2lBZ0lDQWdJQ0FnSUNBZ0lIaHRiRzV6T25odGNEMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02WkdNOUltaDBkSEE2THk5d2RYSnNMbTl5Wnk5a1l5OWxiR1Z0Wlc1MGN5OHhMakV2SWdvZ0lDQWdJQ0FnSUNBZ0lDQjRiV3h1Y3pwd2FHOTBiM05vYjNBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZjR2h2ZEc5emFHOXdMekV1TUM4aUNpQWdJQ0FnSUNBZ0lDQWdJSGh0Ykc1ek9uaHRjRTFOUFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzaGhjQzh4TGpBdmJXMHZJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenB6ZEVWMmREMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMM05VZVhCbEwxSmxjMjkxY21ObFJYWmxiblFqSWdvZ0lDQWdJQ0FnSUNBZ0lDQjRiV3h1Y3pwMGFXWm1QU0pvZEhSd09pOHZibk11WVdSdlltVXVZMjl0TDNScFptWXZNUzR3THlJS0lDQWdJQ0FnSUNBZ0lDQWdlRzFzYm5NNlpYaHBaajBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5bGVHbG1MekV1TUM4aVBnb2dJQ0FnSUNBZ0lDQThlRzF3T2tOeVpXRjBiM0pVYjI5c1BrRmtiMkpsSUZCb2IzUnZjMmh2Y0NCRFF5QXlNREUxTGpVZ0tGZHBibVJ2ZDNNcFBDOTRiWEE2UTNKbFlYUnZjbFJ2YjJ3K0NpQWdJQ0FnSUNBZ0lEeDRiWEE2UTNKbFlYUmxSR0YwWlQ0eU1ERTJMVEE1TFRJNFZERTJPakkxT2pNeUxUQTNPakF3UEM5NGJYQTZRM0psWVhSbFJHRjBaVDRLSUNBZ0lDQWdJQ0FnUEhodGNEcE5iMlJwWm5sRVlYUmxQakl3TVRZdE1Ea3RNamhVTVRZNk16YzZNak10TURjNk1EQThMM2h0Y0RwTmIyUnBabmxFWVhSbFBnb2dJQ0FnSUNBZ0lDQThlRzF3T2sxbGRHRmtZWFJoUkdGMFpUNHlNREUyTFRBNUxUSTRWREUyT2pNM09qSXpMVEEzT2pBd1BDOTRiWEE2VFdWMFlXUmhkR0ZFWVhSbFBnb2dJQ0FnSUNBZ0lDQThaR002Wm05eWJXRjBQbWx0WVdkbEwzQnVaend2WkdNNlptOXliV0YwUGdvZ0lDQWdJQ0FnSUNBOGNHaHZkRzl6YUc5d09rTnZiRzl5VFc5a1pUNHpQQzl3YUc5MGIzTm9iM0E2UTI5c2IzSk5iMlJsUGdvZ0lDQWdJQ0FnSUNBOGNHaHZkRzl6YUc5d09rbERRMUJ5YjJacGJHVStjMUpIUWlCSlJVTTJNVGsyTmkweUxqRThMM0JvYjNSdmMyaHZjRHBKUTBOUWNtOW1hV3hsUGdvZ0lDQWdJQ0FnSUNBOGVHMXdUVTA2U1c1emRHRnVZMlZKUkQ1NGJYQXVhV2xrT21GaFlURmpNVFF6TFRVd1ptVXRPVFEwTXkxaE5UaG1MV0V5TTJWa05UTTNNRGRtTUR3dmVHMXdUVTA2U1c1emRHRnVZMlZKUkQ0S0lDQWdJQ0FnSUNBZ1BIaHRjRTFOT2tSdlkzVnRaVzUwU1VRK1lXUnZZbVU2Wkc5amFXUTZjR2h2ZEc5emFHOXdPamRsTnpkbVltWmpMVGcxWkRRdE1URmxOaTFoWXpobUxXRmpOelUwWldRMU9ETTNaand2ZUcxd1RVMDZSRzlqZFcxbGJuUkpSRDRLSUNBZ0lDQWdJQ0FnUEhodGNFMU5Pazl5YVdkcGJtRnNSRzlqZFcxbGJuUkpSRDU0YlhBdVpHbGtPbU0xWm1NMFpHWXlMVGt4WTJNdFpUSTBNUzA0WTJWakxUTXpPREl5WTJRMVpXRmxPVHd2ZUcxd1RVMDZUM0pwWjJsdVlXeEViMk4xYldWdWRFbEVQZ29nSUNBZ0lDQWdJQ0E4ZUcxd1RVMDZTR2x6ZEc5eWVUNEtJQ0FnSUNBZ0lDQWdJQ0FnUEhKa1pqcFRaWEUrQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh5WkdZNmJHa2djbVJtT25CaGNuTmxWSGx3WlQwaVVtVnpiM1Z5WTJVaVBnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM1JGZG5RNllXTjBhVzl1UG1OeVpXRjBaV1E4TDNOMFJYWjBPbUZqZEdsdmJqNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9tbHVjM1JoYm1ObFNVUStlRzF3TG1scFpEcGpOV1pqTkdSbU1pMDVNV05qTFdVeU5ERXRPR05sWXkwek16Z3lNbU5rTldWaFpUazhMM04wUlhaME9tbHVjM1JoYm1ObFNVUStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcDNhR1Z1UGpJd01UWXRNRGt0TWpoVU1UWTZNalU2TXpJdE1EYzZNREE4TDNOMFJYWjBPbmRvWlc0K0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkRVYyZERwemIyWjBkMkZ5WlVGblpXNTBQa0ZrYjJKbElGQm9iM1J2YzJodmNDQkRReUF5TURFMUxqVWdLRmRwYm1SdmQzTXBQQzl6ZEVWMmREcHpiMlowZDJGeVpVRm5aVzUwUGdvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDNKa1pqcHNhVDRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSEprWmpwc2FTQnlaR1k2Y0dGeWMyVlVlWEJsUFNKU1pYTnZkWEpqWlNJK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkRVYyZERwaFkzUnBiMjQrWTI5dWRtVnlkR1ZrUEM5emRFVjJkRHBoWTNScGIyNCtDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcHdZWEpoYldWMFpYSnpQbVp5YjIwZ1lYQndiR2xqWVhScGIyNHZkbTVrTG1Ga2IySmxMbkJvYjNSdmMyaHZjQ0IwYnlCcGJXRm5aUzl3Ym1jOEwzTjBSWFowT25CaGNtRnRaWFJsY25NK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmNtUm1PbXhwUGdvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4Y21SbU9teHBJSEprWmpwd1lYSnpaVlI1Y0dVOUlsSmxjMjkxY21ObElqNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9tRmpkR2x2Ymo1ellYWmxaRHd2YzNSRmRuUTZZV04wYVc5dVBnb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM1JGZG5RNmFXNXpkR0Z1WTJWSlJENTRiWEF1YVdsa09tRmhZVEZqTVRRekxUVXdabVV0T1RRME15MWhOVGhtTFdFeU0yVmtOVE0zTURkbU1Ed3ZjM1JGZG5RNmFXNXpkR0Z1WTJWSlJENEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9uZG9aVzQrTWpBeE5pMHdPUzB5T0ZReE5qb3pOem95TXkwd056b3dNRHd2YzNSRmRuUTZkMmhsYmo0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUStRV1J2WW1VZ1VHaHZkRzl6YUc5d0lFTkRJREl3TVRVdU5TQW9WMmx1Wkc5M2N5azhMM04wUlhaME9uTnZablIzWVhKbFFXZGxiblErQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRFVjJkRHBqYUdGdVoyVmtQaTg4TDNOMFJYWjBPbU5vWVc1blpXUStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZjbVJtT214cFBnb2dJQ0FnSUNBZ0lDQWdJQ0E4TDNKa1pqcFRaWEUrQ2lBZ0lDQWdJQ0FnSUR3dmVHMXdUVTA2U0dsemRHOXllVDRLSUNBZ0lDQWdJQ0FnUEhScFptWTZUM0pwWlc1MFlYUnBiMjQrTVR3dmRHbG1aanBQY21sbGJuUmhkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2V0ZKbGMyOXNkWFJwYjI0K016QXdNREF3TUM4eE1EQXdNRHd2ZEdsbVpqcFlVbVZ6YjJ4MWRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZXVkpsYzI5c2RYUnBiMjQrTXpBd01EQXdNQzh4TURBd01Ed3ZkR2xtWmpwWlVtVnpiMngxZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNlVtVnpiMngxZEdsdmJsVnVhWFErTWp3dmRHbG1aanBTWlhOdmJIVjBhVzl1Vlc1cGRENEtJQ0FnSUNBZ0lDQWdQR1Y0YVdZNlEyOXNiM0pUY0dGalpUNHhQQzlsZUdsbU9rTnZiRzl5VTNCaFkyVStDaUFnSUNBZ0lDQWdJRHhsZUdsbU9sQnBlR1ZzV0VScGJXVnVjMmx2Ymo0Mk5Ed3ZaWGhwWmpwUWFYaGxiRmhFYVcxbGJuTnBiMjQrQ2lBZ0lDQWdJQ0FnSUR4bGVHbG1PbEJwZUdWc1dVUnBiV1Z1YzJsdmJqNHpNand2WlhocFpqcFFhWGhsYkZsRWFXMWxibk5wYjI0K0NpQWdJQ0FnSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGdvZ0lDQThMM0prWmpwU1JFWStDand2ZURwNGJYQnRaWFJoUGdvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW84UDNod1lXTnJaWFFnWlc1a1BTSjNJajgrT2hGN1J3QUFBQ0JqU0ZKTkFBQjZKUUFBZ0lNQUFQbi9BQUNBNlFBQWRUQUFBT3BnQUFBNm1BQUFGMitTWDhWR0FBQUFsRWxFUVZSNDJ1elpzUTNBSUF4RVVUdVRaSlJza3Q1TFJGbUNkVExhcFVLQ0Jpam8vRjBobjJTa0p4SUtYSkpscnNPU0Z3QUFBQUJBNnZLSTZPN0JVb3JYZFp1MS9WRVdFWmVaZmJONW0vWmFtamZLK0FRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUNCZnVhU25hN2kvZGQxbWJYK1VTVHJON0o3TjI3VFgwcnhSeGduZ1pZaWZJQUFBQUpDNGZnQUFBUC8vQXdBdU1WUHcyMGh4Q3dBQUFBQkpSVTVFcmtKZ2dnPT1gO1xyXG5cclxuICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcclxuICB0ZXh0dXJlLmltYWdlID0gaW1hZ2U7XHJcbiAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgLy8gdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJNaXBNYXBMaW5lYXJGaWx0ZXI7XHJcbiAgLy8gdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXI7XHJcbiAgLy8gdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xyXG4gICAgLy8gY29sb3I6IDB4ZmYwMDAwLFxyXG4gICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgbWFwOiB0ZXh0dXJlXHJcbiAgfSk7XHJcbiAgbWF0ZXJpYWwuYWxwaGFUZXN0ID0gMC41O1xyXG5cclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoIGltYWdlLndpZHRoIC8gMTAwMCwgaW1hZ2UuaGVpZ2h0IC8gMTAwMCwgMSwgMSApO1xyXG5cclxuICAgIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaCggZ2VvbWV0cnksIG1hdGVyaWFsICk7XHJcbiAgICByZXR1cm4gbWVzaDtcclxuICB9XHJcblxyXG59KCkpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRvd25BcnJvdyA9IChmdW5jdGlvbigpe1xyXG4gIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgaW1hZ2Uuc3JjID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBSUFBQUFCQUNBWUFBQURTMW45L0FBQUFDWEJJV1hNQUFDeExBQUFzU3dHbFBaYXBBQUE0SzJsVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRLUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOUzQyTFdNeE16SWdOemt1TVRVNU1qZzBMQ0F5TURFMkx6QTBMekU1TFRFek9qRXpPalF3SUNBZ0lDQWdJQ0FpUGdvZ0lDQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQZ29nSUNBZ0lDQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlDaUFnSUNBZ0lDQWdJQ0FnSUhodGJHNXpPbVJqUFNKb2RIUndPaTh2Y0hWeWJDNXZjbWN2WkdNdlpXeGxiV1Z1ZEhNdk1TNHhMeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWdvZ0lDQWdJQ0FnSUNBZ0lDQjRiV3h1Y3pwNGJYQk5UVDBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5NFlYQXZNUzR3TDIxdEx5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZjM1JGZG5ROUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOXpWSGx3WlM5U1pYTnZkWEpqWlVWMlpXNTBJeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02ZEdsbVpqMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzkwYVdabUx6RXVNQzhpQ2lBZ0lDQWdJQ0FnSUNBZ0lIaHRiRzV6T21WNGFXWTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2WlhocFppOHhMakF2SWo0S0lDQWdJQ0FnSUNBZ1BIaHRjRHBEY21WaGRHOXlWRzl2YkQ1QlpHOWlaU0JRYUc5MGIzTm9iM0FnUTBNZ01qQXhOUzQxSUNoWGFXNWtiM2R6S1R3dmVHMXdPa055WldGMGIzSlViMjlzUGdvZ0lDQWdJQ0FnSUNBOGVHMXdPa055WldGMFpVUmhkR1UrTWpBeE5pMHhNQzB4T0ZReE56b3pNem93Tmkwd056b3dNRHd2ZUcxd09rTnlaV0YwWlVSaGRHVStDaUFnSUNBZ0lDQWdJRHg0YlhBNlRXOWthV1o1UkdGMFpUNHlNREUyTFRFd0xUSXdWREl4T2pFNE9qSTFMVEEzT2pBd1BDOTRiWEE2VFc5a2FXWjVSR0YwWlQ0S0lDQWdJQ0FnSUNBZ1BIaHRjRHBOWlhSaFpHRjBZVVJoZEdVK01qQXhOaTB4TUMweU1GUXlNVG94T0RveU5TMHdOem93TUR3dmVHMXdPazFsZEdGa1lYUmhSR0YwWlQ0S0lDQWdJQ0FnSUNBZ1BHUmpPbVp2Y20xaGRENXBiV0ZuWlM5d2JtYzhMMlJqT21admNtMWhkRDRLSUNBZ0lDQWdJQ0FnUEhCb2IzUnZjMmh2Y0RwRGIyeHZjazF2WkdVK016d3ZjR2h2ZEc5emFHOXdPa052Ykc5eVRXOWtaVDRLSUNBZ0lDQWdJQ0FnUEhodGNFMU5Pa2x1YzNSaGJtTmxTVVErZUcxd0xtbHBaRG96TURReVlqSTBaUzFpTXpjMkxXSTBOR0l0T0dJNFl5MWxaVEZqWTJJellXVTFNRFU4TDNodGNFMU5Pa2x1YzNSaGJtTmxTVVErQ2lBZ0lDQWdJQ0FnSUR4NGJYQk5UVHBFYjJOMWJXVnVkRWxFUG5odGNDNWthV1E2TXpBME1tSXlOR1V0WWpNM05pMWlORFJpTFRoaU9HTXRaV1V4WTJOaU0yRmxOVEExUEM5NGJYQk5UVHBFYjJOMWJXVnVkRWxFUGdvZ0lDQWdJQ0FnSUNBOGVHMXdUVTA2VDNKcFoybHVZV3hFYjJOMWJXVnVkRWxFUG5odGNDNWthV1E2TXpBME1tSXlOR1V0WWpNM05pMWlORFJpTFRoaU9HTXRaV1V4WTJOaU0yRmxOVEExUEM5NGJYQk5UVHBQY21sbmFXNWhiRVJ2WTNWdFpXNTBTVVErQ2lBZ0lDQWdJQ0FnSUR4NGJYQk5UVHBJYVhOMGIzSjVQZ29nSUNBZ0lDQWdJQ0FnSUNBOGNtUm1PbE5sY1Q0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhKa1pqcHNhU0J5WkdZNmNHRnljMlZVZVhCbFBTSlNaWE52ZFhKalpTSStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZEVWMmREcGhZM1JwYjI0K1kzSmxZWFJsWkR3dmMzUkZkblE2WVdOMGFXOXVQZ29nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDU0YlhBdWFXbGtPak13TkRKaU1qUmxMV0l6TnpZdFlqUTBZaTA0WWpoakxXVmxNV05qWWpOaFpUVXdOVHd2YzNSRmRuUTZhVzV6ZEdGdVkyVkpSRDRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbmRvWlc0K01qQXhOaTB4TUMweE9GUXhOem96TXpvd05pMHdOem93TUR3dmMzUkZkblE2ZDJobGJqNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4wUlhaME9uTnZablIzWVhKbFFXZGxiblErUVdSdlltVWdVR2h2ZEc5emFHOXdJRU5ESURJd01UVXVOU0FvVjJsdVpHOTNjeWs4TDNOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5RK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dmNtUm1PbXhwUGdvZ0lDQWdJQ0FnSUNBZ0lDQThMM0prWmpwVFpYRStDaUFnSUNBZ0lDQWdJRHd2ZUcxd1RVMDZTR2x6ZEc5eWVUNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNlQzSnBaVzUwWVhScGIyNCtNVHd2ZEdsbVpqcFBjbWxsYm5SaGRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZXRkpsYzI5c2RYUnBiMjQrTWpnNE1EQXdNQzh4TURBd01Ed3ZkR2xtWmpwWVVtVnpiMngxZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNldWSmxjMjlzZFhScGIyNCtNamc0TURBd01DOHhNREF3TUR3dmRHbG1aanBaVW1WemIyeDFkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2VW1WemIyeDFkR2x2YmxWdWFYUStNand2ZEdsbVpqcFNaWE52YkhWMGFXOXVWVzVwZEQ0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2UTI5c2IzSlRjR0ZqWlQ0Mk5UVXpOVHd2WlhocFpqcERiMnh2Y2xOd1lXTmxQZ29nSUNBZ0lDQWdJQ0E4WlhocFpqcFFhWGhsYkZoRWFXMWxibk5wYjI0K01USTRQQzlsZUdsbU9sQnBlR1ZzV0VScGJXVnVjMmx2Ymo0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2VUdsNFpXeFpSR2x0Wlc1emFXOXVQalkwUEM5bGVHbG1PbEJwZUdWc1dVUnBiV1Z1YzJsdmJqNEtJQ0FnSUNBZ1BDOXlaR1k2UkdWelkzSnBjSFJwYjI0K0NpQWdJRHd2Y21SbU9sSkVSajRLUEM5NE9uaHRjRzFsZEdFK0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2p3L2VIQmhZMnRsZENCbGJtUTlJbmNpUHo1VWlsejBBQUFBSUdOSVVrMEFBSG9sQUFDQWd3QUErZjhBQUlEcEFBQjFNQUFBNm1BQUFEcVlBQUFYYjVKZnhVWUFBQUpkU1VSQlZIamE3TjNMY2NKQUVJVGhSdVc3bmNVZVRRaGtRQWlJRE1nSWhVSUljRlFXSmdKODhGS2xvdndBck4yZDZaNDVjWkdBL1Q5dmlZZnR4ZVZ5UVl6dWRMRUVBU0FtQU1RRWdCakplV2wxeHltbE53QUhBTWR4SEh2RnhVOHBEUUNXQUZiak9IN0k3QUNUK084QU5ua2hGT052OGhvYzhwcndBN2lKZngwcEJKUDQxMm1Hb0RNUVh3ckJOL0diSXVpTXhKZEE4RXY4WmdnNlEvR3BFZHdSdndtQ3psaDhTZ1FQeEsrT29NWU9NRHdZbndyQkUvR25DQWJYQVBLVFgvL2pGSnVVVXU4NGZ2OWsvT3VzUy84UWRBYmwzODdlSTRMOG1QY3puS3JvVGxoeUIxak9lQzVYQ0dhTVgySXRxd0ZZQVRpcElTZ1EvNVRYMGhlQS9ONjJGSUpTOFV0K1RsRDBJbEFKZ2NmNFZWNEdLaUR3R3IvVyt3RFVDRHpIcndhQUZZSDMrRlVCc0NGZ2lGOGRBQXNDbHZoTkFIaEh3QlMvR1FDdkNOamlOd1hnRFFGai9PWUF2Q0Jnalc4Q2dIVUV6UEhOQUxDS2dEMitLUURXRUNqRU53ZkFDZ0tWK0NZQlRCRDBBTTYxRVJTSWZ3YlFXNHh2RmtCR2NNdzdRVFVFaGVLdjhuTkJBRENNUURHK2VRQzFFS2pHQjRDRmw3OFJsRkphNHVzWFRGN25qSlJ2ejM1ZUQvRmRBU2lJQUtyeDNRRW9oQUNxOFYxY0ExUzZKcENNN3hLQVFRUnU0N3NGWUFpQjYvaXVBUmhBNEQ2K2V3QU5FVkRFcHdEUUFBRk5mQm9BRlJGUXhhY0NVQUVCWFh3NkFBVVJVTWFuQkZBQUFXMThXZ0F6SXFDT1R3MWdCZ1QwOGVrQlRCRHNuamgweHg1ZkFrQkdNQURZUG5ESU5oK0RBS0NIUUNhK0ZJQTdFVWpGbHdQd0J3SzUrSklBZmtBZ0dSOXcrSld3T2VmNnpXRFYrUElBWXVMZnhnV0FXSUlBRUJNQVlnSkFqT1I4RGdEKzZPemd2NHV5OWdBQUFBQkpSVTVFcmtKZ2dnPT0nO1xyXG5cclxuICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcclxuICB0ZXh0dXJlLmltYWdlID0gaW1hZ2U7XHJcbiAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJNaXBNYXBMaW5lYXJGaWx0ZXI7XHJcbiAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXI7XHJcbiAgLy8gdGV4dHVyZS5hbmlzb3Ryb3BpY1xyXG4gIC8vIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcclxuICAgIC8vIGNvbG9yOiAweGZmMDAwMCxcclxuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIG1hcDogdGV4dHVyZVxyXG4gIH0pO1xyXG4gIG1hdGVyaWFsLmFscGhhVGVzdCA9IDAuMjtcclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zdCBoID0gMC4zO1xyXG4gICAgY29uc3QgZ2VvID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoIGltYWdlLndpZHRoIC8gMTAwMCAqIGgsIGltYWdlLmhlaWdodCAvIDEwMDAgKiBoLCAxLCAxICk7XHJcbiAgICBnZW8udHJhbnNsYXRlKCAtMC4wMDUsIC0wLjAwNCwgMCApO1xyXG4gICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKCBnZW8sIG1hdGVyaWFsICk7XHJcbiAgfVxyXG59KCkpO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBjaGVja21hcmsgPSAoZnVuY3Rpb24oKXtcclxuICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gIGltYWdlLnNyYyA9ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUlBQUFBQkFDQVlBQUFEUzFuOS9BQUFBQ1hCSVdYTUFBQ3hMQUFBc1N3R2xQWmFwQUFBNEsybFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0S1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MkxXTXhNeklnTnprdU1UVTVNamcwTENBeU1ERTJMekEwTHpFNUxURXpPakV6T2pRd0lDQWdJQ0FnSUNBaVBnb2dJQ0E4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGdvZ0lDQWdJQ0E4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWdvZ0lDQWdJQ0FnSUNBZ0lDQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpQ2lBZ0lDQWdJQ0FnSUNBZ0lIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJS0lDQWdJQ0FnSUNBZ0lDQWdlRzFzYm5NNmNHaHZkRzl6YUc5d1BTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM0JvYjNSdmMyaHZjQzh4TGpBdklnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cDRiWEJOVFQwaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wyMXRMeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJS0lDQWdJQ0FnSUNBZ0lDQWdlRzFzYm5NNmRHbG1aajBpYUhSMGNEb3ZMMjV6TG1Ga2IySmxMbU52YlM5MGFXWm1MekV1TUM4aUNpQWdJQ0FnSUNBZ0lDQWdJSGh0Ykc1ek9tVjRhV1k5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdlpYaHBaaTh4TGpBdklqNEtJQ0FnSUNBZ0lDQWdQSGh0Y0RwRGNtVmhkRzl5Vkc5dmJENUJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdNakF4TlM0MUlDaFhhVzVrYjNkektUd3ZlRzF3T2tOeVpXRjBiM0pVYjI5c1Bnb2dJQ0FnSUNBZ0lDQThlRzF3T2tOeVpXRjBaVVJoZEdVK01qQXhOaTB4TUMweE9GUXhOem96TXpvd05pMHdOem93TUR3dmVHMXdPa055WldGMFpVUmhkR1UrQ2lBZ0lDQWdJQ0FnSUR4NGJYQTZUVzlrYVdaNVJHRjBaVDR5TURFMkxURXdMVEl3VkRJeE9qTXpPalV6TFRBM09qQXdQQzk0YlhBNlRXOWthV1o1UkdGMFpUNEtJQ0FnSUNBZ0lDQWdQSGh0Y0RwTlpYUmhaR0YwWVVSaGRHVStNakF4TmkweE1DMHlNRlF5TVRvek16bzFNeTB3Tnpvd01Ed3ZlRzF3T2sxbGRHRmtZWFJoUkdGMFpUNEtJQ0FnSUNBZ0lDQWdQR1JqT21admNtMWhkRDVwYldGblpTOXdibWM4TDJSak9tWnZjbTFoZEQ0S0lDQWdJQ0FnSUNBZ1BIQm9iM1J2YzJodmNEcERiMnh2Y2sxdlpHVStNend2Y0dodmRHOXphRzl3T2tOdmJHOXlUVzlrWlQ0S0lDQWdJQ0FnSUNBZ1BIaHRjRTFOT2tsdWMzUmhibU5sU1VRK2VHMXdMbWxwWkRvMk9EY3hZVGs1WXkwek5qRTVMVGxrTkdFdE9EZGtOaTB3WVdFNVlUUmlOV1U0TWpjOEwzaHRjRTFOT2tsdWMzUmhibU5sU1VRK0NpQWdJQ0FnSUNBZ0lEeDRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBuaHRjQzVrYVdRNk5qZzNNV0U1T1dNdE16WXhPUzA1WkRSaExUZzNaRFl0TUdGaE9XRTBZalZsT0RJM1BDOTRiWEJOVFRwRWIyTjFiV1Z1ZEVsRVBnb2dJQ0FnSUNBZ0lDQThlRzF3VFUwNlQzSnBaMmx1WVd4RWIyTjFiV1Z1ZEVsRVBuaHRjQzVrYVdRNk5qZzNNV0U1T1dNdE16WXhPUzA1WkRSaExUZzNaRFl0TUdGaE9XRTBZalZsT0RJM1BDOTRiWEJOVFRwUGNtbG5hVzVoYkVSdlkzVnRaVzUwU1VRK0NpQWdJQ0FnSUNBZ0lEeDRiWEJOVFRwSWFYTjBiM0o1UGdvZ0lDQWdJQ0FnSUNBZ0lDQThjbVJtT2xObGNUNEtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BISmtaanBzYVNCeVpHWTZjR0Z5YzJWVWVYQmxQU0pTWlhOdmRYSmpaU0krQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRFVjJkRHBoWTNScGIyNCtZM0psWVhSbFpEd3ZjM1JGZG5RNllXTjBhVzl1UGdvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzUkZkblE2YVc1emRHRnVZMlZKUkQ1NGJYQXVhV2xrT2pZNE56RmhPVGxqTFRNMk1Ua3RPV1EwWVMwNE4yUTJMVEJoWVRsaE5HSTFaVGd5Tnp3dmMzUkZkblE2YVc1emRHRnVZMlZKUkQ0S0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjBSWFowT25kb1pXNCtNakF4TmkweE1DMHhPRlF4Tnpvek16b3dOaTB3Tnpvd01Ed3ZjM1JGZG5RNmQyaGxiajRLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMFJYWjBPbk52Wm5SM1lYSmxRV2RsYm5RK1FXUnZZbVVnVUdodmRHOXphRzl3SUVORElESXdNVFV1TlNBb1YybHVaRzkzY3lrOEwzTjBSWFowT25OdlpuUjNZWEpsUVdkbGJuUStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZjbVJtT214cFBnb2dJQ0FnSUNBZ0lDQWdJQ0E4TDNKa1pqcFRaWEUrQ2lBZ0lDQWdJQ0FnSUR3dmVHMXdUVTA2U0dsemRHOXllVDRLSUNBZ0lDQWdJQ0FnUEhScFptWTZUM0pwWlc1MFlYUnBiMjQrTVR3dmRHbG1aanBQY21sbGJuUmhkR2x2Ymo0S0lDQWdJQ0FnSUNBZ1BIUnBabVk2V0ZKbGMyOXNkWFJwYjI0K01qZzRNREF3TUM4eE1EQXdNRHd2ZEdsbVpqcFlVbVZ6YjJ4MWRHbHZiajRLSUNBZ0lDQWdJQ0FnUEhScFptWTZXVkpsYzI5c2RYUnBiMjQrTWpnNE1EQXdNQzh4TURBd01Ed3ZkR2xtWmpwWlVtVnpiMngxZEdsdmJqNEtJQ0FnSUNBZ0lDQWdQSFJwWm1ZNlVtVnpiMngxZEdsdmJsVnVhWFErTWp3dmRHbG1aanBTWlhOdmJIVjBhVzl1Vlc1cGRENEtJQ0FnSUNBZ0lDQWdQR1Y0YVdZNlEyOXNiM0pUY0dGalpUNDJOVFV6TlR3dlpYaHBaanBEYjJ4dmNsTndZV05sUGdvZ0lDQWdJQ0FnSUNBOFpYaHBaanBRYVhobGJGaEVhVzFsYm5OcGIyNCtNVEk0UEM5bGVHbG1PbEJwZUdWc1dFUnBiV1Z1YzJsdmJqNEtJQ0FnSUNBZ0lDQWdQR1Y0YVdZNlVHbDRaV3haUkdsdFpXNXphVzl1UGpZMFBDOWxlR2xtT2xCcGVHVnNXVVJwYldWdWMybHZiajRLSUNBZ0lDQWdQQzl5WkdZNlJHVnpZM0pwY0hScGIyNCtDaUFnSUR3dmNtUm1PbEpFUmo0S1BDOTRPbmh0Y0cxbGRHRStDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0NpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQUtJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQW9nSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnQ2lBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBS0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lBb2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdDaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FLSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUFvZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0Nqdy9lSEJoWTJ0bGRDQmxibVE5SW5jaVB6NXo5UlQzQUFBQUlHTklVazBBQUhvbEFBQ0Fnd0FBK2Y4QUFJRHBBQUIxTUFBQTZtQUFBRHFZQUFBWGI1SmZ4VVlBQUFUdFNVUkJWSGphN0p6YmI1UkZHTVovMnhiQ3ZWaEFTRXhVaUkxNDR3MGhRdEhFR3JIZ0lTcWdONktndE5ZV0FiMHcwV28xWHFyYlBiU2xva1lTeGZNaGVtWC9BYTd3R0FWcThYVHAzMERYaTVtSm0wYTJ1OXYzL2I2WjJYbHVkck9IZHcvUE16UFArNzR6WDZGV3F5R0ZnWUVCRWxwR0QvQWVjQ3R3Qi9EYmNtK1ltNXNUKy9DdTlQL25pbTZnQ0R3Q1hBdDhEVnlYNVJkSUFzZ1BCYUFFak5ROWRpUHdGYkE1Q1NCK1RBRlAvYy9qVzRIUGdMNGtnSGd4Q3d3MWVQNW00R043bXdRUUVib3MrVTgwOGRxdHdFZjJOZ2tnRXJjLzB5VDVEbjEyT2RpU0JCQSsrYVVXeVhmWUFud0RYSjhFRUc2cU53a01yeURHWnBzaTNwQUVFQjZxVjNEN3JhSVArTkttaWtrQWdlQXQ0SWhndkp2c1RKQUU0RGtLd0NuZ3NFTHNzMGtBL3EvNXM4QWhoZGpUd0VGcGQ1b2dTMzVWYWVUUEFrOERpMGtBL3BKZkVsN3pIVTdTdUhLWWxnQVAxdnl5a050Zmloa3Q4cE1BWkVrYVZvaGJWWXFiQkNDSVU4Q1RDbkZMd0pqMmwwOENXTm1hLzdhUzI2OEN4NlFOWHhLQXJIbWVCaDVYV2s3R3NpQS9Ud0dNWWZhL2hVcCttZllhTzgyNC9lR3N5TTlMQUM5Z21pUHZBenNESTcvTHJzMURTaU4vS0k4ZmxDWEdnVmZ0L1Y3Z0RMQXJJQUZNaCtyMmZSREFTOERFa3NjMkFoOEMvUjNzOXN2QWFKNVRXbGJrdjN5RjU5WmpkcjFzOTNqYTEzTDdGZXYyYXpFTFlMd0IrUTVyTWIzdWJSNGF2cE5LYm44YWVBYTRuTGU2dFEzZlJKT3Y3UVcrOEdnbTZMRWpWS094TTRNNUQzQTU3eCtwS1lBWDZ3eGZzOWdBZkFMczhJQjhyY2FPS3h2WGZGQzVsZ0RHZ1ZmYWZLOHpocnR5L0UrMFhIa2xMN2VmcFFBbVdwajJseFBCYlRuOEo3UG8xZlpIOFF6U0Fuak5qbjRKck1lY2pzbXFXRlFBM2xWeSt5WHI5b2xkQUhjS3g3c2ErRHdEWTloajgveURpcW5lWWljSTRGSGdSK0dZYTVXekE4M0d6aFJ3MUZmeU5RVHdDM0NQdlpYRU91QlR6RVVVSkxFcWcxVFBXL0sxVE9DZndDQndVVGp1TmNpV2pic3haVmlOVkMrMzJyNHZhZUFmd0YzQWduRGNUVllFdHd1TlVBM3l5NWpkdTNTeUFBQitCM1lyTEFjYkJPb0U3eWhOKzVOMnpTY0p3R0FlZUFENFRqaHVMNmFCMUtvbjZMYmtQNlkwOG8valNZWFBGd0VBbkFjZVZoREJWUzFtQjY2eG8wSCtGS2F4czBoZ3lLb2RmQUY0RVBoSnFVNnczRXl3eWhxelEwcmtqNFJJZnBZQ0FMZ0U3TEV6Z2lSY3hiQy93Y2l2b0ZQZWRlUUhpNnkzaFAxbGplRzhVb3E0TkRzb1lJbzhXanQ1Z2lZL0R3SFVwNGkvS21RSForcEVVTURzNU5GdyswVXlPTFFScXdEY2NuQXY4TDF3M0hYQWFac2l2cTVrK0lyQUNTSkJucWVENTRFRHdBZkFMWUp4TndIZktwbXlzaVYvTVJZQjVIMHk2QUt3SC9oQk9PNXFZSTJDNFRzYUUvaytDQURNMWJIM0lsOHhsRVRWR3I0YWtjR1hzNEYvQTNmYkdjRTNWQWlvdGgrcUFNQjBFWGQ3Sm9KSlBOekdGYXNBd0RTUUJwSGZWTkt1Mno5RzVQRHhlUGdDOEJCd0x1ZVJmeUxHTlQ4RUFZRFpUSElBK1FaU3Mydis4ZGpjZm1nQ2NIV0MrNUZ2SUMzbjlrYzdoWHpmQmVDTTRSN2t5OFlkNS9aREZRRDgxMEM2cVBnWjBidjlrQVZRbnlKcUZJdmV4R3ptSUFuQWIxd0M3aE0yaGtYZ1dUb1lvVjBsekRXUUpGTEU2Qm83blNBQWx5THVZMlVOcEFvWlhvb3RDVUFlQzVnRzBzOXRrajlLUXRBQ0FOTkFHcVMxUFlhbFJINDhBbkFwWXJQYnk0b0VkbWdqQ2FENUZIRXZqYmVYdllFcDd5WkVLQURuQ2ZaYkVmd0RQSTg1TCtESWY0NE9hT3kwZzM4SEFNL2U3Z3VJUng5NEFBQUFBRWxGVGtTdVFtQ0MnO1xyXG5cclxuICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcclxuICB0ZXh0dXJlLmltYWdlID0gaW1hZ2U7XHJcbiAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJNaXBNYXBMaW5lYXJGaWx0ZXI7XHJcbiAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXI7XHJcbiAgLy8gdGV4dHVyZS5hbmlzb3Ryb3BpY1xyXG4gIC8vIHRleHR1cmUuZ2VuZXJhdGVNaXBtYXBzID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcclxuICAgIC8vIGNvbG9yOiAweGZmMDAwMCxcclxuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIG1hcDogdGV4dHVyZVxyXG4gIH0pO1xyXG4gIG1hdGVyaWFsLmFscGhhVGVzdCA9IDAuMjtcclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICBjb25zdCBoID0gMC40O1xyXG4gICAgY29uc3QgZ2VvID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoIGltYWdlLndpZHRoIC8gMTAwMCAqIGgsIGltYWdlLmhlaWdodCAvIDEwMDAgKiBoLCAxLCAxICk7XHJcbiAgICBnZW8udHJhbnNsYXRlKCAwLjAyNSwgMCwgMCApO1xyXG4gICAgcmV0dXJuIG5ldyBUSFJFRS5NZXNoKCBnZW8sIG1hdGVyaWFsICk7XHJcbiAgfVxyXG59KCkpOyIsIi8qKiBcclxuICogQmlnIGJ1dHRvbiB3aXRoIGFuIGltYWdlIG9uICh3aGljaCBtaWdodCBjb21lIGZyb20gYSBmaWxlIG9yIGV4aXN0aW5nIHRleHR1cmUsXHJcbiAqIHRoZSB0ZXh0dXJlIG1pZ2h0IGJlIGZyb20gYSBSZW5kZXJUYXJnZXQuLi4pLlxyXG4gKiBcclxuICogSSdkIHB1dCB0aGlzIG1vcmUgc2VwYXJhdGUgZnJvbSB0aGUgZGF0Z3VpIG1vZHVsZXMgYnV0IG5lZWQgdG8gdGhpbmsgYSBsaXR0bGVcclxuICogYml0IGFib3V0IGhvdyB0byBzdHJ1Y3R1cmUgdGhhdCBldGMuICBWZXJ5IHVuLURSWSwgYnV0IEknbSBzdGFydGluZyBieSBqdXN0XHJcbiAqIGNvcHlpbmcgZXhpc3RpbmcgYnV0dG9uLmpzIGluIGl0cyBlbnRpcmV0eS5cclxuICogXHJcbiAqIFRPRE86IG5vdCBqdXN0IHNpbXBsZSAnYmFuZycgZnVuY3Rpb24gYnV0IGNhbGxiYWNrcyBmb3IgaG92ZXIgLyBldGMuXHJcbiAqIFxyXG4gKiBcclxuICogQ29weXJpZ2h0ICBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIGluYy4gMjAxNiAvIFBldGVyIFRvZGQsIDIwMTdcclxuICogXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgKiBhcyBTdWJkaXZpc2lvbk1vZGlmaWVyIGZyb20gJy4uL3RoaXJkcGFydHkvU3ViZGl2aXNpb25Nb2RpZmllcic7XHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVJbWFnZUJ1dHRvbigge1xyXG4gIHRleHRDcmVhdG9yLFxyXG4gIG9iamVjdCxcclxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcclxuICBpbWFnZSA9IFwidGV4dHVyZXMvc3BvdGxpZ2h0LmpwZ1wiLCAvL1RPRE8gYmV0dGVyIGRlZmF1bHRcclxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcclxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfV0lEVEggLyA0LFxyXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXHJcbn0gPSB7fSApe1xyXG5cclxuICBmdW5jdGlvbiBhcHBseUltYWdlVG9NYXRlcmlhbChpbWFnZSwgdGFyZ2V0TWF0ZXJpYWwpIHtcclxuICAgICAgaWYgKHR5cGVvZiBpbWFnZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIC8vVE9ETyBjYWNoZS4gIERvZXMgVGV4dHVyZUxvYWRlciBhbHJlYWR5IGNhY2hlP1xyXG4gICAgICAgIC8vVE9ETyBJbWFnZSBvbmx5IG9uIGZyb250IGZhY2Ugb2YgYnV0dG9uLlxyXG4gICAgICAgIG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCkubG9hZChpbWFnZSwgKHRleHR1cmUpID0+IHtcclxuICAgICAgICAgICAgdGV4dHVyZS53cmFwUyA9IHRleHR1cmUud3JhcFQgPSBUSFJFRS5DbGFtcFRvRWRnZVdyYXBwaW5nO1xyXG4gICAgICAgICAgICB0YXJnZXRNYXRlcmlhbC5tYXAgPSB0ZXh0dXJlO1xyXG4gICAgICAgICAgICB0YXJnZXRNYXRlcmlhbC5uZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaW1hZ2UuaXNUZXh0dXJlKSB7XHJcbiAgICAgICAgICB0YXJnZXRNYXRlcmlhbC5tYXAgPSBpbWFnZTtcclxuICAgICAgfSBlbHNlIGlmIChpbWFnZS5pc1dlYkdMUmVuZGVyVGFyZ2V0KSB7XHJcbiAgICAgICAgICB0YXJnZXRNYXRlcmlhbC5tYXAgPSBpbWFnZS50ZXh0dXJlO1xyXG4gICAgICB9IGVsc2UgdGhyb3cgXCJub3Qgc3VyZSBob3cgdG8gaW50ZXJwcmV0IGltYWdlIFwiICsgaW1hZ2U7XHJcbiAgICAgIHRhcmdldE1hdGVyaWFsLm5lZWRzVXBkYXRlID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGNvbnN0IEJVVFRPTl9XSURUSCA9IHdpZHRoICogMC4yNSAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgQlVUVE9OX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgQlVUVE9OX0RFUFRIID0gTGF5b3V0LkJVVFRPTl9ERVBUSCAqIDI7XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgZ3JvdXAuc3BhY2luZyA9IGhlaWdodDtcclxuXHJcbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XHJcbiAgZ3JvdXAuYWRkKCBwYW5lbCApO1xyXG5cclxuICAvLyAgYmFzZSBjaGVja2JveFxyXG4gIGNvbnN0IGFzcGVjdFJhdGlvID0gQlVUVE9OX1dJRFRIIC8gQlVUVE9OX0hFSUdIVDtcclxuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoIEJVVFRPTl9XSURUSCwgQlVUVE9OX0hFSUdIVCwgMSwgMSApO1xyXG4gIGNvbnN0IG1vZGlmaWVyID0gbmV3IFRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIoIDEgKTtcclxuICAvL21vZGlmaWVyLm1vZGlmeSggcmVjdCApO1xyXG4gIHJlY3QudHJhbnNsYXRlKCBCVVRUT05fV0lEVEggKiAwLjUsIDAsIEJVVFRPTl9ERVBUSCApO1xyXG5cclxuICAvLyAgaGl0c2NhbiB2b2x1bWVcclxuICBjb25zdCBoaXRzY2FuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcclxuICBoaXRzY2FuTWF0ZXJpYWwudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICBjb25zdCBoaXRzY2FuVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgaGl0c2Nhbk1hdGVyaWFsICk7XHJcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gQlVUVE9OX0RFUFRIO1xyXG4gIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueCA9IHdpZHRoICogMC41O1xyXG5cclxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG4gIG1hdGVyaWFsLnRyYW5zcGFyZW50ID0gdHJ1ZTtcclxuICBhcHBseUltYWdlVG9NYXRlcmlhbChpbWFnZSwgbWF0ZXJpYWwpO1xyXG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xyXG5cclxuICAvL2J1dHRvbiBsYWJlbCByZW1vdmVkOyBtaWdodCB3YW50IG9wdGlvbnMgbGlrZSBhIGhvdmVyIGxhYmVsIGluIGZ1dHVyZS5cclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcblxyXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfQlVUVE9OICk7XHJcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIGNvbnRyb2xsZXJJRCApO1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlT25QcmVzcyApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUmVsZWFzZWQnLCBoYW5kbGVPblJlbGVhc2UgKTtcclxuXHJcbiAgdXBkYXRlVmlldygpO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblByZXNzKCBwICl7XHJcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0oKTtcclxuXHJcbiAgICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAwLjE7XHJcblxyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25SZWxlYXNlKCl7XHJcbiAgICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAwLjU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcblxyXG4gICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCAweEZGRkZGRiApO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCAweENDQ0NDQyApO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGdyb3VwLmludGVyYWN0aW9uID0gaW50ZXJhY3Rpb247XHJcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgaGl0c2NhblZvbHVtZSwgcGFuZWwgXTtcclxuXHJcbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcclxuXHJcbiAgZ3JvdXAudXBkYXRlQ29udHJvbCA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuICBncm91cC5uYW1lID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZUxhYmVsKCBzdHIgKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XHJcbmltcG9ydCBjcmVhdGVTbGlkZXIgZnJvbSAnLi9zbGlkZXInO1xyXG5pbXBvcnQgY3JlYXRlQ2hlY2tib3ggZnJvbSAnLi9jaGVja2JveCc7XHJcbmltcG9ydCBjcmVhdGVCdXR0b24gZnJvbSAnLi9idXR0b24nO1xyXG5pbXBvcnQgY3JlYXRlRm9sZGVyIGZyb20gJy4vZm9sZGVyJztcclxuaW1wb3J0IGNyZWF0ZURyb3Bkb3duIGZyb20gJy4vZHJvcGRvd24nO1xyXG4vL1BKVDogSSdkIHJhdGhlciBpbmplY3QgY3VzdG9tIGV4dGVuc2lvbnMgbGlrZSB0aGlzLCBidXQgd2lsbCB3b3JrIHRoYXQgb3V0IGxhdGVyLlxyXG5pbXBvcnQgY3JlYXRlSW1hZ2VCdXR0b24gZnJvbSAnLi9pbWFnZWJ1dHRvbic7XHJcbmltcG9ydCAqIGFzIFNERlRleHQgZnJvbSAnLi9zZGZ0ZXh0JztcclxuXHJcbmNvbnN0IEdVSVZSID0gKGZ1bmN0aW9uIERBVEdVSVZSKCl7XHJcblxyXG4gIC8qXHJcbiAgICBTREYgZm9udFxyXG4gICovXHJcbiAgY29uc3QgdGV4dENyZWF0b3IgPSBTREZUZXh0LmNyZWF0b3IoKTtcclxuXHJcblxyXG4gIC8qXHJcbiAgICBMaXN0cy5cclxuICAgIElucHV0T2JqZWN0cyBhcmUgdGhpbmdzIGxpa2UgVklWRSBjb250cm9sbGVycywgY2FyZGJvYXJkIGhlYWRzZXRzLCBldGMuXHJcbiAgICBDb250cm9sbGVycyBhcmUgdGhlIERBVCBHVUkgc2xpZGVycywgY2hlY2tib3hlcywgZXRjLlxyXG4gICovXHJcbiAgY29uc3QgaW5wdXRPYmplY3RzID0gW107XHJcbiAgY29uc3QgY29udHJvbGxlcnMgPSBbXTtcclxuXHJcbiAgLypcclxuICAgIEZ1bmN0aW9ucyBmb3IgZGV0ZXJtaW5pbmcgd2hldGhlciBhIGdpdmVuIGNvbnRyb2xsZXIgaXMgdmlzaWJsZSAoYnkgd2hpY2ggd2VcclxuICAgIG1lYW4gbm90IGhpZGRlbiwgbm90ICd2aXNpYmxlJyBpbiB0ZXJtcyBvZiB0aGUgY2FtZXJhIG9yaWVudGF0aW9uIGV0YyksIGFuZFxyXG4gICAgZm9yIHJldHJpZXZpbmcgdGhlIGxpc3Qgb2YgdmlzaWJsZSBoaXRzY2FuT2JqZWN0cyBkeW5hbWljYWxseS5cclxuICAgIFRoaXMgbWlnaHQgYmVuZWZpdCBmcm9tIHNvbWUgY2FjaGluZyBlc3BlY2lhbGx5IGluIGNhc2VzIHdpdGggbGFyZ2UgY29tcGxleCBHVUlzLlxyXG4gICAgSSBoYXZlbid0IG1lYXN1cmVkIHRoZSBpbXBhY3Qgb2YgZ2FyYmFnZSBjb2xsZWN0aW9uIGV0Yy5cclxuICAqL1xyXG4gIGZ1bmN0aW9uIGlzQ29udHJvbGxlclZpc2libGUoY29udHJvbCkge1xyXG4gICAgaWYgKCFjb250cm9sLnZpc2libGUpIHJldHVybiBmYWxzZTtcclxuICAgIHZhciBmb2xkZXIgPSBjb250cm9sLmZvbGRlcjtcclxuICAgIHdoaWxlIChmb2xkZXIuZm9sZGVyICE9PSBmb2xkZXIpe1xyXG4gICAgICBmb2xkZXIgPSBmb2xkZXIuZm9sZGVyO1xyXG4gICAgICBpZiAoZm9sZGVyLmlzQ29sbGFwc2VkKCkgfHwgIWZvbGRlci52aXNpYmxlKSByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgZnVuY3Rpb24gZ2V0VmlzaWJsZUNvbnRyb2xsZXJzKCkge1xyXG4gICAgLy8gbm90IHRlcnJpYmx5IGVmZmljaWVudFxyXG4gICAgcmV0dXJuIGNvbnRyb2xsZXJzLmZpbHRlciggaXNDb250cm9sbGVyVmlzaWJsZSApO1xyXG4gIH1cclxuICBmdW5jdGlvbiBnZXRWaXNpYmxlSGl0c2Nhbk9iamVjdHMoKSB7XHJcbiAgICBjb25zdCB0bXAgPSBnZXRWaXNpYmxlQ29udHJvbGxlcnMoKS5tYXAoIG8gPT4geyByZXR1cm4gby5oaXRzY2FuOyB9IClcclxuICAgIHJldHVybiB0bXAucmVkdWNlKChhLCBiKSA9PiB7IHJldHVybiBhLmNvbmNhdChiKX0sIFtdKTtcclxuICB9XHJcblxyXG4gIGxldCBtb3VzZUVuYWJsZWQgPSBmYWxzZTtcclxuICBsZXQgbW91c2VSZW5kZXJlciA9IHVuZGVmaW5lZDtcclxuXHJcbiAgZnVuY3Rpb24gZW5hYmxlTW91c2UoIGNhbWVyYSwgcmVuZGVyZXIgKXtcclxuICAgIG1vdXNlRW5hYmxlZCA9IHRydWU7XHJcbiAgICBtb3VzZVJlbmRlcmVyID0gcmVuZGVyZXI7XHJcbiAgICBtb3VzZUlucHV0Lm1vdXNlQ2FtZXJhID0gY2FtZXJhO1xyXG4gICAgcmV0dXJuIG1vdXNlSW5wdXQubGFzZXI7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkaXNhYmxlTW91c2UoKXtcclxuICAgIG1vdXNlRW5hYmxlZCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcblxyXG4gIC8qXHJcbiAgICBUaGUgZGVmYXVsdCBsYXNlciBwb2ludGVyIGNvbWluZyBvdXQgb2YgZWFjaCBJbnB1dE9iamVjdC5cclxuICAqL1xyXG4gIGNvbnN0IGxhc2VyTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe2NvbG9yOjB4NTVhYWZmLCB0cmFuc3BhcmVudDogdHJ1ZSwgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcgfSk7XHJcbiAgZnVuY3Rpb24gY3JlYXRlTGFzZXIoKXtcclxuICAgIGNvbnN0IGcgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcclxuICAgIGcudmVydGljZXMucHVzaCggbmV3IFRIUkVFLlZlY3RvcjMoKSApO1xyXG4gICAgZy52ZXJ0aWNlcy5wdXNoKCBuZXcgVEhSRUUuVmVjdG9yMygwLDAsMCkgKTtcclxuICAgIHJldHVybiBuZXcgVEhSRUUuTGluZSggZywgbGFzZXJNYXRlcmlhbCApO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBBIFwiY3Vyc29yXCIsIGVnIHRoZSBiYWxsIHRoYXQgYXBwZWFycyBhdCB0aGUgZW5kIG9mIHlvdXIgbGFzZXIuXHJcbiAgKi9cclxuICBjb25zdCBjdXJzb3JNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7Y29sb3I6MHg0NDQ0NDQsIHRyYW5zcGFyZW50OiB0cnVlLCBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyB9ICk7XHJcbiAgZnVuY3Rpb24gY3JlYXRlQ3Vyc29yKCl7XHJcbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goIG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgwLjAwNiwgNCwgNCApLCBjdXJzb3JNYXRlcmlhbCApO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIENyZWF0ZXMgYSBnZW5lcmljIElucHV0IHR5cGUuXHJcbiAgICBUYWtlcyBhbnkgVEhSRUUuT2JqZWN0M0QgdHlwZSBvYmplY3QgYW5kIHVzZXMgaXRzIHBvc2l0aW9uXHJcbiAgICBhbmQgb3JpZW50YXRpb24gYXMgYW4gaW5wdXQgZGV2aWNlLlxyXG5cclxuICAgIEEgbGFzZXIgcG9pbnRlciBpcyBpbmNsdWRlZCBhbmQgd2lsbCBiZSB1cGRhdGVkLlxyXG4gICAgQ29udGFpbnMgc3RhdGUgYWJvdXQgd2hpY2ggSW50ZXJhY3Rpb24gaXMgY3VycmVudGx5IGJlaW5nIHVzZWQgb3IgaG92ZXIuXHJcbiAgKi9cclxuICBmdW5jdGlvbiBjcmVhdGVJbnB1dCggaW5wdXRPYmplY3QgPSBuZXcgVEhSRUUuR3JvdXAoKSApe1xyXG4gICAgY29uc3QgaW5wdXQgPSB7XHJcbiAgICAgIHJheWNhc3Q6IG5ldyBUSFJFRS5SYXljYXN0ZXIoIG5ldyBUSFJFRS5WZWN0b3IzKCksIG5ldyBUSFJFRS5WZWN0b3IzKCkgKSxcclxuICAgICAgbGFzZXI6IGNyZWF0ZUxhc2VyKCksXHJcbiAgICAgIGN1cnNvcjogY3JlYXRlQ3Vyc29yKCksXHJcbiAgICAgIG9iamVjdDogaW5wdXRPYmplY3QsXHJcbiAgICAgIHByZXNzZWQ6IGZhbHNlLFxyXG4gICAgICBncmlwcGVkOiBmYWxzZSxcclxuICAgICAgZXZlbnRzOiBuZXcgRW1pdHRlcigpLFxyXG4gICAgICBpbnRlcmFjdGlvbjoge1xyXG4gICAgICAgIGdyaXA6IHVuZGVmaW5lZCxcclxuICAgICAgICBwcmVzczogdW5kZWZpbmVkLFxyXG4gICAgICAgIGhvdmVyOiB1bmRlZmluZWRcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBpbnB1dC5sYXNlci5hZGQoIGlucHV0LmN1cnNvciApO1xyXG5cclxuICAgIHJldHVybiBpbnB1dDtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgTW91c2VJbnB1dC5cclxuICAgIEFsbG93cyB5b3UgdG8gY2xpY2sgb24gdGhlIHNjcmVlbiB3aGVuIG5vdCBpbiBWUiBmb3IgZGVidWdnaW5nLlxyXG4gICovXHJcbiAgY29uc3QgbW91c2VJbnB1dCA9IGNyZWF0ZU1vdXNlSW5wdXQoKTtcclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlTW91c2VJbnB1dCgpe1xyXG4gICAgY29uc3QgbW91c2UgPSBuZXcgVEhSRUUuVmVjdG9yMigtMSwtMSk7XHJcblxyXG4gICAgY29uc3QgaW5wdXQgPSBjcmVhdGVJbnB1dCgpO1xyXG4gICAgaW5wdXQubW91c2UgPSBtb3VzZTtcclxuICAgIGlucHV0Lm1vdXNlSW50ZXJzZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgIGlucHV0Lm1vdXNlT2Zmc2V0ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgIGlucHV0Lm1vdXNlUGxhbmUgPSBuZXcgVEhSRUUuUGxhbmUoKTtcclxuICAgIGlucHV0LmludGVyc2VjdGlvbnMgPSBbXTtcclxuXHJcbiAgICAvLyAgc2V0IG15IGVuYWJsZU1vdXNlXHJcbiAgICBpbnB1dC5tb3VzZUNhbWVyYSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIGZ1bmN0aW9uKCBldmVudCApe1xyXG4gICAgICAvLyBpZiBhIHNwZWNpZmljIHJlbmRlcmVyIGhhcyBiZWVuIGRlZmluZWRcclxuICAgICAgaWYgKG1vdXNlUmVuZGVyZXIpIHtcclxuICAgICAgICBjb25zdCBjbGllbnRSZWN0ID0gbW91c2VSZW5kZXJlci5kb21FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIG1vdXNlLnggPSAoIChldmVudC5jbGllbnRYIC0gY2xpZW50UmVjdC5sZWZ0KSAvIGNsaWVudFJlY3Qud2lkdGgpICogMiAtIDE7XHJcbiAgICAgICAgbW91c2UueSA9IC0gKCAoZXZlbnQuY2xpZW50WSAtIGNsaWVudFJlY3QudG9wKSAvIGNsaWVudFJlY3QuaGVpZ2h0KSAqIDIgKyAxO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIGRlZmF1bHQgdG8gZnVsbHNjcmVlblxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBtb3VzZS54ID0gKCBldmVudC5jbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGggKSAqIDIgLSAxO1xyXG4gICAgICAgIG1vdXNlLnkgPSAtICggZXZlbnQuY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCApICogMiArIDE7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9LCBmYWxzZSApO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgZnVuY3Rpb24oIGV2ZW50ICl7XHJcbiAgICAgIGlmIChpbnB1dC5pbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAvLyBwcmV2ZW50IG1vdXNlIGRvd24gZnJvbSB0cmlnZ2VyaW5nIG90aGVyIGxpc3RlbmVycyAocG9seWZpbGwsIGV0YylcclxuICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBpbnB1dC5wcmVzc2VkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSwgdHJ1ZSApO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIGZ1bmN0aW9uKCBldmVudCApe1xyXG4gICAgICBpbnB1dC5wcmVzc2VkID0gZmFsc2U7XHJcbiAgICB9LCBmYWxzZSApO1xyXG5cclxuXHJcbiAgICByZXR1cm4gaW5wdXQ7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIFB1YmxpYyBmdW5jdGlvbiB1c2VycyBydW4gdG8gZ2l2ZSBEQVQgR1VJIGFuIGlucHV0IGRldmljZS5cclxuICAgIEF1dG9tYXRpY2FsbHkgZGV0ZWN0cyBmb3IgVml2ZUNvbnRyb2xsZXIgYW5kIGJpbmRzIGJ1dHRvbnMgKyBoYXB0aWMgZmVlZGJhY2suXHJcblxyXG4gICAgUmV0dXJucyBhIGxhc2VyIHBvaW50ZXIgc28gaXQgY2FuIGJlIGRpcmVjdGx5IGFkZGVkIHRvIHNjZW5lLlxyXG5cclxuICAgIFRoZSBsYXNlciB3aWxsIHRoZW4gaGF2ZSB0d28gbWV0aG9kczpcclxuICAgIGxhc2VyLnByZXNzZWQoKSwgbGFzZXIuZ3JpcHBlZCgpXHJcblxyXG4gICAgVGhlc2UgY2FuIHRoZW4gYmUgYm91bmQgdG8gYW55IGJ1dHRvbiB0aGUgdXNlciB3YW50cy4gVXNlZnVsIGZvciBiaW5kaW5nIHRvXHJcbiAgICBjYXJkYm9hcmQgb3IgYWx0ZXJuYXRlIGlucHV0IGRldmljZXMuXHJcblxyXG4gICAgRm9yIGV4YW1wbGUuLi5cclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIGZ1bmN0aW9uKCl7IGxhc2VyLnByZXNzZWQoIHRydWUgKTsgfSApO1xyXG4gICovXHJcbiAgZnVuY3Rpb24gYWRkSW5wdXRPYmplY3QoIG9iamVjdCApe1xyXG4gICAgY29uc3QgaW5wdXQgPSBjcmVhdGVJbnB1dCggb2JqZWN0ICk7XHJcblxyXG4gICAgaW5wdXQubGFzZXIucHJlc3NlZCA9IGZ1bmN0aW9uKCBmbGFnICl7XHJcbiAgICAgIC8vIG9ubHkgcGF5IGF0dGVudGlvbiB0byBwcmVzc2VzIG92ZXIgdGhlIEdVSVxyXG4gICAgICBpZiAoZmxhZyAmJiAoaW5wdXQuaW50ZXJzZWN0aW9ucy5sZW5ndGggPiAwKSkge1xyXG4gICAgICAgIGlucHV0LnByZXNzZWQgPSB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlucHV0LnByZXNzZWQgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBpbnB1dC5sYXNlci5ncmlwcGVkID0gZnVuY3Rpb24oIGZsYWcgKXtcclxuICAgICAgaW5wdXQuZ3JpcHBlZCA9IGZsYWc7XHJcbiAgICB9O1xyXG5cclxuICAgIGlucHV0Lmxhc2VyLmN1cnNvciA9IGlucHV0LmN1cnNvcjtcclxuXHJcbiAgICBpZiggVEhSRUUuVml2ZUNvbnRyb2xsZXIgJiYgb2JqZWN0IGluc3RhbmNlb2YgVEhSRUUuVml2ZUNvbnRyb2xsZXIgKXtcclxuICAgICAgYmluZFZpdmVDb250cm9sbGVyKCBpbnB1dCwgb2JqZWN0LCBpbnB1dC5sYXNlci5wcmVzc2VkLCBpbnB1dC5sYXNlci5ncmlwcGVkICk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5wdXRPYmplY3RzLnB1c2goIGlucHV0ICk7XHJcblxyXG4gICAgcmV0dXJuIGlucHV0Lmxhc2VyO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIEhlcmUgYXJlIHRoZSBtYWluIGRhdCBndWkgY29udHJvbGxlciB0eXBlcy5cclxuICAqL1xyXG5cclxuICBmdW5jdGlvbiBhZGRTbGlkZXIoIG9iamVjdCwgcHJvcGVydHlOYW1lLCBtaW4gPSAwLjAsIG1heCA9IDEwMC4wICl7XHJcbiAgICBjb25zdCBzbGlkZXIgPSBjcmVhdGVTbGlkZXIoIHtcclxuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0LCBtaW4sIG1heCxcclxuICAgICAgaW5pdGlhbFZhbHVlOiBvYmplY3RbIHByb3BlcnR5TmFtZSBdXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBzbGlkZXIgKTtcclxuXHJcbiAgICByZXR1cm4gc2xpZGVyO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkQ2hlY2tib3goIG9iamVjdCwgcHJvcGVydHlOYW1lICl7XHJcbiAgICBjb25zdCBjaGVja2JveCA9IGNyZWF0ZUNoZWNrYm94KHtcclxuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0LFxyXG4gICAgICBpbml0aWFsVmFsdWU6IG9iamVjdFsgcHJvcGVydHlOYW1lIF1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGNoZWNrYm94ICk7XHJcblxyXG4gICAgcmV0dXJuIGNoZWNrYm94O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkQnV0dG9uKCBvYmplY3QsIHByb3BlcnR5TmFtZSApe1xyXG4gICAgY29uc3QgYnV0dG9uID0gY3JlYXRlQnV0dG9uKHtcclxuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBidXR0b24gKTtcclxuICAgIHJldHVybiBidXR0b247XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGFkZEltYWdlQnV0dG9uKGZ1bmMsIGltYWdlKSB7XHJcbiAgICBjb25zdCBvYmplY3QgPSB7IGY6IGZ1bmMgfTtcclxuICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9ICdmJztcclxuXHJcblxyXG4gICAgLy9zZWUgYWxzbyBmb2xkZXIuanMgd2hlcmUgdGhpcyBpcyBhZGRlZCB0byBncm91cCBvYmplY3QuLi5cclxuICAgIC8vYXMgc3VjaCB0aGlzIGZ1bmN0aW9uIGFsc28gbmVlZHMgdG8gYmUgcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIGNyZWF0ZUZvbGRlci5cclxuICAgIC8vcGVyaGFwcyBhbGwgb2YgdGhlc2UgJ2FkZFgnIGZ1bmN0aW9ucyBjb3VsZCBiZSBpbml0aWFsbHkgcHV0IG9udG8gYW4gb2JqZWN0IHNvIHRoYXRcclxuICAgIC8vbmV3IGFkZGl0aW9ucyBjb3VsZCBiZSBhZGRlZCBzbGlnaHRseSBtb3JlIGVhc2lseS5cclxuICAgIGNvbnN0IGJ1dHRvbiA9IGNyZWF0ZUltYWdlQnV0dG9uKHtcclxuICAgICAgdGV4dENyZWF0b3IsIG9iamVjdCwgcHJvcGVydHlOYW1lLCBpbWFnZVxyXG4gICAgfSk7XHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBidXR0b24gKTtcclxuICAgIHJldHVybiBidXR0b247XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGREcm9wZG93biggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIG9wdGlvbnMgKXtcclxuICAgIGNvbnN0IGRyb3Bkb3duID0gY3JlYXRlRHJvcGRvd24oe1xyXG4gICAgICB0ZXh0Q3JlYXRvciwgcHJvcGVydHlOYW1lLCBvYmplY3QsIG9wdGlvbnNcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRyb2xsZXJzLnB1c2goIGRyb3Bkb3duICk7XHJcbiAgICByZXR1cm4gZHJvcGRvd247XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIEFuIGltcGxpY2l0IEFkZCBmdW5jdGlvbiB3aGljaCBkZXRlY3RzIGZvciBwcm9wZXJ0eSB0eXBlXHJcbiAgICBhbmQgZ2l2ZXMgeW91IHRoZSBjb3JyZWN0IGNvbnRyb2xsZXIuXHJcblxyXG4gICAgRHJvcGRvd246XHJcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUsIG9iamVjdFR5cGUgKVxyXG5cclxuICAgIFNsaWRlcjpcclxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZOdW1iZXJUeXBlLCBtaW4sIG1heCApXHJcblxyXG4gICAgQ2hlY2tib3g6XHJcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU9mQm9vbGVhblR5cGUgKVxyXG5cclxuICAgIEJ1dHRvbjpcclxuICAgICAgYWRkKCBvYmplY3QsIHByb3BlcnR5T2ZGdW5jdGlvblR5cGUgKVxyXG5cclxuICAgIE5vdCB1c2VkIGRpcmVjdGx5LiBVc2VkIGJ5IGZvbGRlcnMuXHJcbiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gYWRkKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgYXJnMywgYXJnNCApe1xyXG5cclxuICAgIGlmKCBvYmplY3QgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG5cclxuICAgIGlmKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgY29uc29sZS53YXJuKCAnbm8gcHJvcGVydHkgbmFtZWQnLCBwcm9wZXJ0eU5hbWUsICdvbiBvYmplY3QnLCBvYmplY3QgKTtcclxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpc09iamVjdCggYXJnMyApIHx8IGlzQXJyYXkoIGFyZzMgKSApe1xyXG4gICAgICByZXR1cm4gYWRkRHJvcGRvd24oIG9iamVjdCwgcHJvcGVydHlOYW1lLCBhcmczICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGlzTnVtYmVyKCBvYmplY3RbIHByb3BlcnR5TmFtZV0gKSApe1xyXG4gICAgICByZXR1cm4gYWRkU2xpZGVyKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgYXJnMywgYXJnNCApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpc0Jvb2xlYW4oIG9iamVjdFsgcHJvcGVydHlOYW1lXSApICl7XHJcbiAgICAgIHJldHVybiBhZGRDaGVja2JveCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiggaXNGdW5jdGlvbiggb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSApICl7XHJcbiAgICAgIHJldHVybiBhZGRCdXR0b24oIG9iamVjdCwgcHJvcGVydHlOYW1lICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gIGFkZCBjb3VsZG4ndCBmaWd1cmUgaXQgb3V0LCBwYXNzIGl0IGJhY2sgdG8gZm9sZGVyXHJcbiAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gYWRkU2ltcGxlU2xpZGVyKCBtaW4gPSAwLCBtYXggPSAxICl7XHJcbiAgICBjb25zdCBwcm94eSA9IHtcclxuICAgICAgbnVtYmVyOiBtaW5cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGFkZFNsaWRlciggcHJveHksICdudW1iZXInLCBtaW4sIG1heCApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkU2ltcGxlRHJvcGRvd24oIG9wdGlvbnMgPSBbXSApe1xyXG4gICAgY29uc3QgcHJveHkgPSB7XHJcbiAgICAgIG9wdGlvbjogJydcclxuICAgIH07XHJcblxyXG4gICAgaWYoIG9wdGlvbnMgIT09IHVuZGVmaW5lZCApe1xyXG4gICAgICBwcm94eS5vcHRpb24gPSBpc0FycmF5KCBvcHRpb25zICkgPyBvcHRpb25zWyAwIF0gOiBvcHRpb25zWyBPYmplY3Qua2V5cyhvcHRpb25zKVswXSBdO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhZGREcm9wZG93biggcHJveHksICdvcHRpb24nLCBvcHRpb25zICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZGRTaW1wbGVDaGVja2JveCggZGVmYXVsdE9wdGlvbiA9IGZhbHNlICl7XHJcbiAgICBjb25zdCBwcm94eSA9IHtcclxuICAgICAgY2hlY2tlZDogZGVmYXVsdE9wdGlvblxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gYWRkQ2hlY2tib3goIHByb3h5LCAnY2hlY2tlZCcgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZFNpbXBsZUJ1dHRvbiggZm4gKXtcclxuICAgIGNvbnN0IHByb3h5ID0ge1xyXG4gICAgICBidXR0b246IChmbiE9PXVuZGVmaW5lZCkgPyBmbiA6IGZ1bmN0aW9uKCl7fVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gYWRkQnV0dG9uKCBwcm94eSwgJ2J1dHRvbicgKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgTm90IHVzZWQgZGlyZWN0bHk7IHVzZWQgYnkgZm9sZGVycy5cclxuICBSZW1vdmUgY29udHJvbGxlcnMgZnJvbSB0aGUgZ2xvYmFsIGxpc3Qgb2YgYWxsIGNvbnRyb2xsZXJzIGtub3duIHRvIGRhdC5HVUlWUi5cclxuICBDYWxscyByZW1vdmVUZXN0IGZpcnN0IHRvIGNoZWNrIGlucHV0IGFyZ3VtZW50cy4gIHJldHVybnMgZmFsc2UgaWYgdGhpcyB0ZXN0IGZhaWxzLlxyXG4gIHJldHVybnMgdHJ1ZSBpZiBzdWNjZXNzZnVsLlxyXG5cclxuICBOb3RlIHRoYXQgdGhpcyBmdW5jdGlvbiBkb2VzIG5vdCByZWN1cnNpdmVseSByZW1vdmUgZWxlbWVudHMgZnJvbSBmb2xkZXJzOyB0aGF0IGlzIGRlYWx0IHdpdGggaW4gdGhlIGZvbGRlciBjb2RlIHdoaWNoIGNhbGxzIHRoaXMuXHJcbiAgXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcmVtb3ZlKCAuLi5hcmdzICl7XHJcbiAgICBsZXQgYXJnU2V0ID0gWyAuLi5uZXcgU2V0KGFyZ3MpIF07IC8vanVzdCBpbiBjYXNlIHRoZXJlIHdlcmUgcmVwZWF0ZWQgZWxlbWVudHMgaW4gYXJncywgdHVybiBpbnRvIFNldCB0aGVuIGJhY2sgdG8gYXJyYXkuXHJcbiAgICBpZiAoICFyZW1vdmVUZXN0KC4uLmFyZ1NldCkgKSByZXR1cm4gZmFsc2U7XHJcbiAgICBhcmdTZXQuZm9yRWFjaCggZnVuY3Rpb24oIG9iaiApe1xyXG4gICAgICB2YXIgaSA9IGNvbnRyb2xsZXJzLmluZGV4T2YoIG9iaiApO1xyXG4gICAgICBpZiAoIGkgPiAtMSkgY29udHJvbGxlcnMuc3BsaWNlKCBpLCAxICk7XHJcbiAgICAgIGVsc2UgeyAvLyBJIGNhbid0IHNlZSBob3cgdGhpcydkIGhhcHBlbiBub3cgd2UgZ3VhcmQgYWdhaW5zdCByZXBlYXRlZCBlbGVtZW50cy5cclxuICAgICAgICBjb25zb2xlLmxvZyhcIkludGVybmFsIGVycm9yIGluIHJlbW92ZSwgbm90IGFudGljaXBhdGVkIGJ5IHJlbW92ZVRlc3QuIEludGVybmFsIGRhdC5HVUlWUiBzdGF0ZSBtYXkgYmUgaW5jb25zaXN0ZW50LlwiKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIFZlcmlmeSB0aGF0IGFsbCBvZiB0aGUgaXRlbXMgaW4gcHJvdmlkZWQgYXJndW1lbnRzIGFyZSBleGlzdGluZyBjb250cm9sbGVycyB0aGF0IHNob3VsZCBiZSBvayB0byByZW1vdmUuXHJcblxyXG4gIFJldHVybnMgZmFsc2UgaWYgdGhlcmUgYXJlIGFueSBtaXNtYXRjaGVzLCB0cnVlIGlmIGJlbGlldmVkIG9rIHRvIGNvbnRpbnVlIHdpdGggYWN0dWFsIHJlbW92ZSgpXHJcblxyXG4gIElmIGFueSBvZiB0aGUgcHJvdmlkZWQgYXJncyBhcmUgZm9sZGVycyAoaGF2ZSBpc0ZvbGRlciBwcm9wZXJ0eSkgdGhpcyBpcyBjYWxsZWQgcmVjdXJzaXZlbHkuXHJcbiAgVGhpcyB3aWxsIHJlc3VsdCBpbiByZWR1bmRhbnQgd29yayBhcyBlYWNoIGZvbGRlciB3aWxsIGFsc28gY2FsbCBpdCBhZ2FpbiBhcyBpdCdzIHJlbW92ZWQsIGJ1dCB0aGlzIGlzIGNoZWFwXHJcbiAgYW5kIGl0IG1lYW5zIHRoYXQgYW55IGVycm9yIHNob3VsZCBiZSBjYXVnaHQgYXMgZWFybHkgYXMgcG9zc2libGUgYW5kIHRoZSB3aG9sZSBwcm9jZXNzIGFib3J0ZWQuXHJcbiAgKi9cclxuICBmdW5jdGlvbiByZW1vdmVUZXN0KCAuLi5hcmdzICkge1xyXG4gICAgZm9yICh2YXIgaT0wOyBpPGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIG9iaiA9IGFyZ3NbaV07XHJcbiAgICAgIGlmIChjb250cm9sbGVycy5pbmRleE9mKG9iaikgPT09IC0xIHx8ICFvYmouZm9sZGVyLmhhc0NoaWxkKG9iaikpIHtcclxuICAgICAgICAvL1RPRE86IHRvU3RyaW5nIGltcGxlbWVudGF0aW9ucyBmb3IgY29udHJvbGxlcnNcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNhbid0IHJlbW92ZSBjb250cm9sbGVyIFwiICsgb2JqKTsgLy9ub3Qgc3VyZSB0aGUgcHJlZmVycmVkIHdheSBvZiByZXBvcnRpbmcgcHJvYmxlbSB0byB1c2VyLlxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAob2JqLmlzRm9sZGVyKSB7XHJcbiAgICAgICAgaWYgKCFyZW1vdmVUZXN0KCAuLi5vYmouZ3VpQ2hpbGRyZW4gKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG5cclxuICAvKlxyXG4gICAgQ3JlYXRlcyBhIGZvbGRlciB3aXRoIHRoZSBuYW1lLlxyXG5cclxuICAgIEZvbGRlcnMgYXJlIFRIUkVFLkdyb3VwIHR5cGUgb2JqZWN0cyBhbmQgY2FuIGRvIGdyb3VwLmFkZCgpIGZvciBzaWJsaW5ncy5cclxuICAgIEZvbGRlcnMgd2lsbCBhdXRvbWF0aWNhbGx5IGF0dGVtcHQgdG8gbGF5IGl0cyBjaGlsZHJlbiBvdXQgaW4gc2VxdWVuY2UuXHJcblxyXG4gICAgRm9sZGVycyBhcmUgZ2l2ZW4gdGhlIGFkZCgpIGZ1bmN0aW9uYWxpdHkgc28gdGhhdCB0aGV5IGNhbiBkb1xyXG4gICAgZm9sZGVyLmFkZCggLi4uICkgdG8gY3JlYXRlIGNvbnRyb2xsZXJzLlxyXG4gICovXHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZSggbmFtZSApe1xyXG4gICAgY29uc3QgZm9sZGVyID0gY3JlYXRlRm9sZGVyKHtcclxuICAgICAgdGV4dENyZWF0b3IsXHJcbiAgICAgIG5hbWUsXHJcbiAgICAgIGd1aUFkZDogYWRkLFxyXG4gICAgICBndWlSZW1vdmU6IHJlbW92ZSxcclxuICAgICAgYWRkU2xpZGVyOiBhZGRTaW1wbGVTbGlkZXIsXHJcbiAgICAgIGFkZERyb3Bkb3duOiBhZGRTaW1wbGVEcm9wZG93bixcclxuICAgICAgYWRkQ2hlY2tib3g6IGFkZFNpbXBsZUNoZWNrYm94LFxyXG4gICAgICBhZGRCdXR0b246IGFkZFNpbXBsZUJ1dHRvbixcclxuICAgICAgYWRkSW1hZ2VCdXR0b246IGFkZEltYWdlQnV0dG9uXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBmb2xkZXIgKTtcclxuXHJcbiAgICByZXR1cm4gZm9sZGVyO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBQZXJmb3JtIHRoZSBuZWNlc3NhcnkgdXBkYXRlcywgcmF5Y2FzdHMgb24gaXRzIG93biBSQUYuXHJcbiAgKi9cclxuXHJcbiAgY29uc3QgdFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICBjb25zdCB0RGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoIDAsIDAsIC0xICk7XHJcbiAgY29uc3QgdE1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSggdXBkYXRlICk7XHJcblxyXG4gICAgdmFyIGhpdHNjYW5PYmplY3RzID0gZ2V0VmlzaWJsZUhpdHNjYW5PYmplY3RzKCk7XHJcblxyXG4gICAgaWYoIG1vdXNlRW5hYmxlZCApe1xyXG4gICAgICBtb3VzZUlucHV0LmludGVyc2VjdGlvbnMgPSBwZXJmb3JtTW91c2VJbnB1dCggaGl0c2Nhbk9iamVjdHMsIG1vdXNlSW5wdXQgKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnB1dE9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24oIHtib3gsb2JqZWN0LHJheWNhc3QsbGFzZXIsY3Vyc29yfSA9IHt9LCBpbmRleCApe1xyXG4gICAgICBvYmplY3QudXBkYXRlTWF0cml4V29ybGQoKTtcclxuXHJcbiAgICAgIHRQb3NpdGlvbi5zZXQoMCwwLDApLnNldEZyb21NYXRyaXhQb3NpdGlvbiggb2JqZWN0Lm1hdHJpeFdvcmxkICk7XHJcbiAgICAgIHRNYXRyaXguaWRlbnRpdHkoKS5leHRyYWN0Um90YXRpb24oIG9iamVjdC5tYXRyaXhXb3JsZCApO1xyXG4gICAgICB0RGlyZWN0aW9uLnNldCgwLDAsLTEpLmFwcGx5TWF0cml4NCggdE1hdHJpeCApLm5vcm1hbGl6ZSgpO1xyXG5cclxuICAgICAgcmF5Y2FzdC5zZXQoIHRQb3NpdGlvbiwgdERpcmVjdGlvbiApO1xyXG5cclxuICAgICAgbGFzZXIuZ2VvbWV0cnkudmVydGljZXNbIDAgXS5jb3B5KCB0UG9zaXRpb24gKTtcclxuXHJcbiAgICAgIC8vICBkZWJ1Zy4uLlxyXG4gICAgICAvLyBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc1sgMSBdLmNvcHkoIHRQb3NpdGlvbiApLmFkZCggdERpcmVjdGlvbi5tdWx0aXBseVNjYWxhciggMSApICk7XHJcblxyXG4gICAgICBjb25zdCBpbnRlcnNlY3Rpb25zID0gcmF5Y2FzdC5pbnRlcnNlY3RPYmplY3RzKCBoaXRzY2FuT2JqZWN0cywgZmFsc2UgKTtcclxuICAgICAgcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICk7XHJcblxyXG4gICAgICBpbnB1dE9iamVjdHNbIGluZGV4IF0uaW50ZXJzZWN0aW9ucyA9IGludGVyc2VjdGlvbnM7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBpbnB1dHMgPSBpbnB1dE9iamVjdHMuc2xpY2UoKTtcclxuXHJcbiAgICBpZiggbW91c2VFbmFibGVkICl7XHJcbiAgICAgIGlucHV0cy5wdXNoKCBtb3VzZUlucHV0ICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udHJvbGxlcnMuZm9yRWFjaCggZnVuY3Rpb24oIGNvbnRyb2xsZXIgKXtcclxuICAgICAgLy9uYiwgd2UgY291bGQgZG8gYSBtb3JlIHRob3JvdWdoIGNoZWNrIGZvciB2aXNpYmlsdHksIG5vdCBzdXJlIGhvdyBpbXBvcnRhbnRcclxuICAgICAgLy90aGlzIGJpdCBpcyBhdCB0aGlzIHN0YWdlLi4uXHJcbiAgICAgIGlmIChjb250cm9sbGVyLnZpc2libGUpIGNvbnRyb2xsZXIudXBkYXRlQ29udHJvbCggaW5wdXRzICk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZUxhc2VyKCBsYXNlciwgcG9pbnQgKXtcclxuICAgIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzWyAxIF0uY29weSggcG9pbnQgKTtcclxuICAgIGxhc2VyLnZpc2libGUgPSB0cnVlO1xyXG4gICAgbGFzZXIuZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nU3BoZXJlKCk7XHJcbiAgICBsYXNlci5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZUludGVyc2VjdGlvbnMoIGludGVyc2VjdGlvbnMsIGxhc2VyLCBjdXJzb3IgKXtcclxuICAgIGlmKCBpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDAgKXtcclxuICAgICAgY29uc3QgZmlyc3RIaXQgPSBpbnRlcnNlY3Rpb25zWyAwIF07XHJcbiAgICAgIHVwZGF0ZUxhc2VyKCBsYXNlciwgZmlyc3RIaXQucG9pbnQgKTtcclxuICAgICAgY3Vyc29yLnBvc2l0aW9uLmNvcHkoIGZpcnN0SGl0LnBvaW50ICk7XHJcbiAgICAgIGN1cnNvci52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgY3Vyc29yLnVwZGF0ZU1hdHJpeFdvcmxkKCk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBsYXNlci52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgIGN1cnNvci52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZU1vdXNlSW50ZXJzZWN0aW9uKCBpbnRlcnNlY3Rpb24sIGxhc2VyLCBjdXJzb3IgKXtcclxuICAgIGN1cnNvci5wb3NpdGlvbi5jb3B5KCBpbnRlcnNlY3Rpb24gKTtcclxuICAgIHVwZGF0ZUxhc2VyKCBsYXNlciwgY3Vyc29yLnBvc2l0aW9uICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwZXJmb3JtTW91c2VJbnRlcnNlY3Rpb24oIHJheWNhc3QsIG1vdXNlLCBjYW1lcmEgKXtcclxuICAgIHJheWNhc3Quc2V0RnJvbUNhbWVyYSggbW91c2UsIGNhbWVyYSApO1xyXG4gICAgY29uc3QgaGl0c2Nhbk9iamVjdHMgPSBnZXRWaXNpYmxlSGl0c2Nhbk9iamVjdHMoKTtcclxuICAgIHJldHVybiByYXljYXN0LmludGVyc2VjdE9iamVjdHMoIGhpdHNjYW5PYmplY3RzLCBmYWxzZSApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbW91c2VJbnRlcnNlY3RzUGxhbmUoIHJheWNhc3QsIHYsIHBsYW5lICl7XHJcbiAgICByZXR1cm4gcmF5Y2FzdC5yYXkuaW50ZXJzZWN0UGxhbmUoIHBsYW5lLCB2ICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwZXJmb3JtTW91c2VJbnB1dCggaGl0c2Nhbk9iamVjdHMsIHtib3gsb2JqZWN0LHJheWNhc3QsbGFzZXIsY3Vyc29yLG1vdXNlLG1vdXNlQ2FtZXJhfSA9IHt9ICl7XHJcbiAgICBsZXQgaW50ZXJzZWN0aW9ucyA9IFtdO1xyXG5cclxuICAgIGlmIChtb3VzZUNhbWVyYSkge1xyXG4gICAgICBpbnRlcnNlY3Rpb25zID0gcGVyZm9ybU1vdXNlSW50ZXJzZWN0aW9uKCByYXljYXN0LCBtb3VzZSwgbW91c2VDYW1lcmEgKTtcclxuICAgICAgcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICk7XHJcbiAgICAgIGN1cnNvci52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgbGFzZXIudmlzaWJsZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGludGVyc2VjdGlvbnM7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBQdWJsaWMgbWV0aG9kcy5cclxuICAqL1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgY3JlYXRlLFxyXG4gICAgYWRkSW5wdXRPYmplY3QsXHJcbiAgICBlbmFibGVNb3VzZSxcclxuICAgIGRpc2FibGVNb3VzZVxyXG4gIH07XHJcblxyXG59KCkpO1xyXG5cclxuaWYoIHdpbmRvdyApe1xyXG4gIGlmKCB3aW5kb3cuZGF0ID09PSB1bmRlZmluZWQgKXtcclxuICAgIHdpbmRvdy5kYXQgPSB7fTtcclxuICB9XHJcblxyXG4gIHdpbmRvdy5kYXQuR1VJVlIgPSBHVUlWUjtcclxufVxyXG5cclxuaWYoIG1vZHVsZSApe1xyXG4gIG1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgZGF0OiBHVUlWUlxyXG4gIH07XHJcbn1cclxuXHJcbmlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gIGRlZmluZShbXSwgR1VJVlIpO1xyXG59XHJcblxyXG4vKlxyXG4gIEJ1bmNoIG9mIHN0YXRlLWxlc3MgdXRpbGl0eSBmdW5jdGlvbnMuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBpc051bWJlcihuKSB7XHJcbiAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNCb29sZWFuKG4pe1xyXG4gIHJldHVybiB0eXBlb2YgbiA9PT0gJ2Jvb2xlYW4nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGZ1bmN0aW9uVG9DaGVjaykge1xyXG4gIGNvbnN0IGdldFR5cGUgPSB7fTtcclxuICByZXR1cm4gZnVuY3Rpb25Ub0NoZWNrICYmIGdldFR5cGUudG9TdHJpbmcuY2FsbChmdW5jdGlvblRvQ2hlY2spID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xyXG59XHJcblxyXG4vLyAgb25seSB7fSBvYmplY3RzIG5vdCBhcnJheXNcclxuLy8gICAgICAgICAgICAgICAgICAgIHdoaWNoIGFyZSB0ZWNobmljYWxseSBvYmplY3RzIGJ1dCB5b3UncmUganVzdCBiZWluZyBwZWRhbnRpY1xyXG5mdW5jdGlvbiBpc09iamVjdCAoaXRlbSkge1xyXG4gIHJldHVybiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW0gIT09IG51bGwpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0FycmF5KCBvICl7XHJcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoIG8gKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLypcclxuICBDb250cm9sbGVyLXNwZWNpZmljIHN1cHBvcnQuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBiaW5kVml2ZUNvbnRyb2xsZXIoIGlucHV0LCBjb250cm9sbGVyLCBwcmVzc2VkLCBncmlwcGVkICl7XHJcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAndHJpZ2dlcmRvd24nLCAoKT0+cHJlc3NlZCggdHJ1ZSApICk7XHJcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAndHJpZ2dlcnVwJywgKCk9PnByZXNzZWQoIGZhbHNlICkgKTtcclxuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICdncmlwc2Rvd24nLCAoKT0+Z3JpcHBlZCggdHJ1ZSApICk7XHJcbiAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKCAnZ3JpcHN1cCcsICgpPT5ncmlwcGVkKCBmYWxzZSApICk7XHJcblxyXG4gIGNvbnN0IGdhbWVwYWQgPSBjb250cm9sbGVyLmdldEdhbWVwYWQoKTtcclxuICBmdW5jdGlvbiB2aWJyYXRlKCB0LCBhICl7XHJcbiAgICBpZiggZ2FtZXBhZCAmJiBnYW1lcGFkLmhhcHRpY0FjdHVhdG9ycy5sZW5ndGggPiAwICl7XHJcbiAgICAgIGdhbWVwYWQuaGFwdGljQWN0dWF0b3JzWyAwIF0ucHVsc2UoIHQsIGEgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhcHRpY3NUYXAoKXtcclxuICAgIHNldEludGVydmFsVGltZXMoICh4LHQsYSk9PnZpYnJhdGUoMS1hLCAwLjUpLCAxMCwgMjAgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhcHRpY3NFY2hvKCl7XHJcbiAgICBzZXRJbnRlcnZhbFRpbWVzKCAoeCx0LGEpPT52aWJyYXRlKDQsIDEuMCAqICgxLWEpKSwgMTAwLCA0ICk7XHJcbiAgfVxyXG5cclxuICBpbnB1dC5ldmVudHMub24oICdvbkNvbnRyb2xsZXJIZWxkJywgZnVuY3Rpb24oIGlucHV0ICl7XHJcbiAgICB2aWJyYXRlKCAwLjMsIDAuMyApO1xyXG4gIH0pO1xyXG5cclxuICBpbnB1dC5ldmVudHMub24oICdncmFiYmVkJywgZnVuY3Rpb24oKXtcclxuICAgIGhhcHRpY3NUYXAoKTtcclxuICB9KTtcclxuXHJcbiAgaW5wdXQuZXZlbnRzLm9uKCAnZ3JhYlJlbGVhc2VkJywgZnVuY3Rpb24oKXtcclxuICAgIGhhcHRpY3NFY2hvKCk7XHJcbiAgfSk7XHJcblxyXG4gIGlucHV0LmV2ZW50cy5vbiggJ3Bpbm5lZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBoYXB0aWNzVGFwKCk7XHJcbiAgfSk7XHJcblxyXG4gIGlucHV0LmV2ZW50cy5vbiggJ3BpblJlbGVhc2VkJywgZnVuY3Rpb24oKXtcclxuICAgIGhhcHRpY3NFY2hvKCk7XHJcbiAgfSk7XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldEludGVydmFsVGltZXMoIGNiLCBkZWxheSwgdGltZXMgKXtcclxuICBsZXQgeCA9IDA7XHJcbiAgbGV0IGlkID0gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCl7XHJcbiAgICBjYiggeCwgdGltZXMsIHgvdGltZXMgKTtcclxuICAgIHgrKztcclxuICAgIGlmKCB4Pj10aW1lcyApe1xyXG4gICAgICBjbGVhckludGVydmFsKCBpZCApO1xyXG4gICAgfVxyXG4gIH0sIGRlbGF5ICk7XHJcbiAgcmV0dXJuIGlkO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuaW1wb3J0IEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUludGVyYWN0aW9uKCBoaXRWb2x1bWUgKXtcclxuICBjb25zdCBldmVudHMgPSBuZXcgRW1pdHRlcigpO1xyXG5cclxuICBsZXQgYW55SG92ZXIgPSBmYWxzZTtcclxuICBsZXQgYW55UHJlc3NpbmcgPSBmYWxzZTtcclxuICBsZXQgYW55QWN0aXZlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IHRWZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG4gIGNvbnN0IGF2YWlsYWJsZUlucHV0cyA9IFtdO1xyXG5cclxuICBmdW5jdGlvbiB1cGRhdGUoIGlucHV0T2JqZWN0cyApe1xyXG5cclxuICAgIGFueUhvdmVyID0gZmFsc2U7XHJcbiAgICBhbnlQcmVzc2luZyA9IGZhbHNlO1xyXG4gICAgYW55QWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgaW5wdXRPYmplY3RzLmZvckVhY2goIGZ1bmN0aW9uKCBpbnB1dCApe1xyXG5cclxuICAgICAgaWYoIGF2YWlsYWJsZUlucHV0cy5pbmRleE9mKCBpbnB1dCApIDwgMCApe1xyXG4gICAgICAgIGF2YWlsYWJsZUlucHV0cy5wdXNoKCBpbnB1dCApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB7IGhpdE9iamVjdCwgaGl0UG9pbnQgfSA9IGV4dHJhY3RIaXQoIGlucHV0ICk7XHJcblxyXG4gICAgICB2YXIgaG92ZXIgPSBoaXRWb2x1bWUgPT09IGhpdE9iamVjdDtcclxuICAgICAgYW55SG92ZXIgPSBhbnlIb3ZlciB8fCBob3ZlcjtcclxuXHJcbiAgICAgIHBlcmZvcm1TdGF0ZUV2ZW50cyh7XHJcbiAgICAgICAgaW5wdXQsXHJcbiAgICAgICAgaG92ZXIsXHJcbiAgICAgICAgaGl0T2JqZWN0LCBoaXRQb2ludCxcclxuICAgICAgICBidXR0b25OYW1lOiAncHJlc3NlZCcsXHJcbiAgICAgICAgaW50ZXJhY3Rpb25OYW1lOiAncHJlc3MnLFxyXG4gICAgICAgIGRvd25OYW1lOiAnb25QcmVzc2VkJyxcclxuICAgICAgICBob2xkTmFtZTogJ3ByZXNzaW5nJyxcclxuICAgICAgICB1cE5hbWU6ICdvblJlbGVhc2VkJ1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHBlcmZvcm1TdGF0ZUV2ZW50cyh7XHJcbiAgICAgICAgaW5wdXQsXHJcbiAgICAgICAgaG92ZXIsXHJcbiAgICAgICAgaGl0T2JqZWN0LCBoaXRQb2ludCxcclxuICAgICAgICBidXR0b25OYW1lOiAnZ3JpcHBlZCcsXHJcbiAgICAgICAgaW50ZXJhY3Rpb25OYW1lOiAnZ3JpcCcsXHJcbiAgICAgICAgZG93bk5hbWU6ICdvbkdyaXBwZWQnLFxyXG4gICAgICAgIGhvbGROYW1lOiAnZ3JpcHBpbmcnLFxyXG4gICAgICAgIHVwTmFtZTogJ29uUmVsZWFzZUdyaXAnXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZXZlbnRzLmVtaXQoICd0aWNrJywge1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhpdE9iamVjdCxcclxuICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0XHJcbiAgICAgIH0gKTtcclxuXHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBleHRyYWN0SGl0KCBpbnB1dCApe1xyXG4gICAgaWYoIGlucHV0LmludGVyc2VjdGlvbnMubGVuZ3RoIDw9IDAgKXtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBoaXRQb2ludDogdFZlY3Rvci5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGlucHV0LmN1cnNvci5tYXRyaXhXb3JsZCApLmNsb25lKCksXHJcbiAgICAgICAgaGl0T2JqZWN0OiB1bmRlZmluZWQsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGhpdFBvaW50OiBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ucG9pbnQsXHJcbiAgICAgICAgaGl0T2JqZWN0OiBpbnB1dC5pbnRlcnNlY3Rpb25zWyAwIF0ub2JqZWN0XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwZXJmb3JtU3RhdGVFdmVudHMoe1xyXG4gICAgaW5wdXQsIGhvdmVyLFxyXG4gICAgaGl0T2JqZWN0LCBoaXRQb2ludCxcclxuICAgIGJ1dHRvbk5hbWUsIGludGVyYWN0aW9uTmFtZSwgZG93bk5hbWUsIGhvbGROYW1lLCB1cE5hbWVcclxuICB9ID0ge30gKXtcclxuXHJcbiAgICBpZiggaW5wdXRbIGJ1dHRvbk5hbWUgXSA9PT0gdHJ1ZSAmJiBoaXRPYmplY3QgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gIGhvdmVyaW5nIGFuZCBidXR0b24gZG93biBidXQgbm8gaW50ZXJhY3Rpb25zIGFjdGl2ZSB5ZXRcclxuICAgIGlmKCBob3ZlciAmJiBpbnB1dFsgYnV0dG9uTmFtZSBdID09PSB0cnVlICYmIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9PT0gdW5kZWZpbmVkICl7XHJcblxyXG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhpdE9iamVjdCxcclxuICAgICAgICBwb2ludDogaGl0UG9pbnQsXHJcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdCxcclxuICAgICAgICBsb2NrZWQ6IGZhbHNlXHJcbiAgICAgIH07XHJcbiAgICAgIGV2ZW50cy5lbWl0KCBkb3duTmFtZSwgcGF5bG9hZCApO1xyXG5cclxuICAgICAgaWYoIHBheWxvYWQubG9ja2VkICl7XHJcbiAgICAgICAgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID0gaW50ZXJhY3Rpb247XHJcbiAgICAgICAgaW5wdXQuaW50ZXJhY3Rpb24uaG92ZXIgPSBpbnRlcmFjdGlvbjtcclxuICAgICAgfVxyXG5cclxuICAgICAgYW55UHJlc3NpbmcgPSB0cnVlO1xyXG4gICAgICBhbnlBY3RpdmUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICBidXR0b24gc3RpbGwgZG93biBhbmQgdGhpcyBpcyB0aGUgYWN0aXZlIGludGVyYWN0aW9uXHJcbiAgICBpZiggaW5wdXRbIGJ1dHRvbk5hbWUgXSAmJiBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPT09IGludGVyYWN0aW9uICl7XHJcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XHJcbiAgICAgICAgaW5wdXQsXHJcbiAgICAgICAgaGl0T2JqZWN0LFxyXG4gICAgICAgIHBvaW50OiBoaXRQb2ludCxcclxuICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0LFxyXG4gICAgICAgIGxvY2tlZDogZmFsc2VcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGV2ZW50cy5lbWl0KCBob2xkTmFtZSwgcGF5bG9hZCApO1xyXG5cclxuICAgICAgYW55UHJlc3NpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgaW5wdXQuZXZlbnRzLmVtaXQoICdvbkNvbnRyb2xsZXJIZWxkJyApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICBidXR0b24gbm90IGRvd24gYW5kIHRoaXMgaXMgdGhlIGFjdGl2ZSBpbnRlcmFjdGlvblxyXG4gICAgaWYoIGlucHV0WyBidXR0b25OYW1lIF0gPT09IGZhbHNlICYmIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9PT0gaW50ZXJhY3Rpb24gKXtcclxuICAgICAgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID0gdW5kZWZpbmVkO1xyXG4gICAgICBpbnB1dC5pbnRlcmFjdGlvbi5ob3ZlciA9IHVuZGVmaW5lZDtcclxuICAgICAgZXZlbnRzLmVtaXQoIHVwTmFtZSwge1xyXG4gICAgICAgIGlucHV0LFxyXG4gICAgICAgIGhpdE9iamVjdCxcclxuICAgICAgICBwb2ludDogaGl0UG9pbnQsXHJcbiAgICAgICAgaW5wdXRPYmplY3Q6IGlucHV0Lm9iamVjdFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc01haW5Ib3Zlcigpe1xyXG5cclxuICAgIGxldCBub01haW5Ib3ZlciA9IHRydWU7XHJcbiAgICBmb3IoIGxldCBpPTA7IGk8YXZhaWxhYmxlSW5wdXRzLmxlbmd0aDsgaSsrICl7XHJcbiAgICAgIGlmKCBhdmFpbGFibGVJbnB1dHNbIGkgXS5pbnRlcmFjdGlvbi5ob3ZlciAhPT0gdW5kZWZpbmVkICl7XHJcbiAgICAgICAgbm9NYWluSG92ZXIgPSBmYWxzZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmKCBub01haW5Ib3ZlciApe1xyXG4gICAgICByZXR1cm4gYW55SG92ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGF2YWlsYWJsZUlucHV0cy5maWx0ZXIoIGZ1bmN0aW9uKCBpbnB1dCApe1xyXG4gICAgICByZXR1cm4gaW5wdXQuaW50ZXJhY3Rpb24uaG92ZXIgPT09IGludGVyYWN0aW9uO1xyXG4gICAgfSkubGVuZ3RoID4gMCApe1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSB7XHJcbiAgICBob3ZlcmluZzogaXNNYWluSG92ZXIsXHJcbiAgICBwcmVzc2luZzogKCk9PmFueVByZXNzaW5nLFxyXG4gICAgdXBkYXRlLFxyXG4gICAgZXZlbnRzXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGludGVyYWN0aW9uO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWxpZ25MZWZ0KCBvYmogKXtcclxuICBpZiggb2JqIGluc3RhbmNlb2YgVEhSRUUuTWVzaCApe1xyXG4gICAgb2JqLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG4gICAgY29uc3Qgd2lkdGggPSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnggLSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4Lnk7XHJcbiAgICBvYmouZ2VvbWV0cnkudHJhbnNsYXRlKCB3aWR0aCwgMCwgMCApO1xyXG4gICAgcmV0dXJuIG9iajtcclxuICB9XHJcbiAgZWxzZSBpZiggb2JqIGluc3RhbmNlb2YgVEhSRUUuR2VvbWV0cnkgKXtcclxuICAgIG9iai5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgIGNvbnN0IHdpZHRoID0gb2JqLmJvdW5kaW5nQm94Lm1heC54IC0gb2JqLmJvdW5kaW5nQm94Lm1heC55O1xyXG4gICAgb2JqLnRyYW5zbGF0ZSggd2lkdGgsIDAsIDAgKTtcclxuICAgIHJldHVybiBvYmo7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoLCB1bmlxdWVNYXRlcmlhbCApe1xyXG4gIGNvbnN0IG1hdGVyaWFsID0gdW5pcXVlTWF0ZXJpYWwgPyBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yOjB4ZmZmZmZmfSkgOiBTaGFyZWRNYXRlcmlhbHMuUEFORUw7XHJcbiAgY29uc3QgcGFuZWwgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApLCBtYXRlcmlhbCApO1xyXG4gIHBhbmVsLmdlb21ldHJ5LnRyYW5zbGF0ZSggd2lkdGggKiAwLjUsIDAsIDAgKTtcclxuXHJcbiAgaWYoIHVuaXF1ZU1hdGVyaWFsICl7XHJcbiAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0JBQ0sgKTtcclxuICB9XHJcbiAgZWxzZXtcclxuICAgIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBwYW5lbC5nZW9tZXRyeSwgQ29sb3JzLkRFRkFVTFRfQkFDSyApO1xyXG4gIH1cclxuXHJcbiAgcGFuZWwudXNlckRhdGEuY3VycmVudFdpZHRoID0gd2lkdGg7XHJcbiAgcGFuZWwudXNlckRhdGEuY3VycmVudEhlaWdodCA9IGhlaWdodDtcclxuICBwYW5lbC51c2VyRGF0YS5jdXJyZW50RGVwdGggPSBkZXB0aDtcclxuXHJcbiAgcmV0dXJuIHBhbmVsO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiByZXNpemVQYW5lbChwYW5lbCwgd2lkdGgsIGhlaWdodCwgZGVwdGgpIHtcclxuICBwYW5lbC5nZW9tZXRyeS5zY2FsZSh3aWR0aC9wYW5lbC51c2VyRGF0YS5jdXJyZW50V2lkdGgsIGhlaWdodC9wYW5lbC51c2VyRGF0YS5jdXJyZW50SGVpZ2h0LCBkZXB0aC9wYW5lbC51c2VyRGF0YS5jdXJyZW50RGVwdGgpO1xyXG4gIHBhbmVsLnVzZXJEYXRhLmN1cnJlbnRXaWR0aCA9IHdpZHRoO1xyXG4gIHBhbmVsLnVzZXJEYXRhLmN1cnJlbnRIZWlnaHQgPSBoZWlnaHQ7XHJcbiAgcGFuZWwudXNlckRhdGEuY3VycmVudERlcHRoID0gZGVwdGg7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgY29sb3IgKXtcclxuICBjb25zdCBwYW5lbCA9IG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIENPTlRST0xMRVJfSURfV0lEVEgsIGhlaWdodCwgQ09OVFJPTExFUl9JRF9ERVBUSCApLCBTaGFyZWRNYXRlcmlhbHMuUEFORUwgKTtcclxuICBwYW5lbC5nZW9tZXRyeS50cmFuc2xhdGUoIENPTlRST0xMRVJfSURfV0lEVEggKiAwLjUsIDAsIDAgKTtcclxuICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggcGFuZWwuZ2VvbWV0cnksIGNvbG9yICk7XHJcbiAgcmV0dXJuIHBhbmVsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRG93bkFycm93KCl7XHJcbiAgY29uc3QgdyA9IDAuMDA5NjtcclxuICBjb25zdCBoID0gMC4wMTY7XHJcbiAgY29uc3Qgc2ggPSBuZXcgVEhSRUUuU2hhcGUoKTtcclxuICBzaC5tb3ZlVG8oMCwwKTtcclxuICBzaC5saW5lVG8oLXcsaCk7XHJcbiAgc2gubGluZVRvKHcsaCk7XHJcbiAgc2gubGluZVRvKDAsMCk7XHJcblxyXG4gIGNvbnN0IGdlbyA9IG5ldyBUSFJFRS5TaGFwZUdlb21ldHJ5KCBzaCApO1xyXG4gIGdlby50cmFuc2xhdGUoIDAsIC1oICogMC41LCAwICk7XHJcblxyXG4gIHJldHVybiBuZXcgVEhSRUUuTWVzaCggZ2VvLCBTaGFyZWRNYXRlcmlhbHMuUEFORUwgKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFBBTkVMX1dJRFRIID0gMS4wO1xyXG5leHBvcnQgY29uc3QgUEFORUxfSEVJR0hUID0gMC4wODtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX0RFUFRIID0gMC4wMTtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX1NQQUNJTkcgPSAwLjAwMTtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX01BUkdJTiA9IDAuMDE1O1xyXG5leHBvcnQgY29uc3QgUEFORUxfTEFCRUxfVEVYVF9NQVJHSU4gPSAwLjA2O1xyXG5leHBvcnQgY29uc3QgUEFORUxfVkFMVUVfVEVYVF9NQVJHSU4gPSAwLjAyO1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9XSURUSCA9IDAuMDI7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0RFUFRIID0gMC4wMDE7XHJcbmV4cG9ydCBjb25zdCBCVVRUT05fREVQVEggPSAwLjAxO1xyXG5leHBvcnQgY29uc3QgRk9MREVSX1dJRFRIID0gMS4wMjY7XHJcbmV4cG9ydCBjb25zdCBTVUJGT0xERVJfV0lEVEggPSAxLjA7XHJcbmV4cG9ydCBjb25zdCBGT0xERVJfSEVJR0hUID0gMC4wOTtcclxuZXhwb3J0IGNvbnN0IEZPTERFUl9HUkFCX0hFSUdIVCA9IDAuMDUxMjtcclxuZXhwb3J0IGNvbnN0IEJPUkRFUl9USElDS05FU1MgPSAwLjAxO1xyXG5leHBvcnQgY29uc3QgQ0hFQ0tCT1hfU0laRSA9IDAuMDU7IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gPSB7fSApe1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBwYW5lbCApO1xyXG5cclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvbkdyaXBwZWQnLCBoYW5kbGVPbkdyaXAgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VHcmlwJywgaGFuZGxlT25HcmlwUmVsZWFzZSApO1xyXG5cclxuICBsZXQgb2xkUGFyZW50O1xyXG4gIGxldCBvbGRQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgbGV0IG9sZFJvdGF0aW9uID0gbmV3IFRIUkVFLkV1bGVyKCk7XHJcblxyXG4gIGNvbnN0IHJvdGF0aW9uR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICByb3RhdGlvbkdyb3VwLnNjYWxlLnNldCggMC4zLCAwLjMsIDAuMyApO1xyXG4gIHJvdGF0aW9uR3JvdXAucG9zaXRpb24uc2V0KCAtMC4wMTUsIDAuMDE1LCAwLjAgKTtcclxuXHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uR3JpcCggcCApe1xyXG5cclxuICAgIGNvbnN0IHsgaW5wdXRPYmplY3QsIGlucHV0IH0gPSBwO1xyXG5cclxuICAgIGNvbnN0IGZvbGRlciA9IGdyb3VwLmZvbGRlcjtcclxuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSB0cnVlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBvbGRQb3NpdGlvbi5jb3B5KCBmb2xkZXIucG9zaXRpb24gKTtcclxuICAgIG9sZFJvdGF0aW9uLmNvcHkoIGZvbGRlci5yb3RhdGlvbiApO1xyXG5cclxuICAgIGZvbGRlci5wb3NpdGlvbi5zZXQoIDAsMCwwICk7XHJcbiAgICBmb2xkZXIucm90YXRpb24uc2V0KCAwLDAsMCApO1xyXG4gICAgZm9sZGVyLnJvdGF0aW9uLnggPSAtTWF0aC5QSSAqIDAuNTtcclxuXHJcbiAgICBvbGRQYXJlbnQgPSBmb2xkZXIucGFyZW50O1xyXG5cclxuICAgIHJvdGF0aW9uR3JvdXAuYWRkKCBmb2xkZXIgKTtcclxuXHJcbiAgICBpbnB1dE9iamVjdC5hZGQoIHJvdGF0aW9uR3JvdXAgKTtcclxuXHJcbiAgICBwLmxvY2tlZCA9IHRydWU7XHJcblxyXG4gICAgZm9sZGVyLmJlaW5nTW92ZWQgPSB0cnVlO1xyXG5cclxuICAgIGlucHV0LmV2ZW50cy5lbWl0KCAncGlubmVkJywgaW5wdXQgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uR3JpcFJlbGVhc2UoIHsgaW5wdXRPYmplY3QsIGlucHV0IH09e30gKXtcclxuXHJcbiAgICBjb25zdCBmb2xkZXIgPSBncm91cC5mb2xkZXI7XHJcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBvbGRQYXJlbnQgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgb2xkUGFyZW50LmFkZCggZm9sZGVyICk7XHJcbiAgICBvbGRQYXJlbnQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgZm9sZGVyLnBvc2l0aW9uLmNvcHkoIG9sZFBvc2l0aW9uICk7XHJcbiAgICBmb2xkZXIucm90YXRpb24uY29weSggb2xkUm90YXRpb24gKTtcclxuXHJcbiAgICBmb2xkZXIuYmVpbmdNb3ZlZCA9IGZhbHNlO1xyXG5cclxuICAgIGlucHV0LmV2ZW50cy5lbWl0KCAncGluUmVsZWFzZWQnLCBpbnB1dCApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGludGVyYWN0aW9uO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBTREZTaGFkZXIgZnJvbSAndGhyZWUtYm1mb250LXRleHQvc2hhZGVycy9zZGYnO1xyXG5pbXBvcnQgY3JlYXRlR2VvbWV0cnkgZnJvbSAndGhyZWUtYm1mb250LXRleHQnO1xyXG5pbXBvcnQgcGFyc2VBU0NJSSBmcm9tICdwYXJzZS1ibWZvbnQtYXNjaWknO1xyXG5cclxuaW1wb3J0ICogYXMgRm9udCBmcm9tICcuL2ZvbnQnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hdGVyaWFsKCBjb2xvciApe1xyXG5cclxuICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcclxuICBjb25zdCBpbWFnZSA9IEZvbnQuaW1hZ2UoKTtcclxuICB0ZXh0dXJlLmltYWdlID0gaW1hZ2U7XHJcbiAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXI7XHJcbiAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXI7XHJcbiAgdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSBmYWxzZTtcclxuXHJcbiAgcmV0dXJuIG5ldyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbChTREZTaGFkZXIoe1xyXG4gICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgY29sb3I6IGNvbG9yLFxyXG4gICAgbWFwOiB0ZXh0dXJlXHJcbiAgfSkpO1xyXG59XHJcblxyXG5jb25zdCB0ZXh0U2NhbGUgPSAwLjAwMDI0O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0b3IoKXtcclxuXHJcbiAgY29uc3QgZm9udCA9IHBhcnNlQVNDSUkoIEZvbnQuZm50KCkgKTtcclxuXHJcbiAgY29uc3QgY29sb3JNYXRlcmlhbHMgPSB7fTtcclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlVGV4dCggc3RyLCBmb250LCBjb2xvciA9IDB4ZmZmZmZmLCBzY2FsZSA9IDEuMCApe1xyXG5cclxuICAgIGNvbnN0IGdlb21ldHJ5ID0gY3JlYXRlR2VvbWV0cnkoe1xyXG4gICAgICB0ZXh0OiBzdHIsXHJcbiAgICAgIGFsaWduOiAnbGVmdCcsXHJcbiAgICAgIHdpZHRoOiAxMDAwMCxcclxuICAgICAgZmxpcFk6IHRydWUsXHJcbiAgICAgIGZvbnRcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBjb25zdCBsYXlvdXQgPSBnZW9tZXRyeS5sYXlvdXQ7XHJcblxyXG4gICAgbGV0IG1hdGVyaWFsID0gY29sb3JNYXRlcmlhbHNbIGNvbG9yIF07XHJcbiAgICBpZiggbWF0ZXJpYWwgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICBtYXRlcmlhbCA9IGNvbG9yTWF0ZXJpYWxzWyBjb2xvciBdID0gY3JlYXRlTWF0ZXJpYWwoIGNvbG9yICk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goIGdlb21ldHJ5LCBtYXRlcmlhbCApO1xyXG4gICAgbWVzaC5zY2FsZS5tdWx0aXBseSggbmV3IFRIUkVFLlZlY3RvcjMoMSwtMSwxKSApO1xyXG5cclxuICAgIGNvbnN0IGZpbmFsU2NhbGUgPSBzY2FsZSAqIHRleHRTY2FsZTtcclxuXHJcbiAgICBtZXNoLnNjYWxlLm11bHRpcGx5U2NhbGFyKCBmaW5hbFNjYWxlICk7XHJcblxyXG4gICAgbWVzaC5wb3NpdGlvbi55ID0gbGF5b3V0LmhlaWdodCAqIDAuNSAqIGZpbmFsU2NhbGU7XHJcblxyXG4gICAgcmV0dXJuIG1lc2g7XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlKCBzdHIsIHsgY29sb3I9MHhmZmZmZmYsIHNjYWxlPTEuMCB9ID0ge30gKXtcclxuICAgIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gICAgbGV0IG1lc2ggPSBjcmVhdGVUZXh0KCBzdHIsIGZvbnQsIGNvbG9yLCBzY2FsZSApO1xyXG4gICAgZ3JvdXAuYWRkKCBtZXNoICk7XHJcbiAgICBncm91cC5sYXlvdXQgPSBtZXNoLmdlb21ldHJ5LmxheW91dDtcclxuXHJcbiAgICBncm91cC51cGRhdGVMYWJlbCA9IGZ1bmN0aW9uKCBzdHIgKXtcclxuICAgICAgbWVzaC5nZW9tZXRyeS51cGRhdGUoIHN0ciApO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgY3JlYXRlLFxyXG4gICAgZ2V0TWF0ZXJpYWw6ICgpPT4gbWF0ZXJpYWxcclxuICB9XHJcblxyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcblxyXG5leHBvcnQgY29uc3QgUEFORUwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IDB4ZmZmZmZmLCB2ZXJ0ZXhDb2xvcnM6IFRIUkVFLlZlcnRleENvbG9ycyB9ICk7XHJcbmV4cG9ydCBjb25zdCBMT0NBVE9SID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCk7XHJcbmV4cG9ydCBjb25zdCBGT0xERVIgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoIHsgY29sb3I6IDB4MDAwMDAwIH0gKTsiLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xyXG5pbXBvcnQgKiBhcyBQYWxldHRlIGZyb20gJy4vcGFsZXR0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVTbGlkZXIoIHtcclxuICB0ZXh0Q3JlYXRvcixcclxuICBvYmplY3QsXHJcbiAgcHJvcGVydHlOYW1lID0gJ3VuZGVmaW5lZCcsXHJcbiAgaW5pdGlhbFZhbHVlID0gMC4wLFxyXG4gIG1pbiA9IDAuMCwgbWF4ID0gMS4wLFxyXG4gIHN0ZXAgPSAwLjEsXHJcbiAgd2lkdGggPSBMYXlvdXQuUEFORUxfV0lEVEgsXHJcbiAgaGVpZ2h0ID0gTGF5b3V0LlBBTkVMX0hFSUdIVCxcclxuICBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSFxyXG59ID0ge30gKXtcclxuXHJcblxyXG4gIGNvbnN0IFNMSURFUl9XSURUSCA9IHdpZHRoICogMC41IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBTTElERVJfSEVJR0hUID0gaGVpZ2h0IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBTTElERVJfREVQVEggPSBkZXB0aDtcclxuXHJcbiAgY29uc3Qgc3RhdGUgPSB7XHJcbiAgICBhbHBoYTogMS4wLFxyXG4gICAgdmFsdWU6IGluaXRpYWxWYWx1ZSxcclxuICAgIHN0ZXA6IHN0ZXAsXHJcbiAgICB1c2VTdGVwOiB0cnVlLFxyXG4gICAgcHJlY2lzaW9uOiAxLFxyXG4gICAgbGlzdGVuOiBmYWxzZSxcclxuICAgIG1pbjogbWluLFxyXG4gICAgbWF4OiBtYXgsXHJcbiAgICBvbkNoYW5nZWRDQjogdW5kZWZpbmVkLFxyXG4gICAgb25GaW5pc2hlZENoYW5nZTogdW5kZWZpbmVkLFxyXG4gICAgcHJlc3Npbmc6IGZhbHNlXHJcbiAgfTtcclxuXHJcbiAgc3RhdGUuc3RlcCA9IGdldEltcGxpZWRTdGVwKCBzdGF0ZS52YWx1ZSApO1xyXG4gIHN0YXRlLnByZWNpc2lvbiA9IG51bURlY2ltYWxzKCBzdGF0ZS5zdGVwICk7XHJcbiAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gIC8vICBmaWxsZWQgdm9sdW1lXHJcbiAgY29uc3QgcmVjdCA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggU0xJREVSX1dJRFRILCBTTElERVJfSEVJR0hULCBTTElERVJfREVQVEggKTtcclxuICByZWN0LnRyYW5zbGF0ZShTTElERVJfV0lEVEgqMC41LDAsMCk7XHJcbiAgLy8gTGF5b3V0LmFsaWduTGVmdCggcmVjdCApO1xyXG5cclxuICBjb25zdCBoaXRzY2FuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoKTtcclxuICBoaXRzY2FuTWF0ZXJpYWwudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICBjb25zdCBoaXRzY2FuVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgaGl0c2Nhbk1hdGVyaWFsICk7XHJcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi54ID0gd2lkdGggKiAwLjU7XHJcbiAgaGl0c2NhblZvbHVtZS5uYW1lID0gJ2hpdHNjYW5Wb2x1bWUnO1xyXG5cclxuICAvLyAgc2xpZGVyQkcgdm9sdW1lXHJcbiAgY29uc3Qgc2xpZGVyQkcgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBTaGFyZWRNYXRlcmlhbHMuUEFORUwgKTtcclxuICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggc2xpZGVyQkcuZ2VvbWV0cnksIENvbG9ycy5TTElERVJfQkcgKTtcclxuICBzbGlkZXJCRy5wb3NpdGlvbi56ID0gZGVwdGggKiAwLjU7XHJcbiAgc2xpZGVyQkcucG9zaXRpb24ueCA9IFNMSURFUl9XSURUSCArIExheW91dC5QQU5FTF9NQVJHSU47XHJcblxyXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IENvbG9ycy5ERUZBVUxUX0NPTE9SIH0pO1xyXG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XHJcbiAgZmlsbGVkVm9sdW1lLnBvc2l0aW9uLnogPSBkZXB0aCAqIDAuNTtcclxuICBoaXRzY2FuVm9sdW1lLmFkZCggZmlsbGVkVm9sdW1lICk7XHJcblxyXG4gIGNvbnN0IGVuZExvY2F0b3IgPSBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLkJveEdlb21ldHJ5KCAwLjA1LCAwLjA1LCAwLjA1LCAxLCAxLCAxICksIFNoYXJlZE1hdGVyaWFscy5MT0NBVE9SICk7XHJcbiAgZW5kTG9jYXRvci5wb3NpdGlvbi54ID0gU0xJREVSX1dJRFRIO1xyXG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBlbmRMb2NhdG9yICk7XHJcbiAgZW5kTG9jYXRvci52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IHZhbHVlTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHN0YXRlLnZhbHVlLnRvU3RyaW5nKCkgKTtcclxuICB2YWx1ZUxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfVkFMVUVfVEVYVF9NQVJHSU4gKyB3aWR0aCAqIDAuNTtcclxuICB2YWx1ZUxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aCoyLjU7XHJcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDMyNTtcclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcblxyXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfU0xJREVSICk7XHJcbiAgY29udHJvbGxlcklELnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XHJcbiAgcGFuZWwubmFtZSA9ICdwYW5lbCc7XHJcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwsIGhpdHNjYW5Wb2x1bWUsIHNsaWRlckJHLCB2YWx1ZUxhYmVsLCBjb250cm9sbGVySUQgKTtcclxuXHJcbiAgZ3JvdXAuYWRkKCBwYW5lbCApXHJcblxyXG4gIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XHJcbiAgdXBkYXRlU2xpZGVyKCk7XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVZhbHVlTGFiZWwoIHZhbHVlICl7XHJcbiAgICBpZiggc3RhdGUudXNlU3RlcCApe1xyXG4gICAgICB2YWx1ZUxhYmVsLnVwZGF0ZUxhYmVsKCByb3VuZFRvRGVjaW1hbCggc3RhdGUudmFsdWUsIHN0YXRlLnByZWNpc2lvbiApLnRvU3RyaW5nKCkgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHZhbHVlTGFiZWwudXBkYXRlTGFiZWwoIHN0YXRlLnZhbHVlLnRvU3RyaW5nKCkgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKXtcclxuICAgIGlmKCBzdGF0ZS5wcmVzc2luZyApe1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5JTlRFUkFDVElPTl9DT0xPUiApO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAgaWYoIGludGVyYWN0aW9uLmhvdmVyaW5nKCkgKXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSElHSExJR0hUX0NPTE9SICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0NPTE9SICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVTbGlkZXIoKXtcclxuICAgIGZpbGxlZFZvbHVtZS5zY2FsZS54ID1cclxuICAgICAgTWF0aC5taW4oXHJcbiAgICAgICAgTWF0aC5tYXgoIGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKSAqIHdpZHRoLCAwLjAwMDAwMSApLFxyXG4gICAgICAgIHdpZHRoXHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVPYmplY3QoIHZhbHVlICl7XHJcbiAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVTdGF0ZUZyb21BbHBoYSggYWxwaGEgKXtcclxuICAgIHN0YXRlLmFscGhhID0gZ2V0Q2xhbXBlZEFscGhhKCBhbHBoYSApO1xyXG4gICAgc3RhdGUudmFsdWUgPSBnZXRWYWx1ZUZyb21BbHBoYSggc3RhdGUuYWxwaGEsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcbiAgICBpZiggc3RhdGUudXNlU3RlcCApe1xyXG4gICAgICBzdGF0ZS52YWx1ZSA9IGdldFN0ZXBwZWRWYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLnN0ZXAgKTtcclxuICAgIH1cclxuICAgIHN0YXRlLnZhbHVlID0gZ2V0Q2xhbXBlZFZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGxpc3RlblVwZGF0ZSgpe1xyXG4gICAgc3RhdGUudmFsdWUgPSBnZXRWYWx1ZUZyb21PYmplY3QoKTtcclxuICAgIHN0YXRlLmFscGhhID0gZ2V0QWxwaGFGcm9tVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG4gICAgc3RhdGUuYWxwaGEgPSBnZXRDbGFtcGVkQWxwaGEoIHN0YXRlLmFscGhhICk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZXRWYWx1ZUZyb21PYmplY3QoKXtcclxuICAgIHJldHVybiBwYXJzZUZsb2F0KCBvYmplY3RbIHByb3BlcnR5TmFtZSBdICk7XHJcbiAgfVxyXG5cclxuICBncm91cC5vbkNoYW5nZSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApe1xyXG4gICAgc3RhdGUub25DaGFuZ2VkQ0IgPSBjYWxsYmFjaztcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5zdGVwID0gZnVuY3Rpb24oIHN0ZXAgKXtcclxuICAgIHN0YXRlLnN0ZXAgPSBzdGVwO1xyXG4gICAgc3RhdGUucHJlY2lzaW9uID0gbnVtRGVjaW1hbHMoIHN0YXRlLnN0ZXAgKVxyXG4gICAgc3RhdGUudXNlU3RlcCA9IHRydWU7XHJcblxyXG4gICAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcblxyXG4gICAgdXBkYXRlU3RhdGVGcm9tQWxwaGEoIHN0YXRlLmFscGhhICk7XHJcbiAgICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xyXG4gICAgdXBkYXRlU2xpZGVyKCApO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLmxpc3RlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICBzdGF0ZS5saXN0ZW4gPSB0cnVlO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIGhpdHNjYW5Wb2x1bWUgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBoYW5kbGVQcmVzcyApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ3ByZXNzaW5nJywgaGFuZGxlSG9sZCApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUmVsZWFzZWQnLCBoYW5kbGVSZWxlYXNlICk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVByZXNzKCBwICl7XHJcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgc3RhdGUucHJlc3NpbmcgPSB0cnVlO1xyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlSG9sZCggeyBwb2ludCB9ID0ge30gKXtcclxuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGUucHJlc3NpbmcgPSB0cnVlO1xyXG5cclxuICAgIGZpbGxlZFZvbHVtZS51cGRhdGVNYXRyaXhXb3JsZCgpO1xyXG4gICAgZW5kTG9jYXRvci51cGRhdGVNYXRyaXhXb3JsZCgpO1xyXG5cclxuICAgIGNvbnN0IGEgPSBuZXcgVEhSRUUuVmVjdG9yMygpLnNldEZyb21NYXRyaXhQb3NpdGlvbiggZmlsbGVkVm9sdW1lLm1hdHJpeFdvcmxkICk7XHJcbiAgICBjb25zdCBiID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGVuZExvY2F0b3IubWF0cml4V29ybGQgKTtcclxuXHJcbiAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gc3RhdGUudmFsdWU7XHJcblxyXG4gICAgdXBkYXRlU3RhdGVGcm9tQWxwaGEoIGdldFBvaW50QWxwaGEoIHBvaW50LCB7YSxifSApICk7XHJcbiAgICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xyXG4gICAgdXBkYXRlU2xpZGVyKCApO1xyXG4gICAgdXBkYXRlT2JqZWN0KCBzdGF0ZS52YWx1ZSApO1xyXG5cclxuICAgIGlmKCBwcmV2aW91c1ZhbHVlICE9PSBzdGF0ZS52YWx1ZSAmJiBzdGF0ZS5vbkNoYW5nZWRDQiApe1xyXG4gICAgICBzdGF0ZS5vbkNoYW5nZWRDQiggc3RhdGUudmFsdWUgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVJlbGVhc2UoKXtcclxuICAgIHN0YXRlLnByZXNzaW5nID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBncm91cC5pbnRlcmFjdGlvbiA9IGludGVyYWN0aW9uO1xyXG4gIGdyb3VwLmhpdHNjYW4gPSBbIGhpdHNjYW5Wb2x1bWUsIHBhbmVsIF07XHJcblxyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcbiAgY29uc3QgcGFsZXR0ZUludGVyYWN0aW9uID0gUGFsZXR0ZS5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcclxuXHJcbiAgZ3JvdXAudXBkYXRlQ29udHJvbCA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHBhbGV0dGVJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG5cclxuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcclxuICAgICAgbGlzdGVuVXBkYXRlKCk7XHJcbiAgICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XHJcbiAgICAgIHVwZGF0ZVNsaWRlcigpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlVmlldygpO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlTGFiZWwoIHN0ciApO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLm1pbiA9IGZ1bmN0aW9uKCBtICl7XHJcbiAgICBzdGF0ZS5taW4gPSBtO1xyXG4gICAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcbiAgICB1cGRhdGVTdGF0ZUZyb21BbHBoYSggc3RhdGUuYWxwaGEgKTtcclxuICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XHJcbiAgICB1cGRhdGVTbGlkZXIoICk7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAubWF4ID0gZnVuY3Rpb24oIG0gKXtcclxuICAgIHN0YXRlLm1heCA9IG07XHJcbiAgICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcclxuICAgIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBzdGF0ZS5hbHBoYSApO1xyXG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcclxuICAgIHVwZGF0ZVNsaWRlciggKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn1cclxuXHJcbmNvbnN0IHRhID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuY29uc3QgdGIgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG5jb25zdCB0VG9BID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuY29uc3QgYVRvQiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcblxyXG5mdW5jdGlvbiBnZXRQb2ludEFscGhhKCBwb2ludCwgc2VnbWVudCApe1xyXG4gIHRhLmNvcHkoIHNlZ21lbnQuYiApLnN1Yiggc2VnbWVudC5hICk7XHJcbiAgdGIuY29weSggcG9pbnQgKS5zdWIoIHNlZ21lbnQuYSApO1xyXG5cclxuICBjb25zdCBwcm9qZWN0ZWQgPSB0Yi5wcm9qZWN0T25WZWN0b3IoIHRhICk7XHJcblxyXG4gIHRUb0EuY29weSggcG9pbnQgKS5zdWIoIHNlZ21lbnQuYSApO1xyXG5cclxuICBhVG9CLmNvcHkoIHNlZ21lbnQuYiApLnN1Yiggc2VnbWVudC5hICkubm9ybWFsaXplKCk7XHJcblxyXG4gIGNvbnN0IHNpZGUgPSB0VG9BLm5vcm1hbGl6ZSgpLmRvdCggYVRvQiApID49IDAgPyAxIDogLTE7XHJcblxyXG4gIGNvbnN0IGxlbmd0aCA9IHNlZ21lbnQuYS5kaXN0YW5jZVRvKCBzZWdtZW50LmIgKSAqIHNpZGU7XHJcblxyXG4gIGxldCBhbHBoYSA9IHByb2plY3RlZC5sZW5ndGgoKSAvIGxlbmd0aDtcclxuICBpZiggYWxwaGEgPiAxLjAgKXtcclxuICAgIGFscGhhID0gMS4wO1xyXG4gIH1cclxuICBpZiggYWxwaGEgPCAwLjAgKXtcclxuICAgIGFscGhhID0gMC4wO1xyXG4gIH1cclxuICByZXR1cm4gYWxwaGE7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxlcnAobWluLCBtYXgsIHZhbHVlKSB7XHJcbiAgcmV0dXJuICgxLXZhbHVlKSptaW4gKyB2YWx1ZSptYXg7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hcF9yYW5nZSh2YWx1ZSwgbG93MSwgaGlnaDEsIGxvdzIsIGhpZ2gyKSB7XHJcbiAgICByZXR1cm4gbG93MiArIChoaWdoMiAtIGxvdzIpICogKHZhbHVlIC0gbG93MSkgLyAoaGlnaDEgLSBsb3cxKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2xhbXBlZEFscGhhKCBhbHBoYSApe1xyXG4gIGlmKCBhbHBoYSA+IDEgKXtcclxuICAgIHJldHVybiAxXHJcbiAgfVxyXG4gIGlmKCBhbHBoYSA8IDAgKXtcclxuICAgIHJldHVybiAwO1xyXG4gIH1cclxuICByZXR1cm4gYWxwaGE7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENsYW1wZWRWYWx1ZSggdmFsdWUsIG1pbiwgbWF4ICl7XHJcbiAgaWYoIHZhbHVlIDwgbWluICl7XHJcbiAgICByZXR1cm4gbWluO1xyXG4gIH1cclxuICBpZiggdmFsdWUgPiBtYXggKXtcclxuICAgIHJldHVybiBtYXg7XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW1wbGllZFN0ZXAoIHZhbHVlICl7XHJcbiAgaWYoIHZhbHVlID09PSAwICl7XHJcbiAgICByZXR1cm4gMTsgLy8gV2hhdCBhcmUgd2UsIHBzeWNoaWNzP1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBIZXkgRG91ZywgY2hlY2sgdGhpcyBvdXQuXHJcbiAgICByZXR1cm4gTWF0aC5wb3coMTAsIE1hdGguZmxvb3IoTWF0aC5sb2coTWF0aC5hYnModmFsdWUpKS9NYXRoLkxOMTApKS8xMDtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFZhbHVlRnJvbUFscGhhKCBhbHBoYSwgbWluLCBtYXggKXtcclxuICByZXR1cm4gbWFwX3JhbmdlKCBhbHBoYSwgMC4wLCAxLjAsIG1pbiwgbWF4IClcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QWxwaGFGcm9tVmFsdWUoIHZhbHVlLCBtaW4sIG1heCApe1xyXG4gIHJldHVybiBtYXBfcmFuZ2UoIHZhbHVlLCBtaW4sIG1heCwgMC4wLCAxLjAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U3RlcHBlZFZhbHVlKCB2YWx1ZSwgc3RlcCApe1xyXG4gIGlmKCB2YWx1ZSAlIHN0ZXAgIT0gMCkge1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQoIHZhbHVlIC8gc3RlcCApICogc3RlcDtcclxuICB9XHJcbiAgcmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBudW1EZWNpbWFscyh4KSB7XHJcbiAgeCA9IHgudG9TdHJpbmcoKTtcclxuICBpZiAoeC5pbmRleE9mKCcuJykgPiAtMSkge1xyXG4gICAgcmV0dXJuIHgubGVuZ3RoIC0geC5pbmRleE9mKCcuJykgLSAxO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gMDtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJvdW5kVG9EZWNpbWFsKHZhbHVlLCBkZWNpbWFscykge1xyXG4gIGNvbnN0IHRlblRvID0gTWF0aC5wb3coMTAsIGRlY2ltYWxzKTtcclxuICByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSAqIHRlblRvKSAvIHRlblRvO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVUZXh0TGFiZWwoIHRleHRDcmVhdG9yLCBzdHIsIHdpZHRoID0gMC40LCBkZXB0aCA9IDAuMDI5LCBmZ0NvbG9yID0gMHhmZmZmZmYsIGJnQ29sb3IgPSBDb2xvcnMuREVGQVVMVF9CQUNLLCBzY2FsZSA9IDEuMCApe1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIGNvbnN0IGludGVybmFsUG9zaXRpb25pbmcgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBncm91cC5hZGQoIGludGVybmFsUG9zaXRpb25pbmcgKTtcclxuXHJcbiAgY29uc3QgdGV4dCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggc3RyLCB7IGNvbG9yOiBmZ0NvbG9yLCBzY2FsZSB9ICk7XHJcbiAgaW50ZXJuYWxQb3NpdGlvbmluZy5hZGQoIHRleHQgKTtcclxuXHJcblxyXG4gIGdyb3VwLnNldFN0cmluZyA9IGZ1bmN0aW9uKCBzdHIgKXtcclxuICAgIHRleHQudXBkYXRlTGFiZWwoIHN0ci50b1N0cmluZygpICk7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAuc2V0TnVtYmVyID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgdGV4dC51cGRhdGVMYWJlbCggc3RyLnRvRml4ZWQoMikgKTtcclxuICB9O1xyXG5cclxuICB0ZXh0LnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgY29uc3QgYmFja0JvdW5kcyA9IDAuMDE7XHJcbiAgY29uc3QgbWFyZ2luID0gMC4wMTtcclxuICBjb25zdCB0b3RhbFdpZHRoID0gd2lkdGg7XHJcbiAgY29uc3QgdG90YWxIZWlnaHQgPSAwLjA0ICsgbWFyZ2luICogMjtcclxuICBjb25zdCBsYWJlbEJhY2tHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggdG90YWxXaWR0aCwgdG90YWxIZWlnaHQsIGRlcHRoLCAxLCAxLCAxICk7XHJcbiAgbGFiZWxCYWNrR2VvbWV0cnkuYXBwbHlNYXRyaXgoIG5ldyBUSFJFRS5NYXRyaXg0KCkubWFrZVRyYW5zbGF0aW9uKCB0b3RhbFdpZHRoICogMC41IC0gbWFyZ2luLCAwLCAwICkgKTtcclxuXHJcbiAgY29uc3QgbGFiZWxCYWNrTWVzaCA9IG5ldyBUSFJFRS5NZXNoKCBsYWJlbEJhY2tHZW9tZXRyeSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGxhYmVsQmFja01lc2guZ2VvbWV0cnksIGJnQ29sb3IgKTtcclxuXHJcbiAgbGFiZWxCYWNrTWVzaC5wb3NpdGlvbi55ID0gMC4wMztcclxuICBpbnRlcm5hbFBvc2l0aW9uaW5nLmFkZCggbGFiZWxCYWNrTWVzaCApO1xyXG4gIGludGVybmFsUG9zaXRpb25pbmcucG9zaXRpb24ueSA9IC10b3RhbEhlaWdodCAqIDAuNTtcclxuXHJcbiAgZ3JvdXAuYmFjayA9IGxhYmVsQmFja01lc2g7XHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qXHJcbiAqXHRAYXV0aG9yIHp6ODUgLyBodHRwOi8vdHdpdHRlci5jb20vYmx1cnNwbGluZSAvIGh0dHA6Ly93d3cubGFiNGdhbWVzLm5ldC96ejg1L2Jsb2dcclxuICpcdEBhdXRob3IgY2VudGVyaW9ud2FyZSAvIGh0dHA6Ly93d3cuY2VudGVyaW9ud2FyZS5jb21cclxuICpcclxuICpcdFN1YmRpdmlzaW9uIEdlb21ldHJ5IE1vZGlmaWVyXHJcbiAqXHRcdHVzaW5nIExvb3AgU3ViZGl2aXNpb24gU2NoZW1lXHJcbiAqXHJcbiAqXHRSZWZlcmVuY2VzOlxyXG4gKlx0XHRodHRwOi8vZ3JhcGhpY3Muc3RhbmZvcmQuZWR1L35tZGZpc2hlci9zdWJkaXZpc2lvbi5odG1sXHJcbiAqXHRcdGh0dHA6Ly93d3cuaG9sbWVzM2QubmV0L2dyYXBoaWNzL3N1YmRpdmlzaW9uL1xyXG4gKlx0XHRodHRwOi8vd3d3LmNzLnJ1dGdlcnMuZWR1L35kZWNhcmxvL3JlYWRpbmdzL3N1YmRpdi1zZzAwYy5wZGZcclxuICpcclxuICpcdEtub3duIElzc3VlczpcclxuICpcdFx0LSBjdXJyZW50bHkgZG9lc24ndCBoYW5kbGUgXCJTaGFycCBFZGdlc1wiXHJcbiAqL1xyXG5cclxuVEhSRUUuU3ViZGl2aXNpb25Nb2RpZmllciA9IGZ1bmN0aW9uICggc3ViZGl2aXNpb25zICkge1xyXG5cclxuXHR0aGlzLnN1YmRpdmlzaW9ucyA9ICggc3ViZGl2aXNpb25zID09PSB1bmRlZmluZWQgKSA/IDEgOiBzdWJkaXZpc2lvbnM7XHJcblxyXG59O1xyXG5cclxuLy8gQXBwbGllcyB0aGUgXCJtb2RpZnlcIiBwYXR0ZXJuXHJcblRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIucHJvdG90eXBlLm1vZGlmeSA9IGZ1bmN0aW9uICggZ2VvbWV0cnkgKSB7XHJcblxyXG5cdHZhciByZXBlYXRzID0gdGhpcy5zdWJkaXZpc2lvbnM7XHJcblxyXG5cdHdoaWxlICggcmVwZWF0cyAtLSA+IDAgKSB7XHJcblxyXG5cdFx0dGhpcy5zbW9vdGgoIGdlb21ldHJ5ICk7XHJcblxyXG5cdH1cclxuXHJcblx0Z2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKCk7XHJcblx0Z2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKTtcclxuXHJcbn07XHJcblxyXG4oIGZ1bmN0aW9uKCkge1xyXG5cclxuXHQvLyBTb21lIGNvbnN0YW50c1xyXG5cdHZhciBXQVJOSU5HUyA9ICEgdHJ1ZTsgLy8gU2V0IHRvIHRydWUgZm9yIGRldmVsb3BtZW50XHJcblx0dmFyIEFCQyA9IFsgJ2EnLCAnYicsICdjJyBdO1xyXG5cclxuXHJcblx0ZnVuY3Rpb24gZ2V0RWRnZSggYSwgYiwgbWFwICkge1xyXG5cclxuXHRcdHZhciB2ZXJ0ZXhJbmRleEEgPSBNYXRoLm1pbiggYSwgYiApO1xyXG5cdFx0dmFyIHZlcnRleEluZGV4QiA9IE1hdGgubWF4KCBhLCBiICk7XHJcblxyXG5cdFx0dmFyIGtleSA9IHZlcnRleEluZGV4QSArIFwiX1wiICsgdmVydGV4SW5kZXhCO1xyXG5cclxuXHRcdHJldHVybiBtYXBbIGtleSBdO1xyXG5cclxuXHR9XHJcblxyXG5cclxuXHRmdW5jdGlvbiBwcm9jZXNzRWRnZSggYSwgYiwgdmVydGljZXMsIG1hcCwgZmFjZSwgbWV0YVZlcnRpY2VzICkge1xyXG5cclxuXHRcdHZhciB2ZXJ0ZXhJbmRleEEgPSBNYXRoLm1pbiggYSwgYiApO1xyXG5cdFx0dmFyIHZlcnRleEluZGV4QiA9IE1hdGgubWF4KCBhLCBiICk7XHJcblxyXG5cdFx0dmFyIGtleSA9IHZlcnRleEluZGV4QSArIFwiX1wiICsgdmVydGV4SW5kZXhCO1xyXG5cclxuXHRcdHZhciBlZGdlO1xyXG5cclxuXHRcdGlmICgga2V5IGluIG1hcCApIHtcclxuXHJcblx0XHRcdGVkZ2UgPSBtYXBbIGtleSBdO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHR2YXIgdmVydGV4QSA9IHZlcnRpY2VzWyB2ZXJ0ZXhJbmRleEEgXTtcclxuXHRcdFx0dmFyIHZlcnRleEIgPSB2ZXJ0aWNlc1sgdmVydGV4SW5kZXhCIF07XHJcblxyXG5cdFx0XHRlZGdlID0ge1xyXG5cclxuXHRcdFx0XHRhOiB2ZXJ0ZXhBLCAvLyBwb2ludGVyIHJlZmVyZW5jZVxyXG5cdFx0XHRcdGI6IHZlcnRleEIsXHJcblx0XHRcdFx0bmV3RWRnZTogbnVsbCxcclxuXHRcdFx0XHQvLyBhSW5kZXg6IGEsIC8vIG51bWJlcmVkIHJlZmVyZW5jZVxyXG5cdFx0XHRcdC8vIGJJbmRleDogYixcclxuXHRcdFx0XHRmYWNlczogW10gLy8gcG9pbnRlcnMgdG8gZmFjZVxyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdG1hcFsga2V5IF0gPSBlZGdlO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRlZGdlLmZhY2VzLnB1c2goIGZhY2UgKTtcclxuXHJcblx0XHRtZXRhVmVydGljZXNbIGEgXS5lZGdlcy5wdXNoKCBlZGdlICk7XHJcblx0XHRtZXRhVmVydGljZXNbIGIgXS5lZGdlcy5wdXNoKCBlZGdlICk7XHJcblxyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdlbmVyYXRlTG9va3VwcyggdmVydGljZXMsIGZhY2VzLCBtZXRhVmVydGljZXMsIGVkZ2VzICkge1xyXG5cclxuXHRcdHZhciBpLCBpbCwgZmFjZSwgZWRnZTtcclxuXHJcblx0XHRmb3IgKCBpID0gMCwgaWwgPSB2ZXJ0aWNlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcclxuXHJcblx0XHRcdG1ldGFWZXJ0aWNlc1sgaSBdID0geyBlZGdlczogW10gfTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICggaSA9IDAsIGlsID0gZmFjZXMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XHJcblxyXG5cdFx0XHRmYWNlID0gZmFjZXNbIGkgXTtcclxuXHJcblx0XHRcdHByb2Nlc3NFZGdlKCBmYWNlLmEsIGZhY2UuYiwgdmVydGljZXMsIGVkZ2VzLCBmYWNlLCBtZXRhVmVydGljZXMgKTtcclxuXHRcdFx0cHJvY2Vzc0VkZ2UoIGZhY2UuYiwgZmFjZS5jLCB2ZXJ0aWNlcywgZWRnZXMsIGZhY2UsIG1ldGFWZXJ0aWNlcyApO1xyXG5cdFx0XHRwcm9jZXNzRWRnZSggZmFjZS5jLCBmYWNlLmEsIHZlcnRpY2VzLCBlZGdlcywgZmFjZSwgbWV0YVZlcnRpY2VzICk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG5ld0ZhY2UoIG5ld0ZhY2VzLCBhLCBiLCBjICkge1xyXG5cclxuXHRcdG5ld0ZhY2VzLnB1c2goIG5ldyBUSFJFRS5GYWNlMyggYSwgYiwgYyApICk7XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbWlkcG9pbnQoIGEsIGIgKSB7XHJcblxyXG5cdFx0cmV0dXJuICggTWF0aC5hYnMoIGIgLSBhICkgLyAyICkgKyBNYXRoLm1pbiggYSwgYiApO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG5ld1V2KCBuZXdVdnMsIGEsIGIsIGMgKSB7XHJcblxyXG5cdFx0bmV3VXZzLnB1c2goIFsgYS5jbG9uZSgpLCBiLmNsb25lKCksIGMuY2xvbmUoKSBdICk7XHJcblxyXG5cdH1cclxuXHJcblx0Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblx0Ly8gUGVyZm9ybXMgb25lIGl0ZXJhdGlvbiBvZiBTdWJkaXZpc2lvblxyXG5cdFRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIucHJvdG90eXBlLnNtb290aCA9IGZ1bmN0aW9uICggZ2VvbWV0cnkgKSB7XHJcblxyXG5cdFx0dmFyIHRtcCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcblxyXG5cdFx0dmFyIG9sZFZlcnRpY2VzLCBvbGRGYWNlcywgb2xkVXZzO1xyXG5cdFx0dmFyIG5ld1ZlcnRpY2VzLCBuZXdGYWNlcywgbmV3VVZzID0gW107XHJcblxyXG5cdFx0dmFyIG4sIGwsIGksIGlsLCBqLCBrO1xyXG5cdFx0dmFyIG1ldGFWZXJ0aWNlcywgc291cmNlRWRnZXM7XHJcblxyXG5cdFx0Ly8gbmV3IHN0dWZmLlxyXG5cdFx0dmFyIHNvdXJjZUVkZ2VzLCBuZXdFZGdlVmVydGljZXMsIG5ld1NvdXJjZVZlcnRpY2VzO1xyXG5cclxuXHRcdG9sZFZlcnRpY2VzID0gZ2VvbWV0cnkudmVydGljZXM7IC8vIHsgeCwgeSwgen1cclxuXHRcdG9sZEZhY2VzID0gZ2VvbWV0cnkuZmFjZXM7IC8vIHsgYTogb2xkVmVydGV4MSwgYjogb2xkVmVydGV4MiwgYzogb2xkVmVydGV4MyB9XHJcblx0XHRvbGRVdnMgPSBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWyAwIF07XHJcblxyXG5cdFx0dmFyIGhhc1V2cyA9IG9sZFV2cyAhPT0gdW5kZWZpbmVkICYmIG9sZFV2cy5sZW5ndGggPiAwO1xyXG5cclxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHRcdCAqXHJcblx0XHQgKiBTdGVwIDA6IFByZXByb2Nlc3MgR2VvbWV0cnkgdG8gR2VuZXJhdGUgZWRnZXMgTG9va3VwXHJcblx0XHQgKlxyXG5cdFx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG5cdFx0bWV0YVZlcnRpY2VzID0gbmV3IEFycmF5KCBvbGRWZXJ0aWNlcy5sZW5ndGggKTtcclxuXHRcdHNvdXJjZUVkZ2VzID0ge307IC8vIEVkZ2UgPT4geyBvbGRWZXJ0ZXgxLCBvbGRWZXJ0ZXgyLCBmYWNlc1tdICB9XHJcblxyXG5cdFx0Z2VuZXJhdGVMb29rdXBzKCBvbGRWZXJ0aWNlcywgb2xkRmFjZXMsIG1ldGFWZXJ0aWNlcywgc291cmNlRWRnZXMgKTtcclxuXHJcblxyXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdFx0ICpcclxuXHRcdCAqXHRTdGVwIDEuXHJcblx0XHQgKlx0Rm9yIGVhY2ggZWRnZSwgY3JlYXRlIGEgbmV3IEVkZ2UgVmVydGV4LFxyXG5cdFx0ICpcdHRoZW4gcG9zaXRpb24gaXQuXHJcblx0XHQgKlxyXG5cdFx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG5cdFx0bmV3RWRnZVZlcnRpY2VzID0gW107XHJcblx0XHR2YXIgb3RoZXIsIGN1cnJlbnRFZGdlLCBuZXdFZGdlLCBmYWNlO1xyXG5cdFx0dmFyIGVkZ2VWZXJ0ZXhXZWlnaHQsIGFkamFjZW50VmVydGV4V2VpZ2h0LCBjb25uZWN0ZWRGYWNlcztcclxuXHJcblx0XHRmb3IgKCBpIGluIHNvdXJjZUVkZ2VzICkge1xyXG5cclxuXHRcdFx0Y3VycmVudEVkZ2UgPSBzb3VyY2VFZGdlc1sgaSBdO1xyXG5cdFx0XHRuZXdFZGdlID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuXHJcblx0XHRcdGVkZ2VWZXJ0ZXhXZWlnaHQgPSAzIC8gODtcclxuXHRcdFx0YWRqYWNlbnRWZXJ0ZXhXZWlnaHQgPSAxIC8gODtcclxuXHJcblx0XHRcdGNvbm5lY3RlZEZhY2VzID0gY3VycmVudEVkZ2UuZmFjZXMubGVuZ3RoO1xyXG5cclxuXHRcdFx0Ly8gY2hlY2sgaG93IG1hbnkgbGlua2VkIGZhY2VzLiAyIHNob3VsZCBiZSBjb3JyZWN0LlxyXG5cdFx0XHRpZiAoIGNvbm5lY3RlZEZhY2VzICE9IDIgKSB7XHJcblxyXG5cdFx0XHRcdC8vIGlmIGxlbmd0aCBpcyBub3QgMiwgaGFuZGxlIGNvbmRpdGlvblxyXG5cdFx0XHRcdGVkZ2VWZXJ0ZXhXZWlnaHQgPSAwLjU7XHJcblx0XHRcdFx0YWRqYWNlbnRWZXJ0ZXhXZWlnaHQgPSAwO1xyXG5cclxuXHRcdFx0XHRpZiAoIGNvbm5lY3RlZEZhY2VzICE9IDEgKSB7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBXQVJOSU5HUyApIGNvbnNvbGUud2FybiggJ1N1YmRpdmlzaW9uIE1vZGlmaWVyOiBOdW1iZXIgb2YgY29ubmVjdGVkIGZhY2VzICE9IDIsIGlzOiAnLCBjb25uZWN0ZWRGYWNlcywgY3VycmVudEVkZ2UgKTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bmV3RWRnZS5hZGRWZWN0b3JzKCBjdXJyZW50RWRnZS5hLCBjdXJyZW50RWRnZS5iICkubXVsdGlwbHlTY2FsYXIoIGVkZ2VWZXJ0ZXhXZWlnaHQgKTtcclxuXHJcblx0XHRcdHRtcC5zZXQoIDAsIDAsIDAgKTtcclxuXHJcblx0XHRcdGZvciAoIGogPSAwOyBqIDwgY29ubmVjdGVkRmFjZXM7IGogKysgKSB7XHJcblxyXG5cdFx0XHRcdGZhY2UgPSBjdXJyZW50RWRnZS5mYWNlc1sgaiBdO1xyXG5cclxuXHRcdFx0XHRmb3IgKCBrID0gMDsgayA8IDM7IGsgKysgKSB7XHJcblxyXG5cdFx0XHRcdFx0b3RoZXIgPSBvbGRWZXJ0aWNlc1sgZmFjZVsgQUJDWyBrIF0gXSBdO1xyXG5cdFx0XHRcdFx0aWYgKCBvdGhlciAhPT0gY3VycmVudEVkZ2UuYSAmJiBvdGhlciAhPT0gY3VycmVudEVkZ2UuYiApIGJyZWFrO1xyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRtcC5hZGQoIG90aGVyICk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0bXAubXVsdGlwbHlTY2FsYXIoIGFkamFjZW50VmVydGV4V2VpZ2h0ICk7XHJcblx0XHRcdG5ld0VkZ2UuYWRkKCB0bXAgKTtcclxuXHJcblx0XHRcdGN1cnJlbnRFZGdlLm5ld0VkZ2UgPSBuZXdFZGdlVmVydGljZXMubGVuZ3RoO1xyXG5cdFx0XHRuZXdFZGdlVmVydGljZXMucHVzaCggbmV3RWRnZSApO1xyXG5cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coY3VycmVudEVkZ2UsIG5ld0VkZ2UpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcblx0XHQgKlxyXG5cdFx0ICpcdFN0ZXAgMi5cclxuXHRcdCAqXHRSZXBvc2l0aW9uIGVhY2ggc291cmNlIHZlcnRpY2VzLlxyXG5cdFx0ICpcclxuXHRcdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuXHRcdHZhciBiZXRhLCBzb3VyY2VWZXJ0ZXhXZWlnaHQsIGNvbm5lY3RpbmdWZXJ0ZXhXZWlnaHQ7XHJcblx0XHR2YXIgY29ubmVjdGluZ0VkZ2UsIGNvbm5lY3RpbmdFZGdlcywgb2xkVmVydGV4LCBuZXdTb3VyY2VWZXJ0ZXg7XHJcblx0XHRuZXdTb3VyY2VWZXJ0aWNlcyA9IFtdO1xyXG5cclxuXHRcdGZvciAoIGkgPSAwLCBpbCA9IG9sZFZlcnRpY2VzLmxlbmd0aDsgaSA8IGlsOyBpICsrICkge1xyXG5cclxuXHRcdFx0b2xkVmVydGV4ID0gb2xkVmVydGljZXNbIGkgXTtcclxuXHJcblx0XHRcdC8vIGZpbmQgYWxsIGNvbm5lY3RpbmcgZWRnZXMgKHVzaW5nIGxvb2t1cFRhYmxlKVxyXG5cdFx0XHRjb25uZWN0aW5nRWRnZXMgPSBtZXRhVmVydGljZXNbIGkgXS5lZGdlcztcclxuXHRcdFx0biA9IGNvbm5lY3RpbmdFZGdlcy5sZW5ndGg7XHJcblxyXG5cdFx0XHRpZiAoIG4gPT0gMyApIHtcclxuXHJcblx0XHRcdFx0YmV0YSA9IDMgLyAxNjtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoIG4gPiAzICkge1xyXG5cclxuXHRcdFx0XHRiZXRhID0gMyAvICggOCAqIG4gKTsgLy8gV2FycmVuJ3MgbW9kaWZpZWQgZm9ybXVsYVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gTG9vcCdzIG9yaWdpbmFsIGJldGEgZm9ybXVsYVxyXG5cdFx0XHQvLyBiZXRhID0gMSAvIG4gKiAoIDUvOCAtIE1hdGgucG93KCAzLzggKyAxLzQgKiBNYXRoLmNvcyggMiAqIE1hdGguIFBJIC8gbiApLCAyKSApO1xyXG5cclxuXHRcdFx0c291cmNlVmVydGV4V2VpZ2h0ID0gMSAtIG4gKiBiZXRhO1xyXG5cdFx0XHRjb25uZWN0aW5nVmVydGV4V2VpZ2h0ID0gYmV0YTtcclxuXHJcblx0XHRcdGlmICggbiA8PSAyICkge1xyXG5cclxuXHRcdFx0XHQvLyBjcmVhc2UgYW5kIGJvdW5kYXJ5IHJ1bGVzXHJcblx0XHRcdFx0Ly8gY29uc29sZS53YXJuKCdjcmVhc2UgYW5kIGJvdW5kYXJ5IHJ1bGVzJyk7XHJcblxyXG5cdFx0XHRcdGlmICggbiA9PSAyICkge1xyXG5cclxuXHRcdFx0XHRcdGlmICggV0FSTklOR1MgKSBjb25zb2xlLndhcm4oICcyIGNvbm5lY3RpbmcgZWRnZXMnLCBjb25uZWN0aW5nRWRnZXMgKTtcclxuXHRcdFx0XHRcdHNvdXJjZVZlcnRleFdlaWdodCA9IDMgLyA0O1xyXG5cdFx0XHRcdFx0Y29ubmVjdGluZ1ZlcnRleFdlaWdodCA9IDEgLyA4O1xyXG5cclxuXHRcdFx0XHRcdC8vIHNvdXJjZVZlcnRleFdlaWdodCA9IDE7XHJcblx0XHRcdFx0XHQvLyBjb25uZWN0aW5nVmVydGV4V2VpZ2h0ID0gMDtcclxuXHJcblx0XHRcdFx0fSBlbHNlIGlmICggbiA9PSAxICkge1xyXG5cclxuXHRcdFx0XHRcdGlmICggV0FSTklOR1MgKSBjb25zb2xlLndhcm4oICdvbmx5IDEgY29ubmVjdGluZyBlZGdlJyApO1xyXG5cclxuXHRcdFx0XHR9IGVsc2UgaWYgKCBuID09IDAgKSB7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBXQVJOSU5HUyApIGNvbnNvbGUud2FybiggJzAgY29ubmVjdGluZyBlZGdlcycgKTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bmV3U291cmNlVmVydGV4ID0gb2xkVmVydGV4LmNsb25lKCkubXVsdGlwbHlTY2FsYXIoIHNvdXJjZVZlcnRleFdlaWdodCApO1xyXG5cclxuXHRcdFx0dG1wLnNldCggMCwgMCwgMCApO1xyXG5cclxuXHRcdFx0Zm9yICggaiA9IDA7IGogPCBuOyBqICsrICkge1xyXG5cclxuXHRcdFx0XHRjb25uZWN0aW5nRWRnZSA9IGNvbm5lY3RpbmdFZGdlc1sgaiBdO1xyXG5cdFx0XHRcdG90aGVyID0gY29ubmVjdGluZ0VkZ2UuYSAhPT0gb2xkVmVydGV4ID8gY29ubmVjdGluZ0VkZ2UuYSA6IGNvbm5lY3RpbmdFZGdlLmI7XHJcblx0XHRcdFx0dG1wLmFkZCggb3RoZXIgKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRtcC5tdWx0aXBseVNjYWxhciggY29ubmVjdGluZ1ZlcnRleFdlaWdodCApO1xyXG5cdFx0XHRuZXdTb3VyY2VWZXJ0ZXguYWRkKCB0bXAgKTtcclxuXHJcblx0XHRcdG5ld1NvdXJjZVZlcnRpY2VzLnB1c2goIG5ld1NvdXJjZVZlcnRleCApO1xyXG5cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5cdFx0ICpcclxuXHRcdCAqXHRTdGVwIDMuXHJcblx0XHQgKlx0R2VuZXJhdGUgRmFjZXMgYmV0d2VlbiBzb3VyY2UgdmVydGljZXNcclxuXHRcdCAqXHRhbmQgZWRnZSB2ZXJ0aWNlcy5cclxuXHRcdCAqXHJcblx0XHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcblx0XHRuZXdWZXJ0aWNlcyA9IG5ld1NvdXJjZVZlcnRpY2VzLmNvbmNhdCggbmV3RWRnZVZlcnRpY2VzICk7XHJcblx0XHR2YXIgc2wgPSBuZXdTb3VyY2VWZXJ0aWNlcy5sZW5ndGgsIGVkZ2UxLCBlZGdlMiwgZWRnZTM7XHJcblx0XHRuZXdGYWNlcyA9IFtdO1xyXG5cclxuXHRcdHZhciB1diwgeDAsIHgxLCB4MjtcclxuXHRcdHZhciB4MyA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcblx0XHR2YXIgeDQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xyXG5cdFx0dmFyIHg1ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuXHJcblx0XHRmb3IgKCBpID0gMCwgaWwgPSBvbGRGYWNlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcclxuXHJcblx0XHRcdGZhY2UgPSBvbGRGYWNlc1sgaSBdO1xyXG5cclxuXHRcdFx0Ly8gZmluZCB0aGUgMyBuZXcgZWRnZXMgdmVydGV4IG9mIGVhY2ggb2xkIGZhY2VcclxuXHJcblx0XHRcdGVkZ2UxID0gZ2V0RWRnZSggZmFjZS5hLCBmYWNlLmIsIHNvdXJjZUVkZ2VzICkubmV3RWRnZSArIHNsO1xyXG5cdFx0XHRlZGdlMiA9IGdldEVkZ2UoIGZhY2UuYiwgZmFjZS5jLCBzb3VyY2VFZGdlcyApLm5ld0VkZ2UgKyBzbDtcclxuXHRcdFx0ZWRnZTMgPSBnZXRFZGdlKCBmYWNlLmMsIGZhY2UuYSwgc291cmNlRWRnZXMgKS5uZXdFZGdlICsgc2w7XHJcblxyXG5cdFx0XHQvLyBjcmVhdGUgNCBmYWNlcy5cclxuXHJcblx0XHRcdG5ld0ZhY2UoIG5ld0ZhY2VzLCBlZGdlMSwgZWRnZTIsIGVkZ2UzICk7XHJcblx0XHRcdG5ld0ZhY2UoIG5ld0ZhY2VzLCBmYWNlLmEsIGVkZ2UxLCBlZGdlMyApO1xyXG5cdFx0XHRuZXdGYWNlKCBuZXdGYWNlcywgZmFjZS5iLCBlZGdlMiwgZWRnZTEgKTtcclxuXHRcdFx0bmV3RmFjZSggbmV3RmFjZXMsIGZhY2UuYywgZWRnZTMsIGVkZ2UyICk7XHJcblxyXG5cdFx0XHQvLyBjcmVhdGUgNCBuZXcgdXYnc1xyXG5cclxuXHRcdFx0aWYgKCBoYXNVdnMgKSB7XHJcblxyXG5cdFx0XHRcdHV2ID0gb2xkVXZzWyBpIF07XHJcblxyXG5cdFx0XHRcdHgwID0gdXZbIDAgXTtcclxuXHRcdFx0XHR4MSA9IHV2WyAxIF07XHJcblx0XHRcdFx0eDIgPSB1dlsgMiBdO1xyXG5cclxuXHRcdFx0XHR4My5zZXQoIG1pZHBvaW50KCB4MC54LCB4MS54ICksIG1pZHBvaW50KCB4MC55LCB4MS55ICkgKTtcclxuXHRcdFx0XHR4NC5zZXQoIG1pZHBvaW50KCB4MS54LCB4Mi54ICksIG1pZHBvaW50KCB4MS55LCB4Mi55ICkgKTtcclxuXHRcdFx0XHR4NS5zZXQoIG1pZHBvaW50KCB4MC54LCB4Mi54ICksIG1pZHBvaW50KCB4MC55LCB4Mi55ICkgKTtcclxuXHJcblx0XHRcdFx0bmV3VXYoIG5ld1VWcywgeDMsIHg0LCB4NSApO1xyXG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgwLCB4MywgeDUgKTtcclxuXHJcblx0XHRcdFx0bmV3VXYoIG5ld1VWcywgeDEsIHg0LCB4MyApO1xyXG5cdFx0XHRcdG5ld1V2KCBuZXdVVnMsIHgyLCB4NSwgeDQgKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gT3ZlcndyaXRlIG9sZCBhcnJheXNcclxuXHRcdGdlb21ldHJ5LnZlcnRpY2VzID0gbmV3VmVydGljZXM7XHJcblx0XHRnZW9tZXRyeS5mYWNlcyA9IG5ld0ZhY2VzO1xyXG5cdFx0aWYgKCBoYXNVdnMgKSBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWyAwIF0gPSBuZXdVVnM7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ2RvbmUnKTtcclxuXHJcblx0fTtcclxuXHJcbn0gKSgpO1xyXG4iLCJ2YXIgc3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuQXJyYXlcblxuZnVuY3Rpb24gYW5BcnJheShhcnIpIHtcbiAgcmV0dXJuIChcbiAgICAgICBhcnIuQllURVNfUEVSX0VMRU1FTlRcbiAgICAmJiBzdHIuY2FsbChhcnIuYnVmZmVyKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJ1xuICAgIHx8IEFycmF5LmlzQXJyYXkoYXJyKVxuICApXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG51bXR5cGUobnVtLCBkZWYpIHtcblx0cmV0dXJuIHR5cGVvZiBudW0gPT09ICdudW1iZXInXG5cdFx0PyBudW0gXG5cdFx0OiAodHlwZW9mIGRlZiA9PT0gJ251bWJlcicgPyBkZWYgOiAwKVxufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZHR5cGUpIHtcbiAgc3dpdGNoIChkdHlwZSkge1xuICAgIGNhc2UgJ2ludDgnOlxuICAgICAgcmV0dXJuIEludDhBcnJheVxuICAgIGNhc2UgJ2ludDE2JzpcbiAgICAgIHJldHVybiBJbnQxNkFycmF5XG4gICAgY2FzZSAnaW50MzInOlxuICAgICAgcmV0dXJuIEludDMyQXJyYXlcbiAgICBjYXNlICd1aW50OCc6XG4gICAgICByZXR1cm4gVWludDhBcnJheVxuICAgIGNhc2UgJ3VpbnQxNic6XG4gICAgICByZXR1cm4gVWludDE2QXJyYXlcbiAgICBjYXNlICd1aW50MzInOlxuICAgICAgcmV0dXJuIFVpbnQzMkFycmF5XG4gICAgY2FzZSAnZmxvYXQzMic6XG4gICAgICByZXR1cm4gRmxvYXQzMkFycmF5XG4gICAgY2FzZSAnZmxvYXQ2NCc6XG4gICAgICByZXR1cm4gRmxvYXQ2NEFycmF5XG4gICAgY2FzZSAnYXJyYXknOlxuICAgICAgcmV0dXJuIEFycmF5XG4gICAgY2FzZSAndWludDhfY2xhbXBlZCc6XG4gICAgICByZXR1cm4gVWludDhDbGFtcGVkQXJyYXlcbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLyplc2xpbnQgbmV3LWNhcDowKi9cbnZhciBkdHlwZSA9IHJlcXVpcmUoJ2R0eXBlJylcbm1vZHVsZS5leHBvcnRzID0gZmxhdHRlblZlcnRleERhdGFcbmZ1bmN0aW9uIGZsYXR0ZW5WZXJ0ZXhEYXRhIChkYXRhLCBvdXRwdXQsIG9mZnNldCkge1xuICBpZiAoIWRhdGEpIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3BlY2lmeSBkYXRhIGFzIGZpcnN0IHBhcmFtZXRlcicpXG4gIG9mZnNldCA9ICsob2Zmc2V0IHx8IDApIHwgMFxuXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIEFycmF5LmlzQXJyYXkoZGF0YVswXSkpIHtcbiAgICB2YXIgZGltID0gZGF0YVswXS5sZW5ndGhcbiAgICB2YXIgbGVuZ3RoID0gZGF0YS5sZW5ndGggKiBkaW1cblxuICAgIC8vIG5vIG91dHB1dCBzcGVjaWZpZWQsIGNyZWF0ZSBhIG5ldyB0eXBlZCBhcnJheVxuICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvdXRwdXQgPSBuZXcgKGR0eXBlKG91dHB1dCB8fCAnZmxvYXQzMicpKShsZW5ndGggKyBvZmZzZXQpXG4gICAgfVxuXG4gICAgdmFyIGRzdExlbmd0aCA9IG91dHB1dC5sZW5ndGggLSBvZmZzZXRcbiAgICBpZiAobGVuZ3RoICE9PSBkc3RMZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc291cmNlIGxlbmd0aCAnICsgbGVuZ3RoICsgJyAoJyArIGRpbSArICd4JyArIGRhdGEubGVuZ3RoICsgJyknICtcbiAgICAgICAgJyBkb2VzIG5vdCBtYXRjaCBkZXN0aW5hdGlvbiBsZW5ndGggJyArIGRzdExlbmd0aClcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMCwgayA9IG9mZnNldDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZGltOyBqKyspIHtcbiAgICAgICAgb3V0cHV0W2srK10gPSBkYXRhW2ldW2pdXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICghb3V0cHV0IHx8IHR5cGVvZiBvdXRwdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBubyBvdXRwdXQsIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgIHZhciBDdG9yID0gZHR5cGUob3V0cHV0IHx8ICdmbG9hdDMyJylcbiAgICAgIGlmIChvZmZzZXQgPT09IDApIHtcbiAgICAgICAgb3V0cHV0ID0gbmV3IEN0b3IoZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dCA9IG5ldyBDdG9yKGRhdGEubGVuZ3RoICsgb2Zmc2V0KVxuICAgICAgICBvdXRwdXQuc2V0KGRhdGEsIG9mZnNldClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc3RvcmUgb3V0cHV0IGluIGV4aXN0aW5nIGFycmF5XG4gICAgICBvdXRwdXQuc2V0KGRhdGEsIG9mZnNldClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3V0cHV0XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBpbGUocHJvcGVydHkpIHtcblx0aWYgKCFwcm9wZXJ0eSB8fCB0eXBlb2YgcHJvcGVydHkgIT09ICdzdHJpbmcnKVxuXHRcdHRocm93IG5ldyBFcnJvcignbXVzdCBzcGVjaWZ5IHByb3BlcnR5IGZvciBpbmRleG9mIHNlYXJjaCcpXG5cblx0cmV0dXJuIG5ldyBGdW5jdGlvbignYXJyYXknLCAndmFsdWUnLCAnc3RhcnQnLCBbXG5cdFx0J3N0YXJ0ID0gc3RhcnQgfHwgMCcsXG5cdFx0J2ZvciAodmFyIGk9c3RhcnQ7IGk8YXJyYXkubGVuZ3RoOyBpKyspJyxcblx0XHQnICBpZiAoYXJyYXlbaV1bXCInICsgcHJvcGVydHkgKydcIl0gPT09IHZhbHVlKScsXG5cdFx0JyAgICAgIHJldHVybiBpJyxcblx0XHQncmV0dXJuIC0xJ1xuXHRdLmpvaW4oJ1xcbicpKVxufSIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwidmFyIHdvcmRXcmFwID0gcmVxdWlyZSgnd29yZC13cmFwcGVyJylcbnZhciB4dGVuZCA9IHJlcXVpcmUoJ3h0ZW5kJylcbnZhciBmaW5kQ2hhciA9IHJlcXVpcmUoJ2luZGV4b2YtcHJvcGVydHknKSgnaWQnKVxudmFyIG51bWJlciA9IHJlcXVpcmUoJ2FzLW51bWJlcicpXG5cbnZhciBYX0hFSUdIVFMgPSBbJ3gnLCAnZScsICdhJywgJ28nLCAnbicsICdzJywgJ3InLCAnYycsICd1JywgJ20nLCAndicsICd3JywgJ3onXVxudmFyIE1fV0lEVEhTID0gWydtJywgJ3cnXVxudmFyIENBUF9IRUlHSFRTID0gWydIJywgJ0knLCAnTicsICdFJywgJ0YnLCAnSycsICdMJywgJ1QnLCAnVScsICdWJywgJ1cnLCAnWCcsICdZJywgJ1onXVxuXG5cbnZhciBUQUJfSUQgPSAnXFx0Jy5jaGFyQ29kZUF0KDApXG52YXIgU1BBQ0VfSUQgPSAnICcuY2hhckNvZGVBdCgwKVxudmFyIEFMSUdOX0xFRlQgPSAwLCBcbiAgICBBTElHTl9DRU5URVIgPSAxLCBcbiAgICBBTElHTl9SSUdIVCA9IDJcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVMYXlvdXQob3B0KSB7XG4gIHJldHVybiBuZXcgVGV4dExheW91dChvcHQpXG59XG5cbmZ1bmN0aW9uIFRleHRMYXlvdXQob3B0KSB7XG4gIHRoaXMuZ2x5cGhzID0gW11cbiAgdGhpcy5fbWVhc3VyZSA9IHRoaXMuY29tcHV0ZU1ldHJpY3MuYmluZCh0aGlzKVxuICB0aGlzLnVwZGF0ZShvcHQpXG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG9wdCkge1xuICBvcHQgPSB4dGVuZCh7XG4gICAgbWVhc3VyZTogdGhpcy5fbWVhc3VyZVxuICB9LCBvcHQpXG4gIHRoaXMuX29wdCA9IG9wdFxuICB0aGlzLl9vcHQudGFiU2l6ZSA9IG51bWJlcih0aGlzLl9vcHQudGFiU2l6ZSwgNClcblxuICBpZiAoIW9wdC5mb250KVxuICAgIHRocm93IG5ldyBFcnJvcignbXVzdCBwcm92aWRlIGEgdmFsaWQgYml0bWFwIGZvbnQnKVxuXG4gIHZhciBnbHlwaHMgPSB0aGlzLmdseXBoc1xuICB2YXIgdGV4dCA9IG9wdC50ZXh0fHwnJyBcbiAgdmFyIGZvbnQgPSBvcHQuZm9udFxuICB0aGlzLl9zZXR1cFNwYWNlR2x5cGhzKGZvbnQpXG4gIFxuICB2YXIgbGluZXMgPSB3b3JkV3JhcC5saW5lcyh0ZXh0LCBvcHQpXG4gIHZhciBtaW5XaWR0aCA9IG9wdC53aWR0aCB8fCAwXG5cbiAgLy9jbGVhciBnbHlwaHNcbiAgZ2x5cGhzLmxlbmd0aCA9IDBcblxuICAvL2dldCBtYXggbGluZSB3aWR0aFxuICB2YXIgbWF4TGluZVdpZHRoID0gbGluZXMucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGxpbmUpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgocHJldiwgbGluZS53aWR0aCwgbWluV2lkdGgpXG4gIH0sIDApXG5cbiAgLy90aGUgcGVuIHBvc2l0aW9uXG4gIHZhciB4ID0gMFxuICB2YXIgeSA9IDBcbiAgdmFyIGxpbmVIZWlnaHQgPSBudW1iZXIob3B0LmxpbmVIZWlnaHQsIGZvbnQuY29tbW9uLmxpbmVIZWlnaHQpXG4gIHZhciBiYXNlbGluZSA9IGZvbnQuY29tbW9uLmJhc2VcbiAgdmFyIGRlc2NlbmRlciA9IGxpbmVIZWlnaHQtYmFzZWxpbmVcbiAgdmFyIGxldHRlclNwYWNpbmcgPSBvcHQubGV0dGVyU3BhY2luZyB8fCAwXG4gIHZhciBoZWlnaHQgPSBsaW5lSGVpZ2h0ICogbGluZXMubGVuZ3RoIC0gZGVzY2VuZGVyXG4gIHZhciBhbGlnbiA9IGdldEFsaWduVHlwZSh0aGlzLl9vcHQuYWxpZ24pXG5cbiAgLy9kcmF3IHRleHQgYWxvbmcgYmFzZWxpbmVcbiAgeSAtPSBoZWlnaHRcbiAgXG4gIC8vdGhlIG1ldHJpY3MgZm9yIHRoaXMgdGV4dCBsYXlvdXRcbiAgdGhpcy5fd2lkdGggPSBtYXhMaW5lV2lkdGhcbiAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0XG4gIHRoaXMuX2Rlc2NlbmRlciA9IGxpbmVIZWlnaHQgLSBiYXNlbGluZVxuICB0aGlzLl9iYXNlbGluZSA9IGJhc2VsaW5lXG4gIHRoaXMuX3hIZWlnaHQgPSBnZXRYSGVpZ2h0KGZvbnQpXG4gIHRoaXMuX2NhcEhlaWdodCA9IGdldENhcEhlaWdodChmb250KVxuICB0aGlzLl9saW5lSGVpZ2h0ID0gbGluZUhlaWdodFxuICB0aGlzLl9hc2NlbmRlciA9IGxpbmVIZWlnaHQgLSBkZXNjZW5kZXIgLSB0aGlzLl94SGVpZ2h0XG4gICAgXG4gIC8vbGF5b3V0IGVhY2ggZ2x5cGhcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSwgbGluZUluZGV4KSB7XG4gICAgdmFyIHN0YXJ0ID0gbGluZS5zdGFydFxuICAgIHZhciBlbmQgPSBsaW5lLmVuZFxuICAgIHZhciBsaW5lV2lkdGggPSBsaW5lLndpZHRoXG4gICAgdmFyIGxhc3RHbHlwaFxuICAgIFxuICAgIC8vZm9yIGVhY2ggZ2x5cGggaW4gdGhhdCBsaW5lLi4uXG4gICAgZm9yICh2YXIgaT1zdGFydDsgaTxlbmQ7IGkrKykge1xuICAgICAgdmFyIGlkID0gdGV4dC5jaGFyQ29kZUF0KGkpXG4gICAgICB2YXIgZ2x5cGggPSBzZWxmLmdldEdseXBoKGZvbnQsIGlkKVxuICAgICAgaWYgKGdseXBoKSB7XG4gICAgICAgIGlmIChsYXN0R2x5cGgpIFxuICAgICAgICAgIHggKz0gZ2V0S2VybmluZyhmb250LCBsYXN0R2x5cGguaWQsIGdseXBoLmlkKVxuXG4gICAgICAgIHZhciB0eCA9IHhcbiAgICAgICAgaWYgKGFsaWduID09PSBBTElHTl9DRU5URVIpIFxuICAgICAgICAgIHR4ICs9IChtYXhMaW5lV2lkdGgtbGluZVdpZHRoKS8yXG4gICAgICAgIGVsc2UgaWYgKGFsaWduID09PSBBTElHTl9SSUdIVClcbiAgICAgICAgICB0eCArPSAobWF4TGluZVdpZHRoLWxpbmVXaWR0aClcblxuICAgICAgICBnbHlwaHMucHVzaCh7XG4gICAgICAgICAgcG9zaXRpb246IFt0eCwgeV0sXG4gICAgICAgICAgZGF0YTogZ2x5cGgsXG4gICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgbGluZTogbGluZUluZGV4XG4gICAgICAgIH0pICBcblxuICAgICAgICAvL21vdmUgcGVuIGZvcndhcmRcbiAgICAgICAgeCArPSBnbHlwaC54YWR2YW5jZSArIGxldHRlclNwYWNpbmdcbiAgICAgICAgbGFzdEdseXBoID0gZ2x5cGhcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL25leHQgbGluZSBkb3duXG4gICAgeSArPSBsaW5lSGVpZ2h0XG4gICAgeCA9IDBcbiAgfSlcbiAgdGhpcy5fbGluZXNUb3RhbCA9IGxpbmVzLmxlbmd0aDtcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuX3NldHVwU3BhY2VHbHlwaHMgPSBmdW5jdGlvbihmb250KSB7XG4gIC8vVGhlc2UgYXJlIGZhbGxiYWNrcywgd2hlbiB0aGUgZm9udCBkb2Vzbid0IGluY2x1ZGVcbiAgLy8nICcgb3IgJ1xcdCcgZ2x5cGhzXG4gIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaCA9IG51bGxcbiAgdGhpcy5fZmFsbGJhY2tUYWJHbHlwaCA9IG51bGxcblxuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuXG5cbiAgLy90cnkgdG8gZ2V0IHNwYWNlIGdseXBoXG4gIC8vdGhlbiBmYWxsIGJhY2sgdG8gdGhlICdtJyBvciAndycgZ2x5cGhzXG4gIC8vdGhlbiBmYWxsIGJhY2sgdG8gdGhlIGZpcnN0IGdseXBoIGF2YWlsYWJsZVxuICB2YXIgc3BhY2UgPSBnZXRHbHlwaEJ5SWQoZm9udCwgU1BBQ0VfSUQpIFxuICAgICAgICAgIHx8IGdldE1HbHlwaChmb250KSBcbiAgICAgICAgICB8fCBmb250LmNoYXJzWzBdXG5cbiAgLy9hbmQgY3JlYXRlIGEgZmFsbGJhY2sgZm9yIHRhYlxuICB2YXIgdGFiV2lkdGggPSB0aGlzLl9vcHQudGFiU2l6ZSAqIHNwYWNlLnhhZHZhbmNlXG4gIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaCA9IHNwYWNlXG4gIHRoaXMuX2ZhbGxiYWNrVGFiR2x5cGggPSB4dGVuZChzcGFjZSwge1xuICAgIHg6IDAsIHk6IDAsIHhhZHZhbmNlOiB0YWJXaWR0aCwgaWQ6IFRBQl9JRCwgXG4gICAgeG9mZnNldDogMCwgeW9mZnNldDogMCwgd2lkdGg6IDAsIGhlaWdodDogMFxuICB9KVxufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS5nZXRHbHlwaCA9IGZ1bmN0aW9uKGZvbnQsIGlkKSB7XG4gIHZhciBnbHlwaCA9IGdldEdseXBoQnlJZChmb250LCBpZClcbiAgaWYgKGdseXBoKVxuICAgIHJldHVybiBnbHlwaFxuICBlbHNlIGlmIChpZCA9PT0gVEFCX0lEKSBcbiAgICByZXR1cm4gdGhpcy5fZmFsbGJhY2tUYWJHbHlwaFxuICBlbHNlIGlmIChpZCA9PT0gU1BBQ0VfSUQpIFxuICAgIHJldHVybiB0aGlzLl9mYWxsYmFja1NwYWNlR2x5cGhcbiAgcmV0dXJuIG51bGxcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUuY29tcHV0ZU1ldHJpY3MgPSBmdW5jdGlvbih0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCkge1xuICB2YXIgbGV0dGVyU3BhY2luZyA9IHRoaXMuX29wdC5sZXR0ZXJTcGFjaW5nIHx8IDBcbiAgdmFyIGZvbnQgPSB0aGlzLl9vcHQuZm9udFxuICB2YXIgY3VyUGVuID0gMFxuICB2YXIgY3VyV2lkdGggPSAwXG4gIHZhciBjb3VudCA9IDBcbiAgdmFyIGdseXBoXG4gIHZhciBsYXN0R2x5cGhcblxuICBpZiAoIWZvbnQuY2hhcnMgfHwgZm9udC5jaGFycy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgZW5kOiBzdGFydCxcbiAgICAgIHdpZHRoOiAwXG4gICAgfVxuICB9XG5cbiAgZW5kID0gTWF0aC5taW4odGV4dC5sZW5ndGgsIGVuZClcbiAgZm9yICh2YXIgaT1zdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdmFyIGlkID0gdGV4dC5jaGFyQ29kZUF0KGkpXG4gICAgdmFyIGdseXBoID0gdGhpcy5nZXRHbHlwaChmb250LCBpZClcblxuICAgIGlmIChnbHlwaCkge1xuICAgICAgLy9tb3ZlIHBlbiBmb3J3YXJkXG4gICAgICB2YXIgeG9mZiA9IGdseXBoLnhvZmZzZXRcbiAgICAgIHZhciBrZXJuID0gbGFzdEdseXBoID8gZ2V0S2VybmluZyhmb250LCBsYXN0R2x5cGguaWQsIGdseXBoLmlkKSA6IDBcbiAgICAgIGN1clBlbiArPSBrZXJuXG5cbiAgICAgIHZhciBuZXh0UGVuID0gY3VyUGVuICsgZ2x5cGgueGFkdmFuY2UgKyBsZXR0ZXJTcGFjaW5nXG4gICAgICB2YXIgbmV4dFdpZHRoID0gY3VyUGVuICsgZ2x5cGgud2lkdGhcblxuICAgICAgLy93ZSd2ZSBoaXQgb3VyIGxpbWl0OyB3ZSBjYW4ndCBtb3ZlIG9udG8gdGhlIG5leHQgZ2x5cGhcbiAgICAgIGlmIChuZXh0V2lkdGggPj0gd2lkdGggfHwgbmV4dFBlbiA+PSB3aWR0aClcbiAgICAgICAgYnJlYWtcblxuICAgICAgLy9vdGhlcndpc2UgY29udGludWUgYWxvbmcgb3VyIGxpbmVcbiAgICAgIGN1clBlbiA9IG5leHRQZW5cbiAgICAgIGN1cldpZHRoID0gbmV4dFdpZHRoXG4gICAgICBsYXN0R2x5cGggPSBnbHlwaFxuICAgIH1cbiAgICBjb3VudCsrXG4gIH1cbiAgXG4gIC8vbWFrZSBzdXJlIHJpZ2h0bW9zdCBlZGdlIGxpbmVzIHVwIHdpdGggcmVuZGVyZWQgZ2x5cGhzXG4gIGlmIChsYXN0R2x5cGgpXG4gICAgY3VyV2lkdGggKz0gbGFzdEdseXBoLnhvZmZzZXRcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBzdGFydCxcbiAgICBlbmQ6IHN0YXJ0ICsgY291bnQsXG4gICAgd2lkdGg6IGN1cldpZHRoXG4gIH1cbn1cblxuLy9nZXR0ZXJzIGZvciB0aGUgcHJpdmF0ZSB2YXJzXG47Wyd3aWR0aCcsICdoZWlnaHQnLCBcbiAgJ2Rlc2NlbmRlcicsICdhc2NlbmRlcicsXG4gICd4SGVpZ2h0JywgJ2Jhc2VsaW5lJyxcbiAgJ2NhcEhlaWdodCcsXG4gICdsaW5lSGVpZ2h0JyBdLmZvckVhY2goYWRkR2V0dGVyKVxuXG5mdW5jdGlvbiBhZGRHZXR0ZXIobmFtZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGV4dExheW91dC5wcm90b3R5cGUsIG5hbWUsIHtcbiAgICBnZXQ6IHdyYXBwZXIobmFtZSksXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pXG59XG5cbi8vY3JlYXRlIGxvb2t1cHMgZm9yIHByaXZhdGUgdmFyc1xuZnVuY3Rpb24gd3JhcHBlcihuYW1lKSB7XG4gIHJldHVybiAobmV3IEZ1bmN0aW9uKFtcbiAgICAncmV0dXJuIGZ1bmN0aW9uICcrbmFtZSsnKCkgeycsXG4gICAgJyAgcmV0dXJuIHRoaXMuXycrbmFtZSxcbiAgICAnfSdcbiAgXS5qb2luKCdcXG4nKSkpKClcbn1cblxuZnVuY3Rpb24gZ2V0R2x5cGhCeUlkKGZvbnQsIGlkKSB7XG4gIGlmICghZm9udC5jaGFycyB8fCBmb250LmNoYXJzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gbnVsbFxuXG4gIHZhciBnbHlwaElkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICBpZiAoZ2x5cGhJZHggPj0gMClcbiAgICByZXR1cm4gZm9udC5jaGFyc1tnbHlwaElkeF1cbiAgcmV0dXJuIG51bGxcbn1cblxuZnVuY3Rpb24gZ2V0WEhlaWdodChmb250KSB7XG4gIGZvciAodmFyIGk9MDsgaTxYX0hFSUdIVFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBYX0hFSUdIVFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XS5oZWlnaHRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRNR2x5cGgoZm9udCkge1xuICBmb3IgKHZhciBpPTA7IGk8TV9XSURUSFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBNX1dJRFRIU1tpXS5jaGFyQ29kZUF0KDApXG4gICAgdmFyIGlkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICAgIGlmIChpZHggPj0gMCkgXG4gICAgICByZXR1cm4gZm9udC5jaGFyc1tpZHhdXG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0Q2FwSGVpZ2h0KGZvbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPENBUF9IRUlHSFRTLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGlkID0gQ0FQX0hFSUdIVFNbaV0uY2hhckNvZGVBdCgwKVxuICAgIHZhciBpZHggPSBmaW5kQ2hhcihmb250LmNoYXJzLCBpZClcbiAgICBpZiAoaWR4ID49IDApIFxuICAgICAgcmV0dXJuIGZvbnQuY2hhcnNbaWR4XS5oZWlnaHRcbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRLZXJuaW5nKGZvbnQsIGxlZnQsIHJpZ2h0KSB7XG4gIGlmICghZm9udC5rZXJuaW5ncyB8fCBmb250Lmtlcm5pbmdzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gMFxuXG4gIHZhciB0YWJsZSA9IGZvbnQua2VybmluZ3NcbiAgZm9yICh2YXIgaT0wOyBpPHRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtlcm4gPSB0YWJsZVtpXVxuICAgIGlmIChrZXJuLmZpcnN0ID09PSBsZWZ0ICYmIGtlcm4uc2Vjb25kID09PSByaWdodClcbiAgICAgIHJldHVybiBrZXJuLmFtb3VudFxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldEFsaWduVHlwZShhbGlnbikge1xuICBpZiAoYWxpZ24gPT09ICdjZW50ZXInKVxuICAgIHJldHVybiBBTElHTl9DRU5URVJcbiAgZWxzZSBpZiAoYWxpZ24gPT09ICdyaWdodCcpXG4gICAgcmV0dXJuIEFMSUdOX1JJR0hUXG4gIHJldHVybiBBTElHTl9MRUZUXG59IiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGFyc2VCTUZvbnRBc2NpaShkYXRhKSB7XG4gIGlmICghZGF0YSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGRhdGEgcHJvdmlkZWQnKVxuICBkYXRhID0gZGF0YS50b1N0cmluZygpLnRyaW0oKVxuXG4gIHZhciBvdXRwdXQgPSB7XG4gICAgcGFnZXM6IFtdLFxuICAgIGNoYXJzOiBbXSxcbiAgICBrZXJuaW5nczogW11cbiAgfVxuXG4gIHZhciBsaW5lcyA9IGRhdGEuc3BsaXQoL1xcclxcbj98XFxuL2cpXG5cbiAgaWYgKGxpbmVzLmxlbmd0aCA9PT0gMClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGRhdGEgaW4gQk1Gb250IGZpbGUnKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbGluZURhdGEgPSBzcGxpdExpbmUobGluZXNbaV0sIGkpXG4gICAgaWYgKCFsaW5lRGF0YSkgLy9za2lwIGVtcHR5IGxpbmVzXG4gICAgICBjb250aW51ZVxuXG4gICAgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ3BhZ2UnKSB7XG4gICAgICBpZiAodHlwZW9mIGxpbmVEYXRhLmRhdGEuaWQgIT09ICdudW1iZXInKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hbGZvcm1lZCBmaWxlIGF0IGxpbmUgJyArIGkgKyAnIC0tIG5lZWRzIHBhZ2UgaWQ9TicpXG4gICAgICBpZiAodHlwZW9mIGxpbmVEYXRhLmRhdGEuZmlsZSAhPT0gJ3N0cmluZycpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbWFsZm9ybWVkIGZpbGUgYXQgbGluZSAnICsgaSArICcgLS0gbmVlZHMgcGFnZSBmaWxlPVwicGF0aFwiJylcbiAgICAgIG91dHB1dC5wYWdlc1tsaW5lRGF0YS5kYXRhLmlkXSA9IGxpbmVEYXRhLmRhdGEuZmlsZVxuICAgIH0gZWxzZSBpZiAobGluZURhdGEua2V5ID09PSAnY2hhcnMnIHx8IGxpbmVEYXRhLmtleSA9PT0gJ2tlcm5pbmdzJykge1xuICAgICAgLy8uLi4gZG8gbm90aGluZyBmb3IgdGhlc2UgdHdvIC4uLlxuICAgIH0gZWxzZSBpZiAobGluZURhdGEua2V5ID09PSAnY2hhcicpIHtcbiAgICAgIG91dHB1dC5jaGFycy5wdXNoKGxpbmVEYXRhLmRhdGEpXG4gICAgfSBlbHNlIGlmIChsaW5lRGF0YS5rZXkgPT09ICdrZXJuaW5nJykge1xuICAgICAgb3V0cHV0Lmtlcm5pbmdzLnB1c2gobGluZURhdGEuZGF0YSlcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0W2xpbmVEYXRhLmtleV0gPSBsaW5lRGF0YS5kYXRhXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dHB1dFxufVxuXG5mdW5jdGlvbiBzcGxpdExpbmUobGluZSwgaWR4KSB7XG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UoL1xcdCsvZywgJyAnKS50cmltKClcbiAgaWYgKCFsaW5lKVxuICAgIHJldHVybiBudWxsXG5cbiAgdmFyIHNwYWNlID0gbGluZS5pbmRleE9mKCcgJylcbiAgaWYgKHNwYWNlID09PSAtMSkgXG4gICAgdGhyb3cgbmV3IEVycm9yKFwibm8gbmFtZWQgcm93IGF0IGxpbmUgXCIgKyBpZHgpXG5cbiAgdmFyIGtleSA9IGxpbmUuc3Vic3RyaW5nKDAsIHNwYWNlKVxuXG4gIGxpbmUgPSBsaW5lLnN1YnN0cmluZyhzcGFjZSArIDEpXG4gIC8vY2xlYXIgXCJsZXR0ZXJcIiBmaWVsZCBhcyBpdCBpcyBub24tc3RhbmRhcmQgYW5kXG4gIC8vcmVxdWlyZXMgYWRkaXRpb25hbCBjb21wbGV4aXR5IHRvIHBhcnNlIFwiIC8gPSBzeW1ib2xzXG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UoL2xldHRlcj1bXFwnXFxcIl1cXFMrW1xcJ1xcXCJdL2dpLCAnJykgIFxuICBsaW5lID0gbGluZS5zcGxpdChcIj1cIilcbiAgbGluZSA9IGxpbmUubWFwKGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIudHJpbSgpLm1hdGNoKCgvKFwiLio/XCJ8W15cIlxcc10rKSsoPz1cXHMqfFxccyokKS9nKSlcbiAgfSlcblxuICB2YXIgZGF0YSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkdCA9IGxpbmVbaV1cbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAga2V5OiBkdFswXSxcbiAgICAgICAgZGF0YTogXCJcIlxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGkgPT09IGxpbmUubGVuZ3RoIC0gMSkge1xuICAgICAgZGF0YVtkYXRhLmxlbmd0aCAtIDFdLmRhdGEgPSBwYXJzZURhdGEoZHRbMF0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGFbZGF0YS5sZW5ndGggLSAxXS5kYXRhID0gcGFyc2VEYXRhKGR0WzBdKVxuICAgICAgZGF0YS5wdXNoKHtcbiAgICAgICAga2V5OiBkdFsxXSxcbiAgICAgICAgZGF0YTogXCJcIlxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0ID0ge1xuICAgIGtleToga2V5LFxuICAgIGRhdGE6IHt9XG4gIH1cblxuICBkYXRhLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgIG91dC5kYXRhW3Yua2V5XSA9IHYuZGF0YTtcbiAgfSlcblxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHBhcnNlRGF0YShkYXRhKSB7XG4gIGlmICghZGF0YSB8fCBkYXRhLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gXCJcIlxuXG4gIGlmIChkYXRhLmluZGV4T2YoJ1wiJykgPT09IDAgfHwgZGF0YS5pbmRleE9mKFwiJ1wiKSA9PT0gMClcbiAgICByZXR1cm4gZGF0YS5zdWJzdHJpbmcoMSwgZGF0YS5sZW5ndGggLSAxKVxuICBpZiAoZGF0YS5pbmRleE9mKCcsJykgIT09IC0xKVxuICAgIHJldHVybiBwYXJzZUludExpc3QoZGF0YSlcbiAgcmV0dXJuIHBhcnNlSW50KGRhdGEsIDEwKVxufVxuXG5mdW5jdGlvbiBwYXJzZUludExpc3QoZGF0YSkge1xuICByZXR1cm4gZGF0YS5zcGxpdCgnLCcpLm1hcChmdW5jdGlvbih2YWwpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQodmFsLCAxMClcbiAgfSlcbn0iLCJ2YXIgZHR5cGUgPSByZXF1aXJlKCdkdHlwZScpXG52YXIgYW5BcnJheSA9IHJlcXVpcmUoJ2FuLWFycmF5JylcbnZhciBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpXG5cbnZhciBDVyA9IFswLCAyLCAzXVxudmFyIENDVyA9IFsyLCAxLCAzXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVF1YWRFbGVtZW50cyhhcnJheSwgb3B0KSB7XG4gICAgLy9pZiB1c2VyIGRpZG4ndCBzcGVjaWZ5IGFuIG91dHB1dCBhcnJheVxuICAgIGlmICghYXJyYXkgfHwgIShhbkFycmF5KGFycmF5KSB8fCBpc0J1ZmZlcihhcnJheSkpKSB7XG4gICAgICAgIG9wdCA9IGFycmF5IHx8IHt9XG4gICAgICAgIGFycmF5ID0gbnVsbFxuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0ID09PSAnbnVtYmVyJykgLy9iYWNrd2FyZHMtY29tcGF0aWJsZVxuICAgICAgICBvcHQgPSB7IGNvdW50OiBvcHQgfVxuICAgIGVsc2VcbiAgICAgICAgb3B0ID0gb3B0IHx8IHt9XG5cbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBvcHQudHlwZSA9PT0gJ3N0cmluZycgPyBvcHQudHlwZSA6ICd1aW50MTYnXG4gICAgdmFyIGNvdW50ID0gdHlwZW9mIG9wdC5jb3VudCA9PT0gJ251bWJlcicgPyBvcHQuY291bnQgOiAxXG4gICAgdmFyIHN0YXJ0ID0gKG9wdC5zdGFydCB8fCAwKSBcblxuICAgIHZhciBkaXIgPSBvcHQuY2xvY2t3aXNlICE9PSBmYWxzZSA/IENXIDogQ0NXLFxuICAgICAgICBhID0gZGlyWzBdLCBcbiAgICAgICAgYiA9IGRpclsxXSxcbiAgICAgICAgYyA9IGRpclsyXVxuXG4gICAgdmFyIG51bUluZGljZXMgPSBjb3VudCAqIDZcblxuICAgIHZhciBpbmRpY2VzID0gYXJyYXkgfHwgbmV3IChkdHlwZSh0eXBlKSkobnVtSW5kaWNlcylcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IDA7IGkgPCBudW1JbmRpY2VzOyBpICs9IDYsIGogKz0gNCkge1xuICAgICAgICB2YXIgeCA9IGkgKyBzdGFydFxuICAgICAgICBpbmRpY2VzW3ggKyAwXSA9IGogKyAwXG4gICAgICAgIGluZGljZXNbeCArIDFdID0gaiArIDFcbiAgICAgICAgaW5kaWNlc1t4ICsgMl0gPSBqICsgMlxuICAgICAgICBpbmRpY2VzW3ggKyAzXSA9IGogKyBhXG4gICAgICAgIGluZGljZXNbeCArIDRdID0gaiArIGJcbiAgICAgICAgaW5kaWNlc1t4ICsgNV0gPSBqICsgY1xuICAgIH1cbiAgICByZXR1cm4gaW5kaWNlc1xufSIsInZhciBjcmVhdGVMYXlvdXQgPSByZXF1aXJlKCdsYXlvdXQtYm1mb250LXRleHQnKVxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKVxudmFyIGNyZWF0ZUluZGljZXMgPSByZXF1aXJlKCdxdWFkLWluZGljZXMnKVxudmFyIGJ1ZmZlciA9IHJlcXVpcmUoJ3RocmVlLWJ1ZmZlci12ZXJ0ZXgtZGF0YScpXG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpXG5cbnZhciB2ZXJ0aWNlcyA9IHJlcXVpcmUoJy4vbGliL3ZlcnRpY2VzJylcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vbGliL3V0aWxzJylcblxudmFyIEJhc2UgPSBUSFJFRS5CdWZmZXJHZW9tZXRyeVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVRleHRHZW9tZXRyeSAob3B0KSB7XG4gIHJldHVybiBuZXcgVGV4dEdlb21ldHJ5KG9wdClcbn1cblxuZnVuY3Rpb24gVGV4dEdlb21ldHJ5IChvcHQpIHtcbiAgQmFzZS5jYWxsKHRoaXMpXG5cbiAgaWYgKHR5cGVvZiBvcHQgPT09ICdzdHJpbmcnKSB7XG4gICAgb3B0ID0geyB0ZXh0OiBvcHQgfVxuICB9XG5cbiAgLy8gdXNlIHRoZXNlIGFzIGRlZmF1bHQgdmFsdWVzIGZvciBhbnkgc3Vic2VxdWVudFxuICAvLyBjYWxscyB0byB1cGRhdGUoKVxuICB0aGlzLl9vcHQgPSBhc3NpZ24oe30sIG9wdClcblxuICAvLyBhbHNvIGRvIGFuIGluaXRpYWwgc2V0dXAuLi5cbiAgaWYgKG9wdCkgdGhpcy51cGRhdGUob3B0KVxufVxuXG5pbmhlcml0cyhUZXh0R2VvbWV0cnksIEJhc2UpXG5cblRleHRHZW9tZXRyeS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKG9wdCkge1xuICBpZiAodHlwZW9mIG9wdCA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHQgPSB7IHRleHQ6IG9wdCB9XG4gIH1cblxuICAvLyB1c2UgY29uc3RydWN0b3IgZGVmYXVsdHNcbiAgb3B0ID0gYXNzaWduKHt9LCB0aGlzLl9vcHQsIG9wdClcblxuICBpZiAoIW9wdC5mb250KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbXVzdCBzcGVjaWZ5IGEgeyBmb250IH0gaW4gb3B0aW9ucycpXG4gIH1cblxuICB0aGlzLmxheW91dCA9IGNyZWF0ZUxheW91dChvcHQpXG5cbiAgLy8gZ2V0IHZlYzIgdGV4Y29vcmRzXG4gIHZhciBmbGlwWSA9IG9wdC5mbGlwWSAhPT0gZmFsc2VcblxuICAvLyB0aGUgZGVzaXJlZCBCTUZvbnQgZGF0YVxuICB2YXIgZm9udCA9IG9wdC5mb250XG5cbiAgLy8gZGV0ZXJtaW5lIHRleHR1cmUgc2l6ZSBmcm9tIGZvbnQgZmlsZVxuICB2YXIgdGV4V2lkdGggPSBmb250LmNvbW1vbi5zY2FsZVdcbiAgdmFyIHRleEhlaWdodCA9IGZvbnQuY29tbW9uLnNjYWxlSFxuXG4gIC8vIGdldCB2aXNpYmxlIGdseXBoc1xuICB2YXIgZ2x5cGhzID0gdGhpcy5sYXlvdXQuZ2x5cGhzLmZpbHRlcihmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgYml0bWFwID0gZ2x5cGguZGF0YVxuICAgIHJldHVybiBiaXRtYXAud2lkdGggKiBiaXRtYXAuaGVpZ2h0ID4gMFxuICB9KVxuXG4gIC8vIHByb3ZpZGUgdmlzaWJsZSBnbHlwaHMgZm9yIGNvbnZlbmllbmNlXG4gIHRoaXMudmlzaWJsZUdseXBocyA9IGdseXBoc1xuXG4gIC8vIGdldCBjb21tb24gdmVydGV4IGRhdGFcbiAgdmFyIHBvc2l0aW9ucyA9IHZlcnRpY2VzLnBvc2l0aW9ucyhnbHlwaHMpXG4gIHZhciB1dnMgPSB2ZXJ0aWNlcy51dnMoZ2x5cGhzLCB0ZXhXaWR0aCwgdGV4SGVpZ2h0LCBmbGlwWSlcbiAgdmFyIGluZGljZXMgPSBjcmVhdGVJbmRpY2VzKHtcbiAgICBjbG9ja3dpc2U6IHRydWUsXG4gICAgdHlwZTogJ3VpbnQxNicsXG4gICAgY291bnQ6IGdseXBocy5sZW5ndGhcbiAgfSlcblxuICAvLyB1cGRhdGUgdmVydGV4IGRhdGFcbiAgYnVmZmVyLmluZGV4KHRoaXMsIGluZGljZXMsIDEsICd1aW50MTYnKVxuICBidWZmZXIuYXR0cih0aGlzLCAncG9zaXRpb24nLCBwb3NpdGlvbnMsIDIpXG4gIGJ1ZmZlci5hdHRyKHRoaXMsICd1dicsIHV2cywgMilcblxuICAvLyB1cGRhdGUgbXVsdGlwYWdlIGRhdGFcbiAgaWYgKCFvcHQubXVsdGlwYWdlICYmICdwYWdlJyBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICAvLyBkaXNhYmxlIG11bHRpcGFnZSByZW5kZXJpbmdcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgncGFnZScpXG4gIH0gZWxzZSBpZiAob3B0Lm11bHRpcGFnZSkge1xuICAgIHZhciBwYWdlcyA9IHZlcnRpY2VzLnBhZ2VzKGdseXBocylcbiAgICAvLyBlbmFibGUgbXVsdGlwYWdlIHJlbmRlcmluZ1xuICAgIGJ1ZmZlci5hdHRyKHRoaXMsICdwYWdlJywgcGFnZXMsIDEpXG4gIH1cbn1cblxuVGV4dEdlb21ldHJ5LnByb3RvdHlwZS5jb21wdXRlQm91bmRpbmdTcGhlcmUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmJvdW5kaW5nU3BoZXJlID09PSBudWxsKSB7XG4gICAgdGhpcy5ib3VuZGluZ1NwaGVyZSA9IG5ldyBUSFJFRS5TcGhlcmUoKVxuICB9XG5cbiAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5hcnJheVxuICB2YXIgaXRlbVNpemUgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uaXRlbVNpemVcbiAgaWYgKCFwb3NpdGlvbnMgfHwgIWl0ZW1TaXplIHx8IHBvc2l0aW9ucy5sZW5ndGggPCAyKSB7XG4gICAgdGhpcy5ib3VuZGluZ1NwaGVyZS5yYWRpdXMgPSAwXG4gICAgdGhpcy5ib3VuZGluZ1NwaGVyZS5jZW50ZXIuc2V0KDAsIDAsIDApXG4gICAgcmV0dXJuXG4gIH1cbiAgdXRpbHMuY29tcHV0ZVNwaGVyZShwb3NpdGlvbnMsIHRoaXMuYm91bmRpbmdTcGhlcmUpXG4gIGlmIChpc05hTih0aGlzLmJvdW5kaW5nU3BoZXJlLnJhZGl1cykpIHtcbiAgICBjb25zb2xlLmVycm9yKCdUSFJFRS5CdWZmZXJHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdTcGhlcmUoKTogJyArXG4gICAgICAnQ29tcHV0ZWQgcmFkaXVzIGlzIE5hTi4gVGhlICcgK1xuICAgICAgJ1wicG9zaXRpb25cIiBhdHRyaWJ1dGUgaXMgbGlrZWx5IHRvIGhhdmUgTmFOIHZhbHVlcy4nKVxuICB9XG59XG5cblRleHRHZW9tZXRyeS5wcm90b3R5cGUuY29tcHV0ZUJvdW5kaW5nQm94ID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5ib3VuZGluZ0JveCA9PT0gbnVsbCkge1xuICAgIHRoaXMuYm91bmRpbmdCb3ggPSBuZXcgVEhSRUUuQm94MygpXG4gIH1cblxuICB2YXIgYmJveCA9IHRoaXMuYm91bmRpbmdCb3hcbiAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuYXR0cmlidXRlcy5wb3NpdGlvbi5hcnJheVxuICB2YXIgaXRlbVNpemUgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uaXRlbVNpemVcbiAgaWYgKCFwb3NpdGlvbnMgfHwgIWl0ZW1TaXplIHx8IHBvc2l0aW9ucy5sZW5ndGggPCAyKSB7XG4gICAgYmJveC5tYWtlRW1wdHkoKVxuICAgIHJldHVyblxuICB9XG4gIHV0aWxzLmNvbXB1dGVCb3gocG9zaXRpb25zLCBiYm94KVxufVxuIiwidmFyIGl0ZW1TaXplID0gMlxudmFyIGJveCA9IHsgbWluOiBbMCwgMF0sIG1heDogWzAsIDBdIH1cblxuZnVuY3Rpb24gYm91bmRzIChwb3NpdGlvbnMpIHtcbiAgdmFyIGNvdW50ID0gcG9zaXRpb25zLmxlbmd0aCAvIGl0ZW1TaXplXG4gIGJveC5taW5bMF0gPSBwb3NpdGlvbnNbMF1cbiAgYm94Lm1pblsxXSA9IHBvc2l0aW9uc1sxXVxuICBib3gubWF4WzBdID0gcG9zaXRpb25zWzBdXG4gIGJveC5tYXhbMV0gPSBwb3NpdGlvbnNbMV1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICB2YXIgeCA9IHBvc2l0aW9uc1tpICogaXRlbVNpemUgKyAwXVxuICAgIHZhciB5ID0gcG9zaXRpb25zW2kgKiBpdGVtU2l6ZSArIDFdXG4gICAgYm94Lm1pblswXSA9IE1hdGgubWluKHgsIGJveC5taW5bMF0pXG4gICAgYm94Lm1pblsxXSA9IE1hdGgubWluKHksIGJveC5taW5bMV0pXG4gICAgYm94Lm1heFswXSA9IE1hdGgubWF4KHgsIGJveC5tYXhbMF0pXG4gICAgYm94Lm1heFsxXSA9IE1hdGgubWF4KHksIGJveC5tYXhbMV0pXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMuY29tcHV0ZUJveCA9IGZ1bmN0aW9uIChwb3NpdGlvbnMsIG91dHB1dCkge1xuICBib3VuZHMocG9zaXRpb25zKVxuICBvdXRwdXQubWluLnNldChib3gubWluWzBdLCBib3gubWluWzFdLCAwKVxuICBvdXRwdXQubWF4LnNldChib3gubWF4WzBdLCBib3gubWF4WzFdLCAwKVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb21wdXRlU3BoZXJlID0gZnVuY3Rpb24gKHBvc2l0aW9ucywgb3V0cHV0KSB7XG4gIGJvdW5kcyhwb3NpdGlvbnMpXG4gIHZhciBtaW5YID0gYm94Lm1pblswXVxuICB2YXIgbWluWSA9IGJveC5taW5bMV1cbiAgdmFyIG1heFggPSBib3gubWF4WzBdXG4gIHZhciBtYXhZID0gYm94Lm1heFsxXVxuICB2YXIgd2lkdGggPSBtYXhYIC0gbWluWFxuICB2YXIgaGVpZ2h0ID0gbWF4WSAtIG1pbllcbiAgdmFyIGxlbmd0aCA9IE1hdGguc3FydCh3aWR0aCAqIHdpZHRoICsgaGVpZ2h0ICogaGVpZ2h0KVxuICBvdXRwdXQuY2VudGVyLnNldChtaW5YICsgd2lkdGggLyAyLCBtaW5ZICsgaGVpZ2h0IC8gMiwgMClcbiAgb3V0cHV0LnJhZGl1cyA9IGxlbmd0aCAvIDJcbn1cbiIsIm1vZHVsZS5leHBvcnRzLnBhZ2VzID0gZnVuY3Rpb24gcGFnZXMgKGdseXBocykge1xuICB2YXIgcGFnZXMgPSBuZXcgRmxvYXQzMkFycmF5KGdseXBocy5sZW5ndGggKiA0ICogMSlcbiAgdmFyIGkgPSAwXG4gIGdseXBocy5mb3JFYWNoKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBpZCA9IGdseXBoLmRhdGEucGFnZSB8fCAwXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gICAgcGFnZXNbaSsrXSA9IGlkXG4gIH0pXG4gIHJldHVybiBwYWdlc1xufVxuXG5tb2R1bGUuZXhwb3J0cy51dnMgPSBmdW5jdGlvbiB1dnMgKGdseXBocywgdGV4V2lkdGgsIHRleEhlaWdodCwgZmxpcFkpIHtcbiAgdmFyIHV2cyA9IG5ldyBGbG9hdDMyQXJyYXkoZ2x5cGhzLmxlbmd0aCAqIDQgKiAyKVxuICB2YXIgaSA9IDBcbiAgZ2x5cGhzLmZvckVhY2goZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGJpdG1hcCA9IGdseXBoLmRhdGFcbiAgICB2YXIgYncgPSAoYml0bWFwLnggKyBiaXRtYXAud2lkdGgpXG4gICAgdmFyIGJoID0gKGJpdG1hcC55ICsgYml0bWFwLmhlaWdodClcblxuICAgIC8vIHRvcCBsZWZ0IHBvc2l0aW9uXG4gICAgdmFyIHUwID0gYml0bWFwLnggLyB0ZXhXaWR0aFxuICAgIHZhciB2MSA9IGJpdG1hcC55IC8gdGV4SGVpZ2h0XG4gICAgdmFyIHUxID0gYncgLyB0ZXhXaWR0aFxuICAgIHZhciB2MCA9IGJoIC8gdGV4SGVpZ2h0XG5cbiAgICBpZiAoZmxpcFkpIHtcbiAgICAgIHYxID0gKHRleEhlaWdodCAtIGJpdG1hcC55KSAvIHRleEhlaWdodFxuICAgICAgdjAgPSAodGV4SGVpZ2h0IC0gYmgpIC8gdGV4SGVpZ2h0XG4gICAgfVxuXG4gICAgLy8gQkxcbiAgICB1dnNbaSsrXSA9IHUwXG4gICAgdXZzW2krK10gPSB2MVxuICAgIC8vIFRMXG4gICAgdXZzW2krK10gPSB1MFxuICAgIHV2c1tpKytdID0gdjBcbiAgICAvLyBUUlxuICAgIHV2c1tpKytdID0gdTFcbiAgICB1dnNbaSsrXSA9IHYwXG4gICAgLy8gQlJcbiAgICB1dnNbaSsrXSA9IHUxXG4gICAgdXZzW2krK10gPSB2MVxuICB9KVxuICByZXR1cm4gdXZzXG59XG5cbm1vZHVsZS5leHBvcnRzLnBvc2l0aW9ucyA9IGZ1bmN0aW9uIHBvc2l0aW9ucyAoZ2x5cGhzKSB7XG4gIHZhciBwb3NpdGlvbnMgPSBuZXcgRmxvYXQzMkFycmF5KGdseXBocy5sZW5ndGggKiA0ICogMilcbiAgdmFyIGkgPSAwXG4gIGdseXBocy5mb3JFYWNoKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBiaXRtYXAgPSBnbHlwaC5kYXRhXG5cbiAgICAvLyBib3R0b20gbGVmdCBwb3NpdGlvblxuICAgIHZhciB4ID0gZ2x5cGgucG9zaXRpb25bMF0gKyBiaXRtYXAueG9mZnNldFxuICAgIHZhciB5ID0gZ2x5cGgucG9zaXRpb25bMV0gKyBiaXRtYXAueW9mZnNldFxuXG4gICAgLy8gcXVhZCBzaXplXG4gICAgdmFyIHcgPSBiaXRtYXAud2lkdGhcbiAgICB2YXIgaCA9IGJpdG1hcC5oZWlnaHRcblxuICAgIC8vIEJMXG4gICAgcG9zaXRpb25zW2krK10gPSB4XG4gICAgcG9zaXRpb25zW2krK10gPSB5XG4gICAgLy8gVExcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHhcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHkgKyBoXG4gICAgLy8gVFJcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHggKyB3XG4gICAgcG9zaXRpb25zW2krK10gPSB5ICsgaFxuICAgIC8vIEJSXG4gICAgcG9zaXRpb25zW2krK10gPSB4ICsgd1xuICAgIHBvc2l0aW9uc1tpKytdID0geVxuICB9KVxuICByZXR1cm4gcG9zaXRpb25zXG59XG4iLCJ2YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlU0RGU2hhZGVyIChvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9XG4gIHZhciBvcGFjaXR5ID0gdHlwZW9mIG9wdC5vcGFjaXR5ID09PSAnbnVtYmVyJyA/IG9wdC5vcGFjaXR5IDogMVxuICB2YXIgYWxwaGFUZXN0ID0gdHlwZW9mIG9wdC5hbHBoYVRlc3QgPT09ICdudW1iZXInID8gb3B0LmFscGhhVGVzdCA6IDAuMDAwMVxuICB2YXIgcHJlY2lzaW9uID0gb3B0LnByZWNpc2lvbiB8fCAnaGlnaHAnXG4gIHZhciBjb2xvciA9IG9wdC5jb2xvclxuICB2YXIgbWFwID0gb3B0Lm1hcFxuXG4gIC8vIHJlbW92ZSB0byBzYXRpc2Z5IHI3M1xuICBkZWxldGUgb3B0Lm1hcFxuICBkZWxldGUgb3B0LmNvbG9yXG4gIGRlbGV0ZSBvcHQucHJlY2lzaW9uXG4gIGRlbGV0ZSBvcHQub3BhY2l0eVxuXG4gIHJldHVybiBhc3NpZ24oe1xuICAgIHVuaWZvcm1zOiB7XG4gICAgICBvcGFjaXR5OiB7IHR5cGU6ICdmJywgdmFsdWU6IG9wYWNpdHkgfSxcbiAgICAgIG1hcDogeyB0eXBlOiAndCcsIHZhbHVlOiBtYXAgfHwgbmV3IFRIUkVFLlRleHR1cmUoKSB9LFxuICAgICAgY29sb3I6IHsgdHlwZTogJ2MnLCB2YWx1ZTogbmV3IFRIUkVFLkNvbG9yKGNvbG9yKSB9XG4gICAgfSxcbiAgICB2ZXJ0ZXhTaGFkZXI6IFtcbiAgICAgICdhdHRyaWJ1dGUgdmVjMiB1djsnLFxuICAgICAgJ2F0dHJpYnV0ZSB2ZWM0IHBvc2l0aW9uOycsXG4gICAgICAndW5pZm9ybSBtYXQ0IHByb2plY3Rpb25NYXRyaXg7JyxcbiAgICAgICd1bmlmb3JtIG1hdDQgbW9kZWxWaWV3TWF0cml4OycsXG4gICAgICAndmFyeWluZyB2ZWMyIHZVdjsnLFxuICAgICAgJ3ZvaWQgbWFpbigpIHsnLFxuICAgICAgJ3ZVdiA9IHV2OycsXG4gICAgICAnZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogcG9zaXRpb247JyxcbiAgICAgICd9J1xuICAgIF0uam9pbignXFxuJyksXG4gICAgZnJhZ21lbnRTaGFkZXI6IFtcbiAgICAgICcjaWZkZWYgR0xfT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJyxcbiAgICAgICcjZXh0ZW5zaW9uIEdMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcyA6IGVuYWJsZScsXG4gICAgICAnI2VuZGlmJyxcbiAgICAgICdwcmVjaXNpb24gJyArIHByZWNpc2lvbiArICcgZmxvYXQ7JyxcbiAgICAgICd1bmlmb3JtIGZsb2F0IG9wYWNpdHk7JyxcbiAgICAgICd1bmlmb3JtIHZlYzMgY29sb3I7JyxcbiAgICAgICd1bmlmb3JtIHNhbXBsZXIyRCBtYXA7JyxcbiAgICAgICd2YXJ5aW5nIHZlYzIgdlV2OycsXG5cbiAgICAgICdmbG9hdCBhYXN0ZXAoZmxvYXQgdmFsdWUpIHsnLFxuICAgICAgJyAgI2lmZGVmIEdMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcycsXG4gICAgICAnICAgIGZsb2F0IGFmd2lkdGggPSBsZW5ndGgodmVjMihkRmR4KHZhbHVlKSwgZEZkeSh2YWx1ZSkpKSAqIDAuNzA3MTA2NzgxMTg2NTQ3NTc7JyxcbiAgICAgICcgICNlbHNlJyxcbiAgICAgICcgICAgZmxvYXQgYWZ3aWR0aCA9ICgxLjAgLyAzMi4wKSAqICgxLjQxNDIxMzU2MjM3MzA5NTEgLyAoMi4wICogZ2xfRnJhZ0Nvb3JkLncpKTsnLFxuICAgICAgJyAgI2VuZGlmJyxcbiAgICAgICcgIHJldHVybiBzbW9vdGhzdGVwKDAuNSAtIGFmd2lkdGgsIDAuNSArIGFmd2lkdGgsIHZhbHVlKTsnLFxuICAgICAgJ30nLFxuXG4gICAgICAndm9pZCBtYWluKCkgeycsXG4gICAgICAnICB2ZWM0IHRleENvbG9yID0gdGV4dHVyZTJEKG1hcCwgdlV2KTsnLFxuICAgICAgJyAgZmxvYXQgYWxwaGEgPSBhYXN0ZXAodGV4Q29sb3IuYSk7JyxcbiAgICAgICcgIGdsX0ZyYWdDb2xvciA9IHZlYzQoY29sb3IsIG9wYWNpdHkgKiBhbHBoYSk7JyxcbiAgICAgIGFscGhhVGVzdCA9PT0gMFxuICAgICAgICA/ICcnXG4gICAgICAgIDogJyAgaWYgKGdsX0ZyYWdDb2xvci5hIDwgJyArIGFscGhhVGVzdCArICcpIGRpc2NhcmQ7JyxcbiAgICAgICd9J1xuICAgIF0uam9pbignXFxuJylcbiAgfSwgb3B0KVxufVxuIiwidmFyIGZsYXR0ZW4gPSByZXF1aXJlKCdmbGF0dGVuLXZlcnRleC1kYXRhJylcbnZhciB3YXJuZWQgPSBmYWxzZTtcblxubW9kdWxlLmV4cG9ydHMuYXR0ciA9IHNldEF0dHJpYnV0ZVxubW9kdWxlLmV4cG9ydHMuaW5kZXggPSBzZXRJbmRleFxuXG5mdW5jdGlvbiBzZXRJbmRleCAoZ2VvbWV0cnksIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSkge1xuICBpZiAodHlwZW9mIGl0ZW1TaXplICE9PSAnbnVtYmVyJykgaXRlbVNpemUgPSAxXG4gIGlmICh0eXBlb2YgZHR5cGUgIT09ICdzdHJpbmcnKSBkdHlwZSA9ICd1aW50MTYnXG5cbiAgdmFyIGlzUjY5ID0gIWdlb21ldHJ5LmluZGV4ICYmIHR5cGVvZiBnZW9tZXRyeS5zZXRJbmRleCAhPT0gJ2Z1bmN0aW9uJ1xuICB2YXIgYXR0cmliID0gaXNSNjkgPyBnZW9tZXRyeS5nZXRBdHRyaWJ1dGUoJ2luZGV4JykgOiBnZW9tZXRyeS5pbmRleFxuICB2YXIgbmV3QXR0cmliID0gdXBkYXRlQXR0cmlidXRlKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKVxuICBpZiAobmV3QXR0cmliKSB7XG4gICAgaWYgKGlzUjY5KSBnZW9tZXRyeS5hZGRBdHRyaWJ1dGUoJ2luZGV4JywgbmV3QXR0cmliKVxuICAgIGVsc2UgZ2VvbWV0cnkuaW5kZXggPSBuZXdBdHRyaWJcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGUgKGdlb21ldHJ5LCBrZXksIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSkge1xuICBpZiAodHlwZW9mIGl0ZW1TaXplICE9PSAnbnVtYmVyJykgaXRlbVNpemUgPSAzXG4gIGlmICh0eXBlb2YgZHR5cGUgIT09ICdzdHJpbmcnKSBkdHlwZSA9ICdmbG9hdDMyJ1xuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJlxuICAgIEFycmF5LmlzQXJyYXkoZGF0YVswXSkgJiZcbiAgICBkYXRhWzBdLmxlbmd0aCAhPT0gaXRlbVNpemUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05lc3RlZCB2ZXJ0ZXggYXJyYXkgaGFzIHVuZXhwZWN0ZWQgc2l6ZTsgZXhwZWN0ZWQgJyArXG4gICAgICBpdGVtU2l6ZSArICcgYnV0IGZvdW5kICcgKyBkYXRhWzBdLmxlbmd0aClcbiAgfVxuXG4gIHZhciBhdHRyaWIgPSBnZW9tZXRyeS5nZXRBdHRyaWJ1dGUoa2V5KVxuICB2YXIgbmV3QXR0cmliID0gdXBkYXRlQXR0cmlidXRlKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKVxuICBpZiAobmV3QXR0cmliKSB7XG4gICAgZ2VvbWV0cnkuYWRkQXR0cmlidXRlKGtleSwgbmV3QXR0cmliKVxuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUF0dHJpYnV0ZSAoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpIHtcbiAgZGF0YSA9IGRhdGEgfHwgW11cbiAgaWYgKCFhdHRyaWIgfHwgcmVidWlsZEF0dHJpYnV0ZShhdHRyaWIsIGRhdGEsIGl0ZW1TaXplKSkge1xuICAgIC8vIGNyZWF0ZSBhIG5ldyBhcnJheSB3aXRoIGRlc2lyZWQgdHlwZVxuICAgIGRhdGEgPSBmbGF0dGVuKGRhdGEsIGR0eXBlKVxuXG4gICAgdmFyIG5lZWRzTmV3QnVmZmVyID0gYXR0cmliICYmIHR5cGVvZiBhdHRyaWIuc2V0QXJyYXkgIT09ICdmdW5jdGlvbidcbiAgICBpZiAoIWF0dHJpYiB8fCBuZWVkc05ld0J1ZmZlcikge1xuICAgICAgLy8gV2UgYXJlIG9uIGFuIG9sZCB2ZXJzaW9uIG9mIFRocmVlSlMgd2hpY2ggY2FuJ3RcbiAgICAgIC8vIHN1cHBvcnQgZ3Jvd2luZyAvIHNocmlua2luZyBidWZmZXJzLCBzbyB3ZSBuZWVkXG4gICAgICAvLyB0byBidWlsZCBhIG5ldyBidWZmZXJcbiAgICAgIGlmIChuZWVkc05ld0J1ZmZlciAmJiAhd2FybmVkKSB7XG4gICAgICAgIHdhcm5lZCA9IHRydWVcbiAgICAgICAgY29uc29sZS53YXJuKFtcbiAgICAgICAgICAnQSBXZWJHTCBidWZmZXIgaXMgYmVpbmcgdXBkYXRlZCB3aXRoIGEgbmV3IHNpemUgb3IgaXRlbVNpemUsICcsXG4gICAgICAgICAgJ2hvd2V2ZXIgdGhpcyB2ZXJzaW9uIG9mIFRocmVlSlMgb25seSBzdXBwb3J0cyBmaXhlZC1zaXplIGJ1ZmZlcnMuJyxcbiAgICAgICAgICAnXFxuVGhlIG9sZCBidWZmZXIgbWF5IHN0aWxsIGJlIGtlcHQgaW4gbWVtb3J5LlxcbicsXG4gICAgICAgICAgJ1RvIGF2b2lkIG1lbW9yeSBsZWFrcywgaXQgaXMgcmVjb21tZW5kZWQgdGhhdCB5b3UgZGlzcG9zZSAnLFxuICAgICAgICAgICd5b3VyIGdlb21ldHJpZXMgYW5kIGNyZWF0ZSBuZXcgb25lcywgb3IgdXBkYXRlIHRvIFRocmVlSlMgcjgyIG9yIG5ld2VyLlxcbicsXG4gICAgICAgICAgJ1NlZSBoZXJlIGZvciBkaXNjdXNzaW9uOlxcbicsXG4gICAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvcHVsbC85NjMxJ1xuICAgICAgICBdLmpvaW4oJycpKVxuICAgICAgfVxuXG4gICAgICAvLyBCdWlsZCBhIG5ldyBhdHRyaWJ1dGVcbiAgICAgIGF0dHJpYiA9IG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoZGF0YSwgaXRlbVNpemUpO1xuICAgIH1cblxuICAgIGF0dHJpYi5pdGVtU2l6ZSA9IGl0ZW1TaXplXG4gICAgYXR0cmliLm5lZWRzVXBkYXRlID0gdHJ1ZVxuXG4gICAgLy8gTmV3IHZlcnNpb25zIG9mIFRocmVlSlMgc3VnZ2VzdCB1c2luZyBzZXRBcnJheVxuICAgIC8vIHRvIGNoYW5nZSB0aGUgZGF0YS4gSXQgd2lsbCB1c2UgYnVmZmVyRGF0YSBpbnRlcm5hbGx5LFxuICAgIC8vIHNvIHlvdSBjYW4gY2hhbmdlIHRoZSBhcnJheSBzaXplIHdpdGhvdXQgYW55IGlzc3Vlc1xuICAgIGlmICh0eXBlb2YgYXR0cmliLnNldEFycmF5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhdHRyaWIuc2V0QXJyYXkoZGF0YSlcbiAgICB9XG5cbiAgICByZXR1cm4gYXR0cmliXG4gIH0gZWxzZSB7XG4gICAgLy8gY29weSBkYXRhIGludG8gdGhlIGV4aXN0aW5nIGFycmF5XG4gICAgZmxhdHRlbihkYXRhLCBhdHRyaWIuYXJyYXkpXG4gICAgYXR0cmliLm5lZWRzVXBkYXRlID0gdHJ1ZVxuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuLy8gVGVzdCB3aGV0aGVyIHRoZSBhdHRyaWJ1dGUgbmVlZHMgdG8gYmUgcmUtY3JlYXRlZCxcbi8vIHJldHVybnMgZmFsc2UgaWYgd2UgY2FuIHJlLXVzZSBpdCBhcy1pcy5cbmZ1bmN0aW9uIHJlYnVpbGRBdHRyaWJ1dGUgKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUpIHtcbiAgaWYgKGF0dHJpYi5pdGVtU2l6ZSAhPT0gaXRlbVNpemUpIHJldHVybiB0cnVlXG4gIGlmICghYXR0cmliLmFycmF5KSByZXR1cm4gdHJ1ZVxuICB2YXIgYXR0cmliTGVuZ3RoID0gYXR0cmliLmFycmF5Lmxlbmd0aFxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBBcnJheS5pc0FycmF5KGRhdGFbMF0pKSB7XG4gICAgLy8gWyBbIHgsIHksIHogXSBdXG4gICAgcmV0dXJuIGF0dHJpYkxlbmd0aCAhPT0gZGF0YS5sZW5ndGggKiBpdGVtU2l6ZVxuICB9IGVsc2Uge1xuICAgIC8vIFsgeCwgeSwgeiBdXG4gICAgcmV0dXJuIGF0dHJpYkxlbmd0aCAhPT0gZGF0YS5sZW5ndGhcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cbiIsInZhciBuZXdsaW5lID0gL1xcbi9cbnZhciBuZXdsaW5lQ2hhciA9ICdcXG4nXG52YXIgd2hpdGVzcGFjZSA9IC9cXHMvXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGV4dCwgb3B0KSB7XG4gICAgdmFyIGxpbmVzID0gbW9kdWxlLmV4cG9ydHMubGluZXModGV4dCwgb3B0KVxuICAgIHJldHVybiBsaW5lcy5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICByZXR1cm4gdGV4dC5zdWJzdHJpbmcobGluZS5zdGFydCwgbGluZS5lbmQpXG4gICAgfSkuam9pbignXFxuJylcbn1cblxubW9kdWxlLmV4cG9ydHMubGluZXMgPSBmdW5jdGlvbiB3b3Jkd3JhcCh0ZXh0LCBvcHQpIHtcbiAgICBvcHQgPSBvcHR8fHt9XG5cbiAgICAvL3plcm8gd2lkdGggcmVzdWx0cyBpbiBub3RoaW5nIHZpc2libGVcbiAgICBpZiAob3B0LndpZHRoID09PSAwICYmIG9wdC5tb2RlICE9PSAnbm93cmFwJykgXG4gICAgICAgIHJldHVybiBbXVxuXG4gICAgdGV4dCA9IHRleHR8fCcnXG4gICAgdmFyIHdpZHRoID0gdHlwZW9mIG9wdC53aWR0aCA9PT0gJ251bWJlcicgPyBvcHQud2lkdGggOiBOdW1iZXIuTUFYX1ZBTFVFXG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5tYXgoMCwgb3B0LnN0YXJ0fHwwKVxuICAgIHZhciBlbmQgPSB0eXBlb2Ygb3B0LmVuZCA9PT0gJ251bWJlcicgPyBvcHQuZW5kIDogdGV4dC5sZW5ndGhcbiAgICB2YXIgbW9kZSA9IG9wdC5tb2RlXG5cbiAgICB2YXIgbWVhc3VyZSA9IG9wdC5tZWFzdXJlIHx8IG1vbm9zcGFjZVxuICAgIGlmIChtb2RlID09PSAncHJlJylcbiAgICAgICAgcmV0dXJuIHByZShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aClcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBncmVlZHkobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgsIG1vZGUpXG59XG5cbmZ1bmN0aW9uIGlkeE9mKHRleHQsIGNociwgc3RhcnQsIGVuZCkge1xuICAgIHZhciBpZHggPSB0ZXh0LmluZGV4T2YoY2hyLCBzdGFydClcbiAgICBpZiAoaWR4ID09PSAtMSB8fCBpZHggPiBlbmQpXG4gICAgICAgIHJldHVybiBlbmRcbiAgICByZXR1cm4gaWR4XG59XG5cbmZ1bmN0aW9uIGlzV2hpdGVzcGFjZShjaHIpIHtcbiAgICByZXR1cm4gd2hpdGVzcGFjZS50ZXN0KGNocilcbn1cblxuZnVuY3Rpb24gcHJlKG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGxpbmVzID0gW11cbiAgICB2YXIgbGluZVN0YXJ0ID0gc3RhcnRcbiAgICBmb3IgKHZhciBpPXN0YXJ0OyBpPGVuZCAmJiBpPHRleHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNociA9IHRleHQuY2hhckF0KGkpXG4gICAgICAgIHZhciBpc05ld2xpbmUgPSBuZXdsaW5lLnRlc3QoY2hyKVxuXG4gICAgICAgIC8vSWYgd2UndmUgcmVhY2hlZCBhIG5ld2xpbmUsIHRoZW4gc3RlcCBkb3duIGEgbGluZVxuICAgICAgICAvL09yIGlmIHdlJ3ZlIHJlYWNoZWQgdGhlIEVPRlxuICAgICAgICBpZiAoaXNOZXdsaW5lIHx8IGk9PT1lbmQtMSkge1xuICAgICAgICAgICAgdmFyIGxpbmVFbmQgPSBpc05ld2xpbmUgPyBpIDogaSsxXG4gICAgICAgICAgICB2YXIgbWVhc3VyZWQgPSBtZWFzdXJlKHRleHQsIGxpbmVTdGFydCwgbGluZUVuZCwgd2lkdGgpXG4gICAgICAgICAgICBsaW5lcy5wdXNoKG1lYXN1cmVkKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsaW5lU3RhcnQgPSBpKzFcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGluZXNcbn1cblxuZnVuY3Rpb24gZ3JlZWR5KG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoLCBtb2RlKSB7XG4gICAgLy9BIGdyZWVkeSB3b3JkIHdyYXBwZXIgYmFzZWQgb24gTGliR0RYIGFsZ29yaXRobVxuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2xpYmdkeC9saWJnZHgvYmxvYi9tYXN0ZXIvZ2R4L3NyYy9jb20vYmFkbG9naWMvZ2R4L2dyYXBoaWNzL2cyZC9CaXRtYXBGb250Q2FjaGUuamF2YVxuICAgIHZhciBsaW5lcyA9IFtdXG5cbiAgICB2YXIgdGVzdFdpZHRoID0gd2lkdGhcbiAgICAvL2lmICdub3dyYXAnIGlzIHNwZWNpZmllZCwgd2Ugb25seSB3cmFwIG9uIG5ld2xpbmUgY2hhcnNcbiAgICBpZiAobW9kZSA9PT0gJ25vd3JhcCcpXG4gICAgICAgIHRlc3RXaWR0aCA9IE51bWJlci5NQVhfVkFMVUVcblxuICAgIHdoaWxlIChzdGFydCA8IGVuZCAmJiBzdGFydCA8IHRleHQubGVuZ3RoKSB7XG4gICAgICAgIC8vZ2V0IG5leHQgbmV3bGluZSBwb3NpdGlvblxuICAgICAgICB2YXIgbmV3TGluZSA9IGlkeE9mKHRleHQsIG5ld2xpbmVDaGFyLCBzdGFydCwgZW5kKVxuXG4gICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgc3RhcnQgb2YgbGluZVxuICAgICAgICB3aGlsZSAoc3RhcnQgPCBuZXdMaW5lKSB7XG4gICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZSggdGV4dC5jaGFyQXQoc3RhcnQpICkpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIHN0YXJ0KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZGV0ZXJtaW5lIHZpc2libGUgIyBvZiBnbHlwaHMgZm9yIHRoZSBhdmFpbGFibGUgd2lkdGhcbiAgICAgICAgdmFyIG1lYXN1cmVkID0gbWVhc3VyZSh0ZXh0LCBzdGFydCwgbmV3TGluZSwgdGVzdFdpZHRoKVxuXG4gICAgICAgIHZhciBsaW5lRW5kID0gc3RhcnQgKyAobWVhc3VyZWQuZW5kLW1lYXN1cmVkLnN0YXJ0KVxuICAgICAgICB2YXIgbmV4dFN0YXJ0ID0gbGluZUVuZCArIG5ld2xpbmVDaGFyLmxlbmd0aFxuXG4gICAgICAgIC8vaWYgd2UgaGFkIHRvIGN1dCB0aGUgbGluZSBiZWZvcmUgdGhlIG5leHQgbmV3bGluZS4uLlxuICAgICAgICBpZiAobGluZUVuZCA8IG5ld0xpbmUpIHtcbiAgICAgICAgICAgIC8vZmluZCBjaGFyIHRvIGJyZWFrIG9uXG4gICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzV2hpdGVzcGFjZSh0ZXh0LmNoYXJBdChsaW5lRW5kKSkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgbGluZUVuZC0tXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGluZUVuZCA9PT0gc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV4dFN0YXJ0ID4gc3RhcnQgKyBuZXdsaW5lQ2hhci5sZW5ndGgpIG5leHRTdGFydC0tXG4gICAgICAgICAgICAgICAgbGluZUVuZCA9IG5leHRTdGFydCAvLyBJZiBubyBjaGFyYWN0ZXJzIHRvIGJyZWFrLCBzaG93IGFsbC5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV4dFN0YXJ0ID0gbGluZUVuZFxuICAgICAgICAgICAgICAgIC8vZWF0IHdoaXRlc3BhY2UgYXQgZW5kIG9mIGxpbmVcbiAgICAgICAgICAgICAgICB3aGlsZSAobGluZUVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNXaGl0ZXNwYWNlKHRleHQuY2hhckF0KGxpbmVFbmQgLSBuZXdsaW5lQ2hhci5sZW5ndGgpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGxpbmVFbmQtLVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobGluZUVuZCA+PSBzdGFydCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1lYXN1cmUodGV4dCwgc3RhcnQsIGxpbmVFbmQsIHRlc3RXaWR0aClcbiAgICAgICAgICAgIGxpbmVzLnB1c2gocmVzdWx0KVxuICAgICAgICB9XG4gICAgICAgIHN0YXJ0ID0gbmV4dFN0YXJ0XG4gICAgfVxuICAgIHJldHVybiBsaW5lc1xufVxuXG4vL2RldGVybWluZXMgdGhlIHZpc2libGUgbnVtYmVyIG9mIGdseXBocyB3aXRoaW4gYSBnaXZlbiB3aWR0aFxuZnVuY3Rpb24gbW9ub3NwYWNlKHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gICAgdmFyIGdseXBocyA9IE1hdGgubWluKHdpZHRoLCBlbmQtc3RhcnQpXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICBlbmQ6IHN0YXJ0K2dseXBoc1xuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGV4dGVuZFxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gICAgdmFyIHRhcmdldCA9IHt9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldXG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldFxufVxuIl19
