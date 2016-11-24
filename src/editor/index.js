import React from 'react';
import {Editor, EditorState, RichUtils, Entity} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import BlockStyleControls from './controls/blockStyle';
import InlineStyleControls from './controls/inlineStyle';

export default class CustomEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      showURLInput: false,
      urlValue: ''
    };

    this.onChange = (editorState) => this.setState({ editorState }, () => {
      console.log(stateToHTML(this.state.editorState.getCurrentContent()));
    });

    // BLock and inline styles
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);

    // Links
    this.promptForLink = this._promptForLink.bind(this);
    this.onURLChange = (event) => this.setState({ urlValue: event.target.value });
    this.confirmLink = this._confirmLink.bind(this);
    this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
    this.removeLink = this._removeLink.bind(this);
  }

  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
  }

  _promptForLink(event) {
    event.preventDefault();

    const {editorState} = this.state;
    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      let url = '';

      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);

        url = linkInstance.getData().url;
      }

      this.setState({
        showURLInput: true,
        urlValue: url
      }, () => setTimeout(() => this.refs.url.focus()));
    }
  }

  _confirmLink(event) {
    event.preventDefault();

    const {editorState, urlValue} = this.state;

    // Heads up! This will break with new versions of draft-js, see this issue:
    // https://github.com/facebook/draft-js/issues/676
    // Only action needed is update this _confirmLink method with this code:
    // https://github.com/facebook/draft-js/blob/master/examples/link/link.html
    const entityKey = Entity.create('LINK', 'MUTABLE', { url: urlValue });

    this.setState({
      editorState: RichUtils.toggleLink(
        editorState,
        editorState.getSelection(),
        entityKey
      ),
      showURLInput: false,
      urlValue: ''
    }, () => setTimeout(() => this.refs.editor.focus()));
  }

  _onLinkInputKeyDown(event) {
    if (event.which === 13) {
      this._confirmLink(event);
    }
  }

  _removeLink(event) {
    event.preventDefault();

    const {editorState} = this.state;
    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null)
      });
    }
  }

  render() {
    const {editorState} = this.state;
    let urlInput;

    if (this.state.showURLInput) {
      urlInput = (
        <div>
          <input
            onChange={this.onURLChange}
            ref="url"
            type="text"
            value={this.state.urlValue}
            onKeyDown={this.onLinkInputKeyDown} />
          <button onMouseDown={this.confirmLink}>
            Confirm
          </button>
        </div>
      );
    }

    return (
      <section>
        {urlInput}

        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle} />

        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType} />

        <button onMouseDown={this.promptForLink}>
          Add Link
        </button>

        <button onMouseDown={this.removeLink}>
          Remove Link
        </button>

        <Editor
          ref="editor"
          editorState={editorState}
          onChange={this.onChange} />
      </section>
    );
  }
}
