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

import * as SharedMaterials from './sharedmaterials';
import * as Colors from './colors';

export function alignLeft( obj ){
  if( obj instanceof THREE.Mesh ){
    obj.geometry.computeBoundingBox();
    const width = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.max.y;
    obj.geometry.translate( width, 0, 0 );
    return obj;
  }
  else if( obj instanceof THREE.BufferGeometry ){
    obj.computeBoundingBox();
    const width = obj.boundingBox.max.x - obj.boundingBox.max.y;
    obj.translate( width, 0, 0 );
    return obj;
  }
}

export function createPanel( width, height, depth, uniqueMaterial ){
  const material = uniqueMaterial ? new THREE.MeshBasicMaterial({color:0xffffff}) : SharedMaterials.PANEL;
  const panel = new THREE.Mesh( new THREE.BoxGeometry( width, height, depth ), material );
  panel.geometry.translate( width * 0.5, 0, 0 );

  if( uniqueMaterial ){
    material.color.setHex( Colors.DEFAULT_BACK );
  }
  else{
    Colors.colorizeGeometry( panel.geometry, Colors.DEFAULT_BACK );
  }

  panel.userData.currentWidth = width;
  panel.userData.currentHeight = height;
  panel.userData.currentDepth = depth;

  return panel;
}
export function resizePanel(panel, width, height, depth) {
  panel.geometry.scale(width/panel.userData.currentWidth, height/panel.userData.currentHeight, depth/panel.userData.currentDepth);
  panel.userData.currentWidth = width;
  panel.userData.currentHeight = height;
  panel.userData.currentDepth = depth;
}

export function createControllerIDBox( height, color ){
  const panel = new THREE.Mesh( new THREE.BoxGeometry( CONTROLLER_ID_WIDTH, height, CONTROLLER_ID_DEPTH ), SharedMaterials.PANEL );
  panel.geometry.translate( CONTROLLER_ID_WIDTH * 0.5, 0, 0 );
  Colors.colorizeGeometry( panel.geometry, color );
  return panel;
}

export function createDownArrow(){
  const w = 0.0096;
  const h = 0.016;
  const sh = new THREE.Shape();
  sh.moveTo(0,0);
  sh.lineTo(-w,h);
  sh.lineTo(w,h);
  sh.lineTo(0,0);

  const geo = new THREE.ShapeGeometry( sh );
  geo.translate( 0, -h * 0.5, 0 );

  return new THREE.Mesh( geo, SharedMaterials.PANEL );
}

export const PANEL_WIDTH = 1.0;
export const PANEL_HEIGHT = 0.08;
export const PANEL_DEPTH = 0.01;
export const PANEL_SPACING = 0;//.001;
export const PANEL_MARGIN = 0.015;
export const PANEL_LABEL_TEXT_MARGIN = 0.06;
export const PANEL_VALUE_TEXT_MARGIN = 0.02;
export const CONTROLLER_ID_WIDTH = 0.02;
export const CONTROLLER_ID_DEPTH = 0.001;
export const BUTTON_DEPTH = 0.01;
export const FOLDER_WIDTH = 1.026;
export const SUBFOLDER_WIDTH = 1.0;
export const FOLDER_HEIGHT = 0.09;
export const FOLDER_GRAB_HEIGHT = 0.0512;
export const BORDER_THICKNESS = 0.01;
export const CHECKBOX_SIZE = 0.05;
export const TEXT_SCALE = 0.00024;
export const GRID_BUTTON_MARGIN = 0.01;