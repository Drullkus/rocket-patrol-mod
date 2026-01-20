#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;

varying vec2 fragCoord;

// Yoinked from https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

void main( void ) {
    vec2 uv = fragCoord / resolution.xy;

    vec4 texColor = texture2D(iChannel0, vec2(time * 0.48, 0.0) - uv);

    vec3 hsv = rgb2hsv(texColor.rgb);

    float streak = sin(time + hsv.x * PI * 2.0) + cos(hsv.z * PI * 2.0) - hsv.y * 8.0;

    vec3 color = clamp(texColor.rgb * streak, 0.0, 0.333);

    gl_FragColor = vec4(color, 0.0);
}
