import './textBox.scss';

function TextBox({ data, variablesData, setSelectedText, setTemplateContent }) {
  const getSelectedText = () => {
    const selection = window.getSelection();
    const selectionStart = selection.anchorOffset;
    const selectionEnd = selection.extentOffset;
    const selectedText = selection.baseNode.textContent.substring(
      selectionStart,
      selectionEnd
    );

    return selectedText.trim();
  };

  const handleChange = (e) => {
    setTemplateContent(e.target.innerHTML);
  };

  const handleSelection = () => {
    const selectedText = getSelectedText();
    if (selectedText) {
      setSelectedText(selectedText);
    }
  };

  const parseContent = () => {
    let modifiedText;

    if (data?.content) {
      const { content } = data;
      modifiedText = content;

      variablesData.forEach((variable) => {
        const placeholder = `{${variable.name}}`;
        const variableInput = `<span class="variable ${
          variable.value ? '' : 'placeholder'
        }">${variable.value ?? variable.name}</span>`;

        modifiedText = modifiedText.replace(
          new RegExp(placeholder, 'g'),
          variableInput
        );
      });
    }

    return modifiedText;
  };

  return (
    <div
      contentEditable
      className="textbox"
      onInput={handleChange}
      onMouseUpCapture={handleSelection}
      dangerouslySetInnerHTML={{ __html: parseContent() }}></div>
  );
}

export default TextBox;
