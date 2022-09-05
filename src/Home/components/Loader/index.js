import * as THREE from "three"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useEffect, useLayoutEffect, Suspense, useMemo, useCallback } from "react"
import { Canvas, applyProps, useLoader } from "@react-three/fiber"
import {
	AccumulativeShadows,
	RandomizedLight,
	OrbitControls,
	Environment,
	useGLTF,
	useFBX
} from "@react-three/drei"
import { FlakesTexture } from "three-stdlib"
import './index.css'

const Loader = (props) => {
	const { value } = props

	return (
		<div
			className="three-model-home-loader"
		>
			<InternalLoader value={value} />
		</div>
	)
}

function InternalLoader(props) {
	const { value } = props
	const { value: modelUrl } = value

	const objectType = useMemo(() => {
		try {
			return modelUrl.split('.').at(-1)
		}catch(err) {
			return null 
		}
	}, [modelUrl])

	const onClick = useCallback(() => {

	}, [])

	const model = useMemo(() => {
		if(!objectType) return null 
		const commonProps = {
			rotation: [0, 1, 0],
			scale: 0.01,
			position: [0, 0, 0],
			url: modelUrl,
			onClick
		}
		switch(objectType) {
			case 'fbx':
				return (
					<FbxModel
						{...commonProps}
					/>
				)
			case 'obj':
				return (
					<ObjModel
						{...commonProps}
					/>
				)
			case 'glb':
			case 'gltf':
				return (
					<GltfModel
						{...commonProps}
					/>
				)
		}
	}, [objectType, modelUrl, onClick])

	return (
		<Canvas shadows camera={{ position: [8, 1.5, 8], fov: 25 }}>
			<Suspense fallback={null}>
				{model}
			</Suspense>
			<OrbitControls autoRotate={false} />
			<Environment preset="city" />
		</Canvas>
	)
}

function GltfModel(props) {
	const { url, ...nextProps } = props
	const { scene, materials } = useGLTF(url)
	// useLayoutEffect(() => {
	// 	scene.traverse(
	// 		(obj) => obj.isMesh && (obj.receiveShadow = obj.castShadow = true)
	// 	)
	// 	applyProps(materials.default, {
	// 		color: "orange",
	// 		roughness: 0,
	// 		normalMap: new THREE.CanvasTexture(
	// 			new FlakesTexture(),
	// 			THREE.UVMapping,
	// 			THREE.RepeatWrapping,
	// 			THREE.RepeatWrapping
	// 		),
	// 		"normalMap-repeat": [40, 40],
	// 		normalScale: [0.05, 0.05],
	// 	})
	// })
	// useFrame((state) => {
  //   const t = state.clock.getElapsedTime()
  //   ref.current.rotation.x = -Math.PI / 1.75 + Math.cos(t / 4) / 8
  //   ref.current.rotation.y = Math.sin(t / 4) / 8
  //   ref.current.rotation.z = (1 + Math.sin(t / 1.5)) / 20
  //   ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10
  // })
	return <primitive object={scene} {...nextProps} />
}

function FbxModel(props) {
	const { url, ...nextProps } = props
	const fbx = useFBX(url)
	return <primitive object={fbx} {...nextProps} />
}

function ObjModel(props) {
	const { url, ...nextProps } = props
	const obj = useLoader(OBJLoader, url)
	return <primitive object={obj} {...nextProps} />
}

export default Loader
