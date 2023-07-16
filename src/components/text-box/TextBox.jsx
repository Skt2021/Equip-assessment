import './textBox.scss';

function TextBox({
  data,
  variablesValues,
  setSelectedText,
  setTemplateContent,
}) {
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

    if (data.content) {
      const { content, variables } = data;
      modifiedText = content;

      variables.forEach((variable) => {
        const { name } = variable;
        const variableValue = variablesValues[name];

        const placeholder = `{${name}}`;
        const variableInput = `<span class="variable ${
          variableValue ? '' : 'placeholder'
        }">${variableValue ?? name}</span>`;

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
