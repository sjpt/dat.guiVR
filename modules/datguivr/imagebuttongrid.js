/** 
 * Grid of buttons with images on (which might come from a file or existing texture,
 * the texture might be from a RenderTarget...).
 * 
 * I'd put this more separate from the datgui modules but need to think a little
 * bit about how to structure that etc.  Very un-DRY, but I'm starting by just
 * copying existing imagebutton.js in its entirety.
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

export default function createImageButtonGrid( {
  textCreator,
  objects,
  width = Layout.PANEL_WIDTH,
  height = Layout.PANEL_WIDTH / 4, //will depend on rows, computed later
  depth = Layout.PANEL_DEPTH,
  columns = 4
} = {} ){
  
  const buttons = [];

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

  const BUTTON_WIDTH = width * 0.25 - Layout.PANEL_MARGIN;
  const BUTTON_HEIGHT = height - Layout.PANEL_MARGIN;
  const BUTTON_DEPTH = Layout.BUTTON_DEPTH * 2;

  const group = new THREE.Group();
  group.guiType = "imagebuttongrid";
  group.toString = () => `[${group.guiType}: ${objects}]`;
  group.guiChildren = buttons;
  
  const rows = Math.ceil(objects.length / columns);
  height *= rows;
  group.spacing = height; 

  const panel = Layout.createPanel( width, height, depth );
  group.add( panel );

  var i = 0;
  const colOffset = (0.5 * Layout.PANEL_WIDTH) - (0.5 * BUTTON_WIDTH) - 0.043;
  const rowOffset = 0.5 * BUTTON_WIDTH;
  objects.forEach(obj => {
    let subgroup = new THREE.Group();
    subgroup.guiType = "imageButtonGridElement";
    group.add(subgroup);
    buttons.push(subgroup);

    const col = i % columns;
    //const y = (BUTTON_WIDTH * 0.5) + height * row/rows;
    const x = (BUTTON_WIDTH * col) - colOffset;
    const row = Math.floor(i / columns);
    //const x = (BUTTON_HEIGHT * 0.5) + width * col/columns;
    const y = (height/2) - (BUTTON_HEIGHT * row) - rowOffset;

    //  base checkbox
    const rect = new THREE.PlaneGeometry( BUTTON_WIDTH, BUTTON_HEIGHT, 1, 1 );
    const modifier = new THREE.SubdivisionModifier( 1 );
    //modifier.modify( rect );
    rect.translate( x, y, BUTTON_DEPTH );

    //  hitscan volume
    const hitscanMaterial = new THREE.MeshBasicMaterial();
    hitscanMaterial.visible = false;

    const hitscanVolume = new THREE.Mesh( rect.clone(), hitscanMaterial );
    hitscanVolume.position.z = BUTTON_DEPTH;
    hitscanVolume.position.x = width * 0.5;
    //hitscanVolume.position.x = (BUTTON_WIDTH * 0.5) + width * row;
    //hitscanVolume.position.y = (BUTTON_HEIGHT * 0.5) + col * row;

    const material = new THREE.MeshBasicMaterial();
    material.transparent = true;
    applyImageToMaterial(obj.image, material);
    const filledVolume = new THREE.Mesh( rect.clone(), material );
    hitscanVolume.add( filledVolume );

    //button label & descriptor label removed; might want options like a hover label in future.
    
    const controllerID = Layout.createControllerIDBox( height, Colors.CONTROLLER_ID_BUTTON );
    controllerID.position.z = depth;

    //panel.add( descriptorLabel, hitscanVolume, controllerID );
    subgroup.add( hitscanVolume, controllerID );
    panel.add(subgroup);

    const interaction = createInteraction( hitscanVolume );
    interaction.events.on( 'onPressed', handleOnPress );
    interaction.events.on( 'onReleased', handleOnRelease );


    function handleOnPress( p ){
        if( subgroup.visible === false ){
            return;
        }

        obj.func();

        hitscanVolume.position.z = BUTTON_DEPTH * 0.1;

        p.locked = true;
    }

    function handleOnRelease(){
        hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
    }

    subgroup.updateView = () => {

        if( interaction.hovering() ){
            material.color.setHex( 0xFFFFFF );
        }
        else{
            material.color.setHex( 0xCCCCCC );
        }

    }
    
    subgroup.updateView();

    subgroup.interaction = interaction;
    subgroup.hitscan = hitscanVolume; //XXX: making this single element rather than array,
    //that means these 'subgroup' buttons aren't acting exactly as normal dat.GUIVR controllers
    i++;
  });

  group.hitscan = buttons.map(b=>b.hitscan);//.push(panel);

  const grabInteraction = Grab.create( { group, panel } );

  function updateView() {
      buttons.forEach(b=>b.updateView());
  }
  
  group.updateControl = function( inputObjects ){
    buttons.forEach(b=>{
        b.interaction.update( inputObjects );
    });
    //interaction.update( inputObjects );
    grabInteraction.update( inputObjects );
    updateView();
  };

  group.name = function( str ){
    descriptorLabel.updateLabel( str );
    return group;
  };


  return group;
}