import { ImagesCanvasContext } from '@twl/common/components/ImagesCanvas/ImagesCanvas';
import useBreakpoints from '@twl/common/hooks/useBreakpoints';
import useOnRender from '@twl/common/hooks/useOnRender';
import useTextureLoader from '@twl/common/hooks/useTextureLoader';
import ImagePlaneClass from '@twl/common/rendering-engine/image-plane';
import ImagePlane from 'components/ImagePlane';
import { ImagePlaneProps } from 'components/ImagePlane/ImagePlane';
import gsap from 'gsap';
import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import gooeyHoverShader from 'rendering-engine/shaders/gooey-hover.shader.glsl';
import standardVertexShader from 'rendering-engine/shaders/standard-vertex.shader.glsl';
import { ShaderMaterial, Texture, Vector2 } from 'three';

interface NavigationCardProps extends Pick<ImagePlaneProps, 'imagePlaneRef'> {
  imageSrc: string;
  effectImage: string;
  title: string;
  to: string;
}

const MAX_SCALE = 1;
const MIN_SCALE = 0.8;
const GSAP_DURATION = 0.2;

export default function NavigationCard(props: NavigationCardProps) {
  const { imageSrc, effectImage, title, to, imagePlaneRef, ...rest } = props;
  const { imagesCanvas } = useContext(ImagesCanvasContext);
  const { isDesktop } = useBreakpoints();
  const planeRef = useRef<ImagePlaneClass | undefined>();
  const uniformsRef = useRef({
    u_image: { value: undefined as Texture | undefined },
    u_imagehover: { value: undefined as Texture | undefined },
    u_time: { value: 0 },
    u_res: {
      value: new Vector2(window.innerWidth, window.innerHeight),
    },
    u_noiseSize: { value: 6 },
    u_noiseStrength: { value: 3 },
    u_timeScale: { value: 0.1 },
    u_horizontalEdge: { value: 0.7 },
    u_verticalEdge: { value: 0.0 },
    u_horizontalBlur: { value: 0.1 },
    u_verticalBlur: { value: 0 },
  });
  const imgRef = useRef<HTMLImageElement | undefined>();
  const textureLoader = useTextureLoader();

  const onResize = useCallback(() => {
    uniformsRef.current.u_res.value.set(window.innerWidth, window.innerHeight);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  useOnRender(() => {
    uniformsRef.current.u_time.value += 0.01;
  });

  const material = useMemo(() => {
    const mat = new ShaderMaterial({
      vertexShader: standardVertexShader,
      fragmentShader: gooeyHoverShader,
      uniforms: uniformsRef.current,
      defines: {
        PR: window.devicePixelRatio.toFixed(1),
      },
    });

    return mat;
  }, []);

  useEffect(() => {
    if (!imagesCanvas) return;
    textureLoader.load(imageSrc, texture => {
      uniformsRef.current.u_image.value = texture;
      // Init the texture to avoid the lag when the texture is first rendered due to the image decoding overhead.
      imagesCanvas!.renderer.initTexture(texture);
    });
    textureLoader.load(effectImage, texture => {
      material.uniforms.u_imagehover.value = texture;
      imagesCanvas!.renderer.initTexture(texture);
    });
  }, [textureLoader, material, effectImage, imageSrc, imagesCanvas]);

  function onRef(element: HTMLImageElement) {
    imgRef.current = element;
    onResize();
  }

  function onMouseEnterHandler() {
    const hoveredImage = planeRef.current;
    if (!hoveredImage) return;

    gsap.to(hoveredImage.scale, {
      x: MIN_SCALE,
      y: MIN_SCALE,
      duration: GSAP_DURATION,
    });
  }

  function onMouseLeaveHandler() {
    const hoveredImage = planeRef.current;
    if (!hoveredImage) return;
    gsap.to(hoveredImage.scale, {
      x: MAX_SCALE,
      y: MAX_SCALE,
      duration: GSAP_DURATION,
    });
  }

  function imagePlaneRefHandler(plane: ImagePlaneClass) {
    planeRef.current = plane;
    if (imagePlaneRef) {
      imagePlaneRef(plane);
    }
  }

  return (
    <div onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
      <ImagePlane
        {...rest}
        className="h-[740px] w-[740px] max-w-[50vw] max-h-[50vw] min-w-[300px] min-h-[300px] flex-shrink-0 mx-10 relative"
        imagePlaneRef={imagePlaneRefHandler}
        configs={{ material }}>
        <img ref={onRef} className="h-[100%] w-[100%] opacity-0" alt="" src={imageSrc} />
        <div className="flex flex-col absolute bottom-10 md:left-[40%] lg:left-[10%] xl:left-[35%] w-full md:w-max items-end sm:items-center  ">
          <Link to={to} className="z-10 cursor-pointer">
            <div className="flex flex-col content-start pointer-events-auto">
              {isDesktop ? <h2>{title}</h2> : <h3>{title}</h3>}
              <div className="body sm:button">_enter</div>
            </div>
          </Link>
        </div>
      </ImagePlane>
    </div>
  );
}
