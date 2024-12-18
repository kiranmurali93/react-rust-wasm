import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";

const ShaderTab = () => {
    const backendURL = import.meta.env.VITE__APP_BACKEND_URL;
    const [prompt, setPrompt] = useState("");
    const [shaderCode, setShaderCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setShaderCode("");

        try {
            const response = await fetch(`${backendURL}generate-shader`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description: prompt }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log(data?.shader_code);

            const { 
                vertex_shader: vertexShader,
                fragment_shader: fragmentShader,
                shape 
            } = data?.shader_code

            if (vertexShader && fragmentShader) {
                setShaderCode(
                    `Vertex Shader:\n${vertexShader?.object}\n\nFragment Shader:\n${fragmentShader?.object}`
                );
                createShaderScene(vertexShader, fragmentShader, shape);
            } else {
                setErrorMessage("Shader code could not be parsed.");
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage(`Failed to generate shader: ${error.message}`);
        }
    };


    const createShaderScene = (vertexShader, fragmentShader, shapeType = "cube") => {
        // Cleanup previous scene
        if (sceneRef.current) {
            while (sceneRef.current.children.length > 0) {
                sceneRef.current.remove(sceneRef.current.children[0]);
            }
        }
        if (rendererRef.current) {
            rendererRef.current.dispose();
        }

        // Initialize scene, camera, renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            canvasRef.current.width / canvasRef.current.height,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(canvasRef.current.width, canvasRef.current.height);

        // Background Gradient Plane
        const bgGeometry = new THREE.PlaneGeometry(2, 2);
        const bgMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader?.background,
            fragmentShader: fragmentShader?.background,
            depthWrite: false,
            depthTest: false,
        });
        const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
        bgMesh.renderOrder = -1; // Render background first
        scene.add(bgMesh);

        // Shader Material for the Main Shape
        const shapeMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader?.object,
            fragmentShader: fragmentShader?.object,
            uniforms: { time: { value: 0.0 } },
        });

        // Geometry Selection Logic
        let geometry;
        switch (shapeType) {
            case "cube":
                geometry = new THREE.BoxGeometry(1, 1, 1);
                break;
            case "sphere":
                geometry = new THREE.SphereGeometry(0.75, 32, 32);
                break;
            case "torus":
                geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
                break;
            default:
                geometry = new THREE.BoxGeometry(1, 1, 1);
        }

        const mesh = new THREE.Mesh(geometry, shapeMaterial);
        scene.add(mesh);

        camera.position.z = 3;

        // Animate the Scene
        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate the mesh
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;

            // Update uniform time
            shapeMaterial.uniforms.time.value = clock.getElapsedTime();

            renderer.render(scene, camera);
        };
        animate();

        // Store for cleanup
        sceneRef.current = scene;
        rendererRef.current = renderer;
    };




    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (sceneRef.current) sceneRef.current.dispose();
            if (rendererRef.current) rendererRef.current.dispose();
        };
    }, []);

    return (
        <div>
            <h2>Text-to-Shader Generator</h2>
            <form onSubmit={handleSubmit} >
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the shader you want to create"
                />
                <button
                    type="submit"
                >
                    Generate Shader
                </button>
            </form>

            {errorMessage && (
                <div >
                    {errorMessage}
                </div>
            )}

            <canvas
                ref={canvasRef}
                width={400}
                height={400}
            />

            {shaderCode && (
                <div>
                    <h3>Generated Shader Code:</h3>
                    <pre >
                        {shaderCode}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default ShaderTab;
