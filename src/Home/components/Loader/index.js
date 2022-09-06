import { useRef, useLayoutEffect, Suspense, useMemo, useCallback } from "react"
import { Canvas, applyProps, useLoader, useFrame } from "@react-three/fiber"
import {
	OrbitControls,
	Environment,
	useGLTF,
	useFBX
} from "@react-three/drei"
import { OBJLoader } from "three-stdlib"
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
	const { value: modelUrl, ...nextValues } = value

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
		const { position={x: 0, y: 0, z: 0}, ...nextConfig } = nextValues
		const commonProps = {
			url: modelUrl,
			onClick,
			objectType,
			...nextConfig,
			position: [position.x, position.y, position.z],
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
			default:
				return null 
		}
	}, [objectType, modelUrl, onClick, nextValues])

	return (
		<Canvas shadows camera={{ position: [8, 1.5, 8], fov: 25 }}>
			<ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[512, 512]} castShadow />
			<Suspense fallback={null}>
				{model}
			</Suspense>
			<OrbitControls autoRotate={false} />
			<Environment preset="city" />
		</Canvas>
	)
}

function GltfModel(props) {
	const { url, objectType, rotate, ...nextProps } = props
	const { scene, materials } = useGLTF(url)

	const ref = useRef()
	const prevTimeRef = useRef(-1)

	// x度/ms
	const speed = useMemo(() => {
		if(!rotate.show) return -1 
		return Math.PI * 2 / rotate.speed
	}, [rotate])

	useLayoutEffect(() => {
		scene.traverse(
			(obj) => obj.isMesh && (obj.receiveShadow = obj.castShadow = true)
		)
	
		if(objectType === 'gltf') {
			applyProps(materials.default, {
				// color: "orange",
				// roughness: 0,
				// normalMap: new THREE.CanvasTexture(
				// 	new FlakesTexture(),
				// 	THREE.UVMapping,
				// 	THREE.RepeatWrapping,
				// 	THREE.RepeatWrapping
				// ),
				// "normalMap-repeat": [40, 40],
				// normalScale: [0.05, 0.05],
			})
		}else {
			// applyProps(materials.watch, {
			// 	color: '#ff0'
			// })
		}
	})

	useFrame((state) => {
    const time = state.clock.getElapsedTime()
		if(!!~prevTimeRef.current) {
			const cal = time * 1000 - prevTimeRef.current * 1000 
			const newRotate = ref.current.rotation.y + speed * cal
			ref.current.rotation.y = newRotate % (Math.PI * 2) 
		}
		prevTimeRef.current = time 
  })

	return <primitive ref={ref} object={scene} {...nextProps} />
}

function FbxModel(props) {
	const { url, objectType, ...nextProps } = props
	const fbx = useFBX(url)

	useLayoutEffect(() => {
		fbx.traverse(
			(obj) => obj.isMesh && (obj.receiveShadow = obj.castShadow = true)
		)
	})
	return <primitive object={fbx} {...nextProps} />
}

function ObjModel(props) {
	const { url, objectType, ...nextProps } = props
	const obj = useLoader(OBJLoader, url)
	return <primitive object={obj} {...nextProps} />
}

export default Loader
