"use client";
import * as THREE from "three";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import React, { useEffect, useRef } from "react";

export default function ThreeTest() {
  const refContainer = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, controls;
    const container = document.getElementById("container");

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    refContainer.current && refContainer.current.appendChild(renderer.domElement);
    controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 4;

    camera.position.z = 5;

    const articleEl = document.createElement("div");
    articleEl.textContent = "testestest";
    articleEl.style.backgroundColor = "white";
    articleEl.style.color = "black";
    articleEl.style.padding = "5px";
    articleEl.style.border = "1px solid black";
    articleEl.style.borderRadius = "5px";
    const obj = new CSS3DObject(articleEl);

    scene.add(obj);

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    animate();
  }, []);

  return <div className="container" ref={refContainer}></div>;
}
