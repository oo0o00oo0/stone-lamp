import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { useSpring, animated } from "@react-spring/three"
import { useGLTF } from "@react-three/drei"
import { extend, useLoader } from "@react-three/fiber"

import Day from "./day.jpg"
import Night from "./night.jpg"
// import Mesh from "./meshModel.glb"

// import glsl from "babel-plugin-glsl/macro"

const meshUrl = `./meshModel.glb`

class BlendTextureShader extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0.0 },
        color: new THREE.Color(0.2, 0.0, 0.1),
        uBlend: { value: 0.0 },
        uTexture: { value: new THREE.Texture() },
        textureA: { value: new THREE.Texture() },
        textureB: { value: new THREE.Texture() },
      },
      vertexShader: `
              varying vec2 vUv;
              void main() {
              vUv = uv;   
               gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
              `,
      fragmentShader: `
             uniform float uBlend;
             uniform float uTime;
             uniform vec3 color;
             varying vec2 vUv;
             uniform sampler2D uTexture;
             uniform sampler2D textureA;
             uniform sampler2D textureB;
    
    
    void main() {
        
      vec4 colorA = texture2D( textureA, vUv );
      vec4 colorB = texture2D( textureB, vUv );
      vec3 texture = texture2D(textureB, vUv).rgb;

      gl_FragColor = vec4( mix( colorA.xyz, colorB.xyz, uBlend ), 1.0 ) ;
      // gl_FragColor = vec4(texture, 1.0);
      // gl_FragColor = vec4(uTime,0.0,1.0, 1.0);

    }
    `,
    })
  }
  // get uTime() {
  //     return this.uniforms.uTime.value
  // }
  // set uTime(v) {
  //     this.uniforms.uTime.value = v
  // }
  get uBlend() {
    return this.uniforms.uBlend.value
  }
  set uBlend(v) {
    this.uniforms.uBlend.value = v
  }
  get textureA() {
    return this.uniforms.textureA.value
  }
  set textureA(v) {
    this.uniforms.textureA.value = v
  }
  get textureB() {
    return this.uniforms.textureB.value
  }
  set textureB(v) {
    this.uniforms.textureB.value = v
  }
  get uTexture() {
    return this.uniforms.uTexture.value
  }

  set uTexture(v) {
    this.uniforms.uTexture.value = v
  }
}

extend({ BlendTextureShader })

const AnimatedBlendTexture = animated("blendTextureShader")

function MixMapMaterial() {
  console.log("mis")
  const { nodes } = useGLTF(`./src/assets/models/meshModel.glb`)

  const [state, set] = useState(false)

  const [text1] = useLoader(THREE.TextureLoader, [Day])
  const [text2] = useLoader(THREE.TextureLoader, [Night])

  console.log(nodes)

  text1.flipY = false
  text2.flipY = false
  text1.encoding = THREE.sRGBEncoding
  text2.encoding = THREE.sRGBEncoding

  const shaderRef = useRef()

  const [{ time }] = useSpring(
    {
      time: state ? 0.0 : 1.0,
      config: {
        mass: 10,
        tension: 400,
        friction: 50,
        precision: 0.01,
        clamp: true,
      },
    },
    [state]
  )

  return (
    <>
      <Bulb state={state} />
      <animated.mesh
        // position={[200, 0, -150]}
        geometry={nodes.mesh_0.geometry}
        onClick={() => set(!state)}
        onPointerOver={(e) => {
          document.body.style.cursor = "pointer"
          e.stopPropagation()
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = "auto"
          e.stopPropagation()
        }}
      >
        <AnimatedBlendTexture
          uBlend={time}
          ref={shaderRef}
          uTexture={text2}
          textureA={text1}
          textureB={text2}
          attach="material"
          color="hotpink"
          uTime={time}
        />
      </animated.mesh>
    </>
  )
}

function Bulb({ state }) {
  const { nodes } = useGLTF(`./src/assets/models/bulb.glb`)

  const [{ colour }] = useSpring(
    {
      colour: state ? "#1a1a1a" : "#FFE3BA",
      config: {
        mass: 10,
        tension: 400,
        friction: 50,
        precision: 0.01,
        clamp: true,
      },
    },
    [state]
  )

  return (
    <animated.mesh
      // position={[200, 0, -150]}
      geometry={nodes.mesh_0.geometry}
      position={nodes.mesh_0.position}
      // onClick={() => set(!state)}
      // onPointerOver={(e) => {
      //   document.body.style.cursor = "pointer"
      //   e.stopPropagation()
      // }}
      // onPointerOut={(e) => {
      //   document.body.style.cursor = "auto"
      //   e.stopPropagation()
      // }}
    >
      <animated.meshMatcapMaterial color={colour} />
    </animated.mesh>
  )
}
export default MixMapMaterial
