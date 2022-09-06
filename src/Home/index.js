import React, { useEffect, useState, useRef } from 'react'
import GridLoader from 'react-spinners/GridLoader'
import Loader from './components/Loader'
import './index.css'

const Home = () => {

  const [ parentData, setParentData ] = useState({
    scale: 0.01,
    position: {
      x: 0,
      y: 0,
      z: 0
    },
    rotate: {
      show: true,
      speed: 50000
    },
    color: '#4ea397',
    // value: 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/suzanne-high-poly/model.gltf'
    value: '/lambo.glb'
    // value: '/model.gltf'
    // value: 'watch.glb',
    // value: '/model.fbx'
    // value: '/older.fbx'
  })

  const parentIdRef = useRef()

  const onMessage = (e) => {
    const { data } = e 
    try {
      const parseData = JSON.parse(data)
      if(!parseData.id) return 
      parentIdRef.current = parseData.id 
      setParentData(prev => {
        return Object.assign({}, prev, parseData)
      })
    }catch(err) {

    }
  }

  useEffect(() => {
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [])

  return (
    <div
      className='three-model-home'
    > 
      {
        !parentData.value && (
          <GridLoader className='three-model-home-loading' color={parentData.color} />
        )
      }
      {
        !!parentData.value && (
          <Loader
            value={parentData}
          />
        )
      }
    </div>    
  )

}

export default Home 