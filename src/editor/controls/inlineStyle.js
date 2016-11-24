import React from 'react';
import StyleButton from './styleButton';
import styles from '../styles.css';

const INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'}
  // {label: 'Underline', style: 'UNDERLINE'},
  // {label: 'Monospace', style: 'CODE'}
];

const InlineStyleControls = ({ editorState, onToggle }) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <span className={styles.controls}>
      {
        INLINE_STYLES.map((type) =>
          <StyleButton
            key={type.label}
            active={currentStyle.has(type.style)}
            label={type.label}
            onToggle={onToggle}
            style={type.style} />
        )
      }
    </span>
  );
};

InlineStyleControls.propTypes = {
  editorState: React.PropTypes.any,
  onToggle: React.PropTypes.func
};

export default InlineStyleControls;
