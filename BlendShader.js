/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


PIXI.BlendShader = function(gl,tex1,tex2)
{
    this._UID = PIXI._UID++;
    
    this.gl = gl;
    window.gl = this.gl;
    /**
    * @property {any} program - The WebGL program.
    */
    this.program = null;
    this.texture1 = tex1;
    this.texture2 = tex2;
    this.shader = new PIXI.CustomPixiShader(gl);
    // this.shader.attributes = [this.shader.aVertexPosition, this.shader.aTextureCoord];
    // this.shader.attributes = [this.shader.aVertexPosition];
    /**
     * @property {array} fragmentSrc - The fragment shader.
     */
    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'uniform sampler2D uSampler1;',
        'uniform sampler2D uSampler2;',
        'const vec4 color = vec4(0.5, 0.5,1.0,1.0);',

        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler1,vTextureCoord.xy)*texture2D(uSampler2,vTextureCoord.xy);',
        '}'
    ];

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'uniform sampler2D uSampler1;',
        'uniform sampler2D uSampler2;',
        'void main(void) {',
            'vec4 color1 = texture2D(uSampler1, vTextureCoord.xy);',
            'vec4 color2 = texture2D(uSampler2, vTextureCoord.xy);',
            'vec4 outColor = vec4(color1.rgb / (1.0 - color2.rgb), color1.a);',
            'gl_FragColor = mix(color1, outColor, color2.a);',
            // 'gl_FragColor = color2;',
        '}'
    ];

    //     vec4 inColor = v_vColour * texture2D(gm_BaseTexture, v_vTexcoord);
    // vec4 blend = texture2D(texColorDodge, v_vTexcoord);
    // vec4 outColor = vec4(inColor.rgb / (1.0 - blend.rgb), inColor.a);
    // gl_FragColor = mix(outColor, inColor, 1.0 - blend.a);

     /**
    * @property {array} fragmentSrc - The fragment shader.
    */
    this.vertexSrc  = [
        'attribute vec2 aVertexPosition;',
        'attribute vec2 aTextureCoord;',
        // 'attribute vec2 aColor;',
        // 'uniform mat3 translationMatrix;',
        // 'uniform vec2 projectionVector;',
        // 'uniform vec2 offsetVector;',
        // 'uniform float alpha;',
        // 'uniform vec3 tint;',
        'varying vec2 vTextureCoord;',
        // 'varying vec4 vColor;',

        'void main(void) {',
        // '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',
        // '   v -= offsetVector.xyx;',
        // '   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);',
        '   gl_Position = vec4( aVertexPosition.xy , 0.0, 1.0);',
        '   vTextureCoord = aTextureCoord;',
       // '   vColor = aColor * vec4(tint * alpha, alpha);',
        '}'
    ];

    this.shader.vertexSrc = this.vertexSrc;
    this.shader.fragmentSrc = this.fragmentSrc;



    this.shader.uniforms = {
        uSampler1: {type: 'sampler2D', value: this.texture1},
        uSampler2: {type: 'sampler2D', value: this.texture2},
        // translationMatrix: {type: 'mat3'},
        // projectionVector: {type: 'vec2'},
        // offsetVector: {type: 'vec2'},
        // vTextureCoord: {type: 'vec2'},
    }
    this.shader.init();
    // this.init();
    this.shader.syncUniforms();
    return this.shader;
};
