import React from "react"
import Input, { InputProps } from "../Input"

export type FormControlProps = {
    error?: string
} & InputProps


export default function FormControlInput(props: FormControlProps){

    const {
        error,
        ...rest
    } = props
    return <>
        <Input
          {...rest}
          // Deshabilitar input si el formulario está cargando
        />
        {error && (
          <p style={{ color: "red", fontSize: "13px", textAlign: "center" }}>
            {error}
          </p>
        )}
    </>
}