import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import React from "react"
import StoneModel from "../Models/StoneModel"

function StoneScene() {
  return (
    <Canvas legacy={true} camera={{ position: [0, 500, 0] }}>
      <StoneModel />
      <OrbitControls />
    </Canvas>
  )
}

export default StoneScene
