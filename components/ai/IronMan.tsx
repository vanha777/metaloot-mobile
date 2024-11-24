/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 IronMan.glb
*/

import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { Group, SkinnedMesh, Object3D, Material } from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    mixamorigHips: Object3D;
    Arc_Reactor: SkinnedMesh;
    Glass: SkinnedMesh;
    Gold: SkinnedMesh;
    Lights: SkinnedMesh;
    Red: SkinnedMesh;
    Silver: SkinnedMesh;
  };
  materials: {
    'Arc Reactor': Material;
    Glass: Material;
    'Gold Part': Material;
    Lights: Material;
    'Red Part': Material;
    'Silver Part': Material;
  };
};

interface ModelProps {
  userInteract?: string;
  botState: string;
  actions?: string[];
}

export default function IronManModel(props: ModelProps) {
  const group = useRef<Group>(null);
  const { nodes, materials, animations } = useGLTF('/IronMan.glb') as GLTFResult;
  const { actions: animationActions } = useAnimations(animations, group);

  // set actions and pose when user interact
  useEffect(() => {
    const availableActions = props.actions?.map(actionName => animationActions[actionName])
      .filter(action => action !== null) || [];

    let currentTimeout: NodeJS.Timeout;

    const playRandomAction = () => {
      // Fade out current action if any
      availableActions.forEach(action => action?.fadeOut(0.5));
      
      // Pick and play random action
      const randomAction = availableActions[Math.floor(Math.random() * availableActions.length)];
      randomAction?.reset().fadeIn(0.5).play();

      // Schedule next action
      const randomDuration = Math.floor(Math.random() * 2000) + 6000; // Random 3-5 seconds
      currentTimeout = setTimeout(playRandomAction, randomDuration);
    };

    // Start the cycle
    playRandomAction();

    // Cleanup
    return () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
      availableActions.forEach(action => action?.fadeOut(0.5));
    };
  }, [props.actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Stand" rotation={[Math.PI / 2, 0, 0]} scale={0.25}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh name="Arc_Reactor" geometry={nodes.Arc_Reactor.geometry} material={materials['Arc Reactor']} skeleton={nodes.Arc_Reactor.skeleton} />
          <skinnedMesh name="Glass" geometry={nodes.Glass.geometry} material={materials.Glass} skeleton={nodes.Glass.skeleton} />
          <skinnedMesh name="Gold" geometry={nodes.Gold.geometry} material={materials['Gold Part']} skeleton={nodes.Gold.skeleton} />
          <skinnedMesh name="Lights" geometry={nodes.Lights.geometry} material={materials.Lights} skeleton={nodes.Lights.skeleton} />
          <skinnedMesh name="Red" geometry={nodes.Red.geometry} material={materials['Red Part']} skeleton={nodes.Red.skeleton} />
          <skinnedMesh name="Silver" geometry={nodes.Silver.geometry} material={materials['Silver Part']} skeleton={nodes.Silver.skeleton} />
        </group>
      </group>
    </group>
  );
}

// useGLTF.preload('/IronMan.glb');
useGLTF.preload('/IronMan.glb');