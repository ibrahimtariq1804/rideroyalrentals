import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Color } from 'three'
import { useTheme, type Theme } from '@/context/ThemeProvider'

export const STUDIO_CLEAR: Record<Theme, string> = {
  dark: '#070708',
  light: '#e6e2da',
}

/** Keeps WebGL clear / scene background in sync with site theme. */
export function StudioBackdrop({ exposure }: { exposure?: { dark: number; light: number } } = {}) {
  const { theme } = useTheme()
  const { scene, gl } = useThree()
  const darkExp = exposure?.dark ?? 1.12
  const lightExp = exposure?.light ?? 1.02

  useEffect(() => {
    const hex = STUDIO_CLEAR[theme]
    scene.background = new Color(hex)
    gl.setClearColor(hex)
    gl.toneMappingExposure = theme === 'light' ? lightExp : darkExp
  }, [theme, scene, gl, darkExp, lightExp])

  return null
}

export function studioClearCssVar(theme: Theme) {
  return STUDIO_CLEAR[theme]
}
