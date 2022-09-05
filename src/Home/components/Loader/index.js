import * as THREE from "three"
import { useEffect, useLayoutEffect, Suspense } from "react"
import { Canvas, applyProps } from "@react-three/fiber"
import {
	AccumulativeShadows,
	RandomizedLight,
	OrbitControls,
	Environment,
	useGLTF,
} from "@react-three/drei"
import { FlakesTexture } from "three-stdlib"

const Loader = (props) => {
	const { value } = props

	return (
		<div>
			<InternalLoader value={value} />
		</div>
	)
}

function InternalLoader(props) {
	const { value } = props
	const { value: modelUrl } = value

	return (
		<Canvas shadows camera={{ position: [8, 1.5, 8], fov: 25 }}>
			<Suspense fallback={null}>
				<Model
					rotation={[-0.63, 0, 0]}
					scale={2}
					position={[0, -1.175, 0]}
					url={modelUrl}
				/>
			</Suspense>
			{/* <AccumulativeShadows temporal frames={100} color="orange" colorBlend={2} toneMapped={true} alphaTest={0.9} opacity={2} scale={12} position={[0, -0.5, 0]}>
        <RandomizedLight amount={8} radius={4} ambient={0.5} intensity={1} position={[5, 5, -10]} bias={0.001} />
      </AccumulativeShadows> */}
			<OrbitControls autoRotate={false} />
			<Environment preset="city" />
		</Canvas>
	)
}

function Model(props) {
	const { url, ...nextProps } = props
	const { scene, materials } = useGLTF(url)
	useLayoutEffect(() => {
		scene.traverse(
			(obj) => obj.isMesh && (obj.receiveShadow = obj.castShadow = true)
		)
    console.log(materials.default) 
    return 
		applyProps(materials.default, {
			color: "orange",
			roughness: 0,
			normalMap: new THREE.CanvasTexture(
				new FlakesTexture(),
				THREE.UVMapping,
				THREE.RepeatWrapping,
				THREE.RepeatWrapping
			),
			"normalMap-repeat": [40, 40],
			normalScale: [0.05, 0.05],
		})
	})
	return <primitive object={scene} {...nextProps} />
}

export default Loader
