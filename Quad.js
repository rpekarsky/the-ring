/**
 * @author Mat Groves http://matgroves.com/
 */

 /**
 * 
 * @class Quad
 * @extends DisplayObjectContainer
 * @constructor
 * @param texture {Texture} The texture to use
 * @param width {Number} the width 
 * @param height {Number} the height
 * 
 */
PIXI.Quad = function(texture1,texture2)
{
    PIXI.DisplayObjectContainer.call( this );
    
    this.texture1 = texture1;
    this.texture2 = texture2;

    // set up the main bits..

    this.verticies = new PIXI.Float32Array( 4*2 );
    this.uvs = new PIXI.Float32Array( 4*2 );
    this.indices = new PIXI.Uint16Array( 4 );
    this.colors = new PIXI.Float32Array( 4*2 );
    
    var v = this.verticies;
    var uvs = this.uvs;
    var ind = this.indices;

    v[0] = -1;
    v[1] = -1;

    v[2] = 1;
    v[3] = -1;

    v[4] = -1;
    v[5] = 1;

    v[6] = 1;
    v[7] = 1;


    uvs[0] = 0;
    uvs[1] = 1;

    uvs[2] = 1;
    uvs[3] = 1;

    uvs[4] = 0;
    uvs[5] = 0;

    uvs[6] = 1;
    uvs[7] = 0;

    ind[0] = 0;
    ind[1] = 1;
    ind[2] = 2;
    ind[3] = 3;


    // for (var i = 0; i < this.colors.length; i++) {
    //     this.colors[i] = 1;
    // };

    this.blendMode = PIXI.blendModes.NORMAL;
    this.dirty = true;
};

// constructor
PIXI.Quad.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.Quad.prototype.constructor = PIXI.Quad;

PIXI.Quad.prototype.update = function(){
    if(this.quadShader){
        this.quadShader.syncUniforms();
    }
}
PIXI.Quad.prototype._renderWebGL = function(renderSession)
{
    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if(!this.visible || this.alpha <= 0)return;
    // render triangle strip..

    renderSession.spriteBatch.stop();

    // init! init!
    if(!this._vertexBuffer)this._initWebGL(renderSession);
    


    // renderSession.shaderManager.setShader(renderSession.shaderManager.stripShader);
    renderSession.shaderManager.setShader(this.quadShader);

    this._renderQuad(renderSession);

    ///renderSession.shaderManager.activateDefaultShader();

    renderSession.spriteBatch.start();

    //TODO check culling  
};

PIXI.Quad.prototype._initWebGL = function(renderSession)
{
    // build the strip!
    var gl = renderSession.gl;  


    this.quadShader = new PIXI.BlendShader(gl,this.texture1,this.texture2);

    
    this._vertexBuffer = gl.createBuffer();
    this._indexBuffer = gl.createBuffer();
    this._uvBuffer = gl.createBuffer();
    // this._colorBuffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,  this.uvs, gl.STATIC_DRAW);

    // gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
};

PIXI.Quad.prototype._renderQuad = function(renderSession)
{
    var gl = renderSession.gl;
    var projection = renderSession.projection,
        offset = renderSession.offset,
        shader = this.quadShader;
        // shader = renderSession.shaderManager.stripShader;

    // gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mat4Real);

    // renderSession.blendModeManager.setBlendMode(this.blendMode);
    // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.ZERO,gl.ONE);
    // var curr = renderSession.blendModeManager.currentBlendMode;
    // renderSession.blendModeManager.setBlendMode(this.blendMode);
    // gl.blendFunc(gl.DST_ALPHA, gl.DST_ALPHA);
    // console.log(curr,renderSession.blendModeManager.currentBlendMode);
    // console.log(this.blendMode);
    
    // PIXI.WebGLBlendModeManager.setBlendMode(this.blendMode);

    // set uniforms
    // gl.uniformMatrix3fv(shader.translationMatrix, false, this.worldTransform.toArray(true));
    // gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
    // gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);
    // gl.uniform1f(shader.alpha, 1);

    if(!this.dirty)
    {
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.verticies);
        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        
        // update the uvs
        gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

        // gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
        // gl.vertexAttribPointer(shader.colorAttribute, 2, gl.FLOAT, false, 0, 0);
            
        // gl.activeTexture(gl.TEXTURE0);
         // bind the current texture
        // gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id] || PIXI.createWebGLTexture(this.texture.baseTexture, gl));
    
        // dont need to upload!
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    
    
    }
    else
    {

        this.dirty = false;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        
        // // update the uvs
        gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
        console.log(this.uvs);
        // console.log(shader.aTextureCoord);
        // gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
        // gl.vertexAttribPointer(shader.colorAttribute, 2, gl.FLOAT, false, 0, 0);

        // gl.activeTexture(gl.TEXTURE0);
        // gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id] || PIXI.createWebGLTexture(this.texture.baseTexture, gl));
    
        // // dont need to upload!
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        
    }
    
    gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0);
};

/*
 * Sets the texture that the Quad will use 
 *
 * @method setTexture
 * @param texture {Texture} the texture that will be used
 * @private
 */

/*
PIXI.Quad.prototype.setTexture = function(texture)
{
    //TODO SET THE TEXTURES
    //TODO VISIBILITY

    // stop current texture
    this.texture = texture;
    this.width   = texture.frame.width;
    this.height  = texture.frame.height;
    this.updateFrame = true;
};
*/

/**
 * When the texture is updated, this event will fire to update the scale and frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */

PIXI.Quad.prototype.onTextureUpdate = function()
{
    this.updateFrame = true;
};