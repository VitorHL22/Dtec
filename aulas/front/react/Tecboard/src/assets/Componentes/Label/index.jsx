import "../Label/Label.css"

export function Label ({children, htmlFor}) {
  return(
    <label htmlFor={htmlFor}>
    {children}
    </label>
  )
}