// external
import { forwardRef, useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef(
  ({ children, buttonLabelShow, buttonLabelHide }, ref) => {
    const [visible, setVisible] = useState(false)

    const showWhenVisible = { display: visible ? '' : 'none' }
    const buttonLabel = visible ? buttonLabelHide : buttonLabelShow

    const toggleVisibility = () => {
      setVisible(!visible)
    }

    useImperativeHandle(ref, () => {
      return {
        toggleVisibility,
      }
    })

    return (
      <div>
        <div style={showWhenVisible}>{children}</div>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
    )
  }
)

Togglable.displayName = 'Togglable'
Togglable.propTypes = {
  buttonLabelShow: PropTypes.string.isRequired,
  buttonLabelHide: PropTypes.string.isRequired,
}

export default Togglable
