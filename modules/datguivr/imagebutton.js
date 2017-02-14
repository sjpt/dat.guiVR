/** 
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

import * as SubdivisionModifier from '../thirdparty/SubdivisionModifier';

import createTextLabel from './textlabel';
import createInteraction from './interaction';
import * as Colors from './colors';
import * as Layout from './layout';
import * as SharedMaterials from './sharedmaterials';
import * as Grab from './grab';

export default function createImageButton( {
  textCreator,
  object,
  propertyName = 'undefined',
  image = "textures/spotlight.jpg", //TODO better default
  width = Layout.PANEL_WIDTH,
  height = Layout.PANEL_WIDTH / 3,
  depth = Layout.PANEL_DEPTH
} = {} ){

  function applyImageToMaterial(image, targetMaterial) {
      if (typeof image === "string") {
        //TODO cache.  Does TextureLoader already cache?
        //TODO Image only on front face of button.
        new THREE.TextureLoader().load(image, (texture) => {
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

  const BUTTON_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  const BUTTON_HEIGHT = height - Layout.PANEL_MARGIN;
  const BUTTON_DEPTH = Layout.BUTTON_DEPTH;

  const group = new THREE.Group();
  group.spacing = height;

  const panel = Layout.createPanel( width, height, depth );
  group.add( panel );

  //  base checkbox
  const divisions = 4;
  const aspectRatio = BUTTON_WIDTH / BUTTON_HEIGHT;
  const rect = new THREE.BoxGeometry( BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_DEPTH, Math.floor( divisions * aspectRatio ), divisions, divisions );
  const modifier = new THREE.SubdivisionModifier( 1 );
  modifier.modify( rect );
  rect.translate( BUTTON_WIDTH * 0.5, 0, 0 );

  //  hitscan volume
  const hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  const hitscanVolume = new THREE.Mesh( rect.clone(), hitscanMaterial );
  hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  hitscanVolume.position.x = width * 0.5;

  const material = new THREE.MeshBasicMaterial();
  applyImageToMaterial(image, material);
  const filledVolume = new THREE.Mesh( rect.clone(), material );
  hitscanVolume.add( filledVolume );

  //button label removed.

  const descriptorLabel = textCreator.create( propertyName );
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  const controllerID = Layout.createControllerIDBox( height, Colors.CONTROLLER_ID_BUTTON );
  controllerID.position.z = depth;

  panel.add( descriptorLabel, hitscanVolume, controllerID );

  const interaction = createInteraction( hitscanVolume );
  interaction.events.on( 'onPressed', handleOnPress );
  interaction.events.on( 'onReleased', handleOnRelease );

  updateView();

  function handleOnPress( p ){
    if( group.visible === false ){
      return;
    }

    object[ propertyName ]();

    hitscanVolume.position.z = BUTTON_DEPTH * 0.1;

    p.locked = true;
  }

  function handleOnRelease(){
    hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  }

  function updateView(){

    if( interaction.hovering() ){
      material.color.setHex( Colors.BUTTON_HIGHLIGHT_COLOR );
    }
    else{
      material.color.setHex( Colors.BUTTON_COLOR );
    }

  }

  group.interaction = interaction;
  group.hitscan = [ hitscanVolume, panel ];

  const grabInteraction = Grab.create( { group, panel } );

  group.update = function( inputObjects ){
    interaction.update( inputObjects );
    grabInteraction.update( inputObjects );
    updateView();
  };

  group.name = function( str ){
    descriptorLabel.update( str );
    return group;
  };


  return group;
}