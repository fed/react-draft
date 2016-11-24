import React from 'react';
import StyleButton from './styleButton';
import styles from '../styles.css';

const BLOCK_TYPES = [
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' }
  // { label: 'H1', style: 'header-one' },
  // { label: 'H2', style: 'header-two' },
  // { label: 'H3', style: 'header-three' },
  // { label: 'H4', style: 'header-four' },
  // { label: 'H5', style: 'header-five' },
  // { label: 'H6', style: 'header-six' },
  // { label: 'Blockquote', style: 'blockquote' },
  // { label: 'Code Block', style: 'code-block' }
];

const BlockStyleControls = ({ editorState, onToggle }) => {
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <span className={styles.controls}>
      {
        BLOCK_TYPES.map((type) =>
          <StyleButton
            key={type.label}
            active={type.style === blockType}
            label={type.label}
            onToggle={onToggle}
            style={type.style} />
        )
      }
    </span>
  );
};

BlockStyleControls.propTypes = {
  editorState: React.PropTypes.any,
  onToggle: React.PropTypes.func
};

export default BlockStyleControls;
