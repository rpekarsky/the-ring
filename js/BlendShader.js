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
       '}'
    ];

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'uniform sampler2D uSampler1;',
        'uniform sampler2D uSampler2;',
        'void main(void) {',
            'vec4 inColor = texture2D(uSampler1, vTextureCoord.xy);',
            'vec4 overlay = texture2D(uSampler2, vTextureCoord.xy);',
            'vec4 outColor = vec4(0.0 ,0.0 ,0.0, inColor.a);',
            'float factor = 3.0;',
            'float borderFactor = 2.5;',
            'if (overlay.a <= 0.00001)',
            '{',
                'gl_FragColor = inColor;',
                'return;',
            '}',

            // 'if (inColor.r > 0.5)',
            // '{',
            //     'outColor.r = (1.0 - (1.0 - 2.0 * (inColor.r - 0.5)) * (1.0 - overlay.r));',
            // '}',
            // 'else',
            // '{   ',
                'outColor.rgb = ((2.0 * inColor.rgb) * overlay.rgb)*factor;',
            // '}',

            // 'if (inColor.g > 0.5)',
            // '{',
            //     'outColor.g = (1.0 - (1.0 - 2.0 * (inColor.g - 0.5)) * (1.0 - overlay.g));',
            // '}',
            // 'else',
            // '{   ',
                // 'outColor.g = ((2.0 * inColor.g) * overlay.g)*factor;',
            // '}',

            // 'if (inColor.b > 0.5)',
            // '{',
            //     'outColor.b = (1.0 - (1.0 - 2.0 * (inColor.b - 0.5)) * (1.0 - overlay.b));',
            // '}',
            // 'else',
            // '{   ',
                // 'outColor.b = ((2.0 * inColor.b) * overlay.b)*factor;',
            // '}',
            // 'outColor *= factor;',
            // 'gl_FragColor = mix(outColor, inColor,1.0 - overlay.a);',
            // 'outColor *= factor;',
            'gl_FragColor = mix(outColor, inColor,1.0 - overlay.a*borderFactor);',
            // 'gl_FragColor = mix(color1, outColor, color2.a);',
       '}'
    ];

//     void main()
// {
//     vec4 inColor = v_vColour * texture2D(gm_BaseTexture, v_vTexcoord);
//     vec4 outColor = vec4(0.0, 0.0, 0.0, inColor.a);
//     vec4 overlay = texture2D(texOverlay, v_vTexcoord);
      
//     if (inColor.r > 0.5)
//     {
//         outColor.r = (1.0 - (1.0 - 2.0 * (inColor.r - 0.5)) * (1.0 - overlay.r));
//     }
//     else
//     {   
//         outColor.r = ((2.0 * inColor.r) * overlay.r);
//     }

//     if (inColor.g > 0.5)
//     {
//         outColor.g = (1.0 - (1.0 - 2.0 * (inColor.g - 0.5)) * (1.0 - overlay.g));
//     }
//     else
//     {   
//         outColor.g = ((2.0 * inColor.g) * overlay.g);
//     }

//     if (inColor.b > 0.5)
//     {
//         outColor.b = (1.0 - (1.0 - 2.0 * (inColor.b - 0.5)) * (1.0 - overlay.b));
//     }
//     else
//     {   
//         outColor.b = ((2.0 * inColor.b) * overlay.b);
//     }
//     gl_FragColor = mix(outColor, inColor,1.0 - overlay.a);
// }

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
