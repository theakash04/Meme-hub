import { createContext, useRef } from "react"
import { ContextComponentProps } from "../types/globalTypes"

const CanvasContext = createContext<any | null>(null)

export const CanvasProvider = ({ children }: ContextComponentProps) => {
    const canvasRef = useRef<any | null>(null)
    return (
        <CanvasContext.Provider value={canvasRef}>
            {children}
        </CanvasContext.Provider>
    )
}

export default CanvasContext
